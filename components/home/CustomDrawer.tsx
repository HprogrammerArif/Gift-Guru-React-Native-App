import { Ionicons } from "@expo/vector-icons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_IMAGE_URL } from "../../redux/api/baseApi";
import { useGetUserProfileQuery } from "../../redux/features/profileService/profileApi";

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
    className={`flex-row items-center justify-between py-4 ${isLast ? "mt-auto mb-6" : "mb-2"}`}
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

const CustomDrawer = (props: DrawerContentComponentProps) => {
  const router = useRouter();

  const { data: profile } = useGetUserProfileQuery(undefined);

  const fullName =
    profile?.first_name || profile?.last_name
      ? `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim()
      : "User Profile";

  const email = profile?.email ?? "user@example.com";

  const imageUri = profile?.image
    ? profile.image.startsWith("http")
      ? profile.image
      : `${API_IMAGE_URL}${profile.image}`
    : null;

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 px-6">
        {/* Header / Profile Section */}
        <View className="py-10">
          <View className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center border-2 border-[#FF4B3A]/10 overflow-hidden">
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person" size={32} color="#9CA3AF" />
            )}
          </View>
          <Text className="mt-4 text-xl font-bold text-gray-900">
            {fullName}
          </Text>
          <Text className="text-sm text-gray-500">{email}</Text>
        </View>

        {/* Navigation Items */}
        <View className="flex-1">
          <MenuItem
            icon="diamond-sharp"
            label="Membership"
            badge="pro"
            onPress={() => {
              props.navigation.closeDrawer();
              router.push("/membership");
            }}
          />
          <MenuItem
            icon="bookmark-sharp"
            label="My wish list"
            onPress={() => {
              props.navigation.closeDrawer();
              router.push("/my-wish-list");
            }}
          />
          <MenuItem
            icon="bar-chart-sharp"
            label="Dashboard"
            onPress={() => {
              props.navigation.closeDrawer();
              router.push("/dashboard");
            }}
          />
          <MenuItem
            icon="settings-sharp"
            label="Profile setting"
            onPress={() => {
              props.navigation.closeDrawer();
              router.push("/profile-setting");
            }}
          />

          <MenuItem
            icon="log-out-sharp"
            label="Log out"
            isLast
            onPress={() => {}}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CustomDrawer;
