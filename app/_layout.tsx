import SplashScreenView from "@/components/SplashScreen";
import { selectCurrentToken, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { setPremiumStatus } from "@/redux/features/revenuecat/revenuecatSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addCustomerInfoListener, initializeRevenueCat, loginRevenueCat, logOutRevenueCat } from "@/utils/revenuecat";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { useFonts } from "expo-font";
import { useKeepAwake } from "expo-keep-awake";
import {
  SplashScreen,
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar"; // Better for Expo apps
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Performance critical
import { KeyboardProvider } from "react-native-keyboard-controller";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../redux/store";
import "./global.css";
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#2B7FFF" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "600",
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 15,
      }}
      text2Style={{
        fontSize: 13,
      }}
    />
  ),
  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#facc15" }} // Yellow color for warning
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "600",
      }}
    />
  ),
};

// --- NAVIGATION GUARD COMPONENT ---
function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = useAppSelector(selectCurrentToken);
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

    useEffect(() => {
      GoogleSignin.configure({
        webClientId: "121177195587-epvcsmto6nlmnrbif9q9u2c39tl2vl4v.apps.googleusercontent.com",
      });
     }, []);

  useEffect(() => {
    // 1) Wait for Expo Router navigation state to fully initialize
    if (!navigationState?.key) return;

    // 2) Check if the user is in the (auth) group
    const inAuthGroup = segments[0] === "(auth)";

    // 3) Handle routing based on Auth state
    if (!token && !inAuthGroup) {
      // ❌ No token and trying to access app -> Send to Login
      router.replace("/(auth)/sign-in");
    } else if (token && inAuthGroup) {
      // ✅ Has token and trying to access Login -> Send to Home
      router.replace("/(drawer)/(tabs)");
    }
  }, [token, segments, navigationState?.key]);

  return <>{children}</>;
}

if (__DEV__) {
  require("../ReactotronConfig");
}

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {});

// Inner component — can safely use Redux hooks because <Provider> is above it
function AppLayout() {
  useKeepAwake();
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectCurrentToken);
  const user = useAppSelector(selectCurrentUser);
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  // ── RevenueCat: initialize and listen for subscription changes ──
  useEffect(() => {
    // Configure RevenueCat ONCE using the persisted user ID
    initializeRevenueCat(user?.user_id ? String(user.user_id) : undefined).catch(console.error);

    const removeListener = addCustomerInfoListener((customerInfo) => {
      const premiumEntitlement = customerInfo.entitlements.active['premium'];
      dispatch(
        setPremiumStatus({
          isPremium: premiumEntitlement !== undefined,
          entitlementId: premiumEntitlement?.identifier ?? null,
          expirationDate: premiumEntitlement?.expirationDate ?? null,
        })
      );
    });

    return () => {
      removeListener();
    };
  }, []); // Run only once on mount to avoid configuring multiple times

  // Listen for login events and tie RevenueCat purchases to the user ID
  useEffect(() => {
    if (user?.user_id) {
       loginRevenueCat(String(user.user_id)).catch(console.error);
    } else {
       logOutRevenueCat().catch(console.error);
    }
  }, [user?.user_id]);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded || !appIsReady) {
    return <SplashScreenView />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ActionSheetProvider>
        <AuthGuard>
          <KeyboardProvider statusBarTranslucent={true}>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "white" },
                animation: "fade_from_bottom",
              }}
            >
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            </Stack>
            <Toast config={toastConfig} />
          </KeyboardProvider>
        </AuthGuard>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}

// Outer component — only provides the Redux store & persistence layer
export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppLayout />
      </PersistGate>
    </Provider>
  );
}
