import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3,
  Calendar, 
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Eye,
  EyeOff,
  Download,
  Share2,
  RefreshCw,
  Filter,
  Settings,
  MoreVertical,
  Percent,
  Calculator,
  CreditCard,
  Banknote,
  Coins,
  Receipt,
  FileText,
  ShoppingCart,
  Package,
  Truck,
  Users,
  Building,
  MapPin,
  Clock,
  Star,
  Award,
  Activity,
  Bookmark
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';
import CountUp from '../animations/CountUp';

const FinanceCard = ({ 
  data,
  type = 'summary', // 'summary', 'revenue', 'expense', 'profit', 'budget', 'comparison', 'trend'
  period = 'month', // 'day', 'week', 'month', 'quarter', 'year'
  onView,
  onEdit,
  onDownload,
  onFilter,
  showChart = true,
  showComparison = true,
  showActions = true,
  interactive = true,
  size = 'default', // 'compact', 'default', 'expanded'
  variant = 'default', // 'default', 'minimal', 'detailed', 'stat-only'
  currency = 'MXN',
  className = "",
  ...props
}) => {
  
  // Estados para la interacción
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [chartPeriod, setChartPeriod] = useState(period);
  const [showPrivate, setShowPrivate] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(data?.isBookmarked || false);
  
  // Animaciones de Framer Motion
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: 0.3,
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
        delay: 0.2,
        duration: 0.3
      }
    }
  };

  const actionVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Función para formatear moneda
  const formatCurrency = (amount, compact = false) => {
    if (!amount && amount !== 0) return 'N/A';
    
    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: compact ? 0 : 2,
      maximumFractionDigits: compact ? 0 : 2,
      notation: compact && Math.abs(amount) >= 1000 ? 'compact' : 'standard'
    });
    
    return formatter.format(amount);
  };

  // Función para formatear porcentaje
  const formatPercentage = (value, showSign = true) => {
    if (!value && value !== 0) return 'N/A';
    const sign = showSign && value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  // Función para obtener el ícono según el tipo
  const getTypeIcon = (type) => {
    const icons = {
      summary: DollarSign,
      revenue: TrendingUp,
      expense: TrendingDown,
      profit: Target,
      budget: Calculator,
      comparison: BarChart3,
      trend: PieChart,
      cash_flow: ArrowRight,
      investment: Building,
      debt: CreditCard,
      asset: Package,
      liability: Receipt,
      equity: Award
    };
    return icons[type] || DollarSign;
  };

  // Función para obtener los colores según el tipo y valor
  const getColors = (type, value, comparison) => {
    // Colores base por tipo
    const typeColors = {
      revenue: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        iconBg: 'bg-green-100',
        title: 'text-green-900',
        amount: 'text-green-700',
        accent: 'bg-green-500'
      },
      expense: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        iconBg: 'bg-red-100',
        title: 'text-red-900',
        amount: 'text-red-700',
        accent: 'bg-red-500'
      },
      profit: {
        bg: value >= 0 ? 'bg-emerald-50' : 'bg-red-50',
        border: value >= 0 ? 'border-emerald-200' : 'border-red-200',
        icon: value >= 0 ? 'text-emerald-600' : 'text-red-600',
        iconBg: value >= 0 ? 'bg-emerald-100' : 'bg-red-100',
        title: value >= 0 ? 'text-emerald-900' : 'text-red-900',
        amount: value >= 0 ? 'text-emerald-700' : 'text-red-700',
        accent: value >= 0 ? 'bg-emerald-500' : 'bg-red-500'
      },
      budget: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        iconBg: 'bg-blue-100',
        title: 'text-blue-900',
        amount: 'text-blue-700',
        accent: 'bg-blue-500'
      },
      summary: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        iconBg: 'bg-purple-100',
        title: 'text-purple-900',
        amount: 'text-purple-700',
        accent: 'bg-purple-500'
      }
    };

    return typeColors[type] || typeColors.summary;
  };

  // Función para obtener el indicador de tendencia
  const getTrendIndicator = (change, previousValue) => {
    if (!change && change !== 0) return null;
    
    const isPositive = change > 0;
    const isRevenue = type === 'revenue' || type === 'profit';
    const isGood = isRevenue ? isPositive : !isPositive;
    
    return {
      icon: isPositive ? ArrowUpRight : ArrowDownRight,
      color: isGood ? 'text-green-600' : 'text-red-600',
      bgColor: isGood ? 'bg-green-100' : 'bg-red-100',
      value: formatPercentage(change),
      isGood
    };
  };

  // Función para obtener el título según el tipo
  const getTypeTitle = (type) => {
    const titles = {
      summary: 'Resumen Financiero',
      revenue: 'Ingresos',
      expense: 'Gastos',
      profit: 'Ganancia Neta',
      budget: 'Presupuesto',
      comparison: 'Comparación',
      trend: 'Tendencia',
      cash_flow: 'Flujo de Efectivo',
      investment: 'Inversiones',
      debt: 'Deudas',
      asset: 'Activos',
      liability: 'Pasivos',
      equity: 'Patrimonio'
    };
    return titles[type] || 'Financiero';
  };

  // Función para obtener las clases de tamaño
  const getSizeClasses = () => {
    const sizeClasses = {
      compact: 'p-3',
      default: 'p-4',
      expanded: 'p-6'
    };
    return sizeClasses[size] || sizeClasses.default;
  };

  // Manejar acciones
  const handleView = () => {
    if (onView) onView(data, type);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(data, type);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    if (onDownload) onDownload(data, type);
  };

  const handleTogglePrivate = (e) => {
    e.stopPropagation();
    setShowPrivate(!showPrivate);
  };

  const handleToggleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  // Datos por defecto
  const defaultData = {
    amount: 0,
    change: 0,
    previousAmount: 0,
    target: 0,
    percentage: 0,
    period: 'Este mes',
    category: 'General',
    description: 'Sin descripción',
    lastUpdated: new Date().toISOString(),
    breakdown: [],
    chartData: [],
    ...data
  };

  const financeData = defaultData;
  const TypeIcon = getTypeIcon(type);
  const colors = getColors(type, financeData.amount, financeData.change);
  const trend = getTrendIndicator(financeData.change, financeData.previousAmount);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={interactive && isHovered ? "hover" : "visible"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={interactive ? handleView : undefined}
      className={`
        ${colors.bg} ${colors.border} border rounded-xl transition-all duration-200
        ${interactive ? 'cursor-pointer' : ''}
        ${isHovered && interactive ? 'shadow-lg' : 'shadow-sm'}
        ${getSizeClasses()}
        ${className}
      `}
      {...props}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Ícono principal */}
          <motion.div
            className={`${colors.iconBg} rounded-lg p-2 ${
              size === 'compact' ? 'p-1.5' : size === 'expanded' ? 'p-3' : 'p-2'
            }`}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <TypeIcon className={`${colors.icon} ${
              size === 'compact' ? 'w-4 h-4' : size === 'expanded' ? 'w-6 h-6' : 'w-5 h-5'
            }`} />
          </motion.div>

          {/* Título y período */}
          <div>
            <h3 className={`${colors.title} font-semibold ${
              size === 'compact' ? 'text-sm' : 'text-lg'
            }`}>
              {getTypeTitle(type)}
            </h3>
            <p className={`text-xs ${colors.icon} opacity-75`}>
              {financeData.period}
            </p>
          </div>
        </div>

        {/* Acciones del header */}
        <div className="flex items-center space-x-1">
          {/* Bookmark */}
          <motion.button
            onClick={handleToggleBookmark}
            className={`p-1 rounded transition-colors ${
              isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </motion.button>

          {/* Privacidad */}
          <motion.button
            onClick={handleTogglePrivate}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={showPrivate ? "Ocultar valores" : "Mostrar valores"}
          >
            {showPrivate ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </motion.button>

          {/* Menú de acciones */}
          {showActions && isHovered && (
            <motion.div
              variants={actionVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center space-x-1"
            >
              <motion.button
                onClick={handleDownload}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Descargar reporte"
              >
                <Download className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={handleEdit}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Editar"
              >
                <Settings className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Monto principal */}
      <motion.div
        variants={numberVariants}
        className="mb-4"
      >
        <div className="flex items-baseline space-x-2">
          <span className={`font-bold ${colors.amount} ${
            size === 'compact' ? 'text-lg' : size === 'expanded' ? 'text-3xl' : 'text-2xl'
          }`}>
            {showPrivate ? (
              <CountUp 
                to={financeData.amount} 
                duration={1.5}
                formatNumber={false}
                prefix={currency === 'MXN' ? '$' : ''}
                separator=","
                decimals={2}
              />
            ) : (
              '••••••'
            )}
          </span>

          {/* Indicador de tendencia */}
          {trend && showPrivate && showComparison && (
            <motion.div
              className={`flex items-center space-x-1 px-2 py-1 rounded-full ${trend.bgColor}`}
              whileHover={{ scale: 1.05 }}
            >
              <trend.icon className={`w-3 h-3 ${trend.color}`} />
              <span className={`text-xs font-medium ${trend.color}`}>
                {trend.value}
              </span>
            </motion.div>
          )}
        </div>

        {/* Descripción */}
        {financeData.description && variant !== 'minimal' && (
          <p className={`text-sm ${colors.icon} opacity-75 mt-1`}>
            {financeData.description}
          </p>
        )}
      </motion.div>

      {/* Información adicional */}
      {size !== 'compact' && variant !== 'stat-only' && (
        <div className="space-y-3">
          {/* Progreso hacia objetivo */}
          {financeData.target && showPrivate && (
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className={colors.icon}>Objetivo</span>
                <span className={`font-medium ${colors.title}`}>
                  {formatCurrency(financeData.target, true)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${colors.accent}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((financeData.amount / financeData.target) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className={colors.icon}>
                  {formatPercentage((financeData.amount / financeData.target) * 100, false)} completado
                </span>
                <span className={colors.icon}>
                  {formatCurrency(financeData.target - financeData.amount, true)} restante
                </span>
              </div>
            </div>
          )}

          {/* Comparación con período anterior */}
          {showComparison && financeData.previousAmount && showPrivate && (
            <div className="flex items-center justify-between text-sm">
              <span className={colors.icon}>Período anterior</span>
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${colors.title}`}>
                  {formatCurrency(financeData.previousAmount, true)}
                </span>
                {trend && (
                  <span className={`text-xs ${trend.color}`}>
                    ({formatCurrency(financeData.amount - financeData.previousAmount, true)})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Desglose de categorías */}
          {financeData.breakdown && financeData.breakdown.length > 0 && size === 'expanded' && showPrivate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? 'auto' : 0 }}
              className="border-t border-gray-200 pt-3 mt-3"
            >
              <div className="space-y-2">
                {financeData.breakdown.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className={`${colors.icon} flex items-center`}>
                      <div className={`w-2 h-2 rounded-full mr-2`} style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className={`font-medium ${colors.title}`}>
                      {formatCurrency(item.amount, true)}
                    </span>
                  </div>
                ))}
                {financeData.breakdown.length > 3 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(!isExpanded);
                    }}
                    className={`text-xs ${colors.icon} hover:${colors.title} transition-colors`}
                  >
                    {isExpanded ? 'Ver menos' : `Ver ${financeData.breakdown.length - 3} más`}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Gráfico mini */}
          {showChart && financeData.chartData && financeData.chartData.length > 0 && size === 'expanded' && (
            <motion.div
              variants={chartVariants}
              className="mt-4"
            >
              <div className="h-16 flex items-end space-x-1">
                {financeData.chartData.slice(-12).map((point, index) => (
                  <motion.div
                    key={index}
                    className={`flex-1 ${colors.accent} rounded-t opacity-60 hover:opacity-100 transition-opacity`}
                    style={{ height: `${(point.value / Math.max(...financeData.chartData.map(d => d.value))) * 100}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(point.value / Math.max(...financeData.chartData.map(d => d.value))) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    title={`${point.label}: ${formatCurrency(point.value)}`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Metadata */}
          {variant === 'detailed' && (
            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <span className={colors.icon}>
                  <Clock className="w-3 h-3 inline mr-1" />
                  Actualizado {format(new Date(financeData.lastUpdated), 'dd/MM/yyyy HH:mm')}
                </span>
                {financeData.category && (
                  <span className={`px-2 py-1 rounded-full ${colors.iconBg} ${colors.icon} font-medium`}>
                    {financeData.category}
                  </span>
                )}
              </div>

              {/* Badges adicionales */}
              <div className="flex items-center space-x-1">
                {financeData.isProjected && (
                  <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                    Proyectado
                  </span>
                )}
                {financeData.isVerified && (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Componente para dashboard financiero
export const FinanceDashboard = ({ 
  data = {},
  period = 'month',
  onView,
  onEdit,
  onDownload,
  showActions = true,
  size = 'default',
  className = ""
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const defaultDashboardData = {
    revenue: { amount: 0, change: 0, target: 0 },
    expenses: { amount: 0, change: 0, target: 0 },
    profit: { amount: 0, change: 0, target: 0 },
    budget: { amount: 0, change: 0, target: 0 },
    ...data
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      <FinanceCard
        type="revenue"
        data={defaultDashboardData.revenue}
        period={period}
        onView={onView}
        onEdit={onEdit}
        onDownload={onDownload}
        showActions={showActions}
        size={size}
      />
      
      <FinanceCard
        type="expense"
        data={defaultDashboardData.expenses}
        period={period}
        onView={onView}
        onEdit={onEdit}
        onDownload={onDownload}
        showActions={showActions}
        size={size}
      />
      
      <FinanceCard
        type="profit"
        data={defaultDashboardData.profit}
        period={period}
        onView={onView}
        onEdit={onEdit}
        onDownload={onDownload}
        showActions={showActions}
        size={size}
      />
      
      <FinanceCard
        type="budget"
        data={defaultDashboardData.budget}
        period={period}
        onView={onView}
        onEdit={onEdit}
        onDownload={onDownload}
        showActions={showActions}
        size={size}
      />
    </motion.div>
  );
};

// Hook para manejar datos financieros
export const useFinanceData = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState('month');

  const updateData = (newData) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const refreshData = async () => {
    setIsLoading(true);
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const exportData = (type, format = 'csv') => {
    // Lógica para exportar datos
    console.log(`Exporting ${type} data as ${format}`);
  };

  return {
    data,
    isLoading,
    period,
    setPeriod,
    updateData,
    refreshData,
    exportData
  };
};

export default FinanceCard;