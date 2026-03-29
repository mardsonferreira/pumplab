"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@supabase/supabase-js";

import { Plan } from "@/types";
import { apiFetch, BackendUnavailableError } from "@/lib/api/client";
import { useGoogleLogin } from "@/app/hooks/google-login";
import { deleteSubscription } from "@/utils/api/subscriptions/delete-subscription";
import { httpUtil } from "@/utils/common/http/client";
import { createCheckoutSession } from "@/utils/api/stripe/create-checkout-session";

type ActiveSubscription = {
    id: string;
    stripe_subscription_id: string;
    plan: {
        name: string;
        price: number;
        monthly_narratives: number;
    };
};

export function useSubscriptionConfirm(user: User | null, plans: Plan[]) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { handleGoogleLogin } = useGoogleLogin();

    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);
    const [isFetchingSubscription, setIsFetchingSubscription] = useState(false);

    useEffect(() => {
        if (!user) {
            setActiveSubscription(null);
            return;
        }

        let cancelled = false;

        async function fetchActiveSubscription() {
            setIsFetchingSubscription(true);
            try {
                const res = await apiFetch(`/subscriptions/profile/${user!.id}`);
                if (!res.ok) return;
                const data = await res.json();
                if (!cancelled) {
                    setActiveSubscription(data.id ? (data as ActiveSubscription) : null);
                }
            } catch {
                // non-fatal — the user can still subscribe
            } finally {
                if (!cancelled) setIsFetchingSubscription(false);
            }
        }

        fetchActiveSubscription();
        return () => { cancelled = true; };
    }, [user]);

    // After login redirect, auto-open the confirm modal for the plan the user chose
    useEffect(() => {
        const planId = searchParams.get("planId");
        if (!planId || !user || plans.length === 0) return;

        const plan = plans.find((p) => p.id === planId);
        if (plan) {
            setSelectedPlan(plan);
            setIsModalOpen(true);
        }

        const url = new URL(window.location.href);
        url.searchParams.delete("planId");
        router.replace(url.pathname + url.search, { scroll: false });
    }, [searchParams, user, plans, router]);

    const handleSelectPlan = useCallback(
        (planId: string) => {
            if (!user) {
                handleGoogleLogin(`/pricing?planId=${encodeURIComponent(planId)}`);
                return;
            }

            const plan = plans.find((p) => p.id === planId) ?? null;
            setSelectedPlan(plan);
            setError(null);
            setIsModalOpen(true);
        },
        [user, plans, handleGoogleLogin],
    );

    const handleConfirm = useCallback(async () => {
        if (!selectedPlan) return;

        try {
            setIsLoading(true);
            setError(null);

            if (activeSubscription?.id) {
                await deleteSubscription(httpUtil, activeSubscription.id);
            }

            if (!user) {
                handleGoogleLogin(`/pricing?planId=${encodeURIComponent(selectedPlan.id)}`);
                return;
            }

            const { url } = await createCheckoutSession({ planId: selectedPlan.id });
            window.location.href = url;
        } catch (err) {
            const message =
                err instanceof BackendUnavailableError
                    ? err.message
                    : err instanceof Error
                      ? err.message
                      : "Erro ao confirmar assinatura. Tente novamente.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [selectedPlan, activeSubscription, handleGoogleLogin]);

    return {
        selectedPlan,
        isModalOpen,
        setIsModalOpen,
        isLoading,
        error,
        activeSubscription,
        isFetchingSubscription,
        handleSelectPlan,
        handleConfirm,
    };
}
