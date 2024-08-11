import { View, Text, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../zustand/zustand";

const PaymentInfo = () => {
  const { receipts } = useAuthStore((state) => ({
    receipts: state.receipts,
  }));
  const { localUserData } = useAuthStore((state) => ({
    localUserData: state.localUserData,
  }));

  const [payment, setPayment] = useState(0);

  useEffect(() => {
    if (localUserData) {
      let totalPayment = 0;

      receipts.forEach((receipt) => {
        const numFriends = Object.keys(receipt.friends).length;
        const individualPayment = receipt.price / numFriends;

        Object.keys(receipt.friends).forEach((friendId) => {
          if (friendId === localUserData.uid) {
            totalPayment += individualPayment;
          }
        });
      });

      setPayment(totalPayment);
    }
  }, [localUserData, receipts]);

  return (
    <Card containerStyle={styles.cardContainer}>
      <View style={styles.font}>
        <Text style={styles.text}>Your Total Payment</Text>
        <Text style={styles.total}>{payment.toFixed(2)}</Text>
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
