import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { Card } from "@rneui/themed";
import { list } from "firebase/storage";
import ItemRow from "../card/itemRow";

const receiptCard = () => {
  const [tableData, setTableData] = useState([
    {
      items: "Fries",
      quantity: 2,
      price: 500,
      friends: {
        user_1: true,
        user_2: true,
        user_3: true,
      },
    },
    {
      items: "Burger",
      quantity: 1,
      price: 700,
      friends: {
        user_1: true,
        user_4: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
    {
      items: "Pizza",
      quantity: 3,
      price: 1000,
      friends: {
        user_2: true,
        user_3: true,
        user_5: true,
      },
    },
  ]);

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
        style={{ width: "100%", marginBottom: 0 }}
        color="#888"
        width={2}
        orientation="horizontal"
      />
      <View style={styles.flatListContainer}>
        <FlatList
          data={tableData}
          renderItem={({ item }) => (
            <View style={styles.header}>
              <ItemRow
                item={item}
                color="#A9DFBF"
                font="Cabin-Regular"
                size={15}
              />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
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

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingVertical: 8,
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
    height: 375,
    overflow: "scroll",
  },
});

export default receiptCard;
