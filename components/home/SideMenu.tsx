import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const MENU_WIDTH = width * 0.75;

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: string;
  onPress: () => void;
  isLast?: boolean;
}

const MenuItem = ({ icon, label, badge, onPress, isLast }: MenuItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.6}
    className={`flex-row items-center justify-between py-4 ${isLast ? "mt-auto mb-6" : ""}`}
  >
    <View className="flex-row items-center gap-4">
      <Ionicons name={icon} size={24} color={isLast ? "#FF4B3A" : "#1F2937"} />
      <Text
        className={`text-lg font-semibold ${isLast ? "text-[#FF4B3A]" : "text-gray-900"}`}
      >
        {label}
      </Text>
    </View>
    {badge && (
      <View className="bg-[#EBF4FF] px-3 py-1 rounded-lg">
        <Text className="text-[#2B7FFF] text-xs font-bold uppercase">
          {badge}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

interface SideMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

const SideMenu = ({ isVisible, onClose }: SideMenuProps) => {
  const translateX = useSharedValue(-MENU_WIDTH);

  useEffect(() => {
    translateX.value = withTiming(isVisible ? 0 : -MENU_WIDTH, {
      duration: 300,
    });
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 z-50 flex-row">
      {/* Backdrop */}
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        className="absolute inset-0 bg-black/40"
      >
        <Pressable className="flex-1" onPress={onClose} />
      </Animated.View>

      {/* Menu Sheet */}
      <Animated.View
        style={[animatedStyle, { width: MENU_WIDTH }]}
        className="h-full bg-white shadow-2xl"
      >
        <View style={{ width: MENU_WIDTH }} className="flex-1">
          <SafeAreaView className="flex-1 px-6">
            {/* Header / Logo Space */}
            <View className="py-10">
              <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center">
                <Ionicons name="person" size={32} color="#9CA3AF" />
              </View>
            </View>

            {/* Navigation Options */}
            <View className="flex-1">
              <MenuItem
                icon="medal-outline"
                label="Membership"
                badge="pro"
                onPress={() => {
                  onClose(); /* Navigation */
                }}
              />
              <MenuItem
                icon="bookmark-outline"
                label="My wish list"
                onPress={() => {
                  onClose();
                }}
              />
              <MenuItem
                icon="grid-outline"
                label="Dashboard"
                onPress={() => {
                  onClose();
                }}
              />
              <MenuItem
                icon="settings-outline"
                label="Profile setting"
                onPress={() => {
                  onClose();
                }}
              />

              <MenuItem
                icon="log-out-outline"
                label="Log out"
                isLast
                onPress={() => {
                  onClose();
                }}
              />
            </View>
          </SafeAreaView>
        </View>
      </Animated.View>
    </View>
  );
};

export default SideMenu;
