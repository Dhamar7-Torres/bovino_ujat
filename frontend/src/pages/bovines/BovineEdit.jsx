import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  MapPin, 
  Calendar, 
  Scale, 
  Tag, 
  Cow,
  Camera,
  Upload,
  X,
  Check,
  RefreshCw,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const BovineEdit = () => {
  // Estados para manejar el formulario y la UI
  const [formData, setFormData] = useState({
    tagNumber: '',
    name: '',
    breed: '',
    gender: '',
    birthDate: '',
    weight: '',
    color: '',
    motherTagNumber: '',
    fatherTagNumber: '',
    healthStatus: 'healthy',
    notes: ''
  });

  const [originalData, setOriginalData] = useState(null);
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    address: '',
    isLoading: false,
    error: null
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [hasChanges, setHasChanges] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // Razas de bovinos comunes
  const breeds = [
    'Holstein', 'Angus', 'Hereford', 'Charolais', 'Simmental',
    'Limousin', 'Brahman', 'Jersey', 'Guernsey', 'Brown Swiss',
    'Texas Longhorn', 'Beefmaster', 'Brangus', 'Santa Gertrudis'
  ];

  // Colores comunes
  const colors = [
    'Black', 'Brown', 'White', 'Red', 'Black and White',
    'Brown and White', 'Roan', 'Brindle', 'Dun', 'Gray'
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

  // Cargar datos del bovino al montar el componente
  useEffect(() => {
    fetchBovineData();
  }, [id]);

  // Detectar cambios en el formulario
  useEffect(() => {
    if (originalData) {
      const currentFormData = { ...formData };
      const originalFormData = {
        tagNumber: originalData.tagNumber || '',
        name: originalData.name || '',
        breed: originalData.breed || '',
        gender: originalData.gender || '',
        birthDate: originalData.birthDate ? originalData.birthDate.split('T')[0] : '',
        weight: originalData.weight ? originalData.weight.toString() : '',
        color: originalData.color || '',
        motherTagNumber: originalData.motherTagNumber || '',
        fatherTagNumber: originalData.fatherTagNumber || '',
        healthStatus: originalData.healthStatus || 'healthy',
        notes: originalData.notes || ''
      };

      const hasFormChanges = JSON.stringify(currentFormData) !== JSON.stringify(originalFormData);
      const hasImageChanges = imageFile !== null;
      const hasLocationChanges = locationData.latitude !== originalData.latitude || 
                                locationData.longitude !== originalData.longitude;

      setHasChanges(hasFormChanges || hasImageChanges || hasLocationChanges);
    }
  }, [formData, originalData, imageFile, locationData]);

  // Obtener datos del bovino
  const fetchBovineData = async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch(`/api/bovines/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOriginalData(data);
        
        // Prellenar formulario con datos existentes
        setFormData({
          tagNumber: data.tagNumber || '',
          name: data.name || '',
          breed: data.breed || '',
          gender: data.gender || '',
          birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
          weight: data.weight ? data.weight.toString() : '',
          color: data.color || '',
          motherTagNumber: data.motherTagNumber || '',
          fatherTagNumber: data.fatherTagNumber || '',
          healthStatus: data.healthStatus || 'healthy',
          notes: data.notes || ''
        });

        // Configurar datos de ubicación existentes
        if (data.latitude && data.longitude) {
          setLocationData({
            latitude: data.latitude,
            longitude: data.longitude,
            address: data.address || `${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}`,
            isLoading: false,
            error: null
          });
        }

        // Configurar imagen existente
        if (data.image) {
          setCurrentImage(data.image);
        }

      } else if (response.status === 404) {
        setErrors({ general: 'Bovine not found' });
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.message || 'Failed to load bovine data' });
      }
    } catch (error) {
      console.error('Fetch bovine error:', error);
      setErrors({ general: 'Connection error. Please try again.' });
    } finally {
      setIsLoadingData(false);
    }
  };

  // Obtener nueva ubicación
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
          // Obtener dirección usando reverse geocoding
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
          );
          
          let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          
          if (response.ok) {
            const data = await response.json();
            if (data.results && data.results[0]) {
              address = data.results[0].formatted;
            }
          }

          setLocationData({
            latitude,
            longitude,
            address,
            isLoading: false,
            error: null
          });
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
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Manejar carga de nueva imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }));
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }));
        return;
      }

      setImageFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Limpiar error de imagen
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  // Remover nueva imagen
  const removeNewImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Remover imagen actual
  const removeCurrentImage = () => {
    setCurrentImage(null);
  };

  // Validar paso 1 (información básica)
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.tagNumber.trim()) {
      newErrors.tagNumber = 'Tag number is required';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.breed) {
      newErrors.breed = 'Breed is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar paso 2 (detalles adicionales)
  const validateStep2 = () => {
    const newErrors = {};
    
    if (formData.weight && (isNaN(formData.weight) || formData.weight <= 0)) {
      newErrors.weight = 'Weight must be a positive number';
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
      // Crear FormData para enviar archivo e información
      const submitData = new FormData();
      
      // Agregar datos del formulario
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
      
      // Agregar datos de ubicación
      if (locationData.latitude && locationData.longitude) {
        submitData.append('latitude', locationData.latitude);
        submitData.append('longitude', locationData.longitude);
        submitData.append('address', locationData.address);
      }
      
      // Agregar nueva imagen si existe
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      
      // Indicar si se debe remover la imagen actual
      if (!currentImage && !imageFile) {
        submitData.append('removeImage', 'true');
      }
      
      // Llamada a la API
      const response = await fetch(`/api/bovines/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: submitData
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Bovine updated successfully:', data);
        
        // Redirigir a los detalles del bovino
        navigate(`/bovines/${id}`, { 
          state: { 
            message: 'Bovine updated successfully!' 
          }
        });
      } else {
        const errorData = await response.json();
        setErrors({ 
          general: errorData.message || 'Failed to update bovine' 
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

  // Mostrar loading mientras carga datos
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading bovine data...</p>
        </motion.div>
      </div>
    );
  }

  // Mostrar error si no se pueden cargar los datos
  if (errors.general && !originalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md mx-4"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Bovine</h2>
          <p className="text-gray-600 mb-4">{errors.general}</p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={fetchBovineData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/bovines"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to List
            </Link>
          </div>
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
                to={`/bovines/${id}`}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Details
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Edit {originalData?.name} ({originalData?.tagNumber})
              </h1>
            </div>
            
            {/* Indicador de cambios */}
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm"
              >
                <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                Unsaved changes
              </motion.div>
            )}
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
                <span className="text-sm font-medium">Basic Info</span>
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
                <span className="text-sm font-medium">Additional Details</span>
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
              {errors.general && originalData && (
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
                    <Cow className="w-6 h-6 text-green-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tag Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tag Number *
                      </label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="tagNumber"
                          value={formData.tagNumber}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                            errors.tagNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Enter tag number"
                        />
                      </div>
                      {errors.tagNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.tagNumber}</p>
                      )}
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter bovine name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Breed */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Breed *
                      </label>
                      <select
                        name="breed"
                        value={formData.breed}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                          errors.breed ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select breed</option>
                        {breeds.map(breed => (
                          <option key={breed} value={breed}>{breed}</option>
                        ))}
                      </select>
                      {errors.breed && (
                        <p className="text-red-500 text-sm mt-1">{errors.breed}</p>
                      )}
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                          errors.gender ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="steer">Steer</option>
                      </select>
                      {errors.gender && (
                        <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                      )}
                    </div>

                    {/* Birth Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Birth Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                            errors.birthDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.birthDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
                      )}
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <select
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select color</option>
                        {colors.map(color => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Location Display/Update */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Registration Location
                      </label>
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={locationData.isLoading}
                        className="flex items-center text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        <RefreshCw className={`w-4 h-4 mr-1 ${locationData.isLoading ? 'animate-spin' : ''}`} />
                        Update Location
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          {locationData.isLoading ? (
                            <p className="text-gray-600 text-sm">Getting your location...</p>
                          ) : locationData.error ? (
                            <div>
                              <p className="text-red-600 text-sm">{locationData.error}</p>
                              <button
                                type="button"
                                onClick={getCurrentLocation}
                                className="text-green-600 hover:text-green-700 text-sm font-medium mt-1"
                              >
                                Try again
                              </button>
                            </div>
                          ) : locationData.latitude && locationData.longitude ? (
                            <div>
                              <p className="text-gray-900 text-sm font-medium">{locationData.address}</p>
                              <p className="text-gray-500 text-xs mt-1">
                                Lat: {locationData.latitude?.toFixed(6)}, 
                                Lng: {locationData.longitude?.toFixed(6)}
                              </p>
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No location data</p>
                          )}
                        </div>
                      </div>
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

              {/* Paso 2: Detalles Adicionales */}
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
                    <Scale className="w-6 h-6 text-green-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Additional Details</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Weight */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (kg)
                      </label>
                      <div className="relative">
                        <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                            errors.weight ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Enter weight"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      {errors.weight && (
                        <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
                      )}
                    </div>

                    {/* Mother Tag Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mother Tag Number
                      </label>
                      <input
                        type="text"
                        name="motherTagNumber"
                        value={formData.motherTagNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter mother's tag number"
                      />
                    </div>

                    {/* Father Tag Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Father Tag Number
                      </label>
                      <input
                        type="text"
                        name="fatherTagNumber"
                        value={formData.fatherTagNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter father's tag number"
                      />
                    </div>

                    {/* Health Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Health Status
                      </label>
                      <select
                        name="healthStatus"
                        value={formData.healthStatus}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="healthy">Healthy</option>
                        <option value="sick">Sick</option>
                        <option value="injured">Injured</option>
                        <option value="pregnant">Pregnant</option>
                        <option value="lactating">Lactating</option>
                      </select>
                    </div>
                  </div>

                  {/* Photo Management */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo
                    </label>
                    
                    <div className="space-y-4">
                      {/* Current Image */}
                      {currentImage && (
                        <div className="relative">
                          <p className="text-sm text-gray-600 mb-2">Current photo:</p>
                          <div className="relative inline-block">
                            <img
                              src={currentImage}
                              alt="Current bovine"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={removeCurrentImage}
                              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* New Image Upload */}
                      {!imagePreview ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 text-sm mb-2">
                              {currentImage ? 'Upload new photo' : 'Click to upload a photo'}
                            </p>
                            <p className="text-gray-400 text-xs">PNG, JPG, GIF up to 5MB</p>
                          </label>
                        </div>
                      ) : (
                        <div className="relative">
                          <p className="text-sm text-gray-600 mb-2">New photo:</p>
                          <div className="relative inline-block">
                            <img
                              src={imagePreview}
                              alt="New bovine preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={removeNewImage}
                              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {errors.image && (
                      <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Add any additional notes about this bovine..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between mt-8">
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
                      disabled={isLoading || !hasChanges}
                      whileHover={!isLoading && hasChanges ? { scale: 1.02 } : {}}
                      whileTap={!isLoading && hasChanges ? { scale: 0.98 } : {}}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                        isLoading
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : !hasChanges
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Updating Bovine...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          {hasChanges ? 'Save Changes' : 'No Changes'}
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
    </div>
  );
};

export default BovineEdit;