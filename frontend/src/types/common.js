/**
 * Definiciones de tipos, esquemas y constantes comunes
 * Sistema de gestión de bovinos - Elementos compartidos en todo el sistema
 */

// =============================================
// CONSTANTES GENERALES
// =============================================

/**
 * Estados de respuesta general
 */
export const RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading'
};

/**
 * Estados de actividad/activo
 */
export const ACTIVITY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  ARCHIVED: 'archived',
  DELETED: 'deleted'
};

/**
 * Niveles de prioridad
 */
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
  CRITICAL: 'critical'
};

/**
 * Tipos de notificación
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  SYSTEM: 'system',
  REMINDER: 'reminder',
  ALERT: 'alert'
};

/**
 * Formatos de fecha comunes
 */
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  MEDIUM: 'DD MMM YYYY',
  LONG: 'DD [de] MMMM [de] YYYY',
  DATETIME: 'DD/MM/YYYY HH:mm',
  DATETIME_LONG: 'DD [de] MMMM [de] YYYY [a las] HH:mm',
  TIME: 'HH:mm',
  TIME_WITH_SECONDS: 'HH:mm:ss',
  ISO: 'YYYY-MM-DD',
  ISO_DATETIME: 'YYYY-MM-DDTHH:mm:ss'
};

/**
 * Unidades de medida
 */
export const MEASUREMENT_UNITS = {
  // Peso
  WEIGHT: {
    KG: 'kg',
    LB: 'lb',
    TON: 'ton',
    G: 'g'
  },
  // Distancia
  DISTANCE: {
    M: 'm',
    KM: 'km',
    CM: 'cm',
    MM: 'mm',
    FT: 'ft',
    IN: 'in'
  },
  // Volumen
  VOLUME: {
    L: 'l',
    ML: 'ml',
    GAL: 'gal',
    M3: 'm³'
  },
  // Área
  AREA: {
    M2: 'm²',
    HA: 'ha',
    KM2: 'km²',
    FT2: 'ft²'
  },
  // Temperatura
  TEMPERATURE: {
    C: '°C',
    F: '°F',
    K: 'K'
  }
};

/**
 * Monedas soportadas
 */
export const CURRENCIES = {
  MXN: {
    code: 'MXN',
    symbol: '$',
    name: 'Peso Mexicano',
    decimals: 2
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'Dólar Estadounidense',
    decimals: 2
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimals: 2
  }
};

/**
 * Tipos de archivo permitidos
 */
export const FILE_TYPES = {
  IMAGES: {
    JPEG: 'image/jpeg',
    PNG: 'image/png',
    WEBP: 'image/webp',
    GIF: 'image/gif',
    SVG: 'image/svg+xml'
  },
  DOCUMENTS: {
    PDF: 'application/pdf',
    DOC: 'application/msword',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    XLS: 'application/vnd.ms-excel',
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    TXT: 'text/plain'
  },
  VIDEOS: {
    MP4: 'video/mp4',
    MOV: 'video/quicktime',
    AVI: 'video/x-msvideo',
    WEBM: 'video/webm'
  }
};

/**
 * Límites de archivo
 */
export const FILE_LIMITS = {
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_WIDTH: 3000,
    MAX_HEIGHT: 3000,
    THUMBNAIL_SIZE: 200
  },
  DOCUMENT: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
  },
  VIDEO: {
    MAX_SIZE: 100 * 1024 * 1024, // 100MB
    MAX_DURATION: 300 // 5 minutos
  }
};

/**
 * Estados geográficos de México (principales para el sistema)
 */
export const MEXICO_STATES = {
  1: 'Aguascalientes',
  2: 'Baja California',
  3: 'Baja California Sur',
  4: 'Campeche',
  5: 'Chiapas',
  6: 'Chihuahua',
  7: 'Ciudad de México',
  8: 'Coahuila',
  9: 'Colima',
  10: 'Durango',
  11: 'Guanajuato',
  12: 'Guerrero',
  13: 'Hidalgo',
  14: 'Jalisco',
  15: 'México',
  16: 'Michoacán',
  17: 'Morelos',
  18: 'Nayarit',
  19: 'Nuevo León',
  20: 'Oaxaca',
  21: 'Puebla',
  22: 'Querétaro',
  23: 'Quintana Roo',
  24: 'San Luis Potosí',
  25: 'Sinaloa',
  26: 'Sonora',
  27: 'Tabasco',
  28: 'Tamaulipas',
  29: 'Tlaxcala',
  30: 'Veracruz',
  31: 'Yucatán',
  32: 'Zacatecas'
};

