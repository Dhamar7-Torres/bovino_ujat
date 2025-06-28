import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Estados para manejar los datos del dashboard
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');

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
      const response = await fetch(`/api/dashboard?timeRange=${selectedTimeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load dashboard data');
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
    stats: {
      totalBovines: 247,
      healthyBovines: 231,
      sickBovines: 8,
      pregnantBovines: 15,
      newBirths: 3,
      averageWeight: 485.2,
      totalFarms: 1,
      activeAlerts: 5
    },
    trends: {
      bovinesChange: 5.2,
      healthyChange: 2.1,
      weightChange: -1.3,
      birthsChange: 50.0
    },
    recentActivity: [
      {
        id: 1,
        type: 'birth',
        message: 'New calf born - Daisy Jr.',
        timestamp: '2 hours ago',
        icon: Baby,
        color: 'text-blue-600'
      },
      {
        id: 2,
        type: 'health',
        message: 'Bella marked as sick - requires attention',
        timestamp: '4 hours ago',
        icon: AlertCircle,
        color: 'text-red-600'
      },
      {
        id: 3,
        type: 'vaccination',
        message: 'Vaccination completed for 15 bovines',
        timestamp: '1 day ago',
        icon: Zap,
        color: 'text-green-600'
      },
      {
        id: 4,
        type: 'weight',
        message: 'Weight updated for Thunder - 520kg',
        timestamp: '2 days ago',
        icon: Scale,
        color: 'text-purple-600'
      },
      {
        id: 5,
        type: 'health',
        message: 'Molly recovered and marked as healthy',
        timestamp: '3 days ago',
        icon: CheckCircle,
        color: 'text-green-600'
      }
    ],
    urgentAlerts: [
      {
        id: 1,
        title: 'Health Check Overdue',
        description: '3 bovines need immediate health checkups',
        priority: 'high',
        action: 'Schedule Checkup'
      },
      {
        id: 2,
        title: 'Vaccination Due',
        description: '12 bovines due for vaccination this week',
        priority: 'medium',
        action: 'Schedule Vaccination'
      },
      {
        id: 3,
        title: 'Feed Inventory Low',
        description: 'Current feed supply will last only 5 days',
        priority: 'medium',
        action: 'Order Feed'
      }
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Pregnancy Check',
        date: '2025-06-30',
        time: '09:00',
        bovines: ['Bella', 'Luna', 'Sophie'],
        type: 'health'
      },
      {
        id: 2,
        title: 'Vaccination Round',
        date: '2025-07-02',
        time: '14:00',
        bovines: ['Group A - 15 bovines'],
        type: 'vaccination'
      },
      {
        id: 3,
        title: 'Weight Monitoring',
        date: '2025-07-05',
        time: '08:00',
        bovines: ['All breeding stock'],
        type: 'monitoring'
      }
    ]
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
    return null;
  };

  // Obtener color de prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
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
            <p className="text-gray-600">Loading dashboard...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="text-sm text-gray-600">
                Welcome back! Here's what's happening with your livestock.
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Time Range Selector */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="24hours">Last 24 Hours</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Bovines */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bovines</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {data.stats.totalBovines}
                  </motion.p>
                  {data.trends && (
                    <div className="flex items-center mt-2">
                      {getTrendIcon(data.trends.bovinesChange) && 
                        React.createElement(getTrendIcon(data.trends.bovinesChange), {
                          className: `w-4 h-4 mr-1 ${getTrendColor(data.trends.bovinesChange)}`
                        })
                      }
                      <span className={`text-sm ${getTrendColor(data.trends.bovinesChange)}`}>
                        {Math.abs(data.trends.bovinesChange)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Cow className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            {/* Healthy Bovines */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Healthy</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-green-900"
                  >
                    {data.stats.healthyBovines}
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-2">
                    {((data.stats.healthyBovines / data.stats.totalBovines) * 100).toFixed(1)}% of total
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            {/* Sick Bovines */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Need Attention</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-red-900"
                  >
                    {data.stats.sickBovines}
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-2">
                    Requires immediate care
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </motion.div>

            {/* Pregnant Bovines */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pregnant</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-purple-900"
                  >
                    {data.stats.pregnantBovines}
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-2">
                    Expected births upcoming
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Baby className="w-6 h-6 text-purple-600" />
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
                <h3 className="text-lg font-semibold text-gray-900">Recent Births</h3>
                <Baby className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{data.stats.newBirths}</p>
                <p className="text-sm text-gray-600 mt-1">In the last 30 days</p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Average Weight</h3>
                <Scale className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">{data.stats.averageWeight}</p>
                <p className="text-sm text-gray-600 mt-1">kg per bovine</p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-600">{data.stats.activeAlerts}</p>
                <p className="text-sm text-gray-600 mt-1">Require attention</p>
              </div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <Link
                    to="/activity"
                    className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
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
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100`}>
                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.timestamp}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Alerts and Actions */}
            <div className="space-y-6">
              {/* Urgent Alerts */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Urgent Alerts</h3>
                  <Bell className="w-5 h-5 text-red-600" />
                </div>
                
                <div className="space-y-3">
                  {data.urgentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`border-l-4 p-3 rounded-r-lg ${getPriorityColor(alert.priority)}`}
                    >
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {alert.description}
                      </p>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        {alert.action}
                      </button>
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
                    to="/bovines/add"
                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Bovine
                  </Link>
                  
                  <Link
                    to="/health-records/add"
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Add Health Record
                  </Link>
                  
                  <Link
                    to="/vaccinations/add"
                    className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Schedule Vaccination
                  </Link>
                  
                  <Link
                    to="/analytics"
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Upcoming Events */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
              <Link
                to="/calendar"
                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center"
              >
                View Calendar
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.upcomingEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: event.id * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </div>
                  <p className="text-sm text-gray-500">
                    {event.bovines.join(', ')}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;