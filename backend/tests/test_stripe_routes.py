"""Stripe routes: create-checkout-session (auth required), webhook (signature validation)."""


def test_create_checkout_session_requires_auth(client):
    r = client.post(
        "/stripe/create-checkout-session",
        json={"planId": "any"},
    )
    assert r.status_code == 401


def test_webhook_without_signature_returns_400(client):
    r = client.post(
        "/stripe/webhook",
        content=b"{}",
        headers={"Content-Type": "application/json"},
    )
    assert r.status_code == 400
    data = r.json()
    assert "stripe-signature" in data.get("message", "").lower()
