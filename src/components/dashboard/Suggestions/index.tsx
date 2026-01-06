import { cn } from "@/utils/cn";

interface SuggestionsProps {
    onClick: (suggestion: string) => void;
}

const suggestions = [
    "Consistência vence a motivação",
    "O Real Significado de “Ser Saudável”",
    "Pequenos Hábitos Diários Que Mudam o Seu Corpo e a sua Mente",
    "Porque a Maioria das Pessoas Abandonam — e Como Evitar Isso",
    "O Treino Não É Sobre a Academia — É Sobre a Identidade",
]

export function Suggestions({ onClick }: SuggestionsProps) {
    return (
        <div className="mt-4">
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => onClick(suggestion)}
                        className={cn(
                            "px-4 py-2 rounded-md text-sm transition-colors",
                            "border border-neutral-800 bg-neutral-900/50 text-neutral-300",
                            "hover:border-primary/50 hover:text-primary",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                        )}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    )
}