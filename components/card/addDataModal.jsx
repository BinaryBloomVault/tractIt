import {
  View,
  Text,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from "react-native";
import React from "react";

import AddButton from "../button/addButton";

const addDataModal = () => {
  const styles = useStyle();

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
      <AddButton
        bottom={30}
        title="Add more"
        width={150}
        fontSize={25}
        height={40}
      />
    </>
  );
};

const useStyle = () => {
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions();
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
      marginTop: deviceHeight < 813 ? 12 : 16,
    },
    title: {
      flex: 1,
      fontSize: deviceHeight < 813 ? 20 : 22,
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
      width: deviceHeight < 813 ? 210 : 229,
      height: deviceHeight < 813 ? 32 : 40,
    },
  });
  return styles;
};

export default addDataModal;
