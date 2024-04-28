import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
} from "react-native";
import { Card } from "@rneui/themed";
import TabButton from "./button/tabRoundButton";
import { Link } from "expo-router";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

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
      <AddButton onPress={showModal} />
      <TabButton />
      <TotalPaymentModal modalVisible={modalVisible} hideModal={hideModal} />
    </View>
  );
};

const PaymentInfo = () => {
  return (
    <Card containerStyle={styles.cardContainer}>
      <View style={styles.font}>
        <Text style={styles.text}>Your Total Payment</Text>
        <Text style={styles.total}>500</Text>
      </View>
    </Card>
  );
};

const AddButton = ({ onPress }) => {
  return (
    <View style={styles.addButtonContainer}>
      <Pressable style={styles.addButton} onPress={onPress}>
        <Text style={styles.addButtonTitle}>Add</Text>
      </Pressable>
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
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Pressable
            style={[styles.button, styles.buttonCancel]}
            onPress={hideModal}
          >
            <Text style={styles.textStyle}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonDone]}
            onPress={hideModal}
          >
            <Text style={styles.textStyle}>Done</Text>
          </Pressable>
        </View>
      </View>
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
  cardContainer: {
    position: "absolute",
    top: 0,
    borderRadius: 10,
    width: 150,
    height: 80,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  font: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 13,
    color: "#888",
    fontFamily: "Gudea-Regular",
  },
  total: {
    fontSize: 40,
    fontFamily: "Gudea-Bold",
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 115,
    width: "100%",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#00BEE5",
    borderColor: "transparent",
    borderRadius: 30,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    width: 120,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonTitle: {
    fontWeight: "700",
    fontSize: 25,
    fontFamily: "Gudea-Bold",
    color: "rgba(255, 255, 255, 1)",
  },
  modalView: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: 190,
    backgroundColor: "white",
    justifyContent: "center",
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
  button: {
    borderRadius: 20,
    width: 90,
    height: 30,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDone: {
    backgroundColor: "#00BEE5",
  },
  buttonCancel: {
    backgroundColor: "#E62D2B",
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
