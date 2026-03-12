from fastapi import APIRouter, HTTPException

from app.api.deps import get_supabase_client
from app.services import stripe_service

router = APIRouter()


@router.get("/profile/{profile_id}")
async def get_subscription(profile_id: str):
    supabase = next(get_supabase_client())

    profile = supabase.table("profile").select("id").eq("id", profile_id).execute()
    if not profile.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    subscription = (
        supabase.table("subscription")
        .select("id, status, started_at, ends_at, stripe_subscription_id, plan (name, price, monthly_narratives)")
        .eq("profile_id", profile_id)
        .eq("status", "active")
        .single()
        .execute()
    )

    if not subscription.data:
        raise HTTPException(status_code=404, detail="Subscription not found")

    data = dict(subscription.data) if isinstance(subscription.data, dict) else subscription.data

    stripe_sub_id = data.get("stripe_subscription_id")
    payment_info = stripe_service.get_subscription_payment_info(stripe_sub_id) if stripe_sub_id else None
    if payment_info:
        data["next_charge_at"] = payment_info.get("next_charge_at")
        data["card_brand"] = payment_info.get("card_brand")
        data["card_last_digits"] = payment_info.get("card_last4")
        data["card_expires_at"] = payment_info.get("card_expires_at")

    return data