from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse

from app.api.deps import get_current_user_id, get_supabase_client
from app.schemas import (
    TotalPostsGeneratedResponse,
    UpdateTotalPostsGeneratedRequest,
)

router = APIRouter()

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
