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
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../config/firebaseConfig";

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
  PaidStatus: false,
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

  setPaidReceipts: (paidStatus) => {
    set((state) => ({
      PaidStatus: paidStatus,
    }));
  },

  getPaidReceipts: () => {
    return get().PaidStatus;
  },

  getReceipts: () => {
    return get().receipts;
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

  deleteReceiptsWithShared: async (receiptId) => {
    try {
      const { sharedReceipts, localUserData } = get();
      console.log("[DEBUG] get receiptId: ", receiptId);

      const updatedSharedReceipts = { ...sharedReceipts };
      delete updatedSharedReceipts[receiptId];

      const updatedUserData = {
        ...localUserData,
        sharedReceipts: updatedSharedReceipts,
      };

      set((state) => ({
        sharedReceipts: updatedSharedReceipts,
        localUserData: updatedUserData,
      }));

      const userRef = doc(firestore, "users", localUserData.uid);
      await setDoc(userRef, updatedUserData, { merge: true });

      const userRefs = doc(firestore, "users", localUserData.uid);
      const receiptRef = doc(userRefs, "sharedReceipts", receiptId);
      await deleteDoc(receiptRef);
      console.log("[DEBUG] Success removed!");
    } catch (error) {
      console.error("Error deleting receipt:", error);
    }
  },

  updateReceiptsWithShared: (receiptId) => {
    const { sharedReceipts, receipts } = get();
    const receiptData = sharedReceipts[receiptId];

    if (receiptData) {
      const tryDataArray = Object.entries(receiptData)
        .filter(([key]) => key !== "friends")
        .flatMap(([, value]) => (Array.isArray(value) ? value : []));

      if (tryDataArray.length > 0) {
        const uniqueItems = tryDataArray.filter((newItem) => {
          return !receipts.some(
            (existingItem) => existingItem.id === newItem.id
          );
        });

        if (uniqueItems.length > 0) {
          set((state) => ({
            receipts: [...state.receipts, ...uniqueItems],
          }));
        }
      }
    }
  },

  updateTitle: (newTitle) => {
    set({ title: newTitle });
  },

  isPaidEnabled: (receiptId, newPaidStatus) => {
    set((state) => {
      const { sharedReceipts, localUserData } = state;

      // Find the relevant receipt and update its `paid` field
      const updatedSharedReceipts = {
        ...sharedReceipts,
        [receiptId]: {
          ...sharedReceipts[receiptId],
          paid: newPaidStatus,
        },
      };

      const updatedUserData = {
        ...localUserData,
        sharedReceipts: updatedSharedReceipts,
      };

      // Update local state
      mmkvStorage.setItem("user_data", JSON.stringify(updatedUserData));

      return {
        sharedReceipts: updatedSharedReceipts,
        localUserData: updatedUserData,
      };
    });
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

  deleteGroup: async (groupId) => {
    try {
      // Remove the group from Firestore
      const { localUserData } = get();
      const userRefs = doc(firestore, "users", localUserData.uid);
      const receiptRef = doc(userRefs, "groups", groupId);
      await deleteDoc(receiptRef);

      // Update local state
      set((state) => {
        const updatedGroups = state.groups.filter(
          (group) => group.id !== groupId
        );

        // Update local storage
        const userDataString = mmkvStorage.getItem("user_data");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const updatedUserData = { ...userData, groups: updatedGroups };
          mmkvStorage.setItem("user_data", JSON.stringify(updatedUserData));
        }

        return { groups: updatedGroups };
      });
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  },

  deleteFriend: async (friendId) => {
    try {
      const { localUserData, groups } = get();

      if (localUserData) {
        const currentUserId = localUserData.uid;

        const updatedFriendRequests = (
          localUserData.friendRequest || []
        ).filter((f) => f.id !== friendId);

        const updatedGroups = groups.map((group) => {
          const updatedMembers = group.members.filter(
            (member) => member.id !== friendId
          );
          return { ...group, members: updatedMembers };
        });

        const updatedUserData = {
          ...localUserData,
          friendRequest: updatedFriendRequests,
          groups: updatedGroups,
        };

        mmkvStorage.setItem("user_data", JSON.stringify(updatedUserData));

        set({ localUserData: updatedUserData, groups: updatedGroups });

        const userRef = doc(firestore, "users", currentUserId);

        await updateDoc(userRef, { friendRequests: updatedFriendRequests });

        const userGroupsCollectionRef = collection(userRef, "groups");

        for (const group of updatedGroups) {
          const groupRef = doc(userGroupsCollectionRef, group.id);
          await updateDoc(groupRef, { members: group.members });
        }

        const friendUserRef = doc(firestore, "users", friendId);
        const friendDoc = await getDoc(friendUserRef);

        if (friendDoc.exists()) {
          const friendData = friendDoc.data();
          const friendFriendRequests = friendData.friendRequests || [];

          const updatedFriendFriendRequests = friendFriendRequests.filter(
            (f) => f.id !== currentUserId
          );

          await updateDoc(friendUserRef, {
            friendRequests: updatedFriendFriendRequests,
          });
        }
      }
    } catch (error) {
      console.error("Error deleting friend:", error);
    }
  },

  saveEditedGroup: async (updatedGroup) => {
    try {
      set((state) => {
        const updatedGroups = state.groups.map((group) =>
          group.id === updatedGroup.id ? updatedGroup : group
        );

        const userDataString = mmkvStorage.getItem("user_data");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const updatedUserData = { ...userData, groups: updatedGroups };
          mmkvStorage.setItem("user_data", JSON.stringify(updatedUserData));
        }

        return { groups: updatedGroups };
      });

      const { localUserData } = get();
      const userRef = doc(firestore, "users", localUserData.uid);
      const groupRef = doc(userRef, "groups", updatedGroup.id);
      await updateDoc(groupRef, { members: updatedGroup.members });
    } catch (error) {
      console.error("Error saving edited group:", error);
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

      if (!userUid || !uniqued) {
        throw new Error(
          `Invalid userUid or uniqued value: userUid=${userUid}, uniqued=${uniqued}`
        );
      }

      if (!Array.isArray(updatedReceiptsArray)) {
        throw new Error("updatedReceiptsArray is not an array");
      }

      const batch = writeBatch(firestore);

      const receiptRef = doc(
        firestore,
        "users",
        userUid,
        "sharedReceipts",
        uniqued
      );

      try {
        const receiptDoc = await getDoc(receiptRef);

        if (!receiptDoc.exists()) {
          throw new Error("Receipt not found");
        }

        const existingReceiptData = receiptDoc.data();
        if (!existingReceiptData) {
          throw new Error("Receipt document data is missing or invalid.");
        }

        const existingFriends = existingReceiptData.friends || {};

        const friends = {};
        updatedReceiptsArray.forEach((updatedReceipt, index) => {
          if (updatedReceipt && updatedReceipt.friends) {
            const numFriends = Object.keys(updatedReceipt.friends || {}).length;
            const individualPayment = updatedReceipt.price / numFriends;

            Object.keys(updatedReceipt.friends).forEach((friendId) => {
              if (friends[friendId]) {
                friends[friendId].payment += individualPayment;
              } else {
                friends[friendId] = {
                  name: updatedReceipt.friends[friendId],
                  payment: individualPayment,
                  originator: existingFriends[friendId]?.originator || false,
                };
              }
            });
          } else {
            console.warn(
              "Updated receipt or friends is undefined:",
              updatedReceipt
            );
          }
        });

        if (!friends[userUid]) {
          friends[userUid] = {
            name: userData.name,
            payment: 0,
            paid: true, //directly mark as paid once this is the originator of the receipts
            originator: true,
          };
        }

        const newReceiptData = {
          friends: friends,
          [title]: updatedReceiptsArray,
        };

        batch.set(receiptRef, newReceiptData, { merge: true });

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

        const friendUpdates = Object.keys(friends).map(async (friendId) => {
          if (friendId !== userUid) {
            const friendReceiptRef = doc(
              firestore,
              "users",
              friendId,
              "sharedReceipts",
              uniqued
            );
            batch.set(friendReceiptRef, newReceiptData, { merge: true });
          }
        });

        await Promise.all(friendUpdates);
        await batch.commit();
      } catch (error) {
        throw error;
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
              paid: false,
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
                type: "friend",
                userId: userData.uid,
                newReceiptId: newReceiptId,
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
            type: "friend",
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

      // Update current user's friend requests
      const updatedFriendRequests = userFriendRequests.map((request) =>
        request.id === friendId ? { ...request, confirmed: true } : request
      );

      try {
        await updateDoc(userRef, { friendRequests: updatedFriendRequests });
      } catch (error) {
        console.error(
          "Error updating user friend requests in Firestore:",
          error
        );
        throw new Error("Failed to update user friend requests in Firestore");
      }

      // Update local state
      const updatedUser = {
        ...userData,
        friendRequests: updatedFriendRequests,
      };

      // Update local storage
      try {
        mmkvStorage.setItem("user_data", JSON.stringify(updatedUser));
      } catch (error) {
        throw new Error("Failed to update local storage");
      }

      // Update Zustand state
      try {
        set({
          localUserData: updatedUser,
          friendRequests: updatedUser.friendRequests,
        });
      } catch (error) {
        throw new Error("Failed to update Zustand state");
      }

      // Fetch friend's document
      const friendRef = doc(firestore, "users", friendId);
      const friendDoc = await getDoc(friendRef);
      if (!friendDoc.exists()) {
        console.error(`Friend document with ID ${friendId} does not exist.`);
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

      try {
        await updateDoc(friendRef, {
          friendRequests: updatedFriendRequestsForFriend,
        });
      } catch (error) {
        throw new Error(
          "Failed to update friend's friend requests in Firestore"
        );
      }
      return true;
    } catch (error) {
      console.error("Error confirming friend request:", error);
      throw new Error("Failed to confirm friend request");
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

  updatePaidStatus: async (receiptId, friendId, paidRequest) => {
    try {
      const userDataString = mmkvStorage.getItem("user_data");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const receiptRef = doc(
          firestore,
          "users",
          userData.uid,
          "sharedReceipts",
          receiptId
        );
        const receiptDoc = await getDoc(receiptRef);

        if (receiptDoc.exists()) {
          const receiptData = receiptDoc.data();
          const friendData = receiptData.friends[friendId];
          if (paidRequest) {
            // Update the 'paid' status
            friendData.paid = true;
            // Save updated receipt data
            await updateDoc(receiptRef, {
              [`friends.${friendId}`]: friendData,
            });
            const paidDone = false;
            const setPaidReceipts = get().setPaidReceipts
            setPaidReceipts(paidDone);
          }

          // Notify the originator that the friend has paid
          const originatorId = Object.keys(receiptData.friends).find(
            (id) => receiptData.friends[id].originator === true
          );
          if (originatorId && originatorId !== friendId) {
            const originatorRef = doc(firestore, "users", originatorId);
            const originatorDoc = await getDoc(originatorRef);

            if (originatorDoc.exists()) {
              const originatorUserData = originatorDoc.data();
              const newNotification = {
                message: `${friendData.name} has paid their portion of the receipt.`,
                type: "paid",
                receiptId: receiptId,
                friendId: friendId,
              };

              const updatedNotifications = [
                ...(originatorUserData.notifications || []),
                newNotification,
              ];

              await updateDoc(originatorRef, {
                notifications: updatedNotifications,
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Error updating paid status:", error);
    }
  },

  rejectedPaidStatus: async (receiptId, friendId) => {
    try {
   
      const userDataString = mmkvStorage.getItem("user_data");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const receiptRef = doc(
          firestore,
          "users",
          userData.uid,
          "sharedReceipts",
          receiptId
        );
        const receiptDoc = await getDoc(receiptRef);
  
        if (receiptDoc.exists()) {
          const receiptData = receiptDoc.data();
          const friendData = receiptData.friends[friendId];
  
          await updateDoc(receiptRef, {
            [`friends.${friendId}`]: friendData,
          });
  
          // Notify the friend about the rejection
          const originatorId = Object.keys(receiptData.friends).find(
            (id) => receiptData.friends[id].originator === true
          );
          if (originatorId && originatorId !== friendId) {
            const friendReceiptRef = doc(firestore, "users", friendId);
            const friendDoc = await getDoc(friendReceiptRef);
  
            if (friendDoc.exists()) {
              const originatorUserData = friendDoc.data();
              const newNotification = {
                message: "Your paid request rejected by the originator.",
                type: "paid",
                receiptId: receiptId,
                friendId: friendId,
              };
  
              const updatedNotifications = [
                ...(originatorUserData.notifications || []),
                newNotification,
              ];
              //console.error("notification ",newNotification)
              // Update notifications in Firestore
              await updateDoc(friendReceiptRef, {
                notifications: updatedNotifications,
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Error updating rejected paid status:", error);
    }
  },
  

  cancelPaidRequest: async (receiptId, friendId) => {
    try {
      // Get the current user's data
      const userDataString = mmkvStorage.getItem("user_data");
      if (userDataString) {
        const userData = JSON.parse(userDataString);

        // Reference to the specific shared receipt in Firestore
        const receiptRef = doc(
          firestore,
          "users",
          userData.uid,
          "sharedReceipts",
          receiptId
        );
        const receiptDoc = await getDoc(receiptRef);

        if (receiptDoc.exists()) {
          const receiptData = receiptDoc.data();
          const friendData = receiptData.friends[friendId];

          // Cancel the 'paid' status if it's unpaid
          if (!friendData.paid) {
            // Remove the friend from the shared receipt (or adjust status as needed)
            delete receiptData.friends[friendId];

            // Update the receipt in Firestore
            await updateDoc(receiptRef, {
              friends: receiptData.friends,
            });

            // Update local state and storage
            const updatedReceipts = userData.receipts.map((receipt) =>
              receipt.id === receiptId
                ? { ...receipt, friends: receiptData.friends }
                : receipt
            );

            const updatedUserData = {
              ...userData,
              receipts: updatedReceipts,
            };

            mmkvStorage.setItem("user_data", JSON.stringify(updatedUserData));
            set({
              localUserData: updatedUserData,
              receipts: updatedReceipts,
            });
          }

          // Notify the originator of the cancellation
          const originatorId = Object.keys(receiptData.friends).find(
            (id) => receiptData.friends[id].originator === true
          );
          if (originatorId && originatorId !== friendId) {
            const originatorRef = doc(firestore, "users", originatorId);
            const originatorDoc = await getDoc(originatorRef);

            if (originatorDoc.exists()) {
              const originatorUserData = originatorDoc.data();
              const newNotification = {
                message: `${friendData.name} has cancelled their payment for the receipt.`,
                type: "cancelPaid",
                receiptId: receiptId,
                friendId: friendId,
              };

              const updatedNotifications = [
                ...(originatorUserData.notifications || []),
                newNotification,
              ];

              // Update the originator's notifications in Firestore
              await updateDoc(originatorRef, {
                notifications: updatedNotifications,
              });
            }
          }
        }
      }
      return true;
    } catch (error) {
      console.error("Error cancelling paid request:", error);
      return false;
    }
  },

  deleteNotification: async (notificationId) => {
    const userDataString = mmkvStorage.getItem("user_data");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const userRef = doc(firestore, "users", userData.uid);

      console.log("Current notifications:", userData.notifications);
      console.log("Current notificationId:", notificationId);

      const updatedNotifications = (userData.notifications || []).filter(
        (notification) => {
          return !(notification.userId === notificationId);
        }
      );

      console.log(
        "Updated notifications after deletion:",
        updatedNotifications
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
    } else {
      console.error("User data not found in storage");
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
