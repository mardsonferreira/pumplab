"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/utils/cn";
import { PiStarFourFill } from "react-icons/pi";

import { useGenerateNarrative } from "@/app/hooks/openai";
import { NarrativeCard } from "@/components/dashboard/NarrativeCard";
import { Suggestions } from "@/components/dashboard/Suggestions";
import { WaveLoading } from "@/components/common/wave";

export default function Dashboard() {
    const searchParams = useSearchParams();
    const [input, setInput] = useState("");
    const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

    useEffect(() => {
        if (searchParams.get("checkout") === "success") {
            setShowCheckoutSuccess(true);
            window.history.replaceState({}, "", "/dashboard");
        }
    }, [searchParams]);
    const { generateNarrative, generating, narratives } = useGenerateNarrative();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        generateNarrative(input);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
        generateNarrative(suggestion);
    };

    const handleLoadMore = () => {
        generateNarrative(input);
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            {showCheckoutSuccess && (
                <div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-center text-sm text-primary">
                    Assinatura ativada com sucesso! Aproveite seu plano.
                </div>
            )}
            <div className="mb-8 flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                    <PiStarFourFill className="h-8 w-8 text-primary" />
                    <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">Gerador de Narrativas</h1>
                </div>
                <span className="text-center text-neutral-400">
                    Digite um tema e deixe a IA gerar narrativas envolventes para o seu post no Instagram
                </span>
            </div>

            <form onSubmit={handleSubmit} className="mb-8">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Digite um tema para as suas narrativas..."
                        className={cn(
                            "w-full rounded-lg border border-neutral-800 px-4 py-3 pr-12",
                            "bg-neutral-900/50 text-foreground placeholder:text-neutral-500",
                            "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary",
                            "max-h-[200px] min-h-[120px] resize-none",
                        )}
                        rows={4}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || generating}
                        className={cn(
                            "absolute bottom-4 right-3 rounded-md p-2 transition-colors",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            input.trim()
                                ? "bg-primary text-primary-foreground hover:bg-accent"
                                : "bg-neutral-800 text-neutral-500",
                        )}>
                        {generating ? (
                            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {!narratives.length && (
                    <div className="mt-4 flex flex-col gap-2">
                        <span>Não sabe por onde começar? Experimente uma das sugestões abaixo:</span>
                        <Suggestions disabled={generating} onClick={handleSuggestionClick} />
                    </div>
                )}
            </form>

            {narratives.length > 0 && !generating && (
                <>
                    <h3 className="mb-8 text-center text-lg font-bold text-foreground">
                        1. Selecione uma narrativa para continuar
                    </h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {narratives.map((narrative, index) => (
                            <NarrativeCard key={index} narrative={narrative} />
                        ))}

                        <button
                            onClick={handleLoadMore}
                            disabled={generating}
                            className={cn(
                                "rounded-lg border-2 border-dashed border-neutral-800 p-6",
                                "hover:border-primary/50 bg-neutral-900/30 hover:bg-neutral-900/50",
                                "flex flex-col items-center justify-center transition-colors",
                                "text-neutral-400 hover:text-primary",
                                "disabled:cursor-not-allowed disabled:opacity-50",
                                "min-h-[200px]",
                            )}>
                            {generating ? (
                                <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            ) : (
                                <>
                                    <svg className="mb-2 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    <span className="font-medium">Carregar Novas Narrativas</span>
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}

            {generating && (
                <div className="flex items-center justify-center gap-2">
                    <span className="text-center text-sm font-bold text-neutral-400">
                        Gerando narrativas. Aguarde um momento
                    </span>
                    <WaveLoading size="lg" color="primary" />
                </div>
            )}
        </div>
    );
}
