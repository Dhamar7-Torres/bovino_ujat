import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadialBarChart,
  RadialBar,
  Treemap,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  DollarSign,
  Users,
  Cow,
  Milk,
  Heart,
  Shield,
  Calendar,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  AlertTriangle,
  CheckCircle,
  Zap,
  Star,
  Award,
  Scale,
  Thermometer,
  Droplets,
  MapPin,
  Clock
} from 'lucide-react';
import { format, subDays, subWeeks, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';
import CountUp from '../animations/CountUp';

const DashboardCharts = ({
  data = {},
  period = 'month', // 'week', 'month', 'quarter', 'year'
  onDataRefresh,
  onChartClick,
  onExport,
  showControls = true,
  showLegend = true,
  showTooltips = true,
  interactive = true,
  autoRefresh = false,
  refreshInterval = 300000, // 5 minutos
  height = "400px",
  className = ""
}) => {
  // Estados para la gestión del dashboard
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [selectedMetrics, setSelectedMetrics] = useState(['all']);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedChart, setExpandedChart] = useState(null);
  const [showPrivateData, setShowPrivateData] = useState(true);
  const [chartFilters, setChartFilters] = useState({});
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Referencias para auto-refresh
  const refreshTimer = useRef(null);

  // Colores personalizados para el tema ganadero
  const colors = {
    primary: '#22C55E', // Verde principal
    secondary: '#3B82F6', // Azul
    accent: '#F59E0B', // Naranja
    success: '#10B981', // Verde éxito
    warning: '#EAB308', // Amarillo
    danger: '#EF4444', // Rojo
    purple: '#8B5CF6',
    pink: '#EC4899',
    indigo: '#6366F1',
    gray: '#6B7280',
    cattle: {
      milk: '#3B82F6',
      meat: '#DC2626',
      health: '#10B981',
      reproduction: '#EC4899',
      finance: '#F59E0B',
      feed: '#8B5CF6'
    }
  };

  // Animaciones de Framer Motion
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

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Configurar auto-refresh
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshTimer.current = setInterval(() => {
        handleRefresh();
      }, refreshInterval);
    }

    return () => {
      if (refreshTimer.current) {
        clearInterval(refreshTimer.current);
      }
    };
  }, [autoRefresh, refreshInterval]);

  // Datos de ejemplo para el dashboard
  const defaultData = {
    // Resumen general
    summary: {
      totalAnimals: 156,
      healthyAnimals: 142,
      pregnantCows: 34,
      milkProduction: 2850,
      monthlyRevenue: 125000,
      expenses: 87500,
      profit: 37500,
      efficiencyRate: 87.5
    },
    
    // Datos de producción por mes
    productionTrend: [
      { month: 'Ene', milk: 2650, meat: 1200, revenue: 115000, animals: 150 },
      { month: 'Feb', milk: 2780, meat: 1350, revenue: 120000, animals: 152 },
      { month: 'Mar', milk: 2920, meat: 1180, revenue: 118000, animals: 154 },
      { month: 'Abr', milk: 3100, meat: 1420, revenue: 135000, animals: 155 },
      { month: 'May', milk: 2980, meat: 1380, revenue: 128000, animals: 156 },
      { month: 'Jun', milk: 2850, meat: 1250, revenue: 125000, animals: 156 }
    ],

    // Distribución de salud del ganado
    healthDistribution: [
      { name: 'Excelente', value: 45, percentage: 28.8, color: colors.success },
      { name: 'Bueno', value: 67, percentage: 42.9, color: colors.primary },
      { name: 'Regular', value: 30, percentage: 19.2, color: colors.warning },
      { name: 'Crítico', value: 14, percentage: 9.0, color: colors.danger }
    ],

    // Estados reproductivos
    reproductiveStatus: [
      { status: 'Gestantes', count: 34, percentage: 35.4, color: colors.pink },
      { status: 'Lactantes', count: 45, percentage: 46.9, color: colors.secondary },
      { status: 'Secas', count: 12, percentage: 12.5, color: colors.warning },
      { status: 'Vacías', count: 5, percentage: 5.2, color: colors.primary }
    ],

    // Rendimiento financiero
    financialPerformance: [
      { category: 'Ingresos', Q1: 320000, Q2: 350000, Q3: 385000, Q4: 420000 },
      { category: 'Gastos', Q1: 240000, Q2: 255000, Q3: 270000, Q4: 285000 },
      { category: 'Ganancia', Q1: 80000, Q2: 95000, Q3: 115000, Q4: 135000 }
    ],

    // Producción diaria de leche (últimos 30 días)
    dailyMilkProduction: Array.from({ length: 30 }, (_, i) => ({
      day: format(subDays(new Date(), 29 - i), 'dd/MM'),
      production: Math.round(85 + Math.random() * 25 + Math.sin(i * 0.2) * 10),
      quality: Math.round(92 + Math.random() * 6),
      cows: Math.round(45 + Math.random() * 5)
    })),

    // Alertas y eventos
    alerts: [
      { type: 'health', count: 3, severity: 'high' },
      { type: 'reproduction', count: 5, severity: 'medium' },
      { type: 'production', count: 2, severity: 'low' },
      { type: 'finance', count: 1, severity: 'medium' }
    ],

    // Eficiencia por área
    areaEfficiency: [
      { area: 'Producción', efficiency: 92, target: 90, color: colors.primary },
      { area: 'Salud', efficiency: 87, target: 85, color: colors.success },
      { area: 'Reproducción', efficiency: 78, target: 80, color: colors.pink },
      { area: 'Finanzas', efficiency: 84, target: 85, color: colors.accent }
    ],

    ...data
  };

  const dashboardData = defaultData;

  // Funciones de manejo
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      if (onDataRefresh) {
        await onDataRefresh(selectedPeriod);
      }
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    if (onDataRefresh) {
      onDataRefresh(newPeriod);
    }
  };

  const handleChartExpand = (chartId) => {
    setExpandedChart(expandedChart === chartId ? null : chartId);
  };

  const handleExport = (chartId, format = 'png') => {
    if (onExport) {
      onExport(chartId, format, dashboardData);
    }
  };

  // Componente de tooltip personalizado
  const CustomTooltip = ({ active, payload, label, formatter }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.dataKey}:</span>
              <span className="font-medium text-gray-900">
                {formatter ? formatter(entry.value, entry.dataKey) : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Formatters personalizados
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      notation: 'compact'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-MX', {
      notation: 'compact'
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`space-y-6 ${className}`}
    >
      {/* Controles del Dashboard */}
      {showControls && (
        <motion.div
          variants={chartVariants}
          className="bg-white rounded-xl shadow-sm border p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Dashboard de Análisis
              </h2>
              
              {/* Selector de período */}
              <div className="flex items-center space-x-2">
                {['week', 'month', 'quarter', 'year'].map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePeriodChange(p)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedPeriod === p
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Última actualización */}
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {format(lastUpdate, 'HH:mm')}
              </span>

              {/* Controles */}
              <motion.button
                onClick={() => setShowPrivateData(!showPrivateData)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={showPrivateData ? "Ocultar datos" : "Mostrar datos"}
              >
                {showPrivateData ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </motion.button>

              <motion.button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Actualizar datos"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </motion.button>

              <motion.button
                onClick={() => handleExport('dashboard', 'pdf')}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Exportar dashboard"
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Grid principal de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Gráfico de Tendencia de Producción */}
        <motion.div
          variants={chartVariants}
          className={`bg-white rounded-xl shadow-sm border p-6 ${
            expandedChart === 'production-trend' ? 'lg:col-span-2 xl:col-span-3' : 'lg:col-span-2'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Tendencia de Producción</h3>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => handleChartExpand('production-trend')}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {expandedChart === 'production-trend' ? 
                  <Minimize2 className="w-4 h-4" /> : 
                  <Maximize2 className="w-4 h-4" />
                }
              </motion.button>
            </div>
          </div>
          
          <div style={{ height: expandedChart === 'production-trend' ? '400px' : '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dashboardData.productionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={formatNumber}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={formatCurrency}
                />
                {showTooltips && (
                  <Tooltip 
                    content={<CustomTooltip formatter={(value, name) => 
                      name === 'revenue' ? formatCurrency(value) : formatNumber(value)
                    } />}
                  />
                )}
                {showLegend && <Legend />}
                
                <Bar yAxisId="left" dataKey="milk" fill={colors.cattle.milk} name="Leche (L)" />
                <Bar yAxisId="left" dataKey="meat" fill={colors.cattle.meat} name="Carne (kg)" />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={colors.accent} 
                  strokeWidth={3}
                  name="Ingresos"
                  dot={{ fill: colors.accent, strokeWidth: 2, r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Distribución de Salud */}
        <motion.div
          variants={chartVariants}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Estado de Salud</h3>
            </div>
          </div>
          
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.healthDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dashboardData.healthDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList
                    dataKey="percentage"
                    position="outside"
                    formatter={(value) => `${value.toFixed(1)}%`}
                    fontSize={12}
                  />
                </Pie>
                {showTooltips && (
                  <Tooltip 
                    content={<CustomTooltip formatter={(value, name) => 
                      `${value} animales (${(value / dashboardData.summary.totalAnimals * 100).toFixed(1)}%)`
                    } />}
                  />
                )}
                {showLegend && <Legend />}
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Resumen numérico */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {dashboardData.healthDistribution.map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {showPrivateData ? item.value : '••'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Producción Diaria de Leche */}
        <motion.div
          variants={chartVariants}
          className={`bg-white rounded-xl shadow-sm border p-6 ${
            expandedChart === 'daily-milk' ? 'lg:col-span-2 xl:col-span-3' : 'lg:col-span-1'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Milk className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Producción Diaria</h3>
            </div>
            <motion.button
              onClick={() => handleChartExpand('daily-milk')}
              className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {expandedChart === 'daily-milk' ? 
                <Minimize2 className="w-4 h-4" /> : 
                <Maximize2 className="w-4 h-4" />
              }
            </motion.button>
          </div>
          
          <div style={{ height: expandedChart === 'daily-milk' ? '400px' : '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.dailyMilkProduction}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6B7280"
                  fontSize={10}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={formatNumber}
                />
                {showTooltips && (
                  <Tooltip 
                    content={<CustomTooltip formatter={(value, name) => 
                      name === 'production' ? `${value}L` : 
                      name === 'quality' ? `${value}%` : value
                    } />}
                  />
                )}
                
                <Area
                  type="monotone"
                  dataKey="production"
                  stroke={colors.cattle.milk}
                  fill={colors.cattle.milk}
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Producción (L)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {showPrivateData ? (
                  <CountUp to={dashboardData.dailyMilkProduction.slice(-1)[0]?.production || 0} />
                ) : '••'}
              </div>
              <div className="text-xs text-gray-500">Hoy (L)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {showPrivateData ? (
                  <CountUp 
                    to={dashboardData.dailyMilkProduction.reduce((acc, day) => acc + day.production, 0) / dashboardData.dailyMilkProduction.length} 
                    decimals={1}
                  />
                ) : '••'}
              </div>
              <div className="text-xs text-gray-500">Promedio (L)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {showPrivateData ? (
                  <CountUp to={dashboardData.dailyMilkProduction.slice(-1)[0]?.quality || 0} suffix="%" />
                ) : '••'}
              </div>
              <div className="text-xs text-gray-500">Calidad</div>
            </div>
          </div>
        </motion.div>

        {/* Estados Reproductivos */}
        <motion.div
          variants={chartVariants}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900">Reproducción</h3>
            </div>
          </div>
          
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={dashboardData.reproductiveStatus}
                layout="horizontal"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  type="number"
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  type="category"
                  dataKey="status"
                  stroke="#6B7280"
                  fontSize={12}
                  width={80}
                />
                {showTooltips && (
                  <Tooltip 
                    content={<CustomTooltip formatter={(value) => `${value} animales`} />}
                  />
                )}
                
                <Bar 
                  dataKey="count" 
                  fill={colors.pink}
                  radius={[0, 4, 4, 0]}
                >
                  {dashboardData.reproductiveStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Totales */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Vacas:</span>
              <span className="font-medium text-gray-900">
                {showPrivateData ? dashboardData.reproductiveStatus.reduce((acc, item) => acc + item.count, 0) : '••'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Eficiencia por Área */}
        <motion.div
          variants={chartVariants}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Eficiencia</h3>
            </div>
          </div>
          
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="20%" 
                outerRadius="90%" 
                data={dashboardData.areaEfficiency}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar 
                  dataKey="efficiency" 
                  cornerRadius={10} 
                  fill="#8884d8"
                >
                  {dashboardData.areaEfficiency.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RadialBar>
                {showTooltips && (
                  <Tooltip 
                    content={<CustomTooltip formatter={(value) => `${value}%`} />}
                  />
                )}
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          {/* Leyenda personalizada */}
          <div className="space-y-2">
            {dashboardData.areaEfficiency.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600">{item.area}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {showPrivateData ? `${item.efficiency}%` : '••%'}
                  </span>
                  <span className="text-xs text-gray-500">
                    (Meta: {item.target}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Resumen de KPIs */}
      <motion.div
        variants={chartVariants}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
          Indicadores Clave de Rendimiento
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { label: 'Total Animales', value: dashboardData.summary.totalAnimals, icon: Cow, color: 'text-green-600' },
            { label: 'Animales Sanos', value: dashboardData.summary.healthyAnimals, icon: Heart, color: 'text-emerald-600' },
            { label: 'Vacas Gestantes', value: dashboardData.summary.pregnantCows, icon: Activity, color: 'text-pink-600' },
            { label: 'Producción Leche', value: dashboardData.summary.milkProduction, suffix: 'L', icon: Milk, color: 'text-blue-600' },
            { label: 'Ingresos Mes', value: dashboardData.summary.monthlyRevenue, prefix: '$', icon: DollarSign, color: 'text-green-600' },
            { label: 'Gastos', value: dashboardData.summary.expenses, prefix: '$', icon: TrendingDown, color: 'text-red-600' },
            { label: 'Ganancia', value: dashboardData.summary.profit, prefix: '$', icon: TrendingUp, color: 'text-emerald-600' },
            { label: 'Eficiencia', value: dashboardData.summary.efficiencyRate, suffix: '%', icon: Award, color: 'text-purple-600' }
          ].map((kpi, index) => (
            <motion.div
              key={index}
              variants={chartVariants}
              className="text-center p-4 bg-gray-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <kpi.icon className={`w-6 h-6 mx-auto mb-2 ${kpi.color}`} />
              <div className="text-xl font-bold text-gray-900">
                {showPrivateData ? (
                  <>
                    {kpi.prefix}
                    <CountUp 
                      to={kpi.value} 
                      duration={1.5}
                      separator=","
                      decimals={kpi.suffix === '%' ? 1 : 0}
                    />
                    {kpi.suffix}
                  </>
                ) : '••••'}
              </div>
              <div className="text-xs text-gray-500 mt-1">{kpi.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardCharts;