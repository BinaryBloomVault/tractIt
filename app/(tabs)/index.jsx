import { View, Text, StyleSheet, Pressable, Button } from "react-native";
import React from "react";
import Receipt from "../../components/receiptCard";
import TotalCard from "../../components/totalPayment";

const index = () => {
  return (
    <View style={styles.mainactivity}>
      <Receipt />
      <TotalCard />
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
