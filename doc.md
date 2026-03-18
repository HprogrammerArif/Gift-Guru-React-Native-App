# 🚀 RevenueCat Complete Guide for GiftGuru
## Learn + Implement In-App Purchases (Expo React Native → Google Play Store)

> **Your app package:** `com.rakibhasan2.giftguru`  
> **SDK already installed:** `react-native-purchases@^9.13.0` ✅  
> **Next required step:** Add the plugin to `app.json` + get your RevenueCat API key

---

## 📚 Table of Contents

1. [What is RevenueCat? (Beginner Explanation)](#1-what-is-revenuecat)
2. [How It All Works — The Big Picture](#2-how-it-all-works)
3. [Key Terms You Must Understand](#3-key-terms)
4. [Phase 1 — Google Play Console Setup](#4-phase-1--google-play-console-setup)
5. [Phase 2 — RevenueCat Dashboard Setup](#5-phase-2--revenuecat-dashboard-setup)
6. [Phase 3 — Code Integration](#6-phase-3--code-integration)
7. [Phase 4 — Testing Purchases](#7-phase-4--testing)
8. [Phase 5 — Backend Webhooks](#8-phase-5--backend-webhooks)
9. [Phase 6 — Play Store Submission](#9-phase-6--play-store-submission)
10. [Common Errors & Fixes](#10-common-errors--fixes)
11. [Glossary](#11-glossary)
12. [Your Complete Action Checklist](#12-your-complete-action-checklist)

---

## 1. What is RevenueCat?

### Simple Explanation

Imagine you open a store. **Google Play** is the payment terminal (it takes the money). But Google's payment system has very complex code — you need to verify receipts, handle renewals, check if subscriptions are still active, handle refunds, cancellations, etc.

**RevenueCat is the middleman** that does all of that complexity for you.

```
Without RevenueCat:
  Your App → Write 500 lines of billing code → Google Play → Handle receipts yourself

With RevenueCat:
  Your App → RevenueCat SDK (5 lines) → Google Play → RevenueCat handles everything
```

### What RevenueCat Does For You

| Task | Without RevenueCat | With RevenueCat |
|------|-------------------|-----------------|
| Verifying a purchase is real | You write code to call Google's servers | ✅ Auto |
| Tracking if subscription is active | You build a DB system | ✅ Auto |
| Handling renewals / expiry | You write cron jobs | ✅ Auto |
| Cross-platform (Android + iOS) | Two completely different code sets | ✅ One SDK |
| Analytics dashboard | Build your own | ✅ Built-in |
| A/B test pricing | Very complex | ✅ Dashboard toggle |

### RevenueCat is FREE up to $2,500/month tracked revenue.

---

## 2. How It All Works

### The Full Flow When a User Buys

```
[User taps "Subscribe" button]
         ↓
[Your app calls: Purchases.purchasePackage(pkg)]
         ↓
[RevenueCat SDK shows Google's native payment sheet]
  (The popup Google shows for billing — you can't customize it)
         ↓
[User enters payment details & confirms]
         ↓
[Google charges the user and sends a receipt]
         ↓
[RevenueCat automatically receives & validates that receipt]
         ↓
[RevenueCat updates "CustomerInfo" — user now has "premium" entitlement]
         ↓
[RevenueCat fires webhook → your backend updates user status (optional)]
         ↓
[Your app checks: customerInfo.entitlements.active["premium"] → true]
         ↓
[User sees premium features unlocked 🎉]
```

### Architecture Diagram

```
┌──────────────────────────────────────────────────────┐
│                    Your React Native App              │
│                                                       │
│  ┌─────────────────┐       ┌────────────────────┐   │
│  │  Subscription   │──────▶│  RevenueCat SDK    │   │
│  │    Screen       │       │ react-native-       │   │
│  │  (membership.  │       │ purchases           │   │
│  │   tsx)          │◀──────│                    │   │
│  └─────────────────┘       └──────────┬─────────┘   │
│                                        │              │
└────────────────────────────────────────┼─────────────┘
                                         │ HTTPS
                                         ▼
                              ┌─────────────────────┐
                              │   RevenueCat Cloud   │
                              │  app.revenuecat.com  │
                              │                      │
                              │  • Receipt validation│
                              │  • Subscription DB   │
                              │  • Analytics         │
                              │  • Webhooks          │
                              └──────────┬──────────┘
                                         │
                  ┌──────────────────────┼──────────────────┐
                  ▼                      ▼                   ▼
       ┌──────────────┐      ┌──────────────┐    ┌──────────────────┐
       │ Google Play  │      │  Your Backend│    │  Apple App Store │
       │   Billing    │      │  (Webhook)   │    │  (if iOS later) │
       └──────────────┘      └──────────────┘    └──────────────────┘
```

---

## 3. Key Terms

### 🛍️ Product
A **product** lives on Google Play Console. It's what you sell.
- Example: `giftguru_monthly` — $9.99/month subscription

### 📦 Package
A **package** is RevenueCat's wrapper around a Google Play product. It adds a standardized type like `MONTHLY`, `ANNUAL`, `LIFETIME`.

### 🗂️ Offering
An **offering** is a collection of packages you show to users. The power: you can switch offerings from the RevenueCat dashboard **without releasing a new app update**. 

Example: Switch from "standard" pricing to "holiday_sale" pricing just by clicking in RevenueCat dashboard.

```
Offering: "default"
  ├── Package: MONTHLY  → giftguru_monthly ($9.99/month)
  ├── Package: ANNUAL   → giftguru_yearly ($79.99/year)
  └── Package: LIFETIME → giftguru_lifetime ($149.99 once)
```

### 🔑 Entitlement
An **entitlement** is a feature/access level. You define it in RevenueCat and link products to it.

Example:
- Entitlement ID: `premium`
- Unlocked by: `giftguru_monthly` OR `giftguru_yearly` OR `giftguru_lifetime`

In your app, you just check: `customerInfo.entitlements.active["premium"]`

If that exists → user is premium. You don't care HOW they got premium.

### 👤 CustomerInfo
The **CustomerInfo** object is what RevenueCat returns. It has:
- Which entitlements are active
- Subscription expiry dates
- Purchase history

### 🔗 Webhook
A **webhook** is an HTTP request that RevenueCat sends to YOUR backend when something happens (new purchase, renewal, cancellation). Your backend uses this to update the user's plan in your database.

---

## 4. Phase 1 — Google Play Console Setup

> ⚠️ **You must do this BEFORE RevenueCat setup.** There is a $25 one-time developer registration fee.

### Step 1.1 — Register as a Google Play Developer

1. Go to [play.google.com/console](https://play.google.com/console)
2. Sign in with your Google account
3. Pay the **$25 one-time fee** (not recurring)
4. Complete account registration (name, address, etc.)

### Step 1.2 — Create Your App

1. Click **"Create app"**
2. Fill in:
   - App name: `GiftGuru`
   - Default language: English
   - Type: **App** (not Game)
   - Free or Paid: **Free** (you'll use In-App Purchases)
3. Click **"Create app"**

> ✅ Your package name is: `com.rakibhasan2.giftguru` — make sure this matches everywhere.

### Step 1.3 — Create Subscription Products

1. In Google Play Console → left menu → **Monetize** → **Products** → **Subscriptions**
2. Click **"Create subscription"**
3. Create these subscriptions:

| Product ID | Name | Price |
|---|---|---|
| `giftguru_monthly` | GiftGuru Monthly Premium | $9.99/month |
| `giftguru_yearly` | GiftGuru Yearly Premium | $79.99/year |
| `giftguru_lifetime` *(In-app product, not subscription)* | GiftGuru Lifetime | $149.99 once |

> **For each subscription:**
> - Product ID: exactly as shown above (lowercase, underscores)  
> - Under "Base Plans": Add base plan → set billing period + price  
> - Click **Activate** on the base plan  
> - Click **Activate** on the subscription  
> ⚠️ Status must be **Active** — NOT Draft!

### Step 1.4 — Upload a Draft Build (Required to Activate Products)

Google requires at least one uploaded build before products become usable:

```bash
# In your project root:
npx expo prebuild --clean
cd android
./gradlew bundleRelease
```

Upload `android/app/build/outputs/bundle/release/app-release.aab` to:  
**Internal Testing** track in Play Console → Testing → Internal Testing → Create new release

### Step 1.5 — Add License Testers (Test Without Real Charges)

1. Play Console → **Setup** → **License Testing**
2. Add your Gmail address (the one on your test device)
3. These accounts will NEVER be charged when making test purchases

### Step 1.6 — Create Google Service Account (For RevenueCat)

RevenueCat needs a service account to validate receipts from Google.

1. Play Console → **Setup** → **API access**
2. Click **"Link to a Google Cloud project"** (create one if needed)
3. In Google Cloud Console ([console.cloud.google.com](https://console.cloud.google.com)):
   - Go to **IAM & Admin** → **Service Accounts**
   - Click **"Create Service Account"**
   - Name: `revenuecat-service`
   - Click **"Create and Continue"**
   - Role: **Pub/Sub Admin**
   - Click **"Done"**
4. Click the service account you just created → **Keys** tab → **Add Key** → **JSON**
5. Download the `.json` file — **keep this safe, never commit it to git!**
6. Back in Play Console → **API access** → find your service account → click **Grant access**
   - Role: **Release manager** + **Financial data viewer** at minimum
7. ⏳ Wait 24–48 hours for permissions to propagate

---

## 5. Phase 2 — RevenueCat Dashboard Setup

### Step 2.1 — Create RevenueCat Account

1. Go to [app.revenuecat.com](https://app.revenuecat.com)
2. Sign up (completely free to start)
3. Create a **Project** → name: `GiftGuru`

### Step 2.2 — Add Your Android App

1. Project → **Apps** → **+ New app**
2. Select **Google Play Store**
3. Fill in:
   - App name: `GiftGuru`
   - Package name: `com.rakibhasan2.giftguru`
4. Under **Service Credentials**: paste the content of the JSON file from Step 1.6
5. Save

> 📋 **Copy your RevenueCat Android API key** — it looks like: `goog_xxxxxxxxxxxxxxxxxxxx`
> Save it in your `.env.local`:
> ```
> EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxxxxxxxxxx
> ```

### Step 2.3 — Create Products in RevenueCat

1. **Products** → **+ New Product**
2. Create one for each Google Play product:

| Identifier | Store |
|---|---|
| `giftguru_monthly` | Google Play |
| `giftguru_yearly` | Google Play |
| `giftguru_lifetime` | Google Play |

> ⚠️ The identifier MUST match the Google Play product ID exactly.

### Step 2.4 — Create Entitlements

1. **Entitlements** → **+ New Entitlement**
2. Identifier: `premium`
3. Description: `Full access to GiftGuru premium features`
4. Click **Add** → attach all three products to this entitlement

### Step 2.5 — Create an Offering

1. **Offerings** → **+ New Offering**
2. Identifier: `default`
3. Click **Add package**:

| Package Identifier | Type | Product |
|---|---|---|
| `$rc_monthly` | Monthly | `giftguru_monthly` |
| `$rc_annual` | Annual | `giftguru_yearly` |
| `$rc_lifetime` | Lifetime | `giftguru_lifetime` |

4. Set this offering as **Current Offering**

---

## 6. Phase 3 — Code Integration

### What's Already Done ✅

- `react-native-purchases@^9.13.0` is in your `package.json` ✅
- `react-native-purchases-ui@^9.13.0` is in your `package.json` ✅

### What You Need To Do

#### Step 3.1 — Add API Key to `.env.local`

Open `.env.local` and add:

```env
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_REPLACE_WITH_YOUR_ACTUAL_KEY
```

#### Step 3.2 — Add Plugin to `app.json`

Add `"react-native-purchases"` to the plugins array in `app.json`:

```json
"plugins": [
  "expo-router",
  "expo-splash-screen",
  "@react-native-community/datetimepicker",
  "expo-secure-store",
  "react-native-purchases"
]
```

This automatically adds the `BILLING` permission to `AndroidManifest.xml`.

#### Step 3.3 — Rebuild Native Code

After adding the plugin, you MUST rebuild:

```bash
npx expo prebuild --clean
npm run android
```

> ⚠️ `react-native-purchases` is a **native module** — it does NOT work with Expo Go!  
> You must use `expo run:android` (development build).

#### Step 3.4 — Files Created For You

The following files have been created in your project:

| File | Purpose |
|------|---------|
| `utils/revenuecat.ts` | All RevenueCat helper functions |
| `redux/features/revenuecat/revenuecatSlice.ts` | Redux state for premium status |
| `hooks/usePremium.ts` | Hook to check premium status anywhere |

`app/_layout.tsx` and `redux/store.ts` have been updated.

#### Step 3.5 — Use In Your Membership Screen

In `membership.tsx` (or wherever you show subscription plans):

```typescript
import { useEffect, useState } from 'react';
import { getOfferings, purchasePackage, restorePurchases } from '@/utils/revenuecat';
import { PurchasesOffering, PurchasesPackage, PACKAGE_TYPE } from 'react-native-purchases';

// Get offerings (packages from RevenueCat)
const [offering, setOffering] = useState<PurchasesOffering | null>(null);

useEffect(() => {
  getOfferings().then(setOffering);
}, []);

// Purchase a package
const handleBuy = async (pkg: PurchasesPackage) => {
  const customerInfo = await purchasePackage(pkg);
  if (customerInfo?.entitlements.active['premium']) {
    // User is now premium! Navigate away or update UI
  }
};

// Display packages
offering?.availablePackages.map(pkg => (
  // pkg.product.priceString → "$9.99" (auto-formatted for the user's currency)
  // pkg.packageType → PACKAGE_TYPE.MONTHLY, ANNUAL, etc.
))
```

#### Step 3.6 — Check Premium Status Anywhere

```typescript
import { usePremium } from '@/hooks/usePremium';

function SomeFeature() {
  const { isPremium, isLoading } = usePremium();
  
  if (isLoading) return <Loading />;
  if (!isPremium) return <UpgradePrompt />;
  
  return <PremiumFeature />;
}
```

---

## 7. Phase 4 — Testing

### ⚠️ Important: You Cannot Test Real IAP on Emulator

Real Google Play Billing requires:
1. A real Android device (not emulator)
2. Signed into a Gmail that is a License Tester
3. App installed from Play Store (internal testing track)

### Testing Flow

1. Build a release bundle:
   ```bash
   npx expo prebuild --clean
   cd android
   ./gradlew bundleRelease
   ```

2. Upload to Play Console → **Internal Testing** track

3. Add your Gmail as a **License Tester** (Setup → License Testing)

4. Click the internal testing link on your phone → install the app

5. Open app → go to membership/subscription screen

6. Tap a plan → Google's payment sheet appears → complete purchase  
   *(License testers are NOT charged)*

7. Check **RevenueCat Dashboard** → Customers → you'll see the purchase appear

8. The `isPremium` flag in your Redux state should become `true`

### RevenueCat Sandbox Purchases

RevenueCat Dashboard → Customers → search by your device's user ID. You'll see:
- Purchase events
- Subscription renewals
- Cancellations

---

## 8. Phase 5 — Backend Webhooks

If your backend needs to know about subscription changes (to update the user's plan in your database):

### Step 5.1 — Set Up Webhook in RevenueCat

1. RevenueCat Dashboard → **Project Settings** → **Integrations** → **Webhooks**
2. Add your backend URL: `https://yourapi.com/webhooks/revenuecat`
3. Subscribe to these events:

| Event | When It Fires |
|-------|--------------|
| `INITIAL_PURCHASE` | User buys for the first time |
| `RENEWAL` | Subscription auto-renews |
| `CANCELLATION` | User cancels subscription |
| `EXPIRATION` | Subscription expires |
| `BILLING_ISSUE` | Payment failed |

### Step 5.2 — Example Backend Handler

```javascript
// Express.js example
app.post('/webhooks/revenuecat', express.json(), async (req, res) => {
  const event = req.body;
  const userId = event.app_user_id; // This is the user ID you passed to RevenueCat

  switch (event.type) {
    case 'INITIAL_PURCHASE':
    case 'RENEWAL':
      // Give user premium access in your DB
      await db.users.update({ id: userId }, { isPremium: true });
      break;
      
    case 'EXPIRATION':
    case 'CANCELLATION':
      // Revoke premium access
      await db.users.update({ id: userId }, { isPremium: false });
      break;
  }
  
  res.status(200).send('OK');
});
```

> 💡 The `app_user_id` in the webhook matches the `userId` you passed to `initializeRevenueCat(userId)`. That's why identifying users is important.

---

## 9. Phase 6 — Play Store Submission

### Pre-Submission Checklist

#### ✅ App Requirements
- [ ] `targetSdkVersion` is 34 or higher in `android/build.gradle`
- [ ] App has a **Privacy Policy URL** (required when app has billing)
- [ ] App has a **Terms of Service URL**
- [ ] Subscription screens show: price, billing period, cancellation policy, auto-renewal info
- [ ] **"Restore Purchases"** button is accessible in the app

#### ✅ RevenueCat Requirements
- [ ] EXPO_PUBLIC_REVENUECAT_ANDROID_KEY is set in `.env.local`
- [ ] Service account JSON added to RevenueCat dashboard
- [ ] All products are **Active** on Play Console (not Draft)
- [ ] Entitlements created in RevenueCat
- [ ] Offerings created in RevenueCat

#### ✅ Build Requirements
- [ ] App signed with **release keystore** (not debug)
- [ ] **AAB** uploaded (not APK — Google requires AAB for Play Store)
- [ ] `BILLING` permission in AndroidManifest.xml (plugin adds this automatically)

#### ✅ Play Console Information
- [ ] App content rating completed
- [ ] Target audience section completed
- [ ] Data safety section completed (you must declare what data you collect)
- [ ] Screenshots uploaded (phone + 7-inch tablet required)
- [ ] Store listing description complete

### Data Safety Declaration for RevenueCat

In Play Console → **Data Safety**, you must declare:

| Data Type | Shared with | Required? |
|---|---|---|
| Purchase history | RevenueCat (Third party) | Yes |
| User IDs | RevenueCat (Third party) | Yes |
| Device IDs | RevenueCat (Third party) | Yes |

### Play Console Review Notes

In the "Notes for reviewer" section, add:
> "This app uses RevenueCat SDK for in-app purchase management. The subscription screen clearly shows pricing, billing periods, and cancellation policy. Purchases are processed through Google Play Billing. Test account: [your tester email]."

### Building the Final AAB

```bash
# Clean and rebuild
npx expo prebuild --clean

# Sign your app (you need a keystore)
cd android
./gradlew bundleRelease

# Your signed AAB will be at:
# android/app/build/outputs/bundle/release/app-release.aab
```

---

## 10. Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `PurchaseNotAllowedException` | Testing on emulator or non-tester Gmail | Use real device with License Tester account |
| Products not showing in app | Products not Active on Play Console | Activate products; wait up to 24h |
| `BILLING_UNAVAILABLE` | Device not signed into Google account | Sign into Google Play on device |
| Receipt validation fails | Service account not set up correctly | Re-upload JSON key in RevenueCat dashboard |
| Purchases not in RevenueCat dashboard | App not uploaded to Play Console at all | Upload at least one build to any track |
| App crashes on purchase | Using Expo Go instead of dev build | Run `npx expo prebuild` + `expo run:android` |
| `Cannot find module 'react-native-purchases'` | Native module not installed | Run `npx expo prebuild --clean` + `npm run android` |
| Offering is `null` | Products not linked to offerings | Check RevenueCat dashboard → Offerings |
| `userCancelled: true` | User dismissed the payment sheet | Normal behavior, no action needed |
| API key not working | Wrong key or placeholder not replaced | Replace with your actual `goog_...` key from RevenueCat dashboard |

---

## 11. Glossary

| Term | Simple Explanation |
|------|-------------------|
| **IAP** | In-App Purchase — buying something inside an app |
| **SKU** | Google's name for a Product ID |
| **Entitlement** | A feature a user has unlocked (e.g., "premium") |
| **Offering** | A set of packages shown to users (you control this from dashboard) |
| **Package** | RevenueCat's wrapper around a Google Play product |
| **CustomerInfo** | Object with everything about a user's purchases |
| **Receipt** | Proof of purchase from Google |
| **Webhook** | An HTTP call RevenueCat makes to your backend |
| **License Tester** | A Gmail that can make purchases without being charged |
| **AAB** | Android App Bundle — the file you upload to Play Store |
| **Sandbox** | Test environment — no real money changes hands |
| **Base Plan** | The core billing plan attached to a Google Play subscription |
| **Entitlement ID** | The string you check in code: `entitlements.active["premium"]` |
| **App User ID** | The ID you give RevenueCat to identify your user |
| **Service Account** | A Google Cloud identity that lets RevenueCat talk to Google Play |

---

## 12. Your Complete Action Checklist

### 🔴 Phase 1 — External Setup (Do These First)

- [ ] **1.1** Go to [play.google.com/console](https://play.google.com/console) → Register ($25 fee)
- [ ] **1.2** Create your app (`com.rakibhasan2.giftguru`)
- [ ] **1.3** Create subscriptions: `giftguru_monthly`, `giftguru_yearly`, `giftguru_lifetime`
- [ ] **1.4** Activate all products (not Draft)
- [ ] **1.5** Upload a draft AAB to Internal Testing track
- [ ] **1.6** Create Google Service Account → download JSON key
- [ ] **1.7** Grant service account access in API access settings
- [ ] **1.8** Go to [app.revenuecat.com](https://app.revenuecat.com) → Create account + project
- [ ] **1.9** Add Android app in RevenueCat with your package name
- [ ] **1.10** Paste service account JSON into RevenueCat
- [ ] **1.11** Copy your RevenueCat API key (`goog_...`)
- [ ] **1.12** Create Products in RevenueCat (matching Google Play IDs)
- [ ] **1.13** Create `premium` Entitlement → link all products
- [ ] **1.14** Create `default` Offering → add packages → set as Current

---

### 🟡 Phase 2 — Code Changes (Already Handled For You)

- [x] `react-native-purchases` installed in `package.json`
- [ ] **2.1** Add your API key to `.env.local`
- [ ] **2.2** Add `"react-native-purchases"` to `app.json` plugins *(check REVENUECAT.MD)*
- [ ] **2.3** Run `npx expo prebuild --clean` + `npm run android`
- [x] `utils/revenuecat.ts` created
- [x] `redux/features/revenuecat/revenuecatSlice.ts` created
- [x] `hooks/usePremium.ts` created
- [x] `redux/store.ts` updated with revenuecat reducer
- [x] `app/_layout.tsx` updated with initialization
- [ ] **2.4** Replace remaining placeholder in `membership.tsx` with RevenueCat packages

---

### 🟢 Phase 3 — Testing

- [ ] **3.1** Add your Gmail as License Tester in Play Console
- [ ] **3.2** Build release AAB + upload to Internal Testing
- [ ] **3.3** Install app from Play Store internal test link
- [ ] **3.4** Make a test purchase (not charged)
- [ ] **3.5** Verify purchase appears in RevenueCat dashboard
- [ ] **3.6** Verify `isPremium` becomes `true` in app

---

### 🔵 Phase 4 — Before Submission

- [ ] **4.1** Privacy Policy URL added to app + Play Console
- [ ] **4.2** Terms of Service URL added
- [ ] **4.3** Subscription screen shows price, period, and cancellation policy
- [ ] **4.4** "Restore Purchases" button is visible and working
- [ ] **4.5** Data Safety section filled in Play Console
- [ ] **4.6** Content rating completed
- [ ] **4.7** Store listing fully complete (description, screenshots)
- [ ] **4.8** Upload final signed AAB
- [ ] **4.9** Submit for review

---

## ❓ Frequently Asked Questions

**Q: Do I need to pay RevenueCat?**
> No, it's completely free up to $2,500/month tracked revenue. After that, it's a percentage fee.

**Q: Can users bypass the payment?**
> No. RevenueCat validates receipts with Google's servers. A fake receipt will fail validation.

**Q: What happens if user cancels their subscription?**
> RevenueCat fires a `CANCELLATION` webhook. The subscription remains active until the current period ends. After expiry, the entitlement becomes inactive.

**Q: Do I need to handle renewals?**
> No. RevenueCat handles renewal validation automatically. Your app just checks `entitlements.active` and it stays accurate.

**Q: Can I offer a free trial?**
> Yes! Set it up in Google Play Console when creating the Base Plan. RevenueCat will reflect it automatically.

**Q: What if a user reinstalls the app?**
> They can tap "Restore Purchases" → RevenueCat matches their Google account → entitlements are restored.

**Q: Why is my offering `null`?**
> Either: products aren't linked to offerings in RevenueCat dashboard, or your API key is wrong.

---

*Last updated: 2026-03-18 | GiftGuru — Expo 54 + react-native-purchases 9.x + Google Play*
