/**
 * Funciones auxiliares generales
 * Sistema de gestión de bovinos - Utilidades generales para toda la aplicación
 */

/**
 * Genera un ID único basado en timestamp y número aleatorio
 * @param {string} prefix - Prefijo opcional para el ID
 * @returns {string} ID único generado
 */
export const generateUniqueId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}_${timestamp}_${randomPart}` : `${timestamp}_${randomPart}`;
};

/**
 * Genera un UUID v4 simple
 * @returns {string} UUID generado
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Función de debounce para limitar la ejecución de funciones
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en milisegundos
 * @param {boolean} immediate - Ejecutar inmediatamente en el primer llamado
 * @returns {Function} Función debounced
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

/**
 * Función de throttle para limitar la frecuencia de ejecución
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite de tiempo en milisegundos
 * @returns {Function} Función throttled
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Crea una copia profunda de un objeto o array
 * @param {any} obj - Objeto a clonar
 * @returns {any} Copia profunda del objeto
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Compara dos objetos para determinar si son iguales
 * @param {any} obj1 - Primer objeto
 * @param {any} obj2 - Segundo objeto
 * @returns {boolean} True si son iguales
 */
export const isEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;
  if (typeof obj1 !== typeof obj2) return false;
  
  if (typeof obj1 === 'object') {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (let key of keys1) {
      if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
  }
  
  return obj1 === obj2;
};

/**
 * Elimina valores nulos, undefined y strings vacíos de un objeto
 * @param {Object} obj - Objeto a limpiar
 * @returns {Object} Objeto limpio
 */
export const cleanObject = (obj) => {
  const cleaned = {};
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        const cleanedNested = cleanObject(obj[key]);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = obj[key];
      }
    }
  }
  return cleaned;
};

/**
 * Agrupa elementos de un array por una propiedad específica
 * @param {Array} array - Array a agrupar
 * @param {string|Function} key - Propiedad o función para agrupar
 * @returns {Object} Objeto con elementos agrupados
 */
export const groupBy = (array, key) => {
  if (!Array.isArray(array)) return {};
  
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Ordena un array de objetos por una propiedad específica
 * @param {Array} array - Array a ordenar
 * @param {string} key - Propiedad por la cual ordenar
 * @param {string} direction - Dirección: 'asc' o 'desc'
 * @returns {Array} Array ordenado
 */
export const sortBy = (array, key, direction = 'asc') => {
  if (!Array.isArray(array)) return [];
  
  return [...array].sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];
    
    // Manejo de strings y números
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    
    if (direction === 'desc') {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
  });
};

/**
 * Filtra un array de objetos por múltiples criterios
 * @param {Array} array - Array a filtrar
 * @param {Object} filters - Objeto con filtros
 * @returns {Array} Array filtrado
 */
export const filterArray = (array, filters) => {
  if (!Array.isArray(array) || !filters) return array;
  
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === null || value === undefined || value === '') return true;
      
      const itemValue = item[key];
      
      // Búsqueda de texto
      if (typeof value === 'string' && typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase());
      }
      
      // Comparación exacta
      return itemValue === value;
    });
  });
};

/**
 * Busca en un array de objetos por múltiples campos
 * @param {Array} array - Array donde buscar
 * @param {string} searchTerm - Término de búsqueda
 * @param {Array} fields - Campos donde buscar
 * @returns {Array} Resultados de la búsqueda
 */
export const searchInArray = (array, searchTerm, fields = []) => {
  if (!Array.isArray(array) || !searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  
  return array.filter(item => {
    if (fields.length === 0) {
      // Buscar en todos los campos string del objeto
      return Object.values(item).some(value => 
        typeof value === 'string' && value.toLowerCase().includes(term)
      );
    }
    
    // Buscar en campos específicos
    return fields.some(field => {
      const value = item[field];
      return typeof value === 'string' && value.toLowerCase().includes(term);
    });
  });
};

/**
 * Obtiene un valor anidado de un objeto usando notación de punto
 * @param {Object} obj - Objeto fuente
 * @param {string} path - Ruta al valor (ej: 'user.profile.name')
 * @param {any} defaultValue - Valor por defecto si no existe
 * @returns {any} Valor encontrado o valor por defecto
 */
export const getNestedValue = (obj, path, defaultValue = null) => {
  if (!obj || !path) return defaultValue;
  
  const keys = path.split('.');
  let current = obj;
  
  for (let key of keys) {
    if (current[key] === undefined || current[key] === null) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current;
};

/**
 * Establece un valor anidado en un objeto usando notación de punto
 * @param {Object} obj - Objeto objetivo
 * @param {string} path - Ruta donde establecer el valor
 * @param {any} value - Valor a establecer
 * @returns {Object} Objeto modificado
 */
export const setNestedValue = (obj, path, value) => {
  if (!obj || !path) return obj;
  
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return obj;
};

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida un número de teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} True si es válido
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
  return phoneRegex.test(phone.replace(/\s|-|\(|\)/g, ''));
};

/**
 * Calcula estadísticas básicas de un array de números
 * @param {Array} numbers - Array de números
 * @returns {Object} Estadísticas calculadas
 */
export const calculateStats = (numbers) => {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return { min: 0, max: 0, avg: 0, sum: 0, count: 0 };
  }
  
  const validNumbers = numbers.filter(n => !isNaN(n) && n !== null && n !== undefined);
  
  if (validNumbers.length === 0) {
    return { min: 0, max: 0, avg: 0, sum: 0, count: 0 };
  }
  
  const sum = validNumbers.reduce((acc, num) => acc + Number(num), 0);
  const avg = sum / validNumbers.length;
  const min = Math.min(...validNumbers);
  const max = Math.max(...validNumbers);
  
  return {
    min: parseFloat(min.toFixed(2)),
    max: parseFloat(max.toFixed(2)),
    avg: parseFloat(avg.toFixed(2)),
    sum: parseFloat(sum.toFixed(2)),
    count: validNumbers.length
  };
};

/**
 * Convierte un archivo a base64
 * @param {File} file - Archivo a convertir
 * @returns {Promise<string>} Promesa que resuelve con el string base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * Descarga un archivo desde un blob
 * @param {Blob} blob - Blob a descargar
 * @param {string} filename - Nombre del archivo
 */
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} Promesa que indica si fue exitoso
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para navegadores más antiguos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (error) {
    console.error('Error al copiar al portapapeles:', error);
    return false;
  }
};

/**
 * Almacena datos en localStorage con manejo de errores
 * @param {string} key - Clave de almacenamiento
 * @param {any} value - Valor a almacenar
 * @returns {boolean} True si fue exitoso
 */
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
    return false;
  }
};

/**
 * Obtiene datos de localStorage con manejo de errores
 * @param {string} key - Clave de almacenamiento
 * @param {any} defaultValue - Valor por defecto
 * @returns {any} Valor almacenado o valor por defecto
 */
export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error al leer de localStorage:', error);
    return defaultValue;
  }
};

/**
 * Elimina un elemento de localStorage
 * @param {string} key - Clave a eliminar
 * @returns {boolean} True si fue exitoso
 */
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error al eliminar de localStorage:', error);
    return false;
  }
};

/**
 * Verifica si el dispositivo es móvil
 * @returns {boolean} True si es móvil
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Obtiene el tamaño de pantalla actual
 * @returns {Object} Objeto con width y height
 */
export const getScreenSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

/**
 * Convierte un string en formato slug (URL-friendly)
 * @param {string} text - Texto a convertir
 * @returns {string} Slug generado
 */
export const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Genera un color aleatorio en formato hexadecimal
 * @returns {string} Color hexadecimal
 */
export const generateRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

/**
 * Pausa la ejecución por un tiempo determinado
 * @param {number} ms - Milisegundos de pausa
 * @returns {Promise} Promesa que se resuelve después del tiempo especificado
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Exportar todas las funciones como objeto por defecto
export default {
  generateUniqueId,
  generateUUID,
  debounce,
  throttle,
  deepClone,
  isEqual,
  cleanObject,
  groupBy,
  sortBy,
  filterArray,
  searchInArray,
  getNestedValue,
  setNestedValue,
  isValidEmail,
  isValidPhone,
  calculateStats,
  fileToBase64,
  downloadBlob,
  copyToClipboard,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  isMobile,
  getScreenSize,
  slugify,
  generateRandomColor,
  sleep
};