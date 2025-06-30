/**
 * GlitchText - Componente de texto con efectos glitch avanzados
 * Sistema de gestión de bovinos - Efectos de texto cyberpunk y glitch
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

// Caracteres para efectos de glitch
const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';
const MATRIX_CHARS = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CYBERPUNK_CHARS = '0123456789ABCDEF█▓▒░';

/**
 * Componente principal GlitchText con múltiples efectos
 */
const GlitchText = ({
  children,
  effect = 'classic',
  intensity = 'medium',
  speed = 'medium',
  trigger = 'auto',
  duration = null,
  infinite = false,
  color = '#ffffff',
  glitchColors = ['#ff0000', '#00ff00', '#0000ff'],
  className = '',
  style = {},
  onGlitchStart,
  onGlitchEnd,
  ...props
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchText, setGlitchText] = useState(children);
  const [shadowLayers, setShadowLayers] = useState([]);
  const ref = useRef();
  const isInView = useInView(ref, { once: trigger === 'auto' });
  const controls = useAnimation();
  
  const originalText = typeof children === 'string' ? children : '';
  
  // Configuraciones de intensidad
  const intensityConfig = {
    low: { glitchProbability: 0.1, maxShifts: 2, shadowCount: 2 },
    medium: { glitchProbability: 0.3, maxShifts: 4, shadowCount: 3 },
    high: { glitchProbability: 0.5, maxShifts: 6, shadowCount: 4 },
    extreme: { glitchProbability: 0.8, maxShifts: 10, shadowCount: 6 }
  };
  
  // Configuraciones de velocidad
  const speedConfig = {
    slow: 200,
    medium: 100,
    fast: 50,
    ultrafast: 25
  };
  
  const currentIntensity = intensityConfig[intensity] || intensityConfig.medium;
  const currentSpeed = speedConfig[speed] || speedConfig.medium;
  
  // Función para generar caracteres aleatorios
  const getRandomChar = (charSet = GLITCH_CHARS) => {
    return charSet[Math.floor(Math.random() * charSet.length)];
  };
  
  // Función para corromper texto
  const corruptText = (text, probability) => {
    return text.split('').map(char => {
      if (char === ' ') return char;
      return Math.random() < probability ? getRandomChar() : char;
    }).join('');
  };
  
  // Función para crear efectos de sombra colorida
  const createColorShadows = () => {
    const shadows = [];
    for (let i = 0; i < currentIntensity.shadowCount; i++) {
      const x = (Math.random() - 0.5) * currentIntensity.maxShifts;
      const y = (Math.random() - 0.5) * currentIntensity.maxShifts;
      const color = glitchColors[i % glitchColors.length];
      shadows.push(`${x}px ${y}px 0 ${color}`);
    }
    return shadows;
  };
  
  // Función principal de glitch
  const triggerGlitch = (customDuration = null) => {
    if (isGlitching) return;
    
    setIsGlitching(true);
    onGlitchStart?.();
    
    const glitchDuration = customDuration || duration || (infinite ? Infinity : 1000);
    let glitchFrames = 0;
    const maxFrames = infinite ? Infinity : Math.floor(glitchDuration / currentSpeed);
    
    const glitchInterval = setInterval(() => {
      // Actualizar texto corrupto
      const corrupted = corruptText(originalText, currentIntensity.glitchProbability);
      setGlitchText(corrupted);
      
      // Actualizar sombras
      setShadowLayers(createColorShadows());
      
      glitchFrames++;
      
      if (glitchFrames >= maxFrames && !infinite) {
        clearInterval(glitchInterval);
        setGlitchText(originalText);
        setShadowLayers([]);
        setIsGlitching(false);
        onGlitchEnd?.();
      }
    }, currentSpeed);
    
    // Cleanup después de la duración especificada
    if (!infinite) {
      setTimeout(() => {
        clearInterval(glitchInterval);
        setGlitchText(originalText);
        setShadowLayers([]);
        setIsGlitching(false);
        onGlitchEnd?.();
      }, glitchDuration);
    }
    
    return () => clearInterval(glitchInterval);
  };
  
  // Efectos específicos
  const effects = {
    classic: () => ({
      textShadow: shadowLayers.join(', '),
      transform: `translate(${(Math.random() - 0.5) * 2}px, ${(Math.random() - 0.5) * 2}px)`,
      filter: isGlitching ? 'blur(0.5px) contrast(200%)' : 'none'
    }),
    
    matrix: () => ({
      color: '#00ff00',
      textShadow: '0 0 10px #00ff00',
      backgroundColor: isGlitching ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
      fontFamily: 'monospace'
    }),
    
    cyberpunk: () => ({
      color: '#ff00ff',
      textShadow: shadowLayers.join(', '),
      transform: `skew(${isGlitching ? Math.random() * 5 - 2.5 : 0}deg)`,
      filter: isGlitching ? 'hue-rotate(90deg) saturate(200%)' : 'none',
      fontWeight: 'bold'
    }),
    
    neon: () => ({
      color: color,
      textShadow: isGlitching 
        ? `0 0 5px ${color}, 0 0 10px ${color}, 0 0 15px ${color}, 0 0 20px ${color}`
        : `0 0 10px ${color}`,
      filter: isGlitching ? 'brightness(150%)' : 'brightness(100%)'
    }),
    
    corrupt: () => ({
      textShadow: shadowLayers.join(', '),
      transform: `scale(${isGlitching ? 1 + Math.random() * 0.1 : 1})`,
      filter: isGlitching ? 'invert(1) sepia(1) hue-rotate(180deg)' : 'none'
    }),
    
    static: () => ({
      position: 'relative',
      overflow: 'hidden',
      backgroundImage: isGlitching 
        ? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
        : 'none',
      backgroundSize: '200% 100%',
      animation: isGlitching ? 'staticNoise 0.1s infinite' : 'none'
    }),
    
    hologram: () => ({
      background: isGlitching 
        ? 'linear-gradient(45deg, transparent, rgba(0,255,255,0.1), transparent)'
        : 'transparent',
      textShadow: isGlitching 
        ? '0 0 10px cyan, 0 0 20px cyan, 0 0 30px cyan'
        : '0 0 5px cyan',
      transform: `perspective(100px) rotateX(${isGlitching ? Math.random() * 5 : 0}deg)`
    }),
    
    datastream: () => ({
      fontFamily: 'monospace',
      color: '#00ff00',
      backgroundColor: isGlitching ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
      textShadow: '0 0 8px #00ff00',
      letterSpacing: isGlitching ? `${Math.random() * 2}px` : '1px'
    })
  };
  
  // Aplicar efecto actual
  const currentEffect = effects[effect] || effects.classic;
  const effectStyles = currentEffect();
  
  // Activar glitch automáticamente
  useEffect(() => {
    if (trigger === 'auto' && isInView && !isGlitching) {
      const timeout = setTimeout(() => {
        triggerGlitch();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isInView, trigger]);
  
  // Activar glitch en hover
  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      triggerGlitch();
    }
  };
  
  // Activar glitch en click
  const handleClick = () => {
    if (trigger === 'click') {
      triggerGlitch();
    }
  };
  
  // Estilo CSS personalizado para animaciones
  const cssAnimations = `
    @keyframes staticNoise {
      0%, 100% { background-position: 0% 0%; }
      50% { background-position: 100% 0%; }
    }
    
    @keyframes glitchShake {
      0%, 100% { transform: translate(0); }
      10% { transform: translate(-2px, 1px); }
      20% { transform: translate(-1px, -1px); }
      30% { transform: translate(1px, 2px); }
      40% { transform: translate(1px, -1px); }
      50% { transform: translate(-1px, 2px); }
      60% { transform: translate(-3px, 1px); }
      70% { transform: translate(2px, 1px); }
      80% { transform: translate(-1px, -1px); }
      90% { transform: translate(2px, 2px); }
    }
    
    @keyframes digitalFlicker {
      0%, 100% { opacity: 1; }
      1% { opacity: 0.8; }
      2% { opacity: 1; }
      8% { opacity: 0.9; }
      9% { opacity: 1; }
      12% { opacity: 0.7; }
      20% { opacity: 1; }
    }
  `;
  
  // Variantes de animación con motion
  const glitchVariants = {
    normal: {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0
    },
    glitch: {
      x: [-2, 2, -2, 2, 0],
      y: [-1, 1, -1, 1, 0],
      scale: [1, 1.02, 0.98, 1.01, 1],
      rotate: [0, 0.5, -0.5, 0.2, 0],
      transition: {
        duration: 0.2,
        repeat: infinite ? Infinity : 3,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <>
      <style>{cssAnimations}</style>
      <motion.span
        ref={ref}
        className={`inline-block ${className}`}
        style={{
          ...style,
          ...effectStyles,
          userSelect: 'none'
        }}
        variants={glitchVariants}
        animate={isGlitching ? 'glitch' : 'normal'}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        {...props}
      >
        {glitchText}
        
        {/* Capas adicionales para efectos más complejos */}
        {effect === 'static' && isGlitching && (
          <motion.span
            className="absolute inset-0 opacity-20"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)',
              pointerEvents: 'none'
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              y: [0, -2, 0]
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity
            }}
          />
        )}
        
        {effect === 'hologram' && isGlitching && (
          <motion.span
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.3), transparent)',
              pointerEvents: 'none'
            }}
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )}
      </motion.span>
    </>
  );
};

