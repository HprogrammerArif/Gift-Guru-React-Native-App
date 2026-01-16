// components/GradientButton.tsx
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import cn from "clsx";

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  style?: string;
  textStyle?: string;
  containerStyle?: string;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  leftIcon,
  style,
  textStyle,
  containerStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.8}
      className={cn(
        "rounded-xl w-full flex flex-row justify-center",
        containerStyle
      )}
    >
      <LinearGradient
        // colors={["#7CB0FF", "#2B7FFF"]} // primary → secondary
        colors={["#2B7FFF", "#2B7FFF"]} // primary → secondary
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={{ borderRadius: 5, overflow: "hidden", elevation: 99 }}
        className={cn(
          "rounded-xl p-3 w-full flex-row justify-center items-center ",
          style
        )}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}

        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className={cn("text-white-100 paragraph-bold", textStyle)}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};
