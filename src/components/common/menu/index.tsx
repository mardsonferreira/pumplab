"use client";
import { MdLogout, MdMenu } from "react-icons/md";
import { User } from "@supabase/supabase-js";

import { useMobile } from "@/app/hooks/use-mobile";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/utils/cn";

interface MenuProps {
    user: User;
}

export function Menu({ user }: MenuProps) {
    const isMobile = useMobile();

    const UserAvatarAndName = ({ variant = "trigger" }: { variant?: "trigger" | "item" }) => {
        const avatar = (
            <div className="w-8 h-8 rounded-full border-2 border-primary/30 overflow-hidden ring-2 ring-neutral-800">
                <img src={user.user_metadata.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
        );
        const name = (
            <span className="text-sm text-foreground font-medium">
                Olá, {user.user_metadata.name}
            </span>
        );

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
    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger
                className={cn(
                    "outline-none focus:outline-none",
                    isMobile
                        ? "p-2 rounded-md transition-colors hover:bg-neutral-900/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        : "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-neutral-900/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
            >
                {isMobile ? (
                    <MdMenu className="w-6 h-6 text-foreground" />
                ) : (
                    <UserAvatarAndName />
                )}
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className={cn(
                        "min-w-[200px] rounded-lg border border-neutral-800/60",
                        "bg-gradient-to-br from-neutral-900/95 to-neutral-900/90",
                        "backdrop-blur-sm shadow-xl shadow-black/50",
                        "p-1 z-50",
                        "transition-all duration-200"
                    )}
                    sideOffset={8}
                    align={isMobile ? "end" : "end"}
                >
                    {isMobile && (
                        <DropdownMenu.Item className="flex items-center px-2 py-4" >
                            <UserAvatarAndName variant="item" />
                        </DropdownMenu.Item>
                    )}
                    <DropdownMenu.Item
                        className={cn(
                            "relative flex items-center px-3 py-2.5 rounded-md text-sm",
                            "text-foreground cursor-pointer outline-none",
                            "transition-colors",
                            "focus:bg-neutral-800/50 focus:text-primary",
                            "hover:bg-neutral-800/50 hover:text-primary",
                            "data-[highlighted]:bg-neutral-800/50 data-[highlighted]:text-primary"
                        )}
                    >
                        Gerenciar assinatura
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="h-px bg-neutral-800/60 my-1" />
                    <DropdownMenu.Item
                        className={cn(
                            "relative flex items-center gap-2 px-3 py-2.5 rounded-md text-sm",
                            "text-foreground cursor-pointer outline-none",
                            "transition-colors",
                            "focus:bg-neutral-800/50 focus:text-error",
                            "hover:bg-neutral-800/50 hover:text-error",
                            "data-[highlighted]:bg-neutral-800/50 data-[highlighted]:text-error"
                        )}
                    >
                        <MdLogout className="w-4 h-4" />
                        Sair
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}