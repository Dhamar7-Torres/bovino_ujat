/**
 * Definiciones de tipos, esquemas y constantes para gestión de bovinos
 * Sistema de gestión de bovinos
 */

// =============================================
// CONSTANTES DE BOVINOS
// =============================================

/**
 * Géneros/sexos de bovinos
 */
export const CATTLE_GENDER = {
  MALE: 'Macho',
  FEMALE: 'Hembra'
};

/**
 * Estados de bovinos
 */
export const CATTLE_STATUS = {
  ACTIVE: 'Activo',
  SICK: 'Enfermo',
  SOLD: 'Vendido',
  DEAD: 'Muerto',
  INACTIVE: 'Inactivo',
  QUARANTINE: 'Cuarentena',
  PREGNANT: 'Gestante',
  LACTATING: 'Lactante',
  DRY: 'Seca'
};

/**
 * Clasificaciones de bovinos por edad y propósito
 */
export const CATTLE_CLASSIFICATION = {
  CALF: 'Becerro',
  HEIFER: 'Vaquilla',
  COW: 'Vaca',
  BULL: 'Toro',
  STEER: 'Novillo',
  BREEDING_BULL: 'Semental',
  DAIRY_COW: 'Vaca Lechera',
  BEEF_CATTLE: 'Ganado de Carne'
};

/**
 * Razas comunes de bovinos
 */
export const CATTLE_BREEDS = {
  HOLSTEIN: 'Holstein',
  JERSEY: 'Jersey',
  BROWN_SWISS: 'Pardo Suizo',
  ANGUS: 'Angus',
  HEREFORD: 'Hereford',
  CHAROLAIS: 'Charolais',
  BRAHMAN: 'Brahman',
  SIMMENTAL: 'Simmental',
  LIMOUSIN: 'Limousin',
  GELBVIEH: 'Gelbvieh',
  CEBU: 'Cebú',
  CRIOLLO: 'Criollo Mexicano'
};

/**
 * Colores comunes
 */
export const CATTLE_COLORS = {
  BLACK: 'Negro',
  WHITE: 'Blanco',
  BROWN: 'Café',
  RED: 'Rojo',
  GRAY: 'Gris',
  BLACK_WHITE: 'Negro y Blanco',
  RED_WHITE: 'Rojo y Blanco',
  BROWN_WHITE: 'Café y Blanco',
  SPOTTED: 'Manchado',
  BRINDLE: 'Atigrado'
};

/**
 * Condición corporal (escala 1-9)
 */
export const BODY_CONDITION_SCORE = {
  EMACIATED: 1,        // Emaciado
  VERY_THIN: 2,        // Muy delgado
  THIN: 3,             // Delgado
  MODERATELY_THIN: 4,  // Moderadamente delgado
  MODERATE: 5,         // Moderado
  MODERATELY_FLESHY: 6, // Moderadamente carnoso
  FLESHY: 7,           // Carnoso
  FAT: 8,              // Gordo
  VERY_FAT: 9          // Muy gordo
};

/**
 * Tipos de identificación
 */
export const IDENTIFICATION_TYPES = {
  EAR_TAG: 'Arete',
  TATTOO: 'Tatuaje',
  BRAND: 'Fierro',
  MICROCHIP: 'Microchip',
  ELECTRONIC_TAG: 'Arete Electrónico',
  COLLAR: 'Collar'
};

/**
 * Tipos de origen/adquisición
 */
export const ACQUISITION_TYPES = {
  BIRTH: 'Nacimiento',
  PURCHASE: 'Compra',
  DONATION: 'Donación',
  LEASE: 'Arrendamiento',
  EXCHANGE: 'Intercambio',
  INHERITANCE: 'Herencia'
};

/**
 * Estados reproductivos
 */
export const REPRODUCTIVE_STATUS = {
  NOT_APPLICABLE: 'No Aplica',
  OPEN: 'Vacía',
  BRED: 'Servida',
  PREGNANT: 'Gestante',
  LACTATING: 'Lactante',
  DRY: 'Seca',
  CYCLING: 'En Celo',
  ANESTRUS: 'Anestro'
};

/**
 * Rangos de edad para clasificación
 */
