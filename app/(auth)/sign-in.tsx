import CustomInput from "@/components/CustomInput";
import { Alert, Text, TouchableOpacity, View, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";
import { GradientButton } from "@/components/GradientButton";
import { Link, router } from "expo-router";
import { useState, useCallback } from "react";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // Best Practice: Memoize the submit function
  const submit = useCallback(async () => {
    const { email, password } = form;

    if (!email || !password) {
      return Alert.alert("Error", "Please enter valid email address & password.");
    }

    Keyboard.dismiss(); // Best Practice: Dismiss keyboard on submit
    setIsSubmitting(true);

    try {
      // API call simulation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }, [form]); // Only recreate if form data changes

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAwareScrollView
        className="flex-1"
        // FIX: Added 'grow' to allow centering
        contentContainerClassName="grow justify-center items-center px-5 py-10"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full items-center">
          <Text className="text-4xl font-bold text-black mb-2">Welcome Back</Text>
          <Text className="text-gray-500 mb-10">Log in to your account</Text>

          <View className="w-full gap-4">
            <CustomInput
              label="Enter Email"
              placeholder="name@example.com"
              value={form.email}
              onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CustomInput
              label="Password"
              placeholder="••••••••"
              value={form.password}
              onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
              secureTextEntry={!showPwd}
              showEye
              passwordVisible={showPwd}
              onTogglePassword={setShowPwd}
            />

            <View className="flex-row justify-between items-center">
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => setRememberMe(!rememberMe)}
                className="flex-row items-center gap-2"
              >
                <Checkbox
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  color={rememberMe ? "#2B7FFF" : undefined}
                  style={{ width: 18, height: 18, borderRadius: 4 }}
                />
                <Text className="text-black text-sm">Remember Me</Text>
              </TouchableOpacity>

              <Link href="/forgetpass" asChild>
                <TouchableOpacity>
                  <Text className="text-[#2B7FFF] text-sm font-medium">Forgot Password?</Text>
                </TouchableOpacity>
              </Link>
            </View>

            <View className="mt-4">
              <GradientButton
                title="Log in"
                onPress={submit}
                isLoading={isSubmitting}
              />
              
              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600 text-sm">Don't have an account? </Text>
                <Link href="/(auth)/sign-up" asChild>
                  <TouchableOpacity>
                    <Text className="text-[#2B7FFF] font-bold">Sign Up</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignIn;