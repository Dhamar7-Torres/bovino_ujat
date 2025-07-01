// src/pages/calendar/EventCalendar.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Clock,
  MapPin,
  User,
  Syringe,
  Heart,
  Baby,
  Milk,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  Bell
} from 'lucide-react'
import toast from 'react-hot-toast'

// Componente de calendario para eventos del rancho
const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('month') // month, week, day
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showNewEventModal, setShowNewEventModal] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Tipos de eventos
  const eventTypes = [
    { id: 'vaccination', name: 'Vacunación', icon: <Syringe className="w-4 h-4" />, color: 'blue' },
    { id: 'checkup', name: 'Chequeo', icon: <Heart className="w-4 h-4" />, color: 'green' },
    { id: 'breeding', name: 'Reproducción', icon: <Baby className="w-4 h-4" />, color: 'pink' },
    { id: 'milking', name: 'Ordeña', icon: <Milk className="w-4 h-4" />, color: 'purple' },
    { id: 'emergency', name: 'Emergencia', icon: <AlertTriangle className="w-4 h-4" />, color: 'red' },
    { id: 'maintenance', name: 'Mantenimiento', icon: <Calendar className="w-4 h-4" />, color: 'gray' }
  ]

  // Eventos de ejemplo
  const sampleEvents = [
    {
      id: 1,
      title: 'Vacunación Triple Bovina',
      type: 'vaccination',
      date: new Date(2024, 5, 25, 9, 0), // 25 de junio 2024, 9:00 AM
      duration: 120, // minutos
      location: 'Potrero A-1',
      bovines: ['BOV-001', 'BOV-002', 'BOV-003'],
      veterinarian: 'Dr. Juan Pérez',
      status: 'scheduled',
      priority: 'high',
      notes: 'Aplicar vacuna triple bovina (IBR, BVD, PI3) a bovinos del grupo A',
      cost: 1200,
      recurring: false
    },
    {
      id: 2,
      title: 'Chequeo Mensual - Esperanza',
      type: 'checkup',
      date: new Date(2024, 5, 22, 14, 30), // 22 de junio 2024, 2:30 PM
      duration: 60,
      location: 'Corral Principal',
      bovines: ['BOV-001'],
      veterinarian: 'Dr. María González',
      status: 'completed',
      priority: 'medium',
      notes: 'Chequeo de rutina. Bovino en excelente estado.',
      cost: 250,
      recurring: true,
      recurringPattern: 'monthly'
    },
    {
      id: 3,
      title: 'Inseminación Artificial - Luna',
      type: 'breeding',
      date: new Date(2024, 5, 28, 7, 0), // 28 de junio 2024, 7:00 AM
      duration: 45,
      location: 'Corral de Reproducción',
      bovines: ['BOV-003'],
      veterinarian: 'Dr. Carlos Rodríguez',
      status: 'scheduled',
      priority: 'high',
      notes: 'Inseminación artificial programada. Toro: Angus Premium',
      cost: 500,
      recurring: false
    },
    {
      id: 4,
      title: 'Ordeña Matutina',
      type: 'milking',
      date: new Date(2024, 5, 24, 5, 30), // 24 de junio 2024, 5:30 AM
      duration: 180,
      location: 'Sala de Ordeña',
      bovines: ['BOV-001', 'BOV-005'],
      staff: 'Equipo de Ordeña',
      status: 'scheduled',
      priority: 'medium',
      notes: 'Ordeña matutina de vacas en lactancia',
      recurring: true,
      recurringPattern: 'daily'
    },
    {
      id: 5,
      title: 'Emergencia - Cojera Toro Bravo',
      type: 'emergency',
      date: new Date(2024, 5, 23, 16, 45), // 23 de junio 2024, 4:45 PM
      duration: 90,
      location: 'Potrero B-2',
      bovines: ['BOV-002'],
      veterinarian: 'Dr. Juan Pérez',
      status: 'in-progress',
      priority: 'urgent',
      notes: 'Atención inmediata por cojera en pata trasera',
      cost: 0,
      recurring: false
    },
    {
      id: 6,
      title: 'Mantenimiento Bebederos',
      type: 'maintenance',
      date: new Date(2024, 5, 26, 10, 0), // 26 de junio 2024, 10:00 AM
      duration: 240,
      location: 'Todos los Potreros',
      staff: 'Equipo de Mantenimiento',
      status: 'scheduled',
      priority: 'low',
      notes: 'Limpieza y mantenimiento de todos los bebederos',
      cost: 300,
      recurring: true,
      recurringPattern: 'weekly'
    }
  ]

  // Cargar eventos
  useEffect(() => {
    setEvents(sampleEvents)
    setFilteredEvents(sampleEvents)
  }, [])

  // Filtrar eventos
  useEffect(() => {
    let filtered = events

    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType)
    }

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredEvents(filtered)
  }, [events, filterType, searchTerm])

  // Obtener eventos del día
  const getEventsForDate = (date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  // Obtener color del evento
  const getEventColor = (type, priority) => {
    const typeColors = {
      vaccination: 'blue',
      checkup: 'green',
      breeding: 'pink',
      milking: 'purple',
      emergency: 'red',
      maintenance: 'gray'
    }

    const color = typeColors[type] || 'gray'
    const intensity = priority === 'urgent' ? '600' : priority === 'high' ? '500' : '400'

    return {
      bg: `bg-${color}-100 dark:bg-${color}-900/30`,
      text: `text-${color}-800 dark:text-${color}-300`,
      border: `border-${color}-200 dark:border-${color}-700`,
      dot: `bg-${color}-${intensity}`
    }
  }

  // Obtener estado del evento
  const getEventStatus = (status) => {
    switch (status) {
      case 'scheduled':
        return { text: 'Programado', color: 'blue' }
      case 'in-progress':
        return { text: 'En Progreso', color: 'yellow' }
      case 'completed':
        return { text: 'Completado', color: 'green' }
      case 'cancelled':
        return { text: 'Cancelado', color: 'red' }
      default:
        return { text: 'Desconocido', color: 'gray' }
    }
  }

  // Navegar entre meses
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  // Generar días del calendario
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDay = new Date(startDate)
    
    for (let week = 0; week < 6; week++) {
      const weekDays = []
      for (let day = 0; day < 7; day++) {
        weekDays.push(new Date(currentDay))
        currentDay.setDate(currentDay.getDate() + 1)
      }
      days.push(weekDays)
      
      // Si todos los días de la semana están en el mes siguiente, terminamos
      if (weekDays.every(d => d.getMonth() !== month)) break
    }
    
    return days
  }

  // Formatear hora
  const formatTime = (date) => {
    return date.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  // Obtener nombre del mes
  const getMonthName = (date) => {
    return date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
  }

  // Verificar si es hoy
  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Verificar si es el mes actual
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  // Estadísticas del calendario
  const stats = {
    total: filteredEvents.length,
    thisWeek: filteredEvents.filter(event => {
      const eventDate = new Date(event.date)
      const today = new Date()
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      return eventDate >= weekStart && eventDate <= weekEnd
    }).length,
    urgent: filteredEvents.filter(event => event.priority === 'urgent').length,
    upcoming: filteredEvents.filter(event => new Date(event.date) > new Date()).length
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <motion.div
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Calendario de Eventos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Programación y seguimiento de actividades del rancho
            </p>
          </div>
          
          <button
            onClick={() => setShowNewEventModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Evento</span>
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Eventos</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{stats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Esta Semana</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-300">{stats.thisWeek}</p>
              </div>
              <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">Urgentes</p>
                <p className="text-2xl font-bold text-red-800 dark:text-red-300">{stats.urgent}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Próximos</p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">{stats.upcoming}</p>
              </div>
              <Bell className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Navegación del calendario */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                {getMonthName(currentDate)}
              </h2>
              
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Hoy
            </button>
          </div>

          {/* Filtros y búsqueda */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value="all">Todos los tipos</option>
              {eventTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>

            <button className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Contenido principal */}
      <div className="flex-1 flex">
        {/* Calendario */}
        <div className="flex-1 p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Días de la semana */}
            <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                <div key={day} className="p-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  {day}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {generateCalendarDays().map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 divide-x divide-gray-200 dark:divide-gray-700">
                  {week.map((date, dayIndex) => {
                    const dayEvents = getEventsForDate(date)
                    const isCurrentDay = isToday(date)
                    const isCurrentMonthDay = isCurrentMonth(date)

                    return (
                      <motion.div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`min-h-32 p-2 cursor-pointer transition-colors ${
                          isCurrentDay
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        } ${!isCurrentMonthDay ? 'opacity-50' : ''}`}
                        onClick={() => setSelectedDate(date)}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          isCurrentDay
                            ? 'text-blue-600 dark:text-blue-400'
                            : isCurrentMonthDay
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-400 dark:text-gray-600'
                        }`}>
                          {date.getDate()}
                        </div>

                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map((event) => {
                            const eventType = eventTypes.find(t => t.id === event.type)
                            const status = getEventStatus(event.status)
                            
                            return (
                              <motion.div
                                key={event.id}
                                className={`text-xs p-1 rounded cursor-pointer ${
                                  event.priority === 'urgent'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    : event.type === 'vaccination'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                    : event.type === 'checkup'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : event.type === 'breeding'
                                    ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400'
                                    : event.type === 'milking'
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedEvent(event)
                                  setShowEventModal(true)
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <div className="flex items-center space-x-1">
                                  <div className="w-1 h-1 rounded-full bg-current" />
                                  <span className="truncate">{event.title}</span>
                                </div>
                                <div className="text-xs opacity-75">
                                  {formatTime(new Date(event.date))}
                                </div>
                              </motion.div>
                            )
                          })}
                          
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 pl-1">
                              +{dayEvents.length - 3} más
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel lateral de eventos */}
        <div className="w-80 p-6 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-full overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Eventos del {selectedDate.toLocaleDateString('es-MX', { 
                day: 'numeric', 
                month: 'long' 
              })}
            </h3>

            <div className="space-y-3">
              {getEventsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No hay eventos programados para este día
                  </p>
                  <button
                    onClick={() => setShowNewEventModal(true)}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Agregar evento
                  </button>
                </div>
              ) : (
                getEventsForDate(selectedDate).map((event) => {
                  const eventType = eventTypes.find(t => t.id === event.type)
                  const status = getEventStatus(event.status)
                  
                  return (
                    <motion.div
                      key={event.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedEvent(event)
                        setShowEventModal(true)
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded ${
                            event.type === 'vaccination' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                            event.type === 'checkup' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                            event.type === 'breeding' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' :
                            event.type === 'milking' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                            event.type === 'emergency' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
                          }`}>
                            {eventType?.icon}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            status.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            status.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {status.text}
                          </span>
                        </div>
                        
                        {event.priority === 'urgent' && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>

                      <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                        {event.title}
                      </h4>

                      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {formatTime(new Date(event.date))} 
                            ({Math.floor(event.duration / 60)}h {event.duration % 60}m)
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>

                        {event.veterinarian && (
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{event.veterinarian}</span>
                          </div>
                        )}

                        {event.bovines && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {event.bovines.length} bovino(s): {event.bovines.join(', ')}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles del evento */}
      <AnimatePresence>
        {showEventModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${
                      selectedEvent.type === 'vaccination' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                      selectedEvent.type === 'checkup' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                      selectedEvent.type === 'breeding' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' :
                      selectedEvent.type === 'milking' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                      selectedEvent.type === 'emergency' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                      {eventTypes.find(t => t.id === selectedEvent.type)?.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedEvent.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {eventTypes.find(t => t.id === selectedEvent.type)?.name}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Contenido */}
                <div className="space-y-6">
                  {/* Información básica */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Programación
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Fecha:</span>
                          <span className="font-medium">
                            {new Date(selectedEvent.date).toLocaleDateString('es-MX')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Hora:</span>
                          <span className="font-medium">
                            {formatTime(new Date(selectedEvent.date))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Duración:</span>
                          <span className="font-medium">
                            {Math.floor(selectedEvent.duration / 60)}h {selectedEvent.duration % 60}m
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getEventStatus(selectedEvent.status).color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            getEventStatus(selectedEvent.status).color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            getEventStatus(selectedEvent.status).color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {getEventStatus(selectedEvent.status).text}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Detalles
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Ubicación:</span>
                          <span className="font-medium">{selectedEvent.location}</span>
                        </div>
                        {selectedEvent.veterinarian && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Veterinario:</span>
                            <span className="font-medium">{selectedEvent.veterinarian}</span>
                          </div>
                        )}
                        {selectedEvent.staff && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Personal:</span>
                            <span className="font-medium">{selectedEvent.staff}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Prioridad:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedEvent.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            selectedEvent.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                            selectedEvent.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {selectedEvent.priority === 'urgent' ? 'Urgente' :
                             selectedEvent.priority === 'high' ? 'Alta' :
                             selectedEvent.priority === 'medium' ? 'Media' : 'Baja'}
                          </span>
                        </div>
                        {selectedEvent.cost > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Costo:</span>
                            <span className="font-medium">${selectedEvent.cost.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bovinos involucrados */}
                  {selectedEvent.bovines && selectedEvent.bovines.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Bovinos Involucrados ({selectedEvent.bovines.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.bovines.map((bovineId) => (
                          <span
                            key={bovineId}
                            className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded text-sm"
                          >
                            {bovineId}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notas */}
                  {selectedEvent.notes && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Observaciones
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {selectedEvent.notes}
                      </p>
                    </div>
                  )}

                  {/* Recurrencia */}
                  {selectedEvent.recurring && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Evento Recurrente
                      </h3>
                      <p className="text-green-800 dark:text-green-300 text-sm">
                        Se repite {
                          selectedEvent.recurringPattern === 'daily' ? 'diariamente' :
                          selectedEvent.recurringPattern === 'weekly' ? 'semanalmente' :
                          selectedEvent.recurringPattern === 'monthly' ? 'mensualmente' :
                          selectedEvent.recurringPattern
                        }
                      </p>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setShowEventModal(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cerrar
                    </button>
                    
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EventCalendar