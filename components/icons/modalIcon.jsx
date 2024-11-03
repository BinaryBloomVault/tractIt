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
  const slideAnim = useRef(
    new Animated.Value(useWindowDimensions().height),
  ).current;

  useEffect(() => {
    if (modalVisible) {
      // Slide from bottom to center
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide back down when closed
      Animated.timing(slideAnim, {
        toValue: useWindowDimensions().height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  const renderIcon = (paidStatus) => {
    return paidStatus ? (
      <Feather name="check-circle" size={24} color="green" />
    ) : (
      <Feather name="clock" size={24} color="orange" />
    );
  };

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <Text style={styles.modalTitle}>Settled Payments</Text>
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
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const useStyle = () => {
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions();
  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: deviceWidth * 0.8,
      maxHeight: deviceHeight * 0.8,
      backgroundColor: "white",
      borderRadius: 10,
      padding: 20,
      // Add initial bottom offset
      transform: [{ translateY: deviceHeight }],
    },
    modalScrollContent: {
      paddingBottom: 20,
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
      marginTop: 20,
      backgroundColor: "#2196F3",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
    },
    closeButtonText: {
      color: "white",
      fontSize: 16,
    },
  });
};

export default ModalIcon;
