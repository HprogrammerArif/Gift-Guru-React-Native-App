// app/(tabs)/_layout.tsx
import NoRippleTabButton from "@/components/no-rippler-pressable";
import { TabBarIcon } from "@/components/TabBarIcon";
import { tabIcons } from "@/constants";
import { Tabs } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: (props : any) => <NoRippleTabButton {...props} />,
        tabBarHideOnKeyboard: true,
        
        tabBarStyle: {
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0.5,
          borderTopColor: "#F2F2F2",
          elevation: 0, // Remove shadow on Android
          
         
          flexDirection: 'row',
          justifyContent: "space-between",
         width: "100%",
        },
        tabBarItemStyle: {
           flex: 1, 
          padding: 0,
           justifyContent: 'center',
    alignItems: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={tabIcons.homeBlack}
              title="Home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create-post"
        options={{
          title: "Create Post",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={tabIcons.scheduleBlack}
              title="Create Post"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={tabIcons.profileBlack}
              title="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
}
