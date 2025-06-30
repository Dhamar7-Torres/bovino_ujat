import { get, post, put, patch, del, upload } from './api';

/**
 * Servicio para gestión de producción en el sistema de gestión de bovinos
 * Incluye producción lechera, seguimiento de peso, calidad y análisis de rendimiento
 */

/**
 * Obtener registros de producción con filtros
 * @param {Object} params - Parámetros de búsqueda y filtros
 */
export const getProductionRecords = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      bovino_id = '',
      rancho_id = '',
      tipo_produccion_id = '',
      fecha_inicio = '',
      fecha_fin = '',
      turno = '', // mañana, tarde, noche
      calidad_id = '',
      operador_id = '',
      cantidad_min = '',
      cantidad_max = '',
      sortBy = 'fecha_produccion',
      sortOrder = 'desc',
      include_bovine = true,
      include_quality = true,
      include_analysis = false,
      group_by = '', // dia, semana, mes, bovino
      aggregate_function = 'sum' // sum, avg, max, min, count
    } = params;

    const queryParams = {
      page,
      limit,
      bovino_id,
      rancho_id,
      tipo_produccion_id,
      fecha_inicio,
      fecha_fin,
      turno,
      calidad_id,
      operador_id,
      cantidad_min,
      cantidad_max,
      sortBy,
      sortOrder,
      include_bovine,
      include_quality,
      include_analysis,
      group_by,
      aggregate_function
    };

    // Remover parámetros vacíos
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    const response = await get('/production/records', queryParams);
    
    return {
      success: response.success,
      data: response.data?.records || [],
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      totalPages: response.data?.totalPages || 1,
      summary: response.data?.summary || {},
      aggregated_data: response.data?.aggregated_data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener registros de producción:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: 'Error al cargar registros de producción'
    };
  }
};

/**
 * Obtener detalles de un registro de producción específico
 * @param {string} recordId - ID del registro
 */
