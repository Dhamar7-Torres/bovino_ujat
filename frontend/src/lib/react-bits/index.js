/**
 * React Bits - Librería para animaciones de texto avanzadas
 * Sistema de gestión de bovinos - Componentes para animaciones de texto elegantes
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

// ============== UTILIDADES AUXILIARES ==============

/**
 * Divide un texto en palabras, letras o caracteres
 * @param {string} text - Texto a dividir
 * @param {string} type - Tipo de división: 'words', 'letters', 'chars'
 */
const splitText = (text, type = 'words') => {
  if (!text) return [];
  
  switch (type) {
    case 'words':
      return text.split(' ').filter(word => word.length > 0);
    case 'letters':
      return text.split('').filter(char => char !== ' ');
    case 'chars':
      return text.split('');
    default:
      return text.split(' ');
  }
};

/**
 * Genera delays escalonados para animaciones
 * @param {number} index - Índice del elemento
 * @param {number} stagger - Tiempo de escalonado
 */
const getStaggerDelay = (index, stagger = 0.1) => index * stagger;

/**
 * Configuraciones de transición predefinidas
 */
const TRANSITION_PRESETS = {
  smooth: { type: 'spring', stiffness: 100, damping: 15 },
  bouncy: { type: 'spring', stiffness: 300, damping: 20 },
  elastic: { type: 'spring', stiffness: 200, damping: 10 },
  quick: { type: 'tween', duration: 0.3, ease: 'easeOut' },
  slow: { type: 'tween', duration: 0.8, ease: 'easeInOut' }
};

// ============== COMPONENTE PRINCIPAL: ANIMATED TEXT ==============

/**
 * Componente principal para texto animado
 * Soporte para múltiples tipos de animación y efectos
 */
export const AnimatedText = ({
  children,
  animation = 'fadeInUp',
  splitBy = 'words',
  stagger = 0.1,
  delay = 0,
  duration = null,
  transition = 'smooth',
  once = true,
  className = '',
  style = {},
  onAnimationStart,
  onAnimationComplete,
  ...props
}) => {
  const ref = useRef();
  const isInView = useInView(ref, { once });
  const controls = useAnimation();
  
  // Dividir el texto según el tipo especificado
  const textParts = useMemo(() => {
    if (typeof children !== 'string') return [];
    return splitText(children, splitBy);
  }, [children, splitBy]);
  
  // Configuraciones de animación predefinidas
  const animations = {
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    },
    fadeInDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 }
    },
    fadeInLeft: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 }
    },
    fadeInRight: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 }
    },
    rotateIn: {
      initial: { opacity: 0, rotate: -180, scale: 0.5 },
      animate: { opacity: 1, rotate: 0, scale: 1 }
    },
    slideInBottom: {
      initial: { opacity: 0, y: '100%' },
      animate: { opacity: 1, y: 0 }
    },
    typewriter: {
      initial: { width: 0 },
      animate: { width: 'auto' }
    },
    wave: {
      initial: { y: 0 },
      animate: { 
        y: [0, -10, 0],
        transition: { 
          repeat: Infinity, 
          duration: 2,
          ease: 'easeInOut'
        }
      }
    },
    bounce: {
      initial: { y: 0 },
      animate: { 
        y: [0, -15, 0],
        transition: { 
          repeat: Infinity, 
          duration: 1.5,
          ease: 'easeInOut'
        }
      }
    },
    glitch: {
      initial: { x: 0, opacity: 1 },
      animate: {
        x: [0, -2, 2, 0],
        opacity: [1, 0.8, 1],
        transition: {
          repeat: Infinity,
          duration: 0.2,
          ease: 'linear'
        }
      }
    }
  };
  
  const selectedAnimation = animations[animation] || animations.fadeInUp;
  const transitionConfig = typeof transition === 'string' 
    ? TRANSITION_PRESETS[transition] || TRANSITION_PRESETS.smooth
    : transition;
  
  // Efectos para iniciar animación
  useEffect(() => {
    if (isInView) {
      onAnimationStart?.();
      controls.start('animate');
    }
  }, [isInView, controls, onAnimationStart]);
  
  // Para animaciones de typewriter
  if (animation === 'typewriter') {
    return (
      <motion.div
        ref={ref}
        className={`overflow-hidden whitespace-nowrap ${className}`}
        style={style}
        variants={selectedAnimation}
        initial="initial"
        animate={isInView ? 'animate' : 'initial'}
        transition={{
          ...transitionConfig,
          delay,
          duration: duration || textParts.length * 0.1
        }}
        onAnimationComplete={onAnimationComplete}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  // Para otras animaciones
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      onAnimationComplete={onAnimationComplete}
      {...props}
    >
      {textParts.map((part, index) => (
        <motion.span
          key={index}
          className={splitBy === 'words' ? 'inline-block mr-1' : 'inline-block'}
          variants={selectedAnimation}
          initial="initial"
          animate={controls}
          transition={{
            ...transitionConfig,
            delay: delay + getStaggerDelay(index, stagger),
            duration
          }}
        >
          {part}
          {splitBy === 'words' && index < textParts.length - 1 && ' '}
        </motion.span>
      ))}
    </motion.div>
  );
};

