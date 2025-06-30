/**
 * Definiciones de tipos, esquemas y constantes para gestión de inventario
 * Sistema de gestión de bovinos - Inventario, suministros y control de stock
 */

// =============================================
// CONSTANTES DE INVENTARIO
// =============================================

/**
 * Tipos de productos en inventario
 */
export const PRODUCT_TYPES = {
  MEDICATION: 'medication',           // Medicamentos
  VACCINE: 'vaccine',                // Vacunas
  FEED: 'feed',                      // Alimentos
  SUPPLEMENT: 'supplement',          // Suplementos nutricionales
  EQUIPMENT: 'equipment',            // Equipos
  TOOL: 'tool',                      // Herramientas
  SUPPLY: 'supply',                  // Suministros generales
  CLEANING: 'cleaning',              // Productos de limpieza
  BREEDING: 'breeding',              // Suministros reproductivos
  SAFETY: 'safety',                  // Equipos de seguridad
  MAINTENANCE: 'maintenance',        // Productos de mantenimiento
  OFFICE: 'office'                   // Suministros de oficina
};

/**
 * Estados de stock
 */
export const STOCK_STATUS = {
  AVAILABLE: 'available',            // Disponible
  LOW_STOCK: 'low_stock',           // Stock bajo
  OUT_OF_STOCK: 'out_of_stock',     // Agotado
  EXPIRED: 'expired',               // Vencido
  NEAR_EXPIRY: 'near_expiry',       // Próximo a vencer
  RESERVED: 'reserved',             // Reservado
  DAMAGED: 'damaged',               // Dañado
  DISCONTINUED: 'discontinued'       // Descontinuado
};

/**
 * Categorías de medicamentos
 */
export const MEDICATION_CATEGORIES = {
  ANTIBIOTICS: 'antibiotics',              // Antibióticos
  ANTI_INFLAMMATORY: 'anti_inflammatory',  // Antiinflamatorios
  ANTIPARASITIC: 'antiparasitic',         // Antiparasitarios
  ANESTHETIC: 'anesthetic',               // Anestésicos
  HORMONE: 'hormone',                     // Hormonas
  VITAMIN: 'vitamin',                     // Vitaminas
  MINERAL: 'mineral',                     // Minerales
  PROBIOTIC: 'probiotic',                // Probióticos
  ANTISEPTIC: 'antiseptic',              // Antisépticos
  ANALGESIC: 'analgesic'                 // Analgésicos
};

/**
 * Categorías de alimentos
 */
export const FEED_CATEGORIES = {
  HAY: 'hay',                        // Heno
  SILAGE: 'silage',                  // Ensilado
  CONCENTRATE: 'concentrate',         // Concentrado
  GRAIN: 'grain',                    // Granos
  PELLETS: 'pellets',                // Pellets
  PASTURE_SEED: 'pasture_seed',      // Semillas de pasto
  MINERAL_SUPPLEMENT: 'mineral_supplement', // Suplemento mineral
  PROTEIN_SUPPLEMENT: 'protein_supplement', // Suplemento proteico
  ENERGY_SUPPLEMENT: 'energy_supplement',   // Suplemento energético
  SALT: 'salt'                       // Sales minerales
};

/**
 * Categorías de equipos
 */
export const EQUIPMENT_CATEGORIES = {
  MILKING: 'milking',                // Ordeño
  FEEDING: 'feeding',                // Alimentación
  HEALTH: 'health',                  // Salud/veterinario
  BREEDING: 'breeding',              // Reproducción
  HANDLING: 'handling',              // Manejo
  TRANSPORT: 'transport',            // Transporte
  COOLING: 'cooling',                // Refrigeración
  WEIGHING: 'weighing',              // Pesaje
  FENCING: 'fencing',                // Cercado
  WATER: 'water'                     // Sistemas de agua
};

/**
 * Tipos de movimientos de inventario
 */
export const MOVEMENT_TYPES = {
  INBOUND: 'inbound',                // Entrada
  OUTBOUND: 'outbound',              // Salida
  ADJUSTMENT: 'adjustment',          // Ajuste
  TRANSFER: 'transfer',              // Transferencia
  CONSUMPTION: 'consumption',        // Consumo
  WASTE: 'waste',                    // Desperdicio
  RETURN: 'return',                  // Devolución
  LOSS: 'loss',                      // Pérdida
  EXPIRED_REMOVAL: 'expired_removal', // Retiro por vencimiento
  DAMAGE_REMOVAL: 'damage_removal'    // Retiro por daño
};

/**
 * Estados de órdenes de compra
 */
export const ORDER_STATUS = {
  DRAFT: 'draft',                    // Borrador
  PENDING: 'pending',                // Pendiente
  APPROVED: 'approved',              // Aprobada
  ORDERED: 'ordered',                // Ordenada
  PARTIAL_RECEIVED: 'partial_received', // Parcialmente recibida
  RECEIVED: 'received',              // Recibida
  CANCELLED: 'cancelled',            // Cancelada
  RETURNED: 'returned'               // Devuelta
};

/**
 * Prioridades de órdenes
 */
export const ORDER_PRIORITY = {
  LOW: 'low',                        // Baja
  NORMAL: 'normal',                  // Normal
  HIGH: 'high',                      // Alta
  URGENT: 'urgent',                  // Urgente
  EMERGENCY: 'emergency'             // Emergencia
};

/**
 * Unidades de medida comunes
 */
export const MEASUREMENT_UNITS = {
  // Peso
  KG: 'kg',
  G: 'g',
  TON: 'ton',
  LB: 'lb',
  
  // Volumen
  L: 'l',
  ML: 'ml',
  GAL: 'gal',
  
  // Longitud
  M: 'm',
  CM: 'cm',
  MM: 'mm',
  FT: 'ft',
  IN: 'in',
  
  // Unidades
  UNIT: 'unit',
  PIECE: 'piece',
  BOX: 'box',
  BOTTLE: 'bottle',
  BAG: 'bag',
  PACK: 'pack',
  DOSE: 'dose'
};

