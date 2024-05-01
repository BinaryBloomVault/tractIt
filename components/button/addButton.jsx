import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";

const addButton = ({ onPress, bottom, title, width, fontSize }) => {
  return (
    <View style={styles.addButtonContainer(bottom)}>
      <Pressable style={styles.addButton(width)} onPress={onPress}>
        <Text style={styles.addButtonTitle(fontSize)}>{title}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  addButtonContainer: (bottom) => ({
    bottom: bottom,
    width: "100%",
    alignItems: "center",
  }),
  addButton: (width) => ({
    backgroundColor: "#00BEE5",
    borderColor: "transparent",
    borderRadius: 30,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    width: width,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  }),
  addButtonTitle: (fontSize) => ({
    fontWeight: "700",
    fontSize: fontSize,
    fontFamily: "Gudea-Bold",
    color: "rgba(255, 255, 255, 1)",
  }),
});

export default addButton;
