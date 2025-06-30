import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * Contexto de tema para el sistema de gestión de bovinos
 * Maneja el estado global del tema, colores, animaciones y preferencias visuales
 */

// Estados iniciales del contexto de tema
const initialState = {
  // Configuración de tema
  theme: 'light', // 'light', 'dark', 'auto'
  isDarkMode: false,
  systemPreference: 'light',
  
  // Configuración de colores
  primaryColor: 'blue',
  accentColor: 'green',
  colorScheme: 'default', // 'default', 'ranch', 'nature', 'professional'
  
  // Configuración de animaciones
  animationsEnabled: true,
  reducedMotion: false,
  animationSpeed: 'normal', // 'slow', 'normal', 'fast'
  transitionDuration: 300,
  
  // Configuración de UI
  fontSize: 'medium', // 'small', 'medium', 'large', 'extra-large'
  fontFamily: 'inter', // 'inter', 'roboto', 'open-sans'
  borderRadius: 'normal', // 'none', 'small', 'normal', 'large', 'full'
  spacing: 'normal', // 'compact', 'normal', 'comfortable'
  
  // Configuración de layout
  sidebarCollapsed: false,
  compactMode: false,
  gridDensity: 'normal', // 'compact', 'normal', 'comfortable'
  
  // Configuración de accesibilidad
  highContrast: false,
  focusVisible: true,
  keyboardNavigation: true,
  
  // Estados de la UI
  isLoading: false,
  isInitialized: false,
  
  // Errores
  error: null
};

