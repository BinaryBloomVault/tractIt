import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useAuthStore } from "../../zustand/zustand"; //
import UserIcon from "../../components/icons/usersIcon";
const ItemRow = ({ item, color, font, size, height, index }) => {
  const setModalVisible = useAuthStore((state) => state.setModalVisible);
  const setSelectedItemIndex = useAuthStore(
    (state) => state.setSelectedItemIndex
  );

  const handlePress = (type) => {
    // console.log(`Pressed ${type}:`, item);
    // console.log("Index:", index);
    setSelectedItemIndex(index);
    setModalVisible(true);
  };
  const friendNames = item.friends ? Object.values(item.friends) : [];
  const isFriendsArray = friendNames.join("") === "Friends";

  return (
    <View style={styles.itemsParent}>
      <TouchableOpacity
        style={styles.items(color)}
        onPress={() => handlePress("Items")}
      >
        <Text style={styles.itemText(font, size)}>{item.items}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.items2, styles.priceSpaceBlock(color)]}
        onPress={() => handlePress("Quantity")}
      >
        <Text style={styles.itemText(font, size)}>{item.quantity}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.price, styles.priceSpaceBlock(color)]}
        onPress={() => handlePress("Price")}
      >
        <Text style={styles.itemText(font, size)}>{item.price}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.friends, styles.priceSpaceBlock(color)]}
        onPress={() => handlePress("Friends")}
      >
        <View style={styles.iconsContainer}>
          {isFriendsArray ? (
            <Text style={styles.itemText(font, size)}>Friends</Text>
          ) : (
            <UserIcon friends={friendNames} />
          )}
        </View>
      </TouchableOpacity>
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
    flex: 3.2,
    width: 142,
    backgroundColor: color,
    borderRadius: 10,
    height: 35,
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  }),
  items2: {
    flex: 1.3,
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
