// app/(auth)/forgetpass/change-newpass.tsx
import React, { useState, useCallback } from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import CustomInput from "@/components/CustomInput";
import { GradientButton } from "@/components/GradientButton";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
// import { useChangePasswordMutation } from "@/services/authApi";

// Password validation constants - moved outside for better performance
const MIN_PASSWORD_LENGTH = 6;

const ChangeNewPassword = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email } = useLocalSearchParams<{ email: string }>();
  console.log("Email from params:", email);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [changePassword] = useChangePasswordMutation();

  // -----------------------------------------------------------------
  // Validation - Memoized for performance
  // -----------------------------------------------------------------
  const validate = useCallback((): boolean => {
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      Alert.alert("Error", `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return false;
    }
    return true;
  }, [password, confirmPassword]);

  // -----------------------------------------------------------------
  // Submit Handler - Memoized to prevent unnecessary re-renders
  // Note: Add email and password to dependencies when API is integrated
  // -----------------------------------------------------------------
  const submit = useCallback(async () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // When integrating the API, uncomment and add email, password to dependencies:
      const response  = await changePassword({
        email,
        new_password: password,
        confirm_password: password,
   
      }).unwrap();

      console.log("Password change response:", response);

      router.replace("/forgetpass/successful");
    } catch (err) {
      const errorMessage =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String(err.data.message)
          : "Failed to change password.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [validate]);

  // -----------------------------------------------------------------
  // Memoized input change handlers
  // -----------------------------------------------------------------
  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
  }, []);

  const handleConfirmPasswordChange = useCallback((text: string) => {
    setConfirmPassword(text);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPwd((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirm((prev) => !prev);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 80,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        extraKeyboardSpace={20}
      >
        {/* --------------------------------------------------- */}
        {/* Content Section */}
        {/* --------------------------------------------------- */}
        <View className="flex-1">
          <Text className="text-3xl font-bold text-black mb-8">
            Enter new password
          </Text>

          {/* Password Input */}
          <View className="mb-3">
            <CustomInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={!showPwd}
              showEye
              passwordVisible={showPwd}
              onTogglePassword={togglePasswordVisibility}
              textContentType="password"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Confirm Password Input */}
          <CustomInput
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            secureTextEntry={!showConfirm}
            showEye
            passwordVisible={showConfirm}
            onTogglePassword={toggleConfirmPasswordVisibility}
            textContentType="password"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* --------------------------------------------------- */}
        {/* Fixed button at the bottom */}
        {/* --------------------------------------------------- */}
        <View className="pb-40 mt-6">
          <GradientButton
            title="Change Password"
            onPress={submit}
            isLoading={isSubmitting}
            textStyle="font-bold text-white"
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ChangeNewPassword;