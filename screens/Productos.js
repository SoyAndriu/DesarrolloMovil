import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, ImageBackground, Modal, TextInput, Button
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomAlert from "../components/CustomAlert";
import ConfirmAlert from "../components/ConfirmAlert";

export default function Productos({ navigation }) {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Tijera", precio: 15000, cantidad: 20, img: require("../assets/tijerita.jpg") },
    { id: 2, nombre: "Lima", precio: 9000, cantidad: 50, img: require("../assets/limas.jpg") },
    { id: 3, nombre: "Tijera Sm", precio: 6000, cantidad: 10, img: require("../assets/pinzaexpert.jpg") },
    { id: 4, nombre: "Bob Cut", precio: 11000, cantidad: 15, img: require("../assets/muchas.jpg") },
    { id: 5, nombre: "Pinzas", precio: 5000, cantidad: 30, img: require("../assets/pinzas.jpg") },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [productoForm, setProductoForm] = useState({ id: null, nombre: '', precio: '', cantidad: '' });
  const [isEditing, setIsEditing] = useState(false);

  // ALERTAS
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: "", message: "", type: "info" });

  const showAlert = (title, message, type = "info") => {
    setAlertData({ title, message, type });
    setAlertVisible(true);
  };

  // CONFIRMACIÓN ELIMINAR
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteData, setDeleteData] = useState({ id: null, nombre: "" });

  // EDITAR
  const handleEdit = (producto) => {
    setProductoForm({ ...producto });
    setIsEditing(true);
    setModalVisible(true);
  };

  // AGREGAR
  const handleAdd = () => {
    setProductoForm({ id: null, nombre: '', precio: '', cantidad: '' });
    setIsEditing(false);
    setModalVisible(true);
  };

  // GUARDAR
  const handleSave = () => {
    if (!productoForm.nombre || !productoForm.precio || !productoForm.cantidad) {
      showAlert("Error", "Todos los campos son obligatorios.", "error");
      return;
    }

    if (isEditing) {
      setProductos(prev => prev.map(p => p.id === productoForm.id ? productoForm : p));
      showAlert("Éxito", "Producto actualizado correctamente.", "success");
    } else {
      const newProduct = {
        ...productoForm,
        id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
        img: require("../assets/fondo.jpg"),
      };
      setProductos(prev => [...prev, newProduct]);
      showAlert("Éxito", "Producto agregado correctamente.", "success");
    }
    setModalVisible(false);
  };

  // ELIMINAR con confirmación
  const handleDelete = (id, nombre) => {
    setDeleteData({ id, nombre });
    setConfirmVisible(true);
  };

  return (
    <ImageBackground source={require("../assets/fondo.jpg")} style={styles.background}>
      <View style={styles.overlay}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#D02985" />
          </TouchableOpacity>
          <View style={{ width: 28 }} />
        </View>

        {/* LOGO Y TEXTO */}
        <View style={styles.brandContainer}>
          <View style={{ flex: 1 }} />
          <View style={styles.logoContainer}>
            <Image source={require("../assets/Logoestrellanegra.png")} style={styles.logo} />
            <View style={styles.textContainer}>
              <Text style={styles.companyName}>Pchelá</Text>
              <Text style={styles.companySlogan}>Universal Beauty</Text>
            </View>
          </View>
        </View>

        {/* LO MÁS VENDIDO */}
        <View style={styles.featuredBox}>
          <Text style={styles.featuredText}>🔥 Lo más vendido 🔥</Text>
          <Text style={styles.featuredItem}>✨ Tijera Premium ✨</Text>
        </View>

        <Text style={styles.title}>Productos disponibles</Text>

        {/* LISTA */}
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {productos.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <Image source={item.img} style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{item.nombre}</Text>
                <Text style={styles.productPrice}>Precio ${item.precio}</Text>
                <Text style={styles.stock}>Cantidad: {item.cantidad}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Ionicons name="create-outline" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id, item.nombre)}>
                  <Ionicons name="trash-outline" size={28} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* BOTÓN AGREGAR */}
        <TouchableOpacity style={styles.fab} onPress={handleAdd}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>

        {/* MODAL DE AGREGAR/EDITAR */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</Text>
              <TextInput
                style={styles.input}
                value={productoForm?.nombre}
                onChangeText={(text) => setProductoForm({ ...productoForm, nombre: text })}
                placeholder="Nombre"
              />
              <TextInput
                style={styles.input}
                value={String(productoForm?.precio)}
                onChangeText={(text) => setProductoForm({ ...productoForm, precio: parseInt(text) || 0 })}
                placeholder="Precio"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                value={String(productoForm?.cantidad)}
                onChangeText={(text) => setProductoForm({ ...productoForm, cantidad: parseInt(text) || 0 })}
                placeholder="Cantidad a agregar"
                keyboardType="numeric"
              />
              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                <Button title="Guardar" onPress={handleSave} color="#D02985" />
              </View>
            </View>
          </View>
        </Modal>

        {/* ALERTAS */}
        <CustomAlert
          visible={alertVisible}
          title={alertData.title}
          message={alertData.message}
          type={alertData.type}
          onClose={() => setAlertVisible(false)}
        />

        <ConfirmAlert
          visible={confirmVisible}
          title="Eliminar Producto"
          message={`¿Desea eliminar el producto "${deleteData.nombre}"?`}
          onCancel={() => setConfirmVisible(false)}
          onConfirm={() => {
            setProductos(prev => prev.filter(p => p.id !== deleteData.id));
            setConfirmVisible(false);
            showAlert("Éxito", "Producto eliminado correctamente.", "success");
          }}
        />

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  overlay: { flex: 1, padding: 20, backgroundColor: 'rgba(255,255,255,0.85)' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingTop: 40 },
  backButton: { width: 28 },

  brandContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, resizeMode: "contain", marginRight: 8 },
  textContainer: { alignItems: 'flex-start' },
  companyName: { fontSize: 18, fontWeight: "bold", color: "#D02985" },
  companySlogan: { fontSize: 14, color: "#555" },

  featuredBox: {
    backgroundColor: "#FFD700",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  featuredText: { fontSize: 18, fontWeight: "bold", color: "#D02985" },
  featuredItem: { fontSize: 16, color: "#333", marginTop: 5 },

  title: { fontSize: 22, fontWeight: 'bold', color: '#D02985', marginBottom: 15 },

  productCard: {
    flexDirection: "row", alignItems: "center",
    padding: 15, marginBottom: 15, backgroundColor: "#fff",
    borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.1,
    shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: "#D02985",
  },
  image: { width: 60, height: 60, resizeMode: "contain", marginRight: 15 },
  productName: { fontSize: 18, fontWeight: "bold" },
  productPrice: { fontSize: 16, marginVertical: 3 },
  stock: { fontSize: 14, color: "#555" },
  actions: { justifyContent: "space-between", alignItems: "center", marginLeft: 10 },

  fab: {
    position: "absolute", bottom: 20, right: 20,
    backgroundColor: "#D02985", width: 60, height: 60, borderRadius: 30,
    justifyContent: "center", alignItems: "center", elevation: 5,
  },

  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "85%", backgroundColor: "#fff", borderRadius: 10, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#D02985" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
});
