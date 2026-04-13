# GiftGuru — Product Overview

GiftGuru is a mobile app (Android + iOS) that helps users discover, share, and manage gift ideas. Users can browse trending and recommended gift products, create and interact with social posts about gifts, manage wish lists, and track expenses and schedules related to gifting.

## Core Features
- Social feed with gift posts (like, comment, save, bookmark)
- Trending and recommended product discovery
- Wish list management
- Expense and schedule tracking
- Notifications
- User profiles with role-based access
- Premium subscription via RevenueCat (monthly, yearly, lifetime)
- Google Sign-In support

## Monetization
Premium access is gated via a `premium` entitlement managed through RevenueCat. Use the `usePremium()` hook to check subscription status anywhere in the app.

## Target Platforms
- Android (primary, Google Play Store — package: `com.rakibhasan2.giftguru`)
- iOS (supported, bundle ID: `com.rakibhasan2.giftguru`)




# Project Structure

## Root Layout
```
app/                    # Expo Router screens (file-based routing)
components/             # Reusable UI components
redux/                  # State management (RTK + RTK Query)
hooks/                  # Custom React hooks
constants/              # Static data, asset maps, mock data
utils/                  # Helper functions and service wrappers
assets/                 # Fonts, images, icons
types/                  # Shared TypeScript type definitions
tests/                  # Test files mirroring source structure
```

## App Directory (Routing)
```
app/
├── _layout.tsx                  # Root layout: Redux Provider, PersistGate, AuthGuard, fonts
├── (auth)/                      # Unauthenticated route group (sign-in, sign-up, etc.)
├── (drawer)/                    # Authenticated route group
│   ├── _layout.tsx              # Drawer navigator
│   └── (tabs)/                  # Bottom tab navigator
│       ├── _layout.tsx
│       ├── index.tsx            # Home/feed screen
│       ├── profile.tsx
│       └── create-post.tsx
├── dashboard.tsx
├── membership.tsx               # Subscription/paywall screen
├── my-wish-list.tsx
├── notifications.tsx
├── search-with-filter.tsx
├── trending-now.tsx
├── recommended.tsx
├── profile-setting.tsx
├── change-password.tsx
└── global.css                   # NativeWind global styles
```

## Components
```
components/
├── home/                        # Feed/home-specific components
│   ├── SocialPost.tsx
│   ├── ProductCard.tsx
│   ├── CustomDrawer.tsx
│   ├── HomeHeader.tsx
│   └── ...
├── notifications/
│   └── NotificationItem.tsx
├── search/
│   ├── FilterModal.tsx
│   └── EmptyState.tsx
├── CustomInput.tsx              # Form input components
├── GradientButton.tsx           # Reusable gradient CTA button
├── CreatePostSheet.tsx          # Bottom sheet for post creation
├── EditPostSheet.tsx
└── SplashScreen.tsx
```

## Redux
```
redux/
├── store.ts                     # Store config with redux-persist
├── hooks.ts                     # useAppDispatch / useAppSelector
├── storage.ts                   # SecureStore adapter for redux-persist
├── api/
│   └── baseApi.ts               # RTK Query base with JWT refresh logic
└── features/
    ├── auth/                    # authSlice + authApi
    ├── child/                   # childSlice
    ├── revenuecat/              # revenuecatSlice (premium status)
    ├── posts/                   # postApi
    ├── profileService/          # profileApi, milestone, documents
    ├── notifications/           # notificationApi
    ├── expenseService/
    ├── scheduleService/
    ├── subscriptionService/
    └── supportService/
```

## Key Conventions

### Adding a new API endpoint
Inject into `baseApi` using `baseApi.injectEndpoints()` in the relevant feature file. Do not create separate `createApi` instances.

### Adding a new Redux slice
Create under `redux/features/<featureName>/`, then register in `redux/store.ts` `rootReducer`. Add to `whitelist` in `persistConfig` only if it needs to survive app restarts.

### Adding a new screen
Create a `.tsx` file in `app/`. For authenticated screens, place inside `(drawer)/`. For auth flow screens, place inside `(auth)/`. Expo Router picks up the file automatically.

### Path aliases
Use `@/` as the root alias (configured in `tsconfig.json`). Always prefer `@/components/...` over relative paths.

### Asset references
Static assets are mapped in `constants/index.ts` (tab icons, home assets, notification icons). Import from there rather than using raw `require()` paths in components.




# Tech Stack

## Framework & Runtime
- **Expo** ~54.0.31 with **Expo Router** ~6.0.21 (file-based routing)
- **React Native** 0.81.5 / **React** 19.1.0
- New Architecture enabled (`newArchEnabled: true`)
- React Compiler enabled (`reactCompiler: true`)

## Language
- TypeScript ~5.9.2 — strict typing expected throughout

## Styling
- **NativeWind** ^4.2.1 (Tailwind CSS for React Native)
- **Tailwind CSS** ^3.4.19
- Custom theme defined in `tailwind.config.js`:
  - Primary: `#2B7FFF`, Secondary: `#7CB0FF`
  - Font family: Quicksand (Regular, Medium, SemiBold, Bold, Light)
- Use NativeWind `className` props for styling; avoid inline StyleSheet unless necessary

## State Management
- **Redux Toolkit** ^2.11.2 with **redux-persist** ^6.0.0
- **RTK Query** via a single `baseApi` in `redux/api/baseApi.ts`
- Persisted slices: `auth`, `child`, `revenuecat` (stored via `expo-secure-store`)
- Always use typed hooks: `useAppDispatch` and `useAppSelector` from `redux/hooks.ts`

## Navigation
- Expo Router file-based routing with typed routes enabled
- Route groups: `(auth)` for unauthenticated screens, `(drawer)/(tabs)` for authenticated app
- Auth guard lives in `app/_layout.tsx` (`AuthGuard` component)

## Networking
- RTK Query with `baseQueryWithReauth` — handles JWT refresh on 401 automatically
- Base URL from `EXPO_PUBLIC_API_URL` env variable
- Bearer token injected via `prepareHeaders`; public endpoints skip auth

## Key Libraries
| Library | Purpose |
|---|---|
| `react-native-purchases` + `react-native-purchases-ui` | RevenueCat in-app purchases |
| `@react-native-google-signin/google-signin` | Google OAuth |
| `expo-secure-store` | Secure token/state persistence |
| `react-native-reanimated` ~4.1.1 | Animations |
| `react-native-gesture-handler` ~2.28.0 | Gesture support |
| `react-native-keyboard-controller` | Keyboard handling |
| `expo-linear-gradient` | Gradient UI elements |
| `expo-image` | Optimized image rendering |
| `expo-image-picker` | Camera/gallery access |
| `react-native-toast-message` | Toast notifications |
| `react-native-gifted-charts` | Charts/graphs |
| `reactotron-react-native` | Dev debugging (DEV only) |
| `clsx` | Conditional className utility |

## Environment Variables
Stored in `.env.local`. Expo public vars use `EXPO_PUBLIC_` prefix.
- `EXPO_PUBLIC_API_URL` — backend base URL
- `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` — RevenueCat Android API key

## Common Commands
```bash
# Start dev server
npx expo start

# Run on Android (development build — required for native modules)
npm run android
# or
npx expo run:android

# Run on iOS
npx expo run:ios

# Lint
npm run lint

# Prebuild native code (run after adding/changing native plugins)
npx expo prebuild --clean

# Build Android release bundle
cd android && ./gradlew bundleRelease
```

> Note: `react-native-purchases` is a native module — it does NOT work with Expo Go. Always use a development build (`expo run:android`).
