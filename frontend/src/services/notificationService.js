import { get, post, put, patch, del } from './api';

/**
 * Servicio para gestión de notificaciones en el sistema de gestión de bovinos
 * Incluye notificaciones push, email, SMS, alertas automáticas y configuración de preferencias
 */

/**
 * Obtener lista de notificaciones del usuario
 * @param {Object} params - Parámetros de búsqueda y filtros
 */
export const getNotifications = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      tipo = '', // alerta, recordatorio, informacion, emergencia
      categoria = '', // salud, evento, inventario, finanzas, sistema
      estado = '', // no_leida, leida, archivada
      prioridad = '', // baja, media, alta, urgente
      fecha_inicio = '',
      fecha_fin = '',
      rancho_id = '',
      solo_no_leidas = false,
      incluir_archivadas = false,
      sortBy = 'fecha_creacion',
      sortOrder = 'desc'
    } = params;

    const queryParams = {
      page,
      limit,
      tipo,
      categoria,
      estado,
      prioridad,
      fecha_inicio,
      fecha_fin,
      rancho_id,
      solo_no_leidas,
      incluir_archivadas,
      sortBy,
      sortOrder
    };

    // Remover parámetros vacíos
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    const response = await get('/notifications', queryParams);
    
    return {
      success: response.success,
      data: response.data?.notifications || [],
      total: response.data?.total || 0,
      unread_count: response.data?.unread_count || 0,
      page: response.data?.page || 1,
      totalPages: response.data?.totalPages || 1,
      summary: response.data?.summary || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    return {
      success: false,
      data: [],
      total: 0,
      unread_count: 0,
      message: 'Error al cargar notificaciones'
    };
  }
};

/**
 * Obtener detalles de una notificación específica
 * @param {string} notificationId - ID de la notificación
 */
