import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Avatar } from "@rneui/themed";
import { useAuthStore } from "../../../zustand/zustand";

const AddFriendScreen = () => {
  const [search, setSearch] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFriend, setCurrentFriend] = useState(null);
  const searchResults = useAuthStore((state) => state.searchResults);
  const searchFriendsByName = useAuthStore(
    (state) => state.searchFriendsByName
  );
  const addFriendRequest = useAuthStore((state) => state.addFriendRequest);

  useEffect(() => {
    if (search) {
      searchFriendsByName(search);
    }
  }, [search]);

  const handleSelectFriend = (friend) => {
    setCurrentFriend(friend);
    setModalVisible(true);
  };

  const handleAddFriend = async () => {
    if (currentFriend) {
      setSelectedFriends((prev) => [...prev, currentFriend.id]);
      console.log("item:", currentFriend.name);

      await addFriendRequest(currentFriend.id, currentFriend.name);
    }
    closeModal();
  };

  const handleCancel = () => {
    if (currentFriend) {
      setSelectedFriends((prev) =>
        prev.filter((id) => id !== currentFriend.id)
      );
    }
    closeModal();
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentFriend(null);
  };

  const renderFriendItem = ({ item }) => {
    const isSelected = selectedFriends.includes(item.id);

    return (
      <TouchableOpacity onPress={() => handleSelectFriend(item)}>
        <Card containerStyle={styles.friendItem}>
          <View style={styles.friendContent}>
            <Avatar
              source={{ uri: item.avatar || "https://via.placeholder.com/50" }}
              rounded
              size="medium"
            />
            <Text style={styles.friendName}>{item.name}</Text>
            <Ionicons
              name={isSelected ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={isSelected ? "green" : "gray"}
            />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={searchResults}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search name"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
      {currentFriend && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <View style={styles.buttonContainer}>
                <Pressable
                  style={[styles.button, styles.buttonAdd]}
                  onPress={handleAddFriend}
                >
                  <Text style={styles.textStyle}>Add</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonCancel]}
                  onPress={handleCancel}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 0,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
    elevation: 0.5,
  },
  searchInput: {
    height: 40,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#F8F8F8",
  },
  listContainer: {
    paddingHorizontal: 8,
  },
  friendItem: {
    padding: 16,
    borderWidth: 0,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 4,
    elevation: 0.5,
  },
  friendContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 12,
  },
  friendName: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 16,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 150, // Adjust button width
    alignItems: "center", // Center the text
  },
  buttonAdd: {
    backgroundColor: "#00BFFF",
  },
  buttonCancel: {
    backgroundColor: "#FF3B30",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default AddFriendScreen;
