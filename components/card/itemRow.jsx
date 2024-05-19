import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { useFonts } from "expo-font";

const ItemRow = ({ item, color, font, size, height }) => {
  return (
    <View style={styles.itemsParent}>
      <View style={styles.items(color)}>
        <Text style={styles.itemText(font, size)}>{item.items}</Text>
      </View>
      <View style={[styles.items2, styles.priceSpaceBlock(color)]}>
        <Text style={styles.itemText(font, size)}>{item.quantity}</Text>
      </View>
      <View style={[styles.price, styles.priceSpaceBlock(color)]}>
        <Text style={styles.itemText(font, size)}>{item.price}</Text>
      </View>
      <View style={[styles.friends, styles.priceSpaceBlock(color)]}>
        <Text style={styles.itemText(font, size)}>
          {item.friends && Object.keys(item.friends).join(", ")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemText: (font, size) => ({
    textAlign: "center",
    justifyContent: "center",
    color: "#000",
    fontFamily: font,
    fontWeight: "700",
    fontSize: size,
  }),
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
    height: 35,
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  }),
  items2: {
    flex: 1,
    width: 32,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  price: {
    flex: 2,
    width: 76,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  friends: {
    flex: 3,
    width: 106,
    height: 35,
    marginRight: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  itemsParent: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 8,
  },
});
export default ItemRow;
