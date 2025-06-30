/**
 * Definiciones de tipos, esquemas y constantes para gestión de eventos
 * Sistema de gestión de bovinos - Eventos, actividades y programación
 */

// =============================================
// CONSTANTES DE EVENTOS
// =============================================

/**
 * Tipos de eventos principales
 */
export const EVENT_TYPES = {
  // Salud y medicina
  VACCINATION: 'vaccination',
  TREATMENT: 'treatment',
  CHECKUP: 'checkup',
  SURGERY: 'surgery',
  DEWORMING: 'deworming',
  QUARANTINE: 'quarantine',
  EMERGENCY: 'emergency',
  
  // Reproducción
  BREEDING: 'breeding',
  INSEMINATION: 'insemination',
  PREGNANCY_CHECK: 'pregnancy_check',
  DELIVERY: 'delivery',
  WEANING: 'weaning',
  
  // Producción
  MILKING: 'milking',
  WEIGHING: 'weighing',
  FEEDING: 'feeding',
  NUTRITION_CHANGE: 'nutrition_change',
  
  // Manejo general
  IDENTIFICATION: 'identification',
  TRANSPORTATION: 'transportation',
  SALE: 'sale',
  PURCHASE: 'purchase',
  DEATH: 'death',
  
  // Mantenimiento
  FACILITY_MAINTENANCE: 'facility_maintenance',
  EQUIPMENT_MAINTENANCE: 'equipment_maintenance',
  CLEANING: 'cleaning',
  
  // Administrativo
  INSPECTION: 'inspection',
  CERTIFICATION: 'certification',
  TRAINING: 'training',
  MEETING: 'meeting'
};

/**
 * Estados de eventos
 */
export const EVENT_STATUS = {
  SCHEDULED: 'scheduled',    // Programado
  PENDING: 'pending',        // Pendiente
  IN_PROGRESS: 'in_progress', // En progreso
  COMPLETED: 'completed',    // Completado
  CANCELLED: 'cancelled',    // Cancelado
  POSTPONED: 'postponed',    // Pospuesto
  OVERDUE: 'overdue',        // Vencido
  FAILED: 'failed'           // Fallido
};

/**
 * Niveles de prioridad para eventos
 */
export const EVENT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
  CRITICAL: 'critical'
};

/**
 * Categorías de eventos
 */
export const EVENT_CATEGORIES = {
  HEALTH: 'health',
  REPRODUCTION: 'reproduction',
  PRODUCTION: 'production',
  MANAGEMENT: 'management',
  MAINTENANCE: 'maintenance',
  ADMINISTRATIVE: 'administrative',
  FINANCIAL: 'financial'
};

/**
 * Frecuencias de repetición
 */
export const RECURRENCE_TYPES = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  SEMI_ANNUAL: 'semi_annual',
  ANNUAL: 'annual',
  CUSTOM: 'custom'
};

/**
 * Tipos de notificación para eventos
 */
export const NOTIFICATION_TIMING = {
  IMMEDIATE: 0,              // Inmediato
  MINUTES_15: 15,           // 15 minutos antes
  MINUTES_30: 30,           // 30 minutos antes
  HOURS_1: 60,              // 1 hora antes
  HOURS_2: 120,             // 2 horas antes
  HOURS_4: 240,             // 4 horas antes
  HOURS_24: 1440,           // 1 día antes
  HOURS_48: 2880,           // 2 días antes
  HOURS_72: 4320,           // 3 días antes
  WEEK: 10080               // 1 semana antes
};

/**
 * Resultados posibles de eventos
 */
export const EVENT_RESULTS = {
  SUCCESS: 'success',
  PARTIAL_SUCCESS: 'partial_success',
  FAILURE: 'failure',
  NEEDS_FOLLOWUP: 'needs_followup',
  CANCELLED_BY_PATIENT: 'cancelled_by_patient',
  CANCELLED_BY_STAFF: 'cancelled_by_staff',
  NO_SHOW: 'no_show',
  ADVERSE_REACTION: 'adverse_reaction'
};

/**
 * Tipos de participantes en eventos
 */
