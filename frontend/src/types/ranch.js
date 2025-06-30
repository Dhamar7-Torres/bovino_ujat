/**
 * Tipos y constantes para el módulo de ranchos
 * Sistema de gestión de bovinos - Gestión de ranchos y propiedades
 */

// Tipos de ranchos
export const RANCH_TYPES = {
  LECHERO: 'lechero',
  GANADERO: 'ganadero',
  MIXTO: 'mixto',
  ENGORDE: 'engorde',
  CRIA: 'cria',
  REPRODUCCION: 'reproduccion'
};

// Estados del rancho
export const RANCH_STATUS = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
  SUSPENDIDO: 'suspendido',
  EN_MANTENIMIENTO: 'en_mantenimiento',
  CERRADO: 'cerrado'
};

// Tamaños de rancho
export const RANCH_SIZES = {
  PEQUEÑO: 'pequeño',      // < 50 hectáreas
  MEDIANO: 'mediano',      // 50-200 hectáreas
  GRANDE: 'grande',        // 200-500 hectáreas
  MUY_GRANDE: 'muy_grande' // > 500 hectáreas
};

// Sistemas de manejo
export const MANAGEMENT_SYSTEMS = {
  EXTENSIVO: 'extensivo',
  INTENSIVO: 'intensivo',
  SEMI_INTENSIVO: 'semi_intensivo',
  ROTACIONAL: 'rotacional',
  CONTINUO: 'continuo'
};

// Tipos de terreno
export const TERRAIN_TYPES = {
  PLANO: 'plano',
  ONDULADO: 'ondulado',
  MONTAÑOSO: 'montañoso',
  MIXTO: 'mixto'
};

// Tipos de clima
export const CLIMATE_TYPES = {
  TROPICAL: 'tropical',
  SUBTROPICAL: 'subtropical',
  TEMPLADO: 'templado',
  FRIO: 'frio',
  ARIDO: 'arido',
  SEMI_ARIDO: 'semi_arido'
};

// Fuentes de agua
export const WATER_SOURCES = {
  POZO: 'pozo',
  RIO: 'rio',
  ARROYO: 'arroyo',
  LAGUNA: 'laguna',
  ACUEDUCTO: 'acueducto',
  LLUVIA: 'lluvia',
  MIXTA: 'mixta'
};

// Tipos de pasturas
export const PASTURE_TYPES = {
  NATURAL: 'natural',
  ARTIFICIAL: 'artificial',
  MIXTA: 'mixta',
  MEJORADA: 'mejorada'
};

// Estados de las pasturas
export const PASTURE_CONDITIONS = {
  EXCELENTE: 'excelente',
  BUENA: 'buena',
  REGULAR: 'regular',
  POBRE: 'pobre',
  DEGRADADA: 'degradada'
};

// Infraestructuras del rancho
export const INFRASTRUCTURE_TYPES = {
  CORRAL: 'corral',
  ESTABLO: 'establo',
  SALA_ORDEÑO: 'sala_ordeño',
  BODEGA: 'bodega',
  OFICINA: 'oficina',
  VIVIENDA: 'vivienda',
  CERCA: 'cerca',
  BEBEDERO: 'bebedero',
  COMEDERO: 'comedero',
  BASCULA: 'bascula',
  MANGA: 'manga',
  EMBARCADERO: 'embarcadero'
};

// Estados de infraestructura
export const INFRASTRUCTURE_STATUS = {
  EXCELENTE: 'excelente',
  BUENO: 'bueno',
  REGULAR: 'regular',
  MALO: 'malo',
  EN_REPARACION: 'en_reparacion',
  FUERA_DE_SERVICIO: 'fuera_de_servicio'
};

// Zonas del rancho
export const RANCH_ZONES = {
  PASTOREO: 'pastoreo',
  ORDEÑO: 'ordeño',
  MATERNIDAD: 'maternidad',
  ENFERMERIA: 'enfermeria',
  CUARENTENA: 'cuarentena',
  ENGORDE: 'engorde',
  ALMACENAMIENTO: 'almacenamiento',
  ADMINISTRACION: 'administracion',
  SERVICIOS: 'servicios'
};

