/**
 * Definiciones de tipos, esquemas y constantes para autenticación
 * Sistema de gestión de bovinos
 */

// =============================================
// CONSTANTES DE AUTENTICACIÓN
// =============================================

/**
 * Roles disponibles en el sistema
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  VETERINARIAN: 'veterinario',
  EMPLOYEE: 'empleado',
  VIEWER: 'viewer'
};

/**
 * Estados de usuario
 */
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
};

/**
 * Tipos de sesión
 */
export const SESSION_TYPES = {
  WEB: 'web',
  MOBILE: 'mobile',
  API: 'api'
};

/**
 * Duración de tokens (en milisegundos)
 */
export const TOKEN_DURATION = {
  ACCESS_TOKEN: 24 * 60 * 60 * 1000, // 24 horas
  REFRESH_TOKEN: 7 * 24 * 60 * 60 * 1000, // 7 días
  REMEMBER_ME: 30 * 24 * 60 * 60 * 1000, // 30 días
  PASSWORD_RESET: 60 * 60 * 1000, // 1 hora
  EMAIL_VERIFICATION: 24 * 60 * 60 * 1000 // 24 horas
};

/**
 * Tipos de acceso/permisos
 */
export const ACCESS_TYPES = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  EXPORT: 'export',
  IMPORT: 'import'
};

/**
 * Recursos del sistema
 */
export const RESOURCES = {
  BOVINES: 'bovines',
  RANCHES: 'ranches',
  HEALTH: 'health',
  PRODUCTION: 'production',
  REPRODUCTION: 'reproduction',
  INVENTORY: 'inventory',
  FINANCES: 'finances',
  EVENTS: 'events',
  REPORTS: 'reports',
  USERS: 'users',
  SETTINGS: 'settings'
};

/**
 * Tipos de eventos de autenticación
 */
export const AUTH_EVENTS = {
  LOGIN: 'auth:login',
  LOGOUT: 'auth:logout',
  REGISTER: 'auth:register',
  TOKEN_REFRESH: 'auth:token_refresh',
  PASSWORD_CHANGE: 'auth:password_change',
  PROFILE_UPDATE: 'auth:profile_update',
  SESSION_EXPIRED: 'auth:session_expired',
  UNAUTHORIZED: 'auth:unauthorized',
  ROLE_CHANGED: 'auth:role_changed'
};

// =============================================
// ESQUEMAS DE VALIDACIÓN
// =============================================

/**
 * Esquema de validación para registro de usuario
 */
export const REGISTER_SCHEMA = {
  email: {
    required: true,
    type: 'email',
    minLength: 5,
    maxLength: 255,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Debe ser un email válido'
  },
  password: {
    required: true,
    type: 'string',
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo'
  },
  confirmPassword: {
    required: true,
    type: 'string',
    mustMatch: 'password',
    message: 'Las contraseñas deben coincidir'
  },
  nombre: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
    message: 'Solo se permiten letras y espacios'
  },
  apellido: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
    message: 'Solo se permiten letras y espacios'
  },
  telefono: {
    required: false,
    type: 'string',
    pattern: /^(\+52|52)?\s?(\d{2,3})?\s?\d{3,4}\s?\d{4}$/,
    message: 'Formato de teléfono inválido (ejemplo: +52 55 1234 5678)'
  },
  rol_id: {
    required: true,
    type: 'number',
    min: 1,
    message: 'Debe seleccionar un rol válido'
  }
};

/**
 * Esquema de validación para login
 */
export const LOGIN_SCHEMA = {
  email: {
    required: true,
    type: 'email',
    message: 'Debe ser un email válido'
  },
  password: {
    required: true,
    type: 'string',
    minLength: 1,
    message: 'La contraseña es requerida'
  },
  rememberMe: {
    required: false,
    type: 'boolean',
    default: false
  }
};

/**
 * Esquema de validación para cambio de contraseña
 */
export const CHANGE_PASSWORD_SCHEMA = {
  currentPassword: {
    required: true,
    type: 'string',
    minLength: 1,
    message: 'La contraseña actual es requerida'
  },
  newPassword: {
    required: true,
    type: 'string',
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo'
  },
  confirmNewPassword: {
    required: true,
    type: 'string',
    mustMatch: 'newPassword',
    message: 'Las contraseñas deben coincidir'
  }
};

