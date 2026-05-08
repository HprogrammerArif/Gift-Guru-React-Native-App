// src/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Toast from "react-native-toast-message"; // or your toast library
import { logout, updateToken } from "../features/auth/authSlice";
import { RootState } from "../store";

export const API_IMAGE_URL = "https://api.findrya.co.uk";
// export const API_IMAGE_URL = "http://10.10.13.61:8002"

const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  "https://api.findrya.co.uk"
)
  .replace(/"/g, "")
  .replace(/\/$/, "");
export const baseUrl = API_URL;
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  timeout: 15000, // 15 seconds timeout
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Skip token for public endpoints
    const skipAuth = [
      "login",
      "register",
      "refreshToken",
      "verify-email",
      "confirm",
      "legal-privacy/",
    ].includes(endpoint);
    if (skipAuth) return headers;

    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: any = async (
  args: any,
  api: any,
  extraOptions: any,
) => {
  const requestUrl = typeof args === "string" ? args : args.url;
  if (__DEV__) console.log(`[RTK Query] 📡 Requesting: ${API_URL}/${requestUrl}`);

  let result = await baseQuery(args, api, extraOptions);

  const is403Error = result.error?.status === 403;

  if (__DEV__) {
    if (result.error) {
      if (!is403Error) console.log(`[RTK Query] ❌ Error for ${requestUrl}:`, result.error);
    } else {
      console.log(`[RTK Query] ✅ Success for ${requestUrl}:`, result.data);
    }
  }

  // Handle known errors
  if (result.error?.status === 401) {
    if (__DEV__) console.log("Token expired — attempting refresh");

    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (!refreshToken) {
      if (__DEV__) console.log("No refresh token available - logging out");
      api.dispatch(logout());
      return result;
    }

    try {
      const refreshResult = await fetch(`${API_URL}/api/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const data = await refreshResult.json();

      if (refreshResult.ok || data?.access) {
        const user = (api.getState() as RootState).auth.user;

        if (!user) {
          api.dispatch(logout());
          return result;
        }

        // Update token in store
        api.dispatch(
          updateToken({
            token: data.access,
          }),
        );

        // Retry original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        throw new Error("Refresh failed");
      }
    } catch (error) {
      if (__DEV__) console.log("Refresh failed — logging out");
      api.dispatch(logout());
      Toast.show({
        type: "error",
        text1: "Session expired. Please log in again.",
      });
    }
  }

  // Optional: global error handling
  if (result.error) {
    const message =
      (result.error.data as any)?.message || "Something went wrong";
    const isApproveRejectEndpoint = requestUrl?.includes("/expenses/approve/");
    const is403Error = result.error.status === 403;

    // Don't show toast for expected 403 errors on approve/reject (handled in UI)
    if (result.error.status === 403) {
      Toast.show({ type: "error", text1: message });
    } else if (result.error.status === 404) {
      // Toast.show({ text1: message, type: "error" });
      console.log("404 error", message);
    } else if (
      typeof result.error.status === "number" &&
      result.error.status >= 500
    ) {
      Toast.show({
        type: "error",
        text1: "Server error. Please try again later.",
      });
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Child",
    "Message",
    "Expense",
    "Schedule",
    "documents",
    "Profile",
    "Onboarding",
    "Children",
    "PendingInvitations",
    "Milestones",
    "NotificationPreferences",
    "NotificationHistory",
    "NotificationCount",
    "HomeScreenSentimentGraph",
    "LegalAndPrivacyPolicy",
    "Posts",
    "Categories",
    "Occasions",
    "Comments",
    "Follows",
    "SavedPosts",
    "Likes",
    "Wishlists",
    "Subscription",
    "BlockedUsers",
    "CoParentProfile"
  ],
  endpoints: () => ({}),
});
