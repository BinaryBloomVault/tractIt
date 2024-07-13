import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Avatar, Button, ListItem, Icon, Card } from "@rneui/themed";
import { Link } from "expo-router";
import { useAuthStore } from "../../../zustand/zustand";

const userDetails = () => {
  const { authUser, logout } = useAuthStore((state) => ({
    authUser: state.authUser,
    logout: state.logout,
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.infoContainer}>
        <ListItem bottomDivider>
            <Icon name="person" />
            <ListItem.Content>
              <ListItem.Title>{authUser.name}</ListItem.Title>
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
            <ListItem.Content>
              <ListItem.Title>Delete Account</ListItem.Title>
            </ListItem.Content>
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
});

export default userDetails;