// =============================================
// ESQUEMAS DE VALIDACIÓN COMUNES
// =============================================

/**
 * Validaciones para campos comunes
 */
export const COMMON_VALIDATIONS = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Debe ser un email válido'
  },
  phone: {
    pattern: /^(\+52|52)?\s?(\d{2,3})?\s?\d{3,4}\s?\d{4}$/,
    message: 'Formato de teléfono inválido (ej: +52 55 1234 5678)'
  },
  postalCode: {
    pattern: /^\d{5}$/,
    message: 'Código postal debe tener 5 dígitos'
  },
  uuid: {
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    message: 'Debe ser un ID válido'
  },
  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    minLength: 8,
    message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo'
  },
  currency: {
    pattern: /^\d+(\.\d{1,2})?$/,
    message: 'Formato de moneda inválido (ej: 123.45)'
  },
  percentage: {
    pattern: /^(100|[0-9]?[0-9])(\.\d{1,2})?$/,
    message: 'Porcentaje debe estar entre 0 y 100'
  },
  coordinates: {
    latitude: {
      min: -90,
      max: 90,
      message: 'Latitud debe estar entre -90 y 90 grados'
    },
    longitude: {
      min: -180,
      max: 180,
      message: 'Longitud debe estar entre -180 y 180 grados'
    }
  }
};

/**
 * Esquema base para paginación
 */
export const PAGINATION_SCHEMA = {
  page: {
    required: false,
    type: 'number',
    min: 1,
    default: 1,
    message: 'Página debe ser un número positivo'
  },
  limit: {
    required: false,
    type: 'number',
    min: 1,
    max: 100,
    default: 12,
    message: 'Límite debe estar entre 1 y 100'
  },
  sortBy: {
    required: false,
    type: 'string',
    default: 'fecha_creacion',
    message: 'Campo de ordenamiento inválido'
  },
  sortOrder: {
    required: false,
    type: 'string',
    enum: ['asc', 'desc'],
    default: 'desc',
    message: 'Orden debe ser asc o desc'
  }
};

/**
 * Esquema base para filtros de fecha
 */
export const DATE_FILTER_SCHEMA = {
  fecha_inicio: {
    required: false,
    type: 'date',
    message: 'Fecha de inicio inválida'
  },
  fecha_fin: {
    required: false,
    type: 'date',
    message: 'Fecha de fin inválida'
  }
};

/**
 * Esquema base para filtros de ubicación
 */
export const LOCATION_FILTER_SCHEMA = {
  estado_id: {
    required: false,
    type: 'number',
    min: 1,
    message: 'Estado inválido'
  },
  municipio: {
    required: false,
    type: 'string',
    maxLength: 100,
    message: 'Municipio inválido'
  },
  radio_km: {
    required: false,
    type: 'number',
    min: 0.1,
    max: 100,
    message: 'Radio debe estar entre 0.1 y 100 km'
  }
};

/**
 * Esquema base para archivos
 */
export const FILE_UPLOAD_SCHEMA = {
  files: {
    required: false,
    type: 'array',
    maxItems: 10,
    message: 'Máximo 10 archivos permitidos'
  },
  maxSize: {
    type: 'number',
    default: FILE_LIMITS.IMAGE.MAX_SIZE,
    message: 'Archivo demasiado grande'
  },
  allowedTypes: {
    type: 'array',
    default: Object.values(FILE_TYPES.IMAGES),
    message: 'Tipo de archivo no permitido'
  }
};

// =============================================
// DEFINICIONES DE TIPOS DE DATOS
// =============================================

/**
 * Tipo base para respuestas de API
 */
export const API_RESPONSE_TYPE = {
  success: 'boolean',
  message: 'string',
  data: 'any',
  errors: 'array?',
  metadata: {
    timestamp: 'datetime',
    requestId: 'string?',
    version: 'string?'
  }
};

