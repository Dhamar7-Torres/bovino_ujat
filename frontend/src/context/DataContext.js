/**
 * DataContext.js - Contexto para manejo de datos globales de la aplicación
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial de datos
const initialState = {
  isLoading: false,
  error: null,
  lastUpdated: null,
  
  // Datos del rancho
  ranch: {
    id: 1,
    name: 'Rancho El Paraíso',
    location: 'Santiago de Querétaro, QRO',
    area: 150, // hectáreas
    established: '2010-03-15',
    owner: 'Juan Pérez',
    contact: {
      phone: '+52 442 123 4567',
      email: 'info@ranchoelparaiso.com',
      address: 'Carretera a San Luis Potosí Km 25, Santiago de Querétaro'
    }
  },

  // Estadísticas generales
  stats: {
    totalBovines: 247,
    totalFarms: 1,
    totalUsers: 5,
    totalAlerts: 8
  },

  // Configuración global
  settings: {
    currency: 'MXN',
    language: 'es',
    timezone: 'America/Mexico_City',
    dateFormat: 'DD/MM/YYYY',
    temperatureUnit: 'celsius',
    weightUnit: 'kg',
    distanceUnit: 'km',
    volumeUnit: 'liters'
  },

  // Cache de datos frecuentemente usados
  cache: {
    bovineTypes: [
      { id: 1, name: 'Holstein', description: 'Raza lechera' },
      { id: 2, name: 'Angus', description: 'Raza cárnica' },
      { id: 3, name: 'Jersey', description: 'Raza lechera pequeña' },
      { id: 4, name: 'Charolais', description: 'Raza cárnica francesa' }
    ],
    healthStatuses: [
      { id: 'healthy', name: 'Saludable', color: 'green' },
      { id: 'sick', name: 'Enfermo', color: 'red' },
      { id: 'recovering', name: 'En recuperación', color: 'yellow' },
      { id: 'observation', name: 'En observación', color: 'blue' }
    ],
    vaccineTypes: [
      { id: 1, name: 'Aftosa', description: 'Fiebre aftosa' },
      { id: 2, name: 'Rabia', description: 'Rabia bovina' },
      { id: 3, name: 'Brucelosis', description: 'Brucella abortus' },
      { id: 4, name: 'Tuberculosis', description: 'Tuberculosis bovina' }
    ],
    treatmentTypes: [
      { id: 1, name: 'Antibiótico', category: 'Medicamento' },
      { id: 2, name: 'Antiinflamatorio', category: 'Medicamento' },
      { id: 3, name: 'Vitaminas', category: 'Suplemento' },
      { id: 4, name: 'Desparasitante', category: 'Preventivo' }
    ]
  },

  // Estado de conexión
  connection: {
    isOnline: navigator.onLine,
    lastSync: null,
    pendingSync: []
  }
};

// Acciones del reducer
const DATA_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_STATS: 'UPDATE_STATS',
  UPDATE_RANCH: 'UPDATE_RANCH',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  UPDATE_CACHE: 'UPDATE_CACHE',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
  SET_LAST_SYNC: 'SET_LAST_SYNC',
  ADD_PENDING_SYNC: 'ADD_PENDING_SYNC',
  REMOVE_PENDING_SYNC: 'REMOVE_PENDING_SYNC',
  SET_LAST_UPDATED: 'SET_LAST_UPDATED',
  RESET_DATA: 'RESET_DATA'
};

// Reducer de datos
const dataReducer = (state, action) => {
  switch (action.type) {
    case DATA_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case DATA_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case DATA_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case DATA_ACTIONS.UPDATE_STATS:
      return {
        ...state,
        stats: { ...state.stats, ...action.payload },
        lastUpdated: new Date().toISOString()
      };

    case DATA_ACTIONS.UPDATE_RANCH:
      return {
        ...state,
        ranch: { ...state.ranch, ...action.payload },
        lastUpdated: new Date().toISOString()
      };

    case DATA_ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
        lastUpdated: new Date().toISOString()
      };

    case DATA_ACTIONS.UPDATE_CACHE:
      return {
        ...state,
        cache: { ...state.cache, ...action.payload },
        lastUpdated: new Date().toISOString()
      };

    case DATA_ACTIONS.SET_CONNECTION_STATUS:
      return {
        ...state,
        connection: {
          ...state.connection,
          isOnline: action.payload
        }
      };

    case DATA_ACTIONS.SET_LAST_SYNC:
      return {
        ...state,
        connection: {
          ...state.connection,
          lastSync: action.payload
        }
      };

    case DATA_ACTIONS.ADD_PENDING_SYNC:
      return {
        ...state,
        connection: {
          ...state.connection,
          pendingSync: [...state.connection.pendingSync, action.payload]
        }
      };

    case DATA_ACTIONS.REMOVE_PENDING_SYNC:
      return {
        ...state,
        connection: {
          ...state.connection,
          pendingSync: state.connection.pendingSync.filter(
            item => item.id !== action.payload
          )
        }
      };

    case DATA_ACTIONS.SET_LAST_UPDATED:
      return {
        ...state,
        lastUpdated: action.payload
      };

    case DATA_ACTIONS.RESET_DATA:
      return {
        ...initialState,
        settings: state.settings // Mantener configuración
      };

    default:
      return state;
  }
};

// Crear el contexto
const DataContext = createContext();

// Proveedor del contexto
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Cargar configuración inicial
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        dispatch({ type: DATA_ACTIONS.SET_LOADING, payload: true });

        // Cargar configuración guardada
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          dispatch({
            type: DATA_ACTIONS.UPDATE_SETTINGS,
            payload: settings
          });
        }

        // Cargar datos del rancho guardados
        const savedRanch = localStorage.getItem('ranchData');
        if (savedRanch) {
          const ranch = JSON.parse(savedRanch);
          dispatch({
            type: DATA_ACTIONS.UPDATE_RANCH,
            payload: ranch
          });
        }

        dispatch({ type: DATA_ACTIONS.SET_LOADING, payload: false });
      } catch (error) {
        dispatch({
          type: DATA_ACTIONS.SET_ERROR,
          payload: error.message
        });
      }
    };

    loadInitialData();
  }, []);

  // Monitorear estado de conexión
  useEffect(() => {
    const handleOnline = () => {
      dispatch({
        type: DATA_ACTIONS.SET_CONNECTION_STATUS,
        payload: true
      });
    };

    const handleOffline = () => {
      dispatch({
        type: DATA_ACTIONS.SET_CONNECTION_STATUS,
        payload: false
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Guardar configuración cuando cambie
  useEffect(() => {
    if (state.settings) {
      localStorage.setItem('appSettings', JSON.stringify(state.settings));
    }
  }, [state.settings]);

  // Guardar datos del rancho cuando cambien
  useEffect(() => {
    if (state.ranch) {
      localStorage.setItem('ranchData', JSON.stringify(state.ranch));
    }
  }, [state.ranch]);

  // Funciones del contexto
  const updateStats = (newStats) => {
    dispatch({
      type: DATA_ACTIONS.UPDATE_STATS,
      payload: newStats
    });
  };

  const updateRanch = (ranchData) => {
    dispatch({
      type: DATA_ACTIONS.UPDATE_RANCH,
      payload: ranchData
    });
  };

  const updateSettings = (settings) => {
    dispatch({
      type: DATA_ACTIONS.UPDATE_SETTINGS,
      payload: settings
    });
  };

  const updateCache = (cacheData) => {
    dispatch({
      type: DATA_ACTIONS.UPDATE_CACHE,
      payload: cacheData
    });
  };

  const setError = (error) => {
    dispatch({
      type: DATA_ACTIONS.SET_ERROR,
      payload: error
    });
  };

  const clearError = () => {
    dispatch({ type: DATA_ACTIONS.CLEAR_ERROR });
  };

  const setLoading = (loading) => {
    dispatch({
      type: DATA_ACTIONS.SET_LOADING,
      payload: loading
    });
  };

  const addPendingSync = (data) => {
    const syncItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...data
    };

    dispatch({
      type: DATA_ACTIONS.ADD_PENDING_SYNC,
      payload: syncItem
    });

    return syncItem.id;
  };

  const removePendingSync = (id) => {
    dispatch({
      type: DATA_ACTIONS.REMOVE_PENDING_SYNC,
      payload: id
    });
  };

  const markLastSync = () => {
    dispatch({
      type: DATA_ACTIONS.SET_LAST_SYNC,
      payload: new Date().toISOString()
    });
  };

  const resetData = () => {
    dispatch({ type: DATA_ACTIONS.RESET_DATA });
  };

  // Funciones de utilidad
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: state.settings.currency
    });
    return formatter.format(amount);
  };

  const formatDate = (date, format = null) => {
    const dateObj = new Date(date);
    const formatToUse = format || state.settings.dateFormat;
    
    // Implementación básica - se puede mejorar con una librería como date-fns
    if (formatToUse === 'DD/MM/YYYY') {
      return dateObj.toLocaleDateString('es-MX');
    }
    return dateObj.toLocaleDateString();
  };

  const formatWeight = (weight) => {
    return `${weight} ${state.settings.weightUnit}`;
  };

  const formatTemperature = (temp) => {
    const unit = state.settings.temperatureUnit === 'celsius' ? '°C' : '°F';
    return `${temp}${unit}`;
  };

  const formatVolume = (volume) => {
    return `${volume} ${state.settings.volumeUnit}`;
  };

  const formatDistance = (distance) => {
    return `${distance} ${state.settings.distanceUnit}`;
  };

  // Función para obtener datos de cache
  const getCacheData = (key) => {
    return state.cache[key] || [];
  };

  // Función para verificar si los datos necesitan actualización
  const needsUpdate = (maxAge = 5 * 60 * 1000) => { // 5 minutos por defecto
    if (!state.lastUpdated) return true;
    
    const lastUpdate = new Date(state.lastUpdated);
    const now = new Date();
    
    return (now - lastUpdate) > maxAge;
  };

  const value = {
    ...state,
    
    // Acciones
    updateStats,
    updateRanch,
    updateSettings,
    updateCache,
    setError,
    clearError,
    setLoading,
    addPendingSync,
    removePendingSync,
    markLastSync,
    resetData,
    
    // Funciones de utilidad
    formatCurrency,
    formatDate,
    formatWeight,
    formatTemperature,
    formatVolume,
    formatDistance,
    getCacheData,
    needsUpdate
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Hook para usar el contexto
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Hook para obtener solo configuración
export const useSettings = () => {
  const { settings, updateSettings } = useData();
  return { settings, updateSettings };
};

// Hook para obtener solo datos del rancho
export const useRanch = () => {
  const { ranch, updateRanch } = useData();
  return { ranch, updateRanch };
};

// Hook para obtener solo estadísticas
export const useStats = () => {
  const { stats, updateStats } = useData();
  return { stats, updateStats };
};

export default DataContext;