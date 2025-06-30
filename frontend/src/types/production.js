/**
 * Tipos y constantes para el módulo de producción
 * Sistema de gestión de bovinos - Producción y rendimiento
 */

// Tipos de producción disponibles
export const PRODUCTION_TYPES = {
  LECHE: 'leche',
  CARNE: 'carne',
  MIXTO: 'mixto',
  REPRODUCCION: 'reproduccion'
};

// Calidades de producción
export const PRODUCTION_QUALITIES = {
  EXCELENTE: 'excelente',
  BUENA: 'buena',
  REGULAR: 'regular',
  DEFICIENTE: 'deficiente'
};

// Tipos de peso para registro
export const WEIGHT_TYPES = {
  NACIMIENTO: 'nacimiento',
  DESTETE: 'destete',
  ENGORDE: 'engorde',
  SACRIFICIO: 'sacrificio',
  RUTINARIO: 'rutinario',
  CONTROL: 'control'
};

// Turnos de ordeño
export const MILKING_SHIFTS = {
  MAÑANA: 'mañana',
  TARDE: 'tarde',
  NOCHE: 'noche',
  COMPLETO: 'completo'
};

// Estados de producción
export const PRODUCTION_STATUS = {
  ACTIVA: 'activa',
  SUSPENDIDA: 'suspendida',
  FINALIZADA: 'finalizada',
  EN_PAUSA: 'en_pausa'
};

// Métodos de ordeño
export const MILKING_METHODS = {
  MANUAL: 'manual',
  MECANICO: 'mecanico',
  AUTOMATICO: 'automatico',
  ROBOTICO: 'robotico'
};

// Unidades de medida
export const MEASUREMENT_UNITS = {
  LITROS: 'litros',
  GALONES: 'galones',
  KILOGRAMOS: 'kilogramos',
  LIBRAS: 'libras',
  GRAMOS: 'gramos',
  ONZAS: 'onzas'
};

// Frecuencias de producción
export const PRODUCTION_FREQUENCIES = {
  DIARIA: 'diaria',
  SEMANAL: 'semanal',
  MENSUAL: 'mensual',
  ANUAL: 'anual'
};

// Tipos de análisis de productividad
export const PRODUCTIVITY_ANALYSIS_TYPES = {
  INDIVIDUAL: 'individual',
  GRUPAL: 'grupal',
  COMPARATIVO: 'comparativo',
  TENDENCIA: 'tendencia',
  PROYECCION: 'proyeccion'
};

// Factores que afectan la producción
export const PRODUCTION_FACTORS = {
  ALIMENTACION: 'alimentacion',
  CLIMA: 'clima',
  SALUD: 'salud',
  ESTRES: 'estres',
  EDAD: 'edad',
  RAZA: 'raza',
  GENETICA: 'genetica',
  MANEJO: 'manejo'
};

// Alertas de producción
export const PRODUCTION_ALERTS = {
  BAJA_PRODUCCION: 'baja_produccion',
  ALTA_PRODUCCION: 'alta_produccion',
  CAMBIO_DRASTICO: 'cambio_drastico',
  PATRON_ANOMALO: 'patron_anomalo',
  FALTA_REGISTRO: 'falta_registro'
};

// Rangos de producción lechera (litros por día)
export const MILK_PRODUCTION_RANGES = {
  BAJA: { min: 0, max: 10 },
  MEDIA: { min: 11, max: 25 },
  ALTA: { min: 26, max: 40 },
  MUY_ALTA: { min: 41, max: 100 }
};

// Rangos de ganancia de peso (kg por mes)
export const WEIGHT_GAIN_RANGES = {
  LENTO: { min: 0, max: 15 },
  NORMAL: { min: 16, max: 30 },
  RAPIDO: { min: 31, max: 50 },
  MUY_RAPIDO: { min: 51, max: 100 }
};

// Períodos de lactancia
export const LACTATION_PERIODS = {
  TEMPRANA: 'temprana', // 0-100 días
  MEDIA: 'media',       // 101-200 días
  TARDIA: 'tardia'      // 201+ días
};

// Objetivos de producción
export const PRODUCTION_GOALS = {
  DIARIO: 'diario',
  SEMANAL: 'semanal',
  MENSUAL: 'mensual',
  ANUAL: 'anual',
  LACTANCIA: 'lactancia'
};

