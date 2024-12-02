import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const ModalIcon = ({ modalVisible, friends, setModalVisible }) => {
  const styles = useStyle();
  
  const renderIcon = (paidStatus) => {
    return paidStatus ? (
      <Feather name="check-circle" size={24} color="green" />
    ) : (
      <Feather name="clock" size={24} color="orange" />
    );
  };

  // Determine if the number of friends exceeds 3 to adjust scrolling behavior
  const isScrollable = friends.length > 3;

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Settled Payments</Text>
          
          <ScrollView 
            contentContainerStyle={styles.scrollViewContent}
            style={[styles.scrollView, isScrollable && { maxHeight: 200 }]}
          >
            {friends.map((friend) => (
              <View key={friend.name} style={styles.modalHeader}>
                <View style={styles.row}>
                  {renderIcon(friend.paid)}
                  <Text style={styles.modalText}>{friend.name}</Text>
                  <Text style={styles.modalStatus}>
                    {friend.paid ? "Paid" : "Pending"}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
          
          <Pressable
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const useStyle = () => {
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions();
  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalView: {
      backgroundColor: "white",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: "#000",
      padding: 20,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      top: 20,
      height: deviceHeight / 2.5,
      width: deviceWidth,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    modalText: {
      marginLeft: 10,
      fontSize: 16,
    },
    modalStatus: {
      marginLeft: "auto",
      fontSize: 16,
    },
    closeButton: {
      marginTop: 5,
      marginBottom: 5,
      backgroundColor: "#2196F3",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
    },
    closeButtonText: {
      color: "white",
      fontSize: 16,
    },
    scrollViewContent: {
      paddingBottom: 20,
    },
    scrollView: {
      flex: 1,
    },
  });
};

export default ModalIcon;
