export function toCase(text: string, replacementFunction: (key: string) => string): string {
    return replacementFunction(text);
}