/**
 * Esquema de validación para recuperación de contraseña
 */
export const FORGOT_PASSWORD_SCHEMA = {
  email: {
    required: true,
    type: 'email',
    message: 'Debe ser un email válido'
  }
};

/**
 * Esquema de validación para restablecer contraseña
 */
export const RESET_PASSWORD_SCHEMA = {
  token: {
    required: true,
    type: 'string',
    minLength: 1,
    message: 'Token de recuperación requerido'
  },
  newPassword: {
    required: true,
    type: 'string',
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo'
  },
  confirmNewPassword: {
    required: true,
    type: 'string',
    mustMatch: 'newPassword',
    message: 'Las contraseñas deben coincidir'
  }
};

/**
 * Esquema de validación para actualización de perfil
 */
export const UPDATE_PROFILE_SCHEMA = {
  nombre: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
    message: 'Solo se permiten letras y espacios'
  },
  apellido: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
    message: 'Solo se permiten letras y espacios'
  },
  telefono: {
    required: false,
    type: 'string',
    pattern: /^(\+52|52)?\s?(\d{2,3})?\s?\d{3,4}\s?\d{4}$/,
    message: 'Formato de teléfono inválido'
  },
  avatar: {
    required: false,
    type: 'file',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    message: 'Solo se permiten imágenes JPG, PNG o WebP de máximo 5MB'
  }
};

// =============================================
// DEFINICIONES DE TIPOS DE DATOS
// =============================================

/**
 * Tipo para información de usuario
 */
export const USER_TYPE = {
  id: 'string', // UUID
  email: 'string',
  nombre: 'string',
  apellido: 'string',
  telefono: 'string?',
  avatar: 'string?',
  rol: {
    id: 'number',
    nombre: 'string',
    descripcion: 'string',
    permisos: 'array'
  },
  rancho: {
    id: 'string',
    nombre: 'string'
  },
  status: 'string', // USER_STATUS
  fecha_registro: 'date',
  ultimo_acceso: 'date?',
  activo: 'boolean'
};

/**
 * Tipo para datos de autenticación
 */
export const AUTH_DATA_TYPE = {
  user: 'USER_TYPE',
  token: 'string',
  refreshToken: 'string',
  expiresAt: 'date',
  sessionType: 'string' // SESSION_TYPES
};

/**
 * Tipo para permisos
 */
export const PERMISSION_TYPE = {
  id: 'number',
  resource: 'string', // RESOURCES
  action: 'string', // ACCESS_TYPES
  conditions: 'object?',
  description: 'string'
};

/**
 * Tipo para roles
 */
export const ROLE_TYPE = {
  id: 'number',
  nombre: 'string',
  descripcion: 'string',
  permisos: 'array', // PERMISSION_TYPE[]
  nivel: 'number',
  activo: 'boolean'
};

/**
 * Tipo para sesión
 */
export const SESSION_TYPE = {
  id: 'string',
  userId: 'string',
  token: 'string',
  refreshToken: 'string',
  type: 'string', // SESSION_TYPES
  userAgent: 'string',
  ipAddress: 'string',
  location: 'string?',
  createdAt: 'date',
  lastActivity: 'date',
  expiresAt: 'date',
  active: 'boolean'
};

// =============================================
// CONFIGURACIONES DE VALIDACIÓN
// =============================================

/**
 * Configuración de validación de contraseñas
 */
export const PASSWORD_CONFIG = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: '@$!%*?&',
  preventCommonPasswords: true,
  preventUserInfoInPassword: true
};

/**
 * Configuración de límites de intentos
 */
export const RATE_LIMIT_CONFIG = {
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutos
    blockDuration: 30 * 60 * 1000 // 30 minutos
  },
  register: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hora
    blockDuration: 60 * 60 * 1000 // 1 hora
  },
  passwordReset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hora
    blockDuration: 60 * 60 * 1000 // 1 hora
  }
};

/**
 * Configuración de sesiones
 */
export const SESSION_CONFIG = {
  maxSessions: 5, // Máximo de sesiones simultáneas por usuario
  autoLogoutAfter: 8 * 60 * 60 * 1000, // 8 horas de inactividad
  refreshTokenRotation: true,
  requireReauthForSensitive: true,
  trackUserAgent: true,
  trackLocation: true
};

