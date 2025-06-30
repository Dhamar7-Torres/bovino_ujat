/**
 * Definiciones de tipos, esquemas y constantes para gestión de salud veterinaria
 * Sistema de gestión de bovinos - Salud, medicina preventiva y tratamientos
 */

// =============================================
// CONSTANTES DE SALUD VETERINARIA
// =============================================

/**
 * Tipos de consultas veterinarias
 */
export const CONSULTATION_TYPES = {
  ROUTINE_CHECKUP: 'routine_checkup',        // Chequeo rutinario
  VACCINATION: 'vaccination',                // Vacunación
  TREATMENT: 'treatment',                   // Tratamiento
  EMERGENCY: 'emergency',                   // Emergencia
  PREGNANCY_CHECK: 'pregnancy_check',       // Chequeo de gestación
  REPRODUCTIVE_EXAM: 'reproductive_exam',   // Examen reproductivo
  SURGERY: 'surgery',                       // Cirugía
  DEWORMING: 'deworming',                   // Desparasitación
  HOOF_CARE: 'hoof_care',                   // Cuidado de pezuñas
  DENTAL_CARE: 'dental_care',               // Cuidado dental
  QUARANTINE_EXAM: 'quarantine_exam',       // Examen de cuarentena
  PRE_SALE_EXAM: 'pre_sale_exam',          // Examen pre-venta
  NECROPSY: 'necropsy',                     // Necropsia
  LABORATORY_FOLLOW_UP: 'laboratory_follow_up' // Seguimiento de laboratorio
};

/**
 * Estados de salud de bovinos
 */
export const HEALTH_STATUS = {
  HEALTHY: 'healthy',                // Saludable
  SICK: 'sick',                     // Enfermo
  UNDER_TREATMENT: 'under_treatment', // En tratamiento
  RECOVERING: 'recovering',          // Recuperándose
  QUARANTINE: 'quarantine',         // En cuarentena
  CHRONIC: 'chronic',               // Condición crónica
  CRITICAL: 'critical',             // Estado crítico
  DECEASED: 'deceased'              // Fallecido
};

/**
 * Estados de consultas veterinarias
 */
export const CONSULTATION_STATUS = {
  SCHEDULED: 'scheduled',    // Programada
  IN_PROGRESS: 'in_progress', // En progreso
  COMPLETED: 'completed',    // Completada
  CANCELLED: 'cancelled',    // Cancelada
  RESCHEDULED: 'rescheduled', // Reprogramada
  NO_SHOW: 'no_show'        // No se presentó
};

/**
 * Prioridades de consultas médicas
 */
export const MEDICAL_PRIORITY = {
  LOW: 'low',          // Baja
  ROUTINE: 'routine',  // Rutinaria
  MEDIUM: 'medium',    // Media
  HIGH: 'high',        // Alta
  URGENT: 'urgent',    // Urgente
  EMERGENCY: 'emergency' // Emergencia
};

/**
 * Tipos de vacunas comunes en bovinos
 */
export const VACCINE_TYPES = {
  // Enfermedades virales
  FOOT_AND_MOUTH: 'foot_and_mouth',           // Fiebre aftosa
  BVD: 'bvd',                                 // Diarrea viral bovina
  IBR: 'ibr',                                 // Rinotraqueítis infecciosa bovina
  PI3: 'pi3',                                 // Parainfluenza 3
  RABIES: 'rabies',                           // Rabia
  
  // Enfermedades bacterianas
  BRUCELLOSIS: 'brucellosis',                 // Brucelosis
  ANTHRAX: 'anthrax',                         // Carbón bacteriano
  BLACKLEG: 'blackleg',                       // Carbón sintomático
  TETANUS: 'tetanus',                         // Tétanos
  PASTEURELLOSIS: 'pasteurellosis',           // Pasteurelosis
  
  // Enfermedades clostridianas
  CLOSTRIDIAL: 'clostridial',                 // Clostridiosis
  ENTEROTOXEMIA: 'enterotoxemia',             // Enterotoxemia
  
  // Vacunas combinadas
  RESPIRATORY_COMPLEX: 'respiratory_complex',  // Complejo respiratorio
  REPRODUCTIVE: 'reproductive',               // Reproductiva
  MULTIVALENT: 'multivalent'                  // Multivalente
};

/**
 * Tipos de medicamentos veterinarios
 */
export const MEDICATION_TYPES = {
  // Antibióticos
  ANTIBIOTIC: 'antibiotic',
  PENICILLIN: 'penicillin',
  TETRACYCLINE: 'tetracycline',
  SULFONAMIDE: 'sulfonamide',
  FLUOROQUINOLONE: 'fluoroquinolone',
  
  // Antiparasitarios
  ANTIPARASITIC: 'antiparasitic',
  ANTHELMINTIC: 'anthelmintic',
  ACARICIDE: 'acaricide',
  INSECTICIDE: 'insecticide',
  
  // Antiinflamatorios
  ANTI_INFLAMMATORY: 'anti_inflammatory',
  NSAID: 'nsaid',
  CORTICOSTEROID: 'corticosteroid',
  
  // Hormonas y reproductivos
  HORMONE: 'hormone',
  REPRODUCTIVE: 'reproductive',
  OXYTOCIN: 'oxytocin',
  PROSTAGLANDIN: 'prostaglandin',
  
  // Vitaminas y suplementos
  VITAMIN: 'vitamin',
  MINERAL: 'mineral',
  SUPPLEMENT: 'supplement',
  
  // Anestésicos y sedantes
  ANESTHETIC: 'anesthetic',
  SEDATIVE: 'sedative',
  ANALGESIC: 'analgesic',
  
  // Otros
  ANTISEPTIC: 'antiseptic',
  DISINFECTANT: 'disinfectant',
  PROBIOTIC: 'probiotic',
  VACCINE: 'vaccine'
};

