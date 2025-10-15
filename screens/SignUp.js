import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../src/config/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import CustomAlert from "../components/CustomAlert"; 

const backgroundImage = require('../assets/tijeras.png');

//Formulario
export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //Estados para CustomAlert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  // Control de navegación segun el estado 
  const [shouldNavigateToLogin, setShouldNavigateToLogin] = useState(false); 

  // Estado para mostrar error debajo del campo correo
  const [emailError, setEmailError] = useState("");

  // Variables de validación de contraseña
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasMinLength = password.length >= 6;

  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const showCustomAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };
  
  const handleAlertClose = () => {
    setAlertVisible(false);
    if (shouldNavigateToLogin) {
      setShouldNavigateToLogin(false); 
      navigation.navigate('Login'); 
    }
  };

  const validateEmail = (email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  const handleEmailBlur = () => {
    if (!validateEmail(email)) {
      setEmailError("Formato de correo inválido.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordsMatch(text === confirmPassword);
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    setPasswordsMatch(password === text);
  };

  const handleSignUp = async () => {
    setShouldNavigateToLogin(false); 

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showCustomAlert(" ⚠️ Atención", "Todos los campos son obligatorios.");
      return;
    }
    if (!validateEmail(email)) {
      showCustomAlert(" ⚠️ Atención", "Ingrese un correo electrónico válido. Ejemplo: usuario@example.com");
      return;
    }
    if (password !== confirmPassword) {
      showCustomAlert(" ⚠️ Atención", "Las contraseñas no coinciden.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: firstName });
      await signOut(auth);
      setShouldNavigateToLogin(true);
      showCustomAlert("Registro exitoso", "Inicia sesión.");
    } catch (error) {
      let errorMessage = "Hubo un problema al registrar el usuario, intente nuevamente.";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "El correo electrónico ya está registrado."; break;
        case 'auth/invalid-email':
          errorMessage = "El formato del correo electrónico no es válido."; break;
        case 'auth/weak-password':
          errorMessage = "Mínimo de 6 caracteres en contraseña."; break;
        case 'auth/network-request-failed':
          errorMessage = "Error de conexión, por favor intente más tarde."; break;
        default:
          console.error("Firebase Error:", error.code); break;
      }
      setShouldNavigateToLogin(false);
      showCustomAlert(" ⚠️ Atención", errorMessage);
    }
  };

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
              {/* Botón de volver atrás a la izquierda */}
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
              >
                <FontAwesome name="arrow-left" size={24} color="#D02985" />
              </TouchableOpacity>

              {/* Logo y texto centrados */}
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
                  onChangeText={(text) => {
                    const onlyLetters = text.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
                    setFirstName(onlyLetters);
                  }}
                />
              </View>

              <Text style={styles.label}>Apellido</Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese su apellido"
                  value={lastName}
                  onChangeText={(text) => {
                    const onlyLetters = text.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
                    setLastName(onlyLetters);
                  }}
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
                  onBlur={handleEmailBlur}
                />
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                  onFocus={() => setShowPasswordRequirements(true)}
                  onBlur={() => {
                    if (password === "") setShowPasswordRequirements(false);
                  }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
                </TouchableOpacity>
              </View>

              {showPasswordRequirements && (
                <View style={styles.rules}>
                   <Text style={{ fontSize: 13, fontWeight: "bold", color: "#555", marginBottom: 5 }}>
                      La contraseña debe estar conformada por:
                   </Text>
                   <Text style={[styles.ruleText, { color: hasMinLength ? "green" : "gray" }]}>• Mínimo 6 caracteres</Text>
                   <Text style={[styles.ruleText, { color: hasUpperCase ? "green" : "gray" }]}>• Al menos una mayúscula</Text>
                   <Text style={[styles.ruleText, { color: hasLowerCase ? "green" : "gray" }]}>• Al menos una minúscula</Text>
                   <Text style={[styles.ruleText, { color: hasNumber ? "green" : "gray" }]}>• Al menos un número</Text>
                </View>
              )}  

              <Text style={styles.label}>Confirmar Contraseña</Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirme su contraseña"
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
                </TouchableOpacity>
              </View>

              {confirmPassword.length > 0 && (
                <Text style={{ color: passwordsMatch ? "green" : "red", fontWeight: "bold", marginTop: 5 }}>
                  {passwordsMatch ? "✔ Las contraseñas coinciden" : "✘ Las contraseñas no coinciden"}
                </Text>
              )}

              <TouchableOpacity style={[styles.button, { backgroundColor: "#D02985" }]} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Registrarse</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginTextContainer} onPress={() => navigation.navigate('Login')}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                <Text style={styles.signUpText}>¿Ya tenés cuenta? </Text>
                <Text style={styles.iniciaSesionText}>Inicia sesión</Text>
              </View>
            </TouchableOpacity>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={handleAlertClose}
        buttonText="Aceptar"
      />
    </ImageBackground>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', padding: 20 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20 },
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: -10,
    left: -30,
    paddingHorizontal: 10,
    paddingVertical: 10,
    zIndex: 2,
  },
  logo: {
    width: 80,
    height: 80, 
    marginRight: 10 },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  titlePchela: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#D02985' 
  },
  titleUniversal: { 
    fontSize: 14, 
    fontWeight: '500', 
    color: '#555' 
  },
  screenTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#D02985', 
    lignSelf: 'center', 
    marginBottom: 10 
  },
  formBlock: { 
    width: '100%', 
    padding: 20, 
    borderWidth: 2, 
    borderColor: '#D02985', 
    borderRadius: 8, 
    backgroundColor: 'rgba(255,255,255,0.85)' 
  },
  label: { 
    alignSelf: 'flex-start', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginTop: 10, 
    marginBottom: 5 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    marginBottom: 15, 
    width: '100%', 
    height: 50 
  },
  icon: { 
    marginRight: 10 
  },
  input: { 
    flex: 1, 
    height: '100%', 
    fontSize: 16 
  },
  button: { 
    paddingVertical: 12, 
    paddingHorizontal: 40, 
    borderRadius: 25, 
    marginTop: 15, 
    width: '70%', 
    alignItems: 'center', 
    alignSelf: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 15, 
    fontWeight: 'bold' 
  },
  loginTextContainer: { 
    marginTop: 10, 
    lignItems: 'center' 
  },
  signUpText: {
    color: '#555', 
    textAlign: 'center' 
  },
  iniciaSesionText: { 
    color: '#FF69B4', 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
  rules: { 
    marginTop: 10 
  },
  ruleText: { 
    fontSize: 12, 
    fontWeight: '500' 
  },
  errorText: { 
    color: "red", 
    fontSize: 13, 
    marginTop: -10, 
    marginBottom: 10, 
    alignSelf: "flex-start" 
  },
});