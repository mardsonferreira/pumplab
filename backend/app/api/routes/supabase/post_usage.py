from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse

from app.api.deps import get_current_user_id, get_supabase_client
from app.schemas import (
    MonthlyNarrativesRemainingResponse,
    TotalPostsGeneratedResponse,
    UpdateTotalPostsGeneratedRequest,
)

router = APIRouter()


@router.get("/monthly-narratives-remaining", response_model=MonthlyNarrativesRemainingResponse)
def get_monthly_narratives_remaining(
    year: int = Query(..., ge=2000, le=3000),
    month: int = Query(..., ge=1, le=12),
    user_id: str = Depends(get_current_user_id),
    supabase=Depends(get_supabase_client),
):
    """Active plan monthly_narratives allowance minus posts_generated for the given month."""
    try:
        subscription = (
            supabase.table("subscription")
            .select("plan (monthly_narratives)")
            .eq("profile_id", user_id)
            .eq("status", "active")
            .maybe_single()
            .execute()
        )

        allowance = 0
        if subscription.data:
            data = (
                dict(subscription.data)
                if isinstance(subscription.data, dict)
                else subscription.data
            )
            plan = data.get("plan") or {}
            if isinstance(plan, list) and plan:
                plan = plan[0]
            allowance = int((plan or {}).get("monthly_narratives") or 0)

        usage = (
            supabase.table("post_usage")
            .select("posts_generated")
            .eq("user_id", user_id)
            .eq("year", year)
            .eq("month", month)
            .limit(1)
            .execute()
        )
        rows = usage.data or []
        first = rows[0] if rows else {}
        used = int((first or {}).get("posts_generated") or 0)
        remaining = max(0, allowance - used)
        return MonthlyNarrativesRemainingResponse(monthly_narratives_remaining=remaining)
    except Exception as e:
        print("get_monthly_narratives_remaining error", e)
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to fetch monthly narratives remaining", "detail": str(e)},
        )


@router.get("/posts-generated", response_model=TotalPostsGeneratedResponse)
def get_total_posts_generated(
    year: int = Query(..., ge=2000, le=3000),
    month: int = Query(..., ge=1, le=12),
    user_id: str = Depends(get_current_user_id),
    supabase=Depends(get_supabase_client),
):
    try:
        result = (
            supabase.table("post_usage")
            .select("posts_generated")
            .eq("user_id", user_id)
            .eq("year", year)
            .eq("month", month)
            .limit(1)
            .execute()
        )
        rows = result.data or []
        first = rows[0] if rows else {}
        return TotalPostsGeneratedResponse(posts_generated=first.get("posts_generated"))
    except Exception as e:
        print("get_total_posts_generated error", e);
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to fetch total posts generated", "detail": str(e)},
        )


@router.post("/posts-generated", response_model=TotalPostsGeneratedResponse)
def update_total_posts_generated(
    body: UpdateTotalPostsGeneratedRequest,
    user_id: str = Depends(get_current_user_id),
    supabase=Depends(get_supabase_client),
):
    try:
        existing = (
            supabase.table("post_usage")
            .select("posts_generated")
            .eq("user_id", user_id)
            .eq("year", body.year)
            .eq("month", body.month)
            .limit(1)
            .execute()
        )

        rows = existing.data or []
        if rows:
            current_total = rows[0].get("posts_generated") or 0
            next_total = current_total + body.value
            result = (
                supabase.table("post_usage")
                .update({"posts_generated": next_total})
                .eq("user_id", user_id)
                .eq("year", body.year)
                .eq("month", body.month)
                .execute()
            )
        else:
            result = (
                supabase.table("post_usage")
                .insert(
                    {
                        "user_id": user_id,
                        "year": body.year,
                        "month": body.month,
                        "posts_generated": body.value,
                    }
                )
                .execute()
            )

        row = (result.data or [{}])[0]
        return TotalPostsGeneratedResponse(posts_generated=row.get("posts_generated"))
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to update total posts generated", "detail": str(e)},
        )
