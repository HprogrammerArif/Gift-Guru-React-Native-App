import { notificationIcons } from "@/constants";
import { Notification } from "@/redux/features/notifications/notificationApi";
import { Image as ExpoImage } from "expo-image";
import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface NotificationItemProps {
  item: Notification;
  onPress: (item: Notification) => void;
}

const getIconForTitle = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("comment")) return notificationIcons.newComment;
  if (t.includes("like")) return notificationIcons.postLiked;
  if (t.includes("wishlist")) return notificationIcons.postLiked;
  if (t.includes("follower") || t.includes("follow"))
    return notificationIcons.postApprove;
  return notificationIcons.postApprove;
};

const formatTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (isNaN(date.getTime())) return "Unknown time";
    if (diffInSeconds < 0) return "Just now";
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  } catch (e) {
    return "Unknown time";
  }
};

const NotificationItem = memo(({ item, onPress }: NotificationItemProps) => {
  const icon = getIconForTitle(item.title);
  const unread = !item.is_read;

  return (
    <TouchableOpacity
      className="mb-4"
      activeOpacity={0.7}
      onPress={() => onPress(item)}
    >
      <View
        className={`flex-row gap-4 p-4 rounded-3xl ${unread ? "bg-[#F0F7FF]" : "bg-[#F8FAFC]"}`}
      >
        {/* Icon Container */}
        <View className="w-12 h-12 bg-white rounded-full justify-center items-center shadow-sm">
          <ExpoImage
            source={icon}
            style={{ width: 24, height: 24 }}
            contentFit="contain"
          />
        </View>

        {/* Content */}
        <View className="flex-1 justify-center">
          <View className="flex-row justify-between items-start">
            <Text
              className={`text-base font-bold ${unread ? "text-[#1E3A8A]" : "text-gray-900"}`}
            >
              {item.title}
            </Text>
            {unread && (
              <View className="w-2.5 h-2.5 bg-[#2B7FFF] rounded-full mt-1.5" />
            )}
          </View>
          <Text
            numberOfLines={3}
            className={`text-sm mt-1 leading-5 ${unread ? "text-gray-700 font-medium" : "text-gray-500"}`}
          >
            {item.body}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center ml-4 mt-1">
        <Text className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
          {formatTime(item.created_at)}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default NotificationItem;
