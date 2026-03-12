import { HttpUtil } from "@/utils/common/http";

import { Subscription } from "@/types";

export type SubscriptionResponse = Subscription & {
    nextChargeAt: string | null;
    cardBrand: string | null;
    cardLastDigits: string | null;
    cardExpiresAt: string | null;
};

export async function fetchSubscriptions(httpUtil: HttpUtil, profileId: string) {
    const subscriptions = await httpUtil.get<SubscriptionResponse>(`/subscriptions/profile/${profileId}`);
    return subscriptions;
}