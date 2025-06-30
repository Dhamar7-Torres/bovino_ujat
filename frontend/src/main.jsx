/**
 * main.jsx - Punto de entrada principal de React para el sistema de gestión de bovinos
 * Configuración de React 18, renderizado del componente App y configuraciones de desarrollo
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

// Importar el componente principal de la aplicación
import App from './App.jsx';

// Importar estilos principales
import './index.css';

// Configuración de entorno y variables globales
const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';

/**
 * Configuración de React DevTools para desarrollo
 * Habilitar herramientas de desarrollo específicas para el sistema ganadero
 */
if (isDevelopment) {
  // Configurar título de la aplicación para desarrollo
  document.title = '[DEV] Sistema de Gestión de Bovinos';
  
  // Habilitar React DevTools con configuración personalizada
  if (typeof window !== 'undefined') {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
    
    // Configurar nombres personalizados para componentes del sistema ganadero
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.settings = {
      ...window.__REACT_DEVTOOLS_GLOBAL_HOOK__.settings,
      hideConsoleLogsInStrictMode: false,
      appendComponentStack: true,
    };
  }
  
  // Logging de información de desarrollo
  console.log('🐄 Sistema de Gestión de Bovinos - Modo Desarrollo');
  console.log('🔧 React DevTools habilitado');
  console.log('📊 React Query DevTools disponible');
  console.log('🎨 Framer Motion habilitado para animaciones');
  console.log('🗺️ Leaflet Maps configurado para geolocalización');
  console.log('🎯 Spline 3D configurado para modelos interactivos');
}

/**
 * Configuración de producción
 * Optimizaciones y configuraciones específicas para entorno productivo
 */
if (isProduction) {
  // Configurar título de la aplicación para producción
  document.title = 'Sistema de Gestión de Bovinos';
  
  // Deshabilitar logging en consola para producción
  if (typeof window !== 'undefined') {
    // Mantener solo errores críticos
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};
    // Conservar console.warn y console.error para debugging crítico
  }
  
  // Configurar service worker para PWA (si está disponible)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registrado exitosamente');
        })
        .catch(registrationError => {
          console.error('Error al registrar Service Worker:', registrationError);
        });
    });
  }
}

/**
 * Configuración de meta tags dinámicos
 * Actualizar información SEO según el estado de la aplicación
 */
const configureDynamicMetaTags = () => {
  // Configurar viewport dinámico para mejor responsive design
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
  }

  // Configurar tema color dinámico según preferencias del usuario
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    // Detectar preferencia de tema oscuro/claro
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    themeColor.setAttribute('content', prefersDarkMode ? '#1E40AF' : '#3B82F6');
  }

  // Configurar descripción dinámica para páginas específicas
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && !metaDescription.getAttribute('data-original')) {
    metaDescription.setAttribute('data-original', metaDescription.getAttribute('content'));
  }
};

/**
 * Configuración de manejo de errores global
 * Capturar y reportar errores de la aplicación
 */
const configureErrorHandling = () => {
  // Manejo de errores no capturados de JavaScript
  window.addEventListener('error', (event) => {
    console.error('Error global capturado:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });

    // En desarrollo, mostrar información detallada
    if (isDevelopment) {
      console.group('🚨 Error de JavaScript detectado');
      console.error('Mensaje:', event.message);
      console.error('Archivo:', event.filename);
      console.error('Línea:', event.lineno, 'Columna:', event.colno);
      console.error('Stack:', event.error?.stack);
      console.groupEnd();
    }
  });

  // Manejo de errores de promesas no capturadas
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no manejada:', event.reason);

    if (isDevelopment) {
      console.group('🚨 Promesa rechazada detectada');
      console.error('Razón:', event.reason);
      console.error('Promesa:', event.promise);
      console.groupEnd();
    }

    // Prevenir que el error aparezca en la consola del navegador
    // event.preventDefault();
  });
};

