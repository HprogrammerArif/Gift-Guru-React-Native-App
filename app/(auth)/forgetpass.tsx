import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgetPassword() {
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center p-5">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-5"
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text className="text-2xl font-bold">Forget Password</Text>
      <Text className="text-gray-500 mt-2">
        Reset link will be sent to your email.
      </Text>
    </SafeAreaView>
  );
}
