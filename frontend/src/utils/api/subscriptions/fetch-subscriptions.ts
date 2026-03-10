import { HttpUtil } from "@/utils/common/http";

import { SubscriptionResponse } from "./types";

export async function fetchSubscriptions(httpUtil: HttpUtil, profileId: string) {
    const subscriptions = await httpUtil.get<SubscriptionResponse>(`/subscriptions/profile/${profileId}`);
    return subscriptions;
}