/**
 * Tipos de almacén
 */
export const WAREHOUSE_TYPES = {
  MAIN: 'main',                      // Principal
  COLD_STORAGE: 'cold_storage',      // Refrigerado
  DRY_STORAGE: 'dry_storage',        // Almacén seco
  FEED_STORAGE: 'feed_storage',      // Almacén de alimentos
  EQUIPMENT: 'equipment',            // Almacén de equipos
  PHARMACY: 'pharmacy',              // Farmacia
  QUARANTINE: 'quarantine'           // Cuarentena
};

/**
 * Condiciones de almacenamiento
 */
export const STORAGE_CONDITIONS = {
  ROOM_TEMPERATURE: 'room_temperature',    // Temperatura ambiente
  REFRIGERATED: 'refrigerated',            // Refrigerado (2-8°C)
  FROZEN: 'frozen',                        // Congelado (-18°C o menos)
  DRY: 'dry',                             // Lugar seco
  DARK: 'dark',                           // Lugar oscuro
  VENTILATED: 'ventilated',               // Ventilado
  CONTROLLED_HUMIDITY: 'controlled_humidity' // Humedad controlada
};

// =============================================
// ESQUEMAS DE VALIDACIÓN
// =============================================

/**
 * Esquema de validación para productos de inventario
 */
export const INVENTORY_ITEM_SCHEMA = {
  name: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 200,
    message: 'El nombre debe tener entre 2 y 200 caracteres'
  },
  description: {
    required: false,
    type: 'string',
    maxLength: 1000,
    message: 'La descripción no puede exceder 1000 caracteres'
  },
  product_type: {
    required: true,
    type: 'string',
    enum: Object.values(PRODUCT_TYPES),
    message: 'Tipo de producto inválido'
  },
  category: {
    required: true,
    type: 'string',
    message: 'Categoría requerida'
  },
  subcategory: {
    required: false,
    type: 'string',
    maxLength: 100,
    message: 'Subcategoría inválida'
  },
  brand: {
    required: false,
    type: 'string',
    maxLength: 100,
    message: 'Marca no puede exceder 100 caracteres'
  },
  manufacturer: {
    required: false,
    type: 'string',
    maxLength: 100,
    message: 'Fabricante no puede exceder 100 caracteres'
  },
  sku: {
    required: false,
    type: 'string',
    maxLength: 50,
    pattern: /^[A-Z0-9\-_]+$/,
    message: 'SKU debe contener solo letras mayúsculas, números y guiones'
  },
  barcode: {
    required: false,
    type: 'string',
    pattern: /^\d{8,14}$/,
    message: 'Código de barras debe tener entre 8 y 14 dígitos'
  },
  unit_of_measure: {
    required: true,
    type: 'string',
    enum: Object.values(MEASUREMENT_UNITS),
    message: 'Unidad de medida inválida'
  },
  current_stock: {
    required: true,
    type: 'number',
    min: 0,
    max: 999999.99,
    decimals: 2,
    message: 'Stock actual debe ser un número positivo'
  },
  minimum_stock: {
    required: true,
    type: 'number',
    min: 0,
    max: 999999.99,
    decimals: 2,
    message: 'Stock mínimo debe ser un número positivo'
  },
  maximum_stock: {
    required: false,
    type: 'number',
    min: 0,
    max: 999999.99,
    decimals: 2,
    message: 'Stock máximo debe ser un número positivo'
  },
  reorder_point: {
    required: false,
    type: 'number',
    min: 0,
    max: 999999.99,
    decimals: 2,
    message: 'Punto de reorden debe ser un número positivo'
  },
  unit_cost: {
    required: false,
    type: 'number',
    min: 0,
    max: 999999.99,
    decimals: 2,
    message: 'Costo unitario debe ser un número positivo'
  },
  selling_price: {
    required: false,
    type: 'number',
    min: 0,
    max: 999999.99,
    decimals: 2,
    message: 'Precio de venta debe ser un número positivo'
  },
  expiry_date: {
    required: false,
    type: 'date',
    futureDate: true,
    message: 'Fecha de vencimiento debe ser futura'
  },
  storage_conditions: {
    required: false,
    type: 'array',
    items: {
      type: 'string',
      enum: Object.values(STORAGE_CONDITIONS)
    },
    message: 'Condiciones de almacenamiento inválidas'
  },
  warehouse_id: {
    required: true,
    type: 'string',
    format: 'uuid',
    message: 'Almacén requerido'
  },
  supplier_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'Proveedor inválido'
  },
  lot_batch_number: {
    required: false,
    type: 'string',
    maxLength: 50,
    message: 'Número de lote no puede exceder 50 caracteres'
  },
  requires_prescription: {
    required: false,
    type: 'boolean',
    default: false
  },
  is_controlled_substance: {
    required: false,
    type: 'boolean',
    default: false
  },
  withdrawal_period: {
    required: false,
    type: 'number',
    min: 0,
    max: 365,
    message: 'Período de retiro debe estar entre 0 y 365 días'
  }
};

/**
 * Esquema de validación para movimientos de inventario
 */
