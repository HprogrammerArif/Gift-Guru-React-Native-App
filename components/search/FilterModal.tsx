import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  categories: { id: number; name: string }[];
  occasions: { id: number; name: string }[];
  targetAudience: string[];
  selectedAudience: string | null;
  selectedCategory: number | null;
  selectedOccasion: number | null;
  onSelectAudience: (aud: string | null) => void;
  onSelectCategory: (id: number | null) => void;
  onSelectOccasion: (id: number | null) => void;
  onApply: () => void;
  onReset: () => void;
}

const FilterModal = ({
  visible,
  onClose,
  categories,
  occasions,
  targetAudience,
  selectedAudience,
  selectedCategory,
  selectedOccasion,
  onSelectAudience,
  onSelectCategory,
  onSelectOccasion,
  onApply,
  onReset,
}: FilterModalProps) => {
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }}
        onPress={onClose}
      >
        <Pressable onPress={() => {}} style={{ flex: 1 }} />
      </Pressable>

      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingBottom: 40,
          transform: [{ translateY: slideAnim }],
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 20,
        }}
      >
        {/* Handle */}
        <View
          style={{
            alignSelf: "center",
            width: 40,
            height: 4,
            backgroundColor: "#E5E7EB",
            borderRadius: 99,
            marginTop: 12,
            marginBottom: 4,
          }}
        />

        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#F3F4F6",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>
            Filter Posts
          </Text>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={24}
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: 99,
              padding: 6,
            }}
          >
            <Ionicons name="close" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {/* Target Audience */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            Target Audience
          </Text>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 }}
          >
            {targetAudience.map((aud) => {
              const isActive =
                (aud === "all" && selectedAudience === null) ||
                selectedAudience === aud;
              return (
                <TouchableOpacity
                  key={aud}
                  onPress={() => onSelectAudience(aud === "all" ? null : aud)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 99,
                    backgroundColor: isActive ? "#FF4B3A" : "#F3F4F6",
                    borderWidth: 1,
                    borderColor: isActive ? "#FF4B3A" : "#E5E7EB",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: isActive ? "white" : "#374151",
                      textTransform: "capitalize",
                    }}
                  >
                    {aud}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Categories */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            Category
          </Text>

          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 }}
          >
            <TouchableOpacity
              onPress={() => onSelectCategory(null)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 99,
                backgroundColor: selectedCategory === null ? "#2B7FFF" : "#F3F4F6",
                borderWidth: 1,
                borderColor: selectedCategory === null ? "#2B7FFF" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: selectedCategory === null ? "white" : "#374151",
                }}
              >
                All
              </Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() =>
                  onSelectCategory(selectedCategory === cat.id ? null : cat.id)
                }
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 99,
                  backgroundColor:
                    selectedCategory === cat.id ? "#2B7FFF" : "#F3F4F6",
                  borderWidth: 1,
                  borderColor:
                    selectedCategory === cat.id ? "#2B7FFF" : "#E5E7EB",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: selectedCategory === cat.id ? "white" : "#374151",
                  }}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Occasions */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            Occasion
          </Text>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 32 }}
          >
            <TouchableOpacity
              onPress={() => onSelectOccasion(null)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 99,
                backgroundColor: selectedOccasion === null ? "#DBEAFE" : "#F3F4F6",
                borderWidth: 1,
                borderColor: selectedOccasion === null ? "#DBEAFE" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: selectedOccasion === null ? "#2B7FFF" : "#374151",
                }}
              >
                All
              </Text>
            </TouchableOpacity>
            {occasions.map((occ) => (
              <TouchableOpacity
                key={occ.id}
                onPress={() =>
                  onSelectOccasion(selectedOccasion === occ.id ? null : occ.id)
                }
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 99,
                  backgroundColor:
                    selectedOccasion === occ.id ? "#DBEAFE" : "#F3F4F6",
                  borderWidth: 1,
                  borderColor:
                    selectedOccasion === occ.id ? "#DBEAFE" : "#E5E7EB",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: selectedOccasion === occ.id ? "#2B7FFF" : "#374151",
                  }}
                >
                  {occ.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={onReset}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 14,
                backgroundColor: "#F3F4F6",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "700", color: "#374151" }}>
                Reset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onApply}
              style={{
                flex: 2,
                paddingVertical: 10,
                borderRadius: 14,
                backgroundColor: "#FF4B3A",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "700", color: "white" }}>
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default FilterModal;
