export function parseNarratives(raw: string) {
    if (!raw) return [];

    let normalized = raw.trim();

    normalized = normalized.replace(/'/g, '"');

    try {
        return JSON.parse(normalized);
    } catch (error) {
        console.error('Failed to parse narratives:', error);
        return [];
    }
}

export function parseCarousel(raw: string) {
    if (!raw) return {};

    let normalized = raw.trim();

    normalized = normalized.replace(/'/g, '"');

    try {
        return JSON.parse(normalized);
    } catch (error) {
        console.error('Failed to parse carousel:', error);
        return {};
    }
}