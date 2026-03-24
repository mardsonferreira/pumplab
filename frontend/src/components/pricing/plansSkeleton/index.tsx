export function PlansSkeleton() {
    return (
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className={`relative rounded-lg border p-8 ${
                        index === 1 ? "border-primary bg-neutral-900/70" : "border-neutral-800 bg-neutral-900/50"
                    }`}>
                    {index === 1 && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <div className="h-7 w-28 rounded-full bg-primary/40" />
                        </div>
                    )}
                    <div className="mb-6 space-y-3">
                        <div className="h-7 w-40 rounded bg-neutral-800 animate-pulse" />
                        <div className="h-4 w-full rounded bg-neutral-800/70 animate-pulse" />
                        <div className="h-4 w-2/3 rounded bg-neutral-800/70 animate-pulse" />
                    </div>
                    <div className="mb-6 space-y-3">
                        <div className="flex items-baseline gap-2">
                            <div className="h-8 w-10 rounded bg-neutral-800 animate-pulse" />
                            <div className="h-10 w-28 rounded bg-neutral-800 animate-pulse" />
                        </div>
                        <div className="h-4 w-20 rounded bg-neutral-800/70 animate-pulse" />
                    </div>
                    <div className="mb-8 space-y-4">
                        <div className="h-4 w-4/5 rounded bg-neutral-800/70 animate-pulse" />
                        <div className="h-4 w-3/5 rounded bg-neutral-800/70 animate-pulse" />
                    </div>
                    <div className="h-11 w-full rounded-md bg-neutral-800 animate-pulse" />
                </div>
            ))}
        </div>
    );
}