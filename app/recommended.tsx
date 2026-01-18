import SocialPost from "@/components/home/SocialPost";
import { POSTS_DATA } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecommendedScreen() {
  const renderHeader = () => (
    <View className="mb-4">
      {/* Gradient Banner */}
      <LinearGradient
        colors={["#FF4B3A", "#FF8C42"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="rounded-2xl p-5 mb-6"
      >
        <View className="flex-row items-center gap-2 mb-2">
          <Ionicons name="flame" size={24} color="white" />
          <Text className="text-white text-xl font-bold">
            Recommended for you
          </Text>
        </View>
        <Text className="text-white/90 text-[13px] leading-5 font-medium">
          Our expert curators and top community members highly recommend these
          unique gifts.
        </Text>
      </LinearGradient>

      {/* List content starts after this */}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Navigation Header with Search */}
      <View className="px-4 py-3 pb-2 flex-row items-center gap-3 border-b border-transparent">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center -ml-2"
        >
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>

        <View className="flex-1 relative">
          <View className="absolute left-3 top-3 z-10">
            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          </View>
          <TextInput
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-gray-900 text-base shadow-sm"
          />
        </View>

        {/* Notification Icon */}
        <TouchableOpacity onPress={() => router.push("/notifications")} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Main Content List */}
      <FlatList
        data={POSTS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-2 border-b border-gray-100">
            {/* Reusing SocialPost but removing the bottom border usually handled by the component slightly differently if needed, 
                 but SocialPost has its own styles. We'll stick to 1:1 reuse as per best practice. */}
            <SocialPost
              user={item.user}
              title={item.title}
              description={item.description}
              postImage={item.postImage}
              likes={item.likes}
              comments={item.comments}
              recommended={item.recommended}
            />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