export const AGE_RANGES = {
  NEWBORN: { min: 0, max: 30, label: 'Recién nacido' },      // días
  CALF: { min: 1, max: 12, label: 'Becerro' },              // meses
  WEANING: { min: 6, max: 12, label: 'Destete' },           // meses
  YEARLING: { min: 12, max: 24, label: 'Añojo' },           // meses
  YOUNG_ADULT: { min: 24, max: 36, label: 'Adulto joven' }, // meses
  ADULT: { min: 36, max: 120, label: 'Adulto' },            // meses
  SENIOR: { min: 120, max: null, label: 'Adulto mayor' }    // meses
};

/**
 * Rangos de peso por clasificación (kg)
 */
export const WEIGHT_RANGES = {
  NEWBORN: { min: 25, max: 45 },
  CALF_3M: { min: 80, max: 120 },
  CALF_6M: { min: 150, max: 200 },
  YEARLING: { min: 250, max: 350 },
  HEIFER: { min: 300, max: 450 },
  ADULT_COW: { min: 450, max: 650 },
  ADULT_BULL: { min: 600, max: 900 }
};

// =============================================
// ESQUEMAS DE VALIDACIÓN
// =============================================

/**
 * Esquema de validación para registro de bovino
 */
export const CATTLE_REGISTRATION_SCHEMA = {
  numero_identificacion: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 50,
    unique: true,
    pattern: /^[A-Z0-9\-]+$/,
    message: 'Debe ser único y contener solo letras mayúsculas, números y guiones'
  },
  nombre: {
    required: false,
    type: 'string',
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
    message: 'Solo se permiten letras y espacios'
  },
  raza_id: {
    required: true,
    type: 'number',
    min: 1,
    message: 'Debe seleccionar una raza válida'
  },
  sexo: {
    required: true,
    type: 'string',
    enum: Object.values(CATTLE_GENDER),
    message: 'Debe seleccionar Macho o Hembra'
  },
  fecha_nacimiento: {
    required: true,
    type: 'date',
    maxDate: 'today',
    minDate: '1900-01-01',
    message: 'Fecha debe ser válida y no futura'
  },
  peso_nacimiento: {
    required: false,
    type: 'number',
    min: 15,
    max: 80,
    decimals: 2,
    message: 'Peso debe estar entre 15 y 80 kg'
  },
  peso_actual: {
    required: false,
    type: 'number',
    min: 15,
    max: 1500,
    decimals: 2,
    message: 'Peso debe estar entre 15 y 1500 kg'
  },
  color: {
    required: false,
    type: 'string',
    maxLength: 50,
    message: 'Máximo 50 caracteres'
  },
  madre_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'Debe ser un ID válido'
  },
  padre_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'Debe ser un ID válido'
  },
  rancho_id: {
    required: true,
    type: 'string',
    format: 'uuid',
    message: 'Debe seleccionar un rancho válido'
  },
  ubicacion_actual: {
    required: false,
    type: 'string',
    maxLength: 200,
    message: 'Máximo 200 caracteres'
  }
};

/**
 * Esquema de validación para actualización de bovino
 */
export const CATTLE_UPDATE_SCHEMA = {
  nombre: {
    required: false,
    type: 'string',
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
    message: 'Solo se permiten letras y espacios'
  },
  peso_actual: {
    required: false,
    type: 'number',
    min: 15,
    max: 1500,
    decimals: 2,
    message: 'Peso debe estar entre 15 y 1500 kg'
  },
  color: {
    required: false,
    type: 'string',
    maxLength: 50,
    message: 'Máximo 50 caracteres'
  },
  estado_id: {
    required: false,
    type: 'number',
    min: 1,
    message: 'Debe seleccionar un estado válido'
  },
  ubicacion_actual: {
    required: false,
    type: 'string',
    maxLength: 200,
    message: 'Máximo 200 caracteres'
  },
  observaciones: {
    required: false,
    type: 'string',
    maxLength: 1000,
    message: 'Máximo 1000 caracteres'
  }
};

/**
 * Esquema de validación para geolocalización
 */
export const LOCATION_SCHEMA = {
  latitude: {
    required: true,
    type: 'number',
    min: -90,
    max: 90,
    decimals: 8,
    message: 'Latitud debe estar entre -90 y 90 grados'
  },
  longitude: {
    required: true,
    type: 'number',
    min: -180,
    max: 180,
    decimals: 8,
    message: 'Longitud debe estar entre -180 y 180 grados'
  },
  accuracy: {
    required: false,
    type: 'number',
    min: 0,
    max: 10000,
    message: 'Precisión debe ser positiva y menor a 10km'
  },
  address: {
    required: false,
    type: 'string',
    maxLength: 300,
    message: 'Máximo 300 caracteres'
  },
  altitude: {
    required: false,
    type: 'number',
    min: -500,
    max: 9000,
    message: 'Altitud debe estar entre -500 y 9000 metros'
  }
};

