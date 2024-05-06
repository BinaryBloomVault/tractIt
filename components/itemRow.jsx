import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { useFonts } from "expo-font";

const ItemRow = ({ item, color }) => {
  return (
    <View style={styles.itemsParent}>
      <View style={styles.items(color)}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemTextMenu}>{item.items}</Text>
      </View>
      <View style={[styles.price, styles.priceSpaceBlock(color)]}>
        <Text style={styles.itemText}>{item.price}</Text>
      </View>
      <View style={[styles.friends, styles.priceSpaceBlock(color)]}>
        {item.friends && item.friends.length > 1 ? (
          <ScrollView horizontal={true}>
            <Text style={styles.itemText}>
              {item.friends.join(", ")}
            </Text>
          </ScrollView>
        ) : (
          <Text style={styles.itemText}>
            {item.friends.join(", ")}
          </Text>
        )}
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
  itemTextMenu: {
    textAlign: "center",
    color: "#000",
    fontFamily: "Gudea-Regular",
    fontWeight: "700",
    fontSize: 20,
    top: 0,
  },
  itemName: {
    textAlign: "left",
    color: "#000",
    fontFamily: "Gudea-Regular",
    fontWeight: "500",
    marginLeft: 5,
    paddingLeft: 5,
    marginTop: 5,
    fontSize: 12,
    borderRadius: 5,
    backgroundColor: "#D9D9D9",
    width: 40,
    height: 15
  },
  priceSpaceBlock: (color) => ({
    marginLeft: 4,
    backgroundColor: color,
    borderRadius: 10
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
    marginBottom: -5
  },
});
export default ItemRow;
