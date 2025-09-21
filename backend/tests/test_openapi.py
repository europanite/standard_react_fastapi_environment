from http import HTTPStatus

from fastapi.testclient import TestClient


def test_openapi_available(client: TestClient):
    r = client.get("/openapi.json")
    assert r.status_code == HTTPStatus.OK
    j = r.json()
    assert "paths" in j and "/health" in j["paths"]