export const getProductionRecordById = async (recordId) => {
  try {
    const response = await get(`/production/records/${recordId}`);
    
    return {
      success: response.success,
      data: response.data || null,
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener registro de producción:', error);
    return {
      success: false,
      data: null,
      message: 'Error al cargar datos del registro de producción'
    };
  }
};

/**
 * Crear nuevo registro de producción
 * @param {Object} productionData - Datos del registro de producción
 */
export const createProductionRecord = async (productionData) => {
  try {
    const {
      bovino_id,
      tipo_produccion_id,
      fecha_produccion,
      hora_produccion,
      cantidad,
      unidad_medida = 'litros',
      calidad_id,
      turno = 'mañana',
      operador_id,
      rancho_id,
      ubicacion_latitud,
      ubicacion_longitud,
      ubicacion_descripcion,
      temperatura_producto = null,
      ph_nivel = null,
      grasa_porcentaje = null,
      proteina_porcentaje = null,
      solidos_totales = null,
      celulas_somaticas = null,
      bacteria_totales = null,
      observaciones = '',
      condiciones_climaticas = '',
      temperatura_ambiente = null,
      humedad_relativa = null,
      equipo_utilizado = '',
      metodo_recoleccion = 'manual',
      tiempo_ordeño = null,
      imagenes = [],
      documentos = []
    } = productionData;

    // Preparar datos para envío
    const formData = new FormData();
    
    // Agregar datos básicos
    formData.append('bovino_id', bovino_id);
    formData.append('tipo_produccion_id', tipo_produccion_id);
    formData.append('fecha_produccion', fecha_produccion);
    formData.append('hora_produccion', hora_produccion);
    formData.append('cantidad', cantidad);
    formData.append('unidad_medida', unidad_medida);
    formData.append('calidad_id', calidad_id);
    formData.append('turno', turno);
    formData.append('operador_id', operador_id);
    formData.append('rancho_id', rancho_id);
    formData.append('metodo_recoleccion', metodo_recoleccion);
    
    // Agregar datos opcionales
    if (ubicacion_latitud) formData.append('ubicacion_latitud', ubicacion_latitud);
    if (ubicacion_longitud) formData.append('ubicacion_longitud', ubicacion_longitud);
    if (ubicacion_descripcion) formData.append('ubicacion_descripcion', ubicacion_descripcion);
    if (temperatura_producto) formData.append('temperatura_producto', temperatura_producto);
    if (ph_nivel) formData.append('ph_nivel', ph_nivel);
    if (grasa_porcentaje) formData.append('grasa_porcentaje', grasa_porcentaje);
    if (proteina_porcentaje) formData.append('proteina_porcentaje', proteina_porcentaje);
    if (solidos_totales) formData.append('solidos_totales', solidos_totales);
    if (celulas_somaticas) formData.append('celulas_somaticas', celulas_somaticas);
    if (bacteria_totales) formData.append('bacteria_totales', bacteria_totales);
    if (observaciones) formData.append('observaciones', observaciones);
    if (condiciones_climaticas) formData.append('condiciones_climaticas', condiciones_climaticas);
    if (temperatura_ambiente) formData.append('temperatura_ambiente', temperatura_ambiente);
    if (humedad_relativa) formData.append('humedad_relativa', humedad_relativa);
    if (equipo_utilizado) formData.append('equipo_utilizado', equipo_utilizado);
    if (tiempo_ordeño) formData.append('tiempo_ordeño', tiempo_ordeño);
    
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

    const response = await upload('/production/records', formData);
    
    return {
      success: response.success,
      data: response.data?.record || null,
      message: response.success 
        ? 'Registro de producción creado correctamente'
        : response.message || 'Error al crear registro de producción'
    };
  } catch (error) {
    console.error('Error al crear registro de producción:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear registro de producción'
    };
  }
};

/**
 * Actualizar registro de producción existente
 * @param {string} recordId - ID del registro
 * @param {Object} productionData - Datos actualizados
 */
export const updateProductionRecord = async (recordId, productionData) => {
  try {
    const {
      imagenes_nuevas = [],
      imagenes_eliminar = [],
      documentos_nuevos = [],
      documentos_eliminar = [],
      ...updateData
    } = productionData;

    // Si hay archivos nuevos o a eliminar, usar FormData
    if (imagenes_nuevas.length > 0 || imagenes_eliminar.length > 0 || 
        documentos_nuevos.length > 0 || documentos_eliminar.length > 0) {
      const formData = new FormData();
      
      // Agregar todos los campos de actualización
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== null && updateData[key] !== undefined) {
          formData.append(key, updateData[key]);
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

      const response = await upload(`/production/records/${recordId}`, formData, {
        method: 'PUT'
      });
      
      return {
        success: response.success,
        data: response.data?.record || null,
        message: response.success 
          ? 'Registro de producción actualizado correctamente'
          : response.message || 'Error al actualizar registro'
      };
    } else {
      // Actualización simple sin archivos
      const response = await put(`/production/records/${recordId}`, updateData);
      
      return {
        success: response.success,
        data: response.data?.record || null,
        message: response.success 
          ? 'Registro de producción actualizado correctamente'
          : response.message || 'Error al actualizar registro'
      };
    }
  } catch (error) {
    console.error('Error al actualizar registro:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar registro'
    };
  }
};

/**
 * Eliminar registro de producción
 * @param {string} recordId - ID del registro
 * @param {string} motivo - Motivo de eliminación
 */
export const deleteProductionRecord = async (recordId, motivo = '') => {
  try {
    const response = await del(`/production/records/${recordId}`, {
      data: { motivo }
    });
    
    return {
      success: response.success,
      message: response.success 
        ? 'Registro de producción eliminado correctamente'
        : response.message || 'Error al eliminar registro'
    };
  } catch (error) {
    console.error('Error al eliminar registro:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al eliminar registro'
    };
  }
};

/**
 * Obtener registros de peso de bovinos
 * @param {Object} params - Parámetros de filtrado
 */
export const getWeightRecords = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      bovino_id = '',
      rancho_id = '',
      fecha_inicio = '',
      fecha_fin = '',
      peso_min = '',
      peso_max = '',
      tipo_pesaje = '', // nacimiento, destete, engorde, sacrificio, rutinario
      include_growth_rate = true,
      sortBy = 'fecha_pesaje',
      sortOrder = 'desc'
    } = params;

    const response = await get('/production/weight-records', {
      page,
      limit,
      bovino_id,
      rancho_id,
      fecha_inicio,
      fecha_fin,
      peso_min,
      peso_max,
      tipo_pesaje,
      include_growth_rate,
      sortBy,
      sortOrder
    });
    
    return {
      success: response.success,
      data: response.data?.records || [],
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      totalPages: response.data?.totalPages || 1,
      summary: response.data?.summary || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener registros de peso:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: 'Error al cargar registros de peso'
    };
  }
};

/**
 * Registrar peso de bovino
 * @param {Object} weightData - Datos del pesaje
 */
