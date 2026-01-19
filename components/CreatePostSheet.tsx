import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

interface CreatePostSheetProps {
  visible: boolean;
  onClose: () => void;
}

const categories = [
  { id: 1, name: "All" },
  { id: 2, name: "Birthday" },
  { id: 3, name: "Anniversary" },
  { id: 4, name: "Graduation" },
  { id: 5, name: "Wedding" },
];

const occasions = [
  { id: 1, name: "All" },
  { id: 2, name: "Birthday" },
  { id: 3, name: "Anniversary" },
  { id: 4, name: "Graduation" },
  { id: 5, name: "Wedding" },
];

const CreatePostSheet = ({ visible, onClose }: CreatePostSheetProps) => {
  const [targetCustomer, setTargetCustomer] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [showOccasionsDropdown, setShowOccasionsDropdown] = useState(false);
  const [occasion, setOccasion] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amazonLink, setAmazonLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUploadPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleCreatePost = async () => {
    // Basic Validation
    if (!title.trim() || !description.trim() || !category || !occasion) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Simulate API Call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Your post has been shared with the community!");

      // Cleanup and Close
      setTitle("");
      setDescription("");
      setAmazonLink("");
      setCategory(null);
      setOccasion(null);
      setSelectedImage(null);
      onClose();
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="absolute inset-0" />
        </TouchableWithoutFeedback>

        <View className="bg-white rounded-t-3xl h-[90%] w-full overflow-hidden">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-gray-50 bg-white z-10">
            <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-900">
              Create new post
            </Text>
            <View className="w-6" />
          </View>

          <KeyboardAwareScrollView
            bottomOffset={50}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            className="flex-1"
          >
            {/* Title Input */}
            <TextInput
              placeholder="Title*"
              value={title}
              onChangeText={setTitle}
              className="w-full h-12 px-4 py-2 bg-gray-50 rounded-xl text-gray-700 text-base mb-4 border border-gray-100"
              placeholderTextColor="#9CA3AF"
            />
            {/* Text Input */}
            <TextInput
              multiline
              placeholder="What's on your mind? Share a gift idea, a wish, or a deal ...*"
              value={description}
              onChangeText={setDescription}
              className="w-full h-24 p-4 bg-gray-50 rounded-xl text-gray-700 text-base mb-4 border border-gray-100"
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />

            {/* Upload Photo Button or Selected Image */}
            {selectedImage ? (
              <View className="mb-6 relative">
                <Image
                  source={{ uri: selectedImage }}
                  className="w-full h-48 rounded-xl bg-gray-100"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleUploadPhoto}
                className="w-full py-3 border border-[#2B7FFF] rounded-xl flex-row items-center justify-center gap-2 mb-6 border-dashed bg-[#EFF6FF]"
              >
                <Ionicons name="camera-outline" size={20} color="#2B7FFF" />
                <Text className="text-[#2B7FFF] font-semibold">
                  Upload photo
                </Text>
              </TouchableOpacity>
            )}

            {/* Category Dropdown */}
            <View className="mb-4 relative z-50">
              <Text className="text-sm font-bold text-gray-900 mb-2">
                Category*
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowOccasionsDropdown(false);
                }}
                className="flex-row items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
              >
                <Text
                  className={`text-base ${
                    category ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {category || "Select a category"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              {showCategoryDropdown && (
                <View className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg mt-1 z-50">
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={(e) => {
                        e.preventDefault();
                        setCategory(cat.name);
                        setShowCategoryDropdown(false);
                        Haptics.selectionAsync();
                      }}
                      className="px-4 py-3 border-b border-gray-50 last:border-b-0"
                    >
                      <Text
                        className={`text-base ${
                          category === cat.name
                            ? "text-[#2B7FFF] font-semibold"
                            : "text-gray-900"
                        }`}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Occasions Dropdown */}
            <View className="mb-4 relative z-40">
              <Text className="text-sm font-bold text-gray-900 mb-2">
                Occasions*
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  setShowOccasionsDropdown(!showOccasionsDropdown);
                  setShowCategoryDropdown(false);
                }}
                className="flex-row items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
              >
                <Text
                  className={`text-base ${
                    occasion ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {occasion || "Select Occasions"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              {showOccasionsDropdown && (
                <View className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg mt-1 z-50">
                  {occasions.map((occ) => (
                    <TouchableOpacity
                      key={occ.id}
                      onPress={(e) => {
                        e.preventDefault();
                        setOccasion(occ.name);
                        setShowOccasionsDropdown(false);
                        Haptics.selectionAsync();
                      }}
                      className="px-4 py-3 border-b border-gray-50 last:border-b-0"
                    >
                      <Text
                        className={`text-base ${
                          occasion === occ.name
                            ? "text-[#2B7FFF] font-semibold"
                            : "text-gray-900"
                        }`}
                      >
                        {occ.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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
                      targetCustomer === type ? "bg-[#DBEAFE]" : "bg-[#FAFAFA]"
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
                  value={amazonLink}
                  onChangeText={setAmazonLink}
                  className="flex-1 ml-2 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  keyboardType="url"
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
            <TouchableOpacity
              onPress={handleCreatePost}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl items-center shadow-sm ${
                isSubmitting ? "bg-[#2B7FFF]/70" : "bg-[#2B7FFF]"
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Share with community
                </Text>
              )}
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CreatePostSheet;
