import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { Avatar, Button, Icon, Card } from "@rneui/themed";
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
  const [userName, setUserName] = useState("");
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
      setUserName(localUserData.name || "No Name");
    }
  }, [localUserData]);

  const CustomListItem = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon name={icon} />
      </View>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileUsername}>
            {authUser?.email || "No Email"}
          </Text>
        </View>
      </Card>

      <View style={styles.infoContainer}>
        <Link href="/userDetails" asChild>
          <CustomListItem icon="account-circle" title="User Details" />
        </Link>
        <Link href="/billing-details" asChild>
          <CustomListItem icon="credit-card" title="Billing Details" />
        </Link>
        <Link href="/password" asChild>
          <CustomListItem icon="lock" title="Change Password" />
        </Link>
        <Link href="/friendList" asChild>
          <CustomListItem icon="group" title="Friends List" />
        </Link>
        <Link href="/coupon" asChild>
          <CustomListItem icon="tag" title="Coupon">
            <Button
              title="Apply"
              type="outline"
              buttonStyle={styles.couponButton}
            />
          </CustomListItem>
        </Link>
      </View>

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
    paddingVertical: 5,
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
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  iconContainer: {
    marginRight: 16,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
  },
});

export default Profile;