// Componentes especializados

/**
 * Texto de error con glitch
 */
export const ErrorGlitch = ({ children, ...props }) => (
  <GlitchText
    effect="corrupt"
    intensity="high"
    speed="fast"
    glitchColors={['#ff0000', '#ff4444', '#ff6666']}
    trigger="auto"
    duration={2000}
    className="text-red-500 font-bold"
    {...props}
  >
    {children}
  </GlitchText>
);

/**
 * Texto de alerta del sistema
 */
export const SystemAlert = ({ children, ...props }) => (
  <GlitchText
    effect="cyberpunk"
    intensity="medium"
    speed="medium"
    trigger="hover"
    className="text-yellow-400 font-mono uppercase tracking-wider"
    {...props}
  >
    {children}
  </GlitchText>
);

/**
 * Título con efecto matrix
 */
export const MatrixTitle = ({ children, ...props }) => (
  <GlitchText
    effect="matrix"
    intensity="low"
    speed="slow"
    infinite={true}
    className="text-2xl font-mono font-bold"
    {...props}
  >
    {children}
  </GlitchText>
);

/**
 * Texto neon interactivo
 */
export const NeonText = ({ children, color = '#00ffff', ...props }) => (
  <GlitchText
    effect="neon"
    intensity="medium"
    speed="fast"
    trigger="click"
    color={color}
    className="text-xl font-bold cursor-pointer"
    {...props}
  >
    {children}
  </GlitchText>
);

/**
 * Texto de holograma futurista
 */
export const HologramText = ({ children, ...props }) => (
  <GlitchText
    effect="hologram"
    intensity="low"
    speed="medium"
    trigger="auto"
    duration={3000}
    className="text-cyan-400 font-light"
    {...props}
  >
    {children}
  </GlitchText>
);

/**
 * Flujo de datos animado
 */
export const DataStream = ({ children, ...props }) => (
  <GlitchText
    effect="datastream"
    intensity="medium"
    speed="ultrafast"
    infinite={true}
    className="text-sm font-mono"
    {...props}
  >
    {children}
  </GlitchText>
);

/**
 * Hook personalizado para controlar glitch manualmente
 */
export const useGlitch = () => {
  const [isGlitching, setIsGlitching] = useState(false);
  
  const startGlitch = (duration = 1000) => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), duration);
  };
  
  const stopGlitch = () => {
    setIsGlitching(false);
  };
  
  return { isGlitching, startGlitch, stopGlitch };
};

// Exportaciones
export {
  ErrorGlitch,
  SystemAlert,
  MatrixTitle,
  NeonText,
  HologramText,
  DataStream,
  useGlitch
};

export default GlitchText;