// Formulario para gestión de registros de salud veterinaria de bovinos

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Stethoscope,
  Syringe,
  Thermometer,
  Scale,
  Calendar,
  MapPin,
  User,
  AlertTriangle,
  Save,
  X,
  Plus,
  Minus,
  Clock,
  FileText,
  Camera,
  Upload,
  Activity,
  Pill,
  Shield,
  TrendingUp,
  TrendingDown,
  Eye,
  Info
} from 'lucide-react';

const HealthForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  mode = 'create',
  bovineId = null,
  className = ''
}) => {

  // Estados principales del formulario
  const [formData, setFormData] = useState({
    // Información básica del registro
    bovineId: bovineId || '',
    recordType: 'consultation', // 'consultation', 'vaccination', 'treatment', 'checkup', 'emergency'
    recordDate: new Date().toISOString().split('T')[0],
    recordTime: new Date().toTimeString().slice(0, 5),
    
    // Personal médico
    veterinarianId: '',
    veterinarianName: '',
    assistantId: '',
    assistantName: '',
    
    // Motivo y síntomas
    reason: '',
    symptoms: [],
    symptomsDescription: '',
    duration: '',
    severity: 'mild', // 'mild', 'moderate', 'severe', 'critical'
    
    // Examen físico
    physicalExam: {
      temperature: '',
      heartRate: '',
      respiratoryRate: '',
      weight: '',
      bodyCondition: 5,
      hydrationStatus: 'normal',
      mucousMembranes: 'normal',
      lymphNodes: 'normal',
      appetite: 'normal',
      behavior: 'normal',
      mobility: 'normal'
    },
    
    // Signos vitales históricos
    vitalSigns: [],
    
    // Diagnóstico
    diagnosis: {
      primary: '',
      secondary: [],
      differential: [],
      certaintyLevel: 'confirmed', // 'suspected', 'probable', 'confirmed'
      icdCode: '',
      notes: ''
    },
    
    // Tratamiento
    treatment: {
      medications: [],
      procedures: [],
      recommendations: '',
      followUpDate: '',
      followUpInstructions: '',
      dietaryChanges: '',
      activityRestrictions: '',
      isolation: false,
      isolationReason: ''
    },
    
    // Vacunaciones
    vaccinations: [],
    
    // Pruebas de laboratorio
    labTests: [],
    
    // Imágenes y archivos
    images: [],
    documents: [],
    
    // Costos
    serviceCost: '',
    medicationCost: '',
    totalCost: '',
    
    // Estado y seguimiento
    status: 'active', // 'active', 'resolved', 'ongoing', 'referred'
    outcome: '', // 'recovered', 'improved', 'stable', 'worsened', 'died'
    outcomeDate: '',
    outcomeNotes: '',
    
    // Ubicación y ambiente
    location: '',
    environmentalFactors: [],
    
    // Notas y observaciones
    notes: '',
    privateNotes: '',
    
    // Metadatos
    createdBy: '',
    lastModifiedBy: '',
    priority: 'medium' // 'low', 'medium', 'high', 'urgent'
  });

  // Estados de control
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [currentTab, setCurrentTab] = useState('basic');
  const [isDirty, setIsDirty] = useState(false);
  const [showVitalHistory, setShowVitalHistory] = useState(false);

  // Estados para datos externos
  const [bovines, setBovines] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const [medications, setMedications] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Tipos de registros de salud
  const recordTypes = [
    { value: 'consultation', label: 'Consulta General', icon: Stethoscope, color: 'bg-blue-100 text-blue-700' },
    { value: 'vaccination', label: 'Vacunación', icon: Syringe, color: 'bg-green-100 text-green-700' },
    { value: 'treatment', label: 'Tratamiento', icon: Pill, color: 'bg-yellow-100 text-yellow-700' },
    { value: 'checkup', label: 'Chequeo Rutinario', icon: Heart, color: 'bg-purple-100 text-purple-700' },
    { value: 'emergency', label: 'Emergencia', icon: AlertTriangle, color: 'bg-red-100 text-red-700' }
  ];

  // Síntomas comunes
  const commonSymptoms = [
    'Fiebre', 'Pérdida de apetito', 'Letargia', 'Diarrea', 'Tos', 'Secreción nasal',
    'Cojera', 'Hinchazón', 'Pérdida de peso', 'Dificultad respiratoria',
    'Vómito', 'Temblores', 'Convulsiones', 'Sangrado', 'Dolor abdominal'
  ];

  // Niveles de severidad
  const severityLevels = [
    { value: 'mild', label: 'Leve', color: 'text-green-600 bg-green-100' },
    { value: 'moderate', label: 'Moderado', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'severe', label: 'Severo', color: 'text-orange-600 bg-orange-100' },
    { value: 'critical', label: 'Crítico', color: 'text-red-600 bg-red-100' }
  ];

  // Estados de hidratación
  const hydrationStatus = [
    { value: 'normal', label: 'Normal' },
    { value: 'mild-dehydration', label: 'Deshidratación Leve' },
    { value: 'moderate-dehydration', label: 'Deshidratación Moderada' },
    { value: 'severe-dehydration', label: 'Deshidratación Severa' }
  ];

  // Estados de mucosas
  const mucousMembraneStatus = [
    { value: 'normal', label: 'Normal (Rosadas)' },
    { value: 'pale', label: 'Pálidas' },
    { value: 'red', label: 'Enrojecidas' },
    { value: 'yellow', label: 'Amarillentas (Ictericia)' },
    { value: 'blue', label: 'Azuladas (Cianosis)' }
  ];

  // Tabs del formulario
  const formTabs = [
    { id: 'basic', name: 'Información Básica', icon: FileText },
    { id: 'exam', name: 'Examen Físico', icon: Stethoscope },
    { id: 'diagnosis', name: 'Diagnóstico', icon: Heart },
    { id: 'treatment', name: 'Tratamiento', icon: Pill },
    { id: 'documents', name: 'Documentos', icon: Camera }
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
        { id: '1', tagNumber: 'BOV001', name: 'Vaca Linda', breed: 'Holstein', age: '3 años' },
        { id: '2', tagNumber: 'BOV002', name: 'Toro Bravo', breed: 'Angus', age: '5 años' },
        { id: '3', tagNumber: 'BOV003', name: 'Vaca Negra', breed: 'Holstein', age: '2 años' }
      ];

      const mockVeterinarians = [
        { id: '1', name: 'Dr. Juan Pérez', specialty: 'Medicina Bovina', license: 'VET001' },
        { id: '2', name: 'Dra. María González', specialty: 'Cirugía Veterinaria', license: 'VET002' },
        { id: '3', name: 'Dr. Carlos López', specialty: 'Reproducción Animal', license: 'VET003' }
      ];

      const mockMedications = [
        { id: '1', name: 'Penicilina G', category: 'Antibiótico', dosage: '20,000 UI/kg', route: 'IM' },
        { id: '2', name: 'Ivermectina', category: 'Antiparasitario', dosage: '200 mcg/kg', route: 'SC' },
        { id: '3', name: 'Meloxicam', category: 'Antiinflamatorio', dosage: '0.5 mg/kg', route: 'IV' },
        { id: '4', name: 'Dexametasona', category: 'Corticosteroide', dosage: '0.1 mg/kg', route: 'IM' }
      ];

      const mockVaccines = [
        { id: '1', name: 'Triple Bovina', diseases: ['IBR', 'BVD', 'PI3'], schedule: 'Anual' },
        { id: '2', name: 'Clostridiosis', diseases: ['Carbón', 'Enterotoxemia'], schedule: 'Semestral' },
        { id: '3', name: 'Brucelosis', diseases: ['Brucelosis'], schedule: 'Única' }
      ];

      const mockDiseases = [
        { id: '1', name: 'Mastitis', icd: 'N70.9', category: 'Infeccioso' },
        { id: '2', name: 'Neumonía', icd: 'J18.9', category: 'Respiratorio' },
        { id: '3', name: 'Diarrea', icd: 'K59.1', category: 'Digestivo' },
        { id: '4', name: 'Cojera', icd: 'M25.5', category: 'Musculoesquelético' }
      ];

      setBovines(mockBovines);
      setVeterinarians(mockVeterinarians);
      setMedications(mockMedications);
      setVaccines(mockVaccines);
      setDiseases(mockDiseases);

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

  // Agregar síntoma
  const addSymptom = (symptom) => {
    if (!formData.symptoms.includes(symptom)) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, symptom]
      }));
    }
  };

  // Eliminar síntoma
  const removeSymptom = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter(s => s !== symptom)
    }));
  };

  // Agregar medicamento al tratamiento
  const addMedication = (medication) => {
    const newMedication = {
      ...medication,
      prescribedDosage: '',
      frequency: '',
      duration: '',
      route: medication.route || '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    };

    setFormData(prev => ({
      ...prev,
      treatment: {
        ...prev.treatment,
        medications: [...prev.treatment.medications, newMedication]
      }
    }));
  };

  // Eliminar medicamento del tratamiento
  const removeMedication = (medicationId) => {
    setFormData(prev => ({
      ...prev,
      treatment: {
        ...prev.treatment,
        medications: prev.treatment.medications.filter(m => m.id !== medicationId)
      }
    }));
  };

  // Agregar vacuna
  const addVaccination = (vaccine) => {
    const newVaccination = {
      ...vaccine,
      batchNumber: '',
      expirationDate: '',
      applicationDate: new Date().toISOString().split('T')[0],
      applicationSite: 'neck',
      veterinarianId: formData.veterinarianId,
      nextDueDate: '',
      notes: ''
    };

    setFormData(prev => ({
      ...prev,
      vaccinations: [...prev.vaccinations, newVaccination]
    }));
  };

  // Eliminar vacuna
  const removeVaccination = (vaccineId) => {
    setFormData(prev => ({
      ...prev,
      vaccinations: prev.vaccinations.filter(v => v.id !== vaccineId)
    }));
  };

  // Agregar signo vital al historial
  const addVitalSign = () => {
    const newVitalSign = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      temperature: '',
      heartRate: '',
      respiratoryRate: '',
      notes: ''
    };

    setFormData(prev => ({
      ...prev,
      vitalSigns: [...prev.vitalSigns, newVitalSign]
    }));
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Validaciones obligatorias
    if (!formData.bovineId) {
      newErrors.bovineId = 'Debe seleccionar un bovino';
    }
    
    if (!formData.recordType) {
      newErrors.recordType = 'El tipo de registro es obligatorio';
    }
    
    if (!formData.recordDate) {
      newErrors.recordDate = 'La fecha del registro es obligatoria';
    }
    
    if (!formData.veterinarianId && formData.recordType !== 'checkup') {
      newErrors.veterinarianId = 'Debe asignar un veterinario para este tipo de registro';
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'El motivo de la consulta es obligatorio';
    }
    
    // Validaciones específicas por tipo de registro
    if (formData.recordType === 'vaccination' && formData.vaccinations.length === 0) {
      newErrors.vaccinations = 'Debe agregar al menos una vacuna aplicada';
    }
    
    if (formData.recordType === 'treatment' && formData.treatment.medications.length === 0) {
      newErrors.medications = 'Debe agregar al menos un medicamento al tratamiento';
    }
    
    // Validar signos vitales si están presentes
    if (formData.physicalExam.temperature && 
        (parseFloat(formData.physicalExam.temperature) < 35 || parseFloat(formData.physicalExam.temperature) > 45)) {
      newErrors.temperature = 'La temperatura debe estar entre 35°C y 45°C';
    }
    
    if (formData.physicalExam.heartRate && 
        (parseFloat(formData.physicalExam.heartRate) < 40 || parseFloat(formData.physicalExam.heartRate) > 120)) {
      newErrors.heartRate = 'La frecuencia cardíaca debe estar entre 40 y 120 bpm';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        general: 'Error al guardar el registro de salud. Inténtelo nuevamente.'
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
      icon: IconComponent,
      nested = null
    } = options;

    const hasError = errors[field];
    const value = nested ? formData[nested][field] : formData[field];
    
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
            value={value || ''}
            onChange={(e) => handleInputChange(field, e.target.value, nested)}
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
            <AlertTriangle className="w-4 h-4 mr-1" />
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

  // Renderizar tab de información básica
  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Tipo de registro */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700">Tipo de Registro *</label>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {recordTypes.map(type => {
            const TypeIcon = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange('recordType', type.value)}
                className={`
                  p-3 border-2 rounded-lg text-center transition-all
                  ${formData.recordType === type.value 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <TypeIcon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-xs font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bovino y fecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Bovino *</label>
          <select
            value={formData.bovineId}
            onChange={(e) => handleInputChange('bovineId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={mode === 'view' || bovineId}
          >
            <option value="">Seleccionar bovino...</option>
            {bovines.map(bovine => (
              <option key={bovine.id} value={bovine.id}>
                {bovine.tagNumber} - {bovine.name} ({bovine.breed}, {bovine.age})
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {renderInput('recordDate', 'Fecha', 'date', {
            required: true,
            icon: Calendar
          })}
          
          {renderInput('recordTime', 'Hora', 'time', {
            required: true,
            icon: Clock
          })}
        </div>
      </div>

      {/* Personal médico */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Veterinario Responsable *</label>
          <select
            value={formData.veterinarianId}
            onChange={(e) => {
              const vet = veterinarians.find(v => v.id === e.target.value);
              handleInputChange('veterinarianId', e.target.value);
              handleInputChange('veterinarianName', vet ? vet.name : '');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar veterinario...</option>
            {veterinarians.map(vet => (
              <option key={vet.id} value={vet.id}>
                {vet.name} - {vet.specialty} ({vet.license})
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Asistente</label>
          <input
            type="text"
            value={formData.assistantName}
            onChange={(e) => handleInputChange('assistantName', e.target.value)}
            placeholder="Nombre del asistente"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Motivo de la consulta */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Motivo de la Consulta *</label>
        <textarea
          value={formData.reason}
          onChange={(e) => handleInputChange('reason', e.target.value)}
          placeholder="Describe el motivo de la consulta o procedimiento..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Síntomas */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700">Síntomas Observados</label>
        
        {/* Síntomas seleccionados */}
        {formData.symptoms.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.symptoms.map(symptom => (
              <span
                key={symptom}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
              >
                {symptom}
                <button
                  type="button"
                  onClick={() => removeSymptom(symptom)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        
        {/* Síntomas disponibles */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {commonSymptoms.map(symptom => (
            <button
              key={symptom}
              type="button"
              onClick={() => addSymptom(symptom)}
              disabled={formData.symptoms.includes(symptom)}
              className={`
                px-3 py-2 text-sm rounded-md border transition-all
                ${formData.symptoms.includes(symptom)
                  ? 'bg-red-100 text-red-800 border-red-300 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {symptom}
            </button>
          ))}
        </div>
        
        {/* Descripción adicional de síntomas */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Descripción Detallada de Síntomas</label>
          <textarea
            value={formData.symptomsDescription}
            onChange={(e) => handleInputChange('symptomsDescription', e.target.value)}
            placeholder="Describe en detalle los síntomas observados..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Duración y severidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput('duration', 'Duración de los Síntomas', 'text', {
          placeholder: 'Ej: 2 días, 1 semana',
          helpText: 'Tiempo que lleva presentando los síntomas'
        })}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Severidad</label>
          <select
            value={formData.severity}
            onChange={(e) => handleInputChange('severity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {severityLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prioridad y ubicación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Prioridad</label>
          <select
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>
        
        {renderInput('location', 'Ubicación del Animal', 'text', {
          placeholder: 'Ej: Potrero 1, Corral de enfermería',
          icon: MapPin
        })}
      </div>
    </div>
  );

  // Renderizar tab de examen físico
  const renderPhysicalExam = () => (
    <div className="space-y-6">
      {/* Signos vitales principales */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Signos Vitales
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {renderInput('temperature', 'Temperatura', 'number', {
            placeholder: '38.5',
            min: 35,
            max: 45,
            step: 0.1,
            suffix: '°C',
            icon: Thermometer,
            nested: 'physicalExam',
            helpText: 'Normal: 38.0-39.5°C'
          })}
          
          {renderInput('heartRate', 'Frecuencia Cardíaca', 'number', {
            placeholder: '60',
            min: 40,
            max: 120,
            suffix: 'bpm',
            icon: Heart,
            nested: 'physicalExam',
            helpText: 'Normal: 48-84 bpm'
          })}
          
          {renderInput('respiratoryRate', 'Frecuencia Respiratoria', 'number', {
            placeholder: '20',
            min: 10,
            max: 60,
            suffix: 'rpm',
            icon: Activity,
            nested: 'physicalExam',
            helpText: 'Normal: 12-36 rpm'
          })}
          
          {renderInput('weight', 'Peso', 'number', {
            placeholder: '450',
            min: 0,
            step: 0.1,
            suffix: 'kg',
            icon: Scale,
            nested: 'physicalExam'
          })}
        </div>
      </div>

      {/* Condición corporal */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700">Condición Corporal</label>
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="9"
            step="0.5"
            value={formData.physicalExam.bodyCondition}
            onChange={(e) => handleInputChange('bodyCondition', parseFloat(e.target.value), 'physicalExam')}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 (Muy Delgado)</span>
            <span className="font-medium text-blue-600">{formData.physicalExam.bodyCondition}</span>
            <span>9 (Obeso)</span>
          </div>
        </div>
      </div>

      {/* Estados de hidratación y mucosas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Estado de Hidratación</label>
          <select
            value={formData.physicalExam.hydrationStatus}
            onChange={(e) => handleInputChange('hydrationStatus', e.target.value, 'physicalExam')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {hydrationStatus.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Mucosas</label>
          <select
            value={formData.physicalExam.mucousMembranes}
            onChange={(e) => handleInputChange('mucousMembranes', e.target.value, 'physicalExam')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {mucousMembraneStatus.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Otros parámetros físicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Ganglios Linfáticos</label>
          <select
            value={formData.physicalExam.lymphNodes}
            onChange={(e) => handleInputChange('lymphNodes', e.target.value, 'physicalExam')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="normal">Normal</option>
            <option value="enlarged">Aumentados</option>
            <option value="hard">Endurecidos</option>
            <option value="painful">Dolorosos</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Apetito</label>
          <select
            value={formData.physicalExam.appetite}
            onChange={(e) => handleInputChange('appetite', e.target.value, 'physicalExam')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="normal">Normal</option>
            <option value="increased">Aumentado</option>
            <option value="decreased">Disminuido</option>
            <option value="absent">Ausente</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Comportamiento</label>
          <select
            value={formData.physicalExam.behavior}
            onChange={(e) => handleInputChange('behavior', e.target.value, 'physicalExam')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="normal">Normal</option>
            <option value="lethargic">Letárgico</option>
            <option value="aggressive">Agresivo</option>
            <option value="anxious">Ansioso</option>
            <option value="depressed">Deprimido</option>
          </select>
        </div>
      </div>

      {/* Historial de signos vitales */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium text-gray-900">Historial de Signos Vitales</h4>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setShowVitalHistory(!showVitalHistory)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              {showVitalHistory ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={addVitalSign}
              className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {showVitalHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {formData.vitalSigns.map((vital, index) => (
                <div key={vital.id} className="grid grid-cols-5 gap-3 p-3 bg-gray-50 rounded-md">
                  <input
                    type="datetime-local"
                    value={vital.timestamp.slice(0, 16)}
                    onChange={(e) => {
                      const newVitals = [...formData.vitalSigns];
                      newVitals[index].timestamp = e.target.value + ':00.000Z';
                      handleInputChange('vitalSigns', newVitals);
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Temp (°C)"
                    value={vital.temperature}
                    onChange={(e) => {
                      const newVitals = [...formData.vitalSigns];
                      newVitals[index].temperature = e.target.value;
                      handleInputChange('vitalSigns', newVitals);
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                    step="0.1"
                  />
                  <input
                    type="number"
                    placeholder="FC (bpm)"
                    value={vital.heartRate}
                    onChange={(e) => {
                      const newVitals = [...formData.vitalSigns];
                      newVitals[index].heartRate = e.target.value;
                      handleInputChange('vitalSigns', newVitals);
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="FR (rpm)"
                    value={vital.respiratoryRate}
                    onChange={(e) => {
                      const newVitals = [...formData.vitalSigns];
                      newVitals[index].respiratoryRate = e.target.value;
                      handleInputChange('vitalSigns', newVitals);
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newVitals = formData.vitalSigns.filter((_, i) => i !== index);
                      handleInputChange('vitalSigns', newVitals);
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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

  // Renderizar contenido del tab actual (continuará...)
  const renderTabContent = () => {
    switch (currentTab) {
      case 'basic':
        return renderBasicInfo();
      case 'exam':
        return renderPhysicalExam();
      case 'diagnosis':
        // Por ahora retornamos un placeholder
        return <div className="p-8 text-center text-gray-500">Diagnóstico - En desarrollo</div>;
      case 'treatment':
        // Por ahora retornamos un placeholder  
        return <div className="p-8 text-center text-gray-500">Tratamiento - En desarrollo</div>;
      case 'documents':
        // Por ahora retornamos un placeholder
        return <div className="p-8 text-center text-gray-500">Documentos - En desarrollo</div>;
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
              {mode === 'create' ? 'Nuevo Registro de Salud' : 
               mode === 'edit' ? 'Editar Registro de Salud' : 'Ver Registro de Salud'}
            </h2>
            <p className="text-gray-600 mt-1">
              {mode === 'create' ? 'Registra información médica del bovino' :
               mode === 'edit' ? 'Modifica el registro médico' :
               'Información detallada del registro médico'}
            </p>
          </div>
          
          {mode !== 'view' && isDirty && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm"
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
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
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
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
                {mode === 'create' ? 'Registrar' : 'Guardar Cambios'}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default HealthForm;