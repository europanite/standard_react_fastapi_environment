from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_openapi_available():
    r = client.get("/openapi.json")
    assert r.status_code == 200
    assert "paths" in r.json()