// =============================================
// MENSAJES DE ERROR Y ESTADO
// =============================================

/**
 * Mensajes de error de autenticación
 */
export const AUTH_ERROR_MESSAGES = {
  // Login
  INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
  USER_NOT_FOUND: 'Usuario no encontrado',
  USER_INACTIVE: 'Usuario inactivo, contacte al administrador',
  USER_SUSPENDED: 'Usuario suspendido temporalmente',
  TOO_MANY_ATTEMPTS: 'Demasiados intentos fallidos, intente más tarde',
  
  // Registro
  EMAIL_ALREADY_EXISTS: 'Este email ya está registrado',
  WEAK_PASSWORD: 'La contraseña no cumple con los requisitos de seguridad',
  INVALID_EMAIL: 'Formato de email inválido',
  REGISTRATION_DISABLED: 'El registro está temporalmente deshabilitado',
  
  // Token
  TOKEN_EXPIRED: 'Su sesión ha expirado, inicie sesión nuevamente',
  TOKEN_INVALID: 'Token de acceso inválido',
  REFRESH_TOKEN_EXPIRED: 'Token de renovación expirado',
  
  // Contraseñas
  CURRENT_PASSWORD_INCORRECT: 'La contraseña actual es incorrecta',
  PASSWORD_RECENTLY_USED: 'No puede usar una contraseña utilizada recientemente',
  PASSWORD_RESET_TOKEN_INVALID: 'Token de recuperación inválido o expirado',
  
  // Permisos
  INSUFFICIENT_PERMISSIONS: 'No tiene permisos para realizar esta acción',
  RESOURCE_ACCESS_DENIED: 'Acceso denegado al recurso solicitado',
  
  // General
  SERVER_ERROR: 'Error interno del servidor',
  NETWORK_ERROR: 'Error de conexión, verifique su internet',
  UNKNOWN_ERROR: 'Error desconocido, intente nuevamente'
};

/**
 * Mensajes de éxito
 */
export const AUTH_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
  REGISTER_SUCCESS: 'Usuario registrado exitosamente',
  PASSWORD_CHANGED: 'Contraseña cambiada correctamente',
  PASSWORD_RESET_SENT: 'Instrucciones enviadas a su email',
  PASSWORD_RESET_SUCCESS: 'Contraseña restablecida exitosamente',
  PROFILE_UPDATED: 'Perfil actualizado correctamente',
  EMAIL_VERIFIED: 'Email verificado exitosamente',
  TOKEN_REFRESHED: 'Sesión renovada automáticamente'
};

// =============================================
// UTILIDADES Y HELPERS
// =============================================

/**
 * Función para validar formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - Es válido o no
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Función para validar fortaleza de contraseña
 * @param {string} password - Contraseña a validar
 * @returns {object} - Resultado de validación
 */
export const validatePasswordStrength = (password) => {
  const tests = {
    length: password.length >= PASSWORD_CONFIG.minLength,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    specialChars: new RegExp(`[${PASSWORD_CONFIG.specialChars}]`).test(password)
  };
  
  const passed = Object.values(tests).filter(Boolean).length;
  const strength = passed < 3 ? 'weak' : passed < 5 ? 'medium' : 'strong';
  
  return {
    isValid: passed === 5,
    strength,
    tests,
    score: (passed / 5) * 100
  };
};

/**
 * Función para verificar si un usuario tiene permisos
 * @param {object} user - Usuario
 * @param {string} resource - Recurso
 * @param {string} action - Acción
 * @returns {boolean} - Tiene permisos o no
 */
export const hasPermission = (user, resource, action) => {
  if (!user || !user.rol || !user.rol.permisos) {
    return false;
  }
  
  // Admin tiene todos los permisos
  if (user.rol.nombre === USER_ROLES.ADMIN) {
    return true;
  }
  
  return user.rol.permisos.some(permission => 
    permission.resource === resource && permission.action === action
  );
};

/**
 * Función para verificar si un usuario tiene un rol específico
 * @param {object} user - Usuario
 * @param {string} role - Rol a verificar
 * @returns {boolean} - Tiene el rol o no
 */
