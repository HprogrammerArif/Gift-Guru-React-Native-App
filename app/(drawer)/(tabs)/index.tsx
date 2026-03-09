import HomeHeader from "@/components/home/HomeHeader";
import RecommendedCarousel from "@/components/home/RecommendedCarousel";
import SocialPost, { ApiPost } from "@/components/home/SocialPost";
import TrendingNowCarousel from "@/components/home/TrendingNowCarousel";
import { RECOMMENDED_DATA, TRENDING_DATA } from "@/constants";
import { useGetPostsQuery } from "@/redux/features/posts/postApi";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [search, setSearch] = useState("");
  const navigation = useNavigation();
  const [page, setPage] = useState(1);

  const {
    data: postsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetPostsQuery({ page: 1, page_size: 20 });

  // API returns either an array directly or a paginated { results: [] } shape
  const posts: ApiPost[] = Array.isArray(postsData)
    ? postsData
    : (postsData?.results ?? []);

  const renderItem = React.useCallback(
    ({ item }: { item: ApiPost }) => (
      <View className="px-2">
        <SocialPost post={item}  />
      </View>
    ),
    [],
  );

  const renderHeader = () => (
    <View>
      <RecommendedCarousel RECOMMENDED_DATA={RECOMMENDED_DATA} />
      {/* Trending Now SECTION */}
      <TrendingNowCarousel TRENDING_DATA={TRENDING_DATA} />
      <View className="mt-6" />
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text className="text-gray-400 text-base font-medium">
          No posts yet. Be the first to share!
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isFetching || isLoading) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#2B7FFF" />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FF4B3A]" edges={["top"]}>
      {/* Home Header */}
      <View>
        <HomeHeader
          value={search}
          onSearch={(text) => setSearch(text)}
          onMenuPress={() => (navigation as any).openDrawer()}
          onNotificationPress={() => console.log("Notif Pressed")}
        />
      </View>

      {/* Loading State */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center bg-[#F8F9FA]">
          <ActivityIndicator size="large" color="#2B7FFF" />
          <Text className="text-gray-400 mt-3 font-medium">
            Loading posts...
          </Text>
        </View>
      ) : (
        /* Main Content FlatList */
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 80,
            backgroundColor: "#F8F9FA",
          }}
          style={{ backgroundColor: "#FF4B3A" }}
          initialNumToRender={7}
          maxToRenderPerBatch={7}
          windowSize={7}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              tintColor="#2B7FFF"
              colors={["#2B7FFF"]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
