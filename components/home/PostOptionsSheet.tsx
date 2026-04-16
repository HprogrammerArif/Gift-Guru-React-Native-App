import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect } from "react";
import {
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface PostOptionsSheetProps {
  visible: boolean;
  onClose: () => void;
  isMyPost: boolean;
  isFollowed: boolean;
  displayName: string;
  onFollowToggle: () => void;
  onBlock: () => void;
  onReport: () => void;
  onDelete: () => void;
}

const PostOptionsSheet = ({
  visible,
  onClose,
  isMyPost,
  isFollowed,
  displayName,
  onFollowToggle,
  onBlock,
  onReport,
  onDelete,
}: PostOptionsSheetProps) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const context = useSharedValue(0);

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
      }
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

  const OptionItem = ({
    icon,
    title,
    subtext,
    onPress,
  }: {
    icon: any;
    title: string;
    subtext?: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={() => {
        onPress();
        animateOut();
      }}
      className="flex-row items-center px-4 py-3 active:bg-[#F2F2F2]"
    >
      <View className="mr-3 w-10 h-10 rounded-full bg-[#E4E6EB] items-center justify-center">
        <Ionicons name={icon} size={22} color="#050505" />
      </View>
      <View className="flex-1">
        <Text className="text-[16px] font-semibold text-[#050505]">
          {title}
        </Text>
        {subtext ? (
          <Text className="text-[14px] text-[#65676B] mt-0.5">{subtext}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

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

          <Animated.View
            style={[
              animatedStyle,
              { backgroundColor: "white", paddingBottom: Math.max(insets.bottom, 20) + 10 },
            ]}
            className="rounded-t-[20px] w-full"
          >
            <GestureDetector gesture={panGesture}>
              <View className="bg-white rounded-t-[20px]">
                <View className="items-center py-3 pb-3">
                  <View className="w-10 h-1 bg-[#E4E6EB] rounded-full" />
                </View>
              </View>
            </GestureDetector>

            <View className="pb-2">
              {isMyPost ? (
                <>
                  <OptionItem
                    icon="trash"
                    title="Delete post"
                    subtext="This action cannot be undone."
                    onPress={onDelete}
                  />
                </>
              ) : (
                <>
                  <OptionItem
                    icon={isFollowed ? "person-remove" : "person-add"}
                    title={isFollowed ? `Unfollow ${displayName}` : `Follow ${displayName}`}
                    subtext={isFollowed ? "Stop seeing their posts in your feed." : "See more posts from them in your feed."}
                    onPress={onFollowToggle}
                  />
                  <OptionItem
                    icon="close-circle"
                    title={`Block ${displayName}`}
                    subtext="You won't be able to see or contact each other."
                    onPress={onBlock}
                  />
                  <OptionItem
                    icon="warning"
                    title="Report post"
                    subtext="We won't let the user know who reported this."
                    onPress={onReport}
                  />
                </>
              )}
            </View>
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default PostOptionsSheet;
