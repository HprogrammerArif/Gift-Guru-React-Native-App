import CustomInput from "@/components/CustomInput";
import CustomInputModified from "@/components/CustomInputModified";
import { GradientButton } from "@/components/GradientButton";
import RolePicker from "@/components/RolePicker";
import { API_IMAGE_URL } from "@/redux/api/baseApi";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useDeleteAccountMutation,
} from "@/redux/features/profileService/profileApi";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { clearPremiumStatus } from "@/redux/features/revenuecat/revenuecatSlice";
import { logOutRevenueCat } from "@/utils/revenuecat";
import { baseApi } from "@/redux/api/baseApi";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";



const ProfileSettingScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showActionSheetWithOptions } = useActionSheet();

  // ─── API ────────────────────────────────────────────────────────────────────
  const { data: profile, isLoading: profileLoading } =
    useGetUserProfileQuery(undefined);
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const [deleteAccount] = useDeleteAccountMutation();

  // ─── Local state ────────────────────────────────────────────────────────────
  const [countryCode, setCountryCode] = useState<CountryCode>("US");
  const [callingCode, setCallingCode] = useState("1");
  const [isCountryPickerVisible, setCountryPickerVisible] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "" as "Male" | "Female" | "",
  });
  const [localImage, setLocalImage] = useState<string | null>(null); // newly picked URI
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Pre-fill form from API ──────────────────────────────────────────────────
  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.first_name ?? "",
        lastName: profile.last_name ?? "",
        phone: profile.phone ?? "",
        email: profile.email ?? "",
        gender: (profile.gender as "Male" | "Female" | "") ?? "",
      });
    }
  }, [profile]);

  // ─── Displayed avatar ───────────────────────────────────────────────────────
  const avatarUri = localImage
    ? localImage
    : profile?.image
      ? profile.image.startsWith("http")
        ? profile.image
        : `${API_IMAGE_URL}${profile.image}`
      : null;

  // ─── Country picker ─────────────────────────────────────────────────────────
  const handleCountryPress = () => {
    setCountryPickerVisible(true);
  };

  // ─── Image picker ────────────────────────────────────────────────────────────
  const handlePickImage = () => {
    showActionSheetWithOptions(
      {
        options: ["Take Photo", "Choose from Library", "Cancel"],
        cancelButtonIndex: 2,
        title: "Change Profile Photo",
      },
      async (index?: number) => {
        if (index === 0) {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Permission needed", "Camera access is required.");
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });
          if (!result.canceled) setLocalImage(result.assets[0].uri);
        } else if (index === 1) {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Permission needed",
              "Photo library access is required.",
            );
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });
          if (!result.canceled) setLocalImage(result.assets[0].uri);
        }
      },
    );
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // ── Append scalar fields ──
      formData.append("first_name", form.firstName);
      formData.append("last_name", form.lastName);
      
      // ── Assemble global phone number ──
      let cleanPhone = form.phone.replace(/[^\d+]/g, ''); // strip spaces, dashes, parens
      if (cleanPhone && !cleanPhone.startsWith("+")) {
        cleanPhone = `+${callingCode}${cleanPhone}`; // Add calling code if missing
      }
      formData.append("phone", cleanPhone);

      if (form.gender) {
        formData.append("gender", form.gender);
      }

      // Image is optional — only append when the user picked a new one
      if (localImage) {
        const filename = localImage.split("/").pop() ?? "photo.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";
        formData.append("image", {
          uri: localImage,
          name: filename,
          type,
        } as any);
      }

      const res: any = await updateUserProfile(formData);
      if (res?.data) {
        Toast.show({ type: "success", text1: "Profile updated successfully!" });
        router.back();
      } else {
        const msg =
          res?.error?.data?.detail ||
          res?.error?.data?.message ||
          "Update failed. Please try again.";
        Alert.alert("Error", msg);
      }
    } catch (e: any) {
      Alert.alert("Error", e.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Delete Account ──────────────────────────────────────────────────────────
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
                const msg = res.error?.data?.detail || res.error?.data?.message || "Failed to delete account. Please try again.";
                Alert.alert("Error", msg);
                return;
              }
              // Clean up all session state
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

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center -ml-2"
        >
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "QuickSand-Bold" }}
          className="text-2xl text-[#171717] flex-1 text-center pr-8"
        >
          Profile setting
        </Text>
      </View>

      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile Photo ── */}
        <View className="items-center mb-8">
          <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
            <View style={styles.avatarWrapper}>
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color="#9CA3AF" />
                </View>
              )}
              {/* Edit badge */}
              <View style={styles.editBadge}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <Text className="mt-3 text-sm text-gray-400">
            Tap to change photo
          </Text>
        </View>

        {/* First & Last Name */}
        <View className="flex-row gap-4 mb-5">
          <CustomInputModified
            label="First Name"
            placeholder="First Name"
            value={form.firstName}
            onChangeText={(t) => setForm((p) => ({ ...p, firstName: t }))}
            containerClassName="flex-1"
          />
          <CustomInputModified
            label="Last Name"
            placeholder="Last Name"
            value={form.lastName}
            onChangeText={(t) => setForm((p) => ({ ...p, lastName: t }))}
            containerClassName="flex-1"
          />
        </View>

        {/* Phone */}
        <View className="mb-5">
          <Text className="label">Phone</Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-[52px] bg-white">
            <TouchableOpacity
              onPress={handleCountryPress}
              activeOpacity={0.7}
              className="flex-row items-center mr-3"
            >
              <Image
                source={{ uri: `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png` }}
                className="w-6 h-4 rounded-sm"
              />
              <Ionicons
                name="chevron-down"
                size={12}
                color="#6B7280"
                className="ml-1"
              />
            </TouchableOpacity>
            <View className="w-px h-6 bg-gray-200 mr-3" />
            <Text
              style={{ fontFamily: "QuickSand-SemiBold" }}
              className="text-base text-gray-700 mr-1"
            >
              +{callingCode}
            </Text>
            <TextInput
              value={form.phone}
              onChangeText={(t) => setForm((p) => ({ ...p, phone: t }))}
              placeholder="0000 000 000"
              keyboardType="phone-pad"
              className="text-base font-quicksand-semibold flex-1 text-black"
              style={{ paddingVertical: 0 }}
            />
          </View>
        </View>

        {/* Email */}
        <View className="mb-5 relative">
          <CustomInput
            label="Email"
            value={form.email}
            onChangeText={(t) => setForm((p) => ({ ...p, email: t }))}
            placeholder="Email address"
            keyboardType="email-address"
          />
        </View>

        {/* Gender */}
        <View className="mb-8">
          <RolePicker
            value={form.gender}
            onValueChange={(val) => setForm((p) => ({ ...p, gender: val }))}
          />
        </View>

        {/* Change Password */}
        <TouchableOpacity
          onPress={() => router.push("/change-password")}
          className="mb-8"
          accessibilityLabel="Change password"
          accessibilityRole="button"
        >
          <Text className="text-[#2B7FFF] text-lg font-quicksand-bold underline">
            Change password
          </Text>
        </TouchableOpacity>

        {/* Update Button */}
        <View className="mb-6">
          <GradientButton
            title="Update profile"
            onPress={handleUpdate}
            isLoading={isSubmitting || profileLoading}
          />
        </View>

        {/* Legal Links */}
        <View className="border-t border-gray-100 pt-6 mb-4 gap-4">
          <TouchableOpacity
            onPress={() => router.push("/privacy-policy")}
            className="flex-row items-center justify-between py-3 border-b border-gray-50"
            accessibilityLabel="Privacy Policy"
            accessibilityRole="button"
          >
            <View className="flex-row items-center gap-3">
              <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
              <Text style={{ fontFamily: "QuickSand-SemiBold" }} className="text-gray-700 text-[15px]">
                Privacy Policy
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/terms-of-service")}
            className="flex-row items-center justify-between py-3 border-b border-gray-50"
            accessibilityLabel="Terms of Service"
            accessibilityRole="button"
          >
            <View className="flex-row items-center gap-3">
              <Ionicons name="document-text-outline" size={20} color="#6B7280" />
              <Text style={{ fontFamily: "QuickSand-SemiBold" }} className="text-gray-700 text-[15px]">
                Terms of Service
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Delete Account */}
        <TouchableOpacity
          onPress={handleDeleteAccount}
          className="flex-row items-center justify-center gap-2 border border-red-200 rounded-2xl py-3 px-6 mb-8"
          accessibilityLabel="Delete account permanently"
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
          <Text style={{ fontFamily: "QuickSand-SemiBold" }} className="text-red-500 text-sm">
            Delete Account
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      {isCountryPickerVisible && (
        <CountryPicker
          visible={isCountryPickerVisible}
          countryCode={countryCode} // <-- ADDED THIS REQUIRED PROP
          onClose={() => setCountryPickerVisible(false)}
          onSelect={(country) => {
            setCountryCode(country.cca2);
            setCallingCode(country.callingCode[0] || "1");
            setCountryPickerVisible(false);
          }}
          withFilter
          withCallingCode
          withAlphaFilter
          containerButtonStyle={{ display: "none" }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#F3F4F6",
    borderWidth: 2,
    borderColor: "rgba(255, 75, 58, 0.15)",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#2B7FFF",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProfileSettingScreen;
