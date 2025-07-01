// src/components/common/LoadingSpinner/LoadingSpinner.jsx
import React from 'react'
import { motion } from 'framer-motion'

// Componente de spinner de carga con animaciones
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  message = 'Cargando...', 
  showMessage = true,
  fullScreen = false 
}) => {
  // Configuración de tamaños
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  // Configuración de colores
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    gray: 'text-gray-600'
  }

  // Componente del spinner
  const SpinnerIcon = () => (
    <motion.div
      className={`${sizeClasses[size]} ${colorClasses[color]}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <svg
        className="w-full h-full"
        fill="none"
        viewBox="0 0 24 24"
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

  // Variante de pantalla completa
  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900"
      >
        <div className="text-center space-y-4">
          <SpinnerIcon />
          {showMessage && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 dark:text-gray-400 font-medium"
            >
              {message}
            </motion.p>
          )}
          
          {/* Texto animado adicional para carga larga */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-500 dark:text-gray-500"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Preparando el sistema ganadero...
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Variante normal
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center justify-center p-4 space-y-3"
    >
      <SpinnerIcon />
      {showMessage && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-gray-600 dark:text-gray-400 font-medium ${
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
          }`}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  )
}

// Componente de loading para páginas específicas
export const PageLoader = ({ message = "Cargando página..." }) => (
  <div className="min-h-96 flex items-center justify-center">
    <LoadingSpinner 
      size="lg" 
      color="blue" 
      message={message}
      showMessage={true}
    />
  </div>
)

// Componente de loading para botones
export const ButtonLoader = ({ size = 'sm', color = 'white' }) => (
  <LoadingSpinner 
    size={size} 
    color={color} 
    showMessage={false}
  />
)

// Componente de loading para cards/contenido
export const ContentLoader = ({ message = "Cargando contenido..." }) => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner 
      size="md" 
      color="gray" 
      message={message}
      showMessage={true}
    />
  </div>
)

export default LoadingSpinner