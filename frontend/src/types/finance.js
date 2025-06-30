/**
 * Definiciones de tipos, esquemas y constantes para gestión financiera
 * Sistema de gestión de bovinos - Finanzas, presupuestos y análisis económico
 */

// =============================================
// CONSTANTES FINANCIERAS
// =============================================

/**
 * Tipos de transacciones financieras
 */
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
  ADJUSTMENT: 'adjustment',
  REFUND: 'refund'
};

/**
 * Estados de transacciones
 */
export const TRANSACTION_STATUS = {
  PENDING: 'pending',           // Pendiente
  APPROVED: 'approved',         // Aprobado
  PAID: 'paid',                // Pagado
  CANCELLED: 'cancelled',       // Cancelado
  REJECTED: 'rejected',         // Rechazado
  OVERDUE: 'overdue',          // Vencido
  PARTIAL: 'partial'           // Pago parcial
};

/**
 * Categorías de ingresos específicas para ganadería
 */
export const INCOME_CATEGORIES = {
  // Ventas directas
  LIVESTOCK_SALES: 'livestock_sales',
  MILK_SALES: 'milk_sales',
  MEAT_SALES: 'meat_sales',
  BREEDING_STOCK_SALES: 'breeding_stock_sales',
  
  // Servicios
  BREEDING_SERVICES: 'breeding_services',
  CONSULTING_SERVICES: 'consulting_services',
  EQUIPMENT_RENTAL: 'equipment_rental',
  TRANSPORTATION_SERVICES: 'transportation_services',
  
  // Subsidios y apoyos
  GOVERNMENT_SUBSIDIES: 'government_subsidies',
  INSURANCE_CLAIMS: 'insurance_claims',
  GRANTS: 'grants',
  
  // Otros ingresos
  BY_PRODUCTS: 'by_products',
  ASSET_SALES: 'asset_sales',
  INTEREST_INCOME: 'interest_income',
  OTHER_INCOME: 'other_income'
};

/**
 * Categorías de gastos específicas para ganadería
 */
export const EXPENSE_CATEGORIES = {
  // Alimentación y nutrición
  FEED_NUTRITION: 'feed_nutrition',
  HAY_FORAGE: 'hay_forage',
  GRAIN_CONCENTRATES: 'grain_concentrates',
  SUPPLEMENTS: 'supplements',
  PASTURE_MANAGEMENT: 'pasture_management',
  
  // Salud veterinaria
  VETERINARY_SERVICES: 'veterinary_services',
  MEDICATIONS: 'medications',
  VACCINES: 'vaccines',
  LABORATORY_TESTS: 'laboratory_tests',
  
  // Mano de obra
  LABOR_WAGES: 'labor_wages',
  BENEFITS: 'benefits',
  TRAINING: 'training',
  PROFESSIONAL_SERVICES: 'professional_services',
  
  // Instalaciones y equipo
  FACILITIES_MAINTENANCE: 'facilities_maintenance',
  EQUIPMENT_PURCHASE: 'equipment_purchase',
  EQUIPMENT_MAINTENANCE: 'equipment_maintenance',
  UTILITIES: 'utilities',
  
  // Reproducción
  BREEDING_COSTS: 'breeding_costs',
  ARTIFICIAL_INSEMINATION: 'artificial_insemination',
  PREGNANCY_TESTING: 'pregnancy_testing',
  
  // Operaciones generales
  TRANSPORTATION: 'transportation',
  FUEL: 'fuel',
  INSURANCE: 'insurance',
  TAXES_FEES: 'taxes_fees',
  LEGAL_ACCOUNTING: 'legal_accounting',
  MARKETING: 'marketing',
  
  // Otros gastos
  DEPRECIATION: 'depreciation',
  INTEREST_EXPENSE: 'interest_expense',
  MISCELLANEOUS: 'miscellaneous'
};

/**
 * Métodos de pago
 */
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CHECK: 'check',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  MOBILE_PAYMENT: 'mobile_payment',
  PROMISSORY_NOTE: 'promissory_note',
  BARTER: 'barter',
  CREDIT: 'credit'
};

/**
 * Tipos de cuentas bancarias
 */
export const ACCOUNT_TYPES = {
  CHECKING: 'checking',
  SAVINGS: 'savings',
  BUSINESS: 'business',
  INVESTMENT: 'investment',
  CREDIT_LINE: 'credit_line',
  PETTY_CASH: 'petty_cash'
};

