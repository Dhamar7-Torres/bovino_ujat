import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para manejo de localStorage
 * Incluye serialización automática, manejo de errores y sincronización entre pestañas
 */
const useLocalStorage = (key = null, initialValue = null) => {
  // Estados principales
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Función para verificar si localStorage está disponible
   */
  const isLocalStorageAvailable = useCallback(() => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  /**
   * Función para serializar datos antes de guardar
   * @param {any} data - Datos a serializar
   */
  const serialize = useCallback((data) => {
    try {
      return JSON.stringify(data);
    } catch (err) {
      console.error('Error al serializar datos:', err);
      throw new Error('No se pudo serializar el dato');
    }
  }, []);

  /**
   * Función para deserializar datos después de leer
   * @param {string} data - Datos serializados
   */
  const deserialize = useCallback((data) => {
    try {
      return JSON.parse(data);
    } catch (err) {
      // Si no se puede parsear, devolver el valor original
      return data;
    }
  }, []);

  /**
   * Función para obtener un item del localStorage
   * @param {string} itemKey - Clave del item
   * @param {any} defaultValue - Valor por defecto si no existe
   */
  const getItem = useCallback((itemKey, defaultValue = null) => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage no está disponible');
      return defaultValue;
    }

    try {
      setError(null);
      const item = localStorage.getItem(itemKey);
      
      if (item === null) {
        return defaultValue;
      }

      return deserialize(item);
    } catch (err) {
      console.error('Error al obtener item del localStorage:', err);
      setError(`Error al obtener ${itemKey}: ${err.message}`);
      return defaultValue;
    }
  }, [isLocalStorageAvailable, deserialize]);

  /**
   * Función para guardar un item en localStorage
   * @param {string} itemKey - Clave del item
   * @param {any} itemValue - Valor a guardar
   */
  const setItem = useCallback((itemKey, itemValue) => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage no está disponible');
      return false;
    }

    try {
      setError(null);
      setLoading(true);

      // Si el valor es undefined o null, remover el item
      if (itemValue === undefined || itemValue === null) {
        localStorage.removeItem(itemKey);
        return true;
      }

      const serializedValue = serialize(itemValue);
      localStorage.setItem(itemKey, serializedValue);

      // Disparar evento personalizado para sincronización
      window.dispatchEvent(new CustomEvent('localStorageChange', {
        detail: { key: itemKey, value: itemValue, action: 'set' }
      }));

      return true;
    } catch (err) {
      console.error('Error al guardar item en localStorage:', err);
      setError(`Error al guardar ${itemKey}: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isLocalStorageAvailable, serialize]);

  /**
   * Función para remover un item del localStorage
   * @param {string} itemKey - Clave del item a remover
   */
  const removeItem = useCallback((itemKey) => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage no está disponible');
      return false;
    }

    try {
      setError(null);
      localStorage.removeItem(itemKey);

      // Disparar evento personalizado para sincronización
      window.dispatchEvent(new CustomEvent('localStorageChange', {
        detail: { key: itemKey, value: null, action: 'remove' }
      }));

      return true;
    } catch (err) {
      console.error('Error al remover item del localStorage:', err);
      setError(`Error al remover ${itemKey}: ${err.message}`);
      return false;
    }
  }, [isLocalStorageAvailable]);

  /**
   * Función para limpiar todo el localStorage
   */
  const clear = useCallback(() => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage no está disponible');
      return false;
    }

    try {
      setError(null);
      localStorage.clear();

      // Disparar evento personalizado para sincronización
      window.dispatchEvent(new CustomEvent('localStorageChange', {
        detail: { key: null, value: null, action: 'clear' }
      }));

      return true;
    } catch (err) {
      console.error('Error al limpiar localStorage:', err);
      setError(`Error al limpiar localStorage: ${err.message}`);
      return false;
    }
  }, [isLocalStorageAvailable]);

  /**
   * Función para obtener todas las claves del localStorage
   */
  const getAllKeys = useCallback(() => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage no está disponible');
      return [];
    }

    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
      }
      return keys;
    } catch (err) {
      console.error('Error al obtener claves del localStorage:', err);
      setError(`Error al obtener claves: ${err.message}`);
      return [];
    }
  }, [isLocalStorageAvailable]);

  /**
   * Función para obtener todos los items del localStorage con un prefijo
   * @param {string} prefix - Prefijo de las claves
   */
  const getItemsByPrefix = useCallback((prefix) => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage no está disponible');
      return {};
    }

    try {
      const items = {};
      const keys = getAllKeys();
      
      keys.forEach(keyName => {
        if (keyName && keyName.startsWith(prefix)) {
          items[keyName] = getItem(keyName);
        }
      });

      return items;
    } catch (err) {
      console.error('Error al obtener items por prefijo:', err);
      setError(`Error al obtener items con prefijo ${prefix}: ${err.message}`);
      return {};
    }
  }, [isLocalStorageAvailable, getAllKeys, getItem]);

  /**
   * Función para verificar si existe una clave en localStorage
   * @param {string} itemKey - Clave a verificar
   */
  const hasItem = useCallback((itemKey) => {
    if (!isLocalStorageAvailable()) {
      return false;
    }

    try {
      return localStorage.getItem(itemKey) !== null;
    } catch (err) {
      console.error('Error al verificar existencia de item:', err);
      return false;
    }
  }, [isLocalStorageAvailable]);

  /**
   * Función para obtener el tamaño usado del localStorage en bytes
   */
  const getStorageSize = useCallback(() => {
    if (!isLocalStorageAvailable()) {
      return 0;
    }

    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (err) {
      console.error('Error al calcular tamaño del localStorage:', err);
      return 0;
    }
  }, [isLocalStorageAvailable]);

  /**
   * Función para exportar todos los datos del localStorage
   */
  const exportData = useCallback(() => {
    if (!isLocalStorageAvailable()) {
      return null;
    }

    try {
      const data = {};
      const keys = getAllKeys();
      
      keys.forEach(keyName => {
        if (keyName) {
          data[keyName] = getItem(keyName);
        }
      });

      return {
        timestamp: new Date().toISOString(),
        data: data,
        count: keys.length,
        size: getStorageSize()
      };
    } catch (err) {
      console.error('Error al exportar datos:', err);
      setError(`Error al exportar datos: ${err.message}`);
      return null;
    }
  }, [isLocalStorageAvailable, getAllKeys, getItem, getStorageSize]);

  /**
   * Función para importar datos al localStorage
   * @param {Object} importData - Datos a importar
   * @param {boolean} overwrite - Si sobrescribir datos existentes
   */
  const importData = useCallback((importData, overwrite = false) => {
    if (!isLocalStorageAvailable()) {
      return false;
    }

    try {
      setError(null);
      setLoading(true);

      if (!importData || !importData.data) {
        throw new Error('Formato de datos inválido');
      }

      let imported = 0;
      let skipped = 0;

      Object.entries(importData.data).forEach(([keyName, keyValue]) => {
        if (overwrite || !hasItem(keyName)) {
          setItem(keyName, keyValue);
          imported++;
        } else {
          skipped++;
        }
      });

      console.log(`Importación completada: ${imported} importados, ${skipped} omitidos`);
      return { imported, skipped, total: imported + skipped };
    } catch (err) {
      console.error('Error al importar datos:', err);
      setError(`Error al importar datos: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isLocalStorageAvailable, hasItem, setItem]);

  /**
   * Función para limpiar items expirados
   * @param {string} prefix - Prefijo de items con timestamp
   */
  const cleanExpiredItems = useCallback((prefix = '', maxAge = 86400000) => { // 24 horas por defecto
    if (!isLocalStorageAvailable()) {
      return 0;
    }

    try {
      const now = Date.now();
      const keys = getAllKeys();
      let cleaned = 0;

      keys.forEach(keyName => {
        if (keyName && keyName.startsWith(prefix)) {
          const item = getItem(keyName);
          
          // Verificar si el item tiene timestamp y está expirado
          if (item && typeof item === 'object' && item.timestamp) {
            const itemAge = now - new Date(item.timestamp).getTime();
            if (itemAge > maxAge) {
              removeItem(keyName);
              cleaned++;
            }
          }
        }
      });

      console.log(`Limpieza completada: ${cleaned} items removidos`);
      return cleaned;
    } catch (err) {
      console.error('Error al limpiar items expirados:', err);
      setError(`Error en limpieza: ${err.message}`);
      return 0;
    }
  }, [isLocalStorageAvailable, getAllKeys, getItem, removeItem]);

  /**
   * Función para guardar datos con timestamp automático
   * @param {string} itemKey - Clave del item
   * @param {any} itemValue - Valor a guardar
   * @param {number} ttl - Tiempo de vida en milisegundos (opcional)
   */
  const setItemWithTimestamp = useCallback((itemKey, itemValue, ttl = null) => {
    const dataWithTimestamp = {
      value: itemValue,
      timestamp: new Date().toISOString(),
      ttl: ttl
    };
    
    return setItem(itemKey, dataWithTimestamp);
  }, [setItem]);

  /**
   * Función para obtener datos con verificación de expiración
   * @param {string} itemKey - Clave del item
   * @param {any} defaultValue - Valor por defecto
   */
  const getItemWithTimestamp = useCallback((itemKey, defaultValue = null) => {
    const item = getItem(itemKey, null);
    
    if (!item || typeof item !== 'object' || !item.timestamp) {
      return defaultValue;
    }

    // Verificar TTL si existe
    if (item.ttl) {
      const now = Date.now();
      const itemTime = new Date(item.timestamp).getTime();
      const age = now - itemTime;
      
      if (age > item.ttl) {
        removeItem(itemKey);
        return defaultValue;
      }
    }

    return item.value;
  }, [getItem, removeItem]);

  // Inicializar valor si se proporciona una clave
  useEffect(() => {
    if (key) {
      const storedValue = getItem(key, initialValue);
      setValue(storedValue);
    }
  }, [key, initialValue, getItem]);

  // Actualizar localStorage cuando cambia el valor (solo si se proporciona una clave)
  useEffect(() => {
    if (key && value !== initialValue) {
      setItem(key, value);
    }
  }, [key, value, initialValue, setItem]);

  // Escuchar cambios de localStorage en otras pestañas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (key && e.key === key) {
        setValue(deserialize(e.newValue) || initialValue);
      }
    };

    const handleCustomStorageChange = (e) => {
      if (key && e.detail.key === key) {
        setValue(e.detail.value || initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange);
    };
  }, [key, initialValue, deserialize]);

  return {
    // Estado actual (solo si se proporciona una clave)
    value: key ? value : undefined,
    setValue: key ? setValue : undefined,
    loading,
    error,
    
    // Funciones principales
    getItem,
    setItem,
    removeItem,
    clear,
    
    // Funciones de consulta
    hasItem,
    getAllKeys,
    getItemsByPrefix,
    
    // Funciones de utilidad
    getStorageSize,
    exportData,
    importData,
    cleanExpiredItems,
    
    // Funciones con timestamp
    setItemWithTimestamp,
    getItemWithTimestamp,
    
    // Estado de soporte
    isSupported: isLocalStorageAvailable(),
    
    // Funciones auxiliares
    clearError: () => setError(null),
    
    // Estadísticas
    totalKeys: getAllKeys().length,
    storageSize: getStorageSize(),
    storageSizeFormatted: `${(getStorageSize() / 1024).toFixed(2)} KB`
  };
};

