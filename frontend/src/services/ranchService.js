import { get, post, put, patch, del, upload } from './api';

/**
 * Servicio para gestión de ranchos en el sistema de gestión de bovinos
 * Incluye CRUD completo, geolocalización, gestión de imágenes y análisis espaciales
 */

/**
 * Obtener lista de ranchos con filtros y paginación
 * @param {Object} params - Parámetros de búsqueda y filtros
 */
export const getRanches = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      estado_id = '',
      propietario_id = '',
      superficie_min = '',
      superficie_max = '',
      activo = 'all', // 'all', 'true', 'false'
      tiene_bovinos = null,
      sortBy = 'nombre',
      sortOrder = 'asc',
      include_owner = true,
      include_stats = false,
      include_location = false,
      view_mode = 'grid' // 'grid', 'table', 'map'
    } = params;

    const queryParams = {
      page,
      limit,
      search,
      estado_id,
      propietario_id,
      superficie_min,
      superficie_max,
      activo,
      tiene_bovinos,
      sortBy,
      sortOrder,
      include_owner,
      include_stats,
      include_location,
      view_mode
    };

    // Remover parámetros vacíos
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    const response = await get('/ranches', queryParams);
    
    return {
      success: response.success,
      data: response.data?.ranches || [],
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      totalPages: response.data?.totalPages || 1,
      summary: response.data?.summary || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener ranchos:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: 'Error al cargar lista de ranchos'
    };
  }
};

/**
 * Obtener detalles de un rancho específico
 * @param {string} ranchId - ID del rancho
 * @param {Object} options - Opciones adicionales
 */
