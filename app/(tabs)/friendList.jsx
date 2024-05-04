import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import AddButton from "./../../components/button/addButton";
import { Card } from "@rneui/themed";
import TabButton from "./../../components/button/tabRoundButton";

const screenWidth = Dimensions.get("window").width;

const friendList = () => {
  return (
    <View style={styles.container}>
      <AddButton
        title="Add Friend"
        width={113}
        bottom={-22}
        left={131}
        fontSize={15}
      />
      <View style={styles.friendListParent(40)}>
        <Text style={styles.friendList}>Friend List</Text>
      </View>
      <Card containerStyle={styles.containerCard(280)}></Card>
      <View style={styles.friendListParent(24)}>
        <Text style={styles.friendList}>Group List</Text>
      </View>
      <Card containerStyle={styles.containerCard(180)}></Card>
      <TabButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 35,
  },
  friendList: {
    fontSize: 25,
    fontWeight: "700",
    fontFamily: "Cabin-Regular",
    color: "#000",
  },
  friendListParent: (marginTop) => ({
    marginTop: marginTop,
    width: 200,
    height: 40,
    borderColor: "transparent",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -0.5, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: "#f2e3a9",
    alignSelf: "center",
  }),
  containerCard: (height) => ({
    borderRadius: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -0.5, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    height: height,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
  }),
});

export default friendList;
