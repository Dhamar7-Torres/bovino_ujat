import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Cow,
  Heart,
  Scale,
  Activity,
  AlertCircle,
  CheckCircle,
  Baby,
  Users,
  DollarSign,
  Target,
  Award,
  Filter,
  Download,
  RefreshCw,
  Eye,
  ArrowRight,
  Info,
  Zap,
  Clock,
  Building2,
  Thermometer
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Overview = () => {
  // Estados para manejar los datos y la UI
  const [overviewData, setOverviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('health');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [viewMode, setViewMode] = useState('summary'); // 'summary' or 'detailed'

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

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, delay: 0.2 }
    }
  };

  // Cargar datos del overview al montar el componente
  useEffect(() => {
    fetchOverviewData();
  }, [selectedMetric, selectedPeriod]);

  // Obtener datos del overview
  const fetchOverviewData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/overview?metric=${selectedMetric}&period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOverviewData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load overview data');
      }
    } catch (error) {
      console.error('Fetch overview error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos de ejemplo mientras se carga la API real
  const mockData = {
    summary: {
      totalValue: 1235000, // Valor total del ganado
      monthlyGrowth: 8.2,
      efficiency: 94.5,
      mortality: 1.2,
      reproduction: 89.3,
      feedCost: 45280,
      revenue: 156890,
      profit: 111610
    },
    healthDistribution: [
      { status: 'Healthy', count: 231, percentage: 93.5, color: '#10B981' },
      { status: 'Sick', count: 8, percentage: 3.2, color: '#EF4444' },
      { status: 'Injured', count: 3, percentage: 1.2, color: '#F59E0B' },
      { status: 'Pregnant', count: 15, percentage: 6.1, color: '#8B5CF6' },
      { status: 'Lactating', count: 12, percentage: 4.9, color: '#EC4899' }
    ],
    ageDistribution: [
      { range: '0-6 months', count: 45, percentage: 18.2 },
      { range: '6-12 months', count: 38, percentage: 15.4 },
      { range: '1-2 years', count: 52, percentage: 21.1 },
      { range: '2-5 years', count: 89, percentage: 36.0 },
      { range: '5+ years', count: 23, percentage: 9.3 }
    ],
    breedDistribution: [
      { breed: 'Holstein', count: 89, percentage: 36.0 },
      { breed: 'Angus', count: 67, percentage: 27.1 },
      { breed: 'Hereford', count: 43, percentage: 17.4 },
      { breed: 'Charolais', count: 28, percentage: 11.3 },
      { breed: 'Others', count: 20, percentage: 8.1 }
    ],
    monthlyTrends: [
      { month: 'Jan', births: 8, deaths: 1, vaccinations: 45, weight: 465 },
      { month: 'Feb', births: 12, deaths: 0, vaccinations: 52, weight: 468 },
      { month: 'Mar', births: 15, deaths: 2, vaccinations: 38, weight: 472 },
      { month: 'Apr', births: 18, deaths: 1, vaccinations: 67, weight: 475 },
      { month: 'May', births: 22, deaths: 0, vaccinations: 43, weight: 478 },
      { month: 'Jun', births: 19, deaths: 1, vaccinations: 58, weight: 481 }
    ],
    performanceMetrics: [
      {
        name: 'Feed Efficiency',
        current: 94.5,
        target: 95.0,
        trend: 2.3,
        unit: '%',
        status: 'good'
      },
      {
        name: 'Reproduction Rate',
        current: 89.3,
        target: 90.0,
        trend: 5.1,
        unit: '%',
        status: 'excellent'
      },
      {
        name: 'Mortality Rate',
        current: 1.2,
        target: 2.0,
        trend: -0.8,
        unit: '%',
        status: 'excellent'
      },
      {
        name: 'Average Daily Gain',
        current: 1.4,
        target: 1.5,
        trend: 0.2,
        unit: 'kg',
        status: 'good'
      },
      {
        name: 'Milk Production',
        current: 28.5,
        target: 30.0,
        trend: 1.8,
        unit: 'L/day',
        status: 'good'
      },
      {
        name: 'Cost per Head',
        current: 183,
        target: 180,
        trend: -5.2,
        unit: '$',
        status: 'warning'
      }
    ],
    alerts: {
      critical: 2,
      warning: 5,
      info: 8
    },
    upcomingTasks: 15,
    farmLocations: [
      {
        name: 'Main Farm',
        bovines: 186,
        coordinates: [40.7128, -74.0060],
        status: 'active'
      },
      {
        name: 'North Pasture',
        bovines: 61,
        coordinates: [40.7589, -73.9851],
        status: 'active'
      }
    ]
  };

  // Usar datos mock si no hay datos reales disponibles
  const data = overviewData || mockData;

  // Obtener color del estado de performance
  const getPerformanceColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Obtener icono del trend
  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return null;
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
            <p className="text-gray-600">Loading overview data...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Farm Overview</h1>
              <div className="text-sm text-gray-600">
                Comprehensive analysis of your livestock operations
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Metric Selector */}
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="health">Health Metrics</option>
                <option value="production">Production</option>
                <option value="financial">Financial</option>
                <option value="breeding">Breeding</option>
              </select>

              {/* Period Selector */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('summary')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'summary' 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'detailed' 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Detailed
                </button>
              </div>

              <button
                onClick={fetchOverviewData}
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
          {/* Key Financial Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${data.summary.totalValue.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(data.summary.monthlyGrowth)}
                    <span className="text-sm text-green-600 ml-1">
                      {data.summary.monthlyGrowth}% growth
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${data.summary.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">This month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Feed Costs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${data.summary.feedCost.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">This month</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Scale className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Profit</p>
                  <p className="text-2xl font-bold text-green-900">
                    ${data.summary.profit.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">This month</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Health Distribution Chart */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Health Distribution</h3>
                <PieChart className="w-5 h-5 text-gray-600" />
              </div>
              
              <motion.div
                variants={chartVariants}
                className="space-y-4"
              >
                {data.healthDistribution.map((item, index) => (
                  <motion.div
                    key={item.status}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {item.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {item.count}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.percentage}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              variants={cardVariants}
              className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                <BarChart3 className="w-5 h-5 text-gray-600" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.performanceMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        {metric.name}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(metric.status)}`}>
                        {metric.status}
                      </span>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {metric.current}{metric.unit}
                        </div>
                        <div className="text-xs text-gray-500">
                          Target: {metric.target}{metric.unit}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {getTrendIcon(metric.trend)}
                        <span className={`text-sm ml-1 ${
                          metric.trend > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {Math.abs(metric.trend)}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, (metric.current / metric.target) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Age and Breed Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Age Distribution */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Age Distribution</h3>
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              
              <div className="space-y-4">
                {data.ageDistribution.map((item, index) => (
                  <motion.div
                    key={item.range}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {item.range}
                        </span>
                        <span className="text-sm text-gray-600">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Breed Distribution */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Breed Distribution</h3>
                <Cow className="w-5 h-5 text-gray-600" />
              </div>
              
              <div className="space-y-4">
                {data.breedDistribution.map((item, index) => (
                  <motion.div
                    key={item.breed}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {item.breed}
                        </span>
                        <span className="text-sm text-gray-600">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Farm Locations and Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Farm Locations */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Farm Locations</h3>
                <MapPin className="w-5 h-5 text-gray-600" />
              </div>
              
              <div className="space-y-4">
                {data.farmLocations.map((location, index) => (
                  <motion.div
                    key={location.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{location.name}</h4>
                      <span className={`w-2 h-2 rounded-full ${
                        location.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Cow className="w-4 h-4 mr-1" />
                      {location.bovines} bovines
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              variants={cardVariants}
              className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
                <Activity className="w-5 h-5 text-gray-600" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-600">{data.alerts.critical}</div>
                  <div className="text-xs text-gray-600">Critical Alerts</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Info className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">{data.alerts.warning}</div>
                  <div className="text-xs text-gray-600">Warnings</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{data.upcomingTasks}</div>
                  <div className="text-xs text-gray-600">Upcoming Tasks</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{data.summary.efficiency}</div>
                  <div className="text-xs text-gray-600">Efficiency %</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <div className="flex items-center space-x-2">
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <Download className="w-4 h-4 mr-1" />
                  Export Report
                </button>
                <Link
                  to="/analytics"
                  className="flex items-center text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Advanced Analytics
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/bovines"
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
              >
                <Eye className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium">View All Bovines</span>
              </Link>
              
              <Link
                to="/health-records"
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
              >
                <Heart className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm font-medium">Health Records</span>
              </Link>
              
              <Link
                to="/vaccinations"
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
              >
                <Zap className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium">Vaccinations</span>
              </Link>
              
              <Link
                to="/reports"
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
              >
                <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium">Generate Report</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;