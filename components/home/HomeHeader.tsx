import { RECOMMENDED_DATA } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import SectionHeader from "./SectionHeader";

const { width } = Dimensions.get("window");

interface HomeHeaderProps {
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onSearch?: (text: string) => void;
  value?: string;
}

const HomeHeader = ({
  onMenuPress,
  onNotificationPress,
  onSearch,
  value,
}: HomeHeaderProps) => {
  const itemWidth = width / 2.5; // Shows ~2.5 items, adjust for 4 items use width / 4.2

  return (
    <View className="bg-[#FF4B3A] ">
      <View className=" px-5 pt-4 pb-6 ">
        <View className="flex-row items-center justify-between gap-4">
          {/* Menu Icon */}
          <TouchableOpacity onPress={onMenuPress} activeOpacity={0.7}>
            <Ionicons name="menu-outline" size={28} color="white" />
          </TouchableOpacity>

          <View className="flex-1">
            <View className="relative">
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onSearch}
                placeholder="Search products..."
                placeholderTextColor="#9CA3AF"
                className="bg-white rounded-full px-5 py-3 text-base text-black pr-12 shadow-sm"
                style={{ height: 48 }}
              />

              <View className="absolute right-4 top-0 bottom-0 justify-center">
                <Ionicons name="search-outline" size={20} color="#9CA3AF" />
              </View>
            </View>
          </View>

          {/* Notification Icon */}
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            activeOpacity={0.7}
          >
            <View className="relative">
              <Ionicons name="notifications-outline" size={28} color="white" />
              <View className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border-2 border-[#FF4B3A]" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recommended Section */}
      <View>
        <SectionHeader
          title="Recommended"
          onSeeAll={() => {}}
          icon="flame-sharp"
          iconColor="white"
        />

        <View className="mt-2">
          <Carousel
            loop
            width={width}
            height={170}
            autoPlay={true}
            data={RECOMMENDED_DATA}
            windowSize={3}
            pagingEnabled={true}
            scrollAnimationDuration={1500}
            renderItem={({ item }) => (
              <View style={{ width: itemWidth }} className="px-1">
                <TouchableOpacity
                  activeOpacity={0.9}
                  className="bg-white/20 rounded-[20px] overflow-hidden border border-white/10"
                >
                  <View className="w-full h-24 overflow-hidden">
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                      transition={300}
                    />
                  </View>
                  <View className="p-2">
                    <Text
                      className="text-white text-[11px] font-bold"
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                      <Text className="text-white/70 text-[9px] font-medium">
                        {item.likes}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
