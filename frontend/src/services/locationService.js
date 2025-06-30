import { get, post, put, patch, del, upload } from './api';

/**
 * Servicio para gestión de geolocalización en el sistema de gestión de bovinos
 * Incluye ubicaciones de bovinos, eventos, rutas, mapas y análisis espaciales
 */

/**
 * Obtener ubicaciones de bovinos con filtros geográficos
 * @param {Object} params - Parámetros de búsqueda y filtros
 */
export const getBovineLocations = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      bovino_id = '',
      fecha_inicio = '',
      fecha_fin = '',
      actividad = '', // pastoreo, inseminacion, vacunacion, traslado, etc.
      bounds = null, // {north, south, east, west}
      radius = null, // radio en metros desde un punto central
      center_lat = null,
      center_lng = null,
      include_current_only = false,
      include_bovine_details = true,
      include_activity_details = false,
      group_by_activity = false,
      limit = 1000
    } = params;

    const queryParams = {
      rancho_id,
      bovino_id,
      fecha_inicio,
      fecha_fin,
      actividad,
      include_current_only,
      include_bovine_details,
      include_activity_details,
      group_by_activity,
      limit
    };

    // Agregar parámetros geográficos si existen
    if (bounds) {
      queryParams.north = bounds.north;
      queryParams.south = bounds.south;
      queryParams.east = bounds.east;
      queryParams.west = bounds.west;
    }

    if (radius && center_lat && center_lng) {
      queryParams.radius = radius;
      queryParams.center_lat = center_lat;
      queryParams.center_lng = center_lng;
    }

    // Remover parámetros vacíos
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    const response = await get('/locations/bovines', queryParams);
    
    return {
      success: response.success,
      data: response.data?.locations || [],
      total: response.data?.total || 0,
      bounds: response.data?.bounds || null,
      summary: response.data?.summary || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener ubicaciones de bovinos:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: 'Error al cargar ubicaciones de bovinos'
    };
  }
};

/**
 * Registrar nueva ubicación de bovino
 * @param {Object} locationData - Datos de la ubicación
 */
export const recordBovineLocation = async (locationData) => {
  try {
    const {
      bovino_id,
      latitud,
      longitud,
      actividad,
      descripcion = '',
      fecha = new Date().toISOString(),
      precision = null,
      altitud = null,
      velocidad = null,
      direccion = null,
      metodo_obtencion = 'manual', // manual, gps, automatico
      responsable_id = null,
      evento_id = null,
      observaciones = '',
      imagenes = [],
      temperatura_ambiente = null,
      condiciones_climaticas = ''
    } = locationData;

    // Preparar datos para envío
    const formData = new FormData();
    
    // Agregar datos básicos
    formData.append('bovino_id', bovino_id);
    formData.append('latitud', latitud);
    formData.append('longitud', longitud);
    formData.append('actividad', actividad);
    formData.append('descripcion', descripcion);
    formData.append('fecha', fecha);
    formData.append('metodo_obtencion', metodo_obtencion);
    
    // Agregar datos opcionales
    if (precision) formData.append('precision', precision);
    if (altitud) formData.append('altitud', altitud);
    if (velocidad) formData.append('velocidad', velocidad);
    if (direccion) formData.append('direccion', direccion);
    if (responsable_id) formData.append('responsable_id', responsable_id);
    if (evento_id) formData.append('evento_id', evento_id);
    if (observaciones) formData.append('observaciones', observaciones);
    if (temperatura_ambiente) formData.append('temperatura_ambiente', temperatura_ambiente);
    if (condiciones_climaticas) formData.append('condiciones_climaticas', condiciones_climaticas);
    
    // Agregar imágenes
    imagenes.forEach((imagen) => {
      if (imagen instanceof File) {
        formData.append('imagenes', imagen);
      }
    });

    const response = await upload('/locations/bovines', formData);
    
    return {
      success: response.success,
      data: response.data?.location || null,
      message: response.success 
        ? 'Ubicación registrada correctamente'
        : response.message || 'Error al registrar ubicación'
    };
  } catch (error) {
    console.error('Error al registrar ubicación:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al registrar ubicación'
    };
  }
};

/**
 * Obtener historial de ubicaciones de un bovino específico
 * @param {string} bovineId - ID del bovino
 * @param {Object} params - Parámetros de filtrado
 */