export const PARTICIPANT_ROLES = {
  VETERINARIAN: 'veterinarian',
  TECHNICIAN: 'technician',
  RANCH_MANAGER: 'ranch_manager',
  OWNER: 'owner',
  ASSISTANT: 'assistant',
  OBSERVER: 'observer',
  EXTERNAL_SERVICE: 'external_service'
};

/**
 * Métodos de recordatorio
 */
export const REMINDER_METHODS = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH_NOTIFICATION: 'push_notification',
  IN_APP: 'in_app',
  PHONE_CALL: 'phone_call'
};

// =============================================
// ESQUEMAS DE VALIDACIÓN
// =============================================

/**
 * Esquema de validación para creación de eventos
 */
export const EVENT_CREATION_SCHEMA = {
  title: {
    required: true,
    type: 'string',
    minLength: 3,
    maxLength: 200,
    message: 'El título debe tener entre 3 y 200 caracteres'
  },
  description: {
    required: false,
    type: 'string',
    maxLength: 1000,
    message: 'La descripción no puede exceder 1000 caracteres'
  },
  type: {
    required: true,
    type: 'string',
    enum: Object.values(EVENT_TYPES),
    message: 'Tipo de evento inválido'
  },
  category: {
    required: true,
    type: 'string',
    enum: Object.values(EVENT_CATEGORIES),
    message: 'Categoría de evento inválida'
  },
  scheduled_date: {
    required: true,
    type: 'datetime',
    futureDate: true,
    message: 'La fecha programada debe ser futura'
  },
  estimated_duration: {
    required: false,
    type: 'number',
    min: 5,
    max: 480,
    message: 'Duración debe estar entre 5 minutos y 8 horas'
  },
  priority: {
    required: true,
    type: 'string',
    enum: Object.values(EVENT_PRIORITY),
    default: EVENT_PRIORITY.MEDIUM,
    message: 'Nivel de prioridad inválido'
  },
  bovine_ids: {
    required: false,
    type: 'array',
    maxItems: 50,
    message: 'Máximo 50 bovinos por evento'
  },
  responsible_user_id: {
    required: true,
    type: 'string',
    format: 'uuid',
    message: 'Debe asignar un responsable válido'
  },
  location: {
    required: false,
    type: 'object',
    properties: {
      latitude: { type: 'number', min: -90, max: 90 },
      longitude: { type: 'number', min: -180, max: 180 },
      address: { type: 'string', maxLength: 300 },
      facility_name: { type: 'string', maxLength: 100 }
    }
  },
  recurrence: {
    required: false,
    type: 'object',
    properties: {
      type: { 
        type: 'string', 
        enum: Object.values(RECURRENCE_TYPES),
        default: RECURRENCE_TYPES.NONE 
      },
      interval: { type: 'number', min: 1, max: 365 },
      end_date: { type: 'datetime' },
      max_occurrences: { type: 'number', min: 1, max: 100 }
    }
  },
  reminders: {
    required: false,
    type: 'array',
    maxItems: 5,
    items: {
      type: 'object',
      properties: {
        timing: { 
          type: 'number',
          enum: Object.values(NOTIFICATION_TIMING)
        },
        method: {
          type: 'string',
          enum: Object.values(REMINDER_METHODS)
        }
      }
    }
  }
};

/**
 * Esquema de validación para completar eventos
 */
