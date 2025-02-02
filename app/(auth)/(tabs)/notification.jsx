import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { Card } from "@rneui/themed";
import { useAuthStore } from "../../../zustand/zustand";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../../../config/firebaseConfig";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const confirmFriendRequest = useAuthStore(
    (state) => state.confirmFriendRequest
  );
  const cancelFriendRequest = useAuthStore(
    (state) => state.cancelFriendRequest
  );
  const { localUserData } = useAuthStore((state) => ({
    localUserData: state.localUserData,
  }));

  const deleteNotification = useAuthStore((state) => state.deleteNotification);
  const updatePaidStatus = useAuthStore((state) => state.updatePaidStatus);
  const rejectedPaidStatus = useAuthStore((state) => state.rejectedPaidStatus);
  const paidStatus = useAuthStore((state) => state.getPaidReceipts);

  const router = useRouter();

  useEffect(() => {
    if (!localUserData) return;

    const notificationDocRef = doc(firestore, "users", localUserData.uid);

    const unsubscribe = onSnapshot(
      notificationDocRef,
      (doc) => {
        if (doc.exists()) {
          const notificationData = doc.data();
          const notifications = notificationData.notifications || [];
          setNotifications(notifications);
        } else {
          setNotifications([]);
        }
      },
      (error) => {
        console.error("Error fetching notifications:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleConfirm = async () => {
    if (selectedNotification) {
      const { userId, type, newReceiptId, friendId } = selectedNotification;
      if (type === "paid") {
        if (paidStatus) {
          await updatePaidStatus(newReceiptId, friendId, true);
          await deleteNotification(newReceiptId);
        } else {
          await deleteNotification(newReceiptId);
        }
      } else if (type === "friend") {
        const success = await confirmFriendRequest(userId);
        if (success) {
          await deleteNotification(newReceiptId);
        }
      } // <-- Added missing closing curly bracket here
    }

    setModalVisible(false);
    setSelectedNotification(null);
  };

  const handleCancel = async () => {
    if (selectedNotification) {
      const { userId, type, newReceiptId, friendId } = selectedNotification;
      if (type === "paid") {
        await rejectedPaidStatus(newReceiptId, friendId);
        await deleteNotification(newReceiptId);
      } else {
        const success = await cancelFriendRequest(userId);
        if (success) await deleteNotification(newReceiptId);
      }
    }
    setModalVisible(false);
    setSelectedNotification(null);
  };

  const handleNotificationPress = async (item) => {
    if (item.message.includes("included you in a receipt")) {
      router.push({
        pathname: "(auth)/(tabs)/writeReceipt",
        params: {
          uniqued: item.newReceiptId,
          receiptId: item.newReceiptId,
          originatorId: item.userId,
          previousScreen: "update",
        },
      });
      if (item.userId) {
        await deleteNotification(item.newReceiptId);
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
          <Feather name="info" size={30} color="green" />
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
        keyExtractor={(item) => item.id}
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
                Do you want to confirm or cancel?
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
