/**
 * Configuración principal de Framer Motion
 * Sistema de gestión de bovinos - Exportaciones centralizadas para animaciones
 */

// Exportar componentes personalizados
export { default as MotionDiv } from './MotionDiv';

// Exportar variantes de animación
export * from './variants';

// Re-exportar componentes principales de framer-motion para facilitar importación
export {
  motion,
  AnimatePresence,
  LazyMotion,
  domAnimation,
  domMax,
  m,
  useAnimation,
  useAnimationControls,
  useInView,
  useIsPresent,
  usePresence,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useViewportScroll,
  useDragControls,
  useMotionValue,
  useMotionValueEvent,
  useTime,
  transform,
  animate,
  inView,
  scroll,
  stagger,
  delay,
  spring,
  keyframes,
  anticipate,
  backInOut,
  backIn,
  backOut,
  bounceInOut,
  bounceIn,
  bounceOut,
  circInOut,
  circIn,
  circOut,
  easeInOut,
  easeIn,
  easeOut,
  linear
} from 'framer-motion';

// Configuraciones predeterminadas para animaciones
export const DEFAULT_TRANSITION = {
  type: 'spring',
  stiffness: 100,
  damping: 15,
  mass: 1
};

export const FAST_TRANSITION = {
  type: 'tween',
  duration: 0.2,
  ease: 'easeInOut'
};

export const SLOW_TRANSITION = {
  type: 'spring',
  stiffness: 50,
  damping: 20,
  mass: 1.5
};

export const BOUNCE_TRANSITION = {
  type: 'spring',
  stiffness: 200,
  damping: 10,
  mass: 0.8
};

// Configuraciones de easing personalizadas
export const CUSTOM_EASINGS = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  bouncy: [0.68, -0.55, 0.265, 1.55],
  gentle: [0.25, 0.1, 0.25, 1],
  sharp: [0.4, 0, 0.6, 1],
  elastic: [0.175, 0.885, 0.32, 1.275]
};

// Duraciones estándar para diferentes tipos de animación
export const ANIMATION_DURATIONS = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
  pageTransition: 0.4,
  modal: 0.25,
  tooltip: 0.2,
  notification: 0.35
};

// Configuraciones de stagger para animaciones en grupo
export const STAGGER_CONFIG = {
  children: {
    delayChildren: 0.1,
    staggerChildren: 0.05
  },
  list: {
    delayChildren: 0.2,
    staggerChildren: 0.1
  },
  grid: {
    delayChildren: 0.15,
    staggerChildren: 0.08,
    staggerDirection: 1
  },
  reverse: {
    delayChildren: 0.1,
    staggerChildren: 0.05,
    staggerDirection: -1
  }
};

// Configuraciones para reducir movimiento (accessibility)
export const REDUCED_MOTION_CONFIG = {
  transition: { duration: 0 },
  initial: false,
  animate: false,
  exit: false
};

// Hook personalizado para detectar preferencia de movimiento reducido
export const useReducedMotion = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return prefersReducedMotion;
};

// Función para crear transiciones condicionales basadas en preferencias del usuario
export const createConditionalTransition = (normalTransition, reducedMotion = false) => {
  return reducedMotion ? REDUCED_MOTION_CONFIG.transition : normalTransition;
};

// Configuraciones comunes para diferentes elementos de UI
export const UI_ANIMATIONS = {
  button: {
    whileHover: { scale: 1.02, transition: FAST_TRANSITION },
    whileTap: { scale: 0.98, transition: FAST_TRANSITION }
  },
  card: {
    whileHover: { 
      y: -4, 
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      transition: DEFAULT_TRANSITION 
    }
  },
  input: {
    whileFocus: { 
      scale: 1.01,
      transition: FAST_TRANSITION 
    }
  },
  modal: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
    transition: { ...DEFAULT_TRANSITION, duration: ANIMATION_DURATIONS.modal }
  },
  notification: {
    initial: { opacity: 0, x: 100, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 100, scale: 0.9 },
    transition: { ...DEFAULT_TRANSITION, duration: ANIMATION_DURATIONS.notification }
  },
  sidebar: {
    open: { x: 0, transition: DEFAULT_TRANSITION },
    closed: { x: '-100%', transition: DEFAULT_TRANSITION }
  },
  dropdown: {
    open: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { ...DEFAULT_TRANSITION, duration: ANIMATION_DURATIONS.fast }
    },
    closed: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { ...FAST_TRANSITION }
    }
  }
};

// Animaciones específicas para elementos del sistema ganadero
export const CATTLE_ANIMATIONS = {
  bovineCard: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    whileHover: { 
      y: -2, 
      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)',
      transition: DEFAULT_TRANSITION 
    }
  },
  ranchMap: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { ...DEFAULT_TRANSITION, duration: ANIMATION_DURATIONS.slow }
  },
  productionChart: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { 
      ...DEFAULT_TRANSITION, 
      duration: ANIMATION_DURATIONS.slow,
      delay: 0.2 
    }
  },
  healthAlert: {
    initial: { opacity: 0, scale: 0.8, rotate: -5 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: BOUNCE_TRANSITION
    },
    exit: { opacity: 0, scale: 0.8, rotate: 5 }
  },
  eventTimeline: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { 
      ...DEFAULT_TRANSITION,
      delay: 0.1
    }
  }
};

// Configuraciones para animaciones de página
export const PAGE_ANIMATIONS = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.pageTransition }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { ...DEFAULT_TRANSITION, duration: ANIMATION_DURATIONS.pageTransition }
  },
  slideRight: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
    transition: { ...DEFAULT_TRANSITION, duration: ANIMATION_DURATIONS.pageTransition }
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
    transition: { ...DEFAULT_TRANSITION, duration: ANIMATION_DURATIONS.pageTransition }
  }
};

// Función utilitaria para crear animaciones de lista
export const createListAnimation = (itemCount = 0, delayMultiplier = 0.1) => ({
  container: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: delayMultiplier,
        when: "beforeChildren"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: delayMultiplier / 2,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  },
  item: {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: DEFAULT_TRANSITION 
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: FAST_TRANSITION 
    }
  }
});

// Función para crear animaciones de carga
export const createLoadingAnimation = () => ({
  initial: { opacity: 0 },
  animate: { 
    opacity: [0, 1, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
});

// Función para crear efectos de pulso
export const createPulseAnimation = (scale = 1.05, duration = 2) => ({
  animate: {
    scale: [1, scale, 1],
    transition: {
      duration,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
});

// Configuraciones para animaciones de entrada y salida de rutas
export const ROUTE_ANIMATIONS = {
  fadeInOut: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideInOut: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '100%' }
  },
  scaleInOut: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 }
  }
};

// Exportar configuración por defecto
export default {
  DEFAULT_TRANSITION,
  FAST_TRANSITION,
  SLOW_TRANSITION,
  BOUNCE_TRANSITION,
  CUSTOM_EASINGS,
  ANIMATION_DURATIONS,
  STAGGER_CONFIG,
  UI_ANIMATIONS,
  CATTLE_ANIMATIONS,
  PAGE_ANIMATIONS,
  ROUTE_ANIMATIONS,
  createListAnimation,
  createLoadingAnimation,
  createPulseAnimation,
  useReducedMotion,
  createConditionalTransition
};