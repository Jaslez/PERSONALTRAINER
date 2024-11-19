import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth, db } from './config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { ActivityIndicator, View, Text, StyleSheet, Alert } from 'react-native';

// Pantallas del Administrador Master
import AdminMasterTabNavigator from './screens/AdminMaster/MasterDashboardScreen';
import AssignTrainerScreen from './screens/AdminMaster/AssignTrainerScreen';
import RegisterTrainerScreen from './screens/AdminMaster/RegisterTrainerScreen';

// Pantallas del Entrenador
import TrainerDashboardScreen from './screens/Trainer/TrainerDashboardScreen';
import ManageRoutinesScreen from './screens/Trainer/ManageRoutinesScreen';
import RecordInjuriesScreen from './screens/Trainer/RecordInjuriesScreen';

// Pantallas del Alumno
import StudentHomeScreen from './screens/Student/StudentHomeScreen';

// Pantallas Comunes
import LoginScreen from './screens/Common/LoginScreen';
import RegisterScreen from './screens/Common/RegisterScreen';

const Stack = createStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (userDoc.exists()) {
            setUser(user);
            setRole(userDoc.data().role);
          } else {
            Alert.alert('Error', 'No se encontró el documento del usuario.');
          }
        } catch (error) {
          console.error('Error al obtener el rol del usuario:', error);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerTitle: 'Registro' }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {role === 'adminmaster' && (
          <Stack.Screen
            name="AdminMasterNavigator"
            component={AdminMasterTabNavigator}
            options={{ headerShown: false }}
          />
        )}
        {role === 'entrenador' && (
          <Stack.Screen
            name="TrainerNavigator"
            component={TrainerDashboardScreen}
            initialParams={{ trainerId: user.uid }}
            options={{ headerShown: false }}
          />
        )}
        {role === 'alumno' && (
          <Stack.Screen
            name="StudentHomeScreen"
            component={StudentHomeScreen} // Eliminamos el uso de children
            options={{ headerShown: false }}
          />
        )}

        {!['adminmaster', 'entrenador', 'alumno'].includes(role) && (
          <Stack.Screen name="Error" component={() => <Text>Rol desconocido</Text>} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
});
