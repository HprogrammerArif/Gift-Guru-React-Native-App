import CustomInput from "@/components/CustomInput";
import { GradientButton } from "@/components/GradientButton";
import {
  useChangePasswordFromProfileMutation,
  useSetPasswordFromProfileMutation,
} from "@/redux/features/auth/authApi";
import { selectLoginMethod } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const ChangePasswordScreen = () => {
  const router = useRouter();
  const loginMethod = useAppSelector(selectLoginMethod);
  const isGoogleUser = loginMethod === "google";

  const [changePassword, { isLoading: isChanging }] =
    useChangePasswordFromProfileMutation();
  const [setPassword, { isLoading: isSetting }] =
    useSetPasswordFromProfileMutation();

  const isLoading = isChanging || isSetting;

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdatePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = form;

    // ── Client-side validation ─────────────────────────────────────────────
    if (!isGoogleUser && !currentPassword) {
      return Alert.alert("Error", "Please enter your current password.");
    }
    if (!newPassword || !confirmPassword) {
      return Alert.alert("Error", "Please fill in all fields.");
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "New passwords do not match.");
    }
    if (newPassword.length < 6) {
      return Alert.alert(
        "Error",
        "Password must be at least 6 characters.",
      );
    }

    try {
      let res: any;

      if (isGoogleUser) {
        // ── Google user: set a password for the first time ─────────────────
        const formData = new FormData();
        formData.append("new_password", newPassword);
        formData.append("confirm_password", confirmPassword);
        res = await setPassword(formData);
      } else {
        // ── Email user: change existing password ───────────────────────────
        const formData = new FormData();
        formData.append("old_password", currentPassword);
        formData.append("new_password", newPassword);
        formData.append("confirm_password", confirmPassword);
        res = await changePassword(formData);
      }

      if (res?.data) {
        Toast.show({
          type: "success",
          text1: isGoogleUser
            ? "Password set successfully!"
            : "Password updated successfully!",
        });
        router.back();
      } else {
        const errorData = res?.error?.data;
        const msg =
          errorData?.old_password?.[0] ||
          errorData?.new_password?.[0] ||
          errorData?.confirm_password?.[0] ||
          errorData?.detail ||
          errorData?.message ||
          "Failed to update password. Please try again.";
        Alert.alert("Error", msg);
      }
    } catch (e: any) {
      Alert.alert("Error", e.message || "Something went wrong.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center">
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
          {isGoogleUser ? "Set Password" : "Change Password"}
        </Text>
      </View>

      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 10,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Info banner for Google users */}
        {isGoogleUser && (
          <View className="flex-row items-start bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 gap-3">
            <Ionicons name="logo-google" size={18} color="#2B7FFF" style={{ marginTop: 1 }} />
            <Text className="text-sm text-blue-700 flex-1" style={{ fontFamily: "QuickSand-Medium" }}>
              Your account uses Google Sign-In. You can set a password to also log in with your email.
            </Text>
          </View>
        )}

        {/* Form Fields */}
        <View className="gap-6 mb-10">
          {/* Current password — only for email users */}
          {!isGoogleUser && (
            <CustomInput
              label="Current Password"
              placeholder="••••••••"
              value={form.currentPassword}
              onChangeText={(t) => setForm((p) => ({ ...p, currentPassword: t }))}
              secureTextEntry={!showCurrent}
              showEye
              passwordVisible={showCurrent}
              onTogglePassword={setShowCurrent}
            />
          )}

          <CustomInput
            label="New Password"
            placeholder="••••••••"
            value={form.newPassword}
            onChangeText={(t) => setForm((p) => ({ ...p, newPassword: t }))}
            secureTextEntry={!showNew}
            showEye
            passwordVisible={showNew}
            onTogglePassword={setShowNew}
          />

          <CustomInput
            label="Confirm Password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChangeText={(t) => setForm((p) => ({ ...p, confirmPassword: t }))}
            secureTextEntry={!showConfirm}
            showEye
            passwordVisible={showConfirm}
            onTogglePassword={setShowConfirm}
          />
        </View>

        {/* Submit Button */}
        <View className="mt-auto">
          <GradientButton
            title={isGoogleUser ? "Set password" : "Update password"}
            onPress={handleUpdatePassword}
            isLoading={isLoading}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