export const EVENT_COMPLETION_SCHEMA = {
  completion_date: {
    required: true,
    type: 'datetime',
    pastOrPresent: true,
    message: 'La fecha de completado no puede ser futura'
  },
  actual_duration: {
    required: false,
    type: 'number',
    min: 1,
    max: 720,
    message: 'Duración real debe estar entre 1 minuto y 12 horas'
  },
  result: {
    required: true,
    type: 'string',
    enum: Object.values(EVENT_RESULTS),
    message: 'Resultado de evento inválido'
  },
  notes: {
    required: false,
    type: 'string',
    maxLength: 2000,
    message: 'Las notas no pueden exceder 2000 caracteres'
  },
  complications: {
    required: false,
    type: 'string',
    maxLength: 1000,
    message: 'Las complicaciones no pueden exceder 1000 caracteres'
  },
  follow_up_required: {
    required: false,
    type: 'boolean',
    default: false
  },
  follow_up_date: {
    required: false,
    type: 'datetime',
    futureDate: true,
    message: 'La fecha de seguimiento debe ser futura'
  },
  attachments: {
    required: false,
    type: 'array',
    maxItems: 10,
    message: 'Máximo 10 archivos adjuntos'
  },
  participants: {
    required: false,
    type: 'array',
    maxItems: 10,
    items: {
      type: 'object',
      properties: {
        user_id: { type: 'string', format: 'uuid' },
        role: { 
          type: 'string', 
          enum: Object.values(PARTICIPANT_ROLES) 
        }
      }
    }
  }
};

/**
 * Esquema de validación para filtros de eventos
 */
export const EVENT_FILTER_SCHEMA = {
  search: {
    required: false,
    type: 'string',
    maxLength: 100,
    message: 'Búsqueda muy larga'
  },
  type: {
    required: false,
    type: 'string',
    enum: Object.values(EVENT_TYPES),
    message: 'Tipo de evento inválido'
  },
  category: {
    required: false,
    type: 'string',
    enum: Object.values(EVENT_CATEGORIES),
    message: 'Categoría inválida'
  },
  status: {
    required: false,
    type: 'string',
    enum: Object.values(EVENT_STATUS),
    message: 'Estado inválido'
  },
  priority: {
    required: false,
    type: 'string',
    enum: Object.values(EVENT_PRIORITY),
    message: 'Prioridad inválida'
  },
  bovine_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'ID de bovino inválido'
  },
  responsible_user_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'ID de responsable inválido'
  },
  rancho_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'ID de rancho inválido'
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
  overdue_only: {
    required: false,
    type: 'boolean',
    default: false
  },
  upcoming_days: {
    required: false,
    type: 'number',
    min: 1,
    max: 365,
    message: 'Días debe estar entre 1 y 365'
  }
};

// =============================================
// DEFINICIONES DE TIPOS DE DATOS
// =============================================

/**
 * Tipo base para eventos
 */
export const EVENT_TYPE = {
  id: 'string', // UUID
  title: 'string',
  description: 'string?',
  type: 'string', // EVENT_TYPES
  category: 'string', // EVENT_CATEGORIES
  status: 'string', // EVENT_STATUS
  priority: 'string', // EVENT_PRIORITY
  
  // Programación
  scheduled_date: 'datetime',
  scheduled_time: 'time?',
  estimated_duration: 'number?', // minutos
  
  // Fechas reales
  start_date: 'datetime?',
  completion_date: 'datetime?',
  actual_duration: 'number?', // minutos
  
  // Participantes
  responsible_user: {
    id: 'string',
    nombre: 'string',
    apellido: 'string',
    role: 'string'
  },
  participants: 'array',
  
  // Bovinos involucrados
  bovines: 'array',
  bovine_count: 'number',
  
  // Ubicación
  location: {
    latitude: 'number?',
    longitude: 'number?',
    address: 'string?',
    facility_name: 'string?',
    area_name: 'string?'
  },
  
  // Recurrencia
  recurrence: {
    type: 'string',
    interval: 'number?',
    end_date: 'datetime?',
    max_occurrences: 'number?',
    parent_event_id: 'string?'
  },
  
  // Notificaciones
  reminders: 'array',
  notifications_sent: 'array',
  
  // Resultados
  result: 'string?', // EVENT_RESULTS
  success_rate: 'number?',
  complications: 'string?',
  notes: 'string?',
  
  // Seguimiento
  follow_up_required: 'boolean',
  follow_up_date: 'datetime?',
  follow_up_event_id: 'string?',
  
  // Archivos
  attachments: 'array',
  
  // Costos
  estimated_cost: 'number?',
  actual_cost: 'number?',
  
  // Metadatos
  created_at: 'datetime',
  created_by: 'string',
  updated_at: 'datetime?',
  updated_by: 'string?',
  rancho_id: 'string'
};

