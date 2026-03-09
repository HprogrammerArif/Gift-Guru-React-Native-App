import { GradientButton } from "@/components/GradientButton";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/authApi";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyOtp() {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-advance to next input
    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      Alert.alert("Error", "Please enter a valid 4-digit verification code");
      return;
    }

    try {
      const response: any = await verifyOtp({
        email: email as string,
        code: otpValue,
      });

      if (response?.data?.message) {
        Alert.alert(
          "Success",
          response.data.message || "Verification successful!",
        );
        router.replace("/(auth)/sign-in");
      } else if (response?.error) {
        Alert.alert(
          "Verification Failed",
          response.error.data?.error ||
            response.error.data?.message ||
            "Invalid OTP",
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Verification Failed",
        error.message || "Something went wrong",
      );
    }
  };

  const handleResend = async () => {
    try {
      const response: any = await resendOtp({ email: email as string });

      if (response?.data?.message) {
        Alert.alert("Success", "Verification code resent successfully");
      } else if (response?.error) {
        Alert.alert(
          "Failed",
          response.error.data?.error || "Could not resend code",
        );
      }
    } catch (error: any) {
      Alert.alert("Failed", error.message || "Something went wrong");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center p-5">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-5"
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text className="text-3xl font-bold mb-2">Verify OTP</Text>
      <Text className="text-gray-500 text-center mb-10">
        We have sent a verification code to {email || "your email"}
      </Text>

      <View className="flex-row gap-2 mb-10">
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            className="w-12 h-14 border border-gray-300 rounded-xl items-center justify-center"
          >
            <TextInput
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              maxLength={1}
              keyboardType="numeric"
              className="text-2xl font-bold text-center w-full h-full"
              value={otp[index]}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          </View>
        ))}
      </View>

      <GradientButton
        title={isLoading ? "Verifying..." : "Verify"}
        onPress={handleVerify}
      />

      <TouchableOpacity
        className="mt-6"
        onPress={handleResend}
        disabled={isResending}
      >
        <Text className="text-[#2B7FFF] font-bold">
          {isResending ? "Resending..." : "Resend Code"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
