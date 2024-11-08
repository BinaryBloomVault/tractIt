import { View, Platform, Dimensions } from "react-native";
import React from "react";
import { Button } from "@rneui/base";
import { Feather } from "@expo/vector-icons"; // Import icons

const TabRoundButton = ({ onPressRight, onPressLeft, isEnabled }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom: Dimensions.get("window").height * 0.05,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 30,
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
          disabled={isEnabled}
        />
      </View>
    </View>
  );
};

export default TabRoundButton;
