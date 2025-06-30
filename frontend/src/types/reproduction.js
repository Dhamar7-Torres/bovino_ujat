/**
 * Tipos y constantes para el módulo de reproducción
 * Sistema de gestión de bovinos - Gestión reproductiva y eventos de cría
 */

// Tipos de eventos reproductivos
export const REPRODUCTIVE_EVENTS = {
  CELO: 'celo',
  SERVICIO: 'servicio',
  INSEMINACION: 'inseminacion',
  MONTA_NATURAL: 'monta_natural',
  CONFIRMACION_PREÑEZ: 'confirmacion_preñez',
  PARTO: 'parto',
  ABORTO: 'aborto',
  DESTETE: 'destete',
  SECADO: 'secado',
  PALPACION: 'palpacion',
  ECOGRAFIA: 'ecografia'
};

// Estados reproductivos
export const REPRODUCTIVE_STATUS = {
  VACIA: 'vacia',
  SERVIDA: 'servida',
  PREÑADA: 'preñada',
  PARIDA: 'parida',
  LACTANDO: 'lactando',
  SECA: 'seca',
  DESCARTE: 'descarte',
  NOVILLA: 'novilla',
  TORO_REPRODUCTOR: 'toro_reproductor'
};

// Tipos de servicio
export const SERVICE_TYPES = {
  INSEMINACION_ARTIFICIAL: 'inseminacion_artificial',
  MONTA_NATURAL: 'monta_natural',
  TRANSFERENCIA_EMBRIONES: 'transferencia_embriones',
  FERTILIZACION_IN_VITRO: 'fertilizacion_in_vitro'
};

// Métodos de detección de celo
export const ESTRUS_DETECTION_METHODS = {
  VISUAL: 'visual',
  MARCADOR_CELO: 'marcador_celo',
  PODOMETRO: 'podometro',
  SENSOR_ACTIVIDAD: 'sensor_actividad',
  PROGESTERONA: 'progesterona',
  ECOGRAFIA: 'ecografia',
  TORO_MARCADOR: 'toro_marcador'
};

// Intensidad del celo
export const ESTRUS_INTENSITY = {
  LEVE: 'leve',
  MODERADA: 'moderada',
  FUERTE: 'fuerte',
  MUY_FUERTE: 'muy_fuerte'
};

// Tipos de semen
export const SEMEN_TYPES = {
  FRESCO: 'fresco',
  REFRIGERADO: 'refrigerado',
  CONGELADO: 'congelado',
  SEXADO: 'sexado'
};

// Calidad del semen
export const SEMEN_QUALITY = {
  EXCELENTE: 'excelente',
  BUENA: 'buena',
  REGULAR: 'regular',
  DEFICIENTE: 'deficiente'
};

// Métodos de diagnóstico de preñez
export const PREGNANCY_DIAGNOSIS_METHODS = {
  PALPACION_RECTAL: 'palpacion_rectal',
  ECOGRAFIA: 'ecografia',
  ANALISIS_SANGRE: 'analisis_sangre',
  ANALISIS_LECHE: 'analisis_leche',
  RETORNO_CELO: 'retorno_celo'
};

// Resultados de diagnóstico de preñez
export const PREGNANCY_RESULTS = {
  PREÑADA: 'preñada',
  VACIA: 'vacia',
  DUDOSA: 'dudosa',
  REPETIR_EXAMEN: 'repetir_examen'
};

// Tipos de parto
export const BIRTH_TYPES = {
  NORMAL: 'normal',
  ASISTIDO: 'asistido',
  CESAREA: 'cesarea',
  DISTOCICO: 'distocico'
};

// Dificultades del parto
export const BIRTH_DIFFICULTIES = {
  NINGUNA: 'ninguna',
  LEVE: 'leve',
  MODERADA: 'moderada',
  SEVERA: 'severa',
  EMERGENCIA: 'emergencia'
};

// Estado de las crías al nacer
export const CALF_BIRTH_STATUS = {
  VIVO_NORMAL: 'vivo_normal',
  VIVO_DEBIL: 'vivo_debil',
  MUERTO: 'muerto',
  MALFORMACION: 'malformacion'
};

// Sexo de las crías
export const CALF_SEX = {
  MACHO: 'macho',
  HEMBRA: 'hembra',
  INDEFINIDO: 'indefinido'
};

// Tipos de aborto
export const ABORTION_TYPES = {
  TEMPRANO: 'temprano',    // < 42 días
  INTERMEDIO: 'intermedio', // 42-260 días
  TARDIO: 'tardio'         // > 260 días
};