export const INVENTORY_MOVEMENT_SCHEMA = {
  item_id: {
    required: true,
    type: 'string',
    format: 'uuid',
    message: 'Producto requerido'
  },
  movement_type: {
    required: true,
    type: 'string',
    enum: Object.values(MOVEMENT_TYPES),
    message: 'Tipo de movimiento inválido'
  },
  quantity: {
    required: true,
    type: 'number',
    min: 0.01,
    max: 999999.99,
    decimals: 2,
    message: 'Cantidad debe ser mayor a 0'
  },
  unit_cost: {
    required: false,
    type: 'number',
    min: 0,
    max: 999999.99,
    decimals: 2,
    message: 'Costo unitario debe ser un número positivo'
  },
  total_cost: {
    required: false,
    type: 'number',
    min: 0,
    max: 999999999.99,
    decimals: 2,
    message: 'Costo total inválido'
  },
  reference_number: {
    required: false,
    type: 'string',
    maxLength: 50,
    message: 'Número de referencia no puede exceder 50 caracteres'
  },
  reason: {
    required: true,
    type: 'string',
    minLength: 3,
    maxLength: 500,
    message: 'Motivo debe tener entre 3 y 500 caracteres'
  },
  source_warehouse_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'Almacén origen inválido'
  },
  destination_warehouse_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'Almacén destino inválido'
  },
  related_bovine_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'Bovino relacionado inválido'
  },
  related_health_record_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'Registro de salud relacionado inválido'
  },
  expiry_date: {
    required: false,
    type: 'date',
    message: 'Fecha de vencimiento inválida'
  },
  lot_batch_number: {
    required: false,
    type: 'string',
    maxLength: 50,
    message: 'Número de lote no puede exceder 50 caracteres'
  },
  notes: {
    required: false,
    type: 'string',
    maxLength: 1000,
    message: 'Notas no pueden exceder 1000 caracteres'
  }
};

/**
 * Esquema de validación para órdenes de compra
 */
export const PURCHASE_ORDER_SCHEMA = {
  order_number: {
    required: false,
    type: 'string',
    maxLength: 50,
    pattern: /^[A-Z0-9\-_]+$/,
    message: 'Número de orden inválido'
  },
  supplier_id: {
    required: true,
    type: 'string',
    format: 'uuid',
    message: 'Proveedor requerido'
  },
  order_date: {
    required: true,
    type: 'date',
    message: 'Fecha de orden requerida'
  },
  expected_delivery_date: {
    required: false,
    type: 'date',
    futureDate: true,
    message: 'Fecha de entrega esperada debe ser futura'
  },
  priority: {
    required: false,
    type: 'string',
    enum: Object.values(ORDER_PRIORITY),
    default: ORDER_PRIORITY.NORMAL,
    message: 'Prioridad inválida'
  },
  delivery_address: {
    required: false,
    type: 'string',
    maxLength: 300,
    message: 'Dirección de entrega no puede exceder 300 caracteres'
  },
  subtotal: {
    required: true,
    type: 'number',
    min: 0.01,
    max: 999999999.99,
    decimals: 2,
    message: 'Subtotal debe ser mayor a 0'
  },
  tax_amount: {
    required: false,
    type: 'number',
    min: 0,
    max: 999999999.99,
    decimals: 2,
    message: 'Monto de impuestos inválido'
  },
  shipping_cost: {
    required: false,
    type: 'number',
    min: 0,
    max: 999999.99,
    decimals: 2,
    message: 'Costo de envío inválido'
  },
  total_amount: {
    required: true,
    type: 'number',
    min: 0.01,
    max: 999999999.99,
    decimals: 2,
    message: 'Monto total debe ser mayor a 0'
  },
  notes: {
    required: false,
    type: 'string',
    maxLength: 1000,
    message: 'Notas no pueden exceder 1000 caracteres'
  },
  items: {
    required: true,
    type: 'array',
    minItems: 1,
    maxItems: 100,
    message: 'Debe incluir al menos un producto'
  }
};

/**
 * Esquema de validación para proveedores
 */
export const SUPPLIER_SCHEMA = {
  name: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 200,
    message: 'El nombre debe tener entre 2 y 200 caracteres'
  },
  business_name: {
    required: false,
    type: 'string',
    maxLength: 200,
    message: 'Razón social no puede exceder 200 caracteres'
  },
  tax_id: {
    required: false,
    type: 'string',
    maxLength: 50,
    pattern: /^[A-Z0-9]+$/,
    message: 'RFC/NIT inválido'
  },
  contact_person: {
    required: false,
    type: 'string',
    maxLength: 100,
    message: 'Persona de contacto no puede exceder 100 caracteres'
  },
  email: {
    required: false,
    type: 'email',
    message: 'Email inválido'
  },
  phone: {
    required: false,
    type: 'string',
    pattern: /^(\+52|52)?\s?(\d{2,3})?\s?\d{3,4}\s?\d{4}$/,
    message: 'Teléfono inválido'
  },
  address: {
    required: false,
    type: 'string',
    maxLength: 300,
    message: 'Dirección no puede exceder 300 caracteres'
  },
  city: {
    required: false,
    type: 'string',
    maxLength: 100,
    message: 'Ciudad no puede exceder 100 caracteres'
  },
  state: {
    required: false,
    type: 'string',
    maxLength: 100,
    message: 'Estado no puede exceder 100 caracteres'
  },
  postal_code: {
    required: false,
    type: 'string',
    pattern: /^\d{5}$/,
    message: 'Código postal debe tener 5 dígitos'
  },
  payment_terms: {
    required: false,
    type: 'string',
    maxLength: 100,
    message: 'Términos de pago no pueden exceder 100 caracteres'
  },
  credit_limit: {
    required: false,
    type: 'number',
    min: 0,
    max: 999999999.99,
    decimals: 2,
    message: 'Límite de crédito inválido'
  },
  discount_percentage: {
    required: false,
    type: 'number',
    min: 0,
    max: 100,
    decimals: 2,
    message: 'Porcentaje de descuento debe estar entre 0 y 100'
  }
};

/**
 * Esquema de validación para filtros de inventario
 */
export const INVENTORY_FILTER_SCHEMA = {
  search: {
    required: false,
    type: 'string',
    maxLength: 100,
    message: 'Búsqueda muy larga'
  },
  product_type: {
    required: false,
    type: 'string',
    enum: Object.values(PRODUCT_TYPES),
    message: 'Tipo de producto inválido'
  },
  category: {
    required: false,
    type: 'string',
    message: 'Categoría inválida'
  },
  stock_status: {
    required: false,
    type: 'string',
    enum: Object.values(STOCK_STATUS),
    message: 'Estado de stock inválido'
  },
  warehouse_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'Almacén inválido'
  },
  supplier_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'Proveedor inválido'
  },
  expiry_date_start: {
    required: false,
    type: 'date',
    message: 'Fecha de vencimiento inicial inválida'
  },
  expiry_date_end: {
    required: false,
    type: 'date',
    message: 'Fecha de vencimiento final inválida'
  },
  stock_min: {
    required: false,
    type: 'number',
    min: 0,
    message: 'Stock mínimo inválido'
  },
  stock_max: {
    required: false,
    type: 'number',
    min: 0,
    message: 'Stock máximo inválido'
  }
};