// Categorías de bovinos por producción
export const BOVINE_PRODUCTION_CATEGORIES = {
  ALTA_PRODUCTORA: 'alta_productora',
  MEDIA_PRODUCTORA: 'media_productora',
  BAJA_PRODUCTORA: 'baja_productora',
  NO_PRODUCTORA: 'no_productora'
};

// Formatos de exportación de datos
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
  JSON: 'json'
};

// Validaciones para datos de producción
export const PRODUCTION_VALIDATIONS = {
  MIN_MILK_PRODUCTION: 0,
  MAX_MILK_PRODUCTION: 100, // litros por día
  MIN_WEIGHT: 0,
  MAX_WEIGHT: 2000, // kg
  MIN_QUALITY_SCORE: 1,
  MAX_QUALITY_SCORE: 10
};

// Configuraciones predeterminadas
export const DEFAULT_PRODUCTION_CONFIG = {
  milkingShift: MILKING_SHIFTS.MAÑANA,
  productionType: PRODUCTION_TYPES.LECHE,
  measurementUnit: MEASUREMENT_UNITS.LITROS,
  quality: PRODUCTION_QUALITIES.BUENA,
  frequency: PRODUCTION_FREQUENCIES.DIARIA
};

// Mapeo de colores para gráficos
export const PRODUCTION_CHART_COLORS = {
  [PRODUCTION_TYPES.LECHE]: '#3B82F6',
  [PRODUCTION_TYPES.CARNE]: '#EF4444',
  [PRODUCTION_TYPES.MIXTO]: '#10B981',
  [PRODUCTION_TYPES.REPRODUCCION]: '#F59E0B'
};

// Íconos para tipos de producción
export const PRODUCTION_ICONS = {
  [PRODUCTION_TYPES.LECHE]: 'milk',
  [PRODUCTION_TYPES.CARNE]: 'beef',
  [PRODUCTION_TYPES.MIXTO]: 'mixed',
  [PRODUCTION_TYPES.REPRODUCCION]: 'heart'
};

// Estructura base para registro de producción
export const BASE_PRODUCTION_RECORD = {
  id: null,
  bovine_id: null,
  production_type: '',
  date: '',
  time: '',
  amount: 0,
  unit: MEASUREMENT_UNITS.LITROS,
  quality: PRODUCTION_QUALITIES.BUENA,
  shift: MILKING_SHIFTS.MAÑANA,
  method: MILKING_METHODS.MANUAL,
  temperature: null,
  ph: null,
  fat_percentage: null,
  protein_percentage: null,
  lactose_percentage: null,
  somatic_cells: null,
  observations: '',
  location: null,
  weather_conditions: '',
  technician: '',
  created_at: null,
  updated_at: null
};

// Estructura para análisis de productividad
export const PRODUCTIVITY_ANALYSIS_STRUCTURE = {
  bovine_id: null,
  analysis_type: '',
  period_start: '',
  period_end: '',
  total_production: 0,
  average_daily: 0,
  peak_production: 0,
  lowest_production: 0,
  trend: '',
  efficiency_score: 0,
  comparison_data: [],
  recommendations: []
};

// Exportar todas las constantes como objeto por defecto
export default {
  PRODUCTION_TYPES,
  PRODUCTION_QUALITIES,
  WEIGHT_TYPES,
  MILKING_SHIFTS,
  PRODUCTION_STATUS,
  MILKING_METHODS,
  MEASUREMENT_UNITS,
  PRODUCTION_FREQUENCIES,
  PRODUCTIVITY_ANALYSIS_TYPES,
  PRODUCTION_FACTORS,
  PRODUCTION_ALERTS,
  MILK_PRODUCTION_RANGES,
  WEIGHT_GAIN_RANGES,
  LACTATION_PERIODS,
  PRODUCTION_GOALS,
  BOVINE_PRODUCTION_CATEGORIES,
  EXPORT_FORMATS,
  PRODUCTION_VALIDATIONS,
  DEFAULT_PRODUCTION_CONFIG,
  PRODUCTION_CHART_COLORS,
  PRODUCTION_ICONS,
  BASE_PRODUCTION_RECORD,
  PRODUCTIVITY_ANALYSIS_STRUCTURE
};