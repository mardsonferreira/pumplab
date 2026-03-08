"use client";

import { useCallback, useState } from "react";
import { FiFilm, FiImage, FiFileText, FiList } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

import { Textarea } from "@/components/common/textarea";
import { useNarrativeStore } from "@/utils/stores/dashboard/narrative";
import { Button } from "@/components/ui/Button";
import { useGenerateCarousel } from "@/app/hooks/openai";
import { WaveLoading } from "@/components/common/wave";
import { useMobile } from "@/app/hooks/use-mobile";

function validateDraft(narrative: { central_thesis?: string; main_argument?: string; narrative_sequence?: { description?: string }[] }): string | null {
    if (!narrative.central_thesis?.trim()) return "Tese central é obrigatória.";
    if (!narrative.main_argument?.trim()) return "Argumento principal é obrigatório.";
    const seq = narrative.narrative_sequence ?? [];
    if (seq.length !== 5) return "Preencha os 5 passos da sequência.";
    for (let i = 0; i < 5; i++) {
        if (!seq[i]?.description?.trim()) return `Passo ${i + 1} da sequência é obrigatório.`;
    }
    return null;
}

export default function EditNarrative() {
    const { narrative, setNarrative } = useNarrativeStore();
    const { generateCarousel, generating, error } = useGenerateCarousel();
    const [fieldError, setFieldError] = useState<string | null>(null);
    const router = useRouter();
    const isMobile = useMobile();

    if (!narrative) {
        return (
            <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                Narrativa não encontrada
            </div>
        );
    }

    const safeSequence = Array.isArray(narrative.narrative_sequence) ? narrative.narrative_sequence : [];

    const handleCentralThesisChange = (value: string) => {
        setFieldError(null);
        setNarrative({ ...narrative, central_thesis: value });
    };

    const handleMainArgumentChange = (value: string) => {
        setFieldError(null);
        setNarrative({ ...narrative, main_argument: value });
    };

    const handleSequenceChange = (index: number, value: string) => {
        setFieldError(null);
        const updatedSequence = [...safeSequence];
        if (!updatedSequence[index]) return;
        updatedSequence[index] = { ...updatedSequence[index], description: value };
        setNarrative({ ...narrative, narrative_sequence: updatedSequence });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const err = validateDraft(narrative);
        if (err) {
            setFieldError(err);
            return;
        }
        setFieldError(null);
        const success = await generateCarousel(narrative);
        if (success) router.push("/post");
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            {(fieldError || error) && (
                <div className="mb-6 rounded-lg border border-error/50 bg-error/10 px-4 py-3 text-center text-sm text-error" role="alert">
                    {fieldError ?? error}
                    {error && <span className="ml-2">Tente novamente.</span>}
                </div>
            )}
            <h3 className="mb-8 text-center text-xl font-bold text-foreground">2. Revise e ajuste sua narrativa</h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <Textarea
                    containerClassName="space-y-2"
                    id="central_thesis"
                    label="Tese Central"
                    value={narrative.central_thesis ?? ""}
                    icon={
                        <span className="inline-flex h-5 w-5 items-center justify-center text-primary">
                            <FiFileText size={20} />
                        </span>
                    }
                    disabled={generating}
                    onChangeValue={handleCentralThesisChange}
                    rows={isMobile ? 4 : 3}
                />

                <Textarea
                    containerClassName="space-y-2"
                    id="main_argument"
                    label="Argumento Principal"
                    value={narrative.main_argument ?? ""}
                    icon={
                        <span className="inline-flex h-5 w-5 items-center justify-center text-primary">
                            <FaQuoteLeft size={20} />
                        </span>
                    }
                    disabled={generating}
                    onChangeValue={handleMainArgumentChange}
                    rows={isMobile ? 10 : 8}
                />

                <div className="space-y-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground text-primary">
                            <span className="inline-flex h-5 w-5 items-center justify-center text-primary">
                            <FiList size={20} />
                        </span>
                            Sequência da Narrativa
                        </label>
                    </div>
                    <div className="space-y-4">
                        {safeSequence.map((step, index) => (
                            <div key={index} className="flex w-full items-start gap-4">
                                <Textarea
                                    id={`step-${index}`}
                                    label={`${index + 1}.`}
                                    containerClassName="flex-row w-full items-center gap-3"
                                    value={step.description ?? ""}
                                    disabled={generating}
                                    onChangeValue={value => handleSequenceChange(index, value)}
                                    rows={isMobile ? 4 : 1}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <footer className="flex items-center justify-center gap-4">
                    <Button type="button" variant="primary" disabled>
                        <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
                            <FiFilm size={16} />
                        </span>
                        Reels
                    </Button>
                    <Button type="submit" variant="primary" disabled={generating}>
                        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center">
                            <FiImage size={20} />
                        </span>
                        Carrossel/Story
                    </Button>
                </footer>
            </form>

            {generating && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    <span className="text-center text-sm font-bold text-neutral-400">
                        Gerando carousel. Isso pode levar alguns minutos
                    </span>
                    <WaveLoading size="lg" color="primary" />
                </div>
            )}
        </div>
    );
}
