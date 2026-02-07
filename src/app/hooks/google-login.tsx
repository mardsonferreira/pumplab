import { useCallback, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export function useGoogleLogin({ nextPath = "/dashboard" }: { nextPath?: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = useCallback(
        async (overrideNextPath?: string) => {
            const redirectPath = overrideNextPath ?? nextPath;
            try {
                setIsLoading(true);
                setError(null);

                const supabase = getSupabaseBrowserClient();
                const { error: signInError } = await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
                            redirectPath,
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
        },
        [nextPath],
    );

    return { handleGoogleLogin, isLoading, error };
}