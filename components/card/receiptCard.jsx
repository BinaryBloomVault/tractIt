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
import { useAuthStore } from "../../zustand/zustand"; // Import the new Zustand store

const ReceiptCard = () => {
  const styles = useStyle();
  const { receipts } = useAuthStore((state) => ({
    receipts: state.receipts,
  }));

  const formattedReceipts = Object.entries(receipts).flatMap(([title, items]) =>
    items.map((item) => ({ title, ...item }))
  );

  const handleItemPress = (item) => {
    // console.log("Pressed item:", item);
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
            quantity: "X",
            price: "Price",
            friends: "Friends",
          }}
          color="#00BEE5"
          font="Gudea-Regular"
          size={20}
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
