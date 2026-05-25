import json
import os
import urllib.error
import urllib.request
from typing import Any

from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/shopify", tags=["shopify"])

DEFAULT_API_VERSION = "2026-01"
DEFAULT_PRODUCTS_LIMIT = 8
MAX_PRODUCTS_LIMIT = 50

PRODUCTS_QUERY = """
query Products($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        title
        description
        onlineStoreUrl
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
""".strip()


def _setting(name: str) -> str:
    return os.getenv(name, "").strip()


def _products_limit() -> int:
    raw = _setting("SHOPIFY_PRODUCTS_LIMIT")
    if not raw:
        return DEFAULT_PRODUCTS_LIMIT
    try:
        return max(1, min(int(raw), MAX_PRODUCTS_LIMIT))
    except ValueError:
        return DEFAULT_PRODUCTS_LIMIT


def _graphql_url(domain: str, api_version: str) -> str:
    clean_domain = domain.removeprefix("https://").removeprefix("http://").strip("/")
    if not clean_domain:
        raise HTTPException(
            status_code=503,
            detail="SHOPIFY_STORE_DOMAIN is not configured.",
        )
    return f"https://{clean_domain}/api/{api_version}/graphql.json"


def _post_graphql(url: str, token: str, first: int) -> dict[str, Any]:
    if not token:
        raise HTTPException(
            status_code=503,
            detail="SHOPIFY_STOREFRONT_ACCESS_TOKEN is not configured.",
        )

    body = json.dumps({"query": PRODUCTS_QUERY, "variables": {"first": first}}).encode(
        "utf-8"
    )
    request = urllib.request.Request(
        url,
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": token,
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise HTTPException(
            status_code=502,
            detail=f"Shopify API returned {exc.code}: {detail}",
        ) from exc
    except urllib.error.URLError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Shopify API request failed: {exc.reason}",
        ) from exc
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=502,
            detail="Shopify API returned invalid JSON.",
        ) from exc


def _product_from_node(node: dict[str, Any]) -> dict[str, Any]:
    image = node.get("featuredImage") or {}
    price_range = node.get("priceRange") or {}
    min_price = price_range.get("minVariantPrice") or {}

    price = None
    if min_price.get("amount") and min_price.get("currencyCode"):
        price = {
            "amount": min_price["amount"],
            "currency_code": min_price["currencyCode"],
        }

    return {
        "id": node.get("id", ""),
        "title": node.get("title", ""),
        "description": node.get("description", ""),
        "online_store_url": node.get("onlineStoreUrl"),
        "image_url": image.get("url"),
        "image_alt_text": image.get("altText"),
        "price": price,
    }


@router.get("/products")
def list_products(limit: int = Query(DEFAULT_PRODUCTS_LIMIT, ge=1, le=MAX_PRODUCTS_LIMIT)):
    domain = _setting("SHOPIFY_STORE_DOMAIN")
    token = _setting("SHOPIFY_STOREFRONT_ACCESS_TOKEN")
    api_version = _setting("SHOPIFY_STOREFRONT_API_VERSION") or DEFAULT_API_VERSION
    first = min(limit, _products_limit())

    payload = _post_graphql(_graphql_url(domain, api_version), token, first)
    if payload.get("errors"):
        raise HTTPException(status_code=502, detail=payload["errors"])

    edges = (((payload.get("data") or {}).get("products") or {}).get("edges")) or []
    return [_product_from_node(edge.get("node") or {}) for edge in edges]
