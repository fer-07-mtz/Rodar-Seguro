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

// ─── IMPORTAMOS EL TEMA ───────────────────────────────────────────────────────
// ThemeProvider es el componente que envuelve toda la app y comparte
// el tema (claro/oscuro) con todas las pantallas mediante Context API.
import { ThemeProvider, useTheme } from './src/screens/ThemeContext';

export type RootTabParamList = {
  Home: undefined;
  Test: undefined;
  Mapa: undefined;
  Equipo: undefined;
  Emergencia: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// ─── NAVEGACIÓN CON TEMA ──────────────────────────────────────────────────────
// Separamos la navegación en un componente propio para poder usar
// useTheme() dentro de ThemeProvider (no se puede usar en el mismo nivel).
function AppNavegacion() {
  // Obtenemos los colores del tema actual para aplicarlos a la barra de tabs
  const { colores } = useTheme();

  return (
    <NavigationContainer>
      <StatusBar style={colores.fondo === '#0F0F1A' ? 'light' : 'dark'} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
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
          // Los colores de la barra de tabs cambian según el tema activo
          tabBarActiveTintColor: colores.acento,
          tabBarInactiveTintColor: colores.subtexto,
          tabBarStyle: {
            backgroundColor: colores.tabBar,
            borderTopColor: colores.borde,
            height: 65,
            paddingBottom: 8,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          headerStyle: { backgroundColor: colores.tabBar },
          headerTintColor: colores.texto,
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio', headerTitle: '🏍️ Rodar Seguro' }} />
        <Tab.Screen name="Test" component={TestScreen} options={{ title: 'Test', headerTitle: '📋 Test Vial' }} />
        <Tab.Screen name="Mapa" component={MapScreen} options={{ title: 'Mapa', headerTitle: '🗺️ Puntos de Riesgo' }} />
        <Tab.Screen name="Equipo" component={EquipmentScreen} options={{ title: 'Equipo', headerTitle: '🛡️ Equipo de Protección' }} />
        <Tab.Screen name="Emergencia" component={EmergencyScreen} options={{ title: 'SOS', headerTitle: '🚨 Emergencia' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ─── COMPONENTE RAÍZ ──────────────────────────────────────────────────────────
// ThemeProvider envuelve toda la app para que el tema esté disponible
// en todas las pantallas desde cualquier nivel del árbol de componentes.
export default function App() {
  return (
    <ThemeProvider>
      <AppNavegacion />
    </ThemeProvider>
  );
}