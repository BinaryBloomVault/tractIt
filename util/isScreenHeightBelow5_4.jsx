import { Dimensions } from "react-native";

const isScreenHeightBelow5_4 = () => {
  const screenHeight = Dimensions.get("window").height;
  return screenHeight < 5.4 * 72; // 1 inch = 72 points
};

export default isScreenHeightBelow5_4;