/**
 * Tipo para recordatorios
 */
export const REMINDER_TYPE = {
  id: 'string',
  event_id: 'string',
  timing: 'number', // minutos antes del evento
  method: 'string', // REMINDER_METHODS
  recipient_id: 'string',
  message: 'string?',
  sent_at: 'datetime?',
  status: 'string' // pending, sent, failed
};

/**
 * Tipo para participantes en eventos
 */
export const EVENT_PARTICIPANT_TYPE = {
  id: 'string',
  event_id: 'string',
  user_id: 'string',
  role: 'string', // PARTICIPANT_ROLES
  status: 'string', // invited, confirmed, declined, no_show
  notes: 'string?',
  added_at: 'datetime'
};

/**
 * Tipo para archivos adjuntos de eventos
 */
export const EVENT_ATTACHMENT_TYPE = {
  id: 'string',
  event_id: 'string',
  file_name: 'string',
  file_path: 'string',
  file_url: 'string',
  file_type: 'string',
  file_size: 'number',
  description: 'string?',
  uploaded_by: 'string',
  uploaded_at: 'datetime'
};

/**
 * Tipo para estadísticas de eventos
 */
export const EVENT_STATISTICS_TYPE = {
  total_events: 'number',
  completed_events: 'number',
  pending_events: 'number',
  overdue_events: 'number',
  cancelled_events: 'number',
  
  completion_rate: 'number', // porcentaje
  success_rate: 'number', // porcentaje
  average_duration: 'number', // minutos
  
  by_type: 'object', // conteo por tipo de evento
  by_category: 'object', // conteo por categoría
  by_priority: 'object', // conteo por prioridad
  by_month: 'array', // eventos por mes
  
  upcoming_week: 'number',
  upcoming_month: 'number',
  
  total_cost: 'number',
  average_cost: 'number'
};

// =============================================
// CONFIGURACIONES DE EVENTOS
// =============================================

/**
 * Configuración por defecto para eventos
 */
export const DEFAULT_EVENT_CONFIG = {
  defaultDuration: 60, // minutos
  defaultPriority: EVENT_PRIORITY.MEDIUM,
  defaultReminders: [
    { timing: NOTIFICATION_TIMING.HOURS_24, method: REMINDER_METHODS.EMAIL },
    { timing: NOTIFICATION_TIMING.HOURS_2, method: REMINDER_METHODS.PUSH_NOTIFICATION }
  ],
  autoCompleteAfter: 24, // horas después de la fecha programada
  maxParticipants: 10,
  maxAttachments: 10,
  allowPastEvents: false,
  requireLocation: false,
  trackDuration: true,
  enableRecurrence: true
};

/**
 * Configuración de tipos de eventos veterinarios
 */
export const VETERINARY_EVENT_CONFIG = {
  [EVENT_TYPES.VACCINATION]: {
    defaultDuration: 30,
    requiredFields: ['vaccine_type', 'dosage', 'batch_number'],
    followUpRequired: true,
    followUpDays: 14,
    category: EVENT_CATEGORIES.HEALTH,
    priority: EVENT_PRIORITY.HIGH
  },
  [EVENT_TYPES.TREATMENT]: {
    defaultDuration: 45,
    requiredFields: ['medication', 'dosage', 'diagnosis'],
    followUpRequired: true,
    followUpDays: 7,
    category: EVENT_CATEGORIES.HEALTH,
    priority: EVENT_PRIORITY.HIGH
  },
  [EVENT_TYPES.CHECKUP]: {
    defaultDuration: 30,
    requiredFields: [],
    followUpRequired: false,
    category: EVENT_CATEGORIES.HEALTH,
    priority: EVENT_PRIORITY.MEDIUM
  },
  [EVENT_TYPES.INSEMINATION]: {
    defaultDuration: 20,
    requiredFields: ['semen_batch', 'technique'],
    followUpRequired: true,
    followUpDays: 21,
    category: EVENT_CATEGORIES.REPRODUCTION,
    priority: EVENT_PRIORITY.HIGH
  },
  [EVENT_TYPES.PREGNANCY_CHECK]: {
    defaultDuration: 15,
    requiredFields: ['method'],
    followUpRequired: false,
    category: EVENT_CATEGORIES.REPRODUCTION,
    priority: EVENT_PRIORITY.MEDIUM
  }
};

