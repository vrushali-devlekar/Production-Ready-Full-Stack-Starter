import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { isClerkConfiguredKey } from "@/lib/auth-helpers";

// Define pages that require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/settings(.*)",
]);

export function proxy(req: any, ev: any) {
  if (!isClerkConfiguredKey()) {
    return;
  }
  return clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  })(req, ev);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
