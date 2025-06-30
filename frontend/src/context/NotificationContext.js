import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { notificationService } from '../services/notificationService';

/**
 * Contexto de notificaciones para el sistema de gestión de bovinos
 * Maneja notificaciones en tiempo real, alertas, toast y configuración
 */

// Estado inicial del contexto de notificaciones
const initialState = {
  // Notificaciones
  notifications: [],
  unreadCount: 0,
  loading: false,
  
  // Toast notifications (notificaciones temporales)
  toasts: [],
  toastIdCounter: 0,
  
  // Configuración de notificaciones
  settings: {
    desktop: true,
    sound: true,
    email: true,
    push: true,
    doNotDisturb: false,
    doNotDisturbStart: '22:00',
    doNotDisturbEnd: '07:00',
    autoMarkAsRead: false,
    maxToastDisplay: 5,
    toastDuration: 5000
  },
  
  // Estado de conexión WebSocket
  websocket: {
    connected: false,
    reconnecting: false,
    lastMessage: null
  },
  
  // Filtros de notificaciones
  filters: {
    category: '',
    type: '',
    priority: '',
    unreadOnly: false
  },
  
  // Paginación
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: true
  }
};

// Tipos de acciones para el reducer
const NOTIFICATION_ACTIONS = {
  // Cargar notificaciones
  LOAD_NOTIFICATIONS_START: 'LOAD_NOTIFICATIONS_START',
  LOAD_NOTIFICATIONS_SUCCESS: 'LOAD_NOTIFICATIONS_SUCCESS',
  LOAD_NOTIFICATIONS_FAILURE: 'LOAD_NOTIFICATIONS_FAILURE',
  
  // Agregar nueva notificación
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  
  // Marcar como leída
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  
  // Eliminar notificación
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  
  // Toast notifications
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  CLEAR_ALL_TOASTS: 'CLEAR_ALL_TOASTS',
  
  // Configuración
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  
  // WebSocket
  WEBSOCKET_CONNECTED: 'WEBSOCKET_CONNECTED',
  WEBSOCKET_DISCONNECTED: 'WEBSOCKET_DISCONNECTED',
  WEBSOCKET_RECONNECTING: 'WEBSOCKET_RECONNECTING',
  WEBSOCKET_MESSAGE: 'WEBSOCKET_MESSAGE',
  
  // Filtros
  UPDATE_FILTERS: 'UPDATE_FILTERS',
  
  // Paginación
  UPDATE_PAGINATION: 'UPDATE_PAGINATION',
  
  // Limpiar estado
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS'
};

/**
 * Reducer para manejar las acciones del estado de notificaciones
 * @param {Object} state - Estado actual
 * @param {Object} action - Acción a ejecutar
 */
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.LOAD_NOTIFICATIONS_START:
      return {
        ...state,
        loading: true
      };

    case NOTIFICATION_ACTIONS.LOAD_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload.append 
          ? [...state.notifications, ...action.payload.notifications]
          : action.payload.notifications,
        unreadCount: action.payload.unreadCount,
        pagination: {
          ...state.pagination,
          page: action.payload.page,
          total: action.payload.total,
          hasMore: action.payload.hasMore
        }
      };

    case NOTIFICATION_ACTIONS.LOAD_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        loading: false
      };

    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + (action.payload.estado === 'no_leida' ? 1 : 0)
      };

    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload.id
            ? { ...notification, estado: 'leida', fecha_lectura: new Date().toISOString() }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };

    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          estado: 'leida',
          fecha_lectura: notification.estado === 'no_leida' ? new Date().toISOString() : notification.fecha_lectura
        })),
        unreadCount: 0
      };

    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      const removedNotification = state.notifications.find(n => n.id === action.payload.id);
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload.id),
        unreadCount: removedNotification?.estado === 'no_leida' 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount
      };

    case NOTIFICATION_ACTIONS.ADD_TOAST:
      const newToast = {
        ...action.payload,
        id: state.toastIdCounter + 1,
        timestamp: Date.now()
      };
      
      return {
        ...state,
        toasts: [newToast, ...state.toasts.slice(0, state.settings.maxToastDisplay - 1)],
        toastIdCounter: state.toastIdCounter + 1
      };

    case NOTIFICATION_ACTIONS.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload.id)
      };

    case NOTIFICATION_ACTIONS.CLEAR_ALL_TOASTS:
      return {
        ...state,
        toasts: []
      };

    case NOTIFICATION_ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };

    case NOTIFICATION_ACTIONS.WEBSOCKET_CONNECTED:
      return {
        ...state,
        websocket: {
          ...state.websocket,
          connected: true,
          reconnecting: false
        }
      };

    case NOTIFICATION_ACTIONS.WEBSOCKET_DISCONNECTED:
      return {
        ...state,
        websocket: {
          ...state.websocket,
          connected: false,
          reconnecting: false
        }
      };

    case NOTIFICATION_ACTIONS.WEBSOCKET_RECONNECTING:
      return {
        ...state,
        websocket: {
          ...state.websocket,
          reconnecting: true
        }
      };

    case NOTIFICATION_ACTIONS.WEBSOCKET_MESSAGE:
      return {
        ...state,
        websocket: {
          ...state.websocket,
          lastMessage: action.payload
        }
      };

    case NOTIFICATION_ACTIONS.UPDATE_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

    case NOTIFICATION_ACTIONS.UPDATE_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload
        }
      };

    case NOTIFICATION_ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...initialState,
        settings: state.settings
      };

    default:
      return state;
  }
};

