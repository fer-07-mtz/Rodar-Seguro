import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import MapView, { Marker, UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

const { width } = Dimensions.get('window');

// ─── TIPOS ────────────────────────────────────────────────────────────────────
type PuntoRiesgo = {
  id: number;
  nombre: string;
  tipo: 'alto' | 'medio' | 'bajo';
  descripcion: string;
  icono: string;
  // Coordenadas reales de Alfajayucan, Hidalgo
  latitud: number;
  longitud: number;
};

// ─── PUNTOS DE RIESGO ─────────────────────────────────────────────────────────
// Coordenadas aproximadas de puntos de riesgo en Alfajayucan, Hidalgo.
// El centro del municipio está en lat: 20.4167, lng: -99.2167
const puntosDeRiesgo: PuntoRiesgo[] = [
  {
    id: 1,
    nombre: 'Cruce sin semáforo - Av. Principal',
    tipo: 'alto',
    descripcion: 'Intersección de alta peligrosidad. Visibilidad reducida por vegetación.',
    icono: '⚠️',
    latitud: 20.4180,
    longitud: -99.2150,
  },
  {
    id: 2,
    nombre: 'Curva peligrosa - Libramiento Norte',
    tipo: 'alto',
    descripcion: 'Curva cerrada con pavimento deteriorado. Alta incidencia de accidentes.',
    icono: '🚨',
    latitud: 20.4210,
    longitud: -99.2190,
  },
  {
    id: 3,
    nombre: 'Zona escolar - Calle Reforma',
    tipo: 'medio',
    descripcion: 'Área con alto flujo de peatones en horario escolar (7-9am y 1-3pm).',
    icono: '🏫',
    latitud: 20.4160,
    longitud: -99.2170,
  },
  {
    id: 4,
    nombre: 'Bache - Blvd. Central km 3',
    tipo: 'medio',
    descripcion: 'Zona con pavimento en mal estado. Riesgo de pérdida de control.',
    icono: '🕳️',
    latitud: 20.4140,
    longitud: -99.2200,
  },
  {
    id: 5,
    nombre: 'Tope sin señalizar - Col. Morelos',
    tipo: 'bajo',
    descripcion: 'Reductor de velocidad mal señalizado.',
    icono: '🛑',
    latitud: 20.4195,
    longitud: -99.2130,
  },
];

// ─── COLORES Y ETIQUETAS POR NIVEL ────────────────────────────────────────────
const colorPorTipo = {
  alto: '#E63946',
  medio: '#F5A623',
  bajo: '#7ED321',
};

const etiquetaPorTipo = {
  alto: 'Riesgo Alto',
  medio: 'Riesgo Medio',
  bajo: 'Riesgo Bajo',
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function MapScreen() {
  const { colores } = useTheme();
  const [seleccionado, setSeleccionado] = useState<PuntoRiesgo | null>(null);
  const [filtro, setFiltro] = useState<'todos' | 'alto' | 'medio' | 'bajo'>('todos');

  // Filtramos los puntos según el filtro activo
  const puntosFiltrados = puntosDeRiesgo.filter(
    (p) => filtro === 'todos' || p.tipo === filtro
  );

  // Región inicial del mapa centrada en Alfajayucan, Hidalgo
  const regionInicial = {
    latitude: 20.4167,
    longitude: -99.2167,
    latitudeDelta: 0.02,   // Zoom — número más pequeño = más zoom
    longitudeDelta: 0.02,
  };

  return (
    <View style={[styles.container, { backgroundColor: colores.fondo }]}>

      {/* ── Filtros ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosScroll}
        contentContainerStyle={styles.filtrosContainer}
      >
        {(['todos', 'alto', 'medio', 'bajo'] as const).map((tipo) => (
          <TouchableOpacity
            key={tipo}
            style={[
              styles.filtroBoton,
              { backgroundColor: colores.tarjeta, borderColor: colores.borde },
              filtro === tipo && styles.filtroActivo,
              tipo !== 'todos' && filtro === tipo && { borderColor: colorPorTipo[tipo] },
            ]}
            onPress={() => setFiltro(tipo)}
          >
            <Text style={[
              styles.filtroTexto,
              filtro === tipo && styles.filtroTextoActivo,
              { color: filtro === tipo ? '#FFF' : colores.subtexto }
            ]}>
              {tipo === 'todos' ? 'Todos' : etiquetaPorTipo[tipo]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Mapa real con OpenStreetMap ── */}
      {/* MapView renderiza el mapa usando react-native-maps.
          UrlTile carga los tiles de OpenStreetMap que son completamente gratuitos
          y no requieren API Key ni tarjeta de crédito. */}
      <MapView
        style={styles.mapa}
        provider={PROVIDER_DEFAULT}
        initialRegion={regionInicial}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Tiles de OpenStreetMap — mapa gratuito sin API Key */}
        <UrlTile
          urlTemplate="https://tile.opentopomap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />

        {/* Marcadores de puntos de riesgo filtrados */}
        {puntosFiltrados.map((punto) => (
          <Marker
            key={punto.id}
            coordinate={{
              latitude: punto.latitud,
              longitude: punto.longitud,
            }}
            title={punto.nombre}
            description={punto.descripcion}
            onPress={() => setSeleccionado(punto)}
          >
            {/* Marcador personalizado con el emoji y color del nivel de riesgo */}
            <View style={[
              styles.marcador,
              { borderColor: colorPorTipo[punto.tipo] }
            ]}>
              <Text style={styles.marcadorIcono}>{punto.icono}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* ── Detalle del punto seleccionado ── */}
      {seleccionado && (
        <View style={[styles.detalleCard, { backgroundColor: colores.tarjeta, borderColor: colores.borde }]}>
          <View style={styles.detalleHeader}>
            <View style={[styles.badge, {
              backgroundColor: colorPorTipo[seleccionado.tipo] + '33',
              borderColor: colorPorTipo[seleccionado.tipo]
            }]}>
              <Text style={[styles.badgeTexto, { color: colorPorTipo[seleccionado.tipo] }]}>
                {etiquetaPorTipo[seleccionado.tipo]}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSeleccionado(null)}>
              <Ionicons name="close-circle" size={24} color="#888" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.detalleTitulo, { color: colores.texto }]}>
            {seleccionado.icono} {seleccionado.nombre}
          </Text>
          <Text style={[styles.detalleDescripcion, { color: colores.subtexto }]}>
            {seleccionado.descripcion}
          </Text>
        </View>
      )}

      {/* ── Lista de puntos ── */}
      <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
        <Text style={[styles.listaTitulo, { color: colores.subtexto }]}>
          {puntosFiltrados.length} punto(s) encontrado(s)
        </Text>
        {puntosFiltrados.map((punto) => (
          <TouchableOpacity
            key={punto.id}
            style={[
              styles.listaItem,
              { backgroundColor: colores.tarjeta, borderColor: colores.borde },
              seleccionado?.id === punto.id && { borderColor: colorPorTipo[punto.tipo] },
            ]}
            onPress={() => setSeleccionado(punto)}
          >
            <Text style={styles.listaIcono}>{punto.icono}</Text>
            <View style={styles.listaInfo}>
              <Text style={[styles.listaNombre, { color: colores.texto }]}>{punto.nombre}</Text>
              <View style={[styles.badge, {
                backgroundColor: colorPorTipo[punto.tipo] + '22',
                borderColor: colorPorTipo[punto.tipo]
              }]}>
                <Text style={[styles.badgeTexto, { color: colorPorTipo[punto.tipo] }]}>
                  {etiquetaPorTipo[punto.tipo]}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  filtrosScroll: { 
    maxHeight: 50 
  },
  filtrosContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
  },
  filtroBoton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filtroActivo: { 
    backgroundColor: '#2A2A4E' 
  },
  filtroTexto: { 
    fontSize: 12, 
    fontWeight: '600' 
  },
  filtroTextoActivo: { 
    color: '#FFF' 
  },
  // El mapa ocupa el 40% de la pantalla
  mapa: { 
    height: Dimensions.get('window').height * 0.4 
  },
  marcador: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1A2E',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marcadorIcono: { 
    fontSize: 16 
  },
  detalleCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  detalleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeTexto: { 
    fontSize: 11, 
    fontWeight: 'bold' 
  },
  detalleTitulo: { 
    fontWeight: 'bold', 
    fontSize: 14, 
    marginBottom: 6 
  },
  detalleDescripcion: { 
    fontSize: 12, 
    lineHeight: 18 
  },
  lista: { 
    flex: 1, 
    paddingHorizontal: 16 
  },
  listaTitulo: { 
    fontSize: 12, 
    marginBottom: 10, 
    marginTop: 4 
  },
  listaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    gap: 12,
  },
  listaIcono: { 
    fontSize: 24 
  },
  listaInfo: { 
    flex: 1, 
    gap: 6 
  },
  listaNombre: { 
    fontSize: 13, 
    fontWeight: '600' 
  },
});
