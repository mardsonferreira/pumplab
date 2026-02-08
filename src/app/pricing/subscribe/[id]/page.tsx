import { notFound, useRouter } from "next/navigation";

import { retrievePlanById } from "@/lib/supabase/retrieve-plans";
import { PlanDetailsCard } from "@/app/pricing/subscribe/PlanDetailsCard";

export default async function SubscribePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const plan = await retrievePlanById(id);

    if (!plan) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-6xl">
                <div className="mb-10 text-center">
                    <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Confirme sua assinatura
                    </h2>
                    <p className="text-lg text-neutral-400">
                        Revise os detalhes do plano e confirme para prosseguir ao checkout.
                    </p>
                </div>
                <PlanDetailsCard plan={plan} />
            </div>
        </div>
    );
}
