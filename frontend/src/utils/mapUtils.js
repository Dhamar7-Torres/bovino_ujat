/**
 * Utilidades para mapas y geolocalización
 * Sistema de gestión de bovinos - Funciones para manejo de coordenadas, mapas y ubicaciones
 */

// Configuración por defecto para mapas
export const DEFAULT_MAP_CONFIG = {
  center: { lat: 20.5888, lng: -100.3899 }, // Querétaro, México
  zoom: 10,
  maxZoom: 18,
  minZoom: 5,
  tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© OpenStreetMap contributors'
};

// Radio de la Tierra en kilómetros
const EARTH_RADIUS_KM = 6371;

/**
 * Convierte grados a radianes
 * @param {number} degrees - Grados a convertir
 * @returns {number} Valor en radianes
 */
export const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Convierte radianes a grados
 * @param {number} radians - Radianes a convertir
 * @returns {number} Valor en grados
 */
export const toDegrees = (radians) => {
  return radians * (180 / Math.PI);
};

/**
 * Calcula la distancia entre dos puntos usando la fórmula de Haversine
 * @param {Object} point1 - Primer punto {lat, lng}
 * @param {Object} point2 - Segundo punto {lat, lng}
 * @returns {number} Distancia en kilómetros
 */
export const calculateDistance = (point1, point2) => {
  if (!point1 || !point2 || !point1.lat || !point1.lng || !point2.lat || !point2.lng) {
    return 0;
  }

  try {
    const lat1Rad = toRadians(point1.lat);
    const lat2Rad = toRadians(point2.lat);
    const deltaLatRad = toRadians(point2.lat - point1.lat);
    const deltaLngRad = toRadians(point2.lng - point1.lng);

    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = EARTH_RADIUS_KM * c;

    return parseFloat(distance.toFixed(3));
  } catch (error) {
    console.error('Error al calcular distancia:', error);
    return 0;
  }
};

/**
 * Calcula el bearing (rumbo) entre dos puntos
 * @param {Object} point1 - Primer punto {lat, lng}
 * @param {Object} point2 - Segundo punto {lat, lng}
 * @returns {number} Bearing en grados (0-360)
 */
export const calculateBearing = (point1, point2) => {
  if (!point1 || !point2 || !point1.lat || !point1.lng || !point2.lat || !point2.lng) {
    return 0;
  }

  try {
    const lat1Rad = toRadians(point1.lat);
    const lat2Rad = toRadians(point2.lat);
    const deltaLngRad = toRadians(point2.lng - point1.lng);

    const y = Math.sin(deltaLngRad) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLngRad);

    const bearingRad = Math.atan2(y, x);
    const bearingDeg = toDegrees(bearingRad);

    return (bearingDeg + 360) % 360; // Normalizar a 0-360
  } catch (error) {
    console.error('Error al calcular bearing:', error);
    return 0;
  }
};

/**
 * Calcula un punto destino dado un punto origen, distancia y bearing
 * @param {Object} origin - Punto origen {lat, lng}
 * @param {number} distance - Distancia en kilómetros
 * @param {number} bearing - Bearing en grados
 * @returns {Object} Punto destino {lat, lng}
 */
export const calculateDestination = (origin, distance, bearing) => {
  if (!origin || !origin.lat || !origin.lng) {
    return null;
  }

  try {
    const distanceRad = distance / EARTH_RADIUS_KM;
    const bearingRad = toRadians(bearing);
    const lat1Rad = toRadians(origin.lat);
    const lng1Rad = toRadians(origin.lng);

    const lat2Rad = Math.asin(
      Math.sin(lat1Rad) * Math.cos(distanceRad) +
      Math.cos(lat1Rad) * Math.sin(distanceRad) * Math.cos(bearingRad)
    );

    const lng2Rad = lng1Rad + Math.atan2(
      Math.sin(bearingRad) * Math.sin(distanceRad) * Math.cos(lat1Rad),
      Math.cos(distanceRad) - Math.sin(lat1Rad) * Math.sin(lat2Rad)
    );

    return {
      lat: parseFloat(toDegrees(lat2Rad).toFixed(6)),
      lng: parseFloat(toDegrees(lng2Rad).toFixed(6))
    };
  } catch (error) {
    console.error('Error al calcular destino:', error);
    return null;
  }
};

/**
 * Valida si las coordenadas son válidas
 * @param {number} lat - Latitud
 * @param {number} lng - Longitud
 * @returns {boolean} True si son válidas
 */
export const isValidCoordinate = (lat, lng) => {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  return true;
};

/**
 * Formatea coordenadas para mostrar
 * @param {number} lat - Latitud
 * @param {number} lng - Longitud
 * @param {number} decimals - Número de decimales
 * @returns {string} Coordenadas formateadas
 */