/**
 * Esquema de validación para filtros de búsqueda
 */
export const CATTLE_FILTER_SCHEMA = {
  search: {
    required: false,
    type: 'string',
    maxLength: 100,
    message: 'Máximo 100 caracteres'
  },
  raza_id: {
    required: false,
    type: 'number',
    min: 1,
    message: 'ID de raza inválido'
  },
  sexo: {
    required: false,
    type: 'string',
    enum: Object.values(CATTLE_GENDER),
    message: 'Sexo inválido'
  },
  estado_id: {
    required: false,
    type: 'number',
    min: 1,
    message: 'ID de estado inválido'
  },
  clasificacion_id: {
    required: false,
    type: 'number',
    min: 1,
    message: 'ID de clasificación inválido'
  },
  edad_min: {
    required: false,
    type: 'number',
    min: 0,
    max: 300,
    message: 'Edad mínima debe estar entre 0 y 300 meses'
  },
  edad_max: {
    required: false,
    type: 'number',
    min: 0,
    max: 300,
    message: 'Edad máxima debe estar entre 0 y 300 meses'
  },
  peso_min: {
    required: false,
    type: 'number',
    min: 0,
    max: 1500,
    message: 'Peso mínimo debe estar entre 0 y 1500 kg'
  },
  peso_max: {
    required: false,
    type: 'number',
    min: 0,
    max: 1500,
    message: 'Peso máximo debe estar entre 0 y 1500 kg'
  }
};

// =============================================
// DEFINICIONES DE TIPOS DE DATOS
// =============================================

/**
 * Tipo para información básica de bovino
 */
export const CATTLE_TYPE = {
  id: 'string', // UUID
  numero_identificacion: 'string',
  nombre: 'string?',
  raza: {
    id: 'number',
    descripcion: 'string'
  },
  sexo: 'string',
  fecha_nacimiento: 'date',
  edad_meses: 'number',
  edad_display: 'string',
  peso_nacimiento: 'number?',
  peso_actual: 'number?',
  color: 'string?',
  clasificacion: {
    id: 'number',
    nombre: 'string',
    tipo: 'string'
  },
  estado: {
    id: 'number',
    descripcion: 'string'
  },
  rancho: {
    id: 'string',
    nombre: 'string'
  },
  madre: {
    id: 'string?',
    numero_identificacion: 'string?',
    nombre: 'string?'
  },
  padre: {
    id: 'string?',
    numero_identificacion: 'string?',
    nombre: 'string?'
  },
  ubicacion_actual: 'string?',
  coordenadas: {
    latitude: 'number?',
    longitude: 'number?',
    accuracy: 'number?',
    timestamp: 'date?'
  },
  imagenes: 'array',
  observaciones: 'string?',
  fecha_registro: 'date',
  activo: 'boolean'
};

/**
 * Tipo para información extendida de bovino
 */
export const CATTLE_EXTENDED_TYPE = {
  ...CATTLE_TYPE,
  salud: {
    ultima_revision: 'date?',
    proxima_revision: 'date?',
    vacunas_pendientes: 'number',
    estado_salud: 'string',
    peso_historico: 'array',
    condicion_corporal: 'number'
  },
  reproduccion: {
    estado_reproductivo: 'string',
    ultima_inseminacion: 'date?',
    fecha_esperada_parto: 'date?',
    numero_partos: 'number',
    numero_crias_vivas: 'number'
  },
  produccion: {
    tipo_produccion: 'string',
    produccion_diaria: 'number?',
    produccion_mensual: 'number?',
    calidad_promedio: 'number?',
    ultimo_registro: 'date?'
  },
  genealogia: {
    generacion: 'number',
    abuelos_paternos: 'object?',
    abuelos_maternos: 'object?',
    hermanos: 'array',
    hijos: 'array'
  },
  finanzas: {
    valor_adquisicion: 'number?',
    valor_actual_estimado: 'number?',
    gastos_acumulados: 'number?',
    ingresos_generados: 'number?'
  }
};

/**
 * Tipo para raza de bovino
 */
