import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Tipo para cada punto de riesgo
type PuntoRiesgo = {
  id: number;
  nombre: string;
  tipo: 'alto' | 'medio' | 'bajo';
  descripcion: string;
  icono: string;
  // Posición relativa para la vista simulada del mapa (en porcentaje)
  x: number;
  y: number;
};

// Lista de puntos de riesgo simulados
const puntosDeRiesgo: PuntoRiesgo[] = [
  {
    id: 1,
    nombre: 'Cruce sin semáforo - Av. Principal',
    tipo: 'alto',
    descripcion: 'Intersección de alta peligrosidad. Visibilidad reducida por vegetación. Múltiples accidentes reportados.',
    icono: '⚠️',
    x: 30,
    y: 25,
  },
  {
    id: 2,
    nombre: 'Curva peligrosa - Libramiento Norte',
    tipo: 'alto',
    descripcion: 'Curva cerrada con pavimento deteriorado. Alta incidencia de accidentes por exceso de velocidad.',
    icono: '🚨',
    x: 70,
    y: 40,
  },
  {
    id: 3,
    nombre: 'Zona escolar - Calle Reforma',
    tipo: 'medio',
    descripcion: 'Área con alto flujo de peatones en horario escolar (7-9am y 1-3pm). Velocidad máxima: 30 km/h.',
    icono: '🏫',
    x: 50,
    y: 60,
  },
  {
    id: 4,
    nombre: 'Bache - Blvd. Central km 3',
    tipo: 'medio',
    descripcion: 'Zona con pavimento en mal estado. Riesgo de pérdida de control a velocidades altas.',
    icono: '🕳️',
    x: 20,
    y: 70,
  },
  {
    id: 5,
    nombre: 'Tope sin señalizar - Col. Morelos',
    tipo: 'bajo',
    descripcion: 'Reductor de velocidad mal señalizado. Puede sorprender al conductor desprevenido.',
    icono: '🛑',
    x: 80,
    y: 75,
  },
];

// Colores según el nivel de riesgo
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

