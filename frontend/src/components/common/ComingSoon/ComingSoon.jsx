// src/pages/common/ComingSoon.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Home, 
  Wrench, 
  Calendar,
  MapPin,
  DollarSign,
  Package
} from 'lucide-react'

// Componente para páginas que están en desarrollo
const ComingSoon = ({ 
  pageName = "Nueva Funcionalidad",
  description = "Esta funcionalidad estará disponible pronto.",
  estimatedTime = "Próximamente",
  features = []
}) => {
  const navigate = useNavigate()

  // Función para volver atrás
  const handleGoBack = () => {
    window.history.back()
  }

  // Función para ir al dashboard
  const handleGoHome = () => {
    navigate('/dashboard')
  }

  // Iconos según el tipo de página
  const getPageIcon = () => {
    if (pageName.toLowerCase().includes('mapa')) {
      return <MapPin className="w-16 h-16 text-blue-500" />
    } else if (pageName.toLowerCase().includes('calendario')) {
      return <Calendar className="w-16 h-16 text-green-500" />
    } else if (pageName.toLowerCase().includes('financ')) {
      return <DollarSign className="w-16 h-16 text-yellow-500" />
    } else if (pageName.toLowerCase().includes('inventario')) {
      return <Package className="w-16 h-16 text-purple-500" />
    }
    return <Wrench className="w-16 h-16 text-gray-500" />
  }

  // Funcionalidades por defecto según el tipo de página
  const getDefaultFeatures = () => {
    if (pageName.toLowerCase().includes('mapa')) {
      return [
        "Visualización de ubicaciones del ganado",
        "Geolocalización de eventos veterinarios",
        "Mapas interactivos con Leaflet",
        "Seguimiento de rutas de pastoreo"
      ]
    } else if (pageName.toLowerCase().includes('calendario')) {
      return [
        "Programación de vacunaciones",
        "Calendario de eventos reproductivos",
        "Recordatorios automáticos",
        "Integración con ShadCN UI"
      ]
    } else if (pageName.toLowerCase().includes('financ')) {
      return [
        "Control de gastos veterinarios",
        "Análisis de rentabilidad",
        "Reportes financieros",
        "Gestión de inversiones"
      ]
    } else if (pageName.toLowerCase().includes('inventario')) {
      return [
        "Control de medicamentos",
        "Gestión de equipos",
        "Inventario de alimentos",
        "Alertas de stock bajo"
      ]
    }
    return features
  }

  const displayFeatures = features.length > 0 ? features : getDefaultFeatures()

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        className="max-w-2xl w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Contenedor principal */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          variants={itemVariants}
        >
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-6">
            <motion.div
              className="flex justify-center mb-4"
              variants={itemVariants}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {getPageIcon()}
            </motion.div>
            <motion.h1
              className="text-2xl md:text-3xl font-bold text-white mb-2"
              variants={itemVariants}
            >
              {pageName}
            </motion.h1>
            <motion.p
              className="text-blue-100 text-lg"
              variants={itemVariants}
            >
              En desarrollo
            </motion.p>
          </div>

          {/* Contenido principal */}
          <div className="p-8 space-y-6">
            {/* Descripción */}
            <motion.p
              className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed"
              variants={itemVariants}
            >
              {description}
            </motion.p>

            {/* Tiempo estimado */}
            <motion.div
              className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"
              variants={itemVariants}
            >
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                📅 Disponibilidad estimada: <span className="font-bold">{estimatedTime}</span>
              </p>
            </motion.div>

            {/* Funcionalidades esperadas */}
            {displayFeatures.length > 0 && (
              <motion.div
                className="text-left"
                variants={itemVariants}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  🚀 Funcionalidades que incluirá:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {displayFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-3 text-gray-600 dark:text-gray-400"
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Botones de acción */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
              variants={itemVariants}
            >
              <motion.button
                onClick={handleGoHome}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-5 h-5" />
                Ir al Dashboard
              </motion.button>

              <motion.button
                onClick={handleGoBack}
                className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
                Regresar
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Mensaje adicional */}
        <motion.p
          className="mt-6 text-sm text-gray-500 dark:text-gray-400"
          variants={itemVariants}
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          Sistema de Gestión Ganadera • Versión 1.0 • UJAT
        </motion.p>
      </motion.div>
    </div>
  )
}

export default ComingSoon