export const getBovineLocationHistory = async (bovineId, params = {}) => {
  try {
    const {
      fecha_inicio = '',
      fecha_fin = '',
      actividad = '',
      limit = 500,
      include_route = false,
      include_images = false,
      include_weather = false
    } = params;

    const response = await get(`/locations/bovines/${bovineId}/history`, {
      fecha_inicio,
      fecha_fin,
      actividad,
      limit,
      include_route,
      include_images,
      include_weather
    });
    
    return {
      success: response.success,
      data: response.data?.locations || [],
      route: response.data?.route || null,
      stats: response.data?.stats || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener historial de ubicaciones:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar historial de ubicaciones'
    };
  }
};

/**
 * Obtener ubicaciones de eventos con geolocalización
 * @param {Object} params - Parámetros de filtrado
 */
export const getEventLocations = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      tipo_evento_id = '',
      fecha_inicio = '',
      fecha_fin = '',
      bounds = null,
      radius = null,
      center_lat = null,
      center_lng = null,
      include_event_details = true,
      include_participants = false
    } = params;

    const queryParams = {
      rancho_id,
      tipo_evento_id,
      fecha_inicio,
      fecha_fin,
      include_event_details,
      include_participants
    };

    // Agregar parámetros geográficos
    if (bounds) {
      queryParams.north = bounds.north;
      queryParams.south = bounds.south;
      queryParams.east = bounds.east;
      queryParams.west = bounds.west;
    }

    if (radius && center_lat && center_lng) {
      queryParams.radius = radius;
      queryParams.center_lat = center_lat;
      queryParams.center_lng = center_lng;
    }

    const response = await get('/locations/events', queryParams);
    
    return {
      success: response.success,
      data: response.data?.locations || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener ubicaciones de eventos:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar ubicaciones de eventos'
    };
  }
};

/**
 * Calcular distancia entre dos puntos geográficos
 * @param {number} lat1 - Latitud del primer punto
 * @param {number} lng1 - Longitud del primer punto
 * @param {number} lat2 - Latitud del segundo punto
 * @param {number} lng2 - Longitud del segundo punto
 * @param {string} unit - Unidad de medida (km, m, mi)
 */
export const calculateDistance = async (lat1, lng1, lat2, lng2, unit = 'km') => {
  try {
    const response = await get('/locations/distance', {
      lat1,
      lng1,
      lat2,
      lng2,
      unit
    });
    
    return {
      success: response.success,
      data: response.data || { distance: 0, unit },
      message: response.message
    };
  } catch (error) {
    console.error('Error al calcular distancia:', error);
    return {
      success: false,
      data: { distance: 0, unit },
      message: 'Error al calcular distancia'
    };
  }
};

/**
 * Obtener bovinos en un área específica
 * @param {Object} area - Definición del área
 * @param {Object} filters - Filtros adicionales
 */
export const getBovinesInArea = async (area, filters = {}) => {
  try {
    const {
      type, // circle, polygon, rectangle
      coordinates,
      radius = null
    } = area;

    const {
      rancho_id = '',
      raza_id = '',
      sexo_id = '',
      estado_id = '',
      include_details = true,
      only_current_location = true
    } = filters;

    const response = await post('/locations/bovines-in-area', {
      area: {
        type,
        coordinates,
        radius
      },
      filters: {
        rancho_id,
        raza_id,
        sexo_id,
        estado_id,
        include_details,
        only_current_location
      }
    });
    
    return {
      success: response.success,
      data: response.data?.bovines || [],
      total: response.data?.total || 0,
      area_info: response.data?.area_info || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener bovinos en área:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: 'Error al buscar bovinos en el área'
    };
  }
};

/**
 * Crear zona geográfica personalizada
 * @param {Object} zoneData - Datos de la zona
 */
export const createGeographicZone = async (zoneData) => {
  try {
    const {
      nombre,
      descripcion,
      rancho_id,
      tipo_zona, // pastoreo, cuarentena, alimentacion, descanso
      coordenadas, // Array de coordenadas que definen el polígono
      area_hectareas = null,
      capacidad_bovinos = null,
      caracteristicas = {},
      restricciones = [],
      color_mapa = '#3B82F6',
      activa = true,
      observaciones = ''
    } = zoneData;

    const response = await post('/locations/zones', {
      nombre,
      descripcion,
      rancho_id,
      tipo_zona,
      coordenadas,
      area_hectareas,
      capacidad_bovinos,
      caracteristicas,
      restricciones,
      color_mapa,
      activa,
      observaciones
    });
    
    return {
      success: response.success,
      data: response.data?.zone || null,
      message: response.success 
        ? 'Zona geográfica creada correctamente'
        : response.message || 'Error al crear zona geográfica'
    };
  } catch (error) {
    console.error('Error al crear zona geográfica:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear zona geográfica'
    };
  }
};

