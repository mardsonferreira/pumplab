import { Plan } from "@/types";

const revalidate = 60 * 60; // 1h

const DEFAULT_API_URL = "http://localhost:8000";

function getApiUrl(): string {
    return (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/$/, "");
}

export async function retrievePlans(): Promise<Plan[]> {
    const res = await fetch(`${getApiUrl()}/plans`, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch plans (${res.status})`);
    }

    return (await res.json()) as Plan[];
}
