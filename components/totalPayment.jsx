import React, { useState } from "react";
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
} from "react-native";
import TabButton from "./button/tabRoundButton";
import AddButton from "../components/button/addButton";
import PaymentInfo from "../components/card/paymentInfo";
import AddDataModal from "./card/addDataModal";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
const TotalPayment = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
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
      <TabButton />
      <TotalPaymentModal modalVisible={modalVisible} hideModal={hideModal} />
    </View>
  );
};

const TotalPaymentModal = ({ modalVisible, hideModal }) => {
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
              <Pressable onPress={hideModal}>
                <Feather name="x" size={28} color="black" />
              </Pressable>
              <Pressable onPress={hideModal}>
                <AntDesign name="check" size={28} color="black" />
              </Pressable>
            </View>
            <AddDataModal />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

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
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: 290,
    justifyContent: "center",
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
});

export default TotalPayment;
