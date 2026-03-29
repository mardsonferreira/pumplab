import { toCase } from "@/utils/common/string/to-case";

const CACHE_SC = new Map<string, string>();
export function toSnakeCase(text: string): string {
    if (CACHE_SC.has(text)) {
        return CACHE_SC.get(text) as string;
    }

    CACHE_SC.set(
        text,
        toCase(text, key => key.replace(/([a-z])([A-Z])/g, (_, a, b) => `${a}_${b}`.toLowerCase())),
    );
    return CACHE_SC.get(text) as string;
}
