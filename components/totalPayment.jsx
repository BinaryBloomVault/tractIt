import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import TabButton from "./button/tabRoundButton";
import AddButton from "./button/addButton";
import PaymentInfo from "./card/paymentInfo";
import { useAuthStore } from "../zustand/zustand";
import { AntDesign } from "@expo/vector-icons";
import { useRouter, Link, useLocalSearchParams } from "expo-router";
import UserIcon from "../components/icons/usersIcon";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const TotalPayment = ({ title, setTitle }) => {
  const styles = useStyle();
  const router = useRouter();
  const modalVisible = useAuthStore((state) => state.modalVisible);
  const setModalVisible = useAuthStore((state) => state.setModalVisible);
  const selectedItemIndex = useAuthStore((state) => state.selectedItemIndex);
  const selectedFriends = useAuthStore((state) => state.selectedFriends);
  const { previousScreen, uniqued } = useLocalSearchParams();

  const {
    addReceipts,
    receipts,
    addSharedReceipt,
    updateReceipt,
    clearReceipts,
  } = useAuthStore((state) => {
    const retrievedReceipts = state.getReceipts();
    return {
      addReceipts: state.addReceipts,
      receipts: retrievedReceipts,
      addSharedReceipt: state.addSharedReceipt,
      updateReceipt: state.updateReceipt,
      clearReceipts: state.clearReceipts,
    };
  });

  // Use useRef to store temporary data
  const tempPagesRef = useRef(receipts);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const shareReceipts = async () => {
    try {
      if (previousScreen === "update") {
        await updateReceipt(title, receipts, uniqued);
      } else {
        await addSharedReceipt(title, receipts);
      }
    } catch (error) {
      console.error("Error sharing receipts:", error);
    } finally {
      clearReceipts();
      setTitle("");
      router.setParams({ previousScreen: "" });
      router.replace("(auth)/(tabs)/landingscreen");
    }
  };

  const handleGoBack = () => {
    tempPagesRef.current = [];
    clearReceipts();
    setTitle("");
    router.back();
  };

  useEffect(() => {
    tempPagesRef.current = receipts;
  }, [receipts]);

  useEffect(() => {
    if (selectedFriends && Object.keys(selectedFriends).length > 0) {
      Object.entries(selectedFriends).forEach(([id, friend]) => {
        const receiptIndex = parseInt(friend.index, 10);
        console.log("Received selected friends:", receiptIndex);

        // Update the corresponding receipt in tempPagesRef.current
        if (tempPagesRef.current[receiptIndex]) {
          tempPagesRef.current[receiptIndex] = {
            ...tempPagesRef.current[receiptIndex],
            friends: {
              ...tempPagesRef.current[receiptIndex].friends,
              [id]: friend.name,
            },
          };
        }
      });
    }
  }, [selectedFriends]);

  return (
    <View style={styles.container}>
      <PaymentInfo />
      <AddButton
        onPress={showModal}
        title="Add"
        width={120}
        fontSize={25}
        height={40}
        bcolor={"#00BEE5"}
      />
      <TabButton onPressLeft={handleGoBack} onPressRight={shareReceipts} />
      <TotalPaymentModal
        modalVisible={modalVisible}
        hideModal={hideModal}
        addPage={(receipt) => addReceipts(receipt)}
        initialPages={tempPagesRef.current}
        clearReceipts={clearReceipts}
        selectedItemIndex={selectedItemIndex}
        selectedFriends={selectedFriends}
        setTempPagesRef={(newPages) => (tempPagesRef.current = newPages)}
      />
    </View>
  );
};

