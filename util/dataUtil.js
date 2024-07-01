import _ from "lodash";

export const hasUserDataChanged = (prevUserData, newUserData) => {
  if (!_.isEqual(prevUserData, newUserData)) {
    return true;
  }
};

export const hasUserFriendsChanged = (prevFriends, newFriends) => {
  if (
    !prevFriends ||
    Object.keys(prevFriends).length !== Object.keys(newFriends).length
  ) {
    return true;
  }

  for (const friendId in newFriends) {
    if (
      !prevFriends[friendId] ||
      !_.isEqual(prevFriends[friendId], newFriends[friendId])
    ) {
      return true;
    }
  }

  return false;
};

export const hasUserReceiptsChanged = (prevReceipts, newReceipts) => {
  if (prevReceipts.length !== newReceipts.length) {
    return true;
  }

  for (let i = 0; i < prevReceipts.length; i++) {
    const prevReceipt = prevReceipts[i];
    const newReceipt = newReceipts[i];
    if (!_.isEqual(prevReceipt, newReceipt)) {
      return true;
    }
  }

  return false;
};
