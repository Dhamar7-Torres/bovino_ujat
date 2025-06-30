import { useState, useEffect, useCallback, useRef } from 'react';
import { useNotifications } from './useNotifications';
import { useAuth } from './useAuth';

/**
 * Hook personalizado para manejo de WebSocket
 * Incluye reconexión automática, eventos específicos del dominio y sincronización en tiempo real
 */
const useWebSocket = (url = null, options = {}) => {
  // Estados principales del WebSocket
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  // Estados de datos en tiempo real
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [liveUpdates, setLiveUpdates] = useState({
    bovines: [],
    health: [],
    production: [],
    locations: []
  });

  // Configuración por defecto
  const {
    autoConnect = true,           // Conectar automáticamente
    autoReconnect = true,         // Reconexión automática
    maxReconnectAttempts = 10,    // Máximo número de intentos de reconexión
    reconnectInterval = 5000,     // Intervalo entre reconexiones (ms)
    heartbeatInterval = 30000,    // Intervalo de heartbeat (ms)
    enableHeartbeat = true,       // Habilitar heartbeat
    protocols = [],               // Protocolos WebSocket
    enableNotifications = true,   // Habilitar notificaciones automáticas
    enableLocationTracking = true // Habilitar tracking de ubicación
  } = options;

  // Referencias para control
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const messageQueueRef = useRef([]);
  const eventListenersRef = useRef(new Map());

  // Hooks relacionados
  const { addNotification } = useNotifications();
  const { user, isAuthenticated } = useAuth();

  /**
   * Función para generar URL del WebSocket
   */
  const getWebSocketUrl = useCallback(() => {
    if (url) return url;
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.REACT_APP_WS_HOST || window.location.host;
    const path = process.env.REACT_APP_WS_PATH || '/ws';
    
    return `${protocol}//${host}${path}`;
  }, [url]);

  /**
   * Función para conectar al WebSocket
   */
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.warn('WebSocket ya está conectado');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.CONNECTING) {
      console.warn('WebSocket ya está conectando');
      return;
    }

    try {
      setIsConnecting(true);
      setConnectionError(null);

      const wsUrl = getWebSocketUrl();
      console.log('Conectando a WebSocket:', wsUrl);

      wsRef.current = new WebSocket(wsUrl, protocols);

      // Evento de apertura de conexión
      wsRef.current.onopen = (event) => {
        console.log('WebSocket conectado');
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);
        setConnectionAttempts(0);

        // Autenticar si hay usuario logueado
        if (isAuthenticated && user) {
          send({
            type: 'AUTH',
            token: localStorage.getItem('authToken'),
            userId: user.id,
            userRole: user.rol?.nombre
          });
        }

        // Procesar cola de mensajes pendientes
        processMessageQueue();

        // Iniciar heartbeat si está habilitado
        if (enableHeartbeat) {
          startHeartbeat();
        }

        // Notificar conexión exitosa
        if (enableNotifications) {
          addNotification({
            type: 'success',
            title: 'Conexión establecida',
            message: 'Conectado al sistema en tiempo real',
            category: 'system',
            autoRemove: true,
            autoRemoveDelay: 3000
          });
        }
      };

      // Evento de recepción de mensaje
      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
          handleMessage(message);
        } catch (err) {
          console.error('Error al parsear mensaje WebSocket:', err);
          setLastMessage({ error: 'Error al parsear mensaje', raw: event.data });
        }
      };

      // Evento de cierre de conexión
      wsRef.current.onclose = (event) => {
        console.log('WebSocket desconectado:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);

        // Limpiar heartbeat
        stopHeartbeat();

        // Intentar reconexión si está habilitada
        if (autoReconnect && connectionAttempts < maxReconnectAttempts) {
          scheduleReconnect();
        } else if (connectionAttempts >= maxReconnectAttempts) {
          setConnectionError('Máximo número de intentos de reconexión alcanzado');
          
          if (enableNotifications) {
            addNotification({
              type: 'error',
              title: 'Conexión perdida',
              message: 'No se pudo restablecer la conexión en tiempo real',
              category: 'system',
              persistent: true
            });
          }
        }
      };

      // Evento de error
      wsRef.current.onerror = (error) => {
        console.error('Error en WebSocket:', error);
        setConnectionError('Error de conexión WebSocket');
        setIsConnecting(false);
      };

    } catch (err) {
      console.error('Error al crear WebSocket:', err);
      setConnectionError('Error al crear conexión WebSocket');
      setIsConnecting(false);
    }
  }, [
    getWebSocketUrl, protocols, isAuthenticated, user, enableHeartbeat, 
    enableNotifications, autoReconnect, connectionAttempts, maxReconnectAttempts,
    addNotification
  ]);

  /**
   * Función para desconectar WebSocket
   */
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    stopHeartbeat();

    if (wsRef.current) {
      wsRef.current.close(1000, 'Desconexión manual');
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setConnectionError(null);
    setConnectionAttempts(0);
  }, []);

  /**
   * Función para enviar mensaje por WebSocket
   * @param {Object} message - Mensaje a enviar
   * @param {boolean} queueIfDisconnected - Encolar si está desconectado
   */
  const send = useCallback((message, queueIfDisconnected = true) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      if (queueIfDisconnected) {
        messageQueueRef.current.push(message);
        console.log('Mensaje encolado:', message);
      } else {
        console.warn('WebSocket no conectado, mensaje descartado:', message);
      }
      return false;
    }

    try {
      const messageString = typeof message === 'string' ? message : JSON.stringify(message);
      wsRef.current.send(messageString);
      return true;
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      return false;
    }
  }, []);

  /**
   * Función para procesar cola de mensajes pendientes
   */
  const processMessageQueue = useCallback(() => {
    while (messageQueueRef.current.length > 0) {
      const message = messageQueueRef.current.shift();
      send(message, false);
    }
  }, [send]);

  /**
   * Función para programar reconexión
   */
  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    const delay = Math.min(reconnectInterval * Math.pow(1.5, connectionAttempts), 30000);
    console.log(`Programando reconexión en ${delay}ms (intento ${connectionAttempts + 1})`);

    reconnectTimeoutRef.current = setTimeout(() => {
      setConnectionAttempts(prev => prev + 1);
      connect();
    }, delay);
  }, [reconnectInterval, connectionAttempts, connect]);

  /**
   * Función para iniciar heartbeat
   */
  const startHeartbeat = useCallback(() => {
    stopHeartbeat();
    
    heartbeatIntervalRef.current = setInterval(() => {
      send({ type: 'PING', timestamp: Date.now() }, false);
    }, heartbeatInterval);
  }, [send, heartbeatInterval]);

  /**
   * Función para detener heartbeat
   */
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  /**
   * Función para manejar mensajes recibidos
   * @param {Object} message - Mensaje recibido
   */
  const handleMessage = useCallback((message) => {
    const { type, data, ...rest } = message;

    switch (type) {
      case 'PONG':
        // Respuesta al ping, conexión activa
        break;

      case 'AUTH_SUCCESS':
        console.log('Autenticación WebSocket exitosa');
        // Suscribirse a canales específicos del usuario
        subscribeToUserChannels();
        break;

      case 'AUTH_ERROR':
        console.error('Error de autenticación WebSocket:', data?.message);
        setConnectionError('Error de autenticación');
        break;

      case 'USER_ONLINE':
        setOnlineUsers(prev => {
          const exists = prev.find(u => u.id === data.userId);
          if (!exists) {
            return [...prev, { id: data.userId, name: data.userName, role: data.userRole }];
          }
          return prev;
        });
        break;

      case 'USER_OFFLINE':
        setOnlineUsers(prev => prev.filter(u => u.id !== data.userId));
        break;

      case 'BOVINE_UPDATE':
        setLiveUpdates(prev => ({
          ...prev,
          bovines: updateDataArray(prev.bovines, data)
        }));
        handleBovineUpdate(data);
        break;

      case 'HEALTH_ALERT':
        setLiveUpdates(prev => ({
          ...prev,
          health: [data, ...prev.health.slice(0, 49)] // Mantener últimas 50
        }));
        handleHealthAlert(data);
        break;

      case 'PRODUCTION_UPDATE':
        setLiveUpdates(prev => ({
          ...prev,
          production: updateDataArray(prev.production, data)
        }));
        handleProductionUpdate(data);
        break;

      case 'LOCATION_UPDATE':
        setLiveUpdates(prev => ({
          ...prev,
          locations: updateDataArray(prev.locations, data)
        }));
        handleLocationUpdate(data);
        break;

      case 'NOTIFICATION':
        if (enableNotifications) {
          addNotification({
            ...data,
            category: 'realtime'
          });
        }
        break;

      case 'SYSTEM_MESSAGE':
        handleSystemMessage(data);
        break;

      default:
        // Ejecutar listeners personalizados
        const listeners = eventListenersRef.current.get(type);
        if (listeners) {
          listeners.forEach(listener => listener(data, rest));
        }
        break;
    }
  }, [enableNotifications, addNotification]);

  /**
   * Función para suscribirse a canales específicos del usuario
   */
  const subscribeToUserChannels = useCallback(() => {
    if (!user) return;

    // Suscribirse a actualizaciones de bovinos del rancho del usuario
    send({
      type: 'SUBSCRIBE',
      channels: [
        `ranch:${user.rancho_id}`,
        `user:${user.id}`,
        'system:alerts',
        'health:critical'
      ]
    });
  }, [user, send]);

  /**
   * Función para manejar actualizaciones de bovinos
   * @param {Object} data - Datos del bovino actualizado
   */
  const handleBovineUpdate = useCallback((data) => {
    if (enableNotifications && data.notification) {
      addNotification({
        type: 'info',
        title: 'Actualización de bovino',
        message: `${data.bovine_name}: ${data.notification}`,
        category: 'bovine',
        bovineId: data.bovine_id,
        autoRemove: true
      });
    }
  }, [enableNotifications, addNotification]);

  /**
   * Función para manejar alertas de salud
   * @param {Object} data - Datos de la alerta de salud
   */
  const handleHealthAlert = useCallback((data) => {
    if (enableNotifications) {
      addNotification({
        type: data.severity === 'critical' ? 'error' : 'warning',
        title: 'Alerta de salud',
        message: `${data.bovine_name}: ${data.alert_message}`,
        category: 'health',
        bovineId: data.bovine_id,
        priority: data.severity === 'critical' ? 'high' : 'medium',
        persistent: data.severity === 'critical'
      });
    }
  }, [enableNotifications, addNotification]);

  /**
   * Función para manejar actualizaciones de producción
   * @param {Object} data - Datos de producción
   */
  const handleProductionUpdate = useCallback((data) => {
    if (enableNotifications && data.is_milestone) {
      addNotification({
        type: 'success',
        title: 'Hito de producción',
        message: `${data.bovine_name}: ${data.milestone_message}`,
        category: 'production',
        bovineId: data.bovine_id,
        autoRemove: true
      });
    }
  }, [enableNotifications, addNotification]);

  /**
   * Función para manejar actualizaciones de ubicación
   * @param {Object} data - Datos de ubicación
   */
  const handleLocationUpdate = useCallback((data) => {
    if (enableLocationTracking && data.is_alert) {
      addNotification({
        type: 'warning',
        title: 'Alerta de ubicación',
        message: `${data.bovine_name}: ${data.alert_message}`,
        category: 'location',
        bovineId: data.bovine_id,
        priority: 'medium'
      });
    }
  }, [enableLocationTracking, addNotification]);

  /**
   * Función para manejar mensajes del sistema
   * @param {Object} data - Datos del mensaje del sistema
   */
  const handleSystemMessage = useCallback((data) => {
    if (enableNotifications) {
      addNotification({
        type: data.type || 'info',
        title: 'Mensaje del sistema',
        message: data.message,
        category: 'system',
        priority: data.priority || 'medium',
        persistent: data.persistent || false
      });
    }
  }, [enableNotifications, addNotification]);

  /**
   * Función auxiliar para actualizar arrays de datos
   * @param {Array} array - Array actual
   * @param {Object} newItem - Nuevo item
   */
  const updateDataArray = useCallback((array, newItem) => {
    const existingIndex = array.findIndex(item => item.id === newItem.id);
    
    if (existingIndex >= 0) {
      // Actualizar existente
      const updated = [...array];
      updated[existingIndex] = { ...updated[existingIndex], ...newItem };
      return updated;
    } else {
      // Agregar nuevo y mantener límite de 100 items
      return [newItem, ...array.slice(0, 99)];
    }
  }, []);

  /**
   * Función para agregar listener de eventos personalizados
   * @param {string} eventType - Tipo de evento
   * @param {function} listener - Función listener
   */
  const addEventListener = useCallback((eventType, listener) => {
    const listeners = eventListenersRef.current.get(eventType) || [];
    listeners.push(listener);
    eventListenersRef.current.set(eventType, listeners);

    // Retornar función para remover el listener
    return () => {
      const currentListeners = eventListenersRef.current.get(eventType) || [];
      const updatedListeners = currentListeners.filter(l => l !== listener);
      
      if (updatedListeners.length === 0) {
        eventListenersRef.current.delete(eventType);
      } else {
        eventListenersRef.current.set(eventType, updatedListeners);
      }
    };
  }, []);

  /**
   * Función para enviar comando específico de bovino
   * @param {string} bovineId - ID del bovino
   * @param {string} command - Comando a enviar
   * @param {Object} params - Parámetros adicionales
   */
  const sendBovineCommand = useCallback((bovineId, command, params = {}) => {
    return send({
      type: 'BOVINE_COMMAND',
      bovineId,
      command,
      params,
      timestamp: Date.now()
    });
  }, [send]);

  /**
   * Función para solicitar datos en tiempo real
   * @param {string} dataType - Tipo de datos ('bovines', 'health', 'production', 'locations')
   * @param {Object} filters - Filtros aplicar
   */
  const requestLiveData = useCallback((dataType, filters = {}) => {
    return send({
      type: 'REQUEST_LIVE_DATA',
      dataType,
      filters,
      timestamp: Date.now()
    });
  }, [send]);

  // Conectar automáticamente si está habilitado y hay usuario autenticado
  useEffect(() => {
    if (autoConnect && isAuthenticated) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, isAuthenticated, connect, disconnect]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      stopHeartbeat();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [stopHeartbeat]);

  return {
    // Estados de conexión
    isConnected,
    isConnecting,
    connectionError,
    connectionAttempts,
    
    // Datos en tiempo real
    lastMessage,
    onlineUsers,
    liveUpdates,
    
    // Acciones principales
    connect,
    disconnect,
    send,
    
    // Gestión de eventos
    addEventListener,
    
    // Comandos específicos
    sendBovineCommand,
    requestLiveData,
    
    // Información de estado
    readyState: wsRef.current?.readyState || WebSocket.CLOSED,
    isOpen: wsRef.current?.readyState === WebSocket.OPEN,
    isClosing: wsRef.current?.readyState === WebSocket.CLOSING,
    
    // Estadísticas
    queuedMessages: messageQueueRef.current.length,
    totalOnlineUsers: onlineUsers.length,
    
    // Utilidades
    clearConnectionError: () => setConnectionError(null),
    clearMessageQueue: () => { messageQueueRef.current = []; },
    
    // Configuración actual
    config: {
      url: getWebSocketUrl(),
      autoConnect,
      autoReconnect,
      maxReconnectAttempts,
      reconnectInterval,
      heartbeatInterval,
      enableHeartbeat
    }
  };
};

export default useWebSocket;