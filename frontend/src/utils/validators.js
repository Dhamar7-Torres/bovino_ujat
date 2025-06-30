/**
 * Funciones de validación para el sistema
 * Sistema de gestión de bovinos - Validaciones específicas y generales
 */

// Expresiones regulares comunes
const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_MX: /^(\+52\s?)?(\d{2,3}\s?\d{3,4}\s?\d{4})$/,
  PHONE_INTERNATIONAL: /^[\+]?[1-9][\d]{7,15}$/,
  RFC_MX: /^([A-ZÑ&]{3,4})(\d{6})([A-Z\d]{3})$/,
  CURP_MX: /^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}[A-Z]{2}[BCDFGHJKLMNPQRSTVWXYZ]{3}[0-9A-Z]{1}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
  LETTERS_ONLY: /^[a-zA-ZÀ-ÿ\s]+$/,
  NUMBERS_ONLY: /^\d+$/,
  DECIMAL: /^\d+(\.\d{1,2})?$/,
  POSTAL_CODE_MX: /^\d{5}$/
};

/**
 * Estructura de respuesta estándar para validaciones
 * @param {boolean} isValid - Si la validación es exitosa
 * @param {string} message - Mensaje de error o éxito
 * @param {string} field - Campo que se está validando
 * @returns {Object} Resultado de validación
 */
const createValidationResult = (isValid, message = '', field = '') => ({
  isValid,
  message,
  field
});

/**
 * Valida si un campo es requerido
 * @param {any} value - Valor a validar
 * @param {string} fieldName - Nombre del campo
 * @returns {Object} Resultado de validación
 */
export const validateRequired = (value, fieldName = 'Campo') => {
  const isEmpty = value === null || value === undefined || 
                  (typeof value === 'string' && value.trim() === '') ||
                  (Array.isArray(value) && value.length === 0);
  
  return createValidationResult(
    !isEmpty,
    isEmpty ? `${fieldName} es requerido` : '',
    fieldName.toLowerCase()
  );
};

/**
 * Valida email
 * @param {string} email - Email a validar
 * @returns {Object} Resultado de validación
 */
export const validateEmail = (email) => {
  if (!email) {
    return createValidationResult(false, 'Email es requerido', 'email');
  }
  
  const isValid = REGEX_PATTERNS.EMAIL.test(email.trim());
  return createValidationResult(
    isValid,
    isValid ? '' : 'Formato de email inválido',
    'email'
  );
};

/**
 * Valida teléfono mexicano
 * @param {string} phone - Teléfono a validar
 * @returns {Object} Resultado de validación
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return createValidationResult(false, 'Teléfono es requerido', 'phone');
  }
  
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const isValidMx = REGEX_PATTERNS.PHONE_MX.test(phone) || 
                    REGEX_PATTERNS.PHONE_INTERNATIONAL.test(cleanPhone);
  
  return createValidationResult(
    isValidMx,
    isValidMx ? '' : 'Formato de teléfono inválido (ej: 442 123 4567 o +52 442 123 4567)',
    'phone'
  );
};

/**
 * Valida RFC mexicano
 * @param {string} rfc - RFC a validar
 * @returns {Object} Resultado de validación
 */
export const validateRFC = (rfc) => {
  if (!rfc) {
    return createValidationResult(false, 'RFC es requerido', 'rfc');
  }
  
  const cleanRFC = rfc.toUpperCase().replace(/\s/g, '');
  const isValid = REGEX_PATTERNS.RFC_MX.test(cleanRFC);
  
  return createValidationResult(
    isValid,
    isValid ? '' : 'Formato de RFC inválido (ej: XAXX010101000)',
    'rfc'
  );
};

/**
 * Valida CURP mexicano
 * @param {string} curp - CURP a validar
 * @returns {Object} Resultado de validación
 */
export const validateCURP = (curp) => {
  if (!curp) {
    return createValidationResult(false, 'CURP es requerido', 'curp');
  }
  
  const cleanCURP = curp.toUpperCase().replace(/\s/g, '');
  const isValid = REGEX_PATTERNS.CURP_MX.test(cleanCURP);
  
  return createValidationResult(
    isValid,
    isValid ? '' : 'Formato de CURP inválido',
    'curp'
  );
};