// =============================================
// DEFINICIONES DE TIPOS DE DATOS
// =============================================

/**
 * Tipo base para productos de inventario
 */
export const INVENTORY_ITEM_TYPE = {
  id: 'string', // UUID
  name: 'string',
  description: 'string?',
  product_type: 'string', // PRODUCT_TYPES
  category: 'string',
  subcategory: 'string?',
  
  // Identificación
  sku: 'string?',
  barcode: 'string?',
  internal_code: 'string?',
  
  // Fabricante y marca
  brand: 'string?',
  manufacturer: 'string?',
  model: 'string?',
  
  // Stock y medidas
  current_stock: 'number',
  minimum_stock: 'number',
  maximum_stock: 'number?',
  reorder_point: 'number?',
  unit_of_measure: 'string', // MEASUREMENT_UNITS
  
  // Precios y costos
  unit_cost: 'number?',
  selling_price: 'number?',
  average_cost: 'number?',
  last_purchase_cost: 'number?',
  
  // Fechas importantes
  purchase_date: 'date?',
  expiry_date: 'date?',
  manufacturing_date: 'date?',
  
  // Lote y trazabilidad
  lot_batch_number: 'string?',
  serial_number: 'string?',
  
  // Almacenamiento
  warehouse: {
    id: 'string',
    name: 'string',
    type: 'string'
  },
  location_in_warehouse: 'string?',
  storage_conditions: 'array',
  
  // Proveedor
  supplier: {
    id: 'string?',
    name: 'string?',
    contact_info: 'object?'
  },
  
  // Estado y alertas
  stock_status: 'string', // STOCK_STATUS
  alerts: 'array',
  days_to_expiry: 'number?',
  stock_level_percentage: 'number',
  
  // Características específicas para medicamentos
  active_ingredient: 'string?',
  concentration: 'string?',
  dosage_form: 'string?',
  administration_route: 'string?',
  requires_prescription: 'boolean',
  is_controlled_substance: 'boolean',
  withdrawal_period: 'number?', // días
  
  // Características específicas para alimentos
  protein_content: 'number?',
  fat_content: 'number?',
  fiber_content: 'number?',
  energy_content: 'number?',
  nutritional_info: 'object?',
  
  // Historial de movimientos
  last_movement_date: 'date?',
  last_movement_type: 'string?',
  total_movements: 'number',
  
  // Metadatos
  is_active: 'boolean',
  is_taxable: 'boolean',
  rancho_id: 'string',
  created_at: 'datetime',
  created_by: 'string',
  updated_at: 'datetime?',
  updated_by: 'string?'
};

/**
 * Tipo para movimientos de inventario
 */
export const INVENTORY_MOVEMENT_TYPE = {
  id: 'string', // UUID
  item: {
    id: 'string',
    name: 'string',
    sku: 'string?',
    unit_of_measure: 'string'
  },
  movement_type: 'string', // MOVEMENT_TYPES
  
  // Cantidades
  quantity: 'number',
  previous_stock: 'number',
  new_stock: 'number',
  
  // Costos
  unit_cost: 'number?',
  total_cost: 'number?',
  
  // Referencias
  reference_number: 'string?',
  order_id: 'string?',
  invoice_number: 'string?',
  
  // Ubicaciones
  source_warehouse: {
    id: 'string?',
    name: 'string?'
  },
  destination_warehouse: {
    id: 'string?',
    name: 'string?'
  },
  
  // Relaciones con otros módulos
  related_bovine: {
    id: 'string?',
    numero_identificacion: 'string?',
    nombre: 'string?'
  },
  related_health_record: {
    id: 'string?',
    consultation_type: 'string?',
    date: 'date?'
  },
  related_event: {
    id: 'string?',
    title: 'string?',
    type: 'string?'
  },
  
  // Información del lote
  lot_batch_number: 'string?',
  expiry_date: 'date?',
  
  // Justificación
  reason: 'string',
  notes: 'string?',
  approved_by: 'string?',
  
  // Documentos
  attachments: 'array',
  
  // Metadatos
  movement_date: 'datetime',
  created_by: 'string',
  user: {
    id: 'string',
    nombre: 'string',
    apellido: 'string'
  },
  rancho_id: 'string'
};

/**
 * Tipo para órdenes de compra
 */
export const PURCHASE_ORDER_TYPE = {
  id: 'string', // UUID
  order_number: 'string',
  status: 'string', // ORDER_STATUS
  priority: 'string', // ORDER_PRIORITY
  
  // Fechas
  order_date: 'date',
  expected_delivery_date: 'date?',
  actual_delivery_date: 'date?',
  
  // Proveedor
  supplier: {
    id: 'string',
    name: 'string',
    business_name: 'string?',
    contact_person: 'string?',
    email: 'string?',
    phone: 'string?'
  },
  
  // Entrega
  delivery_address: 'string?',
  delivery_contact: 'string?',
  delivery_phone: 'string?',
  delivery_instructions: 'string?',
  
  // Productos
  items: 'array', // Array de ORDER_ITEM_TYPE
  total_items: 'number',
  total_quantity: 'number',
  
  // Montos
  subtotal: 'number',
  tax_rate: 'number?',
  tax_amount: 'number?',
  shipping_cost: 'number?',
  discount_amount: 'number?',
  total_amount: 'number',
  
  // Estado de recepción
  received_items: 'number',
  pending_items: 'number',
  completion_percentage: 'number',
  
  // Aprobación
  requested_by: {
    id: 'string',
    nombre: 'string',
    apellido: 'string'
  },
  approved_by: {
    id: 'string?',
    nombre: 'string?',
    apellido: 'string?'
  },
  approval_date: 'datetime?',
  approval_notes: 'string?',
  
  // Documentos
  purchase_requisition_id: 'string?',
  invoice_number: 'string?',
  receipt_number: 'string?',
  attachments: 'array',
  
  // Notas
  notes: 'string?',
  internal_notes: 'string?',
  cancellation_reason: 'string?',
  
  // Metadatos
  rancho_id: 'string',
  created_at: 'datetime',
  updated_at: 'datetime?'
};

