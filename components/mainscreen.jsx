import React, { useEffect } from "react";
import { StyleSheet,
         Text,
         View,
         FlatList,
         ScrollView,
         Alert,
         Image, 
         Pressable} from "react-native";

import { Card } from "@rneui/themed";
import ItemRow from "./itemRow";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {useStore} from "./zustand"

import {db} from "./firebaseConfig"
import { collection, getDocs } from 'firebase/firestore';


const swipeFromRightOpen = () => {
  Alert.alert('Swipe from right');
};


const swipeFromLeftOpen = () => {
  Alert.alert('Swipe from left');
};

const RightSwipeActions = () => {
  return (
    <View
      style={{
        backgroundColor: '#EA4C4C',
        justifyContent: 'center',
        alignItems: 'flex-end',
        borderRadius: 5,
      }}
    >
      <Text
        style={{
          color: '#fff',
          fontFamily: "Gudea-Bold",
          fontWeight: '600',
          paddingHorizontal: 30,
          paddingVertical: 20,
        }}
      >
        Delete
      </Text>
    </View>
  );
};

const LeftSwipeActions = () => {
  return (
    <View
      style={{
          backgroundColor: '#00BEE5',
          justifyContent: 'center',
          alignItems: 'flex-end',
          borderRadius: 5 }}
    >
      <Text
        style={{
          color: '#fff',
          fontFamily: "Gudea-Bold",
          fontWeight: '600',
          paddingHorizontal: 30,
          paddingVertical: 20,
        }}
      >
        Paid
      </Text>
    </View>
  );
};

const Mainscreen = () => {
  const { tableData, setTableData } = useStore();

  const fetchData = async () => {
      try {
          const querySnapshot = await getDocs(collection(db, "Users"));
          const newData: TableData[] = [];
          querySnapshot.forEach(doc => {
              const userData = doc.data();
              newData.push({
                  name: userData.name,
                  items: userData.menu,
                  price: userData.price,
                  friends: userData.groupfriends
              });
          });
          setTableData(newData);
          console.log('Data fetched successfully');
      } catch(error) {
          console.log('Error displaying data ', error);
      }
  };

  useEffect(() => {
      fetchData();
  }, []);


      return (
        <View styles={styles.mainContainer}>
          <View style={styles.userProfile}>
            <Pressable onPress={fetchData}>
              <Image
              style={styles.images}
              source={require('./avatar.png')}
              contentFit="cover"
              transition={1000}
              />
            </Pressable>
          </View>
            <Card containerStyle={styles.container}>
              <ScrollView  vertical={true}>
                {tableData.slice(0, tableData.length).map((item, index) => (
                  <Swipeable
                    key={index}
                    renderRightActions={RightSwipeActions}
                    renderLeftActions={LeftSwipeActions}
                    onSwipeableRightOpen={() => swipeFromRightOpen(index)}
                    onSwipeableLeftOpen={() => swipeFromLeftOpen(index)}
                  >
                    <View key={index}>
                      <View style={styles.header}>
                        <ItemRow item={item} color="white" />
                      </View>
                    </View>
                  </Swipeable>
                ))}
              </ScrollView>
            </Card>
        </View>
      );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },  
  header: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  container: {
    borderRadius: 10,
    height: "70%",
    marginLeft: 8,
    marginRight: 8,
    marginTop: 120,
    backgroundColor:"#F2E3A9",
    padding: 0,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  scrollContainer: {
      paddingBottom: 8,
  },
  userProfile: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  images: {
    width: 54,
    height: 54,
    borderRadius: 25,
  },

});

export default Mainscreen;
import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, ScrollView } from "react-native";
import { Card } from "@rneui/themed";
import ItemRow from "./itemRow";
import Swipelist from 'react-native-swipeable-list-view'


const Mainscreen = () => {
    const [tableData, setTableData] = useState([
        {
          items: "Lunch Out",
          price: 500,
          friends: {
            user_1: true,
            user_2: true,
            user_3: true,
          },
        },
        {
          items: "Dinner",
          price: 700,
          friends: {
            user_1: true,
            user_4: true,
            user_5: true,
          },
        },
        {
          items: "Break fast",
          price: 1000,
          friends: {
            user_2: true,
            user_3: true,
            user_5: true,
          },
        },
        {
          items: "Team Bonding",
          price: 1000,
          friends: {
            user_2: true,
            user_3: true,
            user_5: true,
          },
        },
        {
          items: "Snacks",
          price: 1000,
          friends: {
            user_2: true,
            user_3: true,
            user_5: true,
          },
        },
        {
          items: "Shopping",
          price: 1000,
          friends: {
            user_2: true,
            user_3: true,
            user_5: true,
          },
        },
        {
          items: "Pizza",
          price: 1000,
          friends: {
            user_2: true,
            user_3: true,
            user_5: true,
          },
        },
        {
            items: "Pizza",
            price: 1000,
            friends: {
              user_2: true,
              user_3: true,
              user_5: true,
            },
          },
          {
            items: "Pizza",
            price: 1000,
            friends: {
              user_2: true,
              user_3: true,
              user_5: true,
            },
          },        {
            items: "Pizza",
            price: 1000,
            friends: {
              user_2: true,
              user_3: true,
              user_5: true,
            },
          },
          {
            items: "Pizza",
            price: 1000,
            friends: {
              user_2: true,
              user_3: true,
              user_5: true,
            },
          },
      ]);

      return (
        <Card containerStyle={styles.container}>
            <Card.Divider
            style={{ width: "100%", marginBottom: 0 }}
            color="#0F240F"
            width={2}
            orientation="horizontal"
            />
            <View style={styles.itemList}>
            <ScrollView contentContainerStyle={styles.scrollContainer} vertical={true}>
                {tableData.slice(0, 8).map((item, index) => (
                    <View key={index}>
                    <View style={styles.header}>
                        <ItemRow item={item} color="#A9DFBF" />
                    </View>
                    <Card.Divider
                        style={{ width: "100%", marginBottom: 0 }}
                        color="#0F240F"
                        width={2}
                        orientation="horizontal"
                    />
                    </View>
                ))}
            </ScrollView>
            </View>
        </Card>
      );
};

export default Mainscreen

const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      paddingVertical: 8,
    },
    mainCard:{
        height: 100
    },
    container: {
        borderRadius: 10,
        height: "70%",
        marginLeft: 8,
        marginRight: 8,
        marginTop: 10,
        backgroundColor:"#F2E3A9",
        padding: 0,
        shadowColor: "#171717",
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    itemList: {
        paddingBottom: 8
    }
  });
  