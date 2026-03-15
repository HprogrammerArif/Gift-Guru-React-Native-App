import SocialPost from "@/components/home/SocialPost";
import { useGetWishlistPostsQuery } from "@/redux/features/posts/postApi";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// The API wraps each saved post: { id, user, post: ApiPost, created_at }
type WishlistItem = {
  id: number;
  user: any;
  post: any;
  created_at: string;
};

export default function MyWishListScreen() {
  const { data, isLoading, isFetching, refetch } =
    useGetWishlistPostsQuery(undefined);

  // Each item in the response has a nested `post` — extract it for SocialPost
  const wishListData: WishlistItem[] = React.useMemo(
    () => (Array.isArray(data) ? data : []),
    [data],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: WishlistItem }) => (
      <View className="mb-2 border-b border-gray-50">
        <SocialPost post={item.post} isMyPost={false} />
      </View>
    ),
    [],
  );

  const keyExtractor = React.useCallback(
    (item: WishlistItem) => String(item.id),
    [],
  );

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <Header />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF4B3A" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Header />

      <FlatList
        data={wishListData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          paddingBottom: 40,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        // ── Performance props ─────────────────────────────────────────────
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={7}
        removeClippedSubviews={Platform.OS === "android"}
        // ── Pull-to-refresh ───────────────────────────────────────────────
        onRefresh={refetch}
        refreshing={isFetching && !isLoading}
        // ── Empty state ───────────────────────────────────────────────────
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="bookmark-outline" size={64} color="#E5E7EB" />
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-gray-400 mt-4 text-lg text-center"
            >
              No items in your wish list yet.
            </Text>
            <Text
              style={{ fontFamily: "QuickSand-Regular" }}
              className="text-gray-300 text-sm mt-1 text-center"
            >
              Save posts to see them here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ── Extracted header to avoid re-render cost ──────────────────────────────────
const Header = React.memo(() => (
  <View className="flex-row items-center justify-between px-5 h-16 border-b border-gray-50 bg-white">
    <TouchableOpacity
      onPress={() => router.back()}
      className="w-10 h-10 items-center justify-center -ml-2"
    >
      <Ionicons name="chevron-back" size={22} color="#1F2937" />
    </TouchableOpacity>
    <Text
      style={{ fontFamily: "QuickSand-Bold" }}
      className="text-xl text-[#1F2937]"
    >
      My Wish List
    </Text>
    <View className="w-10" />
  </View>
));