export const getNotificationById = async (notificationId) => {
  try {
    const response = await get(`/notifications/${notificationId}`);
    
    return {
      success: response.success,
      data: response.data || null,
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener notificación:', error);
    return {
      success: false,
      data: null,
      message: 'Error al cargar datos de la notificación'
    };
  }
};

/**
 * Crear nueva notificación
 * @param {Object} notificationData - Datos de la notificación
 */
export const createNotification = async (notificationData) => {
  try {
    const {
      titulo,
      mensaje,
      tipo, // alerta, recordatorio, informacion, emergencia
      categoria, // salud, evento, inventario, finanzas, sistema
      prioridad = 'media', // baja, media, alta, urgente
      destinatarios = [], // array de user_ids
      destinatarios_roles = [], // array de rol_ids
      rancho_id = null,
      bovino_id = null,
      evento_id = null,
      programada_para = null, // fecha y hora de envío programado
      expira_en = null, // fecha de expiración
      acciones = [], // array de acciones disponibles
      metadatos = {},
      canales = ['web'], // web, email, sms, push
      es_persistente = true,
      requiere_confirmacion = false,
      plantilla_id = null
    } = notificationData;

    const response = await post('/notifications', {
      titulo,
      mensaje,
      tipo,
      categoria,
      prioridad,
      destinatarios,
      destinatarios_roles,
      rancho_id,
      bovino_id,
      evento_id,
      programada_para,
      expira_en,
      acciones,
      metadatos,
      canales,
      es_persistente,
      requiere_confirmacion,
      plantilla_id
    });
    
    return {
      success: response.success,
      data: response.data?.notification || null,
      message: response.success 
        ? 'Notificación creada correctamente'
        : response.message || 'Error al crear notificación'
    };
  } catch (error) {
    console.error('Error al crear notificación:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear notificación'
    };
  }
};

/**
 * Marcar notificación como leída
 * @param {string} notificationId - ID de la notificación
 */
export const markAsRead = async (notificationId) => {
  try {
    const response = await patch(`/notifications/${notificationId}/read`);
    
    return {
      success: response.success,
      data: response.data?.notification || null,
      message: response.success 
        ? 'Notificación marcada como leída'
        : response.message || 'Error al marcar como leída'
    };
  } catch (error) {
    console.error('Error al marcar como leída:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al marcar como leída'
    };
  }
};

/**
 * Marcar múltiples notificaciones como leídas
 * @param {Array} notificationIds - Array de IDs de notificaciones
 */
export const markMultipleAsRead = async (notificationIds) => {
  try {
    const response = await patch('/notifications/mark-read-multiple', {
      notification_ids: notificationIds
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.success 
        ? 'Notificaciones marcadas como leídas'
        : response.message || 'Error al marcar notificaciones'
    };
  } catch (error) {
    console.error('Error al marcar múltiples como leídas:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al marcar notificaciones'
    };
  }
};

/**
 * Marcar todas las notificaciones como leídas
 * @param {Object} filters - Filtros para aplicar el marcado
 */
export const markAllAsRead = async (filters = {}) => {
  try {
    const response = await patch('/notifications/mark-all-read', filters);
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.success 
        ? 'Todas las notificaciones marcadas como leídas'
        : response.message || 'Error al marcar todas como leídas'
    };
  } catch (error) {
    console.error('Error al marcar todas como leídas:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al marcar todas como leídas'
    };
  }
};

/**
 * Archivar notificación
 * @param {string} notificationId - ID de la notificación
 */
export const archiveNotification = async (notificationId) => {
  try {
    const response = await patch(`/notifications/${notificationId}/archive`);
    
    return {
      success: response.success,
      data: response.data?.notification || null,
      message: response.success 
        ? 'Notificación archivada correctamente'
        : response.message || 'Error al archivar notificación'
    };
  } catch (error) {
    console.error('Error al archivar notificación:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al archivar notificación'
    };
  }
};

/**
 * Eliminar notificación
 * @param {string} notificationId - ID de la notificación
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await del(`/notifications/${notificationId}`);
    
    return {
      success: response.success,
      message: response.success 
        ? 'Notificación eliminada correctamente'
        : response.message || 'Error al eliminar notificación'
    };
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al eliminar notificación'
    };
  }
};

/**
 * Obtener configuración de notificaciones del usuario
 */
export const getNotificationSettings = async () => {
  try {
    const response = await get('/notifications/settings');
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener configuración de notificaciones:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar configuración de notificaciones'
    };
  }
};

/**
 * Actualizar configuración de notificaciones del usuario
 * @param {Object} settings - Nueva configuración
 */
export const updateNotificationSettings = async (settings) => {
  try {
    const {
      notificaciones_web = true,
      notificaciones_email = true,
      notificaciones_sms = false,
      notificaciones_push = true,
      frecuencia_resumen = 'diario', // tiempo_real, diario, semanal
      horario_no_molestar = {
        activo: false,
        hora_inicio: '22:00',
        hora_fin: '07:00'
      },
      categorias = {
        salud: { web: true, email: true, sms: false, push: true },
        eventos: { web: true, email: false, sms: false, push: true },
        inventario: { web: true, email: false, sms: false, push: false },
        finanzas: { web: true, email: true, sms: false, push: false },
        sistema: { web: true, email: false, sms: false, push: false }
      },
      prioridades = {
        urgente: { web: true, email: true, sms: true, push: true },
        alta: { web: true, email: true, sms: false, push: true },
        media: { web: true, email: false, sms: false, push: true },
        baja: { web: true, email: false, sms: false, push: false }
      },
      idioma_notificaciones = 'es',
      zona_horaria = 'America/Mexico_City'
    } = settings;

    const response = await put('/notifications/settings', {
      notificaciones_web,
      notificaciones_email,
      notificaciones_sms,
      notificaciones_push,
      frecuencia_resumen,
      horario_no_molestar,
      categorias,
      prioridades,
      idioma_notificaciones,
      zona_horaria
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.success 
        ? 'Configuración actualizada correctamente'
        : response.message || 'Error al actualizar configuración'
    };
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar configuración'
    };
  }
};

