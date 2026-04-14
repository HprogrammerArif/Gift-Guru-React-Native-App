import HomeHeader from "@/components/home/HomeHeader";
import { PostSkeletonList } from "@/components/home/PostSkeleton";
import RecommendedCarousel from "@/components/home/RecommendedCarousel";
import SocialPost, { ApiPost } from "@/components/home/SocialPost";
import TrendingNowCarousel from "@/components/home/TrendingNowCarousel";
import { useGetPostsQuery } from "@/redux/features/posts/postApi";
import { useNavigation } from "expo-router";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  InteractionManager,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. Memoized Post Item with stable props
const PostItem = memo(
  ({ item }: { item: ApiPost }) => (
    <View className="px-2">
      <SocialPost post={item} />
    </View>
  ),
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.item.likes_count === next.item.likes_count &&
    prev.item.comments_count === next.item.comments_count &&
    prev.item.is_liked === next.item.is_liked &&
    prev.item.is_saved === next.item.is_saved &&
    prev.item.is_following === next.item.is_following
);
PostItem.displayName = "PostItem";

// 2. Optimized Carousels Wrapper — only renders children when Home is ready
const FeedHeader = memo(
  ({ isLoading, isReady }: { isLoading: boolean; isReady: boolean }) => (
    <View>
      {isReady ? (
        <>
          <RecommendedCarousel />
          <TrendingNowCarousel />
        </>
      ) : (
        // Placeholder height for carousels to prevent layout jump
        <View style={{ height: 350 }} />
      )}
      <View className="mt-6" />
      {isLoading && (
        <View className="px-2">
          <PostSkeletonList count={4} />
        </View>
      )}
    </View>
  ),
);
FeedHeader.displayName = "FeedHeader";

// 3. Stable Separator
const ItemSeparator = memo(() => <View style={{ height: 8 }} />);

export default function Home() {
  const [search, setSearch] = useState("");
  const [isReady, setIsReady] = useState(false);
  const navigation = useNavigation();

  // Stable callbacks — hoisted OUT of JSX so they never create new references on render
  const handleMenuPress = useCallback(
    () => (navigation as any).openDrawer(),
    [navigation],
  );
  const handleNotificationPress = useCallback(() => {}, []);

  // Defer heavy rendering until after basic navigation/splash hide
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  const {
    data: postsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetPostsQuery({ page: 1, page_size: 20 });

  

  const posts: ApiPost[] = useMemo(
    () =>
      Array.isArray(postsData)
        ? postsData
        : ((postsData as any)?.results ?? []),
    [postsData],
  );

  const renderItem = useCallback(
    ({ item }: { item: ApiPost }) => <PostItem item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: ApiPost) => String(item.id), []);


  const renderEmpty = useCallback(() => {
    if (isLoading || !isReady) return null;
    return (
      <View className="items-center justify-center py-20">
        <Text className="text-gray-400 text-base font-medium">
          No posts yet. Be the first to share!
        </Text>
      </View>
    );
  }, [isLoading, isReady]);

  // Pass isReady to FeedHeader so carousels don't fetch/render until interactions are clear
  const listHeader = useMemo(
    () => <FeedHeader isLoading={isLoading} isReady={isReady} />,
    [isLoading, isReady],
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FF4B3A]" edges={["top"]}>
      <HomeHeader
        value={search}
        onSearch={setSearch}
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
      />

      <FlatList
        // Empty list until interaction finishes to prioritize UI responsiveness
        data={!isReady || isLoading ? [] : posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
          backgroundColor: "#F8F9FA",
        }}
        style={{ backgroundColor: "#FF4B3A" }}
        // --- Smart Performance Tuning ---
        removeClippedSubviews={true}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        updateCellsBatchingPeriod={100}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor="#2B7FFF"
          />
        }
      />
    </SafeAreaView>
  );
}
