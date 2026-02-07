"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { useGoogleLogin } from "@/app/hooks/google-login";

export function LoginButton({ nextPath = "/dashboard" }: { nextPath?: string }) {
    const { handleGoogleLogin, isLoading, error } = useGoogleLogin({ nextPath });

    return (
        <div className="flex flex-col items-center gap-2">
            <Button variant="primary" onClick={() => handleGoogleLogin()} disabled={isLoading}>
                {isLoading ? "Carregando..." : "Começar Agora"}
            </Button>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

export function LoginLink({ label = "Entrar", nextPath = "/dashboard", className }: { nextPath?: string; label?: string; className?: string; }) {
    const { handleGoogleLogin, isLoading, error } = useGoogleLogin({ nextPath });

    return (
        <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
            aria-busy={isLoading}
            title={error ?? undefined}
            className={cn(
                "text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary disabled:pointer-events-none disabled:opacity-50",
                className,
            )}>
            {label}
        </button>
    );
}
