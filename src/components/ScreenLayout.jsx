import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "../../assets/svg/back.svg";


const ScreenLayout = ({
  navigation,
  image,
  folderName,
  date,
  owner,
  children,
  showOverlay = true,
  RightIcon,
  OverlayContent,
}) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>

      <View style={styles.imageWrapper}>
        {/* Background Image */}
        <Image source={image} style={styles.folderImage} />

        {/* Header Bar */}
        <View style={styles.topBar}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <View style={styles.iconButton}>
              <Back height={16} width={16} />
            </View>
          </TouchableWithoutFeedback>

          {RightIcon && (
            <TouchableWithoutFeedback onPress={() => console.log("Right icon pressed")}>
              <View style={styles.iconButton}>{RightIcon}</View>
            </TouchableWithoutFeedback>
          )}
        </View>
        {showOverlay && (
          <View style={styles.bottomOverlay}>
            {OverlayContent ? (
              OverlayContent
            ) : (
              <>
                <View>
                  <Text style={styles.folderHeading}>{folderName}</Text>
                  <Text style={styles.folderHeadingDate}>{date}</Text>
                </View>
              </>
            )}
          </View>
        )}
      </View>
      {/* Main Content */}
      <ScrollView style={styles.container}>{children}</ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    position: "relative",
  },
  folderImage: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
  topBar: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 2,
  },
  iconButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
});


export default ScreenLayout;
