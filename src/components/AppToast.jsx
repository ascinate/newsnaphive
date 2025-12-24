import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, View } from "react-native";

const AppToast = ({ visible, message, type = "info", onHide }) => {
  const translateY = useRef(new Animated.Value(100)).current;

  const colors = {
    success: "#16a34a",
    error: "#dc2626",
    warning: "#f59e0b",
    info: "#2563eb",
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }).start(() => onHide());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: colors[type], transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

export default AppToast;

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    elevation: 5,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
