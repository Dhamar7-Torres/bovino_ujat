import React, { forwardRef, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const SlideIn = forwardRef(({
  children,
  direction = 'left', // 'left', 'right', 'up', 'down', 'diagonal-up-left', 'diagonal-up-right', 'diagonal-down-left', 'diagonal-down-right'
  distance = 100,
  duration = 0.6,
  delay = 0,
  stagger = 0,
  once = true,
  threshold = 0.1,
  margin = "0px 0px -50px 0px",
  className = "",
  style = {},
  cascade = false,
  cascadeDelay = 0.15,
  bounce = false,
  elastic = false,
  overshoot = 10,
  spring = false,
  springConfig = { type: "spring", stiffness: 300, damping: 30 },
  triggerOnce = true,
  viewport = {},
  onAnimationStart = null,
  onAnimationComplete = null,
  slideType = 'slide', // 'slide', 'push', 'cover', 'reveal'
  easing = [0.25, 0.25, 0.25, 1], // curva de easing personalizada
  scale = false,
  rotate = false,
  rotateAngle = 15,
  blur = false,
  opacity = true,
  visible = true,
  ...props
}, ref) => {

  const internalRef = useRef(null);
  const targetRef = ref || internalRef;
  
  // Configuración del viewport para useInView
  const viewportConfig = {
    once: triggerOnce,
    margin,
    amount: threshold,
    ...viewport
  };
  
  const isInView = useInView(targetRef, viewportConfig);

  // Función para obtener las coordenadas iniciales según la dirección
  const getInitialPosition = () => {
    switch (direction) {
      case 'left':
        return { x: -distance, y: 0 };
      case 'right':
        return { x: distance, y: 0 };
      case 'up':
        return { x: 0, y: -distance };
      case 'down':
        return { x: 0, y: distance };
      case 'diagonal-up-left':
        return { x: -distance * 0.7, y: -distance * 0.7 };
      case 'diagonal-up-right':
        return { x: distance * 0.7, y: -distance * 0.7 };
      case 'diagonal-down-left':
        return { x: -distance * 0.7, y: distance * 0.7 };
      case 'diagonal-down-right':
        return { x: distance * 0.7, y: distance * 0.7 };
      default:
        return { x: -distance, y: 0 };
    }
  };

  // Función para obtener la posición final con overshoot
  const getFinalPosition = () => {
    if (!bounce && !elastic) return { x: 0, y: 0 };
    
    const overshotDistance = overshoot;
    switch (direction) {
      case 'left':
        return { x: overshotDistance, y: 0 };
      case 'right':
        return { x: -overshotDistance, y: 0 };
      case 'up':
        return { x: 0, y: overshotDistance };
      case 'down':
        return { x: 0, y: -overshotDistance };
      default:
        return { x: overshotDistance, y: 0 };
    }
  };

  // Configuración de transición según el tipo
  const getTransitionConfig = () => {
    if (spring) {
      return springConfig;
    }
    
    if (bounce) {
      return {
        type: "spring",
        stiffness: 400,
        damping: 15,
        mass: 1,
        duration
      };
    }
    
    if (elastic) {
      return {
        type: "spring",
        stiffness: 200,
        damping: 10,
        mass: 0.8,
        duration
      };
    }
    
    return {
      duration,
      delay,
      ease: easing,
      type: "tween"
    };
  };

  // Variantes principales de animación
  const slideVariants = {
    hidden: {
      opacity: opacity ? 0 : 1,
      ...getInitialPosition(),
      scale: scale ? 0.8 : 1,
      rotate: rotate ? rotateAngle : 0,
      filter: blur ? "blur(5px)" : "blur(0px)",
      transition: {
        duration: 0
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        ...getTransitionConfig(),
        delay
      }
    },
    overshoot: bounce || elastic ? {
      opacity: 1,
      ...getFinalPosition(),
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration: duration * 0.3,
        ease: "easeOut"
      }
    } : {},
    final: bounce || elastic ? {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration: duration * 0.2,
        ease: "easeInOut"
      }
    } : {}
  };

  // Variantes para animación en cascada
  const cascadeContainerVariants = {
    hidden: {
      opacity: opacity ? 0 : 1
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: cascadeDelay,
        delayChildren: delay,
        duration: 0.1
      }
    }
  };

  const cascadeItemVariants = {
    hidden: {
      opacity: opacity ? 0 : 1,
      ...getInitialPosition(),
      scale: scale ? 0.8 : 1,
      rotate: rotate ? rotateAngle : 0,
      filter: blur ? "blur(5px)" : "blur(0px)"
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: getTransitionConfig()
    }
  };

  // Variantes para diferentes tipos de slide
  const getSlideTypeVariants = () => {
    const baseVariants = slideVariants;
    
    switch (slideType) {
      case 'push':
        return {
          ...baseVariants,
          hidden: {
            ...baseVariants.hidden,
            clipPath: 'inset(0 100% 0 0)'
          },
          visible: {
            ...baseVariants.visible,
            clipPath: 'inset(0 0% 0 0)'
          }
        };
        
      case 'cover':
        return {
          ...baseVariants,
          hidden: {
            ...baseVariants.hidden,
            scaleX: 0,
            transformOrigin: direction === 'left' ? 'left' : 'right'
          },
          visible: {
            ...baseVariants.visible,
            scaleX: 1
          }
        };
        
      case 'reveal':
        return {
          ...baseVariants,
          hidden: {
            ...baseVariants.hidden,
            clipPath: direction === 'left' 
              ? 'inset(0 0 0 100%)'
              : direction === 'right'
              ? 'inset(0 100% 0 0)'
              : direction === 'up'
              ? 'inset(100% 0 0 0)'
              : 'inset(0 0 100% 0)'
          },
          visible: {
            ...baseVariants.visible,
            clipPath: 'inset(0 0 0 0)'
          }
        };
        
      default:
        return baseVariants;
    }
  };

  // Manejar callbacks de animación
  const handleAnimationStart = () => {
    if (onAnimationStart) onAnimationStart();
  };

  const handleAnimationComplete = () => {
    if (onAnimationComplete) onAnimationComplete();
  };

  // Renderizar children en cascada si está habilitado
  const renderCascadeChildren = () => {
    if (!cascade) return children;

    const childrenArray = React.Children.toArray(children);
    
    return childrenArray.map((child, index) => (
      <motion.div
        key={index}
        variants={cascadeItemVariants}
        className="cascade-item"
      >
        {child}
      </motion.div>
    ));
  };

  // Lógica de animación secuencial para bounce/elastic
  const renderWithSequence = () => {
    if (!bounce && !elastic) {
      return (
        <motion.div
          ref={targetRef}
          className={className}
          style={style}
          variants={cascade ? cascadeContainerVariants : getSlideTypeVariants()}
          initial="hidden"
          animate={isInView && visible ? "visible" : "hidden"}
          onAnimationStart={handleAnimationStart}
          onAnimationComplete={handleAnimationComplete}
          {...props}
        >
          {cascade ? renderCascadeChildren() : children}
        </motion.div>
      );
    }

    // Para animaciones con bounce/elastic, usar secuencia
    return (
      <motion.div
        ref={targetRef}
        className={className}
        style={style}
        variants={getSlideTypeVariants()}
        initial="hidden"
        animate={isInView && visible ? ["visible", "overshoot", "final"] : "hidden"}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
        {...props}
      >
        {cascade ? renderCascadeChildren() : children}
      </motion.div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      {visible && renderWithSequence()}
    </AnimatePresence>
  );
});

