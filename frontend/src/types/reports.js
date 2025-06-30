/**
 * Tipos y constantes para el módulo de reportes
 * Sistema de gestión de bovinos - Generación y gestión de reportes
 */

// Categorías de reportes
export const REPORT_CATEGORIES = {
  BOVINOS: 'bovinos',
  PRODUCCION: 'produccion',
  SALUD: 'salud',
  FINANZAS: 'finanzas',
  INVENTARIO: 'inventario',
  EVENTOS: 'eventos',
  PERSONAL: 'personal',
  AMBIENTAL: 'ambiental',
  GENERAL: 'general'
};

// Tipos de reportes
export const REPORT_TYPES = {
  PREDEFINIDO: 'predefinido',
  PERSONALIZADO: 'personalizado',
  AUTOMATICO: 'automatico',
  PROGRAMADO: 'programado',
  TEMPORAL: 'temporal'
};

// Formatos de exportación
export const REPORT_FORMATS = {
  HTML: 'html',
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
  JSON: 'json',
  XML: 'xml',
  WORD: 'word',
  POWERPOINT: 'powerpoint'
};

// Frecuencias de generación
export const REPORT_FREQUENCIES = {
  INMEDIATO: 'inmediato',
  DIARIO: 'diario',
  SEMANAL: 'semanal',
  QUINCENAL: 'quincenal',
  MENSUAL: 'mensual',
  BIMENSUAL: 'bimensual',
  TRIMESTRAL: 'trimestral',
  SEMESTRAL: 'semestral',
  ANUAL: 'anual'
};

// Estados de reportes
export const REPORT_STATUS = {
  PENDIENTE: 'pendiente',
  GENERANDO: 'generando',
  COMPLETADO: 'completado',
  ERROR: 'error',
  CANCELADO: 'cancelado',
  PROGRAMADO: 'programado',
  EXPIRADO: 'expirado'
};

// Niveles de acceso a reportes
export const REPORT_ACCESS_LEVELS = {
  PUBLICO: 'publico',
  PRIVADO: 'privado',
  COMPARTIDO: 'compartido',
  RESTRINGIDO: 'restringido',
  CONFIDENCIAL: 'confidencial'
};

// Prioridades de generación
export const REPORT_PRIORITIES = {
  BAJA: 'baja',
  NORMAL: 'normal',
  ALTA: 'alta',
  URGENTE: 'urgente',
  CRITICA: 'critica'
};

// Tipos de análisis en reportes
export const ANALYSIS_TYPES = {
  DESCRIPTIVO: 'descriptivo',
  COMPARATIVO: 'comparativo',
  TENDENCIA: 'tendencia',
  PREDICTIVO: 'predictivo',
  ESTADISTICO: 'estadistico',
  FINANCIERO: 'financiero'
};

// Períodos de tiempo para reportes
export const TIME_PERIODS = {
  HOY: 'hoy',
  AYER: 'ayer',
  ULTIMA_SEMANA: 'ultima_semana',
  ULTIMO_MES: 'ultimo_mes',
  ULTIMO_TRIMESTRE: 'ultimo_trimestre',
  ULTIMO_SEMESTRE: 'ultimo_semestre',
  ULTIMO_AÑO: 'ultimo_año',
  PERSONALIZADO: 'personalizado'
};

// Tipos de gráficos
export const CHART_TYPES = {
  LINEA: 'linea',
  BARRA: 'barra',
  COLUMNA: 'columna',
  PIE: 'pie',
  DONA: 'dona',
  AREA: 'area',
  SCATTER: 'scatter',
  RADAR: 'radar',
  GAUGE: 'gauge',
  HEATMAP: 'heatmap'
};

// Orientaciones de página
export const PAGE_ORIENTATIONS = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
};

// Tamaños de página
export const PAGE_SIZES = {
  A4: 'a4',
  A3: 'a3',
  LETTER: 'letter',
  LEGAL: 'legal',
  TABLOID: 'tabloid'
};

// Idiomas disponibles
export const REPORT_LANGUAGES = {
  ESPAÑOL: 'es',
  INGLES: 'en',
  PORTUGUES: 'pt',
  FRANCES: 'fr'
};

// Plantillas de reportes
export const REPORT_TEMPLATES = {
  EJECUTIVO: 'ejecutivo',
  DETALLADO: 'detallado',
  RESUMEN: 'resumen',
  COMPARATIVO: 'comparativo',
  ESTADISTICO: 'estadistico',
  PERSONALIZADO: 'personalizado'
};

