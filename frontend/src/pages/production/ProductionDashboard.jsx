// Frontend/src/pages/production/ProductionDashboard.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  MapPin,
  Activity,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Cow,
  Scale,
  DollarSign,
  Users,
  Clock,
  Zap,
  Heart,
  RefreshCw,
  Download,
  Plus,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  TrendingRight,
  Timer,
  Thermometer,
  Beaker,
  FlaskConical,
  Gauge,
  Star,
  Package,
  LineChart,
  Bell,
  Settings,
  Filter,
  Search,
  Calendar as CalendarIcon,
  ChevronRight,
  Info,
  AlertCircle,
  Percent
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductionDashboard = () => {
  // Estados para manejar los datos del dashboard
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('volume');

  // Animaciones para los componentes
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
      y: -2,
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
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

  // Cargar datos del dashboard al montar el componente
  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeRange]);

  // Obtener datos del dashboard
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/production/dashboard?timeRange=${selectedTimeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load production dashboard data');
      }
    } catch (error) {
      console.error('Fetch dashboard error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos de ejemplo mientras se carga la API real
  const mockData = {
    overview: {
      totalVolume: 2847.6,
      totalSessions: 156,
      activeAnimals: 42,
      averageYield: 26.8,
      totalRevenue: 2549.84,
      averageQuality: 'A',
      bestPerformer: 'Daisy',
      efficiency: 87.2
    },
    trends: {
      volumeChange: 8.5,
      sessionsChange: 12.3,
      yieldChange: -2.1,
      revenueChange: 15.7,
      qualityChange: 5.2
    },
    dailyProduction: [
      { date: '2025-06-21', volume: 394.2, sessions: 22, quality: 'A', revenue: 352.46 },
      { date: '2025-06-22', volume: 387.1, sessions: 21, quality: 'A+', revenue: 356.93 },
      { date: '2025-06-23', volume: 421.8, sessions: 24, quality: 'A', revenue: 381.92 },
      { date: '2025-06-24', volume: 408.5, sessions: 23, quality: 'A', revenue: 374.78 },
      { date: '2025-06-25', volume: 445.7, sessions: 25, quality: 'A+', revenue: 412.15 },
      { date: '2025-06-26', volume: 398.2, sessions: 22, quality: 'A', revenue: 358.92 },
      { date: '2025-06-27', volume: 392.1, sessions: 19, quality: 'A', revenue: 313.68 }
    ],
    topProducers: [
      {
        id: 1,
        animal: 'Daisy',
        tagNumber: 'D234',
        breed: 'Holstein',
        avgVolume: 31.2,
        totalSessions: 28,
        avgQuality: 'A+',
        totalRevenue: 782.45,
        lastProduction: '2025-06-27',
        trend: 'increasing',
        efficiency: 92.1
      },
      {
        id: 2,
        animal: 'Luna',
        tagNumber: 'L089',
        breed: 'Holstein',
        avgVolume: 29.8,
        totalSessions: 26,
        avgQuality: 'A',
        totalRevenue: 695.23,
        lastProduction: '2025-06-27',
        trend: 'stable',
        efficiency: 89.4
      },
      {
        id: 3,
        animal: 'Rocky',
        tagNumber: 'R321',
        breed: 'Brown Swiss',
        avgVolume: 28.5,
        totalSessions: 25,
        avgQuality: 'A',
        totalRevenue: 612.84,
        lastProduction: '2025-06-26',
        trend: 'increasing',
        efficiency: 85.7
      },
      {
        id: 4,
        animal: 'Bella',
        tagNumber: 'B247',
        breed: 'Jersey',
        avgVolume: 23.6,
        totalSessions: 24,
        avgQuality: 'A+',
        totalRevenue: 589.12,
        lastProduction: '2025-06-27',
        trend: 'stable',
        efficiency: 91.2
      },
      {
        id: 5,
        animal: 'Sophie',
        tagNumber: 'S789',
        breed: 'Brown Swiss',
        avgVolume: 25.8,
        totalSessions: 23,
        avgQuality: 'A',
        totalRevenue: 534.67,
        lastProduction: '2025-06-26',
        trend: 'decreasing',
        efficiency: 82.3
      }
    ],
    qualityDistribution: [
      { grade: 'A+', count: 45, percentage: 28.8, value: 1156.78 },
      { grade: 'A', count: 87, percentage: 55.8, value: 1238.92 },
      { grade: 'B+', count: 18, percentage: 11.5, value: 142.35 },
      { grade: 'B', count: 6, percentage: 3.8, value: 11.79 },
      { grade: 'C', count: 0, percentage: 0.1, value: 0.00 }
    ],
    shiftPerformance: [
      {
        shift: 'Morning',
        sessions: 89,
        volume: 1523.4,
        avgYield: 27.1,
        efficiency: 89.2,
        quality: 'A',
        revenue: 1387.95
      },
      {
        shift: 'Afternoon',
        sessions: 67,
        volume: 1324.2,
        avgYield: 26.3,
        efficiency: 84.8,
        quality: 'A',
        revenue: 1161.89
      }
    ],
    alerts: [
      {
        id: 1,
        type: 'warning',
        title: 'Low Yield Alert',
        message: 'Thunder showing 15% decrease in milk production',
        animal: 'Thunder',
        timestamp: '2 hours ago',
        action: 'Schedule health check'
      },
      {
        id: 2,
        type: 'info',
        title: 'Quality Achievement',
        message: 'Bella maintained A+ grade for 7 consecutive days',
        animal: 'Bella',
        timestamp: '1 day ago',
        action: 'Review feeding program'
      },
      {
        id: 3,
        type: 'success',
        title: 'Production Milestone',
        message: 'Daily production exceeded 400L target',
        animal: 'All',
        timestamp: '2 days ago',
        action: 'Continue current protocols'
      }
    ],
    upcomingTasks: [
      {
        id: 1,
        task: 'Equipment Maintenance',
        description: 'Monthly cleaning and calibration of milking machines',
        dueDate: '2025-06-30',
        priority: 'High',
        location: 'Milking Parlor A & B'
      },
      {
        id: 2,
        task: 'Quality Testing',
        description: 'Weekly milk quality analysis and bacterial count',
        dueDate: '2025-06-28',
        priority: 'Medium',
        location: 'Laboratory'
      },
      {
        id: 3,
        task: 'Feed Inventory Check',
        description: 'Review feed supplies and nutritional supplements',
        dueDate: '2025-06-29',
        priority: 'Medium',
        location: 'Feed Storage'
      }
    ],
    monthlyComparison: {
      currentMonth: {
        volume: 2847.6,
        sessions: 156,
        revenue: 2549.84,
        avgQuality: 'A'
      },
      previousMonth: {
        volume: 2623.4,
        sessions: 147,
        revenue: 2184.92,
        avgQuality: 'A-'
      },
      yearAgo: {
        volume: 2456.8,
        sessions: 142,
        revenue: 1923.45,
        avgQuality: 'B+'
      }
    }
  };

  // Usar datos mock si no hay datos reales disponibles
  const data = dashboardData || mockData;

  // Obtener color del trend
  const getTrendColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Obtener icono del trend
  const getTrendIcon = (value) => {
    if (value > 0) return TrendingUp;
    if (value < 0) return TrendingDown;
    return TrendingRight;
  };

  // Obtener color de la calidad
  const getQualityColor = (quality) => {
    switch (quality) {
      case 'A+': return 'text-green-600 bg-green-100';
      case 'A': return 'text-blue-600 bg-blue-100';
      case 'A-': return 'text-indigo-600 bg-indigo-100';
      case 'B+': return 'text-yellow-600 bg-yellow-100';
      case 'B': return 'text-orange-600 bg-orange-100';
      case 'C': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Obtener color de la alerta
  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Obtener color de prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading production dashboard...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Production Dashboard</h1>
              <div className="text-sm text-gray-600">
                Comprehensive production monitoring and analytics
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Time Range Selector */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="12months">Last 12 Months</option>
              </select>
              
              <button
                onClick={fetchDashboardData}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Stats Cards principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Volume */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Volume</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-blue-900"
                  >
                    {data.overview.totalVolume}L
                  </motion.p>
                  {data.trends && (
                    <div className="flex items-center mt-2">
                      {getTrendIcon(data.trends.volumeChange) &&
                        React.createElement(getTrendIcon(data.trends.volumeChange), {
                          className: `w-4 h-4 mr-1 ${getTrendColor(data.trends.volumeChange)}`
                        })
                      }
                      <span className={`text-sm ${getTrendColor(data.trends.volumeChange)}`}>
                        {Math.abs(data.trends.volumeChange)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            {/* Active Animals */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Animals</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-green-900"
                  >
                    {data.overview.activeAnimals}
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-2">
                    {data.overview.totalSessions} sessions
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Cow className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            {/* Average Yield */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Yield</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-purple-900"
                  >
                    {data.overview.averageYield}L
                  </motion.p>
                  {data.trends && (
                    <div className="flex items-center mt-2">
                      {getTrendIcon(data.trends.yieldChange) &&
                        React.createElement(getTrendIcon(data.trends.yieldChange), {
                          className: `w-4 h-4 mr-1 ${getTrendColor(data.trends.yieldChange)}`
                        })
                      }
                      <span className={`text-sm ${getTrendColor(data.trends.yieldChange)}`}>
                        {Math.abs(data.trends.yieldChange)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">per animal</span>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Scale className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>

            {/* Total Revenue */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-orange-900"
                  >
                    {formatCurrency(data.overview.totalRevenue)}
                  </motion.p>
                  {data.trends && (
                    <div className="flex items-center mt-2">
                      {getTrendIcon(data.trends.revenueChange) &&
                        React.createElement(getTrendIcon(data.trends.revenueChange), {
                          className: `w-4 h-4 mr-1 ${getTrendColor(data.trends.revenueChange)}`
                        })
                      }
                      <span className={`text-sm ${getTrendColor(data.trends.revenueChange)}`}>
                        {Math.abs(data.trends.revenueChange)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Quality Grade</h3>
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-center">
                <span className={`inline-flex px-4 py-2 rounded-full text-2xl font-bold ${getQualityColor(data.overview.averageQuality)}`}>
                  {data.overview.averageQuality}
                </span>
                <p className="text-sm text-gray-600 mt-2">Average quality grade</p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Best Performer</h3>
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{data.overview.bestPerformer}</p>
                <p className="text-sm text-gray-600 mt-1">Top producing animal</p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Efficiency</h3>
                <Gauge className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{data.overview.efficiency}%</p>
                <p className="text-sm text-gray-600 mt-1">Overall efficiency</p>
              </div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top Producers y Quality Distribution */}
            <div className="lg:col-span-2 space-y-6">
              {/* Top Producers */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Top Producers</h3>
                  <Link
                    to="/production/milk"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {data.topProducers.map((producer, index) => (
                    <motion.div
                      key={producer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {producer.animal} (#{producer.tagNumber})
                          </h4>
                          <p className="text-sm text-gray-600">{producer.breed}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <p className="font-medium text-gray-900">{producer.avgVolume}L</p>
                          <p className="text-gray-500">Avg Volume</p>
                        </div>
                        <div className="text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(producer.avgQuality)}`}>
                            {producer.avgQuality}
                          </span>
                          <p className="text-gray-500 mt-1">Quality</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-green-600">{formatCurrency(producer.totalRevenue)}</p>
                          <p className="text-gray-500">Revenue</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-blue-600">{producer.efficiency}%</p>
                          <p className="text-gray-500">Efficiency</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quality Distribution */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Quality Distribution</h3>
                  <PieChart className="w-5 h-5 text-purple-600" />
                </div>
                
                <div className="space-y-4">
                  {data.qualityDistribution.map((quality, index) => (
                    <div key={quality.grade} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getQualityColor(quality.grade)}`}>
                          {quality.grade}
                        </span>
                        <span className="text-sm text-gray-600">{quality.count} sessions</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${quality.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{quality.percentage}%</span>
                        </div>
                        <span className="text-sm font-medium text-green-600 min-w-20 text-right">
                          {formatCurrency(quality.value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Alerts */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Production Alerts</h3>
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                
                <div className="space-y-3">
                  {data.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`border-l-4 p-3 rounded-r-lg ${getAlertColor(alert.type)}`}
                    >
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{alert.timestamp}</span>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          {alert.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Shift Performance */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Shift Performance</h3>
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                
                <div className="space-y-4">
                  {data.shiftPerformance.map((shift, index) => (
                    <div key={shift.shift} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{shift.shift}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(shift.quality)}`}>
                          {shift.quality}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Volume</p>
                          <p className="font-medium">{shift.volume}L</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Sessions</p>
                          <p className="font-medium">{shift.sessions}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Avg Yield</p>
                          <p className="font-medium">{shift.avgYield}L</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Efficiency</p>
                          <p className="font-medium">{shift.efficiency}%</p>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Revenue</span>
                          <span className="text-sm font-medium text-green-600">
                            {formatCurrency(shift.revenue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Link
                    to="/production/milk/add"
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Record Production
                  </Link>
                  
                  <Link
                    to="/production/reports"
                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate Report
                  </Link>
                  
                  <Link
                    to="/production/weight-tracking"
                    className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <Scale className="w-4 h-4 mr-2" />
                    Weight Tracking
                  </Link>
                  
                  <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </button>
                </div>
              </motion.div>

              {/* Upcoming Tasks */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
                  <CalendarIcon className="w-5 h-5 text-gray-600" />
                </div>
                
                <div className="space-y-3">
                  {data.upcomingTasks.map((task) => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{task.task}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        <span>{task.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductionDashboard;