import { View, Text, StyleSheet, Pressable, Button } from "react-native";
import React from "react";
import Receipt from "../../components/receiptCard";
import data from "../../mockData/mockData";
import { Card } from "@rneui/themed";

const index = () => {
  return (
    <View style={styles.mainactivity}>
      <Receipt />
      <View style={{ position: "absolute", top: 600, left: 108 }}>
        <Card
          containerStyle={{
            borderRadius: 10,
            width: 144,
            height: 80,
            shadowColor: "#171717",
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
          }}
        >
          <View style={styles.font}>
            <Text>Your Total Payment</Text>
          </View>
        </Card>
      </View>
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
