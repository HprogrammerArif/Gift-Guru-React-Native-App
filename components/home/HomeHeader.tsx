import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface HomeHeaderProps {
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onSearch?: (text: string) => void;
  value?: string;
}

const HomeHeader = ({
  onMenuPress,
  onNotificationPress,
  onSearch,
  value,
}: HomeHeaderProps) => {
  return (
    <View className="bg-[#FF4B3A] px-5 pt-4 pb-6 shadow-lg">
      <View className="flex-row items-center justify-between gap-4">
        {/* Menu Icon */}
        <TouchableOpacity onPress={onMenuPress} activeOpacity={0.7}>
          <Ionicons name="menu-outline" size={28} color="white" />
        </TouchableOpacity>

        <View className="flex-1">
          <View className="relative">
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              value={value}
              onChangeText={onSearch}
              placeholder="Search"
              placeholderTextColor="#888"
              className={"input border-gray-300 pr-4 bg-white rounded-full"}
            />

            {/* ----- EYE ICON (only when showEye === true) ----- */}

            <TouchableOpacity
              onPress={onSearch}
              className="absolute right-3 top-3.5"
              activeOpacity={0.7}
            >
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification Icon */}
        <TouchableOpacity onPress={() => router.push("/notifications")} activeOpacity={0.7}>
          <View className="relative">
            <Ionicons name="notifications-outline" size={28} color="white" />
            <View className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border-2 border-[#FF4B3A]" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;
