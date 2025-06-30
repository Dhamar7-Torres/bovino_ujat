/**
 * Variantes de animación predefinidas para Framer Motion
 * Sistema de gestión de bovinos - Colección completa de variantes de animación
 */

// Duraciones y configuraciones base
const SPRING_CONFIG = {
  type: 'spring',
  stiffness: 100,
  damping: 15,
  mass: 1
};

const FAST_SPRING = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
  mass: 0.8
};

const GENTLE_SPRING = {
  type: 'spring',
  stiffness: 50,
  damping: 20,
  mass: 1.5
};

const TWEEN_CONFIG = {
  type: 'tween',
  duration: 0.3,
  ease: 'easeInOut'
};

const FAST_TWEEN = {
  type: 'tween',
  duration: 0.15,
  ease: 'easeOut'
};

// ============== VARIANTES BÁSICAS ==============

// Variantes de fade
export const fadeVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: TWEEN_CONFIG
  },
  exit: { 
    opacity: 0,
    transition: FAST_TWEEN
  }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: SPRING_CONFIG
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: FAST_TWEEN
  }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: SPRING_CONFIG
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: FAST_TWEEN
  }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: SPRING_CONFIG
  },
  exit: { 
    opacity: 0, 
    x: 30,
    transition: FAST_TWEEN
  }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: SPRING_CONFIG
  },
  exit: { 
    opacity: 0, 
    x: -30,
    transition: FAST_TWEEN
  }
};

// Variantes de escala
export const scaleVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: SPRING_CONFIG
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: FAST_TWEEN
  }
};

export const scaleInCenter = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.3,
    transition: FAST_TWEEN
  }
};

export const scaleBounce = {
  initial: { opacity: 0, scale: 0.1 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 12
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.1,
    transition: FAST_TWEEN
  }
};

// Variantes de rotación
export const rotateVariants = {
  initial: { opacity: 0, rotate: -90, scale: 0.8 },
  animate: { 
    opacity: 1, 
    rotate: 0, 
    scale: 1,
    transition: SPRING_CONFIG
  },
  exit: { 
    opacity: 0, 
    rotate: 90, 
    scale: 0.8,
    transition: FAST_TWEEN
  }
};

export const rotateFlip = {
  initial: { opacity: 0, rotateY: -180 },
  animate: { 
    opacity: 1, 
    rotateY: 0,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 20
    }
  },
  exit: { 
    opacity: 0, 
    rotateY: 180,
    transition: FAST_TWEEN
  }
};

// ============== VARIANTES DE SLIDE ==============

export const slideInFromBottom = {
  initial: { y: '100%', opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: SPRING_CONFIG
  },
  exit: { 
    y: '100%', 
    opacity: 0,
    transition: FAST_TWEEN
  }
};

export const slideInFromTop = {
  initial: { y: '-100%', opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: SPRING_CONFIG
  },
  exit: { 
    y: '-100%', 
    opacity: 0,
    transition: FAST_TWEEN
  }
};

export const slideInFromLeft = {
  initial: { x: '-100%', opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: SPRING_CONFIG
  },
  exit: { 
    x: '-100%', 
    opacity: 0,
    transition: FAST_TWEEN
  }
};

export const slideInFromRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: SPRING_CONFIG
  },
  exit: { 
    x: '100%', 
    opacity: 0,
    transition: FAST_TWEEN
  }
};

// ============== VARIANTES DE LISTA ==============

export const listContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
      when: "beforeChildren"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren"
    }
  }
};

export const listItemVariants = {
  initial: { opacity: 0, y: 20, scale: 0.9 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: SPRING_CONFIG
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.95,
    transition: FAST_TWEEN
  }
};

export const gridContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren"
    }
  }
};

export const gridItemVariants = {
  initial: { opacity: 0, scale: 0.8, y: 30 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: SPRING_CONFIG
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: -20,
    transition: FAST_TWEEN
  }
};

// ============== VARIANTES DE UI ESPECÍFICAS ==============

export const buttonVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: FAST_TWEEN
  },
  pressed: { 
    scale: 0.95,
    transition: FAST_TWEEN
  }
};

export const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: SPRING_CONFIG
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 0.95,
    transition: FAST_TWEEN
  },
  hover: {
    y: -4,
    scale: 1.02,
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    transition: FAST_SPRING
  }
};

export const inputVariants = {
  rest: { scale: 1, borderColor: '#e5e7eb' },
  focus: { 
    scale: 1.02,
    borderColor: '#3b82f6',
    transition: FAST_TWEEN
  },
  error: {
    x: [0, -10, 10, -10, 10, 0],
    borderColor: '#ef4444',
    transition: { duration: 0.4 }
  }
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.9, y: 50 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: FAST_TWEEN
  }
};

export const overlayVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15 }
  }
};

