import SocialPost from "@/components/home/SocialPost";
import { POSTS_DATA } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { FlatList, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyWishListScreen() {
  const wishListData = React.useMemo(
    () => POSTS_DATA.filter((item) => item.isBookmarked),
    []
  );

  const renderItem = React.useCallback(
    ({ item }: { item: (typeof POSTS_DATA)[0] }) => (
      <View className="mb-2 border-b border-gray-50">
        <SocialPost
          user={item.user}
          title={item.title}
          description={item.description}
          postImage={item.postImage}
          likes={item.likes}
          comments={item.comments}
          isMyPost={item.isMyPost}
          isLiked={item.isLiked}
          isBookmarked={item.isBookmarked}
        />
      </View>
    ),
    []
  );

  // Smoothness optimization: Pre-calculating layouts prevents the list from jumping
  // as items are discovered during scrolling.
  const getItemLayout = React.useCallback(
    (_: any, index: number) => ({
      length: 520, // Estimated base height of a SocialPost
      offset: 520 * index,
      index,
    }),
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
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

      {/* Main Content List */}
      <FlatList
        data={wishListData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          paddingBottom: 40,
          flexGrow: 1, // Ensures empty component centers correctly
        }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={7} // Reduced from 21 (default) to 7 for better memory/transition balance
        removeClippedSubviews={Platform.OS === "android"} // Significant performance gain on Android
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="bookmark-outline" size={64} color="#E5E7EB" />
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-gray-400 mt-4 text-lg"
            >
              No items in your wish list yet.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
