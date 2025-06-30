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
  Milk,
  Beef,
  Scale,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Bell,
  Download,
  Settings,
  MoreVertical,
  Package,
  Thermometer,
  Droplets,
  Activity,
  BarChart3,
  PieChart,
  X,
  Save,
  RefreshCw,
  Upload,
  Calendar,
  Zap,
  Award,
  Star
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, isToday, addMonths, subMonths, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';
import LoadingSpinner from '../animations/LoadingSpinner';
import CountUp from '../animations/CountUp';

const ProductionSchedule = ({ 
  onScheduleClick,
  onDateSelect,
  onCreateSchedule,
  initialDate = new Date(),
  height = "700px",
  showMetrics = true,
  showCreateButton = true,
  productionTypes = ['milk', 'meat', 'breeding', 'feed', 'maintenance'],
  viewMode = 'calendar', // 'calendar', 'timeline', 'kanban'
  className = ""
}) => {
  
  // Estados principales
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    productionType: '',
    status: '',
    priority: '',
    responsiblePerson: '',
    location: ''
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Estados para UI
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMetricsPanel, setShowMetricsPanel] = useState(showMetrics);

  // Estados para métricas de producción
  const [productionMetrics, setProductionMetrics] = useState({
    totalProduction: 0,
    dailyAverage: 0,
    weeklyTarget: 0,
    monthlyTarget: 0,
    efficiency: 0,
    trends: []
  });

  // Ref para el calendario
  const scheduleRef = useRef(null);

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

  const scheduleVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    }
  };

  const metricVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Datos de ejemplo para programación de producción
  const sampleSchedules = [
    {
      id: 1,
      title: "Ordeño Matutino",
      type: "milk",
      date: new Date(2025, 5, 30),
      startTime: "05:00",
      endTime: "07:30",
      duration: 150,
      status: "scheduled",
      priority: "high",
      location: { lat: 16.7569, lng: -93.1292 },
      locationName: "Sala de Ordeño A",
      responsiblePerson: "Juan Pérez",
      animals: ["COW001", "COW002", "COW003", "COW004", "COW005"],
      expectedProduction: 250, // litros
      actualProduction: null,
      quality: {
        fat: 3.8,
        protein: 3.2,
        somatic_cells: 150000
      },
      notes: "Primer ordeño del día - revisar calidad",
      color: "#3B82F6",
      recurring: "daily"
    },
    {
      id: 2,
      title: "Pesaje de Ganado",
      type: "meat",
      date: new Date(2025, 6, 2),
      startTime: "08:00",
      endTime: "12:00",
      duration: 240,
      status: "completed",
      priority: "medium",
      location: { lat: 16.7570, lng: -93.1295 },
      locationName: "Báscula Principal",
      responsiblePerson: "María García",
      animals: ["BULL001", "BULL002", "COW015", "COW022"],
      expectedProduction: null,
      actualProduction: 1200, // kg total
      averageWeight: 450,
      notes: "Pesaje mensual para control de crecimiento",
      color: "#DC2626",
      recurring: "monthly"
    },
    {
      id: 3,
      title: "Preparación de Alimento",
      type: "feed",
      date: new Date(2025, 6, 5),
      startTime: "06:00",
      endTime: "08:00",
      duration: 120,
      status: "in_progress",
      priority: "high",
      location: { lat: 16.7565, lng: -93.1290 },
      locationName: "Planta de Alimentos",
      responsiblePerson: "Carlos López",
      animals: [], // Para todo el rebaño
      expectedProduction: 500, // kg de alimento
      actualProduction: 480,
      composition: {
        corn: 45,
        soy: 25,
        minerals: 5,
        vitamins: 2,
        other: 23
      },
      notes: "Mezcla especial para vacas lactantes",
      color: "#059669",
      recurring: "daily"
    },
    {
      id: 4,
      title: "Control Reproductivo",
      type: "breeding",
      date: new Date(2025, 6, 8),
      startTime: "14:00",
      endTime: "16:30",
      duration: 150,
      status: "scheduled",
      priority: "medium",
      location: { lat: 16.7572, lng: -93.1288 },
      locationName: "Corral de Reproducción",
      responsiblePerson: "Dr. Rodríguez",
      animals: ["COW025", "COW030", "COW035"],
      expectedProduction: null,
      actualProduction: null,
      pregnancy_checks: 3,
      inseminations: 1,
      notes: "Chequeo de preñez y sincronización",
      color: "#7C3AED",
      recurring: "weekly"
    },
    {
      id: 5,
      title: "Mantenimiento de Equipos",
      type: "maintenance",
      date: new Date(2025, 6, 10),
      startTime: "10:00",
      endTime: "14:00",
      duration: 240,
      status: "pending",
      priority: "low",
      location: { lat: 16.7568, lng: -93.1293 },
      locationName: "Sala de Máquinas",
      responsiblePerson: "Técnico Martín",
      animals: [],
      expectedProduction: null,
      actualProduction: null,
      equipment: ["Ordeñadora", "Tanque de frío", "Bomba de agua"],
      notes: "Mantenimiento preventivo mensual",
      color: "#6B7280",
      recurring: "monthly"
    }
  ];

  // Cargar programación al montar el componente
  useEffect(() => {
    loadSchedules();
    loadProductionMetrics();
  }, [currentDate]);

  // Filtrar programación cuando cambian los filtros
  useEffect(() => {
    applyFilters();
  }, [schedules, filters, searchTerm]);

  // Función para cargar programación
  const loadSchedules = async () => {
    setIsLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSchedules(sampleSchedules);
      setError('');
    } catch (err) {
      setError('Error al cargar programación de producción');
      console.error('Error loading schedules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar métricas de producción
  const loadProductionMetrics = async () => {
    try {
      // Simular cálculo de métricas
      const metrics = {
        totalProduction: 2850, // litros de leche del mes
        dailyAverage: 95,
        weeklyTarget: 700,
        monthlyTarget: 3000,
        efficiency: 87.5,
        trends: [
          { date: '2025-06-01', value: 92 },
          { date: '2025-06-07', value: 95 },
          { date: '2025-06-14', value: 89 },
          { date: '2025-06-21', value: 97 },
          { date: '2025-06-28', value: 94 }
        ]
      };
      setProductionMetrics(metrics);
    } catch (err) {
      console.error('Error loading metrics:', err);
    }
  };

  // Función para aplicar filtros
  const applyFilters = () => {
    let filtered = [...schedules];

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(schedule =>
        schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.locationName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtros específicos
    if (filters.productionType) {
      filtered = filtered.filter(schedule => schedule.type === filters.productionType);
    }
    
    if (filters.status) {
      filtered = filtered.filter(schedule => schedule.status === filters.status);
    }
    
    if (filters.priority) {
      filtered = filtered.filter(schedule => schedule.priority === filters.priority);
    }
    
    if (filters.responsiblePerson) {
      filtered = filtered.filter(schedule => 
        schedule.responsiblePerson.toLowerCase().includes(filters.responsiblePerson.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(schedule => 
        schedule.locationName.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredSchedules(filtered);
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

  // Función para obtener programación de una fecha específica
  const getSchedulesForDate = (date) => {
    return filteredSchedules.filter(schedule => 
      isSameDay(schedule.date, date)
    );
  };

  // Función para obtener el ícono del tipo de producción
  const getProductionTypeIcon = (type) => {
    const icons = {
      milk: Milk,
      meat: Beef,
      breeding: Activity,
      feed: Package,
      maintenance: Settings
    };
    return icons[type] || CalendarIcon;
  };

  // Función para obtener el color según el estado
  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      delayed: 'bg-orange-100 text-orange-800'
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

  // Manejar click en una programación
  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowScheduleModal(true);
    if (onScheduleClick) onScheduleClick(schedule);
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

  // Crear nueva programación
  const handleCreateSchedule = () => {
    setShowCreateModal(true);
    if (onCreateSchedule) onCreateSchedule(selectedDate);
  };

  // Calcular producción del día
  const getDayProductionSummary = (date) => {
    const daySchedules = getSchedulesForDate(date);
    let totalMilk = 0;
    let totalMeat = 0;
    let totalFeed = 0;

    daySchedules.forEach(schedule => {
      if (schedule.type === 'milk' && schedule.actualProduction) {
        totalMilk += schedule.actualProduction;
      } else if (schedule.type === 'meat' && schedule.actualProduction) {
        totalMeat += schedule.actualProduction;
      } else if (schedule.type === 'feed' && schedule.actualProduction) {
        totalFeed += schedule.actualProduction;
      }
    });

    return { totalMilk, totalMeat, totalFeed };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <LoadingSpinner 
          variant="cow" 
          size="lg" 
          text="Cargando programación de producción..." 
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
      ref={scheduleRef}
    >
      {/* Header de la programación */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Programación de Producción - {format(currentDate, 'MMMM yyyy', { locale: es })}
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
            {/* Selector de vista */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setCurrentViewMode('calendar')}
                className={`px-3 py-2 text-sm transition-colors ${
                  currentViewMode === 'calendar'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentViewMode('timeline')}
                className={`px-3 py-2 text-sm transition-colors ${
                  currentViewMode === 'timeline'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar programación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Botón de filtros */}
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

            {/* Botón métricas */}
            {showMetrics && (
              <button
                onClick={() => setShowMetricsPanel(!showMetricsPanel)}
                className={`p-2 rounded-lg transition-colors ${
                  showMetricsPanel 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
              </button>
            )}

            {/* Botón crear programación */}
            {showCreateButton && (
              <motion.button
                onClick={handleCreateSchedule}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Programación
              </motion.button>
            )}
          </div>
        </div>

        {/* Panel de métricas */}
        <AnimatePresence>
          {showMetricsPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t pt-4 mt-4"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <motion.div
                  variants={metricVariants}
                  className="bg-blue-50 p-4 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Producción Total</p>
                      <div className="flex items-center space-x-1">
                        <CountUp to={productionMetrics.totalProduction} className="text-2xl font-bold text-blue-700" />
                        <span className="text-sm text-blue-600">L</span>
                      </div>
                    </div>
                    <Milk className="w-8 h-8 text-blue-600" />
                  </div>
                </motion.div>

                <motion.div
                  variants={metricVariants}
                  className="bg-green-50 p-4 rounded-lg border border-green-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Promedio Diario</p>
                      <div className="flex items-center space-x-1">
                        <CountUp to={productionMetrics.dailyAverage} className="text-2xl font-bold text-green-700" />
                        <span className="text-sm text-green-600">L</span>
                      </div>
                    </div>
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                </motion.div>

                <motion.div
                  variants={metricVariants}
                  className="bg-purple-50 p-4 rounded-lg border border-purple-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Meta Semanal</p>
                      <div className="flex items-center space-x-1">
                        <CountUp to={productionMetrics.weeklyTarget} className="text-2xl font-bold text-purple-700" />
                        <span className="text-sm text-purple-600">L</span>
                      </div>
                    </div>
                    <Calendar className="w-8 h-8 text-purple-600" />
                  </div>
                </motion.div>

                <motion.div
                  variants={metricVariants}
                  className="bg-orange-50 p-4 rounded-lg border border-orange-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Meta Mensual</p>
                      <div className="flex items-center space-x-1">
                        <CountUp to={productionMetrics.monthlyTarget} className="text-2xl font-bold text-orange-700" />
                        <span className="text-sm text-orange-600">L</span>
                      </div>
                    </div>
                    <BarChart3 className="w-8 h-8 text-orange-600" />
                  </div>
                </motion.div>

                <motion.div
                  variants={metricVariants}
                  className="bg-red-50 p-4 rounded-lg border border-red-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 font-medium">Eficiencia</p>
                      <div className="flex items-center space-x-1">
                        <CountUp to={productionMetrics.efficiency} decimals={1} suffix="%" className="text-2xl font-bold text-red-700" />
                      </div>
                    </div>
                    <Award className="w-8 h-8 text-red-600" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panel de filtros */}
        <AnimatePresence>
          {showFilterPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t pt-4 mt-4"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <select
                  value={filters.productionType}
                  onChange={(e) => setFilters(prev => ({ ...prev, productionType: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Todos los tipos</option>
                  {productionTypes.map(type => (
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
                  <option value="in_progress">En Progreso</option>
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
                  placeholder="Responsable..."
                  value={filters.responsiblePerson}
                  onChange={(e) => setFilters(prev => ({ ...prev, responsiblePerson: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                />

                <input
                  type="text"
                  placeholder="Ubicación..."
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vista del calendario */}
      {currentViewMode === 'calendar' && (
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
              const daySchedules = getSchedulesForDate(day);
              const productionSummary = getDayProductionSummary(day);

              return (
                <motion.div
                  key={index}
                  variants={dayVariants}
                  className={`min-h-28 p-2 border border-gray-100 cursor-pointer transition-all duration-200 ${
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

                  {/* Resumen de producción */}
                  {(productionSummary.totalMilk > 0 || productionSummary.totalMeat > 0) && (
                    <div className="text-xs space-y-1 mb-2">
                      {productionSummary.totalMilk > 0 && (
                        <div className="flex items-center space-x-1 text-blue-600">
                          <Milk className="w-3 h-3" />
                          <span>{productionSummary.totalMilk}L</span>
                        </div>
                      )}
                      {productionSummary.totalMeat > 0 && (
                        <div className="flex items-center space-x-1 text-red-600">
                          <Scale className="w-3 h-3" />
                          <span>{productionSummary.totalMeat}kg</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Programaciones del día */}
                  <div className="space-y-1">
                    {daySchedules.slice(0, 2).map((schedule, scheduleIndex) => {
                      const ScheduleIcon = getProductionTypeIcon(schedule.type);
                      return (
                        <motion.div
                          key={schedule.id}
                          variants={scheduleVariants}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScheduleClick(schedule);
                          }}
                          className="p-1 rounded text-xs cursor-pointer hover:shadow-md transition-shadow"
                          style={{ backgroundColor: schedule.color + '20', borderLeft: `3px solid ${schedule.color}` }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="flex items-center space-x-1">
                            <ScheduleIcon className="w-3 h-3" style={{ color: schedule.color }} />
                            <span className="font-medium truncate">{schedule.title}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Clock className="w-2 h-2" />
                            <span>{schedule.startTime}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                    
                    {/* Indicador de más programaciones */}
                    {daySchedules.length > 2 && (
                      <div className="text-xs text-gray-500 font-medium">
                        +{daySchedules.length - 2} más
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de programación */}
      <AnimatePresence>
        {showScheduleModal && selectedSchedule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalles de Programación
                </h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 flex items-center">
                    {React.createElement(getProductionTypeIcon(selectedSchedule.type), {
                      className: "w-5 h-5 mr-2",
                      style: { color: selectedSchedule.color }
                    })}
                    {selectedSchedule.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedSchedule.notes}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Fecha:</span>
                    <p className="font-medium">{format(selectedSchedule.date, 'dd/MM/yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Horario:</span>
                    <p className="font-medium">{selectedSchedule.startTime} - {selectedSchedule.endTime}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Responsable:</span>
                    <p className="font-medium">{selectedSchedule.responsiblePerson}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Ubicación:</span>
                    <p className="font-medium">{selectedSchedule.locationName}</p>
                  </div>
                </div>

                {selectedSchedule.expectedProduction && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Producción</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Esperada:</span>
                        <p className="font-medium">
                          {selectedSchedule.expectedProduction}
                          {selectedSchedule.type === 'milk' ? 'L' : 'kg'}
                        </p>
                      </div>
                      {selectedSchedule.actualProduction && (
                        <div>
                          <span className="text-gray-500">Real:</span>
                          <p className="font-medium">
                            {selectedSchedule.actualProduction}
                            {selectedSchedule.type === 'milk' ? 'L' : 'kg'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSchedule.status)}`}>
                    {selectedSchedule.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedSchedule.priority)}`}>
                    {selectedSchedule.priority}
                  </span>
                  {selectedSchedule.recurring && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {selectedSchedule.recurring}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t">
                  <button className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </button>
                  <button className="flex items-center px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <MapPin className="w-4 h-4 mr-1" />
                    Ver Ubicación
                  </button>
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

export default ProductionSchedule;