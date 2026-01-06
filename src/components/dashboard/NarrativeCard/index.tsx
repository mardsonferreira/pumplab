import { cn } from "@/utils/cn";
import { FaArrowRight } from "react-icons/fa6";
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
                "p-6 rounded-lg border border-neutral-800 bg-neutral-900/20 flex flex-col justify-between",
                "hover:border-primary/50 transition-all duration-200 cursor-pointer hover:bg-neutral-900/50",
                "hover:shadow-lg hover:shadow-primary/10"
            )}
            onClick={handleClick}
        >
            <div>
                <h3 className="text-md text-primary font-bold mb-4">{narrative.central_thesis}</h3>
                <p className="text-foreground leading-relaxed">{narrative.main_argument}</p>
            </div>

            <div className="flex items-center justify-end mt-4">
                <span className="text-primary text-sm">Selecionar</span>
                <FaArrowRight className="w-4 h-4 text-primary ml-2" />
            </div>
        </div>
    )
}