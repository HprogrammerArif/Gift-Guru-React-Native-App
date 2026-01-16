import { GradientButton } from "@/components/GradientButton";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyOtp() {
  const { email } = useLocalSearchParams();

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

      <View className="flex-row gap-4 mb-10">
        {[1, 2, 3, 4].map((_, i) => (
          <View
            key={i}
            className="w-14 h-14 border border-gray-300 rounded-xl items-center justify-center"
          >
            <TextInput
              maxLength={1}
              keyboardType="numeric"
              className="text-2xl font-bold text-center w-full h-full"
            />
          </View>
        ))}
      </View>

      <GradientButton
        title="Verify"
        onPress={() => router.replace("/(tabs)")}
      />

      <TouchableOpacity className="mt-6">
        <Text className="text-[#2B7FFF] font-bold">Resend Code</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
