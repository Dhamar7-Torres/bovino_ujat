/**
 * Spline - Librería para modelos 3D interactivos
 * Sistema de gestión de bovinos - Visualización 3D de elementos del sistema
 */

import React, { Suspense, lazy } from 'react';

// Importación lazy del SplineViewer para optimización
const SplineViewer = lazy(() => import('./SplineViewer'));

// ============== CONFIGURACIONES Y CONSTANTES ==============

/**
 * URLs de modelos 3D predefinidos para el sistema ganadero
 */
export const SPLINE_MODELS = {
  // Modelos de bovinos
  BOVINE_HOLSTEIN: 'https://prod.spline.design/your-holstein-model-id/scene.splinecode',
  BOVINE_ANGUS: 'https://prod.spline.design/your-angus-model-id/scene.splinecode',
  BOVINE_GENERIC: 'https://prod.spline.design/your-generic-bovine-id/scene.splinecode',
  
  // Modelos de rancho e infraestructura
  RANCH_OVERVIEW: 'https://prod.spline.design/your-ranch-overview-id/scene.splinecode',
  BARN_INTERIOR: 'https://prod.spline.design/your-barn-interior-id/scene.splinecode',
  MILKING_PARLOR: 'https://prod.spline.design/your-milking-parlor-id/scene.splinecode',
  PASTURE_FIELD: 'https://prod.spline.design/your-pasture-field-id/scene.splinecode',
  
  // Modelos de equipamiento
  FEEDING_SYSTEM: 'https://prod.spline.design/your-feeding-system-id/scene.splinecode',
  WATER_SYSTEM: 'https://prod.spline.design/your-water-system-id/scene.splinecode',
  VETERINARY_EQUIPMENT: 'https://prod.spline.design/your-vet-equipment-id/scene.splinecode',
  
  // Modelos educativos y demostrativos
  ANATOMY_BOVINE: 'https://prod.spline.design/your-anatomy-model-id/scene.splinecode',
  BREEDING_PROCESS: 'https://prod.spline.design/your-breeding-process-id/scene.splinecode',
  FARM_LAYOUT: 'https://prod.spline.design/your-farm-layout-id/scene.splinecode'
};

/**
 * Configuraciones predeterminadas para diferentes tipos de visualización
 */
export const SPLINE_CONFIGS = {
  // Configuración para vista de bovinos individuales
  bovine: {
    autoRotate: true,
    autoRotateSpeed: 0.5,
    enableZoom: true,
    enablePan: false,
    minZoom: 0.5,
    maxZoom: 3,
    defaultZoom: 1,
    showControls: true,
    showStats: false,
    quality: 'high'
  },
  
  // Configuración para vista de rancho completo
  ranch: {
    autoRotate: false,
    enableZoom: true,
    enablePan: true,
    minZoom: 0.3,
    maxZoom: 5,
    defaultZoom: 1,
    showControls: true,
    showStats: false,
    quality: 'medium'
  },
  
  // Configuración para vista detallada de equipos
  equipment: {
    autoRotate: true,
    autoRotateSpeed: 0.3,
    enableZoom: true,
    enablePan: true,
    minZoom: 0.8,
    maxZoom: 4,
    defaultZoom: 1.2,
    showControls: true,
    showStats: false,
    quality: 'high'
  },
  
  // Configuración para vista educativa/presentación
  educational: {
    autoRotate: false,
    enableZoom: true,
    enablePan: true,
    minZoom: 0.5,
    maxZoom: 3,
    defaultZoom: 1,
    showControls: false,
    showStats: false,
    quality: 'medium'
  },
  
  // Configuración para dispositivos móviles
  mobile: {
    autoRotate: false,
    enableZoom: true,
    enablePan: true,
    minZoom: 0.5,
    maxZoom: 2,
    defaultZoom: 0.8,
    showControls: false,
    showStats: false,
    quality: 'low'
  }
};

/**
 * Temas visuales para diferentes contextos
 */
