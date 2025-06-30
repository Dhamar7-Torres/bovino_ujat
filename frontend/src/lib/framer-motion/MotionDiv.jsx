/**
 * Componente wrapper personalizado para motion.div
 * Sistema de gestión de bovinos - Wrapper optimizado con configuraciones predeterminadas
 */

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { 
  DEFAULT_TRANSITION,
  FAST_TRANSITION,
  SLOW_TRANSITION,
  BOUNCE_TRANSITION,
  useReducedMotion,
  createConditionalTransition,
  ANIMATION_DURATIONS,
  UI_ANIMATIONS
} from './index';

/**
 * Componente MotionDiv personalizado con configuraciones predeterminadas
 * Incluye soporte para accesibilidad y animaciones específicas del sistema
 */
const MotionDiv = forwardRef(({
  children,
  variant = 'default',
  animation = 'fadeIn',
  transition = DEFAULT_TRANSITION,
  delay = 0,
  duration = null,
  stagger = false,
  staggerDelay = 0.1,
  hover = false,
  tap = false,
  focus = false,
  className = '',
  style = {},
  onClick,
  onHoverStart,
  onHoverEnd,
  onTap,
  onTapStart,
  onTapEnd,
  onFocus,
  onBlur,
  onAnimationStart,
  onAnimationComplete,
  viewport = { once: true, margin: '-50px' },
  ...props
}, ref) => {
  
  // Detectar preferencia de movimiento reducido
  const prefersReducedMotion = useReducedMotion();
  
  // Configuraciones de animación predefinidas
  const animations = {
    // Animaciones básicas
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    },
    fadeInDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
    },
    fadeInLeft: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 }
    },
    fadeInRight: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
    },
    
    // Animaciones de escala
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 }
    },
    scaleInBounce: {
      initial: { opacity: 0, scale: 0.3 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 }
    },
    
    // Animaciones de rotación
    rotateIn: {
      initial: { opacity: 0, rotate: -180, scale: 0.8 },
      animate: { opacity: 1, rotate: 0, scale: 1 },
      exit: { opacity: 0, rotate: 180, scale: 0.8 }
    },
    
    // Animaciones específicas del sistema ganadero
    bovineCard: {
      initial: { opacity: 0, y: 30, scale: 0.9 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -30, scale: 0.9 }
    },
    ranchPin: {
      initial: { opacity: 0, scale: 0, y: -10 },
      animate: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      },
      exit: { opacity: 0, scale: 0, y: 10 }
    },
    healthAlert: {
      initial: { opacity: 0, scale: 0.5, rotate: -10 },
      animate: { 
        opacity: 1, 
        scale: 1, 
        rotate: 0,
        transition: BOUNCE_TRANSITION
      },
      exit: { opacity: 0, scale: 0.5, rotate: 10 }
    },
    productionMetric: {
      initial: { opacity: 0, scale: 0.8, y: 20 },
      animate: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { ...DEFAULT_TRANSITION, delay: delay }
      },
      exit: { opacity: 0, scale: 0.8, y: -20 }
    },
    
    // Animaciones de lista
    listItem: {
      initial: { opacity: 0, x: -20, scale: 0.95 },
      animate: { 
        opacity: 1, 
        x: 0, 
        scale: 1,
        transition: { ...DEFAULT_TRANSITION, delay: delay }
      },
      exit: { opacity: 0, x: 20, scale: 0.95 }
    },
    
    // Animaciones de modal y overlay
    modalOverlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: FAST_TRANSITION
    },
    modalContent: {
      initial: { opacity: 0, scale: 0.9, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: 10 }
    },
    
    // Animaciones de notificación
    notification: {
      initial: { opacity: 0, x: 100, scale: 0.8 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 100, scale: 0.8 }
    },
    
    // Sin animación (útil para accesibilidad)
    none: {
      initial: false,
      animate: false,
      exit: false
    }
  };
  
  // Variantes de elementos específicos
  const variants = {
    default: animations[animation] || animations.fadeIn,
    button: UI_ANIMATIONS.button,
    card: {
      ...animations[animation] || animations.fadeIn,
      ...UI_ANIMATIONS.card
    },
    input: {
      ...animations[animation] || animations.fadeIn,
      ...UI_ANIMATIONS.input
    }
  };
  
  // Seleccionar la variante apropiada
  const selectedVariant = variants[variant] || variants.default;
  
  // Configurar transición condicional
  const finalTransition = createConditionalTransition(
    duration ? { ...transition, duration } : transition,
    prefersReducedMotion
  );
  
  // Configurar stagger si está habilitado
  const staggerTransition = stagger ? {
    ...finalTransition,
    delayChildren: delay,
    staggerChildren: staggerDelay
  } : finalTransition;
  
  // Configurar interacciones opcionales
  const interactions = {};
  
  if (hover) {
    interactions.whileHover = typeof hover === 'object' ? hover : {
      scale: 1.02,
      transition: FAST_TRANSITION
    };
  }
  
  if (tap) {
    interactions.whileTap = typeof tap === 'object' ? tap : {
      scale: 0.98,
      transition: FAST_TRANSITION
    };
  }
  
  if (focus) {
    interactions.whileFocus = typeof focus === 'object' ? focus : {
      scale: 1.01,
      transition: FAST_TRANSITION
    };
  }
  
  // Props finales para motion.div
  const motionProps = {
    ref,
    className,
    style,
    onClick,
    onHoverStart,
    onHoverEnd,
    onTap,
    onTapStart,
    onTapEnd,
    onFocus,
    onBlur,
    onAnimationStart,
    onAnimationComplete,
    viewport,
    ...selectedVariant,
    ...interactions,
    transition: staggerTransition,
    ...props
  };
  
  // Si está habilitado el movimiento reducido, simplificar animaciones
  if (prefersReducedMotion) {
    motionProps.initial = false;
    motionProps.animate = false;
    motionProps.exit = false;
    motionProps.whileHover = undefined;
    motionProps.whileTap = undefined;
    motionProps.whileFocus = undefined;
    motionProps.transition = { duration: 0 };
  }
  
  return (
    <motion.div {...motionProps}>
      {children}
    </motion.div>
  );
});

