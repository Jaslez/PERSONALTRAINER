import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ManageRoutinesScreen from './ManageRoutinesScreen';
import RecordInjuriesScreen from './RecordInjuriesScreen';
import SettingsScreen from '../Student/SettingsScreen'; // Pantalla compartida de ajustes

const Tab = createBottomTabNavigator();

const TrainerDashboardScreen = ({ route }) => {
  // Obtén el ID del entrenador a través de las props
  const { trainerId } = route.params;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Rutinas') {
            iconName = focused ? 'create' : 'create-outline';
          } else if (route.name === 'Lesiones') {
            iconName = focused ? 'medkit' : 'medkit-outline';
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
      <Tab.Screen
        name="Rutinas"
        component={ManageRoutinesScreen}
        initialParams={{ trainerId }}
        options={{ headerTitle: 'Gestión de Rutinas' }}
      />
      <Tab.Screen
        name="Lesiones"
        component={RecordInjuriesScreen}
        initialParams={{ trainerId }}
        options={{ headerTitle: 'Registro de Lesiones' }}
      />
      <Tab.Screen
        name="Ajustes"
        component={SettingsScreen}
        options={{ headerTitle: 'Configuración' }}
      />
    </Tab.Navigator>
  );
};

export default TrainerDashboardScreen;
