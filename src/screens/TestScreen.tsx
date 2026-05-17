import { useTheme } from './ThemeContext';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── TIPOS ───────────────────────────────────────────────────────────────────
// Definimos la estructura de cada pregunta del test
type Pregunta = {
  id: number;           // Identificador único de la pregunta
  pregunta: string;     // Texto de la pregunta
  opciones: string[];   // Array con las 4 opciones de respuesta
  respuestaCorrecta: number; // Índice (0-3) de la opción correcta
  explicacion: string;  // Texto explicativo que aparece después de responder
};

// ─── BANCO DE PREGUNTAS ───────────────────────────────────────────────────────
// Contiene 15 preguntas en total. En cada test se seleccionan 5 de forma
// aleatoria para que el usuario nunca vea siempre las mismas preguntas.
const bancoPregunta: Pregunta[] = [
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
  {
    id: 6,
    pregunta: '¿Qué certificación debe tener un casco para ser considerado seguro en México?',
    opciones: ['ISO 9001', 'DOT, ECE 22.06 o NOM', 'CE Nivel 2', 'ANSI Z87'],
    respuestaCorrecta: 1,
    explicacion: 'En México los cascos deben tener certificación DOT, ECE 22.06 o NOM para garantizar que protegen correctamente.',
  },
  {
    id: 7,
    pregunta: '¿Cada cuánto tiempo se recomienda reemplazar un casco aunque no haya tenido impactos?',
    opciones: ['Cada año', 'Cada 3 años', 'Cada 5 años', 'Solo si se daña visiblemente'],
    respuestaCorrecta: 2,
    explicacion: 'Se recomienda reemplazar el casco cada 5 años porque los materiales se degradan con el tiempo aunque no haya impactos.',
  },
  {
    id: 8,
    pregunta: '¿Qué debes hacer PRIMERO al llegar a un cruce sin semáforo?',
    opciones: [
      'Acelerar para cruzar rápido',
      'Tocar el claxon para avisar',
      'Reducir velocidad y verificar que no haya vehículos',
      'Encender las luces intermitentes',
    ],
    respuestaCorrecta: 2,
    explicacion: 'En un cruce sin semáforo siempre debes reducir la velocidad y asegurarte de que no venga ningún vehículo antes de cruzar.',
  },
  {
    id: 9,
    pregunta: '¿Cuál es la causa más común de accidentes de motocicleta en México?',
    opciones: [
      'Fallas mecánicas',
      'Mal estado de las carreteras',
      'Exceso de velocidad y falta de equipo',
      'Condiciones climáticas',
    ],
    respuestaCorrecta: 2,
    explicacion: 'Según la AMTM, el exceso de velocidad y la falta de equipo de protección son las principales causas de accidentes mortales.',
  },
  {
    id: 10,
    pregunta: '¿Qué significa una señal de tránsito con fondo amarillo?',
    opciones: ['Prohibición', 'Advertencia o precaución', 'Obligación', 'Información'],
    respuestaCorrecta: 1,
    explicacion: 'Las señales de fondo amarillo son preventivas e indican una advertencia o condición de precaución en el camino.',
  },
  {
    id: 11,
    pregunta: '¿Dónde deben colocarse los protectores de nivel CE en una chaqueta de moto?',
    opciones: [
      'Solo en la espalda',
      'En hombros y codos como mínimo',
      'Solo en los codos',
      'En el pecho únicamente',
    ],
    respuestaCorrecta: 1,
    explicacion: 'Una chaqueta de moto debe tener protectores CE Nivel 2 mínimo en hombros y codos para proteger las articulaciones más expuestas.',
  },
  {
    id: 12,
    pregunta: '¿Qué debes hacer si un vehículo te rebasa peligrosamente?',
    opciones: [
      'Acelerar para no quedarte atrás',
      'Frenarlo haciendo señas',
      'Mantener la calma, reducir velocidad y dejar espacio',
      'Cambiar de carril inmediatamente',
    ],
    respuestaCorrecta: 2,
    explicacion: 'Lo más seguro es mantener la calma, reducir la velocidad y ampliar la distancia de seguridad para evitar un accidente.',
  },
  {
    id: 13,
    pregunta: '¿Con qué mano se controla el freno delantero en una motocicleta?',
    opciones: ['Mano izquierda', 'Mano derecha', 'Ambas manos', 'No existe freno delantero'],
    respuestaCorrecta: 1,
    explicacion: 'El freno delantero se controla con la mano derecha. Es el freno más potente y debe usarse con suavidad para evitar derrapar.',
  },
  {
    id: 14,
    pregunta: '¿Qué porcentaje de los motociclistas en México cuenta con licencia y entrenamiento formal?',
    opciones: ['9%', '25%', '50%', '70%'],
    respuestaCorrecta: 0,
    explicacion: 'Según la AMTM, solo el 9% de los motociclistas en México tiene licencia oficial y entrenamiento adecuado.',
  },
  {
    id: 15,
    pregunta: '¿Cuál es el número de emergencias en México?',
    opciones: ['066', '080', '911', '065'],
    respuestaCorrecta: 2,
    explicacion: 'El 911 es el número único de emergencias en México para reportar accidentes, crímenes o cualquier situación de riesgo.',
  },
];