/**
 * Tipo para ítems de órdenes de compra
 */
export const ORDER_ITEM_TYPE = {
  id: 'string',
  order_id: 'string',
  item: {
    id: 'string?',
    name: 'string',
    sku: 'string?',
    description: 'string?'
  },
  quantity_ordered: 'number',
  quantity_received: 'number',
  quantity_pending: 'number',
  unit_of_measure: 'string',
  unit_cost: 'number',
  total_cost: 'number',
  tax_rate: 'number?',
  discount_percentage: 'number?',
  notes: 'string?',
  received_date: 'datetime?',
  expiry_date: 'date?',
  lot_batch_number: 'string?',
  status: 'string' // 'pending', 'partial', 'received', 'cancelled'
};

/**
 * Tipo para proveedores
 */
export const SUPPLIER_TYPE = {
  id: 'string', // UUID
  name: 'string',
  business_name: 'string?',
  tax_id: 'string?',
  
  // Contacto
  contact_person: 'string?',
  email: 'string?',
  phone: 'string?',
  mobile: 'string?',
  website: 'string?',
  
  // Dirección
  address: 'string?',
  city: 'string?',
  state: 'string?',
  postal_code: 'string?',
  country: 'string?',
  
  // Términos comerciales
  payment_terms: 'string?',
  credit_limit: 'number?',
  discount_percentage: 'number?',
  delivery_time_days: 'number?',
  minimum_order_amount: 'number?',
  
  // Categorías de productos que suministra
  product_categories: 'array',
  specializes_in: 'array',
  
  // Evaluación y estadísticas
  rating: 'number?',
  total_orders: 'number',
  total_amount: 'number',
  average_order_value: 'number',
  on_time_delivery_rate: 'number?',
  quality_rating: 'number?',
  service_rating: 'number?',
  last_order_date: 'date?',
  
  // Certificaciones
  certifications: 'array',
  licenses: 'array',
  
  // Estado
  is_active: 'boolean',
  is_preferred: 'boolean',
  risk_level: 'string?', // 'low', 'medium', 'high'
  
  // Metadatos
  rancho_id: 'string',
  created_at: 'datetime',
  updated_at: 'datetime?',
  notes: 'string?'
};

/**
 * Tipo para almacenes
 */
export const WAREHOUSE_TYPE = {
  id: 'string', // UUID
  name: 'string',
  code: 'string?',
  type: 'string', // WAREHOUSE_TYPES
  description: 'string?',
  
  // Ubicación
  location: {
    latitude: 'number?',
    longitude: 'number?',
    address: 'string?',
    building: 'string?',
    floor: 'string?',
    room: 'string?'
  },
  
  // Capacidad
  total_capacity: 'number?',
  used_capacity: 'number?',
  available_capacity: 'number?',
  capacity_unit: 'string?',
  
  // Condiciones ambientales
  temperature_controlled: 'boolean',
  humidity_controlled: 'boolean',
  temperature_range: {
    min: 'number?',
    max: 'number?',
    unit: 'string?'
  },
  humidity_range: {
    min: 'number?',
    max: 'number?',
    unit: 'string?'
  },
  
  // Seguridad
  security_level: 'string?', // 'basic', 'medium', 'high'
  access_control: 'boolean',
  surveillance: 'boolean',
  fire_suppression: 'boolean',
  
  // Personal
  manager: {
    id: 'string?',
    nombre: 'string?',
    apellido: 'string?'
  },
  authorized_personnel: 'array',
  
  // Estadísticas
  total_items: 'number',
  total_value: 'number',
  last_inventory_date: 'date?',
  
  // Estado
  is_active: 'boolean',
  operational_hours: 'string?',
  
  // Metadatos
  rancho_id: 'string',
  created_at: 'datetime',
  updated_at: 'datetime?'
};

/**
 * Tipo para estadísticas de inventario
 */
export const INVENTORY_STATISTICS_TYPE = {
  period: {
    start_date: 'date',
    end_date: 'date',
    type: 'string' // 'day', 'week', 'month', 'quarter', 'year'
  },
  
  // Resumen general
  total_items: 'number',
  total_value: 'number',
  total_warehouses: 'number',
  total_suppliers: 'number',
  
  // Estados de stock
  stock_distribution: {
    available: 'number',
    low_stock: 'number',
    out_of_stock: 'number',
    expired: 'number',
    near_expiry: 'number'
  },
  
  // Por tipo de producto
  by_product_type: 'array',
  
  // Por categoría
  by_category: 'array',
  
  // Por almacén
  by_warehouse: 'array',
  
  // Movimientos
  movement_stats: {
    total_movements: 'number',
    inbound_movements: 'number',
    outbound_movements: 'number',
    total_inbound_value: 'number',
    total_outbound_value: 'number',
    most_active_items: 'array'
  },
  
  // Alertas
  current_alerts: {
    low_stock: 'number',
    expired: 'number',
    near_expiry: 'number',
    overstock: 'number',
    reorder_needed: 'number'
  },
  
  // Órdenes de compra
  purchase_order_stats: {
    pending_orders: 'number',
    pending_value: 'number',
    delivered_orders: 'number',
    delivered_value: 'number',
    average_delivery_time: 'number'
  },
  
  // Tendencias
  consumption_trends: 'array',
  cost_trends: 'array',
  supplier_performance: 'array',
  
  // Proyecciones
  reorder_recommendations: 'array',
  cost_projections: 'array'
};

// =============================================
// CONFIGURACIONES DE INVENTARIO
// =============================================

/**
 * Configuración de alertas de inventario
 */
