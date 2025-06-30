import { get, post, put, patch, del, upload } from './api';

/**
 * Servicio para gestión de eventos y actividades en el sistema de bovinos
 * Incluye calendario, programación, recordatorios y geolocalización de eventos
 */

/**
 * Obtener lista de eventos con filtros y paginación
 * @param {Object} params - Parámetros de búsqueda y filtros
 */
export const getEvents = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      tipo_evento_id = '',
      bovino_id = '',
      rancho_id = '',
      fecha_inicio = '',
      fecha_fin = '',
      estado = '', // pendiente, completado, cancelado
      prioridad = '', // baja, media, alta, urgente
      responsable_id = '',
      sortBy = 'fecha_programada',
      sortOrder = 'asc',
      include_location = false,
      include_bovine = false,
      include_participants = false,
      view = 'list' // list, calendar, map
    } = params;

    const queryParams = {
      page,
      limit,
      search,
      tipo_evento_id,
      bovino_id,
      rancho_id,
      fecha_inicio,
      fecha_fin,
      estado,
      prioridad,
      responsable_id,
      sortBy,
      sortOrder,
      include_location,
      include_bovine,
      include_participants,
      view
    };

    // Remover parámetros vacíos
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    const response = await get('/events', queryParams);
    
    return {
      success: response.success,
      data: response.data?.events || [],
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      totalPages: response.data?.totalPages || 1,
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: 'Error al cargar lista de eventos'
    };
  }
};

/**
 * Obtener eventos para vista de calendario
 * @param {Object} params - Parámetros de calendario
 */
export const getCalendarEvents = async (params = {}) => {
  try {
    const {
      start_date,
      end_date,
      rancho_id = '',
      tipo_evento_id = '',
      view_type = 'month' // month, week, day
    } = params;

    const response = await get('/events/calendar', {
      start_date,
      end_date,
      rancho_id,
      tipo_evento_id,
      view_type
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener eventos de calendario:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar calendario de eventos'
    };
  }
};

/**
 * Obtener detalles de un evento específico
 * @param {string} eventId - ID del evento
 * @param {Object} options - Opciones adicionales
 */
export const getEventById = async (eventId, options = {}) => {
  try {
    const {
      include_bovine = true,
      include_location = true,
      include_participants = true,
      include_history = true,
      include_documents = true
    } = options;

    const response = await get(`/events/${eventId}`, {
      include_bovine,
      include_location,
      include_participants,
      include_history,
      include_documents
    });
    
    return {
      success: response.success,
      data: response.data || null,
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener evento:', error);
    return {
      success: false,
      data: null,
      message: 'Error al cargar datos del evento'
    };
  }
};

/**
 * Crear nuevo evento
 * @param {Object} eventData - Datos del evento
 */
export const createEvent = async (eventData) => {
  try {
    const {
      titulo,
      descripcion,
      tipo_evento_id,
      fecha_programada,
      hora_programada,
      duracion_estimada,
      bovino_id,
      bovinos_ids = [],
      rancho_id,
      responsable_id,
      participantes_ids = [],
      prioridad = 'media',
      ubicacion_latitud,
      ubicacion_longitud,
      ubicacion_descripcion,
      recordatorio_minutos = 60,
      es_recurrente = false,
      patron_recurrencia = null,
      fecha_fin_recurrencia = null,
      observaciones = '',
      documentos = [],
      medicamentos_requeridos = [],
      equipos_requeridos = []
    } = eventData;

    // Preparar datos para envío
    const formData = new FormData();
    
    // Agregar datos básicos
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion || '');
    formData.append('tipo_evento_id', tipo_evento_id);
    formData.append('fecha_programada', fecha_programada);
    formData.append('hora_programada', hora_programada);
    formData.append('rancho_id', rancho_id);
    formData.append('responsable_id', responsable_id);
    formData.append('prioridad', prioridad);
    
    // Agregar datos opcionales
    if (duracion_estimada) formData.append('duracion_estimada', duracion_estimada);
    if (bovino_id) formData.append('bovino_id', bovino_id);
    if (ubicacion_latitud) formData.append('ubicacion_latitud', ubicacion_latitud);
    if (ubicacion_longitud) formData.append('ubicacion_longitud', ubicacion_longitud);
    if (ubicacion_descripcion) formData.append('ubicacion_descripcion', ubicacion_descripcion);
    if (recordatorio_minutos) formData.append('recordatorio_minutos', recordatorio_minutos);
    if (observaciones) formData.append('observaciones', observaciones);
    
    // Agregar arrays como JSON
    if (bovinos_ids.length > 0) formData.append('bovinos_ids', JSON.stringify(bovinos_ids));
    if (participantes_ids.length > 0) formData.append('participantes_ids', JSON.stringify(participantes_ids));
    if (medicamentos_requeridos.length > 0) formData.append('medicamentos_requeridos', JSON.stringify(medicamentos_requeridos));
    if (equipos_requeridos.length > 0) formData.append('equipos_requeridos', JSON.stringify(equipos_requeridos));
    
    // Datos de recurrencia
    if (es_recurrente) {
      formData.append('es_recurrente', es_recurrente);
      if (patron_recurrencia) formData.append('patron_recurrencia', JSON.stringify(patron_recurrencia));
      if (fecha_fin_recurrencia) formData.append('fecha_fin_recurrencia', fecha_fin_recurrencia);
    }
    
    // Agregar documentos
    documentos.forEach((documento) => {
      if (documento instanceof File) {
        formData.append('documentos', documento);
      }
    });

    const response = await upload('/events', formData);
    
    return {
      success: response.success,
      data: response.data?.event || null,
      message: response.success 
        ? 'Evento creado correctamente'
        : response.message || 'Error al crear evento'
    };
  } catch (error) {
    console.error('Error al crear evento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear evento'
    };
  }
};

/**
 * Actualizar evento existente
 * @param {string} eventId - ID del evento
 * @param {Object} eventData - Datos actualizados
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    const {
      documentos_nuevos = [],
      documentos_eliminar = [],
      ...updateData
    } = eventData;

    // Si hay documentos nuevos o a eliminar, usar FormData
    if (documentos_nuevos.length > 0 || documentos_eliminar.length > 0) {
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
      
      // Agregar documentos nuevos
      documentos_nuevos.forEach((documento) => {
        if (documento instanceof File) {
          formData.append('documentos_nuevos', documento);
        }
      });
      
      // Agregar IDs de documentos a eliminar
      if (documentos_eliminar.length > 0) {
        formData.append('documentos_eliminar', JSON.stringify(documentos_eliminar));
      }

      const response = await upload(`/events/${eventId}`, formData, {
        method: 'PUT'
      });
      
      return {
        success: response.success,
        data: response.data?.event || null,
        message: response.success 
          ? 'Evento actualizado correctamente'
          : response.message || 'Error al actualizar evento'
      };
    } else {
      // Actualización simple sin documentos
      const response = await put(`/events/${eventId}`, updateData);
      
      return {
        success: response.success,
        data: response.data?.event || null,
        message: response.success 
          ? 'Evento actualizado correctamente'
          : response.message || 'Error al actualizar evento'
      };
    }
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar evento'
    };
  }
};

/**
 * Eliminar evento
 * @param {string} eventId - ID del evento
 * @param {string} motivo - Motivo de eliminación
 */
export const deleteEvent = async (eventId, motivo = '') => {
  try {
    const response = await del(`/events/${eventId}`, {
      data: { motivo }
    });
    
    return {
      success: response.success,
      message: response.success 
        ? 'Evento eliminado correctamente'
        : response.message || 'Error al eliminar evento'
    };
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al eliminar evento'
    };
  }
};

