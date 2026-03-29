import { Subscriptions } from "@/components/subscriptions";
import { fetchSubscriptions } from "@/utils/api/subscriptions/fetch-subscriptions";
import { httpUtil } from "@/utils/common/http/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";

export default async function SubscriptionsPage() {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
        redirect("/");
    }
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/");
    }

    const subscription = await fetchSubscriptions(httpUtil, user.id);

    if (!subscription.id) {
        redirect("/pricing");
    }

    return (
        <Subscriptions subscription={subscription} />
    );
}