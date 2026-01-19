import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BarChart } from "react-native-gifted-charts";

const StatCard = ({
  label,
  value,
  icon,
  iconColor,
  iconBg,
}: {
  label: string;
  value: string;
  icon: any;
  iconColor: string;
  iconBg: string;
}) => (
  <View className="bg-white rounded-3xl p-5 mb-4 border border-[#f0ebeb] flex-row items-center justify-between shadow-sm shadow-black/5">
    <View>
      <Text
        style={{ fontFamily: "QuickSand-Bold" }}
        className="text-[10px] text-gray-400 uppercase tracking-widest mb-2"
      >
        {label}
      </Text>
      <Text
        style={{ fontFamily: "QuickSand-Bold" }}
        className="text-2xl text-[#1F2937]"
      >
        {value}
      </Text>
    </View>
    <View
      className={`w-14 h-14 rounded-2xl ${iconBg} items-center justify-center`}
    >
      {icon}
    </View>
  </View>
);

const TopItemRow = ({
  image,
  title,
  clicks,
  isLast,
}: {
  image: string;
  title: string;
  clicks: number;
  isLast?: boolean;
}) => (
  <View
    className={`flex-row items-center gap-4 py-3 ${!isLast ? "border-b border-gray-50" : ""}`}
  >
    <Image
      source={{ uri: image }}
      className="w-14 h-14 rounded-xl bg-gray-100"
    />
    <View className="flex-1">
      <Text
        style={{ fontFamily: "QuickSand-Bold" }}
        className="text-[#1F2937] text-[14px]"
        numberOfLines={1}
      >
        {title}
      </Text>
      <View className="flex-row items-center gap-1.5 mt-1">
        <View className="w-1 h-1 rounded-full bg-gray-300" />
        <Text
          style={{ fontFamily: "QuickSand-Medium" }}
          className="text-gray-400 text-xs"
        >
          {clicks} clicked
        </Text>
      </View>
    </View>
  </View>
);

const SubmissionRow = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <View className="flex-row items-center justify-between py-2">
    <View className="flex-row items-center gap-3">
      <View className={`w-3.5 h-3.5 rounded-full ${color}`} />
      <Text
        style={{ fontFamily: "QuickSand-Bold" }}
        className="text-[#1F2937] text-[15px]"
      >
        {label}
      </Text>
    </View>
    <Text
      style={{ fontFamily: "QuickSand-Bold" }}
      className="text-[#1F2937] text-[16px]"
    >
      {value}
    </Text>
  </View>
);

