import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import Receipt from "../../../../components/card/receiptCard";
import TotalCard from "../../../../components/totalPayment";

const AddButton = () => {
  const [title, setTitle] = useState("");

  return (
    <View style={styles.mainactivity}>
      <View style={styles.header}>
        <TextInput
          style={styles.titleInput}
          placeholder="Enter Title"
          value={title}
          onChangeText={setTitle}
        />
      </View>
      <Receipt />
      <TotalCard title={title} />
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
