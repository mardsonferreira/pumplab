import { Dictionary } from "@/utils/common/string/types";
import { objectToCase } from "@/utils/common/string/object-to-case";
import { toSnakeCase } from "@/utils/common/string/to-snake-case";

/**
 * Receives an object and converts all its keys
 * to pascal case.
 * */
export function objectToSnakeCase<T = unknown>(
    obj: T | Dictionary<T> | Array<T>,
    includePropValues: string[] = [],
): T | Dictionary<T> | Array<T> {
    return objectToCase(obj, key => toSnakeCase(key), includePropValues);
}
