import stripe
from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from pydantic import AliasChoices, BaseModel, Field

from app.api.deps import get_supabase_client, get_current_user
from app.core.config import get_settings
from app.services import stripe_service

router = APIRouter()


class CreateCheckoutBody(BaseModel):
    """Accept camelCase (direct clients) or snake_case (http util serializes keys)."""

    plan_id: str = Field(validation_alias=AliasChoices("planId", "plan_id"))


@router.post("/create-checkout-session")
def create_checkout_session(
    body: CreateCheckoutBody,
    user: dict = Depends(get_current_user),
):
    settings = get_settings()
    supabase = next(get_supabase_client())
    try:
        success_url = f"{settings.FRONTEND_URL}/dashboard?checkout=success"
        cancel_url = f"{settings.FRONTEND_URL}/pricing?checkout=canceled"
        url = stripe_service.create_checkout_session(
            supabase=supabase,
            user_id=user["id"],
            user_email=user.get("email"),
            user_display_name=user.get("display_name"),
            plan_id=body.plan_id,
            success_url=success_url,
            cancel_url=cancel_url,
        )
        return JSONResponse(content={"url": url})
    except ValueError as e:
        msg = str(e)
        if "Plan not found" in msg or "not available" in msg:
            return JSONResponse(status_code=400, content={"error": msg})
        if "Failed to create profile" in msg:
            return JSONResponse(status_code=500, content={"error": msg})
        if "Failed to create free subscription" in msg:
            return JSONResponse(status_code=500, content={"error": msg})
        if "Failed to create checkout" in msg:
            return JSONResponse(status_code=500, content={"error": msg})
        return JSONResponse(status_code=400, content={"error": msg})
    except Exception as e:
        print(e)
        return JSONResponse(
            status_code=500,
            content={"error": str(e) if str(e) else "Internal server error"},
        )


@router.post("/webhook")
async def stripe_webhook(request: Request):
    raw_body = await request.body()
    signature = request.headers.get("stripe-signature")
    if not signature:
        return JSONResponse(status_code=400, content={"message": "Missing stripe-signature"})
    settings = get_settings()
    if not settings.STRIPE_WEBHOOK_SECRET:
        return JSONResponse(status_code=400, content={"message": "STRIPE_WEBHOOK_SECRET not configured"})
    try:
        event = stripe.Webhook.construct_event(
            raw_body, signature, settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"message": f"Webhook Error: {e!s}"},
        )
    if event.type != "checkout.session.completed":
        return JSONResponse(content={"received": True})
    supabase = next(get_supabase_client())
    try:
        stripe_service.handle_checkout_session_completed(event.data.object, supabase)
    except ValueError as e:
        return JSONResponse(status_code=400, content={"message": str(e)})
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": "Internal server error", "detail": str(e)},
        )
    return JSONResponse(content={"received": True})
