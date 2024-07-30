import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { Avatar, Button, ListItem, Icon, Card } from "@rneui/themed";
import { Link } from "expo-router";
import { useAuthStore } from "../../../zustand/zustand";

const Profile = () => {
  const { authUser, logout, localUserData } = useAuthStore((state) => ({
    authUser: state.authUser,
    logout: state.logout,
    localUserData: state.localUserData,
  }));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatePhotoURL, setUpdatePhotoUrl] = useState("");
  const [userName, setUserName] = useState('')
  const isNotUpdate = "";


  const defaultAvatarUrl = "https://robohash.org/example1000.png";

  const avatarSelection = [
    "https://robohash.org/example1.png",
    "https://robohash.org/example2.png",
    "https://robohash.org/example3.png",
    "https://robohash.org/example4.png",
    "https://robohash.org/example5.png",
    "https://robohash.org/example6.png",
    "https://robohash.org/example7.png",
    "https://robohash.org/example8.png",
    "https://robohash.org/example9.png",
    "https://robohash.org/example10.png",
    "https://robohash.org/example11.png",
    "https://robohash.org/example12.png",
    "https://robohash.org/example13.png",
    "https://robohash.org/example14.png",
    "https://robohash.org/example15.png",
    "https://robohash.org/example16.png",
    "https://robohash.org/example18.png",
    "https://robohash.org/example19.png",
    "https://robohash.org/example20.png",
    "https://robohash.org/example21.png",
    "https://robohash.org/example22.png",
    "https://robohash.org/example23.png",
    "https://robohash.org/example24.png",
    "https://robohash.org/example25.png",
  ];

  const handleAvatarSelect = (url) => {
    setUpdatePhotoUrl(url);
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (localUserData) {
      setUserName(localUserData.name || 'No Name');
    }
  }, [localUserData]);
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card containerStyle={styles.profileCard}>
        <View style={styles.profileContainer}>
          <Avatar
            size={100}
            rounded
            source={{
              uri:
                updatePhotoURL !== isNotUpdate
                  ? updatePhotoURL
                  : defaultAvatarUrl,
            }}
            containerStyle={styles.avatar}
          />
          <Button
            type="clear"
            title="Edit Photo"
            onPress={() => setIsModalVisible(true)}
          />
          <ListItem.Title style={styles.profileName}>{userName}</ListItem.Title>
          <ListItem.Subtitle style={styles.profileUsername}>
            {authUser?.email || "No Email"}
          </ListItem.Subtitle>
        </View>
      </Card>

      <View style={styles.infoContainer}>
        <Link href="/userDetails" asChild>
          <ListItem bottomDivider>
            <Icon name="account-circle" />
            <ListItem.Content>
              <ListItem.Title>User Details</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </Link>
        <Link href="/billing-details" asChild>
          <ListItem bottomDivider>
            <Icon name="credit-card" />
            <ListItem.Content>
              <ListItem.Title>Billing Details</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </Link>
        <Link href="/password" asChild>
          <ListItem bottomDivider>
            <Icon name="lock" />
            <ListItem.Content>
              <ListItem.Title>Change Password</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </Link>
        <Link href="/friendList" asChild>
          <ListItem bottomDivider>
            <Icon name="group" />
            <ListItem.Content>
              <ListItem.Title>Friends List</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </Link>
        <Link href="/coupon" asChild>
          <ListItem bottomDivider>
            <Icon name="tag" />
            <ListItem.Content>
              <ListItem.Title>Coupon</ListItem.Title>
            </ListItem.Content>
            <Button
              title="Apply"
              type="outline"
              buttonStyle={styles.couponButton}
            />
          </ListItem>
        </Link>
      </View>

      <Button
        title="Add Friend"
        buttonStyle={styles.addFriendButton}
        onPress={() => {}}
      />
      <Button
        title="Logout"
        buttonStyle={styles.logoutButton}
        onPress={logout}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.avatarScrollContainer}>
              {avatarSelection.map((url, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleAvatarSelect(url)}
                >
                  <Image source={{ uri: url }} style={styles.avatarOption} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button title="Close" onPress={() => setIsModalVisible(false)} />
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
  profileCard: {
    marginBottom: 16,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 8,
    elevation: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    borderWidth: 0,
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  profileUsername: {
    fontSize: 16,
    color: "gray",
  },
  infoContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  couponButton: {
    marginRight: 10,
  },
  addFriendButton: {
    height: 50,
    marginHorizontal: 20,
    backgroundColor: "#007BFF",
    borderRadius: 3,
    marginBottom: 8,
  },
  logoutButton: {
    height: 50,
    marginHorizontal: 20,
    backgroundColor: "#FF3B30",
    borderRadius: 3,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  avatarScrollContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  avatarOption: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10,
  },
});

export default Profile;
