import { useState, useEffect, useCallback, useRef } from 'react';
import { locationService } from '../services/locationService';
import { useNotifications } from './useNotifications';

/**
 * Hook personalizado para manejo de geolocalización
 * Maneja ubicación actual, tracking, distancias y almacenamiento de ubicaciones de eventos
 */
const useGeolocation = (options = {}) => {
  // Estados principales de geolocalización
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  
  // Estados de permisos
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'granted', 'denied', 'prompt'
  const [isPermissionRequested, setIsPermissionRequested] = useState(false);

  // Estados para tracking de ubicaciones
  const [trackingData, setTrackingData] = useState([]);
  const [currentActivity, setCurrentActivity] = useState(null);

  // Configuración por defecto
  const {
    enableHighAccuracy = true,    // Alta precisión GPS
    timeout = 15000,              // Timeout de 15 segundos
    maximumAge = 60000,           // Caché de 1 minuto
    watchPosition = false,        // Watch automático
    autoRequest = true,           // Solicitar permisos automáticamente
    minDistance = 10,             // Distancia mínima para actualizar (metros)
    trackingInterval = 30000,     // Intervalo de tracking (30 segundos)
    saveToDatabase = true,        // Guardar ubicaciones en BD
    activityType = null           // Tipo de actividad actual
  } = options;

  // Referencias para control
  const watchIdRef = useRef(null);
  const trackingIntervalRef = useRef(null);
  const lastPositionRef = useRef(null);
  
  const { addNotification } = useNotifications();

  /**
   * Función para verificar soporte de geolocalización
   */
  const isGeolocationSupported = useCallback(() => {
    return 'geolocation' in navigator;
  }, []);

  /**
   * Función para solicitar permisos de geolocalización
   */
  const requestPermission = useCallback(async () => {
    if (!isGeolocationSupported()) {
      setError('Geolocalización no soportada en este navegador');
      return false;
    }

    try {
      setIsPermissionRequested(true);
      
      // Verificar permisos si está disponible la API
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(permission.state);
        
        // Escuchar cambios en permisos
        permission.addEventListener('change', () => {
          setPermissionStatus(permission.state);
        });
        
        return permission.state === 'granted';
      }
      
      // Si no hay API de permisos, intentar obtener ubicación directamente
      return true;
    } catch (err) {
      console.error('Error al solicitar permisos:', err);
      setError('Error al solicitar permisos de ubicación');
      return false;
    }
  }, []);

  /**
   * Función para obtener la ubicación actual
   * @param {Object} customOptions - Opciones personalizadas para esta petición
   */
  const getCurrentPosition = useCallback(async (customOptions = {}) => {
    if (!isGeolocationSupported()) {
      setError('Geolocalización no soportada');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const geoOptions = {
        enableHighAccuracy,
        timeout,
        maximumAge,
        ...customOptions
      };

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          geoOptions
        );
      });

      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: new Date(position.timestamp)
      };

      setPosition(locationData);
      setAccuracy(position.coords.accuracy);
      lastPositionRef.current = locationData;

      return locationData;
    } catch (err) {
      console.error('Error al obtener ubicación:', err);
      const errorMessage = getGeolocationErrorMessage(err);
      setError(errorMessage);
      
      addNotification({
        type: 'error',
        title: 'Error de ubicación',
        message: errorMessage
      });

      return null;
    } finally {
      setLoading(false);
    }
  }, [enableHighAccuracy, timeout, maximumAge, addNotification]);

  /**
   * Función para iniciar el seguimiento de ubicación
   * @param {string} activity - Tipo de actividad (vacunación, chequeo, etc.)
   */
  const startTracking = useCallback(async (activity = null) => {
    if (!isGeolocationSupported()) {
      setError('Geolocalización no soportada');
      return false;
    }

    if (isTracking) {
      console.warn('El tracking ya está activo');
      return true;
    }

    try {
      setLoading(true);
      setError(null);
      setCurrentActivity(activity);

      const geoOptions = {
        enableHighAccuracy,
        timeout,
        maximumAge: 0 // Sin caché para tracking
      };

      // Iniciar watch position
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: new Date(position.timestamp),
            activity: activity || currentActivity
          };

          // Verificar si la nueva posición es significativamente diferente
          if (shouldUpdatePosition(locationData)) {
            setPosition(locationData);
            setAccuracy(position.coords.accuracy);
            
            // Agregar a tracking data
            setTrackingData(prev => [...prev, locationData]);
            
            // Guardar en base de datos si está habilitado
            if (saveToDatabase && activity) {
              saveLocationToDatabase(locationData, activity);
            }

            lastPositionRef.current = locationData;
          }
        },
        (err) => {
          console.error('Error en tracking:', err);
          const errorMessage = getGeolocationErrorMessage(err);
          setError(errorMessage);
        },
        geoOptions
      );

      setIsTracking(true);
      
      addNotification({
        type: 'success',
        title: 'Tracking iniciado',
        message: activity ? `Seguimiento activo para: ${activity}` : 'Seguimiento de ubicación activo'
      });

      return true;
    } catch (err) {
      console.error('Error al iniciar tracking:', err);
      setError('Error al iniciar seguimiento de ubicación');
      return false;
    } finally {
      setLoading(false);
    }
  }, [isTracking, enableHighAccuracy, timeout, currentActivity, saveToDatabase, addNotification]);

  /**
   * Función para detener el seguimiento de ubicación
   */
  const stopTracking = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }

    setIsTracking(false);
    setCurrentActivity(null);
    
    addNotification({
      type: 'info',
      title: 'Tracking detenido',
      message: 'Seguimiento de ubicación desactivado'
    });
  }, [addNotification]);

  /**
   * Función para calcular distancia entre dos puntos en metros
   * @param {Object} point1 - {latitude, longitude}
   * @param {Object} point2 - {latitude, longitude}
   */
  const calculateDistance = useCallback((point1, point2) => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = point1.latitude * Math.PI / 180;
    const φ2 = point2.latitude * Math.PI / 180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distancia en metros
  }, []);

  /**
   * Función para verificar si está dentro de un área específica
   * @param {Object} center - Centro del área {latitude, longitude}
   * @param {number} radius - Radio en metros
   * @param {Object} currentPos - Posición actual (opcional)
   */
  const isWithinArea = useCallback((center, radius, currentPos = null) => {
    const pos = currentPos || position;
    if (!pos) return false;

    const distance = calculateDistance(pos, center);
    return distance <= radius;
  }, [position, calculateDistance]);

  /**
   * Función para guardar ubicación de evento en base de datos
   * @param {Object} locationData - Datos de ubicación
   * @param {string} activity - Tipo de actividad
   * @param {string} bovineId - ID del bovino (opcional)
   * @param {Object} metadata - Metadatos adicionales
   */
  const saveEventLocation = useCallback(async (locationData, activity, bovineId = null, metadata = {}) => {
    try {
      const eventLocationData = {
        bovino_id: bovineId,
        latitud: locationData.latitude,
        longitud: locationData.longitude,
        actividad: activity,
        descripcion: metadata.description || '',
        precision: locationData.accuracy,
        altitud: locationData.altitude,
        velocidad: locationData.speed,
        direccion: locationData.heading,
        timestamp: locationData.timestamp || new Date(),
        metadata: JSON.stringify(metadata)
      };

      const response = await locationService.saveEventLocation(eventLocationData);
      
      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Ubicación guardada',
          message: `Ubicación registrada para: ${activity}`
        });
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Error al guardar ubicación:', err);
      addNotification({
        type: 'error',
        title: 'Error al guardar',
        message: 'No se pudo guardar la ubicación del evento'
      });
      return null;
    }
  }, [addNotification]);

  /**
   * Función para obtener ubicaciones históricas de un bovino
   * @param {string} bovineId - ID del bovino
   * @param {Object} dateRange - Rango de fechas {start, end}
   */
  const getBovineLocationHistory = useCallback(async (bovineId, dateRange = {}) => {
    try {
      const response = await locationService.getBovineLocations(bovineId, dateRange);
      
      if (response.success) {
        return response.data.map(location => ({
          id: location.id,
          latitude: parseFloat(location.latitud),
          longitude: parseFloat(location.longitud),
          activity: location.actividad,
          description: location.descripcion,
          accuracy: location.precision,
          timestamp: new Date(location.fecha),
          bovineId: location.bovino_id
        }));
      }
      
      return [];
    } catch (err) {
      console.error('Error al obtener historial de ubicaciones:', err);
      return [];
    }
  }, []);

  /**
   * Función para obtener ubicaciones por actividad
   * @param {string} activity - Tipo de actividad
   * @param {Object} dateRange - Rango de fechas
   */
  const getLocationsByActivity = useCallback(async (activity, dateRange = {}) => {
    try {
      const response = await locationService.getLocationsByActivity(activity, dateRange);
      
      if (response.success) {
        return response.data.map(location => ({
          id: location.id,
          latitude: parseFloat(location.latitud),
          longitude: parseFloat(location.longitud),
          activity: location.actividad,
          description: location.descripcion,
          accuracy: location.precision,
          timestamp: new Date(location.fecha),
          bovineId: location.bovino_id,
          bovineName: location.bovino_nombre
        }));
      }
      
      return [];
    } catch (err) {
      console.error('Error al obtener ubicaciones por actividad:', err);
      return [];
    }
  }, []);

  /**
   * Función para convertir ubicaciones a formato GeoJSON
   * @param {Array} locations - Array de ubicaciones
   */
  const toGeoJSON = useCallback((locations) => {
    return {
      type: 'FeatureCollection',
      features: locations.map(location => ({
        type: 'Feature',
        properties: {
          id: location.id,
          activity: location.activity,
          description: location.description,
          accuracy: location.accuracy,
          timestamp: location.timestamp.toISOString(),
          bovineId: location.bovineId,
          bovineName: location.bovineName
        },
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        }
      }))
    };
  }, []);

  /**
   * Función auxiliar para determinar si actualizar la posición
   * @param {Object} newPosition - Nueva posición
   */
  const shouldUpdatePosition = useCallback((newPosition) => {
    if (!lastPositionRef.current) return true;
    
    const distance = calculateDistance(lastPositionRef.current, newPosition);
    return distance >= minDistance;
  }, [calculateDistance, minDistance]);

  /**
   * Función auxiliar para guardar ubicación en BD durante tracking
   * @param {Object} locationData - Datos de ubicación
   * @param {string} activity - Actividad actual
   */
  const saveLocationToDatabase = useCallback(async (locationData, activity) => {
    try {
      await locationService.saveTrackingPoint({
        latitud: locationData.latitude,
        longitud: locationData.longitude,
        actividad: activity,
        precision: locationData.accuracy,
        timestamp: locationData.timestamp
      });
    } catch (err) {
      console.error('Error al guardar punto de tracking:', err);
    }
  }, []);

  /**
   * Función auxiliar para obtener mensaje de error de geolocalización
   * @param {GeolocationPositionError} error - Error de geolocalización
   */
  const getGeolocationErrorMessage = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setPermissionStatus('denied');
        return 'Permisos de ubicación denegados';
      case error.POSITION_UNAVAILABLE:
        return 'Ubicación no disponible';
      case error.TIMEOUT:
        return 'Tiempo de espera agotado';
      default:
        return 'Error desconocido de geolocalización';
    }
  };

  // Efecto para solicitar permisos automáticamente
  useEffect(() => {
    if (autoRequest && !isPermissionRequested) {
      requestPermission();
    }
  }, [autoRequest, isPermissionRequested, requestPermission]);

  // Efecto para iniciar watch position automático
  useEffect(() => {
    if (watchPosition && permissionStatus === 'granted' && !isTracking) {
      startTracking();
    }
  }, [watchPosition, permissionStatus, isTracking, startTracking]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    // Estados principales
    position,
    loading,
    error,
    accuracy,
    isTracking,
    permissionStatus,
    isPermissionRequested,
    trackingData,
    currentActivity,
    
    // Información de soporte
    isSupported: isGeolocationSupported(),
    isPermissionGranted: permissionStatus === 'granted',
    isPermissionDenied: permissionStatus === 'denied',
    
    // Acciones principales
    requestPermission,
    getCurrentPosition,
    startTracking,
    stopTracking,
    saveEventLocation,
    
    // Utilidades de cálculo
    calculateDistance,
    isWithinArea,
    
    // Funciones de consulta
    getBovineLocationHistory,
    getLocationsByActivity,
    toGeoJSON,
    
    // Funciones auxiliares
    clearError: () => setError(null),
    clearTrackingData: () => setTrackingData([]),
    
    // Estadísticas
    totalTrackedPoints: trackingData.length,
    trackingDuration: trackingData.length > 0 
      ? (trackingData[trackingData.length - 1]?.timestamp - trackingData[0]?.timestamp) / 1000 
      : 0,
    
    // Configuración actual
    options: {
      enableHighAccuracy,
      timeout,
      maximumAge,
      minDistance,
      trackingInterval
    }
  };
};

export default useGeolocation;