/**
 * Periodos de presupuesto
 */
export const BUDGET_PERIODS = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  SEMI_ANNUAL: 'semi_annual',
  ANNUAL: 'annual',
  CUSTOM: 'custom'
};

/**
 * Estados de presupuesto
 */
export const BUDGET_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived'
};

/**
 * Tipos de análisis financiero
 */
export const ANALYSIS_TYPES = {
  PROFITABILITY: 'profitability',
  CASH_FLOW: 'cash_flow',
  ROI: 'roi',
  COST_PER_UNIT: 'cost_per_unit',
  BREAK_EVEN: 'break_even',
  VARIANCE: 'variance',
  TREND: 'trend'
};

/**
 * Frecuencias de transacciones recurrentes
 */
export const RECURRENCE_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  SEMI_ANNUAL: 'semi_annual',
  ANNUAL: 'annual'
};

/**
 * Tipos de impuestos aplicables
 */
export const TAX_TYPES = {
  VAT: 'vat',              // IVA
  INCOME_TAX: 'income_tax', // Impuesto sobre la renta
  PROPERTY_TAX: 'property_tax', // Impuesto predial
  PAYROLL_TAX: 'payroll_tax',   // Impuestos sobre nómina
  SALES_TAX: 'sales_tax',       // Impuesto sobre ventas
  AGRICULTURAL_TAX: 'agricultural_tax' // Impuestos agrícolas específicos
};

// =============================================
// ESQUEMAS DE VALIDACIÓN
// =============================================

/**
 * Esquema de validación para transacciones financieras
 */
export const TRANSACTION_SCHEMA = {
  type: {
    required: true,
    type: 'string',
    enum: Object.values(TRANSACTION_TYPES),
    message: 'Tipo de transacción inválido'
  },
  amount: {
    required: true,
    type: 'number',
    min: 0.01,
    max: 999999999.99,
    decimals: 2,
    message: 'Monto debe ser mayor a 0 y menor a $999,999,999.99'
  },
  currency: {
    required: true,
    type: 'string',
    enum: ['MXN', 'USD', 'EUR'],
    default: 'MXN',
    message: 'Moneda inválida'
  },
  description: {
    required: true,
    type: 'string',
    minLength: 3,
    maxLength: 500,
    message: 'La descripción debe tener entre 3 y 500 caracteres'
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
  transaction_date: {
    required: true,
    type: 'date',
    message: 'Fecha de transacción requerida'
  },
  due_date: {
    required: false,
    type: 'date',
    futureDate: true,
    message: 'Fecha de vencimiento debe ser futura'
  },
  payment_method: {
    required: true,
    type: 'string',
    enum: Object.values(PAYMENT_METHODS),
    message: 'Método de pago inválido'
  },
  account_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'Cuenta inválida'
  },
  bovine_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'Bovino inválido'
  },
  event_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'Evento inválido'
  },
  vendor_customer_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'Proveedor/cliente inválido'
  },
  tax_rate: {
    required: false,
    type: 'number',
    min: 0,
    max: 100,
    decimals: 2,
    message: 'Tasa de impuesto debe estar entre 0 y 100%'
  },
  reference_number: {
    required: false,
    type: 'string',
    maxLength: 50,
    pattern: /^[A-Z0-9\-_]+$/,
    message: 'Número de referencia inválido'
  },
  notes: {
    required: false,
    type: 'string',
    maxLength: 1000,
    message: 'Las notas no pueden exceder 1000 caracteres'
  }
};

/**
 * Esquema de validación para presupuestos
 */
export const BUDGET_SCHEMA = {
  name: {
    required: true,
    type: 'string',
    minLength: 3,
    maxLength: 100,
    message: 'El nombre debe tener entre 3 y 100 caracteres'
  },
  description: {
    required: false,
    type: 'string',
    maxLength: 500,
    message: 'La descripción no puede exceder 500 caracteres'
  },
  period: {
    required: true,
    type: 'string',
    enum: Object.values(BUDGET_PERIODS),
    message: 'Período de presupuesto inválido'
  },
  start_date: {
    required: true,
    type: 'date',
    message: 'Fecha de inicio requerida'
  },
  end_date: {
    required: true,
    type: 'date',
    afterField: 'start_date',
    message: 'Fecha de fin debe ser posterior a la fecha de inicio'
  },
  total_budget: {
    required: true,
    type: 'number',
    min: 0.01,
    max: 999999999.99,
    decimals: 2,
    message: 'Presupuesto total debe ser mayor a 0'
  },
  categories: {
    required: true,
    type: 'array',
    minItems: 1,
    items: {
      type: 'object',
      properties: {
        category: { type: 'string', required: true },
        allocated_amount: { type: 'number', min: 0.01, required: true },
        percentage: { type: 'number', min: 0.1, max: 100, required: true }
      }
    },
    message: 'Debe incluir al menos una categoría'
  },
  rancho_id: {
    required: true,
    type: 'string',
    format: 'uuid',
    message: 'Rancho requerido'
  }
};

