import { SignUp } from "@clerk/nextjs";
import { isClerkConfiguredKey } from "@/lib/auth-helpers";
import Link from "next/link";
import { KeyRound, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const isClerkValid = isClerkConfiguredKey();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full flex justify-center">
        {isClerkValid ? (
          <SignUp signInUrl="/sign-in" />
        ) : (
          <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900 shadow-lg text-center space-y-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Clerk Authentication Setup</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                Add your real Clerk keys to <code className="font-mono font-semibold bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">.env</code> to activate live user registration.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20"
            >
              <span>Explore Dashboard (Demo Mode)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
