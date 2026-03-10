import ProfileSocialPost from "@/components/home/ProfileSocialPost";
import { ApiPost } from "@/components/home/SocialPost";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useGetProfileDataQuery,
  useGetUserPostsQuery,
} from "@/redux/features/posts/postApi";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  InteractionManager,
  RefreshControl,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useSelector } from "react-redux";

// 1. Memoized item for efficiency
const MemoizedProfilePost = memo(({ item }: { item: ApiPost }) => (
  <View className="mb-2 border-b border-gray-50">
    <ProfileSocialPost post={item} />
  </View>
));
MemoizedProfilePost.displayName = "MemoizedProfilePost";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const searchParams = useLocalSearchParams();
  const idParam = Array.isArray(searchParams.id)
    ? searchParams.id[0]
    : searchParams.id;

  const currentUser = useSelector(selectCurrentUser);

  console.log("currentUser", currentUser, idParam);
  const [isReady, setIsReady] = useState(false);

  // High-performance: wait for navigation transition to finish
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  const userId = idParam || currentUser?.user_id;

  const {
    data: profile,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
    refetch: refetchProfile,
  } = useGetProfileDataQuery(userId!, {
    skip: !userId,
  });

  const {
    data: postsData,
    isLoading: isPostsLoading,
    isFetching: isPostsFetching,
    refetch: refetchPosts,
  } = useGetUserPostsQuery(userId!, {
    skip: !userId,
  });

  const posts: ApiPost[] = useMemo(() => {
    if (!postsData) return [];
    return Array.isArray(postsData)
      ? postsData
      : (postsData as any).results || [];
  }, [postsData]);

  const onRefresh = useCallback(() => {
    refetchProfile();
    refetchPosts();
  }, [refetchProfile, refetchPosts]);

  const renderItem = useCallback(
    ({ item }: { item: ApiPost }) => <MemoizedProfilePost item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: ApiPost) => String(item.id), []);

  const renderHeader = useCallback(() => {
    if (isProfileLoading || !profile)
      return (
        <View style={{ height: 120, justifyContent: "center" }}>
          <ActivityIndicator color="#2B7FFF" />
        </View>
      );

    const name =
      `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
      profile.email?.split("@")[0] ||
      profile.username ||
      "User";

    // Construct full URL for image if it's a relative path
    const profileImage = profile.image
      ? profile.image.startsWith("http")
        ? profile.image
        : `http://intensely-optimal-unicorn.ngrok-free.app${profile.image}`
      : null;

    return (
      <View className="px-6 py-8 flex-row items-center gap-5">
        <View className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden shadow-sm">
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />
          ) : (
            <View className="flex-1 items-center justify-center bg-gray-100">
              <Ionicons name="person" size={40} color="#D1D5DB" />
            </View>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-3xl font-bold text-gray-900 mb-1 leading-tight">
            {name}
          </Text>

          <View className="flex-row gap-8 mt-1">
            <View>
              <Text className="text-xl font-bold text-gray-900">
                {profile.followers_count || 0}
              </Text>
              <Text className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                Followers
              </Text>
            </View>
            <View>
              <Text className="text-xl font-bold text-gray-900">
                {profile.following_count || 0}
              </Text>
              <Text className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                Following
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }, [profile, isProfileLoading]);

  if (!userId) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-5">
        <Text className="text-gray-400 font-medium">
          Please login to view profile
        </Text>
      </SafeAreaView>
    );
  }

  if (isProfileLoading && !profile) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2B7FFF" />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingTop: insets.top }}>
      <FlatList
        data={!isReady ? [] : posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{
          paddingHorizontal: 0,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        // Performance Tuning
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        updateCellsBatchingPeriod={100}
        ListEmptyComponent={
          isReady && !isPostsLoading && posts.length === 0 ? (
            <View className="py-20 items-center">
              <Text className="text-gray-400">No posts yet</Text>
            </View>
          ) : !isReady || isProfileLoading || isPostsLoading ? (
            <View className="py-20">
              <ActivityIndicator color="#2B7FFF" />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={
              (isProfileFetching || isPostsFetching) && !isProfileLoading
            }
            onRefresh={onRefresh}
            tintColor="#2B7FFF"
          />
        }
      />
    </View>
  );
}
