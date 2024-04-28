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
  