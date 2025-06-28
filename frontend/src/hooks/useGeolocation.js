import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook personalizado para manejar la geolocalización
 * Proporciona funciones para obtener la ubicación actual y seguimiento en tiempo real
 */
export const useGeolocation = (options = {}) => {
  // Estados del hook
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [watchId, setWatchId] = useState(null);

  // Refs para mantener referencias
  const optionsRef = useRef(options);
  const callbacksRef = useRef({});

  // Configuración por defecto
  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000, // 5 minutos
  };

  // Verificar soporte de geolocalización
  useEffect(() => {
    setIsSupported('geolocation' in navigator);
  }, []);

  // Actualizar opciones
  useEffect(() => {
    optionsRef.current = { ...defaultOptions, ...options };
  }, [options]);

  // Función para manejar el éxito
  const handleSuccess = useCallback((pos) => {
    const locationData = {
      coords: {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        altitude: pos.coords.altitude,
        altitudeAccuracy: pos.coords.altitudeAccuracy,
        heading: pos.coords.heading,
        speed: pos.coords.speed
      },
      timestamp: pos.timestamp
    };

    setPosition(locationData);
    setError(null);
    setLoading(false);

    // Ejecutar callback de éxito si existe
    if (callbacksRef.current.onSuccess) {
      callbacksRef.current.onSuccess(locationData);
    }
  }, []);

  // Función para manejar errores
  const handleError = useCallback((err) => {
    let errorMessage = 'Error desconocido';
    
    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'Acceso a la ubicación denegado por el usuario';
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Información de ubicación no disponible';
        break;
      case err.TIMEOUT:
        errorMessage = 'Tiempo de espera agotado al obtener la ubicación';
        break;
      default:
        errorMessage = `Error de geolocalización: ${err.message}`;
    }

    setError(errorMessage);
    setLoading(false);

    // Ejecutar callback de error si existe
    if (callbacksRef.current.onError) {
      callbacksRef.current.onError(err, errorMessage);
    }
  }, []);

  // Obtener posición actual
  const getCurrentPosition = useCallback((customOptions = {}, callbacks = {}) => {
    return new Promise((resolve, reject) => {
      if (!isSupported) {
        const error = new Error('Geolocalización no soportada');
        setError(error.message);
        reject(error);
        return;
      }

      setLoading(true);
      setError(null);

      // Actualizar callbacks
      callbacksRef.current = callbacks;

      const geoOptions = { ...optionsRef.current, ...customOptions };

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleSuccess(pos);
          resolve(pos);
        },
        (err) => {
          handleError(err);
          reject(err);
        },
        geoOptions
      );
    });
  }, [isSupported, handleSuccess, handleError]);

  // Iniciar seguimiento de ubicación
  const startWatching = useCallback((customOptions = {}, callbacks = {}) => {
    if (!isSupported) {
      setError('Geolocalización no soportada');
      return null;
    }

    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }

    setLoading(true);
    setError(null);

    // Actualizar callbacks
    callbacksRef.current = callbacks;

    const geoOptions = { ...optionsRef.current, ...customOptions };

    const id = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      geoOptions
    );

    setWatchId(id);
    return id;
  }, [isSupported, watchId, handleSuccess, handleError]);

  // Detener seguimiento de ubicación
  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setLoading(false);
    }
  }, [watchId]);

  // Limpiar al desmontar el componente
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  // Calcular distancia entre dos puntos (fórmula Haversine)
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distancia en km
  }, []);

  // Verificar si una ubicación está dentro de un radio
  const isWithinRadius = useCallback((lat1, lon1, lat2, lon2, radiusKm) => {
    const distance = calculateDistance(lat1, lon1, lat2, lon2);
    return distance <= radiusKm;
  }, [calculateDistance]);

  // Obtener dirección aproximada desde coordenadas (requiere API externa)
  const reverseGeocode = useCallback(async (latitude, longitude) => {
    try {
      // Usando Nominatim de OpenStreetMap (gratuito)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Error en la geocodificación inversa');
      }
      
      const data = await response.json();
      return {
        display_name: data.display_name,
        address: data.address,
        formatted: data.display_name
      };
    } catch (error) {
      console.error('Error en geocodificación inversa:', error);
      return null;
    }
  }, []);

  // Formatear coordenadas para mostrar
  const formatCoordinates = useCallback((lat, lon, precision = 6) => {
    if (lat === null || lon === null || lat === undefined || lon === undefined) {
      return 'N/A';
    }
    
    return `${lat.toFixed(precision)}, ${lon.toFixed(precision)}`;
  }, []);

  // Obtener precisión de la ubicación en metros
  const getAccuracyText = useCallback((accuracy) => {
    if (!accuracy) return 'Precisión desconocida';
    
    if (accuracy < 10) {
      return `Muy precisa (±${accuracy.toFixed(1)}m)`;
    } else if (accuracy < 50) {
      return `Precisa (±${accuracy.toFixed(1)}m)`;
    } else if (accuracy < 100) {
      return `Moderada (±${accuracy.toFixed(1)}m)`;
    } else {
      return `Baja precisión (±${accuracy.toFixed(1)}m)`;
    }
  }, []);

  // Verificar si la ubicación es reciente
  const isLocationFresh = useCallback((timestamp, maxAgeMinutes = 5) => {
    if (!timestamp) return false;
    const now = Date.now();
    const ageMinutes = (now - timestamp) / (1000 * 60);
    return ageMinutes <= maxAgeMinutes;
  }, []);

  return {
    // Estados
    position,
    error,
    loading,
    isSupported,
    isWatching: watchId !== null,

    // Funciones principales
    getCurrentPosition,
    startWatching,
    stopWatching,

    // Utilidades
    calculateDistance,
    isWithinRadius,
    reverseGeocode,
    formatCoordinates,
    getAccuracyText,
    isLocationFresh,

    // Información adicional
    latitude: position?.coords?.latitude || null,
    longitude: position?.coords?.longitude || null,
    accuracy: position?.coords?.accuracy || null,
    timestamp: position?.timestamp || null
  };
};

// Hook simplificado para obtener ubicación una sola vez
export const useCurrentLocation = (options = {}) => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
          ...options
        });
      });

      const locationData = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp
      };

      setPosition(locationData);
      setLoading(false);
      return locationData;
    } catch (err) {
      let errorMessage = 'Error obteniendo ubicación';
      
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = 'Acceso a ubicación denegado';
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = 'Ubicación no disponible';
          break;
        case err.TIMEOUT:
          errorMessage = 'Tiempo de espera agotado';
          break;
      }

      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }, [options]);

  return {
    position,
    error,
    loading,
    getCurrentLocation
  };
};

// Hook para seguimiento continuo de ubicación
export const useLocationWatcher = (options = {}) => {
  const [positions, setPositions] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [error, setError] = useState(null);
  const [isWatching, setIsWatching] = useState(false);

  const watchIdRef = useRef(null);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation || isWatching) return;

    setIsWatching(true);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const locationData = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
          id: Date.now()
        };

        setCurrentPosition(locationData);
        setPositions(prev => [...prev, locationData]);
      },
      (err) => {
        setError(err.message);
        setIsWatching(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        ...options
      }
    );
  }, [isWatching, options]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setIsWatching(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setPositions([]);
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    positions,
    currentPosition,
    error,
    isWatching,
    startWatching,
    stopWatching,
    clearHistory
  };
};

export default useGeolocation;