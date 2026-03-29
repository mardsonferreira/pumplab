import { httpUtil } from "@/utils/common/http/client";

import { CreateCheckoutSessionPayload, CreateCheckoutSessionResponse } from "./types";

export async function createCheckoutSession(
    payload: CreateCheckoutSessionPayload,
): Promise<CreateCheckoutSessionResponse> {
    console.log("createCheckoutSession", payload);
    const data = await httpUtil.post<CreateCheckoutSessionResponse>("/stripe/create-checkout-session", {
        body: payload,
    });
    if (!data?.url) {
        throw new Error("Resposta inválida do servidor.");
    }
    return { url: data.url };
}