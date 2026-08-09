# SaaSify — Production-Ready Next.js SaaS Boilerplate

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.9-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6c47ff?style=flat-square)](https://clerk.dev/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-008fc7?style=flat-square&logo=stripe)](https://stripe.com/)

**SaaSify** is a premium, developer-first Full-Stack SaaS Starter Template. Designed for maximum developer experience (DX), speed, and production scalability. It comes pre-configured with all key requirements for building, launching, and monetizing your software product.

---

## 🚀 Key Features

*   **Authentication & Session Management:** Integrated secure user identity and login flows via [Clerk](https://clerk.com/) (Sign-in, Sign-up, User Profile, and Protected Routes Middleware).
*   **Database & Migration Layer:** Structured PostgreSQL database models using [Prisma ORM 7](https://www.prisma.io/) featuring pre-built schemas for `User`, `Subscription`, and `AuditLog` security trails.
*   **Stripe Monetization:** Integrated checkout sessions for subscription tiers, customer portals for billing management, and raw webhook handling to sync statuses.
*   **Modern Premium UI:** Tailwind CSS v4, Lucide Icons, and responsive light/dark themes.
*   **State & Query Cache:** Pre-installed TanStack Query (React Query) and Server Actions for high-performance data fetching and caching.
*   **Validation:** End-to-end type safety using Zod for API routes, search params, and server actions.

---

## 📂 Project Directory Structure

```text
├── app/                    # Next.js App Router root
│   ├── (auth)/             # Authentication views (Login / Register pages via Clerk)
│   ├── (dashboard)/        # Protected SaaS layout & user portal
│   │   ├── dashboard/      # Primary analytics user dashboard
│   │   └── settings/       # User profiles & Stripe billing portal management
│   ├── actions/            # Server Actions (Stripe Checkout & Billing Portal redirection)
│   ├── api/
│   │   └── webhooks/
│   │       └── stripe/     # Stripe Webhooks route for subscription state syncs
│   ├── layout.tsx          # Root Layout (ClerkProvider wrapper + shared Navbar)
│   └── page.tsx            # Public Landing Page & Pricing cards
├── components/
│   ├── ui/                 # Reusable layout UI components
│   └── navbar.tsx          # Glassmorphic global navigation bar
├── lib/
│   ├── prisma.ts           # Prisma client singleton (PostgreSQL pg-adapter)
│   ├── stripe.ts           # Stripe client setup helper
│   └── utils.ts            # Dynamic class merger (cn helper)
├── prisma/
│   ├── schema.prisma       # Database schema models (User, Subscription, AuditLog)
│   └── dev.db              # Local SQLite database (if toggled)
├── .env.example            # Environment variables placeholder
├── prisma.config.ts        # Prisma 7 global configuration mapping
└── README.md
```

---

## 🛠️ Getting Started

### 1. Prerequisites
Ensure you have **Node.js v20.x+** and **npm** installed.

### 2. Install Dependencies
Clone the repository and install packages:
```bash
npm install
```

### 3. Setup Environment Variables
Duplicate `.env.example` as `.env` and fill in your keys:
```bash
cp .env.example .env
```

### 4. Database Setup & Migrations
Ensure your database is running (PostgreSQL or SQLite), then run:
```bash
# Push database schema to database & generate Prisma client types
npx prisma db push
```

### 5. Running the Dev Server
Launch the local server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your SaaS landing page.

---

## 💳 Stripe Webhook Testing
To sync subscriptions locally, use the Stripe CLI to listen for events:
```bash
# Login to Stripe CLI
stripe login

# Forward events to your local API route
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copy the webhook signing secret returned (starts with `whsec_`) and paste it as `STRIPE_WEBHOOK_SECRET` in your `.env` file.

---

## ⚡ Deployment to Vercel

Deploy your SaaS boilerplate in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fproduction-ready-boilerplate)

*Note: Remember to add all environment variables listed in `.env.example` to your Vercel project configuration dashboard.*
