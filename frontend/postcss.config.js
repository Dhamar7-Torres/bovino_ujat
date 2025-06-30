/**
 * postcss.config.js - Configuración de PostCSS para el sistema de gestión de bovinos
 * Configuración optimizada para Tailwind CSS, autoprefixer y plugins adicionales
 */

export default {
  // Lista de plugins de PostCSS en orden de ejecución
  plugins: {
    // Plugin para importar archivos CSS
    'postcss-import': {
      // Permitir importaciones desde node_modules
      resolve: (id, basedir) => {
        // Resolver rutas de node_modules
        if (id.startsWith('~')) {
          return id.slice(1);
        }
        return id;
      }
    },

    // Plugin para anidar reglas CSS (sintaxis similar a SASS)
    'postcss-nested': {
      // Configuración para manejar selectores anidados
      bubble: ['screen'],
      // Preservar selectores vacíos
      preserveEmpty: true
    },

    // Tailwind CSS - Framework de utilidades CSS
    'tailwindcss': {
      // La configuración se lee desde tailwind.config.js
      config: './tailwind.config.js'
    },

    // Autoprefixer - Añade prefijos de navegador automáticamente
    'autoprefixer': {
      // Configuración de navegadores soportados
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11'
      ],
      // Habilitar grid layout con prefijos
      grid: 'autoplace',
      // Flexbox con prefijos legacy
      flexbox: 'no-2009',
      // Remover prefijos obsoletos
      remove: true
    },

    // Plugin para variables CSS personalizadas (desarrollo)
    ...(process.env.NODE_ENV === 'development' && {
      'postcss-custom-properties': {
        // Preservar variables CSS nativas
        preserve: true,
        // Importar variables desde archivos
        importFrom: [
          'src/styles/variables.css'
        ]
      }
    }),

    // Plugin para optimización en producción
    ...(process.env.NODE_ENV === 'production' && {
      // Minificar CSS en producción
      'cssnano': {
        preset: ['advanced', {
          // Configuración de optimización
          discardComments: {
            removeAll: true
          },
          // Normalizar URLs
          normalizeUrl: false,
          // Reducir transforms
          reduceTransforms: true,
          // Mergear reglas duplicadas
          mergeRules: true,
          // Minificar selectores
          minifySelectors: true,
          // Optimizar font-weight
          minifyFontValues: true,
          // Convertir valores a formas más cortas
          convertValues: true,
          // Remover duplicados
          uniqueSelectors: true,
          // Configuraciones específicas para Tailwind
          reduceIdents: false,
          zindex: false
        }]
      }
    }),

    // Plugin para purgar CSS no utilizado (solo en producción)
    ...(process.env.NODE_ENV === 'production' && {
      '@fullhuman/postcss-purgecss': {
        // Archivos a analizar para detectar clases utilizadas
        content: [
          './src/**/*.{js,jsx,ts,tsx}',
          './public/index.html',
          './node_modules/@radix-ui/**/*.{js,jsx}',
          './node_modules/lucide-react/**/*.{js,jsx}'
        ],
        // Configuración de extracción de clases
        defaultExtractor: content => {
          // Extraer clases de Tailwind CSS
          const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
          // Extraer clases con dos puntos (hover:, focus:, etc.)
          const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
          return broadMatches.concat(innerMatches);
        },
        // Clases a preservar siempre
        safelist: {
          standard: [
            // Clases dinámicas que pueden no ser detectadas
            /^(bg|text|border|ring)-(red|green|blue|yellow|purple|pink|indigo)-(50|100|200|300|400|500|600|700|800|900)$/,
            // Clases de animación
            /^animate-/,
            // Clases de Framer Motion
            /^motion-/,
            // Clases de componentes específicos
            'leaflet-container',
            'leaflet-control',
            'leaflet-popup',
            'leaflet-marker',
            // Clases de Spline
            'spline-container',
            'spline-canvas',
            // Clases de React Day Picker
            'rdp-',
            // Clases de React Select
            'react-select',
            // Clases de toasts y notificaciones
            'toast',
            'notification'
          ],
          deep: [
            // Selectores profundos para librerías externas
            /leaflet-/,
            /spline-/,
            /rdp-/,
            /react-select/
          ],
          greedy: [
            // Patrones greedy para clases dinámicas
            /data-/,
            /aria-/
          ]
        },
        // Eliminar comentarios CSS
        fontFace: true,
        keyframes: true,
        variables: true
      }
    }),

    // Plugin para análisis de CSS (solo en desarrollo con flag)
    ...(process.env.NODE_ENV === 'development' && process.env.ANALYZE_CSS && {
      'postcss-reporter': {
        clearReportedMessages: true,
        throwError: false
      }
    })
  },

  // Configuración global de PostCSS
  parser: 'postcss-scss', // Soporte para sintaxis SCSS si es necesario
  
  // Configuración de source maps
  map: process.env.NODE_ENV === 'development' ? {
    inline: false,
    annotation: true,
    sourcesContent: true
  } : false,

  // Configuración de procesamiento
  from: undefined, // Evita warnings en algunos casos
  to: undefined    // Evita warnings en algunos casos
};