from fastapi import APIRouter, HTTPException, status

from app.api.deps import get_supabase_client

router = APIRouter()

PLAN_FIELDS = "id, name, price, billing_cycle, monthly_narratives, description, stripe_price_id, stripe_product_id"

@router.get("/", status_code=status.HTTP_200_OK)
async def get_plans():
    supabase = next(get_supabase_client())

    result = (
        supabase.table("plan")
        .select(PLAN_FIELDS)
        .order("price", desc=False)
        .execute()
    )

    rows = result.data or []

    return [
        {
            **row,
            "price": (row.get("price") or 0) / 100,
        }
        for row in rows
    ]
