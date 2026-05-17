import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// ─── IMPORTAMOS EL TEMA ───────────────────────────────────────────────────────
// useTheme nos da acceso a los colores del tema actual desde el contexto global
import { useTheme } from './ThemeContext';

// Tipo para cada pieza de equipo
type Equipo = {
  id: number;
  nombre: string;
  emoji: string;
  nivel: 'Esencial' | 'Recomendado' | 'Opcional';
  descripcion: string;
  caracteristicas: string[];
  consejo: string;
};

// Guía completa de equipo de protección
const equipoList: Equipo[] = [
  {
    id: 1,
    nombre: 'Casco Certificado',
    emoji: '⛑️',
    nivel: 'Esencial',
    descripcion:
      'El casco es la pieza más importante del equipo. Reduce el riesgo de muerte en accidente hasta en un 42% y las lesiones cerebrales en un 69%.',
    caracteristicas: [
      'Certificación DOT, ECE 22.06 o NOM',
      'Ajuste firme sin presión excesiva',
      'Visera anti-rayaduras o antiempañante',
      'Ventilación adecuada',
      'Reponer cada 5 años o tras un impacto',
    ],
    consejo: '💡 Nunca compres un casco de segunda mano — puede tener daños internos invisibles.',
  },
  {
    id: 2,
    nombre: 'Chaqueta con Protecciones',
    emoji: '🧥',
    nivel: 'Esencial',
    descripcion:
      'Una chaqueta de motociclista ofrece protección contra la abrasión y el impacto en caída. Elige materiales como cuero o textil técnico resistente.',
    caracteristicas: [
      'Protecciones CE Nivel 2 en codos y hombros',
      'Espaldera rígida o semirrígida',
      'Material resistente a la abrasión',
      'Visibilidad con reflejantes',
      'Ventilación para climas cálidos',
    ],
    consejo: '💡 En México el calor es factor, busca chaquetas textiles con ventilación tipo malla.',
  },
  {
    id: 3,
    nombre: 'Guantes de Motociclismo',
    emoji: '🧤',
    nivel: 'Esencial',
    descripcion:
      'Las manos son lo primero que extendemos al caer. Los guantes protegen las palmas, nudillos y muñecas de fracturas y rozaduras graves.',
    caracteristicas: [
      'Refuerzo en palmas y nudillos',
      'Protección en muñeca',
      'Material resistente a la abrasión',
      'Agarre antideslizante',
      'Compatibles con pantallas táctiles',
    ],
    consejo: '💡 Nunca salgas sin guantes, incluso en trayectos cortos. Un desliz puede arruinar tus manos.',
  },
  {
    id: 4,
    nombre: 'Botas de Motociclismo',
    emoji: '👢',
    nivel: 'Esencial',
    descripcion:
      'Los tobillos y pies son vulnerables en accidentes. Las botas ofrecen soporte, protección al impacto y grip en el pavimento.',
    caracteristicas: [
      'Altura que cubra el tobillo',
      'Protección en maléolos',
      'Suela antideslizante',
      'Material rígido en puntera',
      'Cierre seguro (velcro, broches o cordones)',
    ],
    consejo: '💡 Evita botas de work o deportivas comunes: no ofrecen la misma protección lateral.',
  },
  {
    id: 5,
    nombre: 'Pantalón de Motociclista',
    emoji: '👖',
    nivel: 'Recomendado',
    descripcion:
      'Los pantalones de moto tienen protecciones en rodillas y caderas. Pueden ser de cuero, textil o incluso jeans con kevlar integrado.',
    caracteristicas: [
      'Protecciones en rodillas y caderas',
      'Material resistente a la abrasión',
      'Diseño ergonómico para postura en moto',
      'Versiones impermeables disponibles',
    ],
    consejo: '💡 Los pantalones con kevlar integrado lucen normales pero ofrecen protección real.',
  },
  {
    id: 6,
    nombre: 'Chaleco Reflectante',
    emoji: '🦺',
    nivel: 'Recomendado',
    descripcion:
      'Aumenta tu visibilidad ante otros conductores, especialmente de noche o con lluvia. Es económico y puede salvar tu vida.',
    caracteristicas: [
      'Bandas reflectantes en 360°',
      'Se coloca sobre cualquier chaqueta',
      'Ligero y portable',
      'Colores de alta visibilidad (amarillo, naranja)',
    ],
    consejo: '💡 De noche eres invisible para otros conductores. El chaleco puede marcar la diferencia.',
  },
  {
    id: 7,
    nombre: 'Intercomunicador / Auriculares',
    emoji: '🎧',
    nivel: 'Opcional',
    descripcion:
      'Permite escuchar el GPS o comunicarse con otros motociclistas sin distraerse. Mejora la experiencia sin sacrificar atención.',
    caracteristicas: [
      'Compatible con casco integral o modular',
      'Bluetooth de largo alcance',
      'Cancelación de ruido del viento',
      'Control por voz disponible',
    ],
    consejo: '💡 Nunca uses auriculares convencionales: bloquean sonidos importantes del entorno.',
  },
];

