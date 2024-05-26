import React from "react";
import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="friendList"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