/**
 * Esquema de validación para filtros financieros
 */
export const FINANCE_FILTER_SCHEMA = {
  search: {
    required: false,
    type: 'string',
    maxLength: 100,
    message: 'Búsqueda muy larga'
  },
  type: {
    required: false,
    type: 'string',
    enum: Object.values(TRANSACTION_TYPES),
    message: 'Tipo inválido'
  },
  category: {
    required: false,
    type: 'string',
    message: 'Categoría inválida'
  },
  status: {
    required: false,
    type: 'string',
    enum: Object.values(TRANSACTION_STATUS),
    message: 'Estado inválido'
  },
  payment_method: {
    required: false,
    type: 'string',
    enum: Object.values(PAYMENT_METHODS),
    message: 'Método de pago inválido'
  },
  amount_min: {
    required: false,
    type: 'number',
    min: 0,
    message: 'Monto mínimo inválido'
  },
  amount_max: {
    required: false,
    type: 'number',
    min: 0,
    message: 'Monto máximo inválido'
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
  rancho_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'Rancho inválido'
  },
  bovine_id: {
    required: false,
    type: 'string',
    format: 'uuid',
    message: 'Bovino inválido'
  }
};

// =============================================
// DEFINICIONES DE TIPOS DE DATOS
// =============================================

/**
 * Tipo base para transacciones financieras
 */
export const TRANSACTION_TYPE = {
  id: 'string', // UUID
  type: 'string', // TRANSACTION_TYPES
  amount: 'number',
  currency: 'string',
  exchange_rate: 'number?',
  description: 'string',
  category: 'string',
  subcategory: 'string?',
  
  // Fechas
  transaction_date: 'date',
  due_date: 'date?',
  payment_date: 'date?',
  
  // Estado y aprobación
  status: 'string', // TRANSACTION_STATUS
  approved_by: 'string?',
  approval_date: 'datetime?',
  approval_notes: 'string?',
  
  // Método de pago
  payment_method: 'string', // PAYMENT_METHODS
  account: {
    id: 'string?',
    name: 'string?',
    type: 'string?'
  },
  reference_number: 'string?',
  check_number: 'string?',
  
  // Impuestos
  tax_rate: 'number?',
  tax_amount: 'number?',
  net_amount: 'number?',
  
  // Relaciones
  bovine: {
    id: 'string?',
    numero_identificacion: 'string?',
    nombre: 'string?'
  },
  event: {
    id: 'string?',
    title: 'string?',
    type: 'string?'
  },
  vendor_customer: {
    id: 'string?',
    name: 'string?',
    type: 'string?', // 'vendor' | 'customer'
    contact_info: 'object?'
  },
  
  // Presupuesto
  budget: {
    id: 'string?',
    name: 'string?',
    category: 'string?'
  },
  
  // Recurrencia
  recurring: 'boolean',
  recurrence_pattern: {
    frequency: 'string?',
    interval: 'number?',
    end_date: 'date?',
    parent_transaction_id: 'string?'
  },
  
  // Archivos adjuntos
  attachments: 'array',
  
  // Notas y observaciones
  notes: 'string?',
  internal_notes: 'string?',
  
  // Metadatos
  rancho_id: 'string',
  created_at: 'datetime',
  created_by: 'string',
  updated_at: 'datetime?',
  updated_by: 'string?'
};

/**
 * Tipo para presupuestos
 */