// Causas de aborto
export const ABORTION_CAUSES = {
  INFECCIOSA: 'infecciosa',
  NUTRICIONAL: 'nutricional',
  TOXICA: 'toxica',
  GENETICA: 'genetica',
  TRAUMATICA: 'traumatica',
  HORMONAL: 'hormonal',
  ESTRES: 'estres',
  DESCONOCIDA: 'desconocida'
};

// Protocolos de sincronización
export const SYNCHRONIZATION_PROTOCOLS = {
  OVSYNCH: 'ovsynch',
  PRESYNCH: 'presynch',
  COSYNCH: 'cosynch',
  CIDR: 'cidr',
  PROGESTERONA: 'progesterona',
  PROSTAGLANDINAS: 'prostaglandinas'
};

// Hormonas utilizadas
export const HORMONES_USED = {
  GnRH: 'gnrh',
  PGF2ALFA: 'pgf2alfa',
  PROGESTERONA: 'progesterona',
  ESTRADIOL: 'estradiol',
  hCG: 'hcg',
  FSH: 'fsh',
  LH: 'lh'
};

// Razones de descarte reproductivo
export const CULLING_REASONS = {
  INFERTILIDAD: 'infertilidad',
  ABORTOS_REPETIDOS: 'abortos_repetidos',
  PROBLEMAS_PARTO: 'problemas_parto',
  BAJA_PRODUCCION: 'baja_produccion',
  EDAD_AVANZADA: 'edad_avanzada',
  LESIONES: 'lesiones',
  ENFERMEDAD: 'enfermedad'
};

// Condición corporal
export const BODY_CONDITION_SCORES = {
  MUY_FLACA: 1,
  FLACA: 2,
  MODERADA: 3,
  BUENA: 4,
  GORDA: 5
};

// Fases del ciclo estral
export const ESTRAL_CYCLE_PHASES = {
  PROESTRO: 'proestro',
  ESTRO: 'estro',
  METESTRO: 'metestro',
  DIESTRO: 'diestro'
};

// Intervalos reproductivos importantes
export const REPRODUCTIVE_INTERVALS = {
  CICLO_ESTRAL: 21,          // días
  GESTACION: 280,            // días
  PUERPERIO: 45,            // días
  SERVICIO_CONCEPCION: 85,   // días
  PARTO_PRIMER_CELO: 45,    // días
  DESTETE: 210              // días
};

// Índices reproductivos
export const REPRODUCTIVE_INDICES = {
  TASA_CONCEPCION: 'tasa_concepcion',
  TASA_PREÑEZ: 'tasa_preñez',
  INTERVALO_PARTOS: 'intervalo_partos',
  NUMERO_SERVICIOS: 'numero_servicios',
  DIAS_ABIERTOS: 'dias_abiertos',
  EDAD_PRIMER_PARTO: 'edad_primer_parto'
};

// Objetivos reproductivos ideales
export const REPRODUCTIVE_TARGETS = {
  TASA_CONCEPCION_MIN: 40,      // %
  TASA_PREÑEZ_MIN: 20,          // %
  INTERVALO_PARTOS_MAX: 365,    // días
  SERVICIOS_POR_CONCEPCION_MAX: 2.5,
  DIAS_ABIERTOS_MAX: 120,       // días
  EDAD_PRIMER_PARTO_MAX: 30     // meses
};

// Tecnologías reproductivas
export const REPRODUCTIVE_TECHNOLOGIES = {
  INSEMINACION_ARTIFICIAL: 'inseminacion_artificial',
  TRANSFERENCIA_EMBRIONES: 'transferencia_embriones',
  FERTILIZACION_IN_VITRO: 'fertilizacion_in_vitro',
  SEXADO_SEMEN: 'sexado_semen',
  CLONACION: 'clonacion',
  MARCADORES_GENETICOS: 'marcadores_geneticos'
};

// Programas de mejoramiento genético
export const GENETIC_PROGRAMS = {
  SELECCION_INDIVIDUAL: 'seleccion_individual',
  CRUZAMIENTO: 'cruzamiento',
  CONSANGUINIDAD: 'consanguinidad',
  HIBRIDACION: 'hibridacion',
  GENOMICA: 'genomica'
};

// Alertas reproductivas
export const REPRODUCTIVE_ALERTS = {
  CELO_PERDIDO: 'celo_perdido',
  REPETICION_CELO: 'repeticion_celo',
  ABORTO: 'aborto',
  PARTO_ATRASADO: 'parto_atrasado',
  PROBLEMA_REPRODUCTIVO: 'problema_reproductivo',
  REVISION_VETERINARIA: 'revision_veterinaria'
};