/**
 * Configuración de optimizaciones de rendimiento
 * Configurar intersections observers, lazy loading y otras optimizaciones
 */
const configurePerformanceOptimizations = () => {
  // Configurar Intersection Observer para lazy loading de imágenes
  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            lazyImageObserver.unobserve(img);
          }
        }
      });
    });

    // Observer será aplicado a imágenes lazy cuando se monten los componentes
    window.lazyImageObserver = lazyImageObserver;
  }

  // Configurar optimizaciones de memoria
  if ('requestIdleCallback' in window) {
    const cleanupTasks = [];
    
    window.requestIdleCallback(() => {
      // Limpiar event listeners obsoletos
      cleanupTasks.forEach(task => task());
    });

    // Exponer función para registrar tareas de limpieza
    window.registerCleanupTask = (task) => {
      cleanupTasks.push(task);
    };
  }

  // Precargar recursos críticos
  const preloadCriticalResources = () => {
    // Precargar fuentes críticas
    const fontPreloads = [
      '/fonts/inter-variable.woff2',
      '/fonts/jetbrains-mono-variable.woff2'
    ];

    fontPreloads.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = fontUrl;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  };

  preloadCriticalResources();
};

/**
 * Configuración de accesibilidad
 * Configurar características de accesibilidad y navegación por teclado
 */
