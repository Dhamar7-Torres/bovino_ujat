/**
 * Utilidades de formateo de datos
 * Sistema de gestión de bovinos - Funciones para formatear diferentes tipos de datos
 */

// Configuración de locale por defecto
const DEFAULT_LOCALE = 'es-MX';

// Configuración de monedas
const CURRENCY_CONFIG = {
  MXN: { code: 'MXN', symbol: '$', locale: 'es-MX' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', locale: 'es-ES' }
};

/**
 * Formatea un número como moneda
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Código de moneda (MXN, USD, EUR)
 * @param {string} locale - Locale para el formateo
 * @returns {string} Cantidad formateada como moneda
 */
export const formatCurrency = (amount, currency = 'MXN', locale = null) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
  
  try {
    const currencyConfig = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.MXN;
    const useLocale = locale || currencyConfig.locale;
    
    return new Intl.NumberFormat(useLocale, {
      style: 'currency',
      currency: currencyConfig.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(amount));
  } catch (error) {
    console.error('Error al formatear moneda:', error);
    return `${CURRENCY_CONFIG[currency]?.symbol || '$'}${Number(amount).toFixed(2)}`;
  }
};

/**
 * Formatea un número con separadores de miles
 * @param {number} number - Número a formatear
 * @param {number} decimals - Número de decimales
 * @param {string} locale - Locale para el formateo
 * @returns {string} Número formateado
 */
export const formatNumber = (number, decimals = 0, locale = DEFAULT_LOCALE) => {
  if (number === null || number === undefined || isNaN(number)) return '0';
  
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(Number(number));
  } catch (error) {
    console.error('Error al formatear número:', error);
    return Number(number).toFixed(decimals);
  }
};

/**
 * Formatea un número como porcentaje
 * @param {number} value - Valor a formatear (0.5 = 50%)
 * @param {number} decimals - Número de decimales
 * @param {string} locale - Locale para el formateo
 * @returns {string} Porcentaje formateado
 */
export const formatPercentage = (value, decimals = 1, locale = DEFAULT_LOCALE) => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(Number(value));
  } catch (error) {
    console.error('Error al formatear porcentaje:', error);
    return `${(Number(value) * 100).toFixed(decimals)}%`;
  }
};

/**
 * Formatea un peso con unidad
 * @param {number} weight - Peso en kilogramos
 * @param {string} unit - Unidad (kg, lb, g)
 * @param {number} decimals - Número de decimales
 * @returns {string} Peso formateado
 */
export const formatWeight = (weight, unit = 'kg', decimals = 1) => {
  if (weight === null || weight === undefined || isNaN(weight)) return `0 ${unit}`;
  
  try {
    let convertedWeight = Number(weight);
    
    // Conversiones de kilogramos a otras unidades
    switch (unit.toLowerCase()) {
      case 'lb':
      case 'libras':
        convertedWeight = weight * 2.20462;
        break;
      case 'g':
      case 'gramos':
        convertedWeight = weight * 1000;
        break;
      case 'kg':
      case 'kilogramos':
      default:
        // Ya está en kilogramos
        break;
    }
    
    return `${formatNumber(convertedWeight, decimals)} ${unit}`;
  } catch (error) {
    console.error('Error al formatear peso:', error);
    return `${Number(weight).toFixed(decimals)} ${unit}`;
  }
};

/**
 * Formatea un volumen con unidad
 * @param {number} volume - Volumen en litros
 * @param {string} unit - Unidad (L, gal, ml)
 * @param {number} decimals - Número de decimales
 * @returns {string} Volumen formateado
 */
