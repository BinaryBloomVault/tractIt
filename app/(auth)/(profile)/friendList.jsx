import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import AddButton from "../../../components/button/addButton";
import { Card, Avatar } from "@rneui/themed";
import TabButton from "../../../components/button/tabRoundButton";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "../../../zustand/zustand";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../../../config/firebaseConfig";
import { AntDesign } from "@expo/vector-icons";
import { mmkvStorage } from "../../../zustand/zustand";

const FriendList = () => {
  const [confirmedFriends, setConfirmedFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState({});
  const [selectedModalFriends, setSelectedModalFriends] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [titleModalVisible, setTitleModalVisible] = useState(false);
  const [groupTitle, setGroupTitle] = useState("");
  const { height: deviceHeight } = useWindowDimensions();

  const styles = useStyle();
  const router = useRouter();

  const loadUserData = useAuthStore((state) => state.loadUserData);
  const addGroup = useAuthStore((state) => state.addGroup);
  const loadGroups = useAuthStore((state) => state.loadGroups);
  const setModalVisible = useAuthStore((state) => state.setModalVisible);
  const { groups } = useAuthStore((state) => ({
    groups: state.groups,
  }));
  const setSelectedItemIndex = useAuthStore(
    (state) => state.setSelectedItemIndex
  );
  const { previousScreen, index } = useLocalSearchParams();

  const loadFriendRequests = useCallback(
    async (fromFirebase = false) => {
      try {
        const userData = loadUserData();

        if (!userData) {
          throw new Error("User data is not available");
        }

        let confirmedFriends = [];

        if (fromFirebase) {
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
    loadFriendRequests();
    loadGroups();
  }, [loadFriendRequests, loadGroups]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFriendRequests(true);
    setRefreshing(false);
  }, [loadFriendRequests]);

  const toggleCheck = (friend) => {
    setSelectedFriends((prevSelectedFriends) => {
      const updatedSelectedFriends = { ...prevSelectedFriends };
      if (updatedSelectedFriends[friend.id]) {
        delete updatedSelectedFriends[friend.id];
      } else {
        updatedSelectedFriends[friend.id] = { ...friend, index: index };
      }
      if (Object.keys(updatedSelectedFriends).length === 0) {
        setSelectedGroup(null);
      }

      return updatedSelectedFriends;
    });
  };

  const toggleModalCheck = (friend) => {
    setSelectedModalFriends((prevSelectedModalFriends) => {
      const updatedSelectedModalFriends = { ...prevSelectedModalFriends };
      if (updatedSelectedModalFriends[friend.id]) {
        delete updatedSelectedModalFriends[friend.id];
      } else {
        updatedSelectedModalFriends[friend.id] = { ...friend, index: index };
      }
      return updatedSelectedModalFriends;
    });
  };

  const toggleGroupCheck = (group) => {
    setSelectedGroup((prevSelectedGroup) => {
      if (prevSelectedGroup?.id === group.id) {
        setSelectedFriends({});
        return null;
      }
      const selectedFriendsFromGroup = group.members.reduce((acc, member) => {
        acc[member.id] = {
          ...member,
          ...(index !== null ? { index } : {}),
        };
        return acc;
      }, {});

      setSelectedFriends(selectedFriendsFromGroup);
      return group;
    });
  };

  const resetModalSelections = () => {
    setSelectedModalFriends({});
    setSelectedGroup(null);
  };

  const renderFriendItem = (friend) => (
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

  const renderModalFriendItem = (friend) => (
    <TouchableOpacity
      key={friend.id}
      style={styles.friendItem}
      onPress={() => toggleModalCheck(friend)}
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
        color={selectedModalFriends[friend.id] ? "#00BEE5" : "transparent"}
        style={styles.checkIcon}
      />
    </TouchableOpacity>
  );

  const renderGroupItem = (group) => (
    <TouchableOpacity
      key={group.id}
      style={styles.groupItem}
      onPress={() => toggleGroupCheck(group)}
    >
      <Text style={styles.groupName}>{group.name}</Text>
      <AntDesign
        name="checkcircle"
        size={24}
        color={selectedGroup?.id === group.id ? "#00BEE5" : "transparent"}
        style={styles.checkIcon}
      />
    </TouchableOpacity>
  );

  const onPressRight = () => {
    if (previousScreen === "writeReceipt") {
      useAuthStore.setState({ selectedFriends });
      setSelectedItemIndex(index);
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

  const handleAddGroup = () => {
    setGroupModalVisible(true);
  };

  const closeGroupModal = () => {
    setGroupModalVisible(false);
    resetModalSelections();
  };

  const openTitleModal = () => {
    setGroupModalVisible(false);
    setTitleModalVisible(true);
  };

  const closeTitleModal = () => {
    setTitleModalVisible(false);
    resetModalSelections();
  };

  const handleCreateGroup = () => {
    openTitleModal();
  };

  const handleSaveGroup = () => {
    const groupMembers = Object.keys(selectedModalFriends).map(
      (id) => selectedModalFriends[id]
    );
    addGroup(groupTitle, groupMembers);
    closeTitleModal();
  };

  const isCreateGroupDisabled = Object.keys(selectedModalFriends).length === 0;

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
        containerStyle={styles.containerCardGroup(
          deviceHeight < 813 ? 170 : 250
        )}
      >
        <AddButton
          title="Add Group"
          width={100}
          left={128}
          fontSize={12}
          height={30}
          bcolor={"#00BEE5"}
          onPress={handleAddGroup}
        />
        <ScrollView style={{ marginTop: 8, marginBottom: 16 }}>
          {groups.map((group) => renderGroupItem(group))}
        </ScrollView>
      </Card>

      <Modal
        visible={groupModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeGroupModal}
      >
        <TouchableWithoutFeedback onPress={closeGroupModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <Card containerStyle={styles.modalCard}>
                <ScrollView>
                  {confirmedFriends.map((friend) =>
                    renderModalFriendItem(friend)
                  )}
                </ScrollView>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.createGroupButton,
                      isCreateGroupDisabled && styles.disabledButton,
                    ]}
                    onPress={handleCreateGroup}
                    disabled={isCreateGroupDisabled}
                  >
                    <Text style={styles.createGroupButtonText}>
                      Create Group
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={closeGroupModal}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={titleModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeTitleModal}
      >
        <TouchableWithoutFeedback onPress={closeTitleModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <Card containerStyle={styles.modalCard}>
                <Text style={styles.modalTitle}>Enter Group Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Group Title"
                  value={groupTitle}
                  onChangeText={setGroupTitle}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.createGroupButton}
                    onPress={handleSaveGroup}
                  >
                    <Text style={styles.createGroupButtonText}>Save Group</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={closeTitleModal}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
    containerCardGroup: (height) => ({
      borderRadius: 10,
      shadowColor: "#171717",
      shadowOffset: { width: -0.5, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      height: height,
      marginLeft: 16,
      marginRight: 16,
      marginTop: 16,
      paddingBottom: 30,
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
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalCard: {
      width: "80%",
      borderRadius: 10,
      shadowColor: "#171717",
      shadowOffset: { width: -0.5, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      padding: 20,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    createGroupButton: {
      backgroundColor: "#00BEE5",
      padding: 10,
      borderRadius: 10,
      alignItems: "center",
      width: "48%",
    },
    cancelButton: {
      backgroundColor: "#E74C3C",
      padding: 10,
      borderRadius: 10,
      alignItems: "center",
      width: "48%",
    },
    disabledButton: {
      backgroundColor: "#cccccc",
    },
    createGroupButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    cancelButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    modalTitle: {
      fontSize: 24,
      marginBottom: 16,
    },
    input: {
      height: 40,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 20,
      width: "100%",
    },
    groupItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    groupName: {
      fontSize: 18,
      flex: 1,
      fontWeight: "bold",
      color: "#000",
    },
  });
  return styles;
};

export default FriendList;
