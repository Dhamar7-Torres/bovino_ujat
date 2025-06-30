import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Stethoscope,
  Thermometer,
  Activity,
  Shield,
  Syringe,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  User,
  Zap,
  Target,
  Award,
  Star,
  Info,
  RefreshCw,
  Download,
  Edit,
  MoreVertical,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Circle,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  Microscope,
  Pill,
  Baby,
  Cow,
  Scale,
  Beef,
  Milk,
  FileText,
  Phone,
  Bell,
  Settings,
  Filter,
  Search,
  X
} from 'lucide-react';
import { format, differenceInDays, isAfter, isBefore, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';
import CountUp from '../animations/CountUp';

const HealthCard = ({ 
  data,
  type = 'summary', // 'summary', 'individual', 'vaccination', 'treatment', 'checkup', 'alert', 'stats'
  animalId = null,
  onView,
  onEdit,
  onSchedule,
  onAlert,
  onTreat,
  onVaccinate,
  showActions = true,
  showTrends = true,
  showAlerts = true,
  interactive = true,
  size = 'default', // 'compact', 'default', 'expanded'
  variant = 'default', // 'default', 'minimal', 'detailed', 'emergency'
  urgencyLevel = 'normal', // 'low', 'normal', 'high', 'critical'
  className = "",
  ...props
}) => {
  
  // Estados para la interacción
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPrivateInfo, setShowPrivateInfo] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(data?.isBookmarked || false);
  const [currentMetric, setCurrentMetric] = useState('temperature');
  
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
    },
    emergency: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const vitalSignsVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        delay: 0.3,
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const alertVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  // Función para obtener el ícono según el tipo
  const getTypeIcon = (type) => {
    const icons = {
      summary: Activity,
      individual: Stethoscope,
      vaccination: Syringe,
      treatment: Pill,
      checkup: Heart,
      alert: AlertTriangle,
      stats: TrendingUp,
      temperature: Thermometer,
      heart_rate: Heart,
      respiratory: Wind,
      blood_pressure: Activity,
      weight: Scale,
      pregnancy: Baby,
      lactation: Milk,
      nutrition: Target,
      disease: Microscope,
      injury: AlertTriangle
    };
    return icons[type] || Stethoscope;
  };

  // Función para obtener los colores según el estado de salud
  const getHealthColors = (status, urgency = 'normal') => {
    const urgencyOverride = {
      critical: {
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

    if (urgency === 'critical' || urgency === 'high') {
      return urgencyOverride[urgency];
    }

    const statusColors = {
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
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        iconBg: 'bg-orange-100',
        title: 'text-orange-900',
        value: 'text-orange-700',
        accent: 'bg-orange-500'
      },
      critical: {
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

  // Función para evaluar rangos normales de signos vitales
  const evaluateVitalSign = (type, value, animalCategory = 'cow') => {
    const ranges = {
      cow: {
        temperature: { min: 38.0, max: 39.5, unit: '°C' },
        heart_rate: { min: 60, max: 80, unit: 'bpm' },
        respiratory_rate: { min: 12, max: 25, unit: 'rpm' },
        weight: { min: 400, max: 700, unit: 'kg' }
      },
      calf: {
        temperature: { min: 38.5, max: 39.5, unit: '°C' },
        heart_rate: { min: 80, max: 120, unit: 'bpm' },
        respiratory_rate: { min: 20, max: 40, unit: 'rpm' },
        weight: { min: 30, max: 150, unit: 'kg' }
      },
      bull: {
        temperature: { min: 38.0, max: 39.5, unit: '°C' },
        heart_rate: { min: 50, max: 70, unit: 'bpm' },
        respiratory_rate: { min: 12, max: 20, unit: 'rpm' },
        weight: { min: 600, max: 1200, unit: 'kg' }
      }
    };

    const range = ranges[animalCategory]?.[type];
    if (!range || !value) return { status: 'unknown', message: 'Sin datos' };

    if (value < range.min) {
      return { 
        status: 'low', 
        message: `Bajo (normal: ${range.min}-${range.max}${range.unit})`,
        severity: value < range.min * 0.9 ? 'critical' : 'warning'
      };
    } else if (value > range.max) {
      return { 
        status: 'high', 
        message: `Alto (normal: ${range.min}-${range.max}${range.unit})`,
        severity: value > range.max * 1.1 ? 'critical' : 'warning'
      };
    } else {
      return { 
        status: 'normal', 
        message: `Normal (${range.min}-${range.max}${range.unit})`,
        severity: 'normal'
      };
    }
  };

  // Función para obtener el título según el tipo
  const getTypeTitle = (type) => {
    const titles = {
      summary: 'Resumen de Salud',
      individual: 'Salud Individual',
      vaccination: 'Vacunación',
      treatment: 'Tratamiento',
      checkup: 'Chequeo Médico',
      alert: 'Alerta de Salud',
      stats: 'Estadísticas',
      temperature: 'Temperatura',
      heart_rate: 'Frecuencia Cardíaca',
      respiratory: 'Respiración',
      blood_pressure: 'Presión',
      weight: 'Peso',
      pregnancy: 'Gestación',
      lactation: 'Lactancia',
      nutrition: 'Nutrición',
      disease: 'Enfermedad',
      injury: 'Lesión'
    };
    return titles[type] || 'Salud';
  };

  // Función para formatear valores médicos
  const formatMedicalValue = (value, type, unit = '') => {
    if (!value && value !== 0) return 'N/A';
    
    switch (type) {
      case 'temperature':
        return `${value.toFixed(1)}°C`;
      case 'heart_rate':
        return `${Math.round(value)} bpm`;
      case 'respiratory_rate':
        return `${Math.round(value)} rpm`;
      case 'weight':
        return `${value.toFixed(1)} kg`;
      case 'percentage':
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

  const handleSchedule = (e) => {
    e.stopPropagation();
    if (onSchedule) onSchedule(data, type, animalId);
  };

  const handleQuickAction = (action, e) => {
    e.stopPropagation();
    switch (action) {
      case 'treat':
        if (onTreat) onTreat(data, animalId);
        break;
      case 'vaccinate':
        if (onVaccinate) onVaccinate(data, animalId);
        break;
      case 'alert':
        if (onAlert) onAlert(data, animalId);
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
    lastCheckup: new Date().toISOString(),
    nextCheckup: addDays(new Date(), 30).toISOString(),
    veterinarian: 'Dr. García',
    temperature: null,
    heartRate: null,
    respiratoryRate: null,
    weight: null,
    alerts: [],
    vaccinations: [],
    treatments: [],
    notes: '',
    animalInfo: {
      name: 'Animal',
      tagNumber: 'N/A',
      category: 'cow'
    },
    ...data
  };

  const healthData = defaultData;
  const TypeIcon = getTypeIcon(type);
  const colors = getHealthColors(healthData.status, urgencyLevel);

  // Evaluar signos vitales
  const temperatureEval = evaluateVitalSign('temperature', healthData.temperature, healthData.animalInfo?.category);
  const heartRateEval = evaluateVitalSign('heart_rate', healthData.heartRate, healthData.animalInfo?.category);
  const respiratoryEval = evaluateVitalSign('respiratory_rate', healthData.respiratoryRate, healthData.animalInfo?.category);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={urgencyLevel === 'critical' ? "emergency" : "visible"}
      whileHover={interactive && isHovered ? "hover" : "visible"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={interactive ? handleView : undefined}
      className={`
        ${colors.bg} ${colors.border} border rounded-xl transition-all duration-200
        ${interactive ? 'cursor-pointer' : ''}
        ${isHovered && interactive ? 'shadow-lg' : 'shadow-sm'}
        ${urgencyLevel === 'critical' ? 'ring-2 ring-red-400' : ''}
        ${getSizeClasses()}
        ${className}
      `}
      {...props}
    >
      {/* Indicador de urgencia crítica */}
      {urgencyLevel === 'critical' && (
        <motion.div
          variants={pulseVariants}
          animate="pulse"
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
            {animalId && healthData.animalInfo && (
              <p className={`text-xs ${colors.icon} opacity-75`}>
                {healthData.animalInfo.name} #{healthData.animalInfo.tagNumber}
              </p>
            )}
          </div>
        </div>

        {/* Acciones del header */}
        <div className="flex items-center space-x-1">
          {/* Estado de salud badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.iconBg} ${colors.icon}`}>
            {healthData.status.charAt(0).toUpperCase() + healthData.status.slice(1)}
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
          {showActions && isHovered && urgencyLevel !== 'critical' && (
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

              <motion.button
                onClick={handleSchedule}
                className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Programar"
              >
                <Calendar className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Signos vitales principales */}
      {(healthData.temperature || healthData.heartRate || healthData.respiratoryRate) && size !== 'compact' && (
        <motion.div
          variants={vitalSignsVariants}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4"
        >
          {/* Temperatura */}
          {healthData.temperature && (
            <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1">
                  <Thermometer className={`w-4 h-4 ${
                    temperatureEval.severity === 'critical' ? 'text-red-600' :
                    temperatureEval.severity === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <span className="text-xs font-medium text-gray-600">Temperatura</span>
                </div>
              </div>
              <p className={`text-lg font-bold ${colors.value}`}>
                {formatMedicalValue(healthData.temperature, 'temperature')}
              </p>
              <p className="text-xs text-gray-500">{temperatureEval.message}</p>
            </div>
          )}

          {/* Frecuencia cardíaca */}
          {healthData.heartRate && (
            <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1">
                  <Heart className={`w-4 h-4 ${
                    heartRateEval.severity === 'critical' ? 'text-red-600' :
                    heartRateEval.severity === 'warning' ? 'text-yellow-600' :
                    'text-red-500'
                  }`} />
                  <span className="text-xs font-medium text-gray-600">Pulso</span>
                </div>
              </div>
              <p className={`text-lg font-bold ${colors.value}`}>
                {formatMedicalValue(healthData.heartRate, 'heart_rate')}
              </p>
              <p className="text-xs text-gray-500">{heartRateEval.message}</p>
            </div>
          )}

          {/* Respiración */}
          {healthData.respiratoryRate && (
            <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1">
                  <Wind className={`w-4 h-4 ${
                    respiratoryEval.severity === 'critical' ? 'text-red-600' :
                    respiratoryEval.severity === 'warning' ? 'text-yellow-600' :
                    'text-blue-500'
                  }`} />
                  <span className="text-xs font-medium text-gray-600">Respiración</span>
                </div>
              </div>
              <p className={`text-lg font-bold ${colors.value}`}>
                {formatMedicalValue(healthData.respiratoryRate, 'respiratory_rate')}
              </p>
              <p className="text-xs text-gray-500">{respiratoryEval.message}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Alertas activas */}
      {showAlerts && healthData.alerts && healthData.alerts.length > 0 && (
        <motion.div
          variants={alertVariants}
          className="mb-4"
        >
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">
                Alertas Activas ({healthData.alerts.length})
              </span>
            </div>
            <div className="space-y-1">
              {healthData.alerts.slice(0, 2).map((alert, index) => (
                <div key={index} className="text-xs text-red-700">
                  • {alert.message}
                </div>
              ))}
              {healthData.alerts.length > 2 && (
                <div className="text-xs text-red-600">
                  +{healthData.alerts.length - 2} alertas más
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Información adicional */}
      {size !== 'compact' && variant !== 'minimal' && (
        <div className="space-y-3">
          {/* Próximos eventos */}
          <div className="flex items-center justify-between text-sm">
            <span className={colors.icon}>Próximo chequeo</span>
            <span className={`font-medium ${colors.title}`}>
              {format(new Date(healthData.nextCheckup), 'dd/MM/yyyy')}
            </span>
          </div>

          {/* Veterinario responsable */}
          {healthData.veterinarian && (
            <div className="flex items-center justify-between text-sm">
              <span className={colors.icon}>Veterinario</span>
              <span className={`font-medium ${colors.title}`}>
                {healthData.veterinarian}
              </span>
            </div>
          )}

          {/* Peso actual */}
          {healthData.weight && (
            <div className="flex items-center justify-between text-sm">
              <span className={colors.icon}>Peso</span>
              <span className={`font-medium ${colors.title}`}>
                {formatMedicalValue(healthData.weight, 'weight')}
              </span>
            </div>
          )}

          {/* Vacunaciones */}
          {healthData.vaccinations && healthData.vaccinations.length > 0 && (
            <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Vacunas</span>
                </div>
                <span className="text-xs text-gray-500">
                  {healthData.vaccinations.filter(v => v.status === 'completed').length}/{healthData.vaccinations.length}
                </span>
              </div>
              <div className="space-y-1">
                {healthData.vaccinations.slice(0, 2).map((vaccine, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{vaccine.name}</span>
                    <span className={`px-2 py-1 rounded-full font-medium ${
                      vaccine.status === 'completed' ? 'bg-green-100 text-green-700' :
                      vaccine.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {vaccine.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tratamientos activos */}
          {healthData.treatments && healthData.treatments.length > 0 && (
            <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <Pill className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Tratamientos</span>
                </div>
                <span className="text-xs text-gray-500">
                  {healthData.treatments.filter(t => t.status === 'active').length} activos
                </span>
              </div>
              <div className="space-y-1">
                {healthData.treatments.filter(t => t.status === 'active').slice(0, 2).map((treatment, index) => (
                  <div key={index} className="text-xs text-gray-600">
                    • {treatment.name} - {treatment.dosage}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notas médicas */}
          {healthData.notes && size === 'expanded' && variant === 'detailed' && (
            <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
              <div className="flex items-center space-x-1 mb-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Notas</span>
              </div>
              <p className="text-xs text-gray-600">{healthData.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Acciones de emergencia para casos críticos */}
      {urgencyLevel === 'critical' && showActions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 pt-3 mt-3 border-t border-red-200"
        >
          <motion.button
            onClick={(e) => handleQuickAction('treat', e)}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Stethoscope className="w-4 h-4 mr-1" />
            Tratar Ahora
          </motion.button>

          <motion.button
            onClick={(e) => handleQuickAction('alert', e)}
            className="flex items-center justify-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Phone className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}

      {/* Acciones normales */}
      {urgencyLevel !== 'critical' && showActions && isHovered && size !== 'compact' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200"
        >
          <div className="flex space-x-2">
            <motion.button
              onClick={(e) => handleQuickAction('treat', e)}
              className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Stethoscope className="w-4 h-4 mr-1" />
              Examinar
            </motion.button>

            <motion.button
              onClick={(e) => handleQuickAction('vaccinate', e)}
              className="flex items-center px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Syringe className="w-4 h-4 mr-1" />
              Vacunar
            </motion.button>
          </div>

          <div className="text-xs text-gray-500">
            Actualizado {format(new Date(healthData.lastCheckup), 'dd/MM HH:mm')}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Componente para dashboard de salud
export const HealthDashboard = ({ 
  data = {},
  onView,
  onEdit,
  onSchedule,
  onAlert,
  onTreat,
  onVaccinate,
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
    summary: { status: 'good', alerts: [] },
    critical: { status: 'critical', alerts: [] },
    vaccinations: { completed: 0, pending: 0 },
    treatments: { active: 0, completed: 0 },
    ...data
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      <HealthCard
        type="summary"
        data={defaultDashboardData.summary}
        onView={onView}
        onEdit={onEdit}
        onSchedule={onSchedule}
        onAlert={onAlert}
        onTreat={onTreat}
        onVaccinate={onVaccinate}
        showActions={showActions}
        size={size}
      />
      
      <HealthCard
        type="alert"
        data={defaultDashboardData.critical}
        urgencyLevel="critical"
        onView={onView}
        onEdit={onEdit}
        onSchedule={onSchedule}
        onAlert={onAlert}
        onTreat={onTreat}
        onVaccinate={onVaccinate}
        showActions={showActions}
        size={size}
      />
      
      <HealthCard
        type="vaccination"
        data={defaultDashboardData.vaccinations}
        onView={onView}
        onEdit={onEdit}
        onSchedule={onSchedule}
        onAlert={onAlert}
        onTreat={onTreat}
        onVaccinate={onVaccinate}
        showActions={showActions}
        size={size}
      />
      
      <HealthCard
        type="treatment"
        data={defaultDashboardData.treatments}
        onView={onView}
        onEdit={onEdit}
        onSchedule={onSchedule}
        onAlert={onAlert}
        onTreat={onTreat}
        onVaccinate={onVaccinate}
        showActions={showActions}
        size={size}
      />
    </motion.div>
  );
};

// Hook para manejar datos de salud
export const useHealthData = () => {
  const [data, setData] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateVitalSigns = (animalId, vitalSigns) => {
    setData(prev => ({
      ...prev,
      [animalId]: {
        ...prev[animalId],
        ...vitalSigns,
        lastUpdated: new Date().toISOString()
      }
    }));
  };

  const addAlert = (animalId, alert) => {
    const newAlert = {
      id: Date.now().toString(),
      animalId,
      timestamp: new Date().toISOString(),
      ...alert
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const scheduleCheckup = (animalId, date, veterinarian) => {
    setData(prev => ({
      ...prev,
      [animalId]: {
        ...prev[animalId],
        nextCheckup: date,
        veterinarian
      }
    }));
  };

  return {
    data,
    alerts,
    isLoading,
    updateVitalSigns,
    addAlert,
    scheduleCheckup
  };
};

export default HealthCard;