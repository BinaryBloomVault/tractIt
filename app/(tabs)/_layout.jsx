import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "#00BEE5", headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home-variant"
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="addButton"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={30} name="plus-circle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-sharp" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
