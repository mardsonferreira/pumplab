"use client";

import { cn } from "@/utils/cn";

import { Textarea } from "@/components/common/textarea";
import { useNarrativeStore } from "@/utils/stores/dashboard/narrative";

export default function EditNarrative() {
    const { narrative, setNarrative } = useNarrativeStore();

    if (!narrative) {
        return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">Narrativa não encontrada</div>;
    }

    const handleCentralThesisChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNarrative({
            ...narrative,
            central_thesis: e.target.value,
        });
    };

    const handleMainArgumentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNarrative({
            ...narrative,
            main_argument: e.target.value,
        });
    };

    const handleSequenceChange = (index: number, e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const updatedSequence = [...narrative.narrative_sequence];
        updatedSequence[index] = {
            ...updatedSequence[index],
            description: e.target.value,
        };
        setNarrative({
            ...narrative,
            narrative_sequence: updatedSequence,
        });
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">
            <h3 className="text-xl font-bold text-foreground mb-8 text-center">2. Hora de verificar se está tudo certo com a narrativa</h3>

            <form className="space-y-6">
                <Textarea
                    containerClassName="space-y-2"
                    id="central_thesis"
                    label="Tese Central"
                    value={narrative.central_thesis}
                    onChange={handleCentralThesisChange}
                />

                <Textarea
                    containerClassName="space-y-2"
                    id="main_argument"
                    label="Argumento Principal"
                    value={narrative.main_argument}
                    onChange={handleMainArgumentChange}
                    rows={8}
                />

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-foreground text-primary">Sequência da Narrativa</label>
                    <div className="space-y-4">
                        {narrative?.narrative_sequence.map((step, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <label className="text-sm font-medium text-foreground text-primary pt-3 min-w-[2rem]" htmlFor={`step-${index}`}>
                                    {index + 1}.
                                </label>
                                <textarea
                                    id={`step-${index}`}
                                    value={step.description}
                                    onChange={(e) => handleSequenceChange(index, e)}
                                    className={cn(
                                        "flex-1 px-4 py-3 rounded-lg border border-neutral-800",
                                        "bg-neutral-900/50 text-foreground placeholder:text-neutral-500",
                                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                                        "resize-none"
                                    )}
                                    rows={1}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </form>

        </div>
    )
}