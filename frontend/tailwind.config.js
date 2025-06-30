/**
 * tailwind.config.js - Configuración de Tailwind CSS para el sistema de gestión de bovinos
 * Configuración personalizada con tema específico, componentes y utilidades
 */

import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  // Habilitar modo dark con estrategia de clase
  darkMode: ["class"],
  
  // Archivos donde buscar clases de Tailwind
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/lib/**/*.{js,jsx,ts,tsx}',
    // Incluir componentes de ShadCN UI y librerías externas
    './node_modules/@radix-ui/**/*.{js,jsx}',
    './node_modules/lucide-react/**/*.{js,jsx}',
    './node_modules/react-day-picker/**/*.{js,jsx}',
  ],
  
  // Prefijo para clases CSS (opcional)
  prefix: "",
  
  theme: {
    // Configuración de container responsivo
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    
    extend: {
      // Paleta de colores personalizada para el sistema de bovinos
      colors: {
        // Colores del sistema de branding
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        
        // Colores específicos para tipos de bovinos
        bovine: {
          // Colores para diferentes razas
          holstein: '#000000',
          jersey: '#d97706',
          brahman: '#dc2626',
          angus: '#1f2937',
          charolais: '#f3f4f6',
          // Estados de salud
          healthy: '#16a34a',
          sick: '#dc2626',
          recovering: '#f59e0b',
          vaccinated: '#3b82f6',
        },
        
        // Colores para producción
        production: {
          milk: '#3b82f6',
          meat: '#ef4444',
          breeding: '#f59e0b',
          mixed: '#10b981',
        },
        
        // Colores para mapas y geolocalización
        location: {
          ranch: '#16a34a',
          pasture: '#84cc16',
          barn: '#a855f7',
          hospital: '#ef4444',
          feed: '#f59e0b',
        },
        
        // Sistema de colores para ShadCN UI
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      
      // Radio de bordes personalizado
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      // Tipografía personalizada
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
        heading: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      
      // Tamaños de fuente específicos
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      // Espaciado adicional
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      // Animaciones personalizadas
      keyframes: {
        // Animación de entrada suave
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        
        // Animaciones de deslizamiento
        "slide-in-from-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        
        // Animaciones de escalado
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        
        // Animaciones específicas para componentes
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        
        // Animaciones para el dashboard
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        
        // Animación de carga
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        
        // Animación de heartbeat para alertas
        "heartbeat": {
          "0%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.3)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.3)" },
          "70%": { transform: "scale(1)" },
        },
        
        // Animación de bounce suave
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10%)" },
        },
        
        // Animación de shake para errores
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-10px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(10px)" },
        },
      },
      
      // Clases de animación
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.5s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.3s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.3s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "scale-out": "scale-out 0.2s ease-in",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        "heartbeat": "heartbeat 1.5s ease-in-out infinite",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
        "shake": "shake 0.5s ease-in-out",
      },
      
      // Sombras personalizadas
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.05)',
        'hard': '0 10px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.5)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.5)',
      },
      
      // Gradientes personalizados
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-ranch': 'linear-gradient(135deg, #16a34a 0%, #84cc16 100%)',
        'gradient-sky': 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
      },
      
      // Configuración de z-index
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      // Configuración de backdrop blur
      backdropBlur: {
        'xs': '2px',
      },
      
      // Tamaños máximos específicos
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      
      // Alturas específicas para el layout
      height: {
        'screen-minus-header': 'calc(100vh - 4rem)',
        'screen-minus-nav': 'calc(100vh - 8rem)',
      },
      
      // Configuración para aspectos de ratio
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
      },
    },
  },
  
  // Plugins de Tailwind
  plugins: [
    // Plugin para animaciones adicionales
    require("tailwindcss-animate"),
    
    // Plugin para formularios
    require("@tailwindcss/forms")({
      strategy: 'class',
    }),
    
    // Plugin para tipografía
    require("@tailwindcss/typography"),
    
    // Plugin personalizado para utilidades específicas del proyecto
    function({ addUtilities, addComponents, theme }) {
      // Utilidades personalizadas
      addUtilities({
        // Clase para centrar contenido con flexbox
        '.flex-center': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        
        // Clase para texto con elipsis
        '.text-ellipsis-2': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        
        '.text-ellipsis-3': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
        
        // Scrollbar personalizado
        '.scrollbar-thin': {
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme('colors.gray.100'),
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme('colors.gray.400'),
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme('colors.gray.500'),
          },
        },
        
        // Clase para glassmorphism
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      });
      
      // Componentes personalizados
      addComponents({
        // Botón base personalizado
        '.btn-base': {
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme('spacing.2'),
        },
        
        // Tarjeta base
        '.card-base': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.soft'),
          padding: theme('spacing.6'),
        },
        
        // Input base
        '.input-base': {
          padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
          borderRadius: theme('borderRadius.md'),
          border: `1px solid ${theme('colors.gray.300')}`,
          fontSize: theme('fontSize.sm[0]'),
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.brand.500'),
            boxShadow: `0 0 0 3px ${theme('colors.brand.500')}20`,
          },
        },
      });
    },
  ],
};