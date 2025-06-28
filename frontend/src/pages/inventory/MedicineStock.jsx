// Frontend/src/pages/inventory/MedicineStock.jsx

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
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pills,
  Syringe,
  Shield,
  Heart,
  Activity,
  Zap,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  X,
  FileText,
  Thermometer,
  DollarSign,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  Building,
  User,
  Star,
  Award,
  Target,
  Timer,
  Truck,
  ShoppingCart,
  Archive,
  QrCode,
  Barcode,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const MedicineStock = () => {
  // Estados para manejar los datos y la UI
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    location: '',
    supplier: '',
    stockLevel: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Estados para acciones
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMedicineId, setDeletingMedicineId] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showStockAdjustModal, setShowStockAdjustModal] = useState(null);

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

  // Cargar medicamentos al montar el componente
  useEffect(() => {
    fetchMedicines();
    
    // Mostrar mensaje de éxito si viene de otra página
    if (location.state?.message) {
      console.log(location.state.message);
    }
  }, []);

  // Aplicar filtros cuando cambien los datos o filtros
  useEffect(() => {
    applyFilters();
  }, [medicines, searchTerm, filters, sortBy, sortOrder]);

  // Obtener lista de medicamentos
  const fetchMedicines = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/inventory/medicines', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMedicines(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load medicine stock');
      }
    } catch (error) {
      console.error('Fetch medicines error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos de ejemplo mientras se carga la API real
  const mockMedicines = [
    {
      id: 1,
      name: 'Penicillin G Injectable',
      commercialName: 'Pen-Aqueous',
      activeIngredient: 'Benzylpenicillin sodium',
      category: 'Antibiotics',
      manufacturer: 'Boehringer Ingelheim',
      presentation: '100ml vial',
      dosageForm: 'Injectable solution',
      strength: '300,000 IU/ml',
      currentStock: 5,
      minimumStock: 20,
      maximumStock: 100,
      unitCost: 15.50,
      totalValue: 77.50,
      location: 'Medical Storage Room A',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      batchNumber: 'PEN2025-001',
      expiryDate: '2026-08-15',
      supplier: 'VetMed Supplies',
      lastRestocked: '2025-06-15',
      daysUntilExpiry: 414,
      status: 'low_stock',
      requiresPrescription: true,
      storageConditions: 'Store at 2-8°C',
      barcode: '7892345671234',
      notes: 'First-line antibiotic for bacterial infections',
      usageFrequency: 'high',
      createdAt: '2025-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Vitamin B12 Complex',
      commercialName: 'B-Complex Pro',
      activeIngredient: 'Cyanocobalamin, Thiamine, Riboflavin',
      category: 'Vitamins & Supplements',
      manufacturer: 'Ceva Animal Health',
      presentation: '50ml vial',
      dosageForm: 'Injectable solution',
      strength: '1000mcg/ml B12',
      currentStock: 15,
      minimumStock: 50,
      maximumStock: 200,
      unitCost: 8.75,
      totalValue: 131.25,
      location: 'Main Pharmacy',
      coordinates: { lat: 17.9885, lng: -92.9462 },
      batchNumber: 'VIT2025-008',
      expiryDate: '2026-12-20',
      supplier: 'Animal Health Direct',
      lastRestocked: '2025-06-10',
      daysUntilExpiry: 541,
      status: 'low_stock',
      requiresPrescription: false,
      storageConditions: 'Store at room temperature',
      barcode: '7892345671235',
      notes: 'Essential vitamin complex for metabolism support',
      usageFrequency: 'high',
      createdAt: '2025-02-01T14:20:00Z'
    },
    {
      id: 3,
      name: 'Antiseptic Solution',
      commercialName: 'Betadine Veterinary',
      activeIngredient: 'Povidone iodine 10%',
      category: 'Wound Care',
      manufacturer: 'Mundipharma',
      presentation: '500ml bottle',
      dosageForm: 'Topical solution',
      strength: '10% w/v',
      currentStock: 8,
      minimumStock: 25,
      maximumStock: 75,
      unitCost: 12.30,
      totalValue: 98.40,
      location: 'Treatment Center',
      coordinates: { lat: 17.9878, lng: -92.9502 },
      batchNumber: 'ANT2025-005',
      expiryDate: '2027-03-10',
      supplier: 'Medical Supplies Plus',
      lastRestocked: '2025-05-28',
      daysUntilExpiry: 622,
      status: 'low_stock',
      requiresPrescription: false,
      storageConditions: 'Store in cool, dry place',
      barcode: '7892345671236',
      notes: 'Broad-spectrum antiseptic for wound cleaning',
      usageFrequency: 'medium',
      createdAt: '2025-01-20T09:15:00Z'
    },
    {
      id: 4,
      name: 'Dexamethasone Injectable',
      commercialName: 'Dexafort',
      activeIngredient: 'Dexamethasone sodium phosphate',
      category: 'Anti-inflammatory',
      manufacturer: 'MSD Animal Health',
      presentation: '20ml vial',
      dosageForm: 'Injectable solution',
      strength: '2mg/ml',
      currentStock: 45,
      minimumStock: 30,
      maximumStock: 80,
      unitCost: 22.80,
      totalValue: 1026.00,
      location: 'Medical Storage Room A',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      batchNumber: 'DEX2025-012',
      expiryDate: '2026-09-30',
      supplier: 'VetMed Supplies',
      lastRestocked: '2025-06-20',
      daysUntilExpiry: 460,
      status: 'in_stock',
      requiresPrescription: true,
      storageConditions: 'Store at 2-8°C, protect from light',
      barcode: '7892345671237',
      notes: 'Potent corticosteroid for inflammatory conditions',
      usageFrequency: 'medium',
      createdAt: '2025-03-05T11:45:00Z'
    },
    {
      id: 5,
      name: 'Ivermectin Injectable',
      commercialName: 'Ivomec',
      activeIngredient: 'Ivermectin 1%',
      category: 'Antiparasitic',
      manufacturer: 'Boehringer Ingelheim',
      presentation: '50ml vial',
      dosageForm: 'Injectable solution',
      strength: '10mg/ml',
      currentStock: 25,
      minimumStock: 15,
      maximumStock: 60,
      unitCost: 35.00,
      totalValue: 875.00,
      location: 'Main Pharmacy',
      coordinates: { lat: 17.9885, lng: -92.9462 },
      batchNumber: 'IVM2025-007',
      expiryDate: '2026-11-15',
      supplier: 'Animal Health Direct',
      lastRestocked: '2025-06-18',
      daysUntilExpiry: 507,
      status: 'in_stock',
      requiresPrescription: true,
      storageConditions: 'Store at room temperature, protect from light',
      barcode: '7892345671238',
      notes: 'Broad-spectrum antiparasitic treatment',
      usageFrequency: 'high',
      createdAt: '2025-02-15T16:30:00Z'
    },
    {
      id: 6,
      name: 'FMD Vaccine',
      commercialName: 'Aftovaxpur',
      activeIngredient: 'Inactivated FMD virus strains',
      category: 'Vaccines',
      manufacturer: 'Boehringer Ingelheim',
      presentation: '10-dose vial',
      dosageForm: 'Injectable suspension',
      strength: '2ml/dose',
      currentStock: 12,
      minimumStock: 25,
      maximumStock: 50,
      unitCost: 45.75,
      totalValue: 549.00,
      location: 'Cold Storage Unit 1',
      coordinates: { lat: 17.9890, lng: -92.9458 },
      batchNumber: 'FMD2025-003',
      expiryDate: '2025-07-30',
      supplier: 'Vaccine Supply Chain',
      lastRestocked: '2025-05-15',
      daysUntilExpiry: 33,
      status: 'near_expiry',
      requiresPrescription: true,
      storageConditions: 'Store at 2-8°C, do not freeze',
      barcode: '7892345671239',
      notes: 'CRITICAL: Near expiry - use immediately',
      usageFrequency: 'seasonal',
      createdAt: '2025-05-15T08:00:00Z'
    },
    {
      id: 7,
      name: 'Calcium Gluconate',
      commercialName: 'Cal-Dextro B12',
      activeIngredient: 'Calcium gluconate, Dextrose, Vitamin B12',
      category: 'Metabolic Support',
      manufacturer: 'Norbrook',
      presentation: '500ml bottle',
      dosageForm: 'Injectable solution',
      strength: '230mg/ml calcium',
      currentStock: 18,
      minimumStock: 20,
      maximumStock: 60,
      unitCost: 28.50,
      totalValue: 513.00,
      location: 'Emergency Supplies',
      coordinates: { lat: 17.9892, lng: -92.9468 },
      batchNumber: 'CAL2025-009',
      expiryDate: '2026-06-25',
      supplier: 'Emergency Med Supply',
      lastRestocked: '2025-06-12',
      daysUntilExpiry: 363,
      status: 'adequate',
      requiresPrescription: true,
      storageConditions: 'Store at room temperature',
      barcode: '7892345671240',
      notes: 'Essential for treating milk fever and hypocalcemia',
      usageFrequency: 'seasonal',
      createdAt: '2025-04-01T12:00:00Z'
    },
    {
      id: 8,
      name: 'Expired Antibiotic Lot',
      commercialName: 'Amoxicillin LA',
      activeIngredient: 'Amoxicillin trihydrate',
      category: 'Antibiotics',
      manufacturer: 'Zoetis',
      presentation: '100ml vial',
      dosageForm: 'Long-acting injectable',
      strength: '150mg/ml',
      currentStock: 8,
      minimumStock: 0,
      maximumStock: 0,
      unitCost: 18.90,
      totalValue: 151.20,
      location: 'Quarantine Storage',
      coordinates: { lat: 17.9888, lng: -92.9465 },
      batchNumber: 'AMX2024-088',
      expiryDate: '2025-06-20',
      supplier: 'Pharmaceutical Depot',
      lastRestocked: '2024-12-20',
      daysUntilExpiry: -7,
      status: 'expired',
      requiresPrescription: true,
      storageConditions: 'Store at 2-8°C',
      barcode: '7892345671241',
      notes: 'EXPIRED - Schedule for proper disposal',
      usageFrequency: 'high',
      createdAt: '2024-12-20T14:30:00Z'
    }
  ];

  // Usar datos mock si no hay medicamentos reales
  const medicinesData = medicines.length > 0 ? medicines : mockMedicines;

  // Aplicar filtros y búsqueda
  const applyFilters = () => {
    let filtered = [...medicinesData];

    // Aplicar búsqueda por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(medicine =>
        medicine.name.toLowerCase().includes(term) ||
        medicine.commercialName.toLowerCase().includes(term) ||
        medicine.activeIngredient.toLowerCase().includes(term) ||
        medicine.category.toLowerCase().includes(term) ||
        medicine.manufacturer.toLowerCase().includes(term) ||
        medicine.batchNumber.toLowerCase().includes(term)
      );
    }

    // Aplicar filtros específicos
    if (filters.category) {
      filtered = filtered.filter(medicine => medicine.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter(medicine => medicine.status === filters.status);
    }

    if (filters.location) {
      filtered = filtered.filter(medicine => medicine.location === filters.location);
    }

    if (filters.supplier) {
      filtered = filtered.filter(medicine => medicine.supplier === filters.supplier);
    }

    if (filters.stockLevel && filters.stockLevel !== 'all') {
      switch (filters.stockLevel) {
        case 'low':
          filtered = filtered.filter(medicine => medicine.currentStock <= medicine.minimumStock);
          break;
        case 'adequate':
          filtered = filtered.filter(medicine => 
            medicine.currentStock > medicine.minimumStock && 
            medicine.currentStock < medicine.maximumStock * 0.8
          );
          break;
        case 'high':
          filtered = filtered.filter(medicine => medicine.currentStock >= medicine.maximumStock * 0.8);
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
      if (sortBy === 'expiryDate' || sortBy === 'lastRestocked' || sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Manejo especial para números
      if (sortBy === 'currentStock' || sortBy === 'unitCost' || sortBy === 'totalValue' || sortBy === 'daysUntilExpiry') {
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

    setFilteredMedicines(filtered);
    setCurrentPage(1);
  };

  // Obtener icono de categoría
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Antibiotics': return Pills;
      case 'Vaccines': return Syringe;
      case 'Vitamins & Supplements': return Heart;
      case 'Anti-inflammatory': return Shield;
      case 'Antiparasitic': return Target;
      case 'Wound Care': return Activity;
      case 'Metabolic Support': return Zap;
      default: return Package;
    }
  };

  // Obtener color de categoría
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Antibiotics': return 'bg-blue-500 text-white';
      case 'Vaccines': return 'bg-purple-500 text-white';
      case 'Vitamins & Supplements': return 'bg-green-500 text-white';
      case 'Anti-inflammatory': return 'bg-red-500 text-white';
      case 'Antiparasitic': return 'bg-yellow-500 text-white';
      case 'Wound Care': return 'bg-orange-500 text-white';
      case 'Metabolic Support': return 'bg-indigo-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Obtener color del estado de stock
  const getStockStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'text-green-600 bg-green-100';
      case 'low_stock': return 'text-orange-600 bg-orange-100';
      case 'out_of_stock': return 'text-red-600 bg-red-100';
      case 'near_expiry': return 'text-yellow-600 bg-yellow-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'adequate': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Obtener nivel de stock
  const getStockLevel = (current, minimum, maximum) => {
    const percentage = (current / maximum) * 100;
    if (current <= minimum) return { level: 'Low', color: 'bg-red-500', percentage: Math.max(percentage, 5) };
    if (current >= maximum * 0.8) return { level: 'High', color: 'bg-green-500', percentage };
    return { level: 'Adequate', color: 'bg-blue-500', percentage };
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Obtener días hasta vencimiento
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Manejar eliminación de medicamento
  const handleDelete = async (medicineId) => {
    setDeletingMedicineId(medicineId);
    
    try {
      const response = await fetch(`/api/inventory/medicines/${medicineId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setMedicines(prev => prev.filter(medicine => medicine.id !== medicineId));
        setShowDeleteModal(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete medicine');
      }
    } catch (error) {
      console.error('Delete medicine error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setDeletingMedicineId(null);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      status: '',
      location: '',
      supplier: '',
      stockLevel: 'all'
    });
    setShowFilters(false);
  };

  // Calcular estadísticas
  const stats = {
    total: medicinesData.length,
    inStock: medicinesData.filter(m => m.status === 'in_stock').length,
    lowStock: medicinesData.filter(m => m.status === 'low_stock').length,
    expired: medicinesData.filter(m => m.status === 'expired').length,
    totalValue: medicinesData.reduce((sum, medicine) => sum + medicine.totalValue, 0),
    nearExpiry: medicinesData.filter(m => m.daysUntilExpiry <= 30 && m.daysUntilExpiry > 0).length
  };

  // Datos para paginación
  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMedicines = filteredMedicines.slice(startIndex, startIndex + itemsPerPage);

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
            <p className="text-gray-600">Loading medicine stock...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Medicine Stock</h1>
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <span>{stats.total} total</span>
                <span className="text-green-600">{stats.inStock} in stock</span>
                <span className="text-orange-600">{stats.lowStock} low stock</span>
                <span className="text-red-600">{stats.expired} expired</span>
                <span className="text-purple-600">{formatCurrency(stats.totalValue)} total value</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchMedicines}
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
                to="/inventory/medicines/add"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medicine
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
                  placeholder="Search medicines by name, ingredient, category, batch..."
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
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="currentStock-asc">Stock: Low to High</option>
                <option value="currentStock-desc">Stock: High to Low</option>
                <option value="expiryDate-asc">Expiry: Earliest First</option>
                <option value="expiryDate-desc">Expiry: Latest First</option>
                <option value="totalValue-desc">Value: Highest First</option>
                <option value="lastRestocked-desc">Recently Restocked</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All categories</option>
                      <option value="Antibiotics">Antibiotics</option>
                      <option value="Vaccines">Vaccines</option>
                      <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                      <option value="Anti-inflammatory">Anti-inflammatory</option>
                      <option value="Antiparasitic">Antiparasitic</option>
                      <option value="Wound Care">Wound Care</option>
                      <option value="Metabolic Support">Metabolic Support</option>
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
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="near_expiry">Near Expiry</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All locations</option>
                      <option value="Medical Storage Room A">Medical Storage Room A</option>
                      <option value="Main Pharmacy">Main Pharmacy</option>
                      <option value="Treatment Center">Treatment Center</option>
                      <option value="Cold Storage Unit 1">Cold Storage Unit 1</option>
                      <option value="Emergency Supplies">Emergency Supplies</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Level</label>
                    <select
                      value={filters.stockLevel}
                      onChange={(e) => setFilters(prev => ({ ...prev, stockLevel: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="all">All levels</option>
                      <option value="low">Low Stock</option>
                      <option value="adequate">Adequate Stock</option>
                      <option value="high">High Stock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <select
                      value={filters.supplier}
                      onChange={(e) => setFilters(prev => ({ ...prev, supplier: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All suppliers</option>
                      <option value="VetMed Supplies">VetMed Supplies</option>
                      <option value="Animal Health Direct">Animal Health Direct</option>
                      <option value="Medical Supplies Plus">Medical Supplies Plus</option>
                      <option value="Vaccine Supply Chain">Vaccine Supply Chain</option>
                      <option value="Emergency Med Supply">Emergency Med Supply</option>
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
        {filteredMedicines.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || Object.values(filters).some(f => f && f !== 'all')
                ? 'No medicines found'
                : 'No medicines in stock'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(filters).some(f => f && f !== 'all')
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first medicine to inventory'
              }
            </p>
            {!searchTerm && !Object.values(filters).some(f => f && f !== 'all') && (
              <Link
                to="/inventory/medicines/add"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Medicine
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
                {paginatedMedicines.map((medicine) => {
                  const IconComponent = getCategoryIcon(medicine.category);
                  const stockLevel = getStockLevel(medicine.currentStock, medicine.minimumStock, medicine.maximumStock);
                  return (
                    <motion.div
                      key={medicine.id}
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white rounded-xl shadow-sm border overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/inventory/medicines/${medicine.id}`)}
                    >
                      {/* Header del medicamento */}
                      <div className="p-4 pb-2">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className={`p-2 rounded-lg ${getCategoryColor(medicine.category)}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm truncate">{medicine.name}</h3>
                              <p className="text-xs text-gray-500 truncate">{medicine.commercialName}</p>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionMenu(showActionMenu === medicine.id ? null : medicine.id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {showActionMenu === medicine.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-0 top-6 bg-white rounded-lg shadow-lg border z-10 min-w-32"
                              >
                                <Link
                                  to={`/inventory/medicines/${medicine.id}`}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Link>
                                <Link
                                  to={`/inventory/medicines/edit/${medicine.id}`}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowStockAdjustModal(medicine.id);
                                    setShowActionMenu(null);
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                >
                                  <ArrowUpDown className="w-4 h-4 mr-2" />
                                  Adjust Stock
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteModal(medicine.id);
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
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(medicine.status)}`}>
                              {medicine.status.replace('_', ' ')}
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {formatCurrency(medicine.totalValue)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Información del stock */}
                      <div className="px-4 pb-4">
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>Current Stock:</span>
                            <span className="font-medium">{medicine.currentStock} units</span>
                          </div>
                          
                          <div className="mb-2">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Stock Level: {stockLevel.level}</span>
                              <span>{Math.round(stockLevel.percentage)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`${stockLevel.color} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${stockLevel.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>
                              {medicine.daysUntilExpiry > 0 
                                ? `Expires in ${medicine.daysUntilExpiry} days`
                                : `Expired ${Math.abs(medicine.daysUntilExpiry)} days ago`
                              }
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="truncate">{medicine.location}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Building className="w-4 h-4 mr-2" />
                            <span className="truncate">{medicine.manufacturer}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer con batch y precio */}
                      <div className="px-4 py-3 bg-gray-50 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <QrCode className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="text-xs font-medium text-gray-700 truncate">
                              Batch: {medicine.batchNumber}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatCurrency(medicine.unitCost)}/unit
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
                          Medicine
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expiry
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
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
                      {paginatedMedicines.map((medicine, index) => {
                        const IconComponent = getCategoryIcon(medicine.category);
                        return (
                          <motion.tr
                            key={medicine.id}
                            variants={tableRowVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Package className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {medicine.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {medicine.commercialName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <IconComponent className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm text-gray-900">{medicine.category}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div>
                                {medicine.currentStock} / {medicine.minimumStock} min
                              </div>
                              <div className="text-xs">
                                Max: {medicine.maximumStock}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(medicine.status)}`}>
                                {medicine.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div>
                                {new Date(medicine.expiryDate).toLocaleDateString()}
                              </div>
                              <div className="text-xs">
                                {medicine.daysUntilExpiry > 0 
                                  ? `${medicine.daysUntilExpiry} days`
                                  : `Expired`
                                }
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <Building className="w-4 h-4 mr-1" />
                                <span className="truncate max-w-xs">{medicine.location}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(medicine.totalValue)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Link
                                  to={`/inventory/medicines/${medicine.id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <Link
                                  to={`/inventory/medicines/edit/${medicine.id}`}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => setShowDeleteModal(medicine.id)}
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
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMedicines.length)} of{' '}
                  {filteredMedicines.length} results
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
                <h3 className="text-lg font-semibold text-gray-900">Delete Medicine</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this medicine from inventory? This will permanently remove all associated data.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingMedicineId}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deletingMedicineId}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
              >
                {deletingMedicineId ? (
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

export default MedicineStock;