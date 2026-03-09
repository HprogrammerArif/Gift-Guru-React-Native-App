// src/app/redux/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
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
} from "redux-persist";
import secureStorage from "./storage";
import { baseApi } from "./api/baseApi";

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  child: childReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

// Persist config
const persistConfig = {
  key: "root",
  version: 1,
  storage: secureStorage, // Use SecureStore
  whitelist: ["auth", "child"], // Persist only auth and child states, not the API cache
  keyPrefix: "persist_", // Use underscore instead of colon for SecureStore compatibility
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