/**
 * Configuración de colores por tipo de evento
 */
export const EVENT_COLORS = {
  [EVENT_TYPES.VACCINATION]: '#3B82F6', // Azul
  [EVENT_TYPES.TREATMENT]: '#EF4444', // Rojo
  [EVENT_TYPES.CHECKUP]: '#10B981', // Verde
  [EVENT_TYPES.SURGERY]: '#DC2626', // Rojo oscuro
  [EVENT_TYPES.DEWORMING]: '#F59E0B', // Amarillo
  [EVENT_TYPES.BREEDING]: '#EC4899', // Rosa
  [EVENT_TYPES.INSEMINATION]: '#8B5CF6', // Violeta
  [EVENT_TYPES.PREGNANCY_CHECK]: '#06B6D4', // Cian
  [EVENT_TYPES.DELIVERY]: '#84CC16', // Lima
  [EVENT_TYPES.WEANING]: '#F97316', // Naranja
  [EVENT_TYPES.MILKING]: '#0EA5E9', // Azul claro
  [EVENT_TYPES.WEIGHING]: '#6366F1', // Índigo
  [EVENT_TYPES.FEEDING]: '#22C55E', // Verde claro
  [EVENT_TYPES.SALE]: '#059669', // Esmeralda
  [EVENT_TYPES.PURCHASE]: '#7C3AED', // Violeta oscuro
  [EVENT_TYPES.TRANSPORTATION]: '#0D9488', // Teal
  [EVENT_TYPES.MAINTENANCE]: '#64748B', // Gris
  [EVENT_TYPES.INSPECTION]: '#1E40AF', // Azul oscuro
  [EVENT_TYPES.MEETING]: '#7C2D12', // Café
  [EVENT_TYPES.EMERGENCY]: '#DC2626' // Rojo emergencia
};

/**
 * Iconos por tipo de evento
 */
export const EVENT_ICONS = {
  [EVENT_TYPES.VACCINATION]: 'syringe',
  [EVENT_TYPES.TREATMENT]: 'pill',
  [EVENT_TYPES.CHECKUP]: 'stethoscope',
  [EVENT_TYPES.SURGERY]: 'scissors',
  [EVENT_TYPES.DEWORMING]: 'bug',
  [EVENT_TYPES.BREEDING]: 'heart',
  [EVENT_TYPES.INSEMINATION]: 'zap',
  [EVENT_TYPES.PREGNANCY_CHECK]: 'eye',
  [EVENT_TYPES.DELIVERY]: 'baby',
  [EVENT_TYPES.WEANING]: 'milk',
  [EVENT_TYPES.MILKING]: 'droplets',
  [EVENT_TYPES.WEIGHING]: 'scale',
  [EVENT_TYPES.FEEDING]: 'utensils',
  [EVENT_TYPES.SALE]: 'dollar-sign',
  [EVENT_TYPES.PURCHASE]: 'shopping-cart',
  [EVENT_TYPES.TRANSPORTATION]: 'truck',
  [EVENT_TYPES.MAINTENANCE]: 'wrench',
  [EVENT_TYPES.INSPECTION]: 'search',
  [EVENT_TYPES.MEETING]: 'users',
  [EVENT_TYPES.EMERGENCY]: 'alert-triangle'
};

// =============================================
// UTILIDADES Y HELPERS
// =============================================

/**
 * Función para calcular estado de evento basado en fechas
 * @param {object} event - Evento
 * @returns {string} - Estado calculado
 */