// ─── FUNCIÓN SHUFFLE ──────────────────────────────────────────────────────────
// Mezcla el banco de preguntas de forma aleatoria usando el algoritmo
// de Fisher-Yates simplificado con Math.random(), luego toma las primeras 5.
// Esto garantiza que cada test tenga preguntas diferentes.
function obtener5Aleatorias(banco: Pregunta[]): Pregunta[] {
  const mezcladas = [...banco].sort(() => Math.random() - 0.5);
  return mezcladas.slice(0, 5);
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function TestScreen() {
  // Obtenemos los colores del tema activo para aplicarlos a esta pantalla
  const { colores } = useTheme();
// Lista de 5 preguntas seleccionadas aleatoriamente para el test actual
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  // Índice de la pregunta actual (0 a 4)
  const [preguntaActual, setPreguntaActual] = useState<number>(0);
  // Índice de la opción seleccionada por el usuario (null si no ha seleccionado)
  const [seleccion, setSeleccion] = useState<number | null>(null);
  // Controla si el usuario ya confirmó su respuesta para mostrar retroalimentación
  const [respondida, setRespondida] = useState<boolean>(false);
  // Contador de respuestas correctas acumuladas durante el test
  const [puntaje, setPuntaje] = useState<number>(0);
  // Controla si se muestra la pantalla de resultados finales
  const [finalizado, setFinalizado] = useState<boolean>(false);

  // Al montar el componente, cargamos 5 preguntas aleatorias del banco
  useEffect(() => {
    setPreguntas(obtener5Aleatorias(bancoPregunta));
  }, []);

  // Referencia a la pregunta actual del array
  const pregunta = preguntas[preguntaActual];

  // Guarda la selección del usuario solo si aún no ha confirmado su respuesta
  const handleSeleccion = (indice: number) => {
    if (!respondida) setSeleccion(indice);
  };

  // Valida que haya selección y marca la pregunta como respondida
  // También incrementa el puntaje si la respuesta es correcta
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

  // Avanza a la siguiente pregunta o finaliza el test si era la última
  const handleSiguiente = () => {
    if (preguntaActual + 1 < preguntas.length) {
      setPreguntaActual(preguntaActual + 1);
      setSeleccion(null);
      setRespondida(false);
    } else {
      setFinalizado(true);
    }
  };

  // Reinicia el test con un NUEVO conjunto de 5 preguntas aleatorias
  // Así el usuario nunca ve las mismas preguntas dos veces seguidas
  const handleReiniciar = () => {
    setPreguntas(obtener5Aleatorias(bancoPregunta));
    setPreguntaActual(0);
    setSeleccion(null);
    setRespondida(false);
    setPuntaje(0);
    setFinalizado(false);
  };

  // Determina el estilo visual de cada opción según el estado del test:
  // - Normal: sin responder
  // - Seleccionada: el usuario la tocó pero no confirmó
  // - Correcta: verde, la respuesta correcta (visible al confirmar)
  // - Incorrecta: roja, la que el usuario eligió si estuvo mal
  const getOpcionStyle = (indice: number) => {
    if (!respondida) {
      return seleccion === indice ? styles.opcionSeleccionada : styles.opcion;
    }
    if (indice === pregunta.respuestaCorrecta) return styles.opcionCorrecta;
    if (indice === seleccion && seleccion !== pregunta.respuestaCorrecta) return styles.opcionIncorrecta;
    return styles.opcion;
  };

  // Mientras carga el array de preguntas, no renderiza nada
  if (!pregunta) return null;

  // ─── PANTALLA DE RESULTADOS ────────────────────────────────────────────────
  // Se muestra cuando el usuario termina las 5 preguntas
  if (finalizado) {
    const porcentaje = Math.round((puntaje / preguntas.length) * 100);
    // Emoji y mensaje personalizados según el porcentaje de aciertos
    const emoji = porcentaje >= 80 ? '🏆' : porcentaje >= 60 ? '👍' : '📚';
    const mensaje =
      porcentaje >= 80
        ? '¡Excelente! Tienes un gran conocimiento vial.'
        : porcentaje >= 60
        ? 'Buen trabajo, sigue practicando.'
        : 'Necesitas repasar las normas de tránsito.';

    return (
      <View style={[styles.resultadoContainer, { backgroundColor: colores.fondo }]}>
        <Text style={styles.resultadoEmoji}>{emoji}</Text>
        <Text style={[styles.resultadoTitulo, { color: colores.texto }]}>Test Completado</Text>
        <Text style={styles.resultadoPuntaje}>{puntaje} / {preguntas.length}</Text>
        <Text style={styles.resultadoPorcentaje}>{porcentaje}% de aciertos</Text>
        <Text style={[styles.resultadoMensaje, { color: colores.subtexto }]}>{mensaje}</Text>
        <TouchableOpacity style={styles.botonReiniciar} onPress={handleReiniciar}>
          <Ionicons name="refresh" size={20} color="#FFF" />
          <Text style={styles.botonReiniciarTexto}>Intentar de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── PANTALLA DEL TEST ─────────────────────────────────────────────────────
  return (
    <ScrollView style={[styles.container, { backgroundColor: colores.fondo }]} showsVerticalScrollIndicator={false}>

      {/* Barra de progreso: muestra en qué pregunta va el usuario */}
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

      {/* Tarjeta con el texto de la pregunta */}
      <View style={[styles.tarjetaPregunta, { backgroundColor: colores.tarjeta, borderColor: colores.borde }]}>
        <Text style={[styles.preguntaTexto, { color: colores.texto }]}>{pregunta.pregunta}</Text>
      </View>

      {/* Opciones de respuesta: A, B, C, D */}
      <View style={styles.opcionesContainer}>
        {pregunta.opciones.map((opcion, indice) => (
          <TouchableOpacity
            key={indice}
            style={getOpcionStyle(indice)}
            onPress={() => handleSeleccion(indice)}
            activeOpacity={0.8}
          >
            <View style={styles.opcionLetraContainer}>
              <Text style={styles.opcionLetra}>{['A', 'B', 'C', 'D'][indice]}</Text>
            </View>
            <Text style={styles.opcionTexto}>{opcion}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Explicación: aparece solo después de confirmar la respuesta */}
      {respondida && (
        <View style={styles.explicacionCard}>
          <Text style={styles.explicacionTitulo}>
            {seleccion === pregunta.respuestaCorrecta ? '✅ ¡Correcto!' : '❌ Incorrecto'}
          </Text>
          <Text style={styles.explicacionTexto}>{pregunta.explicacion}</Text>
        </View>
      )}

      {/* Botón de acción: cambia entre "Confirmar" y "Siguiente" según el estado */}
      <View style={styles.botonesContainer}>
        {!respondida ? (
          <TouchableOpacity style={styles.botonConfirmar} onPress={handleConfirmar}>
            <Text style={styles.botonTexto}>Confirmar respuesta</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.botonSiguiente} onPress={handleSiguiente}>
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

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 

  },
  progresoContainer: { 
    marginBottom: 20 

  },
  progresoTexto: { 
    color: '#AAA', 
    fontSize: 13, 
    marginBottom: 8 

  },
  barraFondo: { 
    height: 6, 
    backgroundColor: '#333', 
    borderRadius: 3 

  },
  barraRelleno: { 
    height: 6, 
    backgroundColor: '#4A90E2', 
    borderRadius: 3 

  },
  tarjetaPregunta: { 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 20, 
    borderWidth: 1 

  },
  preguntaTexto: { 
    color: '#FFF', 
    fontSize: 16, 
    lineHeight: 24, 
    fontWeight: '600' 

  },
  opcionesContainer: { 
    gap: 10, 
    marginBottom: 20 

  },
  opcion: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1A1A2E', 
    borderRadius: 12, 
    padding: 14, 
    borderWidth: 1, 
    borderColor: '#333' 

  },
  opcionSeleccionada: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1A2A4A', 
    borderRadius: 12, 
    padding: 14, 
    borderWidth: 2, 
    borderColor: '#4A90E2' 

  },
  opcionCorrecta: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1A3A1A', 
    borderRadius: 12, 
    padding: 14, 
    borderWidth: 2, 
    borderColor: '#7ED321' 

  },
  opcionIncorrecta: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#3A1A1A', 
    borderRadius: 12, 
    padding: 14, 
    borderWidth: 2, 
    borderColor: '#E63946' 

  },
  opcionLetraContainer: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    backgroundColor: '#333', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 

  },
  opcionLetra: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 13 

  },
  opcionTexto: { 
    color: '#DDD', 
    fontSize: 14, 
    flex: 1, 
    lineHeight: 20 

  },
  explicacionCard: { 
    backgroundColor: '#1E2A1E', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 20, 
    borderLeftWidth: 4, 
    borderLeftColor: '#7ED321' 

  },
  explicacionTitulo: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 15, 
    marginBottom: 6 

  },
  explicacionTexto: { 
    color: '#AAA', 
    fontSize: 13, 
    lineHeight: 20 

  },
  botonesContainer: { 
    marginBottom: 32 

  },
  botonConfirmar: { 
    backgroundColor: '#4A90E2', 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center' 

  },
  botonSiguiente: { 
    backgroundColor: '#E63946', 
    borderRadius: 12, 
    padding: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8 

  },
  botonTexto: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16 

  },
  resultadoEmoji: { 
    fontSize: 70, 
    marginBottom: 16 
  },

  resultadoTitulo: { 
    color: '#FFF', 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 16 

  },
  resultadoPuntaje: { 
    color: '#E63946', 
    fontSize: 56, 
    fontWeight: 'bold' 

  },
  resultadoPorcentaje: { 
    color: '#AAA', 
    fontSize: 18, 
    marginBottom: 12 

  },
  resultadoMensaje: { 
    color: '#CCC', 
    fontSize: 15, 
    textAlign: 'center', 
    lineHeight: 22, 
    marginBottom: 32 

  },
  botonReiniciar: { 
    backgroundColor: '#4A90E2', 
    borderRadius: 12, 
    padding: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    paddingHorizontal: 32 
  },

  botonReiniciarTexto: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});