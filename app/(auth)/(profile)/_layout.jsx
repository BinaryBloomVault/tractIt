import React from "react";
import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="friendList"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="changeEmail"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="changePassword"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen name="addFriends" />
    </Stack>
  );
}
