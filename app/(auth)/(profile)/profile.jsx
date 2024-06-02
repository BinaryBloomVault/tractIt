import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Button, ListItem, Icon, Card } from "@rneui/themed";
import { Link } from "expo-router";
import { useAuthStore } from "../../../zustand/zustand";

const Profile = () => {
  const { authUser, logout } = useAuthStore((state) => ({
    authUser: state.authUser,
    logout: state.logout,
  }));

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  profileCard: {
    marginTop: 20,
    marginBottom: 24,
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
    marginBottom: 20,
  },
  couponButton: {
    marginRight: 10,
  },
  addFriendButton: {
    marginHorizontal: 20,
    backgroundColor: "#007BFF",
    marginBottom: 10,
  },
  logoutButton: {
    marginHorizontal: 20,
    backgroundColor: "#FF3B30",
  },
});

export default Profile;
