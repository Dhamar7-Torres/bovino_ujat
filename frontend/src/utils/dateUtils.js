/**
 * Utilidades para manejo de fechas
 * Sistema de gestión de bovinos - Funciones auxiliares para fechas y tiempo
 */

import { 
  format, 
  parseISO, 
  addDays, 
  addWeeks, 
  addMonths, 
  addYears,
  subDays, 
  subWeeks, 
  subMonths, 
  subYears,
  startOfDay, 
  endOfDay,
  startOfWeek, 
  endOfWeek,
  startOfMonth, 
  endOfMonth,
  startOfYear, 
  endOfYear,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  isAfter,
  isBefore,
  isEqual,
  isValid,
  formatDistanceToNow,
  isToday,
  isYesterday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
  isThisYear,
  getDay,
  getMonth,
  getYear,
  getDaysInMonth,
  isLeapYear,
  isWeekend,
  isBusinessDay
} from 'date-fns';
import { es } from 'date-fns/locale';

// Formatos de fecha predefinidos
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  MEDIUM: 'dd MMM yyyy',
  LONG: 'dd \'de\' MMMM \'de\' yyyy',
  FULL: 'EEEE, dd \'de\' MMMM \'de\' yyyy',
  ISO: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  DATETIME: 'dd/MM/yyyy HH:mm',
  DATETIME_FULL: 'dd/MM/yyyy HH:mm:ss'
};

// Días de la semana en español
export const DAYS_OF_WEEK = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

// Meses del año en español
export const MONTHS_OF_YEAR = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Meses del año abreviados
export const MONTHS_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

/**
 * Formatea una fecha con el formato especificado
 * @param {Date|string} date - Fecha a formatear
 * @param {string} formatStr - Formato de salida
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, formatStr = DATE_FORMATS.SHORT) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, formatStr, { locale: es });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return '';
  }
};

/**
 * Formatea una fecha como string relativo (hace 2 días, en 1 semana, etc.)
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha relativa
 */
export const formatRelativeDate = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
  } catch (error) {
    console.error('Error al formatear fecha relativa:', error);
    return '';
  }
};

/**
 * Obtiene la fecha actual en formato ISO
 * @returns {string} Fecha actual en formato ISO
 */
export const getCurrentDateISO = () => {
  return format(new Date(), DATE_FORMATS.ISO);
};

/**
 * Obtiene la fecha y hora actual en formato ISO completo
 * @returns {string} Fecha y hora actual
 */
export const getCurrentDateTimeISO = () => {
  return new Date().toISOString();
};

/**
 * Convierte una fecha a formato ISO para la API
 * @param {Date|string} date - Fecha a convertir
 * @returns {string} Fecha en formato ISO
 */
export const toISOString = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, DATE_FORMATS.ISO);
  } catch (error) {
    console.error('Error al convertir fecha a ISO:', error);
    return '';
  }
};

/**
 * Calcula la edad en años a partir de una fecha de nacimiento
 * @param {Date|string} birthDate - Fecha de nacimiento
 * @param {Date|string} referenceDate - Fecha de referencia (por defecto: hoy)
 * @returns {number} Edad en años
 */
export const calculateAge = (birthDate, referenceDate = new Date()) => {
  if (!birthDate) return 0;
  
  try {
    const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
    const reference = typeof referenceDate === 'string' ? parseISO(referenceDate) : referenceDate;
    
    if (!isValid(birth) || !isValid(reference)) return 0;
    
    return differenceInYears(reference, birth);
  } catch (error) {
    console.error('Error al calcular edad:', error);
    return 0;
  }
};

/**
 * Calcula la edad en meses a partir de una fecha de nacimiento
 * @param {Date|string} birthDate - Fecha de nacimiento
 * @param {Date|string} referenceDate - Fecha de referencia (por defecto: hoy)
 * @returns {number} Edad en meses
 */
