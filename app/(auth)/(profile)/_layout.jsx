import React from "react";
import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen
        name="friendList"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="email" />
      <Stack.Screen name="password" options={{ title: "Change Password" }} />
      <Stack.Screen name="addFriends" />
      <Stack.Screen name="userDetails" options={{ title: "User Details" }} />
    </Stack>
  );
}
