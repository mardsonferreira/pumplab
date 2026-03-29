export type Dictionary<T> = { [key: string]: T | Dictionary<T> | Array<T> };
