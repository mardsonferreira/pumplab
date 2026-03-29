import { env } from "@/utils/types/client-environment";
import { RequestInit } from "@/utils/common/http";
import { objectToCamelCase } from "@/utils/common/string/object-to-camel-case";
import { objectToSnakeCase } from "@/utils/common/string/object-to-snake-case";

const DEFAULT_HEADERS = {
    "Content-Type": "application/json",
};

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

async function getHeaders() {
    const headers: Record<string, string> = {
        ...DEFAULT_HEADERS,
    };

    const accessToken = await getAuthBearerToken();
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return headers;
}

function getUrl(path: string) {
    return `${env.NEXT_PUBLIC_API_URL}${path}`.replace(
        /([^:])\/+/g,
        "$1/",
    );
}

async function get<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(getUrl(path), {
        ...init,
        body: undefined,
        method: "GET",
        credentials: "include",
        headers: await getHeaders(),
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${path}`);
    }
    const result = await response.json();

    return objectToCamelCase(result) as T;
}

async function del<T>(path: string, init: RequestInit = {}): Promise<T> {
    const body = init.body ? JSON.stringify(objectToSnakeCase(init.body)) : undefined;

    const response = await fetch(getUrl(path), {
        ...init,
        method: "DELETE",
        credentials: "include",
        headers: await getHeaders(),
        body,
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${path}`);
    }
    const result = await response.json();

    return objectToCamelCase(result) as T;
}

async function post<T>(path: string, init: RequestInit = {}): Promise<T> {
    const body = init.body ? JSON.stringify(objectToSnakeCase(init.body)) : undefined;

    const response = await fetch(getUrl(path), {
        ...init,
        method: "POST",
        credentials: "include",
        headers: await getHeaders(),
        body,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${path}`);
    }

    const result = await response.json();

    return objectToCamelCase(result) as T;
}

async function postBlob(path: string, init: RequestInit = {}): Promise<Blob> {
    const body = init.body ? JSON.stringify(objectToSnakeCase(init.body)) : undefined;

    const response = await fetch(getUrl(path), {
        ...init,
        method: "POST",
        credentials: "include",
        headers: await getHeaders(),
        body,
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
            (errorBody as { error?: string }).error ?? `Failed to fetch ${path}`;
        throw new Error(message);
    }

    return response.blob();
}

export const httpUtil = {
    get,
    del,
    post,
    postBlob,
};