export const recordWeight = async (weightData) => {
  try {
    const {
      bovino_id,
      peso,
      fecha_pesaje,
      hora_pesaje = null,
      tipo_pesaje = 'rutinario',
      condicion_corporal = null,
      operador_id,
      equipo_utilizado = '',
      condiciones_pesaje = '',
      observaciones = '',
      ubicacion_latitud = null,
      ubicacion_longitud = null,
      temperatura_ambiente = null,
      imagenes = []
    } = weightData;

    const formData = new FormData();
    
    // Datos básicos
    formData.append('bovino_id', bovino_id);
    formData.append('peso', peso);
    formData.append('fecha_pesaje', fecha_pesaje);
    formData.append('tipo_pesaje', tipo_pesaje);
    formData.append('operador_id', operador_id);
    
    // Datos opcionales
    if (hora_pesaje) formData.append('hora_pesaje', hora_pesaje);
    if (condicion_corporal) formData.append('condicion_corporal', condicion_corporal);
    if (equipo_utilizado) formData.append('equipo_utilizado', equipo_utilizado);
    if (condiciones_pesaje) formData.append('condiciones_pesaje', condiciones_pesaje);
    if (observaciones) formData.append('observaciones', observaciones);
    if (ubicacion_latitud) formData.append('ubicacion_latitud', ubicacion_latitud);
    if (ubicacion_longitud) formData.append('ubicacion_longitud', ubicacion_longitud);
    if (temperatura_ambiente) formData.append('temperatura_ambiente', temperatura_ambiente);
    
    // Agregar imágenes
    imagenes.forEach((imagen) => {
      if (imagen instanceof File) {
        formData.append('imagenes', imagen);
      }
    });

    const response = await upload('/production/weight-records', formData);
    
    return {
      success: response.success,
      data: response.data?.record || null,
      message: response.success 
        ? 'Peso registrado correctamente'
        : response.message || 'Error al registrar peso'
    };
  } catch (error) {
    console.error('Error al registrar peso:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al registrar peso'
    };
  }
};

/**
 * Obtener estadísticas de producción
 * @param {Object} filters - Filtros para estadísticas
 */
export const getProductionStats = async (filters = {}) => {
  try {
    const {
      rancho_id = '',
      bovino_id = '',
      tipo_produccion_id = '',
      fecha_inicio = '',
      fecha_fin = '',
      agrupacion = 'dia', // dia, semana, mes, año
      include_comparisons = true,
      include_projections = false,
      include_quality_metrics = true
    } = filters;

    const response = await get('/production/stats', {
      rancho_id,
      bovino_id,
      tipo_produccion_id,
      fecha_inicio,
      fecha_fin,
      agrupacion,
      include_comparisons,
      include_projections,
      include_quality_metrics
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
      message: 'Error al cargar estadísticas de producción'
    };
  }
};

/**
 * Obtener análisis de productividad por bovino
 * @param {Object} params - Parámetros de análisis
 */
export const getProductivityAnalysis = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      raza_id = '',
      edad_min = '',
      edad_max = '',
      fecha_inicio,
      fecha_fin,
      include_feed_correlation = false,
      include_health_correlation = false,
      include_weather_correlation = false
    } = params;

    const response = await get('/production/productivity-analysis', {
      rancho_id,
      raza_id,
      edad_min,
      edad_max,
      fecha_inicio,
      fecha_fin,
      include_feed_correlation,
      include_health_correlation,
      include_weather_correlation
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
 * Obtener curva de lactancia de una vaca
 * @param {string} bovineId - ID del bovino
 * @param {Object} params - Parámetros adicionales
 */
export const getLactationCurve = async (bovineId, params = {}) => {
  try {
    const {
      lactacion_numero = null, // null para la lactación actual
      include_prediction = true,
      model_type = 'wood' // wood, wilmink, legendre
    } = params;

    const response = await get(`/production/lactation-curve/${bovineId}`, {
      lactacion_numero,
      include_prediction,
      model_type
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener curva de lactancia:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar curva de lactancia'
    };
  }
};

/**
 * Obtener ranking de producción
 * @param {Object} params - Parámetros del ranking
 */
export const getProductionRanking = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      tipo_produccion_id = '',
      fecha_inicio,
      fecha_fin,
      criterio = 'cantidad_total', // cantidad_total, promedio_diario, constancia
      limit = 50,
      raza_id = '',
      edad_min = '',
      edad_max = ''
    } = params;

    const response = await get('/production/ranking', {
      rancho_id,
      tipo_produccion_id,
      fecha_inicio,
      fecha_fin,
      criterio,
      limit,
      raza_id,
      edad_min,
      edad_max
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener ranking:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar ranking de producción'
    };
  }
};

/**
 * Obtener tipos de producción disponibles
 */
export const getProductionTypes = async () => {
  try {
    const response = await get('/production/types');
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener tipos de producción:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar tipos de producción'
    };
  }
};

/**
 * Obtener calidades de producción disponibles
 */
export const getProductionQualities = async () => {
  try {
    const response = await get('/production/qualities');
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener calidades:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar calidades de producción'
    };
  }
};

/**
 * Crear lote de producción
 * @param {Object} batchData - Datos del lote
 */
