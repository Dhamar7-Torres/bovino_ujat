// Frontend/src/pages/inventory/InventoryAdd.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  MapPin,
  Calendar,
  Package,
  Pills,
  Syringe,
  Shield,
  Heart,
  Activity,
  Zap,
  Building,
  User,
  DollarSign,
  Hash,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  X,
  QrCode,
  Barcode,
  Camera,
  Upload,
  Info,
  Clock,
  Target,
  Star,
  Award,
  Clipboard,
  Settings,
  FileText,
  Search,
  Plus,
  Archive
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const InventoryAdd = () => {
  // Estados para manejar el formulario y la UI
  const [formData, setFormData] = useState({
    // Información básica
    name: '',
    commercialName: '',
    activeIngredient: '',
    category: '',
    manufacturer: '',
    supplier: '',
    
    // Presentación y dosificación
    presentation: '',
    dosageForm: '',
    strength: '',
    unitOfMeasure: 'ml',
    
    // Stock y cantidades
    initialStock: '',
    minimumStock: '',
    maximumStock: '',
    unitCost: '',
    
    // Lote y vencimiento
    batchNumber: '',
    manufacturingDate: '',
    expiryDate: '',
    
    // Ubicación y almacenamiento
    location: '',
    storageConditions: '',
    temperature: '',
    humidity: '',
    
    // Información adicional
    barcode: '',
    requiresPrescription: false,
    notes: '',
    tags: []
  });

  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    address: '',
    isLoading: false,
    error: null
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  // Categorías disponibles con sus iconos
  const categories = [
    { id: 'antibiotics', name: 'Antibiotics', icon: Pills, color: 'bg-blue-500' },
    { id: 'vaccines', name: 'Vaccines', icon: Syringe, color: 'bg-purple-500' },
    { id: 'vitamins', name: 'Vitamins & Supplements', icon: Heart, color: 'bg-green-500' },
    { id: 'anti-inflammatory', name: 'Anti-inflammatory', icon: Shield, color: 'bg-red-500' },
    { id: 'antiparasitic', name: 'Antiparasitic', icon: Target, color: 'bg-yellow-500' },
    { id: 'wound-care', name: 'Wound Care', icon: Activity, color: 'bg-orange-500' },
    { id: 'metabolic-support', name: 'Metabolic Support', icon: Zap, color: 'bg-indigo-500' },
    { id: 'diagnostic', name: 'Diagnostic Tools', icon: Search, color: 'bg-teal-500' },
    { id: 'surgical', name: 'Surgical Supplies', icon: Archive, color: 'bg-gray-500' },
    { id: 'equipment', name: 'Medical Equipment', icon: Settings, color: 'bg-cyan-500' }
  ];

  // Formas de dosificación comunes
  const dosageForms = [
    'Injectable solution',
    'Oral tablet',
    'Oral suspension',
    'Topical cream',
    'Topical solution',
    'Injectable suspension',
    'Powder for injection',
    'Capsule',
    'Ointment',
    'Spray',
    'Implant',
    'Bolus'
  ];

  // Ubicaciones de almacenamiento
  const storageLocations = [
    'Medical Storage Room A',
    'Medical Storage Room B',
    'Main Pharmacy',
    'Treatment Center',
    'Cold Storage Unit 1',
    'Cold Storage Unit 2',
    'Emergency Supplies',
    'Quarantine Storage',
    'Equipment Storage',
    'Surgical Supplies Room'
  ];

  // Proveedores comunes
  const suppliers = [
    'VetMed Supplies',
    'Animal Health Direct',
    'Medical Supplies Plus',
    'Vaccine Supply Chain',
    'Emergency Med Supply',
    'Pharmaceutical Depot',
    'Livestock Health Co',
    'Veterinary Solutions',
    'AgriMed Distributors',
    'Bio-Pharma Vet'
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

  // Obtener geolocalización al cargar el componente
  useEffect(() => {
    getCurrentLocation();
  }, []);

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

  // Manejar carga de imagen
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

  // Remover imagen
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Validar paso 1 (información básica)
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Medicine name is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'Manufacturer is required';
    }

    if (!formData.activeIngredient.trim()) {
      newErrors.activeIngredient = 'Active ingredient is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar paso 2 (stock y costos)
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.initialStock || formData.initialStock <= 0) {
      newErrors.initialStock = 'Initial stock must be greater than 0';
    }
    
    if (!formData.minimumStock || formData.minimumStock < 0) {
      newErrors.minimumStock = 'Minimum stock is required';
    }

    if (!formData.maximumStock || formData.maximumStock <= 0) {
      newErrors.maximumStock = 'Maximum stock must be greater than 0';
    }

    if (formData.minimumStock && formData.maximumStock && 
        parseInt(formData.minimumStock) >= parseInt(formData.maximumStock)) {
      newErrors.maximumStock = 'Maximum stock must be greater than minimum stock';
    }
    
    if (!formData.unitCost || formData.unitCost <= 0) {
      newErrors.unitCost = 'Unit cost must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar paso 3 (lote y ubicación)
  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.batchNumber.trim()) {
      newErrors.batchNumber = 'Batch number is required';
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const today = new Date();
      const expiryDate = new Date(formData.expiryDate);
      if (expiryDate <= today) {
        newErrors.expiryDate = 'Expiry date must be in the future';
      }
    }
    
    if (!formData.location) {
      newErrors.location = 'Storage location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Avanzar al siguiente paso
  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  // Retroceder al paso anterior
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    setIsLoading(true);
    
    try {
      // Crear FormData para enviar archivo e información
      const submitData = new FormData();
      
      // Agregar datos del formulario
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Calcular valor total
      const totalValue = parseFloat(formData.initialStock) * parseFloat(formData.unitCost);
      submitData.append('totalValue', totalValue);
      
      // Agregar datos de ubicación
      if (locationData.latitude && locationData.longitude) {
        submitData.append('latitude', locationData.latitude);
        submitData.append('longitude', locationData.longitude);
        submitData.append('address', locationData.address);
      }
      
      // Agregar imagen si existe
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      
      // Llamada a la API
      const response = await fetch('/api/inventory/medicines', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: submitData
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Medicine added successfully:', data);
        
        setShowSuccessModal(true);
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/inventory/medicines', {
            state: {
              message: 'Medicine added successfully to inventory!'
            }
          });
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrors({
          general: errorData.message || 'Failed to add medicine to inventory'
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

  // Generar código de barras automático
  const generateBarcode = () => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const barcode = `78923456${timestamp}${random}`;
    setFormData(prev => ({ ...prev, barcode }));
  };

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
                to="/inventory/medicines"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Inventory
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">Add New Medicine</h1>
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
                currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                <span className="text-sm font-medium">Basic Info</span>
              </div>
              <div className={`w-16 h-1 rounded transition-all duration-300 ${
                currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center space-x-2 ${
                currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium">Stock & Cost</span>
              </div>
              <div className={`w-16 h-1 rounded transition-all duration-300 ${
                currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center space-x-2 ${
                currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  3
                </div>
                <span className="text-sm font-medium">Batch & Location</span>
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
                    <Package className="w-6 h-6 text-blue-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Medicine Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medicine Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter medicine name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Commercial Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Commercial Name
                      </label>
                      <input
                        type="text"
                        name="commercialName"
                        value={formData.commercialName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter commercial name"
                      />
                    </div>

                    {/* Active Ingredient */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Active Ingredient *
                      </label>
                      <input
                        type="text"
                        name="activeIngredient"
                        value={formData.activeIngredient}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.activeIngredient ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter active ingredient"
                      />
                      {errors.activeIngredient && (
                        <p className="text-red-500 text-sm mt-1">{errors.activeIngredient}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                      )}
                    </div>

                    {/* Manufacturer */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manufacturer *
                      </label>
                      <input
                        type="text"
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.manufacturer ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter manufacturer"
                      />
                      {errors.manufacturer && (
                        <p className="text-red-500 text-sm mt-1">{errors.manufacturer}</p>
                      )}
                    </div>

                    {/* Supplier */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supplier
                      </label>
                      <select
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select supplier</option>
                        {suppliers.map(supplier => (
                          <option key={supplier} value={supplier}>
                            {supplier}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Presentation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Presentation
                      </label>
                      <input
                        type="text"
                        name="presentation"
                        value={formData.presentation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., 100ml vial, 50 tablets"
                      />
                    </div>

                    {/* Dosage Form */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dosage Form
                      </label>
                      <select
                        name="dosageForm"
                        value={formData.dosageForm}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select dosage form</option>
                        {dosageForms.map(form => (
                          <option key={form} value={form}>
                            {form}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Strength */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Strength/Concentration
                      </label>
                      <input
                        type="text"
                        name="strength"
                        value={formData.strength}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., 300,000 IU/ml, 10mg/ml"
                      />
                    </div>

                    {/* Unit of Measure */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit of Measure
                      </label>
                      <select
                        name="unitOfMeasure"
                        value={formData.unitOfMeasure}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="ml">Milliliters (ml)</option>
                        <option value="tablets">Tablets</option>
                        <option value="capsules">Capsules</option>
                        <option value="grams">Grams (g)</option>
                        <option value="units">Units</option>
                        <option value="vials">Vials</option>
                        <option value="bottles">Bottles</option>
                        <option value="boxes">Boxes</option>
                      </select>
                    </div>
                  </div>

                  {/* Prescription Required Checkbox */}
                  <div className="mt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="requiresPrescription"
                        checked={formData.requiresPrescription}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Requires prescription</span>
                    </label>
                  </div>

                  {/* Continue Button */}
                  <div className="flex justify-end mt-8">
                    <motion.button
                      type="button"
                      onClick={handleNextStep}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg"
                    >
                      Continue to Stock & Cost
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Paso 2: Stock y Costos */}
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
                    <DollarSign className="w-6 h-6 text-blue-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Stock & Cost Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Initial Stock */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Initial Stock *
                      </label>
                      <input
                        type="number"
                        name="initialStock"
                        value={formData.initialStock}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.initialStock ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter initial stock quantity"
                        min="1"
                      />
                      {errors.initialStock && (
                        <p className="text-red-500 text-sm mt-1">{errors.initialStock}</p>
                      )}
                    </div>

                    {/* Minimum Stock */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Stock Level *
                      </label>
                      <input
                        type="number"
                        name="minimumStock"
                        value={formData.minimumStock}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.minimumStock ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter minimum stock level"
                        min="0"
                      />
                      {errors.minimumStock && (
                        <p className="text-red-500 text-sm mt-1">{errors.minimumStock}</p>
                      )}
                    </div>

                    {/* Maximum Stock */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Stock Level *
                      </label>
                      <input
                        type="number"
                        name="maximumStock"
                        value={formData.maximumStock}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.maximumStock ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter maximum stock level"
                        min="1"
                      />
                      {errors.maximumStock && (
                        <p className="text-red-500 text-sm mt-1">{errors.maximumStock}</p>
                      )}
                    </div>

                    {/* Unit Cost */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Cost (USD) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          name="unitCost"
                          value={formData.unitCost}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            errors.unitCost ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="0.00"
                          min="0.01"
                          step="0.01"
                        />
                      </div>
                      {errors.unitCost && (
                        <p className="text-red-500 text-sm mt-1">{errors.unitCost}</p>
                      )}
                    </div>
                  </div>

                  {/* Calculated Total Value */}
                  {formData.initialStock && formData.unitCost && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">Total Initial Value:</span>
                        <span className="text-lg font-bold text-blue-900">
                          ${(parseFloat(formData.initialStock) * parseFloat(formData.unitCost)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

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
                      type="button"
                      onClick={handleNextStep}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg"
                    >
                      Continue to Batch & Location
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Paso 3: Lote y Ubicación */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-6"
                >
                  <div className="flex items-center mb-6">
                    <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Batch & Location Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Batch Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Batch Number *
                      </label>
                      <input
                        type="text"
                        name="batchNumber"
                        value={formData.batchNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.batchNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter batch number"
                      />
                      {errors.batchNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.batchNumber}</p>
                      )}
                    </div>

                    {/* Manufacturing Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manufacturing Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          name="manufacturingDate"
                          value={formData.manufacturingDate}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Expiry Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            errors.expiryDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.expiryDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                      )}
                    </div>

                    {/* Storage Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Storage Location *
                      </label>
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select storage location</option>
                        {storageLocations.map(location => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                      {errors.location && (
                        <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                      )}
                    </div>

                    {/* Storage Conditions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Storage Conditions
                      </label>
                      <input
                        type="text"
                        name="storageConditions"
                        value={formData.storageConditions}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Store at 2-8°C, protect from light"
                      />
                    </div>

                    {/* Temperature */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Storage Temperature
                      </label>
                      <div className="relative">
                        <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="temperature"
                          value={formData.temperature}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., 2-8°C, Room temperature"
                        />
                      </div>
                    </div>

                    {/* Barcode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Barcode
                      </label>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="barcode"
                            value={formData.barcode}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter or generate barcode"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={generateBarcode}
                          className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Location Display */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Location
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          {locationData.isLoading ? (
                            <p className="text-gray-600 text-sm">Getting your location...</p>
                          ) : locationData.error ? (
                            <div>
                              <p className="text-red-600 text-sm">{locationData.error}</p>
                              <button
                                type="button"
                                onClick={getCurrentLocation}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1"
                              >
                                Try again
                              </button>
                            </div>
                          ) : (
                            <div>
                              <p className="text-gray-900 text-sm font-medium">{locationData.address}</p>
                              <p className="text-gray-500 text-xs mt-1">
                                Lat: {locationData.latitude?.toFixed(6)},
                                Lng: {locationData.longitude?.toFixed(6)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Photo
                    </label>
                    
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
                          <p className="text-gray-600 text-sm mb-2">Click to upload a photo</p>
                          <p className="text-gray-400 text-xs">PNG, JPG, GIF up to 5MB</p>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Add any additional notes about this medicine..."
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
                      disabled={isLoading}
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                        isLoading
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Adding to Inventory...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Add to Inventory
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

      {/* Modal de éxito */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Medicine Added Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              {formData.name} has been added to your inventory.
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default InventoryAdd;