import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  X, 
  Bell, 
  Clock, 
  MapPin, 
  User, 
  Calendar,
  ChevronRight,
  Eye,
  Trash2,
  Settings,
  Volume2,
  VolumeX,
  Star,
  Heart,
  Zap,
  Shield,
  Activity,
  TrendingUp,
  TrendingDown,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  Cow,
  Syringe,
  Stethoscope,
  Baby,
  Scale,
  Target
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';

const AlertCard = ({ 
  alert,
  onView,
  onDismiss,
  onMarkAsRead,
  onSnooze,
  showActions = true,
  showTimestamp = true,
  interactive = true,
  size = 'default', // 'compact', 'default', 'expanded'
  variant = 'default', // 'default', 'minimal', 'detailed'
  className = "",
  ...props
}) => {
  
  // Estados para la interacción
  const [isRead, setIsRead] = useState(alert?.isRead || false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(alert?.isMuted || false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Animaciones de Framer Motion
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      x: 100,
      transition: {
        duration: 0.2
      }
    }
  };

  const iconVariants = {
    idle: { 
      scale: 1,
      rotate: 0 
    },
    active: { 
      scale: 1.1,
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 2
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Función para obtener el ícono según el tipo de alerta
  const getAlertIcon = (type, category) => {
    // Íconos por categoría específica
    const categoryIcons = {
      // Salud
      health_critical: Stethoscope,
      health_vaccination: Syringe,
      health_checkup: Activity,
      health_treatment: Heart,
      
      // Reproducción
      reproduction_birth: Baby,
      reproduction_pregnancy: Heart,
      reproduction_breeding: Target,
      
      // Producción
      production_milk: Droplets,
      production_weight: Scale,
      production_feed: Target,
      
      // Clima
      weather_storm: CloudRain,
      weather_heat: Sun,
      weather_cold: Thermometer,
      weather_wind: Wind,
      
      // Sistema
      system_equipment: Settings,
      system_maintenance: Settings,
      system_connectivity: Zap,
      
      // Seguridad
      security_breach: Shield,
      security_access: User,
      security_perimeter: MapPin
    };

    // Íconos por tipo general
    const typeIcons = {
      critical: AlertTriangle,
      warning: AlertCircle,
      info: Info,
      success: CheckCircle,
      urgent: Bell,
      high: TrendingUp,
      medium: Activity,
      low: TrendingDown
    };

    // Buscar por categoría específica primero
    const categoryKey = `${category}_${type}`;
    if (categoryIcons[categoryKey]) {
      return categoryIcons[categoryKey];
    }

    // Buscar por categoría general
    if (categoryIcons[category]) {
      return categoryIcons[category];
    }

    // Buscar por tipo
    if (typeIcons[type]) {
      return typeIcons[type];
    }

    // Por defecto
    return AlertCircle;
  };

  // Función para obtener los colores según el tipo
  const getAlertColors = (type, severity) => {
    const colorSchemes = {
      critical: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        iconBg: 'bg-red-100',
        title: 'text-red-900',
        description: 'text-red-700',
        accent: 'bg-red-500'
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: 'text-yellow-600',
        iconBg: 'bg-yellow-100',
        title: 'text-yellow-900',
        description: 'text-yellow-700',
        accent: 'bg-yellow-500'
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        iconBg: 'bg-blue-100',
        title: 'text-blue-900',
        description: 'text-blue-700',
        accent: 'bg-blue-500'
      },
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        iconBg: 'bg-green-100',
        title: 'text-green-900',
        description: 'text-green-700',
        accent: 'bg-green-500'
      },
      urgent: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        iconBg: 'bg-purple-100',
        title: 'text-purple-900',
        description: 'text-purple-700',
        accent: 'bg-purple-500'
      }
    };

    return colorSchemes[type] || colorSchemes.info;
  };

  // Función para obtener el tamaño de la tarjeta
  const getSizeClasses = () => {
    const sizeClasses = {
      compact: 'p-3',
      default: 'p-4',
      expanded: 'p-6'
    };
    return sizeClasses[size] || sizeClasses.default;
  };

  // Manejar acciones
  const handleView = () => {
    if (!isRead) {
      setIsRead(true);
      if (onMarkAsRead) onMarkAsRead(alert.id);
    }
    if (onView) onView(alert);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setTimeout(() => {
      if (onDismiss) onDismiss(alert.id);
    }, 200);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSnooze = () => {
    if (onSnooze) onSnooze(alert.id);
  };

  // Obtener íconos y colores
  const AlertIconComponent = getAlertIcon(alert.type, alert.category);
  const colors = getAlertColors(alert.type, alert.severity);

  // Función para formatear el tiempo relativo
  const getTimeAgo = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true, 
      locale: es 
    });
  };

  // No renderizar si está descartada
  if (isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover={interactive ? { scale: 1.02 } : {}}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`
          ${colors.bg} ${colors.border} border rounded-xl transition-all duration-200 cursor-pointer
          ${!isRead ? 'shadow-md' : 'shadow-sm'}
          ${isHovered && interactive ? 'shadow-lg' : ''}
          ${getSizeClasses()}
          ${className}
        `}
        onClick={interactive ? handleView : undefined}
        {...props}
      >
        {/* Indicador de no leído */}
        {!isRead && (
          <motion.div
            variants={pulseVariants}
            animate="pulse"
            className={`absolute -top-1 -right-1 w-3 h-3 ${colors.accent} rounded-full`}
          />
        )}

        <div className="flex items-start space-x-3">
          {/* Ícono de la alerta */}
          <motion.div
            variants={iconVariants}
            animate={alert.type === 'critical' || alert.type === 'urgent' ? 'active' : 'idle'}
            className={`
              flex-shrink-0 w-10 h-10 ${colors.iconBg} rounded-full flex items-center justify-center
              ${size === 'compact' ? 'w-8 h-8' : size === 'expanded' ? 'w-12 h-12' : 'w-10 h-10'}
            `}
          >
            <AlertIconComponent className={`${colors.icon} ${
              size === 'compact' ? 'w-4 h-4' : size === 'expanded' ? 'w-6 h-6' : 'w-5 h-5'
            }`} />
          </motion.div>

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-2">
                {/* Título y prioridad */}
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className={`${colors.title} font-semibold ${
                    size === 'compact' ? 'text-sm' : 'text-base'
                  } truncate`}>
                    {alert.title}
                  </h3>
                  
                  {/* Badge de prioridad */}
                  {alert.priority && variant !== 'minimal' && (
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${alert.priority === 'high' ? 'bg-red-100 text-red-700' :
                        alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }
                    `}>
                      {alert.priority}
                    </span>
                  )}

                  {/* Indicador de silenciado */}
                  {isMuted && (
                    <VolumeX className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {/* Descripción */}
                <p className={`${colors.description} ${
                  size === 'compact' ? 'text-xs' : 'text-sm'
                } ${isExpanded ? '' : 'line-clamp-2'}`}>
                  {alert.description}
                </p>

                {/* Información adicional en modo expandido */}
                {(size === 'expanded' || isExpanded) && variant === 'detailed' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 space-y-2"
                  >
                    {/* Ubicación */}
                    {alert.location && (
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{alert.location}</span>
                      </div>
                    )}

                    {/* Animal afectado */}
                    {alert.animalId && (
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <Cow className="w-3 h-3" />
                        <span>Animal: {alert.animalId}</span>
                      </div>
                    )}

                    {/* Responsable */}
                    {alert.assignedTo && (
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <User className="w-3 h-3" />
                        <span>Asignado a: {alert.assignedTo}</span>
                      </div>
                    )}

                    {/* Datos adicionales */}
                    {alert.data && Object.keys(alert.data).length > 0 && (
                      <div className="bg-white bg-opacity-50 rounded-lg p-2 mt-2">
                        {Object.entries(alert.data).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-gray-600 capitalize">{key}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Footer con timestamp */}
                {showTimestamp && (
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{getTimeAgo(alert.timestamp)}</span>
                      </div>
                      
                      {alert.category && variant !== 'minimal' && (
                        <span className="capitalize">{alert.category.replace('_', ' ')}</span>
                      )}
                    </div>

                    {/* Indicador de expansión */}
                    {variant === 'detailed' && alert.description && alert.description.length > 100 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(!isExpanded);
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                      >
                        {isExpanded ? 'Menos' : 'Más'}
                        <ChevronRight className={`w-3 h-3 ml-1 transform transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Acciones */}
              {showActions && interactive && isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col space-y-1"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView();
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleMute();
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title={isMuted ? "Activar sonido" : "Silenciar"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {alert.canSnooze && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSnooze();
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Posponer"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDismiss();
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Descartar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Barra de progreso para alertas con tiempo límite */}
        {alert.deadline && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Tiempo límite</span>
              <span>{format(new Date(alert.deadline), 'dd/MM/yyyy HH:mm')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <motion.div
                className={`h-1.5 rounded-full ${
                  alert.urgencyLevel === 'high' ? 'bg-red-500' :
                  alert.urgencyLevel === 'medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${alert.timeRemaining || 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Componente contenedor para múltiples alertas
export const AlertList = ({ 
  alerts = [], 
  onView, 
  onDismiss, 
  onMarkAsRead,
  onSnooze,
  maxDisplay = 5,
  showAll = false,
  className = ""
}) => {
  const [displayCount, setDisplayCount] = useState(maxDisplay);
  
  const visibleAlerts = showAll ? alerts : alerts.slice(0, displayCount);
  const hasMore = alerts.length > displayCount;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`space-y-3 ${className}`}
    >
      {visibleAlerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          onView={onView}
          onDismiss={onDismiss}
          onMarkAsRead={onMarkAsRead}
          onSnooze={onSnooze}
        />
      ))}
      
      {hasMore && !showAll && (
        <motion.button
          onClick={() => setDisplayCount(alerts.length)}
          className="w-full p-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg border border-dashed border-gray-300 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Ver {alerts.length - displayCount} alertas más
        </motion.button>
      )}
    </motion.div>
  );
};

// Hook para manejar alertas
export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addAlert = (alert) => {
    const newAlert = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isRead: false,
      isMuted: false,
      ...alert
    };
    setAlerts(prev => [newAlert, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
    setUnreadCount(0);
  };

  const clearAll = () => {
    setAlerts([]);
    setUnreadCount(0);
  };

  return {
    alerts,
    unreadCount,
    addAlert,
    markAsRead,
    dismissAlert,
    markAllAsRead,
    clearAll
  };
};

export default AlertCard;