/**
 * Cambiar estado de un evento
 * @param {string} eventId - ID del evento
 * @param {string} nuevoEstado - Nuevo estado (pendiente, en_progreso, completado, cancelado)
 * @param {Object} detalles - Detalles adicionales del cambio
 */
export const changeEventStatus = async (eventId, nuevoEstado, detalles = {}) => {
  try {
    const response = await patch(`/events/${eventId}/status`, {
      estado: nuevoEstado,
      ...detalles
    });
    
    return {
      success: response.success,
      data: response.data?.event || null,
      message: response.success 
        ? 'Estado del evento actualizado correctamente'
        : response.message || 'Error al cambiar estado'
    };
  } catch (error) {
    console.error('Error al cambiar estado del evento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al cambiar estado'
    };
  }
};

/**
 * Marcar evento como completado
 * @param {string} eventId - ID del evento
 * @param {Object} resultados - Resultados del evento
 */
export const completeEvent = async (eventId, resultados = {}) => {
  try {
    const {
      fecha_completado = new Date().toISOString(),
      duracion_real,
      observaciones_resultado = '',
      bovinos_atendidos = [],
      medicamentos_utilizados = [],
      equipos_utilizados = [],
      documentos_resultado = [],
      costo_real = null,
      calificacion = null
    } = resultados;

    const formData = new FormData();
    
    // Datos básicos
    formData.append('estado', 'completado');
    formData.append('fecha_completado', fecha_completado);
    formData.append('observaciones_resultado', observaciones_resultado);
    
    // Datos opcionales
    if (duracion_real) formData.append('duracion_real', duracion_real);
    if (costo_real) formData.append('costo_real', costo_real);
    if (calificacion) formData.append('calificacion', calificacion);
    
    // Arrays como JSON
    if (bovinos_atendidos.length > 0) formData.append('bovinos_atendidos', JSON.stringify(bovinos_atendidos));
    if (medicamentos_utilizados.length > 0) formData.append('medicamentos_utilizados', JSON.stringify(medicamentos_utilizados));
    if (equipos_utilizados.length > 0) formData.append('equipos_utilizados', JSON.stringify(equipos_utilizados));
    
    // Documentos de resultado
    documentos_resultado.forEach((documento) => {
      if (documento instanceof File) {
        formData.append('documentos_resultado', documento);
      }
    });

    const response = await upload(`/events/${eventId}/complete`, formData);
    
    return {
      success: response.success,
      data: response.data?.event || null,
      message: response.success 
        ? 'Evento completado correctamente'
        : response.message || 'Error al completar evento'
    };
  } catch (error) {
    console.error('Error al completar evento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al completar evento'
    };
  }
};

