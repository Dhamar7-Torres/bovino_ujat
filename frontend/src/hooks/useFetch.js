import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';

/**
 * Hook personalizado para manejo de peticiones HTTP
 * Incluye estados de carga, caché, reintentos y cancelación
 */
const useFetch = (url, options = {}) => {
  // Estados principales
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  // Configuración del hook
  const {
    immediate = true,          // Ejecutar automáticamente al montar
    cacheKey = null,          // Clave para caché
    cacheDuration = 300000,   // Duración del caché en ms (5 minutos)
    retries = 3,              // Número de reintentos
    retryDelay = 1000,        // Delay entre reintentos en ms
    timeout = 30000,          // Timeout de la petición en ms
    onSuccess = null,         // Callback de éxito
    onError = null,           // Callback de error
    transform = null,         // Función para transformar los datos
    dependencies = [],        // Dependencias para re-ejecutar
    method = 'GET',           // Método HTTP
    headers = {},             // Headers adicionales
    body = null               // Cuerpo de la petición
  } = options;

  // Referencias para control de peticiones
  const abortControllerRef = useRef(null);
  const retryCountRef = useRef(0);
  const cacheRef = useRef(new Map());

  /**
   * Función principal para ejecutar la petición
   * @param {Object} overrideOptions - Opciones para sobrescribir
   */
  const execute = useCallback(async (overrideOptions = {}) => {
    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();

    // Combinar opciones
    const finalOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...overrideOptions.headers
      },
      signal: abortControllerRef.current.signal,
      timeout,
      ...overrideOptions
    };

    // Agregar body si es necesario
    if (body && ['POST', 'PUT', 'PATCH'].includes(finalOptions.method)) {
      finalOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const finalUrl = overrideOptions.url || url;

    try {
      setLoading(true);
      setError(null);

      // Verificar caché si está habilitado
      if (cacheKey && finalOptions.method === 'GET') {
        const cached = getCachedData(cacheKey);
        if (cached) {
          setData(cached);
          setLoading(false);
          return { success: true, data: cached, fromCache: true };
        }
      }

      // Configurar timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout);
      });

      // Ejecutar petición con timeout
      const responsePromise = api({
        url: finalUrl,
        ...finalOptions
      });

      const response = await Promise.race([responsePromise, timeoutPromise]);

      // Verificar si la respuesta es exitosa
      if (response.status >= 200 && response.status < 300) {
        let responseData = response.data;

        // Aplicar transformación si existe
        if (transform && typeof transform === 'function') {
          responseData = transform(responseData);
        }

        // Guardar en caché si está habilitado
        if (cacheKey && finalOptions.method === 'GET') {
          setCachedData(cacheKey, responseData);
        }

        setData(responseData);
        retryCountRef.current = 0;

        // Ejecutar callback de éxito
        if (onSuccess) {
          onSuccess(responseData);
        }

        return { success: true, data: responseData };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      // No mostrar error si la petición fue cancelada
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return { success: false, canceled: true };
      }

      console.error('Error en petición:', err);

      // Lógica de reintentos
      if (retryCountRef.current < retries) {
        retryCountRef.current += 1;
        
        // Esperar antes del reintento
        await new Promise(resolve => setTimeout(resolve, retryDelay * retryCountRef.current));
        
        // Reintento recursivo
        return execute(overrideOptions);
      }

      const errorMessage = err.response?.data?.message || err.message || 'Error de conexión';
      setError(errorMessage);

      // Ejecutar callback de error
      if (onError) {
        onError(err);
      }

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      setIsValidating(false);
    }
  }, [
    url, method, headers, body, cacheKey, retries, retryDelay, timeout,
    onSuccess, onError, transform
  ]);

  /**
   * Función para revalidar los datos (re-fetch sin caché)
   */
  const mutate = useCallback(async (newData = null, shouldRevalidate = true) => {
    if (newData !== null) {
      // Actualización optimista
      setData(newData);
      
      // Actualizar caché si existe
      if (cacheKey) {
        setCachedData(cacheKey, newData);
      }
    }

    if (shouldRevalidate) {
      setIsValidating(true);
      return execute();
    }

    return { success: true, data: newData };
  }, [execute, cacheKey]);

  /**
   * Función POST simplificada
   * @param {Object} postData - Datos a enviar
   * @param {Object} postOptions - Opciones adicionales
   */
  const post = useCallback(async (postData, postOptions = {}) => {
    return execute({
      method: 'POST',
      body: postData,
      ...postOptions
    });
  }, [execute]);

  /**
   * Función PUT simplificada
   * @param {Object} putData - Datos a enviar
   * @param {Object} putOptions - Opciones adicionales
   */
  const put = useCallback(async (putData, putOptions = {}) => {
    return execute({
      method: 'PUT',
      body: putData,
      ...putOptions
    });
  }, [execute]);

  /**
   * Función PATCH simplificada
   * @param {Object} patchData - Datos a enviar
   * @param {Object} patchOptions - Opciones adicionales
   */
  const patch = useCallback(async (patchData, patchOptions = {}) => {
    return execute({
      method: 'PATCH',
      body: patchData,
      ...patchOptions
    });
  }, [execute]);

  /**
   * Función DELETE simplificada
   * @param {Object} deleteOptions - Opciones adicionales
   */
  const remove = useCallback(async (deleteOptions = {}) => {
    return execute({
      method: 'DELETE',
      ...deleteOptions
    });
  }, [execute]);

  /**
   * Función para cancelar la petición actual
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  /**
   * Función para limpiar el caché
   * @param {string} key - Clave específica del caché (opcional)
   */
  const clearCache = useCallback((key = null) => {
    if (key) {
      cacheRef.current.delete(key);
    } else {
      cacheRef.current.clear();
    }
  }, []);

  /**
   * Función para obtener datos del caché
   * @param {string} key - Clave del caché
   */
  const getCachedData = useCallback((key) => {
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      return cached.data;
    }
    // Limpiar caché expirado
    cacheRef.current.delete(key);
    return null;
  }, [cacheDuration]);

  /**
   * Función para guardar datos en caché
   * @param {string} key - Clave del caché
   * @param {any} data - Datos a guardar
   */
  const setCachedData = useCallback((key, data) => {
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now()
    });
  }, []);

  /**
   * Función para refrescar los datos
   */
  const refresh = useCallback(() => {
    if (cacheKey) {
      clearCache(cacheKey);
    }
    return execute();
  }, [execute, cacheKey, clearCache]);

  /**
   * Función para verificar si hay datos en caché
   */
  const hasCachedData = useCallback(() => {
    return cacheKey ? getCachedData(cacheKey) !== null : false;
  }, [cacheKey, getCachedData]);

  // Ejecutar petición inicial si immediate es true
  useEffect(() => {
    if (immediate && url) {
      execute();
    }

    // Cleanup al desmontar
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, url, ...dependencies]);

  // Limpiar referencia del AbortController cuando se complete la petición
  useEffect(() => {
    if (!loading && !isValidating) {
      abortControllerRef.current = null;
    }
  }, [loading, isValidating]);

  return {
    // Estados
    data,
    loading,
    error,
    isValidating,
    
    // Acciones principales
    execute,
    mutate,
    refresh,
    cancel,
    
    // Métodos HTTP
    post,
    put,
    patch,
    remove,
    
    // Manejo de caché
    clearCache,
    hasCachedData,
    
    // Utilidades
    clearError: () => setError(null),
    isLoading: loading || isValidating,
    isError: error !== null,
    isSuccess: data !== null && error === null,
    
    // Información adicional
    retryCount: retryCountRef.current,
    
    // Funciones helper para casos comunes
    reload: refresh,
    reset: () => {
      setData(null);
      setError(null);
      setLoading(false);
      setIsValidating(false);
      retryCountRef.current = 0;
    }
  };
};

