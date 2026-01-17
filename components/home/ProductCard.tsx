import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  image: string;
  title: string;
  subText: string;
  variant?: "recommended" | "trending";
}

const ProductCard = ({
  image,
  title,
  subText,
  variant = "recommended",
}: ProductCardProps) => {
  const isRecommended = variant === "recommended";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className={`mr-4 ${isRecommended ? "w-36" : "w-44"}`}
    >
      <View
        className={`rounded-3xl overflow-hidden bg-white ${isRecommended ? "p-0 shadow-sm" : "shadow-md"}`}
      >
        <Image
          source={{ uri: image }}
          className={`${isRecommended ? "h-32 w-full" : "h-40 w-full"}`}
          contentFit="cover"
          transition={300}
        />
        <View className="p-3">
          <Text
            numberOfLines={1}
            className={`font-bold ${isRecommended ? "text-sm text-gray-800" : "text-base text-gray-900"}`}
          >
            {title}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">{subText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
