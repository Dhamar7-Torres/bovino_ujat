// Formulario para programar y gestionar eventos del sistema ganadero

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  FileText,
  AlertCircle,
  Save,
  X,
  Plus,
  Minus,
  Bell,
  Repeat,
  Stethoscope,
  Syringe,
  Scissors,
  Heart,
  Milk,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const EventForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  mode = 'create',
  className = ''
}) => {

  // Estados principales del formulario
  const [formData, setFormData] = useState({
    // Información básica del evento
    title: '',
    description: '',
    eventType: '',
    category: '',
    priority: 'medium',
    
    // Fecha y hora
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    allDay: false,
    
    // Ubicación
    location: '',
    coordinates: {
      latitude: null,
      longitude: null
    },
    
    // Bovinos involucrados
    selectedBovines: [],
    applyToAll: false,
    filterCriteria: {
      gender: '',
      ageRange: { min: '', max: '' },
      breed: '',
      status: '',
      location: ''
    },
    
    // Personal responsable
    assignedTo: '',
    veterinarian: '',
    assistants: [],
    
    // Configuración de recordatorios
    reminders: [
      { time: 60, unit: 'minutes', type: 'notification' }
    ],
    
    // Recurrencia
    recurring: false,
    recurrencePattern: {
      frequency: 'weekly', // daily, weekly, monthly, yearly
      interval: 1,
      daysOfWeek: [],
      dayOfMonth: 1,
      endDate: '',
      occurrences: null
    },
    
    // Materiales y medicamentos
    materials: [],
    medications: [],
    
    // Costos estimados
    estimatedCost: '',
    currency: 'MXN',
    
    // Estado y seguimiento
    status: 'scheduled',
    completionNotes: '',
    actualCost: '',
    
    // Metadatos
    createdBy: '',
    tags: []
  });

  // Estados de control
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [currentTab, setCurrentTab] = useState('basic');
  const [searchBovines, setSearchBovines] = useState('');
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Estados para datos externos
  const [bovines, setBovines] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [availableMedications, setAvailableMedications] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Tipos de eventos con sus iconos y categorías
  const eventCategories = {
    health: {
      name: 'Salud',
      icon: Stethoscope,
      color: 'text-red-600',
      types: [
        { value: 'vaccination', label: 'Vacunación', icon: Syringe },
        { value: 'treatment', label: 'Tratamiento Médico', icon: Stethoscope },
        { value: 'checkup', label: 'Chequeo General', icon: Heart },
        { value: 'deworming', label: 'Desparasitación', icon: Stethoscope },
        { value: 'hoof-care', label: 'Cuidado de Pezuñas', icon: Scissors }
      ]
    },
    production: {
      name: 'Producción',
      icon: Milk,
      color: 'text-blue-600',
      types: [
        { value: 'milking', label: 'Ordeño', icon: Milk },
        { value: 'weighing', label: 'Pesaje', icon: TrendingUp },
        { value: 'breeding', label: 'Reproducción', icon: Heart },
        { value: 'weaning', label: 'Destete', icon: Scissors }
      ]
    },
    management: {
      name: 'Manejo',
      icon: Users,
      color: 'text-green-600',
      types: [
        { value: 'movement', label: 'Movimiento de Ganado', icon: MapPin },
        { value: 'grouping', label: 'Agrupación', icon: Users },
        { value: 'feeding', label: 'Alimentación', icon: Plus },
        { value: 'cleaning', label: 'Limpieza de Instalaciones', icon: Users }
      ]
    },
    financial: {
      name: 'Financiero',
      icon: DollarSign,
      color: 'text-yellow-600',
      types: [
        { value: 'sale', label: 'Venta', icon: DollarSign },
        { value: 'purchase', label: 'Compra', icon: Plus },
        { value: 'appraisal', label: 'Valuación', icon: TrendingUp }
      ]
    }
  };

  // Prioridades disponibles
  const priorityOptions = [
    { value: 'low', label: 'Baja', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-800' }
  ];

  // Estados de evento
  const statusOptions = [
    { value: 'scheduled', label: 'Programado', color: 'bg-blue-100 text-blue-800' },
    { value: 'in-progress', label: 'En Progreso', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Completado', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
    { value: 'postponed', label: 'Pospuesto', color: 'bg-gray-100 text-gray-800' }
  ];

  // Tabs del formulario
  const formTabs = [
    { id: 'basic', name: 'Información Básica', icon: FileText },
    { id: 'participants', name: 'Participantes', icon: Users },
    { id: 'schedule', name: 'Programación', icon: Calendar },
    { id: 'resources', name: 'Recursos', icon: Tag }
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

  // Cargar datos para el formulario
  const loadFormData = async () => {
    try {
      setLoadingData(true);
      
      // Simular carga de datos desde API
      const mockBovines = [
        { id: '1', tagNumber: 'BOV001', name: 'Vaca Linda', breed: 'Holstein', gender: 'female' },
        { id: '2', tagNumber: 'BOV002', name: 'Toro Bravo', breed: 'Angus', gender: 'male' },
        { id: '3', tagNumber: 'BOV003', name: 'Vaca Negra', breed: 'Holstein', gender: 'female' }
      ];

      const mockLocations = [
        { id: '1', name: 'Potrero 1', type: 'field' },
        { id: '2', name: 'Corral Central', type: 'corral' },
        { id: '3', name: 'Sala de Ordeño', type: 'facility' }
      ];

      const mockPersonnel = [
        { id: '1', name: 'Dr. Juan Pérez', role: 'veterinarian' },
        { id: '2', name: 'María González', role: 'technician' },
        { id: '3', name: 'Carlos López', role: 'handler' }
      ];

      const mockMaterials = [
        { id: '1', name: 'Jeringas 10ml', category: 'medical', unit: 'piezas' },
        { id: '2', name: 'Guantes de látex', category: 'safety', unit: 'cajas' },
        { id: '3', name: 'Alcohol isopropílico', category: 'disinfectant', unit: 'litros' }
      ];

      const mockMedications = [
        { id: '1', name: 'Vacuna Triple', category: 'vaccine', dosage: '5ml' },
        { id: '2', name: 'Antiparasitario', category: 'treatment', dosage: '10ml/100kg' },
        { id: '3', name: 'Antibiótico', category: 'treatment', dosage: '1ml/10kg' }
      ];

      setBovines(mockBovines);
      setLocations(mockLocations);
      setPersonnel(mockPersonnel);
      setAvailableMaterials(mockMaterials);
      setAvailableMedications(mockMedications);

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
    if (!formData.title.trim()) {
      newErrors.title = 'El título del evento es obligatorio';
    }
    
    if (!formData.eventType) {
      newErrors.eventType = 'El tipo de evento es obligatorio';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es obligatoria';
    }
    
    if (!formData.startTime && !formData.allDay) {
      newErrors.startTime = 'La hora de inicio es obligatoria';
    }
    
    // Validar fechas
    if (formData.startDate && formData.endDate) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime || '23:59'}`);
      
      if (endDateTime <= startDateTime) {
        newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }
    
    // Validar bovinos seleccionados
    if (!formData.applyToAll && formData.selectedBovines.length === 0) {
      newErrors.selectedBovines = 'Debe seleccionar al menos un bovino o aplicar a todos';
    }
    
    // Validar costos
    if (formData.estimatedCost && (isNaN(formData.estimatedCost) || formData.estimatedCost < 0)) {
      newErrors.estimatedCost = 'El costo estimado debe ser un número positivo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar selección de bovinos
  const handleBovineSelection = (bovineId, selected) => {
    setFormData(prev => ({
      ...prev,
      selectedBovines: selected
        ? [...prev.selectedBovines, bovineId]
        : prev.selectedBovines.filter(id => id !== bovineId)
    }));
  };

  // Agregar recordatorio
  const addReminder = () => {
    setFormData(prev => ({
      ...prev,
      reminders: [
        ...prev.reminders,
        { time: 30, unit: 'minutes', type: 'notification' }
      ]
    }));
  };

  // Eliminar recordatorio
  const removeReminder = (index) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.filter((_, i) => i !== index)
    }));
  };

  // Agregar material
  const addMaterial = (material) => {
    setFormData(prev => ({
      ...prev,
      materials: [
        ...prev.materials,
        { ...material, quantity: 1, required: true }
      ]
    }));
  };

  // Eliminar material
  const removeMaterial = (materialId) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m.id !== materialId)
    }));
  };

  // Agregar medicamento
  const addMedication = (medication) => {
    setFormData(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        { ...medication, dosage: '', notes: '' }
      ]
    }));
  };

  // Eliminar medicamento
  const removeMedication = (medicationId) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m.id !== medicationId)
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
        lastModified: new Date().toISOString()
      };

      await onSubmit(submitData);
      setIsDirty(false);
      
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setErrors(prev => ({
        ...prev,
        general: 'Error al guardar el evento. Inténtelo nuevamente.'
      }));
    }
  };

  // Manejar cancelación
  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('¿Está seguro de que desea cancelar? Se perderán los cambios no guardados.')) {
        onCancel();
      }
    } else {
      onCancel();
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
      rows,
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
        
        {type === 'textarea' ? (
          <textarea
            value={formData[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={placeholder}
            rows={rows || 3}
            disabled={disabled || mode === 'view'}
            className={`
              w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              ${hasError ? 'border-red-500' : 'border-gray-300'}
              ${disabled || mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            `}
          />
        ) : (
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
              ${hasError ? 'border-red-500' : 'border-gray-300'}
              ${disabled || mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            `}
          />
        )}
        
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
          <p className="text-gray-500 text-sm">{helpText}</p>
        )}
      </motion.div>
    );
  };

  // Renderizar selector
  const renderSelect = (field, label, options, config = {}) => {
    const {
      placeholder = 'Seleccionar...',
      required = false,
      disabled = false,
      helpText,
      icon: IconComponent
    } = config;

    const hasError = errors[field];
    
    return (
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <select
          value={formData[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={disabled || mode === 'view'}
          className={`
            w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${hasError ? 'border-red-500' : 'border-gray-300'}
            ${disabled || mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
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
          <p className="text-gray-500 text-sm">{helpText}</p>
        )}
      </motion.div>
    );
  };

  // Renderizar tab de información básica
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput('title', 'Título del Evento', 'text', {
          placeholder: 'Ej: Vacunación mensual del ganado',
          required: true,
          icon: FileText
        })}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Categoría *</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(eventCategories).map(([key, category]) => {
              const CategoryIcon = category.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    handleInputChange('category', key);
                    setFormData(prev => ({ ...prev, eventType: '' })); // Reset event type
                  }}
                  className={`
                    p-3 border rounded-lg text-center transition-all
                    ${formData.category === key 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <CategoryIcon className={`w-6 h-6 mx-auto mb-1 ${category.color}`} />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {formData.category && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tipo de Evento *</label>
              <select
                value={formData.eventType}
                onChange={(e) => handleInputChange('eventType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar tipo...</option>
                {eventCategories[formData.category]?.types.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Prioridad</label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {priorityOptions.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {renderInput('description', 'Descripción', 'textarea', {
            placeholder: 'Describe los detalles del evento...',
            rows: 4,
            helpText: 'Proporciona información adicional sobre el evento'
          })}
        </motion.div>
      )}
    </div>
  );

  // Renderizar tab de participantes
  const renderParticipants = () => (
    <div className="space-y-6">
      {/* Selección de bovinos */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Bovinos Participantes</h4>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.applyToAll}
              onChange={(e) => handleInputChange('applyToAll', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Aplicar a todos los bovinos</span>
          </label>
        </div>

        {!formData.applyToAll && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar bovinos por ID o nombre..."
                value={searchBovines}
                onChange={(e) => setSearchBovines(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
              {bovines
                .filter(bovine => 
                  bovine.tagNumber.toLowerCase().includes(searchBovines.toLowerCase()) ||
                  bovine.name.toLowerCase().includes(searchBovines.toLowerCase())
                )
                .map(bovine => (
                  <label
                    key={bovine.id}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedBovines.includes(bovine.id)}
                      onChange={(e) => handleBovineSelection(bovine.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{bovine.tagNumber}</span>
                        <span className="text-gray-500">-</span>
                        <span className="text-gray-700">{bovine.name}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {bovine.breed} • {bovine.gender === 'male' ? 'Macho' : 'Hembra'}
                      </div>
                    </div>
                  </label>
                ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Personal asignado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderSelect('assignedTo', 'Responsable Principal', personnel.map(p => ({ value: p.id, label: p.name })), {
          placeholder: 'Seleccionar responsable',
          icon: Users
        })}
        
        {renderSelect('veterinarian', 'Veterinario', personnel.filter(p => p.role === 'veterinarian').map(p => ({ value: p.id, label: p.name })), {
          placeholder: 'Seleccionar veterinario',
          icon: Stethoscope
        })}
      </div>
    </div>
  );

  // Renderizar tab de programación
  const renderSchedule = () => (
    <div className="space-y-6">
      {/* Fecha y hora */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput('startDate', 'Fecha de Inicio', 'date', {
          required: true,
          icon: Calendar
        })}
        
        {renderInput('endDate', 'Fecha de Fin', 'date', {
          icon: Calendar
        })}
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.allDay}
            onChange={(e) => handleInputChange('allDay', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">Todo el día</span>
        </label>
      </div>

      {!formData.allDay && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {renderInput('startTime', 'Hora de Inicio', 'time', {
            required: true,
            icon: Clock
          })}
          
          {renderInput('endTime', 'Hora de Fin', 'time', {
            icon: Clock
          })}
        </motion.div>
      )}

      {/* Ubicación */}
      {renderSelect('location', 'Ubicación', locations.map(l => ({ value: l.id, label: l.name })), {
        placeholder: 'Seleccionar ubicación',
        icon: MapPin
      })}

      {/* Recordatorios */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium text-gray-900">Recordatorios</h4>
          <button
            type="button"
            onClick={addReminder}
            className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Agregar
          </button>
        </div>
        
        {formData.reminders.map((reminder, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md"
          >
            <Bell className="w-4 h-4 text-gray-500" />
            <input
              type="number"
              value={reminder.time}
              onChange={(e) => {
                const newReminders = [...formData.reminders];
                newReminders[index].time = parseInt(e.target.value);
                handleInputChange('reminders', newReminders);
              }}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              min="1"
            />
            <select
              value={reminder.unit}
              onChange={(e) => {
                const newReminders = [...formData.reminders];
                newReminders[index].unit = e.target.value;
                handleInputChange('reminders', newReminders);
              }}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="minutes">minutos</option>
              <option value="hours">horas</option>
              <option value="days">días</option>
            </select>
            <span className="text-sm text-gray-600">antes</span>
            <button
              type="button"
              onClick={() => removeReminder(index)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Recurrencia */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.recurring}
              onChange={(e) => {
                handleInputChange('recurring', e.target.checked);
                setShowRecurrence(e.target.checked);
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Evento recurrente</span>
          </label>
        </div>

        <AnimatePresence>
          {showRecurrence && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-md"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Frecuencia</label>
                <select
                  value={formData.recurrencePattern.frequency}
                  onChange={(e) => handleInputChange('frequency', e.target.value, 'recurrencePattern')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                  <option value="yearly">Anual</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Repetir cada</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={formData.recurrencePattern.interval}
                    onChange={(e) => handleInputChange('interval', parseInt(e.target.value), 'recurrencePattern')}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                    min="1"
                  />
                  <span className="text-sm text-gray-600">
                    {formData.recurrencePattern.frequency === 'daily' ? 'días' :
                     formData.recurrencePattern.frequency === 'weekly' ? 'semanas' :
                     formData.recurrencePattern.frequency === 'monthly' ? 'meses' : 'años'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  // Renderizar tab de recursos
  const renderResources = () => (
    <div className="space-y-6">
      {/* Materiales */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium text-gray-900">Materiales Requeridos</h4>
          <select
            onChange={(e) => {
              const material = availableMaterials.find(m => m.id === e.target.value);
              if (material) {
                addMaterial(material);
                e.target.value = '';
              }
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Agregar material...</option>
            {availableMaterials.map(material => (
              <option key={material.id} value={material.id}>
                {material.name}
              </option>
            ))}
          </select>
        </div>
        
        {formData.materials.map((material, index) => (
          <motion.div
            key={material.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md"
          >
            <div className="flex-1">
              <span className="font-medium text-gray-900">{material.name}</span>
              <span className="text-sm text-gray-500 ml-2">({material.category})</span>
            </div>
            <input
              type="number"
              value={material.quantity}
              onChange={(e) => {
                const newMaterials = [...formData.materials];
                newMaterials[index].quantity = parseInt(e.target.value);
                handleInputChange('materials', newMaterials);
              }}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              min="1"
            />
            <span className="text-sm text-gray-600">{material.unit}</span>
            <button
              type="button"
              onClick={() => removeMaterial(material.id)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Medicamentos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium text-gray-900">Medicamentos</h4>
          <select
            onChange={(e) => {
              const medication = availableMedications.find(m => m.id === e.target.value);
              if (medication) {
                addMedication(medication);
                e.target.value = '';
              }
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Agregar medicamento...</option>
            {availableMedications.map(medication => (
              <option key={medication.id} value={medication.id}>
                {medication.name}
              </option>
            ))}
          </select>
        </div>
        
        {formData.medications.map((medication, index) => (
          <motion.div
            key={medication.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-gray-50 rounded-md space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">{medication.name}</span>
                <span className="text-sm text-gray-500 ml-2">({medication.category})</span>
              </div>
              <button
                type="button"
                onClick={() => removeMedication(medication.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Dosis personalizada"
                value={medication.dosage}
                onChange={(e) => {
                  const newMedications = [...formData.medications];
                  newMedications[index].dosage = e.target.value;
                  handleInputChange('medications', newMedications);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="text"
                placeholder="Notas adicionales"
                value={medication.notes}
                onChange={(e) => {
                  const newMedications = [...formData.medications];
                  newMedications[index].notes = e.target.value;
                  handleInputChange('medications', newMedications);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Costos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput('estimatedCost', 'Costo Estimado', 'number', {
          placeholder: '0.00',
          min: 0,
          step: 0.01,
          icon: DollarSign,
          helpText: 'Costo estimado del evento'
        })}
        
        {mode !== 'create' && renderInput('actualCost', 'Costo Real', 'number', {
          placeholder: '0.00',
          min: 0,
          step: 0.01,
          icon: DollarSign,
          helpText: 'Costo real del evento (después de completado)'
        })}
      </div>
    </div>
  );

  // Renderizar tabs
  const renderTabs = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {formTabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = currentTab === tab.id;
          
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCurrentTab(tab.id)}
              className={`
                flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <TabIcon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  // Renderizar contenido del tab actual
  const renderTabContent = () => {
    switch (currentTab) {
      case 'basic':
        return renderBasicInfo();
      case 'participants':
        return renderParticipants();
      case 'schedule':
        return renderSchedule();
      case 'resources':
        return renderResources();
      default:
        return renderBasicInfo();
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
              {mode === 'create' ? 'Crear Nuevo Evento' : 
               mode === 'edit' ? 'Editar Evento' : 'Ver Evento'}
            </h2>
            <p className="text-gray-600 mt-1">
              {mode === 'create' ? 'Programa un nuevo evento para el ganado' :
               mode === 'edit' ? 'Modifica la información del evento' :
               'Detalles del evento programado'}
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
        {/* Tabs */}
        {renderTabs()}
        
        {/* Contenido del tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
        
        {/* Botones de acción */}
        <div className="flex items-center justify-end space-x-3 pt-8 border-t border-gray-200 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
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
                {mode === 'create' ? 'Crear Evento' : 'Guardar Cambios'}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EventForm;