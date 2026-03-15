import { RECOMMENDED_DATA } from "@/constants";
import { useGetUnreadCountQuery } from "@/redux/features/notifications/notificationApi";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const CARD_WIDTH = width / 3;

  const { data: countData } = useGetUnreadCountQuery();
  const unreadCount = countData?.unread_count || 0;

  // Create a large dataset for "infinite" scrolling simulation
  // This is a common high-performance pattern for React Native carousels
  const infiniteData = React.useMemo(
    () => Array.from({ length: 1000 }).flatMap(() => RECOMMENDED_DATA),
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = currentIndex + 1;
      // If we get huge, silently reset. But 1000 * 6 items is plenty for hours.
      if (nextIndex >= infiniteData.length) {
        flatListRef.current?.scrollToIndex({ index: 0, animated: false });
        setCurrentIndex(0);
        return;
      }

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
        viewOffset: 0,
      });
      setCurrentIndex(nextIndex);
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex, infiniteData.length]);

  return (
    <View className=" px-2 pt-4 pb-6 ">
      <View className="flex-row items-center justify-between gap-3">
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
              placeholder="Search products..."
              placeholderTextColor="#9CA3AF"
              className="bg-white rounded-full px-5 py-3 text-base text-black pr-12 shadow-sm"
              style={{ height: 44 }}
            />

            <View className="absolute right-4 top-0 bottom-0 justify-center">
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>

        {/* Notification Icon */}
        <TouchableOpacity
          onPress={() => router.push("/notifications")}
          activeOpacity={0.7}
        >
          <View className="relative">
            <Ionicons name="notifications-outline" size={28} color="white" />
            {unreadCount > 0 && (
              <View
                className="absolute -top-1 -right-1 bg-yellow-400 rounded-full border-2 border-[#FF4B3A] items-center justify-center min-w-[18px] h-[18px] px-1"
                style={{ zIndex: 10 }}
              >
                <Text
                  style={{ color: "#FF4B3A", fontSize: 10, fontWeight: "bold" }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;
