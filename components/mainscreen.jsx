import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Pressable,
  useWindowDimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Card, Avatar } from "@rneui/themed";
import { useAuthStore } from "../zustand/zustand";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RectButton } from "react-native-gesture-handler";
import { Link, useRouter } from "expo-router";
import UserIcon from "./icons/usersIcon";

const handleSwipeableOpen = (direction, items) => {
  if (direction === "right") {
    Alert.alert("Swipe from right");
  }
};

const handlePaid = () => {
  Alert.alert("Button paid press");
};


const profileAvatar = () => {
  return (
    <Link href="/profile" asChild>
      <TouchableOpacity
        style={{ position: "absolute", top: 45, right: 10, zIndex: 10 }}
      >
        <Avatar
          size={50}
          rounded
          source={{ uri: "https://via.placeholder.com/150" }}
        />
      </TouchableOpacity>
    </Link>
  );
};

const Mainscreen = () => {
  const [tableData, setTableData] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [headerZIndex, setHeaderZIndex] = useState(0); // New state for header zIndex

  const styles = useStyle(headerZIndex);
  const { localUserData } = useAuthStore((state) => ({
    localUserData: state.localUserData,
  }));
  const { sharedReceipts } = useAuthStore((state) => ({
    sharedReceipts: state.sharedReceipts,
  }));
  const { updateReceiptsWithShared, updateTitle } = useAuthStore();
  const { receipts } = useAuthStore((state) => ({
    receipts: state.receipts,
  }));

  const { deleteReceiptsWithShared } = useAuthStore();

  const router = useRouter();

  const fetchData = () => {
    if (localUserData && localUserData.sharedReceipts) {
      const sharedReceipts = localUserData.sharedReceipts;
      // console.log("sharedReceipts: ", sharedReceipts);
      const receiptsArray = [];
      let totalamount = 0;
      let totalPay = 0;

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

              if (combinedItems.length === 0) {
                Object.entries(receiptData.friends).forEach(
                  ([friendId, friendData]) => {
                    if (friendData.originator === true) {
                      user = friendData.name;
                    }
                  }
                );
              } else {
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
              }
            } else if (currentTitle === "friends") {
              Object.entries(itemsArray).forEach(([friendId, friendData]) => {
                if (friendId === localUserData.uid) {
                  totalamount = friendData.payment;
                }
                totalPay += friendData.payment;
              });
            }
          });
          if (title.length > 12) {
            title = title.slice(0, 12) + "\n" + title.slice(12);
          }
          receiptsArray.push({
            receiptId: receiptId,
            title: title,
            name: user,
            price: totalamount.toFixed(2),
            friends: combinedFriends,
            items: combinedItems,
          });
        }
      });

      setTotalPayment(totalPay.toFixed(2));
      setTableData(receiptsArray);
    }
  };

  useEffect(() => {
    // console.log("localUserData: ", tableData);
    fetchData();
  }, [localUserData]);

  const handleCardPress = (item) => {
    if (item.receiptId) {
      updateReceiptsWithShared(item.receiptId);
    }

    if (item.title) {
      updateTitle(item.title);
    }
  };

  //please help to delete this to my firestore
  const handleDelete = (item) => {
    console.log("[DEBUG] Button delete press ",item);
     if (item.receiptId) {
       deleteReceiptsWithShared(item.receiptId);
     }
  }

  // New handleScroll function to manage zIndex
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 0) {
      setHeaderZIndex(1); // Bring header to front when scrolling
    } else {
      setHeaderZIndex(0); // Send header to back when at top
    }
  };


  const RightSwipeActions = ({ progress, dragX, item }) => {
    const translateX = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: "clamp",
    });
  
    return (
      <Animated.View
        style={[styles.actionsContainer, { transform: [{ translateX }] }]}
      >
        <RectButton style={styles.paidButton} onPress={handlePaid}>
          <Text style={styles.actionText}>Paid</Text>
        </RectButton>
        <RectButton style={styles.deleteButton} onPress={() => handleDelete(item)}>
          <Text style={styles.actionText}>Delete</Text>
        </RectButton>
      </Animated.View>
    );
  };
  

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerTop}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total Payment</Text>
          <Text style={styles.totalAmount}>{totalPayment}</Text>
          <Text style={styles.textRecords}>Receipts Records</Text>
        </View>
        {headerZIndex === 1 && profileAvatar()}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        onScroll={handleScroll} // Attach scroll handler
        scrollEventThrottle={16} // Update frequently
      >
        {tableData.map((item, index) => (
          <Swipeable
            key={index}
            renderRightActions={(progress, dragX) => (
              <RightSwipeActions progress={progress} dragX={dragX}  item={item}/>
            )}
            onSwipeableOpen={handleSwipeableOpen(item)}
            
          >
            <Card containerStyle={styles.receiptCard}>
              <Link
                push
                href={{
                  pathname: "/writeReceipt",
                  params: {
                    previousScreen: "update",
                    uniqued: item.receiptId,
                  },
                }}
                onPress={() => handleCardPress(item)}
                asChild
              >
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
              </Link>
            </Card>
          </Swipeable>
        ))}

        {/* Avatar overlay that appears when scrolling */}
        {headerZIndex === 0 && profileAvatar()}
      </ScrollView>
    </View>
  );
};

const useStyle = (headerZIndex) => {
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions();

  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: "#FFF",
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 50,
      backgroundColor: "#A9DFBF",
      position: "absolute", // Set position to absolute
      top: 0, // Align to top
      width: deviceWidth, // Ensure full width
      zIndex: headerZIndex, // Dynamically set zIndex
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
    textRecords: {
      flexDirection: "row",
      marginTop: 16,
      fontSize: 17,
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
      paddingTop: 150, // Ensure space at the top for headerTop
    },
    receiptCard: {
      borderRadius: 15,
      height: 100,
      marginTop: 2,
      marginBottom: 8,
      position: "relative",
      backgroundColor: "white",
      zIndex: 2, // Higher zIndex to ensure it comes in front
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
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      height: 80,
      marginTop: 15,
      borderRadius: 5,
    },
    paidButton: {
      backgroundColor: "#00BEE5",
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      height: '100%', 
      borderRadius: 5,
      marginLeft: -12
    },
    deleteButton: {
      backgroundColor: "#EA4C4C",
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      height: '100%',
      borderRadius: 5,
    },
    actionText: {
      color: "#FFF",
      fontWeight: "bold",
    },
  });
};

export default Mainscreen;
