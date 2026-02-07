import Stripe from "stripe";

function getStripeSecretKey(): string {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        throw new Error("Missing STRIPE_SECRET_KEY");
    }
    return key;
}

let stripeInstance: Stripe | null = null;

/** Server-side Stripe client. Use only in API routes or server actions. */
export function getStripe(): Stripe {
    if (!stripeInstance) {
        stripeInstance = new Stripe(getStripeSecretKey(), { typescript: true });
    }
    return stripeInstance;
}
