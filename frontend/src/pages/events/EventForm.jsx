import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  CheckCircle,
  Zap,
  Heart,
  Scale,
  Syringe,
  Baby,
  Bell,
  User,
  FileText,
  Camera,
  Upload,
  Plus,
  X,
  Check,
  Search,
  RefreshCw,
  Info,
  DollarSign
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const EventForm = () => {
  // Estados para manejar el formulario y la UI
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: '',
    time: '',
    endTime: '',
    description: '',
    location: '',
    veterinarian: '',
    priority: 'medium',
    reminder: 30,
    status: 'scheduled',
    estimatedCost: '',
    notes: '',
    isRecurring: false,
    recurringFrequency: 'monthly',
    recurringEnd: ''
  });

  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    address: '',
    isLoading: false,
    error: null
  });

  const [selectedBovines, setSelectedBovines] = useState([]);
  const [availableBovines, setAvailableBovines] = useState([]);
  const [bovineSearch, setBovineSearch] = useState('');
  const [showBovineModal, setShowBovineModal] = useState(false);

  const [vaccinesList, setVaccinesList] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [requirementsList, setRequirementsList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Tipos de eventos disponibles
  const eventTypes = [
    { value: 'vaccination', label: 'Vaccination', icon: Syringe, color: 'text-purple-600' },
    { value: 'health', label: 'Health Checkup', icon: Heart, color: 'text-red-600' },
    { value: 'monitoring', label: 'Monitoring', icon: Scale, color: 'text-blue-600' },
    { value: 'breeding', label: 'Breeding', icon: Baby, color: 'text-pink-600' },
    { value: 'feeding', label: 'Feeding', icon: Zap, color: 'text-green-600' },
    { value: 'treatment', label: 'Treatment', icon: AlertCircle, color: 'text-orange-600' }
  ];

  // Prioridades disponibles
  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'High', color: 'text-red-600 bg-red-100' }
  ];

  // Opciones de recordatorio
  const reminderOptions = [
    { value: 0, label: 'No reminder' },
    { value: 15, label: '15 minutes before' },
    { value: 30, label: '30 minutes before' },
    { value: 60, label: '1 hour before' },
    { value: 120, label: '2 hours before' },
    { value: 1440, label: '1 day before' }
  ];

  // Animaciones para los componentes
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, delay: 0.1 }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.3 }
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchAvailableBovines();
    if (isEditing) {
      fetchEventData();
    } else {
      getCurrentLocation();
    }
  }, [id]);

  // Obtener ubicación actual
  const getCurrentLocation = () => {
    setLocationData(prev => ({ ...prev, isLoading: true, error: null }));

    if (!navigator.geolocation) {
      setLocationData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Geolocation is not supported by this browser'
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          
          // Opcional: usar reverse geocoding
          setLocationData({
            latitude,
            longitude,
            address,
            isLoading: false,
            error: null
          });
          
          setFormData(prev => ({
            ...prev,
            location: address
          }));
        } catch (error) {
          console.error('Geocoding error:', error);
          setLocationData({
            latitude,
            longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            isLoading: false,
            error: null
          });
        }
      },
      (error) => {
        setLocationData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Unable to retrieve your location'
        }));
        console.error('Geolocation error:', error);
      }
    );
  };

  // Obtener datos del evento (si está editando)
  const fetchEventData = async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch(`/api/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title || '',
          type: data.type || '',
          date: data.date || '',
          time: data.time || '',
          endTime: data.endTime || '',
          description: data.description || '',
          location: data.location || '',
          veterinarian: data.veterinarian || '',
          priority: data.priority || 'medium',
          reminder: data.reminder || 30,
          status: data.status || 'scheduled',
          estimatedCost: data.cost || '',
          notes: data.notes || '',
          isRecurring: data.recurring?.enabled || false,
          recurringFrequency: data.recurring?.frequency || 'monthly',
          recurringEnd: data.recurring?.endDate || ''
        });

        if (data.bovines) {
          setSelectedBovines(data.bovines);
        }

        if (data.vaccines) {
          setVaccinesList(data.vaccines);
        }

        if (data.equipment) {
          setEquipmentList(data.equipment);
        }

        if (data.completionRequirements) {
          setRequirementsList(data.completionRequirements);
        }
      } else {
        setErrors({ general: 'Failed to load event data' });
      }
    } catch (error) {
      console.error('Fetch event error:', error);
      setErrors({ general: 'Connection error. Please try again.' });
    } finally {
      setIsLoadingData(false);
    }
  };

  // Obtener bovinos disponibles
  const fetchAvailableBovines = async () => {
    try {
      const response = await fetch('/api/bovines', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableBovines(data);
      }
    } catch (error) {
      console.error('Fetch bovines error:', error);
    }
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar errores cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Agregar/remover bovino
  const toggleBovine = (bovine) => {
    setSelectedBovines(prev => {
      const isSelected = prev.some(b => b.id === bovine.id);
      if (isSelected) {
        return prev.filter(b => b.id !== bovine.id);
      } else {
        return [...prev, bovine];
      }
    });
  };

  // Agregar vacuna
  const addVaccine = () => {
    setVaccinesList(prev => [...prev, {
      name: '',
      batch: '',
      expiry: ''
    }]);
  };

  // Remover vacuna
  const removeVaccine = (index) => {
    setVaccinesList(prev => prev.filter((_, i) => i !== index));
  };

  // Actualizar vacuna
  const updateVaccine = (index, field, value) => {
    setVaccinesList(prev => prev.map((vaccine, i) => 
      i === index ? { ...vaccine, [field]: value } : vaccine
    ));
  };

  // Agregar equipamiento
  const addEquipment = () => {
    const equipment = prompt('Enter equipment item:');
    if (equipment && equipment.trim()) {
      setEquipmentList(prev => [...prev, equipment.trim()]);
    }
  };

  // Remover equipamiento
  const removeEquipment = (index) => {
    setEquipmentList(prev => prev.filter((_, i) => i !== index));
  };

  // Agregar requerimiento
  const addRequirement = () => {
    const requirement = prompt('Enter completion requirement:');
    if (requirement && requirement.trim()) {
      setRequirementsList(prev => [...prev, requirement.trim()]);
    }
  };

  // Remover requerimiento
  const removeRequirement = (index) => {
    setRequirementsList(prev => prev.filter((_, i) => i !== index));
  };

  // Validar paso 1 (información básica)
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Event type is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.time) {
      newErrors.time = 'Start time is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar paso 2 (detalles adicionales)
  const validateStep2 = () => {
    const newErrors = {};
    
    if (selectedBovines.length === 0) {
      newErrors.bovines = 'At least one bovine must be selected';
    }
    
    if (formData.estimatedCost && (isNaN(formData.estimatedCost) || formData.estimatedCost < 0)) {
      newErrors.estimatedCost = 'Cost must be a positive number';
    }
    
    if (formData.isRecurring && !formData.recurringEnd) {
      newErrors.recurringEnd = 'End date is required for recurring events';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Avanzar al siguiente paso
  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  // Retroceder al paso anterior
  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setIsLoading(true);
    
    try {
      const submitData = {
        ...formData,
        bovines: selectedBovines.map(b => b.id),
        vaccines: formData.type === 'vaccination' ? vaccinesList : undefined,
        equipment: equipmentList.length > 0 ? equipmentList : undefined,
        completionRequirements: requirementsList.length > 0 ? requirementsList : undefined,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        recurring: formData.isRecurring ? {
          enabled: true,
          frequency: formData.recurringFrequency,
          endDate: formData.recurringEnd
        } : undefined
      };
      
      const url = isEditing ? `/api/events/${id}` : '/api/events';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submitData)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Event saved successfully:', data);
        
        navigate(isEditing ? `/events/${id}` : '/events', { 
          state: { 
            message: `Event ${isEditing ? 'updated' : 'created'} successfully!` 
          }
        });
      } else {
        const errorData = await response.json();
        setErrors({ 
          general: errorData.message || `Failed to ${isEditing ? 'update' : 'create'} event` 
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ 
        general: 'Connection error. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar bovinos por búsqueda
  const filteredBovines = availableBovines.filter(bovine => 
    bovine.name.toLowerCase().includes(bovineSearch.toLowerCase()) ||
    bovine.tagNumber.toLowerCase().includes(bovineSearch.toLowerCase()) ||
    bovine.breed.toLowerCase().includes(bovineSearch.toLowerCase())
  );

  // Obtener icono del tipo de evento
  const getEventTypeIcon = (type) => {
    const eventType = eventTypes.find(et => et.value === type);
    return eventType ? eventType.icon : Calendar;
  };

  // Mostrar loading de datos
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to={isEditing ? `/events/${id}` : "/events"}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to {isEditing ? 'Event' : 'Events'}
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Event' : 'Create New Event'}
              </h1>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Indicador de pasos */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${
                currentStep >= 1 ? 'text-green-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                <span className="text-sm font-medium">Basic Information</span>
              </div>
              <div className={`w-16 h-1 rounded transition-all duration-300 ${
                currentStep >= 2 ? 'bg-green-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center space-x-2 ${
                currentStep >= 2 ? 'text-green-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium">Details & Livestock</span>
              </div>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <form onSubmit={handleSubmit}>
              {/* Error general */}
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 border-l-4 border-red-400 p-4 m-6 mb-0"
                >
                  <div className="flex">
                    <X className="w-5 h-5 text-red-400 mr-2" />
                    <p className="text-red-800 text-sm">{errors.general}</p>
                  </div>
                </motion.div>
              )}

              {/* Paso 1: Información Básica */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-6"
                >
                  <div className="flex items-center mb-6">
                    <Calendar className="w-6 h-6 text-green-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Título */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                          errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter event title"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                      )}
                    </div>

                    {/* Tipo de evento */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                          errors.type ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select event type</option>
                        {eventTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.type && (
                        <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                      )}
                    </div>

                    {/* Prioridad */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      >
                        {priorities.map(priority => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Fecha */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                            errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.date && (
                        <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                      )}
                    </div>

                    {/* Hora de inicio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time *
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                            errors.time ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.time && (
                        <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                      )}
                    </div>

                    {/* Hora de fin */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Veterinario */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Veterinarian
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="veterinarian"
                          value={formData.veterinarian}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter veterinarian name"
                        />
                      </div>
                    </div>

                    {/* Costo estimado */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Cost ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          name="estimatedCost"
                          value={formData.estimatedCost}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                            errors.estimatedCost ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.estimatedCost && (
                        <p className="text-red-500 text-sm mt-1">{errors.estimatedCost}</p>
                      )}
                    </div>

                    {/* Recordatorio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reminder
                      </label>
                      <div className="relative">
                        <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          name="reminder"
                          value={formData.reminder}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        >
                          {reminderOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Ubicación */}
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Location *
                        </label>
                        <button
                          type="button"
                          onClick={getCurrentLocation}
                          disabled={locationData.isLoading}
                          className="flex items-center text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          <RefreshCw className={`w-4 h-4 mr-1 ${locationData.isLoading ? 'animate-spin' : ''}`} />
                          Get Current Location
                        </button>
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                            errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Enter location or use current location"
                        />
                      </div>
                      {errors.location && (
                        <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                      )}
                      {locationData.error && (
                        <p className="text-red-500 text-sm mt-1">{locationData.error}</p>
                      )}
                    </div>

                    {/* Descripción */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter event description..."
                      />
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div className="flex justify-end mt-8">
                    <motion.button
                      type="button"
                      onClick={handleNextStep}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 shadow-lg"
                    >
                      Continue to Details
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Paso 2: Detalles y Ganado */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-6"
                >
                  <div className="flex items-center mb-6">
                    <Users className="w-6 h-6 text-green-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Details & Livestock</h2>
                  </div>

                  {/* Selección de bovinos */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Livestock *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowBovineModal(true)}
                        className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Bovines
                      </button>
                    </div>
                    
                    {/* Bovinos seleccionados */}
                    <div className="space-y-2">
                      {selectedBovines.map((bovine) => (
                        <div
                          key={bovine.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <span className="font-medium">{bovine.name}</span>
                            <span className="text-gray-500 ml-2">#{bovine.tagNumber}</span>
                            <span className="text-gray-500 ml-2">({bovine.breed})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleBovine(bovine)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      
                      {selectedBovines.length === 0 && (
                        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                          <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p>No livestock selected</p>
                          <p className="text-sm">Click "Add Bovines" to select livestock for this event</p>
                        </div>
                      )}
                    </div>
                    
                    {errors.bovines && (
                      <p className="text-red-500 text-sm mt-1">{errors.bovines}</p>
                    )}
                  </div>

                  {/* Vacunas (si es evento de vacunación) */}
                  {formData.type === 'vaccination' && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Vaccines & Medications
                        </label>
                        <button
                          type="button"
                          onClick={addVaccine}
                          className="flex items-center px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Vaccine
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {vaccinesList.map((vaccine, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <input
                                type="text"
                                placeholder="Vaccine name"
                                value={vaccine.name}
                                onChange={(e) => updateVaccine(index, 'name', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                              <input
                                type="text"
                                placeholder="Batch number"
                                value={vaccine.batch}
                                onChange={(e) => updateVaccine(index, 'batch', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                              <div className="flex space-x-2">
                                <input
                                  type="date"
                                  placeholder="Expiry date"
                                  value={vaccine.expiry}
                                  onChange={(e) => updateVaccine(index, 'expiry', e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeVaccine(index)}
                                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Equipamiento requerido */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Required Equipment
                      </label>
                      <button
                        type="button"
                        onClick={addEquipment}
                        className="flex items-center px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Equipment
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {equipmentList.map((equipment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span>{equipment}</span>
                          <button
                            type="button"
                            onClick={() => removeEquipment(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requerimientos de completitud */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Completion Requirements
                      </label>
                      <button
                        type="button"
                        onClick={addRequirement}
                        className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Requirement
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {requirementsList.map((requirement, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span>{requirement}</span>
                          <button
                            type="button"
                            onClick={() => removeRequirement(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Evento recurrente */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <input
                        type="checkbox"
                        id="isRecurring"
                        name="isRecurring"
                        checked={formData.isRecurring}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
                        Recurring Event
                      </label>
                    </div>
                    
                    {formData.isRecurring && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Frequency
                          </label>
                          <select
                            name="recurringFrequency"
                            value={formData.recurringFrequency}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annual">Annual</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date *
                          </label>
                          <input
                            type="date"
                            name="recurringEnd"
                            value={formData.recurringEnd}
                            onChange={handleInputChange}
                            min={formData.date}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                              errors.recurringEnd ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          />
                          {errors.recurringEnd && (
                            <p className="text-red-500 text-sm mt-1">{errors.recurringEnd}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notas adicionales */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Add any additional notes or instructions..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <motion.button
                      type="button"
                      onClick={handlePrevStep}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                    >
                      Back
                    </motion.button>
                    
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                        isLoading
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          {isEditing ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          {isEditing ? 'Update Event' : 'Create Event'}
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal de selección de bovinos */}
      {showBovineModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-96 overflow-hidden"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Select Livestock</h3>
                <button
                  onClick={() => setShowBovineModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={bovineSearch}
                    onChange={(e) => setBovineSearch(e.target.value)}
                    placeholder="Search by name, tag number, or breed..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {filteredBovines.map((bovine) => {
                  const isSelected = selectedBovines.some(b => b.id === bovine.id);
                  return (
                    <div
                      key={bovine.id}
                      onClick={() => toggleBovine(bovine)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <span className="font-medium">{bovine.name}</span>
                        <span className="text-gray-500 ml-2">#{bovine.tagNumber}</span>
                        <span className="text-gray-500 ml-2">({bovine.breed})</span>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-green-600" />}
                    </div>
                  );
                })}
                
                {filteredBovines.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No livestock found</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedBovines.length} livestock selected
                </span>
                <button
                  onClick={() => setShowBovineModal(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EventForm;