// Tipos de acciones para el reducer
const THEME_ACTIONS = {
  // Inicialización
  INITIALIZE_START: 'INITIALIZE_START',
  INITIALIZE_SUCCESS: 'INITIALIZE_SUCCESS',
  INITIALIZE_FAILURE: 'INITIALIZE_FAILURE',
  
  // Tema
  SET_THEME: 'SET_THEME',
  SET_DARK_MODE: 'SET_DARK_MODE',
  SET_SYSTEM_PREFERENCE: 'SET_SYSTEM_PREFERENCE',
  TOGGLE_THEME: 'TOGGLE_THEME',
  
  // Colores
  SET_PRIMARY_COLOR: 'SET_PRIMARY_COLOR',
  SET_ACCENT_COLOR: 'SET_ACCENT_COLOR',
  SET_COLOR_SCHEME: 'SET_COLOR_SCHEME',
  
  // Animaciones
  SET_ANIMATIONS_ENABLED: 'SET_ANIMATIONS_ENABLED',
  SET_REDUCED_MOTION: 'SET_REDUCED_MOTION',
  SET_ANIMATION_SPEED: 'SET_ANIMATION_SPEED',
  
  // UI
  SET_FONT_SIZE: 'SET_FONT_SIZE',
  SET_FONT_FAMILY: 'SET_FONT_FAMILY',
  SET_BORDER_RADIUS: 'SET_BORDER_RADIUS',
  SET_SPACING: 'SET_SPACING',
  
  // Layout
  SET_SIDEBAR_COLLAPSED: 'SET_SIDEBAR_COLLAPSED',
  SET_COMPACT_MODE: 'SET_COMPACT_MODE',
  SET_GRID_DENSITY: 'SET_GRID_DENSITY',
  
  // Accesibilidad
  SET_HIGH_CONTRAST: 'SET_HIGH_CONTRAST',
  SET_FOCUS_VISIBLE: 'SET_FOCUS_VISIBLE',
  SET_KEYBOARD_NAVIGATION: 'SET_KEYBOARD_NAVIGATION',
  
  // Configuración múltiple
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  RESET_TO_DEFAULTS: 'RESET_TO_DEFAULTS',
  
  // Errores
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

/**
 * Reducer para manejar las acciones del estado de tema
 * @param {Object} state - Estado actual
 * @param {Object} action - Acción a ejecutar
 */
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.INITIALIZE_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case THEME_ACTIONS.INITIALIZE_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        isInitialized: true,
        error: null
      };

    case THEME_ACTIONS.INITIALIZE_FAILURE:
      return {
        ...state,
        isLoading: false,
        isInitialized: true,
        error: action.payload
      };

    case THEME_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload,
        isDarkMode: action.payload === 'dark' || (action.payload === 'auto' && state.systemPreference === 'dark')
      };

    case THEME_ACTIONS.SET_DARK_MODE:
      return {
        ...state,
        isDarkMode: action.payload,
        theme: action.payload ? 'dark' : 'light'
      };

    case THEME_ACTIONS.SET_SYSTEM_PREFERENCE:
      return {
        ...state,
        systemPreference: action.payload,
        isDarkMode: state.theme === 'auto' ? action.payload === 'dark' : state.isDarkMode
      };

    case THEME_ACTIONS.TOGGLE_THEME:
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      return {
        ...state,
        theme: newTheme,
        isDarkMode: newTheme === 'dark'
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

    case THEME_ACTIONS.SET_COLOR_SCHEME:
      return {
        ...state,
        colorScheme: action.payload
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

    case THEME_ACTIONS.SET_ANIMATION_SPEED:
      return {
        ...state,
        animationSpeed: action.payload,
        transitionDuration: action.payload === 'slow' ? 500 : action.payload === 'fast' ? 150 : 300
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

    case THEME_ACTIONS.SET_BORDER_RADIUS:
      return {
        ...state,
        borderRadius: action.payload
      };

    case THEME_ACTIONS.SET_SPACING:
      return {
        ...state,
        spacing: action.payload
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

    case THEME_ACTIONS.SET_GRID_DENSITY:
      return {
        ...state,
        gridDensity: action.payload
      };

    case THEME_ACTIONS.SET_HIGH_CONTRAST:
      return {
        ...state,
        highContrast: action.payload
      };

    case THEME_ACTIONS.SET_FOCUS_VISIBLE:
      return {
        ...state,
        focusVisible: action.payload
      };

    case THEME_ACTIONS.SET_KEYBOARD_NAVIGATION:
      return {
        ...state,
        keyboardNavigation: action.payload
      };

    case THEME_ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        ...action.payload
      };

    case THEME_ACTIONS.RESET_TO_DEFAULTS:
      return {
        ...initialState,
        isInitialized: true,
        isLoading: false
      };

    case THEME_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };

    case THEME_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Crear el contexto de tema
const ThemeContext = createContext(undefined);

/**
 * Proveedor del contexto de tema
 * @param {Object} props - Props del componente
 */
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  const { getItem, setItem } = useLocalStorage();

  /**
   * Detectar preferencia del sistema
   */
  const detectSystemPreference = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }, []);

  /**
   * Detectar preferencia de movimiento reducido
   */
  const detectReducedMotion = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);

  /**
   * Inicializar configuración de tema
   */
  const initialize = useCallback(async () => {
    try {
      dispatch({ type: THEME_ACTIONS.INITIALIZE_START });

      // Obtener configuración guardada
      const savedTheme = getItem('theme') || 'auto';
      const savedPrimaryColor = getItem('primaryColor') || 'blue';
      const savedAccentColor = getItem('accentColor') || 'green';
      const savedColorScheme = getItem('colorScheme') || 'default';
      const savedAnimationsEnabled = getItem('animationsEnabled') !== null ? getItem('animationsEnabled') : true;
      const savedAnimationSpeed = getItem('animationSpeed') || 'normal';
      const savedFontSize = getItem('fontSize') || 'medium';
      const savedFontFamily = getItem('fontFamily') || 'inter';
      const savedBorderRadius = getItem('borderRadius') || 'normal';
      const savedSpacing = getItem('spacing') || 'normal';
      const savedSidebarCollapsed = getItem('sidebarCollapsed') || false;
      const savedCompactMode = getItem('compactMode') || false;
      const savedGridDensity = getItem('gridDensity') || 'normal';
      const savedHighContrast = getItem('highContrast') || false;
      const savedFocusVisible = getItem('focusVisible') !== null ? getItem('focusVisible') : true;
      const savedKeyboardNavigation = getItem('keyboardNavigation') !== null ? getItem('keyboardNavigation') : true;

      // Detectar preferencias del sistema
      const systemPreference = detectSystemPreference();
      const reducedMotion = detectReducedMotion();

      // Determinar tema actual
      const currentTheme = savedTheme === 'auto' ? systemPreference : savedTheme;
      const isDarkMode = currentTheme === 'dark';

      // Configuración inicial
      const initialConfig = {
        theme: savedTheme,
        isDarkMode,
        systemPreference,
        primaryColor: savedPrimaryColor,
        accentColor: savedAccentColor,
        colorScheme: savedColorScheme,
        animationsEnabled: reducedMotion ? false : savedAnimationsEnabled,
        reducedMotion,
        animationSpeed: savedAnimationSpeed,
        transitionDuration: savedAnimationSpeed === 'slow' ? 500 : savedAnimationSpeed === 'fast' ? 150 : 300,
        fontSize: savedFontSize,
        fontFamily: savedFontFamily,
        borderRadius: savedBorderRadius,
        spacing: savedSpacing,
        sidebarCollapsed: savedSidebarCollapsed,
        compactMode: savedCompactMode,
        gridDensity: savedGridDensity,
        highContrast: savedHighContrast,
        focusVisible: savedFocusVisible,
        keyboardNavigation: savedKeyboardNavigation
      };

      dispatch({
        type: THEME_ACTIONS.INITIALIZE_SUCCESS,
        payload: initialConfig
      });

      // Aplicar configuración al DOM
      applyThemeToDOM(initialConfig);

    } catch (error) {
      console.error('Error al inicializar configuración de tema:', error);
      dispatch({
        type: THEME_ACTIONS.INITIALIZE_FAILURE,
        payload: 'Error al cargar configuración de tema'
      });
    }
  }, [getItem, detectSystemPreference, detectReducedMotion]);

  /**
   * Aplicar configuración de tema al DOM
   */
  const applyThemeToDOM = useCallback((config) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    // Aplicar tema
    root.setAttribute('data-theme', config.isDarkMode ? 'dark' : 'light');
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${config.colorScheme}`);
    
    // Aplicar colores
    root.style.setProperty('--primary-color', config.primaryColor);
    root.style.setProperty('--accent-color', config.accentColor);
    
    // Aplicar tipografía
    root.style.setProperty('--font-size-base', getFontSizeValue(config.fontSize));
    root.style.setProperty('--font-family-base', getFontFamilyValue(config.fontFamily));
    
    // Aplicar border radius
    root.style.setProperty('--border-radius-base', getBorderRadiusValue(config.borderRadius));
    
    // Aplicar espaciado
    root.style.setProperty('--spacing-base', getSpacingValue(config.spacing));
    
    // Aplicar configuración de animaciones
    root.style.setProperty('--transition-duration', `${config.transitionDuration}ms`);
    root.style.setProperty('--animation-speed', config.animationSpeed);
    
    // Configurar clases de accesibilidad
    if (config.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (config.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    if (!config.animationsEnabled) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }
  }, []);

  /**
   * Obtener valor de tamaño de fuente
   */
  const getFontSizeValue = useCallback((size) => {
    const sizes = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '20px'
    };
    return sizes[size] || sizes.medium;
  }, []);

  /**
   * Obtener valor de familia de fuente
   */
  const getFontFamilyValue = useCallback((family) => {
    const families = {
      'inter': 'Inter, system-ui, sans-serif',
      'roboto': 'Roboto, system-ui, sans-serif',
      'open-sans': '"Open Sans", system-ui, sans-serif'
    };
    return families[family] || families.inter;
  }, []);

  /**
   * Obtener valor de border radius
   */
  const getBorderRadiusValue = useCallback((radius) => {
    const radii = {
      'none': '0px',
      'small': '4px',
      'normal': '8px',
      'large': '12px',
      'full': '9999px'
    };
    return radii[radius] || radii.normal;
  }, []);

  /**
   * Obtener valor de espaciado
   */
  const getSpacingValue = useCallback((spacing) => {
    const spacings = {
      'compact': '0.75rem',
      'normal': '1rem',
      'comfortable': '1.25rem'
    };
    return spacings[spacing] || spacings.normal;
  }, []);

  /**
   * Cambiar tema
   */
  const setTheme = useCallback((newTheme) => {
    dispatch({ type: THEME_ACTIONS.SET_THEME, payload: newTheme });
    setItem('theme', newTheme);
    
    const isDarkMode = newTheme === 'dark' || (newTheme === 'auto' && state.systemPreference === 'dark');
    applyThemeToDOM({ ...state, theme: newTheme, isDarkMode });
  }, [state, setItem, applyThemeToDOM]);

  /**
   * Alternar tema entre claro y oscuro
   */
  const toggleTheme = useCallback(() => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [state.theme, setTheme]);

  /**
   * Configurar color primario
   */
  const setPrimaryColor = useCallback((color) => {
    dispatch({ type: THEME_ACTIONS.SET_PRIMARY_COLOR, payload: color });
    setItem('primaryColor', color);
    applyThemeToDOM({ ...state, primaryColor: color });
  }, [state, setItem, applyThemeToDOM]);

  /**
   * Configurar color de acento
   */
  const setAccentColor = useCallback((color) => {
    dispatch({ type: THEME_ACTIONS.SET_ACCENT_COLOR, payload: color });
    setItem('accentColor', color);
    applyThemeToDOM({ ...state, accentColor: color });
  }, [state, setItem, applyThemeToDOM]);

  /**
   * Configurar esquema de colores
   */
  const setColorScheme = useCallback((scheme) => {
    dispatch({ type: THEME_ACTIONS.SET_COLOR_SCHEME, payload: scheme });
    setItem('colorScheme', scheme);
    applyThemeToDOM({ ...state, colorScheme: scheme });
  }, [state, setItem, applyThemeToDOM]);

  /**
   * Configurar animaciones
   */
  const setAnimationsEnabled = useCallback((enabled) => {
    dispatch({ type: THEME_ACTIONS.SET_ANIMATIONS_ENABLED, payload: enabled });
    setItem('animationsEnabled', enabled);
    applyThemeToDOM({ ...state, animationsEnabled: enabled });
  }, [state, setItem, applyThemeToDOM]);

  /**
   * Configurar velocidad de animación
   */
  const setAnimationSpeed = useCallback((speed) => {
    const transitionDuration = speed === 'slow' ? 500 : speed === 'fast' ? 150 : 300;
    dispatch({ type: THEME_ACTIONS.SET_ANIMATION_SPEED, payload: speed });
    setItem('animationSpeed', speed);
    applyThemeToDOM({ ...state, animationSpeed: speed, transitionDuration });
  }, [state, setItem, applyThemeToDOM]);

  /**
   * Configurar tamaño de fuente
   */
  const setFontSize = useCallback((size) => {
    dispatch({ type: THEME_ACTIONS.SET_FONT_SIZE, payload: size });
    setItem('fontSize', size);
    applyThemeToDOM({ ...state, fontSize: size });
  }, [state, setItem, applyThemeToDOM]);

  /**
   * Configurar familia de fuente
   */
  const setFontFamily = useCallback((family) => {
    dispatch({ type: THEME_ACTIONS.SET_FONT_FAMILY, payload: family });
    setItem('fontFamily', family);
    applyThemeToDOM({ ...state, fontFamily: family });
  }, [state, setItem, applyThemeToDOM]);

  /**
   * Configurar sidebar colapsado
   */
  const setSidebarCollapsed = useCallback((collapsed) => {
    dispatch({ type: THEME_ACTIONS.SET_SIDEBAR_COLLAPSED, payload: collapsed });
    setItem('sidebarCollapsed', collapsed);
  }, [setItem]);

  /**
   * Configurar modo compacto
   */
  const setCompactMode = useCallback((compact) => {
    dispatch({ type: THEME_ACTIONS.SET_COMPACT_MODE, payload: compact });
    setItem('compactMode', compact);
  }, [setItem]);

  /**
   * Configurar alto contraste
   */
  const setHighContrast = useCallback((highContrast) => {
    dispatch({ type: THEME_ACTIONS.SET_HIGH_CONTRAST, payload: highContrast });
    setItem('highContrast', highContrast);
    applyThemeToDOM({ ...state, highContrast });
  }, [state, setItem, applyThemeToDOM]);

  /**
   * Actualizar múltiples configuraciones
   */
  const updateSettings = useCallback((settings) => {
    dispatch({ type: THEME_ACTIONS.UPDATE_SETTINGS, payload: settings });
    
    // Guardar cada configuración individual
    Object.entries(settings).forEach(([key, value]) => {
      setItem(key, value);
    });
    
    applyThemeToDOM({ ...state, ...settings });
  }, [state, setItem, applyThemeToDOM]);

  /**
   * Resetear a configuración por defecto
   */
  const resetToDefaults = useCallback(() => {
    dispatch({ type: THEME_ACTIONS.RESET_TO_DEFAULTS });
    
    // Limpiar localStorage
    const keysToRemove = [
      'theme', 'primaryColor', 'accentColor', 'colorScheme',
      'animationsEnabled', 'animationSpeed', 'fontSize', 'fontFamily',
      'borderRadius', 'spacing', 'sidebarCollapsed', 'compactMode',
      'gridDensity', 'highContrast', 'focusVisible', 'keyboardNavigation'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Reaplicar configuración por defecto
    applyThemeToDOM(initialState);
  }, [applyThemeToDOM]);

  /**
   * Limpiar errores
   */
  const clearError = useCallback(() => {
    dispatch({ type: THEME_ACTIONS.CLEAR_ERROR });
  }, []);

  // Escuchar cambios en preferencia de tema del sistema
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const systemPreference = e.matches ? 'dark' : 'light';
      dispatch({ type: THEME_ACTIONS.SET_SYSTEM_PREFERENCE, payload: systemPreference });
      
      if (state.theme === 'auto') {
        applyThemeToDOM({ ...state, systemPreference, isDarkMode: e.matches });
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state, applyThemeToDOM]);

  // Escuchar cambios en preferencia de movimiento reducido
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e) => {
      const reducedMotion = e.matches;
      dispatch({ type: THEME_ACTIONS.SET_REDUCED_MOTION, payload: reducedMotion });
      applyThemeToDOM({ ...state, reducedMotion, animationsEnabled: reducedMotion ? false : state.animationsEnabled });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state, applyThemeToDOM]);

  // Inicializar al montar el componente
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Aplicar cambios al DOM cuando el estado cambie
  useEffect(() => {
    if (state.isInitialized) {
      applyThemeToDOM(state);
    }
  }, [state, applyThemeToDOM]);

  // Valor del contexto
  const contextValue = {
    // Estado
    ...state,
    
    // Acciones de tema
    setTheme,
    toggleTheme,
    
    // Acciones de colores
    setPrimaryColor,
    setAccentColor,
    setColorScheme,
    
    // Acciones de animaciones
    setAnimationsEnabled,
    setAnimationSpeed,
    
    // Acciones de tipografía y UI
    setFontSize,
    setFontFamily,
    
    // Acciones de layout
    setSidebarCollapsed,
    setCompactMode,
    
    // Acciones de accesibilidad
    setHighContrast,
    
    // Utilidades
    updateSettings,
    resetToDefaults,
    clearError,
    
    // Funciones auxiliares
    getFontSizeValue,
    getFontFamilyValue,
    getBorderRadiusValue,
    getSpacingValue
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook para usar el contexto de tema
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  
  return context;
};

/**
 * Hook simplificado para obtener solo el estado del tema
 */
export const useThemeMode = () => {
  const { theme, isDarkMode, toggleTheme, setTheme } = useTheme();
  
  return {
    theme,
    isDarkMode,
    toggleTheme,
    setTheme
  };
};

/**
 * Hook para obtener configuraciones de animación
 */
export const useAnimationConfig = () => {
  const { 
    animationsEnabled, 
    reducedMotion, 
    animationSpeed, 
    transitionDuration,
    setAnimationsEnabled,
    setAnimationSpeed 
  } = useTheme();
  
  return {
    enabled: animationsEnabled && !reducedMotion,
    speed: animationSpeed,
    duration: transitionDuration,
    reducedMotion,
    setEnabled: setAnimationsEnabled,
    setSpeed: setAnimationSpeed
  };
};

/**
 * HOC para inyectar props de tema
 * @param {React.Component} Component - Componente a envolver
 */
export const withTheme = (Component) => {
  return function ThemedComponent(props) {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
};

export default ThemeContext;