const configureAccessibility = () => {
  // Detectar si el usuario prefiere movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  const handleReducedMotionChange = (e) => {
    if (e.matches) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  prefersReducedMotion.addEventListener('change', handleReducedMotionChange);
  handleReducedMotionChange(prefersReducedMotion);

  // Detectar si el usuario prefiere alto contraste
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
  
  const handleHighContrastChange = (e) => {
    if (e.matches) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  prefersHighContrast.addEventListener('change', handleHighContrastChange);
  handleHighContrastChange(prefersHighContrast);

  // Configurar skip links para navegación por teclado
  const addSkipLinks = () => {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.setAttribute('aria-label', 'Saltar navegación e ir al contenido principal');
    document.body.insertBefore(skipLink, document.body.firstChild);
  };

  addSkipLinks();
};

/**
 * Inicialización de la aplicación
 * Configurar todas las optimizaciones y renderizar el componente principal
 */
const initializeApp = () => {
  // Ejecutar configuraciones antes del renderizado
  configureDynamicMetaTags();
  configureErrorHandling();
  configurePerformanceOptimizations();
  configureAccessibility();

  // Obtener el elemento root del DOM
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('No se encontró el elemento root. Verifica que existe un div con id="root" en el HTML.');
  }

  // Crear root de React 18 con configuración optimizada
  const root = ReactDOM.createRoot(rootElement, {
    // Configuraciones experimentales para mejor rendimiento
    unstable_strictMode: isDevelopment,
    unstable_concurrentUpdatesByDefault: true,
  });

  // Renderizar la aplicación con manejo de errores
  try {
    root.render(
      isDevelopment ? (
        <React.StrictMode>
          <App />
        </React.StrictMode>
      ) : (
        <App />
      )
    );

    // Logging de éxito en desarrollo
    if (isDevelopment) {
      console.log('✅ Aplicación React renderizada exitosamente');
      console.log('🎯 Root element encontrado y configurado');
      console.log('🚀 Sistema de gestión de bovinos iniciado');
    }

  } catch (error) {
    console.error('Error al renderizar la aplicación:', error);
    
    // Mostrar página de error básica
    rootElement.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-align: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      ">
        <div style="
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 3rem;
          max-width: 500px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        ">
          <h1 style="margin: 0 0 1rem 0; font-size: 2rem; font-weight: 600;">
            🐄 Sistema de Gestión de Bovinos
          </h1>
          <p style="margin: 0 0 2rem 0; font-size: 1.1rem; opacity: 0.9;">
            Error al cargar la aplicación
          </p>
          <p style="margin: 0 0 2rem 0; font-size: 0.9rem; opacity: 0.7;">
            ${isDevelopment ? error.message : 'Por favor, recarga la página o contacta al administrador.'}
          </p>
          <button onclick="window.location.reload()" style="
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
          " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" 
             onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
            🔄 Recargar página
          </button>
        </div>
      </div>
    `;
  }
};

/**
 * Configuración de loading state inicial
 * Mostrar indicador de carga mientras React se inicializa
 */
const configureInitialLoading = () => {
  // Crear y mostrar pantalla de carga inicial
  const loadingScreen = document.createElement('div');
  loadingScreen.id = 'initial-loading';
  loadingScreen.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="
        text-align: center;
        animation: fadeInUp 0.6s ease-out;
      ">
        <div style="
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: bounce 2s infinite;
        ">🐄</div>
        <h1 style="
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
          opacity: 0;
          animation: fadeIn 0.8s ease-out 0.3s forwards;
        ">Sistema de Gestión de Bovinos</h1>
        <div style="
          width: 200px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
          opacity: 0;
          animation: fadeIn 0.8s ease-out 0.6s forwards;
        ">
          <div style="
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
            animation: loading 1.5s infinite;
          "></div>
        </div>
        <p style="
          margin: 1rem 0 0 0;
          font-size: 0.9rem;
          opacity: 0;
          animation: fadeIn 0.8s ease-out 0.9s forwards;
        ">Cargando aplicación...</p>
      </div>
    </div>
    
    <style>
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }
      
      @keyframes loading {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    </style>
  `;
  
  document.body.appendChild(loadingScreen);

  // Función para ocultar la pantalla de carga
  const hideLoadingScreen = () => {
    const loading = document.getElementById('initial-loading');
    if (loading) {
      loading.style.opacity = '0';
      loading.style.transition = 'opacity 0.5s ease-out';
      setTimeout(() => {
        if (loading && loading.parentNode) {
          loading.parentNode.removeChild(loading);
        }
      }, 500);
    }
  };

  // Ocultar loading cuando React haya renderizado
  setTimeout(() => {
    const checkReactMount = () => {
      const root = document.getElementById('root');
      if (root && root.children.length > 0) {
        hideLoadingScreen();
      } else {
        setTimeout(checkReactMount, 100);
      }
    };
    checkReactMount();
  }, 1000);

  // Fallback: ocultar después de máximo 10 segundos
  setTimeout(hideLoadingScreen, 10000);
};

/**
 * Punto de entrada principal
 * Ejecutar configuración inicial y renderizar la aplicación
 */
(() => {
  // Verificar soporte de características requeridas
  if (!window.React && typeof ReactDOM === 'undefined') {
    console.error('React no está disponible. Verifica que las dependencias estén cargadas correctamente.');
    return;
  }

  // Verificar soporte de ES6+ features requeridas
  const requiredFeatures = [
    'Promise',
    'fetch',
    'Map',
    'Set',
    'Object.assign',
    'Array.from'
  ];

  const missingFeatures = requiredFeatures.filter(feature => 
    !window[feature] && !eval(`typeof ${feature}`) !== 'undefined'
  );

  if (missingFeatures.length > 0) {
    console.error('Características requeridas no disponibles:', missingFeatures);
    document.getElementById('root').innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: Arial, sans-serif;">
        <h1>Navegador no compatible</h1>
        <p>Tu navegador no soporta las características requeridas para esta aplicación.</p>
        <p>Por favor, actualiza a una versión más reciente de tu navegador.</p>
      </div>
    `;
    return;
  }

  // Configurar pantalla de carga inicial
  configureInitialLoading();

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }

  // Logging final de configuración
  if (isDevelopment) {
    console.log('🔧 Configuración del entorno completada');
    console.log('📱 Aplicación configurada para:', {
      modo: isDevelopment ? 'desarrollo' : 'producción',
      react: React.version,
      navegador: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    });
  }
})();