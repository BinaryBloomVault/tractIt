import { View, Text, StyleSheet, Pressable, Button } from "react-native";
import React from "react";
import Receipt from "../../components/card/receiptCard";
import TotalCard from "../../components/totalPayment";
import FriendList from "./friendList";
import Login from "./login";
const index = () => {
  return (
    //Receipt Card
    <View style={styles.mainactivity}>
      {/* <Receipt />
      <TotalCard /> */}
      {/* <FriendList /> */}
      <Login />
    </View>
  );
};

const styles = StyleSheet.create({
  mainactivity: {
    flex: 1,
  },
  font: {
    fontSize: 20,
  },
});

export default index;
