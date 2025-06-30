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
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

/**
 * Configuración de meta tags dinámicos para SEO y PWA
 */
const configureDynamicMetaTags = () => {
  // Configurar viewport meta tag para responsive design
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (!viewportMeta) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
    document.head.appendChild(meta);
  }

  // Configurar description meta tag
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (!descriptionMeta) {
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Sistema integral para la gestión de bovinos, control de salud, producción lechera, reproducción y finanzas del rancho. Tecnología avanzada para ganaderos modernos.';
    document.head.appendChild(meta);
  }

  // Configurar keywords meta tag
  const keywordsMeta = document.querySelector('meta[name="keywords"]');
  if (!keywordsMeta) {
    const meta = document.createElement('meta');
    meta.name = 'keywords';
    meta.content = 'gestión de bovinos, ganado, vacas, producción lechera, salud animal, reproducción bovina, finanzas ganaderas, rancho, ganadería';
    document.head.appendChild(meta);
  }

  // Configurar theme-color para PWA
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeColorMeta) {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#3B82F6'; // Color primario del sistema
    document.head.appendChild(meta);
  }

  // Configurar Open Graph tags para compartir en redes sociales
  const ogTitleMeta = document.querySelector('meta[property="og:title"]');
  if (!ogTitleMeta) {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:title');
    meta.content = 'Sistema de Gestión de Bovinos';
    document.head.appendChild(meta);
  }

  const ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
  if (!ogDescriptionMeta) {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:description');
    meta.content = 'Tecnología avanzada para la gestión integral de bovinos y operaciones ganaderas';
    document.head.appendChild(meta);
  }

  const ogTypeMeta = document.querySelector('meta[property="og:type"]');
  if (!ogTypeMeta) {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:type');
    meta.content = 'website';
    document.head.appendChild(meta);
  }
};

/**
 * Configuración de manejo de errores globales
 * Captura errores no manejados y los reporta para debugging
 */
const configureErrorHandling = () => {
  // Manejar errores de JavaScript no capturados
  window.addEventListener('error', (event) => {
    console.error('Error global capturado:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
    
    // En producción, enviar errores a servicio de logging
    if (isProduction) {
      // Aquí se podría integrar con servicios como Sentry, LogRocket, etc.
      // sendErrorToLoggingService(event.error);
    }
  });

  // Manejar promesas rechazadas no capturadas
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada no manejada:', event.reason);
    
    // En producción, enviar errores a servicio de logging
    if (isProduction) {
      // sendErrorToLoggingService(event.reason);
    }
  });
};

/**
 * Configuración de optimizaciones de rendimiento
 */
const configurePerformanceOptimizations = () => {
  // Precargar recursos críticos
  const preloadCriticalResources = () => {
    // Precargar fuentes críticas
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontLink.as = 'style';
    fontLink.onload = function() { this.onload = null; this.rel = 'stylesheet'; };
    document.head.appendChild(fontLink);
  };

  // Configurar intersection observer para lazy loading
  if ('IntersectionObserver' in window) {
    // Configurar observer para elementos que se cargan bajo demanda
    window.bovineSystemObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Manejar elementos que entran en viewport
          entry.target.classList.add('in-viewport');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });
  }

  preloadCriticalResources();
};

/**
 * Configuración de accesibilidad
 */
const configureAccessibility = () => {
  // Detectar preferencias de usuario para reduced motion
  if (window.matchMedia) {
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
  }

  // Detectar preferencias de alto contraste
  if (window.matchMedia) {
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
  }

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

  // Crear root de React 18
  const root = ReactDOM.createRoot(rootElement);

  // Renderizar la aplicación con configuraciones apropiadas
  if (isDevelopment) {
    // En desarrollo, usar React.StrictMode para detectar problemas
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    // En producción, renderizar directamente para mejor rendimiento
    root.render(<App />);
  }

  // Logging de inicialización exitosa
  if (isDevelopment) {
    console.log('✅ Sistema de Gestión de Bovinos inicializado correctamente');
    console.log('🚀 Aplicación renderizada con React 18');
    console.log('📱 PWA y accesibilidad configurados');
  }
};

/**
 * Punto de entrada principal
 * Inicializar la aplicación cuando el DOM esté listo
 */
try {
  initializeApp();
} catch (error) {
  console.error('❌ Error crítico al inicializar la aplicación:', error);
  
  // Mostrar mensaje de error de fallback al usuario
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background-color: #f9fafb;
        color: #374151;
        text-align: center;
        padding: 2rem;
      ">
        <div style="
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          max-width: 500px;
        ">
          <h1 style="
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #dc2626;
          ">
            🐄 Error de Inicialización
          </h1>
          <p style="
            margin-bottom: 1rem;
            line-height: 1.5;
          ">
            No se pudo inicializar el Sistema de Gestión de Bovinos.
          </p>
          <p style="
            font-size: 0.875rem;
            color: #6b7280;
            margin-bottom: 1.5rem;
          ">
            Por favor, verifica que tu navegador sea compatible y recarga la página.
          </p>
          <button 
            onclick="window.location.reload()"
            style="
              background-color: #3b82f6;
              color: white;
              padding: 0.75rem 1.5rem;
              border: none;
              border-radius: 6px;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.2s;
            "
            onmouseover="this.style.backgroundColor='#2563eb'"
            onmouseout="this.style.backgroundColor='#3b82f6'"
          >
            🔄 Recargar Página
          </button>
        </div>
      </div>
    `;
  }
  
  // En producción, reportar error crítico
  if (isProduction) {
    // sendCriticalErrorToLoggingService(error);
  }
}