import React, { useEffect, useState } from "react";
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
  TouchableOpacity,
} from "react-native";
import { Card, Avatar } from "@rneui/themed";
import { useAuthStore } from "../zustand/zustand";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Link, useRouter } from "expo-router";
import UserIcon from "./icons/usersIcon";

const swipeFromRightOpen = () => {
  Alert.alert("Swipe from right");
};

const handleSwipeableOpen = (direction) => {
  if (direction === "right") {
    Alert.alert("Swipe from right");
  }
};

const RightSwipeActions = () => {
  return (
    <>
      <View
        style={{
          backgroundColor: "#EA4C4C",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 15,
          height: 90,
          marginTop: 10,
          marginRight: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontFamily: "Gudea-Bold",
            fontWeight: "600",
            paddingHorizontal: 20,
            paddingVertical: 30,
            fontSize: 14,
          }}
        >
          Delete
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "#00BEE5",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 15,
          height: 90,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontFamily: "Gudea-Bold",
            fontWeight: "600",
            paddingHorizontal: 20,
            paddingVertical: 30,
            fontSize: 16,
          }}
        >
          Paid
        </Text>
      </View>
    </>
  );
};

const Mainscreen = () => {
  const [tableData, setTableData] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const styles = useStyle();
  const { localUserData } = useAuthStore((state) => ({
    localUserData: state.localUserData,
  }));

  const router = useRouter();

  const fetchData = () => {
    if (localUserData && localUserData.sharedReceipts) {
      const sharedReceipts = localUserData.sharedReceipts;
      const receiptsArray = [];
      let totalamount = 0;

      Object.entries(sharedReceipts).forEach(([receiptId, receiptData]) => {
        if (receiptData.friends) {
          let user = "";
          let combinedFriends = {};
          let title = "";
          let combinedItems = [];

          Object.entries(receiptData).forEach(([currentTitle, itemsArray]) => {
            if (currentTitle !== "friends" && Array.isArray(itemsArray)) {
              title = currentTitle;
              combinedItems = combinedItems.concat(itemsArray);

              itemsArray.forEach((item) => {
                Object.entries(receiptData.friends).forEach(
                  ([friendId, friendData]) => {
                    if (friendData.originator === true) {
                      user = friendData.name;
                    }

                    combinedFriends[friendId] = friendData.name;
                  }
                );
              });
            } else if (currentTitle === "friends") {
              Object.entries(itemsArray).forEach(([friendId, friendData]) => {
                if (friendId === localUserData.uid) {
                  totalamount = friendData.payment;
                }
              });
            }
          });

          // Push to receiptsArray only once per receiptData
          receiptsArray.push({
            title: title,
            name: user,
            price: totalamount.toFixed(2),
            friends: combinedFriends,
            items: combinedItems,
          });
        }
      });

      setTotalPayment(totalamount.toFixed(2));
      setTableData(receiptsArray);
    }
  };

  useEffect(() => {
    fetchData();
  }, [localUserData]);

  const handleCardPress = (item) => {
    router.push("/writeReceipt");
    console.log("Card pressed:", item);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerTop}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total Payment</Text>
          <Text style={styles.totalAmount}>{totalPayment}</Text>
        </View>
        <Link href="/profile" asChild>
          <TouchableOpacity>
            <Avatar
              size={50}
              rounded
              source={{ uri: "https://via.placeholder.com/150" }}
              containerStyle={styles.avatar}
            />
          </TouchableOpacity>
        </Link>
      </View>
      <View style={styles.recordsContainer}>
        <Text style={styles.textRecords}>Receipts Records</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {tableData.map((item, index) => (
          <Swipeable
            key={index}
            renderRightActions={RightSwipeActions}
            onSwipeableOpen={handleSwipeableOpen}
          >
            <Card containerStyle={styles.receiptCard}>
              <Pressable>
                <View style={styles.receiptCardHeader}>
                  <Text style={styles.receiptUser}>{item.name}</Text>
                  <Text style={styles.txtSettle}>Settle Up</Text>
                </View>
                <View style={styles.receiptCardBody}>
                  <View style={styles.receiptDetails}>
                    <Text style={styles.receiptTitle}>{item.title}</Text>
                  </View>
                  <View style={styles.receiptDetails}>
                    <Text style={styles.receiptAmount}>{item.price}</Text>
                    <View style={styles.horizontalLine} />
                    <Text style={styles.txtFriends}>Friends</Text>
                    <UserIcon friends={Object.values(item.friends)} />
                  </View>
                </View>
              </Pressable>
            </Card>
          </Swipeable>
        ))}
      </ScrollView>
    </View>
  );
};

const useStyle = () => {
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions();

  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: "#F5F5F5",
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 50,
      backgroundColor: "#A9DFBF",
    },
    totalContainer: {
      alignItems: "center",
      backgroundColor: "#fff",
      height: 60,
      width: 140,
      borderRadius: 10,
      marginTop: 2,
      marginLeft: -30,
    },
    recordsContainer: {
      paddingLeft: 20,
      paddingTop: -8,
      backgroundColor: "#A9DFBF",
      paddingBottom: 16,
    },
    textRecords: {
      marginTop: -40,
      fontSize: 20,
      fontWeight: "bold",
      fontFamily: "Gudea",
    },
    totalText: {
      fontSize: 18,
    },
    totalAmount: {
      fontSize: 20,
      fontWeight: "bold",
      fontFamily: "Gudea",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    avatar: {
      marginRight: -40,
      marginTop: -20,
    },
    header: {
      flexDirection: "row",
      paddingVertical: 8,
    },
    scrollViewContent: {
      padding: 16,
    },
    receiptCard: {
      borderRadius: 15,
      height: 100,
      marginTop: 2,
      marginBottom: 8,
    },
    receiptCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: -24,
    },
    receiptUser: {
      backgroundColor: "#A9DFBF",
      padding: 4,
      borderRadius: 4,
      color: "#FFF",
      fontFamily: "Gudea",
    },
    receiptCardBody: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    receiptDetails: {
      alignItems: "center",
    },
    txtSettle: {
      padding: 6,
      color: "#b9b0b0",
      marginTop: -30,
      marginRight: 101,
    },
    receiptTitle: {
      fontWeight: "bold",
      fontSize: 20,
      marginLeft: 26,
      marginTop: 18,
    },
    receiptAmount: {
      fontSize: 15,
      fontWeight: "bold",
      fontFamily: "Gudea",
      paddingTop: 20,
      marginTop: -20,
      marginRight: -20,
    },
    horizontalLine: {
      width: "100%",
      height: 1,
      backgroundColor: "#b9b0b0",
      marginVertical: 5,
    },
    txtFriends: {
      marginBottom: 2,
      marginRight: 120,
      color: "#b9b0b0",
      fontFamily: "Gudea",
    },
    friendIcons: {
      flexDirection: "row",
      marginTop: 1,
    },
  });
};

export default Mainscreen;