/**
 * Suscribirse a notificaciones push
 * @param {Object} subscription - Datos de suscripción push
 */
export const subscribeToPushNotifications = async (subscription) => {
  try {
    const response = await post('/notifications/push/subscribe', {
      subscription,
      device_info: {
        user_agent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      }
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.success 
        ? 'Suscripción a notificaciones push activada'
        : response.message || 'Error al activar notificaciones push'
    };
  } catch (error) {
    console.error('Error al suscribirse a push:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al activar notificaciones push'
    };
  }
};

/**
 * Desuscribirse de notificaciones push
 */
export const unsubscribeFromPushNotifications = async () => {
  try {
    const response = await del('/notifications/push/unsubscribe');
    
    return {
      success: response.success,
      message: response.success 
        ? 'Notificaciones push desactivadas'
        : response.message || 'Error al desactivar notificaciones push'
    };
  } catch (error) {
    console.error('Error al desuscribirse de push:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al desactivar notificaciones push'
    };
  }
};

/**
 * Obtener plantillas de notificaciones
 * @param {Object} filters - Filtros para plantillas
 */
export const getNotificationTemplates = async (filters = {}) => {
  try {
    const {
      categoria = '',
      tipo = '',
      activa = null,
      idioma = 'es'
    } = filters;

    const response = await get('/notifications/templates', {
      categoria,
      tipo,
      activa,
      idioma
    });
    
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
      message: 'Error al cargar plantillas de notificaciones'
    };
  }
};

/**
 * Crear plantilla de notificación
 * @param {Object} templateData - Datos de la plantilla
 */
export const createNotificationTemplate = async (templateData) => {
  try {
    const {
      nombre,
      descripcion,
      categoria,
      tipo,
      plantilla_titulo,
      plantilla_mensaje,
      variables_disponibles = [],
      canales_soportados = ['web', 'email'],
      idioma = 'es',
      activa = true
    } = templateData;

    const response = await post('/notifications/templates', {
      nombre,
      descripcion,
      categoria,
      tipo,
      plantilla_titulo,
      plantilla_mensaje,
      variables_disponibles,
      canales_soportados,
      idioma,
      activa
    });
    
    return {
      success: response.success,
      data: response.data?.template || null,
      message: response.success 
        ? 'Plantilla creada correctamente'
        : response.message || 'Error al crear plantilla'
    };
  } catch (error) {
    console.error('Error al crear plantilla:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear plantilla'
    };
  }
};

/**
 * Obtener estadísticas de notificaciones
 * @param {Object} filters - Filtros para estadísticas
 */
export const getNotificationStats = async (filters = {}) => {
  try {
    const {
      fecha_inicio = '',
      fecha_fin = '',
      rancho_id = '',
      agrupacion = 'dia' // dia, semana, mes
    } = filters;

    const response = await get('/notifications/stats', {
      fecha_inicio,
      fecha_fin,
      rancho_id,
      agrupacion
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
      message: 'Error al cargar estadísticas de notificaciones'
    };
  }
};

/**
 * Enviar notificación de prueba
 * @param {Object} testData - Datos para la notificación de prueba
 */
export const sendTestNotification = async (testData) => {
  try {
    const {
      canal = 'web', // web, email, sms, push
      destinatario,
      plantilla_id = null,
      mensaje_personalizado = null
    } = testData;

    const response = await post('/notifications/test', {
      canal,
      destinatario,
      plantilla_id,
      mensaje_personalizado
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.success 
        ? 'Notificación de prueba enviada correctamente'
        : response.message || 'Error al enviar notificación de prueba'
    };
  } catch (error) {
    console.error('Error al enviar notificación de prueba:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al enviar notificación de prueba'
    };
  }
};

/**
 * Obtener historial de entregas de notificaciones
 * @param {Object} params - Parámetros de filtrado
 */
export const getDeliveryHistory = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      notification_id = '',
      canal = '',
      estado_entrega = '', // enviada, entregada, fallida, leida
      fecha_inicio = '',
      fecha_fin = '',
      sortBy = 'fecha_envio',
      sortOrder = 'desc'
    } = params;

    const response = await get('/notifications/delivery-history', {
      page,
      limit,
      notification_id,
      canal,
      estado_entrega,
      fecha_inicio,
      fecha_fin,
      sortBy,
      sortOrder
    });
    
    return {
      success: response.success,
      data: response.data?.deliveries || [],
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      totalPages: response.data?.totalPages || 1,
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener historial de entregas:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: 'Error al cargar historial de entregas'
    };
  }
};

