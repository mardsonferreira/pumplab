import { useState } from "react";
import { useRouter } from "next/navigation";

import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Plan } from "@/types";
import { apiFetch, BackendUnavailableError } from "@/lib/api/client";
import { Loader2, X } from "lucide-react";

export function ConfirmPlanModal({
    plan,
    open,
    onOpenChange,
}: {
    plan: Plan;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await apiFetch("/stripe/create-checkout-session", {
                method: "POST",
                body: JSON.stringify({ planId: plan.id }),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                if (res.status === 401) {
                    setError("Faça login para continuar.");
                    window.location.href = `/pricing?login=required&next=${encodeURIComponent(window.location.pathname)}`;
                    return;
                }
                throw new Error(data.error ?? "Erro ao criar sessão de checkout");
            }

            if (data?.url) {
                window.location.href = data.url;
            } else {
                throw new Error("Resposta inválida do servidor");
            }
        } catch (err) {
            const message =
                err instanceof BackendUnavailableError
                    ? err.message
                    : err instanceof Error
                      ? err.message
                      : "Erro ao confirmar assinatura. Tente novamente.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-[51] max-h-[min(90vh,calc(100dvh-1.5rem))] w-[calc(100vw-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl shadow-black/40 focus:outline-none">
                    <div className="max-h-[min(90vh,calc(100dvh-1.5rem))] overflow-y-auto p-6 sm:p-8">
                        <header className="pb-6">
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-9 w-9 shrink-0"
                                    aria-hidden
                                />
                                <Dialog.Title className="min-w-0 flex-1 text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                    Confirme sua assinatura
                                </Dialog.Title>
                                <Dialog.Close asChild>
                                    <button
                                        type="button"
                                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                                        aria-label="Fechar">
                                        <X className="h-5 w-5" aria-hidden />
                                    </button>
                                </Dialog.Close>
                            </div>
                            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:mt-5 sm:text-left sm:text-3xl">
                                {plan.name}
                            </h2>
                            <p className="mt-3 min-h-[2.5rem] text-pretty text-sm leading-relaxed text-neutral-400 sm:text-left">
                                {plan.description ?? "Sem descrição"}
                            </p>
                        </header>

                        <section
                            className="mb-6 bg-primary/[0.07]"
                            aria-label="Preço do plano">
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                <span className="text-lg font-semibold text-primary">R$</span>
                                <span className="text-4xl font-bold tabular-nums tracking-tight text-foreground sm:text-5xl">
                                    {plan.price.toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                            {plan.billing_cycle === "monthly" && (
                                <p className="mt-2 text-sm text-neutral-400">por mês</p>
                            )}
                        </section>

                        <footer className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end sm:gap-4">
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                disabled={isLoading}
                                onClick={handleConfirm}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                                        Processando...
                                    </>
                                ) : (
                                    "Confirmar"
                                )}
                            </Button>
                        </footer>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
