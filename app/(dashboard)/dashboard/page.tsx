import { getAuthUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Sparkles, CreditCard, Layers, Zap, Calendar, TrendingUp, ShieldAlert, CheckCircle, Info } from "lucide-react";
import { createCheckoutSession } from "@/app/actions/stripe";

export default async function DashboardPage() {
  const { userId, user, isDemo } = await getAuthUser();
  
  if (!userId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-zinc-500">Redirecting...</p>
      </div>
    );
  }

  // Retrieve user and their subscription from DB using clerkUserId safely
  let dbUser = null;
  try {
    dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { subscription: true },
    });
  } catch (err) {
    console.warn("Database user lookup skipped or uninitialized:", err);
  }

  const subscription = dbUser?.subscription;
  const isPro = subscription?.status === "active";
  const currentPlan = isPro ? "Pro Plan" : "Free Plan";
  const expiryDate = subscription?.stripeCurrentPeriodEnd
    ? new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // Mock dashboard analytics data
  const metrics = [
    {
      title: "API Invocations",
      value: isPro ? "84,291 / Unlimited" : "854 / 1,000",
      description: "API queries executed this month",
      percentage: isPro ? 100 : 85,
    },
    {
      title: "Active Projects",
      value: isPro ? "12 Active" : "1 / 3 Projects",
      description: "Projects connected to deployment",
      percentage: isPro ? 100 : 33,
    },
    {
      title: "Team Members",
      value: isPro ? "5 Seats occupied" : "1 Seat (Free)",
      description: "Active workspace collaborators",
      percentage: isPro ? 100 : 20,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {isDemo && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          <Info className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <span className="font-semibold">Demo Preview Mode:</span> Clerk publishable key in <code className="font-mono font-bold bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded">.env</code> is using a placeholder. You are viewing the live frontend dashboard preview!
          </div>
        </div>
      )}

      {/* Header */}
      <div className="md:flex md:items-center md:justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-zinc-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-zinc-50">
            Welcome back, {user?.firstName || "Developer"} 👋
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your workspace integration, subscriptions, and metrics.
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Quick Stats / Metrics */}
        <div className="space-y-8 lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {metrics.map((metric, idx) => (
              <div key={idx} className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 shadow-xs">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{metric.title}</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{metric.value}</p>
                <p className="mt-1 text-xs text-zinc-400">{metric.description}</p>
                <div className="mt-4 h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-2 rounded-full bg-indigo-600 dark:bg-indigo-500"
                    style={{ width: `${Math.min(metric.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Quick Chart Simulation widget */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 shadow-xs sm:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">Usage Analytics</p>
                  <p className="mt-1 text-xs text-zinc-400">Queries completed in the last 7 days</p>
                </div>
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="mt-6 flex h-24 items-end justify-between gap-2 px-2">
                {[40, 25, 60, 45, 80, 55, 95].map((h, i) => (
                  <div key={i} className="group relative w-full">
                    <div
                      className="w-full rounded-t bg-indigo-500/80 hover:bg-indigo-600 transition-all dark:bg-indigo-600/70 dark:hover:bg-indigo-500"
                      style={{ height: `${h}%` }}
                    />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-zinc-400">
                      {["M", "T", "W", "T", "F", "S", "S"][i]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Plan Details / Call to Action */}
        <div className="space-y-8">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Subscription Status</h3>
            <p className="mt-1 text-xs text-zinc-500">Billing details and membership details.</p>

            <div className="mt-6 flex items-center gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{currentPlan}</p>
                <p className="text-xs text-zinc-500 capitalize">Status: {subscription?.status || "None"}</p>
              </div>
            </div>

            {isPro && expiryDate ? (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>Your account is fully upgraded</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Calendar className="h-4 w-4" />
                  <span>Period ends on {expiryDate}</span>
                </div>
                <hr className="border-zinc-200 dark:border-zinc-800" />
                <Link
                  href="/settings"
                  className="block w-full text-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850 transition-colors"
                >
                  Manage Subscription
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="h-4.5 w-4.5" />
                  <span>Using free features tier limits</span>
                </div>
                <hr className="border-zinc-200 dark:border-zinc-800" />
                <p className="text-xs leading-relaxed text-zinc-500">
                  Upgrade to Pro to unlock unlimited projects, team seats, advanced usage diagnostics, and database syncing.
                </p>
                <form action={createCheckoutSession} className="w-full">
                  <button
                    type="submit"
                    className="cursor-pointer w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <Zap className="h-4 w-4 fill-white" />
                    Upgrade to Pro ($29/mo)
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Quick links / Documentation Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 shadow-xs">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Quick Reference Links</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="/settings"
                  className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Update account settings
                </a>
              </li>
              <li>
                <a
                  href="https://dashboard.stripe.com/test/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Stripe Test Dashboard
                </a>
              </li>
              <li>
                <a
                  href="https://dashboard.clerk.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Clerk Auth Console
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
