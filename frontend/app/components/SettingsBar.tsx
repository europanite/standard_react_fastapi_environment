// Settings bar: match SignIn/SignUp layout (centered column, maxWidth=480).
// - Bar spans full width with gray background.
// - Inner content is centered and width-limited to 480px (same as forms).
// - Status + buttons are grouped without stretching to edges.

import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { useAuth } from "../context/Auth";
import { useNavigation } from "@react-navigation/native";

// Complementary color helper (invert channels)
function complementaryHex(hex: string) {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.split("").map(c => c + c).join("") : m;
  const n = parseInt(full, 16);
  const r = 255 - ((n >> 16) & 255);
  const g = 255 - ((n >> 8) & 255);
  const b = 255 - (n & 255);
  const toHex = (x: number) => x.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

const BAR_BG = "#000000ff";
const CONTENT_MAX_W = 480; // ← same as forms

export default function SettingsBar() {
  const { user, signOut } = useAuth();
  const nav = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isNarrow = width < 420; // stack buttons below on very small widths
  const NOT_SIGNED_COLOR = complementaryHex(BAR_BG); // "#1A1A1A"

  const Btn = ({ title, onPress }: { title: string; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#fff",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
      }}
    >
      <Text style={{ fontWeight: "600" }}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ backgroundColor: BAR_BG, paddingHorizontal: 12, paddingVertical: 10 }}>
      {/* Match forms: centered column with maxWidth */}
      <View style={{ alignItems: "center" }}>
        <View style={{ width: "100%", maxWidth: CONTENT_MAX_W, gap: 8 }}>
          <View
            style={{
              flexDirection: isNarrow ? "column" : "row",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <Text style={{ fontWeight: "700", color: user ? "#111" : NOT_SIGNED_COLOR }}>
              {user ? `Signed in as ${user.email}` : "Not signed in"}
            </Text>

            <View style={{ flexDirection: "row", gap: 8 }}>
              {!user ? (
                <>
                  <Btn title="Sign Up" onPress={() => nav.navigate("SignUp")} />
                  <Btn title="Sign In" onPress={() => nav.navigate("SignIn")} />
                </>
              ) : (
                <Btn title="Sign out" onPress={signOut} />
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
