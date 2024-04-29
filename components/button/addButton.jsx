import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";

const addButton = ({ onPress }) => {
  return (
    <View style={styles.addButtonContainer}>
      <Pressable style={styles.addButton} onPress={onPress}>
        <Text style={styles.addButtonTitle}>Add</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  addButtonContainer: {
    position: "absolute",
    bottom: 115,
    width: "100%",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#00BEE5",
    borderColor: "transparent",
    borderRadius: 30,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    width: 120,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonTitle: {
    fontWeight: "700",
    fontSize: 25,
    fontFamily: "Gudea-Bold",
    color: "rgba(255, 255, 255, 1)",
  },
});

export default addButton;
