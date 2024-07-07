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
      />
      <Stack.Screen
        name="email"
      />
      <Stack.Screen
        name="password"
      />
      <Stack.Screen
       name="addFriends"
       />
    </Stack>
  );
}
