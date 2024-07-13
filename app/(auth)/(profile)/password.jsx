import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  useWindowDimensions,
  TouchableOpacity,
  Alert
} from "react-native";
import SignIn from "../../../components/button/addButton";
import { useAuthStore } from "../../../zustand/zustand";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../../config/firebaseConfig";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

const Password = () => {

  const { authUser, logout } = useAuthStore((state) => ({
    authUser: state.authUser,
    logout: state.logout,
  }));

  const { register } = useAuthStore((state) => ({
    register: state.register,
  }));

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verification, setVerification] = useState("");
  const [validate, setValidate] = useState(false);
  const [hideShowOld, setHideShowOld] = useState(true);
  const [hideShowNew, setHideShowNew] = useState(true);
  const windowHeight = useWindowDimensions().height;

  const handlePasswordUpdate = async () => {
    try {
      // Get the current user
      const user = auth.currentUser;

      if (user) {
        // Re-authenticate the user
        const credential = EmailAuthProvider.credential(email, oldPassword);
        await reauthenticateWithCredential(user, credential);

        // Update the password
        await updatePassword(user, newPassword);
        setValidate(true)
        setVerification("Success! Updated password.")
        setOldPassword('')
        setNewPassword('')
      }
    } catch (error) {
      setValidate(false)
      setVerification("Old password is incorrect.");
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
      <Text style={styles.title}>Update Password</Text>
      <View style={styles.inputForm}>
        <TextInput
          style={[styles.inputFormChild, styles.inputShadowBox]}
          placeholderTextColor="#92a0a9"
          value={authUser.email}
          editable={false}
        />
        <View style={[styles.inputFormItem, styles.inputShadowBox, styles.passwordContainer]}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Old password"
            placeholderTextColor="#92a0a9"
            secureTextEntry={hideShowOld}
            value={oldPassword}
            onChangeText={setOldPassword}
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
          onPress={handlePasswordUpdate}
        />
      </View>
      <View style={styles.orParent}>
        <View style={styles.signUpContainer}>
          <Text style={styles.forgotPassword}>Go back to?</Text>
          <TouchableOpacity onPress={logout}>
              <Text style={styles.resetTypo}>Log in</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.verified, { color: validate ? "#8cb1d5" : "#EAAA64" }]}>
            {verification}
          </Text>
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
    marginLeft: 5,
    fontSize: 15,
    fontFamily: "Gudea-Bold",
    fontWeight: "700",
  },
  verified: {
    textAlign: "center",
    fontSize: 15,
    fontFamily: "Gudea-Bold",
    fontWeight: "700",
    marginTop: 16,
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
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Password;
