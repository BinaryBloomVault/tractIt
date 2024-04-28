import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useFonts } from "expo-font";

const ItemRow = ({ item, color }) => {
  return (
    <View style={styles.itemsParent}>
      <View style={styles.items(color)}>
        <Text style={styles.itemText}>{item.items}</Text>
      </View>
      <View style={[styles.price, styles.priceSpaceBlock(color)]}>
        <Text style={styles.itemText}>{item.price}</Text>
      </View>
      <View style={[styles.friends, styles.priceSpaceBlock(color)]}>
        <Text style={styles.itemText}>
          {item.friends && Object.keys(item.friends).join(", ")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  itemText: {
    textAlign: "center",
    color: "#000",
    fontFamily: "Gudea-Regular",
    fontWeight: "700",
    fontSize: 20,
    top: 10,
  },
  priceSpaceBlock: (color) => ({
    marginLeft: 4,
    backgroundColor: color,
    borderRadius: 10,
  }),
  items: (color) => ({
    flex: 4,
    width: 142,
    backgroundColor: color,
    borderRadius: 10,
    height: 45,
    marginLeft: 4,
  }),
  items2: {
    flex: 1,
    width: 32,
    height: 45,
  },
  price: {
    flex: 2,
    width: 76,
    height: 45,
  },
  friends: {
    flex: 3,
    width: 106,
    height: 45,
    marginRight: 4,
  },
  itemsParent: {
    width: "100%",
    flexDirection: "row",
  },
});
export default ItemRow;
