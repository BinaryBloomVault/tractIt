import { View, Text, StyleSheet } from "react-native";
import Receipt from "../../components/card/receiptCard";
import TotalCard from "../../components/totalPayment";
const addButton = () => {
  return (
    <View style={styles.mainactivity}>
      <Receipt />
      <TotalCard />
    </View>
  );
};

const styles = StyleSheet.create({
  mainactivity: {
    flex: 1,
    backgroundColor: "#A9DFBF",
  },
  font: {
    fontSize: 20,
  },
});
export default addButton;
