import {
  useFollowUserMutation,
  useLikePostMutation,
  useSavePostMutation,
} from "@/redux/features/posts/postApi";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

// --- Types matching the backend API shape ---
export interface PostUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface PostImage {
  id: number;
  image: string;
}

export interface ApiPost {
  id: number;
  user: PostUser;
  content: string;
  category?: { id: number; name: string };
  occasion?: { id: number; name: string };
  amazon_link?: string;
  amazon_product_name?: string | null;
  amazon_product_image_url?: string | null;
  target_category?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profile?: string | null;
  images?: PostImage[];
  is_saved?: boolean;
  is_liked?: boolean;
  is_following?: boolean;
}

interface SocialPostProps {
  post: ApiPost;
  isMyPost?: boolean;
}

/** Format ISO date to a relative/readable string */
function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-GB");
}

const SocialPost = ({ post, isMyPost }: SocialPostProps) => {
  console.log(post, "post", isMyPost);
  const [isFollowed, setIsFollowed] = useState(post.is_following ?? false);
  const [isLiked, setIsLiked] = useState(post.is_liked ?? false);
  const [likesCount, setLikesCount] = useState(post.likes_count ?? 0);
  const [isBookmarked, setIsBookmarked] = useState(post.is_saved ?? false);
  const [expanded, setExpanded] = useState(false);

  // API mutations
  const [likePost] = useLikePostMutation();
  const [followUser] = useFollowUserMutation();
  const [savePost] = useSavePostMutation();

  // Derived display values
  const displayName =
    `${post.user?.first_name || ""} ${post.user?.last_name || ""}`.trim() ||
    post.user?.username ||
    "User";

  const avatarUrl = post.profile || null;
  const dateStr = post.created_at ? formatDate(post.created_at) : "Just now";

  // First image from `images[]`, or null
  const firstImage =
    post.images && post.images.length > 0 ? post.images[0].image : null;

  // Amazon product image takes priority over post image for the card thumbnail
  const productImage = post.amazon_product_image_url || null;
  const cardImage = firstImage || productImage;

  const handleLike = async () => {
    // Optimistic update
    const prevLiked = isLiked;
    const prevCount = likesCount;
    setIsLiked(!prevLiked);
    setLikesCount((prev) => (prevLiked ? prev - 1 : prev + 1));

    try {
      const res: any = await likePost(post.id);
      if (res?.error) {
        // Rollback on failure
        setIsLiked(prevLiked);
        setLikesCount(prevCount);
      }
    } catch {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleBookmark = async () => {
    // Optimistic update
    const prevBookmarked = isBookmarked;
    setIsBookmarked(!prevBookmarked);

    try {
      const res: any = await savePost(post.id);
      if (res?.error) {
        setIsBookmarked(prevBookmarked);
        Alert.alert("Error", "Failed to save post. Please try again.");
      }
    } catch {
      setIsBookmarked(prevBookmarked);
    }
  };

  const handleFollow = async () => {
    // Optimistic update
    const prevFollowed = isFollowed;
    setIsFollowed(!prevFollowed);

    try {
      const res: any = await followUser(post.user.id);
      if (res?.error) {
        setIsFollowed(prevFollowed);
        Alert.alert("Error", "Failed to follow user. Please try again.");
      }
    } catch {
      setIsFollowed(prevFollowed);
    }
  };

  return (
    <View className="bg-white p-2 mb-4 border-gray-100 pb-6">
      {/* User Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3">
          {/* Avatar */}
          <View className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: 40, height: 40 }}
                contentFit="cover"
              />
            ) : (
              <View className="w-10 h-10 rounded-full bg-[#2B7FFF]/20 items-center justify-center">
                <Text className="text-[#2B7FFF] font-bold text-base">
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <View>
            <Text className="text-[15px] font-bold text-black">
              {displayName}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-xs text-gray-500 font-medium">
                {dateStr}
              </Text>

              {/* Category Badge */}
              {post.category && (
                <View className="bg-[#EFF6FF] px-2 py-0.5 rounded-full flex-row items-center gap-1">
                  <Ionicons name="pricetag" size={10} color="#2B7FFF" />
                  <Text className="text-[10px] text-[#2B7FFF] font-medium">
                    {post.category.name}
                  </Text>
                </View>
              )}

              {/* Occasion Badge */}
              {post.occasion && (
                <View className="bg-[#FFF0ED] px-2 py-0.5 rounded-full flex-row items-center gap-1">
                  <Ionicons name="flame" size={10} color="#FF4B3A" />
                  <Text className="text-[10px] text-[#FF4B3A] font-medium">
                    {post.occasion.name}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Follow / 3-dot button */}
        <TouchableOpacity
          onPress={() => handleFollow()}
          className={`px-4 py-1.5 rounded-lg border ${
            isFollowed
              ? "bg-gray-100 border-gray-200 text-gray-900"
              : "border-gray-200 bg-white text-gray-900"
          }`}
        >
          {isMyPost ? (
            <Text className="text-xs text-gray-500 font-medium">• • •</Text>
          ) : (
            <Text
              className={`text-xs font-semibold ${
                isFollowed ? "text-gray-900" : "text-gray-900"
              }`}
            >
              {isFollowed ? "Following" : "Follow"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
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
          {!expanded && (
            <Text className="text-black font-semibold"> ...see more</Text>
          )}
        </Text>
      </TouchableOpacity>

      {/* Post Image(s) */}
      {cardImage ? (
        <View className="rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 mb-3">
          <Image
            source={{ uri: cardImage }}
            style={{ width: "100%", height: 250 }}
            contentFit="cover"
          />
        </View>
      ) : null}

      {/* Amazon Product Card */}
      {post.amazon_link ? (
        <View className="flex-row items-center justify-between p-3 bg-[#EEF2F6] rounded-xl mb-3">
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
                {post.amazon_product_name || "View product on Amazon"}
              </Text>
            </View>
          </View>

          <TouchableOpacity className="bg-[#3B82F6] px-4 py-2 rounded-lg shadow-sm">
            <Text className="text-white text-xs font-bold">Check price</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Engagement Footer */}
      <View className="flex-row items-center justify-between mt-2">
        <View className="flex-row items-center">
          <TouchableOpacity
            className="flex-row items-center gap-1.5 mr-2"
            onPress={handleLike}
          >
            {isLiked ? (
              <Ionicons name="thumbs-up" size={20} color="#3B82F6" />
            ) : (
              <Ionicons name="thumbs-up-outline" size={20} color="#3B82F6" />
            )}
            <Text className="text-sm text-gray-500 font-medium">Like</Text>
          </TouchableOpacity>

          <Text className="text-xs text-gray-400 font-medium">
            {likesCount} {likesCount === 1 ? "person" : "people"} liked this
          </Text>
        </View>

        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="flex-row items-center gap-1">
            <MaterialCommunityIcons
              name="message-reply-text-outline"
              size={16}
              color="#9CA3AF"
            />
            <Text className="text-sm text-gray-500 font-medium">
              {post.comments_count} comments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity hitSlop={24} onPress={handleBookmark}>
            {isBookmarked ? (
              <Ionicons name="bookmark" size={22} color="#3B82F6" />
            ) : (
              <Ionicons name="bookmark-outline" size={22} color="#6B7280" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default React.memo(SocialPost);
