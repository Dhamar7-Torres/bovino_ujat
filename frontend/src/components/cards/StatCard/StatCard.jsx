import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Star,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Minus,
  Plus,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Share2,
  MoreVertical,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  DollarSign,
  Percent,
  Hash,
  Scale,
  Thermometer,
  Heart,
  Shield,
  Milk,
  Beef,
  Baby,
  Cow,
  Stethoscope,
  Syringe,
  MapPin,
  Building,
  Truck,
  Package,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  Leaf,
  Scissors,
  Calculator,
  FileText,
  Database,
  Settings,
  Filter,
  Bookmark
} from 'lucide-react';
import { format, subDays, subWeeks, subMonths, subYears } from 'date-fns';
import { es } from 'date-fns/locale';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';
import CountUp from '../animations/CountUp';

const StatCard = ({ 
  data,
  type = 'number', // 'number', 'percentage', 'currency', 'trend', 'progress', 'comparison', 'gauge'
  metric = 'general', // categoria de la métrica: 'production', 'health', 'finance', 'reproduction', etc.
  onView,
  onEdit,
  onDownload,
  onRefresh,
  showTrend = true,
  showComparison = true,
  showChart = false,
  interactive = true,
  size = 'default', // 'compact', 'default', 'expanded'
  variant = 'default', // 'default', 'minimal', 'detailed', 'highlighted'
  period = 'month', // 'day', 'week', 'month', 'quarter', 'year'
  animation = true,
  className = "",
  ...props
}) => {
  
  // Estados para la interacción
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showPrivate, setShowPrivate] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(data?.isBookmarked || false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState(period);
  
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

  const numberVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: 0.4,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const trendVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        delay: 0.3,
        duration: 0.4
      }
    }
  };

  // Función para obtener el ícono según la métrica
  const getMetricIcon = (metric, type) => {
    const metricIcons = {
      // Producción
      production_milk: Milk,
      production_meat: Beef,
      production_weight: Scale,
      production_feed: Package,
      production_efficiency: Target,
      
      // Salud
      health_status: Stethoscope,
      health_temperature: Thermometer,
      health_heart_rate: Heart,
      health_vaccinations: Syringe,
      health_treatments: Shield,
      
      // Reproducción
      reproduction_pregnancy: Baby,
      reproduction_conception: Target,
      reproduction_calving: Cow,
      reproduction_lactation: Milk,
      
      // Finanzas
      finance_revenue: DollarSign,
      finance_expenses: TrendingDown,
      finance_profit: TrendingUp,
      finance_roi: Percent,
      
      // General
      total_animals: Users,
      total_locations: MapPin,
      total_staff: Building,
      alerts_critical: AlertTriangle,
      alerts_warning: Info,
      
      // Clima
      weather_temperature: Thermometer,
      weather_humidity: Droplets,
      weather_rainfall: CloudRain,
      weather_wind: Wind,
      
      // Operaciones
      operations_efficiency: Award,
      operations_productivity: BarChart3,
      operations_quality: Star,
      operations_compliance: CheckCircle
    };

    // Iconos por tipo
    const typeIcons = {
      number: Hash,
      percentage: Percent,
      currency: DollarSign,
      trend: TrendingUp,
      progress: Target,
      comparison: BarChart3,
      gauge: Activity
    };

    // Buscar por métrica específica primero
    const metricKey = `${metric}_${type}`;
    if (metricIcons[metricKey]) {
      return metricIcons[metricKey];
    }

    // Buscar por métrica general
    if (metricIcons[metric]) {
      return metricIcons[metric];
    }

    // Buscar por tipo
    if (typeIcons[type]) {
      return typeIcons[type];
    }

    // Por defecto
    return Activity;
  };

  // Función para obtener los colores según el rendimiento
  const getPerformanceColors = (value, target, trend) => {
    // Determinar rendimiento basado en valor vs objetivo y tendencia
    let performance = 'neutral';
    
    if (target && value !== null && value !== undefined) {
      const percentage = (value / target) * 100;
      if (percentage >= 100) performance = 'excellent';
      else if (percentage >= 80) performance = 'good';
      else if (percentage >= 60) performance = 'fair';
      else performance = 'poor';
    } else if (trend) {
      if (trend > 10) performance = 'excellent';
      else if (trend > 0) performance = 'good';
      else if (trend > -10) performance = 'fair';
      else performance = 'poor';
    }

    const colorSchemes = {
      excellent: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        iconBg: 'bg-green-100',
        title: 'text-green-900',
        value: 'text-green-700',
        accent: 'bg-green-500'
      },
      good: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        iconBg: 'bg-blue-100',
        title: 'text-blue-900',
        value: 'text-blue-700',
        accent: 'bg-blue-500'
      },
      fair: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: 'text-yellow-600',
        iconBg: 'bg-yellow-100',
        title: 'text-yellow-900',
        value: 'text-yellow-700',
        accent: 'bg-yellow-500'
      },
      poor: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        iconBg: 'bg-red-100',
        title: 'text-red-900',
        value: 'text-red-700',
        accent: 'bg-red-500'
      },
      neutral: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: 'text-gray-600',
        iconBg: 'bg-gray-100',
        title: 'text-gray-900',
        value: 'text-gray-700',
        accent: 'bg-gray-500'
      }
    };

    return colorSchemes[performance];
  };

  // Función para formatear valores según el tipo
  const formatValue = (value, type, options = {}) => {
    if (value === null || value === undefined) return 'N/A';
    
    const { 
      decimals = 0, 
      prefix = '', 
      suffix = '',
      currency = 'MXN',
      compact = false 
    } = options;

    switch (type) {
      case 'currency':
        const formatter = new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
          notation: compact && Math.abs(value) >= 1000 ? 'compact' : 'standard'
        });
        return formatter.format(value);
        
      case 'percentage':
        return `${value.toFixed(decimals)}%`;
        
      case 'number':
        if (compact && Math.abs(value) >= 1000) {
          if (Math.abs(value) >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
          } else if (Math.abs(value) >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
          }
        }
        return `${prefix}${value.toLocaleString('es-MX', { 
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals 
        })}${suffix}`;
        
      default:
        return `${prefix}${value}${suffix}`;
    }
  };

  // Función para obtener el indicador de tendencia
  const getTrendIndicator = (trend, type) => {
    if (!trend && trend !== 0) return null;
    
    const isPositive = trend > 0;
    const isGoodTrend = type === 'expenses' ? !isPositive : isPositive;
    
    return {
      icon: isPositive ? ArrowUpRight : trend < 0 ? ArrowDownRight : ArrowRight,
      color: isGoodTrend ? 'text-green-600' : 'text-red-600',
      bgColor: isGoodTrend ? 'bg-green-100' : 'bg-red-100',
      value: Math.abs(trend),
      isGood: isGoodTrend
    };
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
    if (onView) onView(data, metric, type);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(data, metric, type);
  };

  const handleRefresh = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    if (onRefresh) {
      await onRefresh(data, metric, type);
    }
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    if (onDownload) onDownload(data, metric, type);
  };

  const handleToggleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleTogglePrivate = (e) => {
    e.stopPropagation();
    setShowPrivate(!showPrivate);
  };

  // Datos por defecto
  const defaultData = {
    value: 0,
    label: 'Estadística',
    trend: 0,
    target: null,
    previousValue: null,
    unit: '',
    prefix: '',
    suffix: '',
    decimals: 0,
    period: 'Este mes',
    lastUpdated: new Date().toISOString(),
    chartData: [],
    description: '',
    category: metric,
    priority: 'normal',
    isProjected: false,
    isVerified: true,
    ...data
  };

  const statData = defaultData;
  const MetricIcon = getMetricIcon(metric, type);
  const colors = getPerformanceColors(statData.value, statData.target, statData.trend);
  const trendIndicator = getTrendIndicator(statData.trend, metric);

  return (
    <motion.div
      variants={cardVariants}
      initial={animation ? "hidden" : "visible"}
      animate="visible"
      whileHover={interactive && isHovered ? "hover" : "visible"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={interactive ? handleView : undefined}
      className={`
        ${colors.bg} ${colors.border} border rounded-xl transition-all duration-200
        ${interactive ? 'cursor-pointer' : ''}
        ${isHovered && interactive ? 'shadow-lg' : 'shadow-sm'}
        ${variant === 'highlighted' ? 'ring-2 ring-blue-400' : ''}
        ${getSizeClasses()}
        ${className}
      `}
      {...props}
    >
      {/* Indicador de carga */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-white bg-opacity-80 rounded-xl flex items-center justify-center"
        >
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* Ícono principal */}
          <motion.div
            className={`${colors.iconBg} rounded-lg p-2 ${
              size === 'compact' ? 'p-1.5' : size === 'expanded' ? 'p-3' : 'p-2'
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <MetricIcon className={`${colors.icon} ${
              size === 'compact' ? 'w-4 h-4' : size === 'expanded' ? 'w-6 h-6' : 'w-5 h-5'
            }`} />
          </motion.div>

          {/* Título y período */}
          <div className="min-w-0 flex-1">
            <h3 className={`${colors.title} font-semibold truncate ${
              size === 'compact' ? 'text-sm' : 'text-base'
            }`}>
              {statData.label}
            </h3>
            <p className={`text-xs ${colors.icon} opacity-75`}>
              {statData.period}
            </p>
          </div>
        </div>

        {/* Acciones del header */}
        <div className="flex items-center space-x-1">
          {/* Estado de verificación */}
          {statData.isVerified && variant !== 'minimal' && (
            <CheckCircle className="w-3 h-3 text-green-500" />
          )}
          
          {/* Indicador de proyección */}
          {statData.isProjected && variant !== 'minimal' && (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
              Proyectado
            </span>
          )}

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

          {/* Acciones rápidas */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-1"
            >
              {/* Privacidad */}
              <motion.button
                onClick={handleTogglePrivate}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={showPrivate ? "Ocultar valor" : "Mostrar valor"}
              >
                {showPrivate ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </motion.button>

              {/* Refresh */}
              <motion.button
                onClick={handleRefresh}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Actualizar"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>

              {/* Download */}
              <motion.button
                onClick={handleDownload}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Descargar"
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Valor principal */}
      <motion.div
        variants={numberVariants}
        className="mb-3"
      >
        <div className="flex items-baseline space-x-2">
          <span className={`font-bold ${colors.value} ${
            size === 'compact' ? 'text-lg' : size === 'expanded' ? 'text-3xl' : 'text-2xl'
          }`}>
            {showPrivate ? (
              animation ? (
                <CountUp 
                  to={statData.value} 
                  duration={1.5}
                  decimals={statData.decimals}
                  prefix={statData.prefix}
                  suffix={statData.suffix}
                  formatNumber={type !== 'currency'}
                />
              ) : (
                formatValue(statData.value, type, {
                  decimals: statData.decimals,
                  prefix: statData.prefix,
                  suffix: statData.suffix,
                  compact: size === 'compact'
                })
              )
            ) : (
              '••••••'
            )}
          </span>

          {/* Indicador de tendencia */}
          {showTrend && trendIndicator && showPrivate && (
            <motion.div
              variants={trendVariants}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full ${trendIndicator.bgColor}`}
              whileHover={{ scale: 1.05 }}
            >
              <trendIndicator.icon className={`w-3 h-3 ${trendIndicator.color}`} />
              <span className={`text-xs font-medium ${trendIndicator.color}`}>
                {formatValue(trendIndicator.value, 'percentage', { decimals: 1 })}
              </span>
            </motion.div>
          )}
        </div>

        {/* Descripción */}
        {statData.description && variant !== 'minimal' && (
          <p className={`text-sm ${colors.icon} opacity-75 mt-1`}>
            {statData.description}
          </p>
        )}
      </motion.div>

      {/* Información adicional */}
      {size !== 'compact' && variant !== 'minimal' && (
        <div className="space-y-3">
          {/* Progreso hacia objetivo */}
          {statData.target && showPrivate && (
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className={colors.icon}>Objetivo</span>
                <span className={`font-medium ${colors.title}`}>
                  {formatValue(statData.target, type, {
                    decimals: statData.decimals,
                    prefix: statData.prefix,
                    suffix: statData.suffix,
                    compact: true
                  })}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${colors.accent}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((statData.value / statData.target) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className={colors.icon}>
                  {formatValue((statData.value / statData.target) * 100, 'percentage', { decimals: 1 })} alcanzado
                </span>
                <span className={colors.icon}>
                  {formatValue(statData.target - statData.value, type, {
                    decimals: statData.decimals,
                    compact: true
                  })} restante
                </span>
              </div>
            </div>
          )}

          {/* Comparación con período anterior */}
          {showComparison && statData.previousValue && showPrivate && (
            <div className="flex items-center justify-between text-sm">
              <span className={colors.icon}>Período anterior</span>
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${colors.title}`}>
                  {formatValue(statData.previousValue, type, {
                    decimals: statData.decimals,
                    compact: true
                  })}
                </span>
                {trendIndicator && (
                  <span className={`text-xs ${trendIndicator.color}`}>
                    ({formatValue(statData.value - statData.previousValue, type, {
                      decimals: statData.decimals,
                      prefix: statData.value > statData.previousValue ? '+' : '',
                      compact: true
                    })})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Gráfico mini */}
          {showChart && statData.chartData && statData.chartData.length > 0 && size === 'expanded' && (
            <motion.div
              variants={chartVariants}
              className="mt-4"
            >
              <div className="h-16 flex items-end space-x-1">
                {statData.chartData.slice(-12).map((point, index) => (
                  <motion.div
                    key={index}
                    className={`flex-1 ${colors.accent} rounded-t opacity-60 hover:opacity-100 transition-opacity cursor-pointer`}
                    style={{ height: `${(point.value / Math.max(...statData.chartData.map(d => d.value))) * 100}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(point.value / Math.max(...statData.chartData.map(d => d.value))) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    title={`${point.label}: ${formatValue(point.value, type, {
                      decimals: statData.decimals
                    })}`}
                    whileHover={{ opacity: 1, scale: 1.05 }}
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
                  {format(new Date(statData.lastUpdated), 'dd/MM HH:mm')}
                </span>
                {statData.category && (
                  <span className={`px-2 py-1 rounded-full ${colors.iconBg} ${colors.icon} font-medium`}>
                    {statData.category}
                  </span>
                )}
              </div>

              {/* Nivel de prioridad */}
              {statData.priority && statData.priority !== 'normal' && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statData.priority === 'high' ? 'bg-red-100 text-red-700' :
                  statData.priority === 'low' ? 'bg-gray-100 text-gray-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {statData.priority}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Componente para dashboard de estadísticas
export const StatsDashboard = ({ 
  stats = [],
  onView,
  onEdit,
  onDownload,
  onRefresh,
  showActions = true,
  size = 'default',
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
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

  const getGridClasses = () => {
    return `grid gap-4 ${
      columns.sm === 1 ? 'grid-cols-1' : `grid-cols-${columns.sm}`
    } ${
      columns.md ? `md:grid-cols-${columns.md}` : ''
    } ${
      columns.lg ? `lg:grid-cols-${columns.lg}` : ''
    } ${
      columns.xl ? `xl:grid-cols-${columns.xl}` : ''
    }`;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${getGridClasses()} ${className}`}
    >
      {stats.map((stat, index) => (
        <StatCard
          key={stat.id || index}
          data={stat}
          type={stat.type || 'number'}
          metric={stat.metric || 'general'}
          onView={onView}
          onEdit={onEdit}
          onDownload={onDownload}
          onRefresh={onRefresh}
          showActions={showActions}
          size={size}
        />
      ))}
    </motion.div>
  );
};

// Hook para manejar estadísticas
export const useStats = () => {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const updateStat = (id, newData) => {
    setStats(prev => prev.map(stat => 
      stat.id === id ? { ...stat, ...newData, lastUpdated: new Date().toISOString() } : stat
    ));
  };

  const addStat = (statData) => {
    const newStat = {
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
      ...statData
    };
    setStats(prev => [...prev, newStat]);
  };

  const removeStat = (id) => {
    setStats(prev => prev.filter(stat => stat.id !== id));
  };

  const refreshStats = async () => {
    setIsLoading(true);
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const exportStats = (format = 'csv') => {
    // Lógica para exportar estadísticas
    console.log(`Exporting stats as ${format}`);
  };

  return {
    stats,
    isLoading,
    filters,
    setFilters,
    updateStat,
    addStat,
    removeStat,
    refreshStats,
    exportStats
  };
};

export default StatCard;