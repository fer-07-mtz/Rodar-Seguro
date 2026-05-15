import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Tipo para cada contacto de emergencia
type Contacto = {
  nombre: string;
  numero: string;
  icono: keyof typeof Ionicons.glyphMap;
  color: string;
};

// Lista de contactos de emergencia
const contactosEmergencia: Contacto[] = [
  {
    nombre: 'Emergencias',
    numero: '911',
    icono: 'call',
    color: '#E63946',
  },
  {
    nombre: 'Cruz Roja',
    numero: '065',
    icono: 'medical',
    color: '#E63946',
  },
  {
    nombre: 'Policía Federal',
    numero: '088',
    icono: 'shield',
    color: '#4A90E2',
  },
  {
    nombre: 'Bomberos',
    numero: '068',
    icono: 'flame',
    color: '#F5A623',
  },
];

// Pasos de qué hacer en caso de accidente
const pasosAccidente = [
  {
    numero: '1',
    titulo: 'Mantén la calma',
    descripcion: 'Respira profundo. Evalúa si estás consciente y puedes moverte sin dolor.',
    color: '#4A90E2',
  },
  {
    numero: '2',
    titulo: 'No te quites el casco',
    descripcion: 'A menos que no puedas respirar. El casco puede estar protegiendo tu columna.',
    color: '#F5A623',
  },
  {
    numero: '3',
    titulo: 'Llama al 911',
    descripcion: 'Da tu ubicación exacta (calle, referencia cercana). Menciona si hay heridos.',
    color: '#E63946',
  },
  {
    numero: '4',
    titulo: 'Alerta a otros conductores',
    descripcion: 'Si puedes, enciende las luces de emergencia de tu moto o usa triángulos reflectantes.',
    color: '#7ED321',
  },
  {
    numero: '5',
    titulo: 'Espera ayuda',
    descripcion: 'Quédate en el lugar. No muevas tu moto. Reúne información del otro involucrado.',
    color: '#9B59B6',
  },
];

