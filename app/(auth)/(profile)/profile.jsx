import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Avatar, Button, Icon, Card } from "@rneui/themed";
import { useAuthStore } from "../../../zustand/zustand";
import { Link } from "expo-router";
import newProfile from "../../../constants/profile";

const Profile = () => {
  const styles = useStyle();
  const { authUser, logout, localUserData, selectedAvatar, setAvatar } =
    useAuthStore((state) => ({
      authUser: state.authUser,
      logout: state.logout,
      localUserData: state.localUserData,
      selectedAvatar: state.selectedAvatar,
      setAvatar: state.setAvatar,
    }));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userName, setUserName] = useState("");

  const defaultAvatarUrl = require("../../../assets/images/profiles/default.png");

  const handleAvatarSelect = (index) => {
    setAvatar(index);
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
            source={
              selectedAvatar !== null &&
              selectedAvatar >= 0 &&
              selectedAvatar < newProfile.length
                ? newProfile[selectedAvatar]
                : defaultAvatarUrl
            }
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
          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={styles.avatarScrollContainer}>
              {newProfile.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleAvatarSelect(index)}
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

const useStyle = () => {
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions();
  return StyleSheet.create({
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
    avatarScrollContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    avatarOption: {
      width: 50,
      height: 50,
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
};

export default Profile;
