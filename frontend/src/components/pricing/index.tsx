"use client";

import { Suspense } from "react";

import { PlansSkeleton } from "./plansSkeleton";
import { Plan as PlanComponent } from "./plan";
import { User } from "@supabase/supabase-js";
import { Plan } from "@/types";

import { ConfirmPlanModal } from "./ConfirmPlanModal";
import { useSubscriptionConfirm } from "./hooks/useSubscriptionConfirm";

export function Pricing({ plans, user }: { plans: Plan[]; user: User | null }) {
    const {
        selectedPlan,
        isModalOpen,
        setIsModalOpen,
        isLoading,
        error,
        activeSubscription,
        handleSelectPlan,
        handleConfirm,
    } = useSubscriptionConfirm(user, plans);

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
                    <PlanComponent plans={plans} onSelectPlan={handleSelectPlan} />
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

            {selectedPlan && (
                <ConfirmPlanModal
                    plan={selectedPlan}
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    onConfirm={handleConfirm}
                    isLoading={isLoading}
                    error={error}
                    activeSubscriptionPlanName={activeSubscription?.plan?.name ?? null}
                />
            )}
        </div>
    );
}
