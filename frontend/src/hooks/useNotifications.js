import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Hook personalizado para manejo de notificaciones
 * Incluye notificaciones en pantalla, push notifications, sonidos y persistencia
 */
const useNotifications = () => {
  // Estados principales de notificaciones
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Estados de configuración
  const [settings, setSettings] = useState({
    enableSound: true,
    enablePush: true,
    enableDesktop: true,
    autoRemove: true,
    autoRemoveDelay: 5000,
    maxNotifications: 50,
    position: 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
    enableVibration: true,
    prioritySound: {
      high: '/sounds/alert-high.mp3',
      medium: '/sounds/alert-medium.mp3',
      low: '/sounds/alert-low.mp3'
    }
  });

  // Hook de localStorage para persistencia
  const { 
    getItem, 
    setItem, 
    getItemWithTimestamp, 
    setItemWithTimestamp 
  } = useLocalStorage();

  // Referencias para control
  const notificationIdRef = useRef(0);
  const audioRef = useRef(new Map()); // Cache de sonidos
  const timeoutsRef = useRef(new Map()); // Timeouts para auto-remove

  /**
   * Función para verificar soporte de notificaciones
   */
  const isNotificationSupported = useCallback(() => {
    return 'Notification' in window;
  }, []);

  /**
   * Función para verificar soporte de Service Worker
   */
  const isServiceWorkerSupported = useCallback(() => {
    return 'serviceWorker' in navigator;
  }, []);

  /**
   * Función para solicitar permisos de notificaciones
   */
  const requestPermission = useCallback(async () => {
    if (!isNotificationSupported()) {
      console.warn('Notificaciones no soportadas en este navegador');
      return 'unsupported';
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      // Guardar configuración
      setItem('notificationPermission', permission);
      
      return permission;
    } catch (err) {
      console.error('Error al solicitar permisos de notificación:', err);
      return 'denied';
    }
  }, [isNotificationSupported, setItem]);

  /**
   * Función para generar ID único para notificaciones
   */
  const generateNotificationId = useCallback(() => {
    notificationIdRef.current += 1;
    return `notification_${Date.now()}_${notificationIdRef.current}`;
  }, []);

  /**
   * Función para reproducir sonido de notificación
   * @param {string} type - Tipo de notificación para seleccionar sonido
   * @param {string} priority - Prioridad de la notificación
   */
  const playNotificationSound = useCallback(async (type = 'info', priority = 'medium') => {
    if (!soundEnabled || !settings.enableSound) return;

    try {
      const soundFile = settings.prioritySound[priority] || settings.prioritySound.medium;
      
      // Verificar si ya tenemos el audio cacheado
      if (!audioRef.current.has(soundFile)) {
        const audio = new Audio(soundFile);
        audio.preload = 'auto';
        audioRef.current.set(soundFile, audio);
      }

      const audio = audioRef.current.get(soundFile);
      if (audio) {
        audio.currentTime = 0;
        await audio.play();
      }
    } catch (err) {
      console.warn('No se pudo reproducir sonido de notificación:', err);
    }
  }, [soundEnabled, settings.enableSound, settings.prioritySound]);

  /**
   * Función para vibrar dispositivo
   * @param {string} priority - Prioridad para determinar patrón de vibración
   */
  const vibrateDevice = useCallback((priority = 'medium') => {
    if (!settings.enableVibration || !navigator.vibrate) return;

    const patterns = {
      high: [200, 100, 200, 100, 200],
      medium: [100, 50, 100],
      low: [50]
    };

    navigator.vibrate(patterns[priority] || patterns.medium);
  }, [settings.enableVibration]);

  /**
   * Función para mostrar notificación de escritorio
   * @param {Object} notificationData - Datos de la notificación
   */
  const showDesktopNotification = useCallback(async (notificationData) => {
    if (!isNotificationSupported() || !settings.enableDesktop) return null;

    if (permissionStatus !== 'granted') {
      const newPermission = await requestPermission();
      if (newPermission !== 'granted') return null;
    }

    try {
      const options = {
        body: notificationData.message,
        icon: notificationData.icon || '/favicon.ico',
        badge: '/badge-icon.png',
        tag: notificationData.id,
        data: notificationData,
        requireInteraction: notificationData.priority === 'high',
        actions: notificationData.actions || [],
        timestamp: Date.now()
      };

      const notification = new Notification(notificationData.title, options);

      // Eventos de la notificación
      notification.onclick = () => {
        window.focus();
        if (notificationData.onClick) {
          notificationData.onClick(notificationData);
        }
        notification.close();
      };

      notification.onclose = () => {
        if (notificationData.onClose) {
          notificationData.onClose(notificationData);
        }
      };

      // Auto-cerrar después de un tiempo si no es de alta prioridad
      if (notificationData.priority !== 'high') {
        setTimeout(() => {
          notification.close();
        }, settings.autoRemoveDelay || 5000);
      }

      return notification;
    } catch (err) {
      console.error('Error al mostrar notificación de escritorio:', err);
      return null;
    }
  }, [isNotificationSupported, settings.enableDesktop, settings.autoRemoveDelay, permissionStatus, requestPermission]);

  /**
   * Función principal para agregar una notificación
   * @param {Object} notificationData - Datos de la notificación
   */
  const addNotification = useCallback(async (notificationData) => {
    const id = generateNotificationId();
    const timestamp = new Date();

    const notification = {
      id,
      type: notificationData.type || 'info', // 'success', 'error', 'warning', 'info'
      title: notificationData.title || 'Notificación',
      message: notificationData.message || '',
      priority: notificationData.priority || 'medium', // 'high', 'medium', 'low'
      category: notificationData.category || 'general', // 'bovine', 'health', 'production', etc.
      timestamp,
      read: false,
      persistent: notificationData.persistent || false,
      autoRemove: notificationData.autoRemove ?? settings.autoRemove,
      autoRemoveDelay: notificationData.autoRemoveDelay || settings.autoRemoveDelay,
      icon: notificationData.icon,
      actions: notificationData.actions || [],
      data: notificationData.data || {},
      onClick: notificationData.onClick,
      onClose: notificationData.onClose,
      bovineId: notificationData.bovineId,
      userId: notificationData.userId,
      relatedId: notificationData.relatedId
    };

    // Agregar a la lista de notificaciones
    setNotifications(prev => {
      const updated = [notification, ...prev];
      
      // Limitar el número máximo de notificaciones
      if (updated.length > settings.maxNotifications) {
        return updated.slice(0, settings.maxNotifications);
      }
      
      return updated;
    });

    // Incrementar contador de no leídas
    setUnreadCount(prev => prev + 1);

    // Reproducir sonido
    if (notification.type !== 'silent') {
      await playNotificationSound(notification.type, notification.priority);
    }

    // Vibrar dispositivo
    if (notification.priority === 'high') {
      vibrateDevice(notification.priority);
    }

    // Mostrar notificación de escritorio
    if (settings.enableDesktop) {
      await showDesktopNotification(notification);
    }

    // Configurar auto-remove
    if (notification.autoRemove && !notification.persistent) {
      const timeoutId = setTimeout(() => {
        removeNotification(id);
      }, notification.autoRemoveDelay);

      timeoutsRef.current.set(id, timeoutId);
    }

    // Guardar notificaciones importantes en localStorage
    if (notification.persistent || notification.priority === 'high') {
      const persistentNotifications = getItem('persistentNotifications', []);
      persistentNotifications.unshift(notification);
      
      // Mantener solo las últimas 20 notificaciones persistentes
      if (persistentNotifications.length > 20) {
        persistentNotifications.splice(20);
      }
      
      setItem('persistentNotifications', persistentNotifications);
    }

    return notification;
  }, [
    generateNotificationId, settings, playNotificationSound, vibrateDevice, 
    showDesktopNotification, getItem, setItem
  ]);

  /**
   * Función para remover una notificación
   * @param {string} notificationId - ID de la notificación
   */
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });

    // Limpiar timeout si existe
    const timeoutId = timeoutsRef.current.get(notificationId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(notificationId);
    }
  }, []);

  /**
   * Función para marcar una notificación como leída
   * @param {string} notificationId - ID de la notificación
   */
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => prev.map(notification => {
      if (notification.id === notificationId && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
        return { ...notification, read: true };
      }
      return notification;
    }));
  }, []);

  /**
   * Función para marcar todas las notificaciones como leídas
   */
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notification => ({ 
      ...notification, 
      read: true 
    })));
    setUnreadCount(0);
  }, []);

  /**
   * Función para limpiar todas las notificaciones
   */
  const clearAllNotifications = useCallback(() => {
    // Limpiar todos los timeouts
    timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutsRef.current.clear();

    setNotifications([]);
    setUnreadCount(0);
  }, []);

  /**
   * Función para limpiar notificaciones leídas
   */
  const clearReadNotifications = useCallback(() => {
    setNotifications(prev => {
      const readNotifications = prev.filter(n => n.read);
      
      // Limpiar timeouts de notificaciones eliminadas
      readNotifications.forEach(notification => {
        const timeoutId = timeoutsRef.current.get(notification.id);
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutsRef.current.delete(notification.id);
        }
      });

      return prev.filter(n => !n.read);
    });
  }, []);

  /**
   * Función para obtener notificaciones por categoría
   * @param {string} category - Categoría de notificaciones
   */
  const getNotificationsByCategory = useCallback((category) => {
    return notifications.filter(n => n.category === category);
  }, [notifications]);

  /**
   * Función para obtener notificaciones por tipo
   * @param {string} type - Tipo de notificaciones
   */
  const getNotificationsByType = useCallback((type) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  /**
   * Función para obtener notificaciones de un bovino específico
   * @param {string} bovineId - ID del bovino
   */
  const getBovineNotifications = useCallback((bovineId) => {
    return notifications.filter(n => n.bovineId === bovineId);
  }, [notifications]);

  /**
   * Función para actualizar configuración de notificaciones
   * @param {Object} newSettings - Nueva configuración
   */
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      setItem('notificationSettings', updated);
      return updated;
    });
  }, [setItem]);

  /**
   * Función para programar notificación futura
   * @param {Object} notificationData - Datos de la notificación
   * @param {Date} scheduleTime - Tiempo para mostrar la notificación
   */
  const scheduleNotification = useCallback((notificationData, scheduleTime) => {
    const delay = scheduleTime.getTime() - Date.now();
    
    if (delay <= 0) {
      // Si el tiempo ya pasó, mostrar inmediatamente
      return addNotification(notificationData);
    }

    const timeoutId = setTimeout(() => {
      addNotification(notificationData);
    }, delay);

    // Guardar notificación programada en localStorage
    const scheduledNotifications = getItem('scheduledNotifications', []);
    const scheduledNotification = {
      ...notificationData,
      id: generateNotificationId(),
      scheduleTime: scheduleTime.toISOString(),
      timeoutId
    };
    
    scheduledNotifications.push(scheduledNotification);
    setItem('scheduledNotifications', scheduledNotifications);

    return scheduledNotification;
  }, [addNotification, getItem, setItem, generateNotificationId]);

  /**
   * Función para cancelar notificación programada
   * @param {string} scheduledId - ID de la notificación programada
   */
  const cancelScheduledNotification = useCallback((scheduledId) => {
    const scheduledNotifications = getItem('scheduledNotifications', []);
    const updated = scheduledNotifications.filter(n => {
      if (n.id === scheduledId) {
        if (n.timeoutId) {
          clearTimeout(n.timeoutId);
        }
        return false;
      }
      return true;
    });
    
    setItem('scheduledNotifications', updated);
  }, [getItem, setItem]);

  // Métodos de conveniencia para tipos específicos de notificaciones
  const showSuccess = useCallback((title, message, options = {}) => {
    return addNotification({
      type: 'success',
      title,
      message,
      priority: 'medium',
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((title, message, options = {}) => {
    return addNotification({
      type: 'error',
      title,
      message,
      priority: 'high',
      persistent: true,
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((title, message, options = {}) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      priority: 'medium',
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((title, message, options = {}) => {
    return addNotification({
      type: 'info',
      title,
      message,
      priority: 'low',
      ...options
    });
  }, [addNotification]);

  // Cargar configuración y datos persistentes al inicializar
  useEffect(() => {
    // Cargar configuración guardada
    const savedSettings = getItem('notificationSettings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...savedSettings }));
    }

    // Cargar estado de permisos
    const savedPermission = getItem('notificationPermission', 'default');
    setPermissionStatus(savedPermission);

    // Cargar notificaciones persistentes
    const persistentNotifications = getItem('persistentNotifications', []);
    if (persistentNotifications.length > 0) {
      setNotifications(persistentNotifications);
      const unread = persistentNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    }

    // Restaurar notificaciones programadas
    const scheduledNotifications = getItem('scheduledNotifications', []);
    scheduledNotifications.forEach(scheduled => {
      const scheduleTime = new Date(scheduled.scheduleTime);
      if (scheduleTime > new Date()) {
        scheduleNotification(scheduled, scheduleTime);
      }
    });

    // Verificar permisos actuales si el navegador lo soporta
    if (isNotificationSupported()) {
      setPermissionStatus(Notification.permission);
    }
  }, [getItem, scheduleNotification, isNotificationSupported]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      // Limpiar todos los timeouts
      timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutsRef.current.clear();
      
      // Limpiar cache de audio
      audioRef.current.clear();
    };
  }, []);

  return {
    // Estado de notificaciones
    notifications,
    unreadCount,
    permissionStatus,
    settings,
    
    // Estado de soporte
    isSupported: isNotificationSupported(),
    isServiceWorkerSupported: isServiceWorkerSupported(),
    isPermissionGranted: permissionStatus === 'granted',
    
    // Acciones principales
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    clearReadNotifications,
    
    // Programación
    scheduleNotification,
    cancelScheduledNotification,
    
    // Configuración
    updateSettings,
    requestPermission,
    
    // Consultas
    getNotificationsByCategory,
    getNotificationsByType,
    getBovineNotifications,
    
    // Métodos de conveniencia
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Control de sonido
    soundEnabled,
    setSoundEnabled,
    
    // Estadísticas
    totalNotifications: notifications.length,
    readNotifications: notifications.filter(n => n.read).length,
    unreadNotifications: notifications.filter(n => !n.read).length,
    persistentNotifications: notifications.filter(n => n.persistent).length
  };
};

export default useNotifications;