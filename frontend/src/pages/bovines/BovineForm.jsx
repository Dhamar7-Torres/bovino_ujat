// src/pages/bovines/BovineForm.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Save,
  ArrowLeft,
  Upload,
  MapPin,
  Calendar,
  Weight,
  User,
  Heart,
  AlertCircle,
  X,
  Camera,
  Plus
} from 'lucide-react'
import toast from 'react-hot-toast'

// Formulario para agregar o editar bovinos
const BovineForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Información básica
    earTag: '',
    name: '',
    breed: '',
    gender: '',
    birthDate: '',
    weight: '',
    color: '',
    
    // Información de salud
    healthStatus: 'Saludable',
    lastCheckup: '',
    veterinarian: '',
    vaccinations: [],
    
    // Información reproductiva
    lactating: false,
    pregnant: false,
    lastCalving: '',
    expectedCalving: '',
    
    // Ubicación
    currentLocation: '',
    paddock: '',
    latitude: '',
    longitude: '',
    
    // Información adicional
    motherId: '',
    fatherId: '',
    acquisitionDate: '',
    acquisitionType: 'Nacimiento',
    price: '',
    notes: '',
    
    // Archivos
    photos: [],
    documents: []
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  // Opciones para los campos select
  const breedOptions = [
    'Holstein', 'Jersey', 'Angus', 'Brahman', 'Charolais', 
    'Hereford', 'Simmental', 'Limousin', 'Gyr', 'Nelore',
    'Criollo', 'Mestizo', 'Otro'
  ]

  const colorOptions = [
    'Negro', 'Blanco', 'Marrón', 'Rojizo', 'Pinto', 
    'Hosco', 'Bayo', 'Gris', 'Amarillo', 'Mixto'
  ]

  const healthStatusOptions = [
    'Saludable', 'En Tratamiento', 'Enfermo', 'En Observación', 'Recuperándose'
  ]

  const acquisitionTypeOptions = [
    'Nacimiento', 'Compra', 'Donación', 'Intercambio', 'Herencia'
  ]

  // Cargar datos si es edición
  useEffect(() => {
    if (isEditing) {
      // Simular carga de datos del bovino
      setIsLoading(true)
      setTimeout(() => {
        // Datos de ejemplo para edición
        setFormData({
          ...formData,
          earTag: 'BOV-001',
          name: 'Esperanza',
          breed: 'Holstein',
          gender: 'Hembra',
          birthDate: '2022-03-15',
          weight: '420',
          color: 'Blanco',
          healthStatus: 'Saludable',
          currentLocation: 'Potrero A-1',
          lactating: true,
          pregnant: false
        })
        setIsLoading(false)
      }, 1000)
    }
  }, [isEditing])

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Limpiar errores
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    // Validaciones básicas
    if (!formData.earTag.trim()) newErrors.earTag = 'El arete es requerido'
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!formData.breed) newErrors.breed = 'La raza es requerida'
    if (!formData.gender) newErrors.gender = 'El género es requerido'
    if (!formData.birthDate) newErrors.birthDate = 'La fecha de nacimiento es requerida'
    if (!formData.weight || formData.weight <= 0) newErrors.weight = 'El peso debe ser mayor a 0'

    // Validaciones de fechas
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate)
      const today = new Date()
      if (birthDate > today) {
        newErrors.birthDate = 'La fecha de nacimiento no puede ser futura'
      }
    }

    if (formData.expectedCalving && formData.lastCalving) {
      const lastCalving = new Date(formData.lastCalving)
      const expectedCalving = new Date(formData.expectedCalving)
      if (expectedCalving <= lastCalving) {
        newErrors.expectedCalving = 'La fecha esperada debe ser posterior al último parto'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Obtener ubicación actual
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }))
          toast.success('Ubicación obtenida correctamente')
        },
        (error) => {
          toast.error('Error al obtener ubicación: ' + error.message)
        }
      )
    } else {
      toast.error('Geolocalización no soportada por este navegador')
    }
  }

  // Manejar subida de archivos
  const handleFileUpload = (files, type) => {
    const fileArray = Array.from(files)
    
    if (type === 'photos') {
      // Validar que sean imágenes
      const validFiles = fileArray.filter(file => file.type.startsWith('image/'))
      if (validFiles.length !== fileArray.length) {
        toast.error('Solo se permiten archivos de imagen')
        return
      }
      
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...validFiles]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...fileArray]
      }))
    }
  }

  // Remover archivo
  const removeFile = (index, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario')
      return
    }

    setIsLoading(true)

    try {
      // Simular envío al servidor
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(isEditing ? 'Bovino actualizado exitosamente' : 'Bovino registrado exitosamente')
      navigate('/bovines')
    } catch (error) {
      toast.error('Error al guardar: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Pestañas del formulario
  const tabs = [
    { id: 'basic', label: 'Información Básica', icon: <User className="w-4 h-4" /> },
    { id: 'health', label: 'Salud', icon: <Heart className="w-4 h-4" /> },
    { id: 'reproduction', label: 'Reproducción', icon: <Calendar className="w-4 h-4" /> },
    { id: 'location', label: 'Ubicación', icon: <MapPin className="w-4 h-4" /> },
    { id: 'additional', label: 'Adicional', icon: <Plus className="w-4 h-4" /> }
  ]

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (isLoading && isEditing) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/bovines')}
            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Editar Bovino' : 'Registrar Nuevo Bovino'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEditing ? 'Modifica la información del bovino' : 'Completa la información del nuevo bovino'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Formulario */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        variants={itemVariants}
      >
        {/* Pestañas */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Información Básica */}
          {activeTab === 'basic' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Arete */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Arete / Identificación *
                  </label>
                  <input
                    type="text"
                    name="earTag"
                    value={formData.earTag}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.earTag ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="BOV-001"
                  />
                  {errors.earTag && (
                    <p className="text-red-500 text-sm mt-1">{errors.earTag}</p>
                  )}
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Esperanza"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Raza */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Raza *
                  </label>
                  <select
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.breed ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Seleccionar raza</option>
                    {breedOptions.map((breed) => (
                      <option key={breed} value={breed}>{breed}</option>
                    ))}
                  </select>
                  {errors.breed && (
                    <p className="text-red-500 text-sm mt-1">{errors.breed}</p>
                  )}
                </div>

                {/* Género */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Género *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.gender ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Seleccionar género</option>
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                  )}
                </div>

                {/* Fecha de nacimiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.birthDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.birthDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
                  )}
                </div>

                {/* Peso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Peso (kg) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.weight ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="420"
                    min="0"
                    step="0.1"
                  />
                  {errors.weight && (
                    <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
                  )}
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Seleccionar color</option>
                    {colorOptions.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                {/* Madre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ID Madre
                  </label>
                  <input
                    type="text"
                    name="motherId"
                    value={formData.motherId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="BOV-XXX"
                  />
                </div>

                {/* Padre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ID Padre
                  </label>
                  <input
                    type="text"
                    name="fatherId"
                    value={formData.fatherId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="BOV-XXX"
                  />
                </div>
              </div>

              {/* Subida de fotos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fotografías
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Arrastra las fotos aquí o haz clic para seleccionar
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files, 'photos')}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Seleccionar Fotos
                    </label>
                  </div>
                  
                  {/* Preview de fotos */}
                  {formData.photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.photos.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index, 'photos')}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Información de Salud */}
          {activeTab === 'health' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Estado de salud */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado de Salud
                  </label>
                  <select
                    name="healthStatus"
                    value={formData.healthStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {healthStatusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Último chequeo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Último Chequeo
                  </label>
                  <input
                    type="date"
                    name="lastCheckup"
                    value={formData.lastCheckup}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Veterinario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Veterinario
                  </label>
                  <input
                    type="text"
                    name="veterinarian"
                    value={formData.veterinarian}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Dr. Juan Pérez"
                  />
                </div>
              </div>

              {/* Notas de salud */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notas de Salud
                </label>
                <textarea
                  name="healthNotes"
                  value={formData.healthNotes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Observaciones sobre la salud del bovino..."
                />
              </div>
            </motion.div>
          )}

          {/* Información Reproductiva */}
          {activeTab === 'reproduction' && formData.gender === 'Hembra' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Estados reproductivos */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="lactating"
                      checked={formData.lactating}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      En Lactancia
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="pregnant"
                      checked={formData.pregnant}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Preñada
                    </label>
                  </div>
                </div>

                {/* Fechas reproductivas */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Último Parto
                    </label>
                    <input
                      type="date"
                      name="lastCalving"
                      value={formData.lastCalving}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {formData.pregnant && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Parto Esperado
                      </label>
                      <input
                        type="date"
                        name="expectedCalving"
                        value={formData.expectedCalving}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                          errors.expectedCalving ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.expectedCalving && (
                        <p className="text-red-500 text-sm mt-1">{errors.expectedCalving}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Información de Ubicación */}
          {activeTab === 'location' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ubicación actual */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ubicación Actual
                  </label>
                  <input
                    type="text"
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Potrero A-1"
                  />
                </div>

                {/* Potrero */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Potrero
                  </label>
                  <input
                    type="text"
                    name="paddock"
                    value={formData.paddock}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="A-1"
                  />
                </div>

                {/* Coordenadas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Latitud
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="20.5888"
                    step="any"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Longitud
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="-100.3899"
                    step="any"
                  />
                </div>
              </div>

              {/* Botón para obtener ubicación */}
              <div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Obtener Ubicación Actual</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Información Adicional */}
          {activeTab === 'additional' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Fecha de adquisición */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha de Adquisición
                  </label>
                  <input
                    type="date"
                    name="acquisitionDate"
                    value={formData.acquisitionDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Tipo de adquisición */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Adquisición
                  </label>
                  <select
                    name="acquisitionType"
                    value={formData.acquisitionType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {acquisitionTypeOptions.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Precio (MXN)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="15000"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Información adicional sobre el bovino..."
                />
              </div>

              {/* Documentos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Documentos
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Certificados, contratos, etc.
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e.target.files, 'documents')}
                      className="hidden"
                      id="document-upload"
                    />
                    <label
                      htmlFor="document-upload"
                      className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Seleccionar Documentos
                    </label>
                  </div>
                  
                  {/* Lista de documentos */}
                  {formData.documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.documents.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index, 'documents')}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Botones de acción */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/bovines')}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Actualizar' : 'Guardar'} Bovino</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default BovineForm