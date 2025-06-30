// Componente Spinner liviano y versátil para indicadores de carga

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Loader2, 
  RotateCw, 
  RefreshCw,
  Circle,
  Zap,
  Heart,
  Star,
  Sun
} from 'lucide-react';

const Spinner = ({
  size = 'medium',
  variant = 'default',
  color = 'blue',
  speed = 'normal',
  label = '',
  showLabel = false,
  inline = false,
  className = '',
  style = {},
  ...rest
}) => {

  // Configuraciones de tamaño
  const sizeConfig = {
    tiny: { 
      spinner: 'w-3 h-3', 
      text: 'text-xs',
      gap: 'space-x-1'
    },
    small: { 
      spinner: 'w-4 h-4', 
      text: 'text-sm',
      gap: 'space-x-2'
    },
    medium: { 
      spinner: 'w-6 h-6', 
      text: 'text-base',
      gap: 'space-x-2'
    },
    large: { 
      spinner: 'w-8 h-8', 
      text: 'text-lg',
      gap: 'space-x-3'
    },
    xl: { 
      spinner: 'w-12 h-12', 
      text: 'text-xl',
      gap: 'space-x-3'
    }
  };

  // Configuraciones de color
  const colorConfig = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    pink: 'text-pink-600',
    indigo: 'text-indigo-600',
    gray: 'text-gray-600',
    white: 'text-white',
    black: 'text-black'
  };

  // Configuraciones de velocidad
  const speedConfig = {
    slow: 2,
    normal: 1,
    fast: 0.5,
    ultrafast: 0.3
  };

  // Variantes de spinner
  const spinnerVariants = {
    default: {
      component: Loader2,
      animation: {
        rotate: 360,
        transition: {
          duration: speedConfig[speed],
          repeat: Infinity,
          ease: "linear"
        }
      }
    },
    rotate: {
      component: RotateCw,
      animation: {
        rotate: 360,
        transition: {
          duration: speedConfig[speed],
          repeat: Infinity,
          ease: "linear"
        }
      }
    },
    refresh: {
      component: RefreshCw,
      animation: {
        rotate: 360,
        transition: {
          duration: speedConfig[speed],
          repeat: Infinity,
          ease: "linear"
        }
      }
    },
    pulse: {
      component: Circle,
      animation: {
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
        transition: {
          duration: speedConfig[speed] * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    bounce: {
      component: Circle,
      animation: {
        y: [0, -10, 0],
        transition: {
          duration: speedConfig[speed] * 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    flash: {
      component: Zap,
      animation: {
        opacity: [0.3, 1, 0.3],
        scale: [0.9, 1.1, 0.9],
        transition: {
          duration: speedConfig[speed] * 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    heartbeat: {
      component: Heart,
      animation: {
        scale: [1, 1.3, 1],
        transition: {
          duration: speedConfig[speed] * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    twinkle: {
      component: Star,
      animation: {
        rotate: [0, 180, 360],
        scale: [1, 1.2, 1],
        transition: {
          duration: speedConfig[speed] * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    sun: {
      component: Sun,
      animation: {
        rotate: 360,
        scale: [1, 1.1, 1],
        transition: {
          rotate: {
            duration: speedConfig[speed] * 3,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: speedConfig[speed] * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }
      }
    },
    dots: {
      component: 'custom',
      animation: {}
    },
    bars: {
      component: 'custom',
      animation: {}
    },
    ring: {
      component: 'custom',
      animation: {}
    }
  };

  const currentSize = sizeConfig[size] || sizeConfig.medium;
  const currentColor = colorConfig[color] || colorConfig.blue;
  const currentVariant = spinnerVariants[variant] || spinnerVariants.default;
  const SpinnerIcon = currentVariant.component;

  // Componente de dots animados
  const DotsSpinner = () => (
    <div className={`flex ${currentSize.gap}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${currentSize.spinner.replace('w-', 'w-').replace('h-', 'h-').replace(/\d+/, '2')} rounded-full ${currentColor.replace('text-', 'bg-')}`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: speedConfig[speed] * 1.5,
            repeat: Infinity,
            delay: i * (speedConfig[speed] * 0.2),
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  // Componente de barras animadas
  const BarsSpinner = () => (
    <div className={`flex items-end ${currentSize.gap}`}>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={`w-1 ${currentColor.replace('text-', 'bg-')} rounded-full`}
          style={{ height: '100%' }}
          animate={{
            height: ['40%', '100%', '40%']
          }}
          transition={{
            duration: speedConfig[speed],
            repeat: Infinity,
            delay: i * (speedConfig[speed] * 0.1),
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  // Componente de anillo animado
  const RingSpinner = () => (
    <div className={`relative ${currentSize.spinner}`}>
      <motion.div
        className={`absolute inset-0 border-2 border-gray-200 rounded-full`}
      />
      <motion.div
        className={`absolute inset-0 border-2 border-transparent rounded-full ${currentColor.replace('text-', 'border-t-')}`}
        animate={{
          rotate: 360
        }}
        transition={{
          duration: speedConfig[speed],
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );

  // Función para renderizar el spinner correcto
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <DotsSpinner />;
      case 'bars':
        return <BarsSpinner />;
      case 'ring':
        return <RingSpinner />;
      default:
        return (
          <motion.div
            className={`${currentSize.spinner} ${currentColor}`}
            animate={currentVariant.animation}
            {...rest}
          >
            <SpinnerIcon className="w-full h-full" />
          </motion.div>
        );
    }
  };

  // Clases del contenedor
  const containerClasses = `
    ${inline ? 'inline-flex' : 'flex'} 
    items-center 
    ${showLabel ? currentSize.gap : ''} 
    ${className}
  `.trim();

  return (
    <div className={containerClasses} style={style} {...rest}>
      {renderSpinner()}
      {showLabel && label && (
        <span className={`${currentSize.text} text-gray-600`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default Spinner;