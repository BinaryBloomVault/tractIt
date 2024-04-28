import React, { useState } from "react";
import { StyleSheet,
         Text,
         View,
         FlatList,
         ScrollView,
         TouchableOpacity,
         Alert } from "react-native";

import { Card } from "@rneui/themed";
import ItemRow from "./itemRow";
import Swipelist from 'react-native-swipeable-list-view'
import Icon from 'react-native-vector-icons/FontAwesome';

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
            <ScrollView contentContainerStyle={styles.scrollContainer} vertical={true}>
                <Swipelist
                    data={tableData}
                    keyExtractor={(item, index) => index.toString()}
                    renderRightItem={(data, index) => (
                        <TouchableOpacity
                            style={styles.rightAction}
                            onPress={() => {
                                Alert.alert('Edit Items', data.items)
                            }}
                        >
                        <View key={index}>
                          <View style={styles.header}>
                              <ItemRow item={data} color="#A9DFBF" />
                          </View>
                          <Card.Divider
                              style={{ width: "100%", marginBottom: 0 }}
                              color="#0F240F"
                              width={2}
                              orientation="horizontal"
                          />
                        </View>
                        </TouchableOpacity>
                        
                    )}
                    renderHiddenItem={(data, index) => (
                      <View style={styles.icons}>
                          <TouchableOpacity
                            style={styles.rightAction}
                            onPress={() => {
                            Alert.alert('Paid Items', data.items)
                          }}
                          >
                        <Icon name="check-circle" size={30} color="green"/>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.rightAction}
                            onPress={() => {
                            Alert.alert('Delete Items', data.items)
                          }}
                          >
                        <Icon name="trash" size={30} color="red" style={{paddingLeft: 20}}/>
                        </TouchableOpacity>
                      </View>
                  )}
                />
            </ScrollView>
        </Card>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        paddingVertical: 8,
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
    scrollContainer: {
        paddingBottom: 8,
    },
    icons:{
      flexDirection: 'row',
      marginLeft: 20,
      marginTop: 15,
    }
});

export default Mainscreen;