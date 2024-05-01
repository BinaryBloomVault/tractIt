import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";

import AddButton from "../button/addButton";

const addDataModal = () => {
  return (
    <>
      <View style={styles.frameParent}>
        <View style={styles.itemsParent}>
          <Text style={styles.title}>Title</Text>
          <TextInput style={styles.rectangleInput} selectTextOnFocus={true} />
        </View>
        <View style={styles.itemsParent}>
          <Text style={styles.title}>Items</Text>
          <TextInput style={styles.rectangleInput} selectTextOnFocus={true} />
        </View>
        <View style={styles.itemsParent}>
          <Text style={styles.title}>Quantity</Text>
          <TextInput style={styles.rectangleInput} selectTextOnFocus={true} />
        </View>
        <View style={styles.itemsParent}>
          <Text style={styles.title}>Price</Text>
          <TextInput style={styles.rectangleInput} selectTextOnFocus={true} />
        </View>
        <View style={styles.itemsParent}>
          <Text style={styles.title}>Friends</Text>
          <TextInput style={styles.rectangleInput} selectTextOnFocus={true} />
        </View>
      </View>
      <AddButton bottom={30} title="Add more" width={150} fontSize={25} />
    </>
  );
};

const styles = StyleSheet.create({
  frameParent: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 24,
    marginRight: 24,
    marginTop: 16,
  },
  itemsParent: {
    flexDirection: "row",
    marginTop: 16,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Gudea-Bold",
    textAlign: "center",
    alignSelf: "center",
    textAlign: "left",
  },
  rectangleInput: {
    borderRadius: 5,
    borderStyle: "solid",
    borderColor: "#888",
    borderWidth: 1,
    width: 229,
    height: 40,
  },
});

export default addDataModal;
