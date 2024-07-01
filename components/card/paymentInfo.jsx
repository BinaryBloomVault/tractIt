import { View, Text, StyleSheet } from "react-native";
import { Input, Button, Card } from "@rneui/themed";
import React from "react";

const PaymentInfo = () => {
  return (
    <Card containerStyle={styles.cardContainer}>
      <View style={styles.font}>
        <Text style={styles.text}>Your Total Payment</Text>
        <Text style={styles.total}>500</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: "absolute",
    top: 0,
    borderRadius: 10,
    width: 150,
    height: 80,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  font: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 13,
    color: "#888",
    fontFamily: "Gudea-Regular",
  },

  total: {
    fontSize: 40,
    fontFamily: "Gudea-Bold",
  },
});
export default PaymentInfo;
