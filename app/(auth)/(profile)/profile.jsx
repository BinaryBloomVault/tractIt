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
import { useAuthStore } from "../../../zustand/zustand";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const Profile = () => {
  const { authUser, logout, localUserData } = useAuthStore((state) => ({
    authUser: state.authUser,
    logout: state.logout,
    localUserData: state.localUserData,
  }));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatePhotoURL, setUpdatePhotoUrl] = useState(null); // State to store updated photo URL
  const [userName, setUserName] = useState("");

  const defaultAvatarUrl = require("../../../assets/images/profiles/p1.png");

  // Array of new profile images (local images)
  const newProfile = [
    require("../../../assets/images/profiles/p1.png"),
    require("../../../assets/images/profiles/p2.png"),
    require("../../../assets/images/profiles/p3.png"),
    require("../../../assets/images/profiles/p4.png"),
  ];

  // Initialize navigation
  const navigation = useNavigation();

  // Function to handle avatar selection
  const handleAvatarSelect = (image) => {
    setUpdatePhotoUrl(image); // Update avatar with the selected image
    setIsModalVisible(false); // Close the modal after selecting an avatar
  };

  // Use effect to set the user name from local data
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
          {/* Avatar displaying the selected image or default image */}
          <Avatar
            size={100}
            rounded
            source={updatePhotoURL ? updatePhotoURL : defaultAvatarUrl} // Use local image sources
            containerStyle={styles.avatar}
          />
          <Button
            type="clear"
            title="Edit Photo"
            onPress={() => setIsModalVisible(true)} // Open modal to select new avatar
          />
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileUsername}>
            {authUser?.email || "No Email"}
          </Text>
        </View>
      </Card>

      <View style={styles.infoContainer}>
        {/* Use navigation for routing */}
        <TouchableOpacity onPress={() => navigation.navigate("UserDetails")}>
          <CustomListItem icon="account-circle" title="User Details" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("BillingDetails")}>
          <CustomListItem icon="credit-card" title="Billing Details" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("PasswordChange")}>
          <CustomListItem icon="lock" title="Change Password" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("FriendList")}>
          <CustomListItem icon="group" title="Friends List" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Coupon")}>
          <CustomListItem icon="tag" title="Coupon">
            <Button
              title="Apply"
              type="outline"
              buttonStyle={styles.couponButton}
            />
          </CustomListItem>
        </TouchableOpacity>
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
              {newProfile.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleAvatarSelect(image)} // Update photo on select
                >
                  <Image source={image} style={styles.avatarOption} />
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
