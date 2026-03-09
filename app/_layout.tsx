import SplashScreenView from "@/components/SplashScreen";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { useFonts } from "expo-font";
import { useKeepAwake } from "expo-keep-awake";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar"; // Better for Expo apps
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Performance critical
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../redux/store";
import { RootState } from "../redux/store";
import "./global.css";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";


const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#2B7FFF' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600'
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 15
      }}
      text2Style={{
        fontSize: 13
      }}
    />
  ),
  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#facc15' }} // Yellow color for warning
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600'
      }}
    />
  )
};



// --- NAVIGATION GUARD COMPONENT ---
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, isAddChild, isSendInvite } = useSelector((state: RootState) => state.auth);
  const segments = useSegments();
  const router = useRouter();


  useEffect(() => {
    // Check if the user is in the (auth) group
    const inAuthGroup = segments[0] === "(auth)";
    // const isAddChild = segments[0] === "(tabs)/add-child";
    // const isAddChild = true;
    // const isSendInvite = true;
    

    console.log("isAddChild", isAddChild);
    console.log("isSendInvite", isSendInvite);

    if (!token && !inAuthGroup) {
      // ❌ No token and trying to access app -> Send to Login
      // router.replace("/(auth)/sign-in");
      router.replace("/(auth)/welcome");
    } else if (token && inAuthGroup && isAddChild === false) {
      // ✅ Has token and trying to access Login -> Send to Home
      router.replace("/(auth)/add-child");
    } else if (token && inAuthGroup && isAddChild === true && isSendInvite === false) {
      // ✅ Has token and trying to access Login -> Send to Home
      router.replace("/(auth)/invite-coparent");
    } else if (token && inAuthGroup && isAddChild === true && isSendInvite === true) {
      // ✅ Has token and trying to access Login -> Send to Home
      router.replace("/(tabs)");
    }
  }, [token, segments]);

  return <>{children}</>;
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
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
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