/**
 * Vías de administración de medicamentos
 */
export const ADMINISTRATION_ROUTES = {
  INTRAMUSCULAR: 'intramuscular',     // Intramuscular
  INTRAVENOUS: 'intravenous',         // Intravenosa
  SUBCUTANEOUS: 'subcutaneous',       // Subcutánea
  ORAL: 'oral',                       // Oral
  TOPICAL: 'topical',                 // Tópica
  INTRAUTERINE: 'intrauterine',       // Intrauterina
  INTRANASAL: 'intranasal',           // Intranasal
  INTRAMAMMARY: 'intramammary',       // Intramamaria
  EPIDURAL: 'epidural',               // Epidural
  INTRA_ARTICULAR: 'intra_articular', // Intraarticular
  CONJUNCTIVAL: 'conjunctival',       // Conjuntival
  RECTAL: 'rectal'                    // Rectal
};

/**
 * Tipos de diagnósticos veterinarios
 */
export const DIAGNOSIS_TYPES = {
  // Enfermedades infecciosas
  BACTERIAL_INFECTION: 'bacterial_infection',
  VIRAL_INFECTION: 'viral_infection',
  FUNGAL_INFECTION: 'fungal_infection',
  PARASITIC_INFECTION: 'parasitic_infection',
  
  // Enfermedades metabólicas
  METABOLIC_DISORDER: 'metabolic_disorder',
  NUTRITIONAL_DEFICIENCY: 'nutritional_deficiency',
  KETOSIS: 'ketosis',
  MILK_FEVER: 'milk_fever',
  GRASS_TETANY: 'grass_tetany',
  
  // Enfermedades reproductivas
  REPRODUCTIVE_DISORDER: 'reproductive_disorder',
  MASTITIS: 'mastitis',
  METRITIS: 'metritis',
  DYSTOCIA: 'dystocia',
  ABORTION: 'abortion',
  INFERTILITY: 'infertility',
  
  // Enfermedades respiratorias
  RESPIRATORY_DISEASE: 'respiratory_disease',
  PNEUMONIA: 'pneumonia',
  BRONCHITIS: 'bronchitis',
  
  // Enfermedades digestivas
  DIGESTIVE_DISORDER: 'digestive_disorder',
  DIARRHEA: 'diarrhea',
  BLOAT: 'bloat',
  ACIDOSIS: 'acidosis',
  
  // Lesiones y traumatismos
  INJURY: 'injury',
  FRACTURE: 'fracture',
  LACERATION: 'laceration',
  LAMENESS: 'lameness',
  
  // Otros
  SKIN_CONDITION: 'skin_condition',
  EYE_CONDITION: 'eye_condition',
  NERVOUS_SYSTEM: 'nervous_system',
  CONGENITAL_DEFECT: 'congenital_defect'
};

/**
 * Signos vitales y parámetros normales
 */
export const VITAL_SIGNS_RANGES = {
  TEMPERATURE: {
    normal: { min: 38.0, max: 39.5 }, // °C
    unit: '°C'
  },
  HEART_RATE: {
    adult: { min: 48, max: 84 },      // latidos por minuto
    calf: { min: 100, max: 140 },
    unit: 'bpm'
  },
  RESPIRATORY_RATE: {
    adult: { min: 26, max: 50 },      // respiraciones por minuto
    calf: { min: 40, max: 60 },
    unit: 'rpm'
  },
  RUMEN_MOVEMENTS: {
    normal: { min: 2, max: 4 },       // por 2 minutos
    unit: 'movimientos/2min'
  }
};

/**
 * Condición corporal (escala 1-9)
 */
export const BODY_CONDITION_SCALE = {
  1: { description: 'Emaciado', status: 'critical' },
  2: { description: 'Muy delgado', status: 'poor' },
  3: { description: 'Delgado', status: 'below_average' },
  4: { description: 'Moderadamente delgado', status: 'below_average' },
  5: { description: 'Condición moderada', status: 'ideal' },
  6: { description: 'Moderadamente gordo', status: 'above_average' },
  7: { description: 'Gordo', status: 'above_average' },
  8: { description: 'Muy gordo', status: 'poor' },
  9: { description: 'Obeso', status: 'critical' }
};

// =============================================
// ESQUEMAS DE VALIDACIÓN
// =============================================

/**
 * Esquema de validación para consultas veterinarias
 */
export const HEALTH_RECORD_SCHEMA = {
  bovine_id: {
    required: true,
    type: 'string',
    format: 'uuid',
    message: 'Bovino requerido'
  },
  consultation_type: {
    required: true,
    type: 'string',
    enum: Object.values(CONSULTATION_TYPES),
    message: 'Tipo de consulta inválido'
  },
  consultation_date: {
    required: true,
    type: 'datetime',
    message: 'Fecha de consulta requerida'
  },
  veterinarian_id: {
    required: true,
    type: 'string',
    format: 'uuid',
    message: 'Veterinario requerido'
  },
  diagnosis: {
    required: false,
    type: 'string',
    maxLength: 1000,
    message: 'Diagnóstico no puede exceder 1000 caracteres'
  },
  treatment: {
    required: false,
    type: 'string',
    maxLength: 1000,
    message: 'Tratamiento no puede exceder 1000 caracteres'
  },
  vital_signs: {
    required: false,
    type: 'object',
    properties: {
      temperature: { type: 'number', min: 35, max: 45 },
      heart_rate: { type: 'number', min: 30, max: 200 },
      respiratory_rate: { type: 'number', min: 10, max: 100 },
      rumen_movements: { type: 'number', min: 0, max: 10 }
    }
  },
  body_condition: {
    required: false,
    type: 'number',
    min: 1,
    max: 9,
    message: 'Condición corporal debe estar entre 1 y 9'
  },
  weight: {
    required: false,
    type: 'number',
    min: 20,
    max: 1500,
    message: 'Peso debe estar entre 20 y 1500 kg'
  },
  cost: {
    required: false,
    type: 'number',
    min: 0,
    max: 999999.99,
    decimals: 2,
    message: 'Costo inválido'
  },
  next_appointment: {
    required: false,
    type: 'datetime',
    futureDate: true,
    message: 'Próxima cita debe ser fecha futura'
  },
  priority: {
    required: false,
    type: 'string',
    enum: Object.values(MEDICAL_PRIORITY),
    default: MEDICAL_PRIORITY.ROUTINE,
    message: 'Prioridad inválida'
  },
  location: {
    required: false,
    type: 'object',
    properties: {
      latitude: { type: 'number', min: -90, max: 90 },
      longitude: { type: 'number', min: -180, max: 180 },
      address: { type: 'string', maxLength: 300 }
    }
  },
  observations: {
    required: false,
    type: 'string',
    maxLength: 2000,
    message: 'Observaciones no pueden exceder 2000 caracteres'
  }
};

