import CustomInput from "@/components/CustomInput";
import { GradientButton } from "@/components/GradientButton";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

const ChangePasswordScreen = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdatePassword = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    router.back();
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
        {/* Form Fields */}
        <View className="gap-6 mb-10">
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

        {/* Update Button */}
        <View className="mt-auto">
          <GradientButton
            title="Update password"
            onPress={handleUpdatePassword}
            isLoading={isSubmitting}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
