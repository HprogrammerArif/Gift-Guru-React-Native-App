// app/(tabs)/notifications.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { notificationIcons } from "@/constants";


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

export default function Notifications() {
  const router = useRouter();
  const [filter, setFilter] = useState<"All" | "Unread">("All");


  const filteredNotifications =
    filter === "Unread" ? notifications.filter((n) => n.unread) : notifications;


  const handleFilterChange = (newFilter: "All" | "Unread") => {
    setFilter(newFilter);
  };

  // 🔥 Handle notification click with analytics
  const handleNotificationClick = (notification: (typeof notifications)[0]) => {
    // Navigate to relevant screen based on type
    // (You can add navigation logic here)
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3 ">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#171717" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-[#171717]">Notification</Text>
        <View className="w-10" />
      </View>

      {/* Notifications List */}
      <ScrollView
        className="flex-1 px-5 mt-6"
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            className={`mb-8 `}
            activeOpacity={0.7}
            onPress={() => handleNotificationClick(notif)}
          >
            <View className={`flex-row gap-4 bg-[#F8FAFC] p-3  rounded-2xl`}>
              <View className="w-12 h-12 bg-[#DFF2FE] rounded-full justify-center items-center shadow-sm">
                <Image
                  source={notif.icon}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-[#000000]">
                  {notif.title}
                </Text>
                <Text className="text-sm text-[#737373] mt-1 leading-5">
                  {notif.message}
                </Text>
              </View>
            </View>
            <Text className="text-sm text-[#454545] mt-3 ">• {notif.time}</Text>
          </TouchableOpacity>
        ))}
        <View className="h-32" />
      </ScrollView>
    </SafeAreaView>
  );
}