/**
 * Hook especializado para GET requests con SWR-like behavior
 * @param {string} url - URL del endpoint
 * @param {Object} options - Opciones del hook
 */
export const useGet = (url, options = {}) => {
  return useFetch(url, {
    method: 'GET',
    immediate: true,
    ...options
  });
};

/**
 * Hook especializado para requests que no se ejecutan automáticamente
 * @param {string} url - URL del endpoint
 * @param {Object} options - Opciones del hook
 */
export const useLazyFetch = (url, options = {}) => {
  return useFetch(url, {
    immediate: false,
    ...options
  });
};

/**
 * Hook para manejar múltiples peticiones en paralelo
 * @param {Array} urls - Array de URLs o configuraciones
 * @param {Object} options - Opciones globales
 */
export const useParallelFetch = (urls, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const execute = useCallback(async () => {
    setLoading(true);
    setErrors([]);

    try {
      const promises = urls.map((urlConfig, index) => {
        const config = typeof urlConfig === 'string' 
          ? { url: urlConfig } 
          : urlConfig;
        
        return api({
          method: 'GET',
          ...options,
          ...config
        }).catch(err => ({ error: err, index }));
      });

      const results = await Promise.all(promises);
      
      const successData = [];
      const errorData = [];

      results.forEach((result, index) => {
        if (result.error) {
          errorData[index] = result.error;
        } else {
          successData[index] = result.data;
        }
      });

      setData(successData);
      setErrors(errorData);
    } catch (err) {
      console.error('Error en peticiones paralelas:', err);
      setErrors([err]);
    } finally {
      setLoading(false);
    }
  }, [urls, options]);

  useEffect(() => {
    if (urls.length > 0) {
      execute();
    }
  }, [execute]);

  return {
    data,
    loading,
    errors,
    execute,
    hasErrors: errors.length > 0,
    isSuccess: data.length > 0 && errors.length === 0
  };
};

export default useFetch;