// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type TUser = {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
};

export type TAuthState = {
  user: TUser | null;
  role: string | null;
  token: string | null;
  refreshToken: string | null;
  device_token: string | null;
};

const initialState: TAuthState = {
  user: null,
  role: null,
  token: null,
  refreshToken: null,
  device_token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Used by login / signup / otp verification
    setCredentials: (
      state,
      action: PayloadAction<{
        user: Omit<TUser, "role">;
        role: string;
        token: string;
        refreshToken: string;
        device_token: string;
      }>,
    ) => {
      const { user, role, token, refreshToken, device_token } = action.payload;
      state.user = { ...user, role };
      state.token = token;
      state.refreshToken = refreshToken;
      state.device_token = device_token;
    },

    // Used by token refresh (only updates token)
    updateToken: (
      state,
      action: PayloadAction<{ token: string; refreshToken?: string }>,
    ) => {
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },

    // Full logout — clears everything
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.refreshToken = null;
      state.device_token = null;
    },

    // For partial updates to onboarding flags
    // updateOnboardingStatus: (
    //   state,
    //   action: PayloadAction<{ isAddChild?: boolean; isSendInvite?: boolean }>
    // ) => {
    //   if (action.payload.isAddChild !== undefined) {
    //     state.isAddChild = action.payload.isAddChild;
    //   }
    //   if (action.payload.isSendInvite !== undefined) {
    //     state.isSendInvite = action.payload.isSendInvite;
    //   }
    // },

    // Update device token
    updateDeviceToken: (
      state,
      action: PayloadAction<{ device_token: string }>,
    ) => {
      state.device_token = action.payload.device_token;
    },
  },
});

export const { setCredentials, updateToken, logout,  updateDeviceToken } = authSlice.actions;

export default authSlice.reducer;

// Selectors (use these everywhere)
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentRefreshToken = (state: RootState) =>
  state.auth.refreshToken;
export const selectCredentials = (state: RootState) => state.auth;
export const selectDeviceToken = (state: RootState) => state.auth.device_token;

// Add to authSlice.ts — extra selector
export const selectUserName = (state: RootState) => {
  const user = state.auth.user;
  if (user?.first_name || user?.last_name) {
    return `${user.first_name || ""} ${user.last_name || ""}`.trim();
  }
  return user?.username || user?.email?.split("@")[0] || "Parent";
};