export const INVENTORY_ALERTS_CONFIG = {
  low_stock: {
    threshold_percentage: 20, // Porcentaje del stock mínimo
    notification_methods: ['email', 'dashboard'],
    escalation_days: 3
  },
  expiry_warning: {
    days_before_expiry: [30, 15, 7, 1],
    critical_days: 7,
    notification_methods: ['email', 'sms', 'dashboard']
  },
  overstock: {
    threshold_percentage: 150, // Porcentaje sobre stock máximo
    notification_methods: ['email', 'dashboard']
  },
  zero_stock: {
    immediate_notification: true,
    notification_methods: ['email', 'sms', 'dashboard']
  },
  reorder_point: {
    automatic_order_creation: false,
    notification_methods: ['email', 'dashboard']
  }
};

/**
 * Configuración de categorías por defecto
 */
export const DEFAULT_INVENTORY_CATEGORIES = {
  medications: [
    'Antibióticos',
    'Antiinflamatorios',
    'Antiparasitarios',
    'Anestésicos',
    'Hormonas',
    'Vitaminas y Minerales',
    'Probióticos',
    'Antisépticos'
  ],
  feeds: [
    'Heno',
    'Ensilado',
    'Concentrados',
    'Granos',
    'Suplementos Proteicos',
    'Suplementos Energéticos',
    'Sales Minerales',
    'Semillas de Pasto'
  ],
  equipment: [
    'Ordeño',
    'Alimentación',
    'Manejo de Ganado',
    'Transporte',
    'Refrigeración',
    'Pesaje',
    'Cercado',
    'Sistemas de Agua'
  ],
  supplies: [
    'Productos de Limpieza',
    'Suministros Veterinarios',
    'Equipos de Seguridad',
    'Material de Oficina',
    'Herramientas',
    'Repuestos y Mantenimiento'
  ]
};

/**
 * Configuración de reportes de inventario
 */
export const INVENTORY_REPORTS_CONFIG = {
  stock_report: {
    include_values: true,
    include_expiry_dates: true,
    include_supplier_info: true,
    grouping_options: ['category', 'warehouse', 'supplier']
  },
  movement_report: {
    include_costs: true,
    include_reasons: true,
    include_approvals: true,
    date_ranges: ['today', 'week', 'month', 'quarter', 'year']
  },
  expiry_report: {
    warning_periods: [7, 15, 30, 60, 90],
    include_disposal_tracking: true,
    include_cost_impact: true
  },
  abc_analysis: {
    value_threshold_a: 80, // % del valor total
    value_threshold_b: 95, // % del valor total
    movement_analysis: true,
    reorder_optimization: true
  }
};

// =============================================
// UTILIDADES Y HELPERS
// =============================================

/**
 * Función para calcular estado de stock
 * @param {number} currentStock - Stock actual
 * @param {number} minimumStock - Stock mínimo
 * @param {number} maximumStock - Stock máximo
 * @param {date} expiryDate - Fecha de vencimiento
 * @returns {object} - Estado calculado
 */
export const calculateStockStatus = (currentStock, minimumStock, maximumStock = null, expiryDate = null) => {
  const now = new Date();
  
  // Verificar vencimiento
  if (expiryDate) {
    const daysToExpiry = Math.ceil((new Date(expiryDate) - now) / (1000 * 60 * 60 * 24));
    
    if (daysToExpiry < 0) {
      return {
        status: STOCK_STATUS.EXPIRED,
        level: 'critical',
        message: 'Producto vencido',
        daysToExpiry: Math.abs(daysToExpiry),
        action: 'remove'
      };
    } else if (daysToExpiry <= 7) {
      return {
        status: STOCK_STATUS.NEAR_EXPIRY,
        level: 'warning',
        message: `Vence en ${daysToExpiry} día${daysToExpiry !== 1 ? 's' : ''}`,
        daysToExpiry,
        action: 'use_soon'
      };
    }
  }
  
  // Verificar niveles de stock
  if (currentStock === 0) {
    return {
      status: STOCK_STATUS.OUT_OF_STOCK,
      level: 'critical',
      message: 'Sin stock disponible',
      stockLevelPercentage: 0,
      action: 'reorder_urgent'
    };
  }
  
  if (currentStock <= minimumStock) {
    const percentage = minimumStock > 0 ? (currentStock / minimumStock) * 100 : 0;
    return {
      status: STOCK_STATUS.LOW_STOCK,
      level: percentage < 50 ? 'critical' : 'warning',
      message: 'Stock bajo',
      stockLevelPercentage: percentage,
      action: 'reorder'
    };
  }
  
  if (maximumStock && currentStock > maximumStock) {
    const percentage = (currentStock / maximumStock) * 100;
    return {
      status: 'overstock',
      level: 'info',
      message: 'Sobre stock',
      stockLevelPercentage: percentage,
      action: 'review'
    };
  }
  
  // Stock normal
  const percentage = minimumStock > 0 ? (currentStock / minimumStock) * 100 : 100;
  return {
    status: STOCK_STATUS.AVAILABLE,
    level: 'normal',
    message: 'Stock disponible',
    stockLevelPercentage: Math.min(percentage, 100),
    action: 'none'
  };
};

/**
 * Función para calcular punto de reorden
 * @param {number} averageConsumption - Consumo promedio diario
 * @param {number} leadTimeDays - Tiempo de entrega en días
 * @param {number} safetyStock - Stock de seguridad
 * @returns {number} - Punto de reorden
 */
export const calculateReorderPoint = (averageConsumption, leadTimeDays, safetyStock = 0) => {
  if (!averageConsumption || averageConsumption <= 0) return 0;
  
  const leadTimeDemand = averageConsumption * leadTimeDays;
  return Math.ceil(leadTimeDemand + safetyStock);
};

/**
 * Función para calcular cantidad económica de pedido (EOQ)
 * @param {number} annualDemand - Demanda anual
 * @param {number} orderingCost - Costo de pedido
 * @param {number} holdingCost - Costo de mantenimiento
 * @returns {number} - Cantidad económica de pedido
 */
