import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Button } from "@rneui/themed";

const TotalPayment = () => {
  return (
    <View style={styles.container}>
      <Card containerStyle={styles.cardContainer}>
        <View style={styles.font}>
          <Text style={styles.text}>Your Total Payment</Text>
          <Text style={styles.total}>500</Text>
        </View>
      </Card>
      <View style={styles.buttonWrapper}>
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
  buttonWrapper: {
    marginTop: 35,
  },
});

export default TotalPayment;