export const BREED_TYPE = {
  id: 'number',
  descripcion: 'string',
  origen: 'string?',
  proposito: 'string', // dairy, beef, dual
  caracteristicas: 'array',
  peso_promedio_macho: 'number?',
  peso_promedio_hembra: 'number?',
  produccion_leche_promedio: 'number?',
  activo: 'boolean'
};

/**
 * Tipo para clasificación de bovino
 */
export const CLASSIFICATION_TYPE = {
  id: 'number',
  nombre: 'string',
  tipo: 'string',
  edad_min: 'number',
  edad_max: 'number?',
  peso_min: 'number?',
  peso_max: 'number?',
  sexo_aplicable: 'string?',
  descripcion: 'string?'
};

/**
 * Tipo para imagen de bovino
 */
export const CATTLE_IMAGE_TYPE = {
  id: 'string',
  url: 'string',
  thumbnail_url: 'string?',
  filename: 'string',
  size: 'number',
  tipo: 'string', // profile, body, injury, identification
  descripcion: 'string?',
  fecha_captura: 'date',
  coordenadas: {
    latitude: 'number?',
    longitude: 'number?'
  },
  es_principal: 'boolean',
  activo: 'boolean'
};

// =============================================
// CONFIGURACIONES DE NEGOCIO
// =============================================

/**
 * Configuración de alertas automáticas
 */
export const ALERTS_CONFIG = {
  age: {
    weaningAge: 6, // meses
    breedingAge: 15, // meses para hembras
    seniorAge: 120 // meses
  },
  weight: {
    underweight: {
      calf: 80,      // kg para becerros de 6 meses
      heifer: 300,   // kg para vaquillas
      cow: 400       // kg para vacas adultas
    },
    overweight: {
      cow: 700,      // kg para vacas
      bull: 1000     // kg para toros
    }
  },
  health: {
    maxDaysSinceLastCheck: 90,
    maxDaysSinceLastVaccine: 365,
    maxDaysSinceLastDeworming: 180
  },
  reproduction: {
    maxDaysOpen: 120,        // días vacía después del parto
    maxGestationDays: 290,   // días de gestación
    minAgeBreeingHeifer: 15  // meses para primer servicio
  }
};

/**
 * Configuración de producción por tipo
 */
export const PRODUCTION_CONFIG = {
  milk: {
    unit: 'litros',
    normalRange: { min: 15, max: 50 }, // litros por día
    qualityMetrics: ['grasa', 'proteina', 'celulas_somaticas'],
    expectedLactationDays: 305
  },
  meat: {
    unit: 'kg',
    expectedDailyGain: { min: 0.8, max: 2.5 }, // kg por día
    feedConversionRatio: { min: 5.5, max: 8.0 },
    expectedFinishingWeight: { min: 450, max: 650 }
  }
};

/**
 * Configuración de geolocalización
 */
export const GEOLOCATION_CONFIG = {
  defaultZoom: 15,
  maxAccuracy: 100, // metros
  trackingInterval: 300000, // 5 minutos en milisegundos
  historyRetentionDays: 90,
  alertRadius: 1000, // metros para alertas de ubicación
  fenceAlerts: true,
  coordinates: {
    // Coordenadas para Tabasco, México (zona del proyecto)
    defaultCenter: {
      lat: 17.9892,
      lng: -92.9478
    },
    bounds: {
      north: 18.6583,
      south: 17.3333,
      east: -91.3667,
      west: -94.7167
    }
  }
};

// =============================================
// MENSAJES Y ETIQUETAS
// =============================================

/**
 * Mensajes de error específicos para bovinos
 */
export const CATTLE_ERROR_MESSAGES = {
  // Validación
  INVALID_TAG_NUMBER: 'Número de identificación inválido o ya existe',
  INVALID_BIRTH_DATE: 'Fecha de nacimiento inválida',
  INVALID_WEIGHT: 'Peso fuera del rango permitido',
  MOTHER_NOT_FEMALE: 'La madre debe ser de sexo femenino',
  FATHER_NOT_MALE: 'El padre debe ser de sexo masculino',
  SELF_PARENT: 'Un bovino no puede ser padre/madre de sí mismo',
  
  // Estado
  CANNOT_DELETE_WITH_OFFSPRING: 'No se puede eliminar bovino con crías registradas',
  CANNOT_SELL_PREGNANT: 'No se puede vender bovino gestante',
  ALREADY_SOLD: 'El bovino ya está marcado como vendido',
  ALREADY_DEAD: 'El bovino ya está marcado como muerto',
  
  // Ubicación
  LOCATION_NOT_AVAILABLE: 'Geolocalización no disponible',
  LOCATION_PERMISSION_DENIED: 'Permisos de ubicación denegados',
  COORDINATES_OUT_OF_BOUNDS: 'Coordenadas fuera del área permitida',
  
  // General
  BOVINE_NOT_FOUND: 'Bovino no encontrado',
  UNAUTHORIZED_ACCESS: 'No tiene permisos para este bovino',
  IMAGE_UPLOAD_FAILED: 'Error al subir imagen',
  INVALID_FILE_TYPE: 'Tipo de archivo no permitido'
};

