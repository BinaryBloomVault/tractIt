import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import React from "react";

const screenWidth = Dimensions.get("window").width;

const addButton = ({
  onPress,
  bottom,
  title,
  width,
  fontSize,
  left,
  height,
  bcolor,
}) => {
  return (
    <View style={styles.addButtonContainer(bottom, left)}>
      <Pressable
        style={styles.addButton(width, height, bcolor)}
        onPress={onPress}
      >
        <Text style={styles.addButtonTitle(fontSize)}>{title}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  addButtonContainer: (bottom, left) => ({
    bottom: bottom,
    left: left,
    width: "100%",
    alignItems: "center",
  }),
  addButton: (width, height, bcolor) => ({
    backgroundColor: bcolor,
    borderColor: "transparent",
    borderRadius: 30,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: width,
    height: height,
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
