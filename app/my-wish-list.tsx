import ProfileSocialPost from "@/components/home/ProfileSocialPost";
import SocialPost from "@/components/home/SocialPost";
import { POSTS_DATA } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyWishListScreen() {
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
        data={POSTS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
       
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
}
