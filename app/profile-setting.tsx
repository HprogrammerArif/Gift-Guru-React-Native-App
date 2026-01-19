import CustomInput from "@/components/CustomInput";
import CustomInputModified from "@/components/CustomInputModified";
import { GradientButton } from "@/components/GradientButton";
import RolePicker from "@/components/RolePicker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

const countries = [
  {
    name: "United Kingdom",
    code: "+44",
    flag: "https://flagcdn.com/w40/gb.png",
  },
  { name: "United States", code: "+1", flag: "https://flagcdn.com/w40/us.png" },
  { name: "Canada", code: "+1", flag: "https://flagcdn.com/w40/ca.png" },
  { name: "Australia", code: "+61", flag: "https://flagcdn.com/w40/au.png" },
];

const ProfileSettingScreen = () => {
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();

  const [selectedCountry, setSelectedCountry] = useState(countries[1]); // Default to US to match your image
  const [form, setForm] = useState({
    firstName: "Buffalo",
    lastName: "College",
    phone: "7975 777666",
    email: "buffalo@gmail.com",
    gender: "Male" as "Male" | "Female" | "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCountryPress = () => {
    const options = countries.map((c) => `${c.name} (${c.code})`);
    options.push("Cancel");

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        title: "Select Country",
      },
      (selectedIndex?: number) => {
        if (selectedIndex !== undefined && selectedIndex < countries.length) {
          setSelectedCountry(countries[selectedIndex]);
        }
      }
    );
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    // Simulate API call
    console.log("Updating with:", {
      ...form,
      phone: `${selectedCountry.code} ${form.phone}`,
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center -ml-2"
        >
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "QuickSand-Bold" }}
          className="text-2xl text-[#171717] flex-1 text-center pr-8"
        >
          Profile setting
        </Text>
      </View>

      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* First & Last Name */}
        <View className="flex-row gap-4 mb-5">
          <CustomInputModified
            label="First Name"
            placeholder="First Name"
            value={form.firstName}
            onChangeText={(t) => setForm((p) => ({ ...p, firstName: t }))}
            containerClassName="flex-1"
          />
          <CustomInputModified
            label="Last Name"
            placeholder="Last Name"
            value={form.lastName}
            onChangeText={(t) => setForm((p) => ({ ...p, lastName: t }))}
            containerClassName="flex-1"
          />
        </View>

        {/* Dynamic Phone Number */}
        <View className="mb-5">
          <Text className="label">Phone</Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-[52px] bg-white">
            <TouchableOpacity
              onPress={handleCountryPress}
              activeOpacity={0.7}
              className="flex-row items-center mr-3"
            >
              <Image
                source={{ uri: selectedCountry.flag }}
                className="w-6 h-4 rounded-sm"
              />
              <Ionicons
                name="chevron-down"
                size={12}
                color="#6B7280"
                className="ml-1"
              />
            </TouchableOpacity>
            <View className="w-px h-6 bg-gray-200 mr-3" />
            <Text
              style={{ fontFamily: "QuickSand-SemiBold" }}
              className="text-base text-gray-700 mr-1"
            >
              {selectedCountry.code}
            </Text>
            <TextInput
              value={form.phone}
              onChangeText={(t) => setForm((p) => ({ ...p, phone: t }))}
              placeholder="0000 000 000"
              keyboardType="phone-pad"
              className="text-base font-quicksand-semibold flex-1 text-black"
              style={{ paddingVertical: 0 }}
            />
          </View>
        </View>

        {/* Email */}
        <View className="mb-5 relative">
          <CustomInput
            label="Email"
            value={form.email}
            onChangeText={(t) => setForm((p) => ({ ...p, email: t }))}
            placeholder="Email address"
            keyboardType="email-address"
          />
        </View>

        {/* Gender */}
        <View className="mb-8">
          <RolePicker
            value={form.gender}
            onValueChange={(val) => setForm((p) => ({ ...p, gender: val }))}
          />
        </View>

        {/* Change Password Link */}
        <TouchableOpacity className="mb-8">
          <Text className="text-[#2B7FFF] text-lg font-quicksand-bold underline">
            Change password
          </Text>
        </TouchableOpacity>

        {/* Update Button */}
        <View className="mt-auto">
          <GradientButton
            title="Update profile"
            onPress={handleUpdate}
            isLoading={isSubmitting}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ProfileSettingScreen;