// Certificaciones del rancho
export const CERTIFICATIONS = {
  ORGANICO: 'organico',
  BIENESTAR_ANIMAL: 'bienestar_animal',
  SOSTENIBLE: 'sostenible',
  CALIDAD: 'calidad',
  AMBIENTAL: 'ambiental',
  TRAZABILIDAD: 'trazabilidad',
  HACCP: 'haccp',
  ISO: 'iso'
};

// Estados de certificación
export const CERTIFICATION_STATUS = {
  VIGENTE: 'vigente',
  VENCIDA: 'vencida',
  EN_PROCESO: 'en_proceso',
  SUSPENDIDA: 'suspendida',
  DENEGADA: 'denegada'
};

// Niveles de acceso al rancho
export const ACCESS_LEVELS = {
  PROPIETARIO: 'propietario',
  ADMINISTRADOR: 'administrador',
  VETERINARIO: 'veterinario',
  CAPATAZ: 'capataz',
  TRABAJADOR: 'trabajador',
  VISITANTE: 'visitante',
  CONSULTOR: 'consultor'
};

// Tipos de alertas del rancho
export const RANCH_ALERTS = {
  MANTENIMIENTO: 'mantenimiento',
  SEGURIDAD: 'seguridad',
  AMBIENTAL: 'ambiental',
  SANITARIA: 'sanitaria',
  FINANCIERA: 'financiera',
  OPERACIONAL: 'operacional'
};

// Prioridades de alertas
export const ALERT_PRIORITIES = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta',
  CRITICA: 'critica',
  URGENTE: 'urgente'
};

// Unidades de medida para áreas
export const AREA_UNITS = {
  HECTAREAS: 'hectareas',
  METROS_CUADRADOS: 'metros_cuadrados',
  ACRES: 'acres',
  MANZANAS: 'manzanas',
  FANEGADAS: 'fanegadas'
};

// Capacidades del rancho
export const RANCH_CAPACITIES = {
  BOVINOS_TOTAL: 'bovinos_total',
  BOVINOS_LECHEROS: 'bovinos_lecheros',
  BOVINOS_ENGORDE: 'bovinos_engorde',
  BOVINOS_CRIA: 'bovinos_cria',
  EMPLEADOS: 'empleados',
  VISITANTES: 'visitantes'
};

// Rangos de capacidad de bovinos
export const CATTLE_CAPACITY_RANGES = {
  PEQUEÑO: { min: 1, max: 50 },
  MEDIANO: { min: 51, max: 200 },
  GRANDE: { min: 201, max: 500 },
  MUY_GRANDE: { min: 501, max: 2000 },
  INDUSTRIAL: { min: 2001, max: 10000 }
};

// Tecnologías aplicables
export const RANCH_TECHNOLOGIES = {
  RFID: 'rfid',
  GPS: 'gps',
  DRONES: 'drones',
  SENSORES_IOT: 'sensores_iot',
  AUTOMATIZACION: 'automatizacion',
  SOFTWARE_GESTION: 'software_gestion',
  CAMARAS_SEGURIDAD: 'camaras_seguridad',
  SISTEMAS_CLIMA: 'sistemas_clima'
};

// Estados de adopción tecnológica
export const TECH_ADOPTION_STATUS = {
  NO_ADOPTADA: 'no_adoptada',
  EN_EVALUACION: 'en_evaluacion',
  EN_IMPLEMENTACION: 'en_implementacion',
  IMPLEMENTADA: 'implementada',
  OPTIMIZADA: 'optimizada'
};

// Tipos de reportes del rancho
export const RANCH_REPORT_TYPES = {
  GENERAL: 'general',
  BOVINOS: 'bovinos',
  PRODUCCION: 'produccion',
  FINANZAS: 'finanzas',
  SALUD: 'salud',
  INFRAESTRUCTURA: 'infraestructura',
  PERSONAL: 'personal',
  AMBIENTAL: 'ambiental'
};

// Configuraciones de seguridad
export const SECURITY_LEVELS = {
  BASICO: 'basico',
  INTERMEDIO: 'intermedio',
  AVANZADO: 'avanzado',
  MAXIMO: 'maximo'
};