/**
 * Valida contraseña
 * @param {string} password - Contraseña a validar
 * @param {Object} options - Opciones de validación
 * @returns {Object} Resultado de validación
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false
  } = options;
  
  if (!password) {
    return createValidationResult(false, 'Contraseña es requerida', 'password');
  }
  
  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Mínimo ${minLength} caracteres`);
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Al menos una mayúscula');
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Al menos una minúscula');
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Al menos un número');
  }
  
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Al menos un carácter especial');
  }
  
  const isValid = errors.length === 0;
  return createValidationResult(
    isValid,
    isValid ? '' : `Contraseña debe tener: ${errors.join(', ')}`,
    'password'
  );
};

/**
 * Valida peso de bovino
 * @param {number} weight - Peso en kilogramos
 * @param {Object} options - Opciones de validación
 * @returns {Object} Resultado de validación
 */
export const validateBovineWeight = (weight, options = {}) => {
  const { minWeight = 20, maxWeight = 2000, allowDecimals = true } = options;
  
  if (weight === null || weight === undefined || weight === '') {
    return createValidationResult(false, 'Peso es requerido', 'weight');
  }
  
  const numWeight = Number(weight);
  
  if (isNaN(numWeight)) {
    return createValidationResult(false, 'Peso debe ser un número válido', 'weight');
  }
  
  if (!allowDecimals && numWeight % 1 !== 0) {
    return createValidationResult(false, 'Peso debe ser un número entero', 'weight');
  }
  
  if (numWeight < minWeight) {
    return createValidationResult(false, `Peso mínimo: ${minWeight} kg`, 'weight');
  }
  
  if (numWeight > maxWeight) {
    return createValidationResult(false, `Peso máximo: ${maxWeight} kg`, 'weight');
  }
  
  return createValidationResult(true, '', 'weight');
};

/**
 * Valida edad de bovino
 * @param {number} age - Edad en meses
 * @param {Object} options - Opciones de validación
 * @returns {Object} Resultado de validación
 */
export const validateBovineAge = (age, options = {}) => {
  const { minAge = 0, maxAge = 300 } = options; // máximo 25 años
  
  if (age === null || age === undefined || age === '') {
    return createValidationResult(false, 'Edad es requerida', 'age');
  }
  
  const numAge = Number(age);
  
  if (isNaN(numAge) || numAge < 0) {
    return createValidationResult(false, 'Edad debe ser un número positivo', 'age');
  }
  
  if (numAge < minAge) {
    return createValidationResult(false, `Edad mínima: ${minAge} meses`, 'age');
  }
  
  if (numAge > maxAge) {
    return createValidationResult(false, `Edad máxima: ${maxAge} meses`, 'age');
  }
  
  return createValidationResult(true, '', 'age');
};

/**
 * Valida producción de leche
 * @param {number} production - Producción en litros
 * @param {Object} options - Opciones de validación
 * @returns {Object} Resultado de validación
 */
export const validateMilkProduction = (production, options = {}) => {
  const { minProduction = 0, maxProduction = 100 } = options;
  
  if (production === null || production === undefined || production === '') {
    return createValidationResult(false, 'Producción es requerida', 'production');
  }
  
  const numProduction = Number(production);
  
  if (isNaN(numProduction) || numProduction < 0) {
    return createValidationResult(false, 'Producción debe ser un número positivo', 'production');
  }
  
  if (numProduction < minProduction) {
    return createValidationResult(false, `Producción mínima: ${minProduction} litros`, 'production');
  }
  
  if (numProduction > maxProduction) {
    return createValidationResult(false, `Producción máxima: ${maxProduction} litros`, 'production');
  }
  
  return createValidationResult(true, '', 'production');
};

/**
 * Valida fecha
 * @param {string|Date} date - Fecha a validar
 * @param {Object} options - Opciones de validación
 * @returns {Object} Resultado de validación
 */
export const validateDate = (date, options = {}) => {
  const { 
    allowFuture = true, 
    allowPast = true, 
    minDate = null, 
    maxDate = null 
  } = options;
  
  if (!date) {
    return createValidationResult(false, 'Fecha es requerida', 'date');
  }
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return createValidationResult(false, 'Fecha inválida', 'date');
  }
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);
  
  if (!allowFuture && dateObj > now) {
    return createValidationResult(false, 'No se permiten fechas futuras', 'date');
  }
  
  if (!allowPast && dateObj < now) {
    return createValidationResult(false, 'No se permiten fechas pasadas', 'date');
  }
  
  if (minDate && dateObj < new Date(minDate)) {
    return createValidationResult(false, `Fecha mínima: ${minDate}`, 'date');
  }
  
  if (maxDate && dateObj > new Date(maxDate)) {
    return createValidationResult(false, `Fecha máxima: ${maxDate}`, 'date');
  }
  
  return createValidationResult(true, '', 'date');
};

