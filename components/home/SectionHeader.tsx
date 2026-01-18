import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import cn from "clsx";

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  textColor?: string;
}

const SectionHeader = ({
  title,
  onSeeAll,
  icon,
  iconColor,
  textColor,
}: SectionHeaderProps) => {
  return (
    <View className="flex-row items-center justify-between px-4 mb-2">
      <View className="flex-row items-center gap-1">
        {icon && <Ionicons name={icon} size={20} color={iconColor} />}
        <Text className={cn("text-xl font-bold", textColor)}>{title}</Text>
      </View>
      <TouchableOpacity onPress={onSeeAll}>
        <Text className={cn("text-md font-semibold underline ", textColor)}>
          See all
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SectionHeader;
