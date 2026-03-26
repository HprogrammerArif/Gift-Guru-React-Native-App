import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
  query: string;
  hasFilters: boolean;
}

const EmptyState = ({ query, hasFilters }: EmptyStateProps) => (
  <View
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 80,
    }}
  >
    <View
      style={{
        width: 72,
        height: 72,
        borderRadius: 99,
        backgroundColor: "#FFF0ED",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
      }}
    >
      <Ionicons name="search-outline" size={32} color="#FF4B3A" />
    </View>
    <Text
      style={{
        fontSize: 17,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 6,
      }}
    >
      No results found
    </Text>
    <Text
      style={{
        fontSize: 14,
        color: "#6B7280",
        textAlign: "center",
        maxWidth: 240,
      }}
    >
      {query
        ? `No posts match "${query}"`
        : hasFilters
        ? "No posts match the selected filters"
        : "Start typing to search for posts"}
    </Text>
  </View>
);

export default EmptyState;
