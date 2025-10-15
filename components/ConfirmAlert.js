import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ConfirmAlert({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  confirmColor = "#D02985",
  cancelColor = "#999",
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={[styles.title, { color: confirmColor }]}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: cancelColor }]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: confirmColor }]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)", // fondo translúcido
  },
  container: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.95)", // semi-transparente
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#D02985", // rosa borde
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  message: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
