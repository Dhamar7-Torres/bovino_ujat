/**
 * Constantes generales del sistema
 * Sistema de gestión de bovinos - Valores constantes utilizados en toda la aplicación
 */

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'Sistema de Gestión de Bovinos',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema integral para la gestión de ranchos ganaderos',
  COMPANY: 'Gestión Ganadera Pro',
  COPYRIGHT: '© 2025 Gestión Ganadera Pro. Todos los derechos reservados.',
  SUPPORT_EMAIL: 'soporte@gestionganaderapro.com',
  WEBSITE: 'https://www.gestionganaderapro.com'
};

// URLs de la API
export const API_ENDPOINTS = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  AUTH: '/auth',
  BOVINES: '/bovines',
  RANCHES: '/ranches',
  PRODUCTION: '/production',
  HEALTH: '/health',
  REPRODUCTION: '/reproduction',
  INVENTORY: '/inventory',
  EVENTS: '/events',
  FINANCES: '/finances',
  REPORTS: '/reports',
  LOCATIONS: '/locations',
  USERS: '/users',
  NOTIFICATIONS: '/notifications'
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1
};

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_SPREADSHEET_TYPES: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  MAX_IMAGES_PER_BOVINE: 5,
  THUMBNAIL_SIZE: { width: 150, height: 150 },
  PREVIEW_SIZE: { width: 400, height: 400 }
};

// Configuración de fechas
export const DATE_CONFIG = {
  DEFAULT_FORMAT: 'dd/MM/yyyy',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
  TIME_FORMAT: 'HH:mm',
  API_FORMAT: 'yyyy-MM-dd',
  API_DATETIME_FORMAT: 'yyyy-MM-dd HH:mm:ss',
  LOCALE: 'es-MX'
};

// Configuración de mapas
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 20.5888, lng: -100.3899 }, // Querétaro, México
  DEFAULT_ZOOM: 10,
  MAX_ZOOM: 18,
  MIN_ZOOM: 5,
  TILE_LAYER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '© OpenStreetMap contributors',
  MARKER_COLORS: {
    ranch: '#3B82F6',
    bovine: '#10B981',
    event: '#F59E0B',
    health: '#EF4444',
    production: '#8B5CF6'
  }
};

// Estados de la aplicación
export const APP_STATES = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  IDLE: 'idle',
  SUBMITTING: 'submitting'
};

// Tipos de notificaciones
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000, // 5 segundos
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 8000,
  WARNING_DURATION: 6000,
  MAX_NOTIFICATIONS: 5,
  POSITION: 'top-right'
};

// Roles de usuario
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  VETERINARIAN: 'veterinarian',
  TECHNICIAN: 'technician',
  EMPLOYEE: 'employee',
  VIEWER: 'viewer'
};

// Permisos del sistema
export const PERMISSIONS = {
  // Bovinos
  VIEW_BOVINES: 'view_bovines',
  CREATE_BOVINES: 'create_bovines',
  EDIT_BOVINES: 'edit_bovines',
  DELETE_BOVINES: 'delete_bovines',
  
  // Ranchos
  VIEW_RANCHES: 'view_ranches',
  CREATE_RANCHES: 'create_ranches',
  EDIT_RANCHES: 'edit_ranches',
  DELETE_RANCHES: 'delete_ranches',
  
  // Producción
  VIEW_PRODUCTION: 'view_production',
  CREATE_PRODUCTION: 'create_production',
  EDIT_PRODUCTION: 'edit_production',
  DELETE_PRODUCTION: 'delete_production',
  
  // Salud
  VIEW_HEALTH: 'view_health',
  CREATE_HEALTH: 'create_health',
  EDIT_HEALTH: 'edit_health',
  DELETE_HEALTH: 'delete_health',
  
  // Reportes
  VIEW_REPORTS: 'view_reports',
  CREATE_REPORTS: 'create_reports',
  EXPORT_REPORTS: 'export_reports',
  
  // Sistema
  MANAGE_USERS: 'manage_users',
  SYSTEM_CONFIG: 'system_config',
  VIEW_LOGS: 'view_logs'
};

// Configuración de validación
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  DESCRIPTION_MAX_LENGTH: 500,
  NOTES_MAX_LENGTH: 1000
};

// Configuración de colores del tema
export const THEME_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  neutral: '#6B7280',
  success: '#22C55E',
  warning: '#F97316',
  error: '#EF4444',
  info: '#06B6D4',
  
  // Colores de fondo
  background: '#FFFFFF',
  surface: '#F9FAFB',
  card: '#FFFFFF',
  
  // Colores de texto
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  
  // Colores de borde
  border: '#E5E7EB',
  divider: '#F3F4F6'
};

// Tamaños de pantalla para responsive design
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  DEFAULT_DURATION: 300,
  FAST_DURATION: 150,
  SLOW_DURATION: 500,
  EASING: 'ease-in-out',
  
  // Variantes de Framer Motion
  FADE_IN: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  
  SLIDE_UP: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  
  SLIDE_DOWN: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  
  SCALE_IN: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  }
};