// Secciones de reportes
export const REPORT_SECTIONS = {
  PORTADA: 'portada',
  RESUMEN_EJECUTIVO: 'resumen_ejecutivo',
  INTRODUCCION: 'introduccion',
  METODOLOGIA: 'metodologia',
  RESULTADOS: 'resultados',
  GRAFICOS: 'graficos',
  TABLAS: 'tablas',
  ANALISIS: 'analisis',
  CONCLUSIONES: 'conclusiones',
  RECOMENDACIONES: 'recomendaciones',
  ANEXOS: 'anexos',
  PIE_PAGINA: 'pie_pagina'
};

// Métodos de entrega
export const DELIVERY_METHODS = {
  DESCARGA_DIRECTA: 'descarga_directa',
  EMAIL: 'email',
  FTP: 'ftp',
  ALMACENAMIENTO_NUBE: 'almacenamiento_nube',
  NOTIFICACION_PUSH: 'notificacion_push',
  WEBHOOK: 'webhook'
};

// Estados de entrega
export const DELIVERY_STATUS = {
  PENDIENTE: 'pendiente',
  ENVIANDO: 'enviando',
  ENTREGADO: 'entregado',
  FALLIDO: 'fallido',
  REINTENTANDO: 'reintentando'
};

// Tipos de notificaciones
export const NOTIFICATION_TYPES = {
  REPORTE_LISTO: 'reporte_listo',
  ERROR_GENERACION: 'error_generacion',
  PROGRAMACION_ACTIVADA: 'programacion_activada',
  LIMITE_ALCANZADO: 'limite_alcanzado',
  EXPIRACION_PROXIMA: 'expiracion_proxima'
};

// Filtros comunes para reportes
export const COMMON_FILTERS = {
  FECHA_INICIO: 'fecha_inicio',
  FECHA_FIN: 'fecha_fin',
  RANCHO_ID: 'rancho_id',
  BOVINO_ID: 'bovino_id',
  RAZA_ID: 'raza_id',
  SEXO: 'sexo',
  EDAD_MIN: 'edad_min',
  EDAD_MAX: 'edad_max',
  ESTADO: 'estado',
  CATEGORIA: 'categoria'
};

// Métricas disponibles
export const AVAILABLE_METRICS = {
  CONTEO: 'conteo',
  SUMA: 'suma',
  PROMEDIO: 'promedio',
  MEDIANA: 'mediana',
  MINIMO: 'minimo',
  MAXIMO: 'maximo',
  DESVIACION_ESTANDAR: 'desviacion_estandar',
  VARIANZA: 'varianza',
  PORCENTAJE: 'porcentaje',
  RATIO: 'ratio'
};

// Agrupaciones disponibles
export const GROUPING_OPTIONS = {
  DIA: 'dia',
  SEMANA: 'semana',
  MES: 'mes',
  TRIMESTRE: 'trimestre',
  AÑO: 'año',
  RAZA: 'raza',
  SEXO: 'sexo',
  EDAD: 'edad',
  RANCHO: 'rancho',
  CATEGORIA: 'categoria'
};

// Límites de reportes
export const REPORT_LIMITS = {
  MAX_RECORDS_PER_REPORT: 10000,
  MAX_CHARTS_PER_REPORT: 20,
  MAX_TABLES_PER_REPORT: 15,
  MAX_FILE_SIZE_MB: 50,
  MAX_SCHEDULED_REPORTS: 100,
  MAX_CUSTOM_REPORTS: 50
};

// Configuraciones de calidad
export const QUALITY_SETTINGS = {
  BAJA: { dpi: 72, compresion: 'alta' },
  MEDIA: { dpi: 150, compresion: 'media' },
  ALTA: { dpi: 300, compresion: 'baja' },
  MAXIMA: { dpi: 600, compresion: 'ninguna' }
};

// Estructura base para reporte
export const BASE_REPORT_STRUCTURE = {
  id: null,
  name: '',
  description: '',
  category: '',
  type: REPORT_TYPES.PERSONALIZADO,
  format: REPORT_FORMATS.PDF,
  template: REPORT_TEMPLATES.DETALLADO,
  language: REPORT_LANGUAGES.ESPAÑOL,
  page_orientation: PAGE_ORIENTATIONS.VERTICAL,
  page_size: PAGE_SIZES.A4,
  filters: {},
  sections: [],
  charts: [],
  tables: [],
  parameters: {},
  schedule: null,
  access_level: REPORT_ACCESS_LEVELS.PRIVADO,
  created_by: null,
  created_at: null,
  updated_at: null,
  last_generated: null
};

