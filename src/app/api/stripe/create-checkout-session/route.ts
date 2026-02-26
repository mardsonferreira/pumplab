import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const planId = body?.planId as string | undefined;
        if (!planId || typeof planId !== "string") {
            return NextResponse.json({ error: "planId is required" }, { status: 400 });
        }

        const supabase = await createSupabaseServerClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: plan, error: planError } = await supabase
            .from("plan")
            .select("id, stripe_price_id, name")
            .eq("id", planId)
            .single();

        if (planError || !plan?.stripe_price_id) {
            return NextResponse.json(
                { error: "Plan not found or not available for subscription" },
                { status: 400 }
            );
        }

        let { data: profile } = await supabase.from("profile").select("id, stripe_customer_id").eq("id", user.id).single();

        if (!profile) {
            const { data: newProfile, error: insertError } = await supabase
                .from("profile")
                .insert({
                    id: user.id,
                    email: user.email ?? undefined,
                    display_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? undefined,
                })
                .select("id, stripe_customer_id")
                .single();

            if (insertError) {
                console.error("Profile insert error:", insertError);
                return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
            }
            profile = newProfile;
        }

        const stripe = getStripe();
        let customerId = profile.stripe_customer_id ?? null;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email ?? undefined,
                name: (profile as { display_name?: string }).display_name ?? user.user_metadata?.full_name ?? undefined,
                metadata: { supabase_user_id: user.id },
            });
            customerId = customer.id;
            await supabase.from("profile").update({ stripe_customer_id: customerId }).eq("id", user.id);
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.headers.get("origin") ?? "http://localhost:3000";
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer: customerId,
            line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
            success_url: `${baseUrl}/dashboard?checkout=success`,
            cancel_url: `${baseUrl}/pricing?checkout=canceled`,
            metadata: {
                profile_id: profile.id,
                plan_id: plan.id,
            },
            subscription_data: {
                metadata: {
                    profile_id: profile.id,
                    plan_id: plan.id,
                },
            },
        });

        if (!session.url) {
            return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
        }

        return NextResponse.json({ url: session.url });
    } catch (err) {
        console.error("Create checkout session error:", err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Internal server error" },
            { status: 500 }
        );
    }
}
