// Frontend/src/pages/production/MilkProduction.jsx

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
  Droplets,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Cow,
  Thermometer,
  Scale,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  X,
  FileText,
  Activity,
  Star,
  Timer,
  Zap,
  Heart,
  Users,
  Calculator,
  Percent,
  DollarSign,
  Package,
  Beaker,
  FlaskConical,
  Gauge,
  TrendingRight,
  AlertCircle,
  Info,
  BookOpen,
  LineChart
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const MilkProduction = () => {
  // Estados para manejar los datos y la UI
  const [productions, setProductions] = useState([]);
  const [filteredProductions, setFilteredProductions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    animal: '',
    quality: '',
    shift: '',
    dateRange: 'week'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Estados para acciones
  const [selectedProductions, setSelectedProductions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProductionId, setDeletingProductionId] = useState(null);
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

  // Cargar producciones al montar el componente
  useEffect(() => {
    fetchProductions();
    
    // Mostrar mensaje de éxito si viene de otra página
    if (location.state?.message) {
      console.log(location.state.message);
    }
  }, []);

  // Aplicar filtros cuando cambien los datos o filtros
  useEffect(() => {
    applyFilters();
  }, [productions, searchTerm, filters, sortBy, sortOrder]);

  // Obtener lista de producciones de leche
  const fetchProductions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/production/milk', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProductions(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load milk production data');
      }
    } catch (error) {
      console.error('Fetch productions error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos de ejemplo mientras se carga la API real
  const mockProductions = [
    {
      id: 1,
      animal: 'Luna',
      tagNumber: 'L089',
      breed: 'Holstein',
      quantity: 28.5,
      unit: 'liters',
      quality: 'A',
      fatContent: 3.8,
      proteinContent: 3.2,
      somaticCellCount: 125000,
      temperature: 4.2,
      ph: 6.7,
      date: '2025-06-27',
      time: '06:30',
      shift: 'Morning',
      milkedBy: 'Carlos Rodriguez',
      location: 'Milking Parlor A',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      notes: 'Excellent quality milk. Animal in good health.',
      pricePerLiter: 0.85,
      totalValue: 24.23,
      equipment: 'Milking Machine #3',
      duration: 8, // minutes
      efficiency: 3.56, // liters per minute
      previousProduction: 27.2,
      trend: 'increasing',
      createdAt: '2025-06-27T06:30:00Z'
    },
    {
      id: 2,
      animal: 'Bella',
      tagNumber: 'B247',
      breed: 'Jersey',
      quantity: 22.1,
      unit: 'liters',
      quality: 'A+',
      fatContent: 4.2,
      proteinContent: 3.6,
      somaticCellCount: 98000,
      temperature: 4.0,
      ph: 6.8,
      date: '2025-06-27',
      time: '06:45',
      shift: 'Morning',
      milkedBy: 'Ana Martinez',
      location: 'Milking Parlor B',
      coordinates: { lat: 17.9885, lng: -92.9462 },
      notes: 'Premium quality milk with high fat content.',
      pricePerLiter: 0.92,
      totalValue: 20.33,
      equipment: 'Milking Machine #1',
      duration: 7,
      efficiency: 3.16,
      previousProduction: 21.8,
      trend: 'increasing',
      createdAt: '2025-06-27T06:45:00Z'
    },
    {
      id: 3,
      animal: 'Daisy',
      tagNumber: 'D234',
      breed: 'Holstein',
      quantity: 32.8,
      unit: 'liters',
      quality: 'A',
      fatContent: 3.6,
      proteinContent: 3.1,
      somaticCellCount: 145000,
      temperature: 4.3,
      ph: 6.6,
      date: '2025-06-27',
      time: '17:15',
      shift: 'Afternoon',
      milkedBy: 'Miguel Santos',
      location: 'Milking Parlor A',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      notes: 'High volume production. Good overall quality.',
      pricePerLiter: 0.85,
      totalValue: 27.88,
      equipment: 'Milking Machine #2',
      duration: 9,
      efficiency: 3.64,
      previousProduction: 31.5,
      trend: 'increasing',
      createdAt: '2025-06-27T17:15:00Z'
    },
    {
      id: 4,
      animal: 'Sophie',
      tagNumber: 'S789',
      breed: 'Brown Swiss',
      quantity: 26.4,
      unit: 'liters',
      quality: 'A',
      fatContent: 3.9,
      proteinContent: 3.4,
      somaticCellCount: 112000,
      temperature: 4.1,
      ph: 6.7,
      date: '2025-06-26',
      time: '18:30',
      shift: 'Afternoon',
      milkedBy: 'Carlos Rodriguez',
      location: 'Milking Parlor B',
      coordinates: { lat: 17.9885, lng: -92.9462 },
      notes: 'Consistent production. Good protein levels.',
      pricePerLiter: 0.87,
      totalValue: 22.97,
      equipment: 'Milking Machine #4',
      duration: 8,
      efficiency: 3.30,
      previousProduction: 26.8,
      trend: 'stable',
      createdAt: '2025-06-26T18:30:00Z'
    },
    {
      id: 5,
      animal: 'Molly',
      tagNumber: 'M159',
      breed: 'Guernsey',
      quantity: 19.7,
      unit: 'liters',
      quality: 'A+',
      fatContent: 4.5,
      proteinContent: 3.8,
      somaticCellCount: 89000,
      temperature: 3.9,
      ph: 6.9,
      date: '2025-06-26',
      time: '06:20',
      shift: 'Morning',
      milkedBy: 'Ana Martinez',
      location: 'Milking Parlor A',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      notes: 'Exceptional quality milk. Premium fat and protein content.',
      pricePerLiter: 0.95,
      totalValue: 18.72,
      equipment: 'Milking Machine #1',
      duration: 6,
      efficiency: 3.28,
      previousProduction: 20.1,
      trend: 'decreasing',
      createdAt: '2025-06-26T06:20:00Z'
    },
    {
      id: 6,
      animal: 'Thunder',
      tagNumber: 'T156',
      breed: 'Holstein',
      quantity: 30.2,
      unit: 'liters',
      quality: 'B+',
      fatContent: 3.4,
      proteinContent: 2.9,
      somaticCellCount: 195000,
      temperature: 4.5,
      ph: 6.5,
      date: '2025-06-26',
      time: '17:45',
      shift: 'Afternoon',
      milkedBy: 'Miguel Santos',
      location: 'Milking Parlor B',
      coordinates: { lat: 17.9885, lng: -92.9462 },
      notes: 'Good volume but slightly elevated cell count. Monitor health.',
      pricePerLiter: 0.78,
      totalValue: 23.56,
      equipment: 'Milking Machine #3',
      duration: 10,
      efficiency: 3.02,
      previousProduction: 29.8,
      trend: 'increasing',
      createdAt: '2025-06-26T17:45:00Z'
    },
    {
      id: 7,
      animal: 'Max',
      tagNumber: 'M456',
      breed: 'Jersey',
      quantity: 24.6,
      unit: 'liters',
      quality: 'A',
      fatContent: 4.0,
      proteinContent: 3.5,
      somaticCellCount: 108000,
      temperature: 4.2,
      ph: 6.8,
      date: '2025-06-25',
      time: '06:15',
      shift: 'Morning',
      milkedBy: 'Carlos Rodriguez',
      location: 'Milking Parlor A',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      notes: 'Steady production with good quality parameters.',
      pricePerLiter: 0.89,
      totalValue: 21.89,
      equipment: 'Milking Machine #2',
      duration: 7,
      efficiency: 3.51,
      previousProduction: 24.2,
      trend: 'increasing',
      createdAt: '2025-06-25T06:15:00Z'
    },
    {
      id: 8,
      animal: 'Rocky',
      tagNumber: 'R321',
      breed: 'Brown Swiss',
      quantity: 29.1,
      unit: 'liters',
      quality: 'A',
      fatContent: 3.7,
      proteinContent: 3.3,
      somaticCellCount: 127000,
      temperature: 4.1,
      ph: 6.7,
      date: '2025-06-25',
      time: '18:10',
      shift: 'Afternoon',
      milkedBy: 'Ana Martinez',
      location: 'Milking Parlor B',
      coordinates: { lat: 17.9885, lng: -92.9462 },
      notes: 'Excellent volume and quality. Healthy animal.',
      pricePerLiter: 0.86,
      totalValue: 25.03,
      equipment: 'Milking Machine #4',
      duration: 8,
      efficiency: 3.64,
      previousProduction: 28.7,
      trend: 'increasing',
      createdAt: '2025-06-25T18:10:00Z'
    }
  ];

  // Usar datos mock si no hay producciones reales
  const productionsData = productions.length > 0 ? productions : mockProductions;

  // Aplicar filtros y búsqueda
  const applyFilters = () => {
    let filtered = [...productionsData];

    // Aplicar búsqueda por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(production =>
        production.animal.toLowerCase().includes(term) ||
        production.tagNumber.toLowerCase().includes(term) ||
        production.breed.toLowerCase().includes(term) ||
        production.milkedBy.toLowerCase().includes(term) ||
        production.location.toLowerCase().includes(term)
      );
    }

    // Aplicar filtros específicos
    if (filters.animal) {
      filtered = filtered.filter(production => production.animal === filters.animal);
    }

    if (filters.quality) {
      filtered = filtered.filter(production => production.quality === filters.quality);
    }

    if (filters.shift) {
      filtered = filtered.filter(production => production.shift === filters.shift);
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const today = new Date();
      const productionDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filtered = filtered.filter(production => {
            const date = new Date(production.date);
            return date.toDateString() === today.toDateString();
          });
          break;
        case 'week':
          productionDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(production => {
            const date = new Date(production.date);
            return date >= productionDate && date <= today;
          });
          break;
        case 'month':
          productionDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(production => {
            const date = new Date(production.date);
            return date >= productionDate && date <= today;
          });
          break;
        case 'quarter':
          productionDate.setMonth(today.getMonth() - 3);
          filtered = filtered.filter(production => {
            const date = new Date(production.date);
            return date >= productionDate && date <= today;
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
      if (sortBy === 'date' || sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Manejo especial para números
      if (sortBy === 'quantity' || sortBy === 'fatContent' || sortBy === 'proteinContent' || sortBy === 'totalValue') {
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

    setFilteredProductions(filtered);
    setCurrentPage(1);
  };

  // Obtener color de la calidad
  const getQualityColor = (quality) => {
    switch (quality) {
      case 'A+': return 'text-green-600 bg-green-100';
      case 'A': return 'text-blue-600 bg-blue-100';
      case 'B+': return 'text-yellow-600 bg-yellow-100';
      case 'B': return 'text-orange-600 bg-orange-100';
      case 'C': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Obtener color del trend
  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  // Obtener icono del trend
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return TrendingUp;
      case 'decreasing': return TrendingDown;
      case 'stable': return TrendingRight;
      default: return TrendingRight;
    }
  };

  // Obtener color del turno
  const getShiftColor = (shift) => {
    switch (shift) {
      case 'Morning': return 'text-orange-600 bg-orange-100';
      case 'Afternoon': return 'text-blue-600 bg-blue-100';
      case 'Evening': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Formatear cantidad
  const formatQuantity = (quantity, unit) => {
    return `${quantity} ${unit}`;
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calcular eficiencia de producción
  const calculateEfficiency = (quantity, duration) => {
    return duration > 0 ? (quantity / duration).toFixed(2) : 0;
  };

  // Manejar eliminación de producción
  const handleDelete = async (productionId) => {
    setDeletingProductionId(productionId);
    
    try {
      const response = await fetch(`/api/production/milk/${productionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setProductions(prev => prev.filter(production => production.id !== productionId));
        setShowDeleteModal(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete production record');
      }
    } catch (error) {
      console.error('Delete production error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setDeletingProductionId(null);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      animal: '',
      quality: '',
      shift: '',
      dateRange: 'week'
    });
    setShowFilters(false);
  };

  // Calcular estadísticas
  const stats = {
    total: productionsData.length,
    totalVolume: productionsData.reduce((sum, production) => sum + production.quantity, 0),
    averageVolume: productionsData.length > 0 ? productionsData.reduce((sum, production) => sum + production.quantity, 0) / productionsData.length : 0,
    totalValue: productionsData.reduce((sum, production) => sum + production.totalValue, 0),
    averageQuality: {
      'A+': productionsData.filter(p => p.quality === 'A+').length,
      'A': productionsData.filter(p => p.quality === 'A').length,
      'B+': productionsData.filter(p => p.quality === 'B+').length,
      'B': productionsData.filter(p => p.quality === 'B').length
    },
    averageFatContent: productionsData.length > 0 ? productionsData.reduce((sum, production) => sum + production.fatContent, 0) / productionsData.length : 0,
    averageProteinContent: productionsData.length > 0 ? productionsData.reduce((sum, production) => sum + production.proteinContent, 0) / productionsData.length : 0
  };

  // Datos para paginación
  const totalPages = Math.ceil(filteredProductions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProductions = filteredProductions.slice(startIndex, startIndex + itemsPerPage);

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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading milk production data...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Milk Production</h1>
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <span>{stats.total} records</span>
                <span className="text-blue-600">{stats.totalVolume.toFixed(1)}L total</span>
                <span className="text-green-600">{stats.averageVolume.toFixed(1)}L avg</span>
                <span className="text-purple-600">{formatCurrency(stats.totalValue)} value</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchProductions}
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
                to="/production/milk/add"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Record Production
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
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Total Volume</h3>
                <Droplets className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalVolume.toFixed(1)}L</div>
              <p className="text-sm text-gray-500 mt-1">This period</p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Average Volume</h3>
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.averageVolume.toFixed(1)}L</div>
              <p className="text-sm text-gray-500 mt-1">Per milking</p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Quality Distribution</h3>
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>A+: {stats.averageQuality['A+']}</span>
                  <span>A: {stats.averageQuality['A']}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>B+: {stats.averageQuality['B+']}</span>
                  <span>B: {stats.averageQuality['B']}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Total Value</h3>
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(stats.totalValue)}</div>
              <p className="text-sm text-gray-500 mt-1">Revenue generated</p>
            </motion.div>
          </div>

          {/* Controles de filtro y búsqueda */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-xl shadow-sm border p-6"
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
                    placeholder="Search by animal, tag, breed, or operator..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Controles de vista y filtros */}
              <div className="flex items-center space-x-3">
                {/* Filtros rápidos */}
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="all">All Time</option>
                </select>

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
                  <option value="date-desc">Date: Latest First</option>
                  <option value="date-asc">Date: Earliest First</option>
                  <option value="quantity-desc">Volume: Highest First</option>
                  <option value="quantity-asc">Volume: Lowest First</option>
                  <option value="quality-desc">Quality: Best First</option>
                  <option value="animal-asc">Animal A-Z</option>
                  <option value="totalValue-desc">Value: Highest First</option>
                </select>

                {/* Botón de filtros */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-3 py-2 border rounded-lg transition-colors ${
                    showFilters || Object.values(filters).some(f => f && f !== 'week')
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Animal</label>
                      <select
                        value={filters.animal}
                        onChange={(e) => setFilters(prev => ({ ...prev, animal: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="">All animals</option>
                        <option value="Luna">Luna</option>
                        <option value="Bella">Bella</option>
                        <option value="Daisy">Daisy</option>
                        <option value="Sophie">Sophie</option>
                        <option value="Molly">Molly</option>
                        <option value="Thunder">Thunder</option>
                        <option value="Max">Max</option>
                        <option value="Rocky">Rocky</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
                      <select
                        value={filters.quality}
                        onChange={(e) => setFilters(prev => ({ ...prev, quality: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="">All qualities</option>
                        <option value="A+">A+ Premium</option>
                        <option value="A">A Good</option>
                        <option value="B+">B+ Fair</option>
                        <option value="B">B Standard</option>
                        <option value="C">C Below Standard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                      <select
                        value={filters.shift}
                        onChange={(e) => setFilters(prev => ({ ...prev, shift: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="">All shifts</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      {Object.values(filters).some(f => f && f !== 'week') && (
                        <button
                          onClick={clearFilters}
                          className="w-full flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Clear filters
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

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

          {/* Contenido principal */}
          {filteredProductions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || Object.values(filters).some(f => f && f !== 'week')
                  ? 'No production records found'
                  : 'No production records yet'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || Object.values(filters).some(f => f && f !== 'week')
                  ? 'Try adjusting your search or filters'
                  : 'Get started by recording your first milk production'
                }
              </p>
              {!searchTerm && !Object.values(filters).some(f => f && f !== 'week') && (
                <Link
                  to="/production/milk/add"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Record First Production
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
                  className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {paginatedProductions.map((production) => {
                    const TrendIcon = getTrendIcon(production.trend);
                    return (
                      <motion.div
                        key={production.id}
                        variants={cardVariants}
                        whileHover="hover"
                        className="bg-white rounded-xl shadow-sm border overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/production/milk/${production.id}`)}
                      >
                        {/* Header */}
                        <div className="p-6 pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Cow className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{production.animal}</h3>
                                <p className="text-sm text-gray-600">#{production.tagNumber} - {production.breed}</p>
                              </div>
                            </div>
                            
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowActionMenu(showActionMenu === production.id ? null : production.id);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              
                              {showActionMenu === production.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="absolute right-0 top-6 bg-white rounded-lg shadow-lg border z-10 min-w-32"
                                >
                                  <Link
                                    to={`/production/milk/${production.id}`}
                                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </Link>
                                  <Link
                                    to={`/production/milk/edit/${production.id}`}
                                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </Link>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowDeleteModal(production.id);
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

                          {/* Información principal */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Droplets className="w-5 h-5 text-blue-600" />
                                <span className="text-2xl font-bold text-gray-900">
                                  {formatQuantity(production.quantity, production.unit)}
                                </span>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getQualityColor(production.quality)}`}>
                                {production.quality}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center text-gray-600">
                                  <TrendIcon className={`w-4 h-4 mr-1 ${getTrendColor(production.trend)}`} />
                                  <span className={getTrendColor(production.trend)}>
                                    {production.trend}
                                  </span>
                                </div>
                                <span className="font-medium text-green-600">
                                  {formatCurrency(production.totalValue)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Información detallada */}
                        <div className="px-6 pb-4 space-y-2 text-sm text-gray-600">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{new Date(production.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{production.time}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getShiftColor(production.shift)}`}>
                              {production.shift}
                            </span>
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              <span>{production.milkedBy}</span>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="truncate">{production.location}</span>
                          </div>
                        </div>

                        {/* Footer con métricas */}
                        <div className="px-6 py-3 bg-gray-50 border-t">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-xs text-gray-500">Fat</p>
                              <p className="text-sm font-medium">{production.fatContent}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Protein</p>
                              <p className="text-sm font-medium">{production.proteinContent}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Efficiency</p>
                              <p className="text-sm font-medium">{production.efficiency}L/min</p>
                            </div>
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
                            Volume
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quality
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Operator
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedProductions.map((production, index) => {
                          const TrendIcon = getTrendIcon(production.trend);
                          return (
                            <motion.tr
                              key={production.id}
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
                                      {production.animal}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      #{production.tagNumber} - {production.breed}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Droplets className="w-4 h-4 text-blue-600 mr-2" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {formatQuantity(production.quantity, production.unit)}
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500">
                                      <TrendIcon className={`w-3 h-3 mr-1 ${getTrendColor(production.trend)}`} />
                                      <span className={getTrendColor(production.trend)}>
                                        {production.trend}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getQualityColor(production.quality)}`}>
                                  {production.quality}
                                </span>
                                <div className="text-xs text-gray-500 mt-1">
                                  Fat: {production.fatContent}% | Protein: {production.proteinContent}%
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>{new Date(production.date).toLocaleDateString()}</div>
                                <div className="text-xs">{production.time} - {production.shift}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>{production.milkedBy}</div>
                                <div className="text-xs text-gray-400 truncate max-w-32">
                                  {production.location}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatCurrency(production.totalValue)}
                                <div className="text-xs text-gray-500">
                                  {formatCurrency(production.pricePerLiter)}/L
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                  <Link
                                    to={`/production/milk/${production.id}`}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Link>
                                  <Link
                                    to={`/production/milk/edit/${production.id}`}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Link>
                                  <button
                                    onClick={() => setShowDeleteModal(production.id)}
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
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProductions.length)} of{' '}
                    {filteredProductions.length} results
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
                <h3 className="text-lg font-semibold text-gray-900">Delete Production Record</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this milk production record? This will permanently remove all associated data.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingProductionId}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deletingProductionId}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
              >
                {deletingProductionId ? (
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

export default MilkProduction;