export const BUDGET_TYPE = {
  id: 'string', // UUID
  name: 'string',
  description: 'string?',
  period: 'string', // BUDGET_PERIODS
  start_date: 'date',
  end_date: 'date',
  status: 'string', // BUDGET_STATUS
  
  // Montos
  total_budget: 'number',
  allocated_amount: 'number',
  spent_amount: 'number',
  remaining_amount: 'number',
  variance_amount: 'number',
  variance_percentage: 'number',
  
  // Categorías del presupuesto
  categories: 'array', // Array de BUDGET_CATEGORY_TYPE
  
  // Estadísticas
  utilization_rate: 'number', // Porcentaje usado
  projected_completion: 'date?',
  avg_monthly_spend: 'number',
  
  // Alertas
  alert_threshold: 'number?', // Porcentaje para alertas
  over_budget: 'boolean',
  
  // Metadatos
  rancho_id: 'string',
  created_at: 'datetime',
  created_by: 'string',
  updated_at: 'datetime?',
  updated_by: 'string?'
};

/**
 * Tipo para categorías de presupuesto
 */
export const BUDGET_CATEGORY_TYPE = {
  id: 'string',
  budget_id: 'string',
  category: 'string',
  subcategory: 'string?',
  allocated_amount: 'number',
  spent_amount: 'number',
  remaining_amount: 'number',
  percentage: 'number',
  variance: 'number',
  is_over_budget: 'boolean',
  last_transaction_date: 'date?'
};

/**
 * Tipo para cuentas financieras
 */
export const ACCOUNT_TYPE = {
  id: 'string', // UUID
  name: 'string',
  type: 'string', // ACCOUNT_TYPES
  account_number: 'string?',
  bank_name: 'string?',
  currency: 'string',
  current_balance: 'number',
  available_balance: 'number',
  credit_limit: 'number?',
  
  // Estado
  is_active: 'boolean',
  is_default: 'boolean',
  
  // Metadatos
  rancho_id: 'string',
  created_at: 'datetime',
  notes: 'string?'
};

/**
 * Tipo para proveedores y clientes
 */
export const VENDOR_CUSTOMER_TYPE = {
  id: 'string', // UUID
  name: 'string',
  type: 'string', // 'vendor' | 'customer' | 'both'
  tax_id: 'string?',
  
  // Información de contacto
  contact_info: {
    email: 'string?',
    phone: 'string?',
    address: 'string?',
    city: 'string?',
    state: 'string?',
    postal_code: 'string?'
  },
  
  // Términos comerciales
  payment_terms: 'string?', // Días de crédito
  credit_limit: 'number?',
  discount_percentage: 'number?',
  
  // Estadísticas
  total_transactions: 'number',
  total_amount: 'number',
  last_transaction_date: 'date?',
  average_transaction: 'number',
  
  // Estado
  is_active: 'boolean',
  is_preferred: 'boolean',
  
  // Metadatos
  rancho_id: 'string',
  created_at: 'datetime',
  notes: 'string?'
};

/**
 * Tipo para estadísticas financieras
 */
export const FINANCIAL_STATISTICS_TYPE = {
  period: {
    start_date: 'date',
    end_date: 'date',
    type: 'string' // 'month', 'quarter', 'year'
  },
  
  // Resumen general
  total_income: 'number',
  total_expenses: 'number',
  net_profit: 'number',
  profit_margin: 'number',
  
  // Flujo de efectivo
  cash_flow: 'number',
  operating_cash_flow: 'number',
  free_cash_flow: 'number',
  
  // Rentabilidad
  roi: 'number', // Return on Investment
  roa: 'number', // Return on Assets
  gross_margin: 'number',
  
  // Costos por unidad
  cost_per_bovine: 'number',
  revenue_per_bovine: 'number',
  cost_per_liter_milk: 'number',
  cost_per_kg_meat: 'number',
  
  // Análisis de categorías
  income_by_category: 'array',
  expenses_by_category: 'array',
  
  // Tendencias
  monthly_trend: 'array',
  quarterly_comparison: 'array',
  year_over_year: 'object',
  
  // Presupuesto
  budget_variance: 'number',
  budget_utilization: 'number',
  
  // Cuentas por cobrar/pagar
  accounts_receivable: 'number',
  accounts_payable: 'number',
  overdue_amount: 'number',
  
  // Proyecciones
  projected_income: 'number',
  projected_expenses: 'number',
  projected_profit: 'number'
};

// =============================================
// CONFIGURACIONES FINANCIERAS
// =============================================

/**
 * Configuración de categorías financieras por defecto
 */
