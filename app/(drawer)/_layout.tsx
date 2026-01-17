import CustomDrawer from "@/components/home/CustomDrawer";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props: DrawerContentComponentProps) => (
          <CustomDrawer {...props} />
        )}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: "75%",
          },
          drawerType: "front",
          overlayColor: "rgba(0,0,0,0.5)",
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Home",
          }}
        />
        {/* You can add more drawer-specific screens here if needed */}
      </Drawer>
    </GestureHandlerRootView>
  );
}
