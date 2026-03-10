export type RequestInit = Omit<Parameters<typeof fetch>[1], "body"> & {
    body?: Record<string, any>;
    headers?: Record<string, string> | Headers;
};

export interface HttpUtil {
    get<T>(path: string, init?: RequestInit): Promise<T>;
}