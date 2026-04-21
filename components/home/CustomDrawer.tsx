import { Ionicons } from "@expo/vector-icons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { API_IMAGE_URL, baseApi } from "../../redux/api/baseApi";
import { logout } from "../../redux/features/auth/authSlice";
import { useGetUserProfileQuery } from "../../redux/features/profileService/profileApi";
import { logOutRevenueCat } from "../../utils/revenuecat";
import { usePremium } from "@/hooks/usePremium";

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
  const dispatch = useDispatch();
  const { isPremium } = usePremium();

  console.log("is premium:", isPremium);

  const handleLogout = async () => {
    try {
      await logOutRevenueCat();
    } catch (error) {
      console.error("RevenueCat logout error:", error);
    }
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    router.replace("/sign-in");
  };

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
        <TouchableOpacity
          className="py-10"
          activeOpacity={0.7}
          onPress={() => {
            props.navigation.closeDrawer();
            router.push("/profile-setting");
          }}
        >
          <View
            className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center border-2 border-[#FF4B3A]/10"
            style={styles.avatarContainer}
          >
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person" size={32} color="#9CA3AF" />
            )}
          </View>
          <View className="flex-row items-center gap-2 mt-4">
            <Text className="text-xl font-bold text-gray-900">
              {fullName}
            </Text>
            {isPremium && (
              <View className="bg-[#2B7FFF] px-2 py-0.5 rounded-md">
                <Text className="text-white text-[10px] uppercase font-bold">
                  PRO
                </Text>
              </View>
            )}
          </View>
          <Text className="text-sm text-gray-500">{email}</Text>
        </TouchableOpacity>

        {/* Navigation Items */}
        <View className="flex-1">
          <MenuItem
            icon="diamond-sharp"
            label="Membership"
            badge={isPremium ? "pro" : "free"}
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
            label="Settings and privacy"
            onPress={() => {
              props.navigation.closeDrawer();
              router.push("/setting-privacy");
            }}
          />

          <MenuItem
            icon="log-out-sharp"
            label="Log out"
            isLast
            onPress={handleLogout}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 9999,
  },
});

export default CustomDrawer;
