// Frontend/src/pages/production/WeightTracking.jsx

import React, { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  TrendingUp,
  TrendingDown,
  TrendingRight,
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
  Cow,
  Activity,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  X,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  Calculator,
  Percent,
  Timer,
  Baby,
  Users,
  Settings,
  Bell,
  Star,
  Zap,
  Heart,
  Shield,
  Thermometer,
  Clipboard,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Grid,
  List,
  Send,
  Share2,
  Printer
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const WeightTracking = () => {
  // Estados para manejar los datos y la UI
  const [weightRecords, setWeightRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table', 'chart'

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    animal: '',
    ageGroup: '',
    dateRange: 'all',
    gainPattern: '',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Estados para acciones
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingRecordId, setDeletingRecordId] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

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

  // Cargar registros de peso al montar el componente
  useEffect(() => {
    fetchWeightRecords();

    // Mostrar mensaje de éxito si viene de otra página
    if (location.state?.message) {
      console.log(location.state.message);
    }
  }, []);

  // Aplicar filtros cuando cambien los datos o filtros
  useEffect(() => {
    applyFilters();
  }, [weightRecords, searchTerm, filters, sortBy, sortOrder]);

  // Obtener lista de registros de peso
  const fetchWeightRecords = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/production/weight-records', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setWeightRecords(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load weight records');
      }
    } catch (error) {
      console.error('Fetch weight records error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos de ejemplo mientras se carga la API real
  const mockWeightRecords = [
    {
      id: 1,
      animal: 'Luna',
      tagNumber: 'L089',
      currentWeight: 485.5,
      previousWeight: 478.2,
      weightChange: 7.3,
      gainRate: 1.52,
      date: '2025-06-25',
      time: '08:30',
      age: 28,
      ageGroup: 'Adult',
      breed: 'Holstein',
      measuredBy: 'Dr. Sarah Martinez',
      location: 'Main Barn - Scale 1',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      bodyConditionScore: 3.5,
      notes: 'Healthy weight gain, good body condition',
      nextWeighing: '2025-07-25',
      targetWeight: 520.0,
      feedEfficiency: 6.2,
      healthStatus: 'Healthy',
      pregnancyStatus: 'Not pregnant',
      lactationStatus: 'Lactating',
      createdAt: '2025-06-25T08:30:00Z'
    },
    {
      id: 2,
      animal: 'Thunder',
      tagNumber: 'T156',
      currentWeight: 658.3,
      previousWeight: 642.1,
      weightChange: 16.2,
      gainRate: 2.31,
      date: '2025-06-24',
      time: '14:15',
      age: 18,
      ageGroup: 'Young Stock',
      breed: 'Angus',
      measuredBy: 'Dr. Juan Rodriguez',
      location: 'Bull Pen - Scale 2',
      coordinates: { lat: 17.9885, lng: -92.9462 },
      bodyConditionScore: 4.0,
      notes: 'Excellent growth rate for young bull',
      nextWeighing: '2025-07-24',
      targetWeight: 700.0,
      feedEfficiency: 5.8,
      healthStatus: 'Healthy',
      pregnancyStatus: 'N/A',
      lactationStatus: 'N/A',
      createdAt: '2025-06-24T14:15:00Z'
    },
    {
      id: 3,
      animal: 'Bella',
      tagNumber: 'B247',
      currentWeight: 542.1,
      previousWeight: 548.7,
      weightChange: -6.6,
      gainRate: -0.94,
      date: '2025-06-23',
      time: '10:45',
      age: 36,
      ageGroup: 'Adult',
      breed: 'Jersey',
      measuredBy: 'Dr. Sarah Martinez',
      location: 'Medical Bay - Scale 3',
      coordinates: { lat: 17.9878, lng: -92.9502 },
      bodyConditionScore: 2.5,
      notes: 'Weight loss noted - monitor closely, possible health issue',
      nextWeighing: '2025-06-30',
      targetWeight: 560.0,
      feedEfficiency: 7.1,
      healthStatus: 'Under observation',
      pregnancyStatus: 'Pregnant - 6 months',
      lactationStatus: 'Not lactating',
      createdAt: '2025-06-23T10:45:00Z'
    },
    {
      id: 4,
      animal: 'Daisy',
      tagNumber: 'D234',
      currentWeight: 421.8,
      previousWeight: 415.2,
      weightChange: 6.6,
      gainRate: 0.94,
      date: '2025-06-22',
      time: '16:20',
      age: 24,
      ageGroup: 'Adult',
      breed: 'Brown Swiss',
      measuredBy: 'Dr. Juan Rodriguez',
      location: 'Pasture A - Mobile Scale',
      coordinates: { lat: 17.9890, lng: -92.9458 },
      bodyConditionScore: 3.0,
      notes: 'Steady weight gain, normal for lactating cow',
      nextWeighing: '2025-07-22',
      targetWeight: 450.0,
      feedEfficiency: 6.8,
      healthStatus: 'Healthy',
      pregnancyStatus: 'Not pregnant',
      lactationStatus: 'Lactating',
      createdAt: '2025-06-22T16:20:00Z'
    },
    {
      id: 5,
      animal: 'Max',
      tagNumber: 'M456',
      currentWeight: 385.7,
      previousWeight: 368.4,
      weightChange: 17.3,
      gainRate: 2.47,
      date: '2025-06-21',
      time: '09:10',
      age: 12,
      ageGroup: 'Young Stock',
      breed: 'Simmental',
      measuredBy: 'Dr. Sarah Martinez',
      location: 'Calf Pen - Scale 4',
      coordinates: { lat: 17.9892, lng: -92.9468 },
      bodyConditionScore: 3.5,
      notes: 'Excellent growth for young calf, above average',
      nextWeighing: '2025-07-05',
      targetWeight: 420.0,
      feedEfficiency: 5.2,
      healthStatus: 'Healthy',
      pregnancyStatus: 'N/A',
      lactationStatus: 'N/A',
      createdAt: '2025-06-21T09:10:00Z'
    },
    {
      id: 6,
      animal: 'Sophie',
      tagNumber: 'S789',
      currentWeight: 467.9,
      previousWeight: 463.1,
      weightChange: 4.8,
      gainRate: 0.69,
      date: '2025-06-20',
      time: '11:30',
      age: 30,
      ageGroup: 'Adult',
      breed: 'Hereford',
      measuredBy: 'Dr. Juan Rodriguez',
      location: 'Main Barn - Scale 1',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      bodyConditionScore: 3.2,
      notes: 'Slow but steady weight gain',
      nextWeighing: '2025-07-20',
      targetWeight: 480.0,
      feedEfficiency: 6.5,
      healthStatus: 'Healthy',
      pregnancyStatus: 'Not pregnant',
      lactationStatus: 'Dry',
      createdAt: '2025-06-20T11:30:00Z'
    },
    {
      id: 7,
      animal: 'Rocky',
      tagNumber: 'R321',
      currentWeight: 312.4,
      previousWeight: 298.7,
      weightChange: 13.7,
      gainRate: 1.96,
      date: '2025-06-19',
      time: '15:45',
      age: 8,
      ageGroup: 'Calf',
      breed: 'Charolais',
      measuredBy: 'Dr. Sarah Martinez',
      location: 'Calf Pen - Scale 4',
      coordinates: { lat: 17.9892, lng: -92.9468 },
      bodyConditionScore: 3.0,
      notes: 'Good growth rate for young calf',
      nextWeighing: '2025-07-03',
      targetWeight: 350.0,
      feedEfficiency: 4.8,
      healthStatus: 'Healthy',
      pregnancyStatus: 'N/A',
      lactationStatus: 'N/A',
      createdAt: '2025-06-19T15:45:00Z'
    },
    {
      id: 8,
      animal: 'Molly',
      tagNumber: 'M159',
      currentWeight: 523.6,
      previousWeight: 521.3,
      weightChange: 2.3,
      gainRate: 0.33,
      date: '2025-06-18',
      time: '13:15',
      age: 72,
      ageGroup: 'Senior',
      breed: 'Holstein',
      measuredBy: 'Dr. Juan Rodriguez',
      location: 'Senior Pen - Scale 5',
      coordinates: { lat: 17.9888, lng: -92.9465 },
      bodyConditionScore: 2.8,
      notes: 'Maintaining weight well for senior cow',
      nextWeighing: '2025-07-02',
      targetWeight: 525.0,
      feedEfficiency: 7.8,
      healthStatus: 'Monitoring',
      pregnancyStatus: 'Not pregnant',
      lactationStatus: 'Dry',
      createdAt: '2025-06-18T13:15:00Z'
    }
  ];

  // Usar datos mock si no hay registros reales
  const recordsData = weightRecords.length > 0 ? weightRecords : mockWeightRecords;

  // Aplicar filtros y búsqueda
  const applyFilters = () => {
    let filtered = [...recordsData];

    // Aplicar búsqueda por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.animal.toLowerCase().includes(term) ||
        record.tagNumber.toLowerCase().includes(term) ||
        record.breed.toLowerCase().includes(term) ||
        record.measuredBy.toLowerCase().includes(term) ||
        record.location.toLowerCase().includes(term)
      );
    }

    // Aplicar filtros específicos
    if (filters.animal) {
      filtered = filtered.filter(record => record.animal === filters.animal);
    }
    if (filters.ageGroup) {
      filtered = filtered.filter(record => record.ageGroup === filters.ageGroup);
    }
    if (filters.gainPattern) {
      switch (filters.gainPattern) {
        case 'gaining':
          filtered = filtered.filter(record => record.weightChange > 0);
          break;
        case 'losing':
          filtered = filtered.filter(record => record.weightChange < 0);
          break;
        case 'stable':
          filtered = filtered.filter(record => Math.abs(record.weightChange) <= 2);
          break;
        default:
          break;
      }
    }
    if (filters.location) {
      filtered = filtered.filter(record => record.location.includes(filters.location));
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const today = new Date();
      const recordDate = new Date();

      switch (filters.dateRange) {
        case 'week':
          recordDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          recordDate.setMonth(today.getMonth() - 1);
          break;
        case 'quarter':
          recordDate.setMonth(today.getMonth() - 3);
          break;
        default:
          break;
      }

      if (filters.dateRange !== 'all') {
        filtered = filtered.filter(record => {
          const date = new Date(record.date);
          return date >= recordDate && date <= today;
        });
      }
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Manejo especial para fechas
      if (sortBy === 'date' || sortBy === 'createdAt' || sortBy === 'nextWeighing') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Manejo especial para números
      if (['currentWeight', 'weightChange', 'gainRate', 'age', 'bodyConditionScore', 'feedEfficiency'].includes(sortBy)) {
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

    setFilteredRecords(filtered);
    setCurrentPage(1);
  };

  // Obtener color del cambio de peso
  const getWeightChangeColor = (change) => {
    if (change > 5) return 'text-green-600';
    if (change > 0) return 'text-blue-600';
    if (change > -5) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Obtener icono del trend
  const getTrendIcon = (change) => {
    if (change > 2) return TrendingUp;
    if (change < -2) return TrendingDown;
    return TrendingRight;
  };

  // Obtener color del grupo de edad
  const getAgeGroupColor = (ageGroup) => {
    switch (ageGroup) {
      case 'Calf': return 'text-blue-600 bg-blue-100';
      case 'Young Stock': return 'text-green-600 bg-green-100';
      case 'Adult': return 'text-purple-600 bg-purple-100';
      case 'Senior': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Obtener color del estado de salud
  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'Healthy': return 'text-green-600 bg-green-100';
      case 'Under observation': return 'text-yellow-600 bg-yellow-100';
      case 'Monitoring': return 'text-blue-600 bg-blue-100';
      case 'Sick': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Formatear números
  const formatNumber = (num, decimals = 1) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  // Calcular días hasta próxima pesada
  const getDaysUntilNextWeighing = (nextDate) => {
    const today = new Date();
    const next = new Date(nextDate);
    const diffTime = next - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  // Calcular progreso hacia peso objetivo
  const getTargetProgress = (current, target) => {
    if (!target || target <= current) return 100;
    const progress = (current / target) * 100;
    return Math.min(progress, 100);
  };

  // Manejar eliminación de registro
  const handleDelete = async (recordId) => {
    setDeletingRecordId(recordId);

    try {
      const response = await fetch(`/api/production/weight-records/${recordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setWeightRecords(prev => prev.filter(record => record.id !== recordId));
        setShowDeleteModal(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete weight record');
      }
    } catch (error) {
      console.error('Delete record error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setDeletingRecordId(null);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      animal: '',
      ageGroup: '',
      dateRange: 'all',
      gainPattern: '',
      location: ''
    });
    setShowFilters(false);
  };

  // Calcular estadísticas
  const stats = {
    total: recordsData.length,
    gaining: recordsData.filter(r => r.weightChange > 0).length,
    losing: recordsData.filter(r => r.weightChange < 0).length,
    stable: recordsData.filter(r => Math.abs(r.weightChange) <= 2).length,
    averageGain: recordsData.reduce((sum, r) => sum + r.gainRate, 0) / recordsData.length || 0,
    averageWeight: recordsData.reduce((sum, r) => sum + r.currentWeight, 0) / recordsData.length || 0
  };

  // Datos para paginación
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

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
            <p className="text-gray-600">Loading weight tracking data...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Weight Tracking</h1>
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <span>{stats.total} records</span>
                <span className="text-green-600">{stats.gaining} gaining</span>
                <span className="text-red-600">{stats.losing} losing</span>
                <span className="text-blue-600">{stats.stable} stable</span>
                <span className="text-purple-600">{formatNumber(stats.averageGain)} kg/day avg gain</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'table'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'chart'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <LineChart className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={fetchWeightRecords}
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
                to="/production/weight-tracking/add"
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Record Weight
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
                  placeholder="Search by animal, tag, breed, or location..."
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
                <option value="date-desc">Date: Latest First</option>
                <option value="date-asc">Date: Earliest First</option>
                <option value="currentWeight-desc">Weight: Heaviest First</option>
                <option value="currentWeight-asc">Weight: Lightest First</option>
                <option value="weightChange-desc">Gain: Highest First</option>
                <option value="weightChange-asc">Gain: Lowest First</option>
                <option value="gainRate-desc">Rate: Fastest First</option>
                <option value="animal-asc">Animal A-Z</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Animal</label>
                    <select
                      value={filters.animal}
                      onChange={(e) => setFilters(prev => ({ ...prev, animal: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="">All animals</option>
                      {[...new Set(recordsData.map(r => r.animal))].map(animal => (
                        <option key={animal} value={animal}>{animal}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                    <select
                      value={filters.ageGroup}
                      onChange={(e) => setFilters(prev => ({ ...prev, ageGroup: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="">All age groups</option>
                      <option value="Calf">Calf</option>
                      <option value="Young Stock">Young Stock</option>
                      <option value="Adult">Adult</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight Pattern</label>
                    <select
                      value={filters.gainPattern}
                      onChange={(e) => setFilters(prev => ({ ...prev, gainPattern: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="">All patterns</option>
                      <option value="gaining">Gaining weight</option>
                      <option value="losing">Losing weight</option>
                      <option value="stable">Stable weight</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="">All locations</option>
                      <option value="Main Barn">Main Barn</option>
                      <option value="Bull Pen">Bull Pen</option>
                      <option value="Calf Pen">Calf Pen</option>
                      <option value="Pasture">Pasture</option>
                      <option value="Medical Bay">Medical Bay</option>
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
                      <option value="week">Last week</option>
                      <option value="month">Last month</option>
                      <option value="quarter">Last quarter</option>
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
        {filteredRecords.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || Object.values(filters).some(f => f && f !== 'all')
                ? 'No weight records found'
                : 'No weight records yet'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(filters).some(f => f && f !== 'all')
                ? 'Try adjusting your search or filters'
                : 'Get started by recording your first weight measurement'
              }
            </p>
            {!searchTerm && !Object.values(filters).some(f => f && f !== 'all') && (
              <Link
                to="/production/weight-tracking/add"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Record First Weight
              </Link>
            )}
          </motion.div>
        ) : (
          <>
            {/* Vista Cards */}
            {viewMode === 'cards' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {paginatedRecords.map((record) => {
                  const TrendIcon = getTrendIcon(record.weightChange);
                  const progress = getTargetProgress(record.currentWeight, record.targetWeight);
                  
                  return (
                    <motion.div
                      key={record.id}
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white rounded-xl shadow-sm border overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/production/weight-tracking/${record.id}`)}
                    >
                      {/* Header del registro */}
                      <div className="p-4 pb-2">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <Cow className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{record.animal}</h3>
                              <p className="text-xs text-gray-500">#{record.tagNumber}</p>
                              <p className="text-xs text-gray-500">{record.breed}</p>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionMenu(showActionMenu === record.id ? null : record.id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {showActionMenu === record.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-0 top-6 bg-white rounded-lg shadow-lg border z-10 min-w-32"
                              >
                                <Link
                                  to={`/production/weight-tracking/${record.id}`}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Link>
                                <Link
                                  to={`/production/weight-tracking/edit/${record.id}`}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteModal(record.id);
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

                        {/* Información de peso */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Current Weight</span>
                            <span className="text-lg font-bold text-gray-900">
                              {formatNumber(record.currentWeight)} kg
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Weight Change</span>
                            <div className="flex items-center space-x-1">
                              <TrendIcon className={`w-4 h-4 ${getWeightChangeColor(record.weightChange)}`} />
                              <span className={`text-sm font-medium ${getWeightChangeColor(record.weightChange)}`}>
                                {record.weightChange > 0 ? '+' : ''}{formatNumber(record.weightChange)} kg
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Daily Gain Rate</span>
                            <span className={`text-sm font-medium ${getWeightChangeColor(record.gainRate)}`}>
                              {record.gainRate > 0 ? '+' : ''}{formatNumber(record.gainRate)} kg/day
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Información adicional */}
                      <div className="px-4 pb-4">
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{new Date(record.date).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            <span className="truncate">{record.measuredBy}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="truncate">{record.location}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAgeGroupColor(record.ageGroup)}`}>
                              {record.ageGroup}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(record.healthStatus)}`}>
                              {record.healthStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress hacia peso objetivo */}
                      {record.targetWeight && (
                        <div className="px-4 py-3 bg-gray-50 border-t">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-700">Target Progress</span>
                            <span className="text-xs text-gray-500">{formatNumber(progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{formatNumber(record.currentWeight)} kg</span>
                            <span>{formatNumber(record.targetWeight)} kg</span>
                          </div>
                        </div>
                      )}

                      {/* Footer con próxima pesada */}
                      <div className="px-4 py-3 bg-blue-50 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="text-xs font-medium text-blue-700">Next weighing</span>
                          </div>
                          <span className="text-xs text-blue-600 font-medium">
                            {getDaysUntilNextWeighing(record.nextWeighing)}
                          </span>
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
                          Current Weight
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Change
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Daily Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Age Group
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedRecords.map((record, index) => {
                        const TrendIcon = getTrendIcon(record.weightChange);
                        return (
                          <motion.tr
                            key={record.id}
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
                                    {record.animal}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    #{record.tagNumber} • {record.breed}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {formatNumber(record.currentWeight)} kg
                              </div>
                              <div className="text-sm text-gray-500">
                                BCS: {record.bodyConditionScore}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <TrendIcon className={`w-4 h-4 mr-1 ${getWeightChangeColor(record.weightChange)}`} />
                                <span className={`text-sm font-medium ${getWeightChangeColor(record.weightChange)}`}>
                                  {record.weightChange > 0 ? '+' : ''}{formatNumber(record.weightChange)} kg
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-medium ${getWeightChangeColor(record.gainRate)}`}>
                                {record.gainRate > 0 ? '+' : ''}{formatNumber(record.gainRate)} kg/day
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div>
                                {new Date(record.date).toLocaleDateString()}
                              </div>
                              <div className="text-xs">
                                {record.time}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAgeGroupColor(record.ageGroup)}`}>
                                {record.ageGroup}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHealthStatusColor(record.healthStatus)}`}>
                                {record.healthStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Link
                                  to={`/production/weight-tracking/${record.id}`}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <Link
                                  to={`/production/weight-tracking/edit/${record.id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => setShowDeleteModal(record.id)}
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

            {/* Vista Chart - Placeholder */}
            {viewMode === 'chart' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm border p-8"
              >
                <div className="text-center">
                  <LineChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Weight Trends Chart</h3>
                  <p className="text-gray-600 mb-6">
                    Interactive weight tracking charts and trend analysis will be available soon.
                  </p>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">Coming Features</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Weight progression timelines</li>
                      <li>• Growth rate comparisons</li>
                      <li>• Feed efficiency correlations</li>
                      <li>• Breed performance benchmarks</li>
                      <li>• Predictive weight modeling</li>
                    </ul>
                  </div>
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
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRecords.length)} of{' '}
                  {filteredRecords.length} results
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
                <h3 className="text-lg font-semibold text-gray-900">Delete Weight Record</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
           
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this weight record? This will permanently remove all associated data.
            </p>
           
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingRecordId}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deletingRecordId}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
              >
                {deletingRecordId ? (
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

export default WeightTracking;