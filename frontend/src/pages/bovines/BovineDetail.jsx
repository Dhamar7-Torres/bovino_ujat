// src/pages/bovines/BovineDetail.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Edit,
  Heart,
  MapPin,
  Calendar,
  Weight,
  Activity,
  Camera,
  FileText,
  Baby,
  Milk,
  Syringe,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Download,
  Share,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

// Página de detalle de bovino
const BovineDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [bovine, setBovine] = useState(null)
  const [activeTab, setActiveTab] = useState('general')
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Datos de ejemplo del bovino
  const sampleBovine = {
    id: 1,
    earTag: 'BOV-001',
    name: 'Esperanza',
    breed: 'Holstein',
    gender: 'Hembra',
    birthDate: '2022-03-15',
    weight: 420,
    color: 'Blanco',
    healthStatus: 'Saludable',
    lastCheckup: '2024-06-15',
    veterinarian: 'Dr. Juan Pérez',
    
    // Ubicación
    currentLocation: 'Potrero A-1',
    paddock: 'A-1',
    latitude: 20.5888,
    longitude: -100.3899,
    
    // Información reproductiva
    lactating: true,
    pregnant: false,
    lastCalving: '2023-08-15',
    expectedCalving: null,
    totalCalvings: 2,
    
    // Información adicional
    motherId: 'BOV-025',
    fatherId: 'BOV-050',
    acquisitionDate: '2022-03-15',
    acquisitionType: 'Nacimiento',
    price: 0,
    
    // Historial de salud
    healthHistory: [
      {
        id: 1,
        date: '2024-06-15',
        type: 'Chequeo General',
        veterinarian: 'Dr. Juan Pérez',
        notes: 'Bovino en excelente estado de salud',
        status: 'Completado'
      },
      {
        id: 2,
        date: '2024-05-01',
        type: 'Vacunación',
        vaccine: 'Brucelosis',
        veterinarian: 'Dr. Juan Pérez',
        status: 'Completado'
      },
      {
        id: 3,
        date: '2024-03-20',
        type: 'Desparasitación',
        medication: 'Ivermectina',
        veterinarian: 'Dr. Juan Pérez',
        status: 'Completado'
      }
    ],
    
    // Historial reproductivo
    reproductionHistory: [
      {
        id: 1,
        type: 'Parto',
        date: '2023-08-15',
        calfId: 'BOV-123',
        complications: 'Ninguna',
        notes: 'Parto normal, cría saludable'
      },
      {
        id: 2,
        type: 'Inseminación',
        date: '2023-11-20',
        bullId: 'BOV-055',
        success: false,
        notes: 'Inseminación no exitosa'
      },
      {
        id: 3,
        type: 'Parto',
        date: '2022-10-10',
        calfId: 'BOV-098',
        complications: 'Menor',
        notes: 'Parto con asistencia veterinaria'
      }
    ],
    
    // Producción de leche
    milkProduction: [
      { date: '2024-06-20', morning: 12.5, afternoon: 10.2, total: 22.7 },
      { date: '2024-06-19', morning: 13.1, afternoon: 9.8, total: 22.9 },
      { date: '2024-06-18', morning: 12.8, afternoon: 10.5, total: 23.3 },
      { date: '2024-06-17', morning: 12.2, afternoon: 10.8, total: 23.0 },
      { date: '2024-06-16', morning: 13.0, afternoon: 9.9, total: 22.9 }
    ],
    
    // Fotos
    photos: [
      'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=400',
      'https://images.unsplash.com/photo-1573160103600-9f251bfd23f8?w=400',
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400'
    ],
    
    // Documentos
    documents: [
      { name: 'Certificado de Nacimiento.pdf', size: '1.2 MB', type: 'pdf' },
      { name: 'Registro Genealógico.pdf', size: '890 KB', type: 'pdf' },
      { name: 'Historial Sanitario.xlsx', size: '450 KB', type: 'excel' }
    ],
    
    notes: 'Excelente productora de leche. Carácter dócil y fácil manejo. Madre ejemplar.'
  }

  // Cargar datos del bovino
  useEffect(() => {
    const timer = setTimeout(() => {
      setBovine(sampleBovine)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [id])

  // Calcular edad
  const calculateAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth()
    
    if (ageInMonths < 12) {
      return `${ageInMonths} meses`
    } else {
      const years = Math.floor(ageInMonths / 12)
      const months = ageInMonths % 12
      return months > 0 ? `${years} años, ${months} meses` : `${years} años`
    }
  }

  // Función para obtener el color del estado de salud
  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'Saludable':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'En Tratamiento':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'Enfermo':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  // Eliminar bovino
  const handleDelete = async () => {
    try {
      // Simular eliminación
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Bovino eliminado exitosamente')
      navigate('/bovines')
    } catch (error) {
      toast.error('Error al eliminar bovino')
    }
  }

  // Pestañas
  const tabs = [
    { id: 'general', label: 'General', icon: <Activity className="w-4 h-4" /> },
    { id: 'health', label: 'Salud', icon: <Heart className="w-4 h-4" /> },
    { id: 'reproduction', label: 'Reproducción', icon: <Baby className="w-4 h-4" /> },
    { id: 'production', label: 'Producción', icon: <Milk className="w-4 h-4" /> },
    { id: 'files', label: 'Archivos', icon: <FileText className="w-4 h-4" /> }
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!bovine) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Bovino no encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            El bovino que buscas no existe o ha sido eliminado.
          </p>
          <Link
            to="/bovines"
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la Lista
          </Link>
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
              {bovine.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {bovine.earTag} • {bovine.breed} • {bovine.gender}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Share className="w-5 h-5" />
          </button>
          
          <Link
            to={`/bovines/${bovine.id}/edit`}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </Link>

          <div className="relative">
            <button className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Información principal */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        variants={itemVariants}
      >
        {/* Header con foto */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6">
              {/* Foto principal */}
              <div className="w-24 h-24 bg-white rounded-full overflow-hidden shadow-lg">
                {bovine.photos && bovine.photos.length > 0 ? (
                  <img
                    src={bovine.photos[0]}
                    alt={bovine.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Camera className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Información básica */}
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-2">{bovine.name}</h2>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center space-x-2">
                    <span className="opacity-75">Arete:</span>
                    <span className="font-medium">{bovine.earTag}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="opacity-75">Edad:</span>
                    <span className="font-medium">{calculateAge(bovine.birthDate)}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="opacity-75">Peso:</span>
                    <span className="font-medium">{bovine.weight} kg</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Estados */}
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthStatusColor(bovine.healthStatus)}`}>
                {bovine.healthStatus}
              </span>
              {bovine.lactating && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm font-medium">
                  En Lactancia
                </span>
              )}
              {bovine.pregnant && (
                <span className="px-3 py-1 bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400 rounded-full text-sm font-medium">
                  Preñada
                </span>
              )}
            </div>
          </div>
        </div>

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

        {/* Contenido de pestañas */}
        <div className="p-6">
          {/* Información General */}
          {activeTab === 'general' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Información básica */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Información Básica
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Raza:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{bovine.breed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Color:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{bovine.color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Nacimiento:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(bovine.birthDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Adquisición:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{bovine.acquisitionType}</span>
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Ubicación
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Ubicación:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{bovine.currentLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Potrero:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{bovine.paddock}</span>
                    </div>
                    {bovine.latitude && bovine.longitude && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Latitud:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{bovine.latitude.toFixed(6)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Longitud:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{bovine.longitude.toFixed(6)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Genealogía */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Genealogía
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Madre:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {bovine.motherId ? (
                          <Link to={`/bovines/${bovine.motherId}`} className="text-blue-600 hover:text-blue-700">
                            {bovine.motherId}
                          </Link>
                        ) : (
                          'No registrada'
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Padre:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {bovine.fatherId ? (
                          <Link to={`/bovines/${bovine.fatherId}`} className="text-blue-600 hover:text-blue-700">
                            {bovine.fatherId}
                          </Link>
                        ) : (
                          'No registrado'
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Partos totales:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{bovine.totalCalvings || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {bovine.notes && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Notas
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">{bovine.notes}</p>
                </div>
              )}

              {/* Galería de fotos */}
              {bovine.photos && bovine.photos.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Galería de Fotos
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {bovine.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <img
                          src={photo}
                          alt={`${bovine.name} ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Historial de Salud */}
          {activeTab === 'health' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Estado actual */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400">Estado Actual</p>
                      <p className="text-lg font-semibold text-green-800 dark:text-green-300">
                        {bovine.healthStatus}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Último Chequeo</p>
                      <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                        {new Date(bovine.lastCheckup).toLocaleDateString()}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Veterinario</p>
                      <p className="text-lg font-semibold text-purple-800 dark:text-purple-300">
                        {bovine.veterinarian}
                      </p>
                    </div>
                    <Syringe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Historial */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Historial de Salud
                </h3>
                <div className="space-y-4">
                  {bovine.healthHistory.map((record) => (
                    <div
                      key={record.id}
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {record.type}
                            </span>
                            {record.vaccine && (
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                ({record.vaccine})
                              </span>
                            )}
                            {record.medication && (
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                ({record.medication})
                              </span>
                            )}
                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">
                              {record.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {new Date(record.date).toLocaleDateString()} • {record.veterinarian}
                          </p>
                          {record.notes && (
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {record.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Historial Reproductivo */}
          {activeTab === 'reproduction' && bovine.gender === 'Hembra' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Estado actual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Estado Reproductivo
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${bovine.lactating ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                      <span className="text-sm">En Lactancia: {bovine.lactating ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${bovine.pregnant ? 'bg-pink-500' : 'bg-gray-300'}`}></span>
                      <span className="text-sm">Preñada: {bovine.pregnant ? 'Sí' : 'No'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Estadísticas
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total de partos:</span>
                      <span className="font-medium">{bovine.totalCalvings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Último parto:</span>
                      <span className="font-medium">
                        {bovine.lastCalving ? new Date(bovine.lastCalving).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    {bovine.expectedCalving && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Parto esperado:</span>
                        <span className="font-medium">
                          {new Date(bovine.expectedCalving).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Historial */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Historial Reproductivo
                </h3>
                <div className="space-y-4">
                  {bovine.reproductionHistory.map((record) => (
                    <div
                      key={record.id}
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {record.type}
                            </span>
                            {record.calfId && (
                              <Link
                                to={`/bovines/${record.calfId}`}
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                Cría: {record.calfId}
                              </Link>
                            )}
                            {record.bullId && (
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Toro: {record.bullId}
                              </span>
                            )}
                            {record.success === false && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs">
                                No Exitoso
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                          {record.complications && record.complications !== 'Ninguna' && (
                            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">
                              Complicaciones: {record.complications}
                            </p>
                          )}
                          {record.notes && (
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {record.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Producción de Leche */}
          {activeTab === 'production' && bovine.lactating && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Estadísticas de producción */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Promedio Diario</p>
                      <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                        {(bovine.milkProduction.reduce((sum, day) => sum + day.total, 0) / bovine.milkProduction.length).toFixed(1)} L
                      </p>
                    </div>
                    <Milk className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400">Última Producción</p>
                      <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                        {bovine.milkProduction[0].total} L
                      </p>
                    </div>
                    <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Total Semanal</p>
                      <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                        {bovine.milkProduction.reduce((sum, day) => sum + day.total, 0).toFixed(1)} L
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Tabla de producción */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Registro de Producción (Últimos 5 días)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                          Fecha
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                          Mañana (L)
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                          Tarde (L)
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                          Total (L)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {bovine.milkProduction.map((day, index) => (
                        <tr key={index} className="bg-white dark:bg-gray-800">
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {new Date(day.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {day.morning}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {day.afternoon}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                            {day.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Archivos */}
          {activeTab === 'files' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Documentos */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Documentos
                </h3>
                <div className="space-y-3">
                  {bovine.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {doc.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {doc.size}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fotos adicionales */}
              {bovine.photos && bovine.photos.length > 1 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Galería Completa
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {bovine.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <img
                          src={photo}
                          alt={`${bovine.name} ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                          <button className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-full shadow-lg transition-opacity">
                            <Download className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Eliminar Bovino
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              ¿Estás seguro de que deseas eliminar a <strong>{bovine.name}</strong>? 
              Se perderán todos los registros asociados.
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default BovineDetail