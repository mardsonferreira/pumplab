import { Suspense } from "react";

import { PlansClient } from "./PlansClient";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { retrievePlans } from "@/lib/supabase/retrieve-plans";

function PlansSkeleton() {
    return (
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className={`relative rounded-lg border p-8 ${
                        index === 1 ? "border-primary bg-neutral-900/70" : "border-neutral-800 bg-neutral-900/50"
                    }`}>
                    {index === 1 && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <div className="h-7 w-28 rounded-full bg-primary/40" />
                        </div>
                    )}
                    <div className="mb-6 space-y-3">
                        <div className="h-7 w-40 rounded bg-neutral-800 animate-pulse" />
                        <div className="h-4 w-full rounded bg-neutral-800/70 animate-pulse" />
                        <div className="h-4 w-2/3 rounded bg-neutral-800/70 animate-pulse" />
                    </div>
                    <div className="mb-6 space-y-3">
                        <div className="flex items-baseline gap-2">
                            <div className="h-8 w-10 rounded bg-neutral-800 animate-pulse" />
                            <div className="h-10 w-28 rounded bg-neutral-800 animate-pulse" />
                        </div>
                        <div className="h-4 w-20 rounded bg-neutral-800/70 animate-pulse" />
                    </div>
                    <div className="mb-8 space-y-4">
                        <div className="h-4 w-4/5 rounded bg-neutral-800/70 animate-pulse" />
                        <div className="h-4 w-3/5 rounded bg-neutral-800/70 animate-pulse" />
                    </div>
                    <div className="h-11 w-full rounded-md bg-neutral-800 animate-pulse" />
                </div>
            ))}
        </div>
    );
}

async function PlansSection({
    subscribePlanId,
    user,
}: {
    subscribePlanId: string | undefined;
    user: { id: string } | null;
}) {
    try {
        const plans = await retrievePlans();
        return (
            <PlansClient
                plans={plans}
                user={user}
                subscribePlanId={subscribePlanId}
            />
        );
    } catch {
        return (
            <div className="mb-12 rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 text-neutral-300">
                Não foi possível carregar os planos agora. Tente recarregar a página em instantes.
            </div>
        );
    }
}

export default async function PricingPage({
    searchParams,
}: {
    searchParams: Promise<{ subscribe?: string }>;
}) {
    const params = await searchParams;
    const subscribePlanId =
        typeof params.subscribe === "string" ? params.subscribe : undefined;

    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-6xl">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        Escolha o Plano Ideal para Você
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-neutral-400 sm:text-xl">
                        Selecione o plano que melhor se adapta às suas necessidades de criação de conteúdo
                    </p>
                </div>

                <Suspense fallback={<PlansSkeleton />}>
                    <PlansSection subscribePlanId={subscribePlanId} user={user} />
                </Suspense>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="bg-primary/20 flex items-center justify-center rounded-full">
                                <svg
                                    className="h-6 w-6 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                Plano Free Automático
                            </h3>
                            <p className="text-neutral-400">
                                Ao fazer login na plataforma, o plano Free será automaticamente ativado para você.
                                Comece a criar conteúdo imediatamente!
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="bg-primary/20 flex items-center justify-center rounded-full">
                                <svg
                                    className="h-6 w-6 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                Cancelamento Flexível
                            </h3>
                            <p className="text-neutral-400">
                                Você pode cancelar sua assinatura a qualquer momento, sem compromisso. Sem taxas de
                                cancelamento ou burocracias.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
