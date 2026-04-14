import { useGetLegalAndPrivacyPolicyQuery } from "@/redux/features/profileService/profileApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Section = ({ title, content }: { title: string; content: string }) => (
  <View className="mb-6">
    <Text
      style={{ fontFamily: "QuickSand-Bold" }}
      className="text-base text-[#1F2937] mb-2"
    >
      {title}
    </Text>
    <Text
      style={{ fontFamily: "QuickSand-Regular" }}
      className="text-sm text-gray-600 leading-6"
    >
      {content}
    </Text>
  </View>
);

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { data, isLoading } = useGetLegalAndPrivacyPolicyQuery(undefined);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 h-16 border-b border-gray-50">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center -ml-2"
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "QuickSand-Bold" }}
          className="text-xl text-[#1F2937]"
        >
          Privacy Policy
        </Text>
        <View className="w-10" />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2B7FFF" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
        >
          {/* If backend provides content, display it; else show static fallback */}
          {data?.privacy_policy ? (
            <Text
              style={{ fontFamily: "QuickSand-Regular" }}
              className="text-sm text-gray-600 leading-6"
            >
              {data.privacy_policy}
            </Text>
          ) : (
            <>
              <Text
                style={{ fontFamily: "QuickSand-Regular" }}
                className="text-xs text-gray-400 mb-6"
              >
                Last updated: April 2026
              </Text>

              <Section
                title="1. Information We Collect"
                content="We collect information you provide directly to us when you create an account, including your name, email address, phone number, date of birth, gender, and profile photo. We also collect usage data such as posts you create, products you interact with, and links you click."
              />
              <Section
                title="2. How We Use Your Information"
                content="We use your information to provide and improve GiftGuru, personalise your experience, send notifications, process in-app purchases, and display relevant gift recommendations. We do not sell your personal data to third parties."
              />
              <Section
                title="3. Affiliate Links"
                content="GiftGuru participates in affiliate advertising programs. When you click a 'Check price' button or purchase via an Amazon link in the app, we may earn a commission. Product prices and availability are determined by the respective marketplace."
              />
              <Section
                title="4. In-App Purchases"
                content="Premium subscriptions are processed by Apple App Store or Google Play. We do not store your payment card details. Subscription management and cancellation is handled through your device's store account settings."
              />
              <Section
                title="5. Data Sharing"
                content="We may share your data with RevenueCat (subscription management), Google (authentication), and our backend infrastructure providers. All third parties are contractually required to protect your data in accordance with applicable laws."
              />
              <Section
                title="6. Data Retention & Deletion"
                content="You may delete your account at any time from the Profile Settings screen. Upon deletion, your personal data will be permanently removed from our systems within 30 days, except where retention is required by law."
              />
              <Section
                title="7. Children's Privacy"
                content="GiftGuru is not directed to children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us."
              />
              <Section
                title="8. Contact Us"
                content="If you have questions about this Privacy Policy, please contact us at: support@findrya.co.uk"
              />
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
