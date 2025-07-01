// src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  Milk,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity
} from 'lucide-react'

// Componente del Dashboard principal
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBovines: 247,
    healthyBovines: 238,
    milkProduction: 1450,
    monthlyGrowth: 12.5,
    pendingVaccinations: 15,
    upcomingBreeding: 8
  })

  const [recentAlerts, setRecentAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Vacunación Pendiente',
      description: '15 bovinos requieren vacunación esta semana',
      time: '2 horas'
    },
    {
      id: 2,
      type: 'success',
      title: 'Producción Récord',
      description: 'Producción de leche superó el objetivo mensual',
      time: '1 día'
    },
    {
      id: 3,
      type: 'info',
      title: 'Revisión Programada',
      description: 'Inspección veterinaria programada para mañana',
      time: '2 días'
    }
  ])

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      // Datos cargados (simulado)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  // Componente de tarjeta de estadística
  const StatCard = ({ title, value, icon, color, trend, trendValue, link }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{trendValue}%</span>
          </div>
        )}
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value.toLocaleString()}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
        {title}
      </p>
      
      {link && (
        <Link
          to={link}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
        >
          Ver detalles →
        </Link>
      )}
    </motion.div>
  )

  // Componente de alerta
  const AlertCard = ({ alert }) => {
    const getAlertIcon = (type) => {
      switch (type) {
        case 'warning':
          return <AlertTriangle className="w-5 h-5 text-yellow-600" />
        case 'success':
          return <CheckCircle className="w-5 h-5 text-green-600" />
        case 'info':
          return <Clock className="w-5 h-5 text-blue-600" />
        default:
          return <AlertTriangle className="w-5 h-5 text-gray-600" />
      }
    }

    const getAlertBorder = (type) => {
      switch (type) {
        case 'warning':
          return 'border-l-yellow-500'
        case 'success':
          return 'border-l-green-500'
        case 'info':
          return 'border-l-blue-500'
        default:
          return 'border-l-gray-500'
      }
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 ${getAlertBorder(alert.type)} shadow-sm`}
      >
        <div className="flex items-start space-x-3">
          {getAlertIcon(alert.type)}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {alert.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {alert.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Hace {alert.time}
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header del Dashboard */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Ganadero
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Resumen general de tu operación ganadera
        </p>
      </motion.div>

      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total de Bovinos"
          value={stats.totalBovines}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          trend="up"
          trendValue={stats.monthlyGrowth}
          link="/bovines"
        />
        
        <StatCard
          title="Bovinos Saludables"
          value={stats.healthyBovines}
          icon={<Heart className="w-6 h-6 text-white" />}
          color="bg-green-500"
          link="/health"
        />
        
        <StatCard
          title="Producción de Leche (L)"
          value={stats.milkProduction}
          icon={<Milk className="w-6 h-6 text-white" />}
          color="bg-purple-500"
          trend="up"
          trendValue={8.3}
          link="/production"
        />
        
        <StatCard
          title="Vacunaciones Pendientes"
          value={stats.pendingVaccinations}
          icon={<Calendar className="w-6 h-6 text-white" />}
          color="bg-yellow-500"
          link="/health/vaccinations"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de alertas y notificaciones */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Alertas Recientes
            </h2>
            <Link
              to="/notifications"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
            >
              Ver todas
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </motion.div>

        {/* Panel de accesos rápidos */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Accesos Rápidos
          </h2>
          
          <div className="space-y-3">
            <Link
              to="/bovines/new"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-gray-900 dark:text-white font-medium">
                Registrar Bovino
              </span>
            </Link>

            <Link
              to="/health/vaccinations"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-gray-900 dark:text-white font-medium">
                Programar Vacunación
              </span>
            </Link>

            <Link
              to="/production/milk"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                <Milk className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-gray-900 dark:text-white font-medium">
                Registrar Producción
              </span>
            </Link>

            <Link
              to="/maps"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/50 transition-colors">
                <MapPin className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-gray-900 dark:text-white font-medium">
                Ver Mapas
              </span>
            </Link>

            <Link
              to="/reports"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-gray-900 dark:text-white font-medium">
                Ver Reportes
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Panel de métricas adicionales */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Resumen de Actividad
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mx-auto mb-3">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalBovines}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Registrados
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              96%
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Salud General
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              +{stats.monthlyGrowth}%
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Crecimiento Mensual
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg mx-auto mb-3">
              <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.upcomingBreeding}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Eventos Esta Semana
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard