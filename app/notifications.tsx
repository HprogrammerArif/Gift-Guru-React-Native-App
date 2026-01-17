// app/(tabs)/notifications.tsx
import { notificationIcons } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const notifications = [
  {
    id: 1,
    type: "LIKE",
    icon: notificationIcons.postLiked,
    title: "Post Liked",
    message: "TravelLover liked your idea: Minimalist Mechanical Keyboard",
    time: "2 hr ago",
    unread: true,
  },

  {
    id: 3,
    type: "COMMENT",
    icon: notificationIcons.newComment,
    title: "New Comment",
    message: "Medical Records – Emma Annual Checkup.pdf",
    time: "2 days ago",
    unread: false,
  },
  {
    id: 2,
    type: "APPROVE",
    icon: notificationIcons.postApprove,
    title: "Approved",
    message:
      "Michael added a new expense: School supplies – $45.00\nSoccer Practice starts in 1 hour",
    time: "Today",
    unread: true,
  },
  {
    id: 4,
    type: "MILESTONE",
    icon: notificationIcons.linkClick,
    title: "Milestone",
    message:
      "Someone just clicked your Amazon affiliate link for Retro Instant Camera. Great scout!",
    time: "2 days ago",
    unread: false,
  },
];

import NotificationItem from "@/components/notifications/NotificationItem";

export default function Notifications() {
  const router = useRouter();

  const handleNotificationClick = (notification: any) => {
    // Navigation logic based on notification.type
    console.log("Clicked:", notification.type);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#171717" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-[#171717]">Notifications</Text>
        <View className="w-10" />
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={handleNotificationClick} />
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-20">
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color="#E5E7EB"
            />
            <Text className="text-gray-400 mt-4 font-medium">
              No notifications yet
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
