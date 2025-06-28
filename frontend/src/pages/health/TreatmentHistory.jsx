// Frontend/src/pages/health/TreatmentHistory.jsx

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
  MapPin,
  Clock,
  User,
  Pill,
  Syringe,
  Stethoscope,
  Heart,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  X,
  FileText,
  Thermometer,
  Activity,
  Shield,
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  Clipboard,
  Cow,
  Baby,
  Microscope,
  Bandage,
  Zap,
  Timer,
  DollarSign
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const TreatmentHistory = () => {
  // Estados para manejar los datos y la UI
  const [treatments, setTreatments] = useState([]);
  const [filteredTreatments, setFilteredTreatments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    veterinarian: '',
    dateRange: 'all',
    outcome: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Estados para acciones
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTreatmentId, setDeletingTreatmentId] = useState(null);
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

  // Cargar tratamientos al montar el componente
  useEffect(() => {
    fetchTreatments();
    
    // Mostrar mensaje de éxito si viene de otra página
    if (location.state?.message) {
      console.log(location.state.message);
    }
  }, []);

  // Aplicar filtros cuando cambien los datos o filtros
  useEffect(() => {
    applyFilters();
  }, [treatments, searchTerm, filters, sortBy, sortOrder]);

  // Obtener lista de tratamientos
  const fetchTreatments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/health/treatments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTreatments(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load treatment history');
      }
    } catch (error) {
      console.error('Fetch treatments error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos de ejemplo mientras se carga la API real
  const mockTreatments = [
    {
      id: 1,
      animal: 'Luna',
      tagNumber: 'L089',
      type: 'Antibiotic Treatment',
      medication: 'Penicillin G',
      diagnosis: 'Respiratory infection',
      symptoms: 'Coughing, fever, nasal discharge',
      veterinarian: 'Dr. Sarah Martinez',
      startDate: '2025-06-20',
      endDate: '2025-06-25',
      duration: 5,
      dosage: '20ml twice daily',
      administrationRoute: 'Intramuscular',
      location: 'Medical Bay',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      status: 'Completed',
      outcome: 'Full recovery',
      cost: 125.50,
      notes: 'Animal responded well to treatment. No adverse reactions observed.',
      followUpRequired: false,
      nextCheckup: null,
      createdAt: '2025-06-20T08:30:00Z'
    },
    {
      id: 2,
      animal: 'Thunder',
      tagNumber: 'T156',
      type: 'Vaccination',
      medication: 'FMD Vaccine',
      diagnosis: 'Preventive vaccination',
      symptoms: 'None - Preventive care',
      veterinarian: 'Dr. Juan Rodriguez',
      startDate: '2025-06-18',
      endDate: '2025-06-18',
      duration: 1,
      dosage: '2ml single dose',
      administrationRoute: 'Subcutaneous',
      location: 'Main Barn',
      coordinates: { lat: 17.9885, lng: -92.9462 },
      status: 'Completed',
      outcome: 'Vaccination successful',
      cost: 35.00,
      notes: 'Annual booster vaccination. No reactions observed.',
      followUpRequired: false,
      nextCheckup: '2026-06-18',
      createdAt: '2025-06-18T14:15:00Z'
    },
    {
      id: 3,
      animal: 'Bella',
      tagNumber: 'B247',
      type: 'Emergency Treatment',
      medication: 'Dexamethasone + Flunixin',
      diagnosis: 'Acute lameness',
      symptoms: 'Severe limping, swelling in right hind leg',
      veterinarian: 'Dr. Emergency Vet',
      startDate: '2025-06-15',
      endDate: '2025-06-22',
      duration: 7,
      dosage: 'Dex: 5ml daily, Flunixin: 10ml daily',
      administrationRoute: 'Intravenous',
      location: 'Pasture C',
      coordinates: { lat: 17.9878, lng: -92.9502 },
      status: 'Completed',
      outcome: 'Significant improvement',
      cost: 285.00,
      notes: 'Emergency treatment for suspected injury. Good response to anti-inflammatory therapy.',
      followUpRequired: true,
      nextCheckup: '2025-07-05',
      createdAt: '2025-06-15T16:45:00Z'
    },
    {
      id: 4,
      animal: 'Daisy',
      tagNumber: 'D234',
      type: 'Reproductive Treatment',
      medication: 'Oxytocin + Antibiotics',
      diagnosis: 'Retained placenta',
      symptoms: 'Failure to expel placenta after calving',
      veterinarian: 'Dr. Sarah Martinez',
      startDate: '2025-06-12',
      endDate: '2025-06-17',
      duration: 5,
      dosage: 'Oxytocin: 20IU, Antibiotics: 15ml daily',
      administrationRoute: 'Intramuscular',
      location: 'Maternity Pen',
      coordinates: { lat: 17.9890, lng: -92.9458 },
      status: 'Completed',
      outcome: 'Successful treatment',
      cost: 195.75,
      notes: 'Placenta expelled successfully. Preventive antibiotic course completed.',
      followUpRequired: true,
      nextCheckup: '2025-07-12',
      createdAt: '2025-06-12T11:20:00Z'
    },
    {
      id: 5,
      animal: 'Max',
      tagNumber: 'M456',
      type: 'Parasitic Treatment',
      medication: 'Ivermectin',
      diagnosis: 'Internal parasites',
      symptoms: 'Weight loss, diarrhea, poor coat condition',
      veterinarian: 'Dr. Juan Rodriguez',
      startDate: '2025-06-10',
      endDate: '2025-06-10',
      duration: 1,
      dosage: '1ml per 50kg body weight',
      administrationRoute: 'Subcutaneous',
      location: 'Treatment Chute',
      coordinates: { lat: 17.9882, lng: -92.9470 },
      status: 'Completed',
      outcome: 'Good response',
      cost: 45.25,
      notes: 'Routine deworming treatment. Animal showed improvement in appetite.',
      followUpRequired: true,
      nextCheckup: '2025-09-10',
      createdAt: '2025-06-10T09:15:00Z'
    },
    {
      id: 6,
      animal: 'Sophie',
      tagNumber: 'S789',
      type: 'Wound Treatment',
      medication: 'Topical antiseptic + Antibiotics',
      diagnosis: 'Laceration wound',
      symptoms: 'Open wound on left flank, mild infection',
      veterinarian: 'Dr. Sarah Martinez',
      startDate: '2025-06-08',
      endDate: '2025-06-15',
      duration: 7,
      dosage: 'Topical: twice daily, Antibiotics: 12ml daily',
      administrationRoute: 'Topical + Intramuscular',
      location: 'Medical Bay',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      status: 'Completed',
      outcome: 'Complete healing',
      cost: 165.30,
      notes: 'Wound healed completely. No complications observed.',
      followUpRequired: false,
      nextCheckup: null,
      createdAt: '2025-06-08T13:45:00Z'
    },
    {
      id: 7,
      animal: 'Rocky',
      tagNumber: 'R321',
      type: 'Metabolic Treatment',
      medication: 'Calcium gluconate + Vitamin B12',
      diagnosis: 'Milk fever (hypocalcemia)',
      symptoms: 'Weakness, muscle tremors, recumbency',
      veterinarian: 'Dr. Emergency Vet',
      startDate: '2025-06-05',
      endDate: '2025-06-08',
      duration: 3,
      dosage: 'Ca gluconate: 500ml IV, B12: 5ml IM',
      administrationRoute: 'Intravenous + Intramuscular',
      location: 'Emergency Area',
      coordinates: { lat: 17.9888, lng: -92.9465 },
      status: 'Completed',
      outcome: 'Full recovery',
      cost: 220.80,
      notes: 'Rapid response to calcium therapy. Animal returned to normal activity.',
      followUpRequired: false,
      nextCheckup: null,
      createdAt: '2025-06-05T20:30:00Z'
    },
    {
      id: 8,
      animal: 'Molly',
      tagNumber: 'M159',
      type: 'Ongoing Treatment',
      medication: 'Anti-inflammatory course',
      diagnosis: 'Chronic arthritis',
      symptoms: 'Joint stiffness, reduced mobility',
      veterinarian: 'Dr. Juan Rodriguez',
      startDate: '2025-06-25',
      endDate: null,
      duration: null,
      dosage: '15ml daily',
      administrationRoute: 'Oral',
      location: 'Senior Animal Pen',
      coordinates: { lat: 17.9892, lng: -92.9468 },
      status: 'In Progress',
      outcome: 'Improving',
      cost: 95.00,
      notes: 'Long-term management of arthritis. Regular monitoring required.',
      followUpRequired: true,
      nextCheckup: '2025-07-25',
      createdAt: '2025-06-25T10:00:00Z'
    }
  ];

  // Usar datos mock si no hay tratamientos reales
  const treatmentsData = treatments.length > 0 ? treatments : mockTreatments;

  // Aplicar filtros y búsqueda
  const applyFilters = () => {
    let filtered = [...treatmentsData];

    // Aplicar búsqueda por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(treatment =>
        treatment.animal.toLowerCase().includes(term) ||
        treatment.tagNumber.toLowerCase().includes(term) ||
        treatment.type.toLowerCase().includes(term) ||
        treatment.diagnosis.toLowerCase().includes(term) ||
        treatment.medication.toLowerCase().includes(term) ||
        treatment.veterinarian.toLowerCase().includes(term)
      );
    }

    // Aplicar filtros específicos
    if (filters.type) {
      filtered = filtered.filter(treatment => treatment.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter(treatment => treatment.status === filters.status);
    }

    if (filters.veterinarian) {
      filtered = filtered.filter(treatment => treatment.veterinarian === filters.veterinarian);
    }

    if (filters.outcome) {
      filtered = filtered.filter(treatment => treatment.outcome === filters.outcome);
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const today = new Date();
      const treatmentDate = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          treatmentDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          treatmentDate.setMonth(today.getMonth() - 1);
          break;
        case 'quarter':
          treatmentDate.setMonth(today.getMonth() - 3);
          break;
        case 'year':
          treatmentDate.setFullYear(today.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      if (filters.dateRange !== 'all') {
        filtered = filtered.filter(treatment => {
          const date = new Date(treatment.startDate);
          return date >= treatmentDate && date <= today;
        });
      }
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Manejo especial para fechas
      if (sortBy === 'startDate' || sortBy === 'endDate' || sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Manejo especial para números
      if (sortBy === 'cost' || sortBy === 'duration') {
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

    setFilteredTreatments(filtered);
    setCurrentPage(1);
  };

  // Obtener icono del tipo de tratamiento
  const getTreatmentTypeIcon = (type) => {
    switch (type) {
      case 'Vaccination': return Syringe;
      case 'Antibiotic Treatment': return Pill;
      case 'Emergency Treatment': return AlertTriangle;
      case 'Reproductive Treatment': return Baby;
      case 'Parasitic Treatment': return Microscope;
      case 'Wound Treatment': return Bandage;
      case 'Metabolic Treatment': return Activity;
      case 'Ongoing Treatment': return Timer;
      default: return Stethoscope;
    }
  };

  // Obtener color del tipo de tratamiento
  const getTreatmentTypeColor = (type) => {
    switch (type) {
      case 'Vaccination': return 'bg-purple-500 text-white';
      case 'Antibiotic Treatment': return 'bg-blue-500 text-white';
      case 'Emergency Treatment': return 'bg-red-500 text-white';
      case 'Reproductive Treatment': return 'bg-pink-500 text-white';
      case 'Parasitic Treatment': return 'bg-yellow-500 text-white';
      case 'Wound Treatment': return 'bg-orange-500 text-white';
      case 'Metabolic Treatment': return 'bg-green-500 text-white';
      case 'Ongoing Treatment': return 'bg-indigo-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Obtener color del outcome
  const getOutcomeColor = (outcome) => {
    if (outcome.includes('Full recovery') || outcome.includes('Complete') || outcome.includes('Successful')) {
      return 'text-green-600';
    } else if (outcome.includes('Improving') || outcome.includes('Good response') || outcome.includes('Significant')) {
      return 'text-blue-600';
    } else if (outcome.includes('Partial') || outcome.includes('Fair')) {
      return 'text-yellow-600';
    } else if (outcome.includes('No improvement') || outcome.includes('Complications')) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calcular duración del tratamiento
  const calculateDuration = (startDate, endDate) => {
    if (!endDate) return 'Ongoing';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  // Manejar eliminación de tratamiento
  const handleDelete = async (treatmentId) => {
    setDeletingTreatmentId(treatmentId);
    
    try {
      const response = await fetch(`/api/health/treatments/${treatmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setTreatments(prev => prev.filter(treatment => treatment.id !== treatmentId));
        setShowDeleteModal(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete treatment');
      }
    } catch (error) {
      console.error('Delete treatment error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setDeletingTreatmentId(null);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      type: '',
      status: '',
      veterinarian: '',
      dateRange: 'all',
      outcome: ''
    });
    setShowFilters(false);
  };

  // Calcular estadísticas
  const stats = {
    total: treatmentsData.length,
    completed: treatmentsData.filter(t => t.status === 'Completed').length,
    inProgress: treatmentsData.filter(t => t.status === 'In Progress').length,
    totalCost: treatmentsData.reduce((sum, treatment) => sum + treatment.cost, 0),
    averageDuration: treatmentsData.filter(t => t.duration).reduce((sum, t) => sum + t.duration, 0) / treatmentsData.filter(t => t.duration).length || 0
  };

  // Datos para paginación
  const totalPages = Math.ceil(filteredTreatments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTreatments = filteredTreatments.slice(startIndex, startIndex + itemsPerPage);

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
            <p className="text-gray-600">Loading treatment history...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Treatment History</h1>
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <span>{stats.total} total</span>
                <span className="text-green-600">{stats.completed} completed</span>
                <span className="text-blue-600">{stats.inProgress} in progress</span>
                <span className="text-purple-600">{formatCurrency(stats.totalCost)} total cost</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchTreatments}
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
                to="/health/treatments/add"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Treatment
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
                  placeholder="Search treatments by animal, diagnosis, medication, vet..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="startDate-desc">Date: Latest First</option>
                <option value="startDate-asc">Date: Earliest First</option>
                <option value="cost-desc">Cost: Highest First</option>
                <option value="cost-asc">Cost: Lowest First</option>
                <option value="animal-asc">Animal A-Z</option>
                <option value="type-asc">Type A-Z</option>
                <option value="duration-desc">Duration: Longest First</option>
              </select>

              {/* Botón de filtros */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-3 py-2 border rounded-lg transition-colors ${
                  showFilters || Object.values(filters).some(f => f && f !== 'all')
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
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
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 transition-colors ${
                    viewMode === 'table'
                      ? 'bg-blue-600 text-white'
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All types</option>
                      <option value="Vaccination">Vaccination</option>
                      <option value="Antibiotic Treatment">Antibiotic Treatment</option>
                      <option value="Emergency Treatment">Emergency Treatment</option>
                      <option value="Reproductive Treatment">Reproductive Treatment</option>
                      <option value="Parasitic Treatment">Parasitic Treatment</option>
                      <option value="Wound Treatment">Wound Treatment</option>
                      <option value="Metabolic Treatment">Metabolic Treatment</option>
                      <option value="Ongoing Treatment">Ongoing Treatment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All statuses</option>
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Veterinarian</label>
                    <select
                      value={filters.veterinarian}
                      onChange={(e) => setFilters(prev => ({ ...prev, veterinarian: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All veterinarians</option>
                      <option value="Dr. Sarah Martinez">Dr. Sarah Martinez</option>
                      <option value="Dr. Juan Rodriguez">Dr. Juan Rodriguez</option>
                      <option value="Dr. Emergency Vet">Dr. Emergency Vet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="all">All dates</option>
                      <option value="week">Last week</option>
                      <option value="month">Last month</option>
                      <option value="quarter">Last quarter</option>
                      <option value="year">Last year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                    <select
                      value={filters.outcome}
                      onChange={(e) => setFilters(prev => ({ ...prev, outcome: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All outcomes</option>
                      <option value="Full recovery">Full recovery</option>
                      <option value="Good response">Good response</option>
                      <option value="Improving">Improving</option>
                      <option value="Successful">Successful</option>
                      <option value="Complete healing">Complete healing</option>
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

        {/* Contenido principal */}
        {filteredTreatments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || Object.values(filters).some(f => f && f !== 'all')
                ? 'No treatments found'
                : 'No treatment records yet'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(filters).some(f => f && f !== 'all')
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first treatment record'
              }
            </p>
            {!searchTerm && !Object.values(filters).some(f => f && f !== 'all') && (
              <Link
                to="/health/treatments/add"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Treatment
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
                {paginatedTreatments.map((treatment) => {
                  const IconComponent = getTreatmentTypeIcon(treatment.type);
                  return (
                    <motion.div
                      key={treatment.id}
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white rounded-xl shadow-sm border overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/health/treatments/${treatment.id}`)}
                    >
                      {/* Header del tratamiento */}
                      <div className="p-4 pb-2">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className={`p-2 rounded-lg ${getTreatmentTypeColor(treatment.type)}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm">{treatment.animal}</h3>
                              <p className="text-xs text-gray-500">#{treatment.tagNumber}</p>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionMenu(showActionMenu === treatment.id ? null : treatment.id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {showActionMenu === treatment.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-0 top-6 bg-white rounded-lg shadow-lg border z-10 min-w-32"
                              >
                                <Link
                                  to={`/health/treatments/${treatment.id}`}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Link>
                                <Link
                                  to={`/health/treatments/edit/${treatment.id}`}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteModal(treatment.id);
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
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{treatment.type}</p>
                            <p className="text-xs text-gray-600">{treatment.diagnosis}</p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(treatment.status)}`}>
                              {treatment.status}
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {formatCurrency(treatment.cost)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Información del tratamiento */}
                      <div className="px-4 pb-4">
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{new Date(treatment.startDate).toLocaleDateString()}</span>
                            {treatment.endDate && (
                              <span> - {new Date(treatment.endDate).toLocaleDateString()}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            <span className="truncate">{treatment.veterinarian}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="truncate">{treatment.location}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{calculateDuration(treatment.startDate, treatment.endDate)}</span>
                          </div>

                          <div className="pt-2">
                            <p className={`text-sm font-medium ${getOutcomeColor(treatment.outcome)}`}>
                              Outcome: {treatment.outcome}
                            </p>
                          </div>

                          {treatment.followUpRequired && (
                            <div className="flex items-center text-orange-600">
                              <Target className="w-4 h-4 mr-2" />
                              <span className="text-xs">Follow-up required</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer con medicamento */}
                      <div className="px-4 py-3 bg-gray-50 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Pill className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="text-xs font-medium text-gray-700 truncate">
                              {treatment.medication}
                            </span>
                          </div>
                          {treatment.nextCheckup && (
                            <span className="text-xs text-gray-500">
                              Next: {new Date(treatment.nextCheckup).toLocaleDateString()}
                            </span>
                          )}
                        </div>
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
                          Animal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Treatment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Diagnosis
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Veterinarian
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
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
                      {paginatedTreatments.map((treatment, index) => {
                        const IconComponent = getTreatmentTypeIcon(treatment.type);
                        return (
                          <motion.tr
                            key={treatment.id}
                            variants={tableRowVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Cow className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {treatment.animal}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    #{treatment.tagNumber}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <IconComponent className="w-4 h-4 mr-2 text-gray-400" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {treatment.type}
                                  </div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {treatment.medication}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 max-w-xs truncate">
                                {treatment.diagnosis}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div>
                                {new Date(treatment.startDate).toLocaleDateString()}
                              </div>
                              <div className="text-xs">
                                {calculateDuration(treatment.startDate, treatment.endDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {treatment.veterinarian}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(treatment.status)}`}>
                                {treatment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(treatment.cost)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Link
                                  to={`/health/treatments/${treatment.id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <Link
                                  to={`/health/treatments/edit/${treatment.id}`}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => setShowDeleteModal(treatment.id)}
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
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTreatments.length)} of{' '}
                  {filteredTreatments.length} results
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
                              ? 'border-blue-500 bg-blue-600 text-white'
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
                <h3 className="text-lg font-semibold text-gray-900">Delete Treatment Record</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this treatment record? This will permanently remove all associated medical data.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingTreatmentId}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deletingTreatmentId}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
              >
                {deletingTreatmentId ? (
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

export default TreatmentHistory;