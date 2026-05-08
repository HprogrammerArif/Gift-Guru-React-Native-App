import {
    useGetCategoriesQuery,
    useGetOccasionsQuery,
    useUpdatePostMutation,
} from "@/redux/features/posts/postApi";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
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
import { ApiPost } from "./home/SocialPost";

interface EditPostSheetProps {
  visible: boolean;
  onClose: () => void;
  post: ApiPost;
}

interface ListOption {
  id: number | string;
  name: string;
}

const EditPostSheet = ({ visible, onClose, post }: EditPostSheetProps) => {
  const [targetCustomer, setTargetCustomer] = useState(
    post.target_category || "All",
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(
    post.images?.[0]?.image || post.amazon_product_image_url || null,
  );
  const [selectedImageAsset, setSelectedImageAsset] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(
    post.category?.id ? String(post.category.id) : null,
  );
  const [categoryName, setCategoryName] = useState<string | null>(
    post.category?.name || null,
  );

  const [showOccasionsDropdown, setShowOccasionsDropdown] = useState(false);
  const [occasionId, setOccasionId] = useState<string | null>(
    post.occasion?.id ? String(post.occasion.id) : null,
  );
  const [occasionName, setOccasionName] = useState<string | null>(
    post.occasion?.name || null,
  );

  // Form State
  const [title, setTitle] = useState(post.title || "");
  const [description, setDescription] = useState(post.content || "");
  const [amazonLink, setAmazonLink] = useState(post.amazon_link || "");

  // Reset local state when post changes or modal opens
  useEffect(() => {
    if (visible && post) {
      setTitle(post.title || "");
      setDescription(post.content || "");
      setAmazonLink(post.amazon_link || "");
      setCategoryId(post.category?.id ? String(post.category.id) : null);
      setCategoryName(post.category?.name || null);
      setOccasionId(post.occasion?.id ? String(post.occasion.id) : null);
      setOccasionName(post.occasion?.name || null);
      setTargetCustomer(post.target_category || "All");
      setSelectedImage(
        post.images?.[0]?.image || post.amazon_product_image_url || null,
      );
      setSelectedImageAsset(null);
    }
  }, [visible, post]);

  // API hooks
  const [updatePost, { isLoading: isSubmitting }] = useUpdatePostMutation();
  const { data: categoriesData } = useGetCategoriesQuery(undefined, {
    skip: !visible,
  });
  const { data: occasionsData } = useGetOccasionsQuery(undefined, {
    skip: !visible,
  });

  const categories: ListOption[] = Array.isArray(categoriesData)
    ? categoriesData
    : [];
  const occasions: ListOption[] = Array.isArray(occasionsData)
    ? occasionsData
    : [];

  const handleUploadPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
     
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setSelectedImageAsset(result.assets[0]);
    }
  };

  const handleUpdatePost = async () => {
    if (!title.trim() || !description.trim() || !categoryId || !occasionId) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", description.trim());
      formData.append("category", categoryId);
      formData.append("occasion", occasionId);
      formData.append("amazon_link", amazonLink.trim());
      formData.append("target_category", targetCustomer);

      if (selectedImageAsset) {
        const uri = selectedImageAsset.uri;
        const filename = uri.split("/").pop() || "photo.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("images", {
          uri,
          name: filename,
          type,
        } as any);
      }

      const response: any = await updatePost({ postId: post.id, formData });

      if (response?.data) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success 🎉", "Post updated successfully!");
        onClose();
      } else if (response?.error) {
        Alert.alert("Update Failed", "Failed to update post.");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-gray-50 bg-white z-10">
            <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-900">Update post</Text>
            <View className="w-6" />
          </View>

          <KeyboardAwareScrollView
            bottomOffset={50}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            className="flex-1"
          >
            <TextInput
              placeholder="Title*"
              value={title}
              onChangeText={setTitle}
              className="w-full h-12 px-4 py-2 bg-gray-50 rounded-xl text-gray-700 text-base mb-4 border border-gray-100"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              multiline
              placeholder="Description*"
              value={description}
              onChangeText={setDescription}
              className="w-full h-24 p-4 bg-gray-50 rounded-xl text-gray-700 text-base mb-4 border border-gray-100"
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />

            {selectedImage ? (
              <View className="mb-6 relative">
                <Image
                  source={{ uri: selectedImage }}
                  className="w-full h-48 rounded-xl bg-gray-100"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => {
                    setSelectedImage(null);
                    setSelectedImageAsset(null);
                  }}
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
                  Update photo
                </Text>
              </TouchableOpacity>
            )}

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
                  className={`text-base ${categoryName ? "text-gray-900" : "text-gray-400"}`}
                >
                  {categoryName || "Select a category"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {showCategoryDropdown && (
                <View className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg mt-1 z-50">
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => {
                        setCategoryId(String(cat.id));
                        setCategoryName(cat.name);
                        setShowCategoryDropdown(false);
                        Haptics.selectionAsync();
                      }}
                      className="px-4 py-3 border-b border-gray-50"
                    >
                      <Text className="text-base text-gray-900">
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

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
                  className={`text-base ${occasionName ? "text-gray-900" : "text-gray-400"}`}
                >
                  {occasionName || "Select Occasions"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {showOccasionsDropdown && (
                <View className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg mt-1 z-50">
                  {occasions.map((occ) => (
                    <TouchableOpacity
                      key={occ.id}
                      onPress={() => {
                        setOccasionId(String(occ.id));
                        setOccasionName(occ.name);
                        setShowOccasionsDropdown(false);
                        Haptics.selectionAsync();
                      }}
                      className="px-4 py-3 border-b border-gray-50"
                    >
                      <Text className="text-base text-gray-900">
                        {occ.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-sm font-bold text-gray-900 mb-2">
                Target Customer*
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {["All", "Men", "Women", "Kids", "Teens"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setTargetCustomer(type)}
                    className={`px-6 py-2 rounded-full ${targetCustomer === type ? "bg-[#DBEAFE]" : "bg-[#FAFAFA]"}`}
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

            <View className="mb-6">
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
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleUpdatePost}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl items-center shadow-sm ${isSubmitting ? "bg-[#2B7FFF]/70" : "bg-[#2B7FFF]"}`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Update post
                </Text>
              )}
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default EditPostSheet;
