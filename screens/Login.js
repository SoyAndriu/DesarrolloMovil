import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert,
  KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from "../components/CustomAlert"; 


const backgroundImage = require('../assets/tijeras.png');

export default function Login() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 🔔 Estados para CustomAlert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  
  // 🔑 MODIFICACIÓN 1: Estado para rastrear el éxito del login.
  const [isLoginSuccess, setIsLoginSuccess] = useState(false); 

  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z\d]/.test(password);
  const hasMinLength = password.length >= 6;

  const showCustomAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // --- MODIFICACIÓN 2: Lógica de Login ---
  const handleLogin = async () => {
    // Restablecer el estado de éxito antes de cada intento
    setIsLoginSuccess(false); 

    if (!email || !password) {
      showCustomAlert('Atención ⚠️', 'Por favor ingrese ambos campos.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // ✅ ÉXITO: Marcamos el estado a true
      setIsLoginSuccess(true); 
      
      // Mostramos la alerta de bienvenida
      showCustomAlert('Bienvenido 🎉', `Te logueaste como ${auth.currentUser.displayName || 'Usuario'}`);
      
    } catch (error) {
      let errorMessage = "Hubo un problema al iniciar sesión.";
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "El formato del correo electrónico no es válido.";
          break;
        case 'auth/wrong-password':
          errorMessage = "La contraseña es incorrecta.";
          break;
        case 'auth/user-not-found':
          errorMessage = "No se encontró un usuario con este correo.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Error de conexión, por favor intenta más tarde.";
          break;
      }
      // ❌ FALLO: isLoginSuccess sigue siendo false.
      showCustomAlert('Error', errorMessage);
    }
  };
  // ----------------------------------------

  return (
    <ImageBackground source={backgroundImage} style={styles.background} imageStyle={{ opacity: 0.3 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

            {/* HEADER: LOGO + TEXTO */}
            <View style={styles.header}>
              <Image source={require('../assets/Logoestrellanegra.png')} style={styles.logo} />
              <View style={styles.textContainer}>
                <Text style={styles.titlePchela}>Pchelá</Text>
                <Text style={styles.titleUniversal}>Universal Beauty</Text>
              </View>
            </View>

            {/* FORM */}
            <View style={styles.formBlock}>
              <Text style={styles.label}>Correo</Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="envelope" size={20} color="#ccc" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese su correo"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Ingresar</Text>
              </TouchableOpacity>
            </View>

            {/* LINK A REGISTRO */}
            <TouchableOpacity style={styles.loginTextContainer} onPress={() => navigation.navigate('SignUp')}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={styles.noCuentaText}>¿No tienes cuenta aún?</Text>
                <Text style={styles.signUpText}> Regístrate</Text>
              </View>
            </TouchableOpacity>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      
      {/* 🔑 MODIFICACIÓN 3: Lógica de cierre de la alerta */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => {
            setAlertVisible(false); // 1. Cierra la alerta
            
            // 2. Si el login fue exitoso, forzamos la navegación.
            if (isLoginSuccess) {
                // Usamos un pequeño retardo para asegurar que la alerta se haya cerrado visualmente.
                setTimeout(() => {
                    navigation.navigate('Home'); // ¡Línea clave para la redirección!
                }, 200); 
                
                setIsLoginSuccess(false); 
            }
        }}
        buttonText="Aceptar"
      />
    </ImageBackground>
  );
}

// ... (Tu código de estilos permanece igual)
const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', padding: 20 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  header: {
    flexDirection: 'row',       
    alignItems: 'center',       
    marginBottom: 25,
  },
  logo: { width: 80, height: 80, resizeMode: 'contain', marginRight: 5 },
  textContainer: { justifyContent: 'center' },
  titlePchela: { fontSize: 30, fontWeight: 'bold', color: '#D02985', lineHeight: 32 },
  titleUniversal: { fontSize: 20, fontWeight: '500', color: '#555', lineHeight: 22 },
  formBlock: { width: '100%', padding: 20, borderWidth: 2, borderColor: '#D02985', borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, marginBottom: 10 },
  label: { alignSelf: 'flex-start', fontSize: 15, fontWeight: 'bold', marginTop: 10, marginBottom: -10, color: '#333' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25, paddingHorizontal: 15, marginBottom: 15, width: '100%', height: 50,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84,
    elevation: 5, marginTop: 20 },
  icon: { marginRight: 10 },
  input: { flex: 1, height: '100%', fontSize: 16 },
  button: { backgroundColor: '#D02985', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25,
    marginTop: 20, width: '70%', alignItems: 'center', alignSelf: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loginTextContainer: { marginTop: 10, alignItems: 'center' },
  signUpText: { color: '#FF69B4', textAlign: 'center' },
  noCuentaText: { color: '#555', textAlign: 'center' },
});