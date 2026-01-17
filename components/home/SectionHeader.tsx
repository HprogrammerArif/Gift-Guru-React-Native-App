import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

const SectionHeader = ({
  title,
  onSeeAll,
  icon,
  iconColor = "#FF4B3A",
}: SectionHeaderProps) => {
  return (
    <View className="flex-row items-center justify-between px-5 mb-4 mt-6">
      <View className="flex-row items-center gap-2">
        {icon && <Ionicons name={icon} size={20} color={iconColor} />}
        <Text className="text-xl font-bold text-[#1F2937]">{title}</Text>
      </View>
      <TouchableOpacity onPress={onSeeAll}>
        <Text className="text-sm font-semibold text-[#FF4B3A] underline">
          See all
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SectionHeader;
