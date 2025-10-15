import React, { useState } from "react";
import { 
  View, Text, Image, TouchableOpacity, 
  StyleSheet, ImageBackground, ScrollView 
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../src/config/firebaseConfig";

const backgroundImage = require("../assets/fondo.jpg");

export default function PerfilScreen({ navigation }) {
  const user = auth.currentUser;
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const logout = () => {
    auth
      .signOut()
      .then(() => navigation.replace("Login"))
      .catch((error) => console.log(error));
  };

  const goHome = () => {
    navigation.replace("Home");
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} imageStyle={{ opacity: 0.2 }}>
      <View style={{ flex: 1 }}>
        
        {/* CONTENIDO SCROLL */}
        <ScrollView contentContainerStyle={styles.container}>
          {/* LOGO + TEXTO */}
          <View style={styles.brandContainer}>
            <Image
              source={require("../assets/Logoestrellanegra.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.textContainer}>
              <Text style={styles.brand}>Pchelá</Text>
              <Text style={styles.subtitle}>Universal Beauty</Text>
            </View>
          </View>

          {/* FOTO DE PERFIL */}
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <Image
              source={{
                uri: profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              }}
              style={styles.avatar}
            />
            <Text style={styles.changePhoto}>Cambiar foto</Text>
          </TouchableOpacity>

          {/* NOMBRE Y EMAIL */}
          <View style={styles.userBar}>
            <Text style={styles.username}>{user?.displayName || "Usuario"}</Text>
            <Text style={styles.email}>{user?.email || "correo@ejemplo.com"}</Text>
          </View>

          {/* DATOS PERSONALES */}
          <View style={styles.infoBox}>
            <Text style={styles.sectionTitle}>Datos Personales</Text>

            <View style={styles.infoItem}>
              <MaterialIcons name="badge" size={20} color="#D02985" />
              <Text style={styles.infoText}>{user?.displayName || "Nombre no disponible"}</Text>
            </View>

            <View style={styles.infoItem}>
              <MaterialIcons name="phone" size={20} color="#D02985" />
              <Text style={styles.infoText}>+54 387 5783934</Text>
            </View>

            <View style={styles.infoItem}>
              <MaterialIcons name="home" size={20} color="#D02985" />
              <Text style={styles.infoText}>B° Tres Cerritos n° 56, Salta</Text>
            </View>

            <View style={styles.infoItem}>
              <MaterialIcons name="business" size={20} color="#D02985" />
              <Text style={styles.infoText}>CUIT: 20-12345678-9</Text>
            </View>
          </View>

          {/* BOTÓN EDITAR PERFIL (COMENTADO) */}
          {/*
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate("EditarPerfil")}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
          */}
        </ScrollView>

        {/* BOTTOM BAR FIJA */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.tabButton} onPress={goHome}>
            <FontAwesome name="home" size={24} color="#D02985" />
            <Text style={styles.tabText}>Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabButton} onPress={logout}>
            <FontAwesome name="sign-out" size={24} color="#D02985" />
            <Text style={styles.tabText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 100, 
  },
  brandContainer: {
    flexDirection: "row",       
    alignItems: "center",
    justifyContent: "flex-end", 
    marginTop: 40,
    marginBottom: 20,
    width: "100%",
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 6,
  },
  textContainer: {
    alignItems: "flex-start",     
  },
  brand: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D02985",
    marginLeft: -2,
  },
  subtitle: {
    fontSize: 12,
    color: "#555",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 8,
  },
  changePhoto: {
    fontSize: 14,
    color: "#D02985",
    textAlign: "center",
    marginBottom: 10,
  },
  userBar: {
    width: "100%",
    backgroundColor: "#D02985",  
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",               
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#fff",               
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D02985",
    marginBottom: 12,
    textAlign: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    paddingBottom: 6,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
  },
  editButton: {
    backgroundColor: "#D02985",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 25,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  tabButton: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "bold",
    color: "#D02985",
  },
});
