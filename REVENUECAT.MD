# 💰 RevenueCat In-App Purchase Guide for GiftGuru
## (Expo React Native + Google Play Store)

---

## 📚 Table of Contents

1. [What is RevenueCat?](#1-what-is-revenuecat)
2. [How RevenueCat Works — The Full Picture](#2-how-revenuecat-works--the-full-picture)
3. [Key Concepts You Must Know](#3-key-concepts-you-must-know)
4. [Step-by-Step: Google Play Store Setup](#4-step-by-step-google-play-store-setup)
5. [Step-by-Step: RevenueCat Dashboard Setup](#5-step-by-step-revenuecat-dashboard-setup)
6. [Step-by-Step: Install & Integrate in GiftGuru](#6-step-by-step-install--integrate-in-giftguru)
7. [Code Implementation](#7-code-implementation)
8. [Testing In-App Purchases](#8-testing-in-app-purchases)
9. [Webhook & Backend Integration](#9-webhook--backend-integration)
10. [Play Store Submission Checklist](#10-play-store-submission-checklist)
11. [Common Mistakes & Fixes](#11-common-mistakes--fixes)
12. [Glossary](#12-glossary)

---

## 1. What is RevenueCat?

**RevenueCat** is a third-party service that handles the hardest parts of in-app purchases (IAP) for you:

| Without RevenueCat | With RevenueCat |
|----|-----|
| You write complex billing code yourself | RevenueCat handles all billing logic |
| You manually verify receipts with Google/Apple servers | RevenueCat verifies receipts automatically |
| You track subscriptions in your own database | RevenueCat gives you a real-time dashboard |
| You handle refunds, renewals, expirations yourself | RevenueCat webhooks notify your backend |
| Complicated cross-platform (iOS + Android) logic | One SDK works for both |

**In short:** RevenueCat = a middleman between your app and the app store billing system.

```
Your App  →  RevenueCat SDK  →  Google Play Billing
                    ↓
             RevenueCat Dashboard (analytics, webhooks)
                    ↓
             Your Backend (optional webhook)
```

---

## 2. How RevenueCat Works — The Full Picture

### The Flow When a User Buys Something:

```
1. User taps "Subscribe" in your app
        ↓
2. Your app calls RevenueCat SDK → purchasePackage()
        ↓
3. RevenueCat shows Google's native purchase sheet (Google handles payment)
        ↓
4. Google charges the user
        ↓
5. Google sends a receipt to RevenueCat
        ↓
6. RevenueCat validates the receipt with Google's servers
        ↓
7. RevenueCat updates the user's "CustomerInfo" (entitlements)
        ↓
8. RevenueCat fires a webhook to your backend (optional)
        ↓
9. Your app checks entitlements → unlocks premium features
```

### Key Point:
> ⚠️ **You never touch money directly.** Google handles all payments. RevenueCat only reads the receipt and tells you if it's valid.

---

## 3. Key Concepts You Must Know

### 🏷️ Products
A **Product** is what you sell — it lives on Google Play Console. Examples:
- `giftguru_monthly` — $9.99/month subscription
- `giftguru_yearly` — $79.99/year subscription
- `giftguru_lifetime` — $149.99 one-time purchase

### 📦 Packages
A **Package** in RevenueCat wraps a Product. It adds a standardized type:
- `MONTHLY`, `ANNUAL`, `LIFETIME`, `CUSTOM`

### 🗂️ Offerings
An **Offering** is a collection of packages shown to the user at a point in time. You can have multiple offerings (e.g., `default`, `holiday_sale`, `first_time_discount`) and switch them from the RevenueCat dashboard **without updating your app.** This is very powerful.

```
Offering: "default"
  ├── Package: MONTHLY  → Product: giftguru_monthly ($9.99)
  ├── Package: ANNUAL   → Product: giftguru_yearly ($79.99)
  └── Package: LIFETIME → Product: giftguru_lifetime ($149.99)
```

### 🔑 Entitlements
An **Entitlement** is a feature that users unlock after purchasing. Example:
- Entitlement: `premium` → unlocked when user has active `giftguru_monthly` OR `giftguru_yearly`

You check entitlements in your app to decide what to show/hide.

### 👤 CustomerInfo
The **CustomerInfo** object (returned by RevenueCat SDK) contains everything about a user's purchases:
- Active subscriptions
- Active entitlements
- Purchase history
- Expiration dates

---

## 4. Step-by-Step: Google Play Store Setup

> This must be done FIRST before RevenueCat setup.

### Step 4.1 — Create Your App on Google Play Console

1. Go to [play.google.com/console](https://play.google.com/console)
2. Sign in with your Google account (you need a $25 one-time developer fee)
3. Click **"Create app"**
4. Fill in:
   - App name: `GiftGuru`
   - Default language: English
   - App or Game: App
   - Free or Paid: Free (you'll use In-App Purchases)
5. Click **"Create app"**

### Step 4.2 — Set Up Your App Package

Your package name from `app.json` is: `com.rakibhasan2.giftguru`

Make sure this matches everywhere:
- `app.json` → `android.package`
- Google Play Console → your app
- RevenueCat → Android app

### Step 4.3 — Create In-App Products / Subscriptions

1. In Google Play Console, go to your app
2. Left menu → **Monetize** → **Products** → **Subscriptions**
3. Click **"Create subscription"**
4. Fill in:
   - **Product ID**: `giftguru_monthly` (use lowercase, underscores)
   - **Name**: GiftGuru Monthly Premium
   - **Description**: Access all premium gift suggestions
   - **Benefits**: (add bullet points of what users get)
5. Under **Base Plans**, click **"Add base plan"**
   - Billing period: Monthly
   - Price: Set your price (e.g., $9.99)
   - Click **Activate**
6. **Save** and **Activate** the subscription
7. Repeat for `giftguru_yearly` (Annual) and any other plans

> ⚠️ **Important:** Products must be in "Active" state for them to work. You cannot test with "Draft" products.

### Step 4.4 — Upload a Draft App Build

Google Play requires at least one APK/AAB uploaded before products become testable.

Build your app:
```bash
npx expo prebuild --clean
cd android
./gradlew bundleRelease
```

Your AAB will be at: `android/app/build/outputs/bundle/release/app-release.aab`

Upload this to **Internal Testing** track in Play Console.

### Step 4.5 — Add License Testers

1. Google Play Console → **Setup** → **License Testing**
2. Add your Gmail accounts that you'll use for testing
3. These accounts will NOT be charged when making purchases

### Step 4.6 — Link RevenueCat to Google Play

RevenueCat needs a **Google Service Account** to validate receipts:

1. Go to Google Play Console → **Setup** → **API access**
2. Click **"Link to a Google Cloud project"** (create one if needed)
3. In Google Cloud Console:
   - Go to **IAM & Admin** → **Service Accounts**
   - Click **"Create Service Account"**
   - Name: `revenuecat-service`
   - Click **"Create and Continue"**
   - Role: **Pub/Sub Admin** (required for real-time notifications)
   - Click **"Done"**
4. Click the service account → **Keys** tab → **Add Key** → **JSON**
5. Download the JSON file — **keep this safe, you'll paste it in RevenueCat**
6. Back in Play Console → **API access** → grant this service account **"Admin (all permissions)"** or at minimum: Financial data, Orders, Subscriptions
7. Wait up to 24–48 hours for permissions to propagate

---

## 5. Step-by-Step: RevenueCat Dashboard Setup

### Step 5.1 — Create RevenueCat Account

1. Go to [app.revenuecat.com](https://app.revenuecat.com)
2. Sign up for free (free tier: up to $2,500 monthly tracked revenue)
3. Create a new **Project**: name it `GiftGuru`

### Step 5.2 — Add Your Android App

1. In your project → **Apps** → **+ New app**
2. Select **Google Play Store**
3. Fill in:
   - **App name**: GiftGuru
   - **Package name**: `com.rakibhasan2.giftguru`
4. Under **Service Credentials**, paste the content of the JSON file from Step 4.6
5. Click **Save**

Your **RevenueCat API Key (Android)** will be shown — copy and save it.
It looks like: `goog_xxxxxxxxxxxxxxxxxxxx`

### Step 5.3 — Create Products in RevenueCat

1. Go to **Products** → **+ New Product**
2. For each product on Google Play:
   - **Identifier**: `giftguru_monthly` (must match Google Play product ID exactly)
   - **Store**: Google Play
3. Repeat for all your products

### Step 5.4 — Create Entitlements

1. Go to **Entitlements** → **+ New Entitlement**
2. **Identifier**: `premium`
3. **Description**: Full access to GiftGuru premium features
4. Click **Add** → attach your products to this entitlement:
   - `giftguru_monthly`
   - `giftguru_yearly`
   - `giftguru_lifetime`

### Step 5.5 — Create an Offering

1. Go to **Offerings** → **+ New Offering**
2. **Identifier**: `default`
3. **Description**: Standard GiftGuru plans
4. Click **Add package**:
   - Package 1: Identifier `$rc_monthly`, tied to `giftguru_monthly`
   - Package 2: Identifier `$rc_annual`, tied to `giftguru_yearly`
   - Package 3: Identifier `$rc_lifetime`, tied to `giftguru_lifetime`
5. Set this offering as **Current Offering**

---

## 6. Step-by-Step: Install & Integrate in GiftGuru

### Step 6.1 — Install the SDK

Since your app uses Expo, use the official Expo-compatible package:

```bash
npx expo install react-native-purchases react-native-purchases-ui
```

> ⚠️ `react-native-purchases` is a **native module** — it requires a native build. It will NOT work with Expo Go. You must use `expo run:android` (development build).

### Step 6.2 — Add RevenueCat Plugin to app.json

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      "expo-secure-store",
      "@react-native-community/datetimepicker",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      "react-native-purchases"
    ]
  }
}
```

### Step 6.3 — Rebuild Native Code

```bash
npx expo prebuild --clean
npm run android
```

---

## 7. Code Implementation

### Step 7.1 — Create RevenueCat Service

Create file: `utils/revenuecat.ts`

```typescript
import Purchases, {
  LOG_LEVEL,
  PurchasesPackage,
  CustomerInfo,
  PurchasesOffering,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// ✅ Put your actual RevenueCat API keys here
const REVENUECAT_API_KEY = {
  android: 'goog_xxxxxxxxxxxxxxxxxxxx', // from RevenueCat dashboard
  ios: 'appl_xxxxxxxxxxxxxxxxxxxx',     // if you have iOS too
};

/**
 * Initialize RevenueCat — call this ONCE when the app starts
 */
export async function initializeRevenueCat(userId?: string) {
  // Enable verbose logging in development
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  const apiKey =
    Platform.OS === 'android'
      ? REVENUECAT_API_KEY.android
      : REVENUECAT_API_KEY.ios;

  await Purchases.configure({ apiKey });

  // If you have a logged-in user, identify them so purchases sync to their account
  if (userId) {
    await Purchases.logIn(userId);
  }
}

/**
 * Get current offerings from RevenueCat
 * Returns packages user can purchase
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current; // The "default" offering you set
  } catch (error) {
    console.error('Error fetching offerings:', error);
    return null;
  }
}

/**
 * Purchase a specific package
 * Returns updated CustomerInfo if successful
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<CustomerInfo | null> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  } catch (error: any) {
    if (error.userCancelled) {
      console.log('User cancelled purchase');
      return null;
    }
    console.error('Purchase error:', error);
    throw error;
  }
}

/**
 * Check if user has premium access
 */
export async function checkPremiumStatus(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return (
      customerInfo.entitlements.active['premium'] !== undefined
    );
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
}

/**
 * Restore purchases — required by both Apple & Google policies
 */
export async function restorePurchases(): Promise<CustomerInfo | null> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error('Error restoring purchases:', error);
    return null;
  }
}

/**
 * Get full CustomerInfo object (all purchase details)
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.error('Error getting customer info:', error);
    return null;
  }
}

/**
 * Log out user from RevenueCat (call on logout)
 */
export async function logOutRevenueCat() {
  try {
    await Purchases.logOut();
  } catch (error) {
    console.error('Error logging out RevenueCat:', error);
  }
}
```

### Step 7.2 — Initialize RevenueCat in App Entry Point

Open your `app/_layout.tsx` and add initialization:

```typescript
import { useEffect } from 'react';
import { initializeRevenueCat } from '@/utils/revenuecat';
// ... your other imports

export default function RootLayout() {
  useEffect(() => {
    // Get your logged-in user's ID from Redux/Auth state
    // Pass it so RevenueCat can track purchases per user
    const userId = undefined; // Replace with actual user ID from your auth state
    
    initializeRevenueCat(userId).catch(console.error);
  }, []);

  // ... rest of your layout
}
```

> 💡 If you have a user ID from your Redux auth state, pass it to `initializeRevenueCat`. This links purchases to the correct user.

### Step 7.3 — Create Subscription Screen

Create `components/subscription/SubscriptionScreen.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  PurchasesPackage,
  PurchasesOffering,
  PACKAGE_TYPE,
} from 'react-native-purchases';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  checkPremiumStatus,
} from '@/utils/revenuecat';

export default function SubscriptionScreen() {
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [currentOffering, premiumStatus] = await Promise.all([
        getOfferings(),
        checkPremiumStatus(),
      ]);
      setOffering(currentOffering);
      setIsPremium(premiumStatus);
    } catch (error) {
      Alert.alert('Error', 'Could not load subscription plans. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    setPurchasing(true);
    try {
      const customerInfo = await purchasePackage(pkg);
      if (customerInfo?.entitlements.active['premium']) {
        setIsPremium(true);
        Alert.alert('🎉 Success!', 'Welcome to GiftGuru Premium!');
      }
    } catch (error: any) {
      Alert.alert('Purchase Failed', error.message || 'Something went wrong.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);
    try {
      const customerInfo = await restorePurchases();
      if (customerInfo?.entitlements.active['premium']) {
        setIsPremium(true);
        Alert.alert('✅ Restored!', 'Your purchases have been restored.');
      } else {
        Alert.alert('No Purchases Found', 'No previous purchases to restore.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not restore purchases.');
    } finally {
      setPurchasing(false);
    }
  };

  const getPackageLabel = (pkg: PurchasesPackage): string => {
    const type = pkg.packageType;
    const price = pkg.product.priceString;
    switch (type) {
      case PACKAGE_TYPE.MONTHLY:
        return `Monthly — ${price}/month`;
      case PACKAGE_TYPE.ANNUAL:
        return `Yearly — ${price}/year (Best Value!)`;
      case PACKAGE_TYPE.LIFETIME:
        return `Lifetime — ${price} one-time`;
      default:
        return `${pkg.product.title} — ${price}`;
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading plans...</Text>
      </View>
    );
  }

  if (isPremium) {
    return (
      <View style={styles.center}>
        <Text style={styles.premiumTitle}>✨ You're Premium!</Text>
        <Text style={styles.premiumSub}>Enjoy all GiftGuru features.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upgrade to Premium</Text>
      <Text style={styles.subtitle}>Unlock all features of GiftGuru</Text>

      {/* Benefits */}
      <View style={styles.benefitsBox}>
        {[
          '🎁 Unlimited AI gift suggestions',
          '📋 Save unlimited gift lists',
          '🔔 Smart reminders & alerts',
          '🚫 No ads',
        ].map((benefit, i) => (
          <Text key={i} style={styles.benefit}>
            {benefit}
          </Text>
        ))}
      </View>

      {/* Packages */}
      {offering?.availablePackages.map((pkg) => (
        <TouchableOpacity
          key={pkg.identifier}
          style={styles.packageButton}
          onPress={() => handlePurchase(pkg)}
          disabled={purchasing}
        >
          <Text style={styles.packageText}>{getPackageLabel(pkg)}</Text>
        </TouchableOpacity>
      ))}

      {/* Restore Button */}
      <TouchableOpacity onPress={handleRestore} disabled={purchasing}>
        <Text style={styles.restoreText}>Restore Purchases</Text>
      </TouchableOpacity>

      {purchasing && (
        <ActivityIndicator
          style={{ marginTop: 16 }}
          color="#6C63FF"
        />
      )}

      <Text style={styles.legalText}>
        Subscriptions auto-renew. Cancel anytime in your Google Play account.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  benefitsBox: {
    width: '100%',
    backgroundColor: '#f4f0ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  benefit: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  packageButton: {
    width: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  packageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  restoreText: {
    color: '#6C63FF',
    fontSize: 14,
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  legalText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  premiumTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6C63FF',
    marginBottom: 8,
  },
  premiumSub: {
    fontSize: 16,
    color: '#666',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
});
```

### Step 7.4 — Protecting Premium Features

In any component, check entitlements before showing premium content:

```typescript
import { useEffect, useState } from 'react';
import { checkPremiumStatus } from '@/utils/revenuecat';

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPremiumStatus()
      .then(setIsPremium)
      .finally(() => setLoading(false));
  }, []);

  return { isPremium, loading };
}

// Usage in any component:
// const { isPremium, loading } = usePremium();
// if (isPremium) { /* show premium content */ }
// else { /* show upgrade prompt */ }
```

---

## 8. Testing In-App Purchases

### ⚠️ Big Warning: You CANNOT test real purchases in debug mode on emulator!

Real Google Play billing requires:
1. App uploaded to Play Console (Internal Testing track)
2. Device signed into Gmail that is a License Tester
3. A signed (release-mode) APK/AAB installed on the device

### How to Test (Step by Step):

1. **Upload app to Internal Testing** (Play Console → Testing → Internal Testing → Upload AAB):
   ```bash
   npx expo prebuild --clean
   cd android
   ./gradlew bundleRelease
   ```
   Upload `android/app/build/outputs/bundle/release/app-release.aab`

2. **Add testers** (Play Console → Internal Testing → Testers tab)

3. **Join the test** — testers get an opt-in link via email

4. **Install from Play Store** (not sideloaded)

5. **Make a test purchase** — License Testers are NOT charged

6. **Check RevenueCat Dashboard** — you'll see the purchase appear under "Customer"

### Sandbox Testing via RevenueCat:
- RevenueCat dashboard → Customers → search by your device's user ID
- You'll see all events: purchase, renewal, cancellation

---

## 9. Webhook & Backend Integration

If your backend needs to know about subscription changes (e.g., to update the user's plan in your DB):

### Step 9.1 — Set up RevenueCat Webhooks

1. RevenueCat Dashboard → **Project Settings** → **Integrations** → **Webhooks**
2. Add your backend URL: `https://yourapi.com/webhooks/revenuecat`
3. Select events to listen to:
   - `INITIAL_PURCHASE` — new subscriber
   - `RENEWAL` — subscription renewed
   - `CANCELLATION` — user cancelled
   - `EXPIRATION` — subscription expired
   - `BILLING_ISSUE` — payment failed

### Step 9.2 — Backend Webhook Handler (Example)

```javascript
// Node.js / Express example
app.post('/webhooks/revenuecat', express.json(), (req, res) => {
  const event = req.body;
  
  console.log('RevenueCat event:', event.type);
  
  switch (event.type) {
    case 'INITIAL_PURCHASE':
      // Give user premium access in your DB
      await db.users.update({
        where: { id: event.app_user_id },
        data: { isPremium: true, subscriptionEnd: event.expiration_at_ms }
      });
      break;
      
    case 'EXPIRATION':
    case 'CANCELLATION':
      // Revoke premium access
      await db.users.update({
        where: { id: event.app_user_id },
        data: { isPremium: false }
      });
      break;
  }
  
  res.status(200).send('OK');
});
```

---

## 10. Play Store Submission Checklist

Before submitting your app for review on Google Play:

### App Requirements:
- [ ] App targets Android API 34+ (`targetSdkVersion 34`)
- [ ] App has a Privacy Policy URL (required if you have billing)
- [ ] App has Terms of Service URL
- [ ] Subscription cancellation instructions are clearly visible in the app

### RevenueCat Requirements:
- [ ] RevenueCat API key is in your app
- [ ] Service account JSON has been added to RevenueCat
- [ ] All subscription products are **Active** on Play Console
- [ ] Entitlements created in RevenueCat
- [ ] Offerings created in RevenueCat

### Play Console Requirements:
- [ ] App signed with release key (not debug key)
- [ ] AAB uploaded (not APK — Google now requires AAB)
- [ ] App content rating filled
- [ ] Target audience & content sections complete
- [ ] In-app products/subscriptions all in Active state
- [ ] Billing permission in `AndroidManifest.xml` (RevenueCat plugin adds this automatically)

### Legal Requirements:
- [ ] Your subscription screen must show:
  - Price and billing period clearly
  - "Cancel anytime" or cancellation policy
  - Auto-renewal disclosure
- [ ] "Restore Purchases" button must be accessible
- [ ] Link to Google Play subscription management in app settings

### Play Console Review Notes Section:
Explain to reviewers:
> "This app contains a subscription-based in-app purchase. Payments are processed through Google Play Billing. The RevenueCat SDK is used for purchase validation and subscription management. Testers can use the following test account: [your tester email]."

---

## 11. Common Mistakes & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| `PurchaseNotAllowedException` | Testing on emulator or non-tester account | Use real device with License Tester account |
| Products not showing in app | Products not Active on Play Console | Activate products; wait up to 24h |
| `BILLING_UNAVAILABLE` | Device not signed into Google Play | Sign into Google account on device |
| Receipt validation fails | Service account not set up properly | Re-check JSON key in RevenueCat |
| Purchases not showing in RevenueCat | App not uploaded to Play Console | Upload at least one build to any track |
| App crashes on purchase | Not using development build | Run `npx expo prebuild` and `expo run:android` |
| `Cannot find module 'react-native-purchases'` | Native module, Expo Go doesn't work | Use development build, not Expo Go |
| Offering is null/empty | Products not linked to offerings in RevenueCat | Check RevenueCat dashboard offerings setup |

---

## 12. Glossary

| Term | Meaning |
|------|---------|
| **IAP** | In-App Purchase |
| **SKU** | Stock-Keeping Unit — Google's term for a product ID |
| **Entitlement** | A feature/access level a user has unlocked |
| **Offering** | A set of packages shown to users at a given time |
| **Package** | A RevenueCat wrapper around a store product |
| **CustomerInfo** | Object with all of a user's purchase data |
| **Receipt** | Proof of purchase from Google, validated by RevenueCat |
| **Webhook** | HTTP call from RevenueCat to your backend when something happens |
| **License Tester** | Gmail address allowed to make test purchases for free |
| **AAB** | Android App Bundle — required format for Play Store uploads |
| **Sandbox** | Test environment where purchases don't charge real money |

---

## 🔜 Next Steps in Order

1. ✅ Read this document fully
2. 🎯 Create a Google Play Console account ($25 one-time fee)
3. 🎯 Create your subscription products in Play Console
4. 🎯 Create a RevenueCat account and project
5. 🎯 Set up Google Service Account and paste JSON in RevenueCat
6. 🎯 Run `npx expo install react-native-purchases`
7. 🎯 Add plugin to `app.json`, run `npx expo prebuild --clean`
8. 🎯 Create `utils/revenuecat.ts` (copy from this doc)
9. 🎯 Add initialization to `app/_layout.tsx`
10. 🎯 Build and implement `SubscriptionScreen`
11. 🎯 Upload your first internal test build to Play Console
12. 🎯 Test purchases using License Tester account
13. 🎯 Set up backend webhooks
14. 🎯 Submit app to Play Store for review

---

*Last updated: 2026-03-18 | GiftGuru — Expo React Native + RevenueCat + Google Play*
