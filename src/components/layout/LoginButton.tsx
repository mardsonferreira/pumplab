"use client";

import { Button } from "@/components/ui/Button";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useState } from "react";

export function LoginButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleGoogleLogin() {
        try {
            setIsLoading(true);
            setError(null);

            const supabase = getSupabaseBrowserClient();
            const { error: signInError } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
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
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <Button variant="primary" onClick={handleGoogleLogin} disabled={isLoading}>
                {isLoading ? "Carregando..." : "Gerar Conteúdo"}
            </Button>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
