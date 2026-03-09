// app/(auth)/forgetpass/index.tsx
import React, { useState, useCallback } from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import CustomInput from "@/components/CustomInput";
import { GradientButton } from "@/components/GradientButton";
import { useForgetPasswordMutation } from "@/redux/features/auth/authApi";

// Email validation regex - moved outside component for better performance
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sendResetOtp] = useForgetPasswordMutation()

  // -----------------------------------------------------------------
  // Validation - Memoized for performance
  // -----------------------------------------------------------------
  const isValidEmail = useCallback((e: string): boolean => {
    return EMAIL_REGEX.test(e.trim());
  }, []);

  // -----------------------------------------------------------------
  // Submit Handler - Memoized to prevent unnecessary re-renders
  // -----------------------------------------------------------------
  const submit = useCallback(async () => {
    const trimmed = email.trim();

    // Input validation
    if (!trimmed) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    if (!isValidEmail(trimmed)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      // ----> 
      const response = await sendResetOtp({ email: trimmed }).unwrap();

    console.log("forgetpass", response);

      // Navigate to OTP screen with email
      router.push({
        pathname: "/forgetpass/otp-verify",
        params: { email: trimmed },
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send reset otp.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [email, isValidEmail]);

  // -----------------------------------------------------------------
  // Memoized email change handler
  // -----------------------------------------------------------------
  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
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
          <Text className="text-3xl font-bold text-black mb-4">
            Forgot Password
          </Text>

          <Text className="text-black text-sm mb-8">
            Enter the email of your account and we will send the email to reset
            your password.
          </Text>

          <CustomInput
            label="Enter Email"
            placeholder="Plant@gmail.com"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />
        </View>

        {/* --------------------------------------------------- */}
        {/* Fixed button at the bottom */}
        {/* --------------------------------------------------- */}
        <View className="pb-40 mt-6">
          <GradientButton
            title="Next"
            onPress={submit}
            isLoading={isSubmitting}
            textStyle="font-bold text-white"
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
