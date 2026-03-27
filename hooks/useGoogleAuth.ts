import { useGoogleLoginMutation } from "@/redux/features/auth/authApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useCallback } from "react";
import { Alert } from "react-native";

/**
 * Custom hook to handle Google Authentication flow.
 * Centralizes signOut, signIn, API call, and state updates.
 */
export const useGoogleAuth = () => {
  const [googleLoginMutation, { isLoading }] = useGoogleLoginMutation();
  const dispatch = useAppDispatch();

  const handleGoogleLogin = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();

      // Force account picker by signing out first
      try {
        await GoogleSignin.signOut();
      } catch (err) {
        // Ignore "not signed in" errors
      }

      const response = await GoogleSignin.signIn();
      const idToken = response?.data?.idToken;
      const user = response?.data?.user;

      if (!idToken) {
        throw new Error("No ID token found from Google");
      }

      const apiResponse: any = await googleLoginMutation({
        idToken,
        email: user?.email,
        first_name: user?.givenName ?? undefined,
        last_name: user?.familyName ?? undefined,
      });

      if (apiResponse?.data) {
        dispatch(
          setCredentials({
            user: apiResponse.data.user,
            token: apiResponse.data.access,
            refreshToken: apiResponse.data.refresh,
            device_token: apiResponse.data.device_token || "",
          }),
        );
        router.replace("/(drawer)/(tabs)");
      } else if (apiResponse?.error) {
        const errorData = apiResponse.error?.data;
        Alert.alert(
          "Google Login Failed",
          errorData?.error || "Invalid credentials. Please try again.",
        );
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the flow - usually no alert needed
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Sign In Progress", "Google Sign-In is already in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Error", "Google Play Services are not available.");
      } else {
        console.error("Google Login Error:", error);
        Alert.alert(
          "Google Login Error",
          error.message || "An unexpected error occurred during Google Sign-In.",
        );
      }
    }
  }, [googleLoginMutation, dispatch]);

  return {
    handleGoogleLogin,
    isGoogleLoading: isLoading,
  };
};
