import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
    const body = await request.text();
    const headersList = await headers();
    const stripeSignature = headersList.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSignature || !webhookSecret) {
        return NextResponse.json(
            { message: "Missing stripe-signature or STRIPE_WEBHOOK_SECRET" },
            { status: 400 },
        );
    }

    let event: Stripe.Event;
    try {
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(body, stripeSignature, webhookSecret);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("Stripe webhook signature verification failed:", message);
        return NextResponse.json({ message: `Webhook Error: ${message}` }, { status: 400 });
    }

    if (event.type !== "checkout.session.completed") {
        return NextResponse.json({ received: true }, { status: 200 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const subscriptionId =
        typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

    if (!subscriptionId) {
        console.error("Webhook checkout.session.completed missing subscription id");
        return NextResponse.json(
            { message: "Missing subscription id" },
            { status: 400 },
        );
    }

    try {
        const supabase = createSupabaseAdminClient();
        const stripe = getStripe();
        let profileId = session.metadata?.profile_id as string | undefined;
        let planId = session.metadata?.plan_id as string | undefined;

        if (!profileId || !planId) {
            const stripeCustomerId =
                typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
            let stripePriceId: string | null = null;

            if (session.subscription) {
                const sub =
                    typeof session.subscription === "string"
                        ? await stripe.subscriptions.retrieve(session.subscription)
                        : session.subscription;
                const price = sub.items?.data?.[0]?.price;
                stripePriceId =
                    typeof price === "string" ? price : (price as { id?: string } | null)?.id ?? null;
            }

            if (stripeCustomerId) {
                const { data: profileRow } = await supabase
                    .from("profile")
                    .select("id")
                    .eq("stripe_customer_id", stripeCustomerId)
                    .single();
                if (profileRow) profileId = profileRow.id;
            }
            if (stripePriceId) {
                const { data: planRow } = await supabase
                    .from("plan")
                    .select("id")
                    .eq("stripe_price_id", stripePriceId)
                    .single();
                if (planRow) planId = planRow.id;
            }
        }

        if (!profileId || !planId) {
            console.error("Webhook could not resolve profile_id or plan_id from metadata or Stripe lookups", {
                hasMetadataProfile: Boolean(session.metadata?.profile_id),
                hasMetadataPlan: Boolean(session.metadata?.plan_id),
                subscriptionId,
            });
            return NextResponse.json(
                { message: "Could not resolve profile_id or plan_id" },
                { status: 400 },
            );
        }

        const subscriptionPayload = {
            profile_id: profileId,
            plan_id: planId,
            stripe_subscription_id: subscriptionId,
            status: "active",
            started_at: new Date().toISOString(),
        };

        const { error: subError } = await supabase.from("subscription").upsert(subscriptionPayload, {
            onConflict: "stripe_subscription_id",
        });

        if (subError) {
            console.error("Supabase subscription upsert error:", subError);
            return NextResponse.json(
                { message: "Failed to create subscription" },
                { status: 500 },
            );
        }

        // Note: Your profile table has no plan_id column; current plan is derived from subscription table.
        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err) {
        console.error("Webhook handler error:", err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
}