/**
 * Hook especializado para manejar configuraciones de usuario
 * @param {Object} defaultSettings - Configuraciones por defecto
 */
export const useUserSettings = (defaultSettings = {}) => {
  const {
    value: settings,
    setValue: setSettings,
    loading,
    error
  } = useLocalStorage('userSettings', defaultSettings);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, [setSettings]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, [setSettings, defaultSettings]);

  const getSetting = useCallback((key, defaultValue = null) => {
    return settings?.[key] ?? defaultValue;
  }, [settings]);

  return {
    settings,
    updateSetting,
    resetSettings,
    getSetting,
    loading,
    error
  };
};

/**
 * Hook especializado para manejar caché de datos
 * @param {string} cachePrefix - Prefijo para las claves de caché
 * @param {number} defaultTTL - TTL por defecto en milisegundos
 */
export const useCache = (cachePrefix = 'cache_', defaultTTL = 300000) => {
  const { 
    setItemWithTimestamp, 
    getItemWithTimestamp, 
    removeItem,
    cleanExpiredItems,
    getItemsByPrefix 
  } = useLocalStorage();

  const setCache = useCallback((key, data, ttl = defaultTTL) => {
    const cacheKey = `${cachePrefix}${key}`;
    return setItemWithTimestamp(cacheKey, data, ttl);
  }, [cachePrefix, defaultTTL, setItemWithTimestamp]);

  const getCache = useCallback((key, defaultValue = null) => {
    const cacheKey = `${cachePrefix}${key}`;
    return getItemWithTimestamp(cacheKey, defaultValue);
  }, [cachePrefix, getItemWithTimestamp]);

  const clearCache = useCallback((key = null) => {
    if (key) {
      const cacheKey = `${cachePrefix}${key}`;
      return removeItem(cacheKey);
    } else {
      // Limpiar todo el caché con el prefijo
      const items = getItemsByPrefix(cachePrefix);
      Object.keys(items).forEach(cacheKey => {
        removeItem(cacheKey);
      });
      return true;
    }
  }, [cachePrefix, removeItem, getItemsByPrefix]);

  const cleanExpiredCache = useCallback(() => {
    return cleanExpiredItems(cachePrefix, defaultTTL);
  }, [cachePrefix, defaultTTL, cleanExpiredItems]);

  return {
    setCache,
    getCache,
    clearCache,
    cleanExpiredCache
  };
};

export default useLocalStorage;