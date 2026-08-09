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

  // Check if we already have a customer record for this user in Prisma
  const existingSub = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (existingSub?.stripeCustomerId) {
    customerId = existingSub.stripeCustomerId;
  } else {
    // Create stripe customer if not exists
    const customer = await stripe.customers.create({
      email,
      name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || undefined,
      metadata: { userId },
    });
    customerId = customer.id;
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

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription || !subscription.stripeCustomerId) {
    redirect("/dashboard?error=no_subscription");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings`,
  });

  if (portalSession.url) {
    redirect(portalSession.url);
  } else {
    throw new Error("Failed to generate customer portal session url.");
  }
}
