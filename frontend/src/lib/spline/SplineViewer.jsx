/**
 * SplineViewer - Componente principal para visualización de modelos 3D
 * Sistema de gestión de bovinos - Integración avanzada con Spline
 */

import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SPLINE_CONFIGS, 
  SPLINE_THEMES, 
  SPLINE_EVENTS,
  useSplineCapabilities,
  optimizeConfig
} from './index';

/**
 * Componente principal SplineViewer
 * Maneja la carga, visualización e interacción con modelos 3D de Spline
 */
const SplineViewer = forwardRef(({
  scene,
  config = {},
  theme = 'default',
  className = '',
  style = {},
  loading = false,
  error = null,
  interactive = true,
  autoLoad = true,
  onLoad,
  onError,
  onInteractionStart,
  onInteractionEnd,
  onObjectClick,
  onObjectHover,
  onAnimationComplete,
  overlay,
  controls = true,
  stats = false,
  fallback,
  children,
  ...props
}, ref) => {
  
  // Referencias y estado
  const containerRef = useRef(null);
  const splineRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [modelInfo, setModelInfo] = useState(null);
  const [splineApp, setSplineApp] = useState(null);
  
  // Detectar capacidades del dispositivo
  const capabilities = useSplineCapabilities();
  
  // Optimizar configuración basada en capacidades
  const optimizedConfig = React.useMemo(() => {
    const baseConfig = typeof config === 'string' 
      ? SPLINE_CONFIGS[config] || SPLINE_CONFIGS.bovine
      : { ...SPLINE_CONFIGS.bovine, ...config };
    
    return optimizeConfig(baseConfig, capabilities);
  }, [config, capabilities]);
  
  // Tema seleccionado
  const selectedTheme = React.useMemo(() => {
    return typeof theme === 'string' 
      ? SPLINE_THEMES[theme] || SPLINE_THEMES.default
      : { ...SPLINE_THEMES.default, ...theme };
  }, [theme]);
  
  /**
   * Cargar el modelo 3D de Spline
   */
  const loadSplineModel = useCallback(async () => {
    if (!scene || !containerRef.current) return;
    
    try {
      setIsLoading(true);
      setHasError(false);
      setLoadProgress(0);
      
      // Verificar capacidades WebGL
      if (!capabilities.webGL) {
        throw new Error('WebGL no está soportado en este dispositivo');
      }
      
      // Simular progreso de carga
      const progressInterval = setInterval(() => {
        setLoadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 200);
      
      // Aquí iría la integración real con Spline
      // Por ahora simularemos la carga
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) { // 90% de éxito
            resolve();
          } else {
            reject(new Error('Error simulado de carga'));
          }
        }, 2000);
      });
      
      clearInterval(progressInterval);
      setLoadProgress(100);
      
      // Simular información del modelo cargado
      const mockModelInfo = {
        triangles: Math.floor(Math.random() * 50000) + 10000,
        vertices: Math.floor(Math.random() * 25000) + 5000,
        materials: Math.floor(Math.random() * 10) + 1,
        animations: Math.floor(Math.random() * 5),
        fileSize: Math.floor(Math.random() * 10) + 2 + 'MB'
      };
      
      setModelInfo(mockModelInfo);
      setIsLoading(false);
      onLoad?.(mockModelInfo);
      
      // Emitir evento personalizado
      const loadEvent = new CustomEvent(SPLINE_EVENTS.MODEL_LOADED, {
        detail: { scene, modelInfo: mockModelInfo }
      });
      containerRef.current?.dispatchEvent(loadEvent);
      
    } catch (error) {
      console.error('Error al cargar modelo Spline:', error);
      setHasError(true);
      setIsLoading(false);
      onError?.(error);
      
      // Emitir evento de error
      const errorEvent = new CustomEvent(SPLINE_EVENTS.MODEL_ERROR, {
        detail: { scene, error }
      });
      containerRef.current?.dispatchEvent(errorEvent);
    }
  }, [scene, capabilities, onLoad, onError]);
  
  /**
   * Manejar inicio de interacción
   */
  const handleInteractionStart = useCallback((event) => {
    setIsInteracting(true);
    onInteractionStart?.(event);
    
    const interactionEvent = new CustomEvent(SPLINE_EVENTS.INTERACTION_START, {
      detail: { event, splineApp }
    });
    containerRef.current?.dispatchEvent(interactionEvent);
  }, [onInteractionStart, splineApp]);
  
  /**
   * Manejar fin de interacción
   */
  const handleInteractionEnd = useCallback((event) => {
    setIsInteracting(false);
    onInteractionEnd?.(event);
    
    const interactionEvent = new CustomEvent(SPLINE_EVENTS.INTERACTION_END, {
      detail: { event, splineApp }
    });
    containerRef.current?.dispatchEvent(interactionEvent);
  }, [onInteractionEnd, splineApp]);
  
  /**
   * Manejar clic en objetos
   */
  const handleObjectClick = useCallback((object, event) => {
    onObjectClick?.(object, event);
    
    const clickEvent = new CustomEvent(SPLINE_EVENTS.OBJECT_CLICKED, {
      detail: { object, event, splineApp }
    });
    containerRef.current?.dispatchEvent(clickEvent);
  }, [onObjectClick, splineApp]);
  
  /**
   * Manejar hover en objetos
   */
  const handleObjectHover = useCallback((object, event) => {
    onObjectHover?.(object, event);
    
    const hoverEvent = new CustomEvent(SPLINE_EVENTS.OBJECT_HOVERED, {
      detail: { object, event, splineApp }
    });
    containerRef.current?.dispatchEvent(hoverEvent);
  }, [onObjectHover, splineApp]);
  
  // Exponer métodos a través de ref
  useImperativeHandle(ref, () => ({
    reload: loadSplineModel,
    getModelInfo: () => modelInfo,
    getSplineApp: () => splineApp,
    takeScreenshot: () => {
      // Implementar captura de pantalla
      console.log('Screenshot captured');
    },
    resetView: () => {
      // Implementar reset de cámara
      console.log('View reset');
    },
    playAnimation: (animationName) => {
      // Implementar reproducción de animación
      console.log('Playing animation:', animationName);
    },
    pauseAnimation: () => {
      // Implementar pausa de animación
      console.log('Animation paused');
    }
  }), [loadSplineModel, modelInfo, splineApp]);
  
  // Cargar modelo al montar o cambiar scene
  useEffect(() => {
    if (autoLoad && scene) {
      loadSplineModel();
    }
  }, [autoLoad, scene, loadSplineModel]);
  
  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      // Cleanup de Spline app
      if (splineApp) {
        // splineApp.dispose();
      }
    };
  }, [splineApp]);
  
  /**
   * Renderizar estado de carga
   */
  const renderLoading = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10"
    >
      <div className="text-center">
        {/* Spinner 3D */}
        <div className="relative mb-6">
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-lg"
          />
          <motion.div
            animate={{ rotateX: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-l-blue-400 rounded-lg"
          />
        </div>
        
        {/* Texto de carga */}
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Cargando modelo 3D
        </h3>
        
        {/* Barra de progreso */}
        <div className="w-64 bg-gray-200 rounded-full h-2 mb-4">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${loadProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <p className="text-sm text-gray-500">{Math.round(loadProgress)}% completado</p>
        
        {/* Información de carga */}
        {capabilities.mobile && (
          <p className="text-xs text-gray-400 mt-2">
            Optimizando para dispositivo móvil...
          </p>
        )}
      </div>
    </motion.div>
  );
  
  /**
   * Renderizar estado de error
   */
  const renderError = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 z-10"
    >
      <div className="text-center max-w-md">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-red-700 mb-2">
          Error al cargar modelo 3D
        </h3>
        
        <p className="text-red-600 text-sm mb-4">
          {error?.message || 'El modelo no se pudo cargar correctamente'}
        </p>
        
        {!capabilities.webGL && (
          <p className="text-red-500 text-xs mb-4">
            Tu navegador no soporta WebGL, requerido para modelos 3D
          </p>
        )}
        
        <button
          onClick={loadSplineModel}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </motion.div>
  );
  
  /**
   * Renderizar controles del visor
   */
  const renderControls = () => {
    if (!controls || isLoading || hasError) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 right-4 flex flex-col space-y-2 z-20"
      >
        {/* Botón de screenshot */}
        <button
          onClick={() => ref.current?.takeScreenshot()}
          className="p-2 bg-white bg-opacity-90 rounded-lg shadow-lg hover:bg-opacity-100 transition-all"
          title="Capturar pantalla"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        {/* Botón de reset */}
        <button
          onClick={() => ref.current?.resetView()}
          className="p-2 bg-white bg-opacity-90 rounded-lg shadow-lg hover:bg-opacity-100 transition-all"
          title="Resetear vista"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        {/* Indicador de interacción */}
        {isInteracting && (
          <div className="p-2 bg-blue-600 text-white rounded-lg shadow-lg text-xs">
            Interactuando
          </div>
        )}
      </motion.div>
    );
  };
  
  /**
   * Renderizar estadísticas del modelo
   */
  const renderStats = () => {
    if (!stats || !modelInfo || isLoading || hasError) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute top-4 left-4 bg-black bg-opacity-75 text-white text-xs p-3 rounded-lg z-20"
      >
        <h4 className="font-semibold mb-2">Estadísticas del Modelo</h4>
        <div className="space-y-1">
          <div>Triángulos: {modelInfo.triangles?.toLocaleString()}</div>
          <div>Vértices: {modelInfo.vertices?.toLocaleString()}</div>
          <div>Materiales: {modelInfo.materials}</div>
          <div>Animaciones: {modelInfo.animations}</div>
          <div>Tamaño: {modelInfo.fileSize}</div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[300px] overflow-hidden rounded-lg ${className}`}
      style={{
        backgroundColor: selectedTheme.backgroundColor,
        ...style
      }}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      {...props}
    >
      {/* Canvas principal de Spline */}
      <div
        ref={splineRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: selectedTheme.backgroundColor,
          cursor: interactive ? (isInteracting ? 'grabbing' : 'grab') : 'default'
        }}
      >
        {/* Aquí iría el canvas real de Spline */}
        {!isLoading && !hasError && (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-sm">Modelo 3D cargado</p>
              <p className="text-xs text-gray-500 mt-1">
                {interactive ? 'Arrastra para rotar • Rueda para zoom' : 'Modo solo visualización'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay personalizado */}
      {overlay && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {overlay}
        </div>
      )}
      
      {/* Estados de UI */}
      <AnimatePresence>
        {(isLoading || loading) && renderLoading()}
        {(hasError || error) && renderError()}
      </AnimatePresence>
      
      {/* Controles y estadísticas */}
      {renderControls()}
      {renderStats()}
      
      {/* Contenido adicional */}
      {children}
    </div>
  );
});

SplineViewer.displayName = 'SplineViewer';

export default SplineViewer;