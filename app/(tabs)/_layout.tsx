// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";
import NoRippleTabButton from "@/components/no-rippler-pressable";
import { TabBarIcon } from "@/components/TabBarIcon";
import { tabIcons } from "@/constants";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        //   tabBarButton: (props) => (
        //   <TouchableOpacity {...props} activeOpacity={1} />
        // ),

        tabBarButton: (props) => <NoRippleTabButton {...props} />,
        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          height: 105,
          paddingBottom: 20,
          paddingTop: 20,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0.5,
          borderTopColor: "#F2F2F2",
        },
        tabBarItemStyle: {
          padding: 0,
          elevation: 0,
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
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={tabIcons.scheduleBlack}
              title="Schedule"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: "Message",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={tabIcons.messageBlack}
              title="Message"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="expense"
        options={{
          title: "Expense",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={tabIcons.expenseBlack}
              title="Expense"
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
