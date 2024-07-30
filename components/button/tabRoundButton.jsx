import { View, Text, Platform } from "react-native";
import React from "react";
import { Button } from "@rneui/base";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons"; // Import icons

const tabRoundButton = ({ onPressRight, onPressLeft }) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        position: "absolute",
        bottom: 0,
        width: "100%",
      }}
    >
      <Button
        icon={<Feather name="x" size={40} color="black" />}
        buttonStyle={{
          backgroundColor: "#FFFF",
          borderRadius: 100,
        }}
        containerStyle={{
          width: 100,
          height: Platform.OS === "ios" ? 120 : 100,
          shadowColor: "#171717",
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          padding: 20,
        }}
        onPress={onPressLeft}
      />
      <Button
        icon={<Feather name="check" size={40} color="black" />}
        buttonStyle={{
          backgroundColor: "#FFFF",
          borderRadius: 100,
        }}
        containerStyle={{
          width: 100,
          height: Platform.OS === "ios" ? 120 : 100,
          shadowColor: "#171717",
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          padding: 20,
        }}
        onPress={onPressRight}
      />
    </View>
  );
};

export default tabRoundButton;
