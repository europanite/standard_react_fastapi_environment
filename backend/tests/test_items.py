from http import HTTPStatus

from fastapi.testclient import TestClient


def test_create_and_get_item(client: TestClient):
    r = client.post("/items", json={"title": "hello"})
    assert r.status_code == HTTPStatus.CREATED
    item = r.json()
    r2 = client.get(f"/items/{item['id']}")
    assert r2.status_code == HTTPStatus.OK
    assert r2.json()["title"] == "hello"


def test_list_items_with_query_and_paging(client: TestClient):
    titles = ["apple", "banana", "applet", "band"]
    for t in titles:
        assert (
            client.post("/items", json={"title": t}).status_code == HTTPStatus.CREATED
        )

    # q=app → "apple","applet"
    r = client.get("/items", params={"q": "app", "limit": 10, "offset": 0})
    assert r.status_code == HTTPStatus.OK
    got = [i["title"] for i in r.json()]
    assert set(got) == {"apple", "applet"}

    # limit/offset
    r2 = client.get("/items", params={"limit": 1, "offset": 1})
    assert r2.status_code == HTTPStatus.OK
    assert len(r2.json()) == 1


def test_update_item(client: TestClient):
    r = client.post("/items", json={"title": "old"})
    item_id = r.json()["id"]
    r2 = client.put(f"/items/{item_id}", json={"title": "new"})
    assert r2.status_code == HTTPStatus.OK
    assert r2.json()["title"] == "new"


def test_delete_item(client: TestClient):
    r = client.post("/items", json={"title": "todelete"})
    item_id = r.json()["id"]
    r2 = client.delete(f"/items/{item_id}")
    assert r2.status_code == HTTPStatus.NO_CONTENT
    r3 = client.get(f"/items/{item_id}")
    assert r3.status_code == HTTPStatus.NOT_FOUND


def test_get_update_delete_not_found(client: TestClient):
    assert client.get("/items/999999").status_code == HTTPStatus.NOT_FOUND
    assert (
        client.put("/items/999999", json={"title": "x"}).status_code
        == HTTPStatus.NOT_FOUND
    )
    assert client.delete("/items/999999").status_code == HTTPStatus.NOT_FOUND
