import { Dictionary } from "@/utils/common/string/types";

export function objectToCase<T = unknown>(
    obj: T | Dictionary<T> | Array<T>,
    replacementFunction: (key: string) => string,
    includePropValues: string[] = [],
): T | Dictionary<T> | Array<T> {
    if (obj && typeof obj === "object" && (obj as any).getTime === undefined) {
        if (typeof (obj as Array<T>).map === "function") {
            return (obj as Array<T>).map(item => objectToCase(item, replacementFunction, includePropValues) as T);
        } else {
            const _res: Dictionary<T> = {};
            Object.entries(obj).forEach(([_key, _val]) => {
                if (includePropValues.includes(_key) && typeof _val === "string") {
                    _res[replacementFunction(_key)] = replacementFunction(_val) as unknown as T;
                } else {
                    _res[replacementFunction(_key)] = objectToCase(_val as T, replacementFunction, includePropValues);
                }
            });
            return _res;
        }
    }

    return obj;
}
