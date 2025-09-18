from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_openapi_available():
    r = client.get("/openapi.json")
    assert r.status_code == 200
    data = r.json()
    assert "paths" in data

def test_items_endpoint_if_exists():
    r = client.get("/items")
    if r.status_code == 404:
        assert True
    else:
        assert r.status_code == 200
        assert isinstance(r.json(), list)
