import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("WARNING: STRIPE_SECRET_KEY is not defined in environment variables.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.preview" as any, // fallback or cast to avoid typescript mismatch on strict versions
  typescript: true,
});

export default stripe;
