"use client";

import { Button } from "@/components/ui/Button";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { cn } from "@/utils/cn";
import { useCallback, useState } from "react";

type LoginSharedProps = {
    nextPath?: string;
};

function useGoogleLogin({ nextPath = "/dashboard" }: LoginSharedProps = {}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const supabase = getSupabaseBrowserClient();
            const { error: signInError } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
                        nextPath,
                    )}`,
                },
            });

            if (signInError) {
                throw signInError;
            }
        } catch (err) {
            console.error("Error signing in with Google:", err);
            setError(err instanceof Error ? err.message : "Failed to sign in. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [nextPath]);

    return { handleGoogleLogin, isLoading, error };
}

export function LoginButton({ nextPath = "/dashboard" }: LoginSharedProps) {
    const { handleGoogleLogin, isLoading, error } = useGoogleLogin({ nextPath });

    return (
        <div className="flex flex-col items-center gap-2">
            <Button variant="primary" onClick={handleGoogleLogin} disabled={isLoading}>
                {isLoading ? "Carregando..." : "Começar Agora"}
            </Button>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

type LoginLinkProps = LoginSharedProps & {
    label?: string;
    className?: string;
};

export function LoginLink({ label = "Entrar", nextPath = "/dashboard", className }: LoginLinkProps) {
    const { handleGoogleLogin, isLoading, error } = useGoogleLogin({ nextPath });

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
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
