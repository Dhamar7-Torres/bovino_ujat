/**
 * vite.config.js - Configuración actualizada de Vite para el sistema de gestión de bovinos
 * Configuración optimizada con todas las dependencias y librerías del proyecto
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Configuración principal de Vite
export default defineConfig({
  // Plugin de React con configuración optimizada
  plugins: [
    react({
      // Configuración específica para React con SWC
      include: "**/*.{jsx,tsx}",
      babel: {
        plugins: [
          // Plugin para optimizar re-renders con framer-motion
          ['babel-plugin-auto-import', {
            declarations: [
              { default: 'React', path: 'react' }
            ]
          }]
        ]
      },
      // Configuración para Fast Refresh optimizado
      fastRefresh: true,
      // Configuración para JSX runtime automático
      jsxRuntime: 'automatic'
    })
  ],

  // Configuración de alias para imports más limpios
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@context': resolve(__dirname, './src/context'),
      '@utils': resolve(__dirname, './src/utils'),
      '@styles': resolve(__dirname, './src/styles'),
      '@assets': resolve(__dirname, './src/assets'),
      '@lib': resolve(__dirname, './src/lib'),
      '@types': resolve(__dirname, './src/types'),
      '@api': resolve(__dirname, './src/api'),
      '@config': resolve(__dirname, './src/config'),
      // Alias específicos para componentes principales
      '@common': resolve(__dirname, './src/components/common'),
      '@forms': resolve(__dirname, './src/components/forms'),
      '@charts': resolve(__dirname, './src/components/charts'),
      '@maps': resolve(__dirname, './src/components/maps'),
      '@animations': resolve(__dirname, './src/components/animations'),
      '@ui': resolve(__dirname, './src/components/ui'),
    }
  },

  // Configuración del servidor de desarrollo
  server: {
    port: 5173,
    host: true, // Permite conexiones externas
    cors: true,
    // Configuración de proxy para el API backend
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true, // Soporte para WebSockets
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      // Proxy para uploads de imágenes
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    },
    // HMR (Hot Module Replacement) optimizado
    hmr: {
      overlay: true,
      port: 5174
    },
    // Configuración de headers
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
    }
  },

  // Configuración de construcción para producción
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: process.env.NODE_ENV === 'development', // Source maps solo en desarrollo
    
    // Configuración de minificación
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production', // Eliminar console.log en producción
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      format: {
        comments: false
      }
    },

    // Optimización de chunks más específica
    rollupOptions: {
      output: {
        // Dividir el código en chunks optimizados para el proyecto bovino
        manualChunks: {
          // Chunk principal de React
          'react-core': ['react', 'react-dom'],
          
          // Chunk de enrutamiento
          'router': ['react-router-dom'],
          
          // Chunk de gestión de estado y datos
          'state-management': [
            '@tanstack/react-query',
            '@tanstack/react-query-devtools',
            'zustand',
            'jotai'
          ],
          
          // Chunk completo de ShadCN UI y Radix
          'ui-framework': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-button',
            '@radix-ui/react-calendar',
            '@radix-ui/react-card',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-form',
            '@radix-ui/react-input',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-sheet',
            '@radix-ui/react-switch',
            '@radix-ui/react-table',
            '@radix-ui/react-tabs',
            '@radix-ui/react-textarea',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            'class-variance-authority',
            'clsx',
            'tailwind-merge'
          ],
          
          // Chunk de iconografía
          'icons': ['lucide-react', '@radix-ui/react-icons'],
          
          // Chunk de animaciones y efectos visuales
          'animations': [
            'framer-motion',
            'react-spring',
            'lottie-react',
            'react-countup',
            'react-bits',
            'magic-ui'
          ],
          
          // Chunk específico para mapas y geolocalización
          'maps-geo': [
            'leaflet',
            'react-leaflet'
          ],
          
          // Chunk para modelos 3D y Spline
          '3d-models': [
            '@splinetool/react-spline',
            '@splinetool/runtime'
          ],
          
          // Chunk para gráficos y visualizaciones
          'charts-viz': [
            'recharts',
            'd3',
            'd3-scale'
          ],
          
          // Chunk para formularios y validación
          'forms': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod',
            'react-select',
            'react-datepicker',
            'react-dropzone'
          ],
          
          // Chunk para fechas y utilidades
          'date-utils': [
            'date-fns',
            'react-day-picker'
          ],
          
          // Chunk para notificaciones y feedback
          'notifications': [
            'react-hot-toast',
            'sonner',
            'react-helmet-async'
          ],
          
          // Chunk para utilidades generales
          'utilities': [
            'axios',
            'ky',
            'lodash',
            'ramda',
            'uuid'
          ],
          
          // Chunk para exportación de archivos
          'file-export': [
            'file-saver',
            'html2canvas',
            'jspdf',
            'xlsx'
          ],
          
          // Chunk para drag & drop y layout
          'layout-interaction': [
            'react-beautiful-dnd',
            'react-grid-layout',
            'react-virtualized-auto-sizer',
            'react-window'
          ],
          
          // Chunk para internacionalización
          'i18n': [
            'i18next',
            'react-i18next',
            'i18next-browser-languagedetector'
          ],
          
          // Chunk para QR codes y códigos
          'qr-codes': [
            'react-qr-code',
            'qrcode'
          ],
          
          // Chunk para carousels y sliders
          'carousels': [
            'embla-carousel-react',
            'swiper'
          ]
        },
        
        // Configuración de nombres de archivos
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop().replace(/\.[^/.]+$/, '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(assetInfo.name)) {
            return `media/[name]-[hash][extname]`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      },
      
      // Configuración de externals para optimización
      external: (id) => {
        // Mantener ciertas dependencias como externas si es necesario
        return false;
      }
    },

    // Límite de advertencia para chunks grandes (aumentado para el proyecto)
    chunkSizeWarningLimit: 1000,

    // Configuración de assets
    assetsInlineLimit: 4096, // Inline assets menores a 4kb
    
    // Configuración para el análisis de bundle
    reportCompressedSize: false,
    
    // Configuración de target para compatibilidad
    target: ['es2020', 'chrome80', 'firefox78', 'safari14']
  },

  // Variables de entorno
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString())
  },

  // Configuración de CSS
  css: {
    // Configuración de CSS Modules
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: process.env.NODE_ENV === 'development' 
        ? '[name]__[local]___[hash:base64:5]'
        : '[hash:base64:8]'
    },
    
    // Configuración de PostCSS (se lee automáticamente de postcss.config.js)
    postcss: './postcss.config.js',
    
    // DevSourcemap para CSS en desarrollo
    devSourcemap: process.env.NODE_ENV === 'development',
    
    // Configuración de preprocesadores
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
        charset: false
      }
    }
  },

  // Configuración de optimización de dependencias
  optimizeDeps: {
    include: [
      // Core React
      'react',
      'react-dom',
      'react-router-dom',
      
      // Estado y datos
      '@tanstack/react-query',
      'zustand',
      'jotai',
      
      // UI Framework completo
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-button',
      '@radix-ui/react-calendar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      
      // Iconografía
      'lucide-react',
      '@radix-ui/react-icons',
      
      // Animaciones
      'framer-motion',
      'react-spring',
      'lottie-react',
      
      // Mapas
      'leaflet',
      'react-leaflet',
      
      // Formularios
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
      'react-select',
      'react-datepicker',
      
      // Gráficos
      'recharts',
      'd3',
      
      // Utilidades principales
      'axios',
      'date-fns',
      'lodash',
      'uuid',
      
      // Notificaciones
      'react-hot-toast',
      'sonner'
    ],
    
    exclude: [
      // Excluir dependencias que pueden causar problemas con pre-bundling
      '@splinetool/runtime',
      'react-bits',
      'magic-ui'
    ],
    
    // Configuración de esbuild para optimización
    esbuildOptions: {
      target: 'es2020',
      supported: {
        bigint: true
      }
    }
  },

  // Configuración específica para entorno de testing
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.config.js'
      ]
    }
  },

  // Configuración de preview (para probar build de producción)
  preview: {
    port: 4173,
    host: true,
    cors: true,
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  },

  // Configuración de logging
  logLevel: 'info',
  clearScreen: false,

  // Configuración para PWA (Progressive Web App)
  base: './', // Para deployment en subdirectorios

  // Configuración de worker
  worker: {
    format: 'es',
    plugins: () => []
  },

  // Configuración experimental para optimizaciones futuras
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `./assets/${filename}` };
      }
      return { relative: true };
    }
  },

  // Configuración de JSON
  json: {
    namedExports: true,
    stringify: false
  },

  // Configuración de assets públicos
  publicDir: 'public',
  
  // Configuración de cache
  cacheDir: 'node_modules/.vite'
});