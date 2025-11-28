// CRUD Home screen
// - Allows typing while signed out, but blocks submitting (CREATE/UPDATE/DELETE) and nudges to SignIn.
// - Keeps the original CRUD UI structure as much as possible.
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/Auth";

type Item = { id: number; title: string };

const CONTENT_MAX_W = 720;

// Resolve API base: prefer EXPO_PUBLIC_API_BASE; fallback for dev environments.
const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE ||
  (Platform.select({
    web: `http://localhost:${process.env.EXPO_PUBLIC_API_PORT ?? "8000"}`,
    default: `http://${process.env.EXPO_PUBLIC_API_HOST ?? "localhost"}:${
      process.env.EXPO_PUBLIC_API_PORT ?? "8000"
    }`,
  }) as string);

// Simple JSON helper that throws on non-2xx.
async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}: ${txt}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export default function HomeScreen() {
  // Local state
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Auth & navigation
  const auth = useAuth();
  const nav = useNavigation<any>();

  // Load items
  const reloadList = async () => {
    setLoading(true);
    setErr(null);
    try {
      const list = await apiJson<Item[]>("/items");
      setItems(list);
    } catch (e: any) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reloadList();
  }, []);

  // Guarded action: allow typing while signed out, but block submissions.
  const requireSignIn = (action: () => void) => {
    if (!auth.user) {
      nav.navigate("SignIn");
      return;
    }
    action();
  };

  // Create/Update
  const onSubmit = () =>
    requireSignIn(async () => {
      setErr(null);
      const v = title.trim();
      if (!v) {
        setErr("Invalid Title");
        return;
      }
      try {
        if (editId != null) {
          await apiJson<Item>(`/items/${editId}`, {
            method: "PUT",
            body: JSON.stringify({ title: v }),
          });
          setEditId(null);
        } else {
          await apiJson<Item>("/items", {
            method: "POST",
            body: JSON.stringify({ title: v }),
          });
          setTitle("");
        }
        await reloadList();
      } catch (e: any) {
        setErr(String(e.message || e));
      }
    });

  // Start editing (no network call)
  const onEdit = (item: Item) => {
    setEditId(item.id);
    setTitle(item.title);
  };

  // Delete
  const onDelete = (id: number) =>
    requireSignIn(async () => {
      setErr(null);
      try {
        const res = await fetch(`${API_BASE}/items/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`${res.status} ${res.statusText}: ${txt}`);
        }
        if (editId === id) {
          setEditId(null);
          setTitle("");
        }
        await reloadList();
      } catch (e: any) {
        setErr(String(e.message || e));
      }
    });

  const submitDisabled = !auth.user;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Centered column to match SignIn/SignUp/SettingsBar */}
      <View style={{ alignItems: "center" }}>
        {/* --- FORM: centered & width-limited --- */}
        <View style={{ width: "100%", maxWidth: CONTENT_MAX_W }}>
          <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>
            Auth CRUD Sample
          </Text>

          {err && (
            <Text style={{ color: "crimson", marginBottom: 8 }}>Error: {err}</Text>
          )}

          <View style={{ gap: 12, marginBottom: 16 }}>
            <View style={{ borderWidth: 1, borderRadius: 8, padding: 12, gap: 8 }}>
              <View>
                <Text style={{ fontWeight: "600" }}>Title</Text>
                <TextInput
                  placeholder=""
                  value={title}
                  onChangeText={setTitle}
                  style={{ borderWidth: 1, borderRadius: 6, padding: 8, width: "100%" }}
                />
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <Button
                title={editId != null ? "UPDATE" : "CREATE"}
                onPress={onSubmit}
                disabled={submitDisabled}
              />
              {submitDisabled && (
                <Text style={{ color: "#666" }}>Sign in to submit.</Text>
              )}
            </View>
          </View>
        </View>

        {/* --- LIST: centered & same width --- */}
        <View style={{ width: "100%", maxWidth: CONTENT_MAX_W, marginTop: 16 }}>
          <View style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}>
            <Text style={{ fontWeight: "700", marginBottom: 8 }}>
              Records {loading ? "(loading...)" : `(${items.length})`}
            </Text>

            <FlatList
              data={items}
              keyExtractor={(it) => String(it.id)}
              contentContainerStyle={{ paddingBottom: 12 }}
              renderItem={({ item }) => (
                <View
                  style={{
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderStyle: "dotted",
                  }}
                >
                  <Text style={{ marginBottom: 6 }}>
                    #{item.id} {item.title}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity onPress={() => onEdit(item)}>
                      <View
                        style={{
                          borderWidth: 1,
                          borderRadius: 6,
                          paddingVertical: 6,
                          paddingHorizontal: 12,
                        }}
                      >
                        <Text>EDIT</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(item.id)}>
                      <View
                        style={{
                          borderWidth: 1,
                          borderRadius: 6,
                          paddingVertical: 6,
                          paddingHorizontal: 12,
                        }}
                      >
                        <Text>DELETE</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <Text style={{ color: "#666" }}>
                  No records yet. Try CREATE.
                </Text>
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
}
