import { get, post, put, patch, del, upload } from './api';

/**
 * Servicio para gestión de bovinos en el sistema
 * Incluye CRUD completo, filtros, búsquedas, ubicaciones y gestión de imágenes
 */

/**
 * Obtener lista de bovinos con filtros y paginación
 * @param {Object} params - Parámetros de búsqueda y filtros
 */
export const getBovines = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      raza_id = '',
      sexo_id = '',
      estado_id = '',
      clasificacion_id = '',
      rancho_id = '',
      edad_min = '',
      edad_max = '',
      peso_min = '',
      peso_max = '',
      sortBy = 'fecha_nacimiento',
      sortOrder = 'desc',
      include_location = false,
      include_health = false,
      include_production = false
    } = params;

    const queryParams = {
      page,
      limit,
      search,
      raza_id,
      sexo_id,
      estado_id,
      clasificacion_id,
      rancho_id,
      edad_min,
      edad_max,
      peso_min,
      peso_max,
      sortBy,
      sortOrder,
      include_location,
      include_health,
      include_production
    };

    // Remover parámetros vacíos
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    const response = await get('/bovines', queryParams);
    
    return {
      success: response.success,
      data: response.data?.bovines || [],
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      totalPages: response.data?.totalPages || 1,
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener bovinos:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: 'Error al cargar lista de bovinos'
    };
  }
};

/**
 * Obtener detalles de un bovino específico
 * @param {string} bovineId - ID del bovino
 * @param {Object} options - Opciones adicionales
 */
export const getBovineById = async (bovineId, options = {}) => {
  try {
    const {
      include_health = true,
      include_production = true,
      include_reproduction = true,
      include_location = true,
      include_events = true
    } = options;

    const response = await get(`/bovines/${bovineId}`, {
      include_health,
      include_production,
      include_reproduction,
      include_location,
      include_events
    });
    
    return {
      success: response.success,
      data: response.data || null,
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener bovino:', error);
    return {
      success: false,
      data: null,
      message: 'Error al cargar datos del bovino'
    };
  }
};

/**
 * Crear nuevo bovino
 * @param {Object} bovineData - Datos del bovino
 */
export const createBovine = async (bovineData) => {
  try {
    const {
      numero_identificacion,
      nombre,
      fecha_nacimiento,
      raza_id,
      sexo_id,
      estado_id,
      clasificacion_id,
      rancho_id,
      peso_nacimiento,
      madre_id,
      padre_id,
      ubicacion_latitud,
      ubicacion_longitud,
      observaciones,
      imagenes = []
    } = bovineData;

    // Preparar datos para envío
    const formData = new FormData();
    
    // Agregar datos básicos
    formData.append('numero_identificacion', numero_identificacion);
    formData.append('nombre', nombre || '');
    formData.append('fecha_nacimiento', fecha_nacimiento);
    formData.append('raza_id', raza_id);
    formData.append('sexo_id', sexo_id);
    formData.append('estado_id', estado_id);
    formData.append('clasificacion_id', clasificacion_id);
    formData.append('rancho_id', rancho_id);
    
    // Agregar datos opcionales
    if (peso_nacimiento) formData.append('peso_nacimiento', peso_nacimiento);
    if (madre_id) formData.append('madre_id', madre_id);
    if (padre_id) formData.append('padre_id', padre_id);
    if (ubicacion_latitud) formData.append('ubicacion_latitud', ubicacion_latitud);
    if (ubicacion_longitud) formData.append('ubicacion_longitud', ubicacion_longitud);
    if (observaciones) formData.append('observaciones', observaciones);
    
    // Agregar imágenes
    imagenes.forEach((imagen, index) => {
      if (imagen instanceof File) {
        formData.append(`imagenes`, imagen);
      }
    });

    const response = await upload('/bovines', formData);
    
    return {
      success: response.success,
      data: response.data?.bovine || null,
      message: response.success 
        ? 'Bovino registrado correctamente'
        : response.message || 'Error al registrar bovino'
    };
  } catch (error) {
    console.error('Error al crear bovino:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al registrar bovino'
    };
  }
};

/**
 * Actualizar bovino existente
 * @param {string} bovineId - ID del bovino
 * @param {Object} bovineData - Datos actualizados
 */
export const updateBovine = async (bovineId, bovineData) => {
  try {
    const {
      imagenes_nuevas = [],
      imagenes_eliminar = [],
      ...updateData
    } = bovineData;

    // Si hay imágenes nuevas o a eliminar, usar FormData
    if (imagenes_nuevas.length > 0 || imagenes_eliminar.length > 0) {
      const formData = new FormData();
      
      // Agregar todos los campos de actualización
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== null && updateData[key] !== undefined) {
          formData.append(key, updateData[key]);
        }
      });
      
      // Agregar imágenes nuevas
      imagenes_nuevas.forEach((imagen) => {
        if (imagen instanceof File) {
          formData.append('imagenes_nuevas', imagen);
        }
      });
      
      // Agregar IDs de imágenes a eliminar
      if (imagenes_eliminar.length > 0) {
        formData.append('imagenes_eliminar', JSON.stringify(imagenes_eliminar));
      }

      const response = await upload(`/bovines/${bovineId}`, formData, {
        method: 'PUT'
      });
      
      return {
        success: response.success,
        data: response.data?.bovine || null,
        message: response.success 
          ? 'Bovino actualizado correctamente'
          : response.message || 'Error al actualizar bovino'
      };
    } else {
      // Actualización simple sin imágenes
      const response = await put(`/bovines/${bovineId}`, updateData);
      
      return {
        success: response.success,
        data: response.data?.bovine || null,
        message: response.success 
          ? 'Bovino actualizado correctamente'
          : response.message || 'Error al actualizar bovino'
      };
    }
  } catch (error) {
    console.error('Error al actualizar bovino:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar bovino'
    };
  }
};

