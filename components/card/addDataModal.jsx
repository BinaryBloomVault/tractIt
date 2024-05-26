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
import AddButton from "../button/AddButton";

const AddDataModal = () => {
  const styles = useStyle();
  const [pages, setPages] = useState([0]);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollViewRef = useRef(null);
  const windowWidth = useWindowDimensions().width;
  const itemRefs = useRef([]);
  const quantityRefs = useRef([]);
  const priceRefs = useRef([]);
  const friendsRefs = useRef([]);

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

  const handleSaveReceipts = () => {
    const receipts = itemRefs.current.map((_, index) => ({
      item: itemRefs.current[index].value,
      quantity: quantityRefs.current[index].value,
      price: priceRefs.current[index].value,
      friends: friendsRefs.current[index].value,
    }));

    receipts.forEach((receipt) => {
      setAddSharedReceipt(receipt);
    });

    // Optionally clear the form after submission
    setPages([0]);
    setCurrentPage(1);
  };

  return (
    <View style={{ marginTop: 16 }}>
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
                ref={(ref) => (itemRefs.current[index] = ref)}
                style={styles.rectangleInput}
                selectTextOnFocus={true}
              />
            </View>
            <View style={styles.itemsParent}>
              <Text style={styles.title}>Quantity</Text>
              <TextInput
                ref={(ref) => (quantityRefs.current[index] = ref)}
                style={styles.rectangleInput}
                selectTextOnFocus={true}
              />
            </View>
            <View style={styles.itemsParent}>
              <Text style={styles.title}>Price</Text>
              <TextInput
                ref={(ref) => (priceRefs.current[index] = ref)}
                style={styles.rectangleInput}
                selectTextOnFocus={true}
              />
            </View>
            <View style={styles.itemsParent}>
              <Text style={styles.title}>Friends</Text>
              <TextInput
                ref={(ref) => (friendsRefs.current[index] = ref)}
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
    </View>
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
      marginTop: 60,
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
  });
  return styles;
};

export default AddDataModal;
