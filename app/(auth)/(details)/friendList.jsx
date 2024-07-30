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
import { useRouter, useSegments } from "expo-router";
import { useAuthStore } from "../../../zustand/zustand"; // Import Zustand store
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../../../config/firebaseConfig"; // Import Firestore config
import { AntDesign } from "@expo/vector-icons"; // Import AntDesign icon

const FriendList = () => {
  const [confirmedFriends, setConfirmedFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const { height: deviceHeight } = useWindowDimensions();
  const styles = useStyle();
  const router = useRouter();
  const loadUserData = useAuthStore((state) => state.loadUserData);
  const segments = useSegments();

  console.log(segments[-1]);
  const loadFriendRequests = useCallback(async () => {
    const userData = loadUserData();
    if (userData) {
      const userRef = doc(firestore, "users", userData.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        const friendRequests = data.friendRequests || [];
        const confirmedFriends = friendRequests.filter(
          (request) => request.confirmed
        );
        setConfirmedFriends(confirmedFriends);
      }
    }
  }, [loadUserData]);

  useEffect(() => {
    loadFriendRequests();
  }, [loadFriendRequests]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFriendRequests();
    setRefreshing(false);
  }, [loadFriendRequests]);

  const toggleCheck = (friend) => {
    setSelectedFriends((prevSelectedFriends) => {
      const updatedSelectedFriends = { ...prevSelectedFriends };
      if (updatedSelectedFriends[friend.id]) {
        delete updatedSelectedFriends[friend.id];
      } else {
        updatedSelectedFriends[friend.id] = friend;
      }
      return updatedSelectedFriends;
    });
  };
  console.log(selectedFriends);
  const onPressRight = () => {
    router.back();
  };
  const onPressLeft = () => {
    router.back();
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
          {confirmedFriends.map((friend) => (
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
          ))}
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
