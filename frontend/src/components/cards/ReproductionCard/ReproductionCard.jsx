import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Baby,
  Calendar,
  Clock,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  EyeOff,
  Edit,
  Settings,
  Bell,
  Star,
  Award,
  Zap,
  MapPin,
  User,
  Phone,
  Stethoscope,
  Thermometer,
  Scale,
  Milk,
  Plus,
  Minus,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Circle,
  Timer,
  Bookmark,
  Share2,
  Download,
  RefreshCw,
  MoreVertical,
  X,
  FileText,
  Calculator,
  PieChart,
  BarChart3,
  Percent,
  DollarSign
} from 'lucide-react';
import { format, differenceInDays, differenceInWeeks, addDays, addWeeks, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';
import CountUp from '../animations/CountUp';

const ReproductionCard = ({ 
  data,
  type = 'summary', // 'summary', 'individual', 'pregnancy', 'breeding', 'lactation', 'cycle', 'performance', 'calendar'
  animalId = null,
  onView,
  onEdit,
  onSchedule,
  onBreed,
  onCheckPregnancy,
  onCalvingAlert,
  onDryOff,
  showActions = true,
  showProgress = true,
  showPredictions = true,
  interactive = true,
  size = 'default', // 'compact', 'default', 'expanded'
  variant = 'default', // 'default', 'minimal', 'detailed', 'timeline'
  priority = 'normal', // 'low', 'normal', 'high', 'urgent'
  className = "",
  ...props
}) => {
  
  // Estados para la interacción
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(data?.isBookmarked || false);
  const [currentView, setCurrentView] = useState('overview');
  
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

  const progressVariants = {
    hidden: { width: 0 },
    visible: { 
      width: "100%",
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    }
  };

  const heartbeatVariants = {
    beat: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  // Función para obtener el ícono según el tipo
  const getTypeIcon = (type) => {
    const icons = {
      summary: Activity,
      individual: Heart,
      pregnancy: Baby,
      breeding: Target,
      lactation: Milk,
      cycle: Calendar,
      performance: TrendingUp,
      calendar: Clock,
      insemination: Zap,
      birth: Baby,
      dry_period: Timer,
      heat_detection: Thermometer
    };
    return icons[type] || Heart;
  };

  // Función para obtener los colores según el estado reproductivo
  const getReproductiveColors = (status, priority = 'normal') => {
    const priorityOverride = {
      urgent: {
        bg: 'bg-red-50',
        border: 'border-red-300',
        icon: 'text-red-700',
        iconBg: 'bg-red-100',
        title: 'text-red-900',
        value: 'text-red-800',
        accent: 'bg-red-600'
      },
      high: {
        bg: 'bg-orange-50',
        border: 'border-orange-300',
        icon: 'text-orange-700',
        iconBg: 'bg-orange-100',
        title: 'text-orange-900',
        value: 'text-orange-800',
        accent: 'bg-orange-600'
      }
    };

    if (priority === 'urgent' || priority === 'high') {
      return priorityOverride[priority];
    }

    const statusColors = {
      pregnant: {
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        icon: 'text-pink-600',
        iconBg: 'bg-pink-100',
        title: 'text-pink-900',
        value: 'text-pink-700',
        accent: 'bg-pink-500'
      },
      lactating: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        iconBg: 'bg-blue-100',
        title: 'text-blue-900',
        value: 'text-blue-700',
        accent: 'bg-blue-500'
      },
      dry: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: 'text-yellow-600',
        iconBg: 'bg-yellow-100',
        title: 'text-yellow-900',
        value: 'text-yellow-700',
        accent: 'bg-yellow-500'
      },
      breeding: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        iconBg: 'bg-purple-100',
        title: 'text-purple-900',
        value: 'text-purple-700',
        accent: 'bg-purple-500'
      },
      open: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        iconBg: 'bg-green-100',
        title: 'text-green-900',
        value: 'text-green-700',
        accent: 'bg-green-500'
      },
      heat: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        iconBg: 'bg-red-100',
        title: 'text-red-900',
        value: 'text-red-700',
        accent: 'bg-red-500'
      },
      unknown: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: 'text-gray-600',
        iconBg: 'bg-gray-100',
        title: 'text-gray-900',
        value: 'text-gray-700',
        accent: 'bg-gray-500'
      }
    };

    return statusColors[status] || statusColors.unknown;
  };

  // Función para calcular el progreso de gestación
  const calculateGestationProgress = (confirmationDate, dueDate) => {
    if (!confirmationDate || !dueDate) return 0;
    
    const totalDays = differenceInDays(new Date(dueDate), new Date(confirmationDate));
    const elapsedDays = differenceInDays(new Date(), new Date(confirmationDate));
    
    return Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100));
  };

  // Función para calcular días restantes
  const calculateDaysRemaining = (targetDate) => {
    if (!targetDate) return null;
    return differenceInDays(new Date(targetDate), new Date());
  };

  // Función para obtener el trimestre de gestación
  const getGestationTrimester = (progress) => {
    if (progress < 33.33) return { trimester: 1, name: 'Primer trimestre' };
    if (progress < 66.66) return { trimester: 2, name: 'Segundo trimestre' };
    return { trimester: 3, name: 'Tercer trimestre' };
  };

  // Función para obtener el título según el tipo
  const getTypeTitle = (type) => {
    const titles = {
      summary: 'Resumen Reproductivo',
      individual: 'Reproducción Individual',
      pregnancy: 'Gestación',
      breeding: 'Reproducción',
      lactation: 'Lactancia',
      cycle: 'Ciclo Reproductivo',
      performance: 'Rendimiento',
      calendar: 'Calendario Reproductivo',
      insemination: 'Inseminación',
      birth: 'Parto',
      dry_period: 'Período Seco',
      heat_detection: 'Detección de Celo'
    };
    return titles[type] || 'Reproducción';
  };

  // Función para formatear valores reproductivos
  const formatReproductiveValue = (value, type, unit = '') => {
    if (!value && value !== 0) return 'N/A';
    
    switch (type) {
      case 'days':
        return `${value} día${value !== 1 ? 's' : ''}`;
      case 'weeks':
        return `${value} semana${value !== 1 ? 's' : ''}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'services_per_conception':
        return `${value.toFixed(1)} servicios`;
      case 'conception_rate':
        return `${value.toFixed(1)}%`;
      default:
        return `${value}${unit ? ' ' + unit : ''}`;
    }
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
    if (onView) onView(data, type, animalId);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(data, type, animalId);
  };

  const handleQuickAction = (action, e) => {
    e.stopPropagation();
    switch (action) {
      case 'breed':
        if (onBreed) onBreed(data, animalId);
        break;
      case 'check_pregnancy':
        if (onCheckPregnancy) onCheckPregnancy(data, animalId);
        break;
      case 'calving_alert':
        if (onCalvingAlert) onCalvingAlert(data, animalId);
        break;
      case 'dry_off':
        if (onDryOff) onDryOff(data, animalId);
        break;
      case 'schedule':
        if (onSchedule) onSchedule(data, animalId);
        break;
      default:
        break;
    }
  };

  const handleToggleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  // Datos por defecto
  const defaultData = {
    status: 'unknown',
    lastBreeding: null,
    lastCalving: null,
    expectedDueDate: null,
    gestationDays: 0,
    lactationDays: 0,
    dryPeriodDays: 0,
    cycleLength: 21,
    heatDetection: null,
    pregnancyConfirmed: null,
    conceptionRate: 0,
    servicesPerConception: 0,
    calves: [],
    milkProduction: 0,
    bodyCondition: 0,
    animalInfo: {
      name: 'Animal',
      tagNumber: 'N/A',
      age: 0
    },
    ...data
  };

  const reproData = defaultData;
  const TypeIcon = getTypeIcon(type);
  const colors = getReproductiveColors(reproData.status, priority);

  // Cálculos específicos
  const gestationProgress = calculateGestationProgress(reproData.pregnancyConfirmed, reproData.expectedDueDate);
  const daysToCalving = calculateDaysRemaining(reproData.expectedDueDate);
  const trimester = getGestationTrimester(gestationProgress);

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
        ${priority === 'urgent' ? 'ring-2 ring-red-400' : ''}
        ${getSizeClasses()}
        ${className}
      `}
      {...props}
    >
      {/* Indicador de prioridad urgente */}
      {priority === 'urgent' && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Ícono principal */}
          <motion.div
            className={`${colors.iconBg} rounded-lg p-2 ${
              size === 'compact' ? 'p-1.5' : size === 'expanded' ? 'p-3' : 'p-2'
            }`}
            variants={reproData.status === 'pregnant' ? heartbeatVariants : {}}
            animate={reproData.status === 'pregnant' ? 'beat' : ''}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <TypeIcon className={`${colors.icon} ${
              size === 'compact' ? 'w-4 h-4' : size === 'expanded' ? 'w-6 h-6' : 'w-5 h-5'
            }`} />
          </motion.div>

          {/* Título y animal */}
          <div>
            <h3 className={`${colors.title} font-semibold ${
              size === 'compact' ? 'text-sm' : 'text-lg'
            }`}>
              {getTypeTitle(type)}
            </h3>
            {animalId && reproData.animalInfo && (
              <p className={`text-xs ${colors.icon} opacity-75`}>
                {reproData.animalInfo.name} #{reproData.animalInfo.tagNumber}
              </p>
            )}
          </div>
        </div>

        {/* Acciones del header */}
        <div className="flex items-center space-x-1">
          {/* Estado reproductivo badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.iconBg} ${colors.icon}`}>
            {reproData.status.charAt(0).toUpperCase() + reproData.status.slice(1)}
          </span>

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
          {showActions && isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-1"
            >
              <motion.button
                onClick={handleEdit}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Progreso de gestación */}
      {reproData.status === 'pregnant' && showProgress && size !== 'compact' && (
        <motion.div
          variants={statsVariants}
          className="mb-4"
        >
          <div className="bg-white bg-opacity-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Baby className="w-4 h-4 text-pink-600" />
                <span className="text-sm font-medium text-gray-900">Gestación</span>
              </div>
              <span className="text-xs text-gray-500">
                {trimester.name}
              </span>
            </div>
            
            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <motion.div
                className="bg-pink-500 h-3 rounded-full relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${gestationProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                  animate={{ x: [-100, 300] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">
                {formatReproductiveValue(gestationProgress, 'percentage')} completado
              </span>
              {daysToCalving !== null && (
                <span className={`font-medium ${daysToCalving <= 30 ? 'text-red-600' : 'text-gray-700'}`}>
                  {daysToCalving > 0 ? `${daysToCalving} días restantes` : 'Fecha vencida'}
                </span>
              )}
            </div>

            {/* Fecha esperada de parto */}
            {reproData.expectedDueDate && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-600">Parto esperado:</span>
                <span className="text-xs font-medium text-gray-900">
                  {format(new Date(reproData.expectedDueDate), 'dd/MM/yyyy')}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Información principal */}
      {size !== 'compact' && (
        <motion.div
          variants={statsVariants}
          className="space-y-3"
        >
          {/* Estadísticas clave */}
          <div className="grid grid-cols-2 gap-3">
            {/* Último evento reproductivo */}
            {reproData.lastBreeding && (
              <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
                <div className="flex items-center space-x-1 mb-1">
                  <Heart className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-gray-600">Último Servicio</span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {format(new Date(reproData.lastBreeding), 'dd/MM/yyyy')}
                </p>
                <p className="text-xs text-gray-500">
                  Hace {differenceInDays(new Date(), new Date(reproData.lastBreeding))} días
                </p>
              </div>
            )}

            {/* Producción de leche actual */}
            {reproData.status === 'lactating' && reproData.milkProduction && (
              <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
                <div className="flex items-center space-x-1 mb-1">
                  <Milk className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-gray-600">Producción</span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  <CountUp to={reproData.milkProduction} decimals={1} />L/día
                </p>
                <p className="text-xs text-gray-500">
                  {reproData.lactationDays} días en lactancia
                </p>
              </div>
            )}

            {/* Condición corporal */}
            {reproData.bodyCondition && (
              <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
                <div className="flex items-center space-x-1 mb-1">
                  <Scale className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-gray-600">Condición</span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {reproData.bodyCondition}/5
                </p>
                <p className="text-xs text-gray-500">
                  {reproData.bodyCondition >= 3.5 ? 'Óptima' : 
                   reproData.bodyCondition >= 2.5 ? 'Buena' : 'Baja'}
                </p>
              </div>
            )}

            {/* Servicios por concepción */}
            {reproData.servicesPerConception && (
              <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
                <div className="flex items-center space-x-1 mb-1">
                  <Target className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium text-gray-600">Eficiencia</span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {formatReproductiveValue(reproData.servicesPerConception, 'services_per_conception')}
                </p>
                <p className="text-xs text-gray-500">
                  {reproData.conceptionRate ? 
                    `${formatReproductiveValue(reproData.conceptionRate, 'conception_rate')} éxito` : 
                    'Por concepción'}
                </p>
              </div>
            )}
          </div>

          {/* Próximos eventos */}
          {showPredictions && size === 'expanded' && (
            <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
              <div className="flex items-center space-x-1 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Próximos Eventos</span>
              </div>
              
              <div className="space-y-2">
                {reproData.status === 'open' && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Próximo celo esperado:</span>
                    <span className="font-medium text-gray-900">
                      {format(addDays(new Date(), reproData.cycleLength || 21), 'dd/MM/yyyy')}
                    </span>
                  </div>
                )}
                
                {reproData.status === 'pregnant' && daysToCalving <= 60 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Secado recomendado:</span>
                    <span className="font-medium text-gray-900">
                      {format(addDays(new Date(reproData.expectedDueDate), -60), 'dd/MM/yyyy')}
                    </span>
                  </div>
                )}
                
                {reproData.lastCalving && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Próximo servicio:</span>
                    <span className="font-medium text-gray-900">
                      {format(addDays(new Date(reproData.lastCalving), 45), 'dd/MM/yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Historial de crías */}
          {reproData.calves && reproData.calves.length > 0 && size === 'expanded' && variant === 'detailed' && (
            <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <Baby className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Historial de Crías</span>
                </div>
                <span className="text-xs text-gray-500">
                  {reproData.calves.length} partos
                </span>
              </div>
              
              <div className="space-y-1">
                {reproData.calves.slice(0, 3).map((calf, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {calf.gender === 'male' ? '♂' : '♀'} {calf.name || `Cría ${index + 1}`}
                    </span>
                    <span className="font-medium text-gray-900">
                      {format(new Date(calf.birthDate), 'dd/MM/yyyy')}
                    </span>
                  </div>
                ))}
                {reproData.calves.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{reproData.calves.length - 3} más
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Acciones contextuales */}
      {showActions && isHovered && size !== 'compact' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200"
        >
          <div className="flex space-x-2">
            {reproData.status === 'open' && (
              <motion.button
                onClick={(e) => handleQuickAction('breed', e)}
                className="flex items-center px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-4 h-4 mr-1" />
                Servicar
              </motion.button>
            )}

            {reproData.status === 'breeding' && (
              <motion.button
                onClick={(e) => handleQuickAction('check_pregnancy', e)}
                className="flex items-center px-3 py-2 text-sm text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Stethoscope className="w-4 h-4 mr-1" />
                Chequear
              </motion.button>
            )}

            {reproData.status === 'pregnant' && daysToCalving <= 30 && (
              <motion.button
                onClick={(e) => handleQuickAction('calving_alert', e)}
                className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-4 h-4 mr-1" />
                Alertar
              </motion.button>
            )}

            {reproData.status === 'lactating' && reproData.lactationDays >= 305 && (
              <motion.button
                onClick={(e) => handleQuickAction('dry_off', e)}
                className="flex items-center px-3 py-2 text-sm text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Timer className="w-4 h-4 mr-1" />
                Secar
              </motion.button>
            )}

            <motion.button
              onClick={(e) => handleQuickAction('schedule', e)}
              className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Programar
            </motion.button>
          </div>

          <div className="text-xs text-gray-500">
            {reproData.lastBreeding && 
              `Actualizado ${format(new Date(reproData.lastBreeding), 'dd/MM')}`
            }
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Componente para dashboard reproductivo
export const ReproductionDashboard = ({ 
  data = {},
  onView,
  onEdit,
  onSchedule,
  onBreed,
  onCheckPregnancy,
  onCalvingAlert,
  onDryOff,
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
    pregnant: { count: 0, percentage: 0 },
    lactating: { count: 0, avgProduction: 0 },
    open: { count: 0, needBreeding: 0 },
    performance: { conceptionRate: 0, avgServicesPerConception: 0 },
    ...data
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      <ReproductionCard
        type="pregnancy"
        data={defaultDashboardData.pregnant}
        onView={onView}
        onEdit={onEdit}
        onSchedule={onSchedule}
        onBreed={onBreed}
        onCheckPregnancy={onCheckPregnancy}
        onCalvingAlert={onCalvingAlert}
        onDryOff={onDryOff}
        showActions={showActions}
        size={size}
      />
      
      <ReproductionCard
        type="lactation"
        data={defaultDashboardData.lactating}
        onView={onView}
        onEdit={onEdit}
        onSchedule={onSchedule}
        onBreed={onBreed}
        onCheckPregnancy={onCheckPregnancy}
        onCalvingAlert={onCalvingAlert}
        onDryOff={onDryOff}
        showActions={showActions}
        size={size}
      />
      
      <ReproductionCard
        type="breeding"
        data={defaultDashboardData.open}
        onView={onView}
        onEdit={onEdit}
        onSchedule={onSchedule}
        onBreed={onBreed}
        onCheckPregnancy={onCheckPregnancy}
        onCalvingAlert={onCalvingAlert}
        onDryOff={onDryOff}
        showActions={showActions}
        size={size}
      />
      
      <ReproductionCard
        type="performance"
        data={defaultDashboardData.performance}
        onView={onView}
        onEdit={onEdit}
        onSchedule={onSchedule}
        onBreed={onBreed}
        onCheckPregnancy={onCheckPregnancy}
        onCalvingAlert={onCalvingAlert}
        onDryOff={onDryOff}
        showActions={showActions}
        size={size}
      />
    </motion.div>
  );
};

// Hook para manejar datos reproductivos
export const useReproductionData = () => {
  const [data, setData] = useState({});
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateReproductiveStatus = (animalId, status, additionalData = {}) => {
    setData(prev => ({
      ...prev,
      [animalId]: {
        ...prev[animalId],
        status,
        ...additionalData,
        lastUpdated: new Date().toISOString()
      }
    }));
  };

  const recordBreeding = (animalId, breedingData) => {
    const newEvent = {
      id: Date.now().toString(),
      animalId,
      type: 'breeding',
      date: breedingData.date,
      ...breedingData
    };
    
    setEvents(prev => [newEvent, ...prev]);
    updateReproductiveStatus(animalId, 'breeding', {
      lastBreeding: breedingData.date
    });
  };

  const confirmPregnancy = (animalId, confirmationData) => {
    updateReproductiveStatus(animalId, 'pregnant', {
      pregnancyConfirmed: confirmationData.date,
      expectedDueDate: confirmationData.dueDate,
      gestationDays: 0
    });
  };

  const recordCalving = (animalId, calvingData) => {
    const newEvent = {
      id: Date.now().toString(),
      animalId,
      type: 'calving',
      date: calvingData.date,
      ...calvingData
    };
    
    setEvents(prev => [newEvent, ...prev]);
    updateReproductiveStatus(animalId, 'lactating', {
      lastCalving: calvingData.date,
      lactationDays: 0
    });
  };

  return {
    data,
    events,
    isLoading,
    updateReproductiveStatus,
    recordBreeding,
    confirmPregnancy,
    recordCalving
  };
};

export default ReproductionCard;