export const formatVolume = (volume, unit = 'L', decimals = 1) => {
  if (volume === null || volume === undefined || isNaN(volume)) return `0 ${unit}`;
  
  try {
    let convertedVolume = Number(volume);
    
    // Conversiones de litros a otras unidades
    switch (unit.toLowerCase()) {
      case 'gal':
      case 'galones':
        convertedVolume = volume * 0.264172;
        break;
      case 'ml':
      case 'mililitros':
        convertedVolume = volume * 1000;
        break;
      case 'l':
      case 'litros':
      default:
        // Ya está en litros
        break;
    }
    
    return `${formatNumber(convertedVolume, decimals)} ${unit}`;
  } catch (error) {
    console.error('Error al formatear volumen:', error);
    return `${Number(volume).toFixed(decimals)} ${unit}`;
  }
};

/**
 * Formatea un área con unidad
 * @param {number} area - Área en hectáreas
 * @param {string} unit - Unidad (ha, m², acres)
 * @param {number} decimals - Número de decimales
 * @returns {string} Área formateada
 */
export const formatArea = (area, unit = 'ha', decimals = 2) => {
  if (area === null || area === undefined || isNaN(area)) return `0 ${unit}`;
  
  try {
    let convertedArea = Number(area);
    
    // Conversiones de hectáreas a otras unidades
    switch (unit.toLowerCase()) {
      case 'm²':
      case 'metros cuadrados':
        convertedArea = area * 10000;
        break;
      case 'acres':
        convertedArea = area * 2.47105;
        break;
      case 'ha':
      case 'hectáreas':
      default:
        // Ya está en hectáreas
        break;
    }
    
    return `${formatNumber(convertedArea, decimals)} ${unit}`;
  } catch (error) {
    console.error('Error al formatear área:', error);
    return `${Number(area).toFixed(decimals)} ${unit}`;
  }
};

/**
 * Formatea una temperatura con unidad
 * @param {number} temperature - Temperatura en Celsius
 * @param {string} unit - Unidad (°C, °F)
 * @param {number} decimals - Número de decimales
 * @returns {string} Temperatura formateada
 */
export const formatTemperature = (temperature, unit = '°C', decimals = 1) => {
  if (temperature === null || temperature === undefined || isNaN(temperature)) return `0${unit}`;
  
  try {
    let convertedTemp = Number(temperature);
    
    // Conversión de Celsius a Fahrenheit
    if (unit === '°F' || unit.toLowerCase() === 'fahrenheit') {
      convertedTemp = (temperature * 9/5) + 32;
      unit = '°F';
    }
    
    return `${formatNumber(convertedTemp, decimals)}${unit}`;
  } catch (error) {
    console.error('Error al formatear temperatura:', error);
    return `${Number(temperature).toFixed(decimals)}${unit}`;
  }
};

/**
 * Formatea un texto para capitalizar la primera letra
 * @param {string} text - Texto a formatear
 * @returns {string} Texto capitalizado
 */
export const capitalize = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formatea un texto para capitalizar cada palabra
 * @param {string} text - Texto a formatear
 * @returns {string} Texto con cada palabra capitalizada
 */
