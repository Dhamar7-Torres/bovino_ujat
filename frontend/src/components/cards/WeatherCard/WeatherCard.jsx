import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  Compass,
  Sunrise,
  Sunset,
  Moon,
  CloudFog,
  Tornado,
  Snowflake,
  Zap,
  Umbrella,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  RefreshCw,
  Download,
  Share2,
  Settings,
  Bell,
  Star,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  ArrowDownRight,
  Timer,
  Target,
  Award,
  Shield,
  Leaf,
  Cow,
  Milk,
  X
} from 'lucide-react';
import { format, addHours, addDays, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';
import CountUp from '../animations/CountUp';

const WeatherCard = ({ 
  data,
  type = 'current', // 'current', 'forecast', 'summary', 'alerts', 'impact', 'historical'
  location = null,
  onView,
  onEdit,
  onAlert,
  onShare,
  onRefresh,
  showForecast = true,
  showAlerts = true,
  showImpact = false,
  showAnimations = true,
  interactive = true,
  size = 'default', // 'compact', 'default', 'expanded'
  variant = 'default', // 'default', 'minimal', 'detailed', 'agricultural'
  unit = 'metric', // 'metric', 'imperial'
  className = "",
  ...props
}) => {
  
  // Estados para la interacción
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(data?.isBookmarked || false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertsVisible, setAlertsVisible] = useState(true);
  
  // Actualizar tiempo cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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

  const sunVariants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const cloudVariants = {
    float: {
      x: [0, 10, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const rainVariants = {
    fall: {
      y: [0, 20],
      opacity: [0, 1, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const windVariants = {
    blow: {
      x: [0, 15, 0],
      scaleX: [1, 1.1, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Función para obtener el ícono del clima
  const getWeatherIcon = (condition, isDay = true) => {
    const weatherIcons = {
      clear: isDay ? Sun : Moon,
      sunny: Sun,
      cloudy: Cloud,
      partly_cloudy: Cloud,
      overcast: Cloud,
      rain: CloudRain,
      drizzle: CloudDrizzle,
      heavy_rain: CloudRain,
      thunderstorm: CloudLightning,
      snow: CloudSnow,
      blizzard: Snowflake,
      fog: CloudFog,
      mist: CloudFog,
      tornado: Tornado,
      windy: Wind,
      hail: CloudSnow
    };
    
    return weatherIcons[condition] || Cloud;
  };

  // Función para obtener los colores según las condiciones climáticas
  const getWeatherColors = (condition, temperature) => {
    // Colores basados en condición climática
    if (condition) {
      const conditionColors = {
        clear: {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-600',
          iconBg: 'bg-yellow-100',
          title: 'text-yellow-900',
          value: 'text-yellow-700',
          accent: 'bg-yellow-500'
        },
        cloudy: {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: 'text-gray-600',
          iconBg: 'bg-gray-100',
          title: 'text-gray-900',
          value: 'text-gray-700',
          accent: 'bg-gray-500'
        },
        rain: {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          iconBg: 'bg-blue-100',
          title: 'text-blue-900',
          value: 'text-blue-700',
          accent: 'bg-blue-500'
        },
        thunderstorm: {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          icon: 'text-purple-600',
          iconBg: 'bg-purple-100',
          title: 'text-purple-900',
          value: 'text-purple-700',
          accent: 'bg-purple-500'
        },
        snow: {
          bg: 'bg-cyan-50',
          border: 'border-cyan-200',
          icon: 'text-cyan-600',
          iconBg: 'bg-cyan-100',
          title: 'text-cyan-900',
          value: 'text-cyan-700',
          accent: 'bg-cyan-500'
        }
      };

      if (conditionColors[condition]) {
        return conditionColors[condition];
      }
    }

    // Colores basados en temperatura si no hay condición específica
    if (temperature !== null && temperature !== undefined) {
      if (temperature >= 30) {
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          iconBg: 'bg-red-100',
          title: 'text-red-900',
          value: 'text-red-700',
          accent: 'bg-red-500'
        };
      } else if (temperature >= 20) {
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: 'text-orange-600',
          iconBg: 'bg-orange-100',
          title: 'text-orange-900',
          value: 'text-orange-700',
          accent: 'bg-orange-500'
        };
      } else if (temperature >= 10) {
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'text-green-600',
          iconBg: 'bg-green-100',
          title: 'text-green-900',
          value: 'text-green-700',
          accent: 'bg-green-500'
        };
      } else {
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          iconBg: 'bg-blue-100',
          title: 'text-blue-900',
          value: 'text-blue-700',
          accent: 'bg-blue-500'
        };
      }
    }

    // Por defecto
    return {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: 'text-gray-600',
      iconBg: 'bg-gray-100',
      title: 'text-gray-900',
      value: 'text-gray-700',
      accent: 'bg-gray-500'
    };
  };

  // Función para formatear valores climáticos
  const formatWeatherValue = (value, type, unitSystem = 'metric') => {
    if (value === null || value === undefined) return 'N/A';
    
    switch (type) {
      case 'temperature':
        if (unitSystem === 'imperial') {
          return `${((value * 9/5) + 32).toFixed(1)}°F`;
        }
        return `${value.toFixed(1)}°C`;
        
      case 'humidity':
        return `${value.toFixed(0)}%`;
        
      case 'pressure':
        return `${value.toFixed(1)} hPa`;
        
      case 'wind_speed':
        if (unitSystem === 'imperial') {
          return `${(value * 2.237).toFixed(1)} mph`;
        }
        return `${value.toFixed(1)} m/s`;
        
      case 'precipitation':
        if (unitSystem === 'imperial') {
          return `${(value * 0.0394).toFixed(2)} in`;
        }
        return `${value.toFixed(1)} mm`;
        
      case 'visibility':
        if (unitSystem === 'imperial') {
          return `${(value * 0.621).toFixed(1)} mi`;
        }
        return `${value.toFixed(1)} km`;
        
      case 'uv_index':
        return value.toFixed(0);
        
      default:
        return value.toString();
    }
  };

  // Función para obtener el impacto agrícola
  const getAgriculturalImpact = (weather) => {
    const impacts = [];
    
    if (weather.temperature > 35) {
      impacts.push({
        type: 'heat_stress',
        severity: 'high',
        message: 'Estrés térmico en ganado',
        recommendation: 'Proporcionar sombra y agua fresca'
      });
    }
    
    if (weather.temperature < 5) {
      impacts.push({
        type: 'cold_stress',
        severity: 'medium',
        message: 'Riesgo de estrés por frío',
        recommendation: 'Refugio adicional necesario'
      });
    }
    
    if (weather.humidity > 80 && weather.temperature > 25) {
      impacts.push({
        type: 'heat_humidity',
        severity: 'high',
        message: 'Índice de calor elevado',
        recommendation: 'Ventilación y enfriamiento urgente'
      });
    }
    
    if (weather.wind_speed > 15) {
      impacts.push({
        type: 'strong_wind',
        severity: 'medium',
        message: 'Vientos fuertes',
        recommendation: 'Asegurar estructuras y equipos'
      });
    }
    
    if (weather.precipitation > 50) {
      impacts.push({
        type: 'heavy_rain',
        severity: 'medium',
        message: 'Lluvia intensa',
        recommendation: 'Revisar drenaje y acceso a refugio'
      });
    }

    return impacts;
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
    if (onView) onView(data, type, location);
  };

  const handleRefresh = async (e) => {
    e?.stopPropagation();
    setIsLoading(true);
    if (onRefresh) {
      await onRefresh(data, location);
    }
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleAlert = (e) => {
    e?.stopPropagation();
    if (onAlert) onAlert(data, location);
  };

  const handleShare = (e) => {
    e?.stopPropagation();
    if (onShare) onShare(data, location);
  };

  const handleToggleBookmark = (e) => {
    e?.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  // Datos por defecto
  const defaultData = {
    current: {
      temperature: 22,
      feels_like: 24,
      humidity: 65,
      pressure: 1013,
      wind_speed: 8,
      wind_direction: 180,
      visibility: 10,
      uv_index: 5,
      condition: 'partly_cloudy',
      description: 'Parcialmente nublado'
    },
    location: {
      name: 'Rancho San José',
      lat: 16.7569,
      lng: -93.1292
    },
    alerts: [],
    forecast: [],
    lastUpdated: new Date().toISOString(),
    ...data
  };

  const weatherData = defaultData;
  const WeatherIcon = getWeatherIcon(weatherData.current.condition, true);
  const colors = getWeatherColors(weatherData.current.condition, weatherData.current.temperature);
  const impacts = showImpact ? getAgriculturalImpact(weatherData.current) : [];

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
      {/* Indicador de carga */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-white bg-opacity-80 rounded-xl flex items-center justify-center z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
          />
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Ícono climático animado */}
          <motion.div
            className={`${colors.iconBg} rounded-lg p-2 ${
              size === 'compact' ? 'p-1.5' : size === 'expanded' ? 'p-3' : 'p-2'
            }`}
            variants={
              showAnimations ? (
                weatherData.current.condition === 'clear' ? sunVariants :
                weatherData.current.condition === 'cloudy' ? cloudVariants :
                weatherData.current.condition === 'rain' ? rainVariants :
                weatherData.current.condition === 'windy' ? windVariants : {}
              ) : {}
            }
            animate={showAnimations ? (
              weatherData.current.condition === 'clear' ? 'rotate' :
              weatherData.current.condition === 'cloudy' ? 'float' :
              weatherData.current.condition === 'rain' ? 'fall' :
              weatherData.current.condition === 'windy' ? 'blow' : ''
            ) : ''}
          >
            <WeatherIcon className={`${colors.icon} ${
              size === 'compact' ? 'w-4 h-4' : size === 'expanded' ? 'w-6 h-6' : 'w-5 h-5'
            }`} />
          </motion.div>

          {/* Ubicación y tiempo */}
          <div>
            <h3 className={`${colors.title} font-semibold ${
              size === 'compact' ? 'text-sm' : 'text-lg'
            }`}>
              {type === 'current' ? 'Clima Actual' : 
               type === 'forecast' ? 'Pronóstico' : 
               type === 'alerts' ? 'Alertas Climáticas' : 'Clima'}
            </h3>
            <p className={`text-xs ${colors.icon} opacity-75`}>
              {weatherData.location.name} • {format(currentTime, 'HH:mm')}
            </p>
          </div>
        </div>

        {/* Acciones del header */}
        <div className="flex items-center space-x-1">
          {/* Alertas activas */}
          {weatherData.alerts && weatherData.alerts.length > 0 && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <Bell className="w-4 h-4 text-red-500" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.div>
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
              <motion.button
                onClick={handleRefresh}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Actualizar"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={handleShare}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Compartir"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Temperatura principal */}
      <div className="mb-4">
        <div className="flex items-baseline space-x-2">
          <span className={`font-bold ${colors.value} ${
            size === 'compact' ? 'text-2xl' : size === 'expanded' ? 'text-4xl' : 'text-3xl'
          }`}>
            <CountUp 
              to={weatherData.current.temperature} 
              duration={1.5}
              decimals={1}
              suffix="°C"
            />
          </span>
          
          {/* Sensación térmica */}
          {weatherData.current.feels_like && Math.abs(weatherData.current.feels_like - weatherData.current.temperature) > 2 && (
            <span className={`text-sm ${colors.icon} opacity-75`}>
              Sensación {formatWeatherValue(weatherData.current.feels_like, 'temperature', unit)}
            </span>
          )}
        </div>

        {/* Descripción */}
        <p className={`text-sm ${colors.icon} opacity-75 mt-1`}>
          {weatherData.current.description}
        </p>
      </div>

      {/* Métricas climáticas */}
      {size !== 'compact' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {/* Humedad */}
          <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
            <div className="flex items-center space-x-1 mb-1">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-600">Humedad</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {formatWeatherValue(weatherData.current.humidity, 'humidity')}
            </p>
          </div>

          {/* Viento */}
          <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
            <div className="flex items-center space-x-1 mb-1">
              <Wind className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">Viento</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {formatWeatherValue(weatherData.current.wind_speed, 'wind_speed', unit)}
            </p>
            {weatherData.current.wind_direction && (
              <div className="flex items-center mt-1">
                <Compass className="w-3 h-3 text-gray-500 mr-1" style={{ 
                  transform: `rotate(${weatherData.current.wind_direction}deg)` 
                }} />
                <span className="text-xs text-gray-500">{weatherData.current.wind_direction}°</span>
              </div>
            )}
          </div>

          {/* Presión */}
          <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
            <div className="flex items-center space-x-1 mb-1">
              <Gauge className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-gray-600">Presión</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {formatWeatherValue(weatherData.current.pressure, 'pressure')}
            </p>
          </div>

          {/* Visibilidad */}
          {size === 'expanded' && weatherData.current.visibility && (
            <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
              <div className="flex items-center space-x-1 mb-1">
                <Eye className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-gray-600">Visibilidad</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {formatWeatherValue(weatherData.current.visibility, 'visibility', unit)}
              </p>
            </div>
          )}

          {/* Índice UV */}
          {size === 'expanded' && weatherData.current.uv_index && (
            <div className="bg-white bg-opacity-50 p-3 rounded-lg border">
              <div className="flex items-center space-x-1 mb-1">
                <Sun className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-medium text-gray-600">UV Index</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {formatWeatherValue(weatherData.current.uv_index, 'uv_index')}
              </p>
              <span className={`text-xs ${
                weatherData.current.uv_index <= 2 ? 'text-green-600' :
                weatherData.current.uv_index <= 5 ? 'text-yellow-600' :
                weatherData.current.uv_index <= 7 ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {weatherData.current.uv_index <= 2 ? 'Bajo' :
                 weatherData.current.uv_index <= 5 ? 'Moderado' :
                 weatherData.current.uv_index <= 7 ? 'Alto' : 'Muy Alto'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Alertas climáticas */}
      {showAlerts && weatherData.alerts && weatherData.alerts.length > 0 && alertsVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-900">
                  Alertas Meteorológicas ({weatherData.alerts.length})
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAlertsVisible(false);
                }}
                className="text-red-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {weatherData.alerts.slice(0, 2).map((alert, index) => (
                <div key={index} className="text-xs text-red-700">
                  • {alert.title}: {alert.description}
                </div>
              ))}
              {weatherData.alerts.length > 2 && (
                <div className="text-xs text-red-600">
                  +{weatherData.alerts.length - 2} alertas más
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Impacto agrícola */}
      {showImpact && impacts.length > 0 && variant === 'agricultural' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Cow className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">
                Impacto Ganadero
              </span>
            </div>
            <div className="space-y-2">
              {impacts.slice(0, 2).map((impact, index) => (
                <div key={index} className="text-xs">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${
                      impact.severity === 'high' ? 'bg-red-500' :
                      impact.severity === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></span>
                    <span className="text-orange-700 font-medium">{impact.message}</span>
                  </div>
                  <p className="text-orange-600 ml-4">{impact.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Pronóstico básico */}
      {showForecast && weatherData.forecast && weatherData.forecast.length > 0 && size !== 'compact' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border-t border-gray-200 pt-3"
        >
          <div className="flex items-center space-x-1 mb-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Próximos días</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {weatherData.forecast.slice(0, 3).map((day, index) => {
              const DayIcon = getWeatherIcon(day.condition);
              return (
                <div key={index} className="text-center p-2 bg-white bg-opacity-50 rounded border">
                  <div className="text-xs text-gray-600 mb-1">
                    {format(addDays(new Date(), index + 1), 'EEE', { locale: es })}
                  </div>
                  <DayIcon className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-900">
                    {formatWeatherValue(day.max_temp, 'temperature', unit)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatWeatherValue(day.min_temp, 'temperature', unit)}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Footer con última actualización */}
      {variant !== 'minimal' && (
        <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t border-gray-200">
          <span className={colors.icon}>
            <Clock className="w-3 h-3 inline mr-1" />
            Actualizado {format(new Date(weatherData.lastUpdated), 'HH:mm')}
          </span>
          
          {weatherData.alerts && weatherData.alerts.length > 0 && (
            <motion.button
              onClick={handleAlert}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-3 h-3" />
              <span>Ver alertas</span>
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Componente para dashboard climático
export const WeatherDashboard = ({ 
  locations = [],
  onView,
  onAlert,
  onShare,
  onRefresh,
  showActions = true,
  size = 'default',
  variant = 'agricultural',
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
    >
      {locations.map((location) => (
        <WeatherCard
          key={location.id}
          data={location.weather}
          location={location}
          type="current"
          onView={onView}
          onAlert={onAlert}
          onShare={onShare}
          onRefresh={onRefresh}
          showActions={showActions}
          showImpact={true}
          size={size}
          variant={variant}
        />
      ))}
    </motion.div>
  );
};

// Hook para manejar datos climáticos
export const useWeatherData = () => {
  const [weather, setWeather] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const updateWeather = (locationId, weatherData) => {
    setWeather(prev => ({
      ...prev,
      [locationId]: {
        ...prev[locationId],
        ...weatherData,
        lastUpdated: new Date().toISOString()
      }
    }));
    setLastUpdated(new Date());
  };

  const addAlert = (locationId, alert) => {
    const newAlert = {
      id: Date.now().toString(),
      locationId,
      timestamp: new Date().toISOString(),
      ...alert
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const refreshWeather = async (locationId) => {
    setIsLoading(true);
    try {
      // Simular llamada a API meteorológica
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Actualizar datos...
    } catch (error) {
      console.error('Error refreshing weather:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAgriculturalRecommendations = (weatherData) => {
    const recommendations = [];
    
    // Lógica para generar recomendaciones basadas en el clima
    if (weatherData.temperature > 30) {
      recommendations.push({
        type: 'cooling',
        priority: 'high',
        message: 'Activar sistemas de enfriamiento para el ganado'
      });
    }
    
    return recommendations;
  };

  return {
    weather,
    alerts,
    isLoading,
    lastUpdated,
    updateWeather,
    addAlert,
    refreshWeather,
    getAgriculturalRecommendations
  };
};

export default WeatherCard;