// Configuración predeterminada de reportes
export const DEFAULT_REPORT_CONFIG = {
  format: REPORT_FORMATS.PDF,
  template: REPORT_TEMPLATES.DETALLADO,
  language: REPORT_LANGUAGES.ESPAÑOL,
  pageOrientation: PAGE_ORIENTATIONS.VERTICAL,
  pageSize: PAGE_SIZES.A4,
  quality: 'MEDIA',
  includeCharts: true,
  includeTables: true,
  includeImages: false,
  includeHeader: true,
  includeFooter: true,
  includePageNumbers: true,
  includeDateGenerated: true
};

// Reportes predefinidos disponibles
export const PREDEFINED_REPORTS = {
  INVENTARIO_BOVINOS: {
    id: 'inventario_bovinos',
    name: 'Inventario de Bovinos',
    category: REPORT_CATEGORIES.BOVINOS,
    description: 'Listado completo de bovinos con sus características'
  },
  PRODUCCION_LECHERA: {
    id: 'produccion_lechera',
    name: 'Producción Lechera',
    category: REPORT_CATEGORIES.PRODUCCION,
    description: 'Análisis de producción de leche por período'
  },
  ESTADO_SALUD: {
    id: 'estado_salud',
    name: 'Estado de Salud del Rebaño',
    category: REPORT_CATEGORIES.SALUD,
    description: 'Resumen del estado sanitario de los bovinos'
  },
  ANALISIS_FINANCIERO: {
    id: 'analisis_financiero',
    name: 'Análisis Financiero',
    category: REPORT_CATEGORIES.FINANZAS,
    description: 'Estado financiero y rentabilidad del rancho'
  },
  EVENTOS_REPRODUCTIVOS: {
    id: 'eventos_reproductivos',
    name: 'Eventos Reproductivos',
    category: REPORT_CATEGORIES.EVENTOS,
    description: 'Seguimiento de eventos de reproducción'
  }
};

// Mapeo de colores para categorías
export const CATEGORY_COLORS = {
  [REPORT_CATEGORIES.BOVINOS]: '#3B82F6',
  [REPORT_CATEGORIES.PRODUCCION]: '#10B981',
  [REPORT_CATEGORIES.SALUD]: '#EF4444',
  [REPORT_CATEGORIES.FINANZAS]: '#F59E0B',
  [REPORT_CATEGORIES.INVENTARIO]: '#8B5CF6',
  [REPORT_CATEGORIES.EVENTOS]: '#EC4899',
  [REPORT_CATEGORIES.PERSONAL]: '#6B7280',
  [REPORT_CATEGORIES.AMBIENTAL]: '#059669',
  [REPORT_CATEGORIES.GENERAL]: '#374151'
};

// Íconos para categorías
export const CATEGORY_ICONS = {
  [REPORT_CATEGORIES.BOVINOS]: 'cow',
  [REPORT_CATEGORIES.PRODUCCION]: 'trending-up',
  [REPORT_CATEGORIES.SALUD]: 'heart-pulse',
  [REPORT_CATEGORIES.FINANZAS]: 'dollar-sign',
  [REPORT_CATEGORIES.INVENTARIO]: 'package',
  [REPORT_CATEGORIES.EVENTOS]: 'calendar',
  [REPORT_CATEGORIES.PERSONAL]: 'users',
  [REPORT_CATEGORIES.AMBIENTAL]: 'leaf',
  [REPORT_CATEGORIES.GENERAL]: 'file-text'
};

// Exportar todas las constantes como objeto por defecto
export default {
  REPORT_CATEGORIES,
  REPORT_TYPES,
  REPORT_FORMATS,
  REPORT_FREQUENCIES,
  REPORT_STATUS,
  REPORT_ACCESS_LEVELS,
  REPORT_PRIORITIES,
  ANALYSIS_TYPES,
  TIME_PERIODS,
  CHART_TYPES,
  PAGE_ORIENTATIONS,
  PAGE_SIZES,
  REPORT_LANGUAGES,
  REPORT_TEMPLATES,
  REPORT_SECTIONS,
  DELIVERY_METHODS,
  DELIVERY_STATUS,
  NOTIFICATION_TYPES,
  COMMON_FILTERS,
  AVAILABLE_METRICS,
  GROUPING_OPTIONS,
  REPORT_LIMITS,
  QUALITY_SETTINGS,
  BASE_REPORT_STRUCTURE,
  DEFAULT_REPORT_CONFIG,
  PREDEFINED_REPORTS,
  CATEGORY_COLORS,
  CATEGORY_ICONS
};