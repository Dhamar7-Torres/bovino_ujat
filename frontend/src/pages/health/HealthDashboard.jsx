// Frontend/src/pages/health/HealthDashboard.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  MapPin,
  Plus,
  Eye,
  Thermometer,
  Syringe,
  Shield,
  Stethoscope,
  Pill,
  Clock,
  Users,
  Target,
  Zap,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Download,
  FileText,
  Baby,
  Cow,
  Award,
  Clipboard,
  TrendingRight,
  BarChart3,
  PieChart,
  Filter,
  Search,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HealthDashboard = () => {
  // Estados para manejar los datos del dashboard de salud
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days');
  const [selectedFilter, setSelectedFilter] = useState('all');

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

  // Cargar datos del dashboard al montar el componente
  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeRange, selectedFilter]);

  // Obtener datos del dashboard de salud
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/health/dashboard?timeRange=${selectedTimeRange}&filter=${selectedFilter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load health dashboard data');
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
      totalAnimals: 247,
      healthyAnimals: 231,
      sickAnimals: 12,
      quarantinedAnimals: 4,
      treatmentCompliance: 94.5,
      vaccinationCoverage: 98.2,
      mortalityRate: 0.8,
      averageRecoveryTime: 7.2
    },
    trends: {
      healthyChange: 2.1,
      sickChange: -15.3,
      quarantineChange: -25.0,
      complianceChange: 5.2
    },
    healthAlerts: [
      {
        id: 1,
        type: 'critical',
        title: 'High Fever Detected',
        message: 'Cow #B247 shows temperature of 40.5°C',
        location: 'Barn A - Stall 12',
        timestamp: '2 hours ago',
        action: 'Immediate vet consultation required',
        animal: 'Bella (Tag: B247)'
      },
      {
        id: 2,
        type: 'warning',
        title: 'Vaccination Overdue',
        message: '8 animals need vaccination this week',
        location: 'Multiple locations',
        timestamp: '1 day ago',
        action: 'Schedule vaccination program',
        animal: 'Multiple animals'
      },
      {
        id: 3,
        type: 'info',
        title: 'Treatment Follow-up',
        message: '5 animals require treatment follow-up',
        location: 'Medical Bay',
        timestamp: '2 days ago',
        action: 'Schedule follow-up examinations',
        animal: 'Various'
      }
    ],
    upcomingTreatments: [
      {
        id: 1,
        animal: 'Luna (L089)',
        type: 'Vaccination',
        treatment: 'Annual booster vaccines',
        veterinarian: 'Dr. Sarah Martinez',
        date: '2025-06-28',
        time: '09:00',
        location: 'Main Barn',
        priority: 'high',
        coordinates: { lat: 17.9896, lng: -92.9475 }
      },
      {
        id: 2,
        animal: 'Thunder (T156)',
        type: 'Check-up',
        treatment: 'Post-injury examination',
        veterinarian: 'Dr. Juan Rodriguez',
        date: '2025-06-29',
        time: '14:30',
        location: 'Medical Facility',
        priority: 'medium',
        coordinates: { lat: 17.9885, lng: -92.9462 }
      },
      {
        id: 3,
        animal: 'Daisy (D234)',
        type: 'Treatment',
        treatment: 'Antibiotic therapy completion',
        veterinarian: 'Dr. Sarah Martinez',
        date: '2025-06-30',
        time: '11:00',
        location: 'Isolation Pen',
        priority: 'high',
        coordinates: { lat: 17.9878, lng: -92.9502 }
      }
    ],
    recentActivity: [
      {
        id: 1,
        type: 'treatment',
        message: 'Completed antibiotic treatment for Molly',
        timestamp: '3 hours ago',
        veterinarian: 'Dr. Martinez',
        location: 'Medical Bay',
        outcome: 'Successful recovery'
      },
      {
        id: 2,
        type: 'vaccination',
        message: 'Vaccinated 15 calves with FMD vaccine',
        timestamp: '1 day ago',
        veterinarian: 'Dr. Rodriguez',
        location: 'Calf Pen',
        outcome: 'No adverse reactions'
      },
      {
        id: 3,
        type: 'checkup',
        message: 'Routine health check for breeding bulls',
        timestamp: '2 days ago',
        veterinarian: 'Dr. Martinez',
        location: 'Bull Pen',
        outcome: 'All animals healthy'
      },
      {
        id: 4,
        type: 'emergency',
        message: 'Emergency treatment for injured cow',
        timestamp: '3 days ago',
        veterinarian: 'Dr. Emergency Vet',
        location: 'Pasture C',
        outcome: 'Stabilized, monitoring'
      }
    ],
    healthMetrics: [
      {
        category: 'Respiratory Issues',
        count: 8,
        percentage: 66.7,
        trend: -12.5,
        severity: 'medium'
      },
      {
        category: 'Digestive Problems',
        count: 3,
        percentage: 25.0,
        trend: 8.3,
        severity: 'low'
      },
      {
        category: 'Injuries',
        count: 2,
        percentage: 16.7,
        trend: -50.0,
        severity: 'high'
      },
      {
        category: 'Infections',
        count: 1,
        percentage: 8.3,
        trend: -75.0,
        severity: 'medium'
      }
    ],
    vaccinationStatus: [
      { vaccine: 'FMD (Foot and Mouth)', coverage: 98.5, due: 3, overdue: 0 },
      { vaccine: 'Brucellosis', coverage: 96.8, due: 8, overdue: 2 },
      { vaccine: 'Clostridial', coverage: 94.2, due: 12, overdue: 2 },
      { vaccine: 'IBR/BVD', coverage: 92.1, due: 15, overdue: 4 }
    ],
    treatmentCosts: {
      thisMonth: 4250.00,
      lastMonth: 3890.00,
      average: 3825.00,
      breakdown: [
        { category: 'Medications', amount: 1650.00 },
        { category: 'Veterinary Fees', amount: 1200.00 },
        { category: 'Preventive Care', amount: 850.00 },
        { category: 'Emergency Care', amount: 550.00 }
      ]
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

  // Obtener color de la alerta
  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Obtener color de prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Obtener icono del tipo de actividad
  const getActivityIcon = (type) => {
    switch (type) {
      case 'treatment': return Pill;
      case 'vaccination': return Syringe;
      case 'checkup': return Stethoscope;
      case 'emergency': return AlertTriangle;
      default: return Activity;
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading health dashboard...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Health Dashboard</h1>
              <div className="text-sm text-gray-600">
                Comprehensive livestock health monitoring and management
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="all">All Animals</option>
                <option value="healthy">Healthy Only</option>
                <option value="sick">Sick Only</option>
                <option value="treatment">Under Treatment</option>
                <option value="quarantine">Quarantined</option>
              </select>

              {/* Time Range Selector */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
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
          {/* Main Health Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Healthy Animals */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Healthy Animals</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-green-900"
                  >
                    {data.overview.healthyAnimals}
                  </motion.p>
                  {data.trends && (
                    <div className="flex items-center mt-2">
                      {getTrendIcon(data.trends.healthyChange) &&
                        React.createElement(getTrendIcon(data.trends.healthyChange), {
                          className: `w-4 h-4 mr-1 ${getTrendColor(data.trends.healthyChange)}`
                        })
                      }
                      <span className={`text-sm ${getTrendColor(data.trends.healthyChange)}`}>
                        {Math.abs(data.trends.healthyChange)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            {/* Sick Animals */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sick Animals</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-red-900"
                  >
                    {data.overview.sickAnimals}
                  </motion.p>
                  {data.trends && (
                    <div className="flex items-center mt-2">
                      {getTrendIcon(data.trends.sickChange) &&
                        React.createElement(getTrendIcon(data.trends.sickChange), {
                          className: `w-4 h-4 mr-1 ${getTrendColor(data.trends.sickChange)}`
                        })
                      }
                      <span className={`text-sm ${getTrendColor(data.trends.sickChange)}`}>
                        {Math.abs(data.trends.sickChange)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </motion.div>

            {/* Quarantined Animals */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Quarantined</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-orange-900"
                  >
                    {data.overview.quarantinedAnimals}
                  </motion.p>
                  {data.trends && (
                    <div className="flex items-center mt-2">
                      {getTrendIcon(data.trends.quarantineChange) &&
                        React.createElement(getTrendIcon(data.trends.quarantineChange), {
                          className: `w-4 h-4 mr-1 ${getTrendColor(data.trends.quarantineChange)}`
                        })
                      }
                      <span className={`text-sm ${getTrendColor(data.trends.quarantineChange)}`}>
                        {Math.abs(data.trends.quarantineChange)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </motion.div>

            {/* Vaccination Coverage */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vaccination Coverage</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-blue-900"
                  >
                    {data.overview.vaccinationCoverage}%
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-2">
                    Target: 95%
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Syringe className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Treatment Compliance</h3>
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600">{data.overview.treatmentCompliance}%</p>
                <p className="text-sm text-gray-600 mt-1">adherence rate</p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Mortality Rate</h3>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-red-600">{data.overview.mortalityRate}%</p>
                <p className="text-sm text-gray-600 mt-1">this period</p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recovery Time</h3>
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">{data.overview.averageRecoveryTime}</p>
                <p className="text-sm text-gray-600 mt-1">days average</p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Treatment Costs</h3>
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{formatCurrency(data.treatmentCosts.thisMonth)}</p>
                <p className="text-sm text-gray-600 mt-1">this month</p>
              </div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Health Alerts and Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Critical Health Alerts */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Health Alerts</h3>
                  <Link
                    to="/health/alerts"
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    View All Alerts
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {data.healthAlerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: alert.id * 0.1 }}
                      className={`border-l-4 p-4 rounded-r-lg ${getAlertColor(alert.type)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {alert.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {alert.message}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {alert.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {alert.timestamp}
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-700 mt-2">
                            Action: {alert.action}
                          </p>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Health Activity */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Health Activity</h3>
                  <Link
                    to="/health/activity"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Activity
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {data.recentActivity.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: activity.id * 0.1 }}
                      className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        {React.createElement(getActivityIcon(activity.type), {
                          className: "w-4 h-4 text-blue-600"
                        })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.message}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>{activity.timestamp}</span>
                          <span className="mx-2">•</span>
                          <span>{activity.veterinarian}</span>
                          <span className="mx-2">•</span>
                          <span>{activity.location}</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1 font-medium">
                          {activity.outcome}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Treatments */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Treatments</h3>
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                
                <div className="space-y-3">
                  {data.upcomingTreatments.map((treatment) => (
                    <div
                      key={treatment.id}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{treatment.animal}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(treatment.priority)}`}>
                          {treatment.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{treatment.treatment}</p>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(treatment.date).toLocaleDateString()} at {treatment.time}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{treatment.location}</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1 font-medium">
                        Dr. {treatment.veterinarian}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  to="/health/treatments/schedule"
                  className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-4 pt-3 border-t border-gray-200"
                >
                  View Full Schedule
                </Link>
              </motion.div>

              {/* Vaccination Status */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Vaccination Status</h3>
                  <Syringe className="w-5 h-5 text-purple-600" />
                </div>
                
                <div className="space-y-3">
                  {data.vaccinationStatus.map((vaccine, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{vaccine.vaccine}</h4>
                        <span className="text-sm font-bold text-green-600">{vaccine.coverage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${vaccine.coverage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Due: {vaccine.due}</span>
                        <span className="text-red-600">Overdue: {vaccine.overdue}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/health/vaccination-schedule"
                  className="block text-center text-sm text-purple-600 hover:text-purple-700 font-medium mt-4 pt-3 border-t border-gray-200"
                >
                  Manage Vaccinations
                </Link>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Link
                    to="/health/treatments/add"
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Treatment
                  </Link>
                  
                  <Link
                    to="/health/vaccination-schedule/add"
                    className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <Syringe className="w-4 h-4 mr-2" />
                    Schedule Vaccination
                  </Link>
                  
                  <Link
                    to="/health/veterinary-consults/add"
                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Book Vet Consult
                  </Link>
                  
                  <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    <Download className="w-4 h-4 mr-2" />
                    Health Report
                  </button>
                </div>
              </motion.div>

              {/* Health Metrics Breakdown */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Health Issues</h3>
                  <PieChart className="w-5 h-5 text-orange-600" />
                </div>
                
                <div className="space-y-3">
                  {data.healthMetrics.map((metric, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{metric.category}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-gray-700">{metric.count}</span>
                          <span className={`text-xs ${getTrendColor(metric.trend)}`}>
                            {metric.trend > 0 ? '+' : ''}{metric.trend}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            metric.severity === 'high' ? 'bg-red-500' :
                            metric.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${metric.percentage}%` }}
                        ></div>
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

export default HealthDashboard;