export const formatCoordinates = (lat, lng, decimals = 6) => {
  if (!isValidCoordinate(lat, lng)) return 'Coordenadas inválidas';

  const latFormatted = lat.toFixed(decimals);
  const lngFormatted = lng.toFixed(decimals);
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';

  return `${Math.abs(latFormatted)}°${latDir}, ${Math.abs(lngFormatted)}°${lngDir}`;
};

/**
 * Convierte coordenadas decimales a DMS (Degrees, Minutes, Seconds)
 * @param {number} decimal - Coordenada decimal
 * @returns {Object} Objeto con degrees, minutes, seconds
 */
export const decimalToDMS = (decimal) => {
  if (typeof decimal !== 'number' || isNaN(decimal)) {
    return { degrees: 0, minutes: 0, seconds: 0 };
  }

  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = parseFloat(((minutesFloat - minutes) * 60).toFixed(2));

  return { degrees, minutes, seconds };
};

/**
 * Convierte DMS a coordenadas decimales
 * @param {number} degrees - Grados
 * @param {number} minutes - Minutos
 * @param {number} seconds - Segundos
 * @param {string} direction - Dirección (N, S, E, W)
 * @returns {number} Coordenada decimal
 */
export const dmsToDecimal = (degrees, minutes, seconds, direction) => {
  let decimal = degrees + (minutes / 60) + (seconds / 3600);
  
  if (direction === 'S' || direction === 'W') {
    decimal = -decimal;
  }
  
  return parseFloat(decimal.toFixed(6));
};

/**
 * Obtiene los bounds (límites) de un conjunto de puntos
 * @param {Array} points - Array de puntos {lat, lng}
 * @returns {Object} Bounds {north, south, east, west}
 */
export const getBounds = (points) => {
  if (!Array.isArray(points) || points.length === 0) {
    return null;
  }

  const validPoints = points.filter(point => 
    point && isValidCoordinate(point.lat, point.lng)
  );

  if (validPoints.length === 0) return null;

  let north = validPoints[0].lat;
  let south = validPoints[0].lat;
  let east = validPoints[0].lng;
  let west = validPoints[0].lng;

  validPoints.forEach(point => {
    north = Math.max(north, point.lat);
    south = Math.min(south, point.lat);
    east = Math.max(east, point.lng);
    west = Math.min(west, point.lng);
  });

  return { north, south, east, west };
};

/**
 * Calcula el centro de un conjunto de puntos
 * @param {Array} points - Array de puntos {lat, lng}
 * @returns {Object} Centro {lat, lng}
 */
export const getCenter = (points) => {
  if (!Array.isArray(points) || points.length === 0) {
    return DEFAULT_MAP_CONFIG.center;
  }

  const validPoints = points.filter(point => 
    point && isValidCoordinate(point.lat, point.lng)
  );

  if (validPoints.length === 0) return DEFAULT_MAP_CONFIG.center;

  const sumLat = validPoints.reduce((sum, point) => sum + point.lat, 0);
  const sumLng = validPoints.reduce((sum, point) => sum + point.lng, 0);

  return {
    lat: parseFloat((sumLat / validPoints.length).toFixed(6)),
    lng: parseFloat((sumLng / validPoints.length).toFixed(6))
  };
};

/**
 * Verifica si un punto está dentro de un polígono
 * @param {Object} point - Punto a verificar {lat, lng}
 * @param {Array} polygon - Array de puntos del polígono
 * @returns {boolean} True si está dentro
 */
export const isPointInPolygon = (point, polygon) => {
  if (!point || !Array.isArray(polygon) || polygon.length < 3) {
    return false;
  }

  if (!isValidCoordinate(point.lat, point.lng)) return false;

  let inside = false;
  const x = point.lng;
  const y = point.lat;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }

  return inside;
};

/**
 * Calcula el área de un polígono en kilómetros cuadrados
 * @param {Array} polygon - Array de puntos del polígono
 * @returns {number} Área en km²
 */
export const calculatePolygonArea = (polygon) => {
  if (!Array.isArray(polygon) || polygon.length < 3) {
    return 0;
  }

  try {
    // Usar la fórmula del shoelace para calcular el área
    let area = 0;
    const earthRadiusKm = 6371;

    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      const lat1 = toRadians(polygon[i].lat);
      const lat2 = toRadians(polygon[j].lat);
      const lng1 = toRadians(polygon[i].lng);
      const lng2 = toRadians(polygon[j].lng);

      area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }

    area = Math.abs(area) * earthRadiusKm * earthRadiusKm / 2;
    return parseFloat(area.toFixed(3));
  } catch (error) {
    console.error('Error al calcular área del polígono:', error);
    return 0;
  }
};

