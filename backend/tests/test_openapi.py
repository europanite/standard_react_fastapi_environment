# backend/tests/test_openapi.py
from fastapi.testclient import TestClient


def test_openapi_available(client: TestClient):
    r = client.get("/openapi.json")
    assert r.status_code == 200
    j = r.json()
    assert "paths" in j and "/health" in j["paths"]
