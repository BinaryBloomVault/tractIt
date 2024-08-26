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

const EmailUpdate = () => {
  const { authUser, logout, localUserData } = useAuthStore((state) => ({
    authUser: state.authUser,
    logout: state.logout,
    localUserData: state.localUserData,
  }));

  const { updateEmail } = useAuthStore((state) => ({
    updateEmail: state.updateEmail,
  }));
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const windowHeight = useWindowDimensions().height;

  const handleUpdateEmail = async () => {
    try {
      await updateEmail(authUser.email, newEmail, password);
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.mainscreen}>
      <Text style={styles.title}>Update Email</Text>
      <View style={styles.inputForm}>
        <TextInput
          style={[styles.inputFormChild, styles.inputShadowBox]}
          placeholderTextColor="#92a0a9"
          value={authUser.email}
          editable={false}
        />
        <TextInput
          style={[styles.inputFormItem, styles.inputShadowBox]}
          placeholder="New email"
          placeholderTextColor="#92a0a9"
          value={newEmail}
          onChangeText={setNewEmail}
        />
        <View
          style={[
            styles.inputFormItem,
            styles.inputShadowBox,
            styles.passwordContainer,
          ]}
        >
          <TextInput
            style={{ flex: 1 }}
            placeholder="Confirm password"
            placeholderTextColor="#92a0a9"
            secureTextEntry={secureTextEntry}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={toggleSecureTextEntry}
            style={styles.iconContainer}
          >
            <Ionicons
              name={secureTextEntry ? "eye-off" : "eye"}
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
          onPress={handleUpdateEmail}
        />
      </View>
      <View style={styles.orParent}>
        <View style={styles.signUpContainer}>
          <Text style={styles.forgotPassword}>or</Text>
        </View>
      </View>
      <View style={styles.signInWrapper}>
        <SignIn
          title="Delete Account"
          fontSize={18}
          width={350}
          height={45}
          bcolor={"#d2d7ea"}
          onPress={handleUpdateEmail}
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
    marginTop: 20,
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
    paddingBottom: 10,
    justifyContent: "center",
  },
  signUpContainer: {
    marginTop: 21,
    flexDirection: "row",
    columnGap: 8,
  },
});

export default EmailUpdate;
