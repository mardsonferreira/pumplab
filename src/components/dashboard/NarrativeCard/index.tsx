import { cn } from "@/utils/cn";
import { FaArrowRight } from "react-icons/fa6";
import { FaLightbulb, FaMessage } from "react-icons/fa6";
import { useRouter } from "next/navigation";

import { Narrative } from "@/types";
import { useNarrativeStore } from "@/utils/stores/dashboard/narrative";

interface NarrativeCardProps {
    narrative: Narrative;
}

export function NarrativeCard({ narrative }: NarrativeCardProps) {
    const { setNarrative } = useNarrativeStore();
    const router = useRouter();

    const handleClick = () => {
        setNarrative(narrative);
        router.push("/narrative/edit");
    };

    return (
        <div
            className={cn(
                "group relative rounded-xl border border-neutral-800/60 p-6",
                "bg-gradient-to-br from-neutral-900/40 to-neutral-900/20",
                "flex min-h-[240px] flex-col justify-between",
                "cursor-pointer transition-all duration-300",
                "hover:border-primary/60 hover:bg-gradient-to-br hover:from-neutral-900/60 hover:to-neutral-900/40",
                "hover:shadow-primary/5 hover:-translate-y-1 hover:shadow-xl",
            )}
            onClick={handleClick}>
            <div className="flex flex-1 flex-col">
                <div className="mb-3 flex items-start gap-2">
                    <FaLightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <h3 className="line-clamp-2 text-lg font-bold leading-tight text-primary">
                        {narrative.central_thesis}
                    </h3>
                </div>

                <div className="from-primary/50 mb-4 h-px w-12 bg-gradient-to-r to-transparent" />

                <div className="flex flex-1 items-start gap-2">
                    <FaMessage className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400" />
                    <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-neutral-300">
                        {narrative.main_argument}
                    </p>
                </div>
            </div>

            <div className="group-hover:border-primary/30 mt-6 border-t border-neutral-800/50 pt-4 transition-colors">
                <div className="flex items-center justify-end gap-2 text-primary">
                    <span className="text-sm font-medium">Selecionar</span>
                    <FaArrowRight className="h-4 w-4" />
                </div>
            </div>
        </div>
    );
}
