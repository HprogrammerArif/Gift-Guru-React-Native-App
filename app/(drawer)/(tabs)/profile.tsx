import ProfileSocialPost from "@/components/home/ProfileSocialPost";
import { POSTS_DATA } from "@/constants";
import { Image } from "expo-image";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const renderItem = React.useCallback(
    ({ item }: { item: (typeof POSTS_DATA)[0] }) => (
      <View className="mb-2 border-b border-gray-50">
        <ProfileSocialPost
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

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Profile data */}
      {/* Profile data */}
      <View className="px-6 py-6 flex-row items-center gap-5">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
          }}
          style={{ width: 64, height: 64 }}
          className="w-24 h-24 rounded-2xl bg-gray-200"
          contentFit="cover"
          transition={200}
        />
        <View>
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Rakib Hasan
          </Text>

          <View className="flex-row gap-8">
            <View>
              <Text className="text-lg font-bold text-gray-900">128</Text>
              <Text className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                Followers
              </Text>
            </View>
            <View>
              <Text className="text-lg font-bold text-gray-900">89</Text>
              <Text className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                Following
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content List */}
      <FlatList
        data={POSTS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        // ListHeaderComponent={renderHeader}
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