// Validaciones reproductivas
export const REPRODUCTIVE_VALIDATIONS = {
  MIN_AGE_FIRST_SERVICE: 15,    // meses
  MAX_AGE_BREEDING: 180,        // meses
  MIN_WEIGHT_BREEDING: 300,     // kg
  MAX_SERVICES_PER_CYCLE: 5,
  MIN_GESTATION_DAYS: 270,
  MAX_GESTATION_DAYS: 295
};

// Estructura base para evento reproductivo
export const BASE_REPRODUCTIVE_EVENT = {
  id: null,
  bovine_id: null,
  event_type: '',
  event_date: null,
  event_time: null,
  status: '',
  details: {
    intensity: null,
    method: null,
    technician: '',
    observations: '',
    location: null
  },
  service_details: {
    bull_id: null,
    semen_batch: null,
    semen_quality: null,
    inseminator: '',
    protocol: null
  },
  pregnancy_details: {
    diagnosis_method: null,
    result: null,
    due_date: null,
    veterinarian: ''
  },
  birth_details: {
    calf_id: null,
    birth_type: null,
    difficulty: null,
    calf_sex: null,
    birth_weight: null,
    calf_status: null,
    complications: ''
  },
  created_by: null,
  created_at: null,
  updated_at: null
};

// Configuración predeterminada reproductiva
export const DEFAULT_REPRODUCTIVE_CONFIG = {
  detectionMethod: ESTRUS_DETECTION_METHODS.VISUAL,
  serviceType: SERVICE_TYPES.INSEMINACION_ARTIFICIAL,
  semenType: SEMEN_TYPES.CONGELADO,
  diagnosisMethod: PREGNANCY_DIAGNOSIS_METHODS.PALPACION_RECTAL,
  gestation_days: REPRODUCTIVE_INTERVALS.GESTACION,
  estralCycleDays: REPRODUCTIVE_INTERVALS.CICLO_ESTRAL
};

// Mapeo de colores para eventos
export const EVENT_COLORS = {
  [REPRODUCTIVE_EVENTS.CELO]: '#EC4899',
  [REPRODUCTIVE_EVENTS.SERVICIO]: '#3B82F6',
  [REPRODUCTIVE_EVENTS.INSEMINACION]: '#8B5CF6',
  [REPRODUCTIVE_EVENTS.CONFIRMACION_PREÑEZ]: '#10B981',
  [REPRODUCTIVE_EVENTS.PARTO]: '#F59E0B',
  [REPRODUCTIVE_EVENTS.ABORTO]: '#EF4444',
  [REPRODUCTIVE_EVENTS.DESTETE]: '#6B7280'
};

// Íconos para eventos reproductivos
export const EVENT_ICONS = {
  [REPRODUCTIVE_EVENTS.CELO]: 'heart',
  [REPRODUCTIVE_EVENTS.SERVICIO]: 'zap',
  [REPRODUCTIVE_EVENTS.INSEMINACION]: 'syringe',
  [REPRODUCTIVE_EVENTS.CONFIRMACION_PREÑEZ]: 'check-circle',
  [REPRODUCTIVE_EVENTS.PARTO]: 'baby',
  [REPRODUCTIVE_EVENTS.ABORTO]: 'x-circle',
  [REPRODUCTIVE_EVENTS.DESTETE]: 'scissors'
};

// Exportar todas las constantes como objeto por defecto
export default {
  REPRODUCTIVE_EVENTS,
  REPRODUCTIVE_STATUS,
  SERVICE_TYPES,
  ESTRUS_DETECTION_METHODS,
  ESTRUS_INTENSITY,
  SEMEN_TYPES,
  SEMEN_QUALITY,
  PREGNANCY_DIAGNOSIS_METHODS,
  PREGNANCY_RESULTS,
  BIRTH_TYPES,
  BIRTH_DIFFICULTIES,
  CALF_BIRTH_STATUS,
  CALF_SEX,
  ABORTION_TYPES,
  ABORTION_CAUSES,
  SYNCHRONIZATION_PROTOCOLS,
  HORMONES_USED,
  CULLING_REASONS,
  BODY_CONDITION_SCORES,
  ESTRAL_CYCLE_PHASES,
  REPRODUCTIVE_INTERVALS,
  REPRODUCTIVE_INDICES,
  REPRODUCTIVE_TARGETS,
  REPRODUCTIVE_TECHNOLOGIES,
  GENETIC_PROGRAMS,
  REPRODUCTIVE_ALERTS,
  REPRODUCTIVE_VALIDATIONS,
  BASE_REPRODUCTIVE_EVENT,
  DEFAULT_REPRODUCTIVE_CONFIG,
  EVENT_COLORS,
  EVENT_ICONS
};