/**
 * Mensajes de éxito
 */
export const CATTLE_SUCCESS_MESSAGES = {
  CREATED: 'Bovino registrado exitosamente',
  UPDATED: 'Bovino actualizado correctamente',
  DELETED: 'Bovino eliminado correctamente',
  STATUS_CHANGED: 'Estado del bovino actualizado',
  LOCATION_UPDATED: 'Ubicación actualizada correctamente',
  IMAGE_UPLOADED: 'Imagen subida exitosamente',
  EXPORTED: 'Datos exportados correctamente',
  IMPORTED: 'Datos importados correctamente'
};

/**
 * Etiquetas para la interfaz
 */
export const CATTLE_LABELS = {
  // Campos básicos
  tag_number: 'Número de Identificación',
  name: 'Nombre',
  breed: 'Raza',
  gender: 'Sexo',
  birth_date: 'Fecha de Nacimiento',
  birth_weight: 'Peso al Nacer',
  current_weight: 'Peso Actual',
  color: 'Color',
  status: 'Estado',
  location: 'Ubicación Actual',
  
  // Genealogía
  mother: 'Madre',
  father: 'Padre',
  generation: 'Generación',
  offspring: 'Crías',
  siblings: 'Hermanos',
  
  // Medidas y condición
  age: 'Edad',
  body_condition: 'Condición Corporal',
  height: 'Altura',
  chest_girth: 'Perímetro Torácico',
  
  // Fechas importantes
  registration_date: 'Fecha de Registro',
  weaning_date: 'Fecha de Destete',
  last_checkup: 'Última Revisión',
  next_checkup: 'Próxima Revisión',
  
  // Estados especiales
  pregnant: 'Gestante',
  lactating: 'En Lactancia',
  dry: 'Seca',
  breeding: 'En Reproducción',
  
  // Producción
  daily_production: 'Producción Diaria',
  monthly_production: 'Producción Mensual',
  milk_quality: 'Calidad de Leche',
  weight_gain: 'Ganancia de Peso'
};

// =============================================
// UTILIDADES Y HELPERS
// =============================================

/**
 * Función para calcular edad en meses
 * @param {Date} birthDate - Fecha de nacimiento
 * @returns {number} - Edad en meses
 */
export const calculateAgeInMonths = (birthDate) => {
  if (!birthDate) return 0;
  
  const today = new Date();
  const birth = new Date(birthDate);
  
  const months = (today.getFullYear() - birth.getFullYear()) * 12 + 
                 (today.getMonth() - birth.getMonth());
  
  // Ajustar si el día actual es menor al día de nacimiento
  if (today.getDate() < birth.getDate()) {
    return Math.max(0, months - 1);
  }
  
  return Math.max(0, months);
};

/**
 * Función para formatear edad de bovino
 * @param {Date} birthDate - Fecha de nacimiento
 * @returns {string} - Edad formateada
 */
export const formatCattleAge = (birthDate) => {
  if (!birthDate) return 'No especificada';
  
  const ageInMonths = calculateAgeInMonths(birthDate);
  
  if (ageInMonths < 1) {
    const ageInDays = Math.floor((new Date() - new Date(birthDate)) / (1000 * 60 * 60 * 24));
    return `${ageInDays} día${ageInDays !== 1 ? 's' : ''}`;
  } else if (ageInMonths < 12) {
    return `${ageInMonths} mes${ageInMonths !== 1 ? 'es' : ''}`;
  } else {
    const years = Math.floor(ageInMonths / 12);
    const remainingMonths = ageInMonths % 12;
    
    let result = `${years} año${years !== 1 ? 's' : ''}`;
    if (remainingMonths > 0) {
      result += ` y ${remainingMonths} mes${remainingMonths !== 1 ? 'es' : ''}`;
    }
    return result;
  }
};

