import React, { useEffect } from "react";
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";

const AppModal = ({
  visible,
  title,
  message,
  type = "info", // success | error | warning | info
  onClose,
  autoClose = true,
  duration = 1800,
}) => {
  const colors = {
    success: "#DA3C84",
    error: "#dc2626",
    warning: "#f59e0b",
    info: "#2563eb",
  };

  // ✅ Auto close (toast-like)
  useEffect(() => {
    if (visible && autoClose) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <Text style={[styles.title, { color: colors[type] }]}>
                {title}
              </Text>
              <Text style={styles.message}>{message}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
});
