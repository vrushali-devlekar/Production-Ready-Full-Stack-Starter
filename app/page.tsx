import Link from "next/link";
import { Sparkles, Check, ArrowRight, Zap, Shield, BarChart3, Users, RefreshCw } from "lucide-react";
import { createCheckoutSession } from "@/app/actions/stripe";

export default function Home() {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Blazing Fast Performance",
      description: "Optimized with Next.js 16 server-side components for sub-second page loads and fluid navigation.",
    },
    {
      icon: <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Secure Authentication",
      description: "Out-of-the-box user login, registration, and session management powered by Clerk.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Stripe Billing & Portal",
      description: "Accept subscriptions, handle trial periods, and let users manage billing portals natively.",
    },
    {
      icon: <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Multi-tenant Ready",
      description: "Architected to support isolated user spaces, team invites, and roles from the ground up.",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for exploring and building side projects.",
      features: [
        "Up to 3 active projects",
        "Community support",
        "Basic analytics",
        "Clerk authentication",
      ],
      ctaText: "Get Started for Free",
      action: null,
      href: "/dashboard",
      popular: false,
    },
    {
      name: "Pro Plan",
      price: "$29",
      period: "/month",
      description: "Everything you need to run and scale your business.",
      features: [
        "Unlimited projects",
        "Priority 24/7 support",
        "Advanced user analytics",
        "Stripe billing customer portal",
        "Custom domain support",
      ],
      ctaText: "Upgrade to Pro",
      action: createCheckoutSession,
      href: null,
      popular: true,
    },
  ];

  const faqs = [
    {
      q: "What is included in the boilerplate?",
      a: "You get a pre-configured Next.js 16 repository with Clerk authentication, Stripe billing integration, Prisma ORM with SQLite, a responsive dashboard, and tailwind variables for easy branding.",
    },
    {
      q: "How do I configure Stripe webhooks?",
      a: "You can use the Stripe CLI to forward events: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`. The webhook endpoint handles automatic creation/updates of subscriptions in the DB.",
    },
    {
      q: "Is it easy to switch databases?",
      a: "Yes! Since the boilerplate uses Prisma, you can switch from SQLite to PostgreSQL, MySQL, or MongoDB simply by modifying the provider in `schema.prisma` and changing the `DATABASE_URL` in `.env`.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/70 via-white to-white dark:from-zinc-900/50 dark:via-zinc-950 dark:to-zinc-950">
        {/* Abstract background blur */}
        <div className="absolute top-0 right-1/4 h-[400px] w-[600px] -translate-y-1/2 rounded-full bg-indigo-400/20 blur-[120px] dark:bg-indigo-900/10 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 h-[300px] w-[500px] rounded-full bg-violet-400/10 blur-[100px] dark:bg-violet-900/5 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-950/40 dark:text-indigo-400 shadow-sm shadow-indigo-100 dark:shadow-none mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next.js 16 Boilerplate is live</span>
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-zinc-900 dark:text-zinc-50">
            Build and Ship your SaaS
            <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              in hours, not weeks
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg sm:text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
            Save dozens of hours of setup. Everything you need: Authentication, Subscriptions, Database integration, and beautiful components out-of-the-box.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-8 py-3.5 text-base font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850 transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-200/50 dark:border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Equipped with everything you need
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-zinc-600 dark:text-zinc-400">
              Focus on building your core features, not rewriting plumbing. We've done the boilerplate work for you.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
            {features.map((feature, idx) => (
              <div key={idx} className="flex gap-4 p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-zinc-600 dark:text-zinc-400">
              Start building for free, upgrade to unlock unlimited projects and advanced telemetry.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2 items-stretch">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col justify-between rounded-3xl p-8 bg-white dark:bg-zinc-950 border ${
                  plan.popular
                    ? "border-indigo-600 ring-1 ring-indigo-600/50 dark:border-indigo-500 shadow-md shadow-indigo-100 dark:shadow-none"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white dark:bg-indigo-500">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">{plan.price}</span>
                    {plan.period && <span className="ml-1 text-zinc-500">{plan.period}</span>}
                  </div>
                  <p className="mt-3 text-sm text-zinc-500">{plan.description}</p>
                  <hr className="my-6 border-zinc-200 dark:border-zinc-800" />
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                        <Check className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  {plan.action ? (
                    <form action={plan.action}>
                      <button
                        type="submit"
                        className="cursor-pointer w-full inline-flex justify-center rounded-full bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20"
                      >
                        {plan.ctaText}
                      </button>
                    </form>
                  ) : (
                    <Link
                      href={plan.href || "/dashboard"}
                      className="w-full inline-flex justify-center rounded-full border border-zinc-300 bg-white px-4 py-3 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-750 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850 transition-all"
                    >
                      {plan.ctaText}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-200/50 dark:border-zinc-800/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-zinc-600 dark:text-zinc-400">
              Everything you need to know about setting up and deploying.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 shadow-xs">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {faq.q}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-white">
              <Sparkles className="h-3 w-3" />
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-50">SaaSify</span>
          </div>
          <p className="text-xs text-zinc-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} SaaSify. All rights reserved. Built with Next.js 16, Clerk, Stripe, and Prisma.
          </p>
        </div>
      </footer>
    </div>
  );
}
