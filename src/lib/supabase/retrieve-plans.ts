import { Plan } from "@/types";

const revalidate = 60 * 60; // 1h

type SupabasePlanRow = {
    id: string;
    name: string;
    price: number | null;
    billing_cycle: string | null;
    monthly_narratives: number | null;
    description: string | null;
    stripe_price_id: string | null;
    stripe_product_id: string | null;
};

const plan_fields = [
    "id",
    "name",
    "price",
    "billing_cycle",
    "monthly_narratives",
    "description",
    "stripe_price_id",
    "stripe_product_id",
]

export async function retrievePlans(): Promise<Plan[]> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }

    const url = new URL(`${supabaseUrl}/rest/v1/plan`);
    url.searchParams.set("select", plan_fields.join(","));
    url.searchParams.set("order", "price.asc");

    const res = await fetch(url.toString(), {
        headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
        },
        next: { revalidate },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch plans (${res.status})`);
    }

    const rows = (await res.json()) as SupabasePlanRow[];
    return (rows ?? []).map(mapRowToPlan);
}

function mapRowToPlan(row: SupabasePlanRow): Plan {
    return {
        id: row.id,
        name: row.name,
        price: (row.price ?? 0) / 100,
        billing_cycle: row.billing_cycle ?? null,
        monthly_narratives: row.monthly_narratives ?? 0,
        description: row.description ?? null,
        stripe_price_id: row.stripe_price_id ?? null,
        stripe_product_id: row.stripe_product_id ?? null,
    };
}

export async function retrievePlanById(id: string): Promise<Plan | null> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }

    const url = new URL(`${supabaseUrl}/rest/v1/plan`);
    url.searchParams.set("select", plan_fields.join(","));
    url.searchParams.set("id", `eq.${id}`);
    url.searchParams.set("limit", "1");

    const res = await fetch(url.toString(), {
        headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
        },
        next: { revalidate },
    });

    if (!res.ok) {
        return null;
    }

    const rows = (await res.json()) as SupabasePlanRow[];
    const row = rows?.[0];
    return row ? mapRowToPlan(row) : null;
}