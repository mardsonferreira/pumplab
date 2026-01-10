"use client"

import * as React from "react"
import { cn } from "@/utils/cn"

export interface WaveLoadingProps {
    className?: string
    size?: "sm" | "md" | "lg"
    color?: "primary" | "accent" | "foreground"
}

const WaveLoading = React.forwardRef<HTMLDivElement, WaveLoadingProps>(
    ({ className, size = "md", color = "primary", ...props }, ref) => {
        const sizeClasses = {
            sm: "h-4 w-1",
            md: "h-6 w-1.5",
            lg: "h-8 w-2",
        }

        const colorClasses = {
            primary: "bg-primary",
            accent: "bg-accent",
            foreground: "bg-foreground",
        }

        return (
            <div
                ref={ref}
                className={cn("flex items-center justify-center gap-1", className)}
                {...props}
            >
                {[0, 1, 2, 3, 4].map((index) => (
                    <div
                        key={index}
                        className={cn(
                            "rounded-full animate-wave",
                            sizeClasses[size],
                            colorClasses[color]
                        )}
                        style={{
                            animationDelay: `${index * 0.1}s`,
                            animationDuration: "1s",
                        }}
                    />
                ))}
            </div>
        )
    }
)

WaveLoading.displayName = "WaveLoading"

export { WaveLoading }