export const DEFAULT_FINANCE_CATEGORIES = {
  income: [
    {
      code: 'livestock_sales',
      name: 'Venta de Ganado',
      subcategories: ['cattle', 'calves', 'breeding_stock', 'dairy_cows'],
      tax_applicable: true,
      default_tax_rate: 0
    },
    {
      code: 'milk_sales',
      name: 'Venta de Leche',
      subcategories: ['fresh_milk', 'processed_products', 'organic_milk'],
      tax_applicable: true,
      default_tax_rate: 0
    },
    {
      code: 'meat_sales',
      name: 'Venta de Carne',
      subcategories: ['fresh_meat', 'processed_meat', 'organic_meat'],
      tax_applicable: true,
      default_tax_rate: 0
    },
    {
      code: 'breeding_services',
      name: 'Servicios de Reproducción',
      subcategories: ['artificial_insemination', 'natural_breeding', 'consulting'],
      tax_applicable: true,
      default_tax_rate: 16
    }
  ],
  expense: [
    {
      code: 'feed_nutrition',
      name: 'Alimentación y Nutrición',
      subcategories: ['hay', 'grain', 'supplements', 'pasture_management'],
      tax_deductible: true,
      default_tax_rate: 0
    },
    {
      code: 'veterinary_services',
      name: 'Servicios Veterinarios',
      subcategories: ['consultations', 'treatments', 'surgeries', 'emergency'],
      tax_deductible: true,
      default_tax_rate: 16
    },
    {
      code: 'medications',
      name: 'Medicamentos y Vacunas',
      subcategories: ['vaccines', 'antibiotics', 'dewormers', 'vitamins'],
      tax_deductible: true,
      default_tax_rate: 0
    },
    {
      code: 'labor_wages',
      name: 'Mano de Obra',
      subcategories: ['salaries', 'wages', 'benefits', 'overtime'],
      tax_deductible: true,
      default_tax_rate: 0
    }
  ]
};

/**
 * Configuración de alertas financieras
 */
export const FINANCIAL_ALERTS_CONFIG = {
  budget_variance: {
    warning_threshold: 10, // 10% de variación
    critical_threshold: 20, // 20% de variación
    enabled: true
  },
  cash_flow: {
    low_cash_threshold: 10000, // Efectivo mínimo
    negative_projection_days: 30, // Días para proyección negativa
    enabled: true
  },
  overdue_payments: {
    days_threshold: 30,
    amount_threshold: 5000,
    enabled: true
  },
  expense_spikes: {
    percentage_increase: 25, // 25% de incremento mensual
    category_specific: true,
    enabled: true
  },
  profit_decline: {
    consecutive_months: 2,
    percentage_decline: 15,
    enabled: true
  }
};

/**
 * Configuración de impuestos por defecto (México)
 */
export const TAX_CONFIG = {
  vat_rate: 16, // IVA 16%
  income_tax_rate: 30, // Impuesto sobre la renta 30%
  agricultural_tax_exemption: true,
  small_business_regime: false,
  tax_year_start: '01-01',
  tax_year_end: '12-31',
  quarterly_filings: true,
  monthly_filings: false
};

/**
 * Configuración de reportes financieros
 */
export const FINANCIAL_REPORTS_CONFIG = {
  profit_loss: {
    periods: ['monthly', 'quarterly', 'annual'],
    comparative: true,
    budget_variance: true,
    category_breakdown: true
  },
  cash_flow: {
    projection_months: 12,
    include_projected: true,
    categorize_flows: true
  },
  balance_sheet: {
    asset_categories: ['current', 'fixed', 'livestock'],
    liability_categories: ['current', 'long_term'],
    equity_breakdown: true
  },
  cost_analysis: {
    per_unit_costs: true,
    per_bovine_costs: true,
    break_even_analysis: true,
    profitability_by_category: true
  }
};

// =============================================
// UTILIDADES Y HELPERS
// =============================================

/**
 * Función para calcular impuestos
 * @param {number} amount - Monto base
 * @param {number} taxRate - Tasa de impuesto (porcentaje)
 * @param {boolean} inclusive - Si el impuesto está incluido en el monto
 * @returns {object} - Cálculo de impuestos
 */
