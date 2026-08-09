"use server";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createCheckoutSession() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress || "";

  let customerId: string | undefined;

  // Retrieve user by clerkUserId
  let dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { subscription: true },
  });

  if (!dbUser) {
    // Create customer in Stripe
    const customer = await stripe.customers.create({
      email,
      name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || undefined,
      metadata: { clerkUserId: userId },
    });
    customerId = customer.id;

    // Create user record in DB
    dbUser = await prisma.user.create({
      data: {
        clerkUserId: userId,
        email,
        name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || undefined,
        stripeCustomerId: customerId,
      },
      include: { subscription: true },
    });

    // Log the user registration action
    await prisma.auditLog.create({
      data: {
        userId: dbUser.id,
        action: "USER_REGISTERED",
        details: "User registered via clerk authentication.",
      },
    });
  } else {
    customerId = dbUser.stripeCustomerId || undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        name: dbUser.name || undefined,
        metadata: { clerkUserId: userId },
      });
      customerId = customer.id;
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: { stripeCustomerId: customerId },
        include: { subscription: true },
      });
    }
  }

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
  if (!priceId) {
    throw new Error("NEXT_PUBLIC_STRIPE_PRO_PRICE_ID is not configured in environment variables.");
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/#pricing`,
    client_reference_id: userId,
    metadata: {
      userId,
    },
  });

  if (session.url) {
    redirect(session.url);
  } else {
    throw new Error("Failed to generate stripe checkout session url.");
  }
}

export async function createCustomerPortalSession() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { subscription: true },
  });

  if (!dbUser || !dbUser.stripeCustomerId) {
    redirect("/dashboard?error=no_subscription");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings`,
  });

  if (portalSession.url) {
    redirect(portalSession.url);
  } else {
    throw new Error("Failed to generate customer portal session url.");
  }
}