// Validaciones para datos del rancho
export const RANCH_VALIDATIONS = {
  MIN_AREA: 0.1, // hectáreas
  MAX_AREA: 100000, // hectáreas
  MIN_CAPACITY: 1,
  MAX_CAPACITY: 50000,
  MIN_EMPLOYEES: 0,
  MAX_EMPLOYEES: 1000
};

// Estructura base para registro de rancho
export const BASE_RANCH_RECORD = {
  id: null,
  name: '',
  description: '',
  type: RANCH_TYPES.MIXTO,
  status: RANCH_STATUS.ACTIVO,
  size: RANCH_SIZES.MEDIANO,
  area: 0,
  area_unit: AREA_UNITS.HECTAREAS,
  location: {
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    latitude: null,
    longitude: null
  },
  contact: {
    phone: '',
    email: '',
    website: '',
    emergency_contact: ''
  },
  management_system: MANAGEMENT_SYSTEMS.SEMI_INTENSIVO,
  terrain_type: TERRAIN_TYPES.ONDULADO,
  climate_type: CLIMATE_TYPES.TEMPLADO,
  water_sources: [],
  pasture_types: [],
  infrastructure: [],
  capacities: {},
  certifications: [],
  technologies: [],
  owner_id: null,
  manager_id: null,
  founded_date: null,
  created_at: null,
  updated_at: null
};

// Configuración predeterminada del rancho
export const DEFAULT_RANCH_CONFIG = {
  type: RANCH_TYPES.MIXTO,
  status: RANCH_STATUS.ACTIVO,
  size: RANCH_SIZES.MEDIANO,
  managementSystem: MANAGEMENT_SYSTEMS.SEMI_INTENSIVO,
  terrainType: TERRAIN_TYPES.ONDULADO,
  climateType: CLIMATE_TYPES.TEMPLADO,
  areaUnit: AREA_UNITS.HECTAREAS,
  securityLevel: SECURITY_LEVELS.INTERMEDIO
};

// Mapeo de colores para la interfaz
export const RANCH_CHART_COLORS = {
  [RANCH_TYPES.LECHERO]: '#3B82F6',
  [RANCH_TYPES.GANADERO]: '#EF4444',
  [RANCH_TYPES.MIXTO]: '#10B981',
  [RANCH_TYPES.ENGORDE]: '#F59E0B',
  [RANCH_TYPES.CRIA]: '#8B5CF6',
  [RANCH_TYPES.REPRODUCCION]: '#EC4899'
};

// Íconos para tipos de rancho
export const RANCH_ICONS = {
  [RANCH_TYPES.LECHERO]: 'milk',
  [RANCH_TYPES.GANADERO]: 'cow',
  [RANCH_TYPES.MIXTO]: 'farm',
  [RANCH_TYPES.ENGORDE]: 'scale',
  [RANCH_TYPES.CRIA]: 'baby',
  [RANCH_TYPES.REPRODUCCION]: 'heart'
};

// Exportar todas las constantes como objeto por defecto
export default {
  RANCH_TYPES,
  RANCH_STATUS,
  RANCH_SIZES,
  MANAGEMENT_SYSTEMS,
  TERRAIN_TYPES,
  CLIMATE_TYPES,
  WATER_SOURCES,
  PASTURE_TYPES,
  PASTURE_CONDITIONS,
  INFRASTRUCTURE_TYPES,
  INFRASTRUCTURE_STATUS,
  RANCH_ZONES,
  CERTIFICATIONS,
  CERTIFICATION_STATUS,
  ACCESS_LEVELS,
  RANCH_ALERTS,
  ALERT_PRIORITIES,
  AREA_UNITS,
  RANCH_CAPACITIES,
  CATTLE_CAPACITY_RANGES,
  RANCH_TECHNOLOGIES,
  TECH_ADOPTION_STATUS,
  RANCH_REPORT_TYPES,
  SECURITY_LEVELS,
  RANCH_VALIDATIONS,
  BASE_RANCH_RECORD,
  DEFAULT_RANCH_CONFIG,
  RANCH_CHART_COLORS,
  RANCH_ICONS
};