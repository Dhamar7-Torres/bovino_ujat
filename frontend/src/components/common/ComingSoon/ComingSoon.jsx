import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

// Componente para páginas en desarrollo
const ComingSoon = ({ 
  pageName = "Esta función", 
  description,
  estimatedDate,
  features = [],
  showAnimation = true,
  showBackButton = true,
  showNotifyButton = true
}) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)

  // Animación secuencial para elementos
  useEffect(() => {
    if (!showAnimation) return
    
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4)
    }, 2000)

    return () => clearInterval(timer)
  }, [showAnimation])

  // Descripción por defecto basada en el nombre de la página
  const defaultDescriptions = {
    "Mapas y Geolocalización": "Visualiza la ubicación exacta de tu ganado con mapas interactivos y seguimiento GPS en tiempo real.",
    "Calendario de Eventos": "Programa y gestiona todas las actividades de tu rancho con recordatorios automáticos.",
    "Gestión Financiera": "Controla ingresos, gastos y rentabilidad de tu operación ganadera.",
    "Inventario": "Administra el inventario de alimentos, medicamentos y suministros.",
    "Reportes Avanzados": "Genera reportes personalizados con análisis profundo de datos.",
    "Análisis Predictivo": "Utiliza inteligencia artificial para predecir tendencias y optimizar decisiones.",
    "Integración IoT": "Conecta sensores y dispositivos inteligentes para monitoreo automático.",
    "Sistema de Alertas": "Recibe notificaciones inteligentes sobre eventos importantes."
  }

  const getDescription = () => {
    return description || defaultDescriptions[pageName] || `${pageName} estará disponible próximamente con funcionalidades avanzadas para mejorar la gestión de tu ganado.`
  }

  // Funciones para manejar acciones
  const handleBackClick = () => {
    navigate(-1)
  }

  const handleNotifySubmit = (e) => {
    e.preventDefault()
    if (email) {
      // Aquí se enviaría el email a una lista de notificaciones
      setIsSubscribed(true)
      setTimeout(() => {
        setEmail('')
        setIsSubscribed(false)
      }, 3000)
    }
  }

  // Animaciones de los elementos
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const childVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }

  // Componente de icono animado
  const AnimatedIcon = () => (
    <motion.div
      className="relative w-24 h-24 mx-auto mb-6"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Círculo de fondo */}
      <motion.div
        className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Icono principal */}
      <div className="relative w-full h-full bg-blue-500 rounded-full flex items-center justify-center">
        <motion.svg
          className="w-12 h-12 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{
            rotate: animationStep * 90
          }}
          transition={{ duration: 0.5 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </motion.svg>
      </div>
      
      {/* Elementos decorativos */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400 rounded-full"
          style={{
            top: `${20 + i * 20}%`,
            right: `${-10 - i * 5}%`
          }}
          animate={{
            y: [-5, 5, -5],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </motion.div>
  )

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 flex items-center justify-center p-4"
    >
      <div className="max-w-2xl w-full">
        <motion.div
          variants={childVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Header decorativo */}
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600"></div>
          
          {/* Contenido principal */}
          <div className="p-8 md:p-12 text-center">
            {/* Icono animado */}
            <AnimatedIcon />
            
            {/* Título principal */}
            <motion.h1
              variants={childVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              {pageName}
            </motion.h1>
            
            {/* Subtítulo */}
            <motion.h2
              variants={childVariants}
              className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-6"
            >
              Próximamente disponible
            </motion.h2>
            
            {/* Descripción */}
            <motion.p
              variants={childVariants}
              className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8"
            >
              {getDescription()}
            </motion.p>
            
            {/* Lista de características (si se proporcionan) */}
            {features.length > 0 && (
              <motion.div
                variants={childVariants}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Características que incluirá:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center space-x-3 text-left"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Fecha estimada */}
            {estimatedDate && (
              <motion.div
                variants={childVariants}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-8"
              >
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                  <span className="text-blue-600 dark:text-blue-400">Fecha estimada:</span> {estimatedDate}
                </p>
              </motion.div>
            )}
            
            {/* Formulario de notificación */}
            {showNotifyButton && (
              <motion.div
                variants={childVariants}
                className="mb-8"
              >
                {!isSubscribed ? (
                  <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                      </svg>
                      <span>Notificarme</span>
                    </motion.button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-md mx-auto"
                  >
                    <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">¡Te notificaremos cuando esté listo!</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
            
            {/* Botones de acción */}
            <motion.div
              variants={childVariants}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              {showBackButton && (
                <motion.button
                  onClick={handleBackClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Volver atrás</span>
                </motion.button>
              )}
              
              <motion.button
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Ir al Dashboard</span>
              </motion.button>
            </motion.div>
          </div>
          
          {/* Footer con información adicional */}
          <div className="bg-gray-50 dark:bg-gray-700/50 px-8 md:px-12 py-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Mientras tanto, puedes explorar las otras funcionalidades disponibles del sistema
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Variante compacta para usar dentro de layouts
export const ComingSoonCard = ({ pageName, compact = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center"
  >
    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      {pageName}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 text-sm">
      Esta funcionalidad estará disponible próximamente
    </p>
  </motion.div>
)

export default ComingSoon