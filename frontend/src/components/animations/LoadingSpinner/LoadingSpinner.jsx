import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cow, Loader2, RotateCw, Heart, Zap, Circle } from 'lucide-react';

const LoadingSpinner = ({ 
  variant = 'default', // 'default', 'dots', 'pulse', 'bounce', 'fade', 'cow', 'bars', 'ring'
  size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl'
  color = 'primary', // 'primary', 'secondary', 'success', 'warning', 'danger', 'white'
  speed = 'normal', // 'slow', 'normal', 'fast'
  overlay = false,
  overlayOpacity = 0.8,
  text = '',
  textPosition = 'bottom', // 'top', 'bottom', 'right', 'left'
  className = '',
  show = true,
  fullScreen = false,
  backgroundColor = 'transparent',
  ...props
}) => {

  // Configuraciones de tamaño
  const sizeConfig = {
    xs: { width: 16, height: 16, text: 'text-xs' },
    sm: { width: 24, height: 24, text: 'text-sm' },
    md: { width: 32, height: 32, text: 'text-base' },
    lg: { width: 48, height: 48, text: 'text-lg' },
    xl: { width: 64, height: 64, text: 'text-xl' }
  };

  // Configuraciones de color
  const colorConfig = {
    primary: 'text-green-600 border-green-600',
    secondary: 'text-gray-600 border-gray-600',
    success: 'text-emerald-600 border-emerald-600',
    warning: 'text-yellow-600 border-yellow-600',
    danger: 'text-red-600 border-red-600',
    white: 'text-white border-white'
  };

  // Configuraciones de velocidad
  const speedConfig = {
    slow: 2,
    normal: 1,
    fast: 0.5
  };

  const currentSize = sizeConfig[size];
  const currentColor = colorConfig[color];
  const currentSpeed = speedConfig[speed];

  // Variantes de animación para el spinner por defecto
  const defaultSpinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: currentSpeed,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // Variantes para dots spinner
  const dotsVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const dotVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: currentSpeed,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Variantes para pulse spinner
  const pulseVariants = {
    animate: {
      scale: [1, 1.3, 1],
      opacity: [1, 0.7, 1],
      transition: {
        duration: currentSpeed,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Variantes para bounce spinner
  const bounceVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: currentSpeed * 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Variantes para fade spinner
  const fadeVariants = {
    animate: {
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: currentSpeed,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Variantes para el spinner de vaca
  const cowVariants = {
    animate: {
      rotate: [0, 10, -10, 0],
      transition: {
        duration: currentSpeed * 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Variantes para barras
  const barsVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const barVariants = {
    animate: {
      scaleY: [1, 2, 1],
      transition: {
        duration: currentSpeed * 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Variantes para ring spinner
  const ringVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: currentSpeed,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // Función para renderizar el spinner según la variante
  const renderSpinner = () => {
    const baseClasses = `inline-block ${currentColor}`;
    
    switch (variant) {
      case 'dots':
        return (
          <motion.div
            variants={dotsVariants}
            animate="animate"
            className={`flex space-x-1 ${baseClasses}`}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                variants={dotVariants}
                className={`w-2 h-2 bg-current rounded-full`}
                style={{
                  width: currentSize.width / 4,
                  height: currentSize.width / 4
                }}
              />
            ))}
          </motion.div>
        );

      case 'pulse':
        return (
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className={`rounded-full border-2 border-current ${baseClasses}`}
            style={{
              width: currentSize.width,
              height: currentSize.height
            }}
          />
        );

      case 'bounce':
        return (
          <motion.div
            variants={bounceVariants}
            animate="animate"
            className={`w-4 h-4 bg-current rounded-full ${baseClasses}`}
            style={{
              width: currentSize.width / 2,
              height: currentSize.width / 2
            }}
          />
        );

      case 'fade':
        return (
          <motion.div
            variants={fadeVariants}
            animate="animate"
            className={`rounded-full bg-current ${baseClasses}`}
            style={{
              width: currentSize.width,
              height: currentSize.height
            }}
          />
        );

      case 'cow':
        return (
          <motion.div
            variants={cowVariants}
            animate="animate"
            className={baseClasses}
          >
            <Cow 
              size={currentSize.width} 
              className="drop-shadow-sm"
            />
            <motion.div
              className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        );

      case 'bars':
        return (
          <motion.div
            variants={barsVariants}
            animate="animate"
            className={`flex items-end space-x-1 ${baseClasses}`}
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                variants={barVariants}
                className="bg-current rounded-sm"
                style={{
                  width: currentSize.width / 6,
                  height: currentSize.height / 3,
                  transformOrigin: 'bottom'
                }}
              />
            ))}
          </motion.div>
        );

      case 'ring':
        return (
          <motion.div
            variants={ringVariants}
            animate="animate"
            className={`rounded-full border-2 border-transparent border-t-current ${baseClasses}`}
            style={{
              width: currentSize.width,
              height: currentSize.height
            }}
          />
        );

      default:
        return (
          <motion.div
            variants={defaultSpinnerVariants}
            animate="animate"
            className={baseClasses}
          >
            <Loader2 size={currentSize.width} />
          </motion.div>
        );
    }
  };

  // Función para renderizar el texto
  const renderText = () => {
    if (!text) return null;

    const textClasses = `${currentSize.text} ${currentColor} font-medium`;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={textClasses}
      >
        {text}
      </motion.div>
    );
  };

  // Configuración del layout según la posición del texto
  const getLayoutClasses = () => {
    if (!text) return 'flex items-center justify-center';
    
    switch (textPosition) {
      case 'top':
        return 'flex flex-col items-center space-y-2';
      case 'bottom':
        return 'flex flex-col items-center space-y-2';
      case 'left':
        return 'flex items-center space-x-3';
      case 'right':
        return 'flex items-center space-x-3';
      default:
        return 'flex flex-col items-center space-y-2';
    }
  };

  // Ordenar elementos según la posición del texto
  const renderContent = () => {
    const spinner = renderSpinner();
    const textElement = renderText();
    
    if (!text) return spinner;
    
    if (textPosition === 'top' || textPosition === 'left') {
      return (
        <>
          {textElement}
          {spinner}
        </>
      );
    }
    
    return (
      <>
        {spinner}
        {textElement}
      </>
    );
  };

  // Componente principal del spinner
  const SpinnerContent = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className={`${getLayoutClasses()} ${className}`}
      {...props}
    >
      {renderContent()}
    </motion.div>
  );

  // Si fullScreen está activo
  if (fullScreen) {
    return (
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor }}
          >
            <SpinnerContent />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Si overlay está activo
  if (overlay) {
    return (
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center"
            style={{ 
              backgroundColor: `rgba(255, 255, 255, ${overlayOpacity})`
            }}
          >
            <SpinnerContent />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Spinner normal
  return (
    <AnimatePresence>
      {show && <SpinnerContent />}
    </AnimatePresence>
  );
};

// Componente especializado para carga de página
export const PageLoader = ({ 
  text = "Cargando sistema ganadero...",
  show = true 
}) => (
  <LoadingSpinner
    variant="cow"
    size="lg"
    color="primary"
    speed="normal"
    fullScreen
    text={text}
    textPosition="bottom"
    backgroundColor="rgba(255, 255, 255, 0.95)"
    show={show}
  />
);

// Componente para botones con carga
export const ButtonSpinner = ({ 
  loading = false,
  children,
  loadingText = "Cargando...",
  variant = "default",
  size = "sm",
  ...buttonProps 
}) => (
  <button 
    disabled={loading}
    className={`relative ${loading ? 'cursor-not-allowed opacity-75' : ''}`}
    {...buttonProps}
  >
    <span className={loading ? 'invisible' : 'visible'}>
      {children}
    </span>
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner
          variant={variant}
          size={size}
          color="white"
          text={loadingText}
          textPosition="right"
        />
      </div>
    )}
  </button>
);

// Hook para manejar estados de carga
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);
  
  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);
  const toggleLoading = () => setIsLoading(prev => !prev);
  
  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setLoading: setIsLoading
  };
};

export default LoadingSpinner;