export const getRanchById = async (ranchId, options = {}) => {
  try {
    const {
      include_owner = true,
      include_stats = true,
      include_bovines_summary = true,
      include_recent_activity = true,
      include_weather = false,
      include_zones = true,
      include_facilities = true
    } = options;

    const response = await get(`/ranches/${ranchId}`, {
      include_owner,
      include_stats,
      include_bovines_summary,
      include_recent_activity,
      include_weather,
      include_zones,
      include_facilities
    });
    
    return {
      success: response.success,
      data: response.data || null,
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener rancho:', error);
    return {
      success: false,
      data: null,
      message: 'Error al cargar datos del rancho'
    };
  }
};

/**
 * Crear nuevo rancho
 * @param {Object} ranchData - Datos del rancho
 */
export const createRanch = async (ranchData) => {
  try {
    const {
      nombre,
      descripcion = '',
      superficie_hectareas,
      ubicacion_latitud,
      ubicacion_longitud,
      direccion = '',
      estado_id,
      municipio = '',
      codigo_postal = '',
      propietario_id,
      telefono = '',
      email = '',
      sitio_web = '',
      tipo_ganaderia = 'lechero', // lechero, carne, mixto
      capacidad_bovinos = null,
      numero_potreros = null,
      tiene_ordeñadora = false,
      tiene_bascula = false,
      tiene_comederos = false,
      tiene_bebederos = false,
      fuente_agua = '',
      tipo_pasto_predominante = '',
      altitud_msnm = null,
      clima_predominante = '',
      temporada_lluvias_inicio = null,
      temporada_lluvias_fin = null,
      observaciones = '',
      activo = true,
      imagenes = [],
      documentos = [],
      coordenadas_poligono = [], // Para definir límites del rancho
      instalaciones = [], // Array de instalaciones/facilidades
      certificaciones = [] // Array de certificaciones
    } = ranchData;

    // Preparar datos para envío
    const formData = new FormData();
    
    // Agregar datos básicos
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('superficie_hectareas', superficie_hectareas);
    formData.append('ubicacion_latitud', ubicacion_latitud);
    formData.append('ubicacion_longitud', ubicacion_longitud);
    formData.append('direccion', direccion);
    formData.append('estado_id', estado_id);
    formData.append('municipio', municipio);
    formData.append('propietario_id', propietario_id);
    formData.append('tipo_ganaderia', tipo_ganaderia);
    formData.append('activo', activo);
    
    // Agregar datos opcionales
    if (codigo_postal) formData.append('codigo_postal', codigo_postal);
    if (telefono) formData.append('telefono', telefono);
    if (email) formData.append('email', email);
    if (sitio_web) formData.append('sitio_web', sitio_web);
    if (capacidad_bovinos) formData.append('capacidad_bovinos', capacidad_bovinos);
    if (numero_potreros) formData.append('numero_potreros', numero_potreros);
    if (fuente_agua) formData.append('fuente_agua', fuente_agua);
    if (tipo_pasto_predominante) formData.append('tipo_pasto_predominante', tipo_pasto_predominante);
    if (altitud_msnm) formData.append('altitud_msnm', altitud_msnm);
    if (clima_predominante) formData.append('clima_predominante', clima_predominante);
    if (temporada_lluvias_inicio) formData.append('temporada_lluvias_inicio', temporada_lluvias_inicio);
    if (temporada_lluvias_fin) formData.append('temporada_lluvias_fin', temporada_lluvias_fin);
    if (observaciones) formData.append('observaciones', observaciones);
    
    // Agregar flags booleanos
    formData.append('tiene_ordeñadora', tiene_ordeñadora);
    formData.append('tiene_bascula', tiene_bascula);
    formData.append('tiene_comederos', tiene_comederos);
    formData.append('tiene_bebederos', tiene_bebederos);
    
    // Agregar arrays como JSON
    if (coordenadas_poligono.length > 0) {
      formData.append('coordenadas_poligono', JSON.stringify(coordenadas_poligono));
    }
    if (instalaciones.length > 0) {
      formData.append('instalaciones', JSON.stringify(instalaciones));
    }
    if (certificaciones.length > 0) {
      formData.append('certificaciones', JSON.stringify(certificaciones));
    }
    
    // Agregar imágenes
    imagenes.forEach((imagen) => {
      if (imagen instanceof File) {
        formData.append('imagenes', imagen);
      }
    });
    
    // Agregar documentos
    documentos.forEach((documento) => {
      if (documento instanceof File) {
        formData.append('documentos', documento);
      }
    });

    const response = await upload('/ranches', formData);
    
    return {
      success: response.success,
      data: response.data?.ranch || null,
      message: response.success 
        ? 'Rancho creado correctamente'
        : response.message || 'Error al crear rancho'
    };
  } catch (error) {
    console.error('Error al crear rancho:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear rancho'
    };
  }
};

/**
 * Actualizar rancho existente
 * @param {string} ranchId - ID del rancho
 * @param {Object} ranchData - Datos actualizados
 */
export const updateRanch = async (ranchId, ranchData) => {
  try {
    const {
      imagenes_nuevas = [],
      imagenes_eliminar = [],
      documentos_nuevos = [],
      documentos_eliminar = [],
      ...updateData
    } = ranchData;

    // Si hay archivos nuevos o a eliminar, usar FormData
    if (imagenes_nuevas.length > 0 || imagenes_eliminar.length > 0 || 
        documentos_nuevos.length > 0 || documentos_eliminar.length > 0) {
      const formData = new FormData();
      
      // Agregar todos los campos de actualización
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== null && updateData[key] !== undefined) {
          if (Array.isArray(updateData[key]) || typeof updateData[key] === 'object') {
            formData.append(key, JSON.stringify(updateData[key]));
          } else {
            formData.append(key, updateData[key]);
          }
        }
      });
      
      // Agregar archivos nuevos
      imagenes_nuevas.forEach((imagen) => {
        if (imagen instanceof File) {
          formData.append('imagenes_nuevas', imagen);
        }
      });
      documentos_nuevos.forEach((documento) => {
        if (documento instanceof File) {
          formData.append('documentos_nuevos', documento);
        }
      });
      
      // Agregar IDs de archivos a eliminar
      if (imagenes_eliminar.length > 0) {
        formData.append('imagenes_eliminar', JSON.stringify(imagenes_eliminar));
      }
      if (documentos_eliminar.length > 0) {
        formData.append('documentos_eliminar', JSON.stringify(documentos_eliminar));
      }

      const response = await upload(`/ranches/${ranchId}`, formData, {
        method: 'PUT'
      });
      
      return {
        success: response.success,
        data: response.data?.ranch || null,
        message: response.success 
          ? 'Rancho actualizado correctamente'
          : response.message || 'Error al actualizar rancho'
      };
    } else {
      // Actualización simple sin archivos
      const response = await put(`/ranches/${ranchId}`, updateData);
      
      return {
        success: response.success,
        data: response.data?.ranch || null,
        message: response.success 
          ? 'Rancho actualizado correctamente'
          : response.message || 'Error al actualizar rancho'
      };
    }
  } catch (error) {
    console.error('Error al actualizar rancho:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar rancho'
    };
  }
};

