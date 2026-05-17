import React, { createContext, useContext, useState } from 'react';

// ─── COLORES POR TEMA ─────────────────────────────────────────────────────────
// Definimos los colores para el tema oscuro y el tema claro.
// Todas las pantallas usarán estos colores en lugar de valores fijos.
export const temas = {
  oscuro: {
    fondo: '#0F0F1A',
    tarjeta: '#1A1A2E',
    texto: '#FFFFFF',
    subtexto: '#AAAAAA',
    borde: '#333333',
    acento: '#E63946',
    tabBar: '#1A1A2E',
  },
  claro: {
    fondo: '#F5F5F5',
    tarjeta: '#FFFFFF',
    texto: '#1A1A2E',
    subtexto: '#555555',
    borde: '#DDDDDD',
    acento: '#E63946',
    tabBar: '#FFFFFF',
  },
};

// ─── TIPO DEL CONTEXTO ────────────────────────────────────────────────────────
type ThemeContextType = {
  temaActual: 'oscuro' | 'claro';        // Tema activo
  colores: typeof temas.oscuro;           // Colores del tema activo
  toggleTema: () => void;                 // Función para cambiar de tema
};

// ─── CREACIÓN DEL CONTEXTO ────────────────────────────────────────────────────
// createContext crea un "canal" global que comparte datos entre componentes
// sin necesidad de pasar props de pantalla en pantalla.
export const ThemeContext = createContext<ThemeContextType>({
  temaActual: 'oscuro',
  colores: temas.oscuro,
  toggleTema: () => {},
});

// ─── PROVEEDOR DEL TEMA ───────────────────────────────────────────────────────
// ThemeProvider envuelve toda la app y provee el tema a todas las pantallas.
// Cualquier componente hijo puede acceder al tema con useTheme().
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Estado que guarda el tema actual, inicia en oscuro
  const [temaActual, setTemaActual] = useState<'oscuro' | 'claro'>('oscuro');

  // Función que alterna entre oscuro y claro
  const toggleTema = () => {
    setTemaActual(prev => prev === 'oscuro' ? 'claro' : 'oscuro');
  };

  return (
    <ThemeContext.Provider value={{
      temaActual,
      colores: temas[temaActual],
      toggleTema,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── HOOK PERSONALIZADO ───────────────────────────────────────────────────────
// useTheme es un atajo para acceder al contexto del tema en cualquier pantalla.
// En lugar de escribir useContext(ThemeContext) cada vez, solo escribimos useTheme().
export function useTheme() {
  return useContext(ThemeContext);
}