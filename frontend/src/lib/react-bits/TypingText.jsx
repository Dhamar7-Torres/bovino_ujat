/**
 * TypingText - Componente avanzado de texto con efectos de escritura
 * Sistema de gestión de bovinos - Múltiples efectos de typing y máquina de escribir
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

/**
 * Componente principal TypingText con múltiples efectos de escritura
 */
const TypingText = ({
  texts = [],
  speed = 100,
  deleteSpeed = 50,
  delay = 1000,
  pauseTime = 2000,
  loop = true,
  showCursor = true,
  cursor = '|',
  cursorAnimation = 'blink',
  effect = 'typewriter',
  startDelay = 0,
  onComplete,
  onTextChange,
  onStart,
  className = '',
  style = {},
  ...props
}) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showCursorState, setShowCursorState] = useState(true);
  
  const ref = useRef();
  const isInView = useInView(ref, { once: true });
  const timeoutRef = useRef();
  const controls = useAnimation();
  
  // Normalizar texts a array
  const textArray = useMemo(() => {
    if (typeof texts === 'string') return [texts];
    if (Array.isArray(texts)) return texts;
    return [texts?.toString() || ''];
  }, [texts]);
  
  const currentFullText = textArray[currentIndex] || '';
  
  // Configuraciones de cursores
  const cursorStyles = {
    blink: 'animate-pulse',
    solid: '',
    fade: 'animate-ping',
    bounce: 'animate-bounce',
    none: 'opacity-0'
  };
  
  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Función principal de tipeo
  const typeText = useCallback(() => {
    if (!hasStarted || isPaused) return;
    
    if (!isDeleting) {
      // Escribiendo
      if (currentText.length < currentFullText.length) {
        setIsTyping(true);
        timeoutRef.current = setTimeout(() => {
          setCurrentText(currentFullText.slice(0, currentText.length + 1));
        }, speed + Math.random() * (speed * 0.3)); // Variación natural
      } else {
        // Texto completo escrito
        setIsTyping(false);
        onTextChange?.(currentFullText, currentIndex);
        
        if (textArray.length > 1 && loop) {
          // Pausar antes de borrar
          setIsPaused(true);
          timeoutRef.current = setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, pauseTime);
        } else if (!loop) {
          // Finalizar si no es loop
          onComplete?.(currentFullText);
        }
      }
    } else {
      // Borrando
      if (currentText.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setCurrentText(currentFullText.slice(0, currentText.length - 1));
        }, deleteSpeed);
      } else {
        // Texto completamente borrado
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % textArray.length);
      }
    }
  }, [
    currentText,
    currentFullText,
    currentIndex,
    isDeleting,
    hasStarted,
    isPaused,
    speed,
    deleteSpeed,
    pauseTime,
    loop,
    textArray.length,
    onTextChange,
    onComplete
  ]);
  
  // Efecto principal de tipeo
  useEffect(() => {
    if (hasStarted && !isPaused) {
      typeText();
    }
  }, [currentText, currentIndex, isDeleting, hasStarted, isPaused, typeText]);
  
  // Iniciar tipeo cuando entra en vista
  useEffect(() => {
    if (isInView && !hasStarted) {
      timeoutRef.current = setTimeout(() => {
        setHasStarted(true);
        onStart?.();
      }, startDelay);
    }
  }, [isInView, hasStarted, startDelay, onStart]);
  
  // Animación del cursor
  useEffect(() => {
    if (!showCursor) return;
    
    const cursorInterval = setInterval(() => {
      if (cursorAnimation === 'blink') {
        setShowCursorState(prev => !prev);
      }
    }, 530); // Velocidad de parpadeo estándar
    
    return () => clearInterval(cursorInterval);
  }, [showCursor, cursorAnimation]);
  
  // Efectos visuales por tipo
  const getEffectStyles = () => {
    switch (effect) {
      case 'typewriter':
        return {
          fontFamily: 'monospace',
          letterSpacing: '0.1em'
        };
      case 'terminal':
        return {
          fontFamily: 'monospace',
          backgroundColor: '#000000',
          color: '#00ff00',
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #00ff00'
        };
      case 'retro':
        return {
          fontFamily: 'monospace',
          color: '#ffff00',
          textShadow: '0 0 10px #ffff00',
          backgroundColor: '#000080',
          padding: '4px 8px'
        };
      case 'modern':
        return {
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '0.02em'
        };
      case 'elegant':
        return {
          fontFamily: 'serif',
          fontStyle: 'italic',
          letterSpacing: '0.05em'
        };
      default:
        return {};
    }
  };
  
  // Variantes de animación para el contenedor
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  // Variantes para cada carácter (efectos avanzados)
  const charVariants = {
    initial: { opacity: 0, y: 20, scale: 0.8 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 200,
        damping: 15
      }
    }
  };
  
  // Renderizar texto con efectos especiales
  const renderText = () => {
    if (effect === 'character-by-character') {
      return currentText.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={charVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: index * 0.05 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ));
    }
    
    return currentText;
  };
  
  // Componente del cursor
  const renderCursor = () => {
    if (!showCursor) return null;
    
    const cursorClass = cursorStyles[cursorAnimation] || cursorStyles.blink;
    const cursorOpacity = cursorAnimation === 'blink' ? (showCursorState ? 1 : 0) : 1;
    
    return (
      <motion.span
        className={`inline-block ml-1 ${cursorClass}`}
        style={{ opacity: cursorOpacity }}
        animate={cursorAnimation === 'bounce' ? { y: [0, -3, 0] } : {}}
        transition={cursorAnimation === 'bounce' ? { 
          repeat: Infinity, 
          duration: 0.6 
        } : {}}
      >
        {cursor}
      </motion.span>
    );
  };
  
  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      style={{
        ...style,
        ...getEffectStyles(),
        minHeight: '1.2em' // Evitar saltos de layout
      }}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      {...props}
    >
      {renderText()}
      {renderCursor()}
    </motion.span>
  );
};

