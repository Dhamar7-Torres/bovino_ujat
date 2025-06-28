import React, { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Heart,
  Scale,
  Syringe,
  Baby,
  Zap,
  Bell,
  Download,
  RefreshCw,
  SortAsc,
  SortDesc,
  X,
  CalendarDays
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const EventList = () => {
  // Estados para manejar los datos y la UI
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    priority: '',
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
  // Estados para acciones
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Animaciones para los componentes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6, 
        staggerChildren: 0.1 
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    hover: {
      y: -4,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.2 }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  // Cargar eventos al montar el componente
  useEffect(() => {
    fetchEvents();
    
    // Mostrar mensaje de éxito si viene de otra página
    if (location.state?.message) {
      console.log(location.state.message);
    }
  }, []);

  // Aplicar filtros cuando cambien los datos o filtros
  useEffect(() => {
    applyFilters();
  }, [events, searchTerm, filters, sortBy, sortOrder]);

  // Obtener lista de eventos
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load events');
      }
    } catch (error) {
      console.error('Fetch events error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos de ejemplo mientras se carga la API real
  const mockEvents = [
    {
      id: 1,
      title: 'Vaccination Round - Group A',
      type: 'vaccination',
      date: '2025-06-28',
      time: '09:00',
      endTime: '11:00',
      description: 'Annual vaccination for breeding stock',
      location: 'Main Farm - Barn A',
      veterinarian: 'Dr. Sarah Smith',
      status: 'scheduled',
      priority: 'high',
      bovineCount: 15,
      cost: 245.50,
      createdAt: '2025-06-20T10:30:00Z'
    },
    {
      id: 2,
      title: 'Health Checkup - Pregnant Cows',
      type: 'health',
      date: '2025-06-30',
      time: '14:00',
      endTime: '16:30',
      description: 'Routine pregnancy checks and health assessment',
      location: 'North Pasture',
      veterinarian: 'Dr. Johnson',
      status: 'scheduled',
      priority: 'medium',
      bovineCount: 8,
      cost: 180.00,
      createdAt: '2025-06-22T08:15:00Z'
    },
    {
      id: 3,
      title: 'Weight Monitoring',
      type: 'monitoring',
      date: '2025-07-02',
      time: '08:00',
      endTime: '10:00',
      description: 'Monthly weight monitoring for all cattle',
      location: 'Central Scale House',
      status: 'scheduled',
      priority: 'low',
      bovineCount: 25,
      cost: 50.00,
      createdAt: '2025-06-18T16:45:00Z'
    },
    {
      id: 4,
      title: 'Breeding Schedule - AI',
      type: 'breeding',
      date: '2025-07-05',
      time: '06:00',
      endTime: '08:00',
      description: 'Artificial insemination for selected heifers',
      location: 'Breeding Facility',
      veterinarian: 'Dr. Wilson',
      status: 'scheduled',
      priority: 'high',
      bovineCount: 6,
      cost: 320.00,
      createdAt: '2025-06-15T12:00:00Z'
    },
    {
      id: 5,
      title: 'Feed Supplement Distribution',
      type: 'feeding',
      date: '2025-06-25',
      time: '07:00',
      endTime: '09:00',
      description: 'Special mineral supplement for lactating cows',
      location: 'Feed Distribution Center',
      status: 'completed',
      priority: 'medium',
      bovineCount: 12,
      cost: 85.75,
      createdAt: '2025-06-20T09:30:00Z'
    },
    {
      id: 6,
      title: 'Emergency Treatment - Cow #456',
      type: 'treatment',
      date: '2025-06-26',
      time: '15:30',
      endTime: '16:00',
      description: 'Treatment for minor injury on front leg',
      location: 'Main Farm - Medical Bay',
      veterinarian: 'Dr. Smith',
      status: 'completed',
      priority: 'high',
      bovineCount: 1,
      cost: 125.00,
      createdAt: '2025-06-26T15:00:00Z'
    }
  ];

  // Usar datos mock si no hay eventos reales
  const eventsData = events.length > 0 ? events : mockEvents;

  // Aplicar filtros y búsqueda
  const applyFilters = () => {
    let filtered = [...eventsData];

    // Aplicar búsqueda por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term) ||
        (event.veterinarian && event.veterinarian.toLowerCase().includes(term))
      );
    }

    // Aplicar filtros específicos
    if (filters.type) {
      filtered = filtered.filter(event => event.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter(event => event.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(event => event.priority === filters.priority);
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const today = new Date();
      const eventDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          eventDate.setDate(today.getDate());
          break;
        case 'week':
          eventDate.setDate(today.getDate() + 7);
          break;
        case 'month':
          eventDate.setMonth(today.getMonth() + 1);
          break;
        case 'past':
          filtered = filtered.filter(event => new Date(event.date) < today);
          break;
        default:
          break;
      }
      
      if (filters.dateRange !== 'past') {
        filtered = filtered.filter(event => {
          const date = new Date(event.date);
          return date >= today && date <= eventDate;
        });
      }
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Manejo especial para fechas
      if (sortBy === 'date' || sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Manejo especial para números
      if (sortBy === 'cost' || sortBy === 'bovineCount') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      // Conversión a string para comparación
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  // Obtener icono del tipo de evento
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'vaccination': return Syringe;
      case 'health': return Heart;
      case 'monitoring': return Scale;
      case 'breeding': return Baby;
      case 'feeding': return Zap;
      case 'treatment': return AlertCircle;
      default: return Calendar;
    }
  };

  // Obtener color del tipo de evento
  const getEventTypeColor = (type) => {
    switch (type) {
      case 'vaccination': return 'bg-purple-500 text-white';
      case 'health': return 'bg-red-500 text-white';
      case 'monitoring': return 'bg-blue-500 text-white';
      case 'breeding': return 'bg-pink-500 text-white';
      case 'feeding': return 'bg-green-500 text-white';
      case 'treatment': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Obtener color de prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  // Manejar eliminación de evento
  const handleDelete = async (eventId) => {
    setDeletingEventId(eventId);
    
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setEvents(prev => prev.filter(event => event.id !== eventId));
        setShowDeleteModal(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Delete event error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setDeletingEventId(null);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      type: '',
      status: '',
      priority: '',
      dateRange: 'all'
    });
    setShowFilters(false);
  };

  // Calcular estadísticas
  const stats = {
    total: eventsData.length,
    scheduled: eventsData.filter(e => e.status === 'scheduled').length,
    completed: eventsData.filter(e => e.status === 'completed').length,
    thisWeek: eventsData.filter(e => {
      const eventDate = new Date(e.date);
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return eventDate >= today && eventDate <= weekFromNow;
    }).length
  };

  // Datos para paginación
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </motion.div>
        </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Events</h1>
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <span>{stats.total} total</span>
                <span className="text-blue-600">{stats.scheduled} scheduled</span>
                <span className="text-green-600">{stats.completed} completed</span>
                <span className="text-purple-600">{stats.thisWeek} this week</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                to="/events/calendar"
                className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                Calendar View
              </Link>
              
              <button
                onClick={fetchEvents}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <Link
                to="/events/add"
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controles de filtro y búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Búsqueda */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events by title, description, location..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Controles de vista y filtros */}
            <div className="flex items-center space-x-3">
              {/* Ordenamiento */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="date-asc">Date: Earliest First</option>
                <option value="date-desc">Date: Latest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="priority-desc">Priority: High First</option>
                <option value="cost-desc">Cost: Highest First</option>
                <option value="createdAt-desc">Recently Added</option>
              </select>

              {/* Botón de filtros */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-3 py-2 border rounded-lg transition-colors ${
                  showFilters || Object.values(filters).some(f => f && f !== 'all')
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>

              {/* Toggle de vista */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Panel de filtros expandible */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="">All types</option>
                      <option value="vaccination">Vaccination</option>
                      <option value="health">Health Checkup</option>
                      <option value="monitoring">Monitoring</option>
                      <option value="breeding">Breeding</option>
                      <option value="feeding">Feeding</option>
                      <option value="treatment">Treatment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="">All statuses</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={filters.priority}
                      onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="">All priorities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="all">All dates</option>
                      <option value="today">Today</option>
                      <option value="week">This week</option>
                      <option value="month">This month</option>
                      <option value="past">Past events</option>
                    </select>
                  </div>
                </div>

                {Object.values(filters).some(f => f && f !== 'all') && (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Contenido principal */}
        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || Object.values(filters).some(f => f && f !== 'all') 
                ? 'No events found' 
                : 'No events yet'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(filters).some(f => f && f !== 'all')
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first event'
              }
            </p>
            {!searchTerm && !Object.values(filters).some(f => f && f !== 'all') && (
              <Link
                to="/events/add"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Event
              </Link>
            )}
          </motion.div>
        ) : (
          <>
            {/* Vista Grid */}
            {viewMode === 'grid' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {paginatedEvents.map((event) => {
                  const IconComponent = getEventTypeIcon(event.type);
                  return (
                    <motion.div
                      key={event.id}
                      variants={cardVariants}
                      whileHover="hover"
                      className={`bg-white rounded-xl shadow-sm border-l-4 overflow-hidden cursor-pointer ${getPriorityColor(event.priority)}`}
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      {/* Header del evento */}
                      <div className="p-4 pb-2">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                              {event.type}
                            </span>
                          </div>
                          
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionMenu(showActionMenu === event.id ? null : event.id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {showActionMenu === event.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-0 top-6 bg-white rounded-lg shadow-lg border z-10 min-w-32"
                              >
                                <Link
                                  to={`/events/${event.id}`}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Link>
                                <Link
                                  to={`/events/edit/${event.id}`}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteModal(event.id);
                                    setShowActionMenu(null);
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {event.description}
                        </p>
                      </div>

                      {/* Información del evento */}
                      <div className="px-4 pb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-2" />
                            {event.time}
                            {event.endTime && ` - ${event.endTime}`}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-2" />
                            {event.bovineCount} livestock
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                        {event.cost && (
                          <span className="text-sm font-medium text-gray-900">
                            ${event.cost}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Vista Tabla */}
            {viewMode === 'table' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Livestock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cost
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedEvents.map((event, index) => {
                        const IconComponent = getEventTypeIcon(event.type);
                        return (
                          <motion.tr
                            key={event.id}
                            variants={tableRowVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {event.title}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {event.description}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <IconComponent className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm text-gray-900 capitalize">
                                  {event.type}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div>
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                              <div>
                                {event.time}
                                {event.endTime && ` - ${event.endTime}`}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="truncate max-w-xs">{event.location}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                                {event.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {event.bovineCount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {event.cost ? `$${event.cost}` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Link
                                  to={`/events/${event.id}`}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <Link
                                  to={`/events/edit/${event.id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => setShowDeleteModal(event.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mt-8"
              >
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEvents.length)} of{' '}
                  {filteredEvents.length} results
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border transition-colors ${
                      currentPage === 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === totalPages || 
                      Math.abs(page - currentPage) <= 1
                    )
                    .map((page, index, array) => (
                      <Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'border-green-500 bg-green-600 text-white'
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </Fragment>
                    ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border transition-colors ${
                      currentPage === totalPages
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Event</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event? This will permanently remove all associated data.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingEventId}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deletingEventId}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
              >
                {deletingEventId ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Click outside para cerrar menús */}
      {showActionMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowActionMenu(null)}
        ></div>
      )}
    </div>
  );
};

export default EventList;