/**
 * Tipo base para paginación
 */
export const PAGINATION_TYPE = {
  currentPage: 'number',
  totalPages: 'number',
  totalItems: 'number',
  itemsPerPage: 'number',
  hasNextPage: 'boolean',
  hasPreviousPage: 'boolean',
  nextPage: 'number?',
  previousPage: 'number?'
};

/**
 * Tipo base para filtros
 */
export const FILTER_TYPE = {
  field: 'string',
  value: 'any',
  operator: 'string', // 'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'in', 'between'
  type: 'string' // 'string', 'number', 'date', 'boolean'
};

/**
 * Tipo base para ordenamiento
 */
export const SORT_TYPE = {
  field: 'string',
  direction: 'string', // 'asc', 'desc'
  priority: 'number?' // Para ordenamiento múltiple
};

/**
 * Tipo base para coordenadas geográficas
 */
export const COORDINATES_TYPE = {
  latitude: 'number',
  longitude: 'number',
  accuracy: 'number?',
  altitude: 'number?',
  timestamp: 'datetime?'
};

/**
 * Tipo base para dirección
 */
export const ADDRESS_TYPE = {
  street: 'string?',
  number: 'string?',
  neighborhood: 'string?',
  city: 'string',
  state: 'string',
  country: 'string',
  postalCode: 'string?',
  coordinates: 'COORDINATES_TYPE?'
};

/**
 * Tipo base para información de contacto
 */
export const CONTACT_INFO_TYPE = {
  name: 'string',
  email: 'string?',
  phone: 'string?',
  address: 'ADDRESS_TYPE?',
  notes: 'string?'
};

/**
 * Tipo base para archivo subido
 */
export const UPLOADED_FILE_TYPE = {
  id: 'string',
  originalName: 'string',
  fileName: 'string',
  filePath: 'string',
  url: 'string',
  thumbnailUrl: 'string?',
  mimeType: 'string',
  size: 'number',
  dimensions: {
    width: 'number?',
    height: 'number?'
  },
  metadata: 'object?',
  uploadedAt: 'datetime',
  uploadedBy: 'string'
};

/**
 * Tipo base para metadatos de auditoría
 */
export const AUDIT_METADATA_TYPE = {
  createdAt: 'datetime',
  createdBy: 'string',
  updatedAt: 'datetime?',
  updatedBy: 'string?',
  deletedAt: 'datetime?',
  deletedBy: 'string?',
  version: 'number',
  isActive: 'boolean'
};

/**
 * Tipo base para notificación
 */
export const NOTIFICATION_TYPE = {
  id: 'string',
  type: 'string', // NOTIFICATION_TYPES
  title: 'string',
  message: 'string',
  data: 'object?',
  recipientId: 'string',
  isRead: 'boolean',
  priority: 'string', // PRIORITY_LEVELS
  expiresAt: 'datetime?',
  createdAt: 'datetime'
};

// =============================================
// CONFIGURACIONES COMUNES
// =============================================

/**
 * Configuración de paginación por defecto
 */
export const DEFAULT_PAGINATION_CONFIG = {
  pageSize: 12,
  maxPageSize: 100,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: true,
  pageSizeOptions: ['12', '24', '48', '96']
};

/**
 * Configuración de tablas por defecto
 */
export const DEFAULT_TABLE_CONFIG = {
  striped: true,
  bordered: false,
  hover: true,
  responsive: true,
  sticky: false,
  sortable: true,
  filterable: true,
  exportable: true,
  selectable: false,
  compact: false
};

/**
 * Configuración de formularios por defecto
 */
export const DEFAULT_FORM_CONFIG = {
  validateOnChange: true,
  validateOnBlur: true,
  autoComplete: 'off',
  showRequired: true,
  showOptional: false,
  resetOnSubmit: false,
  confirmBeforeReset: true,
  saveOnChange: false,
  autoSave: false,
  autoSaveInterval: 30000 // 30 segundos
};

/**
 * Configuración de geolocalización por defecto
 */
export const DEFAULT_GEOLOCATION_CONFIG = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 60000,
  minAccuracy: 100, // metros
  trackingEnabled: false,
  trackingInterval: 30000,
  saveTrackingData: true,
  showOnMap: true,
  defaultZoom: 15,
  mapProvider: 'leaflet' // 'leaflet', 'google', 'mapbox'
};