/**
 * Eliminar rancho
 * @param {string} ranchId - ID del rancho
 * @param {string} motivo - Motivo de eliminación
 */
export const deleteRanch = async (ranchId, motivo = '') => {
  try {
    const response = await del(`/ranches/${ranchId}`, {
      data: { motivo }
    });
    
    return {
      success: response.success,
      message: response.success 
        ? 'Rancho eliminado correctamente'
        : response.message || 'Error al eliminar rancho'
    };
  } catch (error) {
    console.error('Error al eliminar rancho:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al eliminar rancho'
    };
  }
};

/**
 * Cambiar estado activo/inactivo de un rancho
 * @param {string} ranchId - ID del rancho
 * @param {boolean} activo - Nuevo estado
 */
export const toggleRanchStatus = async (ranchId, activo) => {
  try {
    const response = await patch(`/ranches/${ranchId}/status`, { activo });
    
    return {
      success: response.success,
      data: response.data?.ranch || null,
      message: response.success 
        ? `Rancho ${activo ? 'activado' : 'desactivado'} correctamente`
        : response.message || 'Error al cambiar estado'
    };
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al cambiar estado'
    };
  }
};

/**
 * Obtener ranchos por ubicación geográfica
 * @param {Object} bounds - Límites geográficos
 * @param {Object} filters - Filtros adicionales
 */
export const getRanchesByLocation = async (bounds, filters = {}) => {
  try {
    const {
      north,
      south,
      east,
      west
    } = bounds;

    const {
      activo = null,
      tipo_ganaderia = '',
      superficie_min = '',
      superficie_max = ''
    } = filters;

    const response = await get('/ranches/by-location', {
      north,
      south,
      east,
      west,
      activo,
      tipo_ganaderia,
      superficie_min,
      superficie_max
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener ranchos por ubicación:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar ranchos por ubicación'
    };
  }
};

/**
 * Obtener estadísticas generales de ranchos
 * @param {Object} filters - Filtros para estadísticas
 */
export const getRanchStats = async (filters = {}) => {
  try {
    const {
      estado_id = '',
      propietario_id = '',
      tipo_ganaderia = '',
      activo = null
    } = filters;

    const response = await get('/ranches/stats', {
      estado_id,
      propietario_id,
      tipo_ganaderia,
      activo
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar estadísticas de ranchos'
    };
  }
};

/**
 * Obtener estados/provincias disponibles para ranchos
 */
export const getStates = async () => {
  try {
    const response = await get('/ranches/states');
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener estados:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar estados'
    };
  }
};

/**
 * Obtener municipios por estado
 * @param {string} stateId - ID del estado
 */
export const getMunicipalities = async (stateId) => {
  try {
    const response = await get(`/ranches/states/${stateId}/municipalities`);
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener municipios:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar municipios'
    };
  }
};

/**
 * Buscar ranchos por nombre o características
 * @param {string} query - Término de búsqueda
 * @param {Object} filters - Filtros adicionales
 */
