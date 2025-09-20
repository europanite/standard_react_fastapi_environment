# backend/tests/test_health.py
from fastapi.testclient import TestClient

def test_health_ok(client: TestClient):
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body.get("status") == "ok"
    assert body.get("db") is True