/**
 * Configuración de notificaciones por defecto
 */
export const DEFAULT_NOTIFICATION_CONFIG = {
  position: 'top-right',
  duration: 5000,
  closable: true,
  pauseOnHover: true,
  showIcon: true,
  showProgress: true,
  maxNotifications: 5,
  stackable: true,
  soundEnabled: true,
  vibrationEnabled: false
};

/**
 * Configuración de validación por defecto
 */
export const DEFAULT_VALIDATION_CONFIG = {
  showErrors: true,
  showWarnings: true,
  realTimeValidation: true,
  strictMode: false,
  customMessages: true,
  highlightErrors: true,
  scrollToError: true,
  focusOnError: true
};

// =============================================
// CONSTANTES DE INTERFAZ DE USUARIO
// =============================================

/**
 * Tamaños de componentes
 */
export const COMPONENT_SIZES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl'
};

/**
 * Variantes de color para componentes
 */
export const COLOR_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  LIGHT: 'light',
  DARK: 'dark',
  MUTED: 'muted'
};

/**
 * Breakpoints responsivos
 */
export const BREAKPOINTS = {
  XS: '0px',
  SM: '576px',
  MD: '768px',
  LG: '992px',
  XL: '1200px',
  XXL: '1400px'
};

/**
 * Z-index layers
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080
};

// =============================================
// UTILIDADES Y HELPERS
// =============================================

/**
 * Función para validar email
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  return COMMON_VALIDATIONS.email.pattern.test(email);
};

/**
 * Función para validar teléfono mexicano
 * @param {string} phone - Teléfono a validar
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  return COMMON_VALIDATIONS.phone.pattern.test(phone);
};

/**
 * Función para validar UUID
 * @param {string} uuid - UUID a validar
 * @returns {boolean}
 */
export const isValidUUID = (uuid) => {
  return COMMON_VALIDATIONS.uuid.pattern.test(uuid);
};

/**
 * Función para validar coordenadas
 * @param {number} lat - Latitud
 * @param {number} lng - Longitud
 * @returns {boolean}
 */
export const isValidCoordinates = (lat, lng) => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

/**
 * Función para formatear moneda
 * @param {number} amount - Cantidad
 * @param {string} currency - Código de moneda
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'MXN') => {
  if (!amount && amount !== 0) return '';
  
  const config = CURRENCIES[currency] || CURRENCIES.MXN;
  
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals
  }).format(amount);
};

/**
 * Función para formatear números
 * @param {number} number - Número a formatear
 * @param {number} decimals - Decimales a mostrar
 * @returns {string}
 */
