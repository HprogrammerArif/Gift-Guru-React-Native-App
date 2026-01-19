import HomeHeader from "@/components/home/HomeHeader";
import SocialPost from "@/components/home/SocialPost";
import { POSTS_DATA, RECOMMENDED_DATA, TRENDING_DATA } from "@/constants";
import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import RecommendedCarousel from "@/components/home/RecommendedCarousel";
import TrendingNowCarousel from "@/components/home/TrendingNowCarousel";

export default function Home() {
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  const renderItem = React.useCallback(({ item }: {item: (typeof POSTS_DATA)[0]}) => (
          <View className="px-4">
            <SocialPost
              user={item.user}
              title={item.title}
              description={item.description}
              postImage={item.postImage}
              likes={item.likes}
              comments={item.comments}
            />
          </View>
        ),
        []
      );

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  const renderHeader = () => (
    <View>
      <RecommendedCarousel RECOMMENDED_DATA={RECOMMENDED_DATA} />
      {/* Trending Now SECTION */}
      <TrendingNowCarousel TRENDING_DATA={TRENDING_DATA} />
      <View className="mt-6" />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={["top"]}>
      {/* Home Header */}
      <View className="bg-[#FF4B3A]">
        <HomeHeader
          value={search}
          onSearch={handleSearch}
          onMenuPress={() => (navigation as any).openDrawer()}
          onNotificationPress={() => console.log("Notif Pressed")}
        />
      </View>

      {/* Main Content using FlatList for better performance */}
      <FlatList
        data={POSTS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        initialNumToRender={7}
        maxToRenderPerBatch={7}
        windowSize={7}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
}
