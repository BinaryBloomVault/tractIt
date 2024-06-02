import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  Alert,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";

import { Card } from "@rneui/themed";
import ItemRow from "./card/ItemRow";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useAuthStore } from "../zustand/zustand";
import { db } from "../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "expo-router";

const swipeFromRightOpen = () => {
  Alert.alert("Swipe from right");
};

const swipeFromLeftOpen = () => {
  Alert.alert("Swipe from left");
};

const handleSwipeableOpen = (direction) => {
  if (direction === "left") {
    Alert.alert("Swipe from left");

    // Add your left swipe logic here
  } else if (direction === "right") {
    Alert.alert("Swipe from right");

    // Add your right swipe logic here
  }
};

const RightSwipeActions = () => {
  return (
    <View
      style={{
        backgroundColor: "#EA4C4C",
        justifyContent: "center",
        alignItems: "flex-end",
        borderRadius: 5,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontFamily: "Gudea-Bold",
          fontWeight: "600",
          paddingHorizontal: 30,
          paddingVertical: 20,
        }}
      >
        Delete
      </Text>
    </View>
  );
};

const LeftSwipeActions = () => {
  return (
    <View
      style={{
        backgroundColor: "#00BEE5",
        justifyContent: "center",
        alignItems: "flex-end",
        borderRadius: 5,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontFamily: "Gudea-Bold",
          fontWeight: "600",
          paddingHorizontal: 30,
          paddingVertical: 20,
        }}
      >
        Paid
      </Text>
    </View>
  );
};

const Mainscreen = () => {
  // const { tableData, setTableData } = useStore();
  const styles = useStyle();

  /* Ako ra gi usab ni para naa koy ma pislit na logout, don't mind this */
  const { logout } = useAuthStore((state) => ({
    logout: state.logout,
  }));

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Users"));
      // const newData = [];
      // querySnapshot.forEach((doc) => {
      //   const userData = doc.data();
      //   newData.push({
      //     name: userData.name,
      //     items: userData.menu,
      //     price: userData.price,
      //     friends: userData.groupfriends,
      //   });
      // });
      // setTableData(newData);
    } catch (error) {
      // console.log("Error displaying data ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View styles={styles.mainContainer}>
      <View style={styles.userProfile}>
        <Link href="/profile" asChild>
          <Text>asdasdasd</Text>
        </Link>
      </View>
      <Card containerStyle={styles.container}>
        {/* <ScrollView vertical={true}>
          {tableData.slice(0, tableData.length).map((item, index) => (
            <Swipeable
              key={index}
              renderRightActions={RightSwipeActions}
              renderLeftActions={LeftSwipeActions}
              onSwipeableOpen={handleSwipeableOpen}
            >
              <View key={index}>
                <View style={styles.header}>
                  <ItemRow item={item} color="white" />
                </View>
              </View>
            </Swipeable>
          ))}
        </ScrollView> */}
      </Card>
    </View>
  );
};

const useStyle = () => {
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions();

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      paddingVertical: 8,
    },
    container: {
      borderRadius: 30,
      height: "70%",
      margin: 0,
      marginTop: 120,
      backgroundColor: "#F2E3A9",
      padding: 8,
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      height: deviceHeight - 500,
    },
    scrollContainer: {
      paddingBottom: 8,
    },
    userProfile: {
      position: "absolute",
      top: 60,
      right: 20,
    },
    images: {
      width: 54,
      height: 54,
      borderRadius: 25,
    },
  });
  return styles;
};
export default Mainscreen;