export const SPLINE_THEMES = {
  default: {
    backgroundColor: '#f8fafc',
    ambientLight: 0.4,
    directionalLight: 0.8,
    shadowIntensity: 0.3
  },
  dark: {
    backgroundColor: '#1e293b',
    ambientLight: 0.2,
    directionalLight: 0.6,
    shadowIntensity: 0.5
  },
  clinical: {
    backgroundColor: '#ffffff',
    ambientLight: 0.6,
    directionalLight: 0.9,
    shadowIntensity: 0.1
  },
  natural: {
    backgroundColor: '#87ceeb',
    ambientLight: 0.5,
    directionalLight: 0.7,
    shadowIntensity: 0.4
  }
};

/**
 * Eventos personalizados disponibles para modelos Spline
 */
export const SPLINE_EVENTS = {
  MODEL_LOADED: 'spline:model:loaded',
  MODEL_ERROR: 'spline:model:error',
  INTERACTION_START: 'spline:interaction:start',
  INTERACTION_END: 'spline:interaction:end',
  ANIMATION_COMPLETE: 'spline:animation:complete',
  OBJECT_CLICKED: 'spline:object:clicked',
  OBJECT_HOVERED: 'spline:object:hovered'
};

// ============== COMPONENTES WRAPPER ==============

/**
 * Componente wrapper con Suspense para carga lazy
 */
export const SplineWrapper = ({ 
  children, 
  fallback = <SplineLoader />,
  ...props 
}) => (
  <Suspense fallback={fallback}>
    <SplineViewer {...props}>
      {children}
    </SplineViewer>
  </Suspense>
);

/**
 * Componente de carga para modelos 3D
 */
export const SplineLoader = ({ message = "Cargando modelo 3D..." }) => (
  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
    <p className="text-gray-600 text-sm font-medium">{message}</p>
    <div className="mt-2 w-48 bg-gray-200 rounded-full h-2">
      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
    </div>
  </div>
);

/**
 * Componente de error para modelos 3D
 */
export const SplineError = ({ 
  error, 
  onRetry, 
  message = "Error al cargar el modelo 3D" 
}) => (
  <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-lg border-2 border-red-200">
    <div className="text-red-500 mb-4">
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <p className="text-red-700 font-medium mb-2">{message}</p>
    {error && (
      <p className="text-red-600 text-sm mb-4 text-center max-w-sm">
        {error.message || error}
      </p>
    )}
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Reintentar
      </button>
    )}
  </div>
);

// ============== COMPONENTES ESPECIALIZADOS ==============

/**
 * Visor de bovino individual con controles específicos
 */
