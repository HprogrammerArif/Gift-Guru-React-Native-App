import SplashScreenView from "@/components/SplashScreen";
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
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, RootState, store } from "../redux/store";
import "./global.css";

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
  const { token } = useSelector((state: RootState) => state.auth);
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

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

export default function RootLayout() {
  useKeepAwake();
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded) {
          // reveal custom splash
          await SplashScreen.hideAsync();
          // Give it that "premium" delay
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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ActionSheetProvider>
            {/* 2. statusBarTranslucent={true} makes keyboard animations perfect on Android */}
            <AuthGuard>
              <KeyboardProvider statusBarTranslucent={true}>
                {/* 3. Explicitly set your global status bar style */}
                <StatusBar style="dark" />

                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "white" },
                    // Enable native stack animations
                    animation: "fade_from_bottom",
                  }}
                >
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(drawer)"
                    options={{ headerShown: false }}
                  />
                </Stack>
                <Toast config={toastConfig} />
              </KeyboardProvider>
            </AuthGuard>
          </ActionSheetProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