export const calculateEventStatus = (event) => {
  if (!event || !event.scheduled_date) return EVENT_STATUS.PENDING;
  
  const now = new Date();
  const scheduledDate = new Date(event.scheduled_date);
  
  // Si ya está completado, mantener ese estado
  if (event.status === EVENT_STATUS.COMPLETED) {
    return EVENT_STATUS.COMPLETED;
  }
  
  // Si está cancelado, mantener ese estado
  if (event.status === EVENT_STATUS.CANCELLED) {
    return EVENT_STATUS.CANCELLED;
  }
  
  // Si la fecha programada ya pasó y no está completado
  if (scheduledDate < now) {
    return EVENT_STATUS.OVERDUE;
  }
  
  // Si está en progreso
  if (event.start_date && !event.completion_date) {
    return EVENT_STATUS.IN_PROGRESS;
  }
  
  // Por defecto, programado
  return EVENT_STATUS.SCHEDULED;
};

/**
 * Función para determinar prioridad automática basada en tipo de evento
 * @param {string} eventType - Tipo de evento
 * @param {object} context - Contexto adicional (bovino, urgencia, etc.)
 * @returns {string} - Prioridad sugerida
 */
export const getAutomaticPriority = (eventType, context = {}) => {
  // Eventos críticos siempre son de alta prioridad
  const criticalEvents = [
    EVENT_TYPES.EMERGENCY,
    EVENT_TYPES.SURGERY,
    EVENT_TYPES.DELIVERY
  ];
  
  if (criticalEvents.includes(eventType)) {
    return EVENT_PRIORITY.URGENT;
  }
  
  // Eventos importantes
  const importantEvents = [
    EVENT_TYPES.VACCINATION,
    EVENT_TYPES.TREATMENT,
    EVENT_TYPES.INSEMINATION
  ];
  
  if (importantEvents.includes(eventType)) {
    return EVENT_PRIORITY.HIGH;
  }
  
  // Considerar contexto
  if (context.isOverdue) {
    return EVENT_PRIORITY.URGENT;
  }
  
  if (context.animalAge && context.animalAge < 6) { // Terneros
    return EVENT_PRIORITY.HIGH;
  }
  
  if (context.isPregnant) {
    return EVENT_PRIORITY.HIGH;
  }
  
  // Por defecto
  return EVENT_PRIORITY.MEDIUM;
};

/**
 * Función para calcular duración estimada basada en tipo y cantidad de bovinos
 * @param {string} eventType - Tipo de evento
 * @param {number} bovineCount - Cantidad de bovinos
 * @returns {number} - Duración en minutos
 */
export const calculateEstimatedDuration = (eventType, bovineCount = 1) => {
  const baseDuration = VETERINARY_EVENT_CONFIG[eventType]?.defaultDuration || 
                      DEFAULT_EVENT_CONFIG.defaultDuration;
  
  // Para eventos que se aplican por bovino
  const perAnimalEvents = [
    EVENT_TYPES.VACCINATION,
    EVENT_TYPES.TREATMENT,
    EVENT_TYPES.CHECKUP,
    EVENT_TYPES.WEIGHING,
    EVENT_TYPES.INSEMINATION
  ];
  
  if (perAnimalEvents.includes(eventType)) {
    return Math.ceil(baseDuration * bovineCount * 0.8); // Factor de eficiencia
  }
  
  return baseDuration;
};

/**
 * Función para generar recordatorios automáticos
 * @param {object} event - Evento
 * @returns {array} - Array de recordatorios
 */
export const generateAutoReminders = (event) => {
  const reminders = [];
  
  if (!event.scheduled_date) return reminders;
  
  const eventDate = new Date(event.scheduled_date);
  const now = new Date();
  const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);
  
  // Recordatorio 24 horas antes (solo si el evento es en más de 24 horas)
  if (hoursUntilEvent > 24) {
    reminders.push({
      timing: NOTIFICATION_TIMING.HOURS_24,
      method: REMINDER_METHODS.EMAIL,
      message: `Recordatorio: ${event.title} programado para mañana`
    });
  }
  
  // Recordatorio 2 horas antes (solo si el evento es en más de 2 horas)
  if (hoursUntilEvent > 2) {
    reminders.push({
      timing: NOTIFICATION_TIMING.HOURS_2,
      method: REMINDER_METHODS.PUSH_NOTIFICATION,
      message: `${event.title} en 2 horas`
    });
  }
  
  // Para eventos críticos, agregar recordatorio adicional
  if (event.priority === EVENT_PRIORITY.URGENT || 
      event.priority === EVENT_PRIORITY.CRITICAL) {
    if (hoursUntilEvent > 0.5) {
      reminders.push({
        timing: NOTIFICATION_TIMING.MINUTES_30,
        method: REMINDER_METHODS.SMS,
        message: `URGENTE: ${event.title} en 30 minutos`
      });
    }
  }
  
  return reminders;
};

