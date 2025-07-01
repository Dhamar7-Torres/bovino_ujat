/** @type {import('tailwindcss').Config} */
export default {
  // Modo de producción para purgar CSS no utilizado
  mode: 'jit',
  
  // Archivos a escanear para clases de Tailwind
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,vue}",
  ],
  
  // Configuración del tema oscuro
  darkMode: 'class', // Usa class strategy en lugar de media query
  
  theme: {
    extend: {
      // Colores personalizados del sistema
      colors: {
        // Colores principales
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        
        // Colores secundarios
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        
        // Colores para bovinos (temática ganadera)
        bovine: {
          brown: '#8B4513',
          cream: '#F5F5DC',
          leather: '#964B00',
          hay: '#DAA520',
          grass: '#228B22',
          milk: '#FFFAF0',
        },
        
        // Colores para estados de salud
        health: {
          excellent: '#10b981',
          good: '#84cc16',
          warning: '#f59e0b',
          critical: '#ef4444',
          unknown: '#6b7280',
        },
        
        // Colores para producción
        production: {
          high: '#059669',
          medium: '#0891b2',
          low: '#dc2626',
          none: '#9ca3af',
        },
      },
      
      // Fuentes personalizadas
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif'],
        'mono': ['"JetBrains Mono"', '"Fira Code"', '"SF Mono"', 'Consolas', '"Liberation Mono"', 'Menlo', 'monospace'],
        'display': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      
      // Espaciado personalizado
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Tamaños de contenedor
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      
      // Configuración de breakpoints responsivos
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        
        // Breakpoints para altura
        'h-sm': { 'raw': '(min-height: 640px)' },
        'h-md': { 'raw': '(min-height: 768px)' },
        'h-lg': { 'raw': '(min-height: 1024px)' },
      },
      
      // Configuración de z-index
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      // Configuración de bordes redondeados
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      
      // Configuración de sombras
      boxShadow: {
        'inner-lg': 'inset 0 10px 15px -3px rgba(0, 0, 0, 0.1), inset 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'smooth': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 15px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 25px rgba(59, 130, 246, 0.4)',
      },
      
      // Configuración de gradientes
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-bovine': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-health': 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        'gradient-production': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      
      // Configuración de animaciones
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'slide-in-down': 'slideInDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-in',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      
      // Configuración de transiciones
      transitionProperty: {
        'spacing': 'margin, padding',
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      
      // Configuración de duración de transiciones
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
        '2000': '2000ms',
      },
      
      // Configuración de timing functions
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      
      // Configuración de backdrop filter
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
    },
  },
  
  // Plugins de Tailwind
  plugins: [
    // Plugin para formularios mejorados
    require('@tailwindcss/forms')({
      strategy: 'class', // Solo aplicar estilos cuando se use la clase 'form-*'
    }),
    
    // Plugin para animaciones personalizadas
    require('tailwindcss-animate'),
    
    // Plugin personalizado para utilidades específicas de la aplicación
    function({ addUtilities, addComponents, theme }) {
      // Utilidades personalizadas
      addUtilities({
        // Centrado perfecto
        '.center-perfect': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        
        // Scroll oculto pero funcional
        '.scroll-hidden': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        
        // Texto con degradado
        '.text-gradient': {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        
        // Glass morphism
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        
        '.glass-dark': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      });
      
      // Componentes personalizados
      addComponents({
        // Card base
        '.card-base': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.sm'),
          border: `1px solid ${theme('colors.gray.200')}`,
          
          '.dark &': {
            backgroundColor: theme('colors.gray.800'),
            borderColor: theme('colors.gray.700'),
          },
        },
        
        // Botón primario personalizado
        '.btn-bovine': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.sm'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          transition: 'all 0.2s ease',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: theme('colors.white'),
          border: 'none',
          cursor: 'pointer',
          
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.lg'),
          },
          
          '&:active': {
            transform: 'translateY(0)',
          },
          
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
            transform: 'none',
          },
        },
        
        // Input personalizado
        '.input-bovine': {
          width: '100%',
          borderRadius: theme('borderRadius.lg'),
          border: `1px solid ${theme('colors.gray.300')}`,
          padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
          fontSize: theme('fontSize.sm'),
          transition: 'all 0.2s ease',
          backgroundColor: theme('colors.white'),
          
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.500'),
            boxShadow: `0 0 0 3px ${theme('colors.primary.100')}`,
          },
          
          '.dark &': {
            backgroundColor: theme('colors.gray.800'),
            borderColor: theme('colors.gray.600'),
            color: theme('colors.white'),
            
            '&:focus': {
              borderColor: theme('colors.primary.400'),
              boxShadow: `0 0 0 3px ${theme('colors.primary.900')}`,
            },
          },
        },
      });
    },
  ],
  
  // Configuración de purge para optimizar el tamaño del CSS en producción
  future: {
    hoverOnlyWhenSupported: true,
  },
  
  // Variables experimentales
  experimental: {
    optimizeUniversalDefaults: true,
  },
}