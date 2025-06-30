/**
 * Loading.jsx - Componente de carga animado para el sistema de gestión de bovinos
 * Incluye múltiples variantes de loading con animaciones y estados personalizados
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Cow, 
  Heart, 
  Activity,
  Zap,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const Loading = ({ 
  message = "Cargando...", 
  type = "default",
  size = "medium",
  showProgress = false,
  progress = 0,
  timeout = null,
  onTimeout = null,
  className = "",
  overlay = false,
  variant = "spinner"
}) => {
  // Estados para control del componente
  const [currentMessage, setCurrentMessage] = useState(message);
  const [animationState, setAnimationState] = useState('loading');
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  // Mensajes dinámicos para diferentes contextos del sistema ganadero
  const loadingMessages = {
    bovines: [
      "Cargando información del ganado...",
      "Verificando estado de los bovinos...",
      "Actualizando datos de la granja..."
    ],
    health: [
      "Revisando registros de salud...",
      "Analizando datos veterinarios...",
      "Procesando historial médico..."
    ],
    production: [
      "Calculando métricas de producción...",
      "Analizando rendimiento lechero...",
      "Procesando datos de productividad..."
    ],
    reports: [
      "Generando reporte...",
      "Compilando estadísticas...",
      "Preparando análisis de datos..."
    ],
    default: [
      "Cargando datos...",
      "Procesando información...",
      "Un momento, por favor..."
    ]
  };

  // Configuración de tamaños
  const sizeConfig = {
    small: {
      icon: 20,
      container: "w-8 h-8",
      text: "text-sm",
      spacing: "gap-2"
    },
    medium: {
      icon: 32,
      container: "w-12 h-12",
      text: "text-base",
      spacing: "gap-3"
    },
    large: {
      icon: 48,
      container: "w-16 h-16",
      text: "text-lg",
      spacing: "gap-4"
    },
    xlarge: {
      icon: 64,
      container: "w-20 h-20",
      text: "text-xl",
      spacing: "gap-5"
    }
  };

  // Configuración de variantes de animación
  const animations = {
    spinner: {
      rotate: {
        rotate: 360,
        transition: { duration: 1, ease: "linear", repeat: Infinity }
      }
    },
    pulse: {
      scale: {
        scale: [1, 1.2, 1],
        transition: { duration: 1.5, ease: "easeInOut", repeat: Infinity }
      }
    },
    bounce: {
      y: {
        y: [0, -10, 0],
        transition: { duration: 1, ease: "easeInOut", repeat: Infinity }
      }
    },
    wave: {
      scale: {
        scale: [1, 1.1, 1],
        transition: { duration: 0.8, ease: "easeInOut", repeat: Infinity, delay: 0.1 }
      }
    }
  };

  // Efectos para manejo de timeout y mensajes dinámicos
  useEffect(() => {
    let messageInterval;
    let timeoutTimer;

    // Configurar timeout si se especifica
    if (timeout && onTimeout) {
      timeoutTimer = setTimeout(() => {
        setShowTimeoutWarning(true);
        setTimeout(() => {
          onTimeout();
        }, 3000); // 3 segundos de advertencia antes del timeout
      }, timeout);
    }

    // Rotar mensajes dinámicamente según el tipo
    if (type in loadingMessages) {
      const messages = loadingMessages[type];
      let messageIndex = 0;
      
      messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        setCurrentMessage(messages[messageIndex]);
      }, 3000); // Cambiar mensaje cada 3 segundos
    }

    return () => {
      if (messageInterval) clearInterval(messageInterval);
      if (timeoutTimer) clearTimeout(timeoutTimer);
    };
  }, [type, timeout, onTimeout]);

  // Obtener configuración de tamaño
  const config = sizeConfig[size];

  // Renderizar spinner básico
  const renderSpinner = () => (
    <motion.div
      className={`${config.container} flex items-center justify-center`}
      variants={animations[variant]}
      animate={Object.keys(animations[variant])[0]}
    >
      <Loader2 
        size={config.icon} 
        className="text-blue-600 dark:text-blue-400" 
      />
    </motion.div>
  );

  // Renderizar icono temático del sistema ganadero
  const renderThematicIcon = () => {
    const iconConfig = {
      bovines: Cow,
      health: Heart,
      production: Activity,
      reports: BarChart3,
      default: Zap
    };

    const IconComponent = iconConfig[type] || iconConfig.default;

    return (
      <motion.div
        className={`${config.container} flex items-center justify-center`}
        variants={animations[variant]}
        animate={Object.keys(animations[variant])[0]}
      >
        <IconComponent 
          size={config.icon} 
          className="text-green-600 dark:text-green-400" 
        />
      </motion.div>
    );
  };

  // Renderizar indicador de progreso
  const renderProgressBar = () => (
    <div className="w-full max-w-md">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span>Progreso</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <motion.div
          className="bg-blue-600 h-2 rounded-full dark:bg-blue-400"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );

  // Renderizar dots animados
  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-blue-600 rounded-full dark:bg-blue-400"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  );

  // Renderizar skeleton loader para datos
  const renderSkeleton = () => (
    <div className="w-full max-w-md space-y-3">
      {[1, 2, 3].map((index) => (
        <div key={index} className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-10 w-10 dark:bg-gray-600" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 dark:bg-gray-600" />
            <div className="h-4 bg-gray-300 rounded w-1/2 dark:bg-gray-600" />
          </div>
        </div>
      ))}
    </div>
  );

  // Renderizar loader con círculos concéntricos
  const renderCircles = () => (
    <div className="relative">
      {[1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className={`absolute border-4 border-blue-200 border-t-blue-600 rounded-full dark:border-blue-800 dark:border-t-blue-400`}
          style={{
            width: config.icon + (index * 8),
            height: config.icon + (index * 8),
            top: -(index * 4),
            left: -(index * 4)
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 2 - (index * 0.3),
            ease: "linear",
            repeat: Infinity
          }}
        />
      ))}
    </div>
  );

  // Configuración de variantes según el tipo de loader
  const loaderVariants = {
    default: renderSpinner,
    spinner: renderSpinner,
    thematic: renderThematicIcon,
    dots: renderDots,
    skeleton: renderSkeleton,
    circles: renderCircles
  };

  // Componente principal de loading
  const LoadingContent = () => (
    <motion.div
      className={`flex flex-col items-center justify-center ${config.spacing} ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      {/* Renderizar el loader apropiado */}
      {loaderVariants[variant] ? loaderVariants[variant]() : renderSpinner()}

      {/* Mensaje de carga */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMessage}
          className={`text-center ${config.text} text-gray-700 dark:text-gray-300`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {currentMessage}
        </motion.div>
      </AnimatePresence>

      {/* Barra de progreso si está habilitada */}
      {showProgress && progress >= 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {renderProgressBar()}
        </motion.div>
      )}

      {/* Advertencia de timeout */}
      <AnimatePresence>
        {showTimeoutWarning && (
          <motion.div
            className="flex items-center gap-2 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Clock size={16} />
            <span className="text-sm">
              La carga está tomando más tiempo del esperado...
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // Renderizar con overlay si se especifica
  if (overlay) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl">
          <LoadingContent />
        </div>
      </motion.div>
    );
  }

  // Renderizar contenido normal
  return <LoadingContent />;
};

