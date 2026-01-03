import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { LoginButton } from "./LoginButton";
import Link from "next/link";

export async function Header() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="border-b border-neutral-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href={user ? "/dashboard" : "/"}>
              <h1 className="text-xl font-bold text-foreground">PumpLab</h1>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            {!user && <LoginButton />}
            {user && (
              <Link
                href="/dashboard"
                className="text-sm text-neutral-400 hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

