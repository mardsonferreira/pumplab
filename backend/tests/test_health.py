def test_health_or_docs_available(client):
    """Smoke test: app serves docs or health."""
    r = client.get("/docs")
    assert r.status_code == 200
