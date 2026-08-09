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
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const userEmail = checkoutSession.customer_details?.email || "";
      const userName = checkoutSession.customer_details?.name || "";

      // Ensure user exists in our DB
      await prisma.user.upsert({
        where: { id: userId },
        update: {
          email: userEmail,
          name: userName || undefined,
        },
        create: {
          id: userId,
          email: userEmail,
          name: userName || undefined,
        },
      });

      // Update or create subscription details
      await prisma.subscription.upsert({
        where: { userId },
        update: {
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: customerId,
          stripePriceId: subscription.items.data[0].price.id,
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
        create: {
          userId,
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: customerId,
          stripePriceId: subscription.items.data[0].price.id,
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: subscription.status,
        },
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    console.error(`Database sync error in webhook: ${error.message}`);
    return new NextResponse(`Webhook Handler DB Error: ${error.message}`, { status: 500 });
  }
}
