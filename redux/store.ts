// src/app/redux/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import revenuecatReducer from "./features/revenuecat/revenuecatSlice";
import childReducer from "./features/child/childSlice";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createTransform,
} from "redux-persist";
import secureStorage from "./storage";
import { baseApi } from "./api/baseApi";

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  child: childReducer,
  revenuecat: revenuecatReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const authTransform = createTransform(
  (inboundState: any, key) => {
    if (key === "auth" && inboundState.rememberMe === false) {
      return {
        ...inboundState,
        user: null,
        token: null,
        refreshToken: null,
      };
    }
    return inboundState;
  },
  (outboundState, key) => outboundState,
  { whitelist: ["auth"] }
);

// Persist config
const persistConfig = {
  key: "root",
  version: 1,
  storage: secureStorage, // Use SecureStore
  whitelist: ["auth", "child", "revenuecat"], // Persist auth, child, and premium status
  keyPrefix: "persist_", // Use underscore instead of colon for SecureStore compatibility
  transforms: [authTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer as any) as unknown as typeof rootReducer;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