/**
 * Valida coordenadas geográficas
 * @param {number} lat - Latitud
 * @param {number} lng - Longitud
 * @returns {Object} Resultado de validación
 */
export const validateCoordinates = (lat, lng) => {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return createValidationResult(false, 'Coordenadas son requeridas', 'coordinates');
  }
  
  const numLat = Number(lat);
  const numLng = Number(lng);
  
  if (isNaN(numLat) || isNaN(numLng)) {
    return createValidationResult(false, 'Coordenadas deben ser números válidos', 'coordinates');
  }
  
  if (numLat < -90 || numLat > 90) {
    return createValidationResult(false, 'Latitud debe estar entre -90 y 90', 'coordinates');
  }
  
  if (numLng < -180 || numLng > 180) {
    return createValidationResult(false, 'Longitud debe estar entre -180 y 180', 'coordinates');
  }
  
  return createValidationResult(true, '', 'coordinates');
};

/**
 * Valida archivo subido
 * @param {File} file - Archivo a validar
 * @param {Object} options - Opciones de validación
 * @returns {Object} Resultado de validación
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB por defecto
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    required = false
  } = options;
  
  if (!file) {
    return createValidationResult(
      !required,
      required ? 'Archivo es requerido' : '',
      'file'
    );
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return createValidationResult(
      false,
      `Archivo no debe exceder ${maxSizeMB}MB`,
      'file'
    );
  }
  
  if (!allowedTypes.includes(file.type)) {
    const allowedExtensions = allowedTypes.map(type => 
      type.split('/')[1].toUpperCase()
    ).join(', ');
    return createValidationResult(
      false,
      `Tipos de archivo permitidos: ${allowedExtensions}`,
      'file'
    );
  }
  
  return createValidationResult(true, '', 'file');
};

/**
 * Valida área de rancho
 * @param {number} area - Área en hectáreas
 * @param {Object} options - Opciones de validación
 * @returns {Object} Resultado de validación
 */
export const validateRanchArea = (area, options = {}) => {
  const { minArea = 0.1, maxArea = 100000 } = options;
  
  if (area === null || area === undefined || area === '') {
    return createValidationResult(false, 'Área es requerida', 'area');
  }
  
  const numArea = Number(area);
  
  if (isNaN(numArea) || numArea <= 0) {
    return createValidationResult(false, 'Área debe ser un número positivo', 'area');
  }
  
  if (numArea < minArea) {
    return createValidationResult(false, `Área mínima: ${minArea} hectáreas`, 'area');
  }
  
  if (numArea > maxArea) {
    return createValidationResult(false, `Área máxima: ${maxArea} hectáreas`, 'area');
  }
  
  return createValidationResult(true, '', 'area');
};

/**
 * Valida capacidad de bovinos
 * @param {number} capacity - Capacidad de bovinos
 * @param {Object} options - Opciones de validación
 * @returns {Object} Resultado de validación
 */
export const validateCattleCapacity = (capacity, options = {}) => {
  const { minCapacity = 1, maxCapacity = 50000 } = options;
  
  if (capacity === null || capacity === undefined || capacity === '') {
    return createValidationResult(false, 'Capacidad es requerida', 'capacity');
  }
  
  const numCapacity = Number(capacity);
  
  if (isNaN(numCapacity) || numCapacity <= 0 || numCapacity % 1 !== 0) {
    return createValidationResult(false, 'Capacidad debe ser un número entero positivo', 'capacity');
  }
  
  if (numCapacity < minCapacity) {
    return createValidationResult(false, `Capacidad mínima: ${minCapacity} bovinos`, 'capacity');
  }
  
  if (numCapacity > maxCapacity) {
    return createValidationResult(false, `Capacidad máxima: ${maxCapacity} bovinos`, 'capacity');
  }
  
  return createValidationResult(true, '', 'capacity');
};