/**
 * Función para determinar clasificación automática
 * @param {string} gender - Sexo del bovino
 * @param {number} ageInMonths - Edad en meses
 * @param {boolean} hasCalved - Si ya ha parido (solo hembras)
 * @returns {string} - Clasificación sugerida
 */
export const getAutomaticClassification = (gender, ageInMonths, hasCalved = false) => {
  if (!gender || ageInMonths < 0) return '';
  
  if (ageInMonths <= 12) {
    return CATTLE_CLASSIFICATION.CALF;
  }
  
  if (gender === CATTLE_GENDER.FEMALE) {
    if (ageInMonths < 24 || !hasCalved) {
      return CATTLE_CLASSIFICATION.HEIFER;
    } else {
      return CATTLE_CLASSIFICATION.COW;
    }
  } else {
    if (ageInMonths < 24) {
      return CATTLE_CLASSIFICATION.STEER;
    } else {
      return CATTLE_CLASSIFICATION.BULL;
    }
  }
};

/**
 * Función para validar peso según edad
 * @param {number} weight - Peso en kg
 * @param {number} ageInMonths - Edad en meses
 * @param {string} gender - Sexo del bovino
 * @returns {object} - Resultado de validación
 */
export const validateWeightForAge = (weight, ageInMonths, gender) => {
  if (!weight || !ageInMonths) {
    return { isValid: true, message: '' };
  }
  
  let expectedRange = null;
  
  if (ageInMonths <= 1) {
    expectedRange = WEIGHT_RANGES.NEWBORN;
  } else if (ageInMonths <= 3) {
    expectedRange = WEIGHT_RANGES.CALF_3M;
  } else if (ageInMonths <= 6) {
    expectedRange = WEIGHT_RANGES.CALF_6M;
  } else if (ageInMonths <= 12) {
    expectedRange = WEIGHT_RANGES.YEARLING;
  } else if (gender === CATTLE_GENDER.FEMALE && ageInMonths <= 24) {
    expectedRange = WEIGHT_RANGES.HEIFER;
  } else if (gender === CATTLE_GENDER.FEMALE) {
    expectedRange = WEIGHT_RANGES.ADULT_COW;
  } else {
    expectedRange = WEIGHT_RANGES.ADULT_BULL;
  }
  
  if (!expectedRange) {
    return { isValid: true, message: '' };
  }
  
  const isUnderweight = weight < expectedRange.min * 0.7; // 30% por debajo
  const isOverweight = weight > expectedRange.max * 1.3;  // 30% por encima
  
  if (isUnderweight) {
    return {
      isValid: false,
      level: 'warning',
      message: `Peso por debajo del rango esperado (${expectedRange.min}-${expectedRange.max} kg)`
    };
  }
  
  if (isOverweight) {
    return {
      isValid: false,
      level: 'warning',
      message: `Peso por encima del rango esperado (${expectedRange.min}-${expectedRange.max} kg)`
    };
  }
  
  return { isValid: true, message: 'Peso dentro del rango normal' };
};

/**
 * Función para generar número de identificación automático
 * @param {string} ranchPrefix - Prefijo del rancho
 * @param {string} gender - Sexo del bovino
 * @param {number} yearOfBirth - Año de nacimiento
 * @param {number} sequence - Número secuencial
 * @returns {string} - Número de identificación generado
 */
export const generateTagNumber = (ranchPrefix = 'RCH', gender, yearOfBirth, sequence) => {
  const genderCode = gender === CATTLE_GENDER.MALE ? 'M' : 'F';
  const year = yearOfBirth ? yearOfBirth.toString().slice(-2) : new Date().getFullYear().toString().slice(-2);
  const seq = sequence.toString().padStart(3, '0');
  
  return `${ranchPrefix}-${genderCode}${year}-${seq}`;
};

/**
 * Función para calcular valor estimado
 * @param {object} cattle - Datos del bovino
 * @param {object} marketPrices - Precios de mercado actuales
 * @returns {number} - Valor estimado en pesos
 */