export const formatNumber = (number, decimals = 0) => {
  if (!number && number !== 0) return '';
  
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

/**
 * Función para formatear porcentaje
 * @param {number} value - Valor entre 0 y 1
 * @param {number} decimals - Decimales a mostrar
 * @returns {string}
 */
export const formatPercentage = (value, decimals = 1) => {
  if (!value && value !== 0) return '';
  
  return new Intl.NumberFormat('es-MX', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Función para truncar texto
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo a agregar
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Función para generar ID único
 * @param {string} prefix - Prefijo opcional
 * @returns {string}
 */
export const generateId = (prefix = '') => {
  const id = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}_${id}` : id;
};

/**
 * Función para obtener tipo de archivo por extensión
 * @param {string} filename - Nombre del archivo
 * @returns {string}
 */
export const getFileTypeByExtension = (filename) => {
  if (!filename) return 'unknown';
  
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const documentExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'];
  const videoExts = ['mp4', 'mov', 'avi', 'webm'];
  
  if (imageExts.includes(extension)) return 'image';
  if (documentExts.includes(extension)) return 'document';
  if (videoExts.includes(extension)) return 'video';
  
  return 'unknown';
};

/**
 * Función para validar tamaño de archivo
 * @param {File} file - Archivo a validar
 * @param {number} maxSize - Tamaño máximo en bytes
 * @returns {boolean}
 */
export const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

/**
 * Función para validar tipo de archivo
 * @param {File} file - Archivo a validar
 * @param {Array} allowedTypes - Tipos permitidos
 * @returns {boolean}
 */
export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

/**
 * Función para calcular distancia entre coordenadas (fórmula de Haversine)
 * @param {number} lat1 - Latitud 1
 * @param {number} lng1 - Longitud 1
 * @param {number} lat2 - Latitud 2
 * @param {number} lng2 - Longitud 2
 * @returns {number} - Distancia en kilómetros
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

/**
 * Función auxiliar para convertir grados a radianes
 * @param {number} degrees - Grados
 * @returns {number} - Radianes
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Función para debounce (retrasar ejecución)
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Retraso en ms
 * @returns {Function}
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Función para throttle (limitar ejecución)
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite en ms
 * @returns {Function}
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// =============================================
// MENSAJES COMUNES
// =============================================

/**
 * Mensajes de error comunes
 */
export const COMMON_ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es requerido',
  INVALID_FORMAT: 'Formato inválido',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PHONE: 'Teléfono inválido',
  INVALID_DATE: 'Fecha inválida',
  INVALID_NUMBER: 'Número inválido',
  INVALID_URL: 'URL inválida',
  TOO_SHORT: 'Demasiado corto',
  TOO_LONG: 'Demasiado largo',
  OUT_OF_RANGE: 'Fuera de rango',
  NETWORK_ERROR: 'Error de conexión',
  SERVER_ERROR: 'Error del servidor',
  PERMISSION_DENIED: 'Permisos insuficientes',
  NOT_FOUND: 'No encontrado',
  ALREADY_EXISTS: 'Ya existe',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  SESSION_EXPIRED: 'Sesión expirada',
  FILE_TOO_LARGE: 'Archivo demasiado grande',
  INVALID_FILE_TYPE: 'Tipo de archivo no válido',
  UPLOAD_FAILED: 'Error al subir archivo'
};

/**
 * Mensajes de éxito comunes
 */
export const COMMON_SUCCESS_MESSAGES = {
  SAVED: 'Guardado exitosamente',
  UPDATED: 'Actualizado correctamente',
  DELETED: 'Eliminado correctamente',
  CREATED: 'Creado exitosamente',
  UPLOADED: 'Subido exitosamente',
  SENT: 'Enviado correctamente',
  IMPORTED: 'Importado exitosamente',
  EXPORTED: 'Exportado exitosamente',
  COPIED: 'Copiado al portapapeles',
  SYNCHRONIZED: 'Sincronizado correctamente'
};

export default {
  RESPONSE_STATUS,
  ACTIVITY_STATUS,
  PRIORITY_LEVELS,
  NOTIFICATION_TYPES,
  DATE_FORMATS,
  MEASUREMENT_UNITS,
  CURRENCIES,
  FILE_TYPES,
  FILE_LIMITS,
  MEXICO_STATES,
  COMMON_VALIDATIONS,
  PAGINATION_SCHEMA,
  DATE_FILTER_SCHEMA,
  LOCATION_FILTER_SCHEMA,
  FILE_UPLOAD_SCHEMA,
  API_RESPONSE_TYPE,
  PAGINATION_TYPE,
  FILTER_TYPE,
  SORT_TYPE,
  COORDINATES_TYPE,
  ADDRESS_TYPE,
  CONTACT_INFO_TYPE,
  UPLOADED_FILE_TYPE,
  AUDIT_METADATA_TYPE,
  NOTIFICATION_TYPE,
  DEFAULT_PAGINATION_CONFIG,
  DEFAULT_TABLE_CONFIG,
  DEFAULT_FORM_CONFIG,
  DEFAULT_GEOLOCATION_CONFIG,
  DEFAULT_NOTIFICATION_CONFIG,
  DEFAULT_VALIDATION_CONFIG,
  COMPONENT_SIZES,
  COLOR_VARIANTS,
  BREAKPOINTS,
  Z_INDEX,
  isValidEmail,
  isValidPhone,
  isValidUUID,
  isValidCoordinates,
  formatCurrency,
  formatNumber,
  formatPercentage,
  truncateText,
  generateId,
  getFileTypeByExtension,
  validateFileSize,
  validateFileType,
  calculateDistance,
  debounce,
  throttle,
  COMMON_ERROR_MESSAGES,
  COMMON_SUCCESS_MESSAGES
};