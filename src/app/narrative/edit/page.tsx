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
        return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">Narrativa não encontrada</div>;
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">
            <h3 className="text-xl font-bold text-foreground mb-8 text-center">2. Revise e ajuste sua narrativa</h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <Textarea
                    containerClassName="space-y-2"
                    id="central_thesis"
                    label="Tese Central"
                    value={narrative.central_thesis}
                    icon={<FiFileText className="w-5 h-5 text-primary" />}
                    disabled={generating}
                    onChangeValue={handleCentralThesisChange}
                    rows={isMobile ? 4 : 3}
                />

                <Textarea
                    containerClassName="space-y-2"
                    id="main_argument"
                    label="Argumento Principal"
                    value={narrative.main_argument}
                    icon={<FaQuoteLeft className="w-5 h-5 text-primary" />}
                    disabled={generating}
                    onChangeValue={handleMainArgumentChange}
                    rows={isMobile ? 10 : 8}
                />

                <div className="space-y-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground text-primary">
                            <FiList className="w-5 h-5 text-primary" />
                            Sequência da Narrativa
                        </label>
                    </div>
                    <div className="space-y-4">
                        {narrative?.narrative_sequence.map((step, index) => (
                            <div key={index} className="flex items-start gap-4 w-full">
                                <Textarea
                                    id={`step-${index}`}
                                    label={`${index + 1}.`}
                                    containerClassName="flex-row w-full items-center gap-3"
                                    value={step.description}
                                    disabled={generating}
                                    onChangeValue={(value) => handleSequenceChange(index, value)}
                                    rows={isMobile ? 4 : 1}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <footer className="flex items-center justify-center gap-4">
                    <Button type="button" variant="primary" disabled>
                        <FiFilm className="w-4 h-4 mr-2" />
                        Reels
                    </Button>
                    <Button type="submit" variant="primary" disabled={generating}>
                        <FiImage className="w-5 h-5 mr-2" />
                        Carrossel/Story
                    </Button>

                </footer>
            </form>

            {generating && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <span className="text-sm text-neutral-400 font-bold text-center">Gerando carousel. Isso pode levar alguns minutos</span>
                    <WaveLoading size="lg" color="primary" />
                </div>
            )}
        </div>
    )
}