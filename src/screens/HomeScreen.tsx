import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../App';

// ─── IMPORTAMOS EL TEMA ───────────────────────────────────────────────────────
// useTheme nos da acceso a los colores del tema actual y a la función
// toggleTema que alterna entre claro y oscuro desde cualquier pantalla.
import { useTheme } from './ThemeContext';

type HomeNavProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;

// ─── DATOS DE ACCESO RÁPIDO ───────────────────────────────────────────────────
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

// ─── BANCO DE CONSEJOS ────────────────────────────────────────────────────────
// 7 consejos que rotan aleatoriamente cada vez que se abre la app.
// Math.random() selecciona uno diferente en cada apertura.
const tips = [
  '🔦 Mantén tus luces encendidas aunque sea de día.',
  '🧥 Usa chaqueta con protecciones en hombros y codos.',
  '👀 Anticipa los movimientos de otros conductores.',
  '🚦 Respeta siempre los semáforos y señales.',
  '💧 En lluvia, reduce velocidad y aumenta distancia.',
  '⛑️ Nunca salgas sin casco certificado, ni en trayectos cortos.',
  '📱 Nunca uses el celular mientras manejas.',
];

// Se calcula fuera del componente para que no cambie al re-renderizar
const tipDelDia = tips[Math.floor(Math.random() * tips.length)];

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();

  // Obtenemos los colores del tema actual y la función para cambiarlo
  const { colores, temaActual, toggleTema } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colores.fondo }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Botón de cambio de tema ── */}
      {/* Switch que alterna entre modo claro y oscuro.
          El valor true/false depende de si el tema actual es 'claro'. */}
      <View style={[styles.temaRow, { backgroundColor: colores.tarjeta, borderColor: colores.borde }]}>
        <Ionicons
          name={temaActual === 'oscuro' ? 'moon' : 'sunny'}
          size={18}
          color={temaActual === 'oscuro' ? '#4A90E2' : '#F5A623'}
        />
        <Text style={[styles.temaTexto, { color: colores.texto }]}>
          {temaActual === 'oscuro' ? 'Modo Oscuro' : 'Modo Claro'}
        </Text>
        {/* Switch nativo de React Native para alternar el tema */}
        <Switch
          value={temaActual === 'claro'}
          onValueChange={toggleTema}
          trackColor={{ false: '#333', true: '#F5A623' }}
          thumbColor={temaActual === 'claro' ? '#FFF' : '#AAA'}
        />
      </View>

      {/* ── Banner de bienvenida ── */}
      <View style={[styles.banner, { backgroundColor: colores.tarjeta, borderColor: colores.acento }]}>
        <Text style={[styles.bannerTitle, { color: colores.texto }]}>
          ¡Bienvenido, Motociclista! 🏍️
        </Text>
        <Text style={[styles.bannerSubtitle, { color: colores.subtexto }]}>
          Tu seguridad en el camino es nuestra prioridad
        </Text>
      </View>

      {/* ── Consejo del día ── */}
      <View style={[styles.tipCard, { backgroundColor: colores.tarjeta }]}>
        <Text style={styles.tipTitle}>💡 Consejo del día</Text>
        <Text style={[styles.tipText, { color: colores.subtexto }]}>{tipDelDia}</Text>
      </View>

      {/* ── Menú de acceso rápido ── */}
      <Text style={[styles.sectionTitle, { color: colores.texto }]}>Acceso Rápido</Text>
      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuCard, {
              backgroundColor: colores.tarjeta,
              borderLeftColor: item.color,
            }]}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color + '22' }]}>
              <Ionicons name={item.icon} size={28} color={item.color} />
            </View>
            <Text style={[styles.menuTitle, { color: colores.texto }]}>{item.title}</Text>
            <Text style={[styles.menuDescription, { color: colores.subtexto }]}>
              {item.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Estadísticas motivacionales ── */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colores.tarjeta }]}>
          <Text style={styles.statNumber}>70%</Text>
          <Text style={[styles.statLabel, { color: colores.subtexto }]}>
            de accidentes son prevenibles
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colores.tarjeta }]}>
          <Text style={styles.statNumber}>3x</Text>
          <Text style={[styles.statLabel, { color: colores.subtexto }]}>
            más seguro con casco certificado
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colores.subtexto }]}>
          Rodar Seguro v1.0 • Maneja con precaución
        </Text>
      </View>
    </ScrollView>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
// Los colores de fondo y texto se pasan dinámicamente desde el tema,
// aquí solo definimos las propiedades de layout y forma.
const styles = StyleSheet.create({
  container: { flex: 1 },
  temaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 0,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  temaTexto: { 
    flex: 1, 
    fontSize: 14, 
    fontWeight: '600' 
  },
  banner: {
    borderRadius: 16,
    padding: 24,
    margin: 16,
    borderWidth: 1,
  },
  bannerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 6 
  },
  bannerSubtitle: { 
    fontSize: 14, 
    lineHeight: 20 
  },
  tipCard: {
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
    marginBottom: 6 
  },
  tipText: { 
    fontSize: 14, 
    lineHeight: 20 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginHorizontal: 16, 
    marginBottom: 12 
  },
  menuGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingHorizontal: 8, 
    marginBottom: 16 
  },
  menuCard: {
    width: '46%',
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
    fontSize: 14, 
    fontWeight: 'bold', 
    marginBottom: 4 
  },
  menuDescription: { 
    fontSize: 11, 
    lineHeight: 16 
  },
  statsRow: { 
    flexDirection: 'row', 
    paddingHorizontal: 16, 
    gap: 12, 
    marginBottom: 24 
  },
  statCard: { 
    flex: 1, 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center' 
  },
  statNumber: { 
    color: '#E63946', 
    fontSize: 28, 
    fontWeight: 'bold' 
  },
  statLabel: { 
    fontSize: 11, 
    textAlign: 'center', 
    marginTop: 4 
  },
  footer: { 
    alignItems: 'center', 
    paddingBottom: 24 
  },
  footerText: { 
    fontSize: 11 
  },
});