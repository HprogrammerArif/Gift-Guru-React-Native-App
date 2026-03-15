import { useSubmitCommentMutation } from "@/redux/features/posts/postApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ApiComment } from "./SocialPost";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// --- Optimized FB Comment Item ---
const CommentItem = ({ comment }: { comment: ApiComment; isLast: boolean }) => {
  const name =
    `${comment.user?.first_name || ""} ${comment.user?.last_name || ""}`.trim() ||
    comment.user?.username ||
    "User";

  const shortDate = new Date(comment.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <View className="flex-row items-start gap-2.5 py-2.5">
      <View className="w-9 h-9 rounded-full bg-gray-200 items-center justify-center shrink-0">
        <Ionicons name="person" size={20} color="#65676B" />
      </View>
      <View className="flex-1">
        <View className="bg-[#F0F2F5] rounded-[18px] px-3 py-2 self-start max-w-[95%]">
          <Text className="text-[14px] font-bold text-[#050505] mb-0.5">
            {name}
          </Text>
          <Text className="text-[14px] text-[#050505] leading-[18px]">
            {comment.content}
          </Text>
        </View>
        <View className="flex-row items-center gap-4 mt-1 ml-1.5">
          <Text className="text-[12px] text-[#65676B] font-medium">
            {shortDate}
          </Text>
          <TouchableOpacity hitSlop={10}>
            <Text className="text-[12px] font-bold text-[#65676B]">Like</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={10}>
            <Text className="text-[12px] font-bold text-[#65676B]">Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

interface CommentsSheetProps {
  visible: boolean;
  onClose: () => void;
  postId: number;
  initialComments: ApiComment[];
  onCommentPosted: (newComment: ApiComment) => void;
}

const CommentsSheet = ({
  visible,
  onClose,
  postId,
  initialComments,
  onCommentPosted,
}: CommentsSheetProps) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<ApiComment[]>(initialComments);
  const inputRef = useRef<TextInput>(null);
  const [submitComment, { isLoading: isPosting }] = useSubmitCommentMutation();

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const context = useSharedValue(0);

  // --- FASTER & SMOOTHER ANIMATION (Timing based like FB native) ---
  const animateIn = useCallback(() => {
    translateY.value = withTiming(0, {
      duration: 250,
      easing: Easing.out(Easing.quad),
    });
    backdropOpacity.value = withTiming(1, { duration: 250 });
  }, [translateY, backdropOpacity]);

  const animateOut = useCallback(() => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(
      SCREEN_HEIGHT,
      {
        duration: 250,
        easing: Easing.in(Easing.quad),
      },
      () => {
        runOnJS(onClose)();
      },
    );
  }, [translateY, backdropOpacity, onClose]);

  useEffect(() => {
    if (visible) {
      animateIn();
    }
  }, [visible, animateIn]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = context.value + event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 150 || event.velocityY > 600) {
        runOnJS(animateOut)();
      } else {
        translateY.value = withSpring(0, { damping: 25, stiffness: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleSubmit = async () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    try {
      const res: any = await submitComment({ post: postId, content: trimmed });
      if (res?.data) {
        const newComment: ApiComment = res.data;
        setComments((prev) => [newComment, ...prev]);
        setCommentText("");
        inputRef.current?.blur();
        onCommentPosted(newComment);
      } else {
        Alert.alert("Error", "Failed to post comment.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 justify-end">
          <TouchableWithoutFeedback onPress={animateOut}>
            <Animated.View
              style={backdropStyle}
              className="absolute inset-0 bg-black/50"
            />
          </TouchableWithoutFeedback>

          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                animatedStyle,
                { height: SCREEN_HEIGHT * 0.9, backgroundColor: "white" },
              ]}
              className="rounded-t-[14px] w-full"
            >
              {/* Handle Bar */}
              <View className="items-center py-2">
                <View className="w-10 h-1.5 bg-[#E4E6EB] rounded-full" />
              </View>

              {/* FB Style Header */}
              <View className="px-4 pb-3 flex-row items-center border-b border-[#E4E6EB]">
                <View className="flex-row items-center flex-1">
                  <Ionicons name="chatbubble" size={12} color="#65676B" />
                  <Text className="ml-1 text-[13px] text-[#65676B] font-medium">
                    {comments.length} comments
                  </Text>
                </View>
                <TouchableOpacity onPress={animateOut} className="px-2 py-1">
                  <Ionicons name="close-circle" size={24} color="#BEC2C9" />
                </TouchableOpacity>
              </View>

              <View className="flex-1">
                <KeyboardAwareScrollView
                  bottomOffset={0}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 12,
                    paddingBottom: 150, // Extra space for sticky input
                  }}
                  className="flex-1"
                >
                  {comments.length === 0 ? (
                    <View className="py-20 items-center">
                      <Ionicons
                        name="chatbubbles-outline"
                        size={64}
                        color="#BEC2C9"
                      />
                      <Text className="text-[#65676B] mt-4 text-base font-semibold">
                        Be the first to comment
                      </Text>
                    </View>
                  ) : (
                    comments.map((c, index) => (
                      <CommentItem
                        key={c.id}
                        comment={c}
                        isLast={index === comments.length - 1}
                      />
                    ))
                  )}
                </KeyboardAwareScrollView>
              </View>

              {/* STICKY INPUT BAR (Anchored to keyboard) */}
              <KeyboardStickyView offset={{ opened: 0, closed: 0 }}>
                <View className="bg-white border-t border-[#E4E6EB] px-4 py-3 pb-8">
                  <View className="flex-row items-center gap-2.5">
                    <View className="w-9 h-9 rounded-full bg-[#E4E6EB] items-center justify-center">
                      <Ionicons name="person" size={20} color="#65676B" />
                    </View>
                    <View className="flex-1 flex-row items-center bg-[#F0F2F5] rounded-full px-4 py-2">
                      <TextInput
                        ref={inputRef}
                        placeholder="Write a comment..."
                        placeholderTextColor="#65676B"
                        value={commentText}
                        onChangeText={setCommentText}
                        className="flex-1 text-[15px] text-[#050505] py-0.5"
                        multiline
                      />
                      <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={!commentText.trim() || isPosting}
                      >
                        <Ionicons
                          name="send"
                          size={22}
                          color={commentText.trim() ? "#0566FF" : "#B0B3B8"}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </KeyboardStickyView>

              {/* This extra view ensures the background stays solid when lifted by keyboard */}
              <View
                style={{
                  position: "absolute",
                  bottom: -1000,
                  left: 0,
                  right: 0,
                  height: 1000,
                  backgroundColor: "white",
                }}
              />

              {/* <KeyboardToolbar /> */}
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default CommentsSheet;
