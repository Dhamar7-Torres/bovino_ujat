// Frontend/src/pages/finances/FinanceDashboard.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Calendar,
  MapPin,
  Plus,
  Eye,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Wallet,
  Building,
  ShoppingCart,
  Truck,
  Heart,
  Cow,
  Zap,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FinanceDashboard = () => {
  // Estados para manejar los datos del dashboard financiero
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

  // Obtener datos del dashboard financiero
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/finances/dashboard?timeRange=${selectedTimeRange}&category=${selectedCategory}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load financial dashboard data');
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
    summary: {
      totalRevenue: 125450.00,
      totalExpenses: 89320.50,
      netIncome: 36129.50,
      profitMargin: 28.8,
      averageTransactionSize: 1245.75,
      totalTransactions: 156
    },
    trends: {
      revenueChange: 12.5,
      expensesChange: -8.3,
      netIncomeChange: 45.2,
      profitMarginChange: 3.1
    },
    topCategories: {
      income: [
        { name: 'Livestock Sales', amount: 75200.00, percentage: 60, icon: Cow, color: 'text-green-600' },
        { name: 'Milk Production', amount: 28150.00, percentage: 22.4, icon: DollarSign, color: 'text-blue-600' },
        { name: 'Breeding Services', amount: 15800.00, percentage: 12.6, icon: Heart, color: 'text-pink-600' },
        { name: 'Feed Sales', amount: 6300.00, percentage: 5, icon: ShoppingCart, color: 'text-yellow-600' }
      ],
      expenses: [
        { name: 'Feed & Nutrition', amount: 32450.00, percentage: 36.3, icon: ShoppingCart, color: 'text-orange-600' },
        { name: 'Veterinary Care', amount: 18750.00, percentage: 21, icon: Heart, color: 'text-red-600' },
        { name: 'Equipment & Maintenance', amount: 15420.00, percentage: 17.3, icon: Truck, color: 'text-gray-600' },
        { name: 'Labor Costs', amount: 12200.00, percentage: 13.7, icon: Users, color: 'text-purple-600' },
        { name: 'Utilities & Infrastructure', amount: 10500.50, percentage: 11.7, icon: Zap, color: 'text-blue-600' }
      ]
    },
    recentTransactions: [
      {
        id: 1,
        type: 'income',
        category: 'Livestock Sales',
        amount: 8500.00,
        description: 'Sale of 5 mature bulls',
        date: '2025-06-26',
        location: 'Main Ranch',
        paymentMethod: 'Bank Transfer'
      },
      {
        id: 2,
        type: 'expense',
        category: 'Veterinary Care',
        amount: 850.00,
        description: 'Vaccination program for herd',
        date: '2025-06-25',
        location: 'North Pasture',
        paymentMethod: 'Credit Card'
      },
      {
        id: 3,
        type: 'income',
        category: 'Milk Production',
        amount: 2340.00,
        description: 'Weekly milk sales to dairy co-op',
        date: '2025-06-24',
        location: 'Dairy Facility',
        paymentMethod: 'Direct Deposit'
      },
      {
        id: 4,
        type: 'expense',
        category: 'Feed & Nutrition',
        amount: 3200.00,
        description: 'Premium cattle feed delivery',
        date: '2025-06-23',
        location: 'Feed Storage',
        paymentMethod: 'Cash'
      },
      {
        id: 5,
        type: 'expense',
        category: 'Equipment',
        amount: 1250.00,
        description: 'Fence repair materials',
        date: '2025-06-22',
        location: 'West Boundary',
        paymentMethod: 'Credit Card'
      }
    ],
    alerts: [
      {
        id: 1,
        type: 'warning',
        title: 'High Feed Costs',
        message: 'Feed expenses have increased 15% this month',
        priority: 'medium',
        date: '2025-06-26'
      },
      {
        id: 2,
        type: 'success',
        title: 'Revenue Target Met',
        message: 'Monthly revenue goal exceeded by 8%',
        priority: 'low',
        date: '2025-06-25'
      },
      {
        id: 3,
        type: 'info',
        title: 'Tax Report Due',
        message: 'Quarterly tax filing due in 10 days',
        priority: 'high',
        date: '2025-06-24'
      }
    ],
    monthlyComparison: [
      { month: 'Jan', income: 98500, expenses: 72000, net: 26500 },
      { month: 'Feb', income: 105200, expenses: 78500, net: 26700 },
      { month: 'Mar', income: 112800, expenses: 82300, net: 30500 },
      { month: 'Apr', income: 118400, expenses: 85600, net: 32800 },
      { month: 'May', income: 121300, expenses: 87200, net: 34100 },
      { month: 'Jun', income: 125450, expenses: 89320, net: 36130 }
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

  // Obtener color de la alerta
  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
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
            <p className="text-gray-600">Loading financial dashboard...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
              <div className="text-sm text-gray-600">
                Comprehensive financial overview and analytics
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
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
                <option value="ytd">Year to Date</option>
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
          {/* Main Financial Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    className="text-3xl font-bold text-green-900"
                  >
                    {formatCurrency(data.summary.totalRevenue)}
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
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            {/* Total Expenses */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-red-900"
                  >
                    {formatCurrency(data.summary.totalExpenses)}
                  </motion.p>
                  {data.trends && (
                    <div className="flex items-center mt-2">
                      {getTrendIcon(data.trends.expensesChange) &&
                        React.createElement(getTrendIcon(data.trends.expensesChange), {
                          className: `w-4 h-4 mr-1 ${getTrendColor(data.trends.expensesChange)}`
                        })
                      }
                      <span className={`text-sm ${getTrendColor(data.trends.expensesChange)}`}>
                        {Math.abs(data.trends.expensesChange)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <ArrowDownRight className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </motion.div>

            {/* Net Income */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Income</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-blue-900"
                  >
                    {formatCurrency(data.summary.netIncome)}
                  </motion.p>
                  {data.trends && (
                    <div className="flex items-center mt-2">
                      {getTrendIcon(data.trends.netIncomeChange) &&
                        React.createElement(getTrendIcon(data.trends.netIncomeChange), {
                          className: `w-4 h-4 mr-1 ${getTrendColor(data.trends.netIncomeChange)}`
                        })
                      }
                      <span className={`text-sm ${getTrendColor(data.trends.netIncomeChange)}`}>
                        {Math.abs(data.trends.netIncomeChange)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            {/* Profit Margin */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                  <motion.p
                    variants={statsVariants}
                    className="text-3xl font-bold text-purple-900"
                  >
                    {data.summary.profitMargin}%
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-2">
                    Target: 25%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Average Transaction</h3>
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{formatCurrency(data.summary.averageTransactionSize)}</p>
                <p className="text-sm text-gray-600 mt-1">per transaction</p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Transactions</h3>
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">{data.summary.totalTransactions}</p>
                <p className="text-sm text-gray-600 mt-1">this period</p>
              </div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top Categories */}
            <div className="lg:col-span-2 space-y-6">
              {/* Income Categories */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Top Income Categories</h3>
                  <Link
                    to="/finances/income-tracking"
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {data.topCategories.income.map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center`}>
                          <category.icon className={`w-5 h-5 ${category.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{category.name}</p>
                          <p className="text-sm text-gray-500">{category.percentage}% of total income</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(category.amount)}</p>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Expense Categories */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Top Expense Categories</h3>
                  <Link
                    to="/finances/expense-tracking"
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {data.topCategories.expenses.map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center`}>
                          <category.icon className={`w-5 h-5 ${category.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{category.name}</p>
                          <p className="text-sm text-gray-500">{category.percentage}% of total expenses</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(category.amount)}</p>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Financial Alerts */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Financial Alerts</h3>
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
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
                      <p className="text-xs text-gray-500">
                        {new Date(alert.date).toLocaleDateString()}
                      </p>
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
                    to="/finances/income-tracking/add"
                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Income
                  </Link>
                  
                  <Link
                    to="/finances/expense-tracking/add"
                    className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Link>
                  
                  <Link
                    to="/finances/reports"
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate Report
                  </Link>
                  
                  <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </button>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-3">
                  {data.recentTransactions.slice(0, 3).map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: transaction.id * 0.1 }}
                      className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                        </p>
                        <p className={`text-sm font-medium ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <Link
                  to="/finances/transactions"
                  className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-4 pt-3 border-t border-gray-200"
                >
                  View All Transactions
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FinanceDashboard;