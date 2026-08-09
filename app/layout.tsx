import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaSify - Premium Next.js SaaS Boilerplate",
  description: "Build, launch, and monetize your SaaS in record time with Next.js, Clerk, Prisma, and Stripe.",
};

import { isClerkConfiguredKey } from "@/lib/auth-helpers";

export default function RootLayout({ children }: LayoutProps<"/">) {
  const isClerkValid = isClerkConfiguredKey();

  const layoutContent = (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 selection:bg-indigo-500 selection:text-white">
        <Providers>
          <Navbar />
          <main className="flex flex-col flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );

  if (isClerkValid) {
    return <ClerkProvider>{layoutContent}</ClerkProvider>;
  }

  return layoutContent;
}
