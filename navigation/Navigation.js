import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';

// 👇 Tus screens
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';
import Productos from '../screens/Productos';
import EditarProducto from '../screens/EditarProducto';
import PerfilScreen from '../screens/PerfilScreen';

const Stack = createStackNavigator();

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Escuchamos el cambio de estado de Firebase
    const unsubscribe = onAuthStateChanged(auth, user => {
      setTimeout(() => {
        setIsAuthenticated(!!user);
      }, 100);
    });
    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) return null;

  const initialRoute = isAuthenticated ? 'Home' : 'Login';

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        {/* Rutas de Autenticación */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        {/* Rutas de la Aplicación */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Productos" component={Productos} />
        <Stack.Screen name="EditarProducto" component={EditarProducto} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}