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
  TouchableOpacity, // Import TouchableOpacity
} from "react-native";
import { Card, Avatar } from "@rneui/themed";
import { useAuthStore } from "../zustand/zustand";
import Swipeable from "react-native-gesture-handler/Swipeable";
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
  // const { tableData, setTableData } = useStore();
  const styles = useStyle();

  /* Ako ra gi usab ni para naa koy ma pislit na logout, don't mind this */
  const { logout } = useAuthStore((state) => ({
    logout: state.logout,
  }));

  const fetchData = () => {
    if (localUserData && localUserData.sharedReceipts) {
      const sharedReceipts = localUserData.sharedReceipts;
      console.log("localUserData:", localUserData);
      console.log("sharedReceipts:", sharedReceipts);

      const receiptsArray = [];
      Object.entries(sharedReceipts).forEach(([receiptId, receiptData]) => {
        Object.entries(receiptData).forEach(([title, itemsArray]) => {
          itemsArray.forEach((item) => {
            receiptsArray.push({
              title: title,
              item: item.items,
              price: item.price,
              friends: item.friends,
            });
          });
        });
      });

      setTableData(receiptsArray);
      console.log("Table data set to:", receiptsArray);
    } else {
      console.warn("localUserData or sharedReceipts is null or undefined");
    }
  };

  useEffect(() => {
    fetchData();
  }, [localUserData]);

  const handleCardPress = (item) => {
    // Handle the press event here
    console.log("Card pressed:", item);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerTop}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total Payment</Text>
          <Text style={styles.totalAmount}>8200</Text>
        </View>
        <Avatar
          size={50}
          rounded
          source={{ uri: "https://via.placeholder.com/150" }}
          containerStyle={styles.avatar}
        />
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
            <TouchableOpacity // Wrap the Card component with TouchableOpacity
              key={index}
              onPress={() => handleCardPress(item)} // Handle press event
            >
              <Card containerStyle={styles.receiptCard}>
                <View style={styles.receiptCardHeader}>
                  <Text style={styles.receiptUser}>{item.item}</Text>
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
                    <View style={styles.friendIcons}>
                      {Array.isArray(item.friends) ? (
                        item.friends.map((friend, index) => (
                          <View style={styles.friendCircle} key={index}>
                            <Text style={styles.friendInitial}>{friend}</Text>
                          </View>
                        ))
                      ) : (
                        <Text>No friends data available</Text>
                      )}
                    </View>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          </Swipeable>
        ))}
      </ScrollView>
    </View>
  );
};

const useStyle = () => {
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions();

  const styles = StyleSheet.create({
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
      fontSize: 18,
      marginLeft: 18,
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
      marginTop: 4,
    },
    friendCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "#FFC107",
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 2,
    },
    friendInitial: {
      color: "#FFF",
      fontWeight: "bold",
    },
  });
  return styles;
};
export default Mainscreen;
