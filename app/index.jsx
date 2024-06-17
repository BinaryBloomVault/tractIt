import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import SignIn from "../components/button/addButton";
import { FontAwesome } from "@expo/vector-icons";
import { useAuthStore } from "../zustand/zustand";
import { Link } from "expo-router";

const index = () => {
  const { login } = useAuthStore((state) => ({
    login: state.login,
  }));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCredentials = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginscreen}>
        <Image
          style={styles.designer11}
          resizeMode="cover"
          source={require(`../assets/images/friends.png`)}
        />
        <Text style={styles.welcomeBack}>Welcome</Text>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.select({ ios: 8, android: 500 })}
        >
          <View style={styles.inputForm}>
            <TextInput
              style={[styles.inputFormChild, styles.inputShadowBox]}
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
              title="Log in"
              fontSize={18}
              width={350}
              height={45}
              onPress={handleCredentials}
            />
          </View>
        </KeyboardAvoidingView>

        <View style={styles.forgotPasswordParent}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
          <Text style={[styles.reset, styles.resetTypo]}>Reset</Text>
        </View>
        <View style={styles.orParent}>
          <Text style={styles.or}>or</Text>
          <View style={styles.icons}>
            <Image
              style={styles.svgrepocomIconLayout}
              resizeMode="cover"
              source={require(`../assets/images/google.png`)}
            />
            <FontAwesome name="apple" size={44} color="black" />
          </View>
          <View style={styles.signUpContainer}>
            <Text style={styles.forgotPassword}>Don’t have an account?</Text>
            <Link href="/register" asChild>
              <Text style={styles.resetTypo}>Sign up</Text>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    width: "100%",
    alignItems: "center",
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
  svgrepocomIconLayout: {
    height: 40,
    width: 40,
    overflow: "hidden",
  },
  designer11: {
    marginTop: 100,
    width: 200,
    height: 230,
  },
  welcomeBack: {
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
  reset: {
    marginLeft: 5,
  },
  forgotPasswordParent: {
    height: 30,
    marginTop: 16,
    flexDirection: "row",
  },
  inputForm: {
    height: 115,
    marginTop: 16,
    alignItems: "center",
  },
  signInWrapper: {
    marginTop: 16,
  },
  or: {
    color: "#000",
    textAlign: "left",
    fontWeight: "600",
    fontSize: 15,
  },
  icons: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: 80,
  },
  signUpContainer: {
    marginTop: 21,
    flexDirection: "row",
    columnGap: 8,
  },
  orParent: {
    marginTop: 16,
    alignItems: "center",
  },
  loginscreen: {
    backgroundColor: "#f2e3a9",
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingBottom: 20,
    justifyContent: "center",
  },
});

export default index;
