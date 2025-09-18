def test_signup_signin_and_me(client):
    # short passwords 400
    r = client.post("/auth/signup", json={"email": "a@a.com", "password": "123"})
    assert r.status_code == 400
    assert "Password must be at least 6" in r.text

    # normal signup => 201
    r = client.post("/auth/signup", json={"email": "a@a.com", "password": "123456"})
    assert r.status_code == 201
    assert r.json()["email"] == "a@a.com"

    # email deprecated 400
    r = client.post("/auth/signup", json={"email": "a@a.com", "password": "abcdef"})
    assert r.status_code == 400

    # signin => get token
    r = client.post("/auth/signin", json={"email": "a@a.com", "password": "123456"})
    assert r.status_code == 200
    token = r.json()["access_token"]
    assert token

    # /auth/me 
    r = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json()["email"] == "a@a.com"

    # no token: 401
    r = client.get("/auth/me")
    assert r.status_code == 401