export const calculateTax = (amount, taxRate = 0, inclusive = false) => {
  if (!amount || taxRate === 0) {
    return {
      baseAmount: amount,
      taxAmount: 0,
      totalAmount: amount
    };
  }
  
  if (inclusive) {
    // El impuesto está incluido en el monto
    const taxAmount = amount * (taxRate / 100) / (1 + taxRate / 100);
    const baseAmount = amount - taxAmount;
    
    return {
      baseAmount: Math.round(baseAmount * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      totalAmount: amount
    };
  } else {
    // El impuesto se suma al monto
    const taxAmount = amount * (taxRate / 100);
    const totalAmount = amount + taxAmount;
    
    return {
      baseAmount: amount,
      taxAmount: Math.round(taxAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100
    };
  }
};

/**
 * Función para calcular rentabilidad
 * @param {number} revenue - Ingresos
 * @param {number} costs - Costos
 * @returns {object} - Métricas de rentabilidad
 */
export const calculateProfitability = (revenue, costs) => {
  const grossProfit = revenue - costs;
  const profitMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
  const roi = costs > 0 ? (grossProfit / costs) * 100 : 0;
  
  return {
    grossProfit: Math.round(grossProfit * 100) / 100,
    profitMargin: Math.round(profitMargin * 100) / 100,
    roi: Math.round(roi * 100) / 100,
    isProfit: grossProfit > 0
  };
};

/**
 * Función para calcular costo por bovino
 * @param {number} totalCosts - Costos totales
 * @param {number} bovineCount - Cantidad de bovinos
 * @param {number} period - Período en días
 * @returns {object} - Costos calculados
 */
export const calculateCostPerBovine = (totalCosts, bovineCount, period = 30) => {
  if (!bovineCount || bovineCount === 0) {
    return {
      costPerBovine: 0,
      dailyCostPerBovine: 0,
      monthlyCostPerBovine: 0,
      annualCostPerBovine: 0
    };
  }
  
  const costPerBovine = totalCosts / bovineCount;
  const dailyCostPerBovine = costPerBovine / period;
  const monthlyCostPerBovine = dailyCostPerBovine * 30;
  const annualCostPerBovine = dailyCostPerBovine * 365;
  
  return {
    costPerBovine: Math.round(costPerBovine * 100) / 100,
    dailyCostPerBovine: Math.round(dailyCostPerBovine * 100) / 100,
    monthlyCostPerBovine: Math.round(monthlyCostPerBovine * 100) / 100,
    annualCostPerBovine: Math.round(annualCostPerBovine * 100) / 100
  };
};

/**
 * Función para analizar variación presupuestaria
 * @param {number} budgeted - Monto presupuestado
 * @param {number} actual - Monto real
 * @returns {object} - Análisis de variación
 */
export const analyzeBudgetVariance = (budgeted, actual) => {
  const variance = actual - budgeted;
  const variancePercentage = budgeted > 0 ? (variance / budgeted) * 100 : 0;
  
  let status = 'on_track';
  if (Math.abs(variancePercentage) > 20) {
    status = 'critical';
  } else if (Math.abs(variancePercentage) > 10) {
    status = 'warning';
  }
  
  return {
    variance: Math.round(variance * 100) / 100,
    variancePercentage: Math.round(variancePercentage * 100) / 100,
    isOver: variance > 0,
    isUnder: variance < 0,
    status,
    utilizationRate: budgeted > 0 ? (actual / budgeted) * 100 : 0
  };
};

/**
 * Función para proyectar flujo de efectivo
 * @param {array} transactions - Historial de transacciones
 * @param {number} months - Meses a proyectar
 * @returns {array} - Proyección mensual
 */
export const projectCashFlow = (transactions, months = 12) => {
  // Calcular promedios mensuales de ingresos y gastos
  const monthlyAverages = calculateMonthlyAverages(transactions);
  const projection = [];
  
  let currentBalance = getCurrentBalance(transactions);
  
  for (let i = 0; i < months; i++) {
    const projectedIncome = monthlyAverages.income;
    const projectedExpenses = monthlyAverages.expenses;
    const netFlow = projectedIncome - projectedExpenses;
    
    currentBalance += netFlow;
    
    const projectionMonth = new Date();
    projectionMonth.setMonth(projectionMonth.getMonth() + i + 1);
    
    projection.push({
      month: projectionMonth.toISOString().slice(0, 7), // YYYY-MM
      projectedIncome,
      projectedExpenses,
      netFlow,
      endingBalance: Math.round(currentBalance * 100) / 100,
      isNegative: currentBalance < 0
    });
  }
  
  return projection;
};

/**
 * Función auxiliar para calcular promedios mensuales
 * @param {array} transactions - Transacciones
 * @returns {object} - Promedios calculados
 */
const calculateMonthlyAverages = (transactions) => {
  // Agrupar por mes y calcular totales
  const monthlyTotals = {};
  
  transactions.forEach(transaction => {
    const month = transaction.transaction_date.slice(0, 7); // YYYY-MM
    if (!monthlyTotals[month]) {
      monthlyTotals[month] = { income: 0, expenses: 0 };
    }
    
    if (transaction.type === TRANSACTION_TYPES.INCOME) {
      monthlyTotals[month].income += transaction.amount;
    } else if (transaction.type === TRANSACTION_TYPES.EXPENSE) {
      monthlyTotals[month].expenses += transaction.amount;
    }
  });
  
  // Calcular promedios
  const months = Object.keys(monthlyTotals);
  const totalIncome = months.reduce((sum, month) => sum + monthlyTotals[month].income, 0);
  const totalExpenses = months.reduce((sum, month) => sum + monthlyTotals[month].expenses, 0);
  
  return {
    income: months.length > 0 ? totalIncome / months.length : 0,
    expenses: months.length > 0 ? totalExpenses / months.length : 0
  };
};

/**
 * Función auxiliar para obtener balance actual
 * @param {array} transactions - Transacciones
 * @returns {number} - Balance actual
 */
const getCurrentBalance = (transactions) => {
  return transactions.reduce((balance, transaction) => {
    if (transaction.type === TRANSACTION_TYPES.INCOME) {
      return balance + transaction.amount;
    } else if (transaction.type === TRANSACTION_TYPES.EXPENSE) {
      return balance - transaction.amount;
    }
    return balance;
  }, 0);
};

/**
 * Función para determinar estado de transacción basado en fechas
 * @param {object} transaction - Transacción
 * @returns {string} - Estado calculado
 */
export const calculateTransactionStatus = (transaction) => {
  if (!transaction.due_date) {
    return transaction.status || TRANSACTION_STATUS.PENDING;
  }
  
  const now = new Date();
  const dueDate = new Date(transaction.due_date);
  
  // Si ya está pagado, mantener ese estado
  if (transaction.status === TRANSACTION_STATUS.PAID) {
    return TRANSACTION_STATUS.PAID;
  }
  
  // Si está cancelado, mantener ese estado
  if (transaction.status === TRANSACTION_STATUS.CANCELLED) {
    return TRANSACTION_STATUS.CANCELLED;
  }
  
  // Si la fecha de vencimiento ya pasó
  if (dueDate < now) {
    return TRANSACTION_STATUS.OVERDUE;
  }
  
  // Por defecto, mantener estado actual o pendiente
  return transaction.status || TRANSACTION_STATUS.PENDING;
};

/**
 * Función para validar límites de crédito
 * @param {object} vendorCustomer - Proveedor/cliente
 * @param {number} newAmount - Nuevo monto
 * @param {array} pendingTransactions - Transacciones pendientes
 * @returns {object} - Resultado de validación
 */
export const validateCreditLimit = (vendorCustomer, newAmount, pendingTransactions = []) => {
  if (!vendorCustomer.credit_limit || vendorCustomer.credit_limit === 0) {
    return { isValid: true, message: 'Sin límite de crédito establecido' };
  }
  
  // Calcular deuda pendiente
  const pendingDebt = pendingTransactions
    .filter(t => t.vendor_customer_id === vendorCustomer.id && 
                t.status !== TRANSACTION_STATUS.PAID)
    .reduce((total, t) => total + t.amount, 0);
  
  const totalDebt = pendingDebt + newAmount;
  
  if (totalDebt > vendorCustomer.credit_limit) {
    return {
      isValid: false,
      message: `Excede límite de crédito ($${vendorCustomer.credit_limit.toLocaleString()})`,
      currentDebt: pendingDebt,
      creditLimit: vendorCustomer.credit_limit,
      availableCredit: vendorCustomer.credit_limit - pendingDebt
    };
  }
  
  return {
    isValid: true,
    message: 'Dentro del límite de crédito',
    currentDebt: pendingDebt,
    creditLimit: vendorCustomer.credit_limit,
    availableCredit: vendorCustomer.credit_limit - totalDebt
  };
};

// =============================================
// MENSAJES Y ETIQUETAS
// =============================================

/**
 * Mensajes de error específicos para finanzas
 */
export const FINANCE_ERROR_MESSAGES = {
  INVALID_AMOUNT: 'Monto inválido',
  AMOUNT_TOO_LARGE: 'Monto excede el límite permitido',
  NEGATIVE_AMOUNT: 'El monto no puede ser negativo',
  INVALID_DATE: 'Fecha inválida',
  PAST_DUE_DATE: 'Fecha de vencimiento no puede ser en el pasado',
  INVALID_TAX_RATE: 'Tasa de impuesto inválida',
  CREDIT_LIMIT_EXCEEDED: 'Límite de crédito excedido',
  INSUFFICIENT_FUNDS: 'Fondos insuficientes',
  BUDGET_EXCEEDED: 'Presupuesto excedido',
  DUPLICATE_TRANSACTION: 'Transacción duplicada',
  INVALID_REFERENCE: 'Número de referencia inválido',
  ACCOUNT_INACTIVE: 'Cuenta inactiva',
  VENDOR_NOT_FOUND: 'Proveedor no encontrado',
  CATEGORY_REQUIRED: 'Categoría requerida',
  PAYMENT_METHOD_REQUIRED: 'Método de pago requerido'
};

/**
 * Mensajes de éxito
 */
export const FINANCE_SUCCESS_MESSAGES = {
  TRANSACTION_CREATED: 'Transacción registrada exitosamente',
  TRANSACTION_UPDATED: 'Transacción actualizada correctamente',
  TRANSACTION_DELETED: 'Transacción eliminada',
  PAYMENT_PROCESSED: 'Pago procesado correctamente',
  BUDGET_CREATED: 'Presupuesto creado exitosamente',
  BUDGET_UPDATED: 'Presupuesto actualizado',
  ACCOUNT_CREATED: 'Cuenta creada exitosamente',
  VENDOR_CREATED: 'Proveedor registrado',
  REPORT_GENERATED: 'Reporte generado correctamente',
  DATA_EXPORTED: 'Datos exportados exitosamente'
};

/**
 * Etiquetas para la interfaz
 */
export const FINANCE_LABELS = {
  // Transacciones
  transaction_type: 'Tipo de Transacción',
  amount: 'Monto',
  currency: 'Moneda',
  description: 'Descripción',
  category: 'Categoría',
  subcategory: 'Subcategoría',
  transaction_date: 'Fecha de Transacción',
  due_date: 'Fecha de Vencimiento',
  payment_date: 'Fecha de Pago',
  payment_method: 'Método de Pago',
  reference_number: 'Número de Referencia',
  status: 'Estado',
  
  // Impuestos
  tax_rate: 'Tasa de Impuesto',
  tax_amount: 'Monto de Impuesto',
  net_amount: 'Monto Neto',
  gross_amount: 'Monto Bruto',
  
  // Presupuesto
  budget_name: 'Nombre del Presupuesto',
  budget_period: 'Período',
  total_budget: 'Presupuesto Total',
  allocated_amount: 'Monto Asignado',
  spent_amount: 'Monto Gastado',
  remaining_amount: 'Monto Restante',
  budget_variance: 'Variación Presupuestaria',
  
  // Análisis
  profit_margin: 'Margen de Ganancia',
  roi: 'Retorno de Inversión',
  cash_flow: 'Flujo de Efectivo',
  break_even: 'Punto de Equilibrio',
  cost_per_bovine: 'Costo por Bovino',
  revenue_per_bovine: 'Ingreso por Bovino',
  
  // Cuentas
  account_name: 'Nombre de Cuenta',
  account_type: 'Tipo de Cuenta',
  account_balance: 'Saldo',
  available_balance: 'Saldo Disponible',
  credit_limit: 'Límite de Crédito'
};

export default {
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
  ACCOUNT_TYPES,
  BUDGET_PERIODS,
  BUDGET_STATUS,
  ANALYSIS_TYPES,
  RECURRENCE_FREQUENCIES,
  TAX_TYPES,
  TRANSACTION_SCHEMA,
  BUDGET_SCHEMA,
  FINANCE_FILTER_SCHEMA,
  TRANSACTION_TYPE,
  BUDGET_TYPE,
  BUDGET_CATEGORY_TYPE,
  ACCOUNT_TYPE,
  VENDOR_CUSTOMER_TYPE,
  FINANCIAL_STATISTICS_TYPE,
  DEFAULT_FINANCE_CATEGORIES,
  FINANCIAL_ALERTS_CONFIG,
  TAX_CONFIG,
  FINANCIAL_REPORTS_CONFIG,
  calculateTax,
  calculateProfitability,
  calculateCostPerBovine,
  analyzeBudgetVariance,
  projectCashFlow,
  calculateTransactionStatus,
  validateCreditLimit,
  FINANCE_ERROR_MESSAGES,
  FINANCE_SUCCESS_MESSAGES,
  FINANCE_LABELS
};