"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Sparkles, LayoutDashboard, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span>SaaSify</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
              Pricing
            </Link>
            <SignedIn>
              <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/settings" className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </SignedIn>
          </nav>

          {/* Authentication & Profile */}
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="cursor-pointer text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <Link href="/sign-up" className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all shadow-sm">
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-950">
          <div className="space-y-1 px-4 py-3 sm:px-6">
            <Link
              href="/#features"
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              Pricing
            </Link>
            <SignedIn>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              >
                Dashboard
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              >
                Settings
              </Link>
            </SignedIn>
            <div className="border-t border-zinc-100 pt-4 pb-2 dark:border-zinc-800 flex flex-col gap-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full text-left rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50">
                    Sign In
                  </button>
                </SignInButton>
                <Link
                  href="/sign-up"
                  onClick={() => setIsOpen(false)}
                  className="block text-center rounded-md bg-zinc-900 px-3 py-2 text-base font-medium text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Get Started
                </Link>
              </SignedOut>
              <SignedIn>
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-500">Account</span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
