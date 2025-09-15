import React, { useEffect, useState } from "react";
import {
  Platform, View, Text, TextInput, Button, FlatList, TouchableOpacity, useWindowDimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

type Item = { id: number; title: string };

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE ||
  (Platform.OS === "web" ? `http://localhost:${process.env.EXPO_PUBLIC_API_PORT}` : `http://${process.env.EXPO_PUBLIC_API_BASE}:${process.env.EXPO_PUBLIC_API_PORT}`); //

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
  return res.json() as Promise<T>;
}

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState(""); 
  const [editId, setEditId] = useState<number | null>(null); 
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const isNarrow = width < 820;

  const reloadList = async () => {
    setLoading(true); setErr(null);
    try {
      const list = await apiJson<Item[]>("/items");
      setItems(list);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { reloadList(); }, []);

  const onSubmit = async () => {
    setErr(null);
    if (!title.trim()) { setErr("Invalid Title"); return; }

    try {
      if (editId != null) {
        // UPDATE
        await apiJson<Item>(`/items/${editId}`, {
          method: "PUT",
          body: JSON.stringify({ title: title.trim() }),
        });
        setEditId(null);
      } else {
        // CREATE
        const created = await apiJson<Item>("/items", {
          method: "POST",
          body: JSON.stringify({ title: title.trim() }),
        });
        // clear
        setTitle("");
      }
      await reloadList();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // EDIT
  const onEdit = (item: Item) => {
    setEditId(item.id);
    setTitle(item.title);
  };

  // DELETE
  const onDelete = async (id: number) => {
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
      setErr(String(e));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" backgroundColor="#fff"  />
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>
          CRUD Sample
        </Text>
        {err && <Text style={{ color: "crimson", marginBottom: 8 }}>Error: {err}</Text>}

        {/* Left: forms / Right; row if it is narrow */}
        <View style={{
          flex: 1,
          flexDirection: isNarrow ? "column" : "row",
          alignItems: "flex-start",
          gap: 16
        }}>
          {/* Left: forms */}
          <View style={{ width: isNarrow ? "100%" : 360, gap: 12 }}>
            <View style={{ borderWidth: 1, borderRadius: 8, padding: 12, gap: 8 }}>
              <View>
                <Text style={{ fontWeight: "600" }}>Title</Text>
                <TextInput
                  placeholder=""
                  value={title}
                  onChangeText={setTitle}
                  style={{ borderWidth: 1, borderRadius: 6, padding: 8 }}
                />
              </View>
            </View>

            {/* UPDATE / CREATE Button */}
            <View style={{ gap: 8 }}>
              <Button title={editId != null ? "UPDATE" : "CREATE"} onPress={onSubmit} />
            </View>
          </View>

          {/* Right：List with EDIT / DELETE Button  */}
          <View style={{ minWidth: 280 }}>
            <View style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}>
              <Text style={{ fontWeight: "700", marginBottom: 8 }}>
                Records {loading ? "(loading...)" : `(${items.length})`}
              </Text>
              <FlatList
                data={items}
                keyExtractor={(it) => String(it.id)}
                contentContainerStyle={{ paddingBottom: 12 }}
                renderItem={({ item }) => (
                  <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderStyle: "dotted" }}>
                    <Text style={{ marginBottom: 6 }}>#{item.id} {item.title}</Text>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TouchableOpacity onPress={() => onEdit(item)}>
                        <View style={{ borderWidth: 1, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 12 }}>
                          <Text>EDIT</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => onDelete(item.id)}>
                        <View style={{ borderWidth: 1, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 12 }}>
                          <Text>DELETE</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                ListEmptyComponent={<Text style={{ color: "#666" }}>No records yet. Try CREATE.</Text>}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}