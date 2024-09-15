import React, { useEffect, useRef, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
} from "react-native";
import { Card } from "@rneui/themed";
import ItemRow from "./itemRow";
import { useAuthStore } from "../../zustand/zustand";
import { Swipeable, RectButton } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";

const ReceiptCard = () => {
  const styles = useStyle();
  const { receipts, updateReceiptById } = useAuthStore((state) => ({
    receipts: state.receipts,
    updateReceiptById: state.updateReceiptById,
  }));
  const { uniqued } = useLocalSearchParams();

  const swipeableRefs = useRef({});
  const swipeableRow = useRef(null);

  const combinedFriends = useMemo(() => {
    return Array.from(
      new Set(receipts.flatMap((item) => Object.values(item.friends || {})))
    );
  }, [receipts]);

  const formattedReceipts = useMemo(() => {
    return receipts.map((item) => ({
      ...item,
      title: item.items,
    }));
  }, [receipts]);

  const totals = useMemo(() => {
    return formattedReceipts.reduce(
      (acc, item) => {
        acc.totalPrice += parseFloat(item.price || 0);
        acc.totalQuantity += parseInt(item.quantity || 0, 10);
        return acc;
      },
      { totalPrice: 0, totalQuantity: 0 }
    );
  }, [formattedReceipts]);

  const handleItemPress = (item) => {
    console.log("Pressed item:", item);
  };

  const onDelete = (item) => {
    const updatedReceipts = receipts.filter((receipt) => {
      const isMatch =
        receipt.items === item.items &&
        receipt.price === item.price &&
        receipt.quantity === item.quantity &&
        JSON.stringify(receipt.friends) === JSON.stringify(item.friends);

      return !isMatch;
    });
    console.log("Deleted item:", updatedReceipts);
    updateReceiptById(updatedReceipts);
  };

  useEffect(() => {
    Object.values(swipeableRefs.current).forEach((ref) => {
      if (ref && ref.close) {
        ref.close();
      }
    });
  }, [receipts]);

  const handleSwipeableOpen = (ref) => {
    if (swipeableRow.current && swipeableRow.current !== ref) {
      swipeableRow.current.close();
    }
    swipeableRow.current = ref;
  };

  const renderRightActions = (progress, dragX, item) => {
    const width = 80;
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [width, 0],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[styles.deleteBox, { transform: [{ translateX }] }]}
      >
        <RectButton style={styles.deleteButton} onPress={() => onDelete(item)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </RectButton>
      </Animated.View>
    );
  };

  return (
    <Card containerStyle={styles.container}>
      <View style={styles.header}>
        <ItemRow
          item={{
            items: "Items",
            quantity: "X",
            price: "Price",
            friends: "Friends",
          }}
          color="#F2E3A9"
          font="Gudea-Regular"
          size={20}
          disabled={false}
        />
      </View>
      <Card.Divider
        style={{ width: "100%", marginBottom: 0, marginTop: 0 }}
        color="#888"
        width={2}
        orientation="horizontal"
      />
      <View style={styles.flatListContainer}>
        <FlatList
          data={formattedReceipts}
          renderItem={({ item, index }) => (
            <Swipeable
              ref={(ref) => {
                swipeableRefs.current[index] = ref;
                if (ref) {
                  handleSwipeableOpen(ref);
                }
              }}
              onSwipeableWillOpen={() =>
                handleSwipeableOpen(swipeableRefs.current[index])
              }
              renderRightActions={(progress, dragX) =>
                renderRightActions(progress, dragX, item)
              }
              friction={2}
              rightThreshold={40}
              overshootRight={false}
            >
              <TouchableOpacity
                style={styles.middle}
                onPress={() => handleItemPress(item)}
              >
                <ItemRow
                  item={item}
                  index={index}
                  color="#A9DFBF"
                  font="Cabin-Regular"
                  size={15}
                  disabled={false}
                />
              </TouchableOpacity>
            </Swipeable>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <Card.Divider
        style={{ width: "100%", marginBottom: 0 }}
        color="#888"
        width={2}
        orientation="horizontal"
      />
      <View style={styles.header}>
        <ItemRow
          item={{
            items: "Total",
            quantity: totals.totalQuantity,
            price: totals.totalPrice,
            friends: combinedFriends,
          }}
          color="#00BEE5"
          font="Gudea-Regular"
          size={15}
          disabled={true}
        />
      </View>
    </Card>
  );
};

const useStyle = () => {
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions();
  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      marginTop: 8,
    },
    middle: {
      flexDirection: "row",
      marginTop: 8,
    },
    container: {
      borderRadius: 10,
      marginLeft: 16,
      marginRight: 16,
      marginTop: 10,
      padding: 0,
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    flatListContainer: {
      height: deviceHeight < 813 ? 322 : 375,
      overflow: "scroll",
    },
    deleteBox: {
      top: 8,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FF3B30",
      borderRadius: 5,
      height: 35,
      width: 100,
    },
    deleteButton: {
      justifyContent: "center",
      alignItems: "center",
      width: 80,
    },
    deleteButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
  });
  return styles;
};

export default ReceiptCard;
