import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import SignIn from "../../../components/button/addButton";
import { useAuthStore } from "../../../zustand/zustand";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const password = () => {
  const { register } = useAuthStore((state) => ({
    register: state.register,
  }));
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPasword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [hideShowOld, setHideShowOld] = useState(true);
  const [hideShowNew, setHideShowNew] = useState(true);
  const windowHeight = useWindowDimensions().height;

  const handleRegister = async () => {
    try {
      await register(email, password, name);
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  const passHideShow = () => {
    setHideShowOld(!hideShowOld);
  };

  const passHideShow1 = () => {
    setHideShowNew(!hideShowNew);
  };

  return (
    <View style={styles.mainscreen}>
      <Text style={styles.title}>Update passcode</Text>
      <View style={styles.inputForm}>
        <TextInput
          style={[styles.inputFormChild, styles.inputShadowBox]}
          placeholder="Email"
          placeholderTextColor="#92a0a9"
          value={email}
          onChangeText={setEmail}
        />
        <View style={[styles.inputFormItem, styles.inputShadowBox, styles.passwordContainer]}>
            <TextInput
            style={{flex: 1}}
            placeholder="Old password"
            placeholderTextColor="#92a0a9"
            secureTextEntry={hideShowOld}
            value={oldPassword}
            onChangeText={setOldPasword}
            />
            <TouchableOpacity onPress={passHideShow} style={styles.iconContainer}>
                <Ionicons
                name={hideShowOld ? "eye-off" : "eye"}
                size={24}
                color="grey"
                />
          </TouchableOpacity>
        </View>
        <View style={[styles.inputFormItem, styles.inputShadowBox, styles.passwordContainer]}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="New password"
            placeholderTextColor="#92a0a9"
            secureTextEntry={hideShowNew}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={passHideShow1} style={styles.iconContainer}>
            <Ionicons
              name={hideShowNew ? "eye-off" : "eye"}
              size={24}
              color="grey"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.signInWrapper}>
        <SignIn
          title="Submit"
          fontSize={18}
          width={350}
          height={45}
          bcolor={"#00BEE5"}
          onPress={handleRegister}
        />
      </View>
      <View style={styles.orParent}>
        <View style={styles.signUpContainer}>
          <Text style={styles.forgotPassword}>Go back to ?</Text>
          <Link href="/" asChild>
            <Text style={styles.resetTypo}>Log in</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputShadowBox: {
    fontSize: 15,
    justifyContent: "center",
    backgroundColor: "#ffff",
    borderRadius: 10,
    flexDirection: "row",
    height: 50,
    width: 350,
    fontFamily: "Gudea-Bold",
    fontWeight: "700",
    alignItems: "center",
  },
  resetTypo: {
    color: "#00bee5",
    textAlign: "left",
    fontSize: 15,
    fontFamily: "Gudea-Bold",
    fontWeight: "700",
  },
  title: {
    fontSize: 40,
    height: 70,
    marginTop: 16,
    width: 350,
    textAlign: "center",
    color: "#000",
    fontFamily: "Gudea-Bold",
    fontWeight: "800",
  },
  inputFormChild: {
    alignItems: "center",
    paddingHorizontal: 19,
    paddingVertical: 14,
  },
  inputFormItem: {
    alignItems: "center",
    paddingHorizontal: 19,
    paddingVertical: 14,
    marginTop: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginLeft: 10,
  },
  forgotPassword: {
    color: "#92a0a9",
    fontWeight: "700",
  },
  signInWrapper: {
    marginTop: 24,
  },
  orParent: {
    marginTop: 16,
    alignItems: "center",
  },
  mainscreen: {
    backgroundColor: "#f3f3f3",
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingBottom: 20,
    justifyContent: "center",
  },
  signUpContainer: {
    marginTop: 21,
    flexDirection: "row",
    columnGap: 8,
  },
});

export default password;
