// Frontend/src/pages/production/ProductionReports.jsx

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
  TrendingRight,
  Milk,
  Beef,
  Egg,
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
  Activity,
  Cow,
  Scale,
  Droplets,
  Thermometer,
  Timer,
  MapPin,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductionReports = () => {
  // Estados para manejar los datos y la UI
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Estados para filtros y configuración
  const [reportFilters, setReportFilters] = useState({
    type: 'milk-production',
    period: 'monthly',
    startDate: '',
    endDate: '',
    animals: [],
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
      const response = await fetch('/api/production/reports', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load production reports');
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
      id: 'milk-production',
      name: 'Milk Production Report',
      description: 'Comprehensive milk yield analysis and trends',
      icon: Milk,
      color: 'bg-blue-500',
      category: 'Dairy Production'
    },
    {
      id: 'weight-gain',
      name: 'Weight Gain Analysis',
      description: 'Track weight gain patterns and feed efficiency',
      icon: Scale,
      color: 'bg-green-500',
      category: 'Growth Analysis'
    },
    {
      id: 'breeding-performance',
      name: 'Breeding Performance Report',
      description: 'Reproductive efficiency and breeding success rates',
      icon: Heart,
      color: 'bg-pink-500',
      category: 'Reproduction'
    },
    {
      id: 'feed-efficiency',
      name: 'Feed Efficiency Report',
      description: 'Feed consumption vs production output analysis',
      icon: Calculator,
      color: 'bg-orange-500',
      category: 'Feed Management'
    },
    {
      id: 'health-impact',
      name: 'Health Impact on Production',
      description: 'How health events affect production metrics',
      icon: Activity,
      color: 'bg-red-500',
      category: 'Health Analysis'
    },
    {
      id: 'seasonal-analysis',
      name: 'Seasonal Production Analysis',
      description: 'Production variations across different seasons',
      icon: Calendar,
      color: 'bg-purple-500',
      category: 'Seasonal Trends'
    },
    {
      id: 'cost-benefit',
      name: 'Cost-Benefit Analysis',
      description: 'Production costs versus revenue analysis',
      icon: DollarSign,
      color: 'bg-indigo-500',
      category: 'Financial Analysis'
    },
    {
      id: 'performance-benchmarks',
      name: 'Performance Benchmarks',
      description: 'Compare performance against industry standards',
      icon: Target,
      color: 'bg-teal-500',
      category: 'Benchmarking'
    }
  ];

  // Datos de ejemplo para reportes generados
  const mockReportData = {
    'milk-production': {
      period: 'June 2025',
      totalProduction: 15420.5,
      averageDailyYield: 28.3,
      bestPerformer: 'Luna',
      topYield: 42.1,
      comparison: {
        productionChange: 8.5,
        yieldChange: 12.3,
        efficiencyChange: 6.7
      },
      breakdown: [
        { animal: 'Luna', avgDaily: 42.1, total: 1263.0, efficiency: 95.2 },
        { animal: 'Bella', avgDaily: 38.5, total: 1155.0, efficiency: 92.1 },
        { animal: 'Daisy', avgDaily: 35.2, total: 1056.0, efficiency: 89.4 },
        { animal: 'Sophie', avgDaily: 31.8, total: 954.0, efficiency: 85.7 },
        { animal: 'Molly', avgDaily: 28.9, total: 867.0, efficiency: 82.3 }
      ],
      weeklyTrends: [
        { week: 'Week 1', production: 3654.2, animals: 18 },
        { week: 'Week 2', production: 3892.1, animals: 18 },
        { week: 'Week 3', production: 3756.8, animals: 18 },
        { week: 'Week 4', production: 4117.4, animals: 18 }
      ],
      qualityMetrics: {
        fatContent: 3.8,
        proteinContent: 3.2,
        somaticCellCount: 185000,
        bacterialCount: 12000
      }
    },
    'weight-gain': {
      period: 'June 2025',
      averageGain: 1.8,
      bestPerformer: 'Thunder',
      topGain: 2.6,
      feedEfficiency: 6.2,
      comparison: {
        gainChange: 15.2,
        efficiencyChange: 8.9,
        feedChange: -3.4
      },
      ageGroups: [
        { group: 'Calves (0-6 months)', avgGain: 0.8, count: 12 },
        { group: 'Young Stock (6-18 months)', avgGain: 1.4, count: 15 },
        { group: 'Adults (18+ months)', avgGain: 2.1, count: 23 }
      ],
      monthlyData: [
        { month: 'April', avgWeight: 485.2, gain: 1.6 },
        { month: 'May', avgWeight: 523.8, gain: 1.9 },
        { month: 'June', avgWeight: 558.4, gain: 1.8 }
      ]
    }
  };

  // Formatear números
  const formatNumber = (num, decimals = 1) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
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
    return TrendingRight;
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
      const response = await fetch('/api/production/reports/export', {
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
            <p className="text-gray-600">Loading production reports...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Production Reports</h1>
              <div className="text-sm text-gray-600">
                Analyze livestock production performance and trends
              </div>
            </div>
           
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-3 py-2 border rounded-lg transition-colors ${
                  showFilters
                    ? 'border-green-500 bg-green-50 text-green-700'
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
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-green-600 text-white'
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={reportFilters.endDate}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Compare With</label>
                    <select
                      value={reportFilters.compareWith}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, compareWith: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="none">No Comparison</option>
                      <option value="previous-period">Previous Period</option>
                      <option value="previous-year">Previous Year</option>
                      <option value="industry-average">Industry Average</option>
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
                  <h3 className="text-lg font-semibold text-gray-900">Available Production Reports</h3>
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
                        className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green-300 transition-colors"
                        onClick={() => generateReport(reportType)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 ${reportType.color} rounded-lg flex items-center justify-center`}>
                            <reportType.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{reportType.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{reportType.description}</p>
                            <span className="text-xs text-green-600 font-medium">{reportType.category}</span>
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
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 cursor-pointer transition-colors"
                        onClick={() => generateReport(reportType)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${reportType.color} rounded-lg flex items-center justify-center`}>
                            <reportType.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{reportType.name}</h4>
                            <p className="text-sm text-gray-600">{reportType.description}</p>
                            <span className="text-xs text-green-600 font-medium">{reportType.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
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
                      className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"
                    ></motion.div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Report</h3>
                    <p className="text-gray-600">{selectedReport?.name}</p>
                    <div className="mt-4 bg-green-50 rounded-lg p-3">
                      <p className="text-sm text-green-700">
                        Analyzing production data and calculating metrics...
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
                    {selectedReport.id === 'milk-production' && (
                      <div className="space-y-6">
                        {/* Métricas principales */}
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-blue-800">Total Production</span>
                              <Milk className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-blue-900">
                              {formatNumber(reportData.totalProduction)} L
                            </p>
                            {reportData.comparison && (
                              <p className={`text-sm ${getTrendColor(reportData.comparison.productionChange)}`}>
                                {reportData.comparison.productionChange > 0 ? '+' : ''}{reportData.comparison.productionChange}% vs previous
                              </p>
                            )}
                          </div>

                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-green-800">Avg Daily Yield</span>
                              <Droplets className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-900">
                              {formatNumber(reportData.averageDailyYield)} L/day
                            </p>
                            {reportData.comparison && (
                              <p className={`text-sm ${getTrendColor(reportData.comparison.yieldChange)}`}>
                                {reportData.comparison.yieldChange > 0 ? '+' : ''}{reportData.comparison.yieldChange}% vs previous
                              </p>
                            )}
                          </div>

                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-purple-800">Best Performer</span>
                              <Award className="w-4 h-4 text-purple-600" />
                            </div>
                            <p className="text-xl font-bold text-purple-900">
                              {reportData.bestPerformer}
                            </p>
                            <p className="text-sm text-purple-700">
                              {formatNumber(reportData.topYield)} L/day average
                            </p>
                          </div>
                        </div>

                        {/* Top performers */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Top Performers</h4>
                          <div className="space-y-2">
                            {reportData.breakdown.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div className="flex items-center">
                                  <Cow className="w-4 h-4 text-gray-400 mr-2" />
                                  <span className="text-sm text-gray-700">{item.animal}</span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm">
                                  <span className="font-medium">{formatNumber(item.avgDaily)} L/day</span>
                                  <span className="text-green-600">{formatNumber(item.efficiency)}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quality metrics */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Quality Metrics</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded p-2 text-center">
                              <p className="text-xs text-gray-600">Fat Content</p>
                              <p className="font-bold text-gray-900">{reportData.qualityMetrics.fatContent}%</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2 text-center">
                              <p className="text-xs text-gray-600">Protein</p>
                              <p className="font-bold text-gray-900">{reportData.qualityMetrics.proteinContent}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedReport.id === 'weight-gain' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <span className="text-sm font-medium text-green-800">Average Daily Gain</span>
                            <p className="text-2xl font-bold text-green-900">
                              {formatNumber(reportData.averageGain)} kg/day
                            </p>
                          </div>
                          
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <span className="text-sm font-medium text-blue-800">Feed Efficiency</span>
                            <p className="text-2xl font-bold text-blue-900">
                              {formatNumber(reportData.feedEfficiency)} kg feed/kg gain
                            </p>
                          </div>

                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <span className="text-sm font-medium text-purple-800">Top Performer</span>
                            <p className="text-xl font-bold text-purple-900">
                              {reportData.bestPerformer}
                            </p>
                            <p className="text-sm text-purple-700">
                              {formatNumber(reportData.topGain)} kg/day gain
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Age Group Performance</h4>
                          <div className="space-y-2">
                            {reportData.ageGroups.map((group, index) => (
                              <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-700">{group.group}</span>
                                <div className="flex items-center space-x-2 text-sm">
                                  <span className="font-medium">{formatNumber(group.avgGain)} kg/day</span>
                                  <span className="text-gray-500">({group.count} animals)</span>
                                </div>
                              </div>
                            ))}
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Generate Production Report</h3>
                    <p className="text-gray-600 mb-6">
                      Select a report type to analyze your livestock production performance
                    </p>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Available Features</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Production trend analysis</li>
                        <li>• Performance benchmarking</li>
                        <li>• Feed efficiency tracking</li>
                        <li>• Quality metrics monitoring</li>
                        <li>• Export capabilities</li>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reports Generated</span>
                    <span className="font-medium">342</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Export</span>
                    <span className="font-medium">3 days ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Most Popular</span>
                    <span className="font-medium">Milk Production</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Processing Time</span>
                    <span className="font-medium">2.3 seconds</span>
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

export default ProductionReports;