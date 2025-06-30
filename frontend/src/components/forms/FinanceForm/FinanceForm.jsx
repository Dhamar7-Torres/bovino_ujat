// Formulario para gestión de transacciones financieras del rancho

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Calendar,
  Tag,
  FileText,
  Upload,
  X,
  Save,
  Calculator,
  TrendingUp,
  TrendingDown,
  Receipt,
  CreditCard,
  Banknote,
  PieChart,
  AlertCircle,
  Info,
  Plus,
  Minus,
  Search
} from 'lucide-react';

const FinanceForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  mode = 'create',
  className = ''
}) => {

  // Estados principales del formulario
  const [formData, setFormData] = useState({
    // Información básica
    type: 'expense', // 'income', 'expense', 'transfer'
    amount: '',
    currency: 'MXN',
    exchangeRate: 1,
    
    // Descripción y categorización
    description: '',
    category: '',
    subcategory: '',
    concept: '',
    reference: '',
    
    // Fechas
    transactionDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    paymentDate: '',
    
    // Método de pago
    paymentMethod: '',
    account: '',
    checkNumber: '',
    cardLastFour: '',
    
    // Relacionado con bovinos/operaciones
    relatedBovine: '',
    relatedEvent: '',
    relatedProduction: '',
    
    // Proveedor/Cliente
    vendor: '',
    customer: '',
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      taxId: ''
    },
    
    // Impuestos
    taxable: true,
    taxRate: 16, // IVA México
    taxAmount: '',
    netAmount: '',
    
    // Estado y aprobación
    status: 'pending', // 'pending', 'approved', 'paid', 'cancelled'
    approvedBy: '',
    approvalDate: '',
    approvalNotes: '',
    
    // Documentos y archivos
    invoiceNumber: '',
    receiptNumber: '',
    attachments: [],
    
    // Presupuesto
    budgetCategory: '',
    budgetPeriod: '',
    
    // Notas y observaciones
    notes: '',
    internalNotes: '',
    
    // Recurrencia para gastos fijos
    recurring: false,
    recurrencePattern: {
      frequency: 'monthly',
      interval: 1,
      endDate: '',
      nextDue: ''
    }
  });

  // Estados de control
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [calculatedTax, setCalculatedTax] = useState(0);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  // Estados para datos externos
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bovines, setBovines] = useState([]);
  const [events, setEvents] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Categorías financieras por tipo
  const financeCategories = {
    income: {
      name: 'Ingresos',
      icon: TrendingUp,
      color: 'text-green-600',
      categories: [
        { value: 'livestock-sales', label: 'Venta de Ganado', subcategories: ['cattle', 'calves', 'breeding-stock'] },
        { value: 'milk-sales', label: 'Venta de Leche', subcategories: ['fresh-milk', 'processed-products'] },
        { value: 'meat-sales', label: 'Venta de Carne', subcategories: ['fresh-meat', 'processed-meat'] },
        { value: 'breeding-services', label: 'Servicios de Reproducción', subcategories: ['artificial-insemination', 'natural-breeding'] },
        { value: 'government-subsidies', label: 'Subsidios Gubernamentales', subcategories: ['agricultural-support', 'environmental-programs'] },
        { value: 'insurance-claims', label: 'Seguros', subcategories: ['livestock-insurance', 'property-insurance'] },
        { value: 'other-income', label: 'Otros Ingresos', subcategories: ['consulting', 'equipment-rental', 'miscellaneous'] }
      ]
    },
    expense: {
      name: 'Gastos',
      icon: TrendingDown,
      color: 'text-red-600',
      categories: [
        { value: 'feed-nutrition', label: 'Alimentación y Nutrición', subcategories: ['hay', 'grain', 'supplements', 'pasture'] },
        { value: 'veterinary', label: 'Servicios Veterinarios', subcategories: ['consultations', 'treatments', 'surgeries', 'preventive'] },
        { value: 'medications', label: 'Medicamentos y Vacunas', subcategories: ['vaccines', 'antibiotics', 'dewormers', 'vitamins'] },
        { value: 'facilities', label: 'Instalaciones y Mantenimiento', subcategories: ['repairs', 'construction', 'utilities', 'equipment'] },
        { value: 'labor', label: 'Mano de Obra', subcategories: ['salaries', 'benefits', 'temporary-workers', 'professional-services'] },
        { value: 'transportation', label: 'Transporte', subcategories: ['fuel', 'vehicle-maintenance', 'livestock-transport'] },
        { value: 'insurance', label: 'Seguros', subcategories: ['livestock', 'property', 'liability', 'vehicles'] },
        { value: 'taxes-fees', label: 'Impuestos y Tasas', subcategories: ['property-tax', 'licenses', 'permits', 'registration'] },
        { value: 'supplies', label: 'Suministros', subcategories: ['tools', 'cleaning', 'office', 'safety'] },
        { value: 'other-expenses', label: 'Otros Gastos', subcategories: ['professional-development', 'marketing', 'miscellaneous'] }
      ]
    }
  };

  // Métodos de pago disponibles
  const paymentMethods = [
    { value: 'cash', label: 'Efectivo', icon: Banknote },
    { value: 'check', label: 'Cheque', icon: Receipt },
    { value: 'credit-card', label: 'Tarjeta de Crédito', icon: CreditCard },
    { value: 'debit-card', label: 'Tarjeta de Débito', icon: CreditCard },
    { value: 'bank-transfer', label: 'Transferencia Bancaria', icon: CreditCard },
    { value: 'electronic-payment', label: 'Pago Electrónico', icon: CreditCard }
  ];

  // Estados de transacción
  const statusOptions = [
    { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'approved', label: 'Aprobado', color: 'bg-blue-100 text-blue-800' },
    { value: 'paid', label: 'Pagado', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
    { value: 'partial', label: 'Pago Parcial', color: 'bg-orange-100 text-orange-800' }
  ];

  // Pasos del formulario
  const formSteps = [
    { id: 1, title: 'Información Básica', icon: DollarSign },
    { id: 2, title: 'Detalles y Categorización', icon: Tag },
    { id: 3, title: 'Pago y Documentos', icon: Receipt },
    { id: 4, title: 'Revisión y Confirmación', icon: FileText }
  ];

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData
      }));
    }
    loadFormData();
  }, [initialData]);

  // Calcular impuestos automáticamente
  useEffect(() => {
    if (formData.amount && formData.taxable) {
      const amount = parseFloat(formData.amount) || 0;
      const taxRate = parseFloat(formData.taxRate) || 0;
      const tax = (amount * taxRate) / 100;
      const net = amount - tax;
      
      setCalculatedTax(tax);
      setCalculatedTotal(amount);
      
      setFormData(prev => ({
        ...prev,
        taxAmount: tax.toFixed(2),
        netAmount: net.toFixed(2)
      }));
    } else if (formData.amount) {
      const amount = parseFloat(formData.amount) || 0;
      setCalculatedTax(0);
      setCalculatedTotal(amount);
      
      setFormData(prev => ({
        ...prev,
        taxAmount: '0.00',
        netAmount: amount.toFixed(2)
      }));
    }
  }, [formData.amount, formData.taxable, formData.taxRate]);

  // Cargar datos para el formulario
  const loadFormData = async () => {
    try {
      setLoadingData(true);
      
      // Simular carga de datos desde API
      const mockAccounts = [
        { id: '1', name: 'Cuenta Corriente Principal', type: 'checking', balance: 150000 },
        { id: '2', name: 'Cuenta de Ahorros', type: 'savings', balance: 500000 },
        { id: '3', name: 'Caja Chica', type: 'cash', balance: 5000 }
      ];

      const mockVendors = [
        { id: '1', name: 'Alimentos Ganaderos SA', category: 'feed', taxId: 'RFC123456' },
        { id: '2', name: 'Veterinaria El Campo', category: 'veterinary', taxId: 'RFC789012' },
        { id: '3', name: 'Medicamentos Bovinos', category: 'medications', taxId: 'RFC345678' }
      ];

      const mockCustomers = [
        { id: '1', name: 'Lácteos del Valle', category: 'dairy', taxId: 'RFC111222' },
        { id: '2', name: 'Carnicería Premium', category: 'meat', taxId: 'RFC333444' },
        { id: '3', name: 'Rancho San José', category: 'livestock', taxId: 'RFC555666' }
      ];

      const mockBovines = [
        { id: '1', tagNumber: 'BOV001', name: 'Vaca Linda' },
        { id: '2', tagNumber: 'BOV002', name: 'Toro Bravo' },
        { id: '3', tagNumber: 'BOV003', name: 'Vaca Negra' }
      ];

      const mockEvents = [
        { id: '1', title: 'Vacunación Mensual', date: '2024-01-15' },
        { id: '2', title: 'Revisión Veterinaria', date: '2024-01-20' },
        { id: '3', title: 'Ordeño Especial', date: '2024-01-25' }
      ];

      setAccounts(mockAccounts);
      setVendors(mockVendors);
      setCustomers(mockCustomers);
      setBovines(mockBovines);
      setEvents(mockEvents);

    } catch (error) {
      console.error('Error al cargar datos del formulario:', error);
      setErrors({ general: 'Error al cargar datos del formulario' });
    } finally {
      setLoadingData(false);
    }
  };

  // Manejar cambios en campos del formulario
  const handleInputChange = (field, value, nested = null) => {
    setFormData(prev => {
      if (nested) {
        return {
          ...prev,
          [nested]: {
            ...prev[nested],
            [field]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
    
    setIsDirty(true);
    
    // Limpiar error específico
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
    
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Validaciones obligatorias
    if (!formData.type) {
      newErrors.type = 'El tipo de transacción es obligatorio';
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a cero';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    
    if (!formData.category) {
      newErrors.category = 'La categoría es obligatoria';
    }
    
    if (!formData.transactionDate) {
      newErrors.transactionDate = 'La fecha de transacción es obligatoria';
    }
    
    // Validaciones específicas por tipo
    if (formData.type === 'income' && !formData.customer && !formData.contactInfo.name) {
      newErrors.customer = 'Debe especificar el cliente o contacto';
    }
    
    if (formData.type === 'expense' && !formData.vendor && !formData.contactInfo.name) {
      newErrors.vendor = 'Debe especificar el proveedor o contacto';
    }
    
    // Validaciones de fechas
    if (formData.dueDate && formData.transactionDate) {
      if (new Date(formData.dueDate) < new Date(formData.transactionDate)) {
        newErrors.dueDate = 'La fecha de vencimiento no puede ser anterior a la fecha de transacción';
      }
    }
    
    // Validaciones de impuestos
    if (formData.taxable && !formData.taxRate) {
      newErrors.taxRate = 'La tasa de impuesto es obligatoria para transacciones gravadas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar subida de archivos
  const handleFileUpload = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValid = file.size <= 10 * 1024 * 1024; // 10MB max
      if (!isValid) {
        setErrors(prev => ({
          ...prev,
          attachments: 'Los archivos no pueden exceder 10MB'
        }));
      }
      return isValid;
    });

    validFiles.forEach(file => {
      const newAttachment = {
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString()
      };
      
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment]
      }));
    });
  };

  // Eliminar archivo adjunto
  const removeAttachment = (attachmentId) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setErrors(prev => ({
        ...prev,
        general: 'Por favor, corrija los errores antes de continuar'
      }));
      return;
    }

    try {
      const submitData = {
        ...formData,
        totalAmount: calculatedTotal,
        lastModified: new Date().toISOString()
      };

      await onSubmit(submitData);
      setIsDirty(false);
      
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setErrors(prev => ({
        ...prev,
        general: 'Error al guardar la transacción. Inténtelo nuevamente.'
      }));
    }
  };

  // Renderizar campo de entrada
  const renderInput = (field, label, type = 'text', options = {}) => {
    const {
      placeholder = '',
      required = false,
      disabled = false,
      min,
      max,
      step,
      prefix,
      suffix,
      helpText,
      icon: IconComponent
    } = options;

    const hasError = errors[field];
    
    return (
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {prefix}
            </div>
          )}
          
          <input
            type={type}
            value={formData[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={placeholder}
            disabled={disabled || mode === 'view'}
            min={min}
            max={max}
            step={step}
            className={`
              w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}
              ${hasError ? 'border-red-500' : 'border-gray-300'}
              ${disabled || mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            `}
          />
          
          {suffix && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {suffix}
            </div>
          )}
        </div>
        
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm flex items-center"
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            {hasError}
          </motion.p>
        )}
        
        {helpText && !hasError && (
          <p className="text-gray-500 text-sm flex items-center">
            <Info className="w-4 h-4 mr-1" />
            {helpText}
          </p>
        )}
      </motion.div>
    );
  };

  // Renderizar paso 1: Información básica
  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Tipo de transacción */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700">Tipo de Transacción *</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(financeCategories).map(([key, category]) => {
            const CategoryIcon = category.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  handleInputChange('type', key);
                  setFormData(prev => ({ ...prev, category: '', subcategory: '' }));
                }}
                className={`
                  p-4 border-2 rounded-lg text-left transition-all
                  ${formData.type === key 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <CategoryIcon className={`w-8 h-8 ${category.color}`} />
                  <div>
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-sm text-gray-500">
                      {key === 'income' ? 'Dinero que ingresa al rancho' : 'Dinero que sale del rancho'}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Monto y moneda */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderInput('amount', 'Monto', 'number', {
          placeholder: '0.00',
          required: true,
          min: 0,
          step: 0.01,
          prefix: '$',
          icon: DollarSign
        })}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Moneda</label>
          <select
            value={formData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="MXN">MXN - Peso Mexicano</option>
            <option value="USD">USD - Dólar Americano</option>
            <option value="EUR">EUR - Euro</option>
          </select>
        </div>
        
        {formData.currency !== 'MXN' && renderInput('exchangeRate', 'Tipo de Cambio', 'number', {
          placeholder: '1.00',
          min: 0,
          step: 0.0001,
          helpText: 'Tipo de cambio a pesos mexicanos'
        })}
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Descripción *</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe la transacción..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Fecha de transacción */}
      {renderInput('transactionDate', 'Fecha de Transacción', 'date', {
        required: true,
        icon: Calendar
      })}

      {/* Calculadora de impuestos */}
      {formData.amount && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center mb-3">
            <Calculator className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-medium text-blue-900">Cálculo de Impuestos</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.taxable}
                onChange={(e) => handleInputChange('taxable', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Transacción gravada</label>
            </div>
            
            {formData.taxable && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tasa de IVA (%)</label>
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => handleInputChange('taxRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            )}
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Subtotal:</span>
              <p className="font-medium">${formData.netAmount || '0.00'}</p>
            </div>
            <div>
              <span className="text-gray-600">IVA:</span>
              <p className="font-medium">${formData.taxAmount || '0.00'}</p>
            </div>
            <div>
              <span className="text-gray-600">Total:</span>
              <p className="font-bold text-blue-600">${calculatedTotal.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  // Renderizar paso 2: Detalles y categorización
  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Categoría y subcategoría */}
      {formData.type && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Categoría *</label>
            <select
              value={formData.category}
              onChange={(e) => {
                handleInputChange('category', e.target.value);
                setFormData(prev => ({ ...prev, subcategory: '' }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar categoría...</option>
              {financeCategories[formData.type]?.categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {formData.category && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-700">Subcategoría</label>
              <select
                value={formData.subcategory}
                onChange={(e) => handleInputChange('subcategory', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar subcategoría...</option>
                {financeCategories[formData.type]?.categories
                  .find(cat => cat.value === formData.category)?.subcategories
                  .map(sub => (
                    <option key={sub} value={sub}>
                      {sub.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
              </select>
            </motion.div>
          )}
        </div>
      )}

      {/* Concepto y referencia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput('concept', 'Concepto Específico', 'text', {
          placeholder: 'Ej: Alimento concentrado para vacas lecheras',
          helpText: 'Detalle específico del gasto o ingreso'
        })}
        
        {renderInput('reference', 'Número de Referencia', 'text', {
          placeholder: 'Ej: ORD-2024-001',
          helpText: 'Referencia interna o externa'
        })}
      </div>

      {/* Proveedor/Cliente */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">
          {formData.type === 'income' ? 'Información del Cliente' : 'Información del Proveedor'}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formData.type === 'expense' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Proveedor</label>
              <select
                value={formData.vendor}
                onChange={(e) => handleInputChange('vendor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar proveedor...</option>
                {vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name} - {vendor.category}
                  </option>
                ))}
                <option value="new">+ Nuevo proveedor</option>
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cliente</label>
              <select
                value={formData.customer}
                onChange={(e) => handleInputChange('customer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar cliente...</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.category}
                  </option>
                ))}
                <option value="new">+ Nuevo cliente</option>
              </select>
            </div>
          )}
        </div>

        {/* Información de contacto para nuevos proveedores/clientes */}
        {((formData.vendor === 'new' && formData.type === 'expense') || 
          (formData.customer === 'new' && formData.type === 'income')) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg"
          >
            <input
              type="text"
              placeholder="Nombre completo o razón social"
              value={formData.contactInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value, 'contactInfo')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={formData.contactInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value, 'contactInfo')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={formData.contactInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value, 'contactInfo')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="RFC o identificación fiscal"
              value={formData.contactInfo.taxId}
              onChange={(e) => handleInputChange('taxId', e.target.value, 'contactInfo')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="Dirección completa"
              value={formData.contactInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value, 'contactInfo')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md md:col-span-2"
              rows={2}
            />
          </motion.div>
        )}
      </div>

      {/* Relación con bovinos/eventos */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Relación con Operaciones</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Bovino Relacionado</label>
            <select
              value={formData.relatedBovine}
              onChange={(e) => handleInputChange('relatedBovine', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Ninguno</option>
              {bovines.map(bovine => (
                <option key={bovine.id} value={bovine.id}>
                  {bovine.tagNumber} - {bovine.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Evento Relacionado</label>
            <select
              value={formData.relatedEvent}
              onChange={(e) => handleInputChange('relatedEvent', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Ninguno</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title} - {event.date}
                </option>
              ))}
            </select>
          </div>
          
          {renderInput('relatedProduction', 'ID Producción', 'text', {
            placeholder: 'PROD-2024-001',
            helpText: 'ID del registro de producción relacionado'
          })}
        </div>
      </div>

      {/* Fechas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput('dueDate', 'Fecha de Vencimiento', 'date', {
          icon: Calendar,
          helpText: 'Para pagos a crédito'
        })}
        
        {formData.status === 'paid' && renderInput('paymentDate', 'Fecha de Pago', 'date', {
          icon: Calendar,
          helpText: 'Fecha en que se realizó el pago'
        })}
      </div>

      {/* Recurrencia */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.recurring}
              onChange={(e) => handleInputChange('recurring', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Transacción recurrente</span>
          </label>
        </div>

        {formData.recurring && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Frecuencia</label>
              <select
                value={formData.recurrencePattern.frequency}
                onChange={(e) => handleInputChange('frequency', e.target.value, 'recurrencePattern')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
                <option value="quarterly">Trimestral</option>
                <option value="yearly">Anual</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Repetir cada</label>
              <input
                type="number"
                value={formData.recurrencePattern.interval}
                onChange={(e) => handleInputChange('interval', parseInt(e.target.value), 'recurrencePattern')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Hasta</label>
              <input
                type="date"
                value={formData.recurrencePattern.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value, 'recurrencePattern')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  // Renderizar paso 3: Pago y documentos
  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Método de pago */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Método de Pago</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {paymentMethods.map(method => {
            const MethodIcon = method.icon;
            return (
              <button
                key={method.value}
                type="button"
                onClick={() => handleInputChange('paymentMethod', method.value)}
                className={`
                  p-4 border rounded-lg text-center transition-all
                  ${formData.paymentMethod === method.value 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <MethodIcon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">{method.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalles específicos del método de pago */}
      {formData.paymentMethod && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {(formData.paymentMethod === 'credit-card' || formData.paymentMethod === 'debit-card') && (
            <>
              {renderInput('cardLastFour', 'Últimos 4 dígitos', 'text', {
                placeholder: '1234',
                helpText: 'Solo para referencia'
              })}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Cuenta/Tarjeta</label>
                <select
                  value={formData.account}
                  onChange={(e) => handleInputChange('account', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar cuenta...</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name} - {account.type}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          
          {formData.paymentMethod === 'check' && (
            <>
              {renderInput('checkNumber', 'Número de Cheque', 'text', {
                placeholder: '001234',
                helpText: 'Número del cheque'
              })}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Cuenta Bancaria</label>
                <select
                  value={formData.account}
                  onChange={(e) => handleInputChange('account', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar cuenta...</option>
                  {accounts.filter(acc => acc.type === 'checking').map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          
          {(formData.paymentMethod === 'bank-transfer' || formData.paymentMethod === 'electronic-payment') && (
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Cuenta Bancaria</label>
              <select
                value={formData.account}
                onChange={(e) => handleInputChange('account', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar cuenta...</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} - Saldo: ${account.balance.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </motion.div>
      )}

      {/* Documentos y referencias */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Documentos y Referencias</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInput('invoiceNumber', 'Número de Factura', 'text', {
            placeholder: 'FAC-2024-001',
            helpText: 'Número de la factura o documento fiscal'
          })}
          
          {renderInput('receiptNumber', 'Número de Recibo', 'text', {
            placeholder: 'REC-2024-001',
            helpText: 'Número del recibo o comprobante'
          })}
        </div>
      </div>

      {/* Subida de archivos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium text-gray-900">Archivos Adjuntos</h4>
          <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Subir Archivos
            <input
              type="file"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
            />
          </label>
        </div>
        
        {formData.attachments.length > 0 && (
          <div className="space-y-3">
            {formData.attachments.map((attachment) => (
              <motion.div
                key={attachment.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{attachment.name}</p>
                    <p className="text-sm text-gray-500">
                      {(attachment.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => removeAttachment(attachment.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
        
        <p className="text-xs text-gray-500">
          Formatos permitidos: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX. Máximo 10MB por archivo.
        </p>
      </div>

      {/* Estado de la transacción */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Estado</h4>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Estado de la Transacción</label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        
        {(formData.status === 'approved' || formData.status === 'paid') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {renderInput('approvedBy', 'Aprobado por', 'text', {
              placeholder: 'Nombre del autorizador',
              helpText: 'Persona que aprobó la transacción'
            })}
            
            {renderInput('approvalDate', 'Fecha de Aprobación', 'date', {
              icon: Calendar
            })}
          </motion.div>
        )}
      </div>

      {/* Notas */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Notas Adicionales</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Observaciones, términos especiales, etc."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Notas Internas</label>
          <textarea
            value={formData.internalNotes}
            onChange={(e) => handleInputChange('internalNotes', e.target.value)}
            placeholder="Notas para uso interno del rancho..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500">Estas notas no aparecerán en documentos externos</p>
        </div>
      </div>
    </div>
  );

  // Renderizar paso 4: Revisión
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Resumen de la Transacción</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo:</span>
              <span className="font-medium capitalize">
                {financeCategories[formData.type]?.name}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Descripción:</span>
              <span className="font-medium">{formData.description}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Categoría:</span>
              <span className="font-medium">
                {financeCategories[formData.type]?.categories
                  .find(cat => cat.value === formData.category)?.label}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha:</span>
              <span className="font-medium">{formData.transactionDate}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Monto:</span>
              <span className="font-medium">${formData.amount} {formData.currency}</span>
            </div>
            
            {formData.taxable && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA ({formData.taxRate}%):</span>
                  <span className="font-medium">${formData.taxAmount}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${formData.netAmount}</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-900 font-semibold">Total:</span>
              <span className="font-bold text-lg text-blue-600">
                ${calculatedTotal.toFixed(2)} {formData.currency}
              </span>
            </div>
          </div>
        </div>
        
        {formData.paymentMethod && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-gray-600">Método de Pago:</span>
              <span className="font-medium">
                {paymentMethods.find(pm => pm.value === formData.paymentMethod)?.label}
              </span>
            </div>
          </div>
        )}
        
        {formData.attachments.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <span className="text-gray-600">Archivos Adjuntos:</span>
            <div className="mt-2 space-y-1">
              {formData.attachments.map(attachment => (
                <div key={attachment.id} className="text-sm text-gray-700">
                  • {attachment.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
          <div>
            <h5 className="font-medium text-yellow-800">Confirmar Información</h5>
            <p className="text-yellow-700 text-sm mt-1">
              Revise cuidadosamente toda la información antes de guardar. 
              Una vez guardada, algunos campos requerirán autorización especial para modificarse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar indicador de pasos
  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {formSteps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        
        return (
          <React.Fragment key={step.id}>
            <button
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className={`
                flex flex-col items-center space-y-2 px-4 py-2 rounded-lg transition-all
                ${isActive 
                  ? 'bg-blue-100 text-blue-700' 
                  : isCompleted 
                    ? 'text-green-600 hover:bg-green-50' 
                    : 'text-gray-500 hover:bg-gray-50'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2
                ${isActive 
                  ? 'border-blue-500 bg-blue-500 text-white' 
                  : isCompleted 
                    ? 'border-green-500 bg-green-500 text-white' 
                    : 'border-gray-300 bg-white'
                }
              `}>
                <StepIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">{step.title}</span>
            </button>
            
            {index < formSteps.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-4
                ${step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'}
              `} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  // Renderizar contenido del paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`max-w-4xl mx-auto bg-white rounded-lg shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Nueva Transacción Financiera' : 
               mode === 'edit' ? 'Editar Transacción' : 'Ver Transacción'}
            </h2>
            <p className="text-gray-600 mt-1">
              {mode === 'create' ? 'Registra un nuevo ingreso o gasto del rancho' :
               mode === 'edit' ? 'Modifica la información de la transacción' :
               'Detalles de la transacción financiera'}
            </p>
          </div>
          
          {mode !== 'view' && isDirty && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              Cambios sin guardar
            </motion.div>
          )}
        </div>
      </div>

      {/* Errores generales */}
      <AnimatePresence>
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 font-medium">Error:</span>
            </div>
            <p className="text-red-600 mt-1">{errors.general}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-6">
        {/* Indicador de pasos */}
        {renderStepIndicator()}
        
        {/* Contenido del paso actual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
        
        {/* Botones de navegación */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-8">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Anterior
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                if (isDirty) {
                  if (window.confirm('¿Está seguro de que desea cancelar? Se perderán los cambios no guardados.')) {
                    onCancel();
                  }
                } else {
                  onCancel();
                }
              }}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            
            {currentStep < formSteps.length ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {mode === 'create' ? 'Registrar Transacción' : 'Guardar Cambios'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default FinanceForm;