/**
 * Función para validar conflictos de horario
 * @param {object} newEvent - Evento nuevo
 * @param {array} existingEvents - Eventos existentes
 * @returns {object} - Resultado de validación
 */
export const validateScheduleConflicts = (newEvent, existingEvents = []) => {
  const conflicts = [];
  
  if (!newEvent.scheduled_date || !newEvent.responsible_user_id) {
    return { hasConflicts: false, conflicts: [] };
  }
  
  const newStart = new Date(newEvent.scheduled_date);
  const newEnd = new Date(newStart.getTime() + (newEvent.estimated_duration || 60) * 60000);
  
  existingEvents.forEach(event => {
    if (event.id === newEvent.id) return; // Skip mismo evento si es edición
    
    // Solo verificar conflictos con el mismo responsable
    if (event.responsible_user_id !== newEvent.responsible_user_id) return;
    
    // Solo verificar eventos activos
    if ([EVENT_STATUS.CANCELLED, EVENT_STATUS.COMPLETED].includes(event.status)) return;
    
    const eventStart = new Date(event.scheduled_date);
    const eventEnd = new Date(eventStart.getTime() + (event.estimated_duration || 60) * 60000);
    
    // Verificar superposición
    if (newStart < eventEnd && newEnd > eventStart) {
      conflicts.push({
        event: event,
        overlapStart: new Date(Math.max(newStart, eventStart)),
        overlapEnd: new Date(Math.min(newEnd, eventEnd))
      });
    }
  });
  
  return {
    hasConflicts: conflicts.length > 0,
    conflicts
  };
};

/**
 * Función para formatear duración de evento
 * @param {number} minutes - Duración en minutos
 * @returns {string} - Duración formateada
 */
