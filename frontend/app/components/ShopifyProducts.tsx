import React, { useState } from "react";
import { Button, Linking, Platform, Text, TouchableOpacity, View } from "react-native";

type ShopifyMoney = { amount: string; currency_code: string };

type ShopifyProduct = {
  id: string;
  title: string;
  description: string;
  online_store_url?: string | null;
  image_url?: string | null;
  image_alt_text?: string | null;
  price?: ShopifyMoney | null;
};

type Props = {
  maxWidth: number;
};

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE ||
  (Platform.select({
    web: `http://localhost:${process.env.EXPO_PUBLIC_API_PORT ?? "8000"}`,
    default: `http://${process.env.EXPO_PUBLIC_API_HOST ?? "localhost"}:${
      process.env.EXPO_PUBLIC_API_PORT ?? "8000"
    }`,
  }) as string);

async function apiJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`${response.status} ${response.statusText}: ${text}`);
  }
  return (await response.json()) as T;
}

function formatMoney(product: ShopifyProduct): string {
  if (!product.price) return "Price unavailable";

  const amount = Number(product.price.amount);
  if (!Number.isFinite(amount)) {
    return `${product.price.amount} ${product.price.currency_code}`;
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: product.price.currency_code,
  }).format(amount);
}

export default function ShopifyProducts({ maxWidth }: Props) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      setProducts(await apiJson<ShopifyProduct[]>("/shopify/products"));
    } catch (e: any) {
      setProducts([]);
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ width: "100%", maxWidth, marginTop: 16 }}>
      <View style={{ borderWidth: 1, borderRadius: 8, padding: 12, gap: 10 }}>
        <Text style={{ fontWeight: "700", marginBottom: 2 }}>
          Shopify Products {loading ? "(loading...)" : `(${products.length})`}
        </Text>
        <Text style={{ color: "#666" }}>
          Product data is loaded through the FastAPI Shopify proxy.
        </Text>

        <Button title="LOAD SHOPIFY PRODUCTS" onPress={() => void reload()} disabled={loading} />

        {error ? <Text style={{ color: "crimson" }}>Shopify Error: {error}</Text> : null}

        {!error && products.length === 0 ? (
          <Text style={{ color: "#666" }}>
            Configure SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            then load products.
          </Text>
        ) : null}

        {products.map((product) => (
          <View
            key={product.id}
            style={{ borderTopWidth: 1, borderStyle: "dotted", paddingTop: 10, gap: 4 }}
          >
            <Text style={{ fontWeight: "700" }}>{product.title}</Text>
            <Text>{formatMoney(product)}</Text>
            {product.description ? (
              <Text numberOfLines={3} style={{ color: "#555" }}>
                {product.description}
              </Text>
            ) : null}
            {product.online_store_url ? (
              <TouchableOpacity onPress={() => Linking.openURL(product.online_store_url || "")}>
                <Text style={{ textDecorationLine: "underline" }}>Open product page</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