/**
 * Obtener zonas geográficas del rancho
 * @param {string} ranchoId - ID del rancho
 * @param {Object} filters - Filtros adicionales
 */
export const getGeographicZones = async (ranchoId, filters = {}) => {
  try {
    const {
      tipo_zona = '',
      activa = null,
      include_bovines_count = true,
      include_recent_activity = false
    } = filters;

    const response = await get('/locations/zones', {
      rancho_id: ranchoId,
      tipo_zona,
      activa,
      include_bovines_count,
      include_recent_activity
    });
    
    return {
      success: response.success,
      data: response.data?.zones || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener zonas geográficas:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar zonas geográficas'
    };
  }
};

/**
 * Actualizar zona geográfica
 * @param {string} zoneId - ID de la zona
 * @param {Object} zoneData - Datos actualizados
 */
export const updateGeographicZone = async (zoneId, zoneData) => {
  try {
    const response = await put(`/locations/zones/${zoneId}`, zoneData);
    
    return {
      success: response.success,
      data: response.data?.zone || null,
      message: response.success 
        ? 'Zona geográfica actualizada correctamente'
        : response.message || 'Error al actualizar zona geográfica'
    };
  } catch (error) {
    console.error('Error al actualizar zona geográfica:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar zona geográfica'
    };
  }
};

/**
 * Obtener rutas de movimiento de bovinos
 * @param {Object} params - Parámetros para generar rutas
 */
export const getBovineRoutes = async (params = {}) => {
  try {
    const {
      bovino_id = '',
      rancho_id = '',
      fecha_inicio,
      fecha_fin,
      simplify_route = true,
      include_stops = true,
      min_distance_between_points = 10 // metros
    } = params;

    const response = await get('/locations/routes', {
      bovino_id,
      rancho_id,
      fecha_inicio,
      fecha_fin,
      simplify_route,
      include_stops,
      min_distance_between_points
    });
    
    return {
      success: response.success,
      data: response.data?.routes || [],
      stats: response.data?.stats || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar rutas de movimiento'
    };
  }
};

/**
 * Analizar patrones de movimiento
 * @param {Object} params - Parámetros de análisis
 */
