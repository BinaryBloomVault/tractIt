import { create } from "zustand";
import { MMKV } from "react-native-mmkv";
import { auth } from "../config/firebaseConfig";
import {
  signInWithEmailAndPassword,
  signOut,
  signInWithCustomToken,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../config/firebaseConfig";
import * as Crypto from "expo-crypto";

const mmkv = new MMKV();

const mmkvStorage = {
  getItem: (key) => mmkv.getString(key),
  setItem: (key, value) => mmkv.set(key, value),
  removeItem: (key) => mmkv.delete(key),
};

export const useAuthStore = create((set, get) => ({
  authUser: null,
  authToken: null,
  localUserData: null,
  selectedItemIndex: null, // Add selectedItemIndex state
  isOffline: true,
  receipts: {},
  sharedReceipts: {},
  modalVisible: false,
  searchResults: [],

  setModalVisible: (visible) => set({ modalVisible: visible }),
  setSelectedItemIndex: (index) => set({ selectedItemIndex: index }),

  addReceipts: (title, receipt) =>
    set((state) => ({
      receipts: {
        ...state.receipts,
        [title]: [...(state.receipts[title] || []), receipt],
      },
    })),
  clearReceipts: (title) =>
    set((state) => ({
      receipts: {
        ...state.receipts,
        [title]: [],
      },
    })),

  getReceipts: (title) => get().receipts[title],

  loadUserData: () => {
    const userDataString = mmkvStorage.getItem("user_data");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      set({ localUserData: userData });
      return userData;
    }
    return null;
  },

  login: async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const token = await user.getIdToken();

      // Get user data from Firestore
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);

      let sharedReceipts = {};
      if (userDoc.exists()) {
        const sharedReceiptsCollectionRef = collection(
          userRef,
          "sharedReceipts"
        );
        const sharedReceiptsSnapshot = await getDocs(
          sharedReceiptsCollectionRef
        );
        sharedReceiptsSnapshot.forEach((doc) => {
          sharedReceipts[doc.id] = doc.data();
        });
      }

      const userDataPayload = {
        name: user.displayName || "",
        email: user.email || "",
        uid: user.uid,
        friends: {},
        sharedReceipts: sharedReceipts,
      };

      mmkvStorage.setItem("auth_token", token);
      mmkvStorage.setItem("user_data", JSON.stringify(userDataPayload));
      set({
        authUser: user,
        authToken: token,
        localUserData: userDataPayload,
        sharedReceipts: sharedReceipts,
        isOffline: false,
      });
    } catch (error) {
      console.error("Error logging in:", error);
      set({ isOffline: true });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      mmkvStorage.removeItem("auth_token");
      mmkvStorage.removeItem("user_data");
      set({
        authUser: null,
        authToken: null,
        localUserData: null,
        isOffline: true,
        receipts: {},
        sharedReceipts: {},
      });
    } catch (error) {
      console.error("Error logging out:", error);
      set({ isOffline: true });
    }
  },

  register: async (email, password, name) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const userRef = doc(firestore, "users", user.uid);
      const token = await user.getIdToken();

      const userData = { name };
      await setDoc(userRef, userData);

      const userDataPayload = {
        name: user.displayName || "",
        email: user.email || "",
        uid: user.uid,
        friends: {},
        sharedReceipts: {},
      };

      mmkvStorage.setItem("auth_token", token);
      mmkvStorage.setItem("user_data", JSON.stringify(userDataPayload));

      set({
        authUser: user,
        localUserData: userDataPayload,
        isOffline: false,
      });
    } catch (error) {
      console.error("Error registering:", error);
      set({ isOffline: true });
    }
  },

  getAuthToken: async () => {
    try {
      const token = mmkvStorage.getItem("auth_token");
      const userData = mmkvStorage.getItem("user_data");
      if (token && userData) {
        const user = JSON.parse(userData);
        await signInWithCustomToken(auth, token);
        set({
          authToken: token,
          authUser: user,
          localUserData: user,
          sharedReceipts: user.sharedReceipts,
          isOffline: false,
        });
        await syncUserData(token, user);
      }
      return token;
    } catch (error) {
      console.error("Error getting auth token:", error);
      set({ isOffline: true });
      return null;
    }
  },

  addReceipt: async (title, newReceipt) => {
    try {
      const token = await get().authToken;
      const userData = await get().localUserData;
      const newReceiptList = [...(get().receipts[title] || []), newReceipt];
      mmkvStorage.setItem(
        "user_data",
        JSON.stringify({
          ...userData,
          sharedReceipts: {
            ...userData.sharedReceipts,
            [title]: newReceiptList,
          },
        })
      );
      set({
        localUserData: {
          ...userData,
          sharedReceipts: {
            ...userData.sharedReceipts,
            [title]: newReceiptList,
          },
        },
        receipts: { ...get().receipts, [title]: newReceiptList },
      });
      await syncUserData(token, {
        ...userData,
        sharedReceipts: { ...userData.sharedReceipts, [title]: newReceiptList },
      });
    } catch (error) {
      console.error("Error adding receipt:", error);
    }
  },

  removeReceipt: async (title, receiptId) => {
    try {
      const token = await get().authToken;
      const userData = await get().localUserData;
      const newReceiptList = get().receipts[title].filter(
        (receipt) => receipt.id !== receiptId
      );
      mmkvStorage.setItem(
        "user_data",
        JSON.stringify({
          ...userData,
          sharedReceipts: {
            ...userData.sharedReceipts,
            [title]: newReceiptList,
          },
        })
      );
      set({
        localUserData: {
          ...userData,
          sharedReceipts: {
            ...userData.sharedReceipts,
            [title]: newReceiptList,
          },
        },
        receipts: { ...get().receipts, [title]: newReceiptList },
      });
      await syncUserData(token, {
        ...userData,
        sharedReceipts: { ...userData.sharedReceipts, [title]: newReceiptList },
      });
    } catch (error) {
      console.error("Error removing receipt:", error);
    }
  },

  updateReceipt: async (title, updatedReceipt) => {
    try {
      const token = await get().authToken;
      const userData = await get().localUserData;
      const newReceiptList = get().receipts[title].map((receipt) =>
        receipt.id === updatedReceipt.id ? updatedReceipt : receipt
      );
      mmkvStorage.setItem(
        "user_data",
        JSON.stringify({
          ...userData,
          sharedReceipts: {
            ...userData.sharedReceipts,
            [title]: newReceiptList,
          },
        })
      );
      set({
        localUserData: {
          ...userData,
          sharedReceipts: {
            ...userData.sharedReceipts,
            [title]: newReceiptList,
          },
        },
        receipts: { ...get().receipts, [title]: newReceiptList },
      });
      await syncUserData(token, {
        ...userData,
        sharedReceipts: { ...userData.sharedReceipts, [title]: newReceiptList },
      });
    } catch (error) {
      console.error("Error updating receipt:", error);
    }
  },

  addSharedReceipt: async (title, receiptDataArray) => {
    try {
      const userDataString = mmkvStorage.getItem("user_data");
      if (userDataString) {
        const friends = {};
        console.log("asdasdsadsadasdasdasdasdasd", receiptDataArray);

        receiptDataArray.forEach((receipt) => {
          const numFriends = Object.keys(receipt.friends).length;
          const individualPayment = receipt.price / numFriends;

          Object.keys(receipt.friends).forEach((friendId) => {
            if (friends[friendId]) {
              friends[friendId].payment += individualPayment;
            } else {
              friends[friendId] = {
                name: receipt.friends[friendId],
                payment: individualPayment,
                paid: false,
                originator: false,
              };
            }
          });
        });

        const userData = JSON.parse(userDataString);
        const receiptId = Crypto.randomUUID();
        const receiptRef = doc(
          firestore,
          "users",
          userData.uid,
          "sharedReceipts",
          receiptId
        );

        const receiptData = { friends: friends, [title]: receiptDataArray };
        await setDoc(receiptRef, receiptData);

        const updatedUser = {
          ...userData,
          sharedReceipts: {
            ...userData.sharedReceipts,
            [receiptId]: receiptData,
          },
        };
        mmkvStorage.setItem("user_data", JSON.stringify(updatedUser));
        set({
          authUser: updatedUser,
          localUserData: updatedUser,
          receipts: {},
        });
      }
    } catch (error) {
      console.error("Error adding shared receipt:", error);
    }
  },

  searchFriendsByName: async (name) => {
    try {
      const q = query(
        collection(firestore, "users"),
        where("name", "==", name)
      );
      const querySnapshot = await getDocs(q);
      const friends = [];
      querySnapshot.forEach((doc) => {
        friends.push({ id: doc.id, ...doc.data() });
      });
      set({ searchResults: friends });
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  },
}));

const syncUserData = async (token, newUserData) => {
  try {
    const localUserData = mmkvStorage.getItem("user_data");
    const prevUserData = localUserData ? JSON.parse(localUserData) : {};

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
