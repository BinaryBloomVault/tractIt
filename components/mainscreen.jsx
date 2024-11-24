import React, { useEffect, useState, useRef } from "react";
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
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { firestore } from "../config/firebaseConfig";
import {
  Gesture,
  GestureDetector,
  RectButton,
} from "react-native-gesture-handler";
import { Link, useRouter, useGlobalSearchParams } from "expo-router";
import UserIcon from "./icons/usersIcon";
import ModalIcon from "./icons/modalIcon";
import { runOnJS } from "react-native-reanimated";

const handleSwipeableOpen = (direction, items) => {
  if (direction === "right") {
    // Alert.alert('Swipe from right');
  }
};

const Mainscreen = () => {
  const [tableData, setTableData] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const styles = useStyle();
  const { localUserData } = useAuthStore((state) => ({
    localUserData: state.localUserData,
  }));

  const { updateReceiptsWithShared, updateTitle, selectedAvatar } =
    useAuthStore();
  const { deleteReceiptsWithShared, updatePaidStatus, setPaidReceipts } =
    useAuthStore();

  const router = useRouter();
  const { receiptId } = useGlobalSearchParams();

  useEffect(() => {
    fetchData();

    if (receiptId) {
      const matchingItem = tableData.find(
        (item) => item.receiptId === receiptId
      );
      if (matchingItem) {
        handleCardPress(matchingItem);
      }
    }
  }, [receiptId]);

  const fetchData = () => {
    if (!localUserData || !localUserData.sharedReceipts) return;

    const userRefs = collection(
      firestore,
      "users",
      localUserData.uid,
      "sharedReceipts"
    );

    const unsubscribe = onSnapshot(userRefs, (snapshot) => {
      let totalPay = 0;

      const receiptsArray = snapshot.docs
        .map((doc) => {
          const receiptId = doc.id;
          const receiptData = doc.data();
          if (!receiptData.friends) return null;

          let originatorName = "";
          let originatorId = "";
          const combinedFriends = { ...receiptData.friends };
          const combinedItems = [];
          let title = "";
          let paidStatus = false;

          Object.entries(receiptData).forEach(([key, value]) => {
            if (key === "friends") {
              Object.entries(value).forEach(([friendId, friendData]) => {
                if (friendData.originator) {
                  originatorName = friendData.name;
                  originatorId = friendId;
                }
                if (friendId === localUserData.uid) {
                  totalPay += friendData.payment;
                  paidStatus = friendData.paid;
                }
              });
            } else if (Array.isArray(value)) {
              title =
                key.length > 12 ? key.slice(0, 12) + "\n" + key.slice(12) : key;
              combinedItems.push(...value);
            }
          });

          return {
            receiptId,
            title,
            name: originatorName,
            price:
              combinedFriends[localUserData.uid]?.payment.toFixed(2) || "0.00",
            friends: combinedFriends,
            items: combinedItems,
            originatorId,
            paidStatus,
            timestamp: receiptData.timestamp || 0,
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.timestamp - a.timestamp);

      setTableData(receiptsArray);
      setTotalPayment(totalPay.toFixed(2));
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  };

  useEffect(() => {
    const unsubscribe = fetchData();
    return () => unsubscribe(); // Cleanup listener on unmount
  }, [localUserData]);

  const handleCardPress = (item) => {
    if (item.receiptId) {
      updateReceiptsWithShared(item.receiptId);
    }

    if (item.title) {
      updateTitle(item.title);
    }
  };

  const handleDelete = (item) => {
    if (item.receiptId) {
      deleteReceiptsWithShared(item.receiptId);
    }
  };

  const handlePaid = async (item) => {
    if (item.receiptId) {
      const friendId = localUserData.uid;
      try {
        const paidApproval = true;
        setPaidReceipts(paidApproval);
        await updatePaidStatus(item.receiptId, friendId, false); // Pass both receiptId and friendId
      } catch (error) {
        console.error("[DEBUG] Error updating paid status:", error);
      }
    }
  };

  const handleLongPress = (friends) => {
    setSelectedFriends(friends);
    setModalVisible(true);
  };

  const RightSwipeActions = ({ progress, dragX, item }) => {
    const translateX = dragX.interpolate({
      inputRange: [-150, 0],
      outputRange: [0, 150],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[styles.actionsContainer, { transform: [{ translateX }] }]}
      >
        <RectButton style={styles.paidButton} onPress={() => handlePaid(item)}>
          <Text style={styles.actionText}>Paid</Text>
        </RectButton>
        <RectButton
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
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
      </View>
      <Link href="/profile" asChild>
        <TouchableOpacity
          style={{ position: "absolute", top: 45, right: 10, zIndex: 10 }}
        >
          <Avatar size={50} rounded source={selectedAvatar} />
        </TouchableOpacity>
      </Link>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16} // Update frequently
      >
        {tableData.map((item, index) => {
          const singleTap = Gesture.Tap().onEnd(() => {
            runOnJS(updateReceiptsWithShared)(item.receiptId);
            runOnJS(updateTitle)(item.title);
            console.log("On single tap");
          });

          const longPress = Gesture.LongPress().onEnd((event) => {
            console.log("On long press tap");
            runOnJS(handleLongPress)(Object.values(item.friends));
            //}
          });

          return (
            <Swipeable
              renderRightActions={(progress, dragX) => (
                <RightSwipeActions
                  progress={progress}
                  dragX={dragX}
                  item={item}
                />
              )}
              onSwipeableOpen={handleSwipeableOpen(item)} // Pass direction and item
            >
              <GestureDetector
                gesture={Gesture.Exclusive(singleTap, longPress)}
              >
                <Card
                  containerStyle={{
                    ...styles.receiptCard,
                    backgroundColor: item.paidStatus ? "#B7F4D8" : "#fff",
                  }}
                >
                  <Link
                    push
                    href={{
                      pathname: "/writeReceipt",
                      params: {
                        previousScreen: "update",
                        uniqued: item.receiptId,
                        originatorId: item.originatorId,
                      },
                    }}
                    asChild
                  >
                    <Pressable>
                      <View style={styles.receiptCardHeader}>
                        <Text
                          style={[
                            styles.receiptUser,
                            {
                              backgroundColor: item.paidStatus
                                ? "#fff"
                                : "#A9DFBF",
                            },
                          ]}
                        >
                          {item.name}
                        </Text>
                        <Text style={styles.txtSettle}>Settle Up</Text>
                      </View>
                      <View style={styles.receiptCardBody}>
                        <View style={styles.receiptDetails}>
                          <Text
                            style={[
                              styles.receiptTitle,
                              { color: item.paidStatus ? "#2c2c2c" : "#000" },
                            ]}
                          >
                            {item.title}
                          </Text>
                        </View>
                        <View style={styles.receiptDetails}>
                          <Text style={styles.receiptAmount}>{item.price}</Text>
                          <View style={styles.horizontalLine} />
                          <Text style={styles.txtFriends}>Friends</Text>
                          <UserIcon
                            friends={Object.values(item.friends).map(
                              (friend) => friend.name
                            )}
                            paidFriends={Object.entries(item.friends).map(
                              ([id, friend]) => ({
                                name: friend.name,
                                paid: friend.paid,
                              })
                            )}
                          />
                        </View>
                      </View>
                    </Pressable>
                  </Link>
                </Card>
              </GestureDetector>
            </Swipeable>
          );
        })}
      </ScrollView>
      {modalVisible && (
        <ModalIcon
          modalVisible={modalVisible}
          friends={selectedFriends}
          setModalVisible={setModalVisible}
        />
      )}
    </View>
  );
};

const useStyle = () => {
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
      padding: 40,
      backgroundColor: "#A9DFBF",
      position: "sticky", // Set position to sticky
      top: 0, // Align to top
      width: deviceWidth, // Ensure full width
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
      paddingTop: 0,
    },
    receiptCard: {
      borderRadius: 15,
      height: 110,
      marginLeft: 0,
      marginRight: 0,
      position: "relative",
      borderColor: "#C8F7C5",
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
      color: "gray",
      fontWeight: "bold",
      fontFamily: "Gudea",
      paddingLeft: 10,
      paddingRight: 10,
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
      fontWeight: "bold",
      padding: 6,
      color: "#b9b0b0",
      marginTop: -30,
      marginRight: 105,
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
      fontWeight: "bold",
    },
    friendIcons: {
      flexDirection: "row",
      marginTop: 1,
    },
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      height: 110,
      marginTop: 15,
      marginLeft: 1,
      borderRadius: 5,
    },
    paidButton: {
      backgroundColor: "#00BEE5",
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      height: 110,
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15,
    },
    deleteButton: {
      backgroundColor: "#EA4C4C",
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      height: "100%",
      borderBottomRightRadius: 15,
      borderTopRightRadius: 15,
      marginRight: 2,
    },
    actionText: {
      color: "#FFF",
      fontWeight: "bold",
    },
  });
};

export default Mainscreen;
