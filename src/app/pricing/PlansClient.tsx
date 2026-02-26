"use client";

import { Button } from "@/components/ui/Button";
import type { Plan } from "@/types";
import { useGoogleLogin } from "@/app/hooks/google-login";

export function PlansClient({ plans }: { plans: Plan[] }) {
    const { handleGoogleLogin } = useGoogleLogin();

    const handleSelectPlan = (plan: Plan) => {
        handleGoogleLogin(`/pricing/subscribe/${encodeURIComponent(plan.id)}`);
    };

    return (
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((plan, index) => (
                <div
                    key={plan.id ?? plan.name}
                    className={`relative rounded-lg border p-8 transition-all duration-200 ${
                        index === 1
                            ? "border-primary bg-neutral-900/70 shadow-lg shadow-primary/10"
                            : "border-neutral-800 bg-neutral-900/50"
                    }`}>
                    {index === 1 && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <span className="bg-primary px-4 py-1 rounded-full text-sm font-semibold text-primary-foreground">
                                Mais Popular
                            </span>
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="mb-2 text-2xl font-bold text-foreground">{plan.name}</h3>
                        <p className="min-h-[40px] text-sm text-neutral-400">{plan.description ?? "Sem descrição"}</p>
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
                        {plan.billing_cycle === "monthly" && <p className="mt-2 text-sm text-neutral-400">por mês</p>}
                    </div>

                    <div className="mb-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/20 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                                <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <span className="text-foreground">
                                <strong className="font-semibold">{plan.monthly_narratives}</strong> posts disponíveis por mês
                            </span>
                        </div>
                        {plan.billing_cycle === "monthly" && (
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/20 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                    <Button
                        variant={index === 1 ? "primary" : "outline"}
                        className="w-full"
                        disabled={plan.name === "Free"}
                        onClick={() => handleSelectPlan(plan)}>
                        {plan.name === "Free" ? "Plano Atual" : "Assinar Agora"}
                    </Button>
                </div>
            ))}
        </div>
    );
}
