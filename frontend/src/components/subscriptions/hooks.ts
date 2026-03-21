import { HttpUtil } from "@/utils/common/http";
import { deleteSubscription } from "@/utils/api/subscriptions/delete-subscription";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface useSubscriptionsReturnType {
    loading: boolean;
    handleCancelSubscription: (subscriptionId: string) => Promise<void>;

}

export function useSubscriptions(httpUtil: HttpUtil): useSubscriptionsReturnType {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleCancelSubscription = async (subscriptionId: string) => {
        try {
            setLoading(true);
            await deleteSubscription(httpUtil, subscriptionId);
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return { loading, handleCancelSubscription };
}