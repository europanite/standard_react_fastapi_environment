from http import HTTPStatus

from fastapi.testclient import TestClient

import routers.shopify as shopify


def test_shopify_products_requires_configuration(client: TestClient, monkeypatch):
    monkeypatch.delenv("SHOPIFY_STORE_DOMAIN", raising=False)
    monkeypatch.delenv("SHOPIFY_STOREFRONT_ACCESS_TOKEN", raising=False)

    response = client.get("/api/v1/shopify/products")

    assert response.status_code == HTTPStatus.SERVICE_UNAVAILABLE
    assert "SHOPIFY_STORE_DOMAIN" in response.text


def test_shopify_products_maps_storefront_response(client: TestClient, monkeypatch):
    monkeypatch.setenv("SHOPIFY_STORE_DOMAIN", "demo-store.myshopify.com")
    monkeypatch.setenv("SHOPIFY_STOREFRONT_ACCESS_TOKEN", "storefront-token")
    monkeypatch.setenv("SHOPIFY_STOREFRONT_API_VERSION", "2026-01")
    monkeypatch.setenv("SHOPIFY_PRODUCTS_LIMIT", "8")

    class FakeResponse:
        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb):
            return False

        def read(self):
            return b'''
            {
              "data": {
                "products": {
                  "edges": [
                    {
                      "node": {
                        "id": "gid://shopify/Product/1",
                        "title": "Sample T-Shirt",
                        "description": "A sample product.",
                        "onlineStoreUrl": "https://example.com/products/sample",
                        "featuredImage": {
                          "url": "https://example.com/sample.jpg",
                          "altText": "sample image"
                        },
                        "priceRange": {
                          "minVariantPrice": {
                            "amount": "1980.00",
                            "currencyCode": "JPY"
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
            '''

    def fake_urlopen(request, timeout):
        assert timeout == 15
        assert request.full_url == "https://demo-store.myshopify.com/api/2026-01/graphql.json"
        assert request.get_header("X-shopify-storefront-access-token") == "storefront-token"
        return FakeResponse()

    monkeypatch.setattr(shopify.urllib.request, "urlopen", fake_urlopen)

    response = client.get("/api/v1/shopify/products?limit=3")

    assert response.status_code == HTTPStatus.OK, response.text
    assert response.json() == [
        {
            "id": "gid://shopify/Product/1",
            "title": "Sample T-Shirt",
            "description": "A sample product.",
            "online_store_url": "https://example.com/products/sample",
            "image_url": "https://example.com/sample.jpg",
            "image_alt_text": "sample image",
            "price": {"amount": "1980.00", "currency_code": "JPY"},
        }
    ]
