import HomeHeader from "@/components/home/HomeHeader";
import SocialPost from "@/components/home/SocialPost";
import { POSTS_DATA, RECOMMENDED_DATA, TRENDING_DATA } from "@/constants";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TrendingNow from "@/components/home/TrendingNow";
import { useNavigation } from "expo-router";
import Recommended from "@/components/home/Recommended";

export default function Home() {
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={["top"]}>
      {/* Home Header AND RECOMANDED SECTION */}

      <View className="bg-[#FF4B3A] ">
      <HomeHeader
        value={search}
        onSearch={handleSearch}
        onMenuPress={() => (navigation as any).openDrawer()}
        onNotificationPress={() => console.log("Notif Pressed")}
      />

      

       </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >

         <Recommended RECOMMENDED_DATA={RECOMMENDED_DATA} />
         
        {/* Trending Now SECTION */}
        <TrendingNow TRENDING_DATA={TRENDING_DATA} />

        {/* Social Feed SECTION OR POSTS SECTION */}
        <View className="px-4 mt-6 pb-20">
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
      </ScrollView>
    </SafeAreaView>
  );
}
