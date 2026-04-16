import {
  useFollowUserMutation,
  useSavePostMutation,
  useTrackLinkClickMutation,
  useDeletePostMutation,
  useReportPostMutation,
  useBlockUserMutation,
  useLikePostMutation,
} from "@/redux/features/posts/postApi";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import CommentsSheet from "./CommentsSheet";
import PostOptionsSheet from "./PostOptionsSheet";

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

export interface ApiComment {
  id: number;
  post: number;
  user: PostUser;
  content: string;
  created_at: string;
}

export interface ApiPost {
  id: number;
  user: PostUser;
  title: string;
  content: string;
  category?: { id: number; name: string };
  occasion?: { id: number; name: string };
  amazon_link?: string;
  amazon_product_name?: string | null;
  amazon_product_image_url?: string | null;
  target_category?: string;
  likes_count: number;
  comments_count: number;
  comments?: ApiComment[]; // Already embedded in the post response
  created_at: string;
  profile?: string | null;
  images?: PostImage[];
  is_saved?: boolean;
  is_liked?: boolean;
  is_following?: boolean;
  status?: string | null;
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


// --- Main SocialPost ---
const SocialPost = ({ post, isMyPost }: SocialPostProps) => {
  const [isFollowed, setIsFollowed] = useState(post.is_following ?? false);
  const [isLiked, setIsLiked] = useState(post.is_liked ?? false);
  const [likesCount, setLikesCount] = useState(post.likes_count ?? 0);
  const [isBookmarked, setIsBookmarked] = useState(post.is_saved ?? false);
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments_count ?? 0);

  // API mutations
  const [likePost] = useLikePostMutation();
  const [followUser] = useFollowUserMutation();
  const [savePost] = useSavePostMutation();
  const [trackLinkClick] = useTrackLinkClickMutation();
  const [deletePost] = useDeletePostMutation();
  const [reportPost] = useReportPostMutation();
  const [blockUser] = useBlockUserMutation();

  const displayName =
    `${post.user?.first_name || ""} ${post.user?.last_name || ""}`.trim() ||
    post.user?.username ||
    "User";

  const avatarUrl = post.profile || null;
  const dateStr = post.created_at ? formatDate(post.created_at) : "Just now";

  const firstImage =
    post.images && post.images.length > 0 ? post.images[0].image : null;
  const productImage = post.amazon_product_image_url || null;
  const cardImage = firstImage || productImage;

  // Embedded comments from post response
  const initialComments: ApiComment[] = Array.isArray(post.comments)
    ? post.comments
    : [];

