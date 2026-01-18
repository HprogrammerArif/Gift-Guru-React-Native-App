import HomeHeader from "@/components/home/HomeHeader";
import ProductCard from "@/components/home/ProductCard";
import SectionHeader from "@/components/home/SectionHeader";
import SocialPost from "@/components/home/SocialPost";
import { POSTS_DATA, RECOMMENDED_DATA, TRENDING_DATA } from "@/constants";
import React, { useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNavigation } from "expo-router";
import Recommended from "@/components/home/Recommended";
import TrendingNow from "@/components/home/TrendingNow";

export default function Home() {
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={["top"]}>
      <HomeHeader
        value={search}
        onSearch={handleSearch}
        onMenuPress={() => (navigation as any).openDrawer()}
        onNotificationPress={() => console.log("Notif Pressed")}
      />

      <TrendingNow TRENDING_DATA={TRENDING_DATA} />


      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[]}
      >
       

      

        {/* Social Feed Items */}
        <View className="px-5 mt-8">
          {POSTS_DATA.map((post) => (
            <SocialPost
              key={post.id}
              user={post.user}
              title={post.title}
              description={post.description}
              postImage={post.postImage}
              likes={post.likes}
              comments={post.comments}
            />
          ))}
        </View>

        {/* Extra Space at bottom for tab bar padding */}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