// Establecer displayName para debugging
MotionDiv.displayName = 'MotionDiv';

// Componentes especializados para casos de uso específicos
export const MotionCard = forwardRef((props, ref) => (
  <MotionDiv 
    ref={ref}
    variant="card" 
    animation="fadeInUp" 
    hover={true}
    {...props} 
  />
));

export const MotionButton = forwardRef((props, ref) => (
  <MotionDiv 
    ref={ref}
    variant="button" 
    animation="scaleIn"
    hover={true}
    tap={true}
    {...props} 
  />
));

export const MotionListItem = forwardRef(({ index = 0, ...props }, ref) => (
  <MotionDiv 
    ref={ref}
    animation="listItem"
    delay={index * 0.1}
    hover={{ x: 4 }}
    {...props} 
  />
));

export const MotionModal = forwardRef((props, ref) => (
  <MotionDiv 
    ref={ref}
    animation="modalContent"
    transition={{
      type: 'spring',
      stiffness: 300,
      damping: 25
    }}
    {...props} 
  />
));

export const MotionNotification = forwardRef((props, ref) => (
  <MotionDiv 
    ref={ref}
    animation="notification"
    transition={FAST_TRANSITION}
    {...props} 
  />
));

// Componentes específicos para el sistema ganadero
export const MotionBovineCard = forwardRef((props, ref) => (
  <MotionDiv 
    ref={ref}
    animation="bovineCard"
    hover={{
      y: -4,
      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)'
    }}
    {...props} 
  />
));

export const MotionRanchPin = forwardRef((props, ref) => (
  <MotionDiv 
    ref={ref}
    animation="ranchPin"
    hover={{ scale: 1.1 }}
    tap={{ scale: 0.95 }}
    {...props} 
  />
));

export const MotionHealthAlert = forwardRef((props, ref) => (
  <MotionDiv 
    ref={ref}
    animation="healthAlert"
    {...props} 
  />
));

export const MotionProductionMetric = forwardRef(({ delay: propDelay = 0, ...props }, ref) => (
  <MotionDiv 
    ref={ref}
    animation="productionMetric"
    delay={propDelay}
    {...props} 
  />
));

// Establecer displayNames
MotionCard.displayName = 'MotionCard';
MotionButton.displayName = 'MotionButton';
MotionListItem.displayName = 'MotionListItem';
MotionModal.displayName = 'MotionModal';
MotionNotification.displayName = 'MotionNotification';
MotionBovineCard.displayName = 'MotionBovineCard';
MotionRanchPin.displayName = 'MotionRanchPin';
MotionHealthAlert.displayName = 'MotionHealthAlert';
MotionProductionMetric.displayName = 'MotionProductionMetric';

export default MotionDiv;