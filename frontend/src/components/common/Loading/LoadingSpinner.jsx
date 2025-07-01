import React from 'react'
import { motion } from 'framer-motion'

// Componente de spinner animado con Framer Motion
const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Cargando...', 
  showMessage = true,
  variant = 'primary',
  fullScreen = true 
}) => {
  // Configuración de tamaños
  const sizeConfig = {
    small: {
      spinner: 'w-6 h-6',
      text: 'text-sm',
      container: 'p-4'
    },
    medium: {
      spinner: 'w-8 h-8',
      text: 'text-base',
      container: 'p-6'
    },
    large: {
      spinner: 'w-12 h-12',
      text: 'text-lg',
      container: 'p-8'
    }
  }

  // Configuración de colores/variantes
  const variantConfig = {
    primary: {
      spinner: 'text-blue-600',
      text: 'text-gray-700 dark:text-gray-300',
      bg: 'bg-white/80 dark:bg-gray-900/80'
    },
    secondary: {
      spinner: 'text-gray-600',
      text: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-100/80 dark:bg-gray-800/80'
    },
    success: {
      spinner: 'text-green-600',
      text: 'text-gray-700 dark:text-gray-300',
      bg: 'bg-white/80 dark:bg-gray-900/80'
    }
  }

  const currentSize = sizeConfig[size]
  const currentVariant = variantConfig[variant]

  // Animaciones del spinner
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  // Animaciones de los puntos (si se usan)
  const dotsVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  // Animaciones del contenedor
  const containerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  }

  // Spinner SVG personalizado
  const SpinnerIcon = () => (
    <motion.div
      variants={spinnerVariants}
      animate="animate"
      className={`${currentSize.spinner} ${currentVariant.spinner}`}
    >
      <svg
        className="w-full h-full"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  )

  // Spinner con puntos alternativos
  const DotsSpinner = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          variants={dotsVariants}
          animate="animate"
          style={{
            animationDelay: `${index * 0.2}s`
          }}
          className={`w-2 h-2 rounded-full ${currentVariant.spinner}`}
        />
      ))}
    </div>
  )

  // Contenedor del spinner
  const SpinnerContainer = ({ children }) => {
    if (fullScreen) {
      return (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`
            fixed inset-0 z-50 flex items-center justify-center
            ${currentVariant.bg} backdrop-blur-sm
          `}
        >
          <div className={`
            flex flex-col items-center space-y-4 rounded-xl shadow-lg
            ${currentSize.container} ${currentVariant.bg}
            border border-gray-200 dark:border-gray-700
          `}>
            {children}
          </div>
        </motion.div>
      )
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`flex flex-col items-center space-y-4 ${currentSize.container}`}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <SpinnerContainer>
      {/* Spinner principal */}
      <SpinnerIcon />
      
      {/* Mensaje de carga */}
      {showMessage && message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${currentSize.text} ${currentVariant.text} font-medium`}
        >
          {message}
        </motion.p>
      )}
      
      {/* Puntos animados adicionales */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <DotsSpinner />
      </motion.div>
    </SpinnerContainer>
  )
}

// Componente de carga para páginas específicas
export const PageLoader = ({ message = 'Cargando página...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <LoadingSpinner
      size="large"
      message={message}
      fullScreen={false}
    />
  </div>
)

// Componente de carga para secciones
export const SectionLoader = ({ message = 'Cargando...' }) => (
  <div className="flex items-center justify-center py-12">
    <LoadingSpinner
      size="medium"
      message={message}
      fullScreen={false}
    />
  </div>
)

// Componente de carga pequeño para botones
export const ButtonLoader = () => (
  <LoadingSpinner
    size="small"
    showMessage={false}
    fullScreen={false}
  />
)

// Componente de carga para cards
export const CardLoader = ({ message = 'Cargando datos...' }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner
        size="medium"
        message={message}
        fullScreen={false}
        variant="secondary"
      />
    </div>
  </div>
)

// Skeleton loader para listas
export const SkeletonLoader = ({ items = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
      >
        <div className="animate-pulse">
          <div className="flex space-x-4">
            <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
)

export default LoadingSpinner