// Configuración de localStorage
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  PREFERENCES: 'user_preferences',
  FILTERS: 'saved_filters',
  DASHBOARD_LAYOUT: 'dashboard_layout'
};

// Configuración de idiomas
export const LANGUAGES = {
  ES: {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸'
  },
  EN: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  },
  PT: {
    code: 'pt',
    name: 'Português',
    flag: '🇧🇷'
  }
};

// Configuración de monedas
export const CURRENCIES = {
  MXN: {
    code: 'MXN',
    symbol: '$',
    name: 'Peso Mexicano',
    locale: 'es-MX'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'Dólar Americano',
    locale: 'en-US'
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'es-ES'
  }
};

// Configuración de unidades de medida
export const MEASUREMENT_UNITS = {
  weight: {
    kg: { symbol: 'kg', name: 'Kilogramos', factor: 1 },
    lb: { symbol: 'lb', name: 'Libras', factor: 2.20462 },
    g: { symbol: 'g', name: 'Gramos', factor: 1000 }
  },
  volume: {
    l: { symbol: 'L', name: 'Litros', factor: 1 },
    gal: { symbol: 'gal', name: 'Galones', factor: 0.264172 },
    ml: { symbol: 'ml', name: 'Mililitros', factor: 1000 }
  },
  area: {
    ha: { symbol: 'ha', name: 'Hectáreas', factor: 1 },
    m2: { symbol: 'm²', name: 'Metros cuadrados', factor: 10000 },
    acre: { symbol: 'acre', name: 'Acres', factor: 2.47105 }
  },
  temperature: {
    c: { symbol: '°C', name: 'Celsius', factor: 1 },
    f: { symbol: '°F', name: 'Fahrenheit', factor: 1.8, offset: 32 }
  }
};

// Configuración de límites del sistema
export const SYSTEM_LIMITS = {
  MAX_BOVINES_PER_RANCH: 10000,
  MAX_RANCHES_PER_USER: 50,
  MAX_USERS_PER_RANCH: 100,
  MAX_EVENTS_PER_DAY: 1000,
  MAX_PRODUCTION_RECORDS_PER_DAY: 500,
  MAX_HEALTH_RECORDS_PER_BOVINE: 1000,
  
  // Límites de exportación
  MAX_EXPORT_RECORDS: 50000,
  MAX_REPORT_SIZE_MB: 100,
  
  // Límites de API
  API_RATE_LIMIT: 1000, // requests per hour
  API_BURST_LIMIT: 100 // requests per minute
};

// Configuración de formatos de exportación
export const EXPORT_FORMATS = {
  PDF: {
    extension: 'pdf',
    mimeType: 'application/pdf',
    name: 'PDF Document'
  },
  EXCEL: {
    extension: 'xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    name: 'Excel Spreadsheet'
  },
  CSV: {
    extension: 'csv',
    mimeType: 'text/csv',
    name: 'CSV File'
  },
  JSON: {
    extension: 'json',
    mimeType: 'application/json',
    name: 'JSON File'
  }
};

// Configuración de intervalos de actualización
export const REFRESH_INTERVALS = {
  DASHBOARD: 30000,    // 30 segundos
  NOTIFICATIONS: 60000, // 1 minuto
  EVENTS: 120000,      // 2 minutos
  PRODUCTION: 300000,  // 5 minutos
  REPORTS: 600000      // 10 minutos
};

// Mensajes del sistema
export const SYSTEM_MESSAGES = {
  LOADING: 'Cargando...',
  SAVING: 'Guardando...',
  DELETING: 'Eliminando...',
  SUCCESS: 'Operación exitosa',
  ERROR: 'Ha ocurrido un error',
  NO_DATA: 'No hay datos disponibles',
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'Acceso denegado',
  NOT_FOUND: 'Recurso no encontrado',
  CONNECTION_ERROR: 'Error de conexión',
  TIMEOUT: 'Tiempo de espera agotado'
};

// Configuración de desarrollo
export const DEV_CONFIG = {
  ENABLE_LOGGER: process.env.NODE_ENV === 'development',
  ENABLE_REDUX_DEVTOOLS: process.env.NODE_ENV === 'development',
  API_TIMEOUT: 30000,
  MOCK_DATA: process.env.REACT_APP_USE_MOCK_DATA === 'true',
  DEBUG_MODE: process.env.REACT_APP_DEBUG === 'true'
};

// Exportar todas las constantes como objeto por defecto
export default {
  APP_CONFIG,
  API_ENDPOINTS,
  PAGINATION,
  FILE_CONFIG,
  DATE_CONFIG,
  MAP_CONFIG,
  APP_STATES,
  NOTIFICATION_TYPES,
  NOTIFICATION_CONFIG,
  USER_ROLES,
  PERMISSIONS,
  VALIDATION_RULES,
  THEME_COLORS,
  BREAKPOINTS,
  ANIMATION_CONFIG,
  STORAGE_KEYS,
  LANGUAGES,
  CURRENCIES,
  MEASUREMENT_UNITS,
  SYSTEM_LIMITS,
  EXPORT_FORMATS,
  REFRESH_INTERVALS,
  SYSTEM_MESSAGES,
  DEV_CONFIG
};