import { HttpUtil } from "@/utils/common/http";
import { deleteSubscription } from "@/utils/api/subscriptions/delete-subscription";

export function useSubscriptions(httpUtil: HttpUtil) {
    const handleCancelSubscription = async (subscriptionId: string) => {
        try {
            const response = await deleteSubscription(httpUtil, subscriptionId);
            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    return { handleCancelSubscription };
}