export const formatEventDuration = (minutes) => {
  if (!minutes) return 'No especificada';
  
  if (minutes < 60) {
    return `${minutes} min`;
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}min` 
      : `${hours}h`;
  } else {
    const days = Math.floor(minutes / 1440);
    const remainingHours = Math.floor((minutes % 1440) / 60);
    return remainingHours > 0 
      ? `${days}d ${remainingHours}h` 
      : `${days}d`;
  }
};

/**
 * Función para obtener eventos próximos a vencer
 * @param {array} events - Array de eventos
 * @param {number} daysAhead - Días hacia adelante a considerar
 * @returns {array} - Eventos próximos
 */
export const getUpcomingEvents = (events, daysAhead = 7) => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  
  return events.filter(event => {
    if (!event.scheduled_date) return false;
    
    const eventDate = new Date(event.scheduled_date);
    return eventDate >= now && 
           eventDate <= futureDate && 
           ![EVENT_STATUS.COMPLETED, EVENT_STATUS.CANCELLED].includes(event.status);
  }).sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));
};

/**
 * Función para obtener eventos vencidos
 * @param {array} events - Array de eventos
 * @returns {array} - Eventos vencidos
 */
export const getOverdueEvents = (events) => {
  const now = new Date();
  
  return events.filter(event => {
    if (!event.scheduled_date) return false;
    
    const eventDate = new Date(event.scheduled_date);
    return eventDate < now && 
           ![EVENT_STATUS.COMPLETED, EVENT_STATUS.CANCELLED].includes(event.status);
  }).sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));
};

// =============================================
// MENSAJES Y ETIQUETAS
// =============================================

/**
 * Mensajes de error específicos para eventos
 */
export const EVENT_ERROR_MESSAGES = {
  INVALID_DATE: 'Fecha de evento inválida',
  PAST_DATE: 'No se puede programar evento en fecha pasada',
  DURATION_TOO_LONG: 'Duración del evento demasiado larga',
  NO_BOVINES_SELECTED: 'Debe seleccionar al menos un bovino',
  TOO_MANY_BOVINES: 'Demasiados bovinos seleccionados para este tipo de evento',
  RESPONSIBLE_REQUIRED: 'Debe asignar un responsable',
  SCHEDULE_CONFLICT: 'Conflicto de horario con otro evento',
  INVALID_RECURRENCE: 'Configuración de recurrencia inválida',
  CANNOT_COMPLETE_FUTURE: 'No se puede completar evento futuro',
  ALREADY_COMPLETED: 'El evento ya está completado',
  CANNOT_EDIT_COMPLETED: 'No se puede editar evento completado',
  LOCATION_REQUIRED: 'Ubicación requerida para este tipo de evento',
  INSUFFICIENT_PERMISSIONS: 'Permisos insuficientes para esta acción'
};

/**
 * Mensajes de éxito
 */
export const EVENT_SUCCESS_MESSAGES = {
  CREATED: 'Evento creado exitosamente',
  UPDATED: 'Evento actualizado correctamente',
  COMPLETED: 'Evento completado exitosamente',
  CANCELLED: 'Evento cancelado',
  POSTPONED: 'Evento pospuesto',
  REMINDER_SENT: 'Recordatorio enviado',
  BULK_UPDATED: 'Eventos actualizados masivamente'
};

/**
 * Etiquetas para la interfaz
 */
export const EVENT_LABELS = {
  // Campos básicos
  title: 'Título del Evento',
  description: 'Descripción',
  type: 'Tipo de Evento',
  category: 'Categoría',
  priority: 'Prioridad',
  status: 'Estado',
  
  // Fechas y tiempo
  scheduled_date: 'Fecha Programada',
  scheduled_time: 'Hora Programada',
  estimated_duration: 'Duración Estimada',
  actual_duration: 'Duración Real',
  
  // Participantes
  responsible_user: 'Responsable',
  participants: 'Participantes',
  bovines: 'Bovinos Involucrados',
  
  // Ubicación
  location: 'Ubicación',
  facility: 'Instalación',
  area: 'Área',
  
  // Resultados
  result: 'Resultado',
  success_rate: 'Tasa de Éxito',
  complications: 'Complicaciones',
  notes: 'Notas',
  
  // Seguimiento
  follow_up_required: 'Requiere Seguimiento',
  follow_up_date: 'Fecha de Seguimiento',
  
  // Costos
  estimated_cost: 'Costo Estimado',
  actual_cost: 'Costo Real',
  
  // Recurrencia
  recurrence_type: 'Tipo de Repetición',
  recurrence_interval: 'Intervalo',
  recurrence_end: 'Fin de Repetición'
};

export default {
  EVENT_TYPES,
  EVENT_STATUS,
  EVENT_PRIORITY,
  EVENT_CATEGORIES,
  RECURRENCE_TYPES,
  NOTIFICATION_TIMING,
  EVENT_RESULTS,
  PARTICIPANT_ROLES,
  REMINDER_METHODS,
  EVENT_CREATION_SCHEMA,
  EVENT_COMPLETION_SCHEMA,
  EVENT_FILTER_SCHEMA,
  EVENT_TYPE,
  REMINDER_TYPE,
  EVENT_PARTICIPANT_TYPE,
  EVENT_ATTACHMENT_TYPE,
  EVENT_STATISTICS_TYPE,
  DEFAULT_EVENT_CONFIG,
  VETERINARY_EVENT_CONFIG,
  EVENT_COLORS,
  EVENT_ICONS,
  calculateEventStatus,
  getAutomaticPriority,
  calculateEstimatedDuration,
  generateAutoReminders,
  validateScheduleConflicts,
  formatEventDuration,
  getUpcomingEvents,
  getOverdueEvents,
  EVENT_ERROR_MESSAGES,
  EVENT_SUCCESS_MESSAGES,
  EVENT_LABELS
};