/**
 * Crear regla de notificación automática
 * @param {Object} ruleData - Datos de la regla
 */
export const createNotificationRule = async (ruleData) => {
  try {
    const {
      nombre,
      descripcion,
      activa = true,
      condiciones = {},
      acciones = {},
      frecuencia_evaluacion = 'tiempo_real', // tiempo_real, cada_hora, diario
      plantilla_id = null,
      destinatarios_automaticos = [],
      prioridad = 'media'
    } = ruleData;

    const response = await post('/notifications/rules', {
      nombre,
      descripcion,
      activa,
      condiciones,
      acciones,
      frecuencia_evaluacion,
      plantilla_id,
      destinatarios_automaticos,
      prioridad
    });
    
    return {
      success: response.success,
      data: response.data?.rule || null,
      message: response.success 
        ? 'Regla de notificación creada correctamente'
        : response.message || 'Error al crear regla'
    };
  } catch (error) {
    console.error('Error al crear regla:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear regla'
    };
  }
};

/**
 * Obtener reglas de notificación
 * @param {Object} filters - Filtros para reglas
 */
export const getNotificationRules = async (filters = {}) => {
  try {
    const {
      activa = null,
      categoria = '',
      rancho_id = ''
    } = filters;

    const response = await get('/notifications/rules', {
      activa,
      categoria,
      rancho_id
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener reglas:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar reglas de notificación'
    };
  }
};

/**
 * Ejecutar acción de notificación
 * @param {string} notificationId - ID de la notificación
 * @param {string} action - Acción a ejecutar
 * @param {Object} params - Parámetros adicionales
 */
export const executeNotificationAction = async (notificationId, action, params = {}) => {
  try {
    const response = await post(`/notifications/${notificationId}/action`, {
      action,
      params
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.success 
        ? 'Acción ejecutada correctamente'
        : response.message || 'Error al ejecutar acción'
    };
  } catch (error) {
    console.error('Error al ejecutar acción:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al ejecutar acción'
    };
  }
};

// Constantes útiles para tipos de notificaciones
export const NOTIFICATION_TYPES = {
  ALERTA: 'alerta',
  RECORDATORIO: 'recordatorio',
  INFORMACION: 'informacion',
  EMERGENCIA: 'emergencia'
};

export const NOTIFICATION_CATEGORIES = {
  SALUD: 'salud',
  EVENTO: 'evento',
  INVENTARIO: 'inventario',
  FINANZAS: 'finanzas',
  SISTEMA: 'sistema'
};

export const NOTIFICATION_PRIORITIES = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta',
  URGENTE: 'urgente'
};

export const NOTIFICATION_CHANNELS = {
  WEB: 'web',
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push'
};

// Exportaciones por defecto
export default {
  getNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  markMultipleAsRead,
  markAllAsRead,
  archiveNotification,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  getNotificationTemplates,
  createNotificationTemplate,
  getNotificationStats,
  sendTestNotification,
  getDeliveryHistory,
  createNotificationRule,
  getNotificationRules,
  executeNotificationAction,
  NOTIFICATION_TYPES,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_CHANNELS
};