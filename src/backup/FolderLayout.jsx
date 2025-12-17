import React from "react";
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "../../assets/svg/back.svg";

const FolderLayout = ({
  navigation,
  image,
  folderName,
  date,
  owner,
  inviteText,
  onInvitePress,
  children,
  showOverlay = true, // show/hide bottom overlay
  RightIcon,          // dynamic top-right icon
}) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.imageWrapper}>
        {/* Header Image */}
        <Image source={image} style={styles.folderImage} />

        {/* Top bar with back & dynamic right icon */}
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

        {/* Bottom overlay */}
        {showOverlay && (folderName || date || owner || inviteText) && (
          <View style={styles.bottomOverlay}>
            <View>
              {folderName && <Text style={styles.folderHeading}>{folderName}</Text>}
              {date && <Text style={styles.folderHeadingDate}>{date}</Text>}
              {owner && (
                <View style={styles.profileIcon}>
                  <Text style={{ color: "#FFFFFF" }}>{owner}</Text>
                </View>
              )}
            </View>

            {inviteText && (
                     <TouchableWithoutFeedback onPress={onInvitePress}>
                <View style={styles.inviteButton}>
                  <Text style={styles.inviteText}>{inviteText}</Text>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        )}
      </View>

      {/* Dynamic content */}
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -60,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 40,
  },
  topBar: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  iconButton: {
    backgroundColor: "#D9D9D9C7",
    padding: 8,
    borderRadius: 20,
  },
  imageWrapper: {
    position: "relative",
  },
  folderImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  folderHeading: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  folderHeadingDate: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 8,
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ED3C50",
    justifyContent: "center",
    alignItems: "center",
  },
  inviteButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: 15,
  },
  inviteText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default FolderLayout;
