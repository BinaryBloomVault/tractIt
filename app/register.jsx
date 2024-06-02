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
} from "react-native";
import SignIn from "../components/button/AddButton";
import { useAuthStore } from "../zustand/zustand";
import { Link } from "expo-router";

const Register = () => {
  const { register } = useAuthStore((state) => ({
    register: state.register,
  }));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const windowHeight = useWindowDimensions().height;

  const handleRegister = async () => {
    try {
      await register(email, password, name);
    } catch (error) {
      console.error("Error registering:", error);
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
        <TextInput
          style={[styles.inputFormItem, styles.inputShadowBox]}
          placeholder="Password"
          placeholderTextColor="#92a0a9"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.signInWrapper}>
        <SignIn
          title="Sign Up"
          fontSize={18}
          width={350}
          height={45}
          onPress={handleRegister}
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
});

export default Register;
