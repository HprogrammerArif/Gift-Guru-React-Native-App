import Purchases, {
  LOG_LEVEL,
  PurchasesPackage,
  CustomerInfo,
  PurchasesOffering,
  CustomerInfoUpdateListener,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// ✅ These are read from your .env.local file
// EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxxxxxxxxxx
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

  await Purchases.configure({ apiKey });

  // If a user is already logged in, identify them immediately
  if (userId) {
    try {
      await Purchases.logIn(String(userId));
    } catch (error) {
      console.error('[RevenueCat] Error logging in user:', error);
    }
  }
}

/**
 * Log in a user to RevenueCat (call after user logs into your app)
 * This links their RevenueCat purchases to your user ID
 */
export async function loginRevenueCat(userId: string): Promise<void> {
  try {
    await Purchases.logIn(userId);
  } catch (error) {
    console.error('[RevenueCat] logIn error:', error);
  }
}

/**
 * Log out from RevenueCat (call when user logs out of your app)
 */
export async function logOutRevenueCat(): Promise<void> {
  try {
    await Purchases.logOut();
  } catch (error) {
    console.error('[RevenueCat] logOut error:', error);
  }
}

/**
 * Get the current offering from RevenueCat.
 * Returns the "default" offering you set up in the RevenueCat dashboard.
 * Each offering contains packages (monthly, annual, lifetime, etc.)
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();

    if (!offerings.current) {
      console.warn('[RevenueCat] No current offering found. Check your RevenueCat dashboard.');
    }

    return offerings.current;
  } catch (error) {
    console.error('[RevenueCat] getOfferings error:', error);
    return null;
  }
}

/**
 * Purchase a specific package.
 * This shows the Google Play payment sheet to the user.
 *
 * @returns CustomerInfo if purchase succeeded, null if user cancelled
 * @throws error if purchase genuinely failed (network error, billing unavailable, etc.)
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<CustomerInfo | null> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  } catch (error: any) {
    // This is normal — user tapped the X button on the payment sheet
    if (error.userCancelled) {
      console.log('[RevenueCat] User cancelled purchase.');
      return null;
    }
    // This is a real error — surface it to the caller
    console.error('[RevenueCat] purchasePackage error:', error);
    throw error;
  }
}

/**
 * Check if the current user has an active "premium" entitlement.
 *
 * The entitlement ID "premium" must match what you set in the RevenueCat dashboard.
 */
export async function checkPremiumStatus(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active['premium'] !== undefined;
  } catch (error) {
    console.error('[RevenueCat] checkPremiumStatus error:', error);
    return false;
  }
}

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
 * Restore purchases — required by both Apple and Google policies.
 * Users can recover their purchases after reinstalling the app.
 */
export async function restorePurchases(): Promise<CustomerInfo | null> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error('[RevenueCat] restorePurchases error:', error);
    return null;
  }
}

/**
 * Listen to real-time CustomerInfo updates.
 * Use this in _layout.tsx to keep Redux in sync with subscription state.
 *
 * @param callback - Called whenever the user's subscription status changes
 * @returns A cleanup function to remove the listener (call in useEffect cleanup)
 */
export function addCustomerInfoListener(
  callback: CustomerInfoUpdateListener
): () => void {
  Purchases.addCustomerInfoUpdateListener(callback);

  // Return cleanup function
  return () => {
    Purchases.removeCustomerInfoUpdateListener(callback);
  };
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
