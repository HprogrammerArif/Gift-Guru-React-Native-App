import { Image as ExpoImage } from "expo-image";
import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface NotificationItemProps {
  item: {
    id: number;
    title: string;
    message: string;
    time: string;
    icon: any;
    unread: boolean;
  };
  onPress: (item: any) => void;
}

const NotificationItem = memo(({ item, onPress }: NotificationItemProps) => {
  return (
    <TouchableOpacity
      className="mb-6"
      activeOpacity={0.7}
      onPress={() => onPress(item)}
    >
      <View
        className={`flex-row gap-4 p-4 rounded-3xl ${item.unread ? "bg-[#F0F7FF]" : "bg-[#F8FAFC]"}`}
      >
        {/* Icon Container */}
        <View className="w-12 h-12 bg-white rounded-full justify-center items-center shadow-sm">
          <ExpoImage
            source={item.icon}
            style={{ width: 24, height: 24 }}
            contentFit="contain"
          />
        </View>

        {/* Content */}
        <View className="flex-1 justify-center">
          <View className="flex-row justify-between items-start">
            <Text
              className={`text-base font-bold ${item.unread ? "text-[#1E3A8A]" : "text-gray-900"}`}
            >
              {item.title}
            </Text>
            {item.unread && (
              <View className="w-2.5 h-2.5 bg-[#2B7FFF] rounded-full mt-1.5" />
            )}
          </View>
          <Text
            numberOfLines={2}
            className={`text-sm mt-1 leading-5 ${item.unread ? "text-gray-700 font-medium" : "text-gray-500"}`}
          >
            {item.message}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center ml-4 mt-2">
        <Text className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
          {item.time}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default NotificationItem;
