import { PostSkeletonList } from "@/components/home/PostSkeleton";
import SocialPost, { ApiPost } from "@/components/home/SocialPost";
import { useGetRecommendedPostsQuery } from "@/redux/features/posts/postApi";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecommendedScreen() {
  const { data, isLoading, isFetching, refetch } =
    useGetRecommendedPostsQuery(undefined);

  const posts: ApiPost[] = useMemo(
    () => (Array.isArray(data) ? data : ((data as any)?.results ?? [])),
    [data],
  );

  const renderHeader = () => (
    <View className="mb-4">
      {/* Gradient Banner */}
      <LinearGradient
        colors={["#FF4B3A", "#FF8C42"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="rounded-2xl p-5 mb-6"
      >
        <View className="flex-row items-center gap-2 mb-2">
          <Ionicons name="flame" size={24} color="white" />
          <Text className="text-white text-xl font-bold">
            Recommended for you
          </Text>
        </View>
        <Text className="text-white/90 text-[13px] leading-5 font-medium">
          Our expert curators and top community members highly recommend these
          unique gifts.
        </Text>
      </LinearGradient>

      {/* Show skeletons inside the list if loading */}
      {isLoading && <PostSkeletonList count={3} />}
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View className="py-20 items-center">
        <Text className="text-gray-400 font-medium">
          No recommendations found.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Navigation Header with Search */}
      <View className="px-4 py-3 pb-2 flex-row items-center gap-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center -ml-2"
        >
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>

        <View className="flex-1 relative">
          <View className="absolute left-3 top-3 z-10">
            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          </View>
          <TextInput
            placeholder="Search recommended"
            placeholderTextColor="#9CA3AF"
            className="w-full bg-gray-50 border border-gray-100 rounded-full py-2.5 pl-10 pr-4 text-gray-900 text-base"
          />
        </View>

        <TouchableOpacity onPress={() => router.push("/notifications")}>
          <Ionicons name="notifications-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={isLoading ? [] : posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View className="mb-2">
            <SocialPost post={item} />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor="#FF4B3A"
          />
        }
      />
    </SafeAreaView>
  );
}
