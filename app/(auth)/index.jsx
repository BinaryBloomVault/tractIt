import { View, Text, StyleSheet, Pressable, Button } from "react-native";
import React from "react";
import Mainscreen from "../../components/mainscreen";

const index = () => {
  return (
    <View style={styles.mainactivity}>
      <Mainscreen />
    </View>
  );
};

const styles = StyleSheet.create({
  mainactivity: {
    flex: 1,
    backgroundColor: "#A9DFBF",
  },
  font: {
    fontSize: 20,
  },
});

export default index;