// ============== COMPONENTES ESPECIALIZADOS ==============

/**
 * Texto con efecto de máquina de escribir
 */
export const TypewriterText = ({
  children,
  speed = 100,
  delay = 0,
  cursor = true,
  cursorChar = '|',
  onComplete,
  ...props
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  
  const text = typeof children === 'string' ? children : '';
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length) {
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete]);
  
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);
  
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setCurrentIndex(0);
      setDisplayText('');
    }, delay);
    
    return () => clearTimeout(startTimeout);
  }, [delay]);
  
  return (
    <span {...props}>
      {displayText}
      {cursor && (showCursor || currentIndex < text.length) && (
        <span className="animate-pulse">{cursorChar}</span>
      )}
    </span>
  );
};

/**
 * Texto con efecto de conteo animado
 */
export const CounterText = ({
  from = 0,
  to,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  onComplete,
  ...props
}) => {
  const [count, setCount] = useState(from);
  const ref = useRef();
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    
    const startTime = Date.now();
    const startValue = from;
    const endValue = to;
    const totalChange = endValue - startValue;
    
    const updateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Función de easing suave
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (totalChange * easeOutQuart);
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(endValue);
        onComplete?.();
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [isInView, from, to, duration, onComplete]);
  
  const formatNumber = (num) => {
    const fixed = Number(num).toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  };
  
  return (
    <span ref={ref} {...props}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

/**
 * Texto con efecto de resaltado gradual
 */
export const HighlightText = ({
  children,
  highlightColor = '#fbbf24',
  animationType = 'slideRight',
  duration = 1,
  delay = 0,
  ...props
}) => {
  const ref = useRef();
  const isInView = useInView(ref, { once: true });
  
  const highlightVariants = {
    slideRight: {
      initial: { width: 0 },
      animate: { width: '100%' }
    },
    slideLeft: {
      initial: { width: 0, right: 0 },
      animate: { width: '100%' }
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 0.3 }
    }
  };
  
  return (
    <span ref={ref} className="relative inline-block" {...props}>
      <motion.span
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: highlightColor }}
        variants={highlightVariants[animationType]}
        initial="initial"
        animate={isInView ? 'animate' : 'initial'}
        transition={{
          duration,
          delay,
          ease: 'easeOut'
        }}
      />
      {children}
    </span>
  );
};

/**
 * Texto con efecto de desvanecimiento gradual
 */
export const GradientText = ({
  children,
  gradient = 'linear-gradient(45deg, #3b82f6, #10b981)',
  animation = 'slideIn',
  className = '',
  ...props
}) => {
  const gradientStyle = {
    background: gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };
  
  return (
    <AnimatedText
      className={`font-bold ${className}`}
      style={gradientStyle}
      animation={animation}
      {...props}
    >
      {children}
    </AnimatedText>
  );
};

