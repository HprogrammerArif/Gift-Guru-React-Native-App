// app/(auth)/verify-otp.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useForgetPasswordMutation, useOtpVerifyMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/features/auth/authSlice";

const VerifyOtp = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  console.log({email})
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(""); // Error message
  const [sendResetOtpAgain] = useForgetPasswordMutation()
  const [otpVerify] = useOtpVerifyMutation()

  const inputs = useRef<(TextInput | null)[]>([]);
  const dispatch = useAppDispatch();

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Auto-verify when 4 digits
  useEffect(() => {
    if (otp.every((d) => d.length === 1)) {
      handleVerify();
    }
  }, [otp]);

  // Only allow digits
  const handleOtpChange = (index: number, value: string) => {
    // Filter non-digits
    const digit = value.replace(/[^0-9]/g, "");
    if (digit.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError(""); // Clear error on input

    // Auto-focus next
    if (digit && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  // Backspace: go to previous input
  const handleKeyPress = (index: number, e: any) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) return;

    setIsVerifying(true);
    setError("");

    try {
      // otp verify
      const response = await otpVerify({ email, code: otpCode }).unwrap();

      console.log("otp verify",response);


      
     

      if (response.message) {
        //  router.push({ pathname: "/verify-otp", params: { email } });
        // router.replace("/add-child"); // Navigate on success
        
        router.push({
                pathname: "/forgetpass/change-newpass",
                params: { email: email },
              });
      } else {
        setError("Invalid OTP. Please try again.");
        setOtp(["", "", "", ""]);
        inputs.current[0]?.focus();
      }
    } catch (err) {
      setError("Verification failed. Try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setCanResend(false);
    setTimer(45); // Reset timer

    const trimmed = email.trim();
    try {
      // resend otp again
      const response = await sendResetOtpAgain({ email: trimmed }).unwrap();
      console.log("resend otp again",response);
      Alert.alert("Success", "New OTP sent to " + trimmed);
    } catch (err) {
      Alert.alert("Error", "Failed to resend OTP.");
      setCanResend(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 80,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text className="text-2xl font-bold text-black mb-1 text-center">
            OTP code Verification
          </Text>

          {/* Subtitle */}
          <Text className="text-black text-sm mb-10 text-center">
            Code has been sent to {email}
          </Text>

          {/* OTP Inputs */}
          <View className="flex-row justify-center gap-3 mb-4">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputs.current[index] = ref; }}
                value={digit}
                onChangeText={(v) => handleOtpChange(index, v)}
                onKeyPress={(e) => handleKeyPress(index, e)}
                keyboardType="number-pad"
                maxLength={1}
                className={`
                  border rounded-lg bg-[#F9F9F9] w-20 h-20 text-center 
                  text-2xl font-medium text-black
                  ${error ? "border-red-500" : "border-[#E0E0E0]"}
                `}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="oneTimeCode"
                accessibilityLabel={`OTP digit ${index + 1}`}
              />
            ))}
          </View>

          {/* Error Message */}
          {error ? (
            <Text className="text-[#F14141] text-sm text-center mb-4">
              {error}
            </Text>
          ) : null}

          {/* Resend */}
          <View className="items-center">
            {canResend ? (
              <TouchableOpacity onPress={handleResend} disabled={isVerifying}>
                <Text className="text-[#2B7FFF] text-sm font-medium">
                  Resend code
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-black text-sm">
                Resend code in {timer}s
              </Text>
            )}
          </View>

          {/* Optional: Manual Verify Button */}
          {isVerifying && (
            <Text className="text-center text-sm text-gray-500 mt-4">
              Verifying...
            </Text>
          )}
        </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default VerifyOtp;