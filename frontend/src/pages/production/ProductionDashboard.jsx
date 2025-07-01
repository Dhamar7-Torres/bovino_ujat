// src/pages/production/ProductionDashboard.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Milk,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  BarChart3,
  Activity,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Plus,
  Download,
  Filter,
  Search,
  RefreshCw,
  Users,
  MapPin,
  Eye
} from 'lucide-react'
import toast from 'react-hot-toast'

// Dashboard de producción
const ProductionDashboard = () => {
  const [productionData, setProductionData] = useState({
    daily: {},
    weekly: {},
    monthly: {},
    trends: [],
    topProducers: [],
    alerts: []
  })
  
  const [selectedPeriod, setSelectedPeriod] = useState('today') // today, week, month
  const [selectedMetric, setSelectedMetric] = useState('milk') // milk, weight, breeding
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Datos de ejemplo
  const sampleData = {
    daily: {
      totalMilk: 1247.5,
      totalBovines: 15,
      averagePerCow: 83.2,
      sessions: 2,
      quality: 'A+',
      target: 1200,
      previousDay: 1189.3
    },
    weekly: {
      totalMilk: 8732.5,
      averageDaily: 1247.5,
      growth: 12.3,
      efficiency: 92.1,
      target: 8400,
      bestDay: { date: '2024-06-20', amount: 1298.7 }
    },
    monthly: {
      totalMilk: 35680.2,
      averageDaily: 1189.3,
      growth: 8.7,
      efficiency: 89.4,
      target: 36000,
      projected: 37250.8
    },
    trends: [
      { date: '2024-06-16', morning: 641.2, afternoon: 548.3, total: 1189.5 },
      { date: '2024-06-17', morning: 658.1, afternoon: 559.7, total: 1217.8 },
      { date: '2024-06-18', morning: 672.4, afternoon: 565.2, total: 1237.6 },
      { date: '2024-06-19', morning: 649.8, afternoon: 542.1, total: 1191.9 },
      { date: '2024-06-20', morning: 689.3, afternoon: 609.4, total: 1298.7 },
      { date: '2024-06-21', morning: 663.7, afternoon: 573.8, total: 1237.5 },
      { date: '2024-06-22', morning: 678.2, afternoon: 569.3, total: 1247.5 }
    ],
    topProducers: [
      {
        id: 'BOV-001',
        name: 'Esperanza',
        breed: 'Holstein',
        dailyAvg: 28.5,
        weeklyTotal: 199.5,
        efficiency: 94.2,
        quality: 'A+',
        sessions: 2,
        lactationDay: 145,
        location: 'Potrero A-1'
      },
      {
        id: 'BOV-005',
        name: 'Bella',
        breed: 'Holstein',
        dailyAvg: 26.8,
        weeklyTotal: 187.6,
        efficiency: 91.7,
        quality: 'A',
        sessions: 2,
        lactationDay: 89,
        location: 'Potrero A-1'
      },
      {
        id: 'BOV-007',
        name: 'Victoria',
        breed: 'Jersey',
        dailyAvg: 22.4,
        weeklyTotal: 156.8,
        efficiency: 88.9,
        quality: 'A+',
        sessions: 2,
        lactationDay: 203,
        location: 'Potrero B-1'
      },
      {
        id: 'BOV-012',
        name: 'Reina',
        breed: 'Holstein',
        dailyAvg: 25.1,
        weeklyTotal: 175.7,
        efficiency: 87.4,
        quality: 'A',
        sessions: 2,
        lactationDay: 67,
        location: 'Potrero A-2'
      },
      {
        id: 'BOV-018',
        name: 'Princesa',
        breed: 'Jersey',
        dailyAvg: 21.8,
        weeklyTotal: 152.6,
        efficiency: 86.1,
        quality: 'A',
        sessions: 2,
        lactationDay: 178,
        location: 'Potrero B-1'
      }
    ],
    alerts: [
      {
        id: 1,
        type: 'low_production',
        severity: 'medium',
        title: 'Producción Baja Detectada',
        description: 'BOV-015 (Paloma) ha reducido su producción en 15% esta semana',
        bovine: 'BOV-015',
        timestamp: '2024-06-22T14:30:00',
        action: 'Revisar salud'
      },
      {
        id: 2,
        type: 'quality_alert',
        severity: 'high',
        title: 'Alerta de Calidad',
        description: 'Muestra de ordeña matutina presenta recuento celular elevado',
        location: 'Sala de Ordeña 1',
        timestamp: '2024-06-22T06:45:00',
        action: 'Análisis inmediato'
      },
      {
        id: 3,
        type: 'maintenance',
        severity: 'low',
        title: 'Mantenimiento Programado',
        description: 'Equipo de ordeña requiere mantenimiento preventivo',
        equipment: 'Sistema de Ordeña #2',
        timestamp: '2024-06-23T08:00:00',
        action: 'Programar servicio'
      },
      {
        id: 4,
        type: 'target_achieved',
        severity: 'success',
        title: 'Meta Alcanzada',
        description: 'Producción diaria superó la meta en 3.96%',
        achievement: '+47.5L sobre objetivo',
        timestamp: '2024-06-22T18:00:00',
        action: 'Felicitar equipo'
      }
    ]
  }

  // Cargar datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setProductionData(sampleData)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Actualizar datos
  const refreshData = () => {
    setIsLoading(true)
    setLastUpdate(new Date())
    setTimeout(() => {
      // Simular actualización de datos
      setProductionData(prev => ({
        ...prev,
        daily: {
          ...prev.daily,
          totalMilk: prev.daily.totalMilk + (Math.random() - 0.5) * 50
        }
      }))
      setIsLoading(false)
      toast.success('Datos actualizados')
    }, 1500)
  }

  // Calcular cambio porcentual
  const calculateChange = (current, previous) => {
    if (previous === 0) return 0
    return ((current - previous) / previous * 100).toFixed(1)
  }

  // Obtener color de severidad
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  // Obtener icono de alerta
  const getAlertIcon = (type) => {
    switch (type) {
      case 'low_production':
        return <TrendingDown className="w-4 h-4" />
      case 'quality_alert':
        return <AlertCircle className="w-4 h-4" />
      case 'maintenance':
        return <Clock className="w-4 h-4" />
      case 'target_achieved':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Panel de Producción
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Control y análisis de la producción del rancho
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
          
          <Link
            to="/production/milk"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Producción</span>
          </Link>
        </div>
      </motion.div>

      {/* Métricas principales */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={itemVariants}
      >
        {/* Producción Total Diaria */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Milk className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {productionData.daily.totalMilk?.toLocaleString()} L
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Producción Diaria</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {calculateChange(productionData.daily.totalMilk, productionData.daily.previousDay) >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                calculateChange(productionData.daily.totalMilk, productionData.daily.previousDay) >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {Math.abs(calculateChange(productionData.daily.totalMilk, productionData.daily.previousDay))}%
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">vs ayer</span>
          </div>
        </div>

        {/* Promedio por Vaca */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {productionData.daily.averagePerCow} L
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Promedio por Vaca</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {productionData.daily.totalBovines} vacas en ordeña
            </div>
            <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
              Óptimo
            </span>
          </div>
        </div>

        {/* Meta del Día */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {((productionData.daily.totalMilk / productionData.daily.target) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">de la Meta</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min((productionData.daily.totalMilk / productionData.daily.target) * 100, 100)}%` 
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{productionData.daily.totalMilk.toLocaleString()} L</span>
            <span>{productionData.daily.target.toLocaleString()} L</span>
          </div>
        </div>

        {/* Calidad */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {productionData.daily.quality}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Calidad</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {productionData.daily.sessions} sesiones/día
            </span>
            <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full">
              Excelente
            </span>
          </div>
        </div>
      </motion.div>

      {/* Gráfico de tendencias y top producers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de tendencias */}
        <motion.div
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Tendencia de Producción (7 días)
            </h2>
            <div className="flex items-center space-x-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
              >
                <option value="today">Hoy</option>
                <option value="week">7 días</option>
                <option value="month">30 días</option>
              </select>
              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Simulación de gráfico */}
          <div className="h-64 flex items-end justify-between space-x-2">
            {productionData.trends.map((day, index) => {
              const maxValue = Math.max(...productionData.trends.map(d => d.total))
              const height = (day.total / maxValue) * 100
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col space-y-1 h-48 justify-end">
                    {/* Barra de la tarde */}
                    <motion.div
                      className="w-full bg-blue-400 rounded-t"
                      style={{ height: `${(day.afternoon / maxValue) * 100}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.afternoon / maxValue) * 100}%` }}
                      transition={{ delay: index * 0.1 }}
                    />
                    {/* Barra de la mañana */}
                    <motion.div
                      className="w-full bg-blue-600 rounded-b"
                      style={{ height: `${(day.morning / maxValue) * 100}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.morning / maxValue) * 100}%` }}
                      transition={{ delay: index * 0.1 }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                    <div className="font-medium">{day.total}L</div>
                    <div>{new Date(day.date).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' })}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Leyenda */}
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Ordeña Matutina</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Ordeña Vespertina</span>
            </div>
          </div>
        </motion.div>

        {/* Top productoras */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Top Productoras
            </h2>
            <Link
              to="/bovines"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Ver todas
            </Link>
          </div>

          <div className="space-y-4">
            {productionData.topProducers.map((cow, index) => (
              <motion.div
                key={cow.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-400' :
                    'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {cow.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {cow.id} • {cow.breed}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {cow.location}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {cow.dailyAvg} L/día
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {cow.weeklyTotal} L/semana
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                        cow.quality === 'A+' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {cow.quality}
                      </span>
                    </div>
                  </div>
                  
                  {/* Barra de eficiencia */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Eficiencia</span>
                      <span>{cow.efficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div 
                        className="bg-green-500 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${cow.efficiency}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Alertas y notificaciones */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Alertas y Notificaciones
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {productionData.alerts.length} alertas activas
            </span>
            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productionData.alerts.map((alert) => (
            <motion.div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                alert.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {alert.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {alert.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(alert.timestamp).toLocaleString('es-MX', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    
                    <button className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      alert.severity === 'success' ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' :
                      alert.severity === 'high' ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {alert.action}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Resumen semanal */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        variants={itemVariants}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Resumen Semanal
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {productionData.weekly.totalMilk.toLocaleString()} L
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Producción Total
            </div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">
                +{productionData.weekly.growth}%
              </span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {productionData.weekly.averageDaily.toLocaleString()} L
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Promedio Diario
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Meta: {productionData.daily.target.toLocaleString()} L
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {productionData.weekly.efficiency}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Eficiencia
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Muy buena
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
              {productionData.weekly.bestDay.amount} L
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Mejor Día
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {new Date(productionData.weekly.bestDay.date).toLocaleDateString('es-MX')}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProductionDashboard