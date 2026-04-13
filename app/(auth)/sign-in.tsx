import CustomInput from "@/components/CustomInput";
import { GradientButton } from "@/components/GradientButton";
import Checkbox from "expo-checkbox";
import { Image as ExpoImage } from "expo-image";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Keyboard, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { persistor } from "@/redux/store";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

// GoogleSignin.configure({
//   "webClientId": "121177195587-epvcsmto6nlmnrbif9q9u2c39tl2vl4v.apps.googleusercontent.com",
// });

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  //  useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: "121177195587-epvcsmto6nlmnrbif9q9u2c39tl2vl4v.apps.googleusercontent.com",
  //   });
  //  }, []);

  const [login] = useLoginMutation();
  const { handleGoogleLogin, isGoogleLoading } = useGoogleAuth();
  const dispatch = useAppDispatch();

  const submit = useCallback(async () => {
    const { email, password } = form;

    if (!email || !password) {
      return Alert.alert(
        "Error",
        "Please enter valid email address & password.",
      );
    }

    Keyboard.dismiss();
    setIsSubmitting(true);

    try {
      const response: any = await login({
        email: email.toLowerCase().trim(),
        password,
      });

      if (response?.data) {
        dispatch(
          setCredentials({
            user: response.data.user,
            token: response.data.access,
            refreshToken: response.data.refresh,
            device_token: response.data.device_token || "",
          }),
        );

        // If "Remember Me" is OFF, purge the persisted store on NEXT launch
        // by scheduling this AFTER navigation so the token write completes first.
        if (!rememberMe) {
          setTimeout(() => persistor.purge(), 500);
        }

        router.replace("/(drawer)/(tabs)");
      } else if (response?.error) {
        const errorData = response.error?.data;
        const errorMessage =
          errorData?.error ||
          errorData?.detail ||
          errorData?.non_field_errors?.[0] ||
          "Invalid credentials. Please try again.";
        Alert.alert("Login Failed", errorMessage);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }, [form, login, dispatch, rememberMe]);

  return (
    <SafeAreaView className="flex-1 bg-[#FFFFFF]" edges={["top"]}>
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerClassName="grow justify-center items-center px-5 py-10"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full items-center">
          <Text className="text-4xl font-bold text-black mb-2">
            Welcome Back
          </Text>
          <Text className="text-gray-500 mb-10">Log in to your account</Text>

          <View className="w-full gap-4">
            <CustomInput
              label="Enter Email"
              placeholder="name@example.com"
              value={form.email}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, email: text }))
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CustomInput
              label="Password"
              placeholder="••••••••"
              value={form.password}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, password: text }))
              }
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

              <TouchableOpacity onPress={() => router.push("/forgetpass")}>
                <Text className="text-[#2B7FFF] text-sm font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-4 gap-4">
              <GradientButton
                title="Log in"
                onPress={submit}
                isLoading={isSubmitting}
              />

              <Text className="text-center text-gray-400 font-medium">
                Or Continue With
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                className="w-full bg-[#e1e2e9] rounded-xl py-3 flex-row items-center justify-center gap-3"
                onPress={handleGoogleLogin}
                disabled={isSubmitting || isGoogleLoading}
              >
                <ExpoImage
                  source={{
                    uri: "https://authjs.dev/img/providers/google.svg",
                  }}
                  style={{ width: 24, height: 24 }}
                  contentFit="contain"
                />
                <Text className="text-lg font-medium text-black">
                  Continue with Google
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-center mt-2">
                <Text className="text-gray-600 text-sm">
                  Don't have an account?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => router.replace("/(auth)/sign-up")}
                >
                  <Text className="text-[#2B7FFF] font-bold">Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
