import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import CustomAlert from "../components/CustomAlert";

export default function EditarProducto({ route, navigation }) {
  const { producto } = route.params;

  const [nombre, setNombre] = useState(producto.nombre);
  const [precio, setPrecio] = useState(String(producto.precio));

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: "", message: "", type: "info" });

  const showAlert = (title, message, type = "info") => {
    setAlertData({ title, message, type });
    setAlertVisible(true);
  };

  const guardarCambios = () => {
    // Simulación de actualización en BD/API
    console.log("Producto actualizado:", { id: producto.id, nombre, precio });

    // Mostrar alerta de éxito
    showAlert("Éxito", "El producto fue actualizado correctamente.", "success");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar producto</Text>

      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre"
      />
      <TextInput
        style={styles.input}
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
        placeholder="Precio"
      />

      <Button title="Guardar cambios" onPress={guardarCambios} />

      {/* ALERTA */}
      <CustomAlert
        visible={alertVisible}
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
        onClose={() => {
          setAlertVisible(false);
          navigation.goBack(); // volver después de cerrar el modal
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
});
