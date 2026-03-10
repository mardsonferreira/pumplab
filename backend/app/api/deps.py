import logging
from collections.abc import Generator

from fastapi import Request, HTTPException
from supabase import Client, create_client

from app.core.config import get_settings

logger = logging.getLogger(__name__)

ACCESS_TOKEN_COOKIE = "sb-access-token"


def _get_access_token(request: Request) -> str | None:
    """Authorization Bearer first, then cookie. Returns None if neither present."""
    auth = request.headers.get("Authorization") or ""
    if auth.startswith("Bearer ") and auth[7:].strip():
        return auth[7:].strip()
    return request.cookies.get(ACCESS_TOKEN_COOKIE)


def get_supabase_client() -> Generator[Client, None, None]:
    settings = get_settings()
    client = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY,
    )
    try:
        yield client
    finally:
        pass


def _validate_jwt(access_token: str):
    """Validate JWT against Supabase; raises HTTPException 401 on failure."""
    settings = get_settings()
    client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
    try:
        response = client.auth.get_user(jwt=access_token)
    except Exception as exc:
        logger.warning("JWT validation failed: %s: %s", type(exc).__name__, exc)
        raise HTTPException(status_code=401, detail="Unauthorized")
    if not response or not response.user:
        logger.warning("JWT validation returned no user")
        raise HTTPException(status_code=401, detail="Unauthorized")
    return response.user


def get_current_user_id(request: Request) -> str:
    """Get current user id from Authorization Bearer or auth cookie; raises 401 if missing or invalid."""
    access_token = _get_access_token(request)
    if not access_token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = _validate_jwt(access_token)
    return user.id


def get_current_user(request: Request) -> dict:
    """Get current user id, email, display_name from Authorization Bearer or auth cookie; raises 401 if missing or invalid."""
    access_token = _get_access_token(request)
    if not access_token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    u = _validate_jwt(access_token)
    meta = u.user_metadata or {}
    return {
        "id": u.id,
        "email": getattr(u, "email", None) or meta.get("email"),
        "display_name": meta.get("full_name") or meta.get("name"),
    }
