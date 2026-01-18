import HomeHeader from "@/components/home/HomeHeader";
import SocialPost from "@/components/home/SocialPost";
import { POSTS_DATA, RECOMMENDED_DATA, TRENDING_DATA } from "@/constants";
import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Recommended from "@/components/home/Recommended";
import TrendingNow from "@/components/home/TrendingNow";
import { useNavigation } from "expo-router";

export default function Home() {
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  const renderHeader = () => (
    <View>
      <Recommended RECOMMENDED_DATA={RECOMMENDED_DATA} />
      {/* Trending Now SECTION */}
      <TrendingNow TRENDING_DATA={TRENDING_DATA} />
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
        renderItem={({ item }) => (
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
        )}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </SafeAreaView>
  );
}
