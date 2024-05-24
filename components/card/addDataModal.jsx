import {
  View,
  Text,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef } from "react";
import AddButton from "../button/addButton";

const AddDataModal = () => {
  const styles = useStyle();
  const [pages, setPages] = useState([0]);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollViewRef = useRef(null);
  const windowWidth = useWindowDimensions().width;

  const addNewPage = () => {
    if (pages.length < 99) {
      setPages((prevPages) => [...prevPages, prevPages.length]);
      setCurrentPage(currentPage + 1);
      setTimeout(() => {
        scrollViewRef.current.scrollTo({
          x: windowWidth * pages.length,
          animated: true,
        });
      }, 100);
    }
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentPage = Math.floor(contentOffset / windowWidth) + 1;
    setCurrentPage(currentPage);
  };

  return (
    <>
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {pages.map((page, index) => (
          <View key={page} style={styles.pageContainer}>
            <View style={styles.itemsParent}>
              <Text style={styles.title}>Items</Text>
              <TextInput
                style={styles.rectangleInput}
                selectTextOnFocus={true}
              />
            </View>
            <View style={styles.itemsParent}>
              <Text style={styles.title}>Quantity</Text>
              <TextInput
                style={styles.rectangleInput}
                selectTextOnFocus={true}
              />
            </View>
            <View style={styles.itemsParent}>
              <Text style={styles.title}>Price</Text>
              <TextInput
                style={styles.rectangleInput}
                selectTextOnFocus={true}
              />
            </View>
            <View style={styles.itemsParent}>
              <Text style={styles.title}>Friends</Text>
              <TextInput
                style={styles.rectangleInput}
                selectTextOnFocus={true}
              />
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.addButtonContainer}>
        <AddButton
          bottom={10}
          title="Add more"
          width={150}
          fontSize={25}
          height={40}
          onPress={addNewPage}
          disabled={pages.length >= 99}
        />
        <Text style={styles.paginationText}>
          {currentPage > 0 ? currentPage : 1}/{pages.length}
        </Text>
      </View>
    </>
  );
};

const useStyle = () => {
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions();
  const styles = StyleSheet.create({
    scrollViewContainer: {
      alignItems: "center",
    },
    pageContainer: {
      width: deviceWidth,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    addButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      marginBottom: 30,
    },
    paginationText: {
      fontSize: 18,
      right: 44,
      bottom: 30,
      fontWeight: "800",
      fontFamily: "Gudea-Regular",
    },
    itemsParent: {
      flexDirection: "row",
      marginTop: deviceHeight < 813 ? 12 : 16,
      alignItems: "center",
      width: "80%",
    },
    title: {
      flex: 1,
      fontSize: deviceHeight < 813 ? 20 : 22,
      fontWeight: "bold",
      fontFamily: "Gudea-Bold",
      textAlign: "left",
    },
    rectangleInput: {
      borderRadius: 5,
      borderStyle: "solid",
      borderColor: "#888",
      borderWidth: 1,
      width: "70%",
      height: deviceHeight < 813 ? 32 : 40,
    },
    frameParent: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      marginLeft: 24,
      marginRight: 24,
      marginTop: 8,
    },
    paginationButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      columnGap: 0,
      marginTop: 16,
    },
    button: {
      padding: 10,
      backgroundColor: "#00bee5",
      borderRadius: 5,
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontFamily: "Gudea-Bold",
      fontWeight: "700",
    },
  });
  return styles;
};

export default AddDataModal;
