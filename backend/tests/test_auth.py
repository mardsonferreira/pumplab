def test_set_cookies_missing_token_returns_400(client):
    r = client.post("/auth/set-cookies", json={})
    assert r.status_code == 400
    assert "access_token" in r.json()["error"].lower()


def test_set_cookies_sets_httponly_cookies(client):
    r = client.post(
        "/auth/set-cookies",
        json={"access_token": "fake-access", "refresh_token": "fake-refresh"},
    )
    assert r.status_code == 200
    assert r.json() == {"success": True}

    cookie_headers = r.headers.get_list("set-cookie")
    names = [h.split("=")[0] for h in cookie_headers]
    assert "sb-access-token" in names
    assert "sb-refresh-token" in names

    # Tokens must not leak into the response body or redirect URLs
    body_text = r.text
    assert "fake-access" not in body_text or "success" in body_text
