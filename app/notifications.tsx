import NotificationItem from "@/components/notifications/NotificationItem";
import {
  Notification,
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "@/redux/features/notifications/notificationApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabType = "all" | "unread" | "read";

export default function Notifications() {
  const router = useRouter();
  const { data, isLoading, refetch, isFetching } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const notifications = data?.results || [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") return notifications.filter((n) => !n.is_read);
    if (activeTab === "read") return notifications.filter((n) => n.is_read);
    return notifications;
  }, [notifications, activeTab]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead({ ids: [notification.id] });
    }
    // logic to navigate could be added here
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length > 0) {
      await markAsRead({ ids: unreadIds });
    } else {
      await markAsRead({ ids: [] });
    }
  };

  if (isLoading && !isFetching) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#2B7FFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-20"
        >
          <Ionicons name="chevron-back" size={26} color="#171717" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-[#171717]">
          Notifications
        </Text>
        <View className="w-20 items-end justify-center">
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllAsRead} activeOpacity={0.7}>
              <Text className="text-[13px] font-bold text-[#2B7FFF]">
                Mark all read
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row px-5 mt-2 ">
        <TouchableOpacity
          onPress={() => setActiveTab("all")}
          className={`pb-3 mr-6 ${
            activeTab === "all"
              ? "border-b-[2.5px] border-[#2B7FFF]"
              : "border-b-[2.5px] border-transparent"
          }`}
        >
          <Text
            className={`text-[15px] font-bold ${
              activeTab === "all" ? "text-[#2B7FFF]" : "text-gray-500"
            }`}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("unread")}
          className={`pb-3 mr-6 flex-row items-center ${
            activeTab === "unread"
              ? "border-b-[2.5px] border-[#2B7FFF]"
              : "border-b-[2.5px] border-transparent"
          }`}
        >
          <Text
            className={`text-[15px] font-bold mr-1.5 ${
              activeTab === "unread" ? "text-[#2B7FFF]" : "text-gray-500"
            }`}
          >
            Unread
          </Text>
          {unreadCount > 0 && (
            <View
              className={`rounded-full px-1.5 py-0.5 ${
                activeTab === "unread" ? "bg-[#2B7FFF]" : "bg-[#EEF2F6]"
              }`}
            >
              <Text
                className={`text-[10px] font-bold ${
                  activeTab === "unread" ? "text-white" : "text-[#2B7FFF]"
                }`}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("read")}
          className={`pb-3 ${
            activeTab === "read"
              ? "border-b-[2.5px] border-[#2B7FFF]"
              : "border-b-[2.5px] border-transparent"
          }`}
        >
          <Text
            className={`text-[15px] font-bold ${
              activeTab === "read" ? "text-[#2B7FFF]" : "text-gray-500"
            }`}
          >
            Read
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={handleNotificationClick} />
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 40,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor="#2B7FFF"
            colors={["#2B7FFF"]}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-32">
            <View className="w-24 h-24 rounded-full bg-[#EEF2F6] items-center justify-center mb-5 border border-white">
              <Ionicons
                name="notifications-off-outline"
                size={40}
                color="#2B7FFF"
              />
            </View>
            <Text className="text-[17px] font-bold text-[#171717] text-center">
              No{" "}
              {activeTab === "all"
                ? ""
                : activeTab === "unread"
                  ? "unread "
                  : "read "}
              notifications
            </Text>
            <Text className="text-[14px] text-gray-500 text-center mt-2 px-10 leading-5">
              {activeTab === "all"
                ? "When you get notifications, they'll show up here."
                : activeTab === "unread"
                  ? "You've read all your notifications. You're all caught up!"
                  : "You haven't read any notifications yet."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
