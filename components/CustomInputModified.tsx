import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { CustomInputModifiedProps, CustomInputProps } from "@/type";
import { useState } from "react";
import cn from "clsx";
import { Ionicons } from "@expo/vector-icons";

const CustomInputModified = ({
  placeholder = "Enter text",
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = "default",
  showEye = false,
  onTogglePassword,
  passwordVisible = false,
  containerClassName,
  ...props 
  
}: CustomInputModifiedProps) => {

  const [isFocused, setIsFocused] = useState(false);

  const handleEyePress = () => {
    onTogglePassword?.(!passwordVisible);
  };

  return (
    <View className={cn("", containerClassName)}>
      <Text className="label">{label}</Text>
      {/* ----- INPUT + OPTIONAL EYE ----- */}
      <View className="relative">
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !passwordVisible}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor="#888"
          className={cn(
            "input",
            isFocused ? "border-primary" : "border-gray-300",
            // give space for the eye icon
            showEye ? "pr-12" : "pr-4"
          )}
          {...props}
        />

        {/* ----- EYE ICON (only when showEye === true) ----- */}
        {showEye && (
          <TouchableOpacity
            onPress={handleEyePress}
            className="absolute right-3 top-3"
            activeOpacity={0.7}
          >
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
export default CustomInputModified;
