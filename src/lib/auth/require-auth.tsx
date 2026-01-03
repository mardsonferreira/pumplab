import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export async function requireAuth(children: ReactNode) {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log("ERROR", error);
    console.log("USER", user);

    if (error || !user) {
        redirect("/");
    }

    return <>{children}</>;
}

