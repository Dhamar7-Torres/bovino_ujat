import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposedChart,
  BarChart,
  LineChart,
  AreaChart,
  PieChart,
  ScatterChart,
  Treemap,
  FunnelChart,
  Bar,
  Line,
  Area,
  Pie,
  Scatter,
  Funnel,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
  ReferenceLine,
  Brush
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Calculator,
  CreditCard,
  Banknote,
  Receipt,
  Package,
  Truck,
  Users,
  Cow,
  Milk,
  Beef,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Info,
  Percent,
  Hash,
  Award,
  Star,
  Zap,
  Activity,
  Clock,
  MapPin,
  Building
} from 'lucide-react';
import { format, subDays, subWeeks, subMonths, subYears, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { es } from 'date-fns/locale';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';
import CountUp from '../animations/CountUp';

const FinanceChart = ({
  data = {},
  type = 'overview', // 'overview', 'revenue', 'expenses', 'profit', 'cashflow', 'budget', 'roi', 'breakdown'
  period = 'month', // 'week', 'month', 'quarter', 'year', 'custom'
  currency = 'MXN',
  onDataRefresh,
  onDrillDown,
  onExport,
  onPeriodChange,
  showComparison = true,
  showProjections = true,
  showTargets = true,
  showBreakdown = true,
  interactive = true,
  autoRefresh = false,
  height = "400px",
  className = ""
}) => {
  // Estados para la gestión del gráfico
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'expenses', 'profit']);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showPrivateData, setShowPrivateData] = useState(true);
  const [chartType, setChartType] = useState('composed');
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });

  // Colores para el tema financiero ganadero
  const colors = {
    revenue: '#10B981', // Verde para ingresos
    expenses: '#EF4444', // Rojo para gastos
    profit: '#3B82F6', // Azul para ganancia
    loss: '#F59E0B', // Naranja para pérdidas
    budget: '#8B5CF6', // Morado para presupuesto
    target: '#6B7280', // Gris para metas
    projection: '#EC4899', // Rosa para proyecciones
    
    // Categorías de ingresos
    milk_sales: '#3B82F6',
    meat_sales: '#DC2626',
    cattle_sales: '#F59E0B',
    other_income: '#10B981',
    
    // Categorías de gastos
    feed_costs: '#8B5CF6',
    veterinary: '#EC4899',
    labor: '#6366F1',
    maintenance: '#14B8A6',
    utilities: '#F97316',
    insurance: '#84CC16',
    other_expenses: '#6B7280'
  };

  // Animaciones de Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const numberVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.4
      }
    }
  };

  // Datos financieros de ejemplo
  const defaultData = {
    // Resumen financiero
    summary: {
      totalRevenue: 125000,
      totalExpenses: 87500,
      netProfit: 37500,
      profitMargin: 30.0,
      roi: 15.8,
      cashFlow: 42500,
      budgetVariance: 5.2,
      previousRevenue: 118000,
      previousExpenses: 85000,
      previousProfit: 33000
    },

    // Tendencia mensual (últimos 12 meses)
    monthlyTrend: [
      { month: 'Jul 2024', revenue: 98000, expenses: 75000, profit: 23000, budget: 25000, target: 22000 },
      { month: 'Ago 2024', revenue: 105000, expenses: 78000, profit: 27000, budget: 25000, target: 22000 },
      { month: 'Sep 2024', revenue: 112000, expenses: 82000, profit: 30000, budget: 28000, target: 25000 },
      { month: 'Oct 2024', revenue: 108000, expenses: 80000, profit: 28000, budget: 28000, target: 25000 },
      { month: 'Nov 2024', revenue: 115000, expenses: 83000, profit: 32000, budget: 30000, target: 28000 },
      { month: 'Dic 2024', revenue: 125000, expenses: 88000, profit: 37000, budget: 35000, target: 32000 },
      { month: 'Ene 2025', revenue: 118000, expenses: 85000, profit: 33000, budget: 32000, target: 30000 },
      { month: 'Feb 2025', revenue: 122000, expenses: 86000, profit: 36000, budget: 34000, target: 32000 },
      { month: 'Mar 2025', revenue: 128000, expenses: 89000, profit: 39000, budget: 36000, target: 34000 },
      { month: 'Abr 2025', revenue: 132000, expenses: 91000, profit: 41000, budget: 38000, target: 36000 },
      { month: 'May 2025', revenue: 129000, expenses: 88000, profit: 41000, budget: 38000, target: 36000 },
      { month: 'Jun 2025', revenue: 125000, expenses: 87500, profit: 37500, budget: 35000, target: 35000 }
    ],

    // Desglose de ingresos
    revenueBreakdown: [
      { category: 'Venta de Leche', amount: 65000, percentage: 52.0, color: colors.milk_sales, trend: 8.5 },
      { category: 'Venta de Carne', amount: 35000, percentage: 28.0, color: colors.meat_sales, trend: 12.3 },
      { category: 'Venta de Ganado', amount: 18000, percentage: 14.4, color: colors.cattle_sales, trend: -5.2 },
      { category: 'Otros Ingresos', amount: 7000, percentage: 5.6, color: colors.other_income, trend: 15.8 }
    ],

    // Desglose de gastos
    expenseBreakdown: [
      { category: 'Alimentación', amount: 35000, percentage: 40.0, color: colors.feed_costs, trend: 3.2 },
      { category: 'Veterinario', amount: 15000, percentage: 17.1, color: colors.veterinary, trend: 7.8 },
      { category: 'Mano de Obra', amount: 18000, percentage: 20.6, color: colors.labor, trend: 5.5 },
      { category: 'Mantenimiento', amount: 8000, percentage: 9.1, color: colors.maintenance, trend: -2.1 },
      { category: 'Servicios', amount: 6000, percentage: 6.9, color: colors.utilities, trend: 12.4 },
      { category: 'Seguros', amount: 3500, percentage: 4.0, color: colors.insurance, trend: 0.0 },
      { category: 'Otros', amount: 2000, percentage: 2.3, color: colors.other_expenses, trend: -8.5 }
    ],

    // Flujo de efectivo semanal
    cashFlow: [
      { week: 'S1', inflows: 32000, outflows: 22000, net: 10000, cumulative: 10000 },
      { week: 'S2', inflows: 28000, outflows: 25000, net: 3000, cumulative: 13000 },
      { week: 'S3', inflows: 35000, outflows: 21000, net: 14000, cumulative: 27000 },
      { week: 'S4', inflows: 30000, outflows: 19500, net: 10500, cumulative: 37500 }
    ],

    // ROI por área de inversión
    roiAnalysis: [
      { area: 'Mejora Genética', investment: 25000, return: 32000, roi: 28.0, period: 12 },
      { area: 'Tecnología Ordeño', investment: 45000, return: 52000, roi: 15.6, period: 18 },
      { area: 'Infraestructura', investment: 60000, return: 68000, roi: 13.3, period: 24 },
      { area: 'Alimentación', investment: 15000, return: 18500, roi: 23.3, period: 6 },
      { area: 'Salud Animal', investment: 12000, return: 16000, roi: 33.3, period: 8 }
    ],

    // Proyecciones (próximos 6 meses)
    projections: [
      { month: 'Jul 2025', revenue: 130000, expenses: 89000, profit: 41000, confidence: 85 },
      { month: 'Ago 2025', revenue: 135000, expenses: 91000, profit: 44000, confidence: 82 },
      { month: 'Sep 2025', revenue: 128000, expenses: 88000, profit: 40000, confidence: 78 },
      { month: 'Oct 2025', revenue: 142000, expenses: 95000, profit: 47000, confidence: 75 },
      { month: 'Nov 2025', revenue: 145000, expenses: 97000, profit: 48000, confidence: 72 },
      { month: 'Dic 2025', revenue: 155000, expenses: 102000, profit: 53000, confidence: 68 }
    ],

    ...data
  };

  const financeData = defaultData;

  // Formatters
  const formatCurrency = (value, compact = false) => {
    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      notation: compact && Math.abs(value) >= 1000 ? 'compact' : 'standard',
      maximumFractionDigits: compact ? 0 : 2
    });
    return formatter.format(value);
  };

  const formatPercentage = (value, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  };

  const formatNumber = (value, compact = false) => {
    return new Intl.NumberFormat('es-MX', {
      notation: compact ? 'compact' : 'standard'
    }).format(value);
  };

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label, formatter }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.dataKey}:</span>
              <span className="font-medium text-gray-900">
                {formatter ? formatter(entry.value, entry.dataKey) : formatCurrency(entry.value, true)}
              </span>
              {entry.dataKey === 'roi' && <span className="text-gray-500">ROI</span>}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calcular variaciones
  const calculateVariation = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Manejar acciones
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      if (onDataRefresh) {
        await onDataRefresh(selectedPeriod, type);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
  };

  const handleExport = (format = 'png') => {
    if (onExport) {
      onExport(type, format, financeData);
    }
  };

  const handleDrillDown = (dataPoint) => {
    if (onDrillDown) {
      onDrillDown(dataPoint, type);
    }
  };

  // Renderizar gráfico según el tipo
  const renderChart = () => {
    switch (type) {
      case 'overview':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={financeData.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value, true)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Bar 
                dataKey="revenue" 
                fill={colors.revenue} 
                name="Ingresos"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="expenses" 
                fill={colors.expenses} 
                name="Gastos"
                radius={[2, 2, 0, 0]}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke={colors.profit} 
                strokeWidth={3}
                name="Ganancia"
                dot={{ fill: colors.profit, strokeWidth: 2, r: 4 }}
              />
              {showTargets && (
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke={colors.target} 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Meta"
                  dot={{ fill: colors.target, strokeWidth: 2, r: 3 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'revenue':
      case 'expenses':
        const breakdownData = type === 'revenue' ? financeData.revenueBreakdown : financeData.expenseBreakdown;
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdownData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="amount"
              >
                {breakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="percentage"
                  position="outside"
                  formatter={(value) => `${value.toFixed(1)}%`}
                  fontSize={12}
                />
              </Pie>
              <Tooltip 
                content={<CustomTooltip formatter={(value, name) => 
                  `${formatCurrency(value)} (${((value / breakdownData.reduce((acc, item) => acc + item.amount, 0)) * 100).toFixed(1)}%)`
                } />}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'cashflow':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={financeData.cashFlow}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" stroke="#6B7280" fontSize={12} />
              <YAxis 
                yAxisId="left"
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value, true)}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value, true)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Bar yAxisId="left" dataKey="inflows" fill={colors.revenue} name="Entradas" />
              <Bar yAxisId="left" dataKey="outflows" fill={colors.expenses} name="Salidas" />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="cumulative" 
                stroke={colors.profit} 
                strokeWidth={3}
                name="Acumulado"
                dot={{ fill: colors.profit, strokeWidth: 2, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'roi':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={financeData.roiAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="investment" 
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value, true)}
                name="Inversión"
              />
              <YAxis 
                dataKey="roi"
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
                name="ROI (%)"
              />
              <Tooltip 
                content={<CustomTooltip formatter={(value, name) => 
                  name === 'investment' || name === 'return' ? formatCurrency(value) :
                  name === 'roi' ? `${value}%` : value
                } />}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Scatter 
                dataKey="roi"
                fill={colors.profit}
                name="ROI por Área"
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'budget':
        const budgetComparison = financeData.monthlyTrend.map(item => ({
          ...item,
          variance: ((item.profit - item.budget) / item.budget) * 100
        }));
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={budgetComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                yAxisId="left"
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value, true)}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Bar yAxisId="left" dataKey="profit" fill={colors.profit} name="Ganancia Real" />
              <Bar yAxisId="left" dataKey="budget" fill={colors.budget} name="Presupuesto" />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="variance" 
                stroke={colors.target} 
                strokeWidth={3}
                name="Variación (%)"
                dot={{ fill: colors.target, strokeWidth: 2, r: 4 }}
              />
              <ReferenceLine yAxisId="right" y={0} stroke="#6B7280" strokeDasharray="3 3" />
            </ComposedChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Tipo de gráfico no soportado: {type}</p>
          </div>
        );
    }
  };

  // Obtener métricas clave según el tipo
  const getKeyMetrics = () => {
    const { summary } = financeData;
    const revenueVariation = calculateVariation(summary.totalRevenue, summary.previousRevenue);
    const expenseVariation = calculateVariation(summary.totalExpenses, summary.previousExpenses);
    const profitVariation = calculateVariation(summary.netProfit, summary.previousProfit);

    switch (type) {
      case 'overview':
        return [
          {
            label: 'Ingresos',
            value: summary.totalRevenue,
            variation: revenueVariation,
            format: 'currency',
            icon: TrendingUp,
            color: 'text-green-600'
          },
          {
            label: 'Gastos',
            value: summary.totalExpenses,
            variation: expenseVariation,
            format: 'currency',
            icon: TrendingDown,
            color: 'text-red-600'
          },
          {
            label: 'Ganancia',
            value: summary.netProfit,
            variation: profitVariation,
            format: 'currency',
            icon: DollarSign,
            color: 'text-blue-600'
          },
          {
            label: 'Margen',
            value: summary.profitMargin,
            variation: 0,
            format: 'percentage',
            icon: Percent,
            color: 'text-purple-600'
          }
        ];

      case 'revenue':
        return [
          {
            label: 'Total Ingresos',
            value: summary.totalRevenue,
            variation: revenueVariation,
            format: 'currency',
            icon: DollarSign,
            color: 'text-green-600'
          },
          {
            label: 'Venta Leche',
            value: financeData.revenueBreakdown.find(item => item.category === 'Venta de Leche')?.amount || 0,
            variation: financeData.revenueBreakdown.find(item => item.category === 'Venta de Leche')?.trend || 0,
            format: 'currency',
            icon: Milk,
            color: 'text-blue-600'
          },
          {
            label: 'Venta Carne',
            value: financeData.revenueBreakdown.find(item => item.category === 'Venta de Carne')?.amount || 0,
            variation: financeData.revenueBreakdown.find(item => item.category === 'Venta de Carne')?.trend || 0,
            format: 'currency',
            icon: Beef,
            color: 'text-red-600'
          },
          {
            label: 'Venta Ganado',
            value: financeData.revenueBreakdown.find(item => item.category === 'Venta de Ganado')?.amount || 0,
            variation: financeData.revenueBreakdown.find(item => item.category === 'Venta de Ganado')?.trend || 0,
            format: 'currency',
            icon: Cow,
            color: 'text-orange-600'
          }
        ];

      case 'roi':
        const avgROI = financeData.roiAnalysis.reduce((acc, item) => acc + item.roi, 0) / financeData.roiAnalysis.length;
        const totalInvestment = financeData.roiAnalysis.reduce((acc, item) => acc + item.investment, 0);
        const totalReturn = financeData.roiAnalysis.reduce((acc, item) => acc + item.return, 0);
        
        return [
          {
            label: 'ROI Promedio',
            value: avgROI,
            variation: 0,
            format: 'percentage',
            icon: Target,
            color: 'text-blue-600'
          },
          {
            label: 'Inversión Total',
            value: totalInvestment,
            variation: 0,
            format: 'currency',
            icon: Calculator,
            color: 'text-purple-600'
          },
          {
            label: 'Retorno Total',
            value: totalReturn,
            variation: 0,
            format: 'currency',
            icon: Award,
            color: 'text-green-600'
          },
          {
            label: 'Ganancia Neta',
            value: totalReturn - totalInvestment,
            variation: 0,
            format: 'currency',
            icon: DollarSign,
            color: 'text-emerald-600'
          }
        ];

      default:
        return [];
    }
  };

  const keyMetrics = getKeyMetrics();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white rounded-xl shadow-sm border ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {type === 'overview' && 'Resumen Financiero'}
                {type === 'revenue' && 'Análisis de Ingresos'}
                {type === 'expenses' && 'Análisis de Gastos'}
                {type === 'cashflow' && 'Flujo de Efectivo'}
                {type === 'roi' && 'Retorno de Inversión'}
                {type === 'budget' && 'Presupuesto vs Real'}
              </h3>
              <p className="text-sm text-gray-500">
                Período: {selectedPeriod} • Última actualización: {format(new Date(), 'HH:mm')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Selector de período */}
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="week">Semana</option>
              <option value="month">Mes</option>
              <option value="quarter">Trimestre</option>
              <option value="year">Año</option>
            </select>

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
              title="Actualizar"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>

            <motion.button
              onClick={() => handleExport('png')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Exportar"
            >
              <Download className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Métricas clave */}
      {keyMetrics.length > 0 && (
        <motion.div
          variants={numberVariants}
          className="p-6 border-b border-gray-200"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {keyMetrics.map((metric, index) => (
              <motion.div
                key={index}
                variants={chartVariants}
                className="text-center p-4 bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <metric.icon className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} />
                <div className="text-xl font-bold text-gray-900">
                  {showPrivateData ? (
                    metric.format === 'currency' ? (
                      <CountUp 
                        to={metric.value} 
                        duration={1.5}
                        separator=","
                        prefix="$"
                      />
                    ) : metric.format === 'percentage' ? (
                      <CountUp 
                        to={metric.value} 
                        duration={1.5}
                        decimals={1}
                        suffix="%"
                      />
                    ) : (
                      <CountUp 
                        to={metric.value} 
                        duration={1.5}
                        separator=","
                      />
                    )
                  ) : '••••'}
                </div>
                <div className="text-xs text-gray-500 mt-1">{metric.label}</div>
                {metric.variation !== 0 && showPrivateData && (
                  <div className={`flex items-center justify-center mt-1 text-xs ${
                    metric.variation > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.variation > 0 ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(metric.variation).toFixed(1)}%
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Gráfico principal */}
      <motion.div variants={chartVariants} className="p-6">
        <div style={{ height }}>
          {renderChart()}
        </div>
      </motion.div>

      {/* Desglose detallado para revenue/expenses */}
      {(type === 'revenue' || type === 'expenses') && showBreakdown && (
        <motion.div
          variants={chartVariants}
          className="p-6 border-t border-gray-200"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Desglose Detallado
          </h4>
          
          <div className="space-y-3">
            {(type === 'revenue' ? financeData.revenueBreakdown : financeData.expenseBreakdown).map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handleDrillDown(item)}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <div className="font-medium text-gray-900">{item.category}</div>
                    <div className="text-sm text-gray-500">
                      {formatPercentage(item.percentage)} del total
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {showPrivateData ? formatCurrency(item.amount) : '••••••'}
                  </div>
                  {item.trend !== undefined && showPrivateData && (
                    <div className={`text-sm flex items-center ${
                      item.trend > 0 ? 'text-green-600' : item.trend < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {item.trend > 0 ? (
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                      ) : item.trend < 0 ? (
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowRight className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(item.trend).toFixed(1)}%
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Proyecciones para overview */}
      {type === 'overview' && showProjections && (
        <motion.div
          variants={chartVariants}
          className="p-6 border-t border-gray-200"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
            Proyecciones
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {financeData.projections.slice(0, 3).map((projection, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="text-sm text-gray-600 mb-1">{projection.month}</div>
                <div className="text-lg font-bold text-gray-900 mb-2">
                  {showPrivateData ? formatCurrency(projection.profit) : '••••••'}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Confianza:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${projection.confidence}%` }}
                      />
                    </div>
                    <span className="text-gray-600">{projection.confidence}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FinanceChart;