export const analyzeMovementPatterns = async (params = {}) => {
  try {
    const {
      bovino_id = '',
      rancho_id = '',
      fecha_inicio,
      fecha_fin,
      tipo_analisis = 'general', // general, zones, time_patterns, distance
      include_weather_correlation = false
    } = params;

    const response = await post('/locations/analyze-patterns', {
      bovino_id,
      rancho_id,
      fecha_inicio,
      fecha_fin,
      tipo_analisis,
      include_weather_correlation
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al analizar patrones:', error);
    return {
      success: false,
      data: {},
      message: 'Error al analizar patrones de movimiento'
    };
  }
};

/**
 * Obtener mapa de calor de actividades
 * @param {Object} params - Parámetros para generar mapa de calor
 */
export const getActivityHeatMap = async (params = {}) => {
  try {
    const {
      rancho_id,
      actividad = '',
      fecha_inicio,
      fecha_fin,
      grid_size = 50, // tamaño de la cuadrícula en metros
      bounds = null
    } = params;

    const queryParams = {
      rancho_id,
      actividad,
      fecha_inicio,
      fecha_fin,
      grid_size
    };

    if (bounds) {
      queryParams.north = bounds.north;
      queryParams.south = bounds.south;
      queryParams.east = bounds.east;
      queryParams.west = bounds.west;
    }

    const response = await get('/locations/heatmap', queryParams);
    
    return {
      success: response.success,
      data: response.data?.heatmap || [],
      bounds: response.data?.bounds || null,
      stats: response.data?.stats || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al generar mapa de calor:', error);
    return {
      success: false,
      data: [],
      message: 'Error al generar mapa de calor'
    };
  }
};

/**
 * Obtener información geográfica por coordenadas (geocodificación inversa)
 * @param {number} latitud - Latitud
 * @param {number} longitud - Longitud
 */
export const getGeographicInfo = async (latitud, longitud) => {
  try {
    const response = await get('/locations/geocode', {
      lat: latitud,
      lng: longitud
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener información geográfica:', error);
    return {
      success: false,
      data: {},
      message: 'Error al obtener información geográfica'
    };
  }
};

/**
 * Buscar ubicaciones por dirección (geocodificación)
 * @param {string} address - Dirección a buscar
 * @param {Object} bounds - Límites de búsqueda (opcional)
 */
export const searchLocationByAddress = async (address, bounds = null) => {
  try {
    const params = { address };
    
    if (bounds) {
      params.bounds = JSON.stringify(bounds);
    }

    const response = await get('/locations/search-address', params);
    
    return {
      success: response.success,
      data: response.data?.results || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al buscar ubicación:', error);
    return {
      success: false,
      data: [],
      message: 'Error al buscar ubicación'
    };
  }
};

/**
 * Obtener estadísticas de ubicación
 * @param {Object} filters - Filtros para estadísticas
 */
export const getLocationStats = async (filters = {}) => {
  try {
    const {
      rancho_id = '',
      fecha_inicio = '',
      fecha_fin = '',
      agrupacion = 'dia' // dia, semana, mes
    } = filters;

    const response = await get('/locations/stats', {
      rancho_id,
      fecha_inicio,
      fecha_fin,
      agrupacion
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener estadísticas de ubicación:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar estadísticas de ubicación'
    };
  }
};

/**
 * Exportar datos de ubicación
 * @param {Object} filters - Filtros para exportación
 * @param {string} format - Formato de exportación (csv, excel, kml, gpx)
 */
export const exportLocationData = async (filters = {}, format = 'csv') => {
  try {
    const response = await get('/locations/export', {
      ...filters,
      format
    }, {
      responseType: 'blob'
    });
    
    return {
      success: response.success,
      data: response.data,
      message: 'Exportación completada'
    };
  } catch (error) {
    console.error('Error al exportar datos de ubicación:', error);
    return {
      success: false,
      message: 'Error al exportar datos'
    };
  }
};

/**
 * Obtener configuración de mapas
 */
export const getMapConfiguration = async () => {
  try {
    const response = await get('/locations/map-config');
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener configuración de mapas:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar configuración de mapas'
    };
  }
};

// Utilidades para cálculos geográficos locales
export const geoUtils = {
  /**
   * Calcular distancia usando fórmula de Haversine (cálculo local)
   * @param {number} lat1 - Latitud del primer punto
   * @param {number} lng1 - Longitud del primer punto
   * @param {number} lat2 - Latitud del segundo punto
   * @param {number} lng2 - Longitud del segundo punto
   * @returns {number} Distancia en kilómetros
   */
  calculateHaversineDistance: (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  /**
   * Verificar si un punto está dentro de un polígono
   * @param {Array} point - [lng, lat]
   * @param {Array} polygon - Array de [lng, lat] que define el polígono
   * @returns {boolean}
   */
  isPointInPolygon: (point, polygon) => {
    const [x, y] = point;
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    
    return inside;
  },

  /**
   * Calcular el centro de un conjunto de coordenadas
   * @param {Array} coordinates - Array de [lng, lat]
   * @returns {Array} [lng, lat] del centro
   */
  calculateCenter: (coordinates) => {
    if (!coordinates.length) return [0, 0];
    
    const sum = coordinates.reduce((acc, coord) => [
      acc[0] + coord[0],
      acc[1] + coord[1]
    ], [0, 0]);
    
    return [sum[0] / coordinates.length, sum[1] / coordinates.length];
  }
};

// Exportaciones por defecto
export default {
  getBovineLocations,
  recordBovineLocation,
  getBovineLocationHistory,
  getEventLocations,
  calculateDistance,
  getBovinesInArea,
  createGeographicZone,
  getGeographicZones,
  updateGeographicZone,
  getBovineRoutes,
  analyzeMovementPatterns,
  getActivityHeatMap,
  getGeographicInfo,
  searchLocationByAddress,
  getLocationStats,
  exportLocationData,
  getMapConfiguration,
  geoUtils
};