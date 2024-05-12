import { Stack, router, Tabs } from "expo-router";
import { Text, StyleSheet, Pressable, View } from "react-native";

export default () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="list" />
      <Stack.Screen name="friendList" options={{ headerShown: false }} />
    </Stack>
  );
};
