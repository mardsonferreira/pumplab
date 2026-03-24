import React, { Suspense } from "react";

import { PlansClient } from "./PlansClient";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { retrievePlans } from "@/lib/supabase/retrieve-plans";
import { Pricing } from "@/components/pricing";


export default async function PricingPage() {
    const supabase = await createSupabaseServerClient();
    const user = supabase
        ? (await supabase.auth.getUser()).data?.user ?? null
        : null;
    const plans = await retrievePlans();

    if (!plans) {
        return (
            <div className="mb-12 rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 text-neutral-300">
                Não foi possível carregar os planos agora. Tente recarregar a página em instantes.
            </div>
        );
    }

    return (
        <Pricing plans={plans} user={user}/>
    );
}
