// Frontend/src/pages/inventory/InventoryDashboard.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
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
  Bell,
  ArrowRight,
  RefreshCw,
  ShoppingCart,
  Truck,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Award,
  Clipboard,
  Timer,
  AlertCircle,
  Info,
  Star,
  Building,
  Pill,
  Syringe,
  Stethoscope,
  Shield,
  Microscope,
  Bandage,
  Download,
  FileText,
  Search,
  Filter,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const InventoryDashboard = () => {
  // Estados para manejar los datos del dashboard de inventario
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
  }, [selectedTimeRange, selectedCategory]);

  // Obtener datos del dashboard de inventario
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/inventory/dashboard?timeRange=${selectedTimeRange}&category=${selectedCategory}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load inventory dashboard data');
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
      totalItems: 234,
      totalValue: 45750.50,
      lowStockItems: 18,
      expiredItems: 5,
      nearExpiryItems: 12,
      totalSuppliers: 8,
      recentOrders: 15,
      averageStockLevel: 68.5
    },
    trends: {
      valueChange: 8.2,
      stockChange: -5.3,
      orderChange: 12.5,
      expiryChange: -25.0
    },
    stockAlerts: [
      {
        id: 1,
        type: 'critical',
        title: 'Critical Stock Level',
        message: 'Penicillin G - Only 2 units remaining',
        item: 'Penicillin G',
        currentStock: 2,
        minimumStock: 10,
        action: 'Reorder immediately',
        supplier: 'VetPharm Solutions',
        category: 'Antibiotics'
      },
      {
        id: 2,
        type: 'warning',
        title: 'Low Stock Alert',
        message: '8 items below recommended levels',
        item: 'Multiple items',
        currentStock: null,
        minimumStock: null,
        action: 'Review inventory levels',
        supplier: 'Various',
        category: 'Multiple'
      },
      {
        id: 3,
        type: 'expired',
        title: 'Expired Items',
        message: '5 items have expired and need disposal',
        item: 'Various expired medications',
        currentStock: 5,
        minimumStock: null,
        action: 'Schedule disposal',
        supplier: 'Various',
        category: 'Expired'
      },
      {
        id: 4,
        type: 'expiring',
        title: 'Items Near Expiry',
        message: '12 items expiring within 30 days',
        item: 'Various medications',
        currentStock: 12,
        minimumStock: null,
        action: 'Use priority or disposal',
        supplier: 'Various',
        category: 'Near Expiry'
      }
    ],
    recentActivity: [
      {
        id: 1,
        type: 'order_received',
        message: 'Received order from MedVet Supplies - 25 items',
        timestamp: '2 hours ago',
        user: 'Dr. Martinez',
        value: 1250.75,
        items: 25
      },
      {
        id: 2,
        type: 'stock_used',
        message: 'Used Ivermectin for cattle treatment',
        timestamp: '4 hours ago',
        user: 'Veterinary Team',
        value: 45.50,
        items: 3
      },
      {
        id: 3,
        type: 'order_placed',
        message: 'Placed emergency order for antibiotics',
        timestamp: '1 day ago',
        user: 'Dr. Rodriguez',
        value: 875.25,
        items: 15
      },
      {
        id: 4,
        type: 'stock_adjustment',
        message: 'Inventory count adjustment - Feed supplements',
        timestamp: '2 days ago',
        user: 'Inventory Manager',
        value: -125.00,
        items: -5
      },
      {
        id: 5,
        type: 'expiry_removed',
        message: 'Removed expired vaccines from inventory',
        timestamp: '3 days ago',
        user: 'Safety Officer',
        value: -245.80,
        items: -8
      }
    ],
    topCategories: [
      {
        category: 'Antibiotics',
        totalItems: 45,
        totalValue: 12850.75,
        percentage: 28.1,
        trend: 5.2,
        lowStockItems: 3
      },
      {
        category: 'Vaccines',
        totalItems: 38,
        totalValue: 9640.50,
        percentage: 21.1,
        trend: -2.8,
        lowStockItems: 2
      },
      {
        category: 'Pain Management',
        totalItems: 32,
        totalValue: 8920.25,
        percentage: 19.5,
        trend: 8.7,
        lowStockItems: 4
      },
      {
        category: 'Nutritional Supplements',
        totalItems: 28,
        totalValue: 6750.40,
        percentage: 14.8,
        trend: 12.3,
        lowStockItems: 1
      },
      {
        category: 'Surgical Supplies',
        totalItems: 25,
        totalValue: 4880.30,
        percentage: 10.7,
        trend: -1.5,
        lowStockItems: 5
      },
      {
        category: 'Diagnostic Equipment',
        totalItems: 18,
        totalValue: 2708.30,
        percentage: 5.9,
        trend: 3.1,
        lowStockItems: 3
      }
    ],
    upcomingOrders: [
      {
        id: 1,
        supplier: 'VetPharm Solutions',
        orderDate: '2025-06-28',
        deliveryDate: '2025-06-30',
        items: 12,
        totalValue: 1456.75,
        status: 'confirmed',
        priority: 'high'
      },
      {
        id: 2,
        supplier: 'MedVet Supplies',
        orderDate: '2025-06-29',
        deliveryDate: '2025-07-02',
        items: 8,
        totalValue: 892.50,
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 3,
        supplier: 'Farm Supply Co.',
        orderDate: '2025-07-01',
        deliveryDate: '2025-07-05',
        items: 20,
        totalValue: 2340.80,
        status: 'draft',
        priority: 'low'
      }
    ],
    stockMovement: [
      { date: '2025-06-20', inbound: 45, outbound: 32, value: 1250.75 },
      { date: '2025-06-21', inbound: 12, outbound: 28, value: -456.80 },
      { date: '2025-06-22', inbound: 38, outbound: 15, value: 1820.50 },
      { date: '2025-06-23', inbound: 8, outbound: 42, value: -1120.25 },
      { date: '2025-06-24', inbound: 52, outbound: 18, value: 2150.90 },
      { date: '2025-06-25', inbound: 15, outbound: 35, value: -680.45 },
      { date: '2025-06-26', inbound: 28, outbound: 22, value: 890.75 }
    ],
    costAnalysis: {
      totalSpent: 15750.80,
      budgetUsed: 68.5,
      averageOrderValue: 1050.25,
      costSavings: 2340.50,
      breakdown: [
        { category: 'Medications', amount: 8950.75, percentage: 56.8 },
        { category: 'Vaccines', amount: 3240.50, percentage: 20.6 },
        { category: 'Supplements', amount: 2180.25, percentage: 13.8 },
        { category: 'Equipment', amount: 1379.30, percentage: 8.8 }
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
    return null;
  };

  // Obtener color de la alerta
  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'expired': return 'border-l-purple-500 bg-purple-50';
      case 'expiring': return 'border-l-orange-500 bg-orange-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Obtener icono del tipo de actividad
  const getActivityIcon = (type) => {
    switch (type) {
      case 'order_received': return Truck;
      case 'stock_used': return ArrowDownRight;
      case 'order_placed': return ShoppingCart;
      case 'stock_adjustment': return Settings;
      case 'expiry_removed': return AlertTriangle;
      default: return Activity;
    }
  };

  // Obtener icono de la categoría
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Antibiotics': return Pill;
      case 'Vaccines': return Syringe;
      case 'Pain Management': return Heart;
      case 'Nutritional Supplements': return Zap;
      case 'Surgical Supplies': return Stethoscope;
      case 'Diagnostic Equipment': return Microscope;
      default: return Package;
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
            <p className="text-gray-600">Loading inventory dashboard...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
              <div className="text-sm text-gray-600">
                Comprehensive livestock inventory management and tracking
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="all">All Categories</option>
                <option value="antibiotics">Antibiotics</option>
                <option value="vaccines">Vaccines</option>
                <option value="supplements">Supplements</option>
                <option value="equipment">Equipment</option>
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
          {/* Main Inventory Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Items */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {data.overview.totalItems}
                  </motion.p>
                  {data.trends && (
                    <div className="flex items-center mt-2">
                      {getTrendIcon(data.trends.stockChange) &&
                        React.createElement(getTrendIcon(data.trends.stockChange), {
                          className: `w-4 h-4 mr-1 ${getTrendColor(data.trends.stockChange)}`
                        })
                      }
                      <span className={`text-sm ${getTrendColor(data.trends.stockChange)}`}>
                        {Math.abs(data.trends.stockChange)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            {/* Total Value */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-green-900"
                  >
                    {formatCurrency(data.overview.totalValue)}
                  </motion.p>
                  {data.trends && (
                    <div className="flex items-center mt-2">
                      {getTrendIcon(data.trends.valueChange) &&
                        React.createElement(getTrendIcon(data.trends.valueChange), {
                          className: `w-4 h-4 mr-1 ${getTrendColor(data.trends.valueChange)}`
                        })
                      }
                      <span className={`text-sm ${getTrendColor(data.trends.valueChange)}`}>
                        {Math.abs(data.trends.valueChange)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            {/* Low Stock Items */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-orange-900"
                  >
                    {data.overview.lowStockItems}
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-2">
                    Require attention
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </motion.div>

            {/* Expired Items */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expired Items</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-red-900"
                  >
                    {data.overview.expiredItems}
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-2">
                    Need disposal
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
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
                <h3 className="text-lg font-semibold text-gray-900">Near Expiry</h3>
                <Timer className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-yellow-600">{data.overview.nearExpiryItems}</p>
                <p className="text-sm text-gray-600 mt-1">within 30 days</p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Suppliers</h3>
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600">{data.overview.totalSuppliers}</p>
                <p className="text-sm text-gray-600 mt-1">active partners</p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <ShoppingCart className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-indigo-600">{data.overview.recentOrders}</p>
                <p className="text-sm text-gray-600 mt-1">this month</p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Stock Level</h3>
                <BarChart3 className="w-5 h-5 text-teal-600" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-teal-600">{data.overview.averageStockLevel}%</p>
                <p className="text-sm text-gray-600 mt-1">average level</p>
              </div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stock Alerts and Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Critical Stock Alerts */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Stock Alerts</h3>
                  <Link
                    to="/inventory/alerts"
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    View All Alerts
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {data.stockAlerts.map((alert) => (
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
                              <Package className="w-3 h-3 mr-1" />
                              {alert.item}
                            </div>
                            <div className="flex items-center">
                              <Building className="w-3 h-3 mr-1" />
                              {alert.supplier}
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

              {/* Recent Inventory Activity */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <Link
                    to="/inventory/activity"
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
                          <span>{activity.user}</span>
                          {activity.value !== 0 && (
                            <>
                              <span className="mx-2">•</span>
                              <span className={activity.value > 0 ? 'text-green-600' : 'text-red-600'}>
                                {activity.value > 0 ? '+' : ''}{formatCurrency(activity.value)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Top Categories */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
                  <PieChart className="w-5 h-5 text-blue-600" />
                </div>
                
                <div className="space-y-3">
                  {data.topCategories.slice(0, 5).map((category, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {React.createElement(getCategoryIcon(category.category), {
                            className: "w-4 h-4 text-gray-600"
                          })}
                          <h4 className="font-medium text-gray-900 text-sm">{category.category}</h4>
                        </div>
                        <span className="text-sm font-bold text-green-600">
                          {formatCurrency(category.totalValue)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>{category.totalItems} items</span>
                        <span className={getTrendColor(category.trend)}>
                          {category.trend > 0 ? '+' : ''}{category.trend}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      {category.lowStockItems > 0 && (
                        <div className="mt-2 text-xs text-orange-600">
                          {category.lowStockItems} items low stock
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Link
                  to="/inventory/categories"
                  className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-4 pt-3 border-t border-gray-200"
                >
                  View All Categories
                </Link>
              </motion.div>

              {/* Upcoming Orders */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Orders</h3>
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                
                <div className="space-y-3">
                  {data.upcomingOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{order.supplier}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'confirmed' ? 'text-green-600 bg-green-100' :
                          order.status === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                          'text-gray-600 bg-gray-100'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{order.items} items</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(order.totalValue)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/inventory/supply-orders"
                  className="block text-center text-sm text-green-600 hover:text-green-700 font-medium mt-4 pt-3 border-t border-gray-200"
                >
                  View All Orders
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
                    to="/inventory/add"
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Inventory Item
                  </Link>
                  
                  <Link
                    to="/inventory/supply-orders/add"
                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Place Order
                  </Link>
                  
                  <Link
                    to="/inventory/medicine-stock"
                    className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <Pill className="w-4 h-4 mr-2" />
                    Medicine Stock
                  </Link>
                  
                  <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </button>
                </div>
              </motion.div>

              {/* Cost Analysis Summary */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Cost Analysis</h3>
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Spent</span>
                    <span className="font-medium">{formatCurrency(data.costAnalysis.totalSpent)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Budget Used</span>
                    <span className="font-medium">{data.costAnalysis.budgetUsed}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Order Value</span>
                    <span className="font-medium">{formatCurrency(data.costAnalysis.averageOrderValue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cost Savings</span>
                    <span className="font-medium text-green-600">{formatCurrency(data.costAnalysis.costSavings)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Spending Breakdown</h4>
                  <div className="space-y-2">
                    {data.costAnalysis.breakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{item.category}</span>
                        <span className="font-medium">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InventoryDashboard;