/**
 * Esquema de validación para vacunaciones
 */
export const VACCINATION_SCHEMA = {
  bovine_id: {
    required: true,
    type: 'string',
    format: 'uuid',
    message: 'Bovino requerido'
  },
  vaccine_type: {
    required: true,
    type: 'string',
    enum: Object.values(VACCINE_TYPES),
    message: 'Tipo de vacuna inválido'
  },
  vaccine_name: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 200,
    message: 'Nombre de vacuna debe tener entre 2 y 200 caracteres'
  },
  batch_number: {
    required: true,
    type: 'string',
    minLength: 3,
    maxLength: 50,
    message: 'Número de lote requerido'
  },
  dosage: {
    required: true,
    type: 'string',
    maxLength: 50,
    message: 'Dosis requerida'
  },
  administration_route: {
    required: true,
    type: 'string',
    enum: Object.values(ADMINISTRATION_ROUTES),
    message: 'Vía de administración inválida'
  },
  administration_date: {
    required: true,
    type: 'datetime',
    maxDate: 'today',
    message: 'Fecha de aplicación no puede ser futura'
  },
  next_due_date: {
    required: false,
    type: 'date',
    futureDate: true,
    message: 'Próxima dosis debe ser fecha futura'
  },
  veterinarian_id: {
    required: true,
    type: 'string',
    format: 'uuid',
    message: 'Veterinario requerido'
  },
  expiration_date: {
    required: false,
    type: 'date',
    message: 'Fecha de vencimiento inválida'
  },
  manufacturer: {
    required: false,
    type: 'string',
    maxLength: 100,
    message: 'Fabricante no puede exceder 100 caracteres'
  },
  cost: {
    required: false,
    type: 'number',
    min: 0,
    max: 9999.99,
    decimals: 2,
    message: 'Costo inválido'
  },
  reaction: {
    required: false,
    type: 'string',
    enum: ['none', 'mild', 'moderate', 'severe'],
    default: 'none',
    message: 'Reacción inválida'
  },
  notes: {
    required: false,
    type: 'string',
    maxLength: 500,
    message: 'Notas no pueden exceder 500 caracteres'
  }
};

/**
 * Esquema de validación para tratamientos
 */
export const TREATMENT_SCHEMA = {
  health_record_id: {
    required: true,
    type: 'string',
    format: 'uuid',
    message: 'Registro de salud requerido'
  },
  medication_id: {
    required: true,
    type: 'string',
    format: 'uuid',
    message: 'Medicamento requerido'
  },
  dosage: {
    required: true,
    type: 'string',
    maxLength: 100,
    message: 'Dosis requerida'
  },
  administration_route: {
    required: true,
    type: 'string',
    enum: Object.values(ADMINISTRATION_ROUTES),
    message: 'Vía de administración inválida'
  },
  frequency: {
    required: true,
    type: 'string',
    maxLength: 100,
    message: 'Frecuencia requerida'
  },
  start_date: {
    required: true,
    type: 'date',
    message: 'Fecha de inicio requerida'
  },
  end_date: {
    required: false,
    type: 'date',
    afterField: 'start_date',
    message: 'Fecha de fin debe ser posterior al inicio'
  },
  duration_days: {
    required: false,
    type: 'number',
    min: 1,
    max: 365,
    message: 'Duración debe estar entre 1 y 365 días'
  },
  withdrawal_period: {
    required: false,
    type: 'number',
    min: 0,
    max: 365,
    message: 'Período de retiro debe estar entre 0 y 365 días'
  },
  cost_per_dose: {
    required: false,
    type: 'number',
    min: 0,
    max: 9999.99,
    decimals: 2,
    message: 'Costo por dosis inválido'
  },
  total_cost: {
    required: false,
    type: 'number',
    min: 0,
    max: 99999.99,
    decimals: 2,
    message: 'Costo total inválido'
  },
  administered_by: {
    required: true,
    type: 'string',
    format: 'uuid',
    message: 'Administrado por requerido'
  },
  notes: {
    required: false,
    type: 'string',
    maxLength: 1000,
    message: 'Notas no pueden exceder 1000 caracteres'
  }
};

/**
 * Esquema de validación para filtros de salud
 */
