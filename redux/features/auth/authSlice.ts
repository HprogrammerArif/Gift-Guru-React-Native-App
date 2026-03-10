// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type TUser = {
  user_id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
};

export type TAuthState = {
  user: TUser | null;
  token: string | null;
  refreshToken: string | null;
  device_token: string | null;
};


// {
//     "message": "Login Successful",
//     "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MTc1NDEwOCwiaWF0IjoxNzczMTE0MTA4LCJqdGkiOiJmYTFkYWYwN2I1YjM0M2YyOTMwYTZjYmM4ZDY5MjU4NiIsInVzZXJfaWQiOiIxMyJ9.aJRyTTaRxWG7E8ACN8doe-Ut1Em_6cFtGBp_hX0QdgM",
//     "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzczMTQ0MTA4LCJpYXQiOjE3NzMxMTQxMDgsImp0aSI6Ijg1N2RjZDBjODZmNDQwY2E5Y2QxZWM2N2Q4M2U3NjZhIiwidXNlcl9pZCI6IjEzIiwiZmlyc3RfbmFtZSI6Ik1vaGFtbWVkIiwibGFzdF9uYW1lIjoiQXJpZiIsImVtYWlsIjoicmFraWJoYXNhbmNvZGVzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIn0.GkEigSDAeUsbbeVeyoGCpeF1q5CY9a2q0H_FNEjqPD0",
//     "user": {
//         "user_id": 13,
//         "first_name": "Mohammed",
//         "last_name": "Arif",
//         "email": "rakibhasancodes@gmail.com",
//         "role": "user"
//     }
// }

const initialState: TAuthState = {
  user: null,
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
        user: TUser;
        token: string;
        refreshToken: string;
        device_token: string;
      }>,
    ) => {
      const { user, token, refreshToken, device_token } = action.payload;
      state.user = user;
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
  return user?.email?.split("@")[0] || "Parent";
};
