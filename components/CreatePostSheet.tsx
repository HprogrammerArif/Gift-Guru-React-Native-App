import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface CreatePostSheetProps {
  visible: boolean;
  onClose: () => void;
}

const CreatePostSheet = ({ visible, onClose }: CreatePostSheetProps) => {
  const [targetCustomer, setTargetCustomer] = useState("All");

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="flex-1 bg-black/50 justify-end">
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View className="bg-white rounded-t-3xl h-[85%] w-full">
                {/* Header */}
                <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
                  <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={24} color="#1F2937" />
                  </TouchableOpacity>
                  <Text className="text-lg font-bold text-gray-900">
                    Create new post
                  </Text>
                  <View className="w-6" />
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                >
                  {/* Text Input */}
                  <TextInput
                    multiline
                    placeholder="What's on your mind? Share a gift idea, a wish, or a deal ..."
                    className="w-full h-32 p-4 bg-gray-50 rounded-xl text-gray-700 text-base mb-4 border border-gray-100"
                    textAlignVertical="top"
                    placeholderTextColor="#9CA3AF"
                  />

                  {/* Upload Photo Button */}
                  <TouchableOpacity className="w-full py-3 border border-[#2B7FFF] rounded-xl flex-row items-center justify-center gap-2 mb-6 border-dashed bg-[#EFF6FF]">
                    <Ionicons name="camera-outline" size={20} color="#2B7FFF" />
                    <Text className="text-[#2B7FFF] font-semibold">
                      Upload photo
                    </Text>
                  </TouchableOpacity>

                  {/* Category Dropdown */}
                  <View className="mb-4">
                    <Text className="text-sm font-bold text-gray-900 mb-2">
                      Category*
                    </Text>
                    <TouchableOpacity className="flex-row items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                      <Text className="text-gray-400">Select a category</Text>
                      <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  {/* Occasions Dropdown */}
                  <View className="mb-4">
                    <Text className="text-sm font-bold text-gray-900 mb-2">
                      Occasions*
                    </Text>
                    <TouchableOpacity className="flex-row items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                      <Text className="text-gray-400">Select Occasions</Text>
                      <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  {/* Target Customer */}
                  <View className="mb-4">
                    <Text className="text-sm font-bold text-gray-900 mb-2">
                      Target Customer*
                    </Text>
                    <View className="flex-row gap-3">
                      {["All", "Men", "Women", "Kids"].map((type) => (
                        <TouchableOpacity
                          key={type}
                          onPress={() => setTargetCustomer(type)}
                          className={`px-6 py-2 rounded-full ${
                            targetCustomer === type
                              ? "bg-[#DAE8FC]"
                              : "bg-gray-100"
                          }`}
                        >
                          <Text
                            className={
                              targetCustomer === type
                                ? "text-[#2B7FFF] font-semibold"
                                : "text-gray-500"
                            }
                          >
                            {type}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Amazon Link */}
                  <View className="mb-2">
                    <Text className="text-sm font-bold text-gray-900 mb-2">
                      Amazon Link
                    </Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                      <Ionicons name="link-outline" size={20} color="#9CA3AF" />
                      <TextInput
                        placeholder="Amazon product link (optional)"
                        className="flex-1 ml-2 text-gray-900"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </View>

                  {/* Warning Box */}
                  <View className="bg-[#FFF8DD] p-3 rounded-lg flex-row gap-2 mb-6">
                    <Ionicons
                      name="warning"
                      size={16}
                      color="#B48E2D"
                      style={{ marginTop: 2 }}
                    />
                    <Text className="text-[#B48E2D] text-xs flex-1 font-medium leading-5">
                      All Amazon links will be converted to site affiliate links
                    </Text>
                  </View>

                  {/* Share Button */}
                  <TouchableOpacity className="w-full bg-[#2B7FFF] py-4 rounded-xl items-center shadow-sm">
                    <Text className="text-white font-bold text-base">
                      Share with community
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreatePostSheet;