// Crear el contexto de notificaciones
const NotificationContext = createContext(undefined);

/**
 * Proveedor del contexto de notificaciones
 * @param {Object} props - Props del componente
 */
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user, isAuthenticated } = useAuth();
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const toastTimeoutsRef = useRef(new Map());

  /**
   * Cargar notificaciones del servidor
   * @param {boolean} append - Si agregar a las existentes o reemplazar
   */
  const loadNotifications = useCallback(async (append = false) => {
    try {
      dispatch({ type: NOTIFICATION_ACTIONS.LOAD_NOTIFICATIONS_START });

      const params = {
        page: append ? state.pagination.page + 1 : 1,
        limit: state.pagination.limit,
        ...state.filters
      };

      const response = await notificationService.getNotifications(params);

      if (response.success) {
        dispatch({
          type: NOTIFICATION_ACTIONS.LOAD_NOTIFICATIONS_SUCCESS,
          payload: {
            notifications: response.data,
            unreadCount: response.unread_count,
            page: response.page,
            total: response.total,
            hasMore: response.page < response.totalPages,
            append
          }
        });
      } else {
        dispatch({ type: NOTIFICATION_ACTIONS.LOAD_NOTIFICATIONS_FAILURE });
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      dispatch({ type: NOTIFICATION_ACTIONS.LOAD_NOTIFICATIONS_FAILURE });
    }
  }, [state.pagination, state.filters]);

  /**
   * Marcar notificación como leída
   * @param {string} notificationId - ID de la notificación
   */
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      
      if (response.success) {
        dispatch({
          type: NOTIFICATION_ACTIONS.MARK_AS_READ,
          payload: { id: notificationId }
        });
      }
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  }, []);

  /**
   * Marcar todas las notificaciones como leídas
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await notificationService.markAllAsRead(state.filters);
      
      if (response.success) {
        dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
      }
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  }, [state.filters]);

  /**
   * Eliminar notificación
   * @param {string} notificationId - ID de la notificación
   */
  const removeNotification = useCallback(async (notificationId) => {
    try {
      const response = await notificationService.deleteNotification(notificationId);
      
      if (response.success) {
        dispatch({
          type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
          payload: { id: notificationId }
        });
      }
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  }, []);

  /**
   * Mostrar toast notification
   * @param {Object} toast - Datos del toast
   */
  const showToast = useCallback((toast) => {
    const {
      type = 'info', // success, error, warning, info
      title = '',
      message = '',
      duration = state.settings.toastDuration,
      action = null,
      persistent = false,
      sound = state.settings.sound
    } = toast;

    // Verificar modo no molestar
    if (state.settings.doNotDisturb && !isInDoNotDisturbHours()) {
      return;
    }

    const toastData = {
      type,
      title,
      message,
      action,
      persistent
    };

    dispatch({
      type: NOTIFICATION_ACTIONS.ADD_TOAST,
      payload: toastData
    });

    // Reproducir sonido si está habilitado
    if (sound && state.settings.sound) {
      playNotificationSound(type);
    }

    // Auto-remover si no es persistente
    if (!persistent && duration > 0) {
      const timeoutId = setTimeout(() => {
        removeToast(state.toastIdCounter + 1);
      }, duration);

      toastTimeoutsRef.current.set(state.toastIdCounter + 1, timeoutId);
    }
  }, [state.settings, state.toastIdCounter]);

  /**
   * Remover toast notification
   * @param {number} toastId - ID del toast
   */
  const removeToast = useCallback((toastId) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.REMOVE_TOAST,
      payload: { id: toastId }
    });

    // Limpiar timeout si existe
    const timeoutId = toastTimeoutsRef.current.get(toastId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      toastTimeoutsRef.current.delete(toastId);
    }
  }, []);

  /**
   * Limpiar todos los toasts
   */
  const clearAllToasts = useCallback(() => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL_TOASTS });
    
    // Limpiar todos los timeouts
    toastTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    toastTimeoutsRef.current.clear();
  }, []);

  /**
   * Actualizar configuración de notificaciones
   * @param {Object} newSettings - Nueva configuración
   */
  const updateSettings = useCallback(async (newSettings) => {
    try {
      const response = await notificationService.updateNotificationSettings(newSettings);
      
      if (response.success) {
        dispatch({
          type: NOTIFICATION_ACTIONS.UPDATE_SETTINGS,
          payload: newSettings
        });
      }
    } catch (error) {
      console.error('Error al actualizar configuración:', error);
    }
  }, []);

  /**
   * Actualizar filtros de notificaciones
   * @param {Object} newFilters - Nuevos filtros
   */
  const updateFilters = useCallback((newFilters) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.UPDATE_FILTERS,
      payload: newFilters
    });
  }, []);

  /**
   * Verificar si está en horario de no molestar
   */
  const isInDoNotDisturbHours = useCallback(() => {
    if (!state.settings.doNotDisturb) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = state.settings.doNotDisturbStart.split(':').map(Number);
    const [endHour, endMin] = state.settings.doNotDisturbEnd.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Cruzar medianoche
      return currentTime >= startTime || currentTime <= endTime;
    }
  }, [state.settings]);

  /**
   * Reproducir sonido de notificación
   * @param {string} type - Tipo de notificación
   */
  const playNotificationSound = useCallback((type) => {
    if (!state.settings.sound) return;

    try {
      let soundUrl = '/sounds/notification.mp3';
      
      switch (type) {
        case 'error':
          soundUrl = '/sounds/error.mp3';
          break;
        case 'warning':
          soundUrl = '/sounds/warning.mp3';
          break;
        case 'success':
          soundUrl = '/sounds/success.mp3';
          break;
        default:
          soundUrl = '/sounds/notification.mp3';
      }

      const audio = new Audio(soundUrl);
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignorar errores de reproducción
      });
    } catch (error) {
      // Ignorar errores de audio
    }
  }, [state.settings.sound]);

  /**
   * Mostrar notificación de escritorio
   * @param {Object} notificationData - Datos de la notificación
   */
  const showDesktopNotification = useCallback((notificationData) => {
    if (!state.settings.desktop || !('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      const notification = new Notification(notificationData.titulo, {
        body: notificationData.mensaje,
        icon: '/favicon.ico',
        tag: notificationData.id,
        requireInteraction: notificationData.prioridad === 'urgente'
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        
        // Marcar como leída automáticamente
        if (state.settings.autoMarkAsRead) {
          markAsRead(notificationData.id);
        }
      };

      // Auto-cerrar después de 5 segundos
      setTimeout(() => notification.close(), 5000);
    }
  }, [state.settings, markAsRead]);

  /**
   * Conectar WebSocket para notificaciones en tiempo real
   */
  const connectWebSocket = useCallback(() => {
    if (!isAuthenticated || wsRef.current) return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/notifications`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket conectado');
        dispatch({ type: NOTIFICATION_ACTIONS.WEBSOCKET_CONNECTED });
        
        // Limpiar timeout de reconexión
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          dispatch({
            type: NOTIFICATION_ACTIONS.WEBSOCKET_MESSAGE,
            payload: data
          });

          // Procesar diferentes tipos de mensajes
          switch (data.type) {
            case 'new_notification':
              // Agregar nueva notificación
              dispatch({
                type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
                payload: data.notification
              });

              // Mostrar toast
              showToast({
                type: getToastTypeFromPriority(data.notification.prioridad),
                title: data.notification.titulo,
                message: data.notification.mensaje,
                duration: data.notification.prioridad === 'urgente' ? 0 : undefined
              });

              // Mostrar notificación de escritorio
              showDesktopNotification(data.notification);
              break;

            case 'notification_read':
              // Marcar como leída
              dispatch({
                type: NOTIFICATION_ACTIONS.MARK_AS_READ,
                payload: { id: data.notification_id }
              });
              break;

            default:
              console.log('Mensaje WebSocket no manejado:', data);
          }
        } catch (error) {
          console.error('Error al procesar mensaje WebSocket:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket desconectado');
        dispatch({ type: NOTIFICATION_ACTIONS.WEBSOCKET_DISCONNECTED });
        wsRef.current = null;

        // Intentar reconectar después de 5 segundos
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isAuthenticated) {
            dispatch({ type: NOTIFICATION_ACTIONS.WEBSOCKET_RECONNECTING });
            connectWebSocket();
          }
        }, 5000);
      };

      wsRef.current.onerror = (error) => {
        console.error('Error WebSocket:', error);
      };

    } catch (error) {
      console.error('Error al conectar WebSocket:', error);
    }
  }, [isAuthenticated, showToast, showDesktopNotification]);

  /**
   * Desconectar WebSocket
   */
  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  /**
   * Obtener tipo de toast según la prioridad
   * @param {string} prioridad - Prioridad de la notificación
   */
  const getToastTypeFromPriority = (prioridad) => {
    switch (prioridad) {
      case 'urgente':
        return 'error';
      case 'alta':
        return 'warning';
      case 'media':
        return 'info';
      case 'baja':
        return 'info';
      default:
        return 'info';
    }
  };

  /**
   * Solicitar permisos de notificación
   */
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return Notification.permission === 'granted';
  }, []);

  // Cargar notificaciones al inicializar
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated, loadNotifications]);

  // Conectar WebSocket cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [isAuthenticated, connectWebSocket, disconnectWebSocket]);

  // Limpiar notificaciones cuando el usuario se desconecta
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_NOTIFICATIONS });
    }
  }, [isAuthenticated]);

  // Recargar notificaciones cuando cambian los filtros
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [state.filters]);

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      toastTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      toastTimeoutsRef.current.clear();
    };
  }, []);

  // Funciones de conveniencia para diferentes tipos de toast
  const showSuccess = useCallback((title, message, options = {}) => {
    showToast({ type: 'success', title, message, ...options });
  }, [showToast]);

  const showError = useCallback((title, message, options = {}) => {
    showToast({ type: 'error', title, message, persistent: true, ...options });
  }, [showToast]);

  const showWarning = useCallback((title, message, options = {}) => {
    showToast({ type: 'warning', title, message, ...options });
  }, [showToast]);

  const showInfo = useCallback((title, message, options = {}) => {
    showToast({ type: 'info', title, message, ...options });
  }, [showToast]);

  // Valor del contexto
  const contextValue = {
    // Estado
    ...state,

    // Acciones principales
    loadNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    
    // Toast notifications
    showToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Configuración
    updateSettings,
    updateFilters,
    
    // WebSocket
    connectWebSocket,
    disconnectWebSocket,
    
    // Utilidades
    requestNotificationPermission,
    isInDoNotDisturbHours,
    
    // Cargar más notificaciones
    loadMore: () => loadNotifications(true)
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook para usar el contexto de notificaciones
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications debe ser usado dentro de un NotificationProvider');
  }
  
  return context;
};

/**
 * Hook para mostrar solo toast notifications
 */
export const useToast = () => {
  const { showToast, showSuccess, showError, showWarning, showInfo, removeToast } = useNotifications();
  
  return {
    show: showToast,
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    remove: removeToast
  };
};

export default NotificationContext;