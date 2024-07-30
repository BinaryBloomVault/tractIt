import React from "react";
import { View, Text, StyleSheet } from "react-native";

const generateInitials = (friends) => {
  const initials = [];
  const usedInitials = new Set();

  for (let friend of friends) {
    let initial = friend.substring(0, 2).toUpperCase();

    let suffix = 1;
    while (usedInitials.has(initial)) {
      initial = friend[0].toUpperCase() + friend[suffix++].toUpperCase();
    }

    usedInitials.add(initial);

    const color = getRandomColor();

    initials.push({ initials: initial, color: color });
  }

  return initials;
};

const getRandomColor = () => {
  const colors = [
    "#2c2c2c",
    "#BF3E3E",
    "#2174D5",
    "#F2B33D",
    "#15251D",
    "#30833B",
    "#0E1211",
    "#446063",
    "#CCD4DD",
    "#141E1D",
    "#967959",
    "#FBE4BD",
    "#221C0F",
    "#020203",
    "#2B4534",
    "#541E17",
    "#6D313D",
    "#202BD2",
    "#015967",
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const UserIcon = ({ friends }) => {
  const styles = useStyles();

  if (!friends || friends.length === 0) {
    return <Text>No friends data available</Text>;
  }

  const initials = generateInitials(friends);

  return (
    <View style={styles.friendIcons}>
      {initials.map((friend, idx) => (
        <View
          style={[styles.friendCircle, { backgroundColor: friend.color }]}
          key={idx}
        >
          <Text style={styles.friendInitial}>{friend.initials}</Text>
        </View>
      ))}
    </View>
  );
};

const useStyles = () =>
  StyleSheet.create({
    friendIcons: {
      flexDirection: "row",
      marginTop: 1,
    },
    friendCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "#2c2c2c", // Default background color
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: -2,
      elevation: 3, // Drop shadow for android
      // Drop shadow for iOS
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
    },
    friendInitial: {
      color: "#FFF",
      fontWeight: "bold",
    },
  });

export default UserIcon;
