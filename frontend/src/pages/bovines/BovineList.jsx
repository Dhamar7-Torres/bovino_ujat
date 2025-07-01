// src/pages/bovines/BovineList.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  MapPin,
  Calendar,
  Activity
} from 'lucide-react'

// Página de lista de bovinos
const BovineList = () => {
  const [bovines, setBovines] = useState([])
  const [filteredBovines, setFilteredBovines] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Datos de ejemplo
  const sampleBovines = [
    {
      id: 1,
      earTag: 'BOV-001',
      name: 'Esperanza',
      breed: 'Holstein',
      gender: 'Hembra',
      birthDate: '2022-03-15',
      weight: 420,
      healthStatus: 'Saludable',
      location: 'Potrero A-1',
      lactating: true,
      pregnant: false,
      lastCheckup: '2024-06-15'
    },
    {
      id: 2,
      earTag: 'BOV-002',
      name: 'Toro Bravo',
      breed: 'Angus',
      gender: 'Macho',
      birthDate: '2021-08-22',
      weight: 680,
      healthStatus: 'Saludable',
      location: 'Potrero B-2',
      lactating: false,
      pregnant: false,
      lastCheckup: '2024-06-10'
    },
    {
      id: 3,
      earTag: 'BOV-003',
      name: 'Luna',
      breed: 'Jersey',
      gender: 'Hembra',
      birthDate: '2023-01-10',
      weight: 380,
      healthStatus: 'En Tratamiento',
      location: 'Potrero A-2',
      lactating: true,
      pregnant: true,
      lastCheckup: '2024-06-20'
    },
    {
      id: 4,
      earTag: 'BOV-004',
      name: 'Campeón',
      breed: 'Brahman',
      gender: 'Macho',
      birthDate: '2020-11-05',
      weight: 750,
      healthStatus: 'Saludable',
      location: 'Potrero C-1',
      lactating: false,
      pregnant: false,
      lastCheckup: '2024-06-18'
    },
    {
      id: 5,
      earTag: 'BOV-005',
      name: 'Bella',
      breed: 'Holstein',
      gender: 'Hembra',
      birthDate: '2022-07-30',
      weight: 450,
      healthStatus: 'Saludable',
      location: 'Potrero A-1',
      lactating: false,
      pregnant: true,
      lastCheckup: '2024-06-22'
    }
  ]

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setBovines(sampleBovines)
      setFilteredBovines(sampleBovines)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filtrar bovinos
  useEffect(() => {
    let filtered = bovines

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(bovine =>
        bovine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bovine.earTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bovine.breed.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por categoría
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'healthy':
          filtered = filtered.filter(bovine => bovine.healthStatus === 'Saludable')
          break
        case 'treatment':
          filtered = filtered.filter(bovine => bovine.healthStatus === 'En Tratamiento')
          break
        case 'lactating':
          filtered = filtered.filter(bovine => bovine.lactating)
          break
        case 'pregnant':
          filtered = filtered.filter(bovine => bovine.pregnant)
          break
        case 'male':
          filtered = filtered.filter(bovine => bovine.gender === 'Macho')
          break
        case 'female':
          filtered = filtered.filter(bovine => bovine.gender === 'Hembra')
          break
      }
    }

    setFilteredBovines(filtered)
  }, [searchTerm, filterBy, bovines])

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

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
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
            Gestión de Bovinos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredBovines.length} bovinos encontrados
          </p>
        </div>
        
        <Link
          to="/bovines/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar Bovino
        </Link>
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
              placeholder="Buscar por nombre, arete o raza..."
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
              <option value="all">Todos</option>
              <option value="healthy">Saludables</option>
              <option value="treatment">En Tratamiento</option>
              <option value="lactating">En Lactancia</option>
              <option value="pregnant">Preñadas</option>
              <option value="male">Machos</option>
              <option value="female">Hembras</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Lista de bovinos */}
      {filteredBovines.length === 0 ? (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center"
          variants={itemVariants}
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No se encontraron bovinos
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Intenta ajustar los filtros de búsqueda o agrega un nuevo bovino.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBovines.map((bovine, index) => (
            <motion.div
              key={bovine.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-200"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              custom={index}
            >
              {/* Header de la tarjeta */}
              <div className="bg-gradient-to-r from-blue-500 to-green-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {bovine.name}
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {bovine.earTag}
                    </p>
                  </div>
                  <div className="relative">
                    <button className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-6 space-y-4">
                {/* Información básica */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Raza</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {bovine.breed}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Género</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {bovine.gender}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Edad</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {calculateAge(bovine.birthDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Peso</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {bovine.weight} kg
                    </p>
                  </div>
                </div>

                {/* Estado de salud */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(bovine.healthStatus)}`}>
                    {bovine.healthStatus}
                  </span>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(bovine.lastCheckup).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{bovine.location}</span>
                </div>

                {/* Estados especiales */}
                <div className="flex items-center space-x-2">
                  {bovine.lactating && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium">
                      Lactancia
                    </span>
                  )}
                  {bovine.pregnant && (
                    <span className="px-2 py-1 bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400 rounded-full text-xs font-medium">
                      Preñada
                    </span>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to={`/bovines/${bovine.id}`}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver Detalles</span>
                  </Link>
                  
                  <Link
                    to={`/bovines/${bovine.id}/edit`}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 text-sm font-medium transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default BovineList