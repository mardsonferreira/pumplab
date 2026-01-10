"use client";

import { FiFilm, FiImage, FiFileText, FiList } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";

import { Textarea } from "@/components/common/textarea";
import { useNarrativeStore } from "@/utils/stores/dashboard/narrative";
import { Button } from "@/components/ui/Button";

export default function EditNarrative() {
    const { narrative, setNarrative } = useNarrativeStore();

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(narrative);
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
                    onChangeValue={handleCentralThesisChange}
                    rows={4}
                />

                <Textarea
                    containerClassName="space-y-2"
                    id="main_argument"
                    label="Argumento Principal"
                    value={narrative.main_argument}
                    icon={<FaQuoteLeft className="w-5 h-5 text-primary" />}
                    onChangeValue={handleMainArgumentChange}
                    rows={8}
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
                                    onChangeValue={(value) => handleSequenceChange(index, value)}
                                    rows={1}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <footer className="flex items-center justify-center gap-4">
                    <Button type="button" variant="primary">
                        <FiFilm className="w-4 h-4 mr-2" />
                        Reels
                    </Button>
                    <Button type="submit" variant="primary">
                        <FiImage className="w-5 h-5 mr-2" />
                        Carrossel/Story
                    </Button>

                </footer>
            </form>
        </div>
    )
}