const DEFAULT_API_URL = "http://localhost:8000";

export function getApiUrl(): string {
    if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
    }
    return DEFAULT_API_URL;
}

export class BackendUnavailableError extends Error {
    constructor(message = "Serviço indisponível. Tente novamente em instantes.") {
        super(message);
        this.name = "BackendUnavailableError";
    }
}

async function getAuthBearerToken(): Promise<string | null> {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const { getSupabaseBrowserClient } = await import("@/lib/supabase/browser-client");
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            return null;
        }

        return data.session?.access_token ?? null;
    } catch {
        return null;
    }
}

export async function apiFetch(
    path: string,
    options: RequestInit & { parseJson?: boolean } = {},
): Promise<Response> {
    const { parseJson = true, ...init } = options;
    const url = `${getApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;
    const headers = new Headers(init.headers ?? {});

    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    // Keep backend cookie auth for same-origin setups and attach Bearer when available
    // to support cross-domain deployments.
    if (!headers.has("Authorization")) {
        const accessToken = await getAuthBearerToken();
        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);
        }
    }

    let res: Response;
    try {
        res = await fetch(url, {
            ...init,
            credentials: "include",
            headers,
        });
    } catch (err) {
        if (err instanceof Error && (err.name === "TypeError" || err.message.includes("fetch"))) {
            throw new BackendUnavailableError();
        }
        throw err;
    }
    if (res.status === 502 || res.status === 503 || res.status === 504) {
        throw new BackendUnavailableError();
    }
    return res;
}
