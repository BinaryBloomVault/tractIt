import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import Mainscreen from "../../../components/mainscreen";
import { useAuthStore } from "../../../zustand/zustand";

const Landingscreen = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const localUserData = useAuthStore((state) => state.localUserData);

  useEffect(() => {
    if (localUserData) {
      setDataLoaded(true);
    }
  }, [localUserData]);

  if (!dataLoaded) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require("../../../assets/images/friends.png")}
          style={styles.splashImage}
        />
      </View>
    );
  }

  return (
    <View style={styles.mainactivity}>
      <Mainscreen />
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  splashImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  mainactivity: {
    flex: 1,
    backgroundColor: "#A9DFBF",
  },
});

export default Landingscreen;
