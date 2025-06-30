import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

const CountUp = ({ 
  from = 0, 
  to, 
  duration = 2, 
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  className = '',
  trigger = 'inView', // 'inView', 'immediate', 'manual'
  onComplete = null,
  springConfig = { stiffness: 100, damping: 30 },
  formatNumber = true
}) => {
  const [count, setCount] = useState(from);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Motion values para animación suave
  const motionValue = useMotionValue(from);
  const spring = useSpring(motionValue, springConfig);
  
  // Función para formatear números con separadores
  const formatNumberWithSeparator = (num) => {
    if (!formatNumber) return num.toString();
    
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  };

  // Función para iniciar la animación
  const startAnimation = () => {
    if (hasAnimated && trigger === 'inView') return;
    
    setHasAnimated(true);
    
    // Animación con motion value y spring
    motionValue.set(to);
    
    // Animación manual para el estado local
    const startTime = Date.now();
    const startValue = from;
    const endValue = to;
    const animationDuration = duration * 1000; // convertir a ms
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Función de easing suave (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;
      
      setCount(Number(currentValue.toFixed(decimals)));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
        if (onComplete) onComplete();
      }
    };
    
    // Aplicar delay si existe
    if (delay > 0) {
      setTimeout(() => {
        requestAnimationFrame(animate);
      }, delay * 1000);
    } else {
      requestAnimationFrame(animate);
    }
  };

  // Efectos para diferentes triggers
  useEffect(() => {
    if (trigger === 'immediate') {
      startAnimation();
    }
  }, [trigger]);

  useEffect(() => {
    if (trigger === 'inView' && isInView) {
      startAnimation();
    }
  }, [isInView, trigger]);

  // Función pública para trigger manual
  const triggerAnimation = () => {
    if (trigger === 'manual') {
      setHasAnimated(false);
      setCount(from);
      motionValue.set(from);
      startAnimation();
    }
  };

  // Exponer función de trigger si es manual
  useEffect(() => {
    if (trigger === 'manual' && ref.current) {
      ref.current.triggerAnimation = triggerAnimation;
    }
  }, [trigger]);

  // Variantes de animación para el contenedor
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: "easeOut"
      }
    }
  };

  // Variantes para el texto con efecto de brillo
  const textVariants = {
    hidden: { 
      opacity: 0,
      backgroundPosition: "200% center"
    },
    visible: { 
      opacity: 1,
      backgroundPosition: "-200% center",
      transition: {
        opacity: { duration: 0.3 },
        backgroundPosition: { 
          duration: 2, 
          ease: "easeInOut",
          repeat: hasAnimated ? Infinity : 0,
          repeatDelay: 3
        }
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView || trigger === 'immediate' ? "visible" : "hidden"}
      className={`inline-block ${className}`}
    >
      <motion.span
        variants={textVariants}
        className="inline-block bg-gradient-to-r from-transparent via-blue-500 to-transparent bg-clip-text text-transparent bg-300% font-bold"
        style={{
          background: 'linear-gradient(90deg, currentColor 40%, #3b82f6 50%, currentColor 60%)',
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        {prefix}
        {formatNumberWithSeparator(count.toFixed(decimals))}
        {suffix}
      </motion.span>
      
      {/* Efecto de partículas opcionales cuando la animación termina */}
      {hasAnimated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, delay: duration }}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI * 2) / 8) * 30,
                y: Math.sin((i * Math.PI * 2) / 8) * 30
              }}
              transition={{
                duration: 0.8,
                delay: duration + 0.2,
                ease: "easeOut"
              }}
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

// Hook personalizado para usar CountUp con más control
export const useCountUp = (to, options = {}) => {
  const [count, setCount] = useState(options.from || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const start = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = options.from || 0;
    const duration = (options.duration || 2) * 1000;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (to - startValue) * easeOut;
      
      setCount(Number(currentValue.toFixed(options.decimals || 0)));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(to);
        setIsAnimating(false);
        if (options.onComplete) options.onComplete();
      }
    };
    
    requestAnimationFrame(animate);
  };
  
  return { count, start, isAnimating };
};

export default CountUp;