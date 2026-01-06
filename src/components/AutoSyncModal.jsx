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
              style={[styles.smallImage, { left: -30, top: 20 }]}
            />
            <Image
              source={previewImage ? { uri: previewImage } : profile}
              style={styles.mainImage}
            />
            <Image
              source={previewImage ? { uri: previewImage } : profile}
              style={[styles.smallImage, { right: -30, top: 20 }]}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Auto Sync Photos</Text>
          <Text style={styles.title}>Photos Found!</Text>

          {/* Description */}
          <Text style={styles.description}>
            We found {photoCount} new {photoCount === 1 ? 'photo' : 'photos'} on your device.
            Create a Hive to auto sync and share them!
          </Text>

          {/* Preview Card */}
          <View style={styles.previewCard}>
            <Image
              source={previewImage ? { uri: previewImage } : profile}
              style={styles.previewImage}
            />
            <Text style={styles.previewText}>
              Create Hive with {photoCount} new {photoCount === 1 ? 'photo' : 'photos'}?
            </Text>
          </View>

          {/* Primary Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={onCreate}>
            <Text style={styles.primaryText}>Create Hive</Text>
          </TouchableOpacity>

          {/* Skip */}
          <TouchableOpacity onPress={onSkip}>
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
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: width * 0.92,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },

  /* SnapHive Logo */
  snaphiveLogo: {
    width: 120,
    height: 50,
    resizeMode: "contain",
    position: "absolute",
    top: -30,     // ✅ makes it visible above modal
    zIndex: 10,   // ✅ ensures it stays on top
  },

  /* Image Stack */
  imageStack: {
    height: 120,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: {
    width: 90,
    height: 90,
    borderRadius: 16,
    zIndex: 2,
  },
  smallImage: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 14,
    opacity: 0.9,
  },

  /* Text */
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginTop: 2,
  },
  description: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginVertical: 12,
    paddingHorizontal: 10,
  },

  /* Preview Card */
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
    borderRadius: 14,
    padding: 10,
    width: "100%",
    marginBottom: 16,
  },
  previewImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 10,
  },
  previewText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  /* Buttons */
  primaryButton: {
    width: "100%",
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  skipText: {
    marginTop: 14,
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
});
