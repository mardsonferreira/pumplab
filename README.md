# PumpLab

AI-powered content generation tool for personal trainers to create Instagram Reels and Carousel posts.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** (dark theme with yellow accent)
- **Radix UI** for accessible components
- **pnpm** as package manager

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (install with `npm install -g pnpm`)

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Run the development server:

```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Stripe integration

The app uses Stripe for subscriptions and syncs with Supabase (`profile.stripe_customer_id`, `subscription` table).

1. **Environment variables** (add to `.env.local`):

   - `STRIPE_SECRET_KEY` – Stripe secret key (Dashboard → Developers → API keys).
   - `STRIPE_WEBHOOK_SECRET` – Webhook signing secret (create a webhook in Stripe pointing to `https://your-domain/api/stripe/webhook`; for local dev use Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`).
   - `SUPABASE_SERVICE_ROLE_KEY` – Supabase service role key (used by the webhook to write subscriptions; keep secret).
   - `NEXT_PUBLIC_APP_URL` – Public app URL (e.g. `https://your-domain.com`) for checkout success/cancel redirects; optional, falls back to request origin.

2. **Database**: add Stripe subscription id to `subscription` so webhooks can update/cancel correctly:

   ```sql
   ALTER TABLE public.subscription ADD COLUMN IF NOT EXISTS stripe_subscription_id text UNIQUE;
   ```

3. **Stripe Dashboard**: create Products and Prices for each paid plan, then set `plan.stripe_product_id` and `plan.stripe_price_id` in Supabase for those plans. The Free plan can leave these null.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with Header/Footer
│   ├── page.tsx        # Landing page
│   └── globals.css     # Global styles & Tailwind
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx  # Site header
│   │   └── Footer.tsx  # Site footer
│   │
│   └── ui/
│       └── Button.tsx  # Radix UI Button component
│
├── utils/
│   └── cn.ts          # Class name utility (clsx + tailwind-merge)
│
└── lib/
    └── fonts.ts       # Font configuration
```

## Features

- Dark theme with yellow accent colors
- Responsive design
- Accessible components with Radix UI
- TypeScript for type safety
- ESLint for code quality

## Build

```bash
pnpm build
```

## License

MIT