/**
 * Texto con efecto de letras bailando
 */
export const DancingText = ({
  children,
  intensity = 10,
  speed = 2,
  ...props
}) => {
  const letters = typeof children === 'string' ? children.split('') : [];
  
  return (
    <span {...props}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          animate={{
            y: [0, -intensity, 0],
            rotate: [0, Math.random() * 10 - 5, 0]
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut'
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
};

/**
 * Texto con efecto de destello
 */
export const ShimmerText = ({
  children,
  color = '#ffffff',
  duration = 2,
  ...props
}) => {
  return (
    <motion.span
      className="relative inline-block overflow-hidden"
      {...props}
    >
      {children}
      <motion.div
        className="absolute inset-0 -skew-x-12"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          width: '30%'
        }}
        animate={{
          x: ['-100%', '300%']
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </motion.span>
  );
};

// ============== COMPONENTES ESPECÍFICOS PARA EL SISTEMA GANADERO ==============

/**
 * Texto para títulos de secciones del sistema ganadero
 */
export const CattleTitle = ({
  children,
  size = 'large',
  color = 'primary',
  animation = 'fadeInUp',
  ...props
}) => {
  const sizeClasses = {
    small: 'text-lg md:text-xl',
    medium: 'text-xl md:text-2xl',
    large: 'text-2xl md:text-3xl lg:text-4xl',
    xlarge: 'text-3xl md:text-4xl lg:text-5xl'
  };
  
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-green-600',
    accent: 'text-amber-600',
    neutral: 'text-gray-700'
  };
  
  return (
    <AnimatedText
      className={`font-bold ${sizeClasses[size]} ${colorClasses[color]}`}
      animation={animation}
      splitBy="words"
      stagger={0.1}
      {...props}
    >
      {children}
    </AnimatedText>
  );
};

/**
 * Texto para métricas y estadísticas
 */
export const MetricText = ({
  value,
  label,
  prefix = '',
  suffix = '',
  animate = true,
  ...props
}) => {
  return (
    <div className="text-center" {...props}>
      {animate ? (
        <CounterText
          to={value}
          prefix={prefix}
          suffix={suffix}
          className="text-3xl font-bold text-blue-600"
          decimals={0}
        />
      ) : (
        <span className="text-3xl font-bold text-blue-600">
          {prefix}{value}{suffix}
        </span>
      )}
      <AnimatedText
        className="text-sm text-gray-600 mt-1"
        animation="fadeInUp"
        delay={0.5}
      >
        {label}
      </AnimatedText>
    </div>
  );
};

/**
 * Texto para alertas del sistema
 */
export const AlertText = ({
  children,
  type = 'info',
  animated = true,
  ...props
}) => {
  const typeStyles = {
    info: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600'
  };
  
  if (!animated) {
    return (
      <span className={typeStyles[type]} {...props}>
        {children}
      </span>
    );
  }
  
  return (
    <AnimatedText
      className={`font-medium ${typeStyles[type]}`}
      animation="fadeInLeft"
      splitBy="words"
      stagger={0.05}
      {...props}
    >
      {children}
    </AnimatedText>
  );
};

/**
 * Texto para estado de carga
 */
export const LoadingText = ({
  children = 'Cargando',
  dots = true,
  ...props
}) => {
  const [dotCount, setDotCount] = useState(0);
  
  useEffect(() => {
    if (!dots) return;
    
    const interval = setInterval(() => {
      setDotCount(prev => (prev + 1) % 4);
    }, 500);
    
    return () => clearInterval(interval);
  }, [dots]);
  
  return (
    <span {...props}>
      {children}
      {dots && '.'.repeat(dotCount)}
    </span>
  );
};

// ============== EXPORTACIONES ==============

export default {
  AnimatedText,
  TypewriterText,
  CounterText,
  HighlightText,
  GradientText,
  DancingText,
  ShimmerText,
  CattleTitle,
  MetricText,
  AlertText,
  LoadingText
};