export const calculateEOQ = (annualDemand, orderingCost, holdingCost) => {
  if (!annualDemand || !orderingCost || !holdingCost) return 0;
  
  return Math.sqrt((2 * annualDemand * orderingCost) / holdingCost);
};

/**
 * Función para calcular valor del inventario
 * @param {array} items - Array de productos
 * @param {string} method - Método de valoración ('fifo', 'lifo', 'average')
 * @returns {object} - Valor calculado
 */
export const calculateInventoryValue = (items, method = 'average') => {
  let totalValue = 0;
  let totalQuantity = 0;
  
  items.forEach(item => {
    let unitValue = 0;
    
    switch (method) {
      case 'fifo':
        unitValue = item.unit_cost || item.last_purchase_cost || 0;
        break;
      case 'lifo':
        unitValue = item.last_purchase_cost || item.unit_cost || 0;
        break;
      case 'average':
      default:
        unitValue = item.average_cost || item.unit_cost || 0;
        break;
    }
    
    const itemValue = item.current_stock * unitValue;
    totalValue += itemValue;
    totalQuantity += item.current_stock;
  });
  
  return {
    totalValue: Math.round(totalValue * 100) / 100,
    totalQuantity,
    averageUnitValue: totalQuantity > 0 ? totalValue / totalQuantity : 0,
    method
  };
};

/**
 * Función para generar alertas de inventario
 * @param {object} item - Producto de inventario
 * @returns {array} - Alertas generadas
 */
export const generateInventoryAlerts = (item) => {
  const alerts = [];
  const now = new Date();
  
  // Alerta de stock bajo
  if (item.current_stock <= item.minimum_stock) {
    const severity = item.current_stock === 0 ? 'critical' : 'warning';
    alerts.push({
      type: 'low_stock',
      severity,
      message: item.current_stock === 0 ? 'Sin stock disponible' : 'Stock por debajo del mínimo',
      description: `Stock actual: ${item.current_stock} ${item.unit_of_measure}`,
      action: 'Realizar pedido urgente',
      priority: severity === 'critical' ? 1 : 2
    });
  }
  
  // Alerta de vencimiento
  if (item.expiry_date) {
    const daysToExpiry = Math.ceil((new Date(item.expiry_date) - now) / (1000 * 60 * 60 * 24));
    
    if (daysToExpiry < 0) {
      alerts.push({
        type: 'expired',
        severity: 'critical',
        message: 'Producto vencido',
        description: `Venció hace ${Math.abs(daysToExpiry)} días`,
        action: 'Retirar del inventario inmediatamente',
        priority: 1
      });
    } else if (daysToExpiry <= 30) {
      const severity = daysToExpiry <= 7 ? 'warning' : 'info';
      alerts.push({
        type: 'near_expiry',
        severity,
        message: 'Próximo a vencer',
        description: `Vence en ${daysToExpiry} días`,
        action: 'Usar prioritariamente',
        priority: daysToExpiry <= 7 ? 2 : 3
      });
    }
  }
  
  // Alerta de punto de reorden
  if (item.reorder_point && item.current_stock <= item.reorder_point) {
    alerts.push({
      type: 'reorder_point',
      severity: 'info',
      message: 'Punto de reorden alcanzado',
      description: `Stock actual: ${item.current_stock}, Punto de reorden: ${item.reorder_point}`,
      action: 'Evaluar realizar pedido',
      priority: 3
    });
  }
  
  return alerts.sort((a, b) => a.priority - b.priority);
};

/**
 * Función para validar movimiento de inventario
 * @param {object} movement - Movimiento propuesto
 * @param {object} currentItem - Estado actual del producto
 * @returns {object} - Resultado de validación
 */
