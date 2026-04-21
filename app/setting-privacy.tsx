import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDeleteAccountMutation } from "@/redux/features/profileService/profileApi";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { clearPremiumStatus } from "@/redux/features/revenuecat/revenuecatSlice";
import { logOutRevenueCat } from "@/utils/revenuecat";
import { baseApi } from "@/redux/api/baseApi";

// ─── Reusable Row ─────────────────────────────────────────────────────────────
const SettingRow = ({
  icon,
  iconBg,
  iconColor,
  label,
  sublabel,
  onPress,
  isLast,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
  isLast?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.65}
    style={{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: "#F3F4F6",
    }}
  >
    {/* Icon bubble */}
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: iconBg,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
      }}
    >
      <Ionicons name={icon} size={20} color={iconColor} />
    </View>

    {/* Labels */}
    <View style={{ flex: 1 }}>
      <Text style={{ fontFamily: "QuickSand-SemiBold", fontSize: 15, color: "#111827" }}>
        {label}
      </Text>
      {sublabel ? (
        <Text style={{ fontFamily: "QuickSand-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>
          {sublabel}
        </Text>
      ) : null}
    </View>

    <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
  </TouchableOpacity>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
const SettingAndPrivacyScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [deleteAccount] = useDeleteAccountMutation();

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? All your posts, wishlists, and data will be removed. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res: any = await deleteAccount(undefined);
              if (res?.error) {
                const msg =
                  res.error?.data?.detail ||
                  res.error?.data?.message ||
                  "Failed to delete account. Please try again.";
                Alert.alert("Error", msg);
                return;
              }
              await logOutRevenueCat().catch(console.error);
              dispatch(clearPremiumStatus());
              dispatch(logout());
              dispatch(baseApi.util.resetApiState());
              router.replace("/(auth)/sign-in");
            } catch {
              Alert.alert("Error", "Something went wrong. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }} edges={["top"]}>
      {/* ── Header ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: "#F9FAFB",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "QuickSand-Bold",
            fontSize: 20,
            color: "#111827",
            marginLeft: 12,
          }}
        >
          Settings & Privacy
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
      >
        {/* ── Account section ── */}
        <Text
          style={{
            fontFamily: "QuickSand-Bold",
            fontSize: 11,
            color: "#9CA3AF",
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 8,
            marginLeft: 4,
          }}
        >
          Account
        </Text>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
            marginBottom: 24,
          }}
        >
          <SettingRow
            icon="lock-closed-outline"
            iconBg="#EFF6FF"
            iconColor="#2B7FFF"
            label="Change Password"
            sublabel="Update your account password"
            onPress={() => router.push("/change-password")}
            isLast
          />
        </View>

        {/* ── Legal section ── */}
        <Text
          style={{
            fontFamily: "QuickSand-Bold",
            fontSize: 11,
            color: "#9CA3AF",
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 8,
            marginLeft: 4,
          }}
        >
          Legal
        </Text>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
            marginBottom: 24,
          }}
        >
          <SettingRow
            icon="shield-checkmark-outline"
            iconBg="#F0FDF4"
            iconColor="#16A34A"
            label="Privacy Policy"
            sublabel="How we handle your data"
            onPress={() => router.push("/privacy-policy")}
          />
          <SettingRow
            icon="document-text-outline"
            iconBg="#FFF7ED"
            iconColor="#EA580C"
            label="Terms of Service"
            sublabel="Rules governing your use of GiftGuru"
            onPress={() => router.push("/terms-of-service")}
            isLast
          />
        </View>

        {/* ── Danger zone ── */}
        <Text
          style={{
            fontFamily: "QuickSand-Bold",
            fontSize: 11,
            color: "#9CA3AF",
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 8,
            marginLeft: 4,
          }}
        >
          Danger Zone
        </Text>
        <TouchableOpacity
          onPress={handleDeleteAccount}
          activeOpacity={0.7}
          style={{
            backgroundColor: "#FFF1F2",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#FECDD3",
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
          }}
          accessibilityLabel="Delete account permanently"
          accessibilityRole="button"
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: "#FEE2E2",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 14,
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "QuickSand-Bold", fontSize: 15, color: "#EF4444" }}>
              Delete Account
            </Text>
            <Text style={{ fontFamily: "QuickSand-Regular", fontSize: 12, color: "#F87171", marginTop: 1 }}>
              Permanently remove your account and all data
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#FCA5A5" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingAndPrivacyScreen;