const DashboardScreen = () => {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = React.useState(2025);
  const [isYearDropdownVisible, setIsYearDropdownVisible] =
    React.useState(false);

  const annualData: Record<number, any[]> = {
    2025: [
      { label: "Jan", value: 40 },
      { label: "Feb", value: 85 },
      { label: "Mar", value: 55 },
      { label: "Apr", value: 85 },
      { label: "May", value: 30 },
      { label: "Jun", value: 65 },
      { label: "Jul", value: 85 },
      { label: "Aug", value: 35 },
      { label: "Sep", value: 65 },
      { label: "Oct", value: 85 },
      { label: "Nov", value: 35 },
      { label: "Dec", value: 65 },
    ],
    2024: [
      { label: "Jan", value: 30 },
      { label: "Feb", value: 50 },
      { label: "Mar", value: 70 },
      { label: "Apr", value: 45 },
      { label: "May", value: 80 },
      { label: "Jun", value: 55 },
      { label: "Jul", value: 40 },
      { label: "Aug", value: 60 },
      { label: "Sep", value: 75 },
      { label: "Oct", value: 50 },
      { label: "Nov", value: 90 },
      { label: "Dec", value: 45 },
    ],
  };

  const years = [2025, 2024, 2023]; // Added 2023 for a better dropdown feel

  // Add mock data for 2023 if selected
  if (!annualData[2023]) {
    annualData[2023] = annualData[2024].map((item) => ({
      ...item,
      value: Math.floor(Math.random() * 60) + 20,
    }));
  }

  const topItems = [
    {
      id: "1",
      image: "https://picsum.photos/200?random=1",
      title: "Precision Precision Me..",
      clicks: 124,
    },
    {
      id: "2",
      image: "https://picsum.photos/200?random=2",
      title: "Precision Precision Me..",
      clicks: 124,
    },
    {
      id: "3",
      image: "https://picsum.photos/200?random=3",
      title: "Precision Precision Me..",
      clicks: 124,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 h-16 border-b border-gray-50 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center -ml-2"
        >
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "QuickSand-Bold" }}
          className="text-xl text-[#1F2937]"
        >
          Dashboard
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Link Clicks Stat */}
        <StatCard
          label="LINK CLICKS"
          value="1786"
          icon={
            <MaterialCommunityIcons
              name="cursor-default-click"
              size={28}
              color="#2B7FFF"
            />
          }
          iconColor="#2B7FFF"
          iconBg="bg-[#EFF6FF]"
        />

        {/* Total Impact Stat */}
        <StatCard
          label="TOTAL IMPACT"
          value="17786 Likes"
          icon={<Ionicons name="heart" size={28} color="#FF4B3A" />}
          iconColor="#FF4B3A"
          iconBg="bg-[#FFF1F0]"
        />

        {/* Link Engagement Chart */}
        <View className="bg-white rounded-3xl mb-6 border border-[#f0ebeb] shadow-sm shadow-black/10 z-50">
          <View className="flex-row items-center justify-between mb-8 px-4 pt-4 overflow-visible">
            <Text
              style={{ fontFamily: "QuickSand-Bold" }}
              className="text-[10px] text-gray-400 uppercase tracking-widest"
            >
              LINK ENGAGEMENT
            </Text>

            <View className="relative">
              <TouchableOpacity
                onPress={() => setIsYearDropdownVisible(!isYearDropdownVisible)}
                activeOpacity={0.7}
                className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"
              >
                <Text
                  style={{ fontFamily: "QuickSand-Bold" }}
                  className="text-[10px] text-gray-500 mr-1"
                >
                  {selectedYear}
                </Text>
                <Ionicons
                  name={isYearDropdownVisible ? "chevron-up" : "chevron-down"}
                  size={12}
                  color="#9CA3AF"
                />
              </TouchableOpacity>

              {/* Year Dropdown Menu */}
              {isYearDropdownVisible && (
                <View
                  className="absolute top-10 right-0 bg-white rounded-xl border border-gray-100 shadow-xl shadow-black/10 w-24 py-1 z-[100]"
                  style={{ elevation: 5 }}
                >
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      onPress={() => {
                        setSelectedYear(year);
                        setIsYearDropdownVisible(false);
                      }}
                      className={`px-4 py-2 ${selectedYear === year ? "bg-gray-50" : ""}`}
                    >
                      <Text
                        style={{
                          fontFamily:
                            selectedYear === year
                              ? "QuickSand-Bold"
                              : "QuickSand-Medium",
                        }}
                        className={`text-xs ${selectedYear === year ? "text-[#2B7FFF]" : "text-gray-500"}`}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View className="items-center justify-center pb-4 pr-4">
            {(() => {
              const currentYearData = annualData[selectedYear] || [];
              const prevYearData =
                annualData[selectedYear - 1] || annualData[selectedYear] || [];

              const processedStackData = currentYearData.map((item, index) => {
                const prevValue = prevYearData[index]?.value || item.value;
                // We show the current value as the main bar.
                // The "background" effect is achieved by stacking the remainder or a track segment.
                return {
                  label: item.label,
                  stacks: [
                    {
                      value: item.value,
                      color: "#2B7FFF",
                      marginBottom: 1, // Slight gap for visual separation
                    },
                    {
                      value: Math.max(
                        10,
                        prevValue - item.value > 0 ? prevValue - item.value : 15
                      ),
                      color: "#EFF6FF", // The "off color" for the background/prev year
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4,
                    },
                  ],
                };
              });

              return (
                <BarChart
                  stackData={processedStackData}
                  barWidth={14}
                  noOfSections={4}
                  barBorderRadius={4}
                  yAxisThickness={0.5}
                  yAxisColor="#F3F4F6"
                  xAxisThickness={0}
                  rulesType="dashed"
                  rulesColor="#F3F4F6"
                  dashGap={4}
                  hideYAxisText={false}
                  yAxisTextStyle={{
                    fontFamily: "QuickSand-Medium",
                    fontSize: 10,
                    color: "#9CA3AF",
                  }}
                  spacing={10}
                  height={140}
                  xAxisLabelTextStyle={{
                    fontFamily: "QuickSand-Medium",
                    fontSize: 9,
                    color: "#9CA3AF",
                  }}
                  isAnimated
                  animationDuration={800}
                />
              );
            })()}
          </View>
        </View>

        {/* Top Click Item */}
        <View className="bg-white rounded-3xl p-4 mb-6 border border-[#f0ebeb] shadow-sm shadow-black/5">
          <Text
            style={{ fontFamily: "QuickSand-Bold" }}
            className="text-[10px] text-gray-400 uppercase tracking-widest mb-4 px-2 pt-2"
          >
            TOP CLICK ITEM
          </Text>
          {topItems.map((item, index) => (
            <TopItemRow
              key={item.id}
              image={item.image}
              title={item.title}
              clicks={item.clicks}
              isLast={index === topItems.length - 1}
            />
          ))}
        </View>

        {/* Submission Pulse */}
        <View className="bg-white rounded-3xl p-6 mb-6 border border-[#f0ebeb] shadow-sm shadow-black/5">
          <Text
            style={{ fontFamily: "QuickSand-Bold" }}
            className="text-[10px] text-gray-400 uppercase tracking-widest mb-4"
          >
            SUBMISSION PULSE
          </Text>
          <SubmissionRow label="Approved" value={10} color="bg-[#10B981]" />
          <SubmissionRow label="Pending" value={10} color="bg-[#F59E0B]" />
          <SubmissionRow label="Reject" value={0} color="bg-[#EF4444]" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
