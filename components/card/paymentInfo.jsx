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
        const totalPaymentForReceipt = parseFloat(receipt.price) || 0;
        const totalFriends = Object.keys(receipt.friends).length;

        const unpaidFriends = Object.entries(receipt.friends).filter(
          ([, friendData]) => !friendData.paid
        );
        const perFriendPayment = unpaidFriends.length
          ? totalPaymentForReceipt / totalFriends
          : 0;

        Object.entries(receipt.friends).forEach(([friendId, friendData]) => {
          if (friendId === localUserData.uid) {
            totalPayment += friendData.paid ? 0 : perFriendPayment;
          }
        });
      });

      setPayment(totalPayment);
    }
  }, [receipts, localUserData]);

  let cardStyle = styles.smallCard;
  if (payment.toFixed(2) > 1000) {
    cardStyle = styles.mediumCard;
  } else if (payment.toFixed(2) > 100000) {
    cardStyle = styles.largeCard;
  }

  return (
    <Card containerStyle={[styles.cardContainer, cardStyle]}>
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
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  smallCard: {
    width: 170,
    height: 80,
  },
  mediumCard: {
    width: 200,
    height: 80,
  },
  largeCard: {
    width: 250,
    height: 80,
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
