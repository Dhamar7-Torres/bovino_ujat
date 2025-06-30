import React, { forwardRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const FadeIn = forwardRef(({ 
  children,
  direction = 'up', // 'up', 'down', 'left', 'right', 'none'
  distance = 30,
  duration = 0.6,
  delay = 0,
  stagger = 0,
  once = true,
  threshold = 0.1,
  margin = "0px 0px -100px 0px",
  className = "",
  style = {},
  cascade = false,
  cascadeDelay = 0.1,
  bounce = false,
  scale = false,
  blur = false,
  rotate = 0,
  triggerOnce = true,
  viewport = {},
  onAnimationStart = null,
  onAnimationComplete = null,
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
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  // Función para obtener rotación inicial
  const getInitialRotation = () => {
    return rotate !== 0 ? rotate : 0;
  };

  // Función para obtener escala inicial
  const getInitialScale = () => {
    return scale ? 0.8 : 1;
  };

  // Función para obtener blur inicial
  const getInitialBlur = () => {
    return blur ? 10 : 0;
  };

  // Variantes principales de animación
  const variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
      scale: getInitialScale(),
      rotate: getInitialRotation(),
      filter: `blur(${getInitialBlur()}px)`,
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
        duration,
        delay,
        ease: bounce ? "easeOut" : [0.25, 0.25, 0.25, 1],
        type: bounce ? "spring" : "tween",
        bounce: bounce ? 0.4 : 0,
        stiffness: bounce ? 200 : undefined,
        damping: bounce ? 20 : undefined
      }
    }
  };

  // Variantes para animación en cascada
  const cascadeVariants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
      scale: getInitialScale(),
      rotate: getInitialRotation(),
      filter: `blur(${getInitialBlur()}px)`
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        ease: bounce ? "easeOut" : [0.25, 0.25, 0.25, 1],
        type: bounce ? "spring" : "tween",
        bounce: bounce ? 0.4 : 0,
        stiffness: bounce ? 200 : undefined,
        damping: bounce ? 20 : undefined,
        staggerChildren: cascade ? cascadeDelay : 0,
        delayChildren: delay
      }
    }
  };

  // Variantes para elementos hijos en cascada
  const childVariants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
      scale: getInitialScale(),
      rotate: getInitialRotation(),
      filter: `blur(${getInitialBlur()}px)`
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration: duration * 0.8,
        ease: bounce ? "easeOut" : [0.25, 0.25, 0.25, 1],
        type: bounce ? "spring" : "tween",
        bounce: bounce ? 0.4 : 0,
        stiffness: bounce ? 200 : undefined,
        damping: bounce ? 20 : undefined
      }
    }
  };

  // Manejar callbacks de animación
  const handleAnimationStart = () => {
    if (onAnimationStart) onAnimationStart();
  };

  const handleAnimationComplete = () => {
    if (onAnimationComplete) onAnimationComplete();
  };

  // Si es animación en cascada, envolver hijos
  const renderCascadeChildren = () => {
    if (!cascade) return children;

    // Convertir children a array para poder mapear
    const childrenArray = React.Children.toArray(children);
    
    return childrenArray.map((child, index) => (
      <motion.div
        key={index}
        variants={childVariants}
        className="cascade-item"
      >
        {child}
      </motion.div>
    ));
  };

  // Componente principal
  return (
    <motion.div
      ref={targetRef}
      className={className}
      style={style}
      variants={cascade ? cascadeVariants : variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onAnimationStart={handleAnimationStart}
      onAnimationComplete={handleAnimationComplete}
      {...props}
    >
      {cascade ? renderCascadeChildren() : children}
    </motion.div>
  );
});

// Componente especializado para texto con efecto typewriter
export const FadeInText = ({ 
  text, 
  className = "",
  charDelay = 0.03,
  wordDelay = 0.1,
  mode = 'chars', // 'chars', 'words', 'lines'
  ...fadeInProps 
}) => {
  // Función para dividir texto según el modo
  const splitText = () => {
    switch (mode) {
      case 'chars':
        return text.split('');
      case 'words':
        return text.split(' ');
      case 'lines':
        return text.split('\n');
      default:
        return text.split('');
    }
  };

  const textArray = splitText();
  const delay = mode === 'chars' ? charDelay : wordDelay;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: fadeInProps.delay || 0
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: "blur(3px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <FadeIn {...fadeInProps}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={className}
      >
        {textArray.map((item, index) => (
          <motion.span
            key={index}
            variants={itemVariants}
            className="inline-block"
          >
            {item}
            {mode === 'words' && index < textArray.length - 1 && '\u00A0'}
            {mode === 'lines' && index < textArray.length - 1 && <br />}
          </motion.span>
        ))}
      </motion.span>
    </FadeIn>
  );
};

// Componente para lista con animación en cascada
export const FadeInList = ({ 
  items, 
  renderItem,
  listClassName = "",
  itemClassName = "",
  stagger = 0.1,
  ...fadeInProps 
}) => {
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: fadeInProps.delay || 0
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <FadeIn {...fadeInProps}>
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
    </FadeIn>
  );
};

// Hook personalizado para controlar FadeIn manualmente
export const useFadeIn = (config = {}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  const fadeIn = () => setIsVisible(true);
  const fadeOut = () => setIsVisible(false);
  const toggle = () => setIsVisible(prev => !prev);
  
  const FadeInComponent = ({ children, ...props }) => (
    <motion.div
      initial={{ opacity: 0, y: config.distance || 30 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : (config.distance || 30)
      }}
      transition={{
        duration: config.duration || 0.6,
        ease: config.ease || "easeOut"
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
  
  return {
    isVisible,
    fadeIn,
    fadeOut,
    toggle,
    FadeInComponent
  };
};

// Asignar displayName para debugging
FadeIn.displayName = 'FadeIn';
FadeInText.displayName = 'FadeInText';
FadeInList.displayName = 'FadeInList';

export default FadeIn;