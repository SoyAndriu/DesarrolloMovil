import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, 
  ImageBackground, ScrollView, Image 
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import CustomAlert from "../components/CustomAlert";
import ConfirmAlert from "../components/ConfirmAlert";

const backgroundImage = require('../assets/herramientas.jpg');

export default function Home({ navigation }) {
  const [activeTab, setActiveTab] = useState('Perfil');
  const [userName, setUserName] = useState('Usuario');

  // ALERTAS
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: "", message: "", type: "info" });

  const showAlert = (title, message, type = "info") => {
    setAlertData({ title, message, type });
    setAlertVisible(true);
  };

  // CONFIRMACIÓN DE LOGOUT
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Mantener el nombre del usuario actualizado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserName(user.displayName || 'Usuario');
      else setUserName('Usuario');
    });
    return () => unsubscribe();
  }, []);

  // Cierra sesión y va directamente al LOGIN
  const handleLogOut = async () => {
    try {
      await signOut(auth);
      
      // Navega inmediatamente a la pantalla LOGIN.
  
      navigation.replace("Login"); 
      
    } catch (error) {
      // Si hay un error, SÍ mostramos la alerta de error.
      showAlert("Error", "Hubo un problema al cerrar sesión.", "error");
    }
  };

  // Perfil ahora navega directo a PerfilScreen
  const handleProfile = () => {
    navigation.navigate("Perfil");
  };

  const sections = [
    { title: 'Clientes', subtitle: 'Nombre, Apellido, Dni, Teléfono', icon: require('../assets/clientes.png') },
    { title: 'Proveedores', subtitle: 'Nombre, Cuit/Cuil, Dirección', icon: require('../assets/proveedores.png') },
    { title: 'Compras', subtitle: 'Fecha, Monto', icon: require('../assets/compras.png') },
    { title: 'Ventas', subtitle: 'Fecha, Monto, Estado', icon: require('../assets/ventas.png') },
    { title: 'Productos', subtitle: 'Nombre, Precio, Stock', icon: require('../assets/productos.jpg'), screen: 'Productos' },
    { title: 'Caja', subtitle: 'Fecha, Hora, Monto', icon: require('../assets/caja.png') },
  ];

  return (
    <ImageBackground source={backgroundImage} style={styles.background} imageStyle={{ opacity: 0.3 }}>
      <View style={styles.container}>
        
        {/* HEADER */}
        <View style={styles.header}>
          {navigation.canGoBack() ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={28} color="#D02985" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 28 }} />
          )}
          <View style={{ flex: 1 }} />
        </View>

        {/* LOGO Y TEXTO DE MARCA */}
        <View style={styles.brandContainer}>
          <View style={{ flex: 1 }} />
          <View style={styles.logoContainer}>
            <Image source={require('../assets/Logoestrellanegra.png')} style={styles.logo} />
            <View style={styles.textContainer}>
              <Text style={styles.brand}>Pchelá</Text>
              <Text style={styles.subtitle}>Universal Beauty</Text>
            </View>
          </View>
        </View>

        {/* Bienvenida */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcome}>Bienvenido/a</Text>
          <Text style={styles.username}>{userName}</Text>
        </View>

        {/* LISTA DE TARJETAS */}
        <ScrollView style={styles.cardsContainer}>
          {sections.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.card} 
              onPress={() => {
                if (item.screen) navigation.navigate(item.screen);
                else showAlert(item.title, `Abrir ${item.title}`, "info");
              }}
            >
              <Image source={item.icon} style={styles.cardIcon} />
              <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* BOTTOM TAB */}
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={styles.tabButton} 
            onPress={() => { setActiveTab('Perfil'); handleProfile(); }}
          >
            <FontAwesome name="user" size={24} color={activeTab === 'Perfil' ? "#D02985" : "#555"} />
            <Text style={[styles.tabText, { color: activeTab === 'Perfil' ? "#D02985" : "#555" }]}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tabButton} 
            onPress={() => { setActiveTab('Cerrar sesión'); setConfirmVisible(true); }}
          >
            <FontAwesome name="sign-out" size={24} color={activeTab === 'Cerrar sesión' ? "#D02985" : "#555"} />
            <Text style={[styles.tabText, { color: activeTab === 'Cerrar sesión' ? "#D02985" : "#555" }]}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ALERTA SIMPLE */}
      <CustomAlert
        visible={alertVisible}
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
        onClose={() => setAlertVisible(false)}
      />

      {/* CONFIRMACIÓN DE LOGOUT */}
      <ConfirmAlert
        visible={confirmVisible}
        title="Cerrar sesión"
        message="¿Estás seguro que quieres cerrar tu sesión?"
        cancelText="Cancelar"
        confirmText="Salir"
        cancelColor="#999"
        confirmColor="#D02985"
        onCancel={() => setConfirmVisible(false)}
        // Al presionar 'Salir' (confirmText): 1. Cierra la confirmación. 2. Cierra sesión y redirige.
        onConfirm={() => { setConfirmVisible(false); handleLogOut(); }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover"
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: 40,
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    height: 50
  },
  backButton: {
    width: 28
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 5
  },
  textContainer: {
    alignItems: 'flex-start'
  },
  brand: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D02985'
  },
  subtitle: {
    fontSize: 12,
    color: '#555'
  },
  welcomeContainer: {
    marginBottom: 15
  },
  welcome: {
    fontSize: 25,
    color: "#555"
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D02985",
    marginLeft: 15
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 10,
    marginBottom: 80
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#D0294B"
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 15
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold"
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#555"
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc"
  },
  tabButton: {
    alignItems: "center"
  },
  tabText: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "bold"
  }
});