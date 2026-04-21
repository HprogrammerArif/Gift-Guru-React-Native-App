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

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { data, isLoading } = useGetLegalAndPrivacyPolicyQuery(undefined);

  console.log("data", data);

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
          ) : data?.privacy_policy ? (
            <Text
              style={{ fontFamily: "QuickSand-Regular" }}
              className="text-sm text-gray-600 leading-6"
            >
              {data.privacy_policy}
            </Text>
          ) : (
            <>
              <Text
                style={{ fontFamily: "QuickSand-Bold" }}
                className="text-base text-[#1F2937] mb-1"
              >
                GiftGuru Privacy Policy
              </Text>
              <Text
                style={{ fontFamily: "QuickSand-Regular" }}
                className="text-xs text-gray-400 mb-6"
              >
                Effective Date: April 15, 2026
              </Text>

              <Text
                style={{ fontFamily: "QuickSand-Regular" }}
                className="text-sm text-gray-600 leading-6 mb-6"
              >
                GiftGuru ("we", "our", or "us") operates the GiftGuru mobile
                application (the "App"). This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                use our App. By using GiftGuru, you agree to the collection and
                use of information in accordance with this policy.
              </Text>

              {/* Section 1 */}
              {/* <Section
                title="1. Information We Collect"
                content={
                  `a. Personal Information\n• Name\n• Email address\n\n` +
                  `b. User-Generated Content\n• Gift posts, wish lists, and shared content\n• Uploaded photos\n• Notes and gift schedules\n\n` +
                  `c. Purchase Information\n• Purchase history (handled via third-party services like RevenueCat)\n\n` +
                  `d. Device & Usage Information\n• Device identifiers\n• App interactions\n• Crash logs and diagnostics`
                }
              /> */}

              {/* Section 2 */}
              {/* <Section
                title="2. How We Use Your Information"
                content={
                  `We use your information to:\n` +
                  `• Provide and maintain app functionality\n` +
                  `• Enable gift discovery and social sharing features\n` +
                  `• Manage user accounts and wish lists\n` +
                  `• Improve app performance and user experience\n` +
                  `• Send relevant gift recommendations and notifications\n` +
                  `• Monitor usage and fix bugs\n` +
                  `• Ensure security and prevent fraud`
                }
              /> */}

              {/* Section 3 */}
              {/* <Section
                title="3. Affiliate Links & Amazon Associates Program"
                content="GiftGuru is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for us to earn advertising fees by linking to Amazon.com and affiliated sites. When you click a 'Check price' button or affiliate link, you are securely redirected to Amazon. We do not share your account's personal information with Amazon. However, once you are on Amazon's platform, any data collected (e.g., cookies, purchase history) is governed entirely by Amazon's Privacy Notice."
              /> */}

              {/* Section 4 */}
              {/* <Section
                title="4. Data Sharing & Third Parties"
                content={
                  `We may share data with trusted third-party services, including:\n` +
                  `• Analytics and crash reporting tools\n` +
                  `• Subscription management services (e.g., RevenueCat)\n` +
                  `• Amazon Associates (for affiliate product links)\n\n` +
                  `These services only access data necessary to perform their functions. We do not sell your personal data.`
                }
              /> */}

              {/* Section 5 */}
              {/* <Section
                title="5. Data Security"
                content={
                  `We implement appropriate security measures to protect your data:\n` +
                  `• Data is encrypted in transit (HTTPS)\n` +
                  `• Secure authentication systems\n` +
                  `• Restricted access to personal data`
                }
              /> */}

              {/* Section 6 */}
              {/* <Section
                title="6. Data Retention"
                content={
                  `We retain your data only as long as necessary to:\n` +
                  `• Provide services\n` +
                  `• Comply with legal obligations\n` +
                  `• Resolve disputes`
                }
              /> */}

              {/* Section 7 */}
              {/* <Section
                title="7. Your Rights"
                content={
                  `You have the right to:\n` +
                  `• Access your data\n` +
                  `• Request correction of your data\n` +
                  `• Request deletion of your account and data\n\n` +
                  `You can request account deletion from the Profile Settings screen inside the app, or by contacting us directly.`
                }
              /> */}

              {/* Section 8 */}
              {/* <Section
                title="8. Children's Privacy"
                content="GiftGuru is not intended for children under 13. We do not knowingly collect data from children. If you believe a child has provided us with personal data, please contact us so we can take steps to remove it."
              /> */}

              {/* Section 9 */}
              {/* <Section
                title="9. Permissions We Use"
                content={
                  `Our app may request access to:\n` +
                  `• Camera – for uploading gift photos and profile pictures\n` +
                  `• Photo Library – to select and upload images\n\n` +
                  `These permissions are only used for app functionality. You can revoke them at any time via your device settings.`
                }
              /> */}

              {/* Section 10 */}
              {/* <Section
                title="10. Changes to This Privacy Policy"
                content='We may update this Privacy Policy from time to time. We will notify users by updating the "Effective Date" at the top of this page.'
              /> */}

              {/* Section 11 */}
              {/* <Section
                title="11. Contact Us"
                content={
                  `If you have any questions or concerns about this Privacy Policy, please contact us:\n` +
                  `📧 Email: support@findrya.co.uk`
                }
              /> */}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
