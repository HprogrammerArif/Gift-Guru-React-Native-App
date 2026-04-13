import Purchases, {
  LOG_LEVEL,
  PurchasesPackage,
  CustomerInfo,
  PurchasesOffering,
  CustomerInfoUpdateListener,
  PurchasesError,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type RevenueCatResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; userCancelled?: boolean };

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

// ✅ These are read from your .env.local file
const REVENUECAT_API_KEY = {
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '',
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '', // Add if you ever build for iOS
};

/**
 * Initialize RevenueCat — call this ONCE when the app starts (in _layout.tsx)
 *
 * @param userId - Your logged-in user's ID (from your backend/auth state)
 *                 This links RevenueCat purchases to your user records.
 */
export async function initializeRevenueCat(userId?: string | null): Promise<void> {
  // Show detailed logs in development to help you debug
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  const apiKey =
    Platform.OS === 'android'
      ? REVENUECAT_API_KEY.android
      : REVENUECAT_API_KEY.ios;

  if (!apiKey) {
    console.warn(
      '[RevenueCat] API key is missing. Add EXPO_PUBLIC_REVENUECAT_ANDROID_KEY to .env.local'
    );
    return;
  }

  await Purchases.configure({ 
    apiKey,
    appUserID: userId ? String(userId) : undefined, 
  });
  
  console.log("[RevenueCat] SDK configured successfully.");
}

/**
 * Log in a user to RevenueCat (call after user logs into your app)
 * This links their RevenueCat purchases to your user ID
 */
export async function loginRevenueCat(userId: string): Promise<void> {
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    console.log(
      "[RevenueCat] Logged in user:",
      userId,
      "| Active entitlements:",
      Object.keys(customerInfo.entitlements.active)
    );
  } catch (error) {
    console.error('[RevenueCat] Login error:', error);
  }
}

/**
 * Log out from RevenueCat (call when user logs out of your app)
 */
export async function logOutRevenueCat(): Promise<void> {
  try {
    await Purchases.logOut();
    console.log("[RevenueCat] Logged out, reset to anonymous.");
  } catch (error) {
    console.log('[RevenueCat] logOut (already anonymous):', error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Offerings
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the current offering from RevenueCat.
 * Returns the "default" offering you set up in the RevenueCat dashboard.
 * Each offering contains packages (monthly, annual, lifetime, etc.)
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    
    // DEBUG: Log offerings locally
    console.log("[RevenueCat] Offerings fetched successfully");

    if (!offerings.current) {
      console.warn('[RevenueCat] No current offering found. Check your RevenueCat dashboard to ensure one is marked as current.');
    }

    return offerings.current;
  } catch (error) {
    console.error('[RevenueCat] getOfferings error:', error);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Purchases & Restoring
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purchase a specific package.
 * This shows the native payment sheet to the user.
 *
 * @returns success + customerInfo on purchase, or error if failed/cancelled
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<RevenueCatResult<CustomerInfo>> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    
    // Log the active premium entitlement if present
    const premiumEntitlement = customerInfo.entitlements.active['premium'];
    if (premiumEntitlement) {
      console.log(
        "[RevenueCat] ✅ Premium entitlement active! Expires:",
        premiumEntitlement.expirationDate
      );
    }
    
    return { success: true, data: customerInfo };
  } catch (error) {
    const rcError = error as PurchasesError;
    const userCancelled = (rcError as any).userCancelled === true;

    if (userCancelled) {
      console.log('[RevenueCat] User cancelled purchase.');
      return { success: false, error: 'Purchase cancelled.', userCancelled: true };
    }
    
    const message = rcError?.message ?? "An error occurred during purchase. Please try again.";
    console.error('[RevenueCat] purchasePackage error:', message);
    return { success: false, error: message };
  }
}

/**
 * Restore purchases — required by both Apple and Google policies.
 * Users can recover their purchases after reinstalling the app.
 */
export async function restorePurchases(): Promise<RevenueCatResult<CustomerInfo>> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const hasPremium = !!customerInfo.entitlements.active['premium'];
    console.log("[RevenueCat] Restore complete. Premium active:", hasPremium);
    
    return { success: true, data: customerInfo };
  } catch (error) {
    const rcError = error as PurchasesError;
    const message = rcError?.message ?? "Could not restore purchases.";
    console.error('[RevenueCat] restorePurchases error:', message);
    return { success: false, error: message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Customer Info and Listeners
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the full CustomerInfo object for the current user.
 * Contains all active subscriptions, entitlements, and purchase history.
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.error('[RevenueCat] getCustomerInfo error:', error);
    return null;
  }
}

/**
 * Listen to real-time CustomerInfo updates.
 * Use this in _layout.tsx to keep Redux in sync with subscription state.
 */
export function addCustomerInfoListener(
  callback: CustomerInfoUpdateListener
): () => void {
  Purchases.addCustomerInfoUpdateListener(callback);
  return () => {
    Purchases.removeCustomerInfoUpdateListener(callback);
  };
}

/**
 * Check if the user currently has an active "premium" entitlement.
 */
export async function hasPremiumAccess(): Promise<boolean> {
  const info = await getCustomerInfo();
  return !!info?.entitlements.active['premium'];
}

/**
 * Check if the user had premium from checkPremiumStatus legacy
 */
export async function checkPremiumStatus(): Promise<boolean> {
  return await hasPremiumAccess();
}

/**
 * Get the expiration date for the premium entitlement.
 * Returns null if user is not premium or has a lifetime purchase.
 */
export async function getPremiumExpirationDate(): Promise<Date | null> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const premiumEntitlement = customerInfo.entitlements.active['premium'];
    if (!premiumEntitlement) return null;
    if (!premiumEntitlement.expirationDate) return null; // lifetime purchase
    return new Date(premiumEntitlement.expirationDate);
  } catch (error) {
    console.error('[RevenueCat] getPremiumExpirationDate error:', error);
    return null;
  }
}
