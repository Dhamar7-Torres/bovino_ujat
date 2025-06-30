/**
 * NotificationContext.js - Contexto para manejo de notificaciones
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

// Estado inicial de notificaciones
const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  settings: {
    enabled: true,
    sound: true,
    browser: true,
    email: false,
    push: false,
    doNotDisturb: false,
    doNotDisturbStart: '22:00',
    doNotDisturbEnd: '08:00'
  },
  filters: {
    types: ['all'],
    priority: ['all'],
    read: 'all'
  }
};

// Acciones del reducer
const NOTIFICATION_ACTIONS = {
  LOAD_NOTIFICATIONS_START: 'LOAD_NOTIFICATIONS_START',
  LOAD_NOTIFICATIONS_SUCCESS: 'LOAD_NOTIFICATIONS_SUCCESS',
  LOAD_NOTIFICATIONS_FAILURE: 'LOAD_NOTIFICATIONS_FAILURE',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_AS_UNREAD: 'MARK_AS_UNREAD',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  CLEAR_ALL: 'CLEAR_ALL',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  UPDATE_FILTERS: 'UPDATE_FILTERS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer de notificaciones
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.LOAD_NOTIFICATIONS_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case NOTIFICATION_ACTIONS.LOAD_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        notifications: action.payload.notifications,
        unreadCount: action.payload.unreadCount,
        error: null
      };

    case NOTIFICATION_ACTIONS.LOAD_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      const newNotification = {
        ...action.payload,
        id: action.payload.id || Date.now().toString(),
        timestamp: action.payload.timestamp || new Date().toISOString(),
        read: false
      };

      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };

    case NOTIFICATION_ACTIONS.UPDATE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload.id
            ? { ...notification, ...action.payload.updates }
            : notification
        )
      };

    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      const removedNotification = state.notifications.find(n => n.id === action.payload);
      const wasUnread = removedNotification && !removedNotification.read;

      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount
      };

    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };

    case NOTIFICATION_ACTIONS.MARK_AS_UNREAD:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: false }
            : notification
        ),
        unreadCount: state.unreadCount + 1
      };

    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          read: true
        })),
        unreadCount: 0
      };

    case NOTIFICATION_ACTIONS.CLEAR_ALL:
      return {
        ...state,
        notifications: [],
        unreadCount: 0
      };

    case NOTIFICATION_ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case NOTIFICATION_ACTIONS.UPDATE_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case NOTIFICATION_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };

    case NOTIFICATION_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Crear el contexto
const NotificationContext = createContext();

// Proveedor del contexto
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Cargar configuración inicial
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        dispatch({ type: NOTIFICATION_ACTIONS.LOAD_NOTIFICATIONS_START });

        // Cargar configuración guardada
        const savedSettings = localStorage.getItem('notificationSettings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          dispatch({
            type: NOTIFICATION_ACTIONS.UPDATE_SETTINGS,
            payload: settings
          });
        }

        // Cargar notificaciones mock
        const mockNotifications = [
          {
            id: '1',
            type: 'health',
            title: 'Vacunación Pendiente',
            message: '5 bovinos requieren vacunación hoy',
            priority: 'high',
            timestamp: new Date().toISOString(),
            read: false,
            category: 'health',
            actionUrl: '/health/vaccines'
          },
          {
            id: '2',
            type: 'production',
            title: 'Meta de Producción Alcanzada',
            message: 'Producción lechera del día superó la meta',
            priority: 'medium',
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            read: false,
            category: 'production',
            actionUrl: '/production'
          },
          {
            id: '3',
            type: 'system',
            title: 'Backup Completado',
            message: 'Copia de seguridad realizada exitosamente',
            priority: 'low',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            read: true,
            category: 'system',
            actionUrl: null
          }
        ];

        dispatch({
          type: NOTIFICATION_ACTIONS.LOAD_NOTIFICATIONS_SUCCESS,
          payload: {
            notifications: mockNotifications,
            unreadCount: mockNotifications.filter(n => !n.read).length
          }
        });
      } catch (error) {
        dispatch({
          type: NOTIFICATION_ACTIONS.LOAD_NOTIFICATIONS_FAILURE,
          payload: error.message
        });
      }
    };

    loadInitialData();
  }, []);

  // Guardar configuración cuando cambie
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(state.settings));
  }, [state.settings]);

  // Solicitar permisos de notificaciones del navegador
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  // Verificar si está en horario No Molestar
  const isInDoNotDisturbHours = () => {
    if (!state.settings.doNotDisturb) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = state.settings.doNotDisturbStart.split(':').map(Number);
    const [endHour, endMin] = state.settings.doNotDisturbEnd.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    // Si el período cruza medianoche
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    }
    
    return currentTime >= startTime && currentTime <= endTime;
  };

  // Mostrar notificación
  const showNotification = (notification) => {
    const notificationData = {
      ...notification,
      id: notification.id || Date.now().toString(),
      timestamp: notification.timestamp || new Date().toISOString(),
      read: false
    };

    // Agregar a la lista
    dispatch({
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
      payload: notificationData
    });

    // Mostrar toast si las notificaciones están habilitadas
    if (state.settings.enabled && !isInDoNotDisturbHours()) {
      const toastOptions = {
        duration: notification.priority === 'high' ? 8000 : 4000,
        position: 'top-right'
      };

      switch (notification.type) {
        case 'success':
          toast.success(notification.message, toastOptions);
          break;
        case 'error':
          toast.error(notification.message, toastOptions);
          break;
        case 'warning':
          toast(notification.message, {
            ...toastOptions,
            icon: '⚠️'
          });
          break;
        default:
          toast(notification.message, toastOptions);
      }

      // Mostrar notificación del navegador si está habilitada
      if (state.settings.browser && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id
        });
      }

      // Reproducir sonido si está habilitado
      if (state.settings.sound) {
        // Aquí se podría reproducir un sonido
        // new Audio('/notification-sound.mp3').play().catch(() => {});
      }
    }

    return notificationData.id;
  };

  // Funciones de conveniencia para diferentes tipos
  const showSuccess = (title, message, options = {}) => {
    return showNotification({
      type: 'success',
      title,
      message,
      priority: 'medium',
      ...options
    });
  };

  const showError = (title, message, options = {}) => {
    return showNotification({
      type: 'error',
      title,
      message,
      priority: 'high',
      ...options
    });
  };

  const showWarning = (title, message, options = {}) => {
    return showNotification({
      type: 'warning',
      title,
      message,
      priority: 'medium',
      ...options
    });
  };

  const showInfo = (title, message, options = {}) => {
    return showNotification({
      type: 'info',
      title,
      message,
      priority: 'low',
      ...options
    });
  };

  // Marcar como leída
  const markAsRead = (notificationId) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.MARK_AS_READ,
      payload: notificationId
    });
  };

  // Marcar como no leída
  const markAsUnread = (notificationId) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.MARK_AS_UNREAD,
      payload: notificationId
    });
  };

  // Marcar todas como leídas
  const markAllAsRead = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
  };

  // Eliminar notificación
  const removeNotification = (notificationId) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
      payload: notificationId
    });
  };

  // Limpiar todas las notificaciones
  const clearAll = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL });
  };

  // Actualizar configuración
  const updateSettings = (newSettings) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.UPDATE_SETTINGS,
      payload: newSettings
    });
  };

  // Actualizar filtros
  const updateFilters = (newFilters) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.UPDATE_FILTERS,
      payload: newFilters
    });
  };

  // Obtener notificaciones filtradas
  const getFilteredNotifications = () => {
    let filtered = state.notifications;

    // Filtrar por tipo
    if (state.filters.types.length > 0 && !state.filters.types.includes('all')) {
      filtered = filtered.filter(n => state.filters.types.includes(n.type));
    }

    // Filtrar por prioridad
    if (state.filters.priority.length > 0 && !state.filters.priority.includes('all')) {
      filtered = filtered.filter(n => state.filters.priority.includes(n.priority));
    }

    // Filtrar por estado de lectura
    if (state.filters.read !== 'all') {
      filtered = filtered.filter(n => 
        state.filters.read === 'read' ? n.read : !n.read
      );
    }

    return filtered;
  };

  const value = {
    ...state,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    removeNotification,
    clearAll,
    updateSettings,
    updateFilters,
    getFilteredNotifications,
    requestNotificationPermission,
    isInDoNotDisturbHours
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook para usar el contexto
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Hook simplificado para toast
export const useToast = () => {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();
  
  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo
  };
};

export default NotificationContext;