import { Image, StyleSheet, Text, View, TextInput } from "react-native";
import { Input } from "@rneui/themed";
import SignIn from "../components/button/addButton";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import React from "react";

const login = () => {
  const router = useRouter();

  return (
    <View style={styles.loginscreen}>
      <Image
        style={styles.designer11}
        resizeMode="cover"
        source={require(`../assets/images/friends.png`)}
      />
      <Text style={styles.welcomeBack}>Welcome</Text>

      <View style={styles.inputForm}>
        <TextInput
          style={[styles.inputFormChild, styles.inputShadowBox]}
          placeholder="Email"
          placeholderTextColor="#92a0a9"
        />
        <TextInput
          style={[styles.inputFormItem, styles.inputShadowBox]}
          placeholder="Password"
          placeholderTextColor="#92a0a9"
        />
      </View>
      <View style={styles.forgotPasswordParent}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
        <Text style={[styles.reset, styles.resetTypo]}>Reset</Text>
      </View>
      <View style={styles.signInWrapper}>
        <SignIn
          title="Log in"
          fontSize={18}
          width={350}
          height={45}
          onPress={() => router.replace("/mainscreen")}
        />
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
          <Text style={[styles.signUp, styles.resetTypo]}>Sign up</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: 220,
    height: 260,
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
    marginTop: 8,
    flexDirection: "row",
  },
  inputForm: {
    height: 115,
    marginTop: 16,
    alignItems: "center",
  },
  signIn: {
    fontSize: 25,
    color: "#fff",
    width: 177,
    height: 36,
    textAlign: "center",
    fontFamily: "Gudea-Bold",
    fontWeight: "700",
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
  apple173SvgrepocomIcon: {
    marginLeft: 57,
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
  },
  signUp: {
    marginLeft: 8,
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
  },
});

export default login;
