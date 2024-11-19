import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth } from '../../config/firebaseConfig';
import ProgressScreen from './ProgressScreen';
import RoutineScreen from './RoutineScreen';
import InjuryScreen from './InjuryScreen';
import SettingsScreen from './SettingsScreen';

const Tab = createBottomTabNavigator();

// Pantalla Principal del Alumno
const StudentHomeScreen = () => {
  const studentId = auth.currentUser?.uid; // Obtén el UID directamente del usuario autenticado.

  if (!studentId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: Usuario no autenticado.</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Inicio') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Progreso') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          if (route.name === 'Rutinas') iconName = focused ? 'barbell' : 'barbell-outline';
          if (route.name === 'Lesiones') iconName = focused ? 'bandage' : 'bandage-outline';
          if (route.name === 'Ajustes') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Inicio" component={StudentHomeScreen} options={{ headerShown: false }} />
      <Tab.Screen
        name="Progreso"
        children={() => <ProgressScreen studentId={studentId} />}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Rutinas"
        children={() => <RoutineScreen studentId={studentId} />}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Lesiones" component={InjuryScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default StudentHomeScreen;
