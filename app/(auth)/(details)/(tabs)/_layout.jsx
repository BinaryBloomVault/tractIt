import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { Text, StyleSheet, Pressable, View } from "react-native";
export default function TabLayout() {
  return (
    <Tabs>
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
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="writeReceipt"
        options={{
          tabBarStyle: { display: "none" },
          tabBarLabel: "",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={30} name="plus-circle" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-sharp" size={30} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