export default function EmergencyScreen() {
  // Estado para el contador de activación del SOS
  const [presionando, setPresionando] = useState<boolean>(false);
  const [activado, setActivado] = useState<boolean>(false);
  const [contador, setContador] = useState<number>(3);

  // Animación del botón pulsante
  const pulsoAnim = useRef(new Animated.Value(1)).current;
  const contadorRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Efecto de pulso continuo cuando el SOS está activado
  useEffect(() => {
    if (activado) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulsoAnim, {
            toValue: 1.15,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulsoAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulsoAnim.setValue(1);
    }
  }, [activado]);

  // Cuando el usuario PRESIONA el botón SOS
  const handlePresionarSOS = () => {
    setPresionando(true);
    setContador(3);
    Vibration.vibrate(200);

    // Countdown de 3 segundos para activar
    contadorRef.current = setInterval(() => {
      setContador((prev) => {
        if (prev <= 1) {
          clearInterval(contadorRef.current!);
          setPresionando(false);
          setActivado(true);
          Vibration.vibrate([0, 300, 200, 300]); // Vibración de confirmación
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cuando el usuario SUELTA el botón antes de que termine
  const handleSoltarSOS = () => {
    if (!activado) {
      clearInterval(contadorRef.current!);
      setPresionando(false);
      setContador(3);
    }
  };

  // Cancelar el SOS activado
  const handleCancelar = () => {
    Alert.alert(
      'Cancelar SOS',
      '¿Estás seguro de que deseas cancelar la alerta de emergencia?',
      [
        { text: 'No, mantener SOS', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => {
            setActivado(false);
            setPresionando(false);
            setContador(3);
            Vibration.cancel();
          },
        },
      ]
    );
  };

  // Simular llamada a número de emergencia
  const handleLlamar = (contacto: Contacto) => {
    Alert.alert(
      `Llamar al ${contacto.numero}`,
      `¿Deseas llamar a ${contacto.nombre} (${contacto.numero})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Llamar',
          onPress: () =>
            Alert.alert('Simulación', `En la app real se marcaría al ${contacto.numero} automáticamente.`),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner de advertencia */}
      <View style={styles.advertencia}>
        <Ionicons name="warning" size={18} color="#F5A623" />
        <Text style={styles.advertenciaTexto}>
          Esta pantalla es una simulación educativa. En emergencias reales llama al 911.
        </Text>
      </View>

      {/* Botón SOS principal */}
      <View style={styles.sosSection}>
        <Text style={styles.sosTitulo}>
          {activado ? '🚨 SOS ACTIVADO' : 'Botón de Emergencia'}
        </Text>
        <Text style={styles.sosSubtitulo}>
          {activado
            ? 'Alerta enviada. Ayuda en camino...'
            : presionando
            ? `Mantén presionado... ${contador}`
            : 'Mantén presionado 3 segundos para activar'}
        </Text>

        <Animated.View style={{ transform: [{ scale: pulsoAnim }] }}>
          <TouchableOpacity
            style={[
              styles.botonSOS,
              presionando && styles.botonSOSPresionando,
              activado && styles.botonSOSActivado,
            ]}
            onPressIn={!activado ? handlePresionarSOS : undefined}
            onPressOut={!activado ? handleSoltarSOS : undefined}
            activeOpacity={0.9}
          >
            <Ionicons
              name={activado ? 'radio' : 'alert'}
              size={50}
              color="#FFF"
            />
            <Text style={styles.botonSOSTexto}>
              {activado ? 'SOS\nACTIVO' : 'SOS'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {activado && (
          <TouchableOpacity style={styles.botonCancelar} onPress={handleCancelar}>
            <Ionicons name="close-circle" size={18} color="#FFF" />
            <Text style={styles.botonCancelarTexto}>Cancelar alerta</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Contactos de emergencia */}
      <Text style={styles.seccionTitulo}>📞 Números de Emergencia</Text>
      <View style={styles.contactosGrid}>
        {contactosEmergencia.map((contacto, i) => (
          <TouchableOpacity
            key={i}
            style={styles.contactoCard}
            onPress={() => handleLlamar(contacto)}
            activeOpacity={0.8}
          >
            <View style={[styles.contactoIcono, { backgroundColor: contacto.color + '22' }]}>
              <Ionicons name={contacto.icono} size={24} color={contacto.color} />
            </View>
            <Text style={styles.contactoNombre}>{contacto.nombre}</Text>
            <Text style={[styles.contactoNumero, { color: contacto.color }]}>
              {contacto.numero}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pasos en caso de accidente */}
      <Text style={styles.seccionTitulo}>🚑 ¿Qué hacer en un accidente?</Text>
      {pasosAccidente.map((paso) => (
        <View key={paso.numero} style={styles.pasoCard}>
          <View style={[styles.pasoNumero, { backgroundColor: paso.color }]}>
            <Text style={styles.pasoNumeroTexto}>{paso.numero}</Text>
          </View>
          <View style={styles.pasoInfo}>
            <Text style={styles.pasoTitulo}>{paso.titulo}</Text>
            <Text style={styles.pasoDescripcion}>{paso.descripcion}</Text>
          </View>
        </View>
      ))}

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    padding: 16,
  },
  advertencia: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2A1F0A',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F5A623',
  },
  advertenciaTexto: {
    color: '#F5A623',
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  sosSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  sosTitulo: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  sosSubtitulo: {
    color: '#AAA',
    fontSize: 13,
    marginBottom: 24,
    textAlign: 'center',
  },
  botonSOS: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E63946',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: '#C0303A',
    elevation: 8,
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    gap: 4,
  },
  botonSOSPresionando: {
    backgroundColor: '#C0303A',
    borderColor: '#E63946',
  },
  botonSOSActivado: {
    backgroundColor: '#8B0000',
    borderColor: '#E63946',
  },
  botonSOSTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 22,
  },
  botonCancelar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    gap: 6,
  },
  botonCancelarTexto: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  seccionTitulo: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  contactosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  contactoCard: {
    width: '47%',
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    gap: 8,
  },
  contactoIcono: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactoNombre: {
    color: '#CCC',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  contactoNumero: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  pasoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  pasoNumero: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pasoNumeroTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pasoInfo: {
    flex: 1,
  },
  pasoTitulo: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  pasoDescripcion: {
    color: '#AAA',
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    height: 24,
  },
});
