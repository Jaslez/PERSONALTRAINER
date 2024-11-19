import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RegisterTrainerScreen from './RegisterTrainerScreen'; // Pantalla para registrar entrenador
import AssignTrainerScreen from './AssignTrainerScreen'; // Pantalla para asignar alumnos a entrenador
import SettingsScreen from '../Student/SettingsScreen'; // Pantalla compartida de ajustes

// Crear el Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Definir la pantalla MasterDashboardScreen
const MasterDashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido al Panel de Administración</Text>
      <Text style={styles.description}>
        Aquí puedes gestionar los entrenadores y alumnos de la aplicación. Utiliza las opciones en la parte inferior para acceder a las funciones de registro y asignación.
      </Text>
      <Ionicons name="settings-outline" size={80} color="#FF6347" style={styles.icon} />
    </View>
  );
};

// Definir la navegación por pestañas para el Administrador Master
const AdminMasterTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Registrar Entrenador') {
            iconName = focused ? 'person-add' : 'person-add-outline';
          } else if (route.name === 'Asignar Alumno') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Ajustes') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6347',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: 'transparent',
          elevation: 10,
          shadowOpacity: 0.25,
        },
        headerShown: false,
      })}
    >
      {/* Usar MasterDashboardScreen como la pantalla de inicio */}
      <Tab.Screen name="Inicio" component={MasterDashboardScreen} />
      <Tab.Screen name="Registrar Entrenador" component={RegisterTrainerScreen} />
      <Tab.Screen name="Asignar Alumno" component={AssignTrainerScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default AdminMasterTabNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
    color: '#FF6347',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginBottom: 40,
  },
  icon: {
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