// Componente especializado para carga de página completa
export const FullPageLoading = ({ message = "Iniciando sistema...", progress }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
    <div className="text-center space-y-8">
      {/* Logo animado del sistema */}
      <motion.div
        className="flex justify-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Cow size={40} className="text-white" />
        </div>
      </motion.div>

      {/* Título del sistema */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Sistema de Gestión de Bovinos
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tecnología avanzada para ganaderos modernos
        </p>
      </motion.div>

      {/* Componente de loading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Loading
          message={message}
          variant="circles"
          size="large"
          showProgress={progress !== undefined}
          progress={progress}
          type="bovines"
        />
      </motion.div>

      {/* Información adicional */}
      <motion.div
        className="text-sm text-gray-500 dark:text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>Preparando tu experiencia de gestión ganadera...</p>
      </motion.div>
    </div>
  </div>
);

// Componente de loading para tablas de datos
export const TableLoading = ({ rows = 5, columns = 4 }) => (
  <div className="w-full space-y-3 animate-pulse">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div
            key={colIndex}
            className="h-4 bg-gray-200 rounded dark:bg-gray-700 flex-1"
            style={{
              animationDelay: `${(rowIndex * columns + colIndex) * 0.1}s`
            }}
          />
        ))}
      </div>
    ))}
  </div>
);

// Componente de loading para cards
export const CardLoading = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-lg dark:bg-gray-600" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 dark:bg-gray-600" />
            <div className="h-3 bg-gray-200 rounded w-1/2 dark:bg-gray-600" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded dark:bg-gray-600" />
          <div className="h-3 bg-gray-200 rounded w-5/6 dark:bg-gray-600" />
        </div>
      </div>
    ))}
  </div>
);

// Hook personalizado para manejar estados de loading
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingMessage, setLoadingMessage] = useState("Cargando...");
  const [progress, setProgress] = useState(0);

  const startLoading = (message = "Cargando...") => {
    setIsLoading(true);
    setLoadingMessage(message);
    setProgress(0);
  };

  const updateProgress = (newProgress, message) => {
    setProgress(newProgress);
    if (message) setLoadingMessage(message);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setProgress(0);
  };

  return {
    isLoading,
    loadingMessage,
    progress,
    startLoading,
    updateProgress,
    stopLoading
  };
};

export default Loading;