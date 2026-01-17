// components/TabBarIcon.tsx
import React from "react";
import { Image, Text, View } from "react-native";
import GradientCircle from "./GradientCircle";

interface TabBarIconProps {
  focused: boolean;
  icon: any;
  title: string;
  onPress?: () => void;
}

export const TabBarIcon = ({ focused, icon, title, onPress }: TabBarIconProps) => {
  return (
    <View className="items-center justify-center pt-5">
      <View className="relative w-12 h-12 justify-center items-center">
        {focused && <GradientCircle />}
        <Image
          source={icon}
          className="w-6 h-6 absolute"
          resizeMode="contain"
          style={{
            tintColor: focused ? "#FFFFFF" : "#90A1B9",
            zIndex: 1,
          }}
        />
      </View>
      {focused && (
        <Text className="text-sm font-semibold text-[#525252] mt-1 w-full text-center">
          {title}
        </Text>
      )}
    </View>
  );
};