export const HEALTH_FILTER_SCHEMA = {
  search: {
    required: false,
    type: 'string',
    maxLength: 100,
    message: 'Búsqueda muy larga'
  },
  bovine_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'ID de bovino inválido'
  },
  consultation_type: {
    required: false,
    type: 'string',
    enum: Object.values(CONSULTATION_TYPES),
    message: 'Tipo de consulta inválido'
  },
  health_status: {
    required: false,
    type: 'string',
    enum: Object.values(HEALTH_STATUS),
    message: 'Estado de salud inválido'
  },
  veterinarian_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'ID de veterinario inválido'
  },
  priority: {
    required: false,
    type: 'string',
    enum: Object.values(MEDICAL_PRIORITY),
    message: 'Prioridad inválida'
  },
  date_start: {
    required: false,
    type: 'date',
    message: 'Fecha de inicio inválida'
  },
  date_end: {
    required: false,
    type: 'date',
    message: 'Fecha de fin inválida'
  },
  diagnosis_type: {
    required: false,
    type: 'string',
    enum: Object.values(DIAGNOSIS_TYPES),
    message: 'Tipo de diagnóstico inválido'
  },
  medication_type: {
    required: false,
    type: 'string',
    enum: Object.values(MEDICATION_TYPES),
    message: 'Tipo de medicamento inválido'
  },
  vaccine_type: {
    required: false,
    type: 'string',
    enum: Object.values(VACCINE_TYPES),
    message: 'Tipo de vacuna inválido'
  }
};

// =============================================
// DEFINICIONES DE TIPOS DE DATOS
// =============================================

/**
 * Tipo base para registros de salud veterinaria
 */
export const HEALTH_RECORD_TYPE = {
  id: 'string', // UUID
  bovine: {
    id: 'string',
    numero_identificacion: 'string',
    nombre: 'string?',
    raza: 'string?',
    sexo: 'string',
    edad_meses: 'number'
  },
  consultation_type: 'string', // CONSULTATION_TYPES
  consultation_date: 'datetime',
  status: 'string', // CONSULTATION_STATUS
  priority: 'string', // MEDICAL_PRIORITY
  
  // Personal médico
  veterinarian: {
    id: 'string',
    nombre: 'string',
    apellido: 'string',
    especialidad: 'string?',
    numero_cedula: 'string?'
  },
  assistant: {
    id: 'string?',
    nombre: 'string?',
    apellido: 'string?'
  },
  
  // Diagnóstico y tratamiento
  diagnosis: 'string?',
  diagnosis_type: 'string?', // DIAGNOSIS_TYPES
  treatment: 'string?',
  prognosis: 'string?',
  
  // Signos vitales
  vital_signs: {
    temperature: 'number?',
    heart_rate: 'number?',
    respiratory_rate: 'number?',
    rumen_movements: 'number?',
    mucous_membranes: 'string?',
    capillary_refill: 'string?'
  },
  
  // Examen físico
  physical_exam: {
    body_condition: 'number?',
    weight: 'number?',
    height: 'number?',
    general_appearance: 'string?',
    mobility: 'string?',
    appetite: 'string?',
    hydration: 'string?'
  },
  
  // Ubicación
  location: {
    latitude: 'number?',
    longitude: 'number?',
    address: 'string?',
    facility_name: 'string?',
    pen_number: 'string?'
  },
  
  // Costos
  consultation_cost: 'number?',
  medication_cost: 'number?',
  total_cost: 'number?',
  
  // Seguimiento
  next_appointment: 'datetime?',
  follow_up_required: 'boolean',
  follow_up_notes: 'string?',
  
  // Archivos adjuntos
  attachments: 'array',
  images: 'array',
  
  // Observaciones
  observations: 'string?',
  recommendations: 'string?',
  restrictions: 'string?',
  
  // Metadatos
  rancho_id: 'string',
  created_at: 'datetime',
  created_by: 'string',
  updated_at: 'datetime?',
  updated_by: 'string?'
};

/**
 * Tipo para vacunaciones
 */
export const VACCINATION_TYPE = {
  id: 'string', // UUID
  health_record_id: 'string?',
  bovine: {
    id: 'string',
    numero_identificacion: 'string',
    nombre: 'string?'
  },
  
  // Información de la vacuna
  vaccine_type: 'string', // VACCINE_TYPES
  vaccine_name: 'string',
  manufacturer: 'string?',
  batch_number: 'string',
  expiration_date: 'date?',
  
  // Administración
  dosage: 'string',
  administration_route: 'string', // ADMINISTRATION_ROUTES
  administration_date: 'datetime',
  administration_time: 'time?',
  
  // Personal
  veterinarian: {
    id: 'string',
    nombre: 'string',
    apellido: 'string'
  },
  administered_by: {
    id: 'string',
    nombre: 'string',
    apellido: 'string'
  },
  
  // Seguimiento
  next_due_date: 'date?',
  booster_required: 'boolean',
  series_complete: 'boolean',
  
  // Reacciones
  reaction: 'string', // 'none', 'mild', 'moderate', 'severe'
  reaction_description: 'string?',
  adverse_effects: 'string?',
  
  // Ubicación
  location: {
    latitude: 'number?',
    longitude: 'number?',
    address: 'string?',
    facility_name: 'string?'
  },
  
  // Costos
  cost: 'number?',
  
  // Notas
  notes: 'string?',
  
  // Metadatos
  rancho_id: 'string',
  created_at: 'datetime',
  created_by: 'string'
};

/**
 * Tipo para tratamientos con medicamentos
 */
export const TREATMENT_TYPE = {
  id: 'string', // UUID
  health_record_id: 'string',
  
  // Medicamento
  medication: {
    id: 'string',
    nombre_comercial: 'string',
    principio_activo: 'string',
    tipo: 'string', // MEDICATION_TYPES
    laboratorio: 'string?',
    presentacion: 'string?'
  },
  
  // Administración
  dosage: 'string',
  administration_route: 'string', // ADMINISTRATION_ROUTES
  frequency: 'string',
  
  // Duración del tratamiento
  start_date: 'date',
  end_date: 'date?',
  duration_days: 'number?',
  
  // Dosis individuales
  doses: 'array', // Array de DOSE_TYPE
  
  // Período de retiro
  withdrawal_period: 'number?', // días
  withdrawal_end_date: 'date?',
  
  // Personal
  prescribed_by: {
    id: 'string',
    nombre: 'string',
    apellido: 'string'
  },
  administered_by: {
    id: 'string',
    nombre: 'string',
    apellido: 'string'
  },
  
  // Estado del tratamiento
  status: 'string', // 'active', 'completed', 'discontinued', 'on_hold'
  completion_percentage: 'number',
  
  // Efectividad
  effectiveness: 'string?', // 'excellent', 'good', 'fair', 'poor'
  side_effects: 'string?',
  
  // Costos
  cost_per_dose: 'number?',
  total_cost: 'number?',
  
  // Notas
  notes: 'string?',
  discontinuation_reason: 'string?',
  
  // Metadatos
  created_at: 'datetime',
  updated_at: 'datetime?'
};

