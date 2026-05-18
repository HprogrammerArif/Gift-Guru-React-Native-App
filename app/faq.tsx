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

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const faqData = [
  {
    question: "What is included in the Premium plan?",
    answer:
      "Premium gives you unlimited posts, the ability to use your own Amazon Affiliate ID on up to 5 posts, keep 100% of your affiliate commissions, and remove platform branding from your posts.",
  },
  {
    question: "How do I upgrade to Premium?",
    answer:
      "Go to the Membership screen from your profile or settings and choose a Monthly or Yearly plan. Payment is processed securely through Google Play or the App Store.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes. You can cancel at any time through Google Play (Subscriptions) or the App Store (Settings › Subscriptions). Your Premium access continues until the end of the billing period.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "You keep Premium access until your current billing period ends. After that, your account reverts to the Free plan with its standard limits.",
  },
  {
    question: "How do affiliate links work?",
    answer:
      "When you create a post with an Amazon product link, GiftGuru can optionally attach an affiliate tag. On the Free plan, the platform's tag is used. On Premium, you can use your own tag and keep 100% of any resulting commissions.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "All payments are handled entirely by Google Play or Apple's App Store. GiftGuru never sees or stores your card details.",
  },
  {
    question: "How do I restore a previous purchase?",
    answer:
      'Open the Membership screen and tap "Restore Purchases". This is useful if you reinstalled the app or switched devices.',
  },
  {
    question: "Can I share gift ideas with others?",
    answer:
      "Yes! You can create posts with gift ideas and share them to the social feed. Other users can like, comment, save, and bookmark your posts.",
  },
  {
    question: "How do wish lists work?",
    answer:
      "You can save any product or gift idea to your personal wish list. Wish lists are private by default but can be shared with friends and family.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can reach our support team through the Help & Support option in your profile settings, or by emailing support@giftguru.app.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FAQ Item Component
// ─────────────────────────────────────────────────────────────────────────────

const FAQItem = ({
  question,
  answer,
  isLast,
}: {
  question: string;
  answer: string;
  isLast?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen((prev) => !prev);
  };

  return (
    <View
      style={{
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: "#F3F4F6",
        paddingVertical: 16,
      }}
    >
      <TouchableOpacity
        onPress={toggleOpen}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontFamily: "QuickSand-SemiBold",
            fontSize: 15,
            color: "#111827",
            flex: 1,
            marginRight: 12,
          }}
        >
          {question}
        </Text>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: isOpen ? "#EFF6FF" : "#F3F4F6",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={isOpen ? "remove" : "add"}
            size={16}
            color={isOpen ? "#2B7FFF" : "#9CA3AF"}
          />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <Text
          style={{
            fontFamily: "QuickSand-Regular",
            fontSize: 14,
            color: "#6B7280",
            lineHeight: 22,
            marginTop: 12,
            paddingRight: 8,
          }}
        >
          {answer}
        </Text>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────

const FAQScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }} edges={["top"]}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: "#F9FAFB",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "QuickSand-Bold",
            fontSize: 20,
            color: "#111827",
            marginLeft: 12,
          }}
        >
          FAQ
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
      >
        {/* Intro */}
        <Text
          style={{
            fontFamily: "QuickSand-Medium",
            fontSize: 14,
            color: "#6B7280",
            marginBottom: 20,
            lineHeight: 22,
          }}
        >
          Find answers to the most common questions about GiftGuru, Premium
          features, and your subscription.
        </Text>

        {/* FAQ Card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            paddingHorizontal: 16,
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isLast={index === faqData.length - 1}
            />
          ))}
        </View>

        {/* Contact prompt */}
        <View
          style={{
            marginTop: 24,
            backgroundColor: "#EFF6FF",
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: "#DBEAFE",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#2B7FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "QuickSand-Bold",
                fontSize: 14,
                color: "#1D4ED8",
              }}
            >
              Still have questions?
            </Text>
            <Text
              style={{
                fontFamily: "QuickSand-Regular",
                fontSize: 12,
                color: "#3B82F6",
                marginTop: 2,
              }}
            >
              Contact us at support@giftguru.app
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQScreen;
