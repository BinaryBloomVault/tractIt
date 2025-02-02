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
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../config/firebaseConfig";
import * as Crypto from "expo-crypto";

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
  selectedAvatar: null,

  clearGroups: () => set({ groups: [] }),

  setTitle: (newTitle) => set({ title: newTitle }),
  setSelectedFriends: (friends) => set({ selectedFriends: friends }),
  setModalVisible: (visible) => set({ modalVisible: visible }),
  setSelectedItemIndex: (index) => set({ selectedItemIndex: index }),

  setAvatar: async (avatar) => {
    try {
      if (typeof avatar !== "number") {
        return;
      }

      const userDataString = mmkvStorage.getItem("user_data");
      if (!userDataString) {
        return;
      }

      const userData = JSON.parse(userDataString);
      const userUid = userData.uid;

      if (!userUid) {
        return;
      }

      const profile = avatar;

      const updatedUserData = { ...userData, profile };
      mmkvStorage.setItem("user_data", JSON.stringify(updatedUserData));
      set({ selectedAvatar: profile, localUserData: updatedUserData });

      const userRef = doc(firestore, "users", userUid);
      await updateDoc(userRef, { profile });
    } catch (error) {
      return;
    }
  },

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
    } catch (error) {
      return;
    }
  },

  //add the logic of mainscreen paid notification when writeReceipt friends does paid all the items
  paidReceiptRow: (index) => {
    set((state) => {
      const userId = state.localUserData?.uid;
      if (!userId || index < 0 || index >= state.receipts.length) return state;

      const updatedReceipts = state.receipts.map((receipt, idx) => {
        if (idx === index && receipt.friends?.[userId]) {
          const friend = receipt.friends[userId];
          const updatedFriend = {
            ...friend,
            paid: true,
          };

          return {
            ...receipt,
            friends: {
              ...receipt.friends,
              [userId]: updatedFriend,
            },
          };
        }
        return receipt;
      });

      return { receipts: updatedReceipts };
    });
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
      let groups = [];
      let profile = null;
      let userName = "";

      if (userDoc.exists()) {
        const userData = userDoc.data();
        userName = userData.name || "";
        notifications = userData.notifications || [];
        friendRequest = userData.friendRequests || [];
        profile = userData.profile || null;

        const sharedReceiptsCollectionRef = collection(
          userRef,
          "sharedReceipts"
        );
        const sharedReceiptsSnapshot = await getDocs(
          sharedReceiptsCollectionRef
        );

        const sharedReceiptsArray = sharedReceiptsSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => a.timestamp - b.timestamp);

        sharedReceipts = Object.fromEntries(
          sharedReceiptsArray.map((receipt) => [receipt.id, receipt])
        );

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
        selectedAvatar: profile,
      };

      mmkvStorage.setItem("auth_token", token);
      mmkvStorage.setItem("user_data", JSON.stringify(userDataPayload));
      set({
        authUser: user,
        authToken: token,
        localUserData: userDataPayload,
        sharedReceipts: sharedReceipts,
        notifications: notifications,
        groups: groups,
        isOffline: false,
        selectedAvatar: profile,
      });
    } catch (error) {
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
        selectedAvatar: null,
      });
    } catch (error) {
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
      return;
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
      return;
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
      return;
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
      return;
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

      const receiptRef = doc(
        firestore,
        "users",
        userUid,
        "sharedReceipts",
        uniqued
      );

      const receiptDoc = await getDoc(receiptRef);

      if (!receiptDoc.exists()) {
        throw new Error("Receipt not found");
      }
      let totalPayment = 0;

      const existingReceiptData = receiptDoc.data();
      const existingFriends = existingReceiptData.friends || {};
      const friends = { ...existingFriends };

      updatedReceiptsArray.forEach((updatedReceipt) => {
        if (updatedReceipt && updatedReceipt.friends) {
          const totalPaymentForReceipt = parseFloat(updatedReceipt.price);
          const totalFriends = Object.keys(updatedReceipt.friends).length;

          const unpaidFriends = Object.entries(updatedReceipt.friends).filter(
            ([, friendData]) => !friendData.paid
          );
          const perFriendPayment = unpaidFriends.length
            ? totalPaymentForReceipt / totalFriends
            : 0;

          Object.entries(updatedReceipt.friends).forEach(
            ([friendId, friendData]) => {
              const isPaid = friendData.paid;
              if (friendId === userUid) {
                totalPayment += isPaid ? 0 : perFriendPayment;
              }
            }
          );
        }
      });
      if (friends[userUid]) {
        friends[userUid].payment = totalPayment;
      }

      const newReceiptData = {
        friends: friends,
        [title]: updatedReceiptsArray,
      };

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

      (async () => {
        try {
          const batch = writeBatch(firestore);

          batch.set(receiptRef, newReceiptData, { merge: true });

          const friendUpdates = Object.keys(friends).map((friendId) => {
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
          return;
        }
      })();
    } catch (error) {
      return;
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
        if (duplicateRequest) return;

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
        }
      }
    } catch (error) {
      return;
    }
  },

  addSharedReceipt: async (title, receiptDataArray) => {
    try {
      const userDataString = mmkvStorage.getItem("user_data");
      if (!userDataString) return;

      const userData = JSON.parse(userDataString);
      const friends = {};

      receiptDataArray.forEach((receipt) => {
        const numFriends = Object.keys(receipt.friends).length;
        const individualPayment = receipt.price / numFriends;

        Object.keys(receipt.friends).forEach((friendId) => {
          const friendData = receipt.friends[friendId];

          if (friends[friendId]) {
            friends[friendId].payment += individualPayment;
          } else {
            friends[friendId] = {
              name: friendData.name,
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

      const fullHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${title}-${Date.now()}`
      );
      const newReceiptId = fullHash.substring(0, 20);

      const receiptData = {
        friends: friends,
        [title]: receiptDataArray,
        timestamp: Timestamp.now().toMillis(),
      };

      // Add new receipt to sharedReceipts
      const sharedReceipts = userData.sharedReceipts || {};
      sharedReceipts[newReceiptId] = receiptData;

      const sortedSharedReceipts = Object.entries(sharedReceipts)
        .sort(([, a], [, b]) => b.timestamp - a.timestamp)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      const updatedUser = {
        ...userData,
        sharedReceipts: sortedSharedReceipts,
      };

      mmkvStorage.setItem("user_data", JSON.stringify(updatedUser));

      set({
        authUser: updatedUser,
        localUserData: updatedUser,
        receipts: [],
        sharedReceipts: sortedSharedReceipts,
      });

      (async () => {
        try {
          const receiptRef = doc(
            firestore,
            "users",
            userData.uid,
            "sharedReceipts",
            newReceiptId
          );

          await setDoc(receiptRef, receiptData);

          for (const [friendId, friendData] of Object.entries(friends)) {
            if (friendId !== userData.uid) {
              const friendReceiptRef = doc(
                firestore,
                "users",
                friendId,
                "sharedReceipts",
                newReceiptId
              );
              const friendRef = doc(firestore, "users", friendId);

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
              }
            }
          }
        } catch (error) {
          return;
        }
      })();
    } catch (error) {
      return;
    }
  },

  confirmFriendRequest: async (friendId) => {
    try {
      const userDataString = mmkvStorage.getItem("user_data");
      if (!userDataString) {
        throw new Error("User data not found in storage");
      }

      const userData = JSON.parse(userDataString);
      const userRef = doc(firestore, "users", userData.uid);

      const existingFriendRequests = userData.friendRequest || [];
      const friendRequestToUpdate = existingFriendRequests.find(
        (request) => request.id === friendId
      );

      if (!friendRequestToUpdate) {
        return false;
      }

      const updatedFriendRequest = {
        ...friendRequestToUpdate,
        confirmed: true,
      };

      await updateDoc(userRef, {
        friendRequests: existingFriendRequests.map((request) =>
          request.id === friendId ? updatedFriendRequest : request
        ),
      });

      const updatedUserData = {
        ...userData,
        friendRequest: existingFriendRequests.map((request) =>
          request.id === friendId ? updatedFriendRequest : request
        ),
      };

      mmkvStorage.setItem("user_data", JSON.stringify(updatedUserData));
      set({
        localUserData: updatedUserData,
        friendRequests: updatedUserData.friendRequest,
      });

      // Fetch friend's document
      const friendRef = doc(firestore, "users", friendId);
      const friendDoc = await getDoc(friendRef);
      if (friendDoc.exists()) {
        const friendData = friendDoc.data();
        const friendRequests = friendData.friendRequests || [];

        const updatedFriendRequestsForFriend = friendRequests.map((request) =>
          request.id === userData.uid
            ? { ...request, confirmed: true }
            : request
        );

        await updateDoc(friendRef, {
          friendRequests: updatedFriendRequestsForFriend,
        });
      }

      return true;
    } catch (error) {
      return false;
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
            // Update the 'paid' status for the specific friend
            friendData.paid = true;

            // Save updated receipt data for the originator
            await updateDoc(receiptRef, {
              [`friends.${friendId}`]: friendData,
            });

            // Update the 'paid' status in each friend's shared receipt
            await Promise.all(
              Object.keys(receiptData.friends).map(async (id) => {
                const friendReceiptRef = doc(
                  firestore,
                  "users",
                  id,
                  "sharedReceipts",
                  receiptId
                );
                const friendReceiptDoc = await getDoc(friendReceiptRef);

                if (friendReceiptDoc.exists()) {
                  const friendReceiptData = friendReceiptDoc.data();
                  friendReceiptData.friends[friendId].paid = true;

                  await updateDoc(friendReceiptRef, {
                    [`friends.${friendId}`]:
                      friendReceiptData.friends[friendId],
                  });
                }
              })
            );

            const paidDone = false;
            const setPaidReceipts = get().setPaidReceipts;
            setPaidReceipts(paidDone);
          }

          // Notify the originator that the friend has paid
          const originatorId = Object.keys(receiptData.friends).find(
            (id) => receiptData.friends[id].originator === true
          );
          const originatorData = receiptData.friends[originatorId];

          if (originatorId && originatorId !== friendId) {
            const originatorRef = doc(firestore, "users", originatorId);
            const originatorDoc = await getDoc(originatorRef);

            if (originatorDoc.exists()) {
              const originatorUserData = originatorDoc.data();
              const newNotification = {
                message: `${friendData.name} has paid their portion of the receipt.`,
                type: "paid",
                newReceiptId: receiptId,
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

          const currentUserRef = doc(firestore, "users", userData.uid);
          const currentUserDoc = await getDoc(currentUserRef);
          if (currentUserDoc.exists()) {
            const currentUserData = currentUserDoc.data();
            const newNotificationForCurrent = {
              message: `You have paid your portion of the receipt. Please wait for confirmation of ${originatorData.name}`,
              newReceiptId: 123,
              type: "pending",
            };

            const updatedCurrentNotifications = [
              ...(currentUserData.notifications || []),
              newNotificationForCurrent,
            ];

            await updateDoc(currentUserRef, {
              notifications: updatedCurrentNotifications,
            });
          }
        }
      }
    } catch (error) {
      return;
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
                newReceiptId: receiptId,
                friendId: friendId,
              };

              const updatedNotifications = [
                ...(originatorUserData.notifications || []),
                newNotification,
              ];
              // Update notifications in Firestore
              await updateDoc(friendReceiptRef, {
                notifications: updatedNotifications,
              });
            }
          }
        }
      }
    } catch (error) {
      return;
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
      return false;
    }
  },

  deleteNotification: async (receiptId) => {
    const userDataString = mmkvStorage.getItem("user_data");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const userRef = doc(firestore, "users", userData.uid);

      console.log("receiptId", receiptId);
      const updatedNotifications = (userData.notifications || []).filter(
        (notification) => {
          return !(notification.newReceiptId === receiptId);
        }
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

      querySnapshot.forEach((doc) => {
        if (doc.id !== userData?.uid) {
          friends.push({ id: doc.id, ...doc.data() });
        }
      });
      set({ searchResults: friends });
    } catch (error) {
      return;
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
      return;
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
      return;
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
      return;
    }
  },
}));
