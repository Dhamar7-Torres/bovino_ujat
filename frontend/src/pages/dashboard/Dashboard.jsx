import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

// Dashboard principal del sistema
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBovines: 0,
    healthyBovines: 0,
    productionToday: 0,
    pendingVaccinations: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Simular carga de datos
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          totalBovines: 147,
          healthyBovines: 142,
          productionToday: 890,
          pendingVaccinations: 5
        })
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  // Componente de tarjeta de estadística
  const StatCard = ({ title, value, subtitle, icon, color = "blue", trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-8 w-16"></div>
          ) : (
            value
          )}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  )

  // Componente de actividad reciente
  const RecentActivity = () => {
    const activities = [
      {
        id: 1,
        type: 'vaccination',
        message: 'Vacunación completada para Vaca #B147',
        time: '2 horas',
        icon: '💉',
        color: 'green'
      },
      {
        id: 2,
        type: 'birth',
        message: 'Nuevo nacimiento registrado - Ternero #T089',
        time: '4 horas',
        icon: '🐄',
        color: 'blue'
      },
      {
        id: 3,
        type: 'health',
        message: 'Chequeo médico programado para mañana',
        time: '6 horas',
        icon: '🏥',
        color: 'orange'
      },
      {
        id: 4,
        type: 'production',
        message: 'Producción de leche: 890L registrados',
        time: '8 horas',
        icon: '🥛',
        color: 'purple'
      }
    ]

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Actividad Reciente
        </h3>
        
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm">
                {activity.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Hace {activity.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          Ver todas las actividades
        </motion.button>
      </motion.div>
    )
  }

  // Componente de acciones rápidas
  const QuickActions = () => {
    const actions = [
      {
        title: 'Registrar Bovino',
        description: 'Agregar nuevo animal al inventario',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        ),
        color: 'blue',
        href: '/bovines/new'
      },
      {
        title: 'Registrar Vacunación',
        description: 'Programar o registrar vacunas',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        color: 'green',
        href: '/health/vaccinations'
      },
      {
        title: 'Registrar Producción',
        description: 'Anotar producción de leche',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        color: 'purple',
        href: '/production'
      },
      {
        title: 'Ver Reportes',
        description: 'Consultar estadísticas y reportes',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        color: 'orange',
        href: '/reports'
      }
    ]

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Acciones Rápidas
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <motion.a
              key={action.title}
              href={action.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`block p-4 rounded-lg border-2 border-dashed border-${action.color}-200 dark:border-${action.color}-800 hover:border-${action.color}-300 dark:hover:border-${action.color}-700 hover:bg-${action.color}-50 dark:hover:bg-${action.color}-900/20 transition-all group`}
            >
              <div className={`w-10 h-10 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30 flex items-center justify-center text-${action.color}-600 dark:text-${action.color}-400 mb-3 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              
              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                {action.title}
              </h4>
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {action.description}
              </p>
            </motion.a>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Configuración del HEAD */}
      <Helmet>
        <title>Dashboard - Sistema de Gestión de Bovinos</title>
        <meta name="description" content="Panel principal del sistema de gestión de bovinos con estadísticas en tiempo real." />
      </Helmet>

      {/* Header del Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenido al sistema de gestión de bovinos. Aquí tienes un resumen de tu rancho.
        </p>
      </motion.div>

      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Bovinos"
          value={stats.totalBovines}
          subtitle="Inventario actual"
          icon={
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="blue"
          trend={5.2}
        />
        
        <StatCard
          title="Bovinos Saludables"
          value={stats.healthyBovines}
          subtitle={`${Math.round((stats.healthyBovines / stats.totalBovines) * 100)}% del total`}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
          color="green"
          trend={2.1}
        />
        
        <StatCard
          title="Producción Hoy"
          value={`${stats.productionToday}L`}
          subtitle="Litros de leche"
          icon={
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="purple"
          trend={-1.5}
        />
        
        <StatCard
          title="Vacunas Pendientes"
          value={stats.pendingVaccinations}
          subtitle="Requieren atención"
          icon={
            <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          }
          color="orange"
        />
      </div>

      {/* Grid de contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad reciente */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        
        {/* Acciones rápidas */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Footer del dashboard */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        <p>
          Última actualización: {new Date().toLocaleString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </motion.div>
    </div>
  )
}

export default Dashboard