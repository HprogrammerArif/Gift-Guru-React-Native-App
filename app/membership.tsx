import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Purchases, { PurchasesOffering, PurchasesPackage } from "react-native-purchases";

import { usePremium } from "@/hooks/usePremium";
import {
  useGetMySubscriptionQuery,
  useGetSubscriptionPlansQuery,
  useCreateCheckoutSessionMutation,
  useCancelSubscriptionMutation,
} from "@/redux/features/subscription/subscriptionApi";
import { getOfferings, purchasePackage, restorePurchases } from "@/utils/revenuecat";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface BackendPlan {
  id: number;
  name: string;
  slug: string;
  price: string;
  current_duration_days: number | null;
  features: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const FeatureRow = ({ text }: { text: string }) => (
  <View className="flex-row items-center mb-3">
    <View className="w-5 h-5 rounded-full bg-[#2B7FFF]/10 items-center justify-center mr-3 flex-shrink-0">
      <Ionicons name="checkmark" size={11} color="#2B7FFF" />
    </View>
    <Text
      style={{ fontFamily: "QuickSand-Medium" }}
      className="text-[#4B5563] text-[13.5px] flex-1 leading-5"
    >
      {text}
    </Text>
  </View>
);

// ─────────────────────────────────────────────────────────────────────────────
// Current Plan Card
// ─────────────────────────────────────────────────────────────────────────────

const CurrentPlanCard = ({
  data,
  onManage,
}: {
  data: any;
  onManage: () => void;
}) => {
  if (!data) return null;

  const { plan, status, start_date, end_date, days_remaining, is_active } = data;
  const isPaid = plan?.slug !== "free";

  const formatDate = (d: string | null) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isExpired = !is_active && isPaid;
  const cardBg = isExpired ? "bg-[#FF3B30]" : isPaid ? "bg-[#2B7FFF]" : "bg-[#1F2937]";

  return (
    <View
      className={`${cardBg} rounded-[28px] p-6 mb-6`}
      style={styles.cardShadow}
    >
      {/* Top row */}
      <View className="flex-row justify-between items-center mb-3">
        <Text
          style={{ fontFamily: "QuickSand-Bold" }}
          className="text-white/70 text-[11px] uppercase tracking-widest"
        >
          Current Plan
        </Text>
        <View
          className={`px-3 py-1 rounded-full ${
            is_active ? "bg-white/20" : "bg-black/20"
          }`}
        >
          <Text
            style={{ fontFamily: "QuickSand-Bold" }}
            className="text-white text-[10px] uppercase tracking-wider"
          >
            {is_active ? "Active" : isExpired ? "Expired" : status ?? "Free"}
          </Text>
        </View>
      </View>

      {/* Plan name */}
      <Text
        style={{ fontFamily: "QuickSand-Bold" }}
        className="text-white text-[38px] mb-0.5 uppercase tracking-tight leading-tight"
      >
        {plan?.name ?? "Free"}
      </Text>

      {/* Price */}
      <Text
        style={{ fontFamily: "QuickSand-Medium" }}
        className="text-white/60 text-sm mb-5"
      >
        {parseFloat(plan?.price ?? "0") === 0
          ? "Free — no payment required"
          : `$${plan?.price} / month`}
      </Text>

      {/* Features from backend */}
      {plan?.features?.length > 0 && (
        <View className="mb-5 gap-1.5">
          {plan.features.map((f: string, i: number) => (
            <View key={i} className="flex-row items-start">
              <View className="bg-white/20 rounded-full p-0.5 mr-2 mt-[3px] flex-shrink-0">
                <Ionicons name="checkmark" size={9} color="white" />
              </View>
              <Text
                style={{ fontFamily: "QuickSand-Medium" }}
                className="text-white/80 text-xs flex-1 leading-5"
              >
                {f}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Divider */}
      <View className="border-t border-white/15 mb-4" />

      {/* Meta info row */}
      <View className="flex-row flex-wrap gap-x-4 gap-y-2 mb-4">
        {start_date && (
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.55)" />
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-white/55 text-xs ml-1"
            >
              Started {formatDate(start_date)}
            </Text>
          </View>
        )}
        {end_date && (
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.55)" />
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-white/55 text-xs ml-1"
            >
              {isExpired ? "Expired" : "Expires"} {formatDate(end_date)}
            </Text>
          </View>
        )}
        {days_remaining !== null && days_remaining !== undefined && days_remaining > 0 && (
          <View className="flex-row items-center">
            <Ionicons name="hourglass-outline" size={12} color="rgba(255,255,255,0.55)" />
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-white/55 text-xs ml-1"
            >
              {days_remaining} days left
            </Text>
          </View>
        )}
      </View>

      {/* Manage subscription button — only for active paid plans */}
      {isPaid && is_active && (
        <TouchableOpacity
          onPress={onManage}
          activeOpacity={0.75}
          className="bg-white/15 rounded-2xl py-3 items-center"
        >
          <Text
            style={{ fontFamily: "QuickSand-Bold" }}
            className="text-white text-sm"
          >
            Manage or Cancel Subscription
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────

const MembershipScreen = () => {
  const router = useRouter();
  const { isPremium } = usePremium();

  // ── Backend data ────────────────────────────────────────────────────────────
  const {
    data: plans,
    isLoading: isPlansLoading,
    isError: isPlansError,
  } = useGetSubscriptionPlansQuery(undefined);

  const {
    data: currentSubscription,
    isLoading: isSubLoading,
    isError: isSubError,
    refetch: refetchSubscription,
  } = useGetMySubscriptionQuery(undefined, {
    // Always fetch fresh on mount so the card never shows stale cached data
    // (e.g. old Premium plan after downgrading to Free)
    refetchOnMountOrArgChange: true,
  });

  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [cancelSubscription] = useCancelSubscriptionMutation();

  // ── RevenueCat offerings ────────────────────────────────────────────────────
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [isOfferingsLoading, setIsOfferingsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const loadOfferings = useCallback(async () => {
    setIsOfferingsLoading(true);
    try {
      setOffering(await getOfferings());
    } catch (e) {
      console.error("[Membership] getOfferings error:", e);
    } finally {
      setIsOfferingsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOfferings();
  }, [loadOfferings]);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  /**
   * Match a backend plan (by slug) to a RevenueCat package.
   * RC product IDs follow the pattern: giftguru_<slug>_monthly
   */
  const getRCPackage = (plan: BackendPlan): PurchasesPackage | null => {
    if (!offering) return null;
    return (
      offering.availablePackages.find((pkg) =>
        pkg.product.identifier.toLowerCase().includes(plan.slug.toLowerCase())
      ) ?? null
    );
  };

  /** Whether this backend plan is the user's currently active plan */
  const isCurrentPlan = (plan: BackendPlan): boolean => {
    return currentSubscription?.plan?.slug === plan.slug && currentSubscription?.is_active === true;
  };

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handlePurchase = async (plan: BackendPlan, pkg: PurchasesPackage) => {
    setIsPurchasing(true);
    try {
      const result = await purchasePackage(pkg);
      if (result.success) {
        if (result.data.entitlements.active["premium"]) {
          // Notify backend — fire and forget, RC webhooks are the real source of truth
          createCheckoutSession({ plan_slug: plan.slug }).unwrap().catch((e) =>
            console.error("[Membership] Backend checkout notification failed:", e)
          );
          // Refresh backend card
          refetchSubscription();
          Alert.alert("🎉 You're now Premium!", "All features are unlocked. Enjoy GiftGuru!");
        }
      } else if (!result.userCancelled) {
        Alert.alert("Purchase Failed", result.error ?? "Something went wrong. Please try again.");
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      // Inform backend of intent to cancel (non-blocking, webhooks handle the truth)
      cancelSubscription(undefined).unwrap().catch((e) =>
        console.error("[Membership] Backend cancel notification failed:", e)
      );
      if (customerInfo.managementURL) {
        Linking.openURL(customerInfo.managementURL);
      } else {
        Alert.alert(
          "Manage Subscription",
          Platform.OS === "ios"
            ? "Go to App Store → Settings → Subscriptions to manage your plan."
            : "Go to Google Play → Profile → Payments & Subscriptions to manage your plan."
        );
      }
    } catch (e) {
      console.error("[Membership] managementURL error:", e);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const result = await restorePurchases();
      if (result.success) {
        if (result.data.entitlements.active["premium"]) {
          refetchSubscription();
          Alert.alert("✅ Purchases Restored", "Your premium subscription has been restored.");
        } else {
          Alert.alert(
            "Nothing to Restore",
            "We couldn't find any active subscriptions linked to this account."
          );
        }
      } else {
        Alert.alert("Restore Failed", result.error ?? "Please try again.");
      }
    } finally {
      setIsRestoring(false);
    }
  };

  // ── Loading skeleton ────────────────────────────────────────────────────────

  const isFullLoading = isOfferingsLoading || isPlansLoading;

  if (isFullLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="#2B7FFF" />
          <Text
            style={{ fontFamily: "QuickSand-Medium" }}
            className="text-gray-400 text-sm"
          >
            Loading plans...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Paid plans only (skip free — it's shown via the current plan card) ──────
  const paidPlans = (plans as BackendPlan[] | undefined)?.filter(
    (p) => p.slug !== "free"
  ) ?? [];

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <View className="flex-row items-center justify-between px-5 h-14 bg-[#F8F9FB]">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={16}
          className="w-9 h-9 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "QuickSand-Bold" }}
          className="text-[#1F2937] text-xl"
        >
          Membership
        </Text>
        <View className="w-9" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 60 }}
      >
        {/* ── Current Plan Card ──────────────────────────────────────────────── */}
        {isSubLoading ? (
          <View
            className="rounded-[28px] bg-gray-100 mb-6 items-center justify-center"
            style={{ height: 170 }}
          >
            <ActivityIndicator size="small" color="#2B7FFF" />
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-gray-400 text-xs mt-2"
            >
              Loading subscription...
            </Text>
          </View>
        ) : isSubError ? (
          <View className="rounded-[28px] bg-gray-50 border border-gray-100 p-6 mb-6 items-center">
            <Ionicons name="cloud-offline-outline" size={28} color="#9CA3AF" />
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-gray-400 text-sm mt-2 text-center"
            >
              Could not load subscription status
            </Text>
          </View>
        ) : (
          <CurrentPlanCard
            data={currentSubscription}
            onManage={handleManageSubscription}
          />
        )}

        {/* ── Plans Error ────────────────────────────────────────────────────── */}
        {isPlansError && (
          <View className="bg-red-50 rounded-2xl p-4 mb-4 items-center">
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-red-500 text-sm"
            >
              Failed to load subscription plans. Pull down to retry.
            </Text>
          </View>
        )}

        {/* ── Upgrade section header ─────────────────────────────────────────── */}
        {!isPremium && paidPlans.length > 0 && (
          <Text
            style={{ fontFamily: "QuickSand-Bold" }}
            className="text-[#1F2937] text-[17px] mb-4 mt-2"
          >
            Upgrade Your Plan
          </Text>
        )}

        {/* ── Plan Cards (backend-driven, RC prices) ────────────────────────── */}
        {paidPlans.map((plan) => {
          const rcPackage = getRCPackage(plan);
          const active = isCurrentPlan(plan);

          // Live price from Google Play / App Store via RevenueCat
          // Falls back to backend price if RC package not matched yet
          const displayPrice = rcPackage
            ? rcPackage.product.priceString
            : `$${plan.price}`;

          const isBestValue = plan.slug === "premium";

          return (
            <View
              key={plan.id}
              className={`bg-white rounded-[28px] p-6 mb-5 ${
                active
                  ? "border-2 border-[#2B7FFF]"
                  : isBestValue
                  ? "border border-[#2B7FFF]/30"
                  : "border border-gray-100"
              }`}
              style={styles.cardShadow}
            >
              {/* Plan name + badge row */}
              <View className="flex-row justify-between items-center mb-2">
                <Text
                  style={{ fontFamily: "QuickSand-Bold" }}
                  className="text-sm text-[#2B7FFF] uppercase tracking-[2px]"
                >
                  {plan.name}
                </Text>
                {active ? (
                  <View className="bg-[#2B7FFF] px-3 py-1 rounded-full">
                    <Text
                      style={{ fontFamily: "QuickSand-Bold" }}
                      className="text-white text-[10px] uppercase tracking-wide"
                    >
                      Current Plan
                    </Text>
                  </View>
                ) : isBestValue ? (
                  <View className="bg-[#EBF4FF] px-3 py-1 rounded-full">
                    <Text
                      style={{ fontFamily: "QuickSand-Bold" }}
                      className="text-[#2B7FFF] text-[10px] uppercase tracking-wide"
                    >
                      Best Value
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Price — live from RevenueCat / Google Play */}
              <View className="flex-row items-baseline mb-6">
                <Text
                  style={{ fontFamily: "QuickSand-Bold" }}
                  className="text-3xl text-[#1F2937] leading-tight"
                >
                  {displayPrice}
                </Text>
                <Text
                  style={{ fontFamily: "QuickSand-Medium" }}
                  className="text-gray-400 text-base ml-1"
                >
                  / month
                </Text>
              </View>

              {/* Features — driven by backend `plan.features` array */}
              <View className="mb-6">
                {plan.features.map((feature, idx) => (
                  <FeatureRow key={idx} text={feature} />
                ))}
              </View>

              {/* CTA button */}
              <TouchableOpacity
                activeOpacity={active ? 1 : 0.8}
                disabled={active || isPurchasing || !rcPackage}
                onPress={() => {
                  if (!rcPackage) return;
                  handlePurchase(plan, rcPackage);
                }}
                className={`w-full py-[14px] rounded-2xl items-center ${
                  active
                    ? "bg-gray-100"
                    : isBestValue
                    ? "bg-[#2B7FFF]"
                    : "bg-[#1F2937]"
                }`}
                style={active ? {} : styles.buttonShadow}
              >
                {isPurchasing && !active ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text
                    style={{ fontFamily: "QuickSand-Bold" }}
                    className={`text-sm uppercase tracking-[1.5px] ${
                      active ? "text-gray-400" : "text-white"
                    }`}
                  >
                    {active
                      ? "Your Current Plan"
                      : isPremium
                      ? `Switch to ${plan.name}`
                      : `Upgrade to ${plan.name}`}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}

        {/* ── Restore Purchases (required by Apple & Google policies) ─────────── */}
        <TouchableOpacity
          onPress={handleRestore}
          disabled={isRestoring || isPurchasing}
          activeOpacity={0.6}
          className="flex-row items-center justify-center gap-2 py-4 mt-1 mb-4"
          accessibilityLabel="Restore previous purchases"
          accessibilityRole="button"
        >
          {isRestoring ? (
            <ActivityIndicator size="small" color="#2B7FFF" />
          ) : (
            <>
              <Ionicons name="refresh" size={15} color="#2B7FFF" />
              <Text
                style={{ fontFamily: "QuickSand-SemiBold" }}
                className="text-[#2B7FFF] text-sm underline"
              >
                Restore Purchases
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* ── Legal Disclosure (required by Apple & Google) ───────────────────── */}
        {/* Apple: exact wording required. Do NOT simplify. */}
        <Text
          style={{ fontFamily: "QuickSand-Regular" }}
          className="text-gray-400 text-[11px] text-center leading-5 px-4 mb-4"
        >
          {Platform.OS === "ios"
            ? "Payment will be charged to your Apple ID account at confirmation of purchase. Subscription automatically renews unless cancelled at least 24 hours before the end of the current period. You can manage and cancel your subscription in App Store → Settings → Subscriptions."
            : "Subscription automatically renews unless cancelled at least 24 hours before the end of the current period. Billed through Google Play. Manage or cancel in Google Play → Profile → Payments & Subscriptions."}
        </Text>

        {/* ── Terms of Service & Privacy Policy ───────────────────────────────── */}
        <View className="flex-row items-center justify-center pb-2">
          <TouchableOpacity
            hitSlop={8}
            onPress={() => Linking.openURL("https://www.giftguru.app/terms-of-service")}
          >
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-[#2B7FFF] text-xs underline"
            >
              Terms of Service
            </Text>
          </TouchableOpacity>
          <Text
            style={{ fontFamily: "QuickSand-Regular" }}
            className="text-gray-300 text-xs mx-3"
          >
            •
          </Text>
          <TouchableOpacity
            hitSlop={8}
            onPress={() => Linking.openURL("https://www.giftguru.app/privacy-policy")}
          >
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-[#2B7FFF] text-xs underline"
            >
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  buttonShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#2B7FFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

export default MembershipScreen;
