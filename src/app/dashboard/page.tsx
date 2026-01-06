"use client"

import { useState } from "react"
import { cn } from "@/utils/cn"
import { PiStarFourFill } from "react-icons/pi";

import { useGenerateNarrative } from "@/app/hooks/openai";
import { NarrativeCard } from "@/components/dashboard/NarrativeCard";
import { Suggestions } from "@/components/dashboard/Suggestions";

export default function Dashboard() {
    const [input, setInput] = useState("")
    const { generateNarrative, generating, narratives } = useGenerateNarrative();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        generateNarrative(input);
    }

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
        generateNarrative(suggestion);
    }

    const handleLoadMore = () => {
        generateNarrative(input);
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">
            <div className="mb-8 flex items-center justify-center gap-2 flex-col">
                <div className="flex gap-2 items-center">
                    <PiStarFourFill className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                        Gerador de Narrativas
                    </h1>

                </div>
                <p className="text-neutral-400">
                    Digite um tema e deixe a IA gerar narrativas envolventes para o seu conteúdo
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mb-8">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Digite um tema para as suas narrativas..."
                        className={cn(
                            "w-full px-4 py-3 pr-12 rounded-lg border border-neutral-800",
                            "bg-neutral-900/50 text-foreground placeholder:text-neutral-500",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                            "resize-none min-h-[120px] max-h-[200px]"
                        )}
                        rows={4}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || generating}
                        className={cn(
                            "absolute bottom-4 right-3 p-2 rounded-md transition-colors",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            input.trim()
                                ? "bg-primary text-primary-foreground hover:bg-accent"
                                : "bg-neutral-800 text-neutral-500"
                        )}
                    >
                        {generating ? (
                            <svg
                                className="w-5 h-5 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
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
                            <svg
                                className="w-5 h-5 rotate-45"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
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
                    <Suggestions onClick={handleSuggestionClick} />
                )}
            </form>

            {narratives.length > 0 && (
                <>
                    <h3 className="text-lg font-bold text-foreground mb-8 text-center">1. Selecione uma narrativa para continuar</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {narratives.map((narrative, index) => (
                            <NarrativeCard key={index} narrative={narrative} />
                        ))}

                        <button
                            onClick={handleLoadMore}
                            disabled={generating}
                            className={cn(
                                "p-6 rounded-lg border-2 border-dashed border-neutral-800",
                                "bg-neutral-900/30 hover:border-primary/50 hover:bg-neutral-900/50",
                                "transition-colors flex flex-col items-center justify-center",
                                "text-neutral-400 hover:text-primary",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "min-h-[200px]"
                            )}
                        >
                            {generating ? (
                                <svg
                                    className="w-8 h-8 animate-spin text-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
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
                                    <svg
                                        className="w-8 h-8 mb-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
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
        </div>
    )
}