// ============== COMPONENTES ESPECIALIZADOS ==============

/**
 * Texto de bienvenida con múltiples mensajes
 */
export const WelcomeTyping = ({ 
  messages = ['Bienvenido', 'Welcome', 'Bienvenue'],
  ...props 
}) => (
  <TypingText
    texts={messages}
    speed={80}
    deleteSpeed={40}
    pauseTime={2000}
    effect="elegant"
    className="text-2xl font-bold text-blue-600"
    cursor="▌"
    {...props}
  />
);

/**
 * Terminal de comandos animado
 */
export const TerminalTyping = ({ 
  commands = ['$ npm install', '$ npm start', '$ Servidor iniciado...'],
  prompt = '$ ',
  ...props 
}) => {
  const [currentCommand, setCurrentCommand] = useState(0);
  
  return (
    <div className="bg-black text-green-400 p-4 rounded font-mono text-sm">
      {commands.slice(0, currentCommand).map((cmd, index) => (
        <div key={index} className="mb-1">
          {cmd}
        </div>
      ))}
      <div className="flex">
        <span className="text-green-500 mr-2">{prompt}</span>
        <TypingText
          texts={[commands[currentCommand]]}
          speed={50}
          effect="terminal"
          showCursor={true}
          cursor="_"
          loop={false}
          onComplete={() => {
            if (currentCommand < commands.length - 1) {
              setTimeout(() => setCurrentCommand(prev => prev + 1), 500);
            }
          }}
          {...props}
        />
      </div>
    </div>
  );
};

/**
 * Ticker de noticias
 */
export const NewsTicker = ({ 
  news = [],
  speed = 60,
  ...props 
}) => (
  <div className="bg-red-600 text-white px-4 py-2 overflow-hidden">
    <div className="flex items-center">
      <span className="bg-white text-red-600 px-2 py-1 text-xs font-bold mr-4">
        NOTICIAS
      </span>
      <TypingText
        texts={news}
        speed={speed}
        deleteSpeed={30}
        pauseTime={3000}
        effect="modern"
        className="text-sm font-medium"
        cursor=""
        {...props}
      />
    </div>
  </div>
);

