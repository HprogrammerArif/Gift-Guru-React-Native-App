import {
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { memo, useRef, useState } from "react";
import {
    Dimensions,
    Linking,
    Modal,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { ApiPost } from "./SocialPost";

interface ProfileSocialPostProps {
  post: ApiPost;
}

/** Format ISO date to relative/readable string */
function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const ProfileSocialPost = ({ post }: ProfileSocialPostProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(post.is_liked ?? false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const iconRef = useRef<View>(null);

  const openMenu = () => {
    iconRef.current?.measureInWindow((x, y, width, height) => {
      setMenuPosition({
        top: y + height,
        right: Dimensions.get("window").width - x - width,
      });
      setShowMenu(true);
    });
  };

  const displayName =
    `${post.user?.first_name || ""} ${post.user?.last_name || ""}`.trim() ||
    post.user?.username ||
    "User";

  const postImage =
    post.images && post.images.length > 0
      ? post.images[0].image
      : post.amazon_product_image_url;

  return (
    <View className="bg-white p-2 mb-4 border-gray-100 pb-6">
      {/* User Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center overflow-hidden">
            {post.profile ? (
              <Image
                source={{ uri: post.profile }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : (
              <Ionicons name="person" size={20} color="#9CA3AF" />
            )}
          </View>
          <View>
            <Text className="text-[15px] font-bold text-black">
              {displayName}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-xs text-gray-500 font-medium">
                {formatDate(post.created_at)}
              </Text>
              {post.status === "recommended" && (
                <View className="bg-[#FFF0ED] px-2 py-0.5 rounded-full flex-row items-center gap-1">
                  <Ionicons name="flame" size={10} color="#FF4B3A" />
                  <Text className="text-[10px] text-[#FF4B3A] font-medium">
                    Recommended
                  </Text>
                </View>
              )}
              {post.status === "trending" && (
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

        {/* Three dot icon for post management */}
        <View ref={iconRef} collapsable={false}>
          <TouchableOpacity onPress={openMenu} className="p-3" hitSlop={15}>
            <Ionicons name="ellipsis-vertical" size={16} color="black" />
          </TouchableOpacity>

          <Modal
            transparent
            visible={showMenu}
            animationType="fade"
            onRequestClose={() => setShowMenu(false)}
          >
            <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
              <View className="flex-1">
                <View
                  className="absolute bg-white rounded-xl shadow-lg border border-gray-100 w-36 overflow-hidden"
                  style={{
                    top: menuPosition.top,
                    right: menuPosition.right,
                    elevation: 5,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setShowMenu(false);
                      // Handle update
                    }}
                    className="flex-row items-center gap-2 px-4 py-3 border-b border-gray-50"
                  >
                    <Ionicons name="create-outline" size={16} color="#374151" />
                    <Text className="text-gray-700 font-medium text-sm">
                      Update
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setShowMenu(false);
                      // Handle delete
                    }}
                    className="flex-row items-center gap-2 px-4 py-3"
                  >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    <Text className="text-red-500 font-medium text-sm">
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </View>

      {/* Content / Description */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setExpanded(!expanded)}
        className="mb-3"
      >
        <Text
          numberOfLines={expanded ? 0 : 3}
          className="text-[14px] text-gray-700 leading-5"
        >
          {post.content}
          {!expanded && post.content.length > 100 && (
            <Text className="text-[#2B7FFF] font-semibold">.. see more</Text>
          )}
        </Text>
      </TouchableOpacity>

      {/* Post Image Container */}
      <View className="rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
        {postImage ? (
          <Image
            source={{ uri: postImage }}
            style={{ width: "100%", height: 300 }}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={{ height: 10 }} />
        )}

        {/* Amazon Call to Action */}
        <View className="flex-row items-center justify-between p-3 bg-[#EEF2F6]">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-10 h-10 bg-white rounded-lg items-center justify-center shadow-sm">
              <FontAwesome5 name="amazon" size={20} color="#0071e3" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-bold text-[#0071e3] mb-0.5 uppercase tracking-tighter">
                Available on Amazon
              </Text>
              <Text
                className="text-xs text-gray-700 font-medium"
                numberOfLines={1}
              >
                {post.amazon_product_name || "Check Price"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() =>
              post.amazon_link && Linking.openURL(post.amazon_link)
            }
            className="bg-[#3B82F6] px-4 py-2 rounded-lg shadow-sm"
          >
            <Text className="text-white text-xs font-bold">Check Price</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Engagement Footer */}
      <View className="flex-row items-center justify-between mt-4">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="flex-row items-center gap-1.5"
            onPress={() => setIsLiked(!isLiked)}
          >
            <Ionicons
              name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
              size={20}
              color={isLiked ? "#3B82F6" : "#6B7280"}
            />
            <Text
              className={`text-sm font-medium ${isLiked ? "text-[#3B82F6]" : "text-gray-500"}`}
            >
              {post.likes_count}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center gap-1.5">
            <MaterialCommunityIcons
              name="message-reply-text-outline"
              size={18}
              color="#6B7280"
            />
            <Text className="text-sm text-gray-500 font-medium">
              {post.comments_count}
            </Text>
          </View>
        </View>

        <TouchableOpacity hitSlop={15}>
          <Ionicons
            name={post.is_saved ? "bookmark" : "bookmark-outline"}
            size={22}
            color={post.is_saved ? "#3B82F6" : "#6B7280"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(ProfileSocialPost);
