// app/(auth)/forgetpass/_layout.tsx
import { Stack } from "expo-router";

export default function ForgetPassLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,        // ← kills the header for ALL screens in this group
       
      }}
    />
  );
}