"use client";

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
                className="hover:bg-primary/10 group flex items-center justify-center rounded-md p-2 transition-colors duration-200"
                aria-label="Assinar plano premium">
                <span className={cn("inline-flex items-center justify-center", iconClassName, "text-primary")}>
                <GrUpgrade size={20} />
            </span>
            </Link>
        );
    }

    return (
        <Button
            variant="primary"
            className="shadow-primary/10 hover:shadow-primary/20 h-10 text-base shadow-lg transition-all duration-200"
            asChild>
            <Link href="/pricing" className="group">
                <span className={cn("mr-2 inline-flex items-center justify-center", iconClassName)}>
                <GrUpgrade size={20} />
            </span>
                Assinar
            </Link>
        </Button>
    );
}
