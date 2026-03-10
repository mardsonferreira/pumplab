from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from app.api.deps import ACCESS_TOKEN_COOKIE
from app.core.config import get_settings

router = APIRouter()

REFRESH_TOKEN_COOKIE = "sb-refresh-token"


@router.post("/set-cookies")
async def auth_set_cookies(request: Request):
    """Receive tokens from frontend (after PKCE exchange) and set httponly cookies
    on the backend domain so the browser sends them on subsequent API calls."""
    body = await request.json()
    access_token: str = body.get("access_token", "")
    refresh_token: str = body.get("refresh_token", "")

    if not access_token:
        return JSONResponse({"error": "Missing access_token"}, status_code=400)

    settings = get_settings()
    res = JSONResponse({"success": True})
    res.set_cookie(
        key=ACCESS_TOKEN_COOKIE,
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=settings.SECURE_COOKIES,
        max_age=60 * 60 * 24 * 7,
    )
    res.set_cookie(
        key=REFRESH_TOKEN_COOKIE,
        value=refresh_token,
        httponly=True,
        samesite="lax",
        secure=settings.SECURE_COOKIES,
        max_age=60 * 60 * 24 * 30,
    )
    return res
