import { get, post, put, patch, del, upload } from './api';

/**
 * Servicio para gestión de reportes en el sistema de gestión de bovinos
 * Incluye reportes predefinidos, personalizados, análisis de datos y exportación
 */

/**
 * Obtener lista de reportes disponibles
 * @param {Object} params - Parámetros de filtrado
 */
export const getAvailableReports = async (params = {}) => {
  try {
    const {
      categoria = '', // bovinos, produccion, salud, finanzas, inventario, eventos
      tipo = '', // predefinido, personalizado, automatico
      activo = null,
      acceso_publico = null,
      creado_por = '',
      rancho_id = ''
    } = params;

    const queryParams = {
      categoria,
      tipo,
      activo,
      acceso_publico,
      creado_por,
      rancho_id
    };

    // Remover parámetros vacíos
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    const response = await get('/reports/available', queryParams);
    
    return {
      success: response.success,
      data: response.data?.reports || [],
      categories: response.data?.categories || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener reportes disponibles:', error);
    return {
      success: false,
      data: [],
      categories: [],
      message: 'Error al cargar reportes disponibles'
    };
  }
};

/**
 * Generar reporte específico
 * @param {string} reportId - ID del reporte o nombre del reporte predefinido
 * @param {Object} parameters - Parámetros para generar el reporte
 */
export const generateReport = async (reportId, parameters = {}) => {
  try {
    const {
      fecha_inicio,
      fecha_fin,
      rancho_id = '',
      bovino_id = '',
      filtros = {},
      formato = 'html', // html, pdf, excel, csv, json
      incluir_graficos = true,
      incluir_tablas = true,
      incluir_imagenes = false,
      idioma = 'es',
      plantilla_id = null,
      configuracion = {},
      enviar_email = false,
      destinatarios_email = []
    } = parameters;

    const response = await post(`/reports/generate/${reportId}`, {
      fecha_inicio,
      fecha_fin,
      rancho_id,
      bovino_id,
      filtros,
      formato,
      incluir_graficos,
      incluir_tablas,
      incluir_imagenes,
      idioma,
      plantilla_id,
      configuracion,
      enviar_email,
      destinatarios_email
    });
    
    return {
      success: response.success,
      data: response.data || {},
      download_url: response.data?.download_url || null,
      report_id: response.data?.report_id || null,
      message: response.success 
        ? 'Reporte generado correctamente'
        : response.message || 'Error al generar reporte'
    };
  } catch (error) {
    console.error('Error al generar reporte:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al generar reporte'
    };
  }
};

/**
 * Obtener reporte de bovinos
 * @param {Object} filters - Filtros para el reporte
 */
export const getBovineReport = async (filters = {}) => {
  try {
    const {
      rancho_id = '',
      raza_id = '',
      sexo_id = '',
      estado_id = '',
      clasificacion_id = '',
      edad_min = '',
      edad_max = '',
      peso_min = '',
      peso_max = '',
      fecha_inicio = '',
      fecha_fin = '',
      incluir_imagenes = false,
      agrupar_por = '', // raza, sexo, estado, clasificacion, edad
      formato = 'json'
    } = filters;

    const response = await get('/reports/bovines', {
      rancho_id,
      raza_id,
      sexo_id,
      estado_id,
      clasificacion_id,
      edad_min,
      edad_max,
      peso_min,
      peso_max,
      fecha_inicio,
      fecha_fin,
      incluir_imagenes,
      agrupar_por,
      formato
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener reporte de bovinos:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar reporte de bovinos'
    };
  }
};

/**
 * Obtener reporte de producción
 * @param {Object} filters - Filtros para el reporte
 */
export const getProductionReport = async (filters = {}) => {
  try {
    const {
      rancho_id = '',
      bovino_id = '',
      tipo_produccion_id = '',
      fecha_inicio,
      fecha_fin,
      agrupacion = 'mes', // dia, semana, mes, año
      incluir_comparaciones = true,
      incluir_tendencias = true,
      incluir_proyecciones = false,
      incluir_calidad = true,
      formato = 'json'
    } = filters;

    const response = await get('/reports/production', {
      rancho_id,
      bovino_id,
      tipo_produccion_id,
      fecha_inicio,
      fecha_fin,
      agrupacion,
      incluir_comparaciones,
      incluir_tendencias,
      incluir_proyecciones,
      incluir_calidad,
      formato
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener reporte de producción:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar reporte de producción'
    };
  }
};

/**
 * Obtener reporte de salud
 * @param {Object} filters - Filtros para el reporte
 */
export const getHealthReport = async (filters = {}) => {
  try {
    const {
      rancho_id = '',
      bovino_id = '',
      veterinario_id = '',
      tipo_consulta_id = '',
      fecha_inicio,
      fecha_fin,
      incluir_vacunaciones = true,
      incluir_tratamientos = true,
      incluir_estadisticas = true,
      incluir_alertas = true,
      agrupar_por = 'mes',
      formato = 'json'
    } = filters;

    const response = await get('/reports/health', {
      rancho_id,
      bovino_id,
      veterinario_id,
      tipo_consulta_id,
      fecha_inicio,
      fecha_fin,
      incluir_vacunaciones,
      incluir_tratamientos,
      incluir_estadisticas,
      incluir_alertas,
      agrupar_por,
      formato
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener reporte de salud:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar reporte de salud'
    };
  }
};

/**
 * Obtener reporte financiero
 * @param {Object} filters - Filtros para el reporte
 */
export const getFinancialReport = async (filters = {}) => {
  try {
    const {
      rancho_id = '',
      fecha_inicio,
      fecha_fin,
      tipo = '', // ingresos, gastos, ambos
      categoria_id = '',
      incluir_flujo_caja = true,
      incluir_rentabilidad = true,
      incluir_presupuesto = false,
      incluir_proyecciones = false,
      agrupacion = 'mes',
      formato = 'json'
    } = filters;

    const response = await get('/reports/financial', {
      rancho_id,
      fecha_inicio,
      fecha_fin,
      tipo,
      categoria_id,
      incluir_flujo_caja,
      incluir_rentabilidad,
      incluir_presupuesto,
      incluir_proyecciones,
      agrupacion,
      formato
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener reporte financiero:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar reporte financiero'
    };
  }
};

/**
 * Obtener reporte de inventario
 * @param {Object} filters - Filtros para el reporte
 */
export const getInventoryReport = async (filters = {}) => {
  try {
    const {
      rancho_id = '',
      categoria_id = '',
      tipo_producto = '',
      estado_stock = '',
      incluir_movimientos = true,
      incluir_valuacion = true,
      incluir_alertas = true,
      incluir_vencimientos = true,
      fecha_corte = new Date().toISOString().split('T')[0],
      formato = 'json'
    } = filters;

    const response = await get('/reports/inventory', {
      rancho_id,
      categoria_id,
      tipo_producto,
      estado_stock,
      incluir_movimientos,
      incluir_valuacion,
      incluir_alertas,
      incluir_vencimientos,
      fecha_corte,
      formato
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener reporte de inventario:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar reporte de inventario'
    };
  }
};

/**
 * Obtener reporte de eventos
 * @param {Object} filters - Filtros para el reporte
 */
export const getEventsReport = async (filters = {}) => {
  try {
    const {
      rancho_id = '',
      tipo_evento_id = '',
      responsable_id = '',
      fecha_inicio,
      fecha_fin,
      estado = '',
      incluir_ubicaciones = true,
      incluir_costos = true,
      incluir_participantes = false,
      agrupar_por = 'tipo',
      formato = 'json'
    } = filters;

    const response = await get('/reports/events', {
      rancho_id,
      tipo_evento_id,
      responsable_id,
      fecha_inicio,
      fecha_fin,
      estado,
      incluir_ubicaciones,
      incluir_costos,
      incluir_participantes,
      agrupar_por,
      formato
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener reporte de eventos:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar reporte de eventos'
    };
  }
};

/**
 * Crear reporte personalizado
 * @param {Object} reportData - Datos del reporte personalizado
 */
export const createCustomReport = async (reportData) => {
  try {
    const {
      nombre,
      descripcion,
      categoria,
      configuracion = {},
      filtros_predeterminados = {},
      columnas = [],
      graficos = [],
      parametros = [],
      plantilla_id = null,
      acceso_publico = false,
      programacion = null, // Para reportes automáticos
      destinatarios_email = [],
      activo = true
    } = reportData;

    const response = await post('/reports/custom', {
      nombre,
      descripcion,
      categoria,
      configuracion,
      filtros_predeterminados,
      columnas,
      graficos,
      parametros,
      plantilla_id,
      acceso_publico,
      programacion,
      destinatarios_email,
      activo
    });
    
    return {
      success: response.success,
      data: response.data?.report || null,
      message: response.success 
        ? 'Reporte personalizado creado correctamente'
        : response.message || 'Error al crear reporte personalizado'
    };
  } catch (error) {
    console.error('Error al crear reporte personalizado:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear reporte personalizado'
    };
  }
};

/**
 * Actualizar reporte personalizado
 * @param {string} reportId - ID del reporte
 * @param {Object} reportData - Datos actualizados
 */
export const updateCustomReport = async (reportId, reportData) => {
  try {
    const response = await put(`/reports/custom/${reportId}`, reportData);
    
    return {
      success: response.success,
      data: response.data?.report || null,
      message: response.success 
        ? 'Reporte actualizado correctamente'
        : response.message || 'Error al actualizar reporte'
    };
  } catch (error) {
    console.error('Error al actualizar reporte:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar reporte'
    };
  }
};

/**
 * Eliminar reporte personalizado
 * @param {string} reportId - ID del reporte
 */
export const deleteCustomReport = async (reportId) => {
  try {
    const response = await del(`/reports/custom/${reportId}`);
    
    return {
      success: response.success,
      message: response.success 
        ? 'Reporte eliminado correctamente'
        : response.message || 'Error al eliminar reporte'
    };
  } catch (error) {
    console.error('Error al eliminar reporte:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al eliminar reporte'
    };
  }
};

/**
 * Obtener historial de reportes generados
 * @param {Object} params - Parámetros de filtrado
 */
export const getReportHistory = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      usuario_id = '',
      reporte_id = '',
      categoria = '',
      fecha_inicio = '',
      fecha_fin = '',
      estado = '', // completado, error, procesando
      formato = '',
      sortBy = 'fecha_generacion',
      sortOrder = 'desc'
    } = params;

    const response = await get('/reports/history', {
      page,
      limit,
      usuario_id,
      reporte_id,
      categoria,
      fecha_inicio,
      fecha_fin,
      estado,
      formato,
      sortBy,
      sortOrder
    });
    
    return {
      success: response.success,
      data: response.data?.reports || [],
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      totalPages: response.data?.totalPages || 1,
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: 'Error al cargar historial de reportes'
    };
  }
};

/**
 * Descargar reporte generado
 * @param {string} reportHistoryId - ID del reporte en el historial
 */
export const downloadReport = async (reportHistoryId) => {
  try {
    const response = await get(`/reports/download/${reportHistoryId}`, {}, {
      responseType: 'blob'
    });
    
    return {
      success: response.success,
      data: response.data,
      message: 'Descarga iniciada'
    };
  } catch (error) {
    console.error('Error al descargar reporte:', error);
    return {
      success: false,
      message: 'Error al descargar reporte'
    };
  }
};

/**
 * Programar reporte automático
 * @param {Object} scheduleData - Datos de programación
 */
export const scheduleReport = async (scheduleData) => {
  try {
    const {
      reporte_id,
      nombre_programacion,
      frecuencia, // diario, semanal, mensual, trimestral, anual
      configuracion_frecuencia = {},
      parametros_reporte = {},
      formato = 'pdf',
      destinatarios_email = [],
      hora_envio = '08:00',
      activo = true,
      fecha_inicio = new Date().toISOString().split('T')[0],
      fecha_fin = null
    } = scheduleData;

    const response = await post('/reports/schedule', {
      reporte_id,
      nombre_programacion,
      frecuencia,
      configuracion_frecuencia,
      parametros_reporte,
      formato,
      destinatarios_email,
      hora_envio,
      activo,
      fecha_inicio,
      fecha_fin
    });
    
    return {
      success: response.success,
      data: response.data?.schedule || null,
      message: response.success 
        ? 'Reporte programado correctamente'
        : response.message || 'Error al programar reporte'
    };
  } catch (error) {
    console.error('Error al programar reporte:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al programar reporte'
    };
  }
};

/**
 * Obtener reportes programados
 * @param {Object} filters - Filtros para reportes programados
 */
export const getScheduledReports = async (filters = {}) => {
  try {
    const {
      activo = null,
      frecuencia = '',
      reporte_id = '',
      usuario_id = ''
    } = filters;

    const response = await get('/reports/scheduled', {
      activo,
      frecuencia,
      reporte_id,
      usuario_id
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener reportes programados:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar reportes programados'
    };
  }
};

/**
 * Actualizar programación de reporte
 * @param {string} scheduleId - ID de la programación
 * @param {Object} scheduleData - Datos actualizados
 */
export const updateReportSchedule = async (scheduleId, scheduleData) => {
  try {
    const response = await put(`/reports/schedule/${scheduleId}`, scheduleData);
    
    return {
      success: response.success,
      data: response.data?.schedule || null,
      message: response.success 
        ? 'Programación actualizada correctamente'
        : response.message || 'Error al actualizar programación'
    };
  } catch (error) {
    console.error('Error al actualizar programación:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar programación'
    };
  }
};

/**
 * Cancelar programación de reporte
 * @param {string} scheduleId - ID de la programación
 */
export const cancelReportSchedule = async (scheduleId) => {
  try {
    const response = await del(`/reports/schedule/${scheduleId}`);
    
    return {
      success: response.success,
      message: response.success 
        ? 'Programación cancelada correctamente'
        : response.message || 'Error al cancelar programación'
    };
  } catch (error) {
    console.error('Error al cancelar programación:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al cancelar programación'
    };
  }
};

/**
 * Obtener plantillas de reportes
 */
export const getReportTemplates = async () => {
  try {
    const response = await get('/reports/templates');
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener plantillas:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar plantillas de reportes'
    };
  }
};

/**
 * Obtener dashboard de reportes
 * @param {Object} filters - Filtros para el dashboard
 */
export const getReportsDashboard = async (filters = {}) => {
  try {
    const {
      rancho_id = '',
      periodo = 'mes' // semana, mes, trimestre, año
    } = filters;

    const response = await get('/reports/dashboard', {
      rancho_id,
      periodo
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener dashboard:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar dashboard de reportes'
    };
  }
};

/**
 * Validar datos para reporte
 * @param {string} reportType - Tipo de reporte
 * @param {Object} parameters - Parámetros del reporte
 */
export const validateReportData = async (reportType, parameters) => {
  try {
    const response = await post('/reports/validate', {
      report_type: reportType,
      parameters
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al validar datos:', error);
    return {
      success: false,
      data: {},
      message: 'Error al validar datos del reporte'
    };
  }
};

/**
 * Obtener estadísticas de uso de reportes
 * @param {Object} filters - Filtros para estadísticas
 */
export const getReportUsageStats = async (filters = {}) => {
  try {
    const {
      fecha_inicio = '',
      fecha_fin = '',
      usuario_id = '',
      reporte_id = ''
    } = filters;

    const response = await get('/reports/usage-stats', {
      fecha_inicio,
      fecha_fin,
      usuario_id,
      reporte_id
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
      message: 'Error al cargar estadísticas de reportes'
    };
  }
};

/**
 * Compartir reporte
 * @param {string} reportHistoryId - ID del reporte en el historial
 * @param {Object} shareData - Datos para compartir
 */
export const shareReport = async (reportHistoryId, shareData) => {
  try {
    const {
      destinatarios_email = [],
      mensaje = '',
      fecha_expiracion = null,
      requiere_password = false,
      password = ''
    } = shareData;

    const response = await post(`/reports/share/${reportHistoryId}`, {
      destinatarios_email,
      mensaje,
      fecha_expiracion,
      requiere_password,
      password
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.success 
        ? 'Reporte compartido correctamente'
        : response.message || 'Error al compartir reporte'
    };
  } catch (error) {
    console.error('Error al compartir reporte:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al compartir reporte'
    };
  }
};

// Constantes útiles para tipos de reportes
export const REPORT_CATEGORIES = {
  BOVINOS: 'bovinos',
  PRODUCCION: 'produccion',
  SALUD: 'salud',
  FINANZAS: 'finanzas',
  INVENTARIO: 'inventario',
  EVENTOS: 'eventos',
  GENERAL: 'general'
};

export const REPORT_FORMATS = {
  HTML: 'html',
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
  JSON: 'json',
  XML: 'xml'
};

export const REPORT_FREQUENCIES = {
  DIARIO: 'diario',
  SEMANAL: 'semanal',
  MENSUAL: 'mensual',
  TRIMESTRAL: 'trimestral',
  ANUAL: 'anual'
};

export const REPORT_TYPES = {
  PREDEFINIDO: 'predefinido',
  PERSONALIZADO: 'personalizado',
  AUTOMATICO: 'automatico'
};

// Exportaciones por defecto
export default {
  getAvailableReports,
  generateReport,
  getBovineReport,
  getProductionReport,
  getHealthReport,
  getFinancialReport,
  getInventoryReport,
  getEventsReport,
  createCustomReport,
  updateCustomReport,
  deleteCustomReport,
  getReportHistory,
  downloadReport,
  scheduleReport,
  getScheduledReports,
  updateReportSchedule,
  cancelReportSchedule,
  getReportTemplates,
  getReportsDashboard,
  validateReportData,
  getReportUsageStats,
  shareReport,
  REPORT_CATEGORIES,
  REPORT_FORMATS,
  REPORT_FREQUENCIES,
  REPORT_TYPES
};