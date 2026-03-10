import { z } from "zod";

export const ServerEnvironmentSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string(),
});

export type Environment = z.infer<typeof ServerEnvironmentSchema>;

export const env = ServerEnvironmentSchema.parse(process.env);
