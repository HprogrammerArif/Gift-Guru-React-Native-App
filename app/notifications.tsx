import NotificationItem from "@/components/notifications/NotificationItem";
import {
  Notification,
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "@/redux/features/notifications/notificationApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const router = useRouter();
  const { data, isLoading, refetch, isFetching } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();

  const notifications = data?.results || [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead({ ids: [notification.id] });
    }
    // logic to navigate could be added here based on title/body content
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length > 0) {
      await markAsRead({ ids: unreadIds });
    } else {
      // If everything is read but user wants to ensure, or if [] means ALL in backend
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
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#171717" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#171717]">Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={handleMarkAllAsRead} activeOpacity={0.7}>
            <Text className="text-sm font-semibold text-[#2B7FFF]">
              Mark all read
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}
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
          paddingTop: 10,
          paddingBottom: 40,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="#2B7FFF"
            colors={["#2B7FFF"]}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-40">
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