export const searchRanches = async (query, filters = {}) => {
  try {
    const response = await get('/ranches/search', {
      q: query,
      ...filters
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error en búsqueda de ranchos:', error);
    return {
      success: false,
      data: [],
      message: 'Error en la búsqueda'
    };
  }
};

/**
 * Obtener instalaciones/facilidades de un rancho
 * @param {string} ranchId - ID del rancho
 */
export const getRanchFacilities = async (ranchId) => {
  try {
    const response = await get(`/ranches/${ranchId}/facilities`);
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener instalaciones:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar instalaciones del rancho'
    };
  }
};

/**
 * Agregar instalación/facilidad a un rancho
 * @param {string} ranchId - ID del rancho
 * @param {Object} facilityData - Datos de la instalación
 */
export const addRanchFacility = async (ranchId, facilityData) => {
  try {
    const {
      nombre,
      tipo, // establo, corral, ordeñadora, bascula, comedero, bebedero, bodega, oficina
      descripcion = '',
      capacidad = null,
      ubicacion_latitud = null,
      ubicacion_longitud = null,
      estado = 'bueno', // excelente, bueno, regular, malo
      fecha_construccion = null,
      costo_construccion = null,
      requiere_mantenimiento = false,
      fecha_ultimo_mantenimiento = null,
      observaciones = '',
      imagenes = []
    } = facilityData;

    const formData = new FormData();
    
    // Datos básicos
    formData.append('nombre', nombre);
    formData.append('tipo', tipo);
    formData.append('descripcion', descripcion);
    formData.append('estado', estado);
    formData.append('requiere_mantenimiento', requiere_mantenimiento);
    
    // Datos opcionales
    if (capacidad) formData.append('capacidad', capacidad);
    if (ubicacion_latitud) formData.append('ubicacion_latitud', ubicacion_latitud);
    if (ubicacion_longitud) formData.append('ubicacion_longitud', ubicacion_longitud);
    if (fecha_construccion) formData.append('fecha_construccion', fecha_construccion);
    if (costo_construccion) formData.append('costo_construccion', costo_construccion);
    if (fecha_ultimo_mantenimiento) formData.append('fecha_ultimo_mantenimiento', fecha_ultimo_mantenimiento);
    if (observaciones) formData.append('observaciones', observaciones);
    
    // Agregar imágenes
    imagenes.forEach((imagen) => {
      if (imagen instanceof File) {
        formData.append('imagenes', imagen);
      }
    });

    const response = await upload(`/ranches/${ranchId}/facilities`, formData);
    
    return {
      success: response.success,
      data: response.data?.facility || null,
      message: response.success 
        ? 'Instalación agregada correctamente'
        : response.message || 'Error al agregar instalación'
    };
  } catch (error) {
    console.error('Error al agregar instalación:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al agregar instalación'
    };
  }
};

/**
 * Obtener información climática del rancho
 * @param {string} ranchId - ID del rancho
 * @param {Object} params - Parámetros adicionales
 */
export const getRanchWeather = async (ranchId, params = {}) => {
  try {
    const {
      dias_historicos = 7,
      incluir_pronostico = true,
      dias_pronostico = 5
    } = params;

    const response = await get(`/ranches/${ranchId}/weather`, {
      dias_historicos,
      incluir_pronostico,
      dias_pronostico
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener información climática:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar información climática'
    };
  }
};

/**
 * Obtener análisis de productividad del rancho
 * @param {string} ranchId - ID del rancho
 * @param {Object} params - Parámetros de análisis
 */
export const getRanchProductivityAnalysis = async (ranchId, params = {}) => {
  try {
    const {
      fecha_inicio,
      fecha_fin,
      incluir_comparacion_regional = true,
      incluir_tendencias = true,
      incluir_proyecciones = false
    } = params;

    const response = await get(`/ranches/${ranchId}/productivity-analysis`, {
      fecha_inicio,
      fecha_fin,
      incluir_comparacion_regional,
      incluir_tendencias,
      incluir_proyecciones
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener análisis de productividad:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar análisis de productividad'
    };
  }
};

/**
 * Validar ubicación del rancho
 * @param {number} latitud - Latitud
 * @param {number} longitud - Longitud
 */
export const validateRanchLocation = async (latitud, longitud) => {
  try {
    const response = await post('/ranches/validate-location', {
      latitud,
      longitud
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al validar ubicación:', error);
    return {
      success: false,
      data: {},
      message: 'Error al validar ubicación'
    };
  }
};

/**
 * Calcular área del rancho por coordenadas
 * @param {Array} coordenadas - Array de coordenadas [lat, lng]
 */
export const calculateRanchArea = async (coordenadas) => {
  try {
    const response = await post('/ranches/calculate-area', {
      coordenadas
    });
    
    return {
      success: response.success,
      data: response.data || { area_hectareas: 0 },
      message: response.message
    };
  } catch (error) {
    console.error('Error al calcular área:', error);
    return {
      success: false,
      data: { area_hectareas: 0 },
      message: 'Error al calcular área'
    };
  }
};

/**
 * Generar reporte del rancho
 * @param {string} ranchId - ID del rancho
 * @param {Object} options - Opciones del reporte
 */
export const generateRanchReport = async (ranchId, options = {}) => {
  try {
    const {
      tipo_reporte = 'completo', // completo, bovinos, produccion, finanzas, salud
      fecha_inicio,
      fecha_fin,
      formato = 'pdf', // pdf, excel, word
      incluir_imagenes = true,
      incluir_graficos = true
    } = options;

    const response = await get(`/ranches/${ranchId}/report`, {
      tipo_reporte,
      fecha_inicio,
      fecha_fin,
      formato,
      incluir_imagenes,
      incluir_graficos
    }, {
      responseType: 'blob'
    });
    
    return {
      success: response.success,
      data: response.data,
      message: 'Reporte generado correctamente'
    };
  } catch (error) {
    console.error('Error al generar reporte:', error);
    return {
      success: false,
      message: 'Error al generar reporte'
    };
  }
};

/**
 * Exportar datos de ranchos
 * @param {Object} filters - Filtros para exportación
 * @param {string} format - Formato de exportación (csv, excel, pdf)
 */
export const exportRanches = async (filters = {}, format = 'excel') => {
  try {
    const response = await get('/ranches/export', {
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
    console.error('Error al exportar ranchos:', error);
    return {
      success: false,
      message: 'Error al exportar datos'
    };
  }
};

/**
 * Obtener ranchos del usuario actual
 */
export const getMyRanches = async () => {
  try {
    const response = await get('/ranches/my-ranches');
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener mis ranchos:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar mis ranchos'
    };
  }
};

// Constantes útiles para tipos de ganadería
export const CATTLE_TYPES = {
  LECHERO: 'lechero',
  CARNE: 'carne',
  MIXTO: 'mixto',
  REPRODUCTOR: 'reproductor'
};

// Constantes para tipos de instalaciones
export const FACILITY_TYPES = {
  ESTABLO: 'establo',
  CORRAL: 'corral',
  ORDEÑADORA: 'ordeñadora',
  BASCULA: 'bascula',
  COMEDERO: 'comedero',
  BEBEDERO: 'bebedero',
  BODEGA: 'bodega',
  OFICINA: 'oficina',
  CLINICA: 'clinica',
  LABORATORIO: 'laboratorio'
};

// Constantes para estados de instalaciones
export const FACILITY_CONDITIONS = {
  EXCELENTE: 'excelente',
  BUENO: 'bueno',
  REGULAR: 'regular',
  MALO: 'malo'
};

// Constantes para fuentes de agua
export const WATER_SOURCES = {
  POZO: 'pozo',
  RIO: 'rio',
  LAGO: 'lago',
  LLUVIA: 'lluvia',
  MUNICIPAL: 'municipal',
  MIXTO: 'mixto'
};

// Exportaciones por defecto
export default {
  getRanches,
  getRanchById,
  createRanch,
  updateRanch,
  deleteRanch,
  toggleRanchStatus,
  getRanchesByLocation,
  getRanchStats,
  getStates,
  getMunicipalities,
  searchRanches,
  getRanchFacilities,
  addRanchFacility,
  getRanchWeather,
  getRanchProductivityAnalysis,
  validateRanchLocation,
  calculateRanchArea,
  generateRanchReport,
  exportRanches,
  getMyRanches,
  CATTLE_TYPES,
  FACILITY_TYPES,
  FACILITY_CONDITIONS,
  WATER_SOURCES
};