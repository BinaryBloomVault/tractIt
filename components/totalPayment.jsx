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
import { Feather } from "@expo/vector-icons";
import { useRouter, useNavigation, useSegments, Link } from "expo-router";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const mockReceipts = [
  {
    items: "Pizza",
    quantity: "2",
    price: "20",
    friends: {
      ID_123123213123: "Lucas Green",
      ID_6546565: "Kaidus Paltos",
      ID_798789798: "Kai Tay",
    },
  },
  {
    items: "Soda",
    quantity: "5",
    price: "10",
    friends: {
      ID_123123213123: "Lucas Green",
      ID_6546565: "Kaidus Paltos",
    },
  },
  {
    items: "Burger",
    quantity: "3",
    price: "15",
    friends: {
      ID_798789798: "Kai Tay",
      ID_999999999: "Sam Smith",
    },
  },
];

const TotalPayment = ({ title }) => {
  const styles = useStyle();
  const router = useRouter();
  const modalVisible = useAuthStore((state) => state.modalVisible);
  const setModalVisible = useAuthStore((state) => state.setModalVisible);
  const selectedItemIndex = useAuthStore((state) => state.selectedItemIndex);

  const { addReceipts, receipts, addSharedReceipt, clearReceipts } =
    useAuthStore((state) => ({
      addReceipts: state.addReceipts,
      receipts: state.getReceipts(title) || [],
      addSharedReceipt: state.addSharedReceipt,
      clearReceipts: () => state.clearReceipts(title),
    }));

  const showModal = () => {
    console.log("Show Modal");
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const shareReceipts = async () => {
    await addSharedReceipt(title, receipts);
    clearReceipts();
    router.replace("/mainscreen");
  };

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
      <TabButton onPressRight={shareReceipts} />
      <TotalPaymentModal
        modalVisible={modalVisible}
        hideModal={hideModal}
        addPage={(receipt) => addReceipts(title, receipt)}
        initialPages={mockReceipts}
        clearReceipts={clearReceipts}
        selectedItemIndex={selectedItemIndex}
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
}) => {
  const styles = useStyle();
  const [pages, setPages] = useState([{}]);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollViewRef = useRef(null);
  const windowWidth = useWindowDimensions().width;
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (modalVisible && initialPages.length > 0) {
      setPages(initialPages);
    } else {
      setPages([{}]);
    }

    if (modalVisible) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [modalVisible, initialPages]);

  const addNewPage = () => {
    if (pages.length < 99) {
      const newPage = { items: "", quantity: "", price: "", friends: {} };
      setPages((prevPages) => {
        const updatedPages = [...prevPages, newPage];
        return updatedPages;
      });
      // console.log("Selected Item Index:", selectedItemIndex * windowWidth);

      setTimeout(() => {
        if (selectedItemIndex !== null && selectedItemIndex !== undefined) {
          scrollViewRef.current.scrollTo({
            x: selectedItemIndex * windowWidth,
            animated: true,
          });
          setCurrentPage(selectedItemIndex + 1);
        } else {
          scrollViewRef.current.scrollToEnd({ animated: true });
          setCurrentPage(pages.length + 1);
        }
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
      setPages((prevPages) =>
        prevPages.map((page, i) =>
          i === index ? { ...page, [field]: value } : page
        )
      );
    },
    [setPages]
  );

  const handleFriendUpdate = useCallback(
    (index, friendId, friendName) => {
      setPages((prevPages) =>
        prevPages.map((page, i) =>
          i === index
            ? {
                ...page,
                friends: { ...page.friends, [friendId]: friendName },
              }
            : page
        )
      );
    },
    [setPages]
  );

  const isButtonDisabled = useCallback(() => {
    return pages.some(
      (page) => !page.items || !page.quantity || !page.price || !page.friends
    );
  }, [pages]);
  const handlePressFriends = (index) => {
    hideModal();
    console.log(`Pressed Friends button for page ${index}`);
  };

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
                          params: { index: index },
                        }}
                        style={styles.friendsButton}
                        onPress={() => handlePressFriends(index)}
                      >
                        <Text style={styles.friendsButtonText}>Friends</Text>
                      </Link>
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
                <Text style={styles.paginationText}>
                  {currentPage}/{pages.length}
                </Text>
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
      backgroundColor: "#A7E2B3",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    friendsButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
      textAlign: "center",
    },
  });
  return styles;
};

export default TotalPayment;
