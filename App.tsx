import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import TestScreen from './src/screens/TestScreen';
import MapScreen from './src/screens/MapScreen';
import EquipmentScreen from './src/screens/EquipmentScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';

// Definimos el tipo de las rutas del Tab Navigator
export type RootTabParamList = {
  Home: undefined;
  Test: undefined;
  Mapa: undefined;
  Equipo: undefined;
  Emergencia: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // Función que decide qué ícono mostrar en cada tab
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Test') {
              iconName = focused ? 'clipboard' : 'clipboard-outline';
            } else if (route.name === 'Mapa') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'Equipo') {
              iconName = focused ? 'shield' : 'shield-outline';
            } else if (route.name === 'Emergencia') {
              iconName = focused ? 'alert-circle' : 'alert-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#E63946',   // Rojo para tab activo
          tabBarInactiveTintColor: '#888',     // Gris para inactivo
          tabBarStyle: {
            backgroundColor: '#1A1A2E',        // Fondo oscuro
            borderTopColor: '#333',
            height: 65,
            paddingBottom: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: '#1A1A2E',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Inicio', headerTitle: '🏍️ Rodar Seguro' }}
        />
        <Tab.Screen
          name="Test"
          component={TestScreen}
          options={{ title: 'Test', headerTitle: '📋 Test Vial' }}
        />
        <Tab.Screen
          name="Mapa"
          component={MapScreen}
          options={{ title: 'Mapa', headerTitle: '🗺️ Puntos de Riesgo' }}
        />
        <Tab.Screen
          name="Equipo"
          component={EquipmentScreen}
          options={{ title: 'Equipo', headerTitle: '🛡️ Equipo de Protección' }}
        />
        <Tab.Screen
          name="Emergencia"
          component={EmergencyScreen}
          options={{ title: 'SOS', headerTitle: '🚨 Emergencia' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
