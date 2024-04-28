import { View, Text, StyleSheet, Pressable, Button } from "react-native";
import React from "react";
import Receipt from "../../components/receiptCard";
import Mainscreen from "../../components/mainscreen";
import data from "../../mockData/mockData";
import { Card } from "@rneui/themed";

const index = () => {
  return (
    <View style={styles.mainactivity}>
      <Mainscreen />
    </View>
  );
};

const styles = StyleSheet.create({
  mainactivity: {
    backgroundColor: "#A9DFBF",
    flex: 1,
  },
  font: {
    fontSize: 20,
  },
});

export default index;
