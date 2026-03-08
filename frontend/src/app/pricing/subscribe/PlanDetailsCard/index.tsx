"use client";

import { useRouter } from "next/navigation";

import { ConfirmSubscriptionButton } from "@/app/pricing/subscribe/ConfirmSubscriptionButton";
import { Button } from "@/components/ui/Button";
import type { Plan } from "@/types";

export function PlanDetailsCard({ plan }: { plan: Plan }) {
    const router = useRouter();
    const isFree = plan.name === "Free";
    const canSubscribe = !isFree && plan.stripe_price_id;

    return (
        <div className="mx-auto max-w-lg rounded-lg border border-neutral-800 bg-neutral-900/50 p-8">
            <div className="mb-6">
                <h1 className="mb-2 text-2xl font-bold text-foreground">{plan.name}</h1>
                <p className="min-h-[40px] text-sm text-neutral-400">
                    {plan.description ?? "Sem descrição"}
                </p>
            </div>

            <div className="mb-6">
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">R$</span>
                    <span className="text-5xl font-bold text-foreground">
                        {plan.price.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>
                </div>
                {plan.billing_cycle === "monthly" && (
                    <p className="mt-2 text-sm text-neutral-400">por mês</p>
                )}
            </div>

            <div className="mb-8 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/20 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                        <svg
                            className="h-4 w-4 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <span className="text-foreground">
                        <strong className="font-semibold">{plan.monthly_narratives}</strong> posts
                        disponíveis por mês
                    </span>
                </div>
                {plan.billing_cycle === "monthly" && (
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/20 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                            <svg
                                className="h-4 w-4 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <span className="text-neutral-400">Assinatura recorrente mensalmente</span>
                    </div>
                )}
            </div>

            <div className="flex gap-4 justify-center border-t border-neutral-800 pt-6">
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                    Cancelar
                </Button>
                {canSubscribe ? (
                    <ConfirmSubscriptionButton planId={plan.id} />
                ) : isFree ? (
                    <p className="mb-4 text-sm text-neutral-400">
                        Este é o plano gratuito. Escolha outro plano na página de preços para
                        assinar.
                    </p>
                ) : (
                    <p className="mb-4 text-sm text-neutral-400">
                        Este plano não está disponível para assinatura no momento.
                    </p>
                )}
                
            </div>
        </div>
    );
}