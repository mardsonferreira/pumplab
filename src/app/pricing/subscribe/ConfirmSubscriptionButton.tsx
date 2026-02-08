"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ConfirmSubscriptionButton({ planId }: { planId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch("/api/stripe/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId }),
            });
            const data = await res.json();

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
            setError(err instanceof Error ? err.message : "Erro ao confirmar assinatura. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            {error && (
                <p className="text-sm text-red-400" role="alert">
                    {error}
                </p>
            )}
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
                    "Confirmar assinatura"
                )}
            </Button>
        </div>
    );
}
