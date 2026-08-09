import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createCustomerPortalSession, createCheckoutSession } from "@/app/actions/stripe";
import { CreditCard, Shield, User, ExternalLink, Zap, Mail, Calendar } from "lucide-react";

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-zinc-500">Redirecting...</p>
      </div>
    );
  }

  const user = await currentUser();

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const isPro = subscription?.status === "active";
  const currentPlan = isPro ? "Pro Plan" : "Free Plan";
  const expiryDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h2 className="text-2xl font-bold leading-7 text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          Account Settings
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your personal details, subscription plan, and billing history.
        </p>
      </div>

      <div className="mt-8 space-y-10">
        {/* Profile Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 shadow-xs">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-900">
            <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Profile Information</h3>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {user?.imageUrl && (
              <img
                src={user.imageUrl}
                alt="Profile Avatar"
                className="h-16 w-16 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover"
              />
            )}
            <div className="space-y-2 flex-1 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-semibold text-zinc-400 uppercase">First Name</span>
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{user?.firstName || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-zinc-400 uppercase">Last Name</span>
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{user?.lastName || "N/A"}</span>
                </div>
              </div>
              <div className="pt-2">
                <span className="block text-xs font-semibold text-zinc-400 uppercase">Email Address</span>
                <div className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  <span>{user?.emailAddresses[0]?.emailAddress || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 shadow-xs">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-900">
            <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Subscription & Billing</h3>
          </div>
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase">Current Membership Plan</p>
                <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">{currentPlan}</p>
                {isPro && expiryDate && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Renews on {expiryDate}</span>
                  </p>
                )}
              </div>
              <div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isPro
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
                }`}>
                  {isPro ? "Active" : "Free Tier"}
                </span>
              </div>
            </div>

            {isPro ? (
              <div className="space-y-4">
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Your billing, payment methods, invoices, and billing history are securely handled by Stripe. Clicking the button below opens Stripe's Customer Portal in a new tab.
                </p>
                <form action={createCustomerPortalSession}>
                  <button
                    type="submit"
                    className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors shadow-sm"
                  >
                    <span>Manage Stripe Billing</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-zinc-500 leading-relaxed">
                  You are currently on the Free plan. Upgrade to the Pro Plan to sync subscriptions, unlock unlimited projects, and get professional billing receipts.
                </p>
                <form action={createCheckoutSession}>
                  <button
                    type="submit"
                    className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <Zap className="h-4 w-4 fill-white" />
                    <span>Upgrade to Pro ($29/month)</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Security / System settings */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 shadow-xs">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-900">
            <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Security Settings</h3>
          </div>
          <div className="mt-6">
            <p className="text-sm text-zinc-500 leading-relaxed">
              Your login credentials, security keys, and active sessions are managed securely by Clerk.
            </p>
            <div className="mt-4">
              <a
                href="https://accounts.clerk.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <span>Edit Account in Clerk Profile Console</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
