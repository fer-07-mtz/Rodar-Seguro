import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../App';

// Tipo para la navegación de esta pantalla
type HomeNavProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;

// Datos de las tarjetas de acceso rápido
const menuItems = [
  {
    title: 'Test Vial',
    description: 'Pon a prueba tu conocimiento',
    icon: 'clipboard-outline' as const,
    color: '#4A90E2',
    screen: 'Test' as keyof RootTabParamList,
  },
  {
    title: 'Mapa de Riesgo',
    description: 'Zonas peligrosas cerca de ti',
    icon: 'map-outline' as const,
    color: '#F5A623',
    screen: 'Mapa' as keyof RootTabParamList,
  },
  {
    title: 'Equipo de Protección',
    description: 'Guía completa de seguridad',
    icon: 'shield-outline' as const,
    color: '#7ED321',
    screen: 'Equipo' as keyof RootTabParamList,
  },
  {
    title: 'Emergencia SOS',
    description: 'Acceso rápido en caso de accidente',
    icon: 'alert-circle-outline' as const,
    color: '#E63946',
    screen: 'Emergencia' as keyof RootTabParamList,
  },
];

// Datos de consejos del día
const tips = [
  '🔦 Mantén tus luces encendidas aunque sea de día.',
  '🧥 Usa chaqueta con protecciones en hombros y codos.',
  '👀 Anticipa los movimientos de otros conductores.',
  '🚦 Respeta siempre los semáforos y señales.',
  '💧 En lluvia, reduce velocidad y aumenta distancia.',
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner de bienvenida */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>¡Bienvenido, Motociclista! 🏍️</Text>
        <Text style={styles.bannerSubtitle}>
          Tu seguridad en el camino es nuestra prioridad
        </Text>
      </View>

      {/* Consejo del día */}
      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 Consejo del día</Text>
        <Text style={styles.tipText}>
          {tips[new Date().getDay() % tips.length]}
        </Text>
      </View>

      {/* Menú de acceso rápido */}
      <Text style={styles.sectionTitle}>Acceso Rápido</Text>
      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuCard, { borderLeftColor: item.color }]}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color + '22' }]}>
              <Ionicons name={item.icon} size={28} color={item.color} />
            </View>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuDescription}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Estadísticas motivacionales */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>70%</Text>
          <Text style={styles.statLabel}>de accidentes son prevenibles</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3x</Text>
          <Text style={styles.statLabel}>más seguro con casco certificado</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Rodar Seguro v1.0 • Maneja con precaución</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  banner: {
    backgroundColor: '#1A1A2E',
    padding: 24,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E63946',
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  bannerSubtitle: {
    color: '#AAA',
    fontSize: 14,
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: '#1E2A3A',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F5A623',
  },
  tipTitle: {
    color: '#F5A623',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  tipText: {
    color: '#CCC',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  menuCard: {
    width: '46%',
    backgroundColor: '#1A1A2E',
    margin: '2%',
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  menuTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuDescription: {
    color: '#888',
    fontSize: 11,
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    color: '#E63946',
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#AAA',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  footerText: {
    color: '#555',
    fontSize: 11,
  },
});
