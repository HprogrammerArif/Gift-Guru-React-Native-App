import { Ionicons } from "@expo/vector-icons";
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

  return (
    <View className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-gray-100">
      {/* User Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: user.avatar }}
            className="w-12 h-12 rounded-full"
            contentFit="cover"
          />
          <View>
            <Text className="text-base font-bold text-gray-900">
              {user.name}
            </Text>
            <Text className="text-xs text-gray-500 font-medium uppercase">
              {user.date}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setIsFollowed(!isFollowed)}
          className={`px-6 py-2 rounded-full border ${isFollowed ? "bg-gray-100 border-gray-100" : "border-[#E5E7EB]"}`}
        >
          <Text
            className={`text-sm font-bold ${isFollowed ? "text-gray-500" : "text-gray-900"}`}
          >
            {isFollowed ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <Text className="text-xl font-bold text-gray-900 mb-2 leading-tight">
        {title}
      </Text>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setExpanded(!expanded)}
      >
        <Text
          numberOfLines={expanded ? 0 : 3}
          className="text-[15px] text-gray-600 leading-6"
        >
          {description}
          {!expanded && (
            <Text className="text-[#9CA3AF] font-bold"> ... see more</Text>
          )}
        </Text>
      </TouchableOpacity>

      {/* Post Image & Amazon Button Overlay */}
      <View className="mt-4 relative rounded-3xl overflow-hidden bg-black">
        <Image
          source={{ uri: postImage }}
          className="w-full h-64 opacity-90"
          contentFit="cover"
        />

        {/* Amazon Call to Action */}
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-black/30 backdrop-blur-md">
          <Text className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">
            AVAILABLE ON AMAZON
          </Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-lg font-bold">
              Check On Amazon
            </Text>
            <TouchableOpacity className="bg-white px-5 py-2 rounded-full">
              <Text className="text-black font-bold text-sm">Shop Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Engagement Footer */}
      <View className="flex-row items-center justify-between mt-5 pt-4 border-t border-gray-100">
        <View className="flex-row items-center gap-6">
          <TouchableOpacity className="flex-row items-center gap-2">
            <Ionicons name="heart-outline" size={24} color="#6B7280" />
            <Text className="text-sm text-gray-600 font-semibold">
              {likes} People liked this
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center gap-2">
            <Ionicons name="chatbubble-outline" size={22} color="#6B7280" />
            <Text className="text-sm text-gray-600 font-semibold">
              {comments} comments
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SocialPost;
