import { RECOMMENDED_DATA_TYPE } from "@/constants";
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SectionHeader from "./SectionHeader";
const { width } = Dimensions.get("window");

const Recommended = ({
  RECOMMENDED_DATA,
}: {
  RECOMMENDED_DATA: RECOMMENDED_DATA_TYPE;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const CARD_WIDTH = width / 3;

  // Create a large dataset for "infinite" scrolling simulation
  // This is a common high-performance pattern for React Native carousels
  const infiniteData = React.useMemo(
    () => Array.from({ length: 1000 }).flatMap(() => RECOMMENDED_DATA),
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = currentIndex + 1;
      // If we get huge, silently reset. But 1000 * 6 items is plenty for hours.
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
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex, infiniteData.length]);

  return (
    <View>
      {/* Recommended Section */}
      <SectionHeader
        title="Recommended"
        onSeeAll={() => {}}
        icon="flame-sharp"
        iconColor="white"
      />

      <View className="mt-2 h-[155px]">
        <FlatList
          ref={flatListRef}
          data={infiniteData}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          decelerationRate="fast"
          keyExtractor={(item, index) => `${item.id}-${index}`}
          getItemLayout={(data, index) => ({
            length: CARD_WIDTH,
            offset: CARD_WIDTH * index,
            index,
          })}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialScrollIndex={0}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
          renderItem={({ item }) => (
            <View style={{ width: CARD_WIDTH }} className="px-1 h-full">
              <TouchableOpacity
                activeOpacity={0.9}
                className="bg-white/20 rounded-[20px] overflow-hidden border border-white/10 w-full  h-[135px]"
              >
                <View className="w-full h-24 overflow-hidden bg-white/20">
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                    transition={300}
                  />
                </View>
                <View className="p-2 flex-1 justify-between">
                  <Text
                    className="text-white text-[11px] font-bold"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <View className="w-1 h-1 rounded-full bg-white/80" />
                    <Text className="text-white/80 text-[9px] font-medium">
                      {item.likes}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(
              e.nativeEvent.contentOffset.x / CARD_WIDTH
            );
            setCurrentIndex(newIndex);
          }}
        />
      </View>
    </View>
  );
};

export default Recommended;