/**
 * Tipo para dosis individuales de medicamentos
 */
export const DOSE_TYPE = {
  id: 'string',
  treatment_id: 'string',
  scheduled_date: 'datetime',
  administered_date: 'datetime?',
  dosage_given: 'string?',
  status: 'string', // 'scheduled', 'administered', 'missed', 'skipped'
  administered_by: 'string?',
  notes: 'string?',
  side_effects: 'string?'
};

/**
 * Tipo para medicamentos en inventario
 */
export const MEDICATION_TYPE = {
  id: 'string', // UUID
  nombre_comercial: 'string',
  principio_activo: 'string',
  tipo: 'string', // MEDICATION_TYPES
  laboratorio: 'string?',
  presentacion: 'string',
  concentracion: 'string?',
  
  // Información regulatoria
  registro_sanitario: 'string?',
  periodo_retiro: 'number?', // días
  contraindicaciones: 'string?',
  
  // Inventario
  stock_actual: 'number',
  stock_minimo: 'number',
  unidad_medida: 'string',
  precio_unitario: 'number?',
  
  // Almacenamiento
  condiciones_almacenamiento: 'string?',
  temperatura_almacenamiento: 'string?',
  
  // Fechas
  fecha_vencimiento: 'date?',
  fecha_compra: 'date?',
  
  // Proveedor
  proveedor: 'string?',
  numero_lote: 'string?',
  
  // Estado
  activo: 'boolean',
  requiere_receta: 'boolean',
  
  // Metadatos
  rancho_id: 'string',
  created_at: 'datetime',
  updated_at: 'datetime?'
};

/**
 * Tipo para estadísticas de salud
 */
export const HEALTH_STATISTICS_TYPE = {
  period: {
    start_date: 'date',
    end_date: 'date',
    type: 'string' // 'day', 'week', 'month', 'quarter', 'year'
  },
  
  // Resumen general
  total_consultations: 'number',
  total_animals_treated: 'number',
  average_animals_per_consultation: 'number',
  
  // Estados de salud
  health_status_distribution: {
    healthy: 'number',
    sick: 'number',
    under_treatment: 'number',
    recovering: 'number',
    quarantine: 'number',
    critical: 'number'
  },
  
  // Tipos de consultas
  consultation_types: 'array',
  
  // Diagnósticos más comunes
  common_diagnoses: 'array',
  
  // Vacunaciones
  vaccination_stats: {
    total_vaccinations: 'number',
    coverage_percentage: 'number',
    pending_vaccinations: 'number',
    overdue_vaccinations: 'number',
    by_vaccine_type: 'array'
  },
  
  // Tratamientos
  treatment_stats: {
    active_treatments: 'number',
    completed_treatments: 'number',
    success_rate: 'number',
    average_treatment_duration: 'number',
    most_used_medications: 'array'
  },
  
  // Costos
  total_health_costs: 'number',
  average_cost_per_animal: 'number',
  cost_by_category: 'array',
  
  // Tendencias
  health_trends: 'array',
  seasonal_patterns: 'array',
  
  // Alertas
  health_alerts: 'array',
  mortality_rate: 'number',
  morbidity_rate: 'number'
};

// =============================================
// CONFIGURACIONES DE SALUD
// =============================================

/**
 * Programas de vacunación por defecto
 */
export const DEFAULT_VACCINATION_PROGRAMS = {
  calves: [
    {
      vaccine_type: VACCINE_TYPES.RESPIRATORY_COMPLEX,
      age_weeks: 6,
      booster_weeks: 4,
      annual_booster: true
    },
    {
      vaccine_type: VACCINE_TYPES.CLOSTRIDIAL,
      age_weeks: 8,
      booster_weeks: 4,
      annual_booster: true
    },
    {
      vaccine_type: VACCINE_TYPES.BVD,
      age_weeks: 12,
      booster_weeks: 4,
      annual_booster: true
    }
  ],
  adults: [
    {
      vaccine_type: VACCINE_TYPES.FOOT_AND_MOUTH,
      frequency_months: 6,
      mandatory: true
    },
    {
      vaccine_type: VACCINE_TYPES.BRUCELLOSIS,
      frequency_months: 12,
      age_restrictions: { min: 3, max: 8 }, // meses
      female_only: true
    },
    {
      vaccine_type: VACCINE_TYPES.ANTHRAX,
      frequency_months: 12,
      seasonal: true,
      preferred_season: 'spring'
    }
  ]
};

/**
 * Configuración de alertas de salud
 */
export const HEALTH_ALERTS_CONFIG = {
  temperature: {
    high_fever: 40.5, // °C
    fever: 39.6,
    hypothermia: 37.5
  },
  heart_rate: {
    tachycardia_adult: 100,
    bradycardia_adult: 40,
    tachycardia_calf: 160,
    bradycardia_calf: 80
  },
  vaccination_overdue: {
    warning_days: 7,
    critical_days: 30
  },
  treatment_monitoring: {
    check_interval_hours: 12,
    missed_dose_alert: true
  },
  weight_loss: {
    significant_percentage: 10, // % de pérdida de peso
    time_period_days: 30
  },
  mortality_rate: {
    warning_percentage: 2,
    critical_percentage: 5
  }
};

/**
 * Configuración de reportes de salud
 */
