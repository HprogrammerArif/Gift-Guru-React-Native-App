import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View className="border-b border-gray-50 py-4">
      <TouchableOpacity
        onPress={toggleOpen}
        className="flex-row items-center justify-between"
        activeOpacity={0.7}
      >
        <Text
          style={{ fontFamily: "QuickSand-Medium" }}
          className="text-[15px] text-[#4B5563] flex-1 mr-4"
        >
          {question}
        </Text>
        <Ionicons
          name={isOpen ? "remove" : "add"}
          size={22}
          color={isOpen ? "#2B7FFF" : "#9CA3AF"}
        />
      </TouchableOpacity>
      {isOpen && (
        <View className="mt-4 pr-6">
          <Text
            style={{ fontFamily: "QuickSand-Regular" }}
            className="text-gray-500 leading-6 text-[14px]"
          >
            {answer}
          </Text>
        </View>
      )}
    </View>
  );
};

const MembershipScreen = () => {
  const router = useRouter();

  const faqData = [
    {
      question: "How does the Free plan work?",
      answer:
        "The free plan allows you to explore basic features with some limitations on product links and affiliate customization. It's a great way to get started with the community.",
    },
    {
      question: "Can I earn commissions on the Free plan?",
      answer:
        "Yes, you can still participate in the affiliate program, but the commission structure and customization options are limited compared to the Pro plan.",
    },
    {
      question: "How does the Pro plan work?",
      answer:
        "The Pro plan gives you full control over your affiliate links, allows you to use your own affiliate ID, provides automatic tag replacement, and priority support.",
    },
    {
      question: "Do I need technical knowledge to use my affiliate ID?",
      answer:
        "Not at all. Our dashboard makes it incredibly simple to manage your affiliate ID. Just enter it in your account settings and we handle the rest.",
    },
    {
      question: "What happens to my existing links after upgrading?",
      answer:
        "Once you upgrade to Pro, your existing links can be automatically updated to use your own affiliate tag, ensuring you earn commissions from all your content.",
    },
    {
      question: "Is this compliant with Amazon's affiliate policy?",
      answer:
        "Yes, our link conversion and management system is designed to adhere to Amazon's affiliate program guidelines and best practices.",
    },
    {
      question: "Is there a limit on how many links I can create?",
      answer:
        "The Pro plan offers unlimited link management, allowing you to scale your affiliate marketing efforts without any volume-based restrictions.",
    },
  ];

  const features = [
    "Add unlimited Amazon product links",
    "Use your own Amazon affiliate ID",
    "Automatic affiliate tag replacement",
    "Manage affiliate ID from account settings",
    "Priority support",
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 h-16 border-b border-gray-50 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center -ml-2"
        >
          <Ionicons name="chevron-back" size={22} color="#1F2937" />
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
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
      >
        {/* Pro Card */}
        <View
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 3,
          }}
          className="bg-white rounded-2xl border border-[#BFDBFE] p-6 mb-10"
        >
          <Text
            style={{ fontFamily: "QuickSand-Bold" }}
            className="text-md text-[#1F2937] font-bold mb-3 tracking-[2px]"
          >
            PRO
          </Text>
          <View className="flex-row items-baseline mb-10">
            <Text
              style={{ fontFamily: "QuickSand-Bold" }}
              className="text-4xl text-[#1F2937]"
            >
              $19.99
            </Text>
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-gray-400 text-lg ml-1"
            >
              /month
            </Text>
          </View>

          <View className="space-y-4 mb-6">
            {features.map((feature, index) => (
              <View key={index} className="flex-row items-center mb-5">
                <View className="w-6 h-6 rounded-full bg-[#2B7FFF] items-center justify-center mr-4">
                  <Ionicons name="checkmark" size={14} color="white" />
                </View>
                <Text
                  style={{ fontFamily: "QuickSand-Medium" }}
                  className="text-[#4B5563] text-[15px]"
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            className="w-full bg-[#2B7FFF] py-4 rounded-2xl items-center shadow-md"
          >
            <Text
              
              className="text-white text-md uppercase tracking-[1px] font-bold"
            >
              Upgrade to Pro
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View className="px-2">
          <Text
            style={{ fontFamily: "QuickSand-Bold" }}
            className="text-4xl text-[#1F2937] text-center mb-6 tracking-[4px]"
          >
            FAQ
          </Text>

          <View className="mb-6">
            {faqData.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MembershipScreen;
