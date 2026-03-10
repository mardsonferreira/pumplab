import os

import pytest
from fastapi.testclient import TestClient

from app.main import app

# Ensure test env does not require real secrets
os.environ.setdefault("ALLOWED_ORIGINS", "http://localhost:3000")
os.environ.setdefault("FRONTEND_URL", "http://localhost:3000")


@pytest.fixture
def client():
    return TestClient(app)
