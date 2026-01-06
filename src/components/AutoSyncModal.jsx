import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const profile = require("../../assets/profile.jpg");
const snaphive = require("../../assets/snaphive-logo.png");

import { colors } from '../Theme/theme';

const AutoSyncModal = ({ visible, onCreate, onSkip, photoCount = 0, previewImage }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* SnapHive Logo */}
          <Image
            source={snaphive}
            style={styles.snaphiveLogo}
          />

          {/* Top Image Stack */}
          <View style={styles.imageStack}>
            <Image
              source={previewImage ? { uri: previewImage } : profile}
              style={[styles.smallImage, styles.leftImage]}
            />
            <Image
              source={previewImage ? { uri: previewImage } : profile}
              style={styles.mainImage}
            />
            <Image
              source={previewImage ? { uri: previewImage } : profile}
              style={[styles.smallImage, styles.rightImage]}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Auto Sync Photos Found!</Text>

          {/* Description */}
          <Text style={styles.description}>
            We found {photoCount} new {photoCount === 1 ? 'photo' : 'photos'} on your device.{'\n'}
            Create a Hive to auto sync and share them!
          </Text>

          {/* Preview Card */}
          <View style={styles.previewCard}>
            <Image
              source={previewImage ? { uri: previewImage } : profile}
              style={styles.previewImage}
            />
            <Text style={styles.previewText}>
              Create Hive with {photoCount} new {photoCount === 1 ? 'photo' : 'photos'}
            </Text>
          </View>

          {/* Primary Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={onCreate}>
            <Text style={styles.primaryText}>Create Hive</Text>
          </TouchableOpacity>

          {/* Skip */}
          <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default AutoSyncModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: width * 0.88,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },

  /* SnapHive Logo */
  snaphiveLogo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
    marginBottom: 20,
  },

  /* Image Stack */
  imageStack: {
    height: 100,
    width: '100%',
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#fff",
    zIndex: 3,
  },
  smallImage: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#fff",
    opacity: 0.85,
  },
  leftImage: {
    left: 30,
    top: 8,
    zIndex: 1,
  },
  rightImage: {
    right: 30,
    top: 8,
    zIndex: 2,
  },

  /* Text */
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 8,
  },

  /* Preview Card */
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    borderRadius: 16,
    padding: 14,
    width: "100%",
    marginBottom: 20,
  },
  previewImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  previewText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#2a2a2a",
    lineHeight: 20,
  },

  /* Buttons */
  primaryButton: {
    width: "100%",
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "600",
  },
});