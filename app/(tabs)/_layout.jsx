import { Stack, router, Tabs } from "expo-router";
import { Text, StyleSheet, Pressable, View } from "react-native";

export default () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="list" />
    </Stack>
  );
};