/**
 * Estadísticas animadas del sistema ganadero
 */
export const CattleStats = ({ 
  stats = {
    total: 'Total de Bovinos: 1,247',
    healthy: 'Sanos: 1,189',
    production: 'En Producción: 894',
    alerts: 'Alertas: 3'
  },
  ...props 
}) => {
  const statsArray = Object.values(stats);
  
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <TypingText
        texts={statsArray}
        speed={40}
        deleteSpeed={20}
        pauseTime={2500}
        effect="modern"
        className="text-blue-800 font-semibold"
        cursor="⚡"
        cursorAnimation="fade"
        {...props}
      />
    </div>
  );
};

/**
 * Alertas del sistema con tipeo urgente
 */
export const SystemAlerts = ({ 
  alerts = ['Sistema operativo', 'Revisión veterinaria pendiente', 'Mantenimiento programado'],
  ...props 
}) => (
  <TypingText
    texts={alerts}
    speed={30}
    deleteSpeed={15}
    pauseTime={3000}
    effect="retro"
    className="text-yellow-300 font-bold"
    cursor="⚠"
    cursorAnimation="bounce"
    {...props}
  />
);

/**
 * Búsqueda en tiempo real
 */
export const SearchTyping = ({ 
  placeholder = 'Buscar bovinos...',
  suggestions = [],
  ...props 
}) => {
  const searchTexts = [placeholder, ...suggestions];
  
  return (
    <div className="relative">
      <TypingText
        texts={searchTexts}
        speed={70}
        deleteSpeed={35}
        pauseTime={1500}
        effect="modern"
        className="text-gray-500 italic"
        cursor="|"
        cursorAnimation="blink"
        {...props}
      />
    </div>
  );
};

/**
 * Citas o testimonios rotatorios
 */
export const QuoteTyping = ({ 
  quotes = [],
  authors = [],
  ...props 
}) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  
  const formattedQuotes = quotes.map((quote, index) => 
    `"${quote}" - ${authors[index] || 'Anónimo'}`
  );
  
  return (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic">
      <TypingText
        texts={formattedQuotes}
        speed={60}
        deleteSpeed={30}
        pauseTime={4000}
        effect="elegant"
        className="text-gray-700"
        cursor="✍"
        onTextChange={(text, index) => setCurrentQuote(index)}
        {...props}
      />
    </blockquote>
  );
};

/**
 * Contador de tiempo real
 */
export const LiveCounter = ({ 
  label = 'Visitantes en línea',
  updateInterval = 5000,
  ...props 
}) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, updateInterval);
    
    return () => clearInterval(interval);
  }, [updateInterval]);
  
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <TypingText
        texts={[`${label}: ${count}`]}
        speed={100}
        loop={false}
        effect="modern"
        className="text-sm font-medium text-green-600"
        cursor=""
        {...props}
      />
    </div>
  );
};

/**
 * Hook para controlar tipeo manualmente
 */
export const useTyping = (text, speed = 100) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isActive, setIsActive] = useState(false);
  
  const start = useCallback(() => {
    setIsActive(true);
    setDisplayText('');
    setIsComplete(false);
  }, []);
  
  const stop = useCallback(() => {
    setIsActive(false);
  }, []);
  
  const reset = useCallback(() => {
    setDisplayText('');
    setIsComplete(false);
    setIsActive(false);
  }, []);
  
  useEffect(() => {
    if (!isActive || isComplete) return;
    
    if (displayText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, speed);
      
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      setIsActive(false);
    }
  }, [displayText, text, speed, isActive, isComplete]);
  
  return {
    displayText,
    isComplete,
    isActive,
    start,
    stop,
    reset
  };
};

// Exportaciones
export {
  WelcomeTyping,
  TerminalTyping,
  NewsTicker,
  CattleStats,
  SystemAlerts,
  SearchTyping,
  QuoteTyping,
  LiveCounter,
  useTyping
};

export default TypingText;