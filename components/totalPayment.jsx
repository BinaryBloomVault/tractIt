import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Card, Button } from "@rneui/themed";
import TabButton from "./button/tabRoundButton";
const TotalPayment = () => {
  return (
    <View style={styles.container}>
      <Card containerStyle={styles.cardContainer}>
        <View style={styles.font}>
          <Text style={styles.text}>Your Total Payment</Text>
          <Text style={styles.total}>500</Text>
        </View>
      </Card>

      <View
        style={{
          position: "absolute",
          bottom: 100,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Button
          title="Add"
          titleStyle={{
            fontWeight: "700",
            fontSize: 20,
            fontFamily: "Gudea-Bold",
          }}
          buttonStyle={{
            backgroundColor: "#00BEE5",
            borderColor: "transparent",
            borderRadius: 30,
          }}
          containerStyle={{
            width: 150,
            padding: 15,
            shadowColor: "#171717",
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.7,
            shadowRadius: 5,
          }}
        />
      </View>
      <TabButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
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
  font: { justifyContent: "center", alignItems: "center" },
  text: {
    fontSize: 13,
    color: "#888",
    fontFamily: "Gudea-Regular",
  },
  total: { fontSize: 40, fontFamily: "Gudea-Bold" },
});

export default TotalPayment;
