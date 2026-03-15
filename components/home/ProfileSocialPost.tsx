import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useDeletePostMutation,
  useLikePostMutation,
  useSavePostMutation,
} from "@/redux/features/posts/postApi";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { memo, useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import EditPostSheet from "../EditPostSheet";
import { ApiPost } from "./SocialPost";

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
  const [expanded, setExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(post.is_liked ?? false);
  const [likesCount, setLikesCount] = useState(post.likes_count ?? 0);
  const [isBookmarked, setIsBookmarked] = useState(post.is_saved ?? false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments_count ?? 0);

  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const iconRef = useRef<View>(null);

  const currentUser = useSelector(selectCurrentUser);
  const isMyPost = currentUser?.user_id === post.user?.id;

  const [likePost] = useLikePostMutation();
  const [savePost] = useSavePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const handleDelete = async () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res: any = await deletePost(post.id);
            if (res?.data) {
              setShowMenu(false);
            } else if (res?.error) {
              Alert.alert("Error", "Failed to delete post.");
            }
          } catch {
            Alert.alert("Error", "Something went wrong.");
          }
        },
      },
    ]);
  };

  const handleLike = useCallback(async () => {
    const previousLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!previousLiked);
    setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      const res: any = await likePost(post.id);
      if (res?.error) {
        setIsLiked(previousLiked);
        setLikesCount(previousCount);
        Alert.alert("Error", "Failed to like post.");
      }
    } catch {
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
    }
  }, [isLiked, likesCount, post.id, likePost]);

  const handleBookmark = useCallback(async () => {
    const previousSaved = isBookmarked;
    setIsBookmarked(!previousSaved);
    try {
      const res: any = await savePost(post.id);
      if (res?.error) {
        setIsBookmarked(previousSaved);
        Alert.alert("Error", "Failed to save post.");
      }
    } catch {
      setIsBookmarked(previousSaved);
    }
  }, [isBookmarked, post.id, savePost]);

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
        </TouchableOpacity>

        {/* Three dot icon - Only for owner */}
        {isMyPost && (
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
                <View className="flex-1 bg-black/5">
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
                        setShowEditSheet(true);
                      }}
                      className="flex-row items-center gap-2 px-4 py-3 border-b border-gray-50"
                    >
                      <Ionicons
                        name="create-outline"
                        size={16}
                        color="#374151"
                      />
                      <Text className="text-gray-700 font-medium text-sm">
                        Update
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleDelete}
                      disabled={isDeleting}
                      className="flex-row items-center gap-2 px-4 py-3"
                    >
                      {isDeleting ? (
                        <ActivityIndicator size="small" color="#EF4444" />
                      ) : (
                        <>
                          <Ionicons
                            name="trash-outline"
                            size={16}
                            color="#EF4444"
                          />
                          <Text className="text-red-500 font-medium text-sm">
                            Delete
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        )}
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
            onPress={() =>
              post.amazon_link && Linking.openURL(post.amazon_link)
            }
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

      {/* Edit Form */}
      <EditPostSheet
        visible={showEditSheet}
        onClose={() => setShowEditSheet(false)}
        post={post}
      />
    </View>
  );
};

export default memo(ProfileSocialPost);