// Colores por nivel de importancia
const colorPorNivel = {
  Esencial: '#E63946',
  Recomendado: '#F5A623',
  Opcional: '#4A90E2',
};

export default function EquipmentScreen() {
  // Obtenemos los colores del tema activo para aplicarlos a esta pantalla
  const { colores } = useTheme();
  const [expandido, setExpandido] = useState<number | null>(null);

  const toggleExpandido = (id: number) => {
    setExpandido(expandido === id ? null : id);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colores.fondo }]} showsVerticalScrollIndicator={false}>
      {/* Encabezado */}
      <View style={[styles.header, { backgroundColor: colores.tarjeta }]}>
        <Text style={[styles.headerTitulo, { color: colores.texto }]}>Equipo de Protección</Text>
        <Text style={[styles.headerSubtitulo, { color: colores.subtexto }]}>
          El equipo adecuado puede ser la diferencia entre sobrevivir y no hacerlo.
          Invierte en tu seguridad.
        </Text>
      </View>

      {/* Leyenda de niveles */}
      <View style={[styles.leyendaRow, { backgroundColor: colores.tarjeta }]}>
        {Object.entries(colorPorNivel).map(([nivel, color]) => (
          <View key={nivel} style={styles.leyendaItem}>
            <View style={[styles.leyendaDot, { backgroundColor: color }]} />
            <Text style={[styles.leyendaTexto, { color: colores.subtexto }]}>{nivel}</Text>
          </View>
        ))}
      </View>

      {/* Lista de equipo */}
      {equipoList.map((equipo) => (
        <TouchableOpacity
          key={equipo.id}
          style={[
            styles.tarjeta,
              { backgroundColor: colores.tarjeta, borderColor: colores.borde },
            expandido === equipo.id && {
              borderColor: colorPorNivel[equipo.nivel],
            },
          ]}
          onPress={() => toggleExpandido(equipo.id)}
          activeOpacity={0.9}
        >
          {/* Encabezado de tarjeta */}
          <View style={styles.tarjetaHeader}>
            <Text style={styles.tarjetaEmoji}>{equipo.emoji}</Text>
            <View style={styles.tarjetaInfo}>
              <Text style={[styles.tarjetaNombre, { color: colores.texto }]}>{equipo.nombre}</Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: colorPorNivel[equipo.nivel] + '22' },
                ]}
              >
                <Text
                  style={[
                    styles.badgeTexto,
                    { color: colorPorNivel[equipo.nivel] },
                  ]}
                >
                  {equipo.nivel}
                </Text>
              </View>
            </View>
            <Ionicons
              name={expandido === equipo.id ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#888"
            />
          </View>

          {/* Contenido expandible */}
          {expandido === equipo.id && (
            <View style={styles.tarjetaContenido}>
              <Text style={[styles.descripcion, { color: colores.subtexto }]}>{equipo.descripcion}</Text>

              <Text style={[styles.subtitulo, { color: colores.texto }]}>¿Qué buscar?</Text>
              {equipo.caracteristicas.map((caract, i) => (
                <View key={i} style={styles.caracteristicaRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#7ED321" />
                  <Text style={styles.caracteristicaTexto}>{caract}</Text>
                </View>
              ))}

              <View style={styles.consejoCard}>
                <Text style={styles.consejoTexto}>{equipo.consejo}</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerTexto}>
          Toca cada elemento para ver detalles y consejos
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E63946',
  },
  headerTitulo: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitulo: {
    color: '#AAA',
    fontSize: 13,
    lineHeight: 20,
  },
  leyendaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  leyendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  leyendaDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  leyendaTexto: {
    color: '#CCC',
    fontSize: 12,
  },
  tarjeta: {
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  tarjetaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tarjetaEmoji: {
    fontSize: 32,
  },
  tarjetaInfo: {
    flex: 1,
    gap: 4,
  },
  tarjetaNombre: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeTexto: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  tarjetaContenido: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#2A2A3E',
    paddingTop: 14,
  },
  descripcion: {
    color: '#CCC',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  subtitulo: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 8,
  },
  caracteristicaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  caracteristicaTexto: {
    color: '#AAA',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  consejoCard: {
    backgroundColor: '#1E2A1E',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#7ED321',
  },
  consejoTexto: {
    color: '#CCC',
    fontSize: 13,
    lineHeight: 19,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerTexto: {
    color: '#555',
    fontSize: 12,
  },
});