  const handleLike = async () => {
    const prevLiked = isLiked;
    const prevCount = likesCount;
    setIsLiked(!prevLiked);
    setLikesCount((prev) => (prevLiked ? prev - 1 : prev + 1));
    try {
      const res: any = await likePost(post.id);
      if (res?.error) {
        setIsLiked(prevLiked);
        setLikesCount(prevCount);
      }
    } catch {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleBookmark = async () => {
    const prev = isBookmarked;
    setIsBookmarked(!prev);
    try {
      const res: any = await savePost(post.id);
      if (res?.error) {
        setIsBookmarked(prev);
        Alert.alert("Error", "Failed to save post. Please try again.");
      }
    } catch {
      setIsBookmarked(prev);
    }
  };

  const handleFollow = async () => {
    const prev = isFollowed;
    setIsFollowed(!prev);
    try {
      const res: any = await followUser(post.user.id);
      if (res?.error) {
        setIsFollowed(prev);
      }
    } catch {
      setIsFollowed(prev);
    }
  };

  const truncateText = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + ".." : text;
  };

  const handleReport = () => {
    Alert.alert("Report Content", "Are you sure you want to report this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Report",
        style: "destructive",
        onPress: async () => {
          try {
            const res: any = await reportPost(post.id);
            if (res.error) throw new Error();
            setIsHidden(true); // Hide immediately
            Toast.show({
              type: "success",
              text1: "Post reported successfully.",
              text2: "Our team will review this content shortly."
            });
          } catch (e) {
            Toast.show({ type: "error", text1: "Failed to report post."});
          }
        },
      },
    ]);
  };

  const handleBlock = () => {
    Alert.alert(
      "Block User",
      `Are you sure you want to block ${displayName}? You will no longer see their posts.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
        onPress: async () => {
             try {
              const res: any = await blockUser(post.user.id);
              if (res.error) throw new Error();
              setIsHidden(true); // Hide immediately
              Toast.show({
                type: "success",
                text1: "User blocked successfully.",
              });
            } catch (e) {
              Toast.show({ type: "error", text1: "Failed to block user."});
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
           try {
              const res: any = await deletePost(post.id);
              if (res.error) throw new Error();
              setIsHidden(true); // Hide immediately
              Toast.show({
                type: "success",
                text1: "Post deleted successfully.",
              });
            } catch (e) {
              Toast.show({ type: "error", text1: "Failed to delete post."});
            }
        },
      },
    ]);
  };

  if (isHidden) return null;

  return (
    <View className="bg-white p-1 mb-4 border-gray-100 pb-4">
      {/* User Header */}
      <View className="flex-row items-center justify-between mb-3">
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/profile",
              params: { id: post.user.id },
            });
          }}
          className="flex-row items-center gap-3"
        >
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
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="text-xs text-gray-500 font-medium">
                {dateStr}
              </Text>

              {post.category && (
                <View className="bg-[#EFF6FF] px-2 py-0.5 rounded-full flex-row items-center gap-1">
                  <Ionicons name="pricetag" size={10} color="#2B7FFF" />
                  <Text className="text-[10px] text-[#2B7FFF] font-medium">
                    {truncateText(post.category.name, 10)}
                  </Text>
                </View>
              )}

              {post.occasion && (
                <View className="bg-[#FFF0ED] px-2 py-0.5 rounded-full flex-row items-center gap-1">
                  <Ionicons name="flame" size={10} color="#FF4B3A" />
                  <Text className="text-[10px] text-[#FF4B3A] font-medium">
                    {truncateText(post.occasion.name, 10)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* More Options / Dots */}
        <View className="flex-row items-center gap-1">
          <TouchableOpacity onPress={() => setShowOptionsSheet(true)} className="p-2">
            <Ionicons name="ellipsis-horizontal" size={20} color="#65676B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {post.content ? (
        <TouchableOpacity
          activeOpacity={post.content.length > 60 ? 0.7 : 1}
          onPress={() => {
            if (post.content.length > 60) {
              setExpanded(!expanded);
            }
          }}
          className="mb-3"
        >
          <Text className="text-[14px] text-gray-700 leading-5">
            {!expanded && post.content.length > 60
              ? post.content.substring(0, 60).trim()
              : post.content}
            {!expanded && post.content.length > 60 && (
              <Text className="text-black font-semibold"> ...see more</Text>
            )}
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* Post Image */}
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
      {post.amazon_product_image_url ? (
        <View className="flex-row items-center justify-between p-3 bg-[#EEF2F6] rounded-xl mb-3">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-10 h-10 bg-white rounded-lg items-center justify-center shadow-sm">
              <Image
                source={{ uri: post.amazon_product_image_url }}
                style={{ width: 40, height: 40 }}
                contentFit="cover"
              />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-0.5">
                <Text className="text-[10px] font-bold text-[#0071e3]">
                  AVAILABLE ON AMAZON
                </Text>
                {/* FTC/ASA required affiliate disclosure */}
                <View className="bg-gray-200 px-1.5 py-0.5 rounded">
                  <Text className="text-[8px] text-gray-500 font-bold uppercase tracking-wide">
                    Affiliate
                  </Text>
                </View>
              </View>
              <Text
                className="text-xs text-gray-700 font-medium"
                numberOfLines={1}
              >
                {post.amazon_product_name || "View product on Amazon"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-[#3B82F6] px-4 py-2 rounded-lg shadow-sm"
            onPress={() => {
              if (post.amazon_link) {
                trackLinkClick(post.id).catch(console.error);
                Linking.openURL(post.amazon_link).catch(() =>
                  Alert.alert("Error", "Unable to open the link."),
                );
              }
            }}
          >
            <Text className="text-white text-xs font-bold">Check price</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Engagement Footer */}
      <View className="flex-row items-center justify-between mt-2">
        {/* Like */}
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

        {/* Comment button + Bookmark */}
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => setShowComments((prev) => !prev)}
            className="flex-row items-center gap-1"
          >
            <MaterialCommunityIcons
              name={
                showComments
                  ? "message-reply-text"
                  : "message-reply-text-outline"
              }
              size={16}
              color={showComments ? "#2B7FFF" : "#9CA3AF"}
            />
            <Text
              className={`text-sm font-medium ${
                showComments ? "text-[#2B7FFF]" : "text-gray-500"
              }`}
            >
              {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
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

      {/* Comments Sheet (Better UX, no gaps) */}
      <CommentsSheet
        visible={showComments}
        onClose={() => setShowComments(false)}
        postId={post.id}
        initialComments={initialComments}
        onCommentPosted={() => setCommentsCount((prev) => prev + 1)}
      />

      {/* Post Action Sheet */}
      <PostOptionsSheet
        visible={showOptionsSheet}
        onClose={() => setShowOptionsSheet(false)}
        isMyPost={!!isMyPost}
        isFollowed={isFollowed}
        displayName={displayName}
        onFollowToggle={handleFollow}
        onBlock={handleBlock}
        onReport={handleReport}
        onDelete={handleDelete}
      />
    </View>
  );
};

export default React.memo(SocialPost);
