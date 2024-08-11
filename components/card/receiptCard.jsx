import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Card } from "@rneui/themed";
import ItemRow from "./itemRow";
import { useAuthStore } from "../../zustand/zustand";

const ReceiptCard = () => {
  const styles = useStyle();
  const { receipts } = useAuthStore((state) => ({
    receipts: state.receipts,
  }));

  const combinedFriends = Array.from(
    new Set(receipts.flatMap((item) => Object.values(item.friends || {})))
  );

  // Format receipts to include the title
  const formattedReceipts = receipts.map((item) => ({
    ...item,
    title: item.items,
  }));

  // Calculate the total price and total quantity
  const totals = formattedReceipts.reduce(
    (acc, item) => {
      acc.totalPrice += parseFloat(item.price || 0);
      acc.totalQuantity += parseInt(item.quantity || 0, 10);
      return acc;
    },
    { totalPrice: 0, totalQuantity: 0 }
  );
  const handleItemPress = (item) => {
    console.log("Pressed item:", item);
  };

  return (
    <Card containerStyle={styles.container}>
      <View style={styles.header}>
        <ItemRow
          item={{
            items: "Items",
            quantity: "X",
            price: "Price",
            friends: "Friends",
          }}
          color="#F2E3A9"
          font="Gudea-Regular"
          size={20}
        />
      </View>
      <Card.Divider
        style={{ width: "100%", marginBottom: 0, marginTop: 0 }}
        color="#888"
        width={2}
        orientation="horizontal"
      />
      <View style={styles.flatListContainer}>
        <FlatList
          data={formattedReceipts}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.middle}
              onPress={() => handleItemPress(item)}
            >
              <ItemRow
                item={item}
                index={index}
                color="#A9DFBF"
                font="Cabin-Regular"
                size={15}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <Card.Divider
        style={{ width: "100%", marginBottom: 0 }}
        color="#888"
        width={2}
        orientation="horizontal"
      />
      <View style={styles.header}>
        <ItemRow
          item={{
            items: "Total",
            quantity: totals.totalQuantity,
            price: totals.totalPrice,
            friends: combinedFriends,
          }}
          color="#00BEE5"
          font="Gudea-Regular"
          size={15}
        />
      </View>
    </Card>
  );
};

const useStyle = () => {
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions();
  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      marginTop: 8,
    },
    middle: {
      flexDirection: "row",
      marginTop: 8,
    },
    container: {
      borderRadius: 10,
      marginLeft: 16,
      marginRight: 16,
      marginTop: 10,
      padding: 0,
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    flatListContainer: {
      height: deviceHeight < 813 ? 322 : 375,
      overflow: "scroll",
    },
  });
  return styles;
};

export default ReceiptCard;
