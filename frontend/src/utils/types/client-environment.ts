import { z } from "zod";

export const ClientEnvironmentSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string(),
});

export type Environment = z.infer<typeof ClientEnvironmentSchema>;

export const env = ClientEnvironmentSchema.parse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
