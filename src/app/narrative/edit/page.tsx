"use client";

import { useCallback } from "react";
import { FiFilm, FiImage, FiFileText, FiList } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

import { Textarea } from "@/components/common/textarea";
import { useNarrativeStore } from "@/utils/stores/dashboard/narrative";
import { Button } from "@/components/ui/Button";
import { useGenerateCarousel } from "@/app/hooks/openai";
import { WaveLoading } from "@/components/common/wave";
import { useMobile } from "@/app/hooks/use-mobile";

export default function EditNarrative() {
    const { narrative, setNarrative } = useNarrativeStore();
    const { generateCarousel, generating, carousel } = useGenerateCarousel();
    const router = useRouter();
    const isMobile = useMobile();

    if (!narrative) {
        return (
            <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                Narrativa não encontrada
            </div>
        );
    }

    const handleCentralThesisChange = (value: string) => {
        setNarrative({
            ...narrative,
            central_thesis: value,
        });
    };

    const handleMainArgumentChange = (value: string) => {
        setNarrative({
            ...narrative,
            main_argument: value,
        });
    };

    const handleSequenceChange = (index: number, value: string) => {
        const updatedSequence = [...narrative.narrative_sequence];
        updatedSequence[index] = {
            ...updatedSequence[index],
            description: value,
        };
        setNarrative({ ...narrative, narrative_sequence: updatedSequence });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // await generateCarousel(narrative);
        router.push("/post");
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <h3 className="mb-8 text-center text-xl font-bold text-foreground">2. Revise e ajuste sua narrativa</h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <Textarea
                    containerClassName="space-y-2"
                    id="central_thesis"
                    label="Tese Central"
                    value={narrative.central_thesis}
                    icon={<FiFileText className="h-5 w-5 text-primary" />}
                    disabled={generating}
                    onChangeValue={handleCentralThesisChange}
                    rows={isMobile ? 4 : 3}
                />

                <Textarea
                    containerClassName="space-y-2"
                    id="main_argument"
                    label="Argumento Principal"
                    value={narrative.main_argument}
                    icon={<FaQuoteLeft className="h-5 w-5 text-primary" />}
                    disabled={generating}
                    onChangeValue={handleMainArgumentChange}
                    rows={isMobile ? 10 : 8}
                />

                <div className="space-y-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground text-primary">
                            <FiList className="h-5 w-5 text-primary" />
                            Sequência da Narrativa
                        </label>
                    </div>
                    <div className="space-y-4">
                        {narrative?.narrative_sequence.map((step, index) => (
                            <div key={index} className="flex w-full items-start gap-4">
                                <Textarea
                                    id={`step-${index}`}
                                    label={`${index + 1}.`}
                                    containerClassName="flex-row w-full items-center gap-3"
                                    value={step.description}
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
                        <FiFilm className="mr-2 h-4 w-4" />
                        Reels
                    </Button>
                    <Button type="submit" variant="primary" disabled={generating}>
                        <FiImage className="mr-2 h-5 w-5" />
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
