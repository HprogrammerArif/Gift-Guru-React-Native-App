import { RECOMMENDED_DATA } from "@/constants";
import { useGetUnreadCountQuery } from "@/redux/features/notifications/notificationApi";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState, memo } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View
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
    () => Array.from({ length: 100 }).flatMap(() => RECOMMENDED_DATA),
    [],
  );
  // ✅ Use a ref so setInterval doesn't recreate every tick
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = currentIndexRef.current + 1;
      if (nextIndex >= infiniteData.length) {
        flatListRef.current?.scrollToIndex({ index: 0, animated: false });
        currentIndexRef.current = 0;
        setCurrentIndex(0);
        return;
      }
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
        viewOffset: 0,
      });
      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
    }, 2000);
    return () => clearInterval(interval);
  // ✅ No stale closure — reads from ref, only depends on data length
  }, [infiniteData.length]);

  return (
    <View className=" px-2 pt-4 pb-6 ">
      <View className="flex-row items-center justify-between gap-3">
        {/* Menu Icon */}
        <TouchableOpacity onPress={onMenuPress} activeOpacity={0.7}>
          <Ionicons name="menu-outline" size={28} color="white" />
        </TouchableOpacity>

        <View className="flex-1">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/search-with-filter")}
            className="flex-row items-center bg-white rounded-full px-5 shadow-sm"
            style={{ height: 44 }}
          >
            <Text className="flex-1 text-base text-[#9CA3AF]">
              Search products...
            </Text>
            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
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

export default memo(HomeHeader);
