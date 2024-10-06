import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import Receipt from "../../../components/card/receiptCard";
import TotalCard from "../../../components/totalPayment";
import { useAuthStore } from "../../../zustand/zustand";
import { useLocalSearchParams } from "expo-router";
const AddButton = () => {
  const { title, setTitle } = useAuthStore((state) => ({
    title: state.title,
    setTitle: state.setTitle,
  }));
  const userId = useAuthStore((state) => state.localUserData?.uid);

  const { originatorId } = useLocalSearchParams();

  const [isFocus, setFocus] = useState(false);

  return (
    <View style={styles.mainactivity}>
      <View style={styles.header}>
        <TextInput
          style={styles.titleInput}
          placeholder="Enter Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
          onFocus={() => setFocus(true)}
          onBlur={() => {
            setFocus(false);
          }}
          editable={originatorId === userId}
        />
      </View>
      <Receipt />
      <TotalCard title={title} setTitle={setTitle} isFocused={isFocus} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainactivity: {
    flex: 1,
    backgroundColor: "#A9DFBF",
  },
  header: {
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 4,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  titleInput: {
    fontSize: 18,
    fontWeight: "bold",
    width: "80%",
    padding: 8,
    textAlign: "center",
  },
  font: {
    fontSize: 20,
  },
});

export default AddButton;
