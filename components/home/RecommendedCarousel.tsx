import { ApiPost } from "@/components/home/SocialPost";
import { useGetRecommendedPostsQuery } from "@/redux/features/posts/postApi";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SectionHeader from "./SectionHeader";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 3;

/** Pick the best display image from a post */
function getPostImage(post: ApiPost): string | null {
  if (post.images && post.images.length > 0) return post.images[0].image;
  if (post.amazon_product_image_url) return post.amazon_product_image_url;
  return null;
}

const RecommendedCarousel = () => {
  const { data, isLoading } = useGetRecommendedPostsQuery(undefined);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const posts: ApiPost[] = useMemo(
    () => (Array.isArray(data) ? data : ((data as any)?.results ?? [])),
    [data],
  );

  // Simulate infinite scroll by repeating items (only if we have data)
  const infiniteData = useMemo(
    () =>
      posts.length > 0
        ? Array.from({ length: 50 })
            .flatMap(() => posts)
            .map((p, i) => ({
              ...p,
              _key: `${p.id}-${i}`,
            }))
        : [],
    [posts],
  );

  useEffect(() => {
    if (infiniteData.length === 0) return;
    const interval = setInterval(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= infiniteData.length) {
        flatListRef.current?.scrollToIndex({ index: 0, animated: false });
        setCurrentIndex(0);
        return;
      }
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
        viewOffset: 0,
      });
      setCurrentIndex(nextIndex);
    }, 2500);
    return () => clearInterval(interval);
  }, [currentIndex, infiniteData.length]);

  return (
    <LinearGradient
      colors={["#FF4B3A", "#FF8C42"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SectionHeader
        title="Recommended"
        onSeeAll={() => router.push("/recommended")}
        icon="flame-sharp"
        iconColor="white"
        textColor="text-white"
      />

      <View className="mt-2 h-[155px]">
        {isLoading || infiniteData.length === 0 ? (
          // Skeleton placeholders while loading
          <View className="flex-row px-1">
            {[0, 1, 2].map((i) => (
              <View key={i} style={{ width: CARD_WIDTH }} className="px-1">
                <View className="rounded-[20px] overflow-hidden bg-white/20 w-full h-[135px]" />
              </View>
            ))}
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={infiniteData}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH}
            decelerationRate="fast"
            keyExtractor={(item) => item._key}
            getItemLayout={(_data, index) => ({
              length: CARD_WIDTH,
              offset: CARD_WIDTH * index,
              index,
            })}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            initialScrollIndex={0}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                });
              }, 500);
            }}
            renderItem={({ item }) => {
              const imageUri = getPostImage(item);
              return (
                <View style={{ width: CARD_WIDTH }} className="px-1 h-full">
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      if (item.amazon_link) {
                        Linking.openURL(item.amazon_link);
                      }
                    }}
                    className="bg-black/10 rounded-[15px] overflow-hidden border border-black/10 w-full h-[135px]"
                  >
                    <View className="w-full h-24 overflow-hidden bg-white/20">
                      {imageUri ? (
                        <Image
                          source={{ uri: imageUri }}
                          style={{ width: "100%", height: "100%" }}
                          contentFit="cover"
                          transition={300}
                        />
                      ) : (
                        <View className="flex-1 items-center justify-center">
                          <Text className="text-white/50 text-xs">📦</Text>
                        </View>
                      )}
                    </View>
                    <View className="p-2 flex-1 justify-between">
                      <Text
                        className="text-white text-[11px] font-bold"
                        numberOfLines={1}
                      >
                        {item.amazon_product_name || item.content}
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <View className="w-1 h-1 rounded-full bg-white/80" />
                        <Text className="text-white/80 text-[9px] font-medium">
                          {item.likes_count} likes
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(
                e.nativeEvent.contentOffset.x / CARD_WIDTH,
              );
              setCurrentIndex(newIndex);
            }}
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default React.memo(RecommendedCarousel);