export const calculateAgeInMonths = (birthDate, referenceDate = new Date()) => {
  if (!birthDate) return 0;
  
  try {
    const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
    const reference = typeof referenceDate === 'string' ? parseISO(referenceDate) : referenceDate;
    
    if (!isValid(birth) || !isValid(reference)) return 0;
    
    return differenceInMonths(reference, birth);
  } catch (error) {
    console.error('Error al calcular edad en meses:', error);
    return 0;
  }
};

/**
 * Calcula la diferencia en días entre dos fechas
 * @param {Date|string} startDate - Fecha inicial
 * @param {Date|string} endDate - Fecha final
 * @returns {number} Diferencia en días
 */
export const daysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    if (!isValid(start) || !isValid(end)) return 0;
    
    return differenceInDays(end, start);
  } catch (error) {
    console.error('Error al calcular días entre fechas:', error);
    return 0;
  }
};

/**
 * Agrega días a una fecha
 * @param {Date|string} date - Fecha base
 * @param {number} days - Días a agregar
 * @returns {Date} Nueva fecha
 */
export const addDaysToDate = (date, days) => {
  if (!date) return null;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return null;
    
    return addDays(dateObj, days);
  } catch (error) {
    console.error('Error al agregar días:', error);
    return null;
  }
};

/**
 * Substrae días de una fecha
 * @param {Date|string} date - Fecha base
 * @param {number} days - Días a substraer
 * @returns {Date} Nueva fecha
 */
export const subtractDaysFromDate = (date, days) => {
  if (!date) return null;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return null;
    
    return subDays(dateObj, days);
  } catch (error) {
    console.error('Error al substraer días:', error);
    return null;
  }
};

/**
 * Obtiene el rango de fechas para una semana específica
 * @param {Date|string} date - Fecha de referencia
 * @returns {Object} Objeto con startDate y endDate
 */
export const getWeekRange = (date = new Date()) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return null;
    
    return {
      startDate: startOfWeek(dateObj, { weekStartsOn: 1 }), // Lunes
      endDate: endOfWeek(dateObj, { weekStartsOn: 1 })     // Domingo
    };
  } catch (error) {
    console.error('Error al obtener rango de semana:', error);
    return null;
  }
};

/**
 * Obtiene el rango de fechas para un mes específico
 * @param {Date|string} date - Fecha de referencia
 * @returns {Object} Objeto con startDate y endDate
 */
export const getMonthRange = (date = new Date()) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return null;
    
    return {
      startDate: startOfMonth(dateObj),
      endDate: endOfMonth(dateObj)
    };
  } catch (error) {
    console.error('Error al obtener rango de mes:', error);
    return null;
  }
};

/**
 * Obtiene el rango de fechas para un año específico
 * @param {Date|string} date - Fecha de referencia
 * @returns {Object} Objeto con startDate y endDate
 */
export const getYearRange = (date = new Date()) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return null;
    
    return {
      startDate: startOfYear(dateObj),
      endDate: endOfYear(dateObj)
    };
  } catch (error) {
    console.error('Error al obtener rango de año:', error);
    return null;
  }
};

/**
 * Verifica si una fecha está dentro de un rango
 * @param {Date|string} date - Fecha a verificar
 * @param {Date|string} startDate - Fecha inicial del rango
 * @param {Date|string} endDate - Fecha final del rango
 * @returns {boolean} True si está dentro del rango
 */
export const isDateInRange = (date, startDate, endDate) => {
  if (!date || !startDate || !endDate) return false;
  
  try {
    const checkDate = typeof date === 'string' ? parseISO(date) : date;
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    if (!isValid(checkDate) || !isValid(start) || !isValid(end)) return false;
    
    return (isAfter(checkDate, start) || isEqual(checkDate, start)) && 
           (isBefore(checkDate, end) || isEqual(checkDate, end));
  } catch (error) {
    console.error('Error al verificar fecha en rango:', error);
    return false;
  }
};

/**
 * Obtiene una descripción de tiempo relativo más específica
 * @param {Date|string} date - Fecha a analizar
 * @returns {string} Descripción del tiempo
 */
