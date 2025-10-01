import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import CustomAlert from "../components/CustomAlert";

export default function AgregarProducto({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: "", message: "", type: "info" });

  const showAlert = (title, message, type = "info") => {
    setAlertData({ title, message, type });
    setAlertVisible(true);
  };

  const handleGuardar = () => {
    if (!nombre || !precio || !stock) {
      showAlert("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    // Simulación de guardado
    showAlert("Éxito", `Producto agregado: ${nombre}`, "success");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Producto</Text>

      <TextInput
        placeholder="Nombre del producto"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Stock"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={handleGuardar}>
        <Text style={styles.btnText}>Guardar</Text>
      </TouchableOpacity>

      {/* ALERTA */}
      <CustomAlert
        visible={alertVisible}
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
        onClose={() => {
          setAlertVisible(false);
          if (alertData.type === "success") {
            navigation.goBack();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#D02985",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#D02985",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
