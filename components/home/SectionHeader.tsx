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
    <View className="flex-row items-center justify-between px-4 mb-1">
      <View className="flex-row items-center gap-1">
        {icon && <Ionicons name={icon} size={20} color={iconColor} />}
        <Text className="text-xl font-bold text-black">{title}</Text>
      </View>
      <TouchableOpacity onPress={onSeeAll}>
        <Text className="text-md font-semibold text-black underline">
          See all
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SectionHeader;
