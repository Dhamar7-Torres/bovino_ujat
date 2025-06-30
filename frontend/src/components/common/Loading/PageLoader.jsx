// Componente de carga para páginas con múltiples variantes y animaciones

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Cow, 
  Heart, 
  BarChart3,
  TrendingUp,
  Calendar,
  CheckCircle,
  Wifi,
  WifiOff
} from 'lucide-react';

const PageLoader = ({ 
  variant = 'default',
  size = 'medium',
  message = 'Cargando...',
  submessage = '',
  progress = null,
  showProgress = false,
  showTips = false,
  timeout = 30000,
  onTimeout = null,
  className = '',
  fullScreen = true,
  transparent = false,
  animated = true,
  customIcon = null,
  loadingSteps = []
}) => {
  
  // Estados para el control del loader
  const [currentTip, setCurrentTip] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showTimeout, setShowTimeout] = useState(false);

  // Tips útiles para mostrar durante la carga
  const tips = [
    "💡 Tip: Usa Ctrl+K para búsqueda rápida en cualquier página",
    "🐄 Dato: Un bovino adulto puede producir hasta 25 litros de leche por día",
    "📊 Tip: Los reportes se actualizan automáticamente cada 5 minutos",
    "🔔 Tip: Configura notificaciones para no perder vacunaciones importantes",
    "📱 Tip: La aplicación funciona offline para consultas básicas",
    "⚡ Tip: Usa atajos de teclado para navegar más rápido",
    "🎯 Dato: El seguimiento regular mejora la productividad hasta un 30%",
    "🛡️ Tip: Los datos se respaldan automáticamente cada hora"
  ];

  // Configuraciones de variantes
  const variants = {
    default: {
      icon: Loader2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      spinnerColor: 'border-blue-600'
    },
    cattle: {
      icon: Cow,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      spinnerColor: 'border-green-600'
    },
    health: {
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      spinnerColor: 'border-red-600'
    },
    analytics: {
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      spinnerColor: 'border-purple-600'
    },
    production: {
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      spinnerColor: 'border-orange-600'
    },
    calendar: {
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      spinnerColor: 'border-indigo-600'
    }
  };

  // Configuraciones de tamaño
  const sizes = {
    small: {
      spinner: 'w-6 h-6',
      icon: 'w-8 h-8',
      text: 'text-sm',
      container: 'p-4'
    },
    medium: {
      spinner: 'w-8 h-8',
      icon: 'w-12 h-12',
      text: 'text-base',
      container: 'p-6'
    },
    large: {
      spinner: 'w-12 h-12',
      icon: 'w-16 h-16',
      text: 'text-lg',
      container: 'p-8'
    }
  };

  const currentVariant = variants[variant] || variants.default;
  const currentSize = sizes[size] || sizes.medium;
  const IconComponent = customIcon || currentVariant.icon;

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const spinnerVariants = {
    spin: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const progressVariants = {
    hidden: { width: "0%" },
    visible: { 
      width: `${progress}%`,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Efectos
  useEffect(() => {
    // Rotar tips cada 3 segundos
    if (showTips) {
      const tipInterval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % tips.length);
      }, 3000);
      return () => clearInterval(tipInterval);
    }
  }, [showTips, tips.length]);

  useEffect(() => {
    // Cambiar pasos de carga
    if (loadingSteps.length > 0) {
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2000);
      return () => clearInterval(stepInterval);
    }
  }, [loadingSteps]);

  useEffect(() => {
    // Contador de tiempo transcurrido
    const timeInterval = setInterval(() => {
      setTimeElapsed(prev => prev + 1000);
    }, 1000);

    // Timeout handling
    if (timeout) {
      const timeoutTimer = setTimeout(() => {
        setShowTimeout(true);
        if (onTimeout) {
          onTimeout();
        }
      }, timeout);
      
      return () => {
        clearInterval(timeInterval);
        clearTimeout(timeoutTimer);
      };
    }

    return () => clearInterval(timeInterval);
  }, [timeout, onTimeout]);

  useEffect(() => {
    // Detectar cambios en conectividad
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Función para formatear el tiempo transcurrido
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Función para obtener el color del progreso
  const getProgressColor = () => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Renderizar el spinner principal
  const renderSpinner = () => {
    if (animated) {
      return (
        <motion.div
          variants={spinnerVariants}
          animate="spin"
          className={`${currentSize.spinner} border-4 border-gray-200 border-t-transparent rounded-full ${currentVariant.spinnerColor}`}
        />
      );
    }
    
    return (
      <motion.div
        variants={pulseVariants}
        animate="pulse"
        className={`${currentSize.icon} ${currentVariant.color}`}
      >
        <IconComponent className="w-full h-full" />
      </motion.div>
    );
  };

  // Renderizar contenido principal
  const renderMainContent = () => (
    <motion.div 
      variants={itemVariants}
      className="text-center space-y-4"
    >
      {/* Spinner o ícono */}
      <div className="flex justify-center">
        {renderSpinner()}
      </div>

      {/* Mensaje principal */}
      <div className="space-y-2">
        <h3 className={`font-semibold text-gray-900 ${currentSize.text}`}>
          {message}
        </h3>
        {submessage && (
          <p className="text-sm text-gray-600">
            {submessage}
          </p>
        )}
      </div>

      {/* Pasos de carga */}
      {loadingSteps.length > 0 && (
        <div className="space-y-2">
          {loadingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.3 }}
              animate={{ 
                opacity: index <= currentStep ? 1 : 0.3,
                scale: index === currentStep ? 1.05 : 1
              }}
              className="flex items-center justify-center space-x-2 text-sm"
            >
              {index < currentStep ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : index === currentStep ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-4 h-4 text-blue-500" />
                </motion.div>
              ) : (
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
              )}
              <span className={index <= currentStep ? 'text-gray-900' : 'text-gray-500'}>
                {step}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Barra de progreso */}
      {showProgress && progress !== null && (
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progreso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              variants={progressVariants}
              initial="hidden"
              animate="visible"
              className={`h-2 rounded-full ${getProgressColor()}`}
            />
          </div>
        </motion.div>
      )}

      {/* Tips útiles */}
      {showTips && (
        <motion.div 
          variants={itemVariants}
          className={`${currentVariant.bgColor} rounded-lg p-3 max-w-md mx-auto`}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-gray-700"
            >
              {tips[currentTip]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      )}

      {/* Información adicional */}
      <motion.div 
        variants={itemVariants}
        className="flex items-center justify-center space-x-4 text-xs text-gray-500"
      >
        {/* Estado de conexión */}
        <div className="flex items-center space-x-1">
          {isOnline ? (
            <Wifi className="w-3 h-3 text-green-500" />
          ) : (
            <WifiOff className="w-3 h-3 text-red-500" />
          )}
          <span>{isOnline ? 'En línea' : 'Sin conexión'}</span>
        </div>

        {/* Tiempo transcurrido */}
        <span>•</span>
        <span>{formatTime(timeElapsed)}</span>
      </motion.div>

      {/* Mensaje de timeout */}
      {showTimeout && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800"
        >
          <p className="font-medium">La carga está tomando más tiempo del esperado</p>
          <p className="mt-1">Verifica tu conexión a internet o intenta recargar la página.</p>
        </motion.div>
      )}
    </motion.div>
  );

  // Renderizar container basado en configuración
  const containerClasses = `
    ${fullScreen 
      ? 'fixed inset-0 z-50 flex items-center justify-center' 
      : 'flex items-center justify-center w-full h-full'
    }
    ${transparent 
      ? 'bg-white bg-opacity-80 backdrop-blur-sm' 
      : 'bg-white'
    }
    ${className}
  `;

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={containerClasses}
      >
        <div className={`${currentSize.container} max-w-md w-full mx-4`}>
          {renderMainContent()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageLoader;