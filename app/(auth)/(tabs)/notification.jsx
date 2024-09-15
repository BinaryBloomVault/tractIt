import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { Avatar, Card } from "@rneui/themed";
import { useAuthStore } from "../../../zustand/zustand";
import { useRouter } from "expo-router";

const Notification = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const notifications = useAuthStore((state) => state.notifications);
  const confirmFriendRequest = useAuthStore(
    (state) => state.confirmFriendRequest
  );
  const cancelFriendRequest = useAuthStore(
    (state) => state.cancelFriendRequest
  );
  const deleteNotification = useAuthStore((state) => state.deleteNotification);
  const router = useRouter();

  const handleConfirm = async () => {
    if (selectedNotification) {
      const { userId, id: notificationId } = selectedNotification;

      const success = await confirmFriendRequest(userId);
      if (success) {
        await deleteNotification(userId);
      } else {
        console.error("Failed to confirm friend request");
      }
    }
    setModalVisible(false);
    setSelectedNotification(null);
  };

  const handleCancel = async () => {
    if (selectedNotification) {
      const { userId, id: notificationId } = selectedNotification;

      const success = await cancelFriendRequest(userId);
      if (success) {
        await deleteNotification(userId);
      } else {
        console.error("Failed to cancel friend request");
      }
    }
    setModalVisible(false);
    setSelectedNotification(null);
  };

  const handleNotificationPress = async (item) => {
    if (item.message.includes("included you in a receipt")) {
      router.push({
        pathname: "(auth)/(tabs)/writeReceipt",
        params: { receiptId: item.newReceiptId },
      });
      if (item.userId) {
        await deleteNotification(item.userId);
      }
    } else {
      setSelectedNotification(item);
      setModalVisible(true);
    }
  };

  const renderNotificationItem = ({ item }) => (
    <Pressable onPress={() => handleNotificationPress(item)}>
      <Card containerStyle={styles.notificationItem}>
        <View style={styles.notificationContent}>
          <Avatar
            source={{ uri: "https://via.placeholder.com/50" }}
            rounded
            size="medium"
          />
          <Text style={styles.notificationText}>{item.message}</Text>
        </View>
      </Card>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
      />
      {selectedNotification && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Do you want to confirm or cancel this friend request?
              </Text>
              <View style={styles.buttonContainer}>
                <Pressable
                  style={[styles.button, styles.buttonConfirm]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.textStyle}>Confirm</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonCancel]}
                  onPress={handleCancel}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 60,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  notificationItem: {
    marginLeft: 0,
    marginRight: 0,
    padding: 15,
    borderWidth: 0,
    elevation: 1,
    marginBottom: 10,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationText: {
    flex: 1,
    marginLeft: 20,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 16,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
    alignItems: "center",
  },
  buttonConfirm: {
    backgroundColor: "#00BFFF",
  },
  buttonCancel: {
    backgroundColor: "#FF3B30",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default Notification;