export const dropdownVariants = {
  initial: { opacity: 0, y: -10, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: FAST_SPRING
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.95,
    transition: FAST_TWEEN
  }
};

export const tooltipVariants = {
  initial: { opacity: 0, scale: 0.8, y: 5 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: FAST_TWEEN
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: 5,
    transition: { duration: 0.1 }
  }
};

// ============== VARIANTES ESPECÍFICAS DEL SISTEMA GANADERO ==============

export const bovineCardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.9 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: SPRING_CONFIG
  },
  exit: { 
    opacity: 0, 
    y: -30, 
    scale: 0.9,
    transition: FAST_TWEEN
  },
  hover: {
    y: -6,
    scale: 1.02,
    boxShadow: '0 12px 30px rgba(59, 130, 246, 0.15)',
    transition: FAST_SPRING
  }
};

export const ranchMapVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      ...SPRING_CONFIG,
      delay: 0.2
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: FAST_TWEEN
  }
};

export const mapPinVariants = {
  initial: { opacity: 0, scale: 0, y: -20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      delay: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0, 
    y: 20,
    transition: FAST_TWEEN
  },
  hover: {
    scale: 1.2,
    transition: FAST_TWEEN
  }
};

export const productionChartVariants = {
  initial: { opacity: 0, scale: 0.8, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      ...SPRING_CONFIG,
      delay: 0.3
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: -20,
    transition: FAST_TWEEN
  }
};

export const healthAlertVariants = {
  initial: { opacity: 0, scale: 0.5, rotate: -15 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.5, 
    rotate: 15,
    transition: FAST_TWEEN
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const notificationVariants = {
  initial: { opacity: 0, x: 100, scale: 0.8 },
  animate: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: FAST_SPRING
  },
  exit: { 
    opacity: 0, 
    x: 100, 
    scale: 0.8,
    transition: FAST_TWEEN
  }
};

export const eventTimelineVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      ...SPRING_CONFIG,
      delay: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    x: 50,
    transition: FAST_TWEEN
  }
};

export const metricsCardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: SPRING_CONFIG
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 0.95,
    transition: FAST_TWEEN
  },
  hover: {
    y: -2,
    scale: 1.01,
    transition: FAST_TWEEN
  }
};

// ============== VARIANTES DE NAVEGACIÓN Y PÁGINA ==============

export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

export const sidebarVariants = {
  open: { 
    x: 0,
    transition: SPRING_CONFIG
  },
  closed: { 
    x: '-100%',
    transition: FAST_SPRING
  }
};

export const mobileMenuVariants = {
  open: { 
    opacity: 1,
    height: 'auto',
    transition: {
      opacity: { duration: 0.2 },
      height: { duration: 0.3, ease: 'easeOut' }
    }
  },
  closed: { 
    opacity: 0,
    height: 0,
    transition: {
      opacity: { duration: 0.15 },
      height: { duration: 0.2, ease: 'easeIn' }
    }
  }
};

export const tabVariants = {
  inactive: { 
    opacity: 0.7,
    scale: 0.95
  },
  active: { 
    opacity: 1,
    scale: 1,
    transition: FAST_TWEEN
  }
};

// ============== VARIANTES DE CARGA Y ESTADOS ==============

export const loadingVariants = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const skeletonVariants = {
  animate: {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const errorShakeVariants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  }
};

// ============== EXPORTACIÓN ORGANIZADA ==============

// Agrupar variantes por categoría para fácil importación
export const basicVariants = {
  fadeVariants,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleVariants,
  scaleInCenter,
  scaleBounce,
  rotateVariants,
  rotateFlip
};

export const slideVariants = {
  slideInFromBottom,
  slideInFromTop,
  slideInFromLeft,
  slideInFromRight
};

export const listVariants = {
  listContainerVariants,
  listItemVariants,
  gridContainerVariants,
  gridItemVariants
};

export const uiVariants = {
  buttonVariants,
  cardVariants,
  inputVariants,
  modalVariants,
  overlayVariants,
  dropdownVariants,
  tooltipVariants
};

export const cattleVariants = {
  bovineCardVariants,
  ranchMapVariants,
  mapPinVariants,
  productionChartVariants,
  healthAlertVariants,
  notificationVariants,
  eventTimelineVariants,
  metricsCardVariants
};

export const navigationVariants = {
  pageVariants,
  sidebarVariants,
  mobileMenuVariants,
  tabVariants
};

export const stateVariants = {
  loadingVariants,
  pulseVariants,
  skeletonVariants,
  errorShakeVariants
};

// Exportación por defecto con todas las variantes
export default {
  ...basicVariants,
  ...slideVariants,
  ...listVariants,
  ...uiVariants,
  ...cattleVariants,
  ...navigationVariants,
  ...stateVariants
};