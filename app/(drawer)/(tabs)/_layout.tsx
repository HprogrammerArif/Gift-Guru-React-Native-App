import CreatePostSheet from "@/components/CreatePostSheet";
import NoRippleTabButton from "@/components/no-rippler-pressable";
import { TabBarIcon } from "@/components/TabBarIcon";
import { tabIcons } from "@/constants";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarButton: (props: any) => <NoRippleTabButton {...props} />,
          tabBarHideOnKeyboard: true,

          tabBarStyle: {
            height: 70 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
            paddingTop: 10,
            // backgroundColor: "#FFFFFF", // Removed as per instruction's code edit
            borderTopWidth: 0.5,
            borderTopColor: "#F2F2F2",
            elevation: 0, // Remove shadow on Android

            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          },
          tabBarItemStyle: {
            flex: 1,
            padding: 0,
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} icon={tabIcons.homeBlack} />
            ),
          }}
        />

        <Tabs.Screen
          name="create-post"
          listeners={() => ({
            tabPress: (e: any) => {
              e.preventDefault();
              setIsCreatePostOpen(true);
            },
          })}
          options={{
            // title: "Create Post", // Removed as per instruction's code edit
            tabBarIcon: ({ focused }) => (
              <View
                className="w-16 h-16 rounded-full items-center justify-center bg-[#2B7FFF] shadow-lg border-4 border-white mb-8"
                style={{
                  shadowColor: "#171717",
                  shadowOffset: { width: 6, height: 8 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 10,
                }}
              >
                <Image
                  source={tabIcons.createIcon}
                  style={{ width: 24, height: 24, tintColor: "white" }}
                  contentFit="contain"
                />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} icon={tabIcons.profileBlack} />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              // Prevent default navigation
              e.preventDefault();
              // Navigate to profile without any params
              navigation.navigate("profile", { id: undefined });
            },
          })}
        />
      </Tabs>

      <CreatePostSheet
        visible={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </>
  );
}
