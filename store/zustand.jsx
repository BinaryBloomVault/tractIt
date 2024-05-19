import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import {
  hasUserDataChanged,
  hasUserFriendsChanged,
  hasUserReceiptsChanged,
} from "../util/dataUtil";
import { auth } from "../config/firebaseConfig";
import {
  signInWithEmailAndPassword,
  signOut,
  signInWithCustomToken,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import { firestore } from "../config/firebaseConfig";
import _ from "lodash";

export const useAuthStore = create((set, get) => ({
  user: null,
  authToken: null,
  localUserData: null,
  isOffline: true,
  receipts: [],

  login: async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const token = await user.getIdToken();
      const userDataPayload = {
        name: user.displayName || "",
        email: user.email || "",
        friends: {},
        sharedReceipts: {},
      };

      await SecureStore.setItemAsync("auth_token", token);
      await SecureStore.setItemAsync(
        "user_data",
        JSON.stringify(user.toJSON())
      );
      set({
        user: userDataPayload,
        authToken: token,
        localUserData: userDataPayload,
        isOffline: false,
      });
      await syncUserData(token, user.toJSON());
    } catch (error) {
      console.error("Error logging in:", error);
      set({ isOffline: true });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      await SecureStore.deleteItemAsync("auth_token");
      await SecureStore.deleteItemAsync("user_data");
      set({
        user: null,
        authToken: null,
        localUserData: null,
        isOffline: true,
        receipts: [],
      });
    } catch (error) {
      console.error("Error logging out:", error);
      set({ isOffline: true });
    }
  },

  getAuthToken: async () => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      const userData = await SecureStore.getItemAsync("user_data");
      if (token && userData) {
        const user = JSON.parse(userData);
        await signInWithCustomToken(auth, token);
        set({ authToken: token, user, localUserData: user, isOffline: false });
        await syncUserData(token, user);
      }
      return token;
    } catch (error) {
      console.error("Error getting auth token:", error);
      set({ isOffline: true });
      return null;
    }
  },

  addReceipt: async (newReceipt) => {
    try {
      const token = await get().authToken;
      const userData = await get().localUserData;
      const newReceiptList = [...get().receipts, newReceipt];
      await SecureStore.setItemAsync(
        "user_data",
        JSON.stringify({ ...userData, sharedReceipts: newReceiptList })
      );
      set({
        localUserData: { ...userData, sharedReceipts: newReceiptList },
        receipts: newReceiptList,
      });
      await syncUserData(token, {
        ...userData,
        sharedReceipts: newReceiptList,
      });
    } catch (error) {
      console.error("Error adding receipt:", error);
    }
  },

  removeReceipt: async (receiptId) => {
    try {
      const token = await get().authToken;
      const userData = await get().localUserData;
      const newReceiptList = get().receipts.filter(
        (receipt) => receipt.id !== receiptId
      );
      await SecureStore.setItemAsync(
        "user_data",
        JSON.stringify({ ...userData, sharedReceipts: newReceiptList })
      );
      set({
        localUserData: { ...userData, sharedReceipts: newReceiptList },
        receipts: newReceiptList,
      });
      await syncUserData(token, {
        ...userData,
        sharedReceipts: newReceiptList,
      });
    } catch (error) {
      console.error("Error removing receipt:", error);
    }
  },

  updateReceipt: async (updatedReceipt) => {
    try {
      const token = await get().authToken;
      const userData = await get().localUserData;
      const newReceiptList = get().receipts.map((receipt) =>
        receipt.id === updatedReceipt.id ? updatedReceipt : receipt
      );
      await SecureStore.setItemAsync(
        "user_data",
        JSON.stringify({ ...userData, sharedReceipts: newReceiptList })
      );
      set({
        localUserData: { ...userData, sharedReceipts: newReceiptList },
        receipts: newReceiptList,
      });
      await syncUserData(token, {
        ...userData,
        sharedReceipts: newReceiptList,
      });
    } catch (error) {
      console.error("Error updating receipt:", error);
    }
  },

  getReceipts: () => get().receipts,
}));

const syncUserData = async (token, newUserData) => {
  try {
    const localUserData = await SecureStore.getItemAsync("user_data");
    const prevUserData = localUserData ? JSON.parse(localUserData) : {};

    const userRef = doc(firestore, "users", newUserData.uid);
    const userDoc = await getDoc(userRef);

    const userPayload = {
      name: newUserData.name || "",
      email: newUserData.email || "",
      friends: newUserData.friends || {},
      sharedReceipts: newUserData.sharedReceipts || {},
    };

    // Create user document if it doesn't exist
    if (!userDoc.exists()) {
      await setDoc(userRef, userPayload);
    }

    // Check and update friends collection
    if (
      prevUserData.friends &&
      newUserData.friends &&
      hasUserFriendsChanged(prevUserData.friends, newUserData.friends)
    ) {
      const friendsRef = collection(
        firestore,
        "users",
        newUserData.uid,
        "friends"
      );
      const friends = newUserData.friends || {};
      await Promise.all(
        Object.keys(friends).map(async (friendId) => {
          const friendRef = doc(friendsRef, friendId);
          const friendData = friends[friendId];
          if (friendData) {
            await setDoc(friendRef, friendData);
          } else {
            await deleteDoc(friendRef);
          }
        })
      );
    }

    // Check and update sharedReceipts collection
    if (
      prevUserData.sharedReceipts &&
      newUserData.sharedReceipts &&
      hasUserReceiptsChanged(
        prevUserData.sharedReceipts,
        newUserData.sharedReceipts
      )
    ) {
      const receiptsRef = collection(
        firestore,
        "users",
        newUserData.uid,
        "sharedReceipts"
      );
      const sharedReceipts = newUserData.sharedReceipts || {};
      await Promise.all(
        Object.keys(sharedReceipts).map(async (receiptId) => {
          const receiptRef = doc(receiptsRef, receiptId);
          const receiptData = sharedReceipts[receiptId];
          if (receiptData) {
            await setDoc(receiptRef, receiptData);
          } else {
            await deleteDoc(receiptRef);
          }
        })
      );
    }
  } catch (error) {
    console.error("Error syncing user data:", error);
  }
};

const checkNetworkConnection = async () => {
  try {
    const { isConnected, isInternetReachable } = await NetInfo.fetch();
    return isConnected && isInternetReachable;
  } catch (error) {
    console.error("Error checking network connection:", error);
    return false;
  }
};
