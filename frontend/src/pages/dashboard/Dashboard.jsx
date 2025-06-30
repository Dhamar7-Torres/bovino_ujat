/**
 * Dashboard.jsx - Página principal del sistema de gestión de bovinos
 * Vista general con estadísticas, métricas y acceso rápido a funcionalidades principales
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Cow, 
  TrendingUp, 
  TrendingDown,
  AlertCircle, 
  Calendar,
  MapPin,
  Activity,
  Heart,
  Thermometer,
  Scale,
  Plus,
  Eye,
  BarChart3,
  PieChart,
  Users,
  Clock,
  Zap,
  CheckCircle,
  Baby,
  Bell,
  ArrowRight,
  RefreshCw,
  Milk,
  Stethoscope,
  Target,
  Award,
  DollarSign,
  Package,
  FileText,
  Settings,
  HelpCircle,
  Star,
  Percent,
  TrendingRight,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Upload,
  Share2,
  MoreHorizontal,
  Calendar as CalendarIcon,
  ChevronRight,
  Info,
  AlertTriangle,
  Bookmark,
  Edit,
  Trash2,
  Archive,
  Search,
  Grid3X3,
  List,
  Layers,
  Map,
  Database,
  Wifi,
  WifiOff,
  Signal,
  Battery,
  Smartphone,
  Monitor,
  Globe
} from 'lucide-react';

// Importar componentes necesarios
import Loading from '../components/common/Loading/Loading';
import ErrorBoundary from '../components/common/ErrorBoundary/ErrorBoundary';

const Dashboard = () => {
  // Estados para manejar los datos del dashboard
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Estados para UI y preferencias
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'compact', 'detailed'
  const [showWelcome, setShowWelcome] = useState(true);
  const [favoriteWidgets, setFavoriteWidgets] = useState(['cattle', 'health', 'production']);

  const navigate = useNavigate();

  // Configuración de animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6, 
        staggerChildren: 0.1 
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: {
      y: -4,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.2 }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  // Efectos para cargar datos
  useEffect(() => {
    fetchDashboardData();
    
    // Configurar actualización automática cada 5 minutos
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  // Obtener datos del dashboard
  const fetchDashboardData = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      if (silent) setRefreshing(true);

      const response = await fetch(`/api/dashboard?timeRange=${selectedTimeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        setLastUpdate(new Date());
      } else {
        // Usar datos mock si la API no está disponible
        setDashboardData(getMockData());
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Usar datos mock como fallback
      setDashboardData(getMockData());
      setError(null); // No mostrar error si tenemos datos mock
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Datos mock para desarrollo y fallback
  const getMockData = () => ({
    stats: {
      totalBovines: 247,
      healthyBovines: 231,
      sickBovines: 8,
      pregnantBovines: 15,
      newBirths: 3,
      averageWeight: 485.2,
      totalFarms: 1,
      activeAlerts: 5,
      milkProduction: 1847.5,
      feedConsumption: 2145.8,
      veterinaryVisits: 12,
      totalRevenue: 87540.3,
      totalExpenses: 42180.75,
      profitMargin: 52.03
    },
    trends: {
      bovinesChange: 5.2,
      healthyChange: 2.1,
      weightChange: -1.3,
      birthsChange: 50.0,
      milkChange: 8.4,
      profitChange: 15.7,
      alertsChange: -12.5
    },
    recentActivity: [
      {
        id: 1,
        type: 'birth',
        message: 'Nueva cría nacida - Daisy Jr.',
        timestamp: '2 min',
        icon: Baby,
        color: 'text-green-600',
        urgent: false
      },
      {
        id: 2,
        type: 'health',
        message: 'Vaca #247 requiere chequeo veterinario',
        timestamp: '15 min',
        icon: Stethoscope,
        color: 'text-orange-600',
        urgent: true
      },
      {
        id: 3,
        type: 'production',
        message: 'Producción lechera alcanzó meta diaria',
        timestamp: '1 hora',
        icon: Milk,
        color: 'text-blue-600',
        urgent: false
      },
      {
        id: 4,
        type: 'finance',
        message: 'Nuevo ingreso registrado: $2,450',
        timestamp: '2 horas',
        icon: DollarSign,
        color: 'text-green-600',
        urgent: false
      },
      {
        id: 5,
        type: 'inventory',
        message: 'Stock de alimento bajo - Reorden necesario',
        timestamp: '3 horas',
        icon: Package,
        color: 'text-red-600',
        urgent: true
      }
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Vacunación masiva',
        date: 'Mañana 09:00',
        type: 'health',
        priority: 'high',
        bovinesCount: 45
      },
      {
        id: 2,
        title: 'Revisión veterinaria',
        date: 'Viernes 14:00',
        type: 'health',
        priority: 'medium',
        bovinesCount: 12
      },
      {
        id: 3,
        title: 'Inseminación artificial',
        date: 'Próxima semana',
        type: 'breeding',
        priority: 'medium',
        bovinesCount: 8
      }
    ],
    healthAlerts: [
      {
        id: 1,
        bovineId: 247,
        bovineName: 'Bessie',
        alert: 'Temperatura elevada',
        severity: 'high',
        timeAgo: '30 min'
      },
      {
        id: 2,
        bovineId: 156,
        bovineName: 'Luna',
        alert: 'Pérdida de apetito',
        severity: 'medium',
        timeAgo: '2 horas'
      },
      {
        id: 3,
        bovineId: 89,
        bovineName: 'Estrella',
        alert: 'Cojera leve',
        severity: 'low',
        timeAgo: '1 día'
      }
    ],
    weatherData: {
      current: {
        temperature: 24,
        condition: 'Parcialmente nublado',
        humidity: 68,
        windSpeed: 12
      },
      forecast: [
        { day: 'Hoy', high: 26, low: 18, condition: 'sunny' },
        { day: 'Mañana', high: 28, low: 20, condition: 'cloudy' },
        { day: 'Viernes', high: 23, low: 16, condition: 'rainy' }
      ]
    }
  });

  // Función para actualizar datos manualmente
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Función para manejar cambio de rango de tiempo
  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
  };

  // Si está cargando, mostrar loading
  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Loading 
          message="Cargando dashboard..." 
          type="bovines"
          size="large"
          variant="thematic"
        />
      </div>
    );
  }

  // Si hay error y no hay datos, mostrar error
  if (error && !dashboardData) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle size={48} className="mx-auto text-red-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Error al cargar el dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={handleRefresh}
            className="btn-primary inline-flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const data = dashboardData || getMockData();

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header del Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Ganadero
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vista general de tu operación ganadera
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Selector de tiempo */}
          <select
            value={selectedTimeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="input-base w-auto"
          >
            <option value="24hours">Últimas 24 horas</option>
            <option value="7days">Últimos 7 días</option>
            <option value="30days">Últimos 30 días</option>
            <option value="90days">Últimos 3 meses</option>
            <option value="1year">Último año</option>
          </select>

          {/* Botón de actualizar */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-outline inline-flex items-center gap-2"
          >
            <RefreshCw 
              size={18} 
              className={refreshing ? 'animate-spin' : ''} 
            />
            Actualizar
          </button>

          {/* Opciones de vista */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-white dark:bg-gray-600 shadow-sm' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'compact' 
                  ? 'bg-white dark:bg-gray-600 shadow-sm' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Última actualización */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          Última actualización: {lastUpdate.toLocaleTimeString()}
        </span>
        {refreshing && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>Actualizando...</span>
          </div>
        )}
      </div>

      {/* Mensaje de bienvenida */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-6 text-white relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <button
              onClick={() => setShowWelcome(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Cow size={32} />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  ¡Bienvenido de vuelta!
                </h2>
                <p className="text-blue-100">
                  Tu ganado está en excelente estado. Tienes {data.stats.activeAlerts} alertas pendientes que requieren atención.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total de Bovinos */}
        <motion.div
          className="card hover:shadow-lg transition-shadow cursor-pointer"
          variants={cardVariants}
          whileHover="hover"
          onClick={() => navigate('/bovines')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Bovinos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {data.stats.totalBovines}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {data.trends.bovinesChange > 0 ? (
                  <TrendingUp size={16} className="text-green-500" />
                ) : (
                  <TrendingDown size={16} className="text-red-500" />
                )}
                <span className={`text-sm ${
                  data.trends.bovinesChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(data.trends.bovinesChange)}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Cow size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        {/* Bovinos Saludables */}
        <motion.div
          className="card hover:shadow-lg transition-shadow cursor-pointer"
          variants={cardVariants}
          whileHover="hover"
          onClick={() => navigate('/health')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Saludables</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {data.stats.healthyBovines}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-green-600">
                  {((data.stats.healthyBovines / data.stats.totalBovines) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Heart size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Producción Lechera */}
        <motion.div
          className="card hover:shadow-lg transition-shadow cursor-pointer"
          variants={cardVariants}
          whileHover="hover"
          onClick={() => navigate('/production')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Producción (L)</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {data.stats.milkProduction.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {data.trends.milkChange > 0 ? (
                  <TrendingUp size={16} className="text-green-500" />
                ) : (
                  <TrendingDown size={16} className="text-red-500" />
                )}
                <span className={`text-sm ${
                  data.trends.milkChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(data.trends.milkChange)}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Milk size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        {/* Alertas Activas */}
        <motion.div
          className="card hover:shadow-lg transition-shadow cursor-pointer"
          variants={cardVariants}
          whileHover="hover"
          onClick={() => navigate('/alerts')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Alertas Activas</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {data.stats.activeAlerts}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {data.trends.alertsChange < 0 ? (
                  <TrendingDown size={16} className="text-green-500" />
                ) : (
                  <TrendingUp size={16} className="text-red-500" />
                )}
                <span className={`text-sm ${
                  data.trends.alertsChange < 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(data.trends.alertsChange)}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle size={24} className="text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contenido principal en dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna izquierda (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Gráficos de tendencias */}
          <motion.div
            className="card"
            variants={cardVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tendencias de Producción
              </h3>
              <div className="flex items-center gap-2">
                <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Ver detalles
                </button>
                <MoreHorizontal size={16} className="text-gray-400" />
              </div>
            </div>
            
            {/* Placeholder para gráfico - aquí iría un componente de Chart */}
            <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <BarChart3 size={32} className="mx-auto text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">
                  Gráfico de tendencias de producción
                </p>
                <p className="text-sm text-gray-400">
                  Integración con biblioteca de gráficos pendiente
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actividad reciente */}
          <motion.div
            className="card"
            variants={cardVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Actividad Reciente
              </h3>
              <Link 
                to="/activity"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 inline-flex items-center gap-1"
              >
                Ver todo
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="space-y-3">
              {data.recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${
                    activity.urgent 
                      ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-l-blue-500 bg-gray-50 dark:bg-gray-700'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.urgent 
                      ? 'bg-red-100 dark:bg-red-900/30' 
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    <activity.icon 
                      size={16} 
                      className={activity.urgent ? 'text-red-600' : activity.color} 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.timestamp}
                    </p>
                  </div>
                  {activity.urgent && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Columna derecha (1/3) */}
        <div className="space-y-6">
          
          {/* Próximos eventos */}
          <motion.div
            className="card"
            variants={cardVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Próximos Eventos
              </h3>
              <Calendar size={20} className="text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {data.upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {event.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.priority === 'high' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {event.priority === 'high' ? 'Urgente' : 'Normal'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {event.date}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {event.bovinesCount} bovinos
                  </p>
                </div>
              ))}
            </div>

            <button className="w-full mt-3 btn-outline text-sm">
              Ver calendario completo
            </button>
          </motion.div>

          {/* Alertas de salud */}
          <motion.div
            className="card"
            variants={cardVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Alertas de Salud
              </h3>
              <Stethoscope size={20} className="text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {data.healthAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        alert.severity === 'high' ? 'bg-red-500' :
                        alert.severity === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {alert.bovineName}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      #{alert.bovineId}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    {alert.alert}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Hace {alert.timeAgo}
                  </p>
                </div>
              ))}
            </div>

            <Link 
              to="/health/alerts" 
              className="w-full mt-3 btn-outline text-sm inline-flex items-center justify-center gap-2"
            >
              Ver todas las alertas
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Información del clima */}
          <motion.div
            className="card"
            variants={cardVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Clima
              </h3>
              <Thermometer size={20} className="text-gray-400" />
            </div>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {data.weatherData.current.temperature}°C
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {data.weatherData.current.condition}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Humedad:</span>
                <span className="text-gray-900 dark:text-white">{data.weatherData.current.humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Viento:</span>
                <span className="text-gray-900 dark:text-white">{data.weatherData.current.windSpeed} km/h</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between text-xs">
                {data.weatherData.forecast.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-gray-600 dark:text-gray-400 mb-1">
                      {day.day}
                    </div>
                    <div className="text-gray-900 dark:text-white font-medium">
                      {day.high}°
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {day.low}°
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <motion.div
        className="card"
        variants={cardVariants}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Acciones Rápidas
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { icon: Plus, label: 'Agregar Bovino', href: '/bovines/new', color: 'bg-blue-500' },
            { icon: Stethoscope, label: 'Registro Salud', href: '/health/record', color: 'bg-green-500' },
            { icon: Milk, label: 'Producción', href: '/production/record', color: 'bg-purple-500' },
            { icon: Baby, label: 'Reproducción', href: '/breeding/record', color: 'bg-pink-500' },
            { icon: Package, label: 'Inventario', href: '/inventory', color: 'bg-orange-500' },
            { icon: FileText, label: 'Reportes', href: '/reports', color: 'bg-indigo-500' }
          ].map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <action.icon size={24} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;