export const createProductionBatch = async (batchData) => {
  try {
    const {
      nombre_lote,
      fecha_inicio,
      fecha_fin,
      bovinos_ids = [],
      tipo_produccion_id,
      objetivo_cantidad = null,
      responsable_id,
      observaciones = '',
      metadatos = {}
    } = batchData;

    const response = await post('/production/batches', {
      nombre_lote,
      fecha_inicio,
      fecha_fin,
      bovinos_ids,
      tipo_produccion_id,
      objetivo_cantidad,
      responsable_id,
      observaciones,
      metadatos
    });
    
    return {
      success: response.success,
      data: response.data?.batch || null,
      message: response.success 
        ? 'Lote de producción creado correctamente'
        : response.message || 'Error al crear lote'
    };
  } catch (error) {
    console.error('Error al crear lote:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear lote'
    };
  }
};

/**
 * Obtener lotes de producción
 * @param {Object} filters - Filtros para lotes
 */
export const getProductionBatches = async (filters = {}) => {
  try {
    const {
      rancho_id = '',
      estado = '', // activo, completado, cancelado
      fecha_inicio = '',
      fecha_fin = '',
      responsable_id = '',
      include_statistics = true
    } = filters;

    const response = await get('/production/batches', {
      rancho_id,
      estado,
      fecha_inicio,
      fecha_fin,
      responsable_id,
      include_statistics
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener lotes:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar lotes de producción'
    };
  }
};

/**
 * Obtener alertas de producción
 * @param {Object} params - Parámetros de filtrado
 */
export const getProductionAlerts = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      tipo_alerta = '', // baja_produccion, calidad_baja, peso_bajo
      prioridad = '', // alta, media, baja
      activo = true
    } = params;

    const response = await get('/production/alerts', {
      rancho_id,
      tipo_alerta,
      prioridad,
      activo
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar alertas de producción'
    };
  }
};

/**
 * Buscar en registros de producción
 * @param {string} query - Término de búsqueda
 * @param {Object} filters - Filtros adicionales
 */
export const searchProductionRecords = async (query, filters = {}) => {
  try {
    const response = await get('/production/search', {
      q: query,
      ...filters
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error en búsqueda:', error);
    return {
      success: false,
      data: [],
      message: 'Error en la búsqueda'
    };
  }
};

/**
 * Exportar datos de producción
 * @param {Object} filters - Filtros para exportación
 * @param {string} format - Formato de exportación (csv, excel, pdf)
 * @param {string} reportType - Tipo de reporte (records, stats, ranking, curves)
 */
export const exportProductionData = async (filters = {}, format = 'excel', reportType = 'records') => {
  try {
    const response = await get('/production/export', {
      ...filters,
      format,
      reportType
    }, {
      responseType: 'blob'
    });
    
    return {
      success: response.success,
      data: response.data,
      message: 'Exportación completada'
    };
  } catch (error) {
    console.error('Error al exportar:', error);
    return {
      success: false,
      message: 'Error al exportar datos'
    };
  }
};

/**
 * Obtener proyecciones de producción
 * @param {Object} params - Parámetros para proyecciones
 */
export const getProductionProjections = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      bovino_id = '',
      dias_adelante = 30,
      modelo = 'lineal', // lineal, exponencial, estacional
      incluir_factores_externos = true
    } = params;

    const response = await get('/production/projections', {
      rancho_id,
      bovino_id,
      dias_adelante,
      modelo,
      incluir_factores_externos
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener proyecciones:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar proyecciones'
    };
  }
};

// Constantes útiles para tipos de producción
export const PRODUCTION_TYPES = {
  LECHE: 'leche',
  CARNE: 'carne',
  MIXTO: 'mixto'
};

export const PRODUCTION_QUALITIES = {
  EXCELENTE: 'excelente',
  BUENA: 'buena',
  REGULAR: 'regular',
  DEFICIENTE: 'deficiente'
};

export const WEIGHT_TYPES = {
  NACIMIENTO: 'nacimiento',
  DESTETE: 'destete',
  ENGORDE: 'engorde',
  SACRIFICIO: 'sacrificio',
  RUTINARIO: 'rutinario'
};

export const MILKING_SHIFTS = {
  MAÑANA: 'mañana',
  TARDE: 'tarde',
  NOCHE: 'noche'
};

// Exportaciones por defecto
export default {
  getProductionRecords,
  getProductionRecordById,
  createProductionRecord,
  updateProductionRecord,
  deleteProductionRecord,
  getWeightRecords,
  recordWeight,
  getProductionStats,
  getProductivityAnalysis,
  getLactationCurve,
  getProductionRanking,
  getProductionTypes,
  getProductionQualities,
  createProductionBatch,
  getProductionBatches,
  getProductionAlerts,
  searchProductionRecords,
  exportProductionData,
  getProductionProjections,
  PRODUCTION_TYPES,
  PRODUCTION_QUALITIES,
  WEIGHT_TYPES,
  MILKING_SHIFTS
};