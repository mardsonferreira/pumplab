import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { LoginLink } from "@/components/layout/LoginButton";
import { Menu } from "@/components/common/menu";
import { SubscriptionWithPlan } from "@/types";

export async function Header() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("subscription")
        .select(`
            status,
            started_at,
            plan (
                name,
                price,
                monthly_narratives
            )
            `
        )
        .eq("profile_id", user?.id)
        .eq("status", "active")
        .single<SubscriptionWithPlan>();

    if (error) {
        console.error(error);
    }

    const monthlyNarratives = data?.plan?.monthly_narratives ?? 0;

    return (
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 w-full border-b border-neutral-800/60 backdrop-blur">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={user ? "/dashboard" : "/"}
                            className="group relative transition-all duration-200 hover:opacity-90 active:scale-[0.98]">
                            <h1 className="to-foreground/80 group-hover:to-primary/80 bg-gradient-to-r from-foreground bg-clip-text text-xl font-bold text-foreground transition-all duration-200 group-hover:from-primary">
                                PumpLab
                            </h1>
                        </Link>
                        {user && (
                            <>
                                <div className="h-6 w-px bg-gradient-to-b from-transparent via-neutral-700 to-transparent" />
                                <div className="flex items-center gap-2">
                                    <span className="text-foreground/70 text-sm font-medium">
                                        {monthlyNarratives} Narrativas restantes
                                    </span>
                                    <div className="bg-primary/60 h-1.5 w-1.5 animate-pulse rounded-full" />
                                </div>
                            </>
                        )}
                    </div>
                    <nav className="flex items-center gap-3">
                        {!user && (
                            <div className="flex items-center gap-2">
                                <Link href="/pricing" className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200">Planos</Link>
                                <div className="h-6 w-px bg-gradient-to-b from-transparent via-neutral-700 to-transparent" />
                                <LoginLink />
                            </div>
                        )}
                        {user && (
                           <Menu user={user} />
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
