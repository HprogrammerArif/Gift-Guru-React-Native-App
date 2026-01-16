import SplashScreenView from "@/components/SplashScreen";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { useFonts } from "expo-font";
import { useKeepAwake } from "expo-keep-awake";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar"; // Better for Expo apps
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Performance critical
import { KeyboardProvider } from "react-native-keyboard-controller";
import "./global.css";

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
    // 1. GestureHandlerRootView should be the very outside for best performance
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ActionSheetProvider>
        {/* 2. statusBarTranslucent={true} makes keyboard animations perfect on Android */}
        <KeyboardProvider statusBarTranslucent={true}>
          {/* 3. Explicitly set your global status bar style */}
          <StatusBar style="dark" />
          
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "white" },
              // Enable native stack animations
              animation: 'fade_from_bottom' 
            }}
          >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </KeyboardProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}