import { View, Text } from "react-native";
import React from "react";
import { Redirect } from "expo-router";
import { create } from "zustand";

const index = () => {
  return <Redirect href="/home" />;
};

export default index;
