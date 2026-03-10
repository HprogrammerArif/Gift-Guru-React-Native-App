import CustomInput from "@/components/CustomInput";
import CustomInputModified from "@/components/CustomInputModified";
import { GradientButton } from "@/components/GradientButton";
import RolePicker from "@/components/RolePicker";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image as ExpoImage } from "expo-image";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

interface FormData {
  firstName: string;
  lastName: string;
  dob: string;
  role: "Male" | "Female" | "";
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const [register] = useRegisterMutation();
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    role: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [date, setDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-GB"); // dd/mm/yyyy
  };

  const submit = useCallback(async () => {
    const { firstName, lastName, email, role, password, confirmPassword, dob } =
      form;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !role ||
      !password ||
      !confirmPassword ||
      !dob
    ) {
      return Alert.alert(
        "Missing Fields",
        "Please fill in all fields including your date of birth.",
      );
    }

    if (password !== confirmPassword) {
      return Alert.alert(
        "Passwords Don't Match",
        "Please make sure both passwords are the same",
      );
    }

    if (password.length < 6) {
      return Alert.alert(
        "Weak Password",
        "Password must be at least 6 characters",
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert("Invalid Email", "Please enter a valid email address");
    }

    Keyboard.dismiss();
    setIsSubmitting(true);

    try {
      const formatApiDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const payload = {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: date ? formatApiDate(date) : undefined,
        gender: role,
        email: email.toLowerCase().trim(),
        password: password,
        confirm_password: confirmPassword,
      };

      const response: any = await register(payload);

      if (response?.data?.message) {
        Alert.alert("Success", response.data.message);
        router.push({
          pathname: "/verify-otp",
          params: { email: email.toLowerCase().trim() },
        });
      } else if (response?.error) {
        const errorData = response.error?.data;
        const errorMessage =
          errorData?.error ||
          errorData?.email?.[0] ||
          errorData?.password?.[0] ||
          errorData?.detail ||
          "Registration failed";

        Alert.alert("Sign Up Failed", errorMessage);
      }
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message || "Please try again");
    } finally {
      setIsSubmitting(false);
    }
  }, [form, date, register]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    // On Android, the picker closes itself after selection
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
      // Sync with form state as a formatted string
      setForm((prev) => ({ ...prev, dob: formatDate(selectedDate) }));
    } else if (Platform.OS === "ios") {
      // On iOS, if they don't select a date but close it, we still want to close the picker
      setShowDatePicker(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerClassName="grow justify-center items-center px-6 py-10"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-md items-center">
          {/* Title */}
          <Text className="text-4xl font-bold text-black mb-2 text-center">
            Create Account
          </Text>
          <Text className="text-gray-500 mb-10 text-center">
            Join us to get started
          </Text>

          {/* Form */}
          <View className="w-full gap-4">
            <View className="flex-row gap-2">
              <CustomInputModified
                label="First Name"
                placeholder="First name"
                value={form.firstName}
                onChangeText={(text) =>
                  setForm((prev) => ({ ...prev, firstName: text }))
                }
                autoCapitalize="words"
                containerClassName="flex-1"
              />
              <CustomInputModified
                label="Last Name"
                placeholder="Last name"
                value={form.lastName}
                onChangeText={(text) =>
                  setForm((prev) => ({ ...prev, lastName: text }))
                }
                autoCapitalize="words"
                containerClassName="flex-1"
              />
            </View>

            <View className="flex-row gap-2">
              {/* Date */}
              <View className="flex-1">
                <Text className="text-dark-secondary ml-2 text-sm font-medium mb-1">
                  Date of Birth
                </Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowDatePicker(true)}
                  style={{ height: 48 }}
                  className="border border-gray-300 rounded-xl px-4 bg-white flex-row justify-between items-center"
                >
                  <Text
                    className={`text-base ${date ? "text-black" : "text-gray-400"}`}
                  >
                    {date ? formatDate(date) : "dd/mm/yyyy"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#2B7FFF" />
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onDateChange}
                    maximumDate={new Date()} // Can't be born in the future
                  />
                )}
              </View>

              {/* Role/Gender */}
              <RolePicker
                value={form.role}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, role: value }))
                }
                containerClassName="flex-1"
              />
            </View>

            <CustomInput
              label="Email"
              placeholder="example@gmail.com"
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
              onChangeText={(t) => setForm((p) => ({ ...p, password: t }))}
              secureTextEntry={!showPwd}
              showEye
              passwordVisible={showPwd}
              onTogglePassword={setShowPwd}
            />

            <CustomInput
              label="Confirm Password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChangeText={(t) =>
                setForm((p) => ({ ...p, confirmPassword: t }))
              }
              secureTextEntry={!showConfirm}
              showEye
              passwordVisible={showConfirm}
              onTogglePassword={setShowConfirm}
            />

            <View className="mt-4 gap-3">
              <GradientButton
                title="Sign Up"
                onPress={submit}
                isLoading={isSubmitting}
              />

              <Text className="text-center text-gray-400 font-normal">
                Or Continue With
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                className="w-full bg-[#e1e2e9] rounded-xl py-3 flex-row items-center justify-center gap-3"
                onPress={() =>
                  Alert.alert("Google Login", "This feature is coming soon!")
                }
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
                  Already have an account?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => router.replace("/(auth)/sign-in")}
                >
                  <Text className="text-[#2B7FFF] font-bold">Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