const TotalPaymentModal = ({
  modalVisible,
  hideModal,
  addPage,
  initialPages,
  clearReceipts,
  selectedItemIndex,
  selectedFriends,
  setTempPagesRef,
}) => {
  const styles = useStyle();
  const [pages, setPages] = useState([{}]);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollViewRef = useRef(null);
  const windowWidth = useWindowDimensions().width;

  useEffect(() => {
    if (modalVisible && initialPages.length > 0) {
      setPages(initialPages);
    } else {
      setPages([{}]);
    }

    if (modalVisible) {
      setTimeout(() => {
        const scrollOffset = selectedItemIndex * windowWidth;
        scrollViewRef.current.scrollTo({ x: scrollOffset, animated: true });
      }, 100);
    }
  }, [modalVisible, selectedItemIndex]);

  const addNewPage = () => {
    if (pages.length < 99) {
      const newPage = { items: "", quantity: "", price: "", friends: {} };
      setPages((prevPages) => {
        const updatedPages = [...prevPages, newPage];
        setTempPagesRef(updatedPages);
        return updatedPages;
      });

      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
        setCurrentPage(pages.length + 1);
      }, 100);
    }
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const newPage = Math.floor(contentOffset / windowWidth) + 1;
    setCurrentPage(newPage);
  };

  const handleSaveReceipts = useCallback(() => {
    const isValid = pages.every(
      (page) => page.items && page.quantity && page.price && page.friends
    );

    if (!isValid) {
      alert("All fields must be filled out");
      return;
    }

    // Clear previous receipts before adding new ones
    clearReceipts();

    pages.forEach((page) => {
      addPage(page);
    });

    setPages([{}]);
    setCurrentPage(1);
    hideModal();
  }, [pages, addPage, hideModal]);

  const handleFieldUpdate = useCallback(
    (index, field, value) => {
      setPages((prevPages) => {
        const updatedPages = prevPages.map((page, i) =>
          i === index ? { ...page, [field]: value } : page
        );
        setTempPagesRef(updatedPages);
        return updatedPages;
      });
    },
    [setTempPagesRef]
  );

  const isButtonDisabled = useCallback(() => {
    return pages.some(
      (page) => !page.items || !page.quantity || !page.price || !page.friends
    );
  }, [pages]);

  // console.log("Receipts: ", initialPages);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={hideModal}
      keyboardShouldPersistTaps="handled"
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.exitButton}>
              <Pressable
                onPress={handleSaveReceipts}
                disabled={isButtonDisabled()}
              >
                <AntDesign
                  name="check"
                  size={28}
                  color={isButtonDisabled() ? "grey" : "black"}
                />
              </Pressable>
            </View>
            <View style={{ marginTop: 16 }}>
              <ScrollView
                horizontal
                pagingEnabled
                ref={scrollViewRef}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContainer}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                {pages.map((page, index) => (
                  <View key={index} style={styles.pageContainer}>
                    <View style={styles.itemsParent}>
                      <Text style={styles.title}>Items</Text>
                      <TextInput
                        value={page.items}
                        onChangeText={(text) =>
                          handleFieldUpdate(index, "items", text)
                        }
                        style={styles.rectangleInput}
                        selectTextOnFocus={true}
                      />
                    </View>
                    <View style={styles.itemsParent}>
                      <Text style={styles.title}>Quantity</Text>
                      <TextInput
                        value={page.quantity}
                        onChangeText={(text) =>
                          handleFieldUpdate(index, "quantity", text)
                        }
                        style={styles.rectangleInput}
                        selectTextOnFocus={true}
                      />
                    </View>
                    <View style={styles.itemsParent}>
                      <Text style={styles.title}>Price</Text>
                      <TextInput
                        value={page.price}
                        onChangeText={(text) =>
                          handleFieldUpdate(index, "price", text)
                        }
                        style={styles.rectangleInput}
                        selectTextOnFocus={true}
                      />
                    </View>
                    <View style={styles.itemsParent}>
                      <Link
                        push
                        href={{
                          pathname: "/friendList",
                          params: {
                            previousScreen: "writeReceipt",
                            index: index,
                          },
                        }}
                        style={styles.friendsButton}
                        onPress={() => hideModal()}
                      >
                        <Text style={styles.friendsButtonText}>Friends</Text>
                      </Link>
                      <View style={styles.centeredView}>
                        <UserIcon friends={Object.values(page.friends || {})} />
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.addButtonContainer}>
                <AddButton
                  bottom={10}
                  title="Add more"
                  width={150}
                  fontSize={25}
                  height={40}
                  bcolor={"#00BEE5"}
                  onPress={addNewPage}
                  disabled={pages.length >= 99}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const useStyle = () => {
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    modalView: {
      backgroundColor: "white",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      height: screenHeight / 2,
      width: screenWidth,
    },
    exitButton: {
      marginTop: 16,
      marginRight: 24,
      alignItems: "flex-end",
      justifyContent: "flex-end",
    },
    button: {
      borderRadius: 20,
      width: 90,
      height: 30,
      marginTop: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    textStyle: {
      fontSize: 15,
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },

    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    scrollViewContainer: {
      alignItems: "center",
    },
    pageContainer: {
      width: deviceWidth,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    addButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      marginBottom: 30,
      marginTop: 60,
    },
    paginationText: {
      fontSize: 18,
      right: 44,
      bottom: 30,
      fontWeight: "800",
      fontFamily: "Gudea-Regular",
    },
    itemsParent: {
      flexDirection: "row",
      marginTop: deviceHeight < 813 ? 12 : 16,
      alignItems: "center",
      width: "80%",
    },
    title: {
      flex: 1,
      fontSize: deviceHeight < 813 ? 20 : 22,
      fontWeight: "bold",
      fontFamily: "Gudea-Bold",
      textAlign: "left",
    },
    rectangleInput: {
      borderRadius: 5,
      borderStyle: "solid",
      borderColor: "#888",
      borderWidth: 1,
      width: "70%",
      height: deviceHeight < 813 ? 32 : 40,
    },
    friendsButton: {
      backgroundColor: "#00BEE5",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    },
    friendsButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
      textAlign: "center",
    },
    centeredView: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },
  });
  return styles;
};

export default TotalPayment;
