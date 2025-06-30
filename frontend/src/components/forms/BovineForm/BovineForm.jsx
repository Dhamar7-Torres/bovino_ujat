// Formulario para registro y edición de bovinos con validación y geolocalización

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  X,
  Camera,
  MapPin,
  Calendar,
  Scale,
  Tag,
  Cow,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Info,
  RefreshCw,
  Search,
  Plus,
  Minus
} from 'lucide-react';

const BovineForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  mode = 'create', // 'create', 'edit', 'view'
  ranchId = null,
  className = ''
}) => {

  // Estados del formulario principal
  const [formData, setFormData] = useState({
    // Información básica
    tagNumber: '',
    name: '',
    alternativeId: '',
    
    // Características físicas
    breed: '',
    gender: '',
    color: '',
    weight: '',
    height: '',
    bodyCondition: 5,
    
    // Información genealógica
    motherTagNumber: '',
    fatherTagNumber: '',
    generationNumber: 1,
    
    // Fechas importantes
    birthDate: '',
    acquisitionDate: '',
    weaningDate: '',
    
    // Estado y ubicación
    status: 'active',
    healthStatus: 'healthy',
    reproductiveStatus: 'not-applicable',
    currentLocation: '',
    ranchId: ranchId || '',
    
    // Información adicional
    origin: '',
    acquisitionType: 'birth',
    acquisitionPrice: '',
    currentValue: '',
    insuranceValue: '',
    notes: '',
    
    // Metadatos
    createdBy: '',
    lastModifiedBy: '',
    tags: []
  });

  // Estados para manejo de archivos e imágenes
  const [images, setImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  
  // Estados para ubicación
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    address: '',
    accuracy: null,
    timestamp: null
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  // Estados para validación y control
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Estados para opciones dinámicas
  const [breeds, setBreeds] = useState([]);
  const [locations, setLocations] = useState([]);
  const [parentBovines, setParentBovines] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Referencias
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  // Opciones estáticas
  const genderOptions = [
    { value: 'male', label: 'Macho' },
    { value: 'female', label: 'Hembra' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'sold', label: 'Vendido' },
    { value: 'deceased', label: 'Fallecido' },
    { value: 'transferred', label: 'Transferido' },
    { value: 'quarantine', label: 'Cuarentena' }
  ];

  const healthStatusOptions = [
    { value: 'healthy', label: 'Saludable' },
    { value: 'sick', label: 'Enfermo' },
    { value: 'treatment', label: 'En Tratamiento' },
    { value: 'observation', label: 'En Observación' },
    { value: 'recovered', label: 'Recuperado' }
  ];

  const reproductiveStatusOptions = [
    { value: 'not-applicable', label: 'No Aplica' },
    { value: 'ready', label: 'Listo para Reproducción' },
    { value: 'pregnant', label: 'Preñada' },
    { value: 'lactating', label: 'Lactando' },
    { value: 'service', label: 'En Servicio' },
    { value: 'rest', label: 'En Descanso' }
  ];

  const acquisitionTypeOptions = [
    { value: 'birth', label: 'Nacimiento' },
    { value: 'purchase', label: 'Compra' },
    { value: 'transfer', label: 'Transferencia' },
    { value: 'donation', label: 'Donación' },
    { value: 'exchange', label: 'Intercambio' }
  ];

  const colorOptions = [
    'Negro', 'Blanco', 'Marrón', 'Rojo', 'Gris',
    'Negro y Blanco', 'Marrón y Blanco', 'Rojo y Blanco',
    'Beige', 'Crema', 'Ruano', 'Bayo', 'Colorado'
  ];

  // Pasos del formulario
  const formSteps = [
    { id: 1, title: 'Información Básica', icon: Tag },
    { id: 2, title: 'Características', icon: Cow },
    { id: 3, title: 'Genealogía', icon: Calendar },
    { id: 4, title: 'Ubicación e Imágenes', icon: MapPin }
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

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData
      }));
      
      if (initialData.images) {
        setImages(initialData.images);
      }
      
      if (initialData.location) {
        setLocationData(initialData.location);
      }
    }
    
    loadFormOptions();
  }, [initialData]);

  // Cargar opciones del formulario
  const loadFormOptions = async () => {
    try {
      setLoadingOptions(true);
      
      // Simular carga de opciones desde API
      const mockBreeds = [
        { value: 'holstein', label: 'Holstein' },
        { value: 'angus', label: 'Angus' },
        { value: 'hereford', label: 'Hereford' },
        { value: 'charolais', label: 'Charolais' },
        { value: 'simmental', label: 'Simmental' },
        { value: 'brahman', label: 'Brahman' },
        { value: 'jersey', label: 'Jersey' },
        { value: 'limousin', label: 'Limousin' }
      ];

      const mockLocations = [
        { value: 'potrero-1', label: 'Potrero 1' },
        { value: 'potrero-2', label: 'Potrero 2' },
        { value: 'corral-central', label: 'Corral Central' },
        { value: 'area-cuarentena', label: 'Área de Cuarentena' },
        { value: 'sala-ordeno', label: 'Sala de Ordeño' }
      ];

      const mockParents = [
        { value: 'BOV001', label: 'BOV001 - Vaca Linda' },
        { value: 'BOV002', label: 'BOV002 - Toro Bravo' },
        { value: 'BOV003', label: 'BOV003 - Vaca Negra' }
      ];

      setBreeds(mockBreeds);
      setLocations(mockLocations);
      setParentBovines(mockParents);
      
    } catch (error) {
      console.error('Error al cargar opciones del formulario:', error);
      setErrors({ general: 'Error al cargar opciones del formulario' });
    } finally {
      setLoadingOptions(false);
    }
  };

  // Manejar cambios en campos del formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    setIsDirty(true);
    
    // Limpiar error específico cuando el usuario modifica el campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
    
    // Marcar campo como tocado
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Validaciones obligatorias
    if (!formData.tagNumber.trim()) {
      newErrors.tagNumber = 'El número de identificación es obligatorio';
    }
    
    if (!formData.breed) {
      newErrors.breed = 'La raza es obligatoria';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'El sexo es obligatorio';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birthDate = 'La fecha de nacimiento no puede ser futura';
      }
    }
    
    // Validaciones de peso
    if (formData.weight && (isNaN(formData.weight) || formData.weight < 0)) {
      newErrors.weight = 'El peso debe ser un número positivo';
    }
    
    // Validaciones de valores monetarios
    if (formData.acquisitionPrice && (isNaN(formData.acquisitionPrice) || formData.acquisitionPrice < 0)) {
      newErrors.acquisitionPrice = 'El precio de adquisición debe ser un número positivo';
    }
    
    // Validación de número de identificación único
    if (formData.tagNumber && mode === 'create') {
      // Aquí validarías contra la base de datos
      // newErrors.tagNumber = 'Este número de identificación ya existe';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Obtener ubicación actual
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors(prev => ({
        ...prev,
        location: 'La geolocalización no está soportada en este navegador'
      }));
      return;
    }

    setLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        try {
          // Intentar obtener dirección usando geocodificación inversa
          const response = await fetch(
            `https://api.geocoding.example.com/reverse?lat=${latitude}&lon=${longitude}`
          );
          
          let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          if (response.ok) {
            const data = await response.json();
            address = data.formatted_address || address;
          }
          
          setLocationData({
            latitude,
            longitude,
            address,
            accuracy,
            timestamp: new Date().toISOString()
          });
          
          setFormData(prev => ({
            ...prev,
            currentLocation: address
          }));
          
        } catch (error) {
          console.error('Error al obtener dirección:', error);
          setLocationData({
            latitude,
            longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            accuracy,
            timestamp: new Date().toISOString()
          });
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error('Error al obtener ubicación:', error);
        setLoadingLocation(false);
        setErrors(prev => ({
          ...prev,
          location: 'No se pudo obtener la ubicación actual'
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  // Manejar subida de imágenes
  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValid = file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024; // 5MB max
      if (!isValid) {
        setErrors(prev => ({
          ...prev,
          images: 'Solo se permiten imágenes menores a 5MB'
        }));
      }
      return isValid;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file,
          preview: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type
        };
        
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Manejar drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageUpload(files);
    }
  };

  // Eliminar imagen
  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
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
        images: images.map(img => ({
          name: img.name,
          size: img.size,
          type: img.type,
          preview: img.preview
        })),
        location: locationData,
        lastModified: new Date().toISOString()
      };

      await onSubmit(submitData);
      setIsDirty(false);
      
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setErrors(prev => ({
        ...prev,
        general: 'Error al guardar los datos. Inténtelo nuevamente.'
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

  // Cambiar paso del formulario
  const goToStep = (step) => {
    setCurrentStep(step);
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
      prefix,
      suffix,
      helpText,
      icon: IconComponent
    } = options;

    const hasError = errors[field];
    const isTouched = touched[field];
    
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
          
          {type === 'textarea' ? (
            <textarea
              value={formData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder={placeholder}
              rows={rows || 3}
              disabled={disabled || mode === 'view'}
              className={`
                w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}
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
                ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}
                ${hasError ? 'border-red-500' : 'border-gray-300'}
                ${disabled || mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              `}
            />
          )}
          
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

  // Renderizar selector
  const renderSelect = (field, label, options, config = {}) => {
    const {
      placeholder = 'Seleccionar...',
      required = false,
      disabled = false,
      helpText,
      icon: IconComponent,
      searchable = false
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
    <motion.div
      key="step1"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput('tagNumber', 'Número de Identificación', 'text', {
          placeholder: 'Ej: BOV001',
          required: true,
          icon: Tag,
          helpText: 'Identificador único del bovino'
        })}
        
        {renderInput('name', 'Nombre (Opcional)', 'text', {
          placeholder: 'Ej: Vaca Linda',
          icon: Cow
        })}
        
        {renderInput('alternativeId', 'ID Alternativo', 'text', {
          placeholder: 'Ej: Chip #12345',
          helpText: 'Número de chip, tatuaje, etc.'
        })}
        
        {renderSelect('breed', 'Raza', breeds, {
          required: true,
          placeholder: 'Seleccionar raza',
          helpText: 'Raza predominante del bovino'
        })}
        
        {renderSelect('gender', 'Sexo', genderOptions, {
          required: true,
          placeholder: 'Seleccionar sexo'
        })}
        
        {renderSelect('color', 'Color', colorOptions.map(color => ({ value: color.toLowerCase(), label: color })), {
          placeholder: 'Seleccionar color'
        })}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderInput('birthDate', 'Fecha de Nacimiento', 'date', {
          required: true,
          icon: Calendar,
          helpText: 'Fecha de nacimiento del bovino'
        })}
        
        {renderInput('acquisitionDate', 'Fecha de Adquisición', 'date', {
          icon: Calendar,
          helpText: 'Fecha en que ingresó al rancho'
        })}
        
        {renderSelect('acquisitionType', 'Tipo de Adquisición', acquisitionTypeOptions, {
          placeholder: 'Seleccionar tipo'
        })}
      </div>
    </motion.div>
  );

  // Renderizar paso 2: Características físicas
  const renderStep2 = () => (
    <motion.div
      key="step2"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderInput('weight', 'Peso (kg)', 'number', {
          placeholder: '450',
          min: 0,
          step: 0.1,
          icon: Scale,
          suffix: 'kg'
        })}
        
        {renderInput('height', 'Altura (cm)', 'number', {
          placeholder: '140',
          min: 0,
          step: 1,
          suffix: 'cm'
        })}
        
        <motion.div variants={itemVariants} className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Scale className="w-4 h-4 mr-2" />
            Condición Corporal
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="1"
              max="9"
              step="0.5"
              value={formData.bodyCondition}
              onChange={(e) => handleInputChange('bodyCondition', parseFloat(e.target.value))}
              disabled={mode === 'view'}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 (Muy Delgado)</span>
              <span className="font-medium text-blue-600">{formData.bodyCondition}</span>
              <span>9 (Obeso)</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderSelect('status', 'Estado', statusOptions, {
          required: true,
          placeholder: 'Seleccionar estado'
        })}
        
        {renderSelect('healthStatus', 'Estado de Salud', healthStatusOptions, {
          required: true,
          placeholder: 'Seleccionar estado de salud'
        })}
        
        {renderSelect('reproductiveStatus', 'Estado Reproductivo', reproductiveStatusOptions, {
          placeholder: 'Seleccionar estado reproductivo'
        })}
      </div>
      
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200"
        >
          {renderInput('acquisitionPrice', 'Precio de Adquisición', 'number', {
            placeholder: '25000',
            min: 0,
            step: 0.01,
            prefix: '$',
            helpText: 'Precio pagado al adquirir el bovino'
          })}
          
          {renderInput('currentValue', 'Valor Actual Estimado', 'number', {
            placeholder: '30000',
            min: 0,
            step: 0.01,
            prefix: '$',
            helpText: 'Valor actual estimado del bovino'
          })}
          
          {renderInput('insuranceValue', 'Valor de Seguro', 'number', {
            placeholder: '28000',
            min: 0,
            step: 0.01,
            prefix: '$',
            helpText: 'Valor asegurado del bovino'
          })}
          
          {renderInput('origin', 'Origen', 'text', {
            placeholder: 'Ej: Rancho Las Flores, Jalisco',
            helpText: 'Lugar de procedencia del bovino'
          })}
        </motion.div>
      )}
      
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        {showAdvanced ? <Minus className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
        {showAdvanced ? 'Ocultar' : 'Mostrar'} información avanzada
      </button>
    </motion.div>
  );

  // Renderizar paso 3: Genealogía
  const renderStep3 = () => (
    <motion.div
      key="step3"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderSelect('motherTagNumber', 'Madre', parentBovines.filter(p => p.value.includes('female') || p.label.includes('Vaca')), {
          placeholder: 'Seleccionar madre',
          helpText: 'Identificación de la madre'
        })}
        
        {renderSelect('fatherTagNumber', 'Padre', parentBovines.filter(p => p.value.includes('male') || p.label.includes('Toro')), {
          placeholder: 'Seleccionar padre',
          helpText: 'Identificación del padre'
        })}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput('generationNumber', 'Número de Generación', 'number', {
          placeholder: '1',
          min: 1,
          step: 1,
          helpText: 'Generación dentro del rancho'
        })}
        
        {renderInput('weaningDate', 'Fecha de Destete', 'date', {
          icon: Calendar,
          helpText: 'Fecha en que fue destetado'
        })}
      </div>
      
      {/* Árbol genealógico visual (simplificado) */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Árbol Genealógico</h4>
        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-2">
              <Cow className="w-8 h-8 text-pink-600" />
            </div>
            <p className="text-sm font-medium">Madre</p>
            <p className="text-xs text-gray-500">
              {formData.motherTagNumber || 'No especificada'}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Cow className="w-10 h-10 text-blue-600" />
            </div>
            <p className="text-sm font-medium">Actual</p>
            <p className="text-xs text-gray-500">
              {formData.tagNumber || 'Sin ID'}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Cow className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm font-medium">Padre</p>
            <p className="text-xs text-gray-500">
              {formData.fatherTagNumber || 'No especificado'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Renderizar paso 4: Ubicación e imágenes
  const renderStep4 = () => (
    <motion.div
      key="step4"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Ubicación */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Ubicación Actual</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderSelect('currentLocation', 'Ubicación en el Rancho', locations, {
            placeholder: 'Seleccionar ubicación'
          })}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Coordenadas GPS</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={loadingLocation || mode === 'view'}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loadingLocation ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4 mr-2" />
                )}
                {loadingLocation ? 'Obteniendo...' : 'Obtener Ubicación'}
              </button>
            </div>
            
            {locationData.latitude && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <p><strong>Latitud:</strong> {locationData.latitude.toFixed(6)}</p>
                <p><strong>Longitud:</strong> {locationData.longitude.toFixed(6)}</p>
                <p><strong>Dirección:</strong> {locationData.address}</p>
                {locationData.accuracy && (
                  <p><strong>Precisión:</strong> ±{Math.round(locationData.accuracy)}m</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Imágenes */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Imágenes del Bovino</h4>
        
        {/* Área de subida */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            ${mode === 'view' ? 'opacity-50 pointer-events-none' : 'hover:border-blue-400'}
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">Arrastra imágenes aquí o haz clic para seleccionar</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
            className="hidden"
            disabled={mode === 'view'}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={mode === 'view'}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Seleccionar Imágenes
          </button>
          <p className="text-xs text-gray-500 mt-2">Máximo 5MB por imagen</p>
        </div>
        
        {/* Galería de imágenes */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <img
                  src={image.preview}
                  alt={`Bovino ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                
                {mode !== 'view' && (
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                
                {index === mainImageIndex && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                    Principal
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Notas adicionales */}
      {renderInput('notes', 'Notas Adicionales', 'textarea', {
        placeholder: 'Observaciones especiales, características distintivas, etc.',
        rows: 4,
        helpText: 'Cualquier información adicional relevante'
      })}
    </motion.div>
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
              onClick={() => goToStep(step.id)}
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
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <StepIcon className="w-5 h-5" />
                )}
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
      {/* Header del formulario */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Registrar Nuevo Bovino' : 
               mode === 'edit' ? 'Editar Bovino' : 'Ver Bovino'}
            </h2>
            <p className="text-gray-600 mt-1">
              {mode === 'create' ? 'Complete la información del nuevo bovino' :
               mode === 'edit' ? 'Modifique la información del bovino' :
               'Información detallada del bovino'}
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
      
      {/* Mostrar errores generales */}
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
      <form ref={formRef} onSubmit={handleSubmit} className="p-6">
        {/* Indicador de pasos */}
        {renderStepIndicator()}
        
        {/* Contenido del paso actual */}
        <AnimatePresence mode="wait">
          {renderCurrentStep()}
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
              onClick={handleCancel}
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
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Guardando...' : mode === 'create' ? 'Registrar Bovino' : 'Guardar Cambios'}
              </button>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default BovineForm;