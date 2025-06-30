import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon,
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter,
  Search,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Bell,
  Download,
  Settings,
  MoreVertical,
  Cow,
  Syringe,
  Heart,
  Activity,
  Target,
  X
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';
import LoadingSpinner from '../animations/LoadingSpinner';

const EventCalendar = ({ 
  onEventClick,
  onDateSelect,
  onCreateEvent,
  initialDate = new Date(),
  height = "600px",
  showFilters = true,
  showCreateButton = true,
  eventTypes = ['vaccination', 'checkup', 'breeding', 'feeding', 'treatment', 'maintenance'],
  className = ""
}) => {
  
  // Estados principales
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    eventType: '',
    status: '',
    priority: '',
    assignedTo: ''
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Estados para UI
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState(null);

  // Ref para el calendario
  const calendarRef = useRef(null);

  // Animaciones de Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const dayVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  const eventVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    }
  };

  // Datos de ejemplo para eventos ganaderos
  const sampleEvents = [
    {
      id: 1,
      title: "Vacunación Grupo A",
      type: "vaccination",
      date: new Date(2025, 5, 30),
      time: "09:00",
      duration: 120,
      status: "scheduled",
      priority: "high",
      location: { lat: 16.7569, lng: -93.1292 },
      locationName: "Corral Norte",
      assignedTo: "Dr. García",
      animals: ["COW001", "COW002", "COW003"],
      notes: "Vacuna contra brucelosis",
      color: "#3B82F6"
    },
    {
      id: 2,
      title: "Revisión Reproductiva",
      type: "checkup",
      date: new Date(2025, 6, 2),
      time: "14:00",
      duration: 90,
      status: "completed",
      priority: "medium",
      location: { lat: 16.7570, lng: -93.1295 },
      locationName: "Establo Principal",
      assignedTo: "Dr. López",
      animals: ["COW015", "COW022"],
      notes: "Chequeo rutinario de reproducción",
      color: "#10B981"
    },
    {
      id: 3,
      title: "Inseminación Artificial",
      type: "breeding",
      date: new Date(2025, 6, 5),
      time: "07:30",
      duration: 60,
      status: "pending",
      priority: "high",
      location: { lat: 16.7565, lng: -93.1290 },
      locationName: "Corral de Reproducción",
      assignedTo: "Téc. Martínez",
      animals: ["COW008", "COW019"],
      notes: "Segundo intento de IA",
      color: "#F59E0B"
    },
    {
      id: 4,
      title: "Alimentación Especial",
      type: "feeding",
      date: new Date(2025, 6, 8),
      time: "06:00",
      duration: 45,
      status: "scheduled",
      priority: "medium",
      location: { lat: 16.7572, lng: -93.1288 },
      locationName: "Área de Alimentación",
      assignedTo: "Encargado Pedro",
      animals: ["COW025", "COW030", "COW035"],
      notes: "Suplemento nutricional para vacas gestantes",
      color: "#8B5CF6"
    }
  ];

  // Cargar eventos al montar el componente
  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  // Filtrar eventos cuando cambian los filtros
  useEffect(() => {
    applyFilters();
  }, [events, filters, searchTerm]);

  // Función para cargar eventos
  const loadEvents = async () => {
    setIsLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(sampleEvents);
      setError('');
    } catch (err) {
      setError('Error al cargar eventos');
      console.error('Error loading events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para aplicar filtros
  const applyFilters = () => {
    let filtered = [...events];

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtros específicos
    if (filters.eventType) {
      filtered = filtered.filter(event => event.type === filters.eventType);
    }
    
    if (filters.status) {
      filtered = filtered.filter(event => event.status === filters.status);
    }
    
    if (filters.priority) {
      filtered = filtered.filter(event => event.priority === filters.priority);
    }
    
    if (filters.assignedTo) {
      filtered = filtered.filter(event => event.assignedTo.includes(filters.assignedTo));
    }

    setFilteredEvents(filtered);
  };

  // Función para generar días del calendario
  const generateCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    const days = [];
    let currentDay = start;

    while (currentDay <= end) {
      days.push(new Date(currentDay));
      currentDay = addDays(currentDay, 1);
    }

    return days;
  };

  // Función para obtener eventos de una fecha específica
  const getEventsForDate = (date) => {
    return filteredEvents.filter(event => 
      isSameDay(event.date, date)
    );
  };

  // Función para obtener el ícono del tipo de evento
  const getEventTypeIcon = (type) => {
    const icons = {
      vaccination: Syringe,
      checkup: Activity,
      breeding: Heart,
      feeding: Target,
      treatment: AlertTriangle,
      maintenance: Settings
    };
    return icons[type] || CalendarIcon;
  };

  // Función para obtener el color según el estado
  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      in_progress: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Función para obtener el color de prioridad
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700',
      urgent: 'bg-red-200 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-600';
  };

  // Manejar click en una fecha
  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (onDateSelect) onDateSelect(date);
  };

  // Manejar click en un evento
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
    if (onEventClick) onEventClick(event);
  };

  // Navegación del calendario
  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  // Ir a hoy
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Crear nuevo evento
  const handleCreateEvent = () => {
    setShowCreateModal(true);
    if (onCreateEvent) onCreateEvent(selectedDate);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <LoadingSpinner 
          variant="cow" 
          size="lg" 
          text="Cargando calendario..." 
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white rounded-xl shadow-sm border ${className}`}
      style={{ height }}
      ref={calendarRef}
    >
      {/* Header del calendario */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hoy
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Botón de filtros */}
            {showFilters && (
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilterPanel 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
            )}

            {/* Botón crear evento */}
            {showCreateButton && (
              <motion.button
                onClick={handleCreateEvent}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Evento
              </motion.button>
            )}
          </div>
        </div>

        {/* Panel de filtros */}
        <AnimatePresence>
          {showFilterPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t pt-4 mt-4"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <select
                  value={filters.eventType}
                  onChange={(e) => setFilters(prev => ({ ...prev, eventType: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Todos los tipos</option>
                  {eventTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Todos los estados</option>
                  <option value="scheduled">Programado</option>
                  <option value="pending">Pendiente</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </select>

                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Todas las prioridades</option>
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>

                <input
                  type="text"
                  placeholder="Asignado a..."
                  value={filters.assignedTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid del calendario */}
      <div className="p-6">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Días del calendario */}
        <div className="grid grid-cols-7 gap-1">
          {generateCalendarDays().map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isDayToday = isToday(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const dayEvents = getEventsForDate(day);

            return (
              <motion.div
                key={index}
                variants={dayVariants}
                className={`min-h-24 p-2 border border-gray-100 cursor-pointer transition-all duration-200 ${
                  isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                } ${isDayToday ? 'bg-blue-50 border-blue-300' : ''} ${
                  isSelected ? 'bg-green-50 border-green-300' : ''
                }`}
                onClick={() => handleDateClick(day)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Número del día */}
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${isDayToday ? 'text-blue-600 font-bold' : ''}`}>
                  {format(day, 'd')}
                </div>

                {/* Eventos del día */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event, eventIndex) => {
                    const EventIcon = getEventTypeIcon(event.type);
                    return (
                      <motion.div
                        key={event.id}
                        variants={eventVariants}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                        className="p-1 rounded text-xs cursor-pointer hover:shadow-md transition-shadow"
                        style={{ backgroundColor: event.color + '20', borderLeft: `3px solid ${event.color}` }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex items-center space-x-1">
                          <EventIcon className="w-3 h-3" style={{ color: event.color }} />
                          <span className="font-medium truncate">{event.title}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Clock className="w-2 h-2" />
                          <span>{event.time}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  {/* Indicador de más eventos */}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayEvents.length - 3} más
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal de evento (placeholder) */}
      <AnimatePresence>
        {showEventModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalles del Evento
                </h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">{selectedEvent.title}</h4>
                <p className="text-sm text-gray-600">{selectedEvent.notes}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {format(selectedEvent.date, 'dd/MM/yyyy')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedEvent.time}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedEvent.status)}`}>
                    {selectedEvent.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(selectedEvent.priority)}`}>
                    {selectedEvent.priority}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EventCalendar;