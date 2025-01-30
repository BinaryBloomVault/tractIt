import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import SignIn from "../components/button/addButton";
import { useAuthStore } from "../zustand/zustand";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Register = () => {
  const { register } = useAuthStore((state) => ({
    register: state.register,
  }));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [hideShow, setHideShow] = useState(true);
  const [textFormat, setTextFormat] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const windowHeight = useWindowDimensions().height;

  const testInputs = /^[^<>&/=]*$/;

  const securityTest = (text) => {
    const isValid = testInputs.test(text);
    return isValid;
  };

  const passHideShow = () => {
    setHideShow(!hideShow);
  };

  const handleRegister = async () => {
    try {
      if (
        !securityTest(email) ||
        !securityTest(password) ||
        !securityTest(name)
      ) {
        setTextFormat(true);
        return;
      }
      await register(email, password, name);
    } catch (error) {
      return;
    }
  };

  return (
    <View style={styles.registerscreen}>
      <Text style={styles.welcome}>Register</Text>
      <View style={styles.inputForm}>
        <TextInput
          style={[styles.inputFormChild, styles.inputShadowBox]}
          placeholder="Name"
          placeholderTextColor="#92a0a9"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.inputFormItem, styles.inputShadowBox]}
          placeholder="Email"
          placeholderTextColor="#92a0a9"
          value={email}
          onChangeText={setEmail}
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
            placeholder="New password"
            placeholderTextColor="#92a0a9"
            secureTextEntry={hideShow}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={passHideShow} style={styles.iconContainer}>
            <Ionicons
              name={hideShow ? "eye-off" : "eye"}
              size={24}
              color="grey"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.signInWrapper}>
        <SignIn
          title="Sign Up"
          fontSize={18}
          width={350}
          height={45}
          onPress={handleRegister}
          bcolor={"#00BEE5"}
        />
      </View>
      <View style={styles.orParent}>
        <View style={styles.signUpContainer}>
          <Text style={styles.forgotPassword}>Already have an account?</Text>
          <Link href="/" asChild>
            <Text style={styles.resetTypo}>Log in</Text>
          </Link>
        </View>
      </View>
      {textFormat && (
        <Text style={styles.textFormats}>Warning! Invalid text format.</Text>
      )}
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
  welcome: {
    fontSize: 45,
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
  registerscreen: {
    backgroundColor: "#f2e3a9",
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
  textFormats: {
    color: "#CA0404",
    fontWeight: "bold",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Register;
