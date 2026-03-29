import { Dictionary } from "@/utils/common/string/types";
import { objectToCase } from "@/utils/common/string/object-to-case";
import { toCamelCase } from "@/utils/common/string/to-camel-case";

/**
 * Receives an object and converts all its keys
 * to camel case.
 *
 * @param obj: The object to have all its properties converted to camel case.
 * @param includePropValues: These given properties will have its values also converted.
 * */
export function objectToCamelCase<T = unknown>(
    obj: T | Dictionary<T> | Array<T>,
    includePropValues: string[] = [],
): T | Dictionary<T> | Array<T> {
    return objectToCase(obj, key => toCamelCase(key), includePropValues);
}
