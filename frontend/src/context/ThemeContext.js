/**
 * ThemeContext.js - Contexto para manejo de tema y preferencias visuales
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial del tema
const initialState = {
  theme: 'light', // 'light', 'dark', 'system'
  isDarkMode: false,
  isInitialized: false,
  primaryColor: 'blue',
  accentColor: 'green',
  fontSize: 'medium',
  fontFamily: 'inter',
  animationsEnabled: true,
  reducedMotion: false,
  highContrast: false,
  sidebarCollapsed: false,
  compactMode: false
};

// Acciones del reducer
const THEME_ACTIONS = {
  INITIALIZE: 'INITIALIZE',
  SET_THEME: 'SET_THEME',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_DARK_MODE: 'SET_DARK_MODE',
  SET_PRIMARY_COLOR: 'SET_PRIMARY_COLOR',
  SET_ACCENT_COLOR: 'SET_ACCENT_COLOR',
  SET_FONT_SIZE: 'SET_FONT_SIZE',
  SET_FONT_FAMILY: 'SET_FONT_FAMILY',
  SET_ANIMATIONS_ENABLED: 'SET_ANIMATIONS_ENABLED',
  SET_REDUCED_MOTION: 'SET_REDUCED_MOTION',
  SET_HIGH_CONTRAST: 'SET_HIGH_CONTRAST',
  SET_SIDEBAR_COLLAPSED: 'SET_SIDEBAR_COLLAPSED',
  SET_COMPACT_MODE: 'SET_COMPACT_MODE',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  RESET_TO_DEFAULTS: 'RESET_TO_DEFAULTS'
};

// Reducer del tema
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.INITIALIZE:
      return {
        ...state,
        ...action.payload,
        isInitialized: true
      };

    case THEME_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload,
        isDarkMode: action.payload === 'dark' || 
                   (action.payload === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      };

    case THEME_ACTIONS.TOGGLE_THEME:
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      return {
        ...state,
        theme: newTheme,
        isDarkMode: newTheme === 'dark'
      };

    case THEME_ACTIONS.SET_DARK_MODE:
      return {
        ...state,
        isDarkMode: action.payload,
        theme: action.payload ? 'dark' : 'light'
      };

    case THEME_ACTIONS.SET_PRIMARY_COLOR:
      return {
        ...state,
        primaryColor: action.payload
      };

    case THEME_ACTIONS.SET_ACCENT_COLOR:
      return {
        ...state,
        accentColor: action.payload
      };

    case THEME_ACTIONS.SET_FONT_SIZE:
      return {
        ...state,
        fontSize: action.payload
      };

    case THEME_ACTIONS.SET_FONT_FAMILY:
      return {
        ...state,
        fontFamily: action.payload
      };

    case THEME_ACTIONS.SET_ANIMATIONS_ENABLED:
      return {
        ...state,
        animationsEnabled: action.payload
      };

    case THEME_ACTIONS.SET_REDUCED_MOTION:
      return {
        ...state,
        reducedMotion: action.payload,
        animationsEnabled: action.payload ? false : state.animationsEnabled
      };

    case THEME_ACTIONS.SET_HIGH_CONTRAST:
      return {
        ...state,
        highContrast: action.payload
      };

    case THEME_ACTIONS.SET_SIDEBAR_COLLAPSED:
      return {
        ...state,
        sidebarCollapsed: action.payload
      };

    case THEME_ACTIONS.SET_COMPACT_MODE:
      return {
        ...state,
        compactMode: action.payload
      };

    case THEME_ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        ...action.payload
      };

    case THEME_ACTIONS.RESET_TO_DEFAULTS:
      return {
        ...initialState,
        isInitialized: true
      };

    default:
      return state;
  }
};

// Crear el contexto
const ThemeContext = createContext();

// Proveedor del contexto
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Inicializar tema desde localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    const savedSettings = localStorage.getItem('themeSettings');
    
    let settings = {};
    if (savedSettings) {
      try {
        settings = JSON.parse(savedSettings);
      } catch (error) {
        console.error('Error parsing theme settings:', error);
      }
    }

    // Detectar preferencias del sistema
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    dispatch({
      type: THEME_ACTIONS.INITIALIZE,
      payload: {
        ...settings,
        theme: savedTheme,
        isDarkMode: savedTheme === 'dark' || (savedTheme === 'system' && systemDarkMode),
        reducedMotion
      }
    });
  }, []);

  // Aplicar tema al DOM
  useEffect(() => {
    if (state.isInitialized) {
      document.documentElement.classList.toggle('dark', state.isDarkMode);
      document.documentElement.classList.toggle('high-contrast', state.highContrast);
      document.documentElement.classList.toggle('reduce-motion', state.reducedMotion);
      
      // Guardar en localStorage
      localStorage.setItem('theme', state.theme);
      localStorage.setItem('themeSettings', JSON.stringify({
        primaryColor: state.primaryColor,
        accentColor: state.accentColor,
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        animationsEnabled: state.animationsEnabled,
        highContrast: state.highContrast,
        sidebarCollapsed: state.sidebarCollapsed,
        compactMode: state.compactMode
      }));
    }
  }, [state]);

  // Escuchar cambios del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (state.theme === 'system') {
        dispatch({
          type: THEME_ACTIONS.SET_DARK_MODE,
          payload: e.matches
        });
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.theme]);

  // Funciones del contexto
  const setTheme = (theme) => {
    dispatch({ type: THEME_ACTIONS.SET_THEME, payload: theme });
  };

  const toggleTheme = () => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_THEME });
  };

  const setPrimaryColor = (color) => {
    dispatch({ type: THEME_ACTIONS.SET_PRIMARY_COLOR, payload: color });
  };

  const setAccentColor = (color) => {
    dispatch({ type: THEME_ACTIONS.SET_ACCENT_COLOR, payload: color });
  };

  const setFontSize = (size) => {
    dispatch({ type: THEME_ACTIONS.SET_FONT_SIZE, payload: size });
  };

  const setFontFamily = (family) => {
    dispatch({ type: THEME_ACTIONS.SET_FONT_FAMILY, payload: family });
  };

  const setAnimationsEnabled = (enabled) => {
    dispatch({ type: THEME_ACTIONS.SET_ANIMATIONS_ENABLED, payload: enabled });
  };

  const setHighContrast = (enabled) => {
    dispatch({ type: THEME_ACTIONS.SET_HIGH_CONTRAST, payload: enabled });
  };

  const setSidebarCollapsed = (collapsed) => {
    dispatch({ type: THEME_ACTIONS.SET_SIDEBAR_COLLAPSED, payload: collapsed });
  };

  const setCompactMode = (compact) => {
    dispatch({ type: THEME_ACTIONS.SET_COMPACT_MODE, payload: compact });
  };

  const updateSettings = (settings) => {
    dispatch({ type: THEME_ACTIONS.UPDATE_SETTINGS, payload: settings });
  };

  const resetToDefaults = () => {
    dispatch({ type: THEME_ACTIONS.RESET_TO_DEFAULTS });
  };

  const value = {
    ...state,
    setTheme,
    toggleTheme,
    setPrimaryColor,
    setAccentColor,
    setFontSize,
    setFontFamily,
    setAnimationsEnabled,
    setHighContrast,
    setSidebarCollapsed,
    setCompactMode,
    updateSettings,
    resetToDefaults
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar el contexto
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;