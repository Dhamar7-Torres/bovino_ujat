// Frontend/src/pages/finances/FinancialReports.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Share2,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Settings,
  RefreshCw,
  Plus,
  Printer,
  Mail,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  Info,
  Search,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  X,
  Zap,
  Users,
  Building,
  Truck,
  Heart,
  ShoppingCart,
  Calculator,
  Percent,
  BookOpen,
  Award,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FinancialReports = () => {
  // Estados para manejar los datos y la UI
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Estados para filtros y configuración
  const [reportFilters, setReportFilters] = useState({
    type: 'profit-loss',
    period: 'monthly',
    startDate: '',
    endDate: '',
    categories: [],
    compareWith: 'previous-period'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list');

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

  const reportVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  // Cargar reportes al montar el componente
  useEffect(() => {
    fetchReports();
    setInitialDateRange();
  }, []);

  // Establecer rango de fechas inicial
  const setInitialDateRange = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    setReportFilters(prev => ({
      ...prev,
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    }));
  };

  // Obtener lista de reportes
  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/finances/reports', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load reports');
      }
    } catch (error) {
      console.error('Fetch reports error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Tipos de reportes disponibles
  const reportTypes = [
    {
      id: 'profit-loss',
      name: 'Profit & Loss Statement',
      description: 'Comprehensive income and expense analysis',
      icon: TrendingUp,
      color: 'bg-green-500',
      category: 'Financial Performance'
    },
    {
      id: 'cash-flow',
      name: 'Cash Flow Statement',
      description: 'Track money movement in and out of business',
      icon: DollarSign,
      color: 'bg-blue-500',
      category: 'Financial Performance'
    },
    {
      id: 'expense-breakdown',
      name: 'Expense Breakdown Report',
      description: 'Detailed analysis of all expense categories',
      icon: PieChart,
      color: 'bg-red-500',
      category: 'Expense Analysis'
    },
    {
      id: 'income-analysis',
      name: 'Income Analysis Report',
      description: 'Revenue streams and income trends',
      icon: ArrowUpRight,
      color: 'bg-emerald-500',
      category: 'Revenue Analysis'
    },
    {
      id: 'budget-variance',
      name: 'Budget vs Actual Report',
      description: 'Compare planned budget with actual spending',
      icon: Target,
      color: 'bg-purple-500',
      category: 'Budget Analysis'
    },
    {
      id: 'category-trends',
      name: 'Category Trends Report',
      description: 'Monthly and yearly category spending trends',
      icon: BarChart3,
      color: 'bg-orange-500',
      category: 'Trend Analysis'
    },
    {
      id: 'tax-summary',
      name: 'Tax Summary Report',
      description: 'Tax-related income and deductible expenses',
      icon: FileText,
      color: 'bg-indigo-500',
      category: 'Tax Reporting'
    },
    {
      id: 'cost-per-head',
      name: 'Cost Per Head Analysis',
      description: 'Cost breakdown per livestock unit',
      icon: Calculator,
      color: 'bg-teal-500',
      category: 'Cost Analysis'
    }
  ];

  // Datos de ejemplo para reportes generados
  const mockReportData = {
    'profit-loss': {
      period: 'June 2025',
      totalRevenue: 125450.00,
      totalExpenses: 89320.50,
      netIncome: 36129.50,
      profitMargin: 28.8,
      comparison: {
        revenueChange: 12.5,
        expenseChange: -8.3,
        netIncomeChange: 45.2
      },
      breakdown: {
        revenue: [
          { category: 'Livestock Sales', amount: 75200.00, percentage: 60 },
          { category: 'Milk Production', amount: 28150.00, percentage: 22.4 },
          { category: 'Breeding Services', amount: 15800.00, percentage: 12.6 },
          { category: 'Feed Sales', amount: 6300.00, percentage: 5 }
        ],
        expenses: [
          { category: 'Feed & Nutrition', amount: 32450.00, percentage: 36.3 },
          { category: 'Veterinary Care', amount: 18750.00, percentage: 21 },
          { category: 'Equipment & Maintenance', amount: 15420.00, percentage: 17.3 },
          { category: 'Labor Costs', amount: 12200.00, percentage: 13.7 },
          { category: 'Utilities', amount: 10500.50, percentage: 11.7 }
        ]
      }
    },
    'cash-flow': {
      period: 'June 2025',
      openingBalance: 45200.00,
      closingBalance: 67850.00,
      netCashFlow: 22650.00,
      operatingCashFlow: 28450.00,
      investingCashFlow: -5800.00,
      financingCashFlow: 0.00,
      dailyFlow: [
        { date: '2025-06-01', inflow: 2500, outflow: 1200, net: 1300 },
        { date: '2025-06-02', inflow: 1800, outflow: 2100, net: -300 },
        { date: '2025-06-03', inflow: 4200, outflow: 1500, net: 2700 }
      ]
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

  // Generar reporte
  const generateReport = async (reportType) => {
    setIsGenerating(true);
    setSelectedReport(reportType);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Usar datos mock por ahora
      setReportData(mockReportData[reportType.id] || {});
    } catch (error) {
      console.error('Generate report error:', error);
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Exportar reporte
  const exportReport = async (format) => {
    try {
      const response = await fetch('/api/finances/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          reportType: selectedReport.id,
          format: format,
          filters: reportFilters
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedReport.name}-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export report.');
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
            <p className="text-gray-600">Loading financial reports...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
              <div className="text-sm text-gray-600">
                Generate comprehensive financial insights and analysis
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-3 py-2 border rounded-lg transition-colors ${
                  showFilters 
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={fetchReports}
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
          {/* Filtros expandibles */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Period</label>
                    <select
                      value={reportFilters.period}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, period: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={reportFilters.startDate}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={reportFilters.endDate}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Compare With</label>
                    <select
                      value={reportFilters.compareWith}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, compareWith: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="none">No Comparison</option>
                      <option value="previous-period">Previous Period</option>
                      <option value="previous-year">Previous Year</option>
                      <option value="budget">Budget</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Layout principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Panel izquierdo - Tipos de reportes */}
            <div className="lg:col-span-2">
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Available Reports</h3>
                  <span className="text-sm text-gray-500">{reportTypes.length} report types</span>
                </div>

                {/* Lista/Grid de tipos de reportes */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportTypes.map((reportType, index) => (
                      <motion.div
                        key={reportType.id}
                        variants={cardVariants}
                        whileHover="hover"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors"
                        onClick={() => generateReport(reportType)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 ${reportType.color} rounded-lg flex items-center justify-center`}>
                            <reportType.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{reportType.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{reportType.description}</p>
                            <span className="text-xs text-blue-600 font-medium">{reportType.category}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reportTypes.map((reportType, index) => (
                      <motion.div
                        key={reportType.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                        onClick={() => generateReport(reportType)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${reportType.color} rounded-lg flex items-center justify-center`}>
                            <reportType.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{reportType.name}</h4>
                            <p className="text-sm text-gray-600">{reportType.description}</p>
                            <span className="text-xs text-blue-600 font-medium">{reportType.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Panel derecho - Vista de reporte generado */}
            <div>
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                {isGenerating ? (
                  // Estado de generación
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                    ></motion.div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Report</h3>
                    <p className="text-gray-600">{selectedReport?.name}</p>
                    <div className="mt-4 bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        Analyzing financial data and preparing comprehensive insights...
                      </p>
                    </div>
                  </div>
                ) : selectedReport && reportData ? (
                  // Reporte generado
                  <motion.div
                    variants={reportVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{selectedReport.name}</h3>
                        <p className="text-sm text-gray-600">{reportData.period}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => exportReport('pdf')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Export as PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => exportReport('xlsx')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Export as Excel"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Contenido del reporte según el tipo */}
                    {selectedReport.id === 'profit-loss' && (
                      <div className="space-y-6">
                        {/* Métricas principales */}
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-green-800">Total Revenue</span>
                              <ArrowUpRight className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-900">
                              {formatCurrency(reportData.totalRevenue)}
                            </p>
                            {reportData.comparison && (
                              <p className={`text-sm ${getTrendColor(reportData.comparison.revenueChange)}`}>
                                {reportData.comparison.revenueChange > 0 ? '+' : ''}{reportData.comparison.revenueChange}% vs previous
                              </p>
                            )}
                          </div>

                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-red-800">Total Expenses</span>
                              <ArrowDownRight className="w-4 h-4 text-red-600" />
                            </div>
                            <p className="text-2xl font-bold text-red-900">
                              {formatCurrency(reportData.totalExpenses)}
                            </p>
                            {reportData.comparison && (
                              <p className={`text-sm ${getTrendColor(-reportData.comparison.expenseChange)}`}>
                                {reportData.comparison.expenseChange > 0 ? '+' : ''}{reportData.comparison.expenseChange}% vs previous
                              </p>
                            )}
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-blue-800">Net Income</span>
                              <DollarSign className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-blue-900">
                              {formatCurrency(reportData.netIncome)}
                            </p>
                            <p className="text-sm text-blue-700">
                              {reportData.profitMargin}% profit margin
                            </p>
                          </div>
                        </div>

                        {/* Breakdown de categorías */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Revenue Breakdown</h4>
                          <div className="space-y-2">
                            {reportData.breakdown.revenue.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-700">{item.category}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium">{formatCurrency(item.amount)}</span>
                                  <span className="text-xs text-gray-500">{item.percentage}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Expense Breakdown</h4>
                          <div className="space-y-2">
                            {reportData.breakdown.expenses.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-700">{item.category}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium">{formatCurrency(item.amount)}</span>
                                  <span className="text-xs text-gray-500">{item.percentage}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedReport.id === 'cash-flow' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <span className="text-sm font-medium text-blue-800">Opening Balance</span>
                            <p className="text-xl font-bold text-blue-900">
                              {formatCurrency(reportData.openingBalance)}
                            </p>
                          </div>
                          
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <span className="text-sm font-medium text-green-800">Net Cash Flow</span>
                            <p className="text-xl font-bold text-green-900">
                              {formatCurrency(reportData.netCashFlow)}
                            </p>
                          </div>
                          
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <span className="text-sm font-medium text-purple-800">Closing Balance</span>
                            <p className="text-xl font-bold text-purple-900">
                              {formatCurrency(reportData.closingBalance)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Cash Flow Breakdown</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">Operating Cash Flow</span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(reportData.operatingCashFlow)}
                              </span>
                            </div>
                            <div className="flex justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">Investing Cash Flow</span>
                              <span className="font-medium text-red-600">
                                {formatCurrency(reportData.investingCashFlow)}
                              </span>
                            </div>
                            <div className="flex justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">Financing Cash Flow</span>
                              <span className="font-medium text-gray-600">
                                {formatCurrency(reportData.financingCashFlow)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botones de acción */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => exportReport('pdf')}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          PDF
                        </button>
                        <button
                          onClick={() => exportReport('xlsx')}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Excel
                        </button>
                        <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  // Estado inicial
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Generate Financial Report</h3>
                    <p className="text-gray-600 mb-6">
                      Select a report type from the left to generate comprehensive financial insights
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Available Features</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Multiple export formats (PDF, Excel)</li>
                        <li>• Comparative analysis</li>
                        <li>• Visual charts and graphs</li>
                        <li>• Customizable date ranges</li>
                        <li>• Email and sharing options</li>
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Quick stats */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border p-6 mt-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reports Generated</span>
                    <span className="font-medium">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Export</span>
                    <span className="font-medium">2 days ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Most Popular</span>
                    <span className="font-medium">Profit & Loss</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Scheduled Reports</span>
                    <span className="font-medium">3 active</span>
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

export default FinancialReports;