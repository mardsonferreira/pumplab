from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.routes import auth, health, openai, stripe
from app.core.cors import setup_cors


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="pumplab API", lifespan=lifespan)
setup_cors(app)

app.include_router(health.router)
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(stripe.router, prefix="/stripe", tags=["stripe"])
app.include_router(openai.router, prefix="/openai", tags=["openai"])
