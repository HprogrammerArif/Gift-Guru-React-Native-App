import CustomInput from "@/components/CustomInput";
import CustomInputModified from "@/components/CustomInputModified";
import { GradientButton } from "@/components/GradientButton";
import RolePicker from "@/components/RolePicker";
import { API_IMAGE_URL } from "@/redux/api/baseApi";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/redux/features/profileService/profileApi";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

const countries = [
  {
    name: "United Kingdom",
    code: "+44",
    flag: "https://flagcdn.com/w40/gb.png",
  },
  { name: "United States", code: "+1", flag: "https://flagcdn.com/w40/us.png" },
  { name: "Canada", code: "+1", flag: "https://flagcdn.com/w40/ca.png" },
  { name: "Australia", code: "+61", flag: "https://flagcdn.com/w40/au.png" },
];

const ProfileSettingScreen = () => {
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();

  // ─── API ────────────────────────────────────────────────────────────────────
  const { data: profile, isLoading: profileLoading } =
    useGetUserProfileQuery(undefined);
  const [updateUserProfile] = useUpdateUserProfileMutation();

  // ─── Local state ────────────────────────────────────────────────────────────
  const [selectedCountry, setSelectedCountry] = useState(countries[1]);
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
    const options = countries.map((c) => `${c.name} (${c.code})`);
    options.push("Cancel");
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        title: "Select Country",
      },
      (selectedIndex?: number) => {
        if (selectedIndex !== undefined && selectedIndex < countries.length) {
          setSelectedCountry(countries[selectedIndex]);
        }
      },
    );
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

      // ── Only these 4 keys go to PUT auth/profile/ ──
      formData.append("first_name", form.firstName);
      formData.append("last_name", form.lastName);
      formData.append("phone", form.phone);
      formData.append("gender", form.gender);

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
                source={{ uri: selectedCountry.flag }}
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
              {selectedCountry.code}
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
        >
          <Text className="text-[#2B7FFF] text-lg font-quicksand-bold underline">
            Change password
          </Text>
        </TouchableOpacity>

        {/* Update Button */}
        <View className="mt-auto">
          <GradientButton
            title="Update profile"
            onPress={handleUpdate}
            isLoading={isSubmitting || profileLoading}
          />
        </View>
      </KeyboardAwareScrollView>
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
