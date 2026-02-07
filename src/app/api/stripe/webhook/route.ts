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
    const profileId = session.metadata?.profile_id;
    const planId = session.metadata?.plan_id;
    const subscriptionId =
        typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

    if (!profileId || !planId || !subscriptionId) {
        console.error("Webhook checkout.session.completed missing metadata or subscription", {
            profileId,
            planId,
            subscriptionId,
        });
        return NextResponse.json(
            { message: "Missing profile_id, plan_id or subscription id" },
            { status: 400 },
        );
    }

    try {
        const supabase = createSupabaseAdminClient();

        // 1) Garantir que a subscription seja salva com stripe_subscription_id.
        // Se a tabela tiver UNIQUE(profile_id): um plano por usuário → upsert por profile_id.
        // Se a tabela tiver UNIQUE(stripe_subscription_id): histórico por subscription → upsert por stripe_subscription_id.
        const subscriptionPayload = {
            profile_id: profileId,
            plan_id: planId,
            stripe_subscription_id: subscriptionId,
            status: "active",
            started_at: new Date().toISOString(),
        };

        const { error: subError } = await supabase.from("subscription").upsert(subscriptionPayload, {
            onConflict: "profile_id",
        });

        if (subError) {
            // Fallback: tabela pode ter UNIQUE(stripe_subscription_id) em vez de profile_id
            const { error: fallbackError } = await supabase.from("subscription").upsert(subscriptionPayload, {
                onConflict: "stripe_subscription_id",
            });
            if (fallbackError) {
                console.error("Supabase subscription upsert error:", subError, fallbackError);
                return NextResponse.json(
                    { message: "Failed to create subscription" },
                    { status: 500 },
                );
            }
        }

        // 2) Atualizar o plano do usuário no profile (free → plano assinado)
        const { error: profileError } = await supabase
            .from("profile")
            .update({ plan_id: planId })
            .eq("id", profileId);

        if (profileError) {
            console.error("Supabase profile plan_id update error:", profileError);
            // Não falhamos o webhook: a subscription já foi salva; profile.plan_id é opcional se o app usar só a tabela subscription
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err) {
        console.error("Webhook handler error:", err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
}
