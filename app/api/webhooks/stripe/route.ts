import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  if (!signature) {
    return new NextResponse("Missing Stripe Signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const userId = checkoutSession.client_reference_id || checkoutSession.metadata?.userId;
      const customerId = checkoutSession.customer as string;
      const subscriptionId = checkoutSession.subscription as string;

      if (!userId) {
        return new NextResponse("User ID missing from checkout session", { status: 400 });
      }

      // Retrieve subscription details from Stripe
      const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as any;

      const userEmail = checkoutSession.customer_details?.email || "";
      const userName = checkoutSession.customer_details?.name || "";

      // Ensure user exists in our DB (look up by clerkUserId)
      const user = await prisma.user.upsert({
        where: { clerkUserId: userId },
        update: {
          email: userEmail,
          name: userName || undefined,
          stripeCustomerId: customerId,
        },
        create: {
          clerkUserId: userId,
          email: userEmail,
          name: userName || undefined,
          stripeCustomerId: customerId,
        },
      });

      // Update or create subscription details linked to user.id
      await prisma.subscription.upsert({
        where: { userId: user.id },
        update: {
          stripeSubscriptionId: subscriptionId,
          stripePriceId: subscription.items.data[0].price.id,
          status: subscription.status,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
        create: {
          userId: user.id,
          stripeSubscriptionId: subscriptionId,
          stripePriceId: subscription.items.data[0].price.id,
          status: subscription.status,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });

      // Add audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "SUBSCRIPTION_CREATED",
          details: `Stripe checkout completed. Subscription ID: ${subscriptionId}`,
        },
      });
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as any;
      
      const dbSubscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subscription.id },
      });

      if (dbSubscription) {
        await prisma.subscription.update({
          where: { id: dbSubscription.id },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            status: subscription.status,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });

        // Add audit log
        await prisma.auditLog.create({
          data: {
            userId: dbSubscription.userId,
            action: "SUBSCRIPTION_UPDATED",
            details: `Subscription status updated to: ${subscription.status}`,
          },
        });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as any;

      const dbSubscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subscription.id },
      });

      if (dbSubscription) {
        await prisma.subscription.update({
          where: { id: dbSubscription.id },
          data: {
            status: subscription.status,
          },
        });

        // Add audit log
        await prisma.auditLog.create({
          data: {
            userId: dbSubscription.userId,
            action: "SUBSCRIPTION_DELETED",
            details: `Subscription status changed to: ${subscription.status}`,
          },
        });
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    console.error(`Database sync error in webhook: ${error.message}`);
    return new NextResponse(`Webhook Handler DB Error: ${error.message}`, { status: 500 });
  }
}
