import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useDeletePostMutation,
  useLikePostMutation,
  useSavePostMutation,
  useFollowUserMutation,
  useTrackLinkClickMutation,
  useReportPostMutation,
  useBlockUserMutation,
} from "@/redux/features/posts/postApi";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { memo, useCallback, useState } from "react";
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import EditPostSheet from "../EditPostSheet";
import CommentsSheet from "./CommentsSheet";
import PostOptionsSheet from "./PostOptionsSheet";
import ReportPostSheet from "./ReportPostSheet";
import { ApiPost, ApiComment } from "./SocialPost";

interface ProfileSocialPostProps {
  post: ApiPost;
}

/** Format ISO date to relative/readable string */
function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const ProfileSocialPost = ({ post }: ProfileSocialPostProps) => {
  const [isFollowed, setIsFollowed] = useState(post.is_following ?? false);
  const [isLiked, setIsLiked] = useState(post.is_liked ?? false);
  const [likesCount, setLikesCount] = useState(post.likes_count ?? 0);
  const [isBookmarked, setIsBookmarked] = useState(post.is_saved ?? false);
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [showReportSheet, setShowReportSheet] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments_count ?? 0);

  const [showEditSheet, setShowEditSheet] = useState(false);

  const currentUser = useSelector(selectCurrentUser);
  const isMyPost = currentUser?.user_id === post.user?.id;

  const [likePost] = useLikePostMutation();
  const [followUser] = useFollowUserMutation();
  const [savePost] = useSavePostMutation();
  const [trackLinkClick] = useTrackLinkClickMutation();
  const [deletePost] = useDeletePostMutation();
  const [reportPost] = useReportPostMutation();
  const [blockUser] = useBlockUserMutation();

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
        Alert.alert("Error", "Failed to save post.");
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

  const handleReport = () => {
    setShowReportSheet(true);
  };

  const submitReport = async (reason: string) => {
    try {
      const res: any = await reportPost({ post: post.id, reason });
      if (res.error) throw new Error();
      setIsHidden(true);
      Toast.show({
        type: "success",
        text1: "Post reported successfully.",
        text2: "Our team will review this content shortly.",
      });
    } catch (e) {
      Toast.show({ type: "error", text1: "Failed to report post." });
    }
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
              setIsHidden(true);
              Toast.show({ type: "success", text1: "User blocked successfully." });
            } catch (e) {
              Toast.show({ type: "error", text1: "Failed to block user." });
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
            setIsHidden(true);
            Toast.show({ type: "success", text1: "Post deleted successfully." });
          } catch (e) {
            Toast.show({ type: "error", text1: "Failed to delete post." });
          }
        },
      },
    ]);
  };

  const truncateText = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + ".." : text;
  };

  const displayName =
    `${post.user?.first_name || ""} ${post.user?.last_name || ""}`.trim() ||
    post.user?.username ||
    "User";

  const postImgUri =
    post.images && post.images.length > 0 ? post.images[0].image : null;

  return (
    <View className="bg-white p-2 mb-4 border-gray-100 pb-4">
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
          <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center overflow-hidden">
            {post.profile ? (
              <Image
                source={{ uri: post.profile }}
                style={{ width: "100%", height: "100%" }}
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
                {formatDate(post.created_at)}
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

        <TouchableOpacity onPress={() => setShowOptionsSheet(true)} className="p-2">
          <Ionicons name="ellipsis-horizontal" size={20} color="#65676B" />
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
          {!expanded && post.content.length > 120 && (
            <Text className="text-[#2B7FFF] font-semibold">.. see more</Text>
          )}
        </Text>
      </TouchableOpacity>

      {/* Post Image Container */}
      {postImgUri ? (
        <View className="rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 mb-3">
          <Image
            source={{ uri: postImgUri }}
            style={{ width: "100%", height: 300 }}
            contentFit="cover"
            transition={300}
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
              <Text className="text-[10px] font-bold text-[#0071e3] mb-0.5">
                AVAILABLE ON AMAZON
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
            onPress={() => {
              if (post.amazon_link) {
                trackLinkClick(post.id).catch(console.error);
                Linking.openURL(post.amazon_link).catch(() =>
                  Alert.alert("Error", "Unable to open the link.")
                );
              }
            }}
            className="bg-[#3B82F6] px-4 py-2 rounded-lg"
          >
            <Text className="text-white text-xs font-bold">Check Price</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Engagement Footer */}
      <View className="flex-row items-center justify-between mt-3">
        {/* Like */}
        <View className="flex-row items-center">
          <TouchableOpacity
            className="flex-row items-center gap-1.5 mr-2"
            onPress={handleLike}
          >
            <Ionicons
              name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
              size={20}
              color="#3B82F6"
            />
            <Text className="text-sm text-gray-500 font-medium">Like</Text>
          </TouchableOpacity>
          <Text className="text-xs text-gray-400 font-medium">
            {likesCount} {likesCount === 1 ? "person" : "people"} liked this
          </Text>
        </View>

        {/* Comment + Bookmark */}
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => setShowComments((prev) => !prev)}
            className="flex-row items-center gap-1.5"
          >
            <MaterialCommunityIcons
              name={
                showComments
                  ? "message-reply-text"
                  : "message-reply-text-outline"
              }
              size={18}
              color={showComments ? "#2B7FFF" : "#9CA3AF"}
            />
            <Text
              className={`text-sm font-medium ${showComments ? "text-[#2B7FFF]" : "text-gray-500"}`}
            >
              {commentsCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity hitSlop={15} onPress={handleBookmark}>
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={22}
              color={isBookmarked ? "#3B82F6" : "#6B7280"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <CommentsSheet
        visible={showComments}
        onClose={() => setShowComments(false)}
        postId={post.id}
        initialComments={Array.isArray(post.comments) ? post.comments : []}
        onCommentPosted={() => setCommentsCount((prev) => prev + 1)}
      />

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
        onUpdate={() => {
          setShowOptionsSheet(false);
          setShowEditSheet(true);
        }}
      />

      <ReportPostSheet
        visible={showReportSheet}
        onClose={() => setShowReportSheet(false)}
        onSubmit={submitReport}
      />

      <EditPostSheet
        visible={showEditSheet}
        onClose={() => setShowEditSheet(false)}
        post={post}
      />
    </View>
  );
};

export default memo(ProfileSocialPost);
