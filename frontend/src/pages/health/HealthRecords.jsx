// src/pages/health/HealthRecords.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Syringe,
  Pill,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Activity,
  User,
  MapPin,
  Eye,
  Edit,
  Download,
  MoreVertical
} from 'lucide-react'
import toast from 'react-hot-toast'

// Página de registros de salud
const HealthRecords = () => {
  const [records, setRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Datos de ejemplo
  const sampleRecords = [
    {
      id: 1,
      bovineId: 'BOV-001',
      bovineName: 'Esperanza',
      type: 'Vacunación',
      subtype: 'Brucelosis',
      date: '2024-06-20',
      veterinarian: 'Dr. Juan Pérez',
      status: 'Completado',
      priority: 'Alta',
      notes: 'Vacunación anual contra brucelosis aplicada correctamente.',
      nextDue: '2025-06-20',
      cost: 250,
      location: 'Potrero A-1',
      medications: ['Vacuna Brucelosis RB51'],
      dosage: '2ml subcutánea',
      followUp: false
    },
    {
      id: 2,
      bovineId: 'BOV-002',
      bovineName: 'Toro Bravo',
      type: 'Tratamiento',
      subtype: 'Desparasitación',
      date: '2024-06-18',
      veterinarian: 'Dr. María González',
      status: 'En Proceso',
      priority: 'Media',
      notes: 'Tratamiento para parásitos internos. Segunda dosis pendiente.',
      nextDue: '2024-06-25',
      cost: 180,
      location: 'Potrero B-2',
      medications: ['Ivermectina 1%', 'Vitamina B12'],
      dosage: '10ml intramuscular',
      followUp: true
    },
    {
      id: 3,
      bovineId: 'BOV-003',
      bovineName: 'Luna',
      type: 'Chequeo',
      subtype: 'Revisión General',
      date: '2024-06-15',
      veterinarian: 'Dr. Juan Pérez',
      status: 'Completado',
      priority: 'Baja',
      notes: 'Chequeo general de rutina. Bovino en excelente estado de salud.',
      nextDue: '2024-09-15',
      cost: 150,
      location: 'Potrero A-2',
      medications: [],
      dosage: 'N/A',
      followUp: false
    },
    {
      id: 4,
      bovineId: 'BOV-004',
      bovineName: 'Campeón',
      type: 'Emergencia',
      subtype: 'Cojera',
      date: '2024-06-22',
      veterinarian: 'Dr. Carlos Rodríguez',
      status: 'Pendiente',
      priority: 'Alta',
      notes: 'Cojera en pata trasera derecha. Requiere examen inmediato.',
      nextDue: '2024-06-23',
      cost: 0,
      location: 'Corral de Enfermería',
      medications: ['Antiinflamatorio', 'Analgésico'],
      dosage: 'Por determinar',
      followUp: true
    },
    {
      id: 5,
      bovineId: 'BOV-005',
      bovineName: 'Bella',
      type: 'Vacunación',
      subtype: 'Triple Bovina',
      date: '2024-06-10',
      veterinarian: 'Dr. María González',
      status: 'Completado',
      priority: 'Media',
      notes: 'Vacunación triple (IBR, BVD, PI3) aplicada sin complicaciones.',
      nextDue: '2025-06-10',
      cost: 320,
      location: 'Potrero A-1',
      medications: ['Vacuna Triple Bovina'],
      dosage: '5ml subcutánea',
      followUp: false
    }
  ]

  // Cargar datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setRecords(sampleRecords)
      setFilteredRecords(sampleRecords)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filtrar registros
  useEffect(() => {
    let filtered = records

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.bovineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.bovineId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.subtype.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.veterinarian.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por tipo
    if (filterBy !== 'all') {
      if (filterBy === 'pending') {
        filtered = filtered.filter(record => record.status === 'Pendiente' || record.status === 'En Proceso')
      } else if (filterBy === 'completed') {
        filtered = filtered.filter(record => record.status === 'Completado')
      } else if (filterBy === 'emergency') {
        filtered = filtered.filter(record => record.type === 'Emergencia' || record.priority === 'Alta')
      } else {
        filtered = filtered.filter(record => record.type.toLowerCase() === filterBy.toLowerCase())
      }
    }

    // Filtrar por fecha
    if (dateFilter !== 'all') {
      const today = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter(record => {
            const recordDate = new Date(record.date)
            return recordDate >= filterDate && recordDate < new Date(filterDate.getTime() + 24 * 60 * 60 * 1000)
          })
          break
        case 'week':
          filterDate.setDate(today.getDate() - 7)
          filtered = filtered.filter(record => new Date(record.date) >= filterDate)
          break
        case 'month':
          filterDate.setMonth(today.getMonth() - 1)
          filtered = filtered.filter(record => new Date(record.date) >= filterDate)
          break
      }
    }

    setFilteredRecords(filtered)
  }, [searchTerm, filterBy, dateFilter, records])

  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'En Proceso':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  // Función para obtener el color de prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'Media':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'Baja':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  // Función para obtener el icono del tipo
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Vacunación':
        return <Syringe className="w-5 h-5" />
      case 'Tratamiento':
        return <Pill className="w-5 h-5" />
      case 'Chequeo':
        return <Heart className="w-5 h-5" />
      case 'Emergencia':
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  // Calcular estadísticas
  const stats = {
    total: records.length,
    completed: records.filter(r => r.status === 'Completado').length,
    pending: records.filter(r => r.status === 'Pendiente' || r.status === 'En Proceso').length,
    emergency: records.filter(r => r.type === 'Emergencia' || r.priority === 'Alta').length
  }

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
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Control Sanitario
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestión de salud y tratamientos veterinarios
          </p>
        </div>
        
        <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl">
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Registro
        </button>
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        variants={itemVariants}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Registros</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completados</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Emergencias</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.emergency}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controles de búsqueda y filtros */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        variants={itemVariants}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Barra de búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por bovino, tipo o veterinario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filtros */}
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos los tipos</option>
              <option value="vacunación">Vacunación</option>
              <option value="tratamiento">Tratamiento</option>
              <option value="chequeo">Chequeo</option>
              <option value="emergencia">Emergencia</option>
              <option value="pending">Pendientes</option>
              <option value="completed">Completados</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Lista de registros */}
      <motion.div
        className="space-y-4"
        variants={itemVariants}
      >
        {filteredRecords.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No se encontraron registros
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Intenta ajustar los filtros de búsqueda.
            </p>
          </div>
        ) : (
          filteredRecords.map((record, index) => (
            <motion.div
              key={record.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-200"
              variants={itemVariants}
              custom={index}
              whileHover={{ scale: 1.01, y: -2 }}
            >
              <div className="p-6">
                {/* Header del registro */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    {/* Icono del tipo */}
                    <div className={`p-3 rounded-lg ${
                      record.type === 'Emergencia' ? 'bg-red-100 dark:bg-red-900/30' :
                      record.type === 'Vacunación' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      record.type === 'Tratamiento' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      'bg-green-100 dark:bg-green-900/30'
                    }`}>
                      <div className={`${
                        record.type === 'Emergencia' ? 'text-red-600 dark:text-red-400' :
                        record.type === 'Vacunación' ? 'text-blue-600 dark:text-blue-400' :
                        record.type === 'Tratamiento' ? 'text-purple-600 dark:text-purple-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {getTypeIcon(record.type)}
                      </div>
                    </div>

                    {/* Información principal */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {record.type}: {record.subtype}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(record.priority)}`}>
                          {record.priority}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <Link 
                            to={`/bovines/${record.bovineId}`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {record.bovineName} ({record.bovineId})
                          </Link>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(record.date).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Activity className="w-4 h-4" />
                          <span>{record.veterinarian}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{record.location}</span>
                        </span>
                      </div>

                      {record.notes && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          {record.notes}
                        </p>
                      )}

                      {/* Información adicional */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          {record.medications.length > 0 && (
                            <span className="text-gray-600 dark:text-gray-400">
                              <strong>Medicamentos:</strong> {record.medications.join(', ')}
                            </span>
                          )}
                          {record.cost > 0 && (
                            <span className="text-gray-600 dark:text-gray-400">
                              <strong>Costo:</strong> ${record.cost.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {record.followUp && (
                          <span className="flex items-center space-x-1 text-xs text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            <span>Seguimiento requerido</span>
                          </span>
                        )}
                      </div>

                      {/* Próxima fecha */}
                      {record.nextDue && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Próxima cita:</strong> {new Date(record.nextDue).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedRecord(record)
                        setShowDetailModal(true)
                      }}
                      className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>

                    <button className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Modal de detalles */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header del modal */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${
                    selectedRecord.type === 'Emergencia' ? 'bg-red-100 dark:bg-red-900/30' :
                    selectedRecord.type === 'Vacunación' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    selectedRecord.type === 'Tratamiento' ? 'bg-purple-100 dark:bg-purple-900/30' :
                    'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    <div className={`${
                      selectedRecord.type === 'Emergencia' ? 'text-red-600 dark:text-red-400' :
                      selectedRecord.type === 'Vacunación' ? 'text-blue-600 dark:text-blue-400' :
                      selectedRecord.type === 'Tratamiento' ? 'text-purple-600 dark:text-purple-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {getTypeIcon(selectedRecord.type)}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedRecord.type}: {selectedRecord.subtype}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedRecord.bovineName} ({selectedRecord.bovineId})
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Contenido del modal */}
              <div className="space-y-6">
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Información General
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Fecha:</span>
                        <span className="font-medium">{new Date(selectedRecord.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRecord.status)}`}>
                          {selectedRecord.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Prioridad:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedRecord.priority)}`}>
                          {selectedRecord.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Veterinario:</span>
                        <span className="font-medium">{selectedRecord.veterinarian}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Ubicación:</span>
                        <span className="font-medium">{selectedRecord.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Tratamiento
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Medicamentos:</span>
                        <div className="mt-1">
                          {selectedRecord.medications.length > 0 ? (
                            selectedRecord.medications.map((med, index) => (
                              <span key={index} className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs mr-1 mb-1">
                                {med}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">No aplica</span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Dosis:</span>
                        <span className="font-medium">{selectedRecord.dosage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Costo:</span>
                        <span className="font-medium">${selectedRecord.cost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notas */}
                {selectedRecord.notes && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Observaciones
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {selectedRecord.notes}
                    </p>
                  </div>
                )}

                {/* Próxima cita */}
                {selectedRecord.nextDue && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Próxima Cita
                    </h3>
                    <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                      {new Date(selectedRecord.nextDue).toLocaleDateString()}
                    </p>
                    {selectedRecord.followUp && (
                      <p className="text-yellow-700 dark:text-yellow-400 text-xs mt-1">
                        * Requiere seguimiento
                      </p>
                    )}
                  </div>
                )}

                {/* Acciones del modal */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cerrar
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Editar Registro
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default HealthRecords