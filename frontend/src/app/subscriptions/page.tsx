import { Subscriptions } from "@/components/subscriptions";
import { fetchSubscriptions } from "@/utils/api/subscriptions/fetch-subscriptions";
import { httpUtil } from "@/utils/common/http/server";

export default async function SubscriptionsPage() {
    const subscriptions = await fetchSubscriptions(httpUtil, "123");
    console.log(subscriptions);

    return (
        <Subscriptions />
    );
}