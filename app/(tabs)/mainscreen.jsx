import { View, Text, StyleSheet, Pressable, Button } from "react-native";
import React from "react";
import Receipt from "../../components/card/receiptCard";
import Mainscreen from "../../components/mainscreen";
import data from "../../mockData/mockData";
import { Card } from "@rneui/themed";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
const index = () => {
  return (
    <GestureHandlerRootView style={styles.mainactivity}>
      <Mainscreen />
    </GestureHandlerRootView>
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
