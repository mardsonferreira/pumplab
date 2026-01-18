import { cn } from "@/utils/cn";

interface SuggestionsProps {
    disabled?: boolean;
    onClick: (suggestion: string) => void;
}

const suggestions: readonly string[] = [
    "Consistência vence a motivação",
    "O Real Significado de \"Ser Saudável\"",
    "Pequenos Hábitos Diários Que Mudam o Seu Corpo e a sua Mente",
    "Porque a Maioria das Pessoas Desistem — e Como Evitar Isso",
    "O Treino Não É Sobre a Academia — É Sobre a Identidade",
] as const;

export function Suggestions({ disabled, onClick }: SuggestionsProps) {
    return (
        <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            role="group"
            aria-label="Sugestões de temas para narrativas"
        >
            {suggestions.map((suggestion) => (
                <button
                    key={suggestion}
                    type="button"
                    disabled={disabled}
                    onClick={() => onClick(suggestion)}
                    className={buttonStyle}
                    aria-label={`Usar sugestão: ${suggestion}`}
                >
                    {suggestion}
                </button>
            ))}
        </div>
    )
}

const buttonStyle = cn(
    "min-h-12 px-4 py-2 rounded-md text-sm transition-all duration-200",
    "border border-neutral-800 bg-neutral-900/50 text-neutral-300",
    "hover:border-primary/50 hover:text-primary hover:bg-neutral-900/70",
    "active:scale-[0.98] active:bg-neutral-900/80",
    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-neutral-800 disabled:hover:text-neutral-300 disabled:hover:bg-neutral-900/50",
    "text-left"
)