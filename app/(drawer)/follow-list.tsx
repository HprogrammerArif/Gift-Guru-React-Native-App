import { useGetFollowersQuery, useGetFollowingQuery } from "@/redux/features/auth/authApi";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FollowListScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{
    type: "followers" | "following";
  }>();

  const isFollowers = type === "followers";
  const title = isFollowers ? "Followers" : "Following";

  const { data, isLoading, isFetching, refetch, isError } = isFollowers
    ? useGetFollowersQuery()
    : useGetFollowingQuery();

  const renderItem = ({ item }: { item: any }) => {
    const displayName =
      `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
      item.username ||
      "User";

    const profileImage = item.image
      ? item.image.startsWith("http")
        ? item.image
        : `${process.env.EXPO_PUBLIC_API_URL}${item.image}`
      : null;

    return (
      <TouchableOpacity
        onPress={() => router.push({ pathname: "/(drawer)/(tabs)/profile", params: { id: item.user || item.id } })}
        className="flex-row items-center px-6 py-4 border-b border-gray-50"
      >
        <View className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden mr-4">
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center bg-gray-100">
              <Ionicons name="person" size={24} color="#D1D5DB" />
            </View>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900">{displayName}</Text>
          <Text className="text-xs text-gray-500">@{item.username?.split("@")[0]}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold text-gray-900">{title}</Text>
        </View>
      </View>

      {isLoading && !data ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2B7FFF" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-10">
          <Ionicons name="alert-circle-outline" size={64} color="#FCA5A5" />
          <Text className="text-gray-500 mt-4 text-center">
            Failed to load {title.toLowerCase()}. Please try again.
          </Text>
          <TouchableOpacity 
            onPress={() => refetch()}
            className="mt-6 bg-[#2B7FFF] px-6 py-2 rounded-full"
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={data || []}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            <View className="py-20 items-center px-10">
              <Ionicons name="people-outline" size={64} color="#E5E7EB" />
              <Text className="text-gray-400 mt-4 text-center">
                {isFollowers
                  ? "No followers yet."
                  : "Not following anyone yet."}
              </Text>
            </View>
          }
          onRefresh={refetch}
          refreshing={isFetching}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