/**
 * Obtiene la ubicación actual del usuario
 * @param {Object} options - Opciones de geolocalización
 * @returns {Promise<Object>} Promesa con la ubicación {lat, lng}
 */
export const getCurrentLocation = (options = {}) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no soportada por este navegador'));
      return;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutos
      ...options
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
      },
      (error) => {
        let message = 'Error desconocido';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Permiso de geolocalización denegado';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Ubicación no disponible';
            break;
          case error.TIMEOUT:
            message = 'Tiempo de espera agotado';
            break;
        }
        reject(new Error(message));
      },
      defaultOptions
    );
  });
};

/**
 * Crea un círculo alrededor de un punto
 * @param {Object} center - Centro del círculo {lat, lng}
 * @param {number} radiusKm - Radio en kilómetros
 * @param {number} points - Número de puntos del círculo
 * @returns {Array} Array de puntos del círculo
 */
export const createCircle = (center, radiusKm, points = 32) => {
  if (!center || !isValidCoordinate(center.lat, center.lng)) {
    return [];
  }

  const circle = [];
  const angleStep = 360 / points;

  for (let i = 0; i < points; i++) {
    const angle = i * angleStep;
    const point = calculateDestination(center, radiusKm, angle);
    if (point) {
      circle.push(point);
    }
  }

  return circle;
};

/**
 * Simplifica un polígono eliminando puntos redundantes
 * @param {Array} polygon - Polígono original
 * @param {number} tolerance - Tolerancia en metros
 * @returns {Array} Polígono simplificado
 */
export const simplifyPolygon = (polygon, tolerance = 100) => {
  if (!Array.isArray(polygon) || polygon.length <= 2) {
    return polygon;
  }

  const toleranceKm = tolerance / 1000;
  const simplified = [polygon[0]]; // Siempre incluir el primer punto

  for (let i = 1; i < polygon.length - 1; i++) {
    const prev = simplified[simplified.length - 1];
    const current = polygon[i];
    const distance = calculateDistance(prev, current);

    if (distance >= toleranceKm) {
      simplified.push(current);
    }
  }

  // Siempre incluir el último punto si es diferente del primero
  const lastPoint = polygon[polygon.length - 1];
  const firstPoint = simplified[0];
  if (calculateDistance(lastPoint, firstPoint) > toleranceKm) {
    simplified.push(lastPoint);
  }

  return simplified;
};

/**
 * Genera marcadores para diferentes tipos de elementos
 * @param {string} type - Tipo de marcador
 * @param {Object} data - Datos del elemento
 * @returns {Object} Configuración del marcador
 */
export const generateMarker = (type, data = {}) => {
  const markerConfigs = {
    ranch: {
      color: '#3B82F6',
      icon: 'farm',
      size: 'large'
    },
    bovine: {
      color: '#10B981',
      icon: 'cow',
      size: 'medium'
    },
    event: {
      color: '#F59E0B',
      icon: 'calendar',
      size: 'small'
    },
    health: {
      color: '#EF4444',
      icon: 'heart-pulse',
      size: 'medium'
    },
    production: {
      color: '#8B5CF6',
      icon: 'trending-up',
      size: 'medium'
    }
  };

  const config = markerConfigs[type] || markerConfigs.ranch;
  
  return {
    ...config,
    ...data,
    id: data.id || generateUniqueId(type),
    popup: data.popup || `${type}: ${data.name || 'Sin nombre'}`
  };
};

/**
 * Convierte metros a otras unidades
 * @param {number} meters - Metros a convertir
 * @param {string} unit - Unidad destino (km, mi, ft, yd)
 * @returns {number} Valor convertido
 */
export const convertDistance = (meters, unit = 'km') => {
  if (!meters || isNaN(meters)) return 0;

  const conversions = {
    m: 1,
    km: 0.001,
    mi: 0.000621371, // millas
    ft: 3.28084,     // pies
    yd: 1.09361      // yardas
  };

  const factor = conversions[unit] || conversions.km;
  return parseFloat((meters * factor).toFixed(3));
};

/**
 * Genera un ID único para elementos del mapa
 * @param {string} prefix - Prefijo del ID
 * @returns {string} ID único
 */
const generateUniqueId = (prefix = 'map') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Exportar todas las funciones como objeto por defecto
export default {
  DEFAULT_MAP_CONFIG,
  toRadians,
  toDegrees,
  calculateDistance,
  calculateBearing,
  calculateDestination,
  isValidCoordinate,
  formatCoordinates,
  decimalToDMS,
  dmsToDecimal,
  getBounds,
  getCenter,
  isPointInPolygon,
  calculatePolygonArea,
  getCurrentLocation,
  createCircle,
  simplifyPolygon,
  generateMarker,
  convertDistance
};