export const calculateEstimatedValue = (cattle, marketPrices = {}) => {
  if (!cattle || !cattle.peso_actual) return 0;
  
  const {
    peso_actual,
    sexo,
    raza,
    clasificacion,
    edad_meses,
    estado_reproductivo
  } = cattle;
  
  // Precio base por kg según clasificación
  let basePrice = marketPrices.basePrice || 45; // pesos por kg
  
  // Ajustes por raza
  const breedMultiplier = raza?.descripcion?.includes('Holstein') ? 1.2 :
                         raza?.descripcion?.includes('Angus') ? 1.3 :
                         raza?.descripcion?.includes('Jersey') ? 1.1 : 1.0;
  
  // Ajustes por clasificación
  const classificationMultiplier = clasificacion?.tipo === 'reproductora' ? 1.4 :
                                  clasificacion?.tipo === 'lechera' ? 1.3 :
                                  clasificacion?.tipo === 'engorda' ? 1.1 : 1.0;
  
  // Ajustes por estado reproductivo
  const reproductiveMultiplier = estado_reproductivo === 'Gestante' ? 1.2 :
                                estado_reproductivo === 'Lactante' ? 1.15 : 1.0;
  
  // Ajustes por edad (penalizar animales muy viejos)
  const ageMultiplier = edad_meses > 120 ? 0.8 : 1.0;
  
  const finalPrice = basePrice * breedMultiplier * classificationMultiplier * 
                    reproductiveMultiplier * ageMultiplier;
  
  return Math.round(peso_actual * finalPrice);
};

/**
 * Función para determinar alertas de bovino
 * @param {object} cattle - Datos del bovino
 * @returns {array} - Array de alertas
 */
export const getCattleAlerts = (cattle) => {
  const alerts = [];
  
  if (!cattle) return alerts;
  
  const {
    edad_meses,
    peso_actual,
    sexo,
    estado_reproductivo,
    ultima_revision,
    proxima_revision,
    estado
  } = cattle;
  
  // Alertas de salud
  if (ultima_revision) {
    const daysSinceLastCheck = Math.floor((new Date() - new Date(ultima_revision)) / (1000 * 60 * 60 * 24));
    if (daysSinceLastCheck > ALERTS_CONFIG.health.maxDaysSinceLastCheck) {
      alerts.push({
        type: 'health',
        level: 'warning',
        message: `${daysSinceLastCheck} días sin revisión veterinaria`,
        icon: 'stethoscope'
      });
    }
  }
  
  // Alertas de peso
  if (peso_actual && edad_meses) {
    const weightValidation = validateWeightForAge(peso_actual, edad_meses, sexo);
    if (!weightValidation.isValid) {
      alerts.push({
        type: 'weight',
        level: weightValidation.level,
        message: weightValidation.message,
        icon: 'scale'
      });
    }
  }
  
  // Alertas reproductivas
  if (sexo === CATTLE_GENDER.FEMALE && edad_meses >= 15) {
    if (estado_reproductivo === 'Vacía') {
      alerts.push({
        type: 'reproduction',
        level: 'info',
        message: 'Vaquilla en edad reproductiva',
        icon: 'heart'
      });
    }
  }
  
  // Alertas de destete
  if (edad_meses >= 6 && edad_meses <= 8) {
    alerts.push({
      type: 'management',
      level: 'info',
      message: 'Edad óptima para destete',
      icon: 'calendar'
    });
  }
  
  return alerts;
};

export default {
  CATTLE_GENDER,
  CATTLE_STATUS,
  CATTLE_CLASSIFICATION,
  CATTLE_BREEDS,
  CATTLE_COLORS,
  BODY_CONDITION_SCORE,
  IDENTIFICATION_TYPES,
  ACQUISITION_TYPES,
  REPRODUCTIVE_STATUS,
  AGE_RANGES,
  WEIGHT_RANGES,
  CATTLE_REGISTRATION_SCHEMA,
  CATTLE_UPDATE_SCHEMA,
  LOCATION_SCHEMA,
  CATTLE_FILTER_SCHEMA,
  CATTLE_TYPE,
  CATTLE_EXTENDED_TYPE,
  BREED_TYPE,
  CLASSIFICATION_TYPE,
  CATTLE_IMAGE_TYPE,
  ALERTS_CONFIG,
  PRODUCTION_CONFIG,
  GEOLOCATION_CONFIG,
  CATTLE_ERROR_MESSAGES,
  CATTLE_SUCCESS_MESSAGES,
  CATTLE_LABELS,
  calculateAgeInMonths,
  formatCattleAge,
  getAutomaticClassification,
  validateWeightForAge,
  generateTagNumber,
  calculateEstimatedValue,
  getCattleAlerts
};