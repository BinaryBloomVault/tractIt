import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const COLORS = [
  '#2c2c2c',
  '#BF3E3E',
  '#2174D5',
  '#F2B33D',
  '#15251D',
  '#30833B',
  '#0E1211',
  '#446063',
  '#CCD4DD',
  '#141E1D',
  '#967959',
  '#FBE4BD',
  '#221C0F',
  '#020203',
  '#2B4534',
  '#541E17',
  '#6D313D',
  '#202BD2',
  '#015967',
];

const MAX_DISPLAY_FRIENDS = 5;

const generateInitials = (friends = [], paidFriends = []) => {
  const initials = [];
  const usedInitials = new Set();
  const usedColors = new Map();

  for (let friendName of friends) {
    if (!friendName) continue;

    let initial = friendName.substring(0, 2).toUpperCase();
    let suffix = 1;

    while (usedInitials.has(initial)) {
      initial =
        friendName[0].toUpperCase() + friendName[suffix++].toUpperCase();
    }

    usedInitials.add(initial);

    let color;
    if (usedColors.has(friendName)) {
      color = usedColors.get(friendName);
    } else {
      color = getColorForName(friendName);
      usedColors.set(friendName, color);
    }

    const isPaid = paidFriends.some(
      (paidFriend) => paidFriend.name === friendName && paidFriend.paid,
    );

    initials.push({ name: friendName, initials: initial, color, paid: isPaid });
  }

  return initials;
};

const getColorForName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
};

const UserIcon = ({ friends, paidFriends = [] }) => {
  const styles = useStyles();

  if (!friends || friends.length === 0) {
    return <Text>No Friends</Text>;
  }

  const initials = generateInitials(friends, paidFriends);
  const displayedFriends = initials.slice(0, MAX_DISPLAY_FRIENDS);
  const remainingCount = friends.length - MAX_DISPLAY_FRIENDS;

  return (
    <View style={styles.friendIcons}>
      {displayedFriends.map((friend, idx) => (
        <View
          key={idx}
          style={[styles.friendCircle, { backgroundColor: friend.color }]}
        >
          <Text style={styles.friendInitial}>{friend.initials}</Text>
          {friend.paid && (
            <MaterialIcons
              name='check-circle'
              size={16}
              color='green'
              style={styles.checkIcon}
            />
          )}
        </View>
      ))}

      {remainingCount > 0 && (
        <View style={[styles.friendCircle, styles.moreCircle]}>
          <Text style={styles.friendInitial}>+{remainingCount}</Text>
        </View>
      )}
    </View>
  );
};

const useStyles = () =>
  StyleSheet.create({
    friendIcons: {
      flexDirection: 'row',
      marginTop: 1,
    },
    friendCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#2c2c2c',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: -2,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      position: 'relative',
    },
    moreCircle: {
      backgroundColor: '#CBCAD0',
    },
    friendInitial: {
      color: '#FFF',
      fontWeight: 'bold',
    },
    checkIcon: {
      position: 'absolute',
      right: -8,
      bottom: -8,
    },
  });

export default UserIcon;
