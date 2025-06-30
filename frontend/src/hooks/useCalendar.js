import { useState, useEffect, useCallback, useMemo } from 'react';
import { eventService } from '../services/eventService';
import { healthService } from '../services/healthService';
import { productionService } from '../services/productionService';
import { useNotifications } from './useNotifications';

/**
 * Hook personalizado para manejo de calendario de eventos
 * Maneja eventos veterinarios, producción, reproducción y programaciones
 */
const useCalendar = () => {
  // Estados principales
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados de vista del calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Estados de filtros
  const [filters, setFilters] = useState({
    eventTypes: ['vaccination', 'checkup', 'production', 'reproduction', 'medication'],
    ranchId: null,
    bovineId: null,
    veterinarianId: null,
    priority: 'all' // 'all', 'high', 'medium', 'low'
  });

  // Hook de notificaciones
  const { addNotification } = useNotifications();

  /**
   * Función para cargar eventos del calendario
   * @param {Date} startDate - Fecha de inicio del rango
   * @param {Date} endDate - Fecha de fin del rango
   */
  const loadEvents = useCallback(async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        ...filters
      };

      const response = await eventService.getEventsInRange(params);
      
      if (response.success) {
        // Transformar eventos a formato de calendario
        const transformedEvents = response.data.map(event => ({
          id: event.id,
          title: event.title || getEventTitle(event),
          start: new Date(event.fecha_evento || event.fecha_programada),
          end: event.fecha_fin ? new Date(event.fecha_fin) : new Date(event.fecha_evento || event.fecha_programada),
          type: event.tipo_evento || event.type,
          priority: event.prioridad || 'medium',
          status: event.estado || 'pending',
          bovineId: event.bovino_id,
          bovineName: event.bovino_nombre,
          location: event.ubicacion,
          description: event.descripcion || event.observaciones,
          createdBy: event.creado_por,
          veterinarian: event.veterinario,
          medication: event.medicamento,
          dose: event.dosis,
          color: getEventColor(event.tipo_evento || event.type, event.prioridad || 'medium'),
          allDay: event.todo_el_dia || false,
          recurring: event.recurrente || false,
          recurringPattern: event.patron_recurrencia,
          reminders: event.recordatorios || [],
          completedAt: event.fecha_completado,
          completedBy: event.completado_por
        }));

        setEvents(transformedEvents);
        return { success: true, events: transformedEvents };
      } else {
        setError(response.message || 'Error al cargar eventos');
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error('Error al cargar eventos:', err);
      const errorMessage = err.response?.data?.message || 'Error de conexión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Función para crear un nuevo evento
   * @param {Object} eventData - Datos del evento
   */
  const createEvent = useCallback(async (eventData) => {
    try {
      setError(null);

      const response = await eventService.createEvent(eventData);
      
      if (response.success) {
        const newEvent = {
          id: response.data.id,
          title: eventData.title || getEventTitle(eventData),
          start: new Date(eventData.fecha_evento),
          end: eventData.fecha_fin ? new Date(eventData.fecha_fin) : new Date(eventData.fecha_evento),
          type: eventData.tipo_evento,
          priority: eventData.prioridad || 'medium',
          status: 'pending',
          bovineId: eventData.bovino_id,
          bovineName: eventData.bovino_nombre,
          location: eventData.ubicacion,
          description: eventData.descripcion,
          color: getEventColor(eventData.tipo_evento, eventData.prioridad || 'medium'),
          allDay: eventData.todo_el_dia || false,
          recurring: eventData.recurrente || false,
          recurringPattern: eventData.patron_recurrencia,
          reminders: eventData.recordatorios || []
        };

        setEvents(prev => [...prev, newEvent]);
        
        addNotification({
          type: 'success',
          title: 'Evento creado',
          message: `Se ha programado: ${newEvent.title}`
        });

        return { success: true, event: newEvent };
      } else {
        setError(response.message || 'Error al crear evento');
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error('Error al crear evento:', err);
      const errorMessage = err.response?.data?.message || 'Error de conexión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [addNotification]);

  /**
   * Función para actualizar un evento existente
   * @param {string} eventId - ID del evento
   * @param {Object} updateData - Datos a actualizar
   */
  const updateEvent = useCallback(async (eventId, updateData) => {
    try {
      setError(null);

      const response = await eventService.updateEvent(eventId, updateData);
      
      if (response.success) {
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? {
                ...event,
                ...updateData,
                title: updateData.title || getEventTitle(updateData) || event.title,
                color: getEventColor(updateData.tipo_evento || event.type, updateData.prioridad || event.priority)
              }
            : event
        ));

        addNotification({
          type: 'success',
          title: 'Evento actualizado',
          message: 'El evento se ha actualizado correctamente'
        });

        return { success: true };
      } else {
        setError(response.message || 'Error al actualizar evento');
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error('Error al actualizar evento:', err);
      const errorMessage = err.response?.data?.message || 'Error de conexión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [addNotification]);

  /**
   * Función para eliminar un evento
   * @param {string} eventId - ID del evento
   */
  const deleteEvent = useCallback(async (eventId) => {
    try {
      setError(null);

      const response = await eventService.deleteEvent(eventId);
      
      if (response.success) {
        setEvents(prev => prev.filter(event => event.id !== eventId));
        
        addNotification({
          type: 'success',
          title: 'Evento eliminado',
          message: 'El evento se ha eliminado correctamente'
        });

        return { success: true };
      } else {
        setError(response.message || 'Error al eliminar evento');
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error('Error al eliminar evento:', err);
      const errorMessage = err.response?.data?.message || 'Error de conexión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [addNotification]);

  /**
   * Función para marcar un evento como completado
   * @param {string} eventId - ID del evento
   * @param {Object} completionData - Datos de completado (observaciones, resultados, etc.)
   */
  const completeEvent = useCallback(async (eventId, completionData = {}) => {
    try {
      setError(null);

      const response = await eventService.completeEvent(eventId, {
        ...completionData,
        fecha_completado: new Date().toISOString(),
        estado: 'completed'
      });
      
      if (response.success) {
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? {
                ...event,
                status: 'completed',
                completedAt: new Date(),
                completedBy: response.data.completado_por,
                color: getEventColor(event.type, event.priority, 'completed')
              }
            : event
        ));

        addNotification({
          type: 'success',
          title: 'Evento completado',
          message: 'El evento se ha marcado como completado'
        });

        return { success: true };
      } else {
        setError(response.message || 'Error al completar evento');
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error('Error al completar evento:', err);
      const errorMessage = err.response?.data?.message || 'Error de conexión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [addNotification]);

  /**
   * Función para programar eventos recurrentes (vacunas, chequeos, etc.)
   * @param {Object} baseEvent - Evento base
   * @param {Object} recurrencePattern - Patrón de recurrencia
   */
  const scheduleRecurringEvents = useCallback(async (baseEvent, recurrencePattern) => {
    try {
      setError(null);

      const response = await eventService.createRecurringEvents(baseEvent, recurrencePattern);
      
      if (response.success) {
        const newEvents = response.data.map(event => ({
          id: event.id,
          title: getEventTitle(event),
          start: new Date(event.fecha_evento),
          end: new Date(event.fecha_fin || event.fecha_evento),
          type: event.tipo_evento,
          priority: event.prioridad || 'medium',
          status: 'pending',
          bovineId: event.bovino_id,
          bovineName: event.bovino_nombre,
          location: event.ubicacion,
          description: event.descripcion,
          color: getEventColor(event.tipo_evento, event.prioridad || 'medium'),
          recurring: true,
          recurringPattern: recurrencePattern,
          reminders: event.recordatorios || []
        }));

        setEvents(prev => [...prev, ...newEvents]);

        addNotification({
          type: 'success',
          title: 'Eventos programados',
          message: `Se han programado ${newEvents.length} eventos recurrentes`
        });

        return { success: true, events: newEvents };
      } else {
        setError(response.message || 'Error al programar eventos recurrentes');
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error('Error al programar eventos recurrentes:', err);
      const errorMessage = err.response?.data?.message || 'Error de conexión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [addNotification]);

  /**
   * Función para obtener eventos de una fecha específica
   * @param {Date} date - Fecha a consultar
   */
  const getEventsForDate = useCallback((date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = event.start.toISOString().split('T')[0];
      return eventDate === dateString;
    });
  }, [events]);

  /**
   * Función para obtener eventos pendientes
   */
  const getPendingEvents = useCallback(() => {
    return events.filter(event => event.status === 'pending');
  }, [events]);

  /**
   * Función para obtener eventos vencidos
   */
  const getOverdueEvents = useCallback(() => {
    const now = new Date();
    return events.filter(event => 
      event.status === 'pending' && event.start < now
    );
  }, [events]);

  /**
   * Función para obtener próximos eventos (próximos 7 días)
   */
  const getUpcomingEvents = useCallback((days = 7) => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    return events.filter(event => 
      event.status === 'pending' && 
      event.start >= now && 
      event.start <= futureDate
    ).sort((a, b) => a.start - b.start);
  }, [events]);

  /**
   * Navegar a mes anterior
   */
  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  }, []);

  /**
   * Navegar a mes siguiente
   */
  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  }, []);

  /**
   * Ir a fecha actual
   */
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  /**
   * Cambiar modo de vista del calendario
   * @param {string} mode - Modo de vista ('month', 'week', 'day')
   */
  const changeViewMode = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  /**
   * Aplicar filtros al calendario
   * @param {Object} newFilters - Nuevos filtros
   */
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Función auxiliar para obtener el título del evento
  const getEventTitle = (event) => {
    const type = event.tipo_evento || event.type;
    const bovineName = event.bovino_nombre || `Bovino ${event.bovino_id}`;
    
    switch (type) {
      case 'vaccination':
        return `Vacunación - ${bovineName}`;
      case 'checkup':
        return `Chequeo - ${bovineName}`;
      case 'medication':
        return `Medicación - ${bovineName}`;
      case 'reproduction':
        return `Reproducción - ${bovineName}`;
      case 'production':
        return `Producción - ${bovineName}`;
      default:
        return event.title || `Evento - ${bovineName}`;
    }
  };

  // Función auxiliar para obtener el color del evento
  const getEventColor = (type, priority, status) => {
    if (status === 'completed') {
      return '#10b981'; // Verde para completados
    }
    
    const colors = {
      vaccination: {
        high: '#ef4444',    // Rojo
        medium: '#f97316',  // Naranja
        low: '#eab308'      // Amarillo
      },
      checkup: {
        high: '#3b82f6',    // Azul
        medium: '#6366f1',  // Índigo
        low: '#8b5cf6'      // Violeta
      },
      medication: {
        high: '#ec4899',    // Rosa
        medium: '#d946ef',  // Magenta
        low: '#a855f7'      // Púrpura
      },
      reproduction: {
        high: '#06b6d4',    // Cian
        medium: '#0891b2',  // Azul claro
        low: '#0284c7'      // Azul cielo
      },
      production: {
        high: '#65a30d',    // Verde lima
        medium: '#84cc16',  // Lima
        low: '#a3e635'      // Verde claro
      }
    };

    return colors[type]?.[priority] || '#6b7280'; // Gris por defecto
  };

  // Calcular rango de fechas para cargar eventos según el modo de vista
  const dateRange = useMemo(() => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    switch (viewMode) {
      case 'month':
        start.setDate(1);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        break;
      case 'week':
        const dayOfWeek = start.getDay();
        start.setDate(start.getDate() - dayOfWeek);
        end.setDate(start.getDate() + 6);
        break;
      case 'day':
        end.setDate(start.getDate());
        break;
    }

    return { start, end };
  }, [currentDate, viewMode]);

  // Cargar eventos cuando cambia el rango de fechas o los filtros
  useEffect(() => {
    loadEvents(dateRange.start, dateRange.end);
  }, [loadEvents, dateRange.start, dateRange.end]);

  return {
    // Estado del calendario
    events,
    loading,
    error,
    currentDate,
    viewMode,
    selectedDate,
    selectedEvent,
    filters,
    
    // Acciones principales
    createEvent,
    updateEvent,
    deleteEvent,
    completeEvent,
    scheduleRecurringEvents,
    
    // Navegación
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    changeViewMode,
    setSelectedDate,
    setSelectedEvent,
    
    // Filtros
    applyFilters,
    
    // Consultas útiles
    getEventsForDate,
    getPendingEvents,
    getOverdueEvents,
    getUpcomingEvents,
    
    // Funciones auxiliares
    clearError: () => setError(null),
    refreshEvents: () => loadEvents(dateRange.start, dateRange.end),
    
    // Estadísticas
    totalEvents: events.length,
    pendingEvents: getPendingEvents().length,
    overdueEvents: getOverdueEvents().length,
    upcomingEvents: getUpcomingEvents().length
  };
};

export default useCalendar;