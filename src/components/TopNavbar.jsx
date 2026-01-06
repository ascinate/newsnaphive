import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useNotification } from "../context/NotificationContext";
import MaskedView from "@react-native-masked-view/masked-view";
const logo = require("../../assets/snaphive-logo.png");
import { colors } from '../Theme/theme';
import { Bell } from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";
import CustomText from "./CustomText";

const TopNav = () => {
  const navigation = useNavigation();
  const { notifications, unreadCount } = useNotification();

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image source={logo} style={{ width:100, height: 45, resizeMode: "contain", }} />
          <Text>update 20</Text>
      </View>

      <TouchableOpacity
        style={styles.bellWrapper}
        onPress={() => navigation.navigate("Notification")}
      >
        <Bell width={28} height={28} />
        {unreadCount > 0 && (
          <View
            style={styles.badge}
          >
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconGradient: {
    borderRadius: 12,
    padding: 8,
  },
  snapText: {
    fontSize: 22,
    fontWeight: "700",
  },
  bellWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default TopNav;
