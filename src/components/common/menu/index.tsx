"use client";
import { MdLogout, MdMenu } from "react-icons/md";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

import { useMobile } from "@/app/hooks/use-mobile";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/utils/cn";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

interface MenuProps {
    user: User;
}

export function Menu({ user }: MenuProps) {
    const isMobile = useMobile();
    const router = useRouter();

    async function handleLogout() {
        const supabase = getSupabaseBrowserClient();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    }

    const UserAvatarAndName = ({ variant = "trigger" }: { variant?: "trigger" | "item" }) => {
        const avatar = (
            <div className="border-primary/30 h-8 w-8 overflow-hidden rounded-full border-2 ring-2 ring-neutral-800">
                <img src={user.user_metadata.avatar_url} alt="User Avatar" className="h-full w-full object-cover" />
            </div>
        );
        const name = <span className="text-sm font-medium text-foreground">Olá, {user.user_metadata.name}</span>;

        return (
            <div className="flex items-center gap-2">
                {variant === "trigger" ? (
                    <>
                        {name}
                        {avatar}
                    </>
                ) : (
                    <>
                        {avatar}
                        {name}
                    </>
                )}
            </div>
        );
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger
                className={cn(
                    "outline-none focus:outline-none",
                    isMobile
                        ? "rounded-md p-2 transition-colors hover:bg-neutral-900/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        : "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-neutral-900/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                )}>
                {isMobile ? <MdMenu className="h-6 w-6 text-foreground" /> : <UserAvatarAndName />}
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className={cn(
                        "min-w-[200px] rounded-lg border border-neutral-800/60",
                        "bg-gradient-to-br from-neutral-900/95 to-neutral-900/90",
                        "shadow-xl shadow-black/50 backdrop-blur-sm",
                        "z-50 p-1",
                        "transition-all duration-200",
                    )}
                    sideOffset={8}
                    align={isMobile ? "end" : "end"}>
                    {isMobile && (
                        <DropdownMenu.Item className="flex items-center px-2 py-4">
                            <UserAvatarAndName variant="item" />
                        </DropdownMenu.Item>
                    )}
                    <DropdownMenu.Item
                        className={cn(
                            "relative flex items-center rounded-md px-3 py-2.5 text-sm",
                            "cursor-pointer text-foreground outline-none",
                            "transition-colors",
                            "focus:bg-neutral-800/50 focus:text-primary",
                            "hover:bg-neutral-800/50 hover:text-primary",
                            "data-[highlighted]:bg-neutral-800/50 data-[highlighted]:text-primary",
                        )}>
                        Gerenciar assinatura
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="my-1 h-px bg-neutral-800/60" />
                    <DropdownMenu.Item
                        className={cn(
                            "relative flex items-center gap-2 rounded-md px-3 py-2.5 text-sm",
                            "cursor-pointer text-foreground outline-none",
                            "transition-colors",
                            "focus:bg-neutral-800/50 focus:text-error",
                            "hover:bg-neutral-800/50 hover:text-error",
                            "data-[highlighted]:bg-neutral-800/50 data-[highlighted]:text-error",
                        )}
                        onClick={handleLogout}>
                        <MdLogout className="h-4 w-4" />
                        Sair
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