// Componente especializado para slides laterales (sidebars, modals, etc.)
export const SlideInSidebar = ({
  isOpen,
  side = 'left', // 'left', 'right'
  width = 300,
  overlay = true,
  overlayOpacity = 0.5,
  closeOnOverlayClick = true,
  onClose,
  children,
  className = "",
  zIndex = 50,
  ...slideProps
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          {overlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: overlayOpacity }}
              exit={{ opacity: 0 }}
              onClick={closeOnOverlayClick ? onClose : undefined}
              className="fixed inset-0 bg-black"
              style={{ zIndex }}
            />
          )}
          
          {/* Sidebar */}
          <motion.div
            initial={{ 
              x: side === 'left' ? -width : width,
              opacity: 0 
            }}
            animate={{ 
              x: 0,
              opacity: 1 
            }}
            exit={{ 
              x: side === 'left' ? -width : width,
              opacity: 0 
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className={`fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} h-full bg-white shadow-xl ${className}`}
            style={{ 
              width,
              zIndex: zIndex + 1
            }}
            {...slideProps}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Componente para listas con slide escalonado
export const SlideInList = ({
  items,
  renderItem,
  direction = 'left',
  stagger = 0.1,
  listClassName = "",
  itemClassName = "",
  ...slideProps
}) => {
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: slideProps.delay || 0
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
      y: direction === 'up' ? -50 : direction === 'down' ? 50 : 0
    },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0.25, 1]
      }
    }
  };

  return (
    <SlideIn {...slideProps}>
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className={listClassName}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={itemClassName}
          >
            {renderItem ? renderItem(item, index) : item}
          </motion.div>
        ))}
      </motion.div>
    </SlideIn>
  );
};

// Hook para controlar SlideIn manualmente
export const useSlideIn = (config = {}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  const slideIn = () => setIsVisible(true);
  const slideOut = () => setIsVisible(false);
  const toggle = () => setIsVisible(prev => !prev);
  
  const SlideInComponent = ({ children, ...props }) => (
    <SlideIn
      visible={isVisible}
      direction={config.direction || 'left'}
      duration={config.duration || 0.6}
      triggerOnce={false}
      {...props}
    >
      {children}
    </SlideIn>
  );
  
  return {
    isVisible,
    slideIn,
    slideOut,
    toggle,
    SlideInComponent
  };
};

// Asignar displayNames para debugging
SlideIn.displayName = 'SlideIn';
SlideInSidebar.displayName = 'SlideInSidebar';
SlideInList.displayName = 'SlideInList';

export default SlideIn;