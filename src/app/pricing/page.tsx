"use client";

import { Button } from "@/components/ui/Button";

export default function PricingPage() {
    const plans = [
        {
            name: "Free",
            price: "0.00",
            monthlyPosts: 3,
            isRecurring: false,
            description: "Perfeito para começar",
        },
        {
            name: "Starter",
            price: "19,90",
            monthlyPosts: 10,
            isRecurring: true,
            description: "Ideal para profissionais em crescimento",
        },
        {
            name: "Pro",
            price: "29,90",
            monthlyPosts: 20,
            isRecurring: true,
            description: "Para quem quer maximizar resultados",
        },
    ];

    const handleSubscribe = (planName: string) => {
        // TODO: Implementar lógica de assinatura
        console.log(`Assinar plano: ${planName}`);
    };

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

                <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.name}
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
                                <p className="text-sm text-neutral-400">{plan.description}</p>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-foreground">R$</span>
                                    <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                                </div>
                                {plan.isRecurring && (
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
                                            viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-foreground">
                                        <strong className="font-semibold">{plan.monthlyPosts}</strong> posts disponíveis
                                        por mês
                                    </span>
                                </div>
                                {plan.isRecurring && (
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/20 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                                            <svg
                                                className="h-4 w-4 text-primary"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24">
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
                                onClick={() => handleSubscribe(plan.name)}>
                                {plan.name === "Free" ? "Plano Atual" : "Assinar Agora"}
                            </Button>
                        </div>
                    ))}
                </div>

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
