import { useGetTermsOfServiceQuery } from "@/redux/features/profileService/profileApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderHTML from "react-native-render-html";

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

export default function TermsOfServiceScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { data, isLoading } = useGetTermsOfServiceQuery(undefined);

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
          Terms of Service
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
          {data?.content ? (
            <RenderHTML
              contentWidth={width - 48}
              source={{ html: data.content }}
              baseStyle={{ fontFamily: "QuickSand-Regular", color: "#4B5563", fontSize: 14, lineHeight: 24 }}
              tagsStyles={{
                strong: { fontFamily: "QuickSand-Bold", color: "#1F2937" },
                h3: { fontFamily: "QuickSand-Bold", color: "#1F2937", fontSize: 18, marginTop: 16, marginBottom: 8 },
                p: { marginBottom: 16 },
                a: { color: "#2B7FFF", textDecorationLine: "none" }
              }}
            />
          ) : data?.terms_of_service ? (
            <Text
              style={{ fontFamily: "QuickSand-Regular" }}
              className="text-sm text-gray-600 leading-6"
            >
              {data.terms_of_service}
            </Text>
          ) : (
            <>
              <Text
                style={{ fontFamily: "QuickSand-Bold" }}
                className="text-base text-[#1F2937] mb-1"
              >
                GiftGuru Terms of Service
              </Text>
              <Text
                style={{ fontFamily: "QuickSand-Regular" }}
                className="text-xs text-gray-400 mb-6"
              >
                Effective Date: April 15, 2026
              </Text>

              <Section
                title="1. Acceptance of Terms"
                content="By downloading or using GiftGuru, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app."
              />
              <Section
                title="2. Eligibility"
                content="You must be at least 13 years of age to use GiftGuru. By using the app, you represent that you meet this age requirement."
              />
              <Section
                title="3. User Accounts"
                content="You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorised use of your account."
              />
              <Section
                title="4. User Content"
                content="You retain ownership of content you post on GiftGuru. By posting content, you grant us a non-exclusive, worldwide licence to display and distribute your content within the app. You agree not to post content that is illegal, harmful, or violates third-party rights."
              />
              <Section
                title="5. Affiliate Programme"
                content="GiftGuru participates in affiliate advertising programmes including the Amazon Associates Programme. Product links in the app may be affiliate links through which we earn commissions on qualifying purchases. This does not affect the price you pay."
              />
              <Section
                title="6. In-App Purchases & Subscriptions"
                content="GiftGuru offers premium subscriptions (Monthly, Annual, Lifetime) processed via Apple App Store and Google Play. Subscriptions auto-renew unless cancelled at least 24 hours before the end of the current period. You can manage or cancel subscriptions in your device store account settings."
              />
              <Section
                title="7. Prohibited Conduct"
                content="You agree not to: (a) post spam or misleading content; (b) impersonate other users; (c) attempt to reverse engineer the app; (d) use the app for any unlawful purpose; (e) manipulate affiliate links in a manner that violates programme policies."
              />
              <Section
                title="8. Termination"
                content="We reserve the right to suspend or terminate your account if you violate these Terms. You may delete your account at any time from the Profile Settings screen."
              />
              <Section
                title="9. Disclaimer of Warranties"
                content="GiftGuru is provided 'as is' without any warranties. We do not guarantee that the app will be error-free or uninterrupted. Product information, prices, and availability are sourced from third-party marketplaces and may not always be accurate."
              />
              <Section
                title="10. Limitation of Liability"
                content="To the maximum extent permitted by law, GiftGuru shall not be liable for any indirect, incidental, or consequential damages arising from your use of the app."
              />
              <Section
                title="11. Changes to These Terms"
                content="We may update these Terms of Service from time to time. We will notify users by updating the Effective Date at the top of this page. Your continued use of the app after any changes means you accept the updated Terms."
              />
              <Section
                title="12. Governing Law"
                content="These Terms of Service are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales."
              />
              <Section
                title="13. Contact"
                content="For questions about these Terms, contact us at: support@findrya.co.uk"
              />
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
