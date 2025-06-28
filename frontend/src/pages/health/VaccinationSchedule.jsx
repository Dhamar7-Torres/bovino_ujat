// Frontend/src/pages/health/VaccinationSchedule.jsx

import React, { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  MapPin,
  User,
  Syringe,
  Shield,
  AlertTriangle,
  CheckCircle,
  Bell,
  Target,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  X,
  FileText,
  Activity,
  TrendingUp,
  Award,
  Users,
  CalendarDays,
  ClipboardCheck,
  Zap,
  Heart,
  Cow,
  Baby,
  Microscope,
  Thermometer,
  Timer,
  Settings,
  Send,
  Star,
  BarChart3
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const VaccinationSchedule = () => {
  // Estados para manejar los datos y la UI
  const [vaccinations, setVaccinations] = useState([]);
  const [filteredVaccinations, setFilteredVaccinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar', 'list', 'grid'

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    vaccineType: '',
    status: '',
    veterinarian: '',
    dateRange: 'upcoming',
    priority: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('scheduledDate');
  const [sortOrder, setSortOrder] = useState('asc');

  // Estados para calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Estados para acciones
  const [selectedVaccinations, setSelectedVaccinations] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingVaccinationId, setDeletingVaccinationId] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showBulkScheduleModal, setShowBulkScheduleModal] = useState(false);

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

  // Cargar vacunaciones al montar el componente
  useEffect(() => {
    fetchVaccinations();
    
    // Mostrar mensaje de éxito si viene de otra página
    if (location.state?.message) {
      console.log(location.state.message);
    }
  }, []);

  // Aplicar filtros cuando cambien los datos o filtros
  useEffect(() => {
    applyFilters();
  }, [vaccinations, searchTerm, filters, sortBy, sortOrder]);

  // Obtener lista de vacunaciones
  const fetchVaccinations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/health/vaccinations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVaccinations(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load vaccination schedule');
      }
    } catch (error) {
      console.error('Fetch vaccinations error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos de ejemplo mientras se carga la API real
  const mockVaccinations = [
    {
      id: 1,
      animal: 'Luna',
      tagNumber: 'L089',
      vaccineType: 'FMD (Foot and Mouth)',
      vaccineName: 'Aftovaxpur',
      manufacturer: 'Boehringer Ingelheim',
      batchNumber: 'FMD2025-001',
      scheduledDate: '2025-06-28',
      scheduledTime: '09:00',
      veterinarian: 'Dr. Sarah Martinez',
      location: 'Main Barn',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      status: 'Scheduled',
      priority: 'High',
      dosage: '2ml',
      administrationRoute: 'Subcutaneous',
      notes: 'Annual FMD booster vaccination - mandatory',
      lastVaccination: '2024-06-28',
      nextDue: '2026-06-28',
      reactions: null,
      certificateRequired: true,
      cost: 25.50,
      createdAt: '2025-06-20T10:30:00Z'
    },
    {
      id: 2,
      animal: 'Thunder',
      tagNumber: 'T156',
      vaccineType: 'Brucellosis',
      vaccineName: 'RB51',
      manufacturer: 'Colorado Serum',
      batchNumber: 'BRU2025-008',
      scheduledDate: '2025-06-29',
      scheduledTime: '14:30',
      veterinarian: 'Dr. Juan Rodriguez',
      location: 'Treatment Chute',
      coordinates: { lat: 17.9885, lng: -92.9462 },
      status: 'Scheduled',
      priority: 'High',
      dosage: '2ml',
      administrationRoute: 'Subcutaneous',
      notes: 'First-time brucellosis vaccination for young bull',
      lastVaccination: null,
      nextDue: '2026-06-29',
      reactions: null,
      certificateRequired: true,
      cost: 35.00,
      createdAt: '2025-06-22T08:15:00Z'
    },
    {
      id: 3,
      animal: 'Bella',
      tagNumber: 'B247',
      vaccineType: 'IBR/BVD',
      vaccineName: 'Express FP',
      manufacturer: 'Boehringer Ingelheim',
      batchNumber: 'IBR2025-012',
      scheduledDate: '2025-06-25',
      scheduledTime: '11:00',
      veterinarian: 'Dr. Sarah Martinez',
      location: 'Medical Bay',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      status: 'Completed',
      priority: 'Medium',
      dosage: '5ml',
      administrationRoute: 'Intramuscular',
      notes: 'Completed successfully. No adverse reactions observed.',
      lastVaccination: '2025-06-25',
      nextDue: '2026-06-25',
      reactions: 'None',
      certificateRequired: false,
      cost: 42.75,
      createdAt: '2025-06-18T14:45:00Z'
    },
    {
      id: 4,
      animal: 'Daisy',
      tagNumber: 'D234',
      vaccineType: 'Clostridial',
      vaccineName: 'Covexin 8',
      manufacturer: 'MSD Animal Health',
      batchNumber: 'CLO2025-005',
      scheduledDate: '2025-06-30',
      scheduledTime: '10:15',
      veterinarian: 'Dr. Juan Rodriguez',
      location: 'Pasture A',
      coordinates: { lat: 17.9878, lng: -92.9502 },
      status: 'Scheduled',
      priority: 'Medium',
      dosage: '2ml',
      administrationRoute: 'Subcutaneous',
      notes: 'Annual clostridial disease prevention',
      lastVaccination: '2024-06-30',
      nextDue: '2026-06-30',
      reactions: null,
      certificateRequired: false,
      cost: 18.25,
      createdAt: '2025-06-15T16:20:00Z'
    },
    {
      id: 5,
      animal: 'Max',
      tagNumber: 'M456',
      vaccineType: 'Leptospirosis',
      vaccineName: 'Spirovac',
      manufacturer: 'Ceva Animal Health',
      batchNumber: 'LEP2025-003',
      scheduledDate: '2025-06-26',
      scheduledTime: '15:45',
      veterinarian: 'Dr. Sarah Martinez',
      location: 'Main Barn',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      status: 'Completed',
      priority: 'Medium',
      dosage: '2ml',
      administrationRoute: 'Subcutaneous',
      notes: 'Vaccination completed. Mild local reaction observed.',
      lastVaccination: '2025-06-26',
      nextDue: '2026-06-26',
      reactions: 'Mild swelling at injection site',
      certificateRequired: false,
      cost: 28.00,
      createdAt: '2025-06-20T09:30:00Z'
    },
    {
      id: 6,
      animal: 'Sophie',
      tagNumber: 'S789',
      vaccineType: 'Anthrax',
      vaccineName: 'Anthrax Spore Vaccine',
      manufacturer: 'Colorado Serum',
      batchNumber: 'ANT2025-001',
      scheduledDate: '2025-06-22',
      scheduledTime: '08:30',
      veterinarian: 'Dr. Emergency Vet',
      location: 'Quarantine Area',
      coordinates: { lat: 17.9888, lng: -92.9465 },
      status: 'Overdue',
      priority: 'High',
      dosage: '1ml',
      administrationRoute: 'Subcutaneous',
      notes: 'URGENT: Overdue anthrax vaccination - schedule immediately',
      lastVaccination: '2024-06-22',
      nextDue: '2025-06-22',
      reactions: null,
      certificateRequired: true,
      cost: 15.75,
      createdAt: '2025-06-10T11:45:00Z'
    },
    {
      id: 7,
      animal: 'Rocky',
      tagNumber: 'R321',
      vaccineType: 'Pasteurella',
      vaccineName: 'One Shot',
      manufacturer: 'Zoetis',
      batchNumber: 'PAS2025-007',
      scheduledDate: '2025-07-02',
      scheduledTime: '13:20',
      veterinarian: 'Dr. Juan Rodriguez',
      location: 'Calf Pen',
      coordinates: { lat: 17.9890, lng: -92.9458 },
      status: 'Scheduled',
      priority: 'Low',
      dosage: '2ml',
      administrationRoute: 'Subcutaneous',
      notes: 'Respiratory disease prevention for young calves',
      lastVaccination: null,
      nextDue: '2026-07-02',
      reactions: null,
      certificateRequired: false,
      cost: 22.50,
      createdAt: '2025-06-25T13:15:00Z'
    },
    {
      id: 8,
      animal: 'Molly',
      tagNumber: 'M159',
      vaccineType: 'Rotavirus/Coronavirus',
      vaccineName: 'ScourGuard 4KC',
      manufacturer: 'Zoetis',
      batchNumber: 'ROT2025-004',
      scheduledDate: '2025-06-20',
      scheduledTime: '16:00',
      veterinarian: 'Dr. Sarah Martinez',
      location: 'Maternity Pen',
      coordinates: { lat: 17.9892, lng: -92.9468 },
      status: 'Cancelled',
      priority: 'Medium',
      dosage: '2ml',
      administrationRoute: 'Intramuscular',
      notes: 'Cancelled due to animal illness. Reschedule when recovered.',
      lastVaccination: '2024-06-20',
      nextDue: '2025-12-20',
      reactions: null,
      certificateRequired: false,
      cost: 31.25,
      createdAt: '2025-06-12T10:00:00Z'
    }
  ];

  // Usar datos mock si no hay vacunaciones reales
  const vaccinationsData = vaccinations.length > 0 ? vaccinations : mockVaccinations;

  // Aplicar filtros y búsqueda
  const applyFilters = () => {
    let filtered = [...vaccinationsData];

    // Aplicar búsqueda por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(vaccination =>
        vaccination.animal.toLowerCase().includes(term) ||
        vaccination.tagNumber.toLowerCase().includes(term) ||
        vaccination.vaccineType.toLowerCase().includes(term) ||
        vaccination.vaccineName.toLowerCase().includes(term) ||
        vaccination.veterinarian.toLowerCase().includes(term) ||
        vaccination.location.toLowerCase().includes(term)
      );
    }

    // Aplicar filtros específicos
    if (filters.vaccineType) {
      filtered = filtered.filter(vaccination => vaccination.vaccineType === filters.vaccineType);
    }

    if (filters.status) {
      filtered = filtered.filter(vaccination => vaccination.status === filters.status);
    }

    if (filters.veterinarian) {
      filtered = filtered.filter(vaccination => vaccination.veterinarian === filters.veterinarian);
    }

    if (filters.priority) {
      filtered = filtered.filter(vaccination => vaccination.priority === filters.priority);
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const today = new Date();
      
      switch (filters.dateRange) {
        case 'overdue':
          filtered = filtered.filter(vaccination => {
            const schedDate = new Date(vaccination.scheduledDate);
            return schedDate < today && vaccination.status !== 'Completed';
          });
          break;
        case 'today':
          filtered = filtered.filter(vaccination => {
            const schedDate = new Date(vaccination.scheduledDate);
            return schedDate.toDateString() === today.toDateString();
          });
          break;
        case 'week':
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(vaccination => {
            const schedDate = new Date(vaccination.scheduledDate);
            return schedDate >= today && schedDate <= weekFromNow;
          });
          break;
        case 'month':
          const monthFromNow = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
          filtered = filtered.filter(vaccination => {
            const schedDate = new Date(vaccination.scheduledDate);
            return schedDate >= today && schedDate <= monthFromNow;
          });
          break;
        case 'upcoming':
          filtered = filtered.filter(vaccination => {
            const schedDate = new Date(vaccination.scheduledDate);
            return schedDate >= today;
          });
          break;
        default:
          break;
      }
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Manejo especial para fechas
      if (sortBy === 'scheduledDate' || sortBy === 'lastVaccination' || sortBy === 'nextDue') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Manejo especial para números
      if (sortBy === 'cost') {
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

    setFilteredVaccinations(filtered);
  };

  // Obtener icono del tipo de vacuna
  const getVaccineTypeIcon = (type) => {
    switch (type) {
      case 'FMD (Foot and Mouth)': return Shield;
      case 'Brucellosis': return Microscope;
      case 'IBR/BVD': return Heart;
      case 'Clostridial': return Zap;
      case 'Leptospirosis': return Activity;
      case 'Anthrax': return AlertTriangle;
      case 'Pasteurella': return Target;
      case 'Rotavirus/Coronavirus': return Baby;
      default: return Syringe;
    }
  };

  // Obtener color del tipo de vacuna
  const getVaccineTypeColor = (type) => {
    switch (type) {
      case 'FMD (Foot and Mouth)': return 'bg-red-500 text-white';
      case 'Brucellosis': return 'bg-yellow-500 text-white';
      case 'IBR/BVD': return 'bg-pink-500 text-white';
      case 'Clostridial': return 'bg-purple-500 text-white';
      case 'Leptospirosis': return 'bg-green-500 text-white';
      case 'Anthrax': return 'bg-orange-500 text-white';
      case 'Pasteurella': return 'bg-blue-500 text-white';
      case 'Rotavirus/Coronavirus': return 'bg-indigo-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'text-blue-600 bg-blue-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Overdue': return 'text-red-600 bg-red-100';
      case 'Cancelled': return 'text-gray-600 bg-gray-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Obtener color de prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Obtener días hasta la vacunación
  const getDaysUntilVaccination = (scheduledDate) => {
    const today = new Date();
    const vaccDate = new Date(scheduledDate);
    const diffTime = vaccDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  // Manejar eliminación de vacunación
  const handleDelete = async (vaccinationId) => {
    setDeletingVaccinationId(vaccinationId);
    
    try {
      const response = await fetch(`/api/health/vaccinations/${vaccinationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setVaccinations(prev => prev.filter(vaccination => vaccination.id !== vaccinationId));
        setShowDeleteModal(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete vaccination');
      }
    } catch (error) {
      console.error('Delete vaccination error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setDeletingVaccinationId(null);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      vaccineType: '',
      status: '',
      veterinarian: '',
      dateRange: 'upcoming',
      priority: ''
    });
    setShowFilters(false);
  };

  // Calcular estadísticas
  const stats = {
    total: vaccinationsData.length,
    scheduled: vaccinationsData.filter(v => v.status === 'Scheduled').length,
    completed: vaccinationsData.filter(v => v.status === 'Completed').length,
    overdue: vaccinationsData.filter(v => {
      const today = new Date();
      const schedDate = new Date(v.scheduledDate);
      return schedDate < today && v.status !== 'Completed';
    }).length,
    totalCost: vaccinationsData.reduce((sum, vaccination) => sum + vaccination.cost, 0),
    coverage: ((vaccinationsData.filter(v => v.status === 'Completed').length / vaccinationsData.length) * 100).toFixed(1)
  };

  // Generar días del calendario
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    while (currentDay <= lastDay || days.length < 42) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  // Obtener vacunaciones para una fecha específica
  const getVaccinationsForDate = (date) => {
    return filteredVaccinations.filter(vaccination => {
      const vaccDate = new Date(vaccination.scheduledDate);
      return vaccDate.toDateString() === date.toDateString();
    });
  };

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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading vaccination schedule...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Vaccination Schedule</h1>
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <span>{stats.total} total</span>
                <span className="text-blue-600">{stats.scheduled} scheduled</span>
                <span className="text-green-600">{stats.completed} completed</span>
                <span className="text-red-600">{stats.overdue} overdue</span>
                <span className="text-purple-600">{stats.coverage}% coverage</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'calendar'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <CalendarDays className="w-4 h-4 mr-1" />
                  Calendar
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'list'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ClipboardCheck className="w-4 h-4 mr-1" />
                  List
                </button>
              </div>

              <button
                onClick={() => setShowBulkScheduleModal(true)}
                className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="w-4 h-4 mr-2" />
                Bulk Schedule
              </button>
              
              <button
                onClick={fetchVaccinations}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              
              <Link
                to="/health/vaccinations/add"
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Vaccination
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Controles de filtro */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Búsqueda */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search vaccinations by animal, vaccine type, veterinarian..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Filtros rápidos */}
              <div className="flex items-center space-x-3">
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="all">All dates</option>
                  <option value="overdue">Overdue</option>
                  <option value="today">Today</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                  <option value="upcoming">Upcoming</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">All statuses</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-3 py-2 border rounded-lg transition-colors ${
                    showFilters
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </button>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vaccine Type</label>
                      <select
                        value={filters.vaccineType}
                        onChange={(e) => setFilters(prev => ({ ...prev, vaccineType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      >
                        <option value="">All vaccine types</option>
                        <option value="FMD (Foot and Mouth)">FMD (Foot and Mouth)</option>
                        <option value="Brucellosis">Brucellosis</option>
                        <option value="IBR/BVD">IBR/BVD</option>
                        <option value="Clostridial">Clostridial</option>
                        <option value="Leptospirosis">Leptospirosis</option>
                        <option value="Anthrax">Anthrax</option>
                        <option value="Pasteurella">Pasteurella</option>
                        <option value="Rotavirus/Coronavirus">Rotavirus/Coronavirus</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Veterinarian</label>
                      <select
                        value={filters.veterinarian}
                        onChange={(e) => setFilters(prev => ({ ...prev, veterinarian: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      >
                        <option value="">All veterinarians</option>
                        <option value="Dr. Sarah Martinez">Dr. Sarah Martinez</option>
                        <option value="Dr. Juan Rodriguez">Dr. Juan Rodriguez</option>
                        <option value="Dr. Emergency Vet">Dr. Emergency Vet</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={filters.priority}
                        onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      >
                        <option value="">All priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                      <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                          const [field, order] = e.target.value.split('-');
                          setSortBy(field);
                          setSortOrder(order);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      >
                        <option value="scheduledDate-asc">Date: Earliest First</option>
                        <option value="scheduledDate-desc">Date: Latest First</option>
                        <option value="animal-asc">Animal A-Z</option>
                        <option value="vaccineType-asc">Vaccine Type A-Z</option>
                        <option value="priority-desc">Priority: High First</option>
                        <option value="cost-desc">Cost: Highest First</option>
                      </select>
                    </div>
                  </div>

                  {Object.values(filters).some(f => f && f !== 'upcoming') && (
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
          </div>

          {/* Error display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
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

          {/* Vista de contenido */}
          {viewMode === 'calendar' ? (
            // Vista de Calendario
            <div className="bg-white rounded-xl shadow-sm border p-6">
              {/* Header del calendario */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendario */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = day.toDateString() === new Date().toDateString();
                  const dayVaccinations = getVaccinationsForDate(day);
                  
                  return (
                    <motion.div
                      key={index}
                      className={`min-h-24 p-2 border border-gray-100 cursor-pointer transition-colors ${
                        isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                      } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
                      onClick={() => setSelectedDate(day)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                      } ${isToday ? 'text-blue-600' : ''}`}>
                        {day.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {dayVaccinations.slice(0, 2).map(vaccination => (
                          <div
                            key={vaccination.id}
                            className={`text-xs p-1 rounded truncate ${getStatusColor(vaccination.status)}`}
                          >
                            {vaccination.animal} - {vaccination.vaccineType.split(' ')[0]}
                          </div>
                        ))}
                        {dayVaccinations.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayVaccinations.length - 2} more
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Vista de Lista
            <div className="space-y-6">
              {filteredVaccinations.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <Syringe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || Object.values(filters).some(f => f && f !== 'upcoming')
                      ? 'No vaccinations found'
                      : 'No vaccinations scheduled'
                    }
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || Object.values(filters).some(f => f && f !== 'upcoming')
                      ? 'Try adjusting your search or filters'
                      : 'Get started by scheduling your first vaccination'
                    }
                  </p>
                  {!searchTerm && !Object.values(filters).some(f => f && f !== 'upcoming') && (
                    <Link
                      to="/health/vaccinations/add"
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule First Vaccination
                    </Link>
                  )}
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredVaccinations.map((vaccination) => {
                    const IconComponent = getVaccineTypeIcon(vaccination.vaccineType);
                    return (
                      <motion.div
                        key={vaccination.id}
                        variants={cardVariants}
                        whileHover="hover"
                        className="bg-white rounded-xl shadow-sm border p-6 cursor-pointer"
                        onClick={() => navigate(`/health/vaccinations/${vaccination.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            {/* Icono y tipo de vacuna */}
                            <div className={`p-3 rounded-lg ${getVaccineTypeColor(vaccination.vaccineType)}`}>
                              <IconComponent className="w-6 h-6" />
                            </div>

                            {/* Información principal */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {vaccination.animal} (#{vaccination.tagNumber})
                                  </h3>
                                  <p className="text-sm text-gray-600">{vaccination.vaccineType}</p>
                                  <p className="text-sm font-medium text-gray-700">{vaccination.vaccineName}</p>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vaccination.status)}`}>
                                    {vaccination.status}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(vaccination.priority)}`}>
                                    {vaccination.priority}
                                  </span>
                                </div>
                              </div>

                              {/* Detalles */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  <span>{new Date(vaccination.scheduledDate).toLocaleDateString()} at {vaccination.scheduledTime}</span>
                                </div>
                                <div className="flex items-center">
                                  <User className="w-4 h-4 mr-2" />
                                  <span>{vaccination.veterinarian}</span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  <span>{vaccination.location}</span>
                                </div>
                              </div>

                              {/* Información adicional */}
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-4">
                                  <span className="font-medium text-gray-900">
                                    {formatCurrency(vaccination.cost)}
                                  </span>
                                  <span className="text-gray-600">
                                    Dosage: {vaccination.dosage}
                                  </span>
                                  <span className="text-gray-600">
                                    Route: {vaccination.administrationRoute}
                                  </span>
                                  {vaccination.certificateRequired && (
                                    <span className="text-blue-600 flex items-center">
                                      <Award className="w-4 h-4 mr-1" />
                                      Certificate Required
                                    </span>
                                  )}
                                </div>
                                <div className="text-gray-600">
                                  {getDaysUntilVaccination(vaccination.scheduledDate)}
                                </div>
                              </div>

                              {/* Notas */}
                              {vaccination.notes && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <p className="text-sm text-gray-700">{vaccination.notes}</p>
                                </div>
                              )}

                              {/* Reacciones (si las hay) */}
                              {vaccination.reactions && vaccination.reactions !== 'None' && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                  <div className="flex items-center">
                                    <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                                    <span className="text-sm font-medium text-yellow-800">Reactions:</span>
                                  </div>
                                  <p className="text-sm text-yellow-700 mt-1">{vaccination.reactions}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Menú de acciones */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionMenu(showActionMenu === vaccination.id ? null : vaccination.id);
                              }}
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            
                            {showActionMenu === vaccination.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border z-10 min-w-40"
                              >
                                <Link
                                  to={`/health/vaccinations/${vaccination.id}`}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Link>
                                <Link
                                  to={`/health/vaccinations/edit/${vaccination.id}`}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                                {vaccination.status === 'Scheduled' && (
                                  <button className="flex items-center w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark Completed
                                  </button>
                                )}
                                <button className="flex items-center w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50">
                                  <FileText className="w-4 h-4 mr-2" />
                                  Generate Certificate
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteModal(vaccination.id);
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
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>
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
                <h3 className="text-lg font-semibold text-gray-900">Delete Vaccination</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this vaccination schedule? This will permanently remove all associated data.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingVaccinationId}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deletingVaccinationId}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
              >
                {deletingVaccinationId ? (
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

export default VaccinationSchedule;