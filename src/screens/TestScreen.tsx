import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Definimos el tipo de cada pregunta
type Pregunta = {
  id: number;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number; // índice de la opción correcta (0, 1, 2, 3)
  explicacion: string;
};

// Banco de preguntas del test vial
const preguntas: Pregunta[] = [
  {
    id: 1,
    pregunta: '¿Cuál es la distancia mínima de seguridad recomendada detrás de otro vehículo?',
    opciones: ['1 segundo', '2 segundos', '3 segundos', '5 segundos'],
    respuestaCorrecta: 2,
    explicacion: 'Se recomienda al menos 3 segundos de distancia para reaccionar a tiempo ante frenadas inesperadas.',
  },
  {
    id: 2,
    pregunta: '¿Qué debes hacer si tu moto comienza a derrapar en curva?',
    opciones: [
      'Frenar fuerte de inmediato',
      'Girar el manillar bruscamente',
      'Soltar el acelerador suavemente y mantener la postura',
      'Acelerar para salir del derrape',
    ],
    respuestaCorrecta: 2,
    explicacion: 'Al derrapar, lo correcto es soltar el acelerador sin frenar bruscamente para recuperar tracción gradualmente.',
  },
  {
    id: 3,
    pregunta: '¿Cuál es el equipo MÁS importante para un motociclista?',
    opciones: ['Guantes', 'Casco certificado', 'Botas', 'Chaqueta'],
    respuestaCorrecta: 1,
    explicacion: 'El casco certificado es la pieza más importante, ya que protege la cabeza, la parte más vulnerable del cuerpo.',
  },
  {
    id: 4,
    pregunta: '¿Qué significa la señal de tránsito con fondo rojo y octagonal?',
    opciones: ['Ceder el paso', 'Reducir velocidad', 'Alto total obligatorio', 'Zona escolar'],
    respuestaCorrecta: 2,
    explicacion: 'La señal octagonal roja (STOP) significa que debes detenerte completamente antes de continuar.',
  },
  {
    id: 5,
    pregunta: '¿En qué situación es MÁS peligroso adelantar a otro vehículo?',
    opciones: [
      'En recta con buena visibilidad',
      'En curva o subida sin visibilidad',
      'En zona de velocidad reducida',
      'En carretera de dos carriles señalizada',
    ],
    respuestaCorrecta: 1,
    explicacion: 'Adelantar en curva o subida es extremadamente peligroso porque no puedes ver si viene tráfico en sentido contrario.',
  },
];

