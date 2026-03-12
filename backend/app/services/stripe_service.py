from datetime import datetime

import stripe
from supabase import Client

from app.core.config import get_settings


def get_stripe():
    settings = get_settings()
    stripe.api_key = settings.STRIPE_SECRET_KEY
    return stripe


def create_checkout_session(
    supabase: Client,
    user_id: str,
    user_email: str | None,
    user_display_name: str | None,
    plan_id: str,
    success_url: str,
    cancel_url: str,
) -> str:
    st = get_stripe()
    plan_row = (
        supabase.table("plan")
        .select("id, stripe_price_id, name")
        .eq("id", plan_id)
        .single()
        .execute()
    )
    plan = plan_row.data if hasattr(plan_row, "data") else None
    if not plan or not (plan.get("stripe_price_id") if isinstance(plan, dict) else getattr(plan, "stripe_price_id", None)):
        raise ValueError("Plan not found or not available for subscription")

    stripe_price_id = plan["stripe_price_id"] if isinstance(plan, dict) else plan.stripe_price_id

    profile_row = supabase.table("profile").select("id, stripe_customer_id").eq("id", user_id).single().execute()
    profile = profile_row.data if hasattr(profile_row, "data") else None

    if not profile:
        insert = (
            supabase.table("profile")
            .insert(
                {
                    "id": user_id,
                    "email": user_email,
                    "display_name": user_display_name,
                }
            )
            .select("id, stripe_customer_id")
            .single()
            .execute()
        )
        profile = insert.data if hasattr(insert, "data") and insert.data else None
        if not profile:
            raise ValueError("Failed to create profile")

    profile_id_val = profile["id"] if isinstance(profile, dict) else profile.id
    customer_id = profile.get("stripe_customer_id") if isinstance(profile, dict) else getattr(profile, "stripe_customer_id", None)
    if not customer_id:
        customer = st.Customer.create(
            email=user_email,
            name=user_display_name,
            metadata={"supabase_user_id": user_id},
        )
        customer_id = customer.id
        supabase.table("profile").update({"stripe_customer_id": customer_id}).eq("id", user_id).execute()

    session = st.checkout.Session.create(
        mode="subscription",
        customer=customer_id,
        line_items=[{"price": stripe_price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"profile_id": profile_id_val, "plan_id": plan_id},
        subscription_data={
            "metadata": {"profile_id": profile_id_val, "plan_id": plan_id},
        },
    )
    if not session.url:
        raise ValueError("Failed to create checkout session")
    return session.url


def verify_webhook_payload(body: bytes, signature: str) -> "stripe.Event":
    secret = get_settings().STRIPE_WEBHOOK_SECRET
    if not secret:
        raise ValueError("STRIPE_WEBHOOK_SECRET not configured")
    return stripe.Webhook.construct_event(body, signature, secret)


def handle_checkout_session_completed(session: stripe.checkout.Session, supabase: Client) -> None:
    subscription_id = (
        session.subscription
        if isinstance(session.subscription, str)
        else (session.subscription.id if session.subscription else None)
    )
    if not subscription_id:
        raise ValueError("Missing subscription id")

    profile_id = (session.metadata or {}).get("profile_id")
    plan_id = (session.metadata or {}).get("plan_id")

    if not profile_id or not plan_id:
        st = get_stripe()
        customer_id = (
            session.customer
            if isinstance(session.customer, str)
            else (session.customer.id if session.customer else None)
        )
        if customer_id and not profile_id:
            row = (
                supabase.table("profile")
                .select("id")
                .eq("stripe_customer_id", customer_id)
                .limit(1)
                .execute()
            )
            data = getattr(row, "data", None) or (row[1] if isinstance(row, tuple) and len(row) > 1 else None)
            if data and len(data) > 0:
                profile_id = data[0].get("id") if isinstance(data[0], dict) else getattr(data[0], "id", None)
        if not plan_id and session.subscription:
            st = get_stripe()
            sub = (
                st.Subscription.retrieve(subscription_id)
                if isinstance(session.subscription, str)
                else session.subscription
            )
            price_id = None
            if sub and hasattr(sub, "items") and sub.items and sub.items.data:
                item = sub.items.data[0]
                price_id = getattr(item.price, "id", None) if item.price else None
            if price_id:
                plan_row = (
                    supabase.table("plan")
                    .select("id")
                    .eq("stripe_price_id", price_id)
                    .limit(1)
                    .execute()
                )
                plan_data = getattr(plan_row, "data", None) or (plan_row[1] if isinstance(plan_row, tuple) else None)
                if plan_data and len(plan_data) > 0:
                    plan_id = plan_data[0].get("id") if isinstance(plan_data[0], dict) else getattr(plan_data[0], "id", None)

    if not profile_id or not plan_id:
        raise ValueError("Could not resolve profile_id or plan_id")

    payload = {
        "profile_id": profile_id,
        "plan_id": plan_id,
        "stripe_subscription_id": subscription_id,
        "status": "active",
        "started_at": datetime.utcnow().isoformat() + "Z",
    }
    supabase.table("subscription").upsert(payload, on_conflict="stripe_subscription_id").execute()


def get_subscription_payment_info(stripe_subscription_id: str) -> dict | None:
    if not stripe_subscription_id:
        return None
    st = get_stripe()
    try:
        sub = st.Subscription.retrieve(
            stripe_subscription_id,
            expand=["default_payment_method"],
        )
    except stripe.error.InvalidRequestError:
        return None
    if not sub:
        return None
    result = {
        "next_charge_at": None,
        "card_brand": None,
        "card_last4": None,
    }
    current_period_end = sub.get("items").get("data")[0].get("current_period_end")
    if current_period_end:
        result["next_charge_at"] = datetime.utcfromtimestamp(current_period_end).isoformat() + "Z"
    pm = sub.default_payment_method
    if pm is None:
        return result
    if isinstance(pm, str):
        try:
            pm = st.PaymentMethod.retrieve(pm)
        except stripe.error.InvalidRequestError:
            return result
    if hasattr(pm, "card") and pm.card:
        exp_month = getattr(pm.card, "exp_month", None) or (pm.card.get("exp_month") if isinstance(pm.card, dict) else None)
        exp_year = getattr(pm.card, "exp_year", None) or (pm.card.get("exp_year") if isinstance(pm.card, dict) else None)
        result["card_brand"] = getattr(pm.card, "brand", None) or (pm.card.get("brand") if isinstance(pm.card, dict) else None)
        result["card_last4"] = getattr(pm.card, "last4", None) or (pm.card.get("last4") if isinstance(pm.card, dict) else None)
        result["card_expires_at"] = f"{exp_month}/{exp_year}"
    return result
