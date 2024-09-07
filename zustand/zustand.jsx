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
  addDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "../config/firebaseConfig";
import { disableNetwork, enableNetwork } from "firebase/firestore";

const mmkv = new MMKV();

export const mmkvStorage = {
  getItem: (key) => mmkv.getString(key),
  setItem: (key, value) => mmkv.set(key, value),
  removeItem: (key) => mmkv.delete(key),
};

export const useAuthStore = create((set, get) => ({
  authUser: null,
  authToken: null,
  localUserData: null,
  selectedItemIndex: null,
  isOffline: true,
  receipts: [],
  sharedReceipts: {},
  modalVisible: false,
  searchResults: [],
  friendRequests: [],
  notifications: [],
  selectedFriends: {},
  title: "",
  groups: [],
  clearGroups: () => set({ groups: [] }),

  setTitle: (newTitle) => set({ title: newTitle }),
  setSelectedFriends: (friends) => set({ selectedFriends: friends }),
  setModalVisible: (visible) => set({ modalVisible: visible }),
  setSelectedItemIndex: (index) => set({ selectedItemIndex: index }),

  addReceipts: (receipt) => {
    set((state) => ({
      receipts: [...state.receipts, receipt],
    }));
  },
  clearReceipts: () => {
    set(() => ({
      receipts: [],
    }));
  },

  getReceipts: () => {
    return get().receipts;
  },

  updateReceiptById: (updatedReceipts) => {
    set((state) => {
      const userDataString = mmkvStorage.getItem("user_data");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const updatedUserData = { ...userData, receipts: updatedReceipts };
        mmkvStorage.setItem("user_data", JSON.stringify(updatedUserData));
      }

      return { receipts: updatedReceipts };
    });
  },

  updateReceiptsWithShared: (receiptId) => {
    const { sharedReceipts } = get();
    const receiptData = sharedReceipts[receiptId];

    if (receiptData) {
      const tryDataArray = Object.entries(receiptData)
        .filter(([key]) => key !== "friends")
        .flatMap(([, value]) => (Array.isArray(value) ? value : []));

      if (tryDataArray.length > 0) {
        set((state) => ({
          receipts: [...state.receipts, ...tryDataArray],
        }));
      }
    }
  },

  updateTitle: (newTitle) => {
    set({ title: newTitle });
  },

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

      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);

      let sharedReceipts = {};
      let notifications = [];
      let friendRequest = [];
      let groups = []; // Initialize an empty array to store groups
      let userName = "";

      if (userDoc.exists()) {
        const userData = userDoc.data();
        userName = userData.name || "";
        notifications = userData.notifications || [];
        friendRequest = userData.friendRequests || [];

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

        const groupsCollectionRef = collection(userRef, "groups");
        const groupsSnapshot = await getDocs(groupsCollectionRef);
        groupsSnapshot.forEach((doc) => {
          groups.push({ id: doc.id, ...doc.data() });
        });
      }

      const userDataPayload = {
        name: userName || user.displayName || "",
        email: user.email || "",
        uid: user.uid,
        friendRequest: friendRequest,
        sharedReceipts: sharedReceipts,
        notifications: notifications,
        groups: groups,
      };

      mmkvStorage.setItem("auth_token", token);
      mmkvStorage.setItem("user_data", JSON.stringify(userDataPayload));
      set({
        authUser: user,
        authToken: token,
        localUserData: userDataPayload,
        sharedReceipts: sharedReceipts,
        notifications: notifications,
        groups: groups, // Store groups as an array in Zustand state
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
        receipts: [],
        sharedReceipts: {},
        searchResults: null,
        notifications: null,
        groups: [],
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
        password
      );
      const userRef = doc(firestore, "users", user.uid);
      const token = await user.getIdToken();

      const userData = { name };
      await setDoc(userRef, userData);

      const userDataPayload = {
        name: userData.name || "",
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

  updateReceipt: async (title, updatedReceiptsArray, uniqued) => {
    try {
      const userDataString = mmkvStorage.getItem("user_data");
      if (!userDataString) return;

      const userData = JSON.parse(userDataString);
      const userUid = userData.uid;
      const friends = {};

      // Initialize batch operation
      const batch = writeBatch(firestore);
      const receiptRef = doc(
        firestore,
        "users",
        userUid,
        "sharedReceipts",
        uniqued
      );
      const receiptDoc = await getDoc(receiptRef);

      if (receiptDoc.exists()) {
        const existingReceiptData = receiptDoc.data();
        const existingFriends = existingReceiptData.friends || {};

        updatedReceiptsArray.forEach((updatedReceipt) => {
          const numFriends = Object.keys(updatedReceipt.friends).length;
          const individualPayment = updatedReceipt.price / numFriends;

          Object.keys(updatedReceipt.friends).forEach((friendId) => {
            if (friends[friendId]) {
              friends[friendId].payment += individualPayment;
            } else {
              friends[friendId] = {
                name: updatedReceipt.friends[friendId],
                payment: individualPayment,
                paid: false,
                originator: existingFriends[friendId]?.originator || false,
              };
            }
          });
        });

        if (!friends[userUid]) {
          friends[userUid] = {
            name: userData.name,
            payment: 0,
            paid: true,
            originator: true,
          };
        }

        console.log("title", title);
        const newReceiptData = {
          friends: friends,
          [title]: updatedReceiptsArray,
        };
        batch.set(receiptRef, newReceiptData, { merge: false }); // Use merge to update existing document
        batch.update(receiptRef, newReceiptData);

        const updatedSharedReceipts = {
          ...userData.sharedReceipts,
          [uniqued]: newReceiptData,
        };
        const updatedUser = {
          ...userData,
          sharedReceipts: updatedSharedReceipts,
        };

        mmkvStorage.setItem("user_data", JSON.stringify(updatedUser));

        set({
          authUser: updatedUser,
          localUserData: updatedUser,
          receipts: [],
          sharedReceipts: updatedSharedReceipts,
        });

        // Prepare friend updates
        const friendUpdates = Object.keys(friends).map(async (friendId) => {
          if (friendId !== userUid) {
            const friendReceiptRef = doc(
              firestore,
              "users",
              friendId,
              "sharedReceipts",
              uniqued
            );
            batch.set(friendReceiptRef, newReceiptData);
          }
        });

        await Promise.all(friendUpdates);

        await batch.commit();
      } else {
        throw new Error("Receipt not found");
      }
    } catch (error) {
      console.error("Error updating receipt:", error);
    }
  },

  addSharedReceipt: async (title, receiptDataArray) => {
    try {
      const userDataString = mmkvStorage.getItem("user_data");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const friends = {};

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
                originator: friendId === userData.uid,
              };
            }
          });

          if (!receipt.friends[userData.uid]) {
            friends[userData.uid] = {
              name: userData.name,
              payment: 0,
              paid: true,
              originator: true,
            };
          }
        });

        // Determine the next receipt ID from sharedReceipts
        const sharedReceipts = userData.sharedReceipts || {};
        const lastReceiptId = Object.keys(sharedReceipts).reduce(
          (maxId, currentId) => {
            const numericId = parseInt(currentId.replace("receipt_", ""), 10);
            return numericId > maxId ? numericId : maxId;
          },
          0
        );

        // Create the next incremental receipt ID
        const newReceiptId = `receipt_${lastReceiptId + 1}`;
        console.log("lastReceiptId", lastReceiptId);

        console.log("newReceiptId", newReceiptId);
        console.log("title22", title);

        // Prepare the receipt data
        const receiptData = { friends: friends, [title]: receiptDataArray };

        // Update Firestore with the new receipt
        const receiptRef = doc(
          firestore,
          "users",
          userData.uid,
          "sharedReceipts",
          newReceiptId
        );
        await setDoc(receiptRef, receiptData);

        // Update shared receipts in user data
        const updatedSharedReceipts = {
          ...sharedReceipts,
          [newReceiptId]: receiptData,
        };
        const updatedUser = {
          ...userData,
          sharedReceipts: updatedSharedReceipts,
        };

        mmkvStorage.setItem("user_data", JSON.stringify(updatedUser));

        set({
          authUser: updatedUser,
          localUserData: updatedUser,
          receipts: [],
          sharedReceipts: updatedSharedReceipts,
        });

        for (const [friendId, friendData] of Object.entries(friends)) {
          if (friendId !== userData.uid) {
            const friendRef = doc(firestore, "users", friendId);

            const friendReceiptRef = doc(
              firestore,
              "users",
              friendId,
              "sharedReceipts",
              newReceiptId
            );
            await setDoc(friendReceiptRef, receiptData);

            const friendDoc = await getDoc(friendRef);
            if (friendDoc.exists()) {
              const friendUserData = friendDoc.data();
              const newNotification = {
                message: `${userData.name} included you in a receipt`,
                userId: userData.uid,
              };
              const updatedNotifications = [
                ...(friendUserData.notifications || []),
                newNotification,
              ];

              await updateDoc(friendRef, {
                notifications: updatedNotifications,
              });
            } else {
              console.error("Friend user does not exist.");
            }
          }
        }
      }
    } catch (error) {
      console.error("Error adding shared receipt:", error);
    }
  },

  addFriendRequest: async (friendId, friendName) => {
    try {
      const userDataString = mmkvStorage.getItem("user_data");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const userRef = doc(firestore, "users", userData.uid);

        // Check if the friend request already exists
        const existingRequests = userData.friendRequests || [];
        const duplicateRequest = existingRequests.find(
          (request) => request.id === friendId
        );
        if (duplicateRequest) {
          console.log("Friend request already exists");
          return;
        }

        // Add the friend request to the current user's friendRequests
        const friendRequest = {
          id: friendId,
          name: friendName,
          confirmed: false,
        };
        const updatedFriendRequests = [...existingRequests, friendRequest];

        await updateDoc(userRef, {
          friendRequests: updatedFriendRequests,
        });

        const updatedUser = {
          ...userData,
          friendRequests: updatedFriendRequests,
        };

        mmkvStorage.setItem("user_data", JSON.stringify(updatedUser));
        set({
          localUserData: updatedUser,
          friendRequests: updatedUser.friendRequests,
        });

        // Add the friend request to the other user's friendRequests
        const recipientRef = doc(firestore, "users", friendId);
        const recipientDoc = await getDoc(recipientRef);

        if (recipientDoc.exists()) {
          const recipientData = recipientDoc.data();

          const newFriendRequestForRecipient = {
            id: userData.uid,
            name: userData.name,
            confirmed: false,
          };
          const updatedFriendRequestsForRecipient = [
            ...(recipientData.friendRequests || []),
            newFriendRequestForRecipient,
          ];

          await updateDoc(recipientRef, {
            friendRequests: updatedFriendRequestsForRecipient,
          });

          // Add notification for the other user
          const newNotification = {
            message: `${userData.name} wants to add you`,
            userId: userData.uid,
          };
          const updatedNotifications = [
            ...(recipientData.notifications || []),
            newNotification,
          ];

          await updateDoc(recipientRef, {
            notifications: updatedNotifications,
          });
        } else {
          console.error("Recipient user does not exist.");
        }
      }
    } catch (error) {
      console.error("Error adding friend request:", error);
    }
  },

  confirmFriendRequest: async (friendId) => {
    console.log("Confirming friend request with ID:", friendId);
    try {
      const userDataString = mmkvStorage.getItem("user_data");
      if (!userDataString) {
        throw new Error("User data not found in storage");
      }

      const userData = JSON.parse(userDataString);
      const userRef = doc(firestore, "users", userData.uid);

      const userFriendRequests = userData.friendRequest || [];

      // Update the current user's friend requests
      const updatedFriendRequests = userFriendRequests.map((request) =>
        request.id === friendId ? { ...request, confirmed: true } : request
      );
      console.log("Updated friend requests:", updatedFriendRequests);

      // Update the current user's Firestore document
      await updateDoc(userRef, {
        friendRequests: updatedFriendRequests,
      });

      const updatedUser = {
        ...userData,
        friendRequests: updatedFriendRequests,
      };

      mmkvStorage.setItem("user_data", JSON.stringify(updatedUser));
      set({
        localUserData: updatedUser,
        friendRequests: updatedUser.friendRequests,
      });

      // Update the friend's friend requests to mark the request from the current user as confirmed
      const friendRef = doc(firestore, "users", friendId);
      const friendDoc = await getDoc(friendRef);

      if (!friendDoc.exists()) {
        throw new Error("Friend document does not exist");
      }

      const friendData = friendDoc.data();
      const friendFriendRequests = friendData.friendRequests || [];

      const updatedFriendRequestsForFriend = friendFriendRequests.map(
        (request) =>
          request.id === userData.uid
            ? { ...request, confirmed: true }
            : request
      );

      await updateDoc(friendRef, {
        friendRequests: updatedFriendRequestsForFriend,
      });
    } catch (error) {
      console.error("Error confirming friend request:", error);
    }
  },

  cancelFriendRequest: async (friendId) => {
    const userDataString = mmkvStorage.getItem("user_data");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const userRef = doc(firestore, "users", userData.uid);

      const updatedFriendRequests = (userData.friendRequests || []).filter(
        (request) => request.id !== friendId
      );

      await updateDoc(userRef, {
        friendRequests: updatedFriendRequests,
      });

      const updatedUser = {
        ...userData,
        friendRequests: updatedFriendRequests,
      };

      mmkvStorage.setItem("user_data", JSON.stringify(updatedUser));
      set({
        localUserData: updatedUser,
        friendRequests: updatedUser.friendRequests,
      });

      // Remove the friend request from the other user's friend requests
      const friendRef = doc(firestore, "users", friendId);
      const friendDoc = await getDoc(friendRef);
      if (friendDoc.exists()) {
        const friendData = friendDoc.data();
        const updatedFriendData = {
          ...friendData,
          friendRequests: (friendData.friendRequests || []).filter(
            (request) => request.id !== userData.uid
          ),
        };

        await updateDoc(friendRef, updatedFriendData);
      }
    }
  },

  deleteNotification: async (notificationId) => {
    const userDataString = mmkvStorage.getItem("user_data");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const userRef = doc(firestore, "users", userData.uid);

      const updatedNotifications = (userData.notifications || []).filter(
        (notification) => notification.id !== notificationId
      );

      await updateDoc(userRef, {
        notifications: updatedNotifications,
      });

      const updatedUser = {
        ...userData,
        notifications: updatedNotifications,
      };

      mmkvStorage.setItem("user_data", JSON.stringify(updatedUser));
      set({ localUserData: updatedUser, notifications: updatedNotifications });
    }
  },
  searchFriendsByName: async (name) => {
    try {
      const userDataString = mmkvStorage.getItem("user_data");
      const userData = userDataString ? JSON.parse(userDataString) : null;

      const q = query(
        collection(firestore, "users"),
        where("name", "==", name)
      );
      const querySnapshot = await getDocs(q);
      const friends = [];
      console.log("Searching for friends with name:", userData);

      querySnapshot.forEach((doc) => {
        if (doc.id !== userData?.uid) {
          friends.push({ id: doc.id, ...doc.data() });
        }
      });
      set({ searchResults: friends });
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  },
  // Load groups from MMKV and Firestore
  loadGroups: () => {
    const userDataString = mmkvStorage.getItem("user_data");
    const userData = userDataString ? JSON.parse(userDataString) : null;

    if (userData && userData.groups) {
      set({ groups: userData.groups });
    } else {
      set({ groups: [] });
    }
  },

  addGroup: async (groupName, groupMembers) => {
    try {
      const newGroup = {
        id: Date.now().toString(), // Unique ID for the group
        name: groupName,
        members: groupMembers,
      };

      // Filter out undefined values
      const cleanGroup = JSON.parse(
        JSON.stringify(newGroup, (key, value) =>
          value === undefined ? null : value
        )
      );
      console.log("Adding group:", groupMembers);

      const updatedGroups = [...get().groups, cleanGroup];
      set({ groups: updatedGroups });

      const userDataString = mmkvStorage.getItem("user_data");
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (userData) {
        const updatedUserData = { ...userData, groups: updatedGroups };
        mmkvStorage.setItem("user_data", JSON.stringify(updatedUserData));

        const userRef = doc(firestore, "users", userData.uid);
        const groupsCollectionRef = collection(userRef, "groups");

        // Save to Firestore
        await setDoc(doc(groupsCollectionRef, newGroup.id), cleanGroup);
      }
    } catch (error) {
      console.error("Error saving group to Firestore:", error);
    }
  },

  removeGroup: async (groupId) => {
    try {
      const updatedGroups = get().groups.filter(
        (group) => group.id !== groupId
      );
      set({ groups: updatedGroups });

      const userDataString = mmkvStorage.getItem("user_data");
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (userData) {
        const updatedUserData = { ...userData, groups: updatedGroups };
        mmkvStorage.setItem("user_data", JSON.stringify(updatedUserData));

        const userRef = doc(firestore, "users", userData.uid);
        const groupsCollectionRef = collection(userRef, "groups");

        // Remove from Firestore
        await setDoc(doc(groupsCollectionRef, groupId), { deleted: true });
      }
    } catch (error) {
      console.error("Error removing group from Firestore:", error);
    }
  },

  updateGroup: async (groupId, updatedGroup) => {
    try {
      const updatedGroups = get().groups.map((group) =>
        group.id === groupId ? { ...group, ...updatedGroup } : group
      );
      set({ groups: updatedGroups });

      const userDataString = mmkvStorage.getItem("user_data");
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (userData) {
        const updatedUserData = { ...userData, groups: updatedGroups };
        mmkvStorage.setItem("user_data", JSON.stringify(updatedUserData));

        const userRef = doc(firestore, "users", userData.uid);
        const groupsCollectionRef = collection(userRef, "groups");

        // Update in Firestore
        await setDoc(doc(groupsCollectionRef, groupId), updatedGroup, {
          merge: true,
        });
      }
    } catch (error) {
      console.error("Error updating group in Firestore:", error);
    }
  },
}));
