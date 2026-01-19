import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { LoginButton } from "@/components/layout/LoginButton";
import { Menu } from "@/components/common/menu";
import { UpgradeButton } from "@/components/common/upgradeButton";

export async function Header() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={user ? "/dashboard" : "/"}
              className="group relative transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              <h1 className="text-xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text transition-all duration-200 group-hover:from-primary group-hover:to-primary/80">
                PumpLab
              </h1>
            </Link>
            {user && (
              <>
                <div className="h-6 w-px bg-gradient-to-b from-transparent via-neutral-700 to-transparent" />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground/70">
                    5 Narrativas restantes
                  </span>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse" />
                </div>
              </>
            )}
          </div>
          <nav className="flex items-center gap-3">
            {!user && <LoginButton />}
            {user && (
              <>
                <UpgradeButton />
                <Menu user={user} />
              </>
            )}
          </nav>
        </div>
      </div>
    </header >
  )
}

