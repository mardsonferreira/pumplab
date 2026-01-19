"use client"

import { GrUpgrade } from "react-icons/gr";
import Link from "next/link";
import { cn } from "@/utils/cn";

import { Button } from "@/components/ui/Button";
import { useMobile } from "@/app/hooks/use-mobile";

const iconClassName = "w-5 h-5 transition-transform duration-200 group-hover:scale-110";

export function UpgradeButton() {
    const isMobile = useMobile();

    if (isMobile) {
        return (
            <Link
                href="/pricing"
                className="group flex items-center justify-center p-2 rounded-md hover:bg-primary/10 transition-colors duration-200"
                aria-label="Assinar plano premium"
            >
                <GrUpgrade className={cn(iconClassName, "text-primary")} />
            </Link>
        );
    }

    return (
        <Button
            variant="primary"
            className="text-base h-10 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-200"
            asChild
        >
            <Link href="/pricing" className="group">
                <GrUpgrade className={cn(iconClassName, "mr-2")} />
                Assinar
            </Link>
        </Button>
    );
}