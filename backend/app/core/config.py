import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


def _split_csv(value: str | None) -> list[str]:
    if not value or not value.strip():
        return []
    return [s.strip() for s in value.split(",") if s.strip()]


@lru_cache
def get_settings() -> "Settings":
    return Settings()


class Settings:
    ALLOWED_ORIGINS: list[str]
    FRONTEND_URL: str
    SECURE_COOKIES: bool
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_ANON_KEY: str
    STRIPE_SECRET_KEY: str
    STRIPE_WEBHOOK_SECRET: str
    OPENAI_API_KEY: str

    def __init__(self) -> None:
        self.ALLOWED_ORIGINS = _split_csv(os.getenv("ALLOWED_ORIGINS", "http://localhost:3000"))
        self.FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
        self.SECURE_COOKIES = os.getenv("SECURE_COOKIES", "false").lower() == "true"
        self.SUPABASE_URL = os.getenv("SUPABASE_URL", "")
        self.SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
        self.SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
        self.STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
        self.STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
        self.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
        self.USE_MOCK_LLM = os.getenv("USE_MOCK_LLM", "false").lower() == "true"
