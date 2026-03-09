import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

/** Animated shimmer skeleton that mimics a SocialPost card */
const PostSkeleton = () => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.85],
  });

  const S = ({
    w,
    h,
    r = 8,
  }: {
    w: number | string;
    h: number;
    r?: number;
  }) => (
    <Animated.View
      style={{
        width: w as any,
        height: h,
        borderRadius: r,
        backgroundColor: "#E5E7EB",
        opacity,
      }}
    />
  );

  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 12,
        marginBottom: 12,
        marginHorizontal: 8,
        borderRadius: 12,
      }}
    >
      {/* Header row */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <S w={40} h={40} r={20} />
        <View style={{ marginLeft: 10, gap: 6 }}>
          <S w={120} h={12} />
          <S w={80} h={10} />
        </View>
      </View>

      {/* Content lines */}
      <View style={{ gap: 6, marginBottom: 12 }}>
        <S w="100%" h={12} />
        <S w="90%" h={12} />
        <S w="70%" h={12} />
      </View>

      {/* Image placeholder */}
      <S w="100%" h={180} r={12} />

      {/* Footer */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 14,
        }}
      >
        <S w={80} h={12} />
        <S w={60} h={12} />
      </View>
    </View>
  );
};

export const PostSkeletonList = ({ count = 4 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <PostSkeleton key={i} />
    ))}
  </>
);

export default PostSkeleton;
