import React, { useState, useRef, useCallback } from "react";
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
import TabButton from "./button/TabRoundButton";
import AddButton from "./button/AddButton";
import PaymentInfo from "./card/PaymentInfo";
// import AddDataModal from "./card/AddDataModal";
import { useAuthStore } from "../zustand/zustand";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const TotalPayment = () => {
  const styles = useStyle();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const { addReceipts, receipts, addSharedReceipt } = useAuthStore((state) => ({
    addReceipts: state.addReceipts,
    receipts: state.receipts,
    addSharedReceipt: state.addSharedReceipt,
  }));
  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const shareReceipts = () => {
    addSharedReceipt(receipts);
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
      />
      <TabButton onPress={shareReceipts} />
      <TotalPaymentModal
        modalVisible={modalVisible}
        hideModal={hideModal}
        addPage={addReceipts}
      />
    </View>
  );
};

const TotalPaymentModal = ({ modalVisible, hideModal, addPage }) => {
  const styles = useStyle();
  const [pages, setPages] = useState([{}]);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollViewRef = useRef(null);
  const windowWidth = useWindowDimensions().width;

  const addNewPage = () => {
    if (pages.length < 99) {
      const newPage = { items: "", quantity: "", price: "", friends: "" };
      setPages((prevPages) => [...prevPages, newPage]);
      setCurrentPage(currentPage + 1);
      setTimeout(() => {
        scrollViewRef.current.scrollTo({
          x: windowWidth * pages.length,
          animated: true,
        });
      }, 100);
    }
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentPage = Math.floor(contentOffset / windowWidth) + 1;
    setCurrentPage(currentPage);
  };

  const handleSaveReceipts = useCallback(() => {
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
              <Pressable onPress={handleSaveReceipts}>
                <AntDesign name="check" size={28} color="black" />
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
                        value={page.item}
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
                      <Text style={styles.title}>Friends</Text>
                      <TextInput
                        value={page.friends}
                        onChangeText={(text) =>
                          handleFieldUpdate(index, "friends", text)
                        }
                        style={styles.rectangleInput}
                        selectTextOnFocus={true}
                      />
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
                  onPress={addNewPage}
                  disabled={pages.length >= 99}
                />
                <Text style={styles.paginationText}>
                  {currentPage > 0 ? currentPage : 1}/{pages.length}
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
  });
  return styles;
};

export default TotalPayment;
