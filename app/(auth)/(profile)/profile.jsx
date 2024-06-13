import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Avatar, Button, ListItem, Icon, Card } from "@rneui/themed";
import { Link } from "expo-router";
import { useAuthStore } from "../../../zustand/zustand";

const Profile = () => {
  const { authUser, logout } = useAuthStore((state) => ({
    authUser: state.authUser,
    logout: state.logout,
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card containerStyle={styles.profileCard}>
        <View style={styles.profileContainer}>
          <Avatar
            size={100}
            rounded
            source={{
              uri: authUser?.photoURL || "https://via.placeholder.com/150",
            }}
            containerStyle={styles.avatar}
          />
          <Button type="clear" title="Edit Photo" />
          <ListItem.Title style={styles.profileName}>
            {authUser?.displayName || "No Name"}
          </ListItem.Title>
          <ListItem.Subtitle style={styles.profileUsername}>
            {authUser?.email || "No Email"}
          </ListItem.Subtitle>
        </View>
      </Card>

      <View style={styles.infoContainer}>
        <Link href="/email" asChild>
          <ListItem bottomDivider>
            <Icon name="email" />
            <ListItem.Content>
              <ListItem.Title>Email</ListItem.Title>
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
        <Link href="/change-password" asChild>
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
      <Button
        title="Delete Account"
        buttonStyle={styles.deleteButton}
        titleStyle={styles.deleteButtonText}
        onPress={logout}
      />
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
  deleteButton: {
    height: 50,
    marginHorizontal: 20,
    backgroundColor: "#2C2C2C",
    marginBottom: 8,
  },
  deleteButtonText: {
    color: "#FFFFFF", // White text color
  }
});

export default Profile;