/**
 * Eliminar bovino
 * @param {string} bovineId - ID del bovino
 * @param {string} motivo - Motivo de eliminación
 */
export const deleteBovine = async (bovineId, motivo = '') => {
  try {
    const response = await del(`/bovines/${bovineId}`, {
      data: { motivo }
    });
    
    return {
      success: response.success,
      message: response.success 
        ? 'Bovino eliminado correctamente'
        : response.message || 'Error al eliminar bovino'
    };
  } catch (error) {
    console.error('Error al eliminar bovino:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al eliminar bovino'
    };
  }
};

/**
 * Cambiar estado de un bovino
 * @param {string} bovineId - ID del bovino
 * @param {string} nuevoEstado - Nuevo estado
 * @param {Object} detalles - Detalles adicionales del cambio
 */
export const changeBovineStatus = async (bovineId, nuevoEstado, detalles = {}) => {
  try {
    const response = await patch(`/bovines/${bovineId}/status`, {
      estado_id: nuevoEstado,
      ...detalles
    });
    
    return {
      success: response.success,
      data: response.data?.bovine || null,
      message: response.success 
        ? 'Estado del bovino actualizado correctamente'
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
 * Actualizar ubicación de un bovino
 * @param {string} bovineId - ID del bovino
 * @param {Object} ubicacion - Datos de ubicación
 */
export const updateBovineLocation = async (bovineId, ubicacion) => {
  try {
    const {
      latitud,
      longitud,
      actividad,
      descripcion = ''
    } = ubicacion;

    const response = await post(`/bovines/${bovineId}/location`, {
      latitud,
      longitud,
      actividad,
      descripcion
    });
    
    return {
      success: response.success,
      data: response.data || null,
      message: response.success 
        ? 'Ubicación actualizada correctamente'
        : response.message || 'Error al actualizar ubicación'
    };
  } catch (error) {
    console.error('Error al actualizar ubicación:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar ubicación'
    };
  }
};

/**
 * Obtener historial de ubicaciones de un bovino
 * @param {string} bovineId - ID del bovino
 * @param {Object} filters - Filtros de fecha
 */
export const getBovineLocationHistory = async (bovineId, filters = {}) => {
  try {
    const response = await get(`/bovines/${bovineId}/location-history`, filters);
    
    return {
      success: response.success,
      data: response.data || [],
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
 * Obtener razas disponibles
 */
export const getRazas = async () => {
  try {
    const response = await get('/bovines/catalogs/razas');
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener razas:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar razas'
    };
  }
};

/**
 * Obtener sexos disponibles
 */
export const getSexos = async () => {
  try {
    const response = await get('/bovines/catalogs/sexos');
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener sexos:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar sexos'
    };
  }
};

/**
 * Obtener estados disponibles
 */
export const getEstados = async () => {
  try {
    const response = await get('/bovines/catalogs/estados');
    
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
 * Obtener clasificaciones disponibles
 */
export const getClasificaciones = async () => {
  try {
    const response = await get('/bovines/catalogs/clasificaciones');
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener clasificaciones:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar clasificaciones'
    };
  }
};

/**
 * Buscar bovinos por número de identificación o nombre
 * @param {string} query - Término de búsqueda
 * @param {Object} filters - Filtros adicionales
 */
export const searchBovines = async (query, filters = {}) => {
  try {
    const response = await get('/bovines/search', {
      q: query,
      ...filters
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error en búsqueda de bovinos:', error);
    return {
      success: false,
      data: [],
      message: 'Error en la búsqueda'
    };
  }
};

/**
 * Obtener bovinos por ubicación geográfica
 * @param {Object} bounds - Límites geográficos
 * @param {Object} filters - Filtros adicionales
 */
export const getBovinesByLocation = async (bounds, filters = {}) => {
  try {
    const {
      north,
      south,
      east,
      west
    } = bounds;

    const response = await get('/bovines/by-location', {
      north,
      south,
      east,
      west,
      ...filters
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener bovinos por ubicación:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar bovinos por ubicación'
    };
  }
};

/**
 * Obtener estadísticas generales de bovinos
 * @param {string} ranchoId - ID del rancho (opcional)
 */
export const getBovineStats = async (ranchoId = null) => {
  try {
    const params = ranchoId ? { rancho_id: ranchoId } : {};
    const response = await get('/bovines/stats', params);
    
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
      message: 'Error al cargar estadísticas'
    };
  }
};

/**
 * Exportar datos de bovinos
 * @param {Object} filters - Filtros para exportación
 * @param {string} format - Formato de exportación (csv, excel, pdf)
 */
export const exportBovines = async (filters = {}, format = 'csv') => {
  try {
    const response = await get('/bovines/export', {
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
    console.error('Error al exportar bovinos:', error);
    return {
      success: false,
      message: 'Error al exportar datos'
    };
  }
};

/**
 * Obtener madres disponibles para asignar
 * @param {string} ranchoId - ID del rancho
 */
export const getAvailableMothers = async (ranchoId) => {
  try {
    const response = await get('/bovines/available-mothers', {
      rancho_id: ranchoId
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener madres disponibles:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar madres disponibles'
    };
  }
};

/**
 * Obtener padres disponibles para asignar
 * @param {string} ranchoId - ID del rancho
 */
export const getAvailableFathers = async (ranchoId) => {
  try {
    const response = await get('/bovines/available-fathers', {
      rancho_id: ranchoId
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener padres disponibles:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar padres disponibles'
    };
  }
};

/**
 * Obtener bovinos preñados
 * @param {string} ranchoId - ID del rancho
 */
export const getPregnantFemales = async (ranchoId) => {
  try {
    const response = await get('/bovines/pregnant-females', {
      rancho_id: ranchoId
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener hembras preñadas:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar hembras preñadas'
    };
  }
};

/**
 * Obtener toros del rancho
 * @param {string} ranchoId - ID del rancho
 */
export const getBulls = async (ranchoId) => {
  try {
    const response = await get('/bovines/bulls', {
      rancho_id: ranchoId
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener toros:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar toros'
    };
  }
};

// Exportaciones por defecto
export default {
  getBovines,
  getBovineById,
  createBovine,
  updateBovine,
  deleteBovine,
  changeBovineStatus,
  updateBovineLocation,
  getBovineLocationHistory,
  getRazas,
  getSexos,
  getEstados,
  getClasificaciones,
  searchBovines,
  getBovinesByLocation,
  getBovineStats,
  exportBovines,
  getAvailableMothers,
  getAvailableFathers,
  getPregnantFemales,
  getBulls
};