export const validateInventoryMovement = (movement, currentItem) => {
  const errors = [];
  const warnings = [];
  
  // Validar stock suficiente para salidas
  if ([MOVEMENT_TYPES.OUTBOUND, MOVEMENT_TYPES.CONSUMPTION, MOVEMENT_TYPES.WASTE].includes(movement.movement_type)) {
    if (movement.quantity > currentItem.current_stock) {
      errors.push('La cantidad supera el stock disponible');
    }
    
    // Advertir si queda muy poco stock
    const remainingStock = currentItem.current_stock - movement.quantity;
    if (remainingStock < currentItem.minimum_stock) {
      warnings.push('El movimiento dejará el stock por debajo del mínimo');
    }
  }
  
  // Validar transferencias entre almacenes
  if (movement.movement_type === MOVEMENT_TYPES.TRANSFER) {
    if (!movement.source_warehouse_id || !movement.destination_warehouse_id) {
      errors.push('Transferencia requiere almacén origen y destino');
    }
    
    if (movement.source_warehouse_id === movement.destination_warehouse_id) {
      errors.push('Almacén origen y destino no pueden ser el mismo');
    }
  }
  
  // Validar productos vencidos
  if (currentItem.expiry_date) {
    const now = new Date();
    const expiryDate = new Date(currentItem.expiry_date);
    
    if (expiryDate < now && movement.movement_type === MOVEMENT_TYPES.OUTBOUND) {
      errors.push('No se puede usar producto vencido');
    }
  }
  
  // Validar medicamentos controlados
  if (currentItem.is_controlled_substance && movement.movement_type === MOVEMENT_TYPES.OUTBOUND) {
    if (!movement.authorized_by) {
      errors.push('Medicamento controlado requiere autorización');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    canProceedWithWarnings: errors.length === 0 && warnings.length > 0
  };
};

/**
 * Función para calcular costo promedio ponderado
 * @param {array} movements - Historial de movimientos
 * @returns {number} - Costo promedio
 */
export const calculateWeightedAverageCost = (movements) => {
  let totalCost = 0;
  let totalQuantity = 0;
  
  // Filtrar solo movimientos de entrada con costo
  const inboundMovements = movements.filter(m => 
    m.movement_type === MOVEMENT_TYPES.INBOUND && 
    m.unit_cost && 
    m.unit_cost > 0
  );
  
  inboundMovements.forEach(movement => {
    totalCost += movement.quantity * movement.unit_cost;
    totalQuantity += movement.quantity;
  });
  
  return totalQuantity > 0 ? totalCost / totalQuantity : 0;
};

// =============================================
// MENSAJES Y ETIQUETAS
// =============================================

/**
 * Mensajes de error específicos para inventario
 */
export const INVENTORY_ERROR_MESSAGES = {
  INSUFFICIENT_STOCK: 'Stock insuficiente',
  EXPIRED_PRODUCT: 'Producto vencido no puede ser usado',
  INVALID_QUANTITY: 'Cantidad inválida',
  WAREHOUSE_NOT_FOUND: 'Almacén no encontrado',
  SUPPLIER_NOT_FOUND: 'Proveedor no encontrado',
  PRODUCT_NOT_FOUND: 'Producto no encontrado',
  DUPLICATE_SKU: 'SKU ya existe',
  DUPLICATE_BARCODE: 'Código de barras ya existe',
  INVALID_MOVEMENT_TYPE: 'Tipo de movimiento inválido',
  UNAUTHORIZED_MOVEMENT: 'Movimiento no autorizado',
  CONTROLLED_SUBSTANCE_REQUIRES_AUTH: 'Sustancia controlada requiere autorización',
  INVALID_TRANSFER: 'Transferencia inválida entre almacenes',
  ORDER_LIMIT_EXCEEDED: 'Límite de pedido excedido',
  MINIMUM_ORDER_NOT_MET: 'No se alcanza el pedido mínimo',
  INVALID_EXPIRY_DATE: 'Fecha de vencimiento inválida'
};

/**
 * Mensajes de éxito
 */
export const INVENTORY_SUCCESS_MESSAGES = {
  ITEM_CREATED: 'Producto agregado al inventario',
  ITEM_UPDATED: 'Producto actualizado correctamente',
  ITEM_DELETED: 'Producto eliminado del inventario',
  MOVEMENT_RECORDED: 'Movimiento registrado exitosamente',
  ORDER_CREATED: 'Orden de compra creada',
  ORDER_APPROVED: 'Orden de compra aprobada',
  ORDER_RECEIVED: 'Orden recibida y procesada',
  SUPPLIER_CREATED: 'Proveedor registrado exitosamente',
  WAREHOUSE_CREATED: 'Almacén creado exitosamente',
  STOCK_ADJUSTED: 'Stock ajustado correctamente',
  TRANSFER_COMPLETED: 'Transferencia completada',
  ALERT_RESOLVED: 'Alerta resuelta',
  REPORT_GENERATED: 'Reporte generado exitosamente'
};

/**
 * Etiquetas para la interfaz
 */
export const INVENTORY_LABELS = {
  // Productos
  product_name: 'Nombre del Producto',
  product_type: 'Tipo de Producto',
  category: 'Categoría',
  subcategory: 'Subcategoría',
  brand: 'Marca',
  manufacturer: 'Fabricante',
  sku: 'SKU',
  barcode: 'Código de Barras',
  
  // Stock
  current_stock: 'Stock Actual',
  minimum_stock: 'Stock Mínimo',
  maximum_stock: 'Stock Máximo',
  reorder_point: 'Punto de Reorden',
  unit_of_measure: 'Unidad de Medida',
  stock_status: 'Estado de Stock',
  
  // Precios
  unit_cost: 'Costo Unitario',
  selling_price: 'Precio de Venta',
  total_value: 'Valor Total',
  average_cost: 'Costo Promedio',
  
  // Fechas
  purchase_date: 'Fecha de Compra',
  expiry_date: 'Fecha de Vencimiento',
  manufacturing_date: 'Fecha de Fabricación',
  
  // Ubicación
  warehouse: 'Almacén',
  location: 'Ubicación',
  storage_conditions: 'Condiciones de Almacenamiento',
  
  // Movimientos
  movement_type: 'Tipo de Movimiento',
  quantity: 'Cantidad',
  reason: 'Motivo',
  reference_number: 'Número de Referencia',
  
  // Proveedores
  supplier: 'Proveedor',
  supplier_name: 'Nombre del Proveedor',
  contact_person: 'Persona de Contacto',
  payment_terms: 'Términos de Pago',
  
  // Órdenes
  order_number: 'Número de Orden',
  order_date: 'Fecha de Orden',
  delivery_date: 'Fecha de Entrega',
  order_status: 'Estado de Orden',
  priority: 'Prioridad'
};

export default {
  PRODUCT_TYPES,
  STOCK_STATUS,
  MEDICATION_CATEGORIES,
  FEED_CATEGORIES,
  EQUIPMENT_CATEGORIES,
  MOVEMENT_TYPES,
  ORDER_STATUS,
  ORDER_PRIORITY,
  MEASUREMENT_UNITS,
  WAREHOUSE_TYPES,
  STORAGE_CONDITIONS,
  INVENTORY_ITEM_SCHEMA,
  INVENTORY_MOVEMENT_SCHEMA,
  PURCHASE_ORDER_SCHEMA,
  SUPPLIER_SCHEMA,
  INVENTORY_FILTER_SCHEMA,
  INVENTORY_ITEM_TYPE,
  INVENTORY_MOVEMENT_TYPE,
  PURCHASE_ORDER_TYPE,
  ORDER_ITEM_TYPE,
  SUPPLIER_TYPE,
  WAREHOUSE_TYPE,
  INVENTORY_STATISTICS_TYPE,
  INVENTORY_ALERTS_CONFIG,
  DEFAULT_INVENTORY_CATEGORIES,
  INVENTORY_REPORTS_CONFIG,
  calculateStockStatus,
  calculateReorderPoint,
  calculateEOQ,
  calculateInventoryValue,
  generateInventoryAlerts,
  validateInventoryMovement,
  calculateWeightedAverageCost,
  INVENTORY_ERROR_MESSAGES,
  INVENTORY_SUCCESS_MESSAGES,
  INVENTORY_LABELS
};