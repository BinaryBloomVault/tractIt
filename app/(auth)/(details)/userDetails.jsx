import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ListItem, Icon } from "@rneui/themed";
import { Link } from "expo-router";
import { useAuthStore } from "../../../zustand/zustand";
import { auth } from "../../../config/firebaseConfig";
import { deleteUser } from "firebase/auth";

const UserDetails = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState("");

  const { localUserData, authUser, logout } = useAuthStore((state) => ({
    localUserData: state.localUserData,
    authUser: state.authUser,
    logout: state.logout,
  }));

  const handleRemoveOAuth = async () => {
    const user = auth.currentUser;
    if (user) {
      deleteUser(user)
        .then(() => {
          Alert.alert("Success! Deleting Account.");
          setTimeout(() => {
            logout();
          }, 3000);
        })
        .catch((error) => {
          Alert.alert("Something went wrong in deleting account!");
        });
    }
  };

  const handleDeleteAccount = () => {
    setModalVisible(false);
    handleRemoveOAuth();
  };

  useEffect(() => {
    if (localUserData) {
      setUserName(localUserData.name || "No Name");
    }
  }, [localUserData]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.infoContainer}>
        <ListItem bottomDivider>
          <Icon name="person" />
          <ListItem.Content>
            <ListItem.Title>{userName}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem bottomDivider>
          <Icon name="email" />
          <ListItem.Content>
            <ListItem.Title>{authUser.email}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem bottomDivider>
          <Icon name="delete" />
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <ListItem.Content>
              <ListItem.Title>Delete Account</ListItem.Title>
            </ListItem.Content>
          </TouchableOpacity>
        </ListItem>
        <Link href="/qrcode" asChild>
          <ListItem bottomDivider>
            <Icon name="qr-code" />
            <ListItem.Content>
              <ListItem.Title>QR Code</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </Link>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonDelete]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.textStyle}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 20,
  },
  infoContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
    marginTop: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
    alignItems: "center",
  },
  buttonCancel: {
    backgroundColor: "#EAAA64",
  },
  buttonDelete: {
    backgroundColor: "#8cb1d5",
  },
  buttonClose: {
    backgroundColor: "#8cb1d5",
    marginTop: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
});

export default UserDetails;
