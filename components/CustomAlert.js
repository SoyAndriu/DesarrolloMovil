import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CustomAlert({
  visible,
  title,
  message,
  onClose,
  buttonText = "Aceptar",
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
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
    width: "80%",
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D02985",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#D02985",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
