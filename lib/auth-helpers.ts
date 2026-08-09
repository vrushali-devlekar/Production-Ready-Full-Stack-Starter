import { auth, currentUser } from "@clerk/nextjs/server";

export function isClerkConfiguredKey(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key || key.includes("xxxxxxxxxxxxxxxxxxxxxxxxxx") || key === "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx") {
    return false;
  }
  return true;
}

export async function getAuthUser() {
  if (!isClerkConfiguredKey()) {
    return {
      userId: "demo_user_123",
      user: {
        id: "demo_user_123",
        firstName: "Demo",
        lastName: "Developer",
        emailAddresses: [{ emailAddress: "demo@example.com" }],
        imageUrl: null,
      },
      isDemo: true,
    };
  }

  try {
    const { userId } = await auth();
    if (!userId) {
      return { userId: null, user: null, isDemo: false };
    }
    const user = await currentUser();
    return { userId, user, isDemo: false };
  } catch (error) {
    console.warn("Clerk auth failed, falling back to demo user:", error);
    return {
      userId: "demo_user_123",
      user: {
        id: "demo_user_123",
        firstName: "Demo",
        lastName: "Developer",
        emailAddresses: [{ emailAddress: "demo@example.com" }],
        imageUrl: null,
      },
      isDemo: true,
    };
  }
}
