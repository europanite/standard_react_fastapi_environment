import React, { useEffect, useState } from "react";
import {
  Platform, SafeAreaView, View, Text, TextInput, Button, FlatList, useWindowDimensions,
} from "react-native";

type Item = { id: number; title: string };

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE ||
  (Platform.OS === "web" ? "http://localhost:8000" : "http://backend:8000");

async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      ...init,
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`${res.status} ${res.statusText}: ${txt}`);
    }
    if (res.status === 204) return undefined as unknown as T;
    return res.json() as Promise<T>;
  } catch (e: any) {
    throw new Error(`Failed to fetch ${path}. API_BASE=${API_BASE}. ${e?.message ?? e}`);
  }
}

export default function App() {
  const [formId, setFormId] = useState(""); //
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const isNarrow = width < 820; // 

  const reloadList = async () => {
    setLoading(true); setErr(null);
    try {
      const list = await apiJson<Item[]>("/items");
      setItems(list);
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { reloadList(); }, []);

  // ---- actions ----
  const onCreate = async () => {
    setErr(null);
    if (!title.trim()) { setErr("CREATE: Invalid Title"); return; }
    try {
      const created = await apiJson<Item>("/items", {
        method: "POST",
        body: JSON.stringify({ title: title.trim() }),
      });
      // 
      setFormId(String(created.id));
      setTitle(created.title);
      await reloadList();
    } catch (e: any) { setErr(e.message); }
  };

  const onRead = async () => {
    setErr(null);
    const id = Number(formId);
    if (!Number.isFinite(id) || id <= 0) { setErr("READ: ID not found"); return; }
    try {
      const data = await apiJson<Item>(`/items/${id}`);
      setFormId(String(data.id));
      setTitle(data.title);
    } catch (e: any) { setErr(e.message); }
  };

  const onUpdate = async () => {
    setErr(null);
    const id = Number(formId);
    if (!Number.isFinite(id) || id <= 0) { setErr("UPDATE: Invalid ID"); return; }
    if (!title.trim()) { setErr("UPDATE: Invalid Title"); return; }
    try {
      await apiJson<Item>(`/items/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title: title.trim() }),
      });
      await reloadList();
    } catch (e: any) { setErr(e.message); }
  };

  const onDelete = async () => {
    setErr(null);
    const id = Number(formId);
    if (!Number.isFinite(id) || id <= 0) { setErr("DELETE: Invalid ID"); return; }
    try {
      const res = await fetch(`${API_BASE}/items/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText}: ${txt}`);
      }
      setFormId("");
      setTitle("");
      await reloadList();
    } catch (e: any) { setErr(String(e)); }
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>
          CRUD Sample
        </Text>
        {err && <Text style={{ color: "crimson", marginBottom: 8 }}>Error: {err}</Text>}

        {/* Layout: row, but column when it is narrow */}
        <View
          style={{
            flexDirection: isNarrow ? "column" : "row",
            gap: 16,
            alignItems: "flex-start",
          }}
        >
          {/* Left columns： */}
          <View style={{ width: isNarrow ? "100%" : 360, gap: 12 }}>
            {/* Forms */}
            <View style={{ borderWidth: 1, borderRadius: 8, padding: 12, gap: 8 }}>
              <View>
                <Text style={{ fontWeight: "600" }}>ID</Text>
                <TextInput
                  value={formId}
                  editable={false}
                  style={{
                    borderWidth: 1, borderRadius: 6, padding: 8,
                    backgroundColor: "#f0f0f0", color: "#555",
                  }}
                />
              </View>

              <View>
                <Text style={{ fontWeight: "600" }}>Title</Text>
                <TextInput
                  placeholder="Title"
                  value={title}
                  onChangeText={setTitle}
                  style={{ borderWidth: 1, borderRadius: 6, padding: 8 }}
                />
              </View>
            </View>

            {/* Buttons */}
            <View style={{ gap: 8 }}>
              <Button title="CREATE" onPress={onCreate} />
              <Button title={loading ? "READ" : "READ"} onPress={onRead} />
              <Button title="UPDATE" onPress={onUpdate} />
              <Button title="DELETE" onPress={onDelete} />
            </View>
          </View>

          {/* Right columns */}
          <View style={{ flex: 1, minWidth: 260 }}>
            <View style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}>
              <Text style={{ fontWeight: "700", marginBottom: 8 }}>
                All Records {loading ? "(loading...)" : ""}
              </Text>
              <FlatList
                data={items}
                keyExtractor={(it) => String(it.id)}
                renderItem={({ item }) => (
                  <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderStyle: "dotted" }}>
                    <Text>#{item.id} {item.title}</Text>
                  </View>
                )}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
