import React, { useState, useEffect } from "react";
import {
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useAuthStore } from "../../../zustand/zustand";
import { TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.localUserData?.uid);
  const sharedReceipts = useAuthStore((state) => state.sharedReceipts);
  const screenWidth = Dimensions.get("window").width;
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (sharedReceipts && Object.keys(sharedReceipts).length > 0) {
      setDataLoaded(true);
    }
  }, [sharedReceipts]);

  return (
    <Tabs>
      <Tabs.Screen
        name="landingscreen"
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
          tabBarStyle: dataLoaded ? {} : { display: "none" },
        }}
      />
      <Tabs.Screen
        name="writeReceipt"
        options={{
          tabBarLabel: "",
          headerShown: false,
          tabBarStyle: { display: "none" },
          tabBarButton: (props) => (
            <View
              style={[
                styles.tabBarButtonContainer,
                {
                  width: screenWidth / 3,
                },
              ]}
            >
              <TouchableOpacity
                {...props}
                style={styles.plusButton}
                onPress={() =>
                  router.push({
                    pathname: "/writeReceipt",
                    params: {
                      originatorId: userId,
                    },
                  })
                }
              >
                <FontAwesome size={45} name="plus-circle" color={props.color} />
              </TouchableOpacity>
            </View>
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
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 55,
  },
  plusButton: {
    position: "absolute",
    bottom: 10,
    alignItems: "center",
    justifyContent: "center",
    border: "blue",
  },
});
