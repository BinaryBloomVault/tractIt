import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import AddButton from "../../../components/button/addButton";
import { Card, Avatar } from "@rneui/themed";
import TabButton from "../../../components/button/tabRoundButton";
import {
  useRouter,
  useSegments,
  useNavigation,
  useLocalSearchParams,
  useGlobalSearchParams,
} from "expo-router";
import { useAuthStore } from "../../../zustand/zustand";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../../../config/firebaseConfig";
import { AntDesign } from "@expo/vector-icons";
import { mmkvStorage } from "../../../zustand/zustand";

const FriendList = () => {
  const [confirmedFriends, setConfirmedFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const { height: deviceHeight } = useWindowDimensions();

  const styles = useStyle();
  const router = useRouter();

  const loadUserData = useAuthStore((state) => state.loadUserData);
  const setModalVisible = useAuthStore((state) => state.setModalVisible);

  const { previousScreen, index } = useLocalSearchParams();

  const loadFriendRequests = useCallback(
    async (fromFirebase = false) => {
      try {
        const userData = loadUserData();
        console.log("User", userData);

        if (!userData) {
          throw new Error("User data is not available");
        }

        let confirmedFriends = [];

        if (fromFirebase) {
          console.log("Fetching from Firebase", fromFirebase);
          // Fetch from Firebase on refresh
          const userRef = doc(firestore, "users", userData.uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            throw new Error("User document does not exist");
          }

          const data = userDoc.data();
          const friendRequests = data.friendRequests || [];
          confirmedFriends = friendRequests.filter(
            (request) => request.confirmed
          );

          confirmedFriends.unshift({
            id: userData.uid,
            name: userData.name,
            confirmed: true,
          });

          const localFriendRequests = userData.friendRequest || [];
          const hasChanges =
            JSON.stringify(localFriendRequests) !==
            JSON.stringify(friendRequests);

          if (hasChanges) {
            const updatedUserData = {
              ...userData,
              friendRequest: friendRequests,
            };
            mmkvStorage.setItem("user_data", JSON.stringify(updatedUserData));
          }
        } else {
          const friendRequests = userData.friendRequest || [];
          confirmedFriends = friendRequests.filter(
            (request) => request.confirmed
          );
          confirmedFriends.unshift({
            id: userData.uid,
            name: userData.name,
            confirmed: true,
          });
        }

        setConfirmedFriends(confirmedFriends);
      } catch (error) {
        console.error("Error loading friend requests:", error.message);
      }
    },
    [loadUserData]
  );
  useEffect(() => {
    loadFriendRequests(); // Load from local data initially
  }, [loadFriendRequests]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFriendRequests(true);
    setRefreshing(false);
  }, [loadFriendRequests]);
  console.log(selectedFriends);

  const toggleCheck = (friend) => {
    setSelectedFriends((prevSelectedFriends) => {
      const updatedSelectedFriends = { ...prevSelectedFriends };
      if (updatedSelectedFriends[friend.id]) {
        delete updatedSelectedFriends[friend.id];
      } else {
        updatedSelectedFriends[friend.id] = { ...friend, index: index };
      }
      return updatedSelectedFriends;
    });
  };

  const renderFriendItem = (friend) => {
    if (previousScreen === "writeReceipt") {
      return (
        <TouchableOpacity
          key={friend.id}
          style={styles.friendItem}
          onPress={() => toggleCheck(friend)}
        >
          <Avatar
            source={{ uri: "https://via.placeholder.com/50" }}
            rounded
            size="medium"
          />
          <Text style={styles.friendName}>{friend.name}</Text>
          <AntDesign
            name="checkcircle"
            size={24}
            color={selectedFriends[friend.id] ? "#00BEE5" : "transparent"}
            style={styles.checkIcon}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <View key={friend.id} style={styles.friendItem}>
          <Avatar
            source={{ uri: "https://via.placeholder.com/50" }}
            rounded
            size="medium"
          />
          <Text style={styles.friendName}>{friend.name}</Text>
        </View>
      );
    }
  };

  const onPressRight = () => {
    if (previousScreen === "writeReceipt") {
      useAuthStore.setState({ selectedFriends });
      setModalVisible(true);
      router.back();
    } else {
      router.back();
    }
  };

  const onPressLeft = () => {
    if (previousScreen === "writeReceipt") {
      setModalVisible(true);
      router.back();
    } else {
      router.back();
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <AddButton
        title="Add Friend"
        width={113}
        bottom={-22}
        left={131}
        fontSize={15}
        height={35}
        bcolor={"#00BEE5"}
        onPress={() => router.push("/addFriends")}
      />

      <View style={styles.friendListParent(40)}>
        <Text style={styles.friendList}>Friend List</Text>
      </View>
      <Card
        containerStyle={styles.containerCard(deviceHeight < 813 ? 230 : 280)}
      >
        <ScrollView>
          {confirmedFriends.map((friend) => renderFriendItem(friend))}
        </ScrollView>
      </Card>
      <View style={styles.friendListParent(24)}>
        <Text style={styles.friendList}>Group List</Text>
      </View>
      <Card
        containerStyle={styles.containerCard(deviceHeight < 813 ? 170 : 180)}
      >
        {/* Add your group list content here */}
      </Card>
      <TabButton onPressRight={onPressRight} onPressLeft={onPressLeft} />
    </ScrollView>
  );
};

const useStyle = () => {
  const { height: deviceHeight } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    friendList: {
      fontSize: 25,
      fontWeight: "700",
      fontFamily: "Cabin-Regular",
      color: "#000",
    },
    friendListParent: (marginTop) => ({
      marginTop: marginTop,
      width: 200,
      height: 40,
      borderColor: "transparent",
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#171717",
      shadowOffset: { width: -0.5, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      backgroundColor: "#f2e3a9",
      alignSelf: "center",
    }),
    containerCard: (height) => ({
      borderRadius: 10,
      shadowColor: "#171717",
      shadowOffset: { width: -0.5, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      height: height,
      marginLeft: 16,
      marginRight: 16,
      marginTop: 16,
    }),
    friendItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    friendName: {
      fontSize: 18,
      flex: 1,
      marginLeft: 10,
    },
    checkIcon: {
      marginLeft: "auto",
    },
  });
  return styles;
};

export default FriendList;