export const getTimeDescription = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    if (isToday(dateObj)) return 'Hoy';
    if (isYesterday(dateObj)) return 'Ayer';
    if (isTomorrow(dateObj)) return 'Mañana';
    if (isThisWeek(dateObj)) return 'Esta semana';
    if (isThisMonth(dateObj)) return 'Este mes';
    if (isThisYear(dateObj)) return 'Este año';
    
    return formatRelativeDate(dateObj);
  } catch (error) {
    console.error('Error al obtener descripción de tiempo:', error);
    return '';
  }
};

/**
 * Genera un array de fechas entre dos fechas
 * @param {Date|string} startDate - Fecha inicial
 * @param {Date|string} endDate - Fecha final
 * @returns {Array} Array de fechas
 */
export const getDatesBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return [];
  
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    if (!isValid(start) || !isValid(end)) return [];
    
    const dates = [];
    let currentDate = start;
    
    while (isBefore(currentDate, end) || isEqual(currentDate, end)) {
      dates.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    return dates;
  } catch (error) {
    console.error('Error al generar fechas entre rango:', error);
    return [];
  }
};

/**
 * Obtiene información detallada de una fecha
 * @param {Date|string} date - Fecha a analizar
 * @returns {Object} Información de la fecha
 */
export const getDateInfo = (date = new Date()) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return null;
    
    return {
      date: dateObj,
      dayOfWeek: getDay(dateObj),
      dayName: DAYS_OF_WEEK[getDay(dateObj)],
      dayOfMonth: dateObj.getDate(),
      month: getMonth(dateObj),
      monthName: MONTHS_OF_YEAR[getMonth(dateObj)],
      monthShort: MONTHS_SHORT[getMonth(dateObj)],
      year: getYear(dateObj),
      quarter: Math.ceil((getMonth(dateObj) + 1) / 3),
      daysInMonth: getDaysInMonth(dateObj),
      isLeapYear: isLeapYear(dateObj),
      isWeekend: isWeekend(dateObj),
      isBusinessDay: isBusinessDay(dateObj),
      formatted: {
        short: formatDate(dateObj, DATE_FORMATS.SHORT),
        medium: formatDate(dateObj, DATE_FORMATS.MEDIUM),
        long: formatDate(dateObj, DATE_FORMATS.LONG),
        iso: formatDate(dateObj, DATE_FORMATS.ISO)
      }
    };
  } catch (error) {
    console.error('Error al obtener información de fecha:', error);
    return null;
  }
};

/**
 * Valida si una fecha es válida
 * @param {any} date - Valor a validar
 * @returns {boolean} True si es una fecha válida
 */
export const isValidDate = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj);
  } catch (error) {
    return false;
  }
};

/**
 * Obtiene fechas importantes para el ganado (períodos reproductivos, etc.)
 * @param {Date|string} birthDate - Fecha de nacimiento
 * @returns {Object} Fechas importantes
 */
export const getCattleImportantDates = (birthDate) => {
  if (!birthDate) return null;
  
  try {
    const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
    if (!isValid(birth)) return null;
    
    return {
      birth: birth,
      weaning: addMonths(birth, 7),          // Destete a los 7 meses
      breeding: addMonths(birth, 15),        // Primera monta a los 15 meses
      firstCalving: addMonths(birth, 24),    // Primer parto a los 24 meses
      maturity: addMonths(birth, 18),        // Madurez sexual a los 18 meses
      retirement: addYears(birth, 12)        // Retiro estimado a los 12 años
    };
  } catch (error) {
    console.error('Error al calcular fechas importantes:', error);
    return null;
  }
};

// Exportar todas las funciones como objeto por defecto
export default {
  DATE_FORMATS,
  DAYS_OF_WEEK,
  MONTHS_OF_YEAR,
  MONTHS_SHORT,
  formatDate,
  formatRelativeDate,
  getCurrentDateISO,
  getCurrentDateTimeISO,
  toISOString,
  calculateAge,
  calculateAgeInMonths,
  daysBetween,
  addDaysToDate,
  subtractDaysFromDate,
  getWeekRange,
  getMonthRange,
  getYearRange,
  isDateInRange,
  getTimeDescription,
  getDatesBetween,
  getDateInfo,
  isValidDate,
  getCattleImportantDates
};