export const hasRole = (user, role) => {
  return user && user.rol && user.rol.nombre === role;
};

/**
 * Función para verificar si un usuario tiene alguno de los roles especificados
 * @param {object} user - Usuario
 * @param {array} roles - Array de roles
 * @returns {boolean} - Tiene alguno de los roles o no
 */
export const hasAnyRole = (user, roles) => {
  return user && user.rol && roles.includes(user.rol.nombre);
};

/**
 * Función para generar nombre completo
 * @param {object} user - Usuario
 * @returns {string} - Nombre completo
 */
export const getFullName = (user) => {
  if (!user) return '';
  return `${user.nombre || ''} ${user.apellido || ''}`.trim();
};

/**
 * Función para obtener iniciales
 * @param {object} user - Usuario
 * @returns {string} - Iniciales
 */
export const getUserInitials = (user) => {
  if (!user) return '';
  
  const firstName = user.nombre || '';
  const lastName = user.apellido || '';
  
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Función para formatear último acceso
 * @param {date} date - Fecha de último acceso
 * @returns {string} - Fecha formateada
 */
export const formatLastAccess = (date) => {
  if (!date) return 'Nunca';
  
  const now = new Date();
  const lastAccess = new Date(date);
  const diffMs = now - lastAccess;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffDays > 0) {
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  } else if (diffMinutes > 0) {
    return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
  } else {
    return 'Ahora mismo';
  }
};

// =============================================
// CONFIGURACIONES POR DEFECTO
// =============================================

/**
 * Configuración por defecto para nuevos usuarios
 */
export const DEFAULT_USER_CONFIG = {
  theme: 'light',
  language: 'es',
  timezone: 'America/Mexico_City',
  notifications: {
    email: true,
    push: true,
    sms: false,
    browser: true
  },
  preferences: {
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'MXN',
    measurementUnit: 'metric'
  }
};

/**
 * Permisos por defecto según rol
 */
export const DEFAULT_PERMISSIONS_BY_ROLE = {
  [USER_ROLES.ADMIN]: ['*'], // Todos los permisos
  [USER_ROLES.MANAGER]: [
    'bovines:read', 'bovines:create', 'bovines:update',
    'health:read', 'health:create', 'health:update',
    'production:read', 'production:create', 'production:update',
    'inventory:read', 'inventory:create', 'inventory:update',
    'finances:read', 'finances:create', 'finances:update',
    'events:read', 'events:create', 'events:update',
    'reports:read', 'reports:export'
  ],
  [USER_ROLES.VETERINARIAN]: [
    'bovines:read', 'bovines:update',
    'health:read', 'health:create', 'health:update',
    'inventory:read', 'inventory:update',
    'events:read', 'events:create', 'events:update',
    'reports:read'
  ],
  [USER_ROLES.EMPLOYEE]: [
    'bovines:read', 'bovines:update',
    'production:read', 'production:create', 'production:update',
    'events:read', 'events:create',
    'reports:read'
  ],
  [USER_ROLES.VIEWER]: [
    'bovines:read',
    'health:read',
    'production:read',
    'reports:read'
  ]
};

export default {
  USER_ROLES,
  USER_STATUS,
  SESSION_TYPES,
  TOKEN_DURATION,
  ACCESS_TYPES,
  RESOURCES,
  AUTH_EVENTS,
  REGISTER_SCHEMA,
  LOGIN_SCHEMA,
  CHANGE_PASSWORD_SCHEMA,
  FORGOT_PASSWORD_SCHEMA,
  RESET_PASSWORD_SCHEMA,
  UPDATE_PROFILE_SCHEMA,
  USER_TYPE,
  AUTH_DATA_TYPE,
  PERMISSION_TYPE,
  ROLE_TYPE,
  SESSION_TYPE,
  PASSWORD_CONFIG,
  RATE_LIMIT_CONFIG,
  SESSION_CONFIG,
  AUTH_ERROR_MESSAGES,
  AUTH_SUCCESS_MESSAGES,
  isValidEmail,
  validatePasswordStrength,
  hasPermission,
  hasRole,
  hasAnyRole,
  getFullName,
  getUserInitials,
  formatLastAccess,
  DEFAULT_USER_CONFIG,
  DEFAULT_PERMISSIONS_BY_ROLE
};