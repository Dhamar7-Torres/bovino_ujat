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
  Syringe,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Bell,
  Target,
  Eye,
  Edit,
  Trash2,
  Download,
  Settings,
  MoreVertical,
  User,
  Cow,
  Baby,
  Heart,
  Zap,
  Award,
  Star,
  Thermometer,
  Microscope,
  Timer,
  RefreshCw,
  Send,
  X,
  FileText,
  TrendingUp,
  BarChart3,
  PieChart,
  ClipboardCheck,
  Calendar
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, isToday, addMonths, subMonths, differenceInDays, isBefore, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';
import LoadingSpinner from '../animations/LoadingSpinner';
import CountUp from '../animations/CountUp';

const VaccinationSchedule = ({ 
  onVaccinationClick,
  onDateSelect,
  onCreateVaccination,
  initialDate = new Date(),
  height = "700px",
  showStats = true,
  showCreateButton = true,
  vaccineTypes = ['brucelosis', 'rabia', 'fiebre_aftosa', 'clostridiosis', 'respiratory', 'reproductive'],
  viewMode = 'calendar', // 'calendar', 'list', 'grid'
  className = ""
}) => {
  
  // Estados principales
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [vaccinations, setVaccinations] = useState([]);
  const [filteredVaccinations, setFilteredVaccinations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    vaccineType: '',
    status: '',
    priority: '',
    veterinarian: '',
    ageGroup: '',
    location: ''
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Estados para UI
  const [showVaccinationModal, setShowVaccinationModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(showStats);
  const [selectedVaccinations, setSelectedVaccinations] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Estados para estadísticas de vacunación
  const [vaccinationStats, setVaccinationStats] = useState({
    totalScheduled: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    coverage: 0,
    byType: {},
    upcomingAlerts: 0,
    effectiveness: 0
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

  const vaccinationVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Datos de ejemplo para programación de vacunación
  const sampleVaccinations = [
    {
      id: 1,
      animalId: "COW001",
      animalName: "Bessie",
      tagNumber: "001",
      vaccineType: "brucelosis",
      vaccineName: "Strain 19",
      scheduledDate: new Date(2025, 5, 30),
      scheduledTime: "09:00",
      status: "scheduled",
      priority: "high",
      veterinarian: "Dr. García",
      location: { lat: 16.7569, lng: -93.1292 },
      locationName: "Corral Norte",
      ageGroup: "adult",
      weight: 450,
      lastVaccination: new Date(2024, 5, 30),
      nextDue: new Date(2026, 5, 30),
      batch: "BRU2025001",
      dosage: "2ml",
      route: "subcutaneous",
      notes: "Primera vacunación anual contra brucelosis",
      color: "#3B82F6",
      cost: 25.50,
      requiredFasting: false,
      followUpRequired: true,
      followUpDate: new Date(2025, 6, 7)
    },
    {
      id: 2,
      animalId: "COW002",
      animalName: "Luna",
      tagNumber: "002",
      vaccineType: "rabia",
      vaccineName: "Rabisin",
      scheduledDate: new Date(2025, 6, 2),
      scheduledTime: "14:00",
      status: "completed",
      priority: "medium",
      veterinarian: "Dr. López",
      location: { lat: 16.7570, lng: -93.1295 },
      locationName: "Establo Principal",
      ageGroup: "adult",
      weight: 520,
      lastVaccination: new Date(2024, 6, 2),
      nextDue: new Date(2026, 6, 2),
      batch: "RAB2025003",
      dosage: "1ml",
      route: "intramuscular",
      notes: "Vacuna antirrábica anual",
      color: "#10B981",
      cost: 18.75,
      requiredFasting: false,
      followUpRequired: false,
      completedDate: new Date(2025, 6, 2),
      completedTime: "14:30",
      reaction: "none"
    },
    {
      id: 3,
      animalId: "COW003",
      animalName: "Estrella",
      tagNumber: "003",
      vaccineType: "fiebre_aftosa",
      vaccineName: "Aftopor",
      scheduledDate: new Date(2025, 6, 5),
      scheduledTime: "07:30",
      status: "pending",
      priority: "high",
      veterinarian: "Dr. Martínez",
      location: { lat: 16.7565, lng: -93.1290 },
      locationName: "Corral de Aislamiento",
      ageGroup: "young",
      weight: 280,
      lastVaccination: null,
      nextDue: new Date(2025, 12, 5),
      batch: "AFT2025007",
      dosage: "3ml",
      route: "intramuscular",
      notes: "Primera vacuna contra fiebre aftosa",
      color: "#F59E0B",
      cost: 32.00,
      requiredFasting: true,
      followUpRequired: true,
      followUpDate: new Date(2025, 6, 12)
    },
    {
      id: 4,
      animalId: "COW004",
      animalName: "Paloma",
      tagNumber: "004",
      vaccineType: "clostridiosis",
      vaccineName: "Covexin 8",
      scheduledDate: new Date(2025, 6, 8),
      scheduledTime: "10:00",
      status: "overdue",
      priority: "urgent",
      veterinarian: "Dr. García",
      location: { lat: 16.7572, lng: -93.1288 },
      locationName: "Corral Sur",
      ageGroup: "adult",
      weight: 475,
      lastVaccination: new Date(2024, 0, 15),
      nextDue: new Date(2025, 6, 1),
      batch: "CLO2025002",
      dosage: "2ml",
      route: "subcutaneous",
      notes: "Vacuna vencida - aplicar urgente",
      color: "#DC2626",
      cost: 28.90,
      requiredFasting: false,
      followUpRequired: true,
      followUpDate: new Date(2025, 6, 15),
      daysOverdue: 7
    },
    {
      id: 5,
      animalId: "CALF001",
      animalName: "Ternero Junior",
      tagNumber: "101",
      vaccineType: "respiratory",
      vaccineName: "Bovishield Gold",
      scheduledDate: new Date(2025, 6, 10),
      scheduledTime: "08:00",
      status: "scheduled",
      priority: "medium",
      veterinarian: "Dr. López",
      location: { lat: 16.7568, lng: -93.1293 },
      locationName: "Corral de Terneros",
      ageGroup: "calf",
      weight: 85,
      lastVaccination: null,
      nextDue: new Date(2025, 9, 10),
      batch: "RES2025004",
      dosage: "2ml",
      route: "intramuscular",
      notes: "Primera vacuna respiratoria para ternero",
      color: "#8B5CF6",
      cost: 15.25,
      requiredFasting: false,
      followUpRequired: true,
      followUpDate: new Date(2025, 6, 24),
      motherTag: "002"
    },
    {
      id: 6,
      animalId: "COW005",
      animalName: "Princesa",
      tagNumber: "005",
      vaccineType: "reproductive",
      vaccineName: "Cattlemaster 4",
      scheduledDate: new Date(2025, 6, 12),
      scheduledTime: "15:00",
      status: "scheduled",
      priority: "medium",
      veterinarian: "Dr. Martínez",
      location: { lat: 16.7571, lng: -93.1291 },
      locationName: "Corral de Reproducción",
      ageGroup: "adult",
      weight: 510,
      lastVaccination: new Date(2024, 6, 12),
      nextDue: new Date(2026, 6, 12),
      batch: "REP2025001",
      dosage: "5ml",
      route: "intramuscular",
      notes: "Vacuna reproductiva anual para vaca gestante",
      color: "#EC4899",
      cost: 42.00,
      requiredFasting: false,
      followUpRequired: true,
      followUpDate: new Date(2025, 6, 19),
      gestationStage: "second_trimester"
    }
  ];

  // Cargar vacunaciones al montar el componente
  useEffect(() => {
    loadVaccinations();
    loadVaccinationStats();
  }, [currentDate]);

  // Filtrar vacunaciones cuando cambian los filtros
  useEffect(() => {
    applyFilters();
  }, [vaccinations, filters, searchTerm]);

  // Función para cargar vacunaciones
  const loadVaccinations = async () => {
    setIsLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVaccinations(sampleVaccinations);
      setError('');
    } catch (err) {
      setError('Error al cargar programación de vacunación');
      console.error('Error loading vaccinations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar estadísticas de vacunación
  const loadVaccinationStats = async () => {
    try {
      // Simular cálculo de estadísticas
      const total = sampleVaccinations.length;
      const completed = sampleVaccinations.filter(v => v.status === 'completed').length;
      const pending = sampleVaccinations.filter(v => v.status === 'scheduled' || v.status === 'pending').length;
      const overdue = sampleVaccinations.filter(v => v.status === 'overdue').length;
      const coverage = ((completed / total) * 100).toFixed(1);
      
      const byType = {};
      sampleVaccinations.forEach(v => {
        byType[v.vaccineType] = (byType[v.vaccineType] || 0) + 1;
      });

      const stats = {
        totalScheduled: total,
        completed,
        pending,
        overdue,
        coverage: parseFloat(coverage),
        byType,
        upcomingAlerts: pending,
        effectiveness: 94.2
      };
      
      setVaccinationStats(stats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  // Función para aplicar filtros
  const applyFilters = () => {
    let filtered = [...vaccinations];

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(vaccination =>
        vaccination.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaccination.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaccination.vaccineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaccination.veterinarian.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaccination.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtros específicos
    if (filters.vaccineType) {
      filtered = filtered.filter(vaccination => vaccination.vaccineType === filters.vaccineType);
    }
    
    if (filters.status) {
      filtered = filtered.filter(vaccination => vaccination.status === filters.status);
    }
    
    if (filters.priority) {
      filtered = filtered.filter(vaccination => vaccination.priority === filters.priority);
    }
    
    if (filters.veterinarian) {
      filtered = filtered.filter(vaccination => 
        vaccination.veterinarian.toLowerCase().includes(filters.veterinarian.toLowerCase())
      );
    }

    if (filters.ageGroup) {
      filtered = filtered.filter(vaccination => vaccination.ageGroup === filters.ageGroup);
    }

    if (filters.location) {
      filtered = filtered.filter(vaccination => 
        vaccination.locationName.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredVaccinations(filtered);
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

  // Función para obtener vacunaciones de una fecha específica
  const getVaccinationsForDate = (date) => {
    return filteredVaccinations.filter(vaccination => 
      isSameDay(vaccination.scheduledDate, date)
    );
  };

  // Función para obtener el ícono del tipo de vacuna
  const getVaccineTypeIcon = (type) => {
    const icons = {
      brucelosis: Shield,
      rabia: Zap,
      fiebre_aftosa: AlertTriangle,
      clostridiosis: Microscope,
      respiratory: Activity,
      reproductive: Heart
    };
    return icons[type] || Syringe;
  };

  // Función para obtener el color según el estado
  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Función para obtener el color de prioridad
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-200 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-600';
  };

  // Función para obtener alertas del día
  const getDayAlerts = (date) => {
    const dayVaccinations = getVaccinationsForDate(date);
    const alerts = {
      overdue: dayVaccinations.filter(v => v.status === 'overdue').length,
      urgent: dayVaccinations.filter(v => v.priority === 'urgent').length,
      followUp: dayVaccinations.filter(v => v.followUpRequired && isSameDay(v.followUpDate, date)).length
    };
    return alerts;
  };

  // Manejar click en una fecha
  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (onDateSelect) onDateSelect(date);
  };

  // Manejar click en una vacunación
  const handleVaccinationClick = (vaccination) => {
    setSelectedVaccination(vaccination);
    setShowVaccinationModal(true);
    if (onVaccinationClick) onVaccinationClick(vaccination);
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

  // Crear nueva vacunación
  const handleCreateVaccination = () => {
    setShowCreateModal(true);
    if (onCreateVaccination) onCreateVaccination(selectedDate);
  };

  // Función para formatear el nombre de la vacuna
  const formatVaccineTypeName = (type) => {
    const names = {
      brucelosis: 'Brucelosis',
      rabia: 'Rabia',
      fiebre_aftosa: 'Fiebre Aftosa',
      clostridiosis: 'Clostridiosis',
      respiratory: 'Respiratoria',
      reproductive: 'Reproductiva'
    };
    return names[type] || type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <LoadingSpinner 
          variant="cow" 
          size="lg" 
          text="Cargando programación de vacunación..." 
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
              Programación de Vacunación - {format(currentDate, 'MMMM yyyy', { locale: es })}
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
                onClick={() => setCurrentViewMode('list')}
                className={`px-3 py-2 text-sm transition-colors ${
                  currentViewMode === 'list'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar vacunaciones..."
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

            {/* Botón estadísticas */}
            {showStats && (
              <button
                onClick={() => setShowStatsPanel(!showStatsPanel)}
                className={`p-2 rounded-lg transition-colors ${
                  showStatsPanel 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
              </button>
            )}

            {/* Botón crear vacunación */}
            {showCreateButton && (
              <motion.button
                onClick={handleCreateVaccination}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Vacunación
              </motion.button>
            )}
          </div>
        </div>

        {/* Panel de estadísticas */}
        <AnimatePresence>
          {showStatsPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t pt-4 mt-4"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <motion.div
                  variants={statsVariants}
                  className="bg-blue-50 p-4 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total</p>
                      <CountUp to={vaccinationStats.totalScheduled} className="text-2xl font-bold text-blue-700" />
                    </div>
                    <Syringe className="w-6 h-6 text-blue-600" />
                  </div>
                </motion.div>

                <motion.div
                  variants={statsVariants}
                  className="bg-green-50 p-4 rounded-lg border border-green-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Completadas</p>
                      <CountUp to={vaccinationStats.completed} className="text-2xl font-bold text-green-700" />
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </motion.div>

                <motion.div
                  variants={statsVariants}
                  className="bg-yellow-50 p-4 rounded-lg border border-yellow-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600 font-medium">Pendientes</p>
                      <CountUp to={vaccinationStats.pending} className="text-2xl font-bold text-yellow-700" />
                    </div>
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </motion.div>

                <motion.div
                  variants={statsVariants}
                  className="bg-red-50 p-4 rounded-lg border border-red-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 font-medium">Vencidas</p>
                      <CountUp to={vaccinationStats.overdue} className="text-2xl font-bold text-red-700" />
                    </div>
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </motion.div>

                <motion.div
                  variants={statsVariants}
                  className="bg-purple-50 p-4 rounded-lg border border-purple-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Cobertura</p>
                      <CountUp to={vaccinationStats.coverage} decimals={1} suffix="%" className="text-2xl font-bold text-purple-700" />
                    </div>
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                </motion.div>

                <motion.div
                  variants={statsVariants}
                  className="bg-orange-50 p-4 rounded-lg border border-orange-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Alertas</p>
                      <CountUp to={vaccinationStats.upcomingAlerts} className="text-2xl font-bold text-orange-700" />
                    </div>
                    <Bell className="w-6 h-6 text-orange-600" />
                  </div>
                </motion.div>

                <motion.div
                  variants={statsVariants}
                  className="bg-teal-50 p-4 rounded-lg border border-teal-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-teal-600 font-medium">Efectividad</p>
                      <CountUp to={vaccinationStats.effectiveness} decimals={1} suffix="%" className="text-2xl font-bold text-teal-700" />
                    </div>
                    <Award className="w-6 h-6 text-teal-600" />
                  </div>
                </motion.div>

                <motion.div
                  variants={statsVariants}
                  className="bg-indigo-50 p-4 rounded-lg border border-indigo-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-indigo-600 font-medium">Animales</p>
                      <CountUp to={42} className="text-2xl font-bold text-indigo-700" />
                    </div>
                    <Cow className="w-6 h-6 text-indigo-600" />
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
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <select
                  value={filters.vaccineType}
                  onChange={(e) => setFilters(prev => ({ ...prev, vaccineType: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Todos los tipos</option>
                  {vaccineTypes.map(type => (
                    <option key={type} value={type}>
                      {formatVaccineTypeName(type)}
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
                  <option value="overdue">Vencido</option>
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

                <select
                  value={filters.ageGroup}
                  onChange={(e) => setFilters(prev => ({ ...prev, ageGroup: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Todas las edades</option>
                  <option value="calf">Terneros</option>
                  <option value="young">Jóvenes</option>
                  <option value="adult">Adultos</option>
                  <option value="senior">Mayores</option>
                </select>

                <input
                  type="text"
                  placeholder="Veterinario..."
                  value={filters.veterinarian}
                  onChange={(e) => setFilters(prev => ({ ...prev, veterinarian: e.target.value }))}
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
              const dayVaccinations = getVaccinationsForDate(day);
              const dayAlerts = getDayAlerts(day);

              return (
                <motion.div
                  key={index}
                  variants={dayVariants}
                  className={`min-h-32 p-2 border border-gray-100 cursor-pointer transition-all duration-200 ${
                    isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                  } ${isDayToday ? 'bg-blue-50 border-blue-300' : ''} ${
                    isSelected ? 'bg-green-50 border-green-300' : ''
                  }`}
                  onClick={() => handleDateClick(day)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Número del día */}
                  <div className={`text-sm font-medium mb-1 flex items-center justify-between ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  } ${isDayToday ? 'text-blue-600 font-bold' : ''}`}>
                    <span>{format(day, 'd')}</span>
                    
                    {/* Indicadores de alerta */}
                    <div className="flex space-x-1">
                      {dayAlerts.overdue > 0 && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                      {dayAlerts.urgent > 0 && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      )}
                      {dayAlerts.followUp > 0 && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* Vacunaciones del día */}
                  <div className="space-y-1">
                    {dayVaccinations.slice(0, 3).map((vaccination, vaccinationIndex) => {
                      const VaccineIcon = getVaccineTypeIcon(vaccination.vaccineType);
                      return (
                        <motion.div
                          key={vaccination.id}
                          variants={vaccinationVariants}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVaccinationClick(vaccination);
                          }}
                          className="p-1 rounded text-xs cursor-pointer hover:shadow-md transition-shadow"
                          style={{ backgroundColor: vaccination.color + '20', borderLeft: `3px solid ${vaccination.color}` }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="flex items-center space-x-1">
                            <VaccineIcon className="w-3 h-3" style={{ color: vaccination.color }} />
                            <span className="font-medium truncate">
                              {vaccination.animalName} #{vaccination.tagNumber}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 text-gray-500">
                              <Clock className="w-2 h-2" />
                              <span>{vaccination.scheduledTime}</span>
                            </div>
                            <span className={`px-1 py-0.5 rounded text-xs ${getStatusColor(vaccination.status)}`}>
                              {vaccination.status.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {formatVaccineTypeName(vaccination.vaccineType)}
                          </div>
                        </motion.div>
                      );
                    })}
                    
                    {/* Indicador de más vacunaciones */}
                    {dayVaccinations.length > 3 && (
                      <div className="text-xs text-gray-500 font-medium">
                        +{dayVaccinations.length - 3} más
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de vacunación */}
      <AnimatePresence>
        {showVaccinationModal && selectedVaccination && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowVaccinationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalles de Vacunación
                </h3>
                <button
                  onClick={() => setShowVaccinationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Información del animal */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Cow className="w-5 h-5 mr-2 text-gray-600" />
                    Información del Animal
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Nombre:</span>
                      <p className="font-medium">{selectedVaccination.animalName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Número de Tag:</span>
                      <p className="font-medium">#{selectedVaccination.tagNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Grupo de Edad:</span>
                      <p className="font-medium capitalize">{selectedVaccination.ageGroup}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Peso:</span>
                      <p className="font-medium">{selectedVaccination.weight} kg</p>
                    </div>
                  </div>
                </div>

                {/* Información de la vacuna */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Syringe className="w-5 h-5 mr-2 text-blue-600" />
                    Información de la Vacuna
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Tipo:</span>
                      <p className="font-medium">{formatVaccineTypeName(selectedVaccination.vaccineType)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Nombre Comercial:</span>
                      <p className="font-medium">{selectedVaccination.vaccineName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Lote:</span>
                      <p className="font-medium">{selectedVaccination.batch}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Dosis:</span>
                      <p className="font-medium">{selectedVaccination.dosage}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Vía de Administración:</span>
                      <p className="font-medium capitalize">{selectedVaccination.route}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Costo:</span>
                      <p className="font-medium">${selectedVaccination.cost}</p>
                    </div>
                  </div>
                </div>

                {/* Programación */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Fecha Programada:</span>
                    <p className="font-medium">{format(selectedVaccination.scheduledDate, 'dd/MM/yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Hora:</span>
                    <p className="font-medium">{selectedVaccination.scheduledTime}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Veterinario:</span>
                    <p className="font-medium">{selectedVaccination.veterinarian}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Ubicación:</span>
                    <p className="font-medium">{selectedVaccination.locationName}</p>
                  </div>
                </div>

                {/* Fechas importantes */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-yellow-600" />
                    Fechas Importantes
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedVaccination.lastVaccination && (
                      <div>
                        <span className="text-gray-500">Última Vacunación:</span>
                        <p className="font-medium">{format(selectedVaccination.lastVaccination, 'dd/MM/yyyy')}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Próxima Vacuna:</span>
                      <p className="font-medium">{format(selectedVaccination.nextDue, 'dd/MM/yyyy')}</p>
                    </div>
                    {selectedVaccination.followUpRequired && (
                      <div>
                        <span className="text-gray-500">Seguimiento:</span>
                        <p className="font-medium">{format(selectedVaccination.followUpDate, 'dd/MM/yyyy')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Estados y notas */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedVaccination.status)}`}>
                      {selectedVaccination.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedVaccination.priority)}`}>
                      {selectedVaccination.priority}
                    </span>
                    {selectedVaccination.requiredFasting && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                        Ayuno requerido
                      </span>
                    )}
                  </div>
                  
                  {selectedVaccination.notes && (
                    <div>
                      <span className="text-gray-500 text-sm">Notas:</span>
                      <p className="text-sm text-gray-700 mt-1">{selectedVaccination.notes}</p>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center space-x-3 pt-4 border-t">
                  <button className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </button>
                  <button className="flex items-center px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar Completada
                  </button>
                  <button className="flex items-center px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <MapPin className="w-4 h-4 mr-2" />
                    Ver Ubicación
                  </button>
                  <button className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Bell className="w-4 h-4 mr-2" />
                    Recordatorio
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

export default VaccinationSchedule;