export const capitalizeWords = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Trunca un texto y agrega puntos suspensivos
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Formatea un número de teléfono
 * @param {string} phone - Número de teléfono
 * @returns {string} Teléfono formateado
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Limpiar caracteres no numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Formatear según la longitud
  if (cleaned.length === 10) {
    // Formato mexicano: (442) 123-4567
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    // Formato estadounidense: +1 (442) 123-4567
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('52')) {
    // Formato mexicano internacional: +52 442 123-4567
    return `+52 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
  }
  
  return phone; // Devolver original si no coincide con ningún formato
};

/**
 * Formatea un email para mostrar solo el nombre de usuario si es muy largo
 * @param {string} email - Email a formatear
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Email formateado
 */
export const formatEmail = (email, maxLength = 30) => {
  if (!email || typeof email !== 'string') return '';
  if (email.length <= maxLength) return email;
  
  const [username, domain] = email.split('@');
  if (username.length > maxLength - 10) {
    return `${username.substring(0, maxLength - 13)}...@${domain}`;
  }
  
  return email;
};

/**
 * Formatea un ID de bovino con formato estándar
 * @param {string|number} id - ID del bovino
 * @param {string} prefix - Prefijo opcional
 * @returns {string} ID formateado
 */
export const formatBovineId = (id, prefix = 'BOV') => {
  if (!id) return '';
  
  const cleanId = String(id).replace(/\D/g, '');
  const paddedId = cleanId.padStart(6, '0');
  
  return `${prefix}-${paddedId}`;
};

/**
 * Formatea un número de lote
 * @param {string|number} batch - Número de lote
 * @param {string} prefix - Prefijo opcional
 * @returns {string} Lote formateado
 */
export const formatBatchNumber = (batch, prefix = 'LOTE') => {
  if (!batch) return '';
  
  const cleanBatch = String(batch).replace(/\D/g, '');
  const paddedBatch = cleanBatch.padStart(4, '0');
  
  return `${prefix}-${paddedBatch}`;
};

/**
 * Formatea un rango de valores
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @param {string} unit - Unidad opcional
 * @param {number} decimals - Número de decimales
 * @returns {string} Rango formateado
 */
export const formatRange = (min, max, unit = '', decimals = 1) => {
  if (min === null || min === undefined || max === null || max === undefined) return '';
  
  const formattedMin = formatNumber(min, decimals);
  const formattedMax = formatNumber(max, decimals);
  
  if (min === max) {
    return `${formattedMin}${unit ? ' ' + unit : ''}`;
  }
  
  return `${formattedMin} - ${formattedMax}${unit ? ' ' + unit : ''}`;
};

/**
 * Formatea un status o estado con color
 * @param {string} status - Estado a formatear
 * @returns {Object} Objeto con texto y clase CSS
 */
export const formatStatus = (status) => {
  if (!status) return { text: 'Sin estado', className: 'text-gray-500' };
  
  const statusMap = {
    'activo': { text: 'Activo', className: 'text-green-600' },
    'inactivo': { text: 'Inactivo', className: 'text-red-600' },
    'pendiente': { text: 'Pendiente', className: 'text-yellow-600' },
    'completado': { text: 'Completado', className: 'text-blue-600' },
    'cancelado': { text: 'Cancelado', className: 'text-gray-600' },
    'en_proceso': { text: 'En Proceso', className: 'text-orange-600' },
    'error': { text: 'Error', className: 'text-red-700' },
    'exitoso': { text: 'Exitoso', className: 'text-green-700' }
  };
  
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
  return statusMap[normalizedStatus] || { 
    text: capitalizeWords(status), 
    className: 'text-gray-600' 
  };
};

/**
 * Formatea un valor booleano para mostrar
 * @param {boolean} value - Valor booleano
 * @param {Object} labels - Etiquetas personalizadas
 * @returns {string} Valor formateado
 */
export const formatBoolean = (value, labels = { true: 'Sí', false: 'No' }) => {
  if (value === null || value === undefined) return 'N/A';
  return value ? labels.true : labels.false;
};

/**
 * Formatea una lista de elementos separados por comas
 * @param {Array} items - Array de elementos
 * @param {number} maxItems - Máximo número de elementos a mostrar
 * @returns {string} Lista formateada
 */
export const formatList = (items, maxItems = 3) => {
  if (!Array.isArray(items) || items.length === 0) return '';
  
  if (items.length <= maxItems) {
    return items.join(', ');
  }
  
  const visibleItems = items.slice(0, maxItems);
  const remainingCount = items.length - maxItems;
  
  return `${visibleItems.join(', ')} y ${remainingCount} más`;
};

/**
 * Formatea bytes a unidades legibles
 * @param {number} bytes - Número de bytes
 * @param {number} decimals - Número de decimales
 * @returns {string} Tamaño formateado
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Exportar todas las funciones como objeto por defecto
export default {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatWeight,
  formatVolume,
  formatArea,
  formatTemperature,
  capitalize,
  capitalizeWords,
  truncateText,
  formatPhone,
  formatEmail,
  formatBovineId,
  formatBatchNumber,
  formatRange,
  formatStatus,
  formatBoolean,
  formatList,
  formatFileSize
};