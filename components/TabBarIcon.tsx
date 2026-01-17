import React, { memo } from "react";
import { Image, Text, View } from "react-native";
import GradientCircle from "./GradientCircle";

interface TabBarIconProps {
  focused: boolean;
  icon: any;
  title: string;
  onPress?: () => void;
}

export const TabBarIcon = memo(
  ({ focused, icon, title, onPress }: TabBarIconProps) => {
    return (
      <View className="items-center justify-center ">
        <View className="relative w-12 h-12 justify-center items-center">
          {/* {focused && <GradientCircle />} */}
          <Image
            source={icon}
            className="w-7 h-7 absolute"
            resizeMode="contain"
            style={{
              tintColor: focused ? "#525252" : "#90A1B9",
              zIndex: 1,
              // Optimization: Apply transform if needed, but keeping it simple
            }}
          />
        </View>
        {/* {focused && (
          <Text
            numberOfLines={1}
            className="text-[10px] font-semibold text-[#525252] mt-1 w-20 text-center"
          >
            {title}
          </Text>
        )} */}
      </View>
    );
  }
);
