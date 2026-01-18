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
}

const SocialPost = ({
  user,
  title,
  description,
  postImage,
  likes,
  comments,
}: SocialPostProps) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <View className="bg-white p-4 mb-4 border-b border-gray-100 pb-6">
      {/* User Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: user.avatar }}
            className="w-10 h-10 rounded-full bg-gray-200"
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
              <View className="bg-[#FFF0ED] px-2 py-0.5 rounded-full flex-row items-center gap-1">
                <Ionicons name="flame" size={10} color="#FF4B3A" />
                <Text className="text-[10px] text-[#FF4B3A] font-medium">
                  Recommended
                </Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setIsFollowed(!isFollowed)}
          className={`px-4 py-1.5 rounded-lg border ${isFollowed ? "bg-gray-100 border-gray-200" : "border-gray-200 bg-white"}`}
        >
          <Text
            className={`text-xs font-semibold ${isFollowed ? "text-gray-500" : "text-gray-900"}`}
          >
            {isFollowed ? "Following" : "Follow"}
          </Text>
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
          className="w-full h-[250px]"
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
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            className="flex-row items-center gap-1.5"
            onPress={() => setIsLiked(!isLiked)}
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

          <TouchableOpacity className="flex-row items-center gap-1.5 ml-2">
            <MaterialCommunityIcons
              name="message-reply-text-outline"
              size={18}
              color="#9CA3AF"
            />
            <Text className="text-sm text-gray-500 font-medium">
              {comments} comments
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SocialPost;