export const BovineViewer = ({ 
  bovineId, 
  breed = 'generic',
  showInfo = true,
  interactive = true,
  ...props 
}) => {
  const modelUrl = SPLINE_MODELS[`BOVINE_${breed.toUpperCase()}`] || SPLINE_MODELS.BOVINE_GENERIC;
  
  return (
    <div className="relative">
      <SplineWrapper
        scene={modelUrl}
        config={SPLINE_CONFIGS.bovine}
        theme={SPLINE_THEMES.natural}
        interactive={interactive}
        {...props}
      />
      {showInfo && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
          <h3 className="font-semibold text-sm">Bovino ID: {bovineId}</h3>
          <p className="text-xs text-gray-600">Raza: {breed}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Vista panorámica del rancho
 */
export const RanchOverview = ({ 
  ranchData,
  highlights = [],
  interactive = true,
  ...props 
}) => (
  <SplineWrapper
    scene={SPLINE_MODELS.RANCH_OVERVIEW}
    config={SPLINE_CONFIGS.ranch}
    theme={SPLINE_THEMES.natural}
    interactive={interactive}
    highlights={highlights}
    {...props}
  />
);

/**
 * Sala de ordeño interactiva
 */
export const MilkingParlor = ({ 
  showProcess = false,
  animated = true,
  ...props 
}) => (
  <SplineWrapper
    scene={SPLINE_MODELS.MILKING_PARLOR}
    config={SPLINE_CONFIGS.equipment}
    theme={SPLINE_THEMES.clinical}
    animated={animated}
    showProcess={showProcess}
    {...props}
  />
);

/**
 * Modelo anatómico educativo
 */
export const AnatomyViewer = ({ 
  highlightedParts = [],
  showLabels = true,
  ...props 
}) => (
  <SplineWrapper
    scene={SPLINE_MODELS.ANATOMY_BOVINE}
    config={SPLINE_CONFIGS.educational}
    theme={SPLINE_THEMES.clinical}
    highlightedParts={highlightedParts}
    showLabels={showLabels}
    {...props}
  />
);

/**
 * Layout de granja para planificación
 */
export const FarmLayout = ({ 
  editMode = false,
  buildings = [],
  onBuildingClick,
  ...props 
}) => (
  <SplineWrapper
    scene={SPLINE_MODELS.FARM_LAYOUT}
    config={SPLINE_CONFIGS.ranch}
    theme={SPLINE_THEMES.default}
    editMode={editMode}
    buildings={buildings}
    onBuildingClick={onBuildingClick}
    {...props}
  />
);

// ============== HOOKS PERSONALIZADOS ==============

/**
 * Hook para gestionar el estado de modelos Spline
 */
export const useSplineModel = (modelUrl, config = {}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [model, setModel] = React.useState(null);
  
  const loadModel = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular carga del modelo (reemplazar con lógica real de Spline)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setModel({ url: modelUrl, config });
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }, [modelUrl, config]);
  
  React.useEffect(() => {
    loadModel();
  }, [loadModel]);
  
  return {
    model,
    isLoading,
    error,
    reload: loadModel
  };
};

/**
 * Hook para detectar capacidades del dispositivo
 */
export const useSplineCapabilities = () => {
  const [capabilities, setCapabilities] = React.useState({
    webGL: false,
    performance: 'unknown',
    mobile: false
  });
  
  React.useEffect(() => {
    // Detectar WebGL
    const canvas = document.createElement('canvas');
    const webGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    
    // Detectar si es móvil
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Estimar rendimiento basado en características del dispositivo
    const performance = mobile ? 'low' : webGL ? 'high' : 'medium';
    
    setCapabilities({
      webGL,
      performance,
      mobile
    });
  }, []);
  
  return capabilities;
};

/**
 * Función utilitaria para optimizar configuraciones según el dispositivo
 */
export const optimizeConfig = (baseConfig, capabilities) => {
  if (!capabilities.webGL) {
    return {
      ...baseConfig,
      quality: 'low',
      showStats: false,
      enableShadows: false
    };
  }
  
  if (capabilities.mobile) {
    return {
      ...baseConfig,
      ...SPLINE_CONFIGS.mobile,
      quality: capabilities.performance === 'low' ? 'low' : 'medium'
    };
  }
  
  return baseConfig;
};

/**
 * Función para precargar modelos críticos
 */
export const preloadCriticalModels = async () => {
  const criticalModels = [
    SPLINE_MODELS.BOVINE_GENERIC,
    SPLINE_MODELS.RANCH_OVERVIEW
  ];
  
  try {
    await Promise.all(
      criticalModels.map(url => 
        // Simular precarga (reemplazar con lógica real de Spline)
        new Promise(resolve => setTimeout(resolve, 100))
      )
    );
    console.log('Modelos críticos precargados exitosamente');
  } catch (error) {
    console.warn('Error al precargar modelos:', error);
  }
};

// ============== EXPORTACIONES ==============

// Exportar componentes principales
export { default as SplineViewer } from './SplineViewer';

// Exportar componentes especializados
export {
  SplineWrapper,
  SplineLoader,
  SplineError,
  BovineViewer,
  RanchOverview,
  MilkingParlor,
  AnatomyViewer,
  FarmLayout
};

// Exportar hooks
export {
  useSplineModel,
  useSplineCapabilities
};

// Exportar utilidades
export {
  optimizeConfig,
  preloadCriticalModels
};

// Exportación por defecto
export default {
  SplineViewer,
  SplineWrapper,
  SplineLoader,
  SplineError,
  BovineViewer,
  RanchOverview,
  MilkingParlor,
  AnatomyViewer,
  FarmLayout,
  useSplineModel,
  useSplineCapabilities,
  optimizeConfig,
  preloadCriticalModels,
  SPLINE_MODELS,
  SPLINE_CONFIGS,
  SPLINE_THEMES,
  SPLINE_EVENTS
};