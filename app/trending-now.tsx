import { PostSkeletonList } from "@/components/home/PostSkeleton";
import SocialPost, { ApiPost } from "@/components/home/SocialPost";
import { useGetTrendingPostsQuery } from "@/redux/features/posts/postApi";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  InteractionManager,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Memoized item component to prevent unnecessary re-renders
const MemoizedPostItem = memo(({ item }: { item: ApiPost }) => (
  <View className="mb-2">
    <SocialPost post={item} />
  </View>
));
MemoizedPostItem.displayName = "MemoizedPostItem";

export default function TrendingNowScreen() {
  const insets = useSafeAreaInsets();
  const [isReady, setIsReady] = useState(false);
  const { data, isLoading, isFetching, refetch } =
    useGetTrendingPostsQuery(undefined);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  const posts: ApiPost[] = useMemo(
    () => (Array.isArray(data) ? data : ((data as any)?.results ?? [])),
    [data],
  );

  const keyExtractor = useCallback((item: ApiPost) => String(item.id), []);

  const renderItem = useCallback(
    ({ item }: { item: ApiPost }) => <MemoizedPostItem item={item} />,
    [],
  );

  const renderHeader = useCallback(
    () => (
      <View>
        <LinearGradient
          colors={["#2B7FFF", "#2B7FFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-2xl p-4 mb-5"
        >
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name="trending-up" size={24} color="white" />
            <Text className="text-white text-xl font-bold">Trending Now</Text>
          </View>
          <Text className="text-white/90 text-[13px] leading-5 font-medium">
            Our expert curators and top community members highly recommend these
            unique gifts.
          </Text>
        </LinearGradient>

        {(isLoading || !isReady) && <PostSkeletonList count={3} />}
      </View>
    ),
    [isLoading, isReady],
  );

  const renderEmpty = useCallback(() => {
    if (isLoading || !isReady) return null;
    return (
      <View className="py-20 items-center">
        <Text className="text-gray-400 font-medium text-base">
          No trending posts found.
        </Text>
      </View>
    );
  }, [isLoading, isReady]);

  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingTop: insets.top }}>
      {/* Navigation Header */}
      <View className="px-3 py-3 flex-row items-center gap-3 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center -ml-2"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </TouchableOpacity>

        <View className="flex-1">
                 <TouchableOpacity
                   activeOpacity={0.9}
                   onPress={() => router.push("/search-with-filter")}
                   className="flex-row items-center bg-white rounded-full px-5 shadow-sm border border-gray-300"
                   style={{ height: 44 }}
                 >
                   <Text className="flex-1 text-base text-[#9CA3AF]">
                     Search products...
                   </Text>
                   <Ionicons name="search-outline" size={20} color="#9CA3AF" />
                 </TouchableOpacity>
               </View>

        <TouchableOpacity
          onPress={() => router.push("/notifications")}
          className="p-1"
        >
          <Ionicons name="notifications-outline" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={!isReady || isLoading ? [] : posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingVertical: 10,
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
        // Performance Tuning
        removeClippedSubviews={false}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor="#2B7FFF"
          />
        }
      />
    </View>
  );
}