export default function MapScreen() {
  // Estado del punto de riesgo seleccionado
  const [seleccionado, setSeleccionado] = useState<PuntoRiesgo | null>(null);
  // Estado del filtro de tipo de riesgo
  const [filtro, setFiltro] = useState<'todos' | 'alto' | 'medio' | 'bajo'>('todos');

  // Filtramos los puntos según el filtro activo
  const puntosFiltrados = puntosDeRiesgo.filter(
    (p) => filtro === 'todos' || p.tipo === filtro
  );

  const handlePuntoPress = (punto: PuntoRiesgo) => {
    setSeleccionado(punto);
  };

  return (
    <View style={styles.container}>
      {/* Nota informativa */}
      <View style={styles.notaBanner}>
        <Ionicons name="information-circle" size={16} color="#4A90E2" />
        <Text style={styles.notaTexto}>
          Mapa simulado — En producción se integraría Google Maps
        </Text>
      </View>

      {/* Filtros */}
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
              filtro === tipo && styles.filtroActivo,
              tipo !== 'todos' && filtro === tipo && { borderColor: colorPorTipo[tipo] },
            ]}
            onPress={() => setFiltro(tipo)}
          >
            <Text
              style={[
                styles.filtroTexto,
                filtro === tipo && styles.filtroTextoActivo,
              ]}
            >
              {tipo === 'todos' ? 'Todos' : etiquetaPorTipo[tipo]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Mapa simulado */}
      <View style={styles.mapaContainer}>
        {/* Fondo del mapa simulado (grilla de calles) */}
        <View style={styles.mapa}>
          {/* Líneas de "calles" simuladas */}
          <View style={[styles.calle, { top: '33%', left: 0, right: 0, height: 3 }]} />
          <View style={[styles.calle, { top: '66%', left: 0, right: 0, height: 3 }]} />
          <View style={[styles.calle, { left: '33%', top: 0, bottom: 0, width: 3 }]} />
          <View style={[styles.calle, { left: '66%', top: 0, bottom: 0, width: 3 }]} />

          <Text style={styles.mapaTitulo}>🗺️ Ciudad</Text>

          {/* Puntos de riesgo en el mapa */}
          {puntosFiltrados.map((punto) => (
            <TouchableOpacity
              key={punto.id}
              style={[
                styles.marcador,
                {
                  left: `${punto.x}%`,
                  top: `${punto.y}%`,
                  borderColor: colorPorTipo[punto.tipo],
                },
                seleccionado?.id === punto.id && styles.marcadorSeleccionado,
              ]}
              onPress={() => handlePuntoPress(punto)}
            >
              <Text style={styles.marcadorIcono}>{punto.icono}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tarjeta de detalle del punto seleccionado */}
      {seleccionado && (
        <View style={styles.detalleCard}>
          <View style={styles.detalleHeader}>
            <View style={[styles.badge, { backgroundColor: colorPorTipo[seleccionado.tipo] + '33', borderColor: colorPorTipo[seleccionado.tipo] }]}>
              <Text style={[styles.badgeTexto, { color: colorPorTipo[seleccionado.tipo] }]}>
                {etiquetaPorTipo[seleccionado.tipo]}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSeleccionado(null)}>
              <Ionicons name="close-circle" size={24} color="#888" />
            </TouchableOpacity>
          </View>
          <Text style={styles.detalleTitulo}>
            {seleccionado.icono} {seleccionado.nombre}
          </Text>
          <Text style={styles.detalleDescripcion}>{seleccionado.descripcion}</Text>
        </View>
      )}

      {/* Lista de puntos */}
      <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
        <Text style={styles.listaTitulo}>
          {puntosFiltrados.length} punto(s) encontrado(s)
        </Text>
        {puntosFiltrados.map((punto) => (
          <TouchableOpacity
            key={punto.id}
            style={[
              styles.listaItem,
              seleccionado?.id === punto.id && { borderColor: colorPorTipo[punto.tipo] },
            ]}
            onPress={() => handlePuntoPress(punto)}
          >
            <Text style={styles.listaIcono}>{punto.icono}</Text>
            <View style={styles.listaInfo}>
              <Text style={styles.listaNombre}>{punto.nombre}</Text>
              <View style={[styles.badge, { backgroundColor: colorPorTipo[punto.tipo] + '22', borderColor: colorPorTipo[punto.tipo] }]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  notaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2A3A',
    padding: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  notaTexto: {
    color: '#4A90E2',
    fontSize: 12,
  },
  filtrosScroll: {
    maxHeight: 50,
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
    borderColor: '#444',
    backgroundColor: '#1A1A2E',
  },
  filtroActivo: {
    backgroundColor: '#2A2A4E',
    borderColor: '#4A90E2',
  },
  filtroTexto: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  filtroTextoActivo: {
    color: '#FFF',
  },
  mapaContainer: {
    height: 200,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  mapa: {
    flex: 1,
    backgroundColor: '#1C2833',
    position: 'relative',
  },
  calle: {
    position: 'absolute',
    backgroundColor: '#2E4057',
  },
  mapaTitulo: {
    position: 'absolute',
    top: 8,
    left: 12,
    color: '#AAA',
    fontSize: 12,
    fontWeight: 'bold',
  },
  marcador: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1A2E',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -18,
    marginTop: -18,
  },
  marcadorSeleccionado: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: -22,
    marginTop: -22,
    elevation: 5,
  },
  marcadorIcono: {
    fontSize: 16,
  },
  detalleCard: {
    backgroundColor: '#1A1A2E',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 12,
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
    fontWeight: 'bold',
  },
  detalleTitulo: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6,
  },
  detalleDescripcion: {
    color: '#AAA',
    fontSize: 12,
    lineHeight: 18,
  },
  lista: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listaTitulo: {
    color: '#888',
    fontSize: 12,
    marginBottom: 10,
  },
  listaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
    gap: 12,
  },
  listaIcono: {
    fontSize: 24,
  },
  listaInfo: {
    flex: 1,
    gap: 6,
  },
  listaNombre: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