export default function TestScreen() {
  // Estado para controlar en qué pregunta vamos
  const [preguntaActual, setPreguntaActual] = useState<number>(0);
  // Estado para guardar qué respuesta seleccionó el usuario
  const [seleccion, setSeleccion] = useState<number | null>(null);
  // Estado para saber si el usuario ya confirmó su respuesta
  const [respondida, setRespondida] = useState<boolean>(false);
  // Estado para contar respuestas correctas
  const [puntaje, setPuntaje] = useState<number>(0);
  // Estado para saber si el test terminó
  const [finalizado, setFinalizado] = useState<boolean>(false);

  const pregunta = preguntas[preguntaActual];

  // Función cuando el usuario selecciona una opción
  const handleSeleccion = (indice: number) => {
    if (!respondida) {
      setSeleccion(indice);
    }
  };

  // Función para confirmar la respuesta seleccionada
  const handleConfirmar = () => {
    if (seleccion === null) {
      Alert.alert('Atención', 'Por favor selecciona una respuesta antes de continuar.');
      return;
    }
    setRespondida(true);
    if (seleccion === pregunta.respuestaCorrecta) {
      setPuntaje(puntaje + 1);
    }
  };

  // Función para ir a la siguiente pregunta
  const handleSiguiente = () => {
    if (preguntaActual + 1 < preguntas.length) {
      setPreguntaActual(preguntaActual + 1);
      setSeleccion(null);
      setRespondida(false);
    } else {
      setFinalizado(true);
    }
  };

  // Función para reiniciar el test
  const handleReiniciar = () => {
    setPreguntaActual(0);
    setSeleccion(null);
    setRespondida(false);
    setPuntaje(0);
    setFinalizado(false);
  };

  // Función para obtener el color del botón de opción
  const getOpcionStyle = (indice: number) => {
    if (!respondida) {
      // Si el usuario lo seleccionó pero no ha confirmado
      return seleccion === indice ? styles.opcionSeleccionada : styles.opcion;
    }
    // Si ya se confirmó la respuesta
    if (indice === pregunta.respuestaCorrecta) {
      return styles.opcionCorrecta; // Verde para la correcta
    }
    if (indice === seleccion && seleccion !== pregunta.respuestaCorrecta) {
      return styles.opcionIncorrecta; // Rojo para la que el usuario eligió mal
    }
    return styles.opcion;
  };

  // Pantalla de resultados finales
  if (finalizado) {
    const porcentaje = Math.round((puntaje / preguntas.length) * 100);
    const emoji = porcentaje >= 80 ? '🏆' : porcentaje >= 60 ? '👍' : '📚';
    const mensaje =
      porcentaje >= 80
        ? '¡Excelente! Tienes un gran conocimiento vial.'
        : porcentaje >= 60
        ? 'Buen trabajo, sigue practicando.'
        : 'Necesitas repasar las normas de tránsito.';

    return (
      <View style={styles.resultadoContainer}>
        <Text style={styles.resultadoEmoji}>{emoji}</Text>
        <Text style={styles.resultadoTitulo}>Test Completado</Text>
        <Text style={styles.resultadoPuntaje}>
          {puntaje} / {preguntas.length}
        </Text>
        <Text style={styles.resultadoPorcentaje}>{porcentaje}% de aciertos</Text>
        <Text style={styles.resultadoMensaje}>{mensaje}</Text>
        <TouchableOpacity style={styles.botonReiniciar} onPress={handleReiniciar}>
          <Ionicons name="refresh" size={20} color="#FFF" />
          <Text style={styles.botonReiniciarTexto}>Intentar de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Barra de progreso */}
      <View style={styles.progresoContainer}>
        <Text style={styles.progresoTexto}>
          Pregunta {preguntaActual + 1} de {preguntas.length}
        </Text>
        <View style={styles.barraFondo}>
          <View
            style={[
              styles.barraRelleno,
              { width: `${((preguntaActual + 1) / preguntas.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Tarjeta de pregunta */}
      <View style={styles.tarjetaPregunta}>
        <Text style={styles.preguntaTexto}>{pregunta.pregunta}</Text>
      </View>

      {/* Opciones de respuesta */}
      <View style={styles.opcionesContainer}>
        {pregunta.opciones.map((opcion, indice) => (
          <TouchableOpacity
            key={indice}
            style={getOpcionStyle(indice)}
            onPress={() => handleSeleccion(indice)}
            activeOpacity={0.8}
          >
            <View style={styles.opcionLetraContainer}>
              <Text style={styles.opcionLetra}>
                {['A', 'B', 'C', 'D'][indice]}
              </Text>
            </View>
            <Text style={styles.opcionTexto}>{opcion}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Explicación (aparece después de responder) */}
      {respondida && (
        <View style={styles.explicacionCard}>
          <Text style={styles.explicacionTitulo}>
            {seleccion === pregunta.respuestaCorrecta ? '✅ ¡Correcto!' : '❌ Incorrecto'}
          </Text>
          <Text style={styles.explicacionTexto}>{pregunta.explicacion}</Text>
        </View>
      )}

      {/* Botones de acción */}
      <View style={styles.botonesContainer}>
        {!respondida ? (
          <TouchableOpacity
            style={styles.botonConfirmar}
            onPress={handleConfirmar}
          >
            <Text style={styles.botonTexto}>Confirmar respuesta</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.botonSiguiente}
            onPress={handleSiguiente}
          >
            <Text style={styles.botonTexto}>
              {preguntaActual + 1 < preguntas.length ? 'Siguiente pregunta' : 'Ver resultados'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    padding: 16,
  },
  progresoContainer: {
    marginBottom: 20,
  },
  progresoTexto: {
    color: '#AAA',
    fontSize: 13,
    marginBottom: 8,
  },
  barraFondo: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
  },
  barraRelleno: {
    height: 6,
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  tarjetaPregunta: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  preguntaTexto: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  opcionesContainer: {
    gap: 10,
    marginBottom: 20,
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#333',
  },
  opcionSeleccionada: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2A4A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  opcionCorrecta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A3A1A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#7ED321',
  },
  opcionIncorrecta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A1A1A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E63946',
  },
  opcionLetraContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  opcionLetra: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  opcionTexto: {
    color: '#DDD',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  explicacionCard: {
    backgroundColor: '#1E2A1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#7ED321',
  },
  explicacionTitulo: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
  },
  explicacionTexto: {
    color: '#AAA',
    fontSize: 13,
    lineHeight: 20,
  },
  botonesContainer: {
    marginBottom: 32,
  },
  botonConfirmar: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  botonSiguiente: {
    backgroundColor: '#E63946',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  botonTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Pantalla de resultados
  resultadoContainer: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  resultadoEmoji: {
    fontSize: 70,
    marginBottom: 16,
  },
  resultadoTitulo: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  resultadoPuntaje: {
    color: '#E63946',
    fontSize: 56,
    fontWeight: 'bold',
  },
  resultadoPorcentaje: {
    color: '#AAA',
    fontSize: 18,
    marginBottom: 12,
  },
  resultadoMensaje: {
    color: '#CCC',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  botonReiniciar: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
  },
  botonReiniciarTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
