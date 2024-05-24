import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useSegments, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Gudea-Bold": require("../assets/fonts/Gudea-Bold.ttf"),
    "Gudea-Regular": require("../assets/fonts/Gudea-Regular.ttf"),
    "Cabin-Regular": require("../assets/fonts/Cabin-Regular.ttf"),
    ...FontAwesome.font,
  });

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  //Change this so that ang onAuthStateChanged kay ma butang sa Zustand and have isLogin or isLogout
  // para ika isa ra siya ma call if naay changes ra sa state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userData) => {
      if (userData && segments[0] !== "(auth)") {
        router.replace("(auth)");
      } else if (!userData && segments[0] === "(auth)") {
        router.replace("/");
      }
    });

    return unsubscribe;
  }, [segments]);

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}
