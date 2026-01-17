import HomeHeader from "@/components/home/HomeHeader";
import ProductCard from "@/components/home/ProductCard";
import SectionHeader from "@/components/home/SectionHeader";
import SocialPost from "@/components/home/SocialPost";
import { POSTS_DATA, TRENDING_DATA } from "@/constants";
import React, { useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Home() {
  const [search, setSearch] = useState("");

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={["top"]}>
      <HomeHeader
      value={search}
        onSearch={handleSearch}
        onMenuPress={() => console.log("Menu Pressed")}
        onNotificationPress={() => console.log("Notif Pressed")}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[]}
      >
        {/* Recommended Section with Red/Orange Background */}
        {/* <View className="bg-[#FF4B3A] pb-10 rounded-b-[40px]">
          <SectionHeader
            title="Recommended"
            onSeeAll={() => {}}
            icon="flame"
            iconColor="white"
          />
          <FlatList
            data={RECOMMENDED_DATA}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item }) => (
              <ProductCard
                title={item.title}
                subText={item.likes}
                image={item.image}
                variant="recommended"
              />
            )}
          />
        </View> */}

        {/* Trending Now */}
        <View className="mt-[-25px] pt-1">
          <SectionHeader title="Trending now" onSeeAll={() => {}} />
          <FlatList
            data={TRENDING_DATA}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item }) => (
              <ProductCard
                title={item.title}
                subText={item.engagement}
                image={item.image}
                variant="trending"
              />
            )}
          />
        </View>

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