/**
 * Valida monto monetario
 * @param {number} amount - Monto a validar
 * @param {Object} options - Opciones de validación
 * @returns {Object} Resultado de validación
 */
export const validateAmount = (amount, options = {}) => {
  const { minAmount = 0, maxAmount = 999999999, allowNegative = false } = options;
  
  if (amount === null || amount === undefined || amount === '') {
    return createValidationResult(false, 'Monto es requerido', 'amount');
  }
  
  const numAmount = Number(amount);
  
  if (isNaN(numAmount)) {
    return createValidationResult(false, 'Monto debe ser un número válido', 'amount');
  }
  
  if (!allowNegative && numAmount < 0) {
    return createValidationResult(false, 'Monto no puede ser negativo', 'amount');
  }
  
  if (numAmount < minAmount) {
    return createValidationResult(false, `Monto mínimo: $${minAmount}`, 'amount');
  }
  
  if (numAmount > maxAmount) {
    return createValidationResult(false, `Monto máximo: $${maxAmount}`, 'amount');
  }
  
  return createValidationResult(true, '', 'amount');
};

/**
 * Valida un formulario completo
 * @param {Object} data - Datos del formulario
 * @param {Object} rules - Reglas de validación
 * @returns {Object} Resultado de validación con errores por campo
 */
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;
  
  Object.entries(rules).forEach(([field, fieldRules]) => {
    const value = data[field];
    const fieldErrors = [];
    
    // Validar cada regla del campo
    fieldRules.forEach(rule => {
      let result;
      
      switch (rule.type) {
        case 'required':
          result = validateRequired(value, rule.message || field);
          break;
        case 'email':
          result = validateEmail(value);
          break;
        case 'phone':
          result = validatePhone(value);
          break;
        case 'password':
          result = validatePassword(value, rule.options);
          break;
        case 'weight':
          result = validateBovineWeight(value, rule.options);
          break;
        case 'age':
          result = validateBovineAge(value, rule.options);
          break;
        case 'date':
          result = validateDate(value, rule.options);
          break;
        case 'coordinates':
          result = validateCoordinates(value?.lat, value?.lng);
          break;
        case 'file':
          result = validateFile(value, rule.options);
          break;
        case 'amount':
          result = validateAmount(value, rule.options);
          break;
        default:
          result = createValidationResult(true);
      }
      
      if (!result.isValid) {
        fieldErrors.push(result.message);
        isValid = false;
      }
    });
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  });
  
  return {
    isValid,
    errors,
    hasErrors: Object.keys(errors).length > 0
  };
};

/**
 * Valida código postal mexicano
 * @param {string} postalCode - Código postal a validar
 * @returns {Object} Resultado de validación
 */
export const validatePostalCode = (postalCode) => {
  if (!postalCode) {
    return createValidationResult(false, 'Código postal es requerido', 'postalCode');
  }
  
  const isValid = REGEX_PATTERNS.POSTAL_CODE_MX.test(postalCode);
  return createValidationResult(
    isValid,
    isValid ? '' : 'Código postal debe tener 5 dígitos',
    'postalCode'
  );
};

/**
 * Valida longitud de texto
 * @param {string} text - Texto a validar
 * @param {Object} options - Opciones de validación
 * @returns {Object} Resultado de validación
 */
export const validateTextLength = (text, options = {}) => {
  const { minLength = 0, maxLength = 255, fieldName = 'Campo' } = options;
  
  if (!text) text = '';
  
  if (text.length < minLength) {
    return createValidationResult(
      false,
      `${fieldName} debe tener al menos ${minLength} caracteres`,
      'textLength'
    );
  }
  
  if (text.length > maxLength) {
    return createValidationResult(
      false,
      `${fieldName} no debe exceder ${maxLength} caracteres`,
      'textLength'
    );
  }
  
  return createValidationResult(true, '', 'textLength');
};

// Exportar todas las funciones como objeto por defecto
export default {
  validateRequired,
  validateEmail,
  validatePhone,
  validateRFC,
  validateCURP,
  validatePassword,
  validateBovineWeight,
  validateBovineAge,
  validateMilkProduction,
  validateDate,
  validateCoordinates,
  validateFile,
  validateRanchArea,
  validateCattleCapacity,
  validateAmount,
  validateForm,
  validatePostalCode,
  validateTextLength,
  createValidationResult,
  REGEX_PATTERNS
};