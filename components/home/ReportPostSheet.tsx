import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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

const REPORT_REASONS = [
  "Spam",
  "Harassment",
  "Inappropriate content",
  "Hate speech",
  "False information",
  "Other"
];

interface ReportPostSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const ReportPostSheet = ({
  visible,
  onClose,
  onSubmit,
}: ReportPostSheetProps) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const context = useSharedValue(0);

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState("");

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
        runOnJS(setSelectedReason)(null);
        runOnJS(setOtherReason)("");
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

  const handleSubmit = () => {
    if (selectedReason === "Other") {
      if (!otherReason.trim()) return;
      onSubmit(otherReason.trim());
    } else if (selectedReason) {
      onSubmit(selectedReason);
    }
    animateOut();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
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
              className="rounded-t-[20px] w-full max-h-[80%]"
            >
              <GestureDetector gesture={panGesture}>
                <View className="bg-white rounded-t-[20px]">
                  <View className="items-center py-3 pb-3">
                    <View className="w-10 h-1 bg-[#E4E6EB] rounded-full" />
                  </View>
                  <View className="px-4 pb-3 flex-row items-center justify-between border-b border-gray-100">
                    <Text className="text-lg font-bold text-black">Report Post</Text>
                    <TouchableOpacity onPress={animateOut}>
                      <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              </GestureDetector>

              <ScrollView className="px-4 py-2" keyboardShouldPersistTaps="handled">
                <Text className="text-gray-600 mb-4 mt-2 font-medium">
                  Why are you reporting this post? Your report is anonymous.
                </Text>
                
                {REPORT_REASONS.map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    onPress={() => setSelectedReason(reason)}
                    className={`flex-row items-center justify-between py-3 px-4 rounded-xl mb-2 ${
                      selectedReason === reason ? 'bg-[#EFF6FF] border border-[#2B7FFF]' : 'bg-gray-50 border border-transparent'
                    }`}
                  >
                    <Text className={`text-base ${selectedReason === reason ? 'text-[#2B7FFF] font-semibold' : 'text-gray-800'}`}>
                      {reason}
                    </Text>
                    <View className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedReason === reason ? 'border-[#2B7FFF]' : 'border-gray-300'}`}>
                      {selectedReason === reason && <View className="w-2.5 h-2.5 rounded-full bg-[#2B7FFF]" />}
                    </View>
                  </TouchableOpacity>
                ))}

                {selectedReason === "Other" && (
                  <View className="mt-2 mb-4">
                    <TextInput
                      className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-base text-black"
                      placeholder="Please specify the reason..."
                      placeholderTextColor="#9CA3AF"
                      value={otherReason}
                      onChangeText={setOtherReason}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>
                )}

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={!selectedReason || (selectedReason === "Other" && !otherReason.trim())}
                  className={`mt-4 mb-2 py-3.5 rounded-xl items-center ${
                    !selectedReason || (selectedReason === "Other" && !otherReason.trim())
                      ? 'bg-gray-200'
                      : 'bg-[#2B7FFF]'
                  }`}
                >
                  <Text className={`text-base font-bold ${
                    !selectedReason || (selectedReason === "Other" && !otherReason.trim())
                      ? 'text-gray-400'
                      : 'text-white'
                  }`}>
                    Submit Report
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default ReportPostSheet;
