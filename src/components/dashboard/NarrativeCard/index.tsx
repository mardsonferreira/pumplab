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
    }

    return (
        <div
            className={cn(
                "group relative p-6 rounded-xl border border-neutral-800/60",
                "bg-gradient-to-br from-neutral-900/40 to-neutral-900/20",
                "flex flex-col justify-between min-h-[240px]",
                "transition-all duration-300 cursor-pointer",
                "hover:border-primary/60 hover:bg-gradient-to-br hover:from-neutral-900/60 hover:to-neutral-900/40",
                "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
            )}
            onClick={handleClick}
        >
            <div className="flex-1 flex flex-col">
                <div className="flex items-start gap-2 mb-3">
                    <FaLightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <h3 className="text-lg font-bold text-primary leading-tight line-clamp-2">
                        {narrative.central_thesis}
                    </h3>
                </div>

                <div className="h-px w-12 bg-gradient-to-r from-primary/50 to-transparent mb-4" />

                <div className="flex items-start gap-2 flex-1">
                    <FaMessage className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-neutral-300 leading-relaxed line-clamp-4 flex-1">
                        {narrative.main_argument}
                    </p>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800/50 group-hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-end gap-2 text-primary">
                    <span className="text-sm font-medium">Selecionar</span>
                    <FaArrowRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    )
}