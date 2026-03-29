import { toCase } from "@/utils/common/string/to-case";

const CACHE_CC = new Map<string, string>();
export function toCamelCase(text: string): string {
    if (CACHE_CC.has(text)) {
        return CACHE_CC.get(text) as string;
    }

    CACHE_CC.set(
        text,
        toCase(text, key => key.replace(/_(\w)/g, (__, match) => match.toUpperCase())),
    );
    return CACHE_CC.get(text) as string;
}
