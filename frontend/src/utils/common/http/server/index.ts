import { env } from "@/utils/types/server-environment";
import { RequestInit } from "@/utils/common/http";
import { objectToCamelCase } from "@/utils/common/string/object-to-camel-case";

const DEFAULT_HEADERS = {
    "Content-Type": "application/json",
};

async function getHeaders() {
    return {
        ...DEFAULT_HEADERS,
    };
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
        headers: await getHeaders(),
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${path}`);
    }
    const result = await response.json();

    return objectToCamelCase(result) as T;
}

export const httpUtil = {
    get,
};