export const HEALTH_REPORTS_CONFIG = {
  vaccination_report: {
    include_coverage: true,
    include_overdue: true,
    include_upcoming: true,
    include_costs: true
  },
  treatment_report: {
    include_effectiveness: true,
    include_side_effects: true,
    include_withdrawal_periods: true,
    include_costs: true
  },
  health_summary: {
    include_trends: true,
    include_comparisons: true,
    include_recommendations: true
  }
};

// =============================================
// UTILIDADES Y HELPERS
// =============================================

/**
 * Función para evaluar signos vitales
 * @param {object} vitalSigns - Signos vitales
 * @param {number} ageMonths - Edad en meses
 * @returns {object} - Evaluación
 */
export const evaluateVitalSigns = (vitalSigns, ageMonths = 12) => {
  const evaluation = {
    temperature: 'normal',
    heart_rate: 'normal',
    respiratory_rate: 'normal',
    overall_status: 'normal',
    alerts: []
  };
  
  // Evaluar temperatura
  if (vitalSigns.temperature) {
    if (vitalSigns.temperature > VITAL_SIGNS_RANGES.TEMPERATURE.normal.max) {
      evaluation.temperature = vitalSigns.temperature > 40.5 ? 'high_fever' : 'fever';
      evaluation.alerts.push(`Fiebre: ${vitalSigns.temperature}°C`);
    } else if (vitalSigns.temperature < VITAL_SIGNS_RANGES.TEMPERATURE.normal.min) {
      evaluation.temperature = 'hypothermia';
      evaluation.alerts.push(`Hipotermia: ${vitalSigns.temperature}°C`);
    }
  }
  
  // Evaluar frecuencia cardíaca
  if (vitalSigns.heart_rate) {
    const isYoung = ageMonths < 6;
    const range = isYoung ? VITAL_SIGNS_RANGES.HEART_RATE.calf : VITAL_SIGNS_RANGES.HEART_RATE.adult;
    
    if (vitalSigns.heart_rate > range.max) {
      evaluation.heart_rate = 'tachycardia';
      evaluation.alerts.push(`Taquicardia: ${vitalSigns.heart_rate} bpm`);
    } else if (vitalSigns.heart_rate < range.min) {
      evaluation.heart_rate = 'bradycardia';
      evaluation.alerts.push(`Bradicardia: ${vitalSigns.heart_rate} bpm`);
    }
  }
  
  // Evaluar frecuencia respiratoria
  if (vitalSigns.respiratory_rate) {
    const isYoung = ageMonths < 6;
    const range = isYoung ? VITAL_SIGNS_RANGES.RESPIRATORY_RATE.calf : VITAL_SIGNS_RANGES.RESPIRATORY_RATE.adult;
    
    if (vitalSigns.respiratory_rate > range.max) {
      evaluation.respiratory_rate = 'tachypnea';
      evaluation.alerts.push(`Taquipnea: ${vitalSigns.respiratory_rate} rpm`);
    } else if (vitalSigns.respiratory_rate < range.min) {
      evaluation.respiratory_rate = 'bradypnea';
      evaluation.alerts.push(`Bradipnea: ${vitalSigns.respiratory_rate} rpm`);
    }
  }
  
  // Determinar estado general
  const abnormalSigns = [evaluation.temperature, evaluation.heart_rate, evaluation.respiratory_rate]
    .filter(sign => sign !== 'normal').length;
  
  if (abnormalSigns === 0) {
    evaluation.overall_status = 'normal';
  } else if (abnormalSigns === 1) {
    evaluation.overall_status = 'attention';
  } else {
    evaluation.overall_status = 'critical';
  }
  
  return evaluation;
};

/**
 * Función para evaluar condición corporal
 * @param {number} score - Puntuación de condición corporal (1-9)
 * @returns {object} - Evaluación
 */
export const evaluateBodyCondition = (score) => {
  if (!score || score < 1 || score > 9) {
    return { status: 'unknown', description: 'No evaluado', recommendation: '' };
  }
  
  const condition = BODY_CONDITION_SCALE[score];
  let recommendation = '';
  
  switch (condition.status) {
    case 'critical':
      recommendation = score <= 2 
        ? 'Requiere atención veterinaria inmediata y plan nutricional intensivo'
        : 'Reducir alimentación gradualmente y aumentar ejercicio';
      break;
    case 'poor':
      recommendation = score <= 3
        ? 'Mejorar plan nutricional y evaluar problemas de salud'
        : 'Reducir alimentación y monitorear peso semanalmente';
      break;
    case 'below_average':
      recommendation = 'Ajustar plan nutricional y monitorear evolución';
      break;
    case 'ideal':
      recommendation = 'Mantener plan nutricional actual';
      break;
    case 'above_average':
      recommendation = 'Monitorear peso y ajustar alimentación si es necesario';
      break;
  }
  
  return {
    status: condition.status,
    description: condition.description,
    recommendation,
    score
  };
};

/**
 * Función para calcular próxima vacunación
 * @param {string} vaccineType - Tipo de vacuna
 * @param {date} lastVaccination - Fecha de última vacunación
 * @param {number} ageMonths - Edad del animal en meses
 * @returns {object} - Información de próxima vacunación
 */
