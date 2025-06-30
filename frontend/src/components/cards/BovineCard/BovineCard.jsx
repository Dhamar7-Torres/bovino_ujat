import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cow, 
  MapPin, 
  Calendar, 
  Scale, 
  Heart, 
  Activity, 
  Thermometer,
  Droplets,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Award,
  Eye,
  Edit,
  MoreVertical,
  Baby,
  Milk,
  Beef,
  Stethoscope,
  Syringe,
  Target,
  TrendingUp,
  TrendingDown,
  Circle,
  User,
  Zap,
  Info,
  Camera,
  Phone,
  Bell,
  Bookmark,
  Share2,
  Download,
  RefreshCw,
  X
} from 'lucide-react';
import { format, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { es } from 'date-fns/locale';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';
import CountUp from '../animations/CountUp';

const BovineCard = ({ 
  bovine,
  onView,
  onEdit,
  onSelect,
  onLocationView,
  onHealthCheck,
  onVaccinate,
  onBreeding,
  showActions = true,
  showStats = true,
  showHealth = true,
  selectable = false,
  selected = false,
  size = 'default', // 'compact', 'default', 'expanded'
  variant = 'default', // 'default', 'minimal', 'detailed', 'stat-focused'
  layout = 'vertical', // 'vertical', 'horizontal'
  className = "",
  ...props
}) => {
  
  // Estados para la interacción
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(bovine?.isFavorite || false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
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

  const statsVariants = {
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

  // Función para calcular la edad
  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    
    const birth = new Date(birthDate);
    const years = differenceInYears(new Date(), birth);
    const months = differenceInMonths(new Date(), birth) % 12;
    
    if (years > 0) {
      return `${years}a ${months}m`;
    } else {
      return `${months} meses`;
    }
  };

  // Función para obtener el estado de salud
  const getHealthStatus = (health) => {
    if (!health) return { status: 'unknown', color: 'gray', icon: AlertTriangle };
    
    const statusConfig = {
      excellent: { color: 'green', icon: CheckCircle, text: 'Excelente' },
      good: { color: 'blue', icon: Activity, text: 'Bueno' },
      fair: { color: 'yellow', icon: AlertTriangle, text: 'Regular' },
      poor: { color: 'orange', icon: AlertTriangle, text: 'Malo' },
      critical: { color: 'red', icon: AlertTriangle, text: 'Crítico' },
      unknown: { color: 'gray', icon: AlertTriangle, text: 'Desconocido' }
    };

    return statusConfig[health.status] || statusConfig.unknown;
  };

  // Función para obtener el color del estado reproductivo
  const getReproductiveStatus = (reproductive) => {
    if (!reproductive) return { color: 'gray', text: 'N/A', icon: Heart };
    
    const statusConfig = {
      pregnant: { color: 'pink', text: 'Gestante', icon: Baby },
      lactating: { color: 'blue', text: 'Lactante', icon: Milk },
      dry: { color: 'yellow', text: 'Seca', icon: Clock },
      breeding: { color: 'purple', text: 'Reproducción', icon: Heart },
      open: { color: 'green', text: 'Vacía', icon: Target },
      retired: { color: 'gray', text: 'Retirada', icon: Circle }
    };

    return statusConfig[reproductive.status] || statusConfig.open;
  };

  // Función para obtener la categoría del bovino
  const getBovineCategory = (bovine) => {
    const categoryConfig = {
      cow: { text: 'Vaca', icon: Cow, color: 'blue' },
      bull: { text: 'Toro', icon: Cow, color: 'red' },
      heifer: { text: 'Novilla', icon: Cow, color: 'purple' },
      calf: { text: 'Ternero', icon: Baby, color: 'green' },
      steer: { text: 'Novillo', icon: Cow, color: 'orange' }
    };

    return categoryConfig[bovine.category] || categoryConfig.cow;
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
    if (onView) onView(bovine);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(bovine);
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    if (onSelect) onSelect(bovine, !selected);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleQuickAction = (action, e) => {
    e.stopPropagation();
    switch (action) {
      case 'health':
        if (onHealthCheck) onHealthCheck(bovine);
        break;
      case 'vaccinate':
        if (onVaccinate) onVaccinate(bovine);
        break;
      case 'breeding':
        if (onBreeding) onBreeding(bovine);
        break;
      case 'location':
        if (onLocationView) onLocationView(bovine);
        break;
      default:
        break;
    }
    setShowQuickActions(false);
  };

  // Obtener configuraciones
  const healthStatus = getHealthStatus(bovine.health);
  const reproductiveStatus = getReproductiveStatus(bovine.reproductive);
  const category = getBovineCategory(bovine);

  // Datos por defecto si no se proporcionan
  const defaultBovine = {
    id: 'N/A',
    name: 'Sin nombre',
    tagNumber: 'N/A',
    category: 'cow',
    breed: 'N/A',
    birthDate: null,
    weight: 0,
    health: { status: 'unknown' },
    reproductive: { status: 'open' },
    location: { name: 'N/A' },
    production: { current: 0, average: 0 },
    vaccinations: { current: 0, total: 0 },
    image: null,
    ...bovine
  };

  const data = defaultBovine;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={isHovered ? "hover" : "visible"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleView}
      className={`
        bg-white rounded-xl shadow-sm border transition-all duration-200 cursor-pointer
        ${selected ? 'ring-2 ring-green-500 border-green-300' : 'border-gray-200 hover:border-gray-300'}
        ${isHovered ? 'shadow-lg' : ''}
        ${getSizeClasses()}
        ${layout === 'horizontal' ? 'flex items-center space-x-4' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Checkbox de selección */}
      {selectable && (
        <div className="absolute top-3 left-3 z-10">
          <motion.button
            onClick={handleSelect}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              selected 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300 hover:border-green-500'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {selected && <CheckCircle className="w-3 h-3" />}
          </motion.button>
        </div>
      )}

      {/* Favorito */}
      <div className="absolute top-3 right-3 z-10">
        <motion.button
          onClick={handleToggleFavorite}
          className={`p-1 rounded-full transition-colors ${
            isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      {layout === 'vertical' ? (
        <div className="space-y-4">
          {/* Header con imagen y info básica */}
          <div className="flex items-start space-x-3">
            {/* Imagen del bovino */}
            <div className="relative flex-shrink-0">
              {data.image && !imageError ? (
                <img
                  src={data.image}
                  alt={data.name}
                  onError={() => setImageError(true)}
                  className={`rounded-lg object-cover ${
                    size === 'compact' ? 'w-12 h-12' : 
                    size === 'expanded' ? 'w-20 h-20' : 'w-16 h-16'
                  }`}
                />
              ) : (
                <div className={`rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center ${
                  size === 'compact' ? 'w-12 h-12' : 
                  size === 'expanded' ? 'w-20 h-20' : 'w-16 h-16'
                }`}>
                  {React.createElement(category.icon, {
                    className: `text-green-600 ${
                      size === 'compact' ? 'w-6 h-6' : 
                      size === 'expanded' ? 'w-10 h-10' : 'w-8 h-8'
                    }`
                  })}
                </div>
              )}

              {/* Badge de categoría */}
              <div className={`absolute -bottom-1 -right-1 px-2 py-1 rounded-full text-xs font-medium bg-${category.color}-100 text-${category.color}-700`}>
                {category.text}
              </div>
            </div>

            {/* Información básica */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={`font-semibold text-gray-900 truncate ${
                  size === 'compact' ? 'text-sm' : 'text-lg'
                }`}>
                  {data.name}
                </h3>
                
                {/* Estado de salud */}
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full bg-${healthStatus.color}-100`}>
                  {React.createElement(healthStatus.icon, {
                    className: `w-3 h-3 text-${healthStatus.color}-600`
                  })}
                  {size !== 'compact' && (
                    <span className={`text-xs font-medium text-${healthStatus.color}-700`}>
                      {healthStatus.text}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    #{data.tagNumber}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {calculateAge(data.birthDate)}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Cow className="w-4 h-4 mr-1" />
                    {data.breed}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {data.location.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas principales */}
          {showStats && size !== 'compact' && (
            <motion.div
              variants={statsVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {/* Peso */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Peso</p>
                    <div className="flex items-center space-x-1">
                      <CountUp to={data.weight} className="text-lg font-bold text-blue-700" />
                      <span className="text-xs text-blue-600">kg</span>
                    </div>
                  </div>
                  <Scale className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              {/* Producción */}
              {data.category === 'cow' && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-green-600 font-medium">Producción</p>
                      <div className="flex items-center space-x-1">
                        <CountUp to={data.production.current} className="text-lg font-bold text-green-700" />
                        <span className="text-xs text-green-600">L/día</span>
                      </div>
                    </div>
                    <Milk className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              )}

              {/* Estado reproductivo */}
              <div className={`bg-${reproductiveStatus.color}-50 p-3 rounded-lg border border-${reproductiveStatus.color}-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs text-${reproductiveStatus.color}-600 font-medium`}>Reproductivo</p>
                    <p className={`text-sm font-bold text-${reproductiveStatus.color}-700 truncate`}>
                      {reproductiveStatus.text}
                    </p>
                  </div>
                  {React.createElement(reproductiveStatus.icon, {
                    className: `w-5 h-5 text-${reproductiveStatus.color}-600`
                  })}
                </div>
              </div>

              {/* Vacunaciones */}
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-600 font-medium">Vacunas</p>
                    <p className="text-sm font-bold text-purple-700">
                      {data.vaccinations.current}/{data.vaccinations.total}
                    </p>
                  </div>
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Información de salud detallada */}
          {showHealth && size === 'expanded' && data.health && (
            <motion.div
              variants={statsVariants}
              className="bg-gray-50 p-4 rounded-lg border"
            >
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Stethoscope className="w-4 h-4 mr-2" />
                Estado de Salud
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {data.health.temperature && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Temperatura:</span>
                    <span className="font-medium flex items-center">
                      <Thermometer className="w-3 h-3 mr-1" />
                      {data.health.temperature}°C
                    </span>
                  </div>
                )}
                
                {data.health.heartRate && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pulso:</span>
                    <span className="font-medium flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {data.health.heartRate} bpm
                    </span>
                  </div>
                )}
                
                {data.health.lastCheckup && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Último chequeo:</span>
                    <span className="font-medium">
                      {format(new Date(data.health.lastCheckup), 'dd/MM/yyyy')}
                    </span>
                  </div>
                )}
              </div>

              {data.health.notes && (
                <div className="mt-3 p-2 bg-white rounded border">
                  <p className="text-xs text-gray-600">{data.health.notes}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Acciones rápidas */}
          {showActions && isHovered && (
            <motion.div
              variants={actionVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-between pt-3 border-t border-gray-100"
            >
              <div className="flex space-x-2">
                <motion.button
                  onClick={(e) => handleQuickAction('health', e)}
                  className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Stethoscope className="w-4 h-4 mr-1" />
                  Salud
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

                {data.category === 'cow' && (
                  <motion.button
                    onClick={(e) => handleQuickAction('breeding', e)}
                    className="flex items-center px-3 py-2 text-sm text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    Reproducir
                  </motion.button>
                )}
              </div>

              <div className="flex space-x-1">
                <motion.button
                  onClick={(e) => handleQuickAction('location', e)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Ver ubicación"
                >
                  <MapPin className="w-4 h-4" />
                </motion.button>

                <motion.button
                  onClick={handleEdit}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </motion.button>

                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQuickActions(!showQuickActions);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Más acciones"
                >
                  <MoreVertical className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        // Layout horizontal
        <div className="flex items-center space-x-4">
          {/* Imagen */}
          <div className="relative flex-shrink-0">
            {data.image && !imageError ? (
              <img
                src={data.image}
                alt={data.name}
                onError={() => setImageError(true)}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                {React.createElement(category.icon, {
                  className: "w-8 h-8 text-green-600"
                })}
              </div>
            )}
          </div>

          {/* Información principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {data.name}
              </h3>
              <span className="text-sm text-gray-500">#{data.tagNumber}</span>
              <div className={`px-2 py-1 rounded-full text-xs font-medium bg-${category.color}-100 text-${category.color}-700`}>
                {category.text}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{data.breed}</span>
              <span>{calculateAge(data.birthDate)}</span>
              <span>{data.weight} kg</span>
              <span>{data.location.name}</span>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          {showStats && (
            <div className="flex items-center space-x-4">
              <div className={`px-2 py-1 rounded-full bg-${healthStatus.color}-100 flex items-center space-x-1`}>
                {React.createElement(healthStatus.icon, {
                  className: `w-3 h-3 text-${healthStatus.color}-600`
                })}
                <span className={`text-xs font-medium text-${healthStatus.color}-700`}>
                  {healthStatus.text}
                </span>
              </div>

              <div className={`px-2 py-1 rounded-full bg-${reproductiveStatus.color}-100 flex items-center space-x-1`}>
                {React.createElement(reproductiveStatus.icon, {
                  className: `w-3 h-3 text-${reproductiveStatus.color}-600`
                })}
                <span className={`text-xs font-medium text-${reproductiveStatus.color}-700`}>
                  {reproductiveStatus.text}
                </span>
              </div>
            </div>
          )}

          {/* Acciones */}
          {showActions && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => handleQuickAction('health', e)}
                className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Stethoscope className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Componente de grid para múltiples bovinos
export const BovineGrid = ({ 
  bovines = [], 
  onView, 
  onEdit, 
  onSelect,
  onLocationView,
  onHealthCheck,
  onVaccinate,
  onBreeding,
  selectedBovines = [],
  selectable = false,
  size = 'default',
  variant = 'default',
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
      {bovines.map((bovine) => (
        <BovineCard
          key={bovine.id}
          bovine={bovine}
          onView={onView}
          onEdit={onEdit}
          onSelect={onSelect}
          onLocationView={onLocationView}
          onHealthCheck={onHealthCheck}
          onVaccinate={onVaccinate}
          onBreeding={onBreeding}
          selectable={selectable}
          selected={selectedBovines.includes(bovine.id)}
          size={size}
          variant={variant}
        />
      ))}
    </motion.div>
  );
};

export default BovineCard;