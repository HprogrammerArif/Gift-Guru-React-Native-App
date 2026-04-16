import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';

// ─── State Type ──────────────────────────────────────────────────────────────

interface RevenueCatState {
  /** Is the user currently subscribed to a premium plan? */
  isPremium: boolean;
  /** Which entitlement is active (e.g. "premium") */
  entitlementId: string | null;
  /** When the subscription expires (ISO date string). Null = lifetime or not subscribed. */
  expirationDate: string | null;
  /** True while checking subscription status */
  isLoading: boolean;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: RevenueCatState = {
  isPremium: false,
  entitlementId: null,
  expirationDate: null,
  // NOTE: Must be false — this state is persisted to disk via redux-persist.
  // If true were persisted, the membership screen would be stuck loading on cold start.
  isLoading: false,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const revenuecatSlice = createSlice({
  name: 'revenuecat',
  initialState,
  reducers: {
    /**
     * Call this when we confirm the user has premium access.
     */
    setPremiumStatus(
      state,
      action: PayloadAction<{
        isPremium: boolean;
        entitlementId?: string | null;
        expirationDate?: string | null;
      }>
    ) {
      state.isPremium = action.payload.isPremium;
      state.entitlementId = action.payload.entitlementId ?? null;
      state.expirationDate = action.payload.expirationDate ?? null;
      state.isLoading = false;
    },

    /**
     * Call this when loading subscription status.
     */
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    /**
     * Call this when user logs out — clear premium state.
     */
    clearPremiumStatus(state) {
      state.isPremium = false;
      state.entitlementId = null;
      state.expirationDate = null;
      state.isLoading = false;
    },
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const { setPremiumStatus, setLoading, clearPremiumStatus } =
  revenuecatSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectIsPremium = (state: RootState) =>
  state.revenuecat.isPremium;

export const selectRevenueCatLoading = (state: RootState) =>
  state.revenuecat.isLoading;

export const selectExpirationDate = (state: RootState) =>
  state.revenuecat.expirationDate;

// ─── Reducer ──────────────────────────────────────────────────────────────────

export default revenuecatSlice.reducer;