/**
 * Obtener tipos de eventos disponibles
 */
export const getEventTypes = async () => {
  try {
    const response = await get('/events/types');
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener tipos de eventos:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar tipos de eventos'
    };
  }
};

/**
 * Obtener eventos próximos (recordatorios)
 * @param {Object} params - Parámetros de filtrado
 */
export const getUpcomingEvents = async (params = {}) => {
  try {
    const {
      hours_ahead = 24,
      rancho_id = '',
      tipo_evento_id = '',
      responsable_id = ''
    } = params;

    const response = await get('/events/upcoming', {
      hours_ahead,
      rancho_id,
      tipo_evento_id,
      responsable_id
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener eventos próximos:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar eventos próximos'
    };
  }
};

/**
 * Obtener eventos vencidos
 * @param {Object} params - Parámetros de filtrado
 */
export const getOverdueEvents = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      tipo_evento_id = '',
      responsable_id = ''
    } = params;

    const response = await get('/events/overdue', {
      rancho_id,
      tipo_evento_id,
      responsable_id
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener eventos vencidos:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar eventos vencidos'
    };
  }
};

/**
 * Crear eventos recurrentes
 * @param {Object} eventTemplate - Plantilla del evento
 * @param {Object} recurrencePattern - Patrón de recurrencia
 */
export const createRecurringEvents = async (eventTemplate, recurrencePattern) => {
  try {
    const response = await post('/events/recurring', {
      eventTemplate,
      recurrencePattern
    });
    
    return {
      success: response.success,
      data: response.data?.events || [],
      message: response.success 
        ? 'Eventos recurrentes creados correctamente'
        : response.message || 'Error al crear eventos recurrentes'
    };
  } catch (error) {
    console.error('Error al crear eventos recurrentes:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear eventos recurrentes'
    };
  }
};

/**
 * Obtener estadísticas de eventos
 * @param {Object} filters - Filtros para estadísticas
 */
export const getEventStats = async (filters = {}) => {
  try {
    const response = await get('/events/stats', filters);
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener estadísticas de eventos:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar estadísticas'
    };
  }
};

/**
 * Buscar eventos
 * @param {string} query - Término de búsqueda
 * @param {Object} filters - Filtros adicionales
 */
export const searchEvents = async (query, filters = {}) => {
  try {
    const response = await get('/events/search', {
      q: query,
      ...filters
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error en búsqueda de eventos:', error);
    return {
      success: false,
      data: [],
      message: 'Error en la búsqueda'
    };
  }
};

/**
 * Duplicar evento
 * @param {string} eventId - ID del evento a duplicar
 * @param {Object} modifications - Modificaciones para el nuevo evento
 */
export const duplicateEvent = async (eventId, modifications = {}) => {
  try {
    const response = await post(`/events/${eventId}/duplicate`, modifications);
    
    return {
      success: response.success,
      data: response.data?.event || null,
      message: response.success 
        ? 'Evento duplicado correctamente'
        : response.message || 'Error al duplicar evento'
    };
  } catch (error) {
    console.error('Error al duplicar evento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al duplicar evento'
    };
  }
};

/**
 * Exportar eventos
 * @param {Object} filters - Filtros para exportación
 * @param {string} format - Formato de exportación (csv, excel, pdf, ical)
 */
export const exportEvents = async (filters = {}, format = 'csv') => {
  try {
    const response = await get('/events/export', {
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
    console.error('Error al exportar eventos:', error);
    return {
      success: false,
      message: 'Error al exportar datos'
    };
  }
};

// Exportaciones por defecto
export default {
  getEvents,
  getCalendarEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  changeEventStatus,
  completeEvent,
  getEventTypes,
  getUpcomingEvents,
  getOverdueEvents,
  createRecurringEvents,
  getEventStats,
  searchEvents,
  duplicateEvent,
  exportEvents
};