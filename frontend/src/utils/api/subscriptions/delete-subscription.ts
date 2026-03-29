import { HttpUtil } from "@/utils/common/http";

export async function deleteSubscription(httpUtil: HttpUtil, subscriptionId: string) {
    const response = await httpUtil.del(`/subscriptions/${subscriptionId}`);
    return response;
}