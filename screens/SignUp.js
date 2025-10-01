import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../src/config/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import CustomAlert from "../components/CustomAlert"; 

const backgroundImage = require('../assets/tijeras.png');

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🔔 Estados para CustomAlert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  // 🧭 ESTADO CLAVE: Controla la navegación tras el éxito
  const [shouldNavigateToLogin, setShouldNavigateToLogin] = useState(false); 

  // ... (Variables de validación de contraseña)
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z\d]/.test(password);
  const hasMinLength = password.length >= 6;
  // ...

  const showCustomAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };
  
  // 🧭 FUNCIÓN CLAVE: Maneja el cierre de la alerta y la navegación
  const handleAlertClose = () => {
    setAlertVisible(false); // Ocultamos la alerta

    if (shouldNavigateToLogin) {
      // Si el registro fue exitoso (shouldNavigateToLogin es true), 
      // limpiamos el estado y navegamos a 'Login'.
      setShouldNavigateToLogin(false); 
      navigation.navigate('Login'); 
    }
    // Si no fue exitoso, simplemente se oculta el alert y el usuario permanece en la pantalla.
  };

  const handleSignUp = async () => {
    // 🧹 Reseteamos el estado de navegación antes de cada intento
    setShouldNavigateToLogin(false); 

    // --- Validaciones de Campos ---
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showCustomAlert("Error", "Todos los campos son obligatorios.");
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showCustomAlert("Error", "Ingrese un correo electrónico válido.");
      return;
    }

    if (password !== confirmPassword) {
      showCustomAlert("Error", "Las contraseñas no coinciden.");
      return;
    }

    // --- Creación de Usuario en Firebase ---
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizamos el perfil con el nombre
      await updateProfile(userCredential.user, { displayName: firstName });
      
      // Importante: Cerramos sesión inmediatamente. 
      // Esto previene que el listener de tu app te mande a Home.
      await signOut(auth);
      
      // ✅ REGISTRO EXITOSO: Configuramos la navegación y mostramos el alert
      setShouldNavigateToLogin(true); // <--- Marcamos para navegar
      showCustomAlert("Registro exitoso", "Usuario registrado con éxito. Ahora inicia sesión.");
    } catch (error) {
      let errorMessage = "Hubo un problema al registrar el usuario.";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "El correo electrónico ya está en uso.";
          break;
        case 'auth/invalid-email':
          errorMessage = "El formato del correo electrónico no es válido.";
          break;
        case 'auth/weak-password':
          errorMessage = "La contraseña es demasiado débil (mínimo 6 caracteres).";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Error de conexión, por favor intenta más tarde.";
          break;
        default:
          console.error("Firebase Error:", error.code);
          break;
      }
      
      // ❌ ERROR: Aseguramos que NO navegue
      setShouldNavigateToLogin(false);
      showCustomAlert("Error", errorMessage);
    }
  };

  // ... (Funciones getPasswordLevel y getPasswordLevelColor)
  const getPasswordLevel = (pass) => {
    const rules = [/[A-Z]/.test(pass), /\d/.test(pass), /[^A-Za-z\d]/.test(pass), pass.length >= 6];
    const passed = rules.filter(Boolean).length;
    if (passed === 4) return "💪 Contraseña Fuerte";
    if (passed >= 2) return "⚡ Contraseña Media";
    return "❌ Contraseña Débil";
  };

  const getPasswordLevelColor = (pass) => {
    const rules = [/[A-Z]/.test(pass), /\d/.test(pass), /[^A-Za-z\d]/.test(pass), pass.length >= 6];
    const passed = rules.filter(Boolean).length;
    if (passed === 4) return "green";
    if (passed >= 2) return "orange";
    return "red";
  };
  // ...

  return (
    <ImageBackground source={backgroundImage} style={styles.background} imageStyle={{ opacity: 0.3 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

            {/* HEADER */}
            <View style={styles.header}>
              <View style={{ flex: 1 }} />
              <Image source={require('../assets/Logoestrellanegra.png')} style={styles.logo} />
              <View style={styles.titleContainer}>
                <Text style={styles.titlePchela}>Pchelá</Text>
                <Text style={styles.titleUniversal}>Universal Beauty</Text>
              </View>
            </View>

            <Text style={styles.screenTitle}>Registrá tu cuenta</Text>

            {/* FORMULARIO */}
            <View style={styles.formBlock}>
              <Text style={styles.label}>Nombre</Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese su nombre"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>

              <Text style={styles.label}>Apellido</Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese su apellido"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>

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
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
                </TouchableOpacity>
              </View>

              {password.length > 0 && (
                <Text style={[styles.passwordStrength, { color: getPasswordLevelColor(password) }]}>
                  {getPasswordLevel(password)}
                </Text>
              )}

              {password.length > 0 && (
                <View style={styles.rules}>
                  <Text style={[styles.ruleText, { color: hasUpperCase ? "green" : "red" }]}>• Al menos una mayúscula</Text>
                  <Text style={[styles.ruleText, { color: hasNumber ? "green" : "red" }]}>• Al menos un número</Text>
                  <Text style={[styles.ruleText, { color: hasSpecial ? "green" : "red" }]}>• Al menos un carácter especial</Text>
                  <Text style={[styles.ruleText, { color: hasMinLength ? "green" : "red" }]}>• Mínimo 6 caracteres</Text>
                </View>
              )}

              <Text style={styles.label}>Confirmar Contraseña</Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirme su contraseña"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={[styles.button, { backgroundColor: "#D02985" }]} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Registrarse</Text>
              </TouchableOpacity>
            </View>

            {/* BOTÓN PARA IR A LOGIN */}
            <TouchableOpacity style={styles.loginTextContainer} onPress={() => navigation.navigate('Login')}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                <Text style={styles.signUpText}>¿Ya tienes cuenta? </Text>
                <Text style={styles.iniciaSesionText}>Inicia sesión</Text>
              </View>
            </TouchableOpacity>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {/* 🔔 CustomAlert */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={handleAlertClose} // 👈 Usamos la función de cierre con lógica de navegación
        buttonText="Aceptar"
      />
    </ImageBackground>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', padding: 20 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 20 },
  logo: { width: 80, height: 80, marginRight: 10 },
  titleContainer: { flexDirection: 'column' },
  titlePchela: { fontSize: 18, fontWeight: 'bold', color: '#D02985' },
  titleUniversal: { fontSize: 14, fontWeight: '500', color: '#555' },
  screenTitle: { fontSize: 20, fontWeight: '700', color: '#D02985', alignSelf: 'center', marginBottom: 10 },
  formBlock: { width: '100%', padding: 20, borderWidth: 2, borderColor: '#D02985', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.85)' },
  label: { alignSelf: 'flex-start', fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 25, paddingHorizontal: 15, marginBottom: 15, width: '100%', height: 50 },
  icon: { marginRight: 10 },
  input: { flex: 1, height: '100%', fontSize: 16 },
  button: { paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25, marginTop: 15, width: '70%', alignItems: 'center', alignSelf: 'center' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  loginTextContainer: { marginTop: 10, alignItems: 'center' },
  signUpText: { color: '#555', textAlign: 'center' },
  iniciaSesionText: { color: '#FF69B4', textAlign: 'center', fontWeight: 'bold' },
  passwordStrength: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginTop: 5 },
  rules: { marginTop: 10 },
  ruleText: { fontSize: 12, fontWeight: '500' },
});