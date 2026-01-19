import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SocialPostProps {
  user: {
    name: string;
    avatar: string;
    date: string;
  };
  title: string;
  description: string;
  postImage: string;
  likes: number;
  comments: number;
  recommended?: boolean;
  trending?: boolean;
  isMyPost?: boolean;
  isSaved?: boolean;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

const SocialPost = ({
  user,
  title,
  description,
  postImage,
  likes,
  comments,
  trending,
  recommended,
  isMyPost,
  isSaved,
  isLiked,
  isBookmarked,
}: SocialPostProps) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const hanldeLike = () => {
    console.log("Like");
  };
  const handleBookmark = () => {
    console.log("Bookmark");
  };

  const handleFollow = () => {
    console.log("Follow");
  };

  return (
    <View className="bg-white p-2 mb-4 border-gray-100 pb-6">
      {/* User Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: user.avatar }}
            style={{ width: 40, height: 40 }}
            className="rounded-full bg-gray-200"
            contentFit="cover"
          />
          <View>
            <Text className="text-[15px] font-bold text-black border-black">
              {user.name}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-xs text-gray-500 font-medium">
                {user.date}
              </Text>

              {/* Recommended Badge (Hardcoded for demo as per design) */}
              {recommended && (
                <View className="bg-[#FFF0ED] px-2 py-0.5 rounded-full flex-row items-center gap-1">
                  <Ionicons name="flame" size={10} color="#FF4B3A" />
                  <Text className="text-[10px] text-[#FF4B3A] font-medium">
                    Recommended
                  </Text>
                </View>
              )}

              {/* Trending Badge (Hardcoded for demo as per design) */}
              {trending && (
                <View className="bg-[#EFF6FF] px-2 py-0.5 rounded-full flex-row items-center gap-1">
                  <Ionicons name="trending-up" size={10} color="#2B7FFF" />
                  <Text className="text-[10px] text-[#2B7FFF] font-medium">
                    Trending
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleFollow()}
          className={`px-4 py-1.5 rounded-lg border ${isFollowed ? "bg-gray-100 border-gray-200" : "border-gray-200 bg-white"}`}
        >
         {
          isMyPost ? (
            <Text className="text-xs text-gray-500 font-medium">Three dots</Text>
          ) : (
             <Text
            className={`text-xs font-semibold ${isFollowed ? "text-gray-500" : "text-gray-900"}`}
          >
            {isFollowed ? "Following" : "Follow"}
          </Text>
          )
         }
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text className="text-lg font-bold text-gray-900 mb-1">{title}</Text>

      {/* Description */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setExpanded(!expanded)}
        className="mb-3"
      >
        <Text
          numberOfLines={expanded ? 0 : 2}
          className="text-[14px] text-gray-500 leading-5"
        >
          {description}
          {!expanded && (
            <Text className="text-black font-semibold">.. see more</Text>
          )}
        </Text>
      </TouchableOpacity>

      {/* Post Image Container */}
      <View className="rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
        <Image
          source={{ uri: postImage }}
          style={{ width: "100%", height: 250 }}
          contentFit="cover"
        />

        {/* Amazon Call to Action - Styled like the reference */}
        <View className="flex-row items-center justify-between p-3 bg-[#EEF2F6]">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-10 h-10 bg-white rounded-lg items-center justify-center shadow-sm">
              <FontAwesome5 name="amazon" size={20} color="#0071e3" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-bold text-[#0071e3] mb-0.5">
                AVAILABLE ON AMAZON
              </Text>
              <Text
                className="text-xs text-gray-700 font-medium"
                numberOfLines={1}
              >
                {title}
              </Text>
            </View>
          </View>

          <TouchableOpacity className="bg-[#3B82F6] px-4 py-2 rounded-lg shadow-sm">
            <Text className="text-white text-xs font-bold">
              Check On Amazon
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Engagement Footer */}
      <View className="flex-row items-center justify-between mt-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            className="flex-row items-center gap-1.5 mr-2"
            onPress={() => hanldeLike()}
          >
            {isLiked ? (
              <Ionicons name="thumbs-up" size={20} color="#3B82F6" />
            ) : (
              <Ionicons name="thumbs-up-outline" size={20} color="#3B82F6" />
            )}
            <Text className="text-sm text-gray-500 font-medium">Like</Text>
          </TouchableOpacity>

          <Text className="text-xs text-gray-400 font-medium">
            {likes} People liked this
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity className="flex-row items-center gap-1  ">
            <MaterialCommunityIcons
              name="message-reply-text-outline"
              size={16}
              color="#9CA3AF"
            />
            <Text className="text-sm text-gray-500 font-medium">
              {comments} comments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleBookmark()}>
            {isBookmarked ? (
              <Ionicons name="bookmark" size={20} color="#3B82F6" />
            ) : (
              <Ionicons name="bookmark-outline" size={20} color="#6B7280" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default React.memo(SocialPost);