export const calculateNextVaccination = (vaccineType, lastVaccination, ageMonths = 12) => {
  // Intervalos de vacunación por tipo (en meses)
  const intervals = {
    [VACCINE_TYPES.FOOT_AND_MOUTH]: 6,
    [VACCINE_TYPES.BRUCELLOSIS]: 12,
    [VACCINE_TYPES.ANTHRAX]: 12,
    [VACCINE_TYPES.CLOSTRIDIAL]: 12,
    [VACCINE_TYPES.RESPIRATORY_COMPLEX]: 12,
    [VACCINE_TYPES.BVD]: 12,
    [VACCINE_TYPES.IBR]: 12,
    [VACCINE_TYPES.RABIES]: 24
  };
  
  const intervalMonths = intervals[vaccineType] || 12;
  
  if (!lastVaccination) {
    return {
      nextDue: new Date(), // Debe vacunarse ahora
      isOverdue: true,
      daysOverdue: 0,
      priority: MEDICAL_PRIORITY.HIGH,
      message: 'Primera vacunación pendiente'
    };
  }
  
  const lastDate = new Date(lastVaccination);
  const nextDue = new Date(lastDate);
  nextDue.setMonth(nextDue.getMonth() + intervalMonths);
  
  const today = new Date();
  const diffTime = nextDue - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let priority = MEDICAL_PRIORITY.ROUTINE;
  let message = '';
  
  if (diffDays < 0) {
    priority = Math.abs(diffDays) > 30 ? MEDICAL_PRIORITY.URGENT : MEDICAL_PRIORITY.HIGH;
    message = `Vencida hace ${Math.abs(diffDays)} días`;
  } else if (diffDays <= 7) {
    priority = MEDICAL_PRIORITY.MEDIUM;
    message = `Próxima en ${diffDays} días`;
  } else {
    message = `Próxima en ${diffDays} días`;
  }
  
  return {
    nextDue,
    isOverdue: diffDays < 0,
    daysOverdue: diffDays < 0 ? Math.abs(diffDays) : 0,
    daysUntilDue: diffDays > 0 ? diffDays : 0,
    priority,
    message
  };
};

/**
 * Función para calcular efectividad de tratamiento
 * @param {object} treatment - Tratamiento
 * @param {object} followUp - Seguimiento
 * @returns {object} - Análisis de efectividad
 */
export const calculateTreatmentEffectiveness = (treatment, followUp) => {
  let effectiveness = 'unknown';
  let score = 0;
  let factors = [];
  
  // Evaluar cumplimiento del tratamiento
  const compliance = treatment.completion_percentage || 0;
  if (compliance >= 90) {
    score += 25;
    factors.push('Cumplimiento excelente');
  } else if (compliance >= 70) {
    score += 15;
    factors.push('Cumplimiento bueno');
  } else {
    score -= 10;
    factors.push('Cumplimiento deficiente');
  }
  
  // Evaluar mejora de síntomas
  if (followUp) {
    if (followUp.symptoms_resolved) {
      score += 40;
      factors.push('Síntomas resueltos');
    } else if (followUp.symptoms_improved) {
      score += 25;
      factors.push('Síntomas mejorados');
    } else {
      score -= 20;
      factors.push('Sin mejora aparente');
    }
    
    // Evaluar efectos secundarios
    if (!followUp.side_effects || followUp.side_effects === 'none') {
      score += 20;
      factors.push('Sin efectos secundarios');
    } else if (followUp.side_effects === 'mild') {
      score += 10;
      factors.push('Efectos secundarios leves');
    } else {
      score -= 15;
      factors.push('Efectos secundarios significativos');
    }
    
    // Evaluar necesidad de tratamiento adicional
    if (!followUp.additional_treatment_needed) {
      score += 15;
      factors.push('No requiere tratamiento adicional');
    }
  }
  
  // Determinar efectividad basada en puntuación
  if (score >= 80) {
    effectiveness = 'excellent';
  } else if (score >= 60) {
    effectiveness = 'good';
  } else if (score >= 40) {
    effectiveness = 'fair';
  } else {
    effectiveness = 'poor';
  }
  
  return {
    effectiveness,
    score,
    factors,
    recommendation: getEffectivenessRecommendation(effectiveness, factors)
  };
};

/**
 * Función auxiliar para obtener recomendaciones basadas en efectividad
 * @param {string} effectiveness - Nivel de efectividad
 * @param {array} factors - Factores contribuyentes
 * @returns {string} - Recomendación
 */
const getEffectivenessRecommendation = (effectiveness, factors) => {
  switch (effectiveness) {
    case 'excellent':
      return 'Tratamiento muy exitoso. Continuar protocolo actual para casos similares.';
    case 'good':
      return 'Tratamiento efectivo. Monitorear evolución y considerar ajustes menores.';
    case 'fair':
      return 'Tratamiento parcialmente efectivo. Evaluar causas y considerar modificaciones.';
    case 'poor':
      return 'Tratamiento poco efectivo. Revisar diagnóstico y considerar tratamiento alternativo.';
    default:
      return 'Evaluar seguimiento para determinar efectividad.';
  }
};

/**
 * Función para generar alertas de salud
 * @param {object} bovine - Bovino
 * @param {array} healthRecords - Registros de salud
 * @returns {array} - Alertas generadas
 */
export const generateHealthAlerts = (bovine, healthRecords = []) => {
  const alerts = [];
  const today = new Date();
  
  if (!healthRecords.length) {
    alerts.push({
      type: 'warning',
      priority: MEDICAL_PRIORITY.MEDIUM,
      message: 'Sin registros de salud',
      description: 'Este bovino no tiene registros de salud recientes',
      recommendation: 'Programar chequeo veterinario',
      date: today
    });
    return alerts;
  }
  
  const lastRecord = healthRecords[0]; // Asumiendo orden descendente por fecha
  const daysSinceLastCheck = Math.floor((today - new Date(lastRecord.consultation_date)) / (1000 * 60 * 60 * 24));
  
  // Alerta por tiempo sin revisión
  if (daysSinceLastCheck > 90) {
    alerts.push({
      type: 'warning',
      priority: MEDICAL_PRIORITY.MEDIUM,
      message: 'Revisión veterinaria vencida',
      description: `${daysSinceLastCheck} días sin revisión veterinaria`,
      recommendation: 'Programar chequeo rutinario',
      date: today
    });
  }
  
  // Alerta por tratamientos activos
  const activeTreatments = healthRecords.filter(record => 
    record.treatments && record.treatments.some(t => t.status === 'active')
  );
  
  if (activeTreatments.length > 0) {
    alerts.push({
      type: 'info',
      priority: MEDICAL_PRIORITY.MEDIUM,
      message: 'Tratamiento activo',
      description: `${activeTreatments.length} tratamiento(s) en curso`,
      recommendation: 'Monitorear evolución y cumplimiento',
      date: today
    });
  }
  
  // Alerta por vacunaciones pendientes
  // (Esta lógica requeriría información adicional de vacunaciones)
  
  return alerts;
};

