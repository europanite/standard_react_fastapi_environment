def test_items_crud(client):
    resp = client.get("/items")
    assert resp.status_code == 200
    assert resp.json() == []

    # CREATE
    r = client.post("/items", json={"title": "first"})
    assert r.status_code == 201
    created = r.json()
    assert created["title"] == "first"
    item_id = created["id"]

    r = client.get("/items")
    assert r.status_code == 200
    assert any(it["id"] == item_id for it in r.json())

    # GET
    r = client.get(f"/items/{item_id}")
    assert r.status_code == 200
    assert r.json()["title"] == "first"

    # UPDATE
    r = client.put(f"/items/{item_id}", json={"title": "updated"})
    assert r.status_code == 200
    assert r.json()["title"] == "updated"

    # DELETE
    r = client.delete(f"/items/{item_id}")
    assert r.status_code == 204

    r = client.get(f"/items/{item_id}")
    assert r.status_code == 404
