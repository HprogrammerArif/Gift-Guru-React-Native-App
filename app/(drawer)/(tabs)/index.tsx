import HomeHeader from "@/components/home/HomeHeader";
import { PostSkeletonList } from "@/components/home/PostSkeleton";
import RecommendedCarousel from "@/components/home/RecommendedCarousel";
import SocialPost, { ApiPost } from "@/components/home/SocialPost";
import TrendingNowCarousel from "@/components/home/TrendingNowCarousel";
import { RECOMMENDED_DATA, TRENDING_DATA } from "@/constants";
import { useGetPostsQuery } from "@/redux/features/posts/postApi";
import { useNavigation } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Stable component — never re-creates on parent re-render
const PostItem = React.memo(({ item }: { item: ApiPost }) => (
  <View className="px-2">
    <SocialPost post={item} />
  </View>
));
PostItem.displayName = "PostItem";

// Stable header component outside render cycle
const FeedHeader = React.memo(() => (
  <View>
    <RecommendedCarousel RECOMMENDED_DATA={RECOMMENDED_DATA} />
    <TrendingNowCarousel TRENDING_DATA={TRENDING_DATA} />
    <View className="mt-6" />
  </View>
));
FeedHeader.displayName = "FeedHeader";

export default function Home() {
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  const {
    data: postsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetPostsQuery({ page: 1, page_size: 20 });

  // Handle both array and paginated { results: [] } response shapes
  const posts: ApiPost[] = useMemo(
    () =>
      Array.isArray(postsData)
        ? postsData
        : ((postsData as any)?.results ?? []),
    [postsData],
  );

  // Stable renderItem — item identity from keyExtractor prevents re-renders
  const renderItem = useCallback(
    ({ item }: { item: ApiPost }) => <PostItem item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: ApiPost) => String(item.id), []);

  const renderEmpty = useCallback(
    () => (
      <View className="flex-1 items-center justify-center py-20">
        <Text className="text-gray-400 text-base font-medium">
          No posts yet. Be the first to share!
        </Text>
      </View>
    ),
    [],
  );

  // Skeleton is shown INSIDE the FlatList header so the carousels still show
  const renderHeader = useCallback(
    () => (
      <View>
        <FeedHeader />
        {isLoading && <PostSkeletonList count={4} />}
      </View>
    ),
    [isLoading],
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FF4B3A]" edges={["top"]}>
      {/* Home Header always visible */}
      <HomeHeader
        value={search}
        onSearch={setSearch}
        onMenuPress={() => (navigation as any).openDrawer()}
        onNotificationPress={() => {}}
      />

      <FlatList
        data={isLoading ? [] : posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={isLoading ? null : renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 80,
          backgroundColor: "#F8F9FA",
        }}
        style={{ backgroundColor: "#FF4B3A" }}
        // Performance tuning
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        removeClippedSubviews={false} // true causes Android glitches with complex cells
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor="#2B7FFF"
            colors={["#2B7FFF"]}
          />
        }
      />
    </SafeAreaView>
  );
}
