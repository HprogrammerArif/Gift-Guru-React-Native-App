import { getOfferings, purchasePackage, restorePurchases } from "@/utils/revenuecat";
import { usePremium } from "@/hooks/usePremium";
import { useGetMySubscriptionQuery } from "@/redux/features/subscription/subscriptionApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PurchasesPackage, PurchasesOffering, PACKAGE_TYPE } from "react-native-purchases";
import { FEATURES_BY_PLAN, PREMIUM_FEATURES } from "@/constants/subscriptionFeatures";


// ── Current Subscription Status Card ──────────────────────────────────────────
const CurrentPlanCard = ({ data }: { data: any }) => {
  if (!data) return null;

  const { plan, status, start_date, end_date, days_remaining, payment_method, is_active } = data;

  const isPaidPlan = plan?.slug !== "free";
  const isActive = is_active;

  // Format date nicely
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Badge colour based on status
  const statusBg = status === "active" ? "bg-emerald-500" : "bg-red-400";
  const statusLabel = status === "active" ? "Active" : status;

  return (
    <View
      className={`rounded-[28px] p-6 mb-8 ${isPaidPlan ? "bg-[#2B7FFF]" : "bg-[#1F2937]"}`}
      style={{
        shadowColor: isPaidPlan ? "#2B7FFF" : "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      {/* Top row */}
      <View className="flex-row justify-between items-center mb-4">
        <Text
          style={{ fontFamily: "QuickSand-Bold" }}
          className="text-white/70 text-xs uppercase tracking-widest"
        >
          Current Plan
        </Text>
        <View className={`${statusBg} px-3 py-1 rounded-full`}>
          <Text
            style={{ fontFamily: "QuickSand-Bold" }}
            className="text-white text-[10px] uppercase tracking-wider"
          >
            {statusLabel}
          </Text>
        </View>
      </View>

      {/* Plan name */}
      <Text
        style={{ fontFamily: "QuickSand-Bold" }}
        className="text-white text-4xl mb-1 uppercase tracking-tight"
      >
        {plan?.name ?? "—"}
      </Text>

      {/* Price */}
      <Text
        style={{ fontFamily: "QuickSand-Medium" }}
        className="text-white/60 text-sm mb-5"
      >
        {parseFloat(plan?.price ?? "0") === 0
          ? "Free — no payment required"
          : `$${plan?.price} / ${(plan?.duration_days ?? 30) >= 300 ? "year" : "month"}`}
      </Text>

      {/* Feature pills */}
      {plan?.features?.length > 0 && (
        <View className="mb-5 gap-2">
          {plan.features.map((f: string, i: number) => (
            <View key={i} className="flex-row items-start">
              <View className="bg-white/20 rounded-full p-0.5 mr-2 mt-0.5">
                <Ionicons name="checkmark" size={10} color="white" />
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
      <View className="border-t border-white/20 mb-4" />

      {/* Meta row */}
      <View className="flex-row justify-between flex-wrap gap-y-2">
        {start_date && (
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.6)" />
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-white/60 text-xs ml-1"
            >
              Started {formatDate(start_date)}
            </Text>
          </View>
        )}
        {end_date ? (
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.6)" />
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-white/60 text-xs ml-1"
            >
              Expires {formatDate(end_date)}
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center">
            <Ionicons name="infinite-outline" size={13} color="rgba(255,255,255,0.6)" />
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-white/60 text-xs ml-1"
            >
              No expiry
            </Text>
          </View>
        )}
        {days_remaining !== null && days_remaining !== undefined && (
          <View className="flex-row items-center">
            <Ionicons name="hourglass-outline" size={13} color="rgba(255,255,255,0.6)" />
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-white/60 text-xs ml-1"
            >
              {days_remaining} days left
            </Text>
          </View>
        )}
        {payment_method && (
          <View className="flex-row items-center">
            <Ionicons name="card-outline" size={13} color="rgba(255,255,255,0.6)" />
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-white/60 text-xs ml-1 capitalize"
            >
              {payment_method}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const MembershipScreen = () => {
  const router = useRouter();
  const { isPremium, isLoading: isStatusLoading } = usePremium();

  // ── Current subscription from backend ──────────────────────────────────────
  // NOTE: Do NOT include isSubLoading in the full-screen loading gate.
  // If the API is slow/retrying it causes the whole screen to reload repeatedly.
  const { data: currentSubscription, isLoading: isSubLoading, isError: isSubError } =
    useGetMySubscriptionQuery(undefined, {
      // Don't refetch on every mount — avoids reload loop when navigating back
      refetchOnMountOrArgChange: false,
    });

  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const loadOfferings = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentOffering = await getOfferings();
      setOffering(currentOffering);
    } catch (error) {
      console.error("[Membership] Error loading offerings:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOfferings();
  }, [loadOfferings]);

  const handlePurchase = async (pkg: PurchasesPackage) => {
    setIsPurchasing(true);
    try {
      const result = await purchasePackage(pkg);
      if (result.success) {
        if (result.data.entitlements.active["premium"]) {
          Alert.alert("🎉 Success!", "Welcome to Premium! Your features are now unlocked.");
        }
      } else if (!result.userCancelled) {
        Alert.alert("Purchase Error", result.error);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsPurchasing(true);
    try {
      const result = await restorePurchases();
      if (result.success) {
        if (result.data.entitlements.active["premium"]) {
          Alert.alert("✅ Restored!", "Your premium subscription has been restored.");
        } else {
          Alert.alert("No Purchase Found", "We couldn't find any active subscriptions to restore.");
        }
      } else {
        Alert.alert("Restore Error", result.error);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const getPackageLabel = (pkg: PurchasesPackage) => {
    const type = pkg.packageType;
    switch (type) {
      case PACKAGE_TYPE.MONTHLY: return "Monthly";
      case PACKAGE_TYPE.ANNUAL: return "Yearly";
      case PACKAGE_TYPE.LIFETIME: return "Lifetime";
      default: return pkg.product.title;
    }
  };



  // Only block on RC offerings — subscription API and Redux state are handled inline
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2B7FFF" />
          <Text className="mt-4 text-gray-500">Loading plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          Membership
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
      >
        {/* ── Current Plan Card ─────────────────────────────────────────────── */}
        {isSubLoading ? (
          // Inline skeleton — does NOT block the whole screen
          <View
            className="rounded-[28px] bg-gray-100 p-6 mb-8 items-center justify-center"
            style={{ height: 180 }}
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
          // Graceful fallback — don't crash if API is down
          <View className="rounded-[28px] bg-gray-50 border border-gray-100 p-6 mb-8 items-center">
            <Ionicons name="cloud-offline-outline" size={28} color="#9CA3AF" />
            <Text
              style={{ fontFamily: "QuickSand-Medium" }}
              className="text-gray-400 text-sm mt-2 text-center"
            >
              Could not load subscription status
            </Text>
          </View>
        ) : (
          <CurrentPlanCard data={currentSubscription} />
        )}

        {/* ── Section header for upgrade plans ─────────────────────────────── */}
        {!isPremium && (offering?.availablePackages?.length ?? 0) > 0 && (
          <Text
            style={{ fontFamily: "QuickSand-Bold" }}
            className="text-[#1F2937] text-lg mb-4 tracking-tight"
          >
            Upgrade Your Plan
          </Text>
        )}

        {/* ── Render RevenueCat Packages ────────────────────────────────────── */}
        {offering?.availablePackages.map((pkg) => {
          const isAnnual = pkg.packageType === PACKAGE_TYPE.ANNUAL;

          return (
            <View
              key={pkg.identifier}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 3,
              }}
              className={`bg-white rounded-2xl border ${isAnnual ? "border-[#2B7FFF]" : "border-gray-100"} p-6 mb-8`}
            >
              <View className="flex-row justify-between items-start mb-3">
                <Text
                  style={{ fontFamily: "QuickSand-Bold" }}
                  className="text-md text-[#1F2937] font-bold tracking-[2px] uppercase"
                >
                  {getPackageLabel(pkg)}
                </Text>
                {isAnnual && (
                  <View className="bg-[#EBF4FF] px-3 py-1 rounded-full">
                    <Text
                      style={{ fontFamily: "QuickSand-Bold" }}
                      className="text-[#2B7FFF] text-[10px] uppercase"
                    >
                      Best Value
                    </Text>
                  </View>
                )}
              </View>

              <View className="flex-row items-baseline mb-8">
                <Text
                  style={{ fontFamily: "QuickSand-Bold" }}
                  className="text-4xl text-[#1F2937]"
                >
                  {pkg.product.priceString}
                </Text>
                <Text
                  style={{ fontFamily: "QuickSand-Medium" }}
                  className="text-gray-400 text-lg ml-1"
                >
                  {pkg.packageType === PACKAGE_TYPE.ANNUAL ? "/year" : pkg.packageType === PACKAGE_TYPE.MONTHLY ? "/month" : ""}
                </Text>
              </View>

              <View className="space-y-4 mb-6">
                {(FEATURES_BY_PLAN[pkg.packageType] || PREMIUM_FEATURES).map((feature, idx) => (
                  <View key={idx} className="flex-row items-center mb-4">
                    <View className="w-5 h-5 rounded-full bg-[#2B7FFF]/10 items-center justify-center mr-3">
                      <Ionicons name="checkmark" size={12} color="#2B7FFF" />
                    </View>
                    <Text
                      style={{ fontFamily: "QuickSand-Medium" }}
                      className="text-[#4B5563] text-[14px] flex-1"
                    >
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              {!isPremium && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handlePurchase(pkg)}
                  disabled={isPurchasing}
                  className={`w-full ${isAnnual ? "bg-[#2B7FFF]" : "bg-gray-800"} py-4 rounded-2xl items-center shadow-md`}
                >
                  {isPurchasing ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-md uppercase tracking-[1px] font-bold">
                      Upgrade Now
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* ── Premium active banner ─────────────────────────────────────────── */}
        {isPremium && (
          <View className="bg-green-50 rounded-2xl p-5 mb-10 border border-green-100 items-center">
            <Ionicons name="checkmark-circle" size={40} color="#10B981" />
            <Text
              style={{ fontFamily: "QuickSand-Bold" }}
              className="text-[#1F2937] text-lg mt-2"
            >
              Premium is Active
            </Text>
            <Text className="text-gray-500 text-center mt-1">
              You have full access to all features.
            </Text>
          </View>
        )}

        {/* ── Restore Button ────────────────────────────────────────────────── */}
        <TouchableOpacity
          onPress={handleRestore}
          disabled={isPurchasing}
          className="flex-row items-center justify-center gap-2 mb-8 border border-gray-200 rounded-2xl py-3 px-6"
          accessibilityLabel="Restore previous purchases"
          accessibilityRole="button"
        >
          <Ionicons name="refresh" size={16} color="#2B7FFF" />
          <Text
            style={{ fontFamily: "QuickSand-SemiBold" }}
            className="text-[#2B7FFF] text-sm"
          >
            Restore Purchases
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default MembershipScreen;