// =============================================
// MENSAJES Y ETIQUETAS
// =============================================

/**
 * Mensajes de error específicos para salud
 */
export const HEALTH_ERROR_MESSAGES = {
  INVALID_VITAL_SIGNS: 'Signos vitales fuera de rango',
  MEDICATION_NOT_FOUND: 'Medicamento no encontrado',
  INVALID_DOSAGE: 'Dosis inválida',
  VACCINE_EXPIRED: 'Vacuna vencida',
  TREATMENT_CONFLICT: 'Conflicto con tratamiento existente',
  WITHDRAWAL_PERIOD_ACTIVE: 'Período de retiro activo',
  VETERINARIAN_REQUIRED: 'Veterinario requerido para esta acción',
  INVALID_ADMINISTRATION_ROUTE: 'Vía de administración inválida',
  CONSULTATION_NOT_FOUND: 'Consulta no encontrada',
  HEALTH_RECORD_LOCKED: 'Registro de salud bloqueado',
  INSUFFICIENT_MEDICATION_STOCK: 'Stock insuficiente de medicamento',
  ALLERGIC_REACTION_HISTORY: 'Historial de reacción alérgica a este medicamento',
  PREGNANCY_CONTRAINDICATION: 'Contraindicado en gestación',
  AGE_RESTRICTION: 'Restricción por edad del animal'
};

/**
 * Mensajes de éxito
 */
export const HEALTH_SUCCESS_MESSAGES = {
  HEALTH_RECORD_CREATED: 'Registro de salud creado exitosamente',
  HEALTH_RECORD_UPDATED: 'Registro de salud actualizado',
  VACCINATION_RECORDED: 'Vacunación registrada correctamente',
  TREATMENT_STARTED: 'Tratamiento iniciado',
  TREATMENT_COMPLETED: 'Tratamiento completado exitosamente',
  MEDICATION_ADMINISTERED: 'Medicamento administrado',
  CONSULTATION_SCHEDULED: 'Consulta programada',
  FOLLOW_UP_SCHEDULED: 'Seguimiento programado',
  HEALTH_ALERT_CLEARED: 'Alerta de salud resuelta',
  VITAL_SIGNS_RECORDED: 'Signos vitales registrados'
};

/**
 * Etiquetas para la interfaz
 */
export const HEALTH_LABELS = {
  // Consultas
  consultation_type: 'Tipo de Consulta',
  consultation_date: 'Fecha de Consulta',
  veterinarian: 'Veterinario',
  diagnosis: 'Diagnóstico',
  treatment: 'Tratamiento',
  prognosis: 'Pronóstico',
  
  // Signos vitales
  temperature: 'Temperatura',
  heart_rate: 'Frecuencia Cardíaca',
  respiratory_rate: 'Frecuencia Respiratoria',
  rumen_movements: 'Movimientos Ruminales',
  body_condition: 'Condición Corporal',
  
  // Vacunaciones
  vaccine_type: 'Tipo de Vacuna',
  vaccine_name: 'Nombre de Vacuna',
  batch_number: 'Número de Lote',
  dosage: 'Dosis',
  administration_route: 'Vía de Administración',
  next_due_date: 'Próxima Dosis',
  
  // Tratamientos
  medication: 'Medicamento',
  frequency: 'Frecuencia',
  duration: 'Duración',
  withdrawal_period: 'Período de Retiro',
  effectiveness: 'Efectividad',
  side_effects: 'Efectos Secundarios',
  
  // Estados
  health_status: 'Estado de Salud',
  consultation_status: 'Estado de Consulta',
  treatment_status: 'Estado de Tratamiento',
  priority: 'Prioridad',
  
  // Costos
  consultation_cost: 'Costo de Consulta',
  medication_cost: 'Costo de Medicamento',
  total_cost: 'Costo Total',
  
  // Seguimiento
  next_appointment: 'Próxima Cita',
  follow_up_required: 'Requiere Seguimiento',
  observations: 'Observaciones',
  recommendations: 'Recomendaciones'
};

export default {
  CONSULTATION_TYPES,
  HEALTH_STATUS,
  CONSULTATION_STATUS,
  MEDICAL_PRIORITY,
  VACCINE_TYPES,
  MEDICATION_TYPES,
  ADMINISTRATION_ROUTES,
  DIAGNOSIS_TYPES,
  VITAL_SIGNS_RANGES,
  BODY_CONDITION_SCALE,
  HEALTH_RECORD_SCHEMA,
  VACCINATION_SCHEMA,
  TREATMENT_SCHEMA,
  HEALTH_FILTER_SCHEMA,
  HEALTH_RECORD_TYPE,
  VACCINATION_TYPE,
  TREATMENT_TYPE,
  DOSE_TYPE,
  MEDICATION_TYPE,
  HEALTH_STATISTICS_TYPE,
  DEFAULT_VACCINATION_PROGRAMS,
  HEALTH_ALERTS_CONFIG,
  HEALTH_REPORTS_CONFIG,
  evaluateVitalSigns,
  evaluateBodyCondition,
  calculateNextVaccination,
  calculateTreatmentEffectiveness,
  generateHealthAlerts,
  HEALTH_ERROR_MESSAGES,
  HEALTH_SUCCESS_MESSAGES,
  HEALTH_LABELS
};