// Frontend/src/pages/finances/ExpenseTracking.jsx

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
  DollarSign,
  CreditCard,
  Receipt,
  TrendingDown,
  ArrowDownRight,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  SortAsc,
  SortDesc,
  X,
  ShoppingCart,
  Truck,
  Heart,
  Users,
  Zap,
  Building,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  FileText,
  Camera,
  Upload
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ExpenseTracking = () => {
  // Estados para manejar los datos y la UI
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    paymentMethod: '',
    dateRange: 'all',
    amountRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Estados para acciones
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

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

  // Cargar gastos al montar el componente
  useEffect(() => {
    fetchExpenses();
    
    // Mostrar mensaje de éxito si viene de otra página
    if (location.state?.message) {
      console.log(location.state.message);
    }
  }, []);

  // Aplicar filtros cuando cambien los datos o filtros
  useEffect(() => {
    applyFilters();
  }, [expenses, searchTerm, filters, sortBy, sortOrder]);

  // Obtener lista de gastos
  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/finances/expenses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load expenses');
      }
    } catch (error) {
      console.error('Fetch expenses error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos de ejemplo mientras se carga la API real
  const mockExpenses = [
    {
      id: 1,
      description: 'Premium cattle feed delivery',
      category: 'Feed & Nutrition',
      amount: 3250.00,
      paymentMethod: 'Bank Transfer',
      date: '2025-06-26',
      location: 'Main Ranch - Feed Storage',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      vendor: 'FeedMax Co.',
      receipt: 'receipt_001.pdf',
      notes: 'Monthly feed supply for 50 head of cattle',
      status: 'completed',
      createdAt: '2025-06-26T10:30:00Z'
    },
    {
      id: 2,
      description: 'Veterinary consultation and vaccination',
      category: 'Veterinary Care',
      amount: 850.00,
      paymentMethod: 'Credit Card',
      date: '2025-06-25',
      location: 'North Pasture',
      coordinates: { lat: 17.9912, lng: -92.9488 },
      vendor: 'Dr. Smith Veterinary Services',
      receipt: 'vet_invoice_002.pdf',
      notes: 'Annual vaccination program for breeding stock',
      status: 'completed',
      createdAt: '2025-06-25T14:15:00Z'
    },
    {
      id: 3,
      description: 'Fence repair materials',
      category: 'Equipment & Maintenance',
      amount: 1250.00,
      paymentMethod: 'Cash',
      date: '2025-06-24',
      location: 'West Boundary Fence',
      coordinates: { lat: 17.9878, lng: -92.9502 },
      vendor: 'Ranch Supply Store',
      receipt: null,
      notes: 'Wire mesh and posts for perimeter fence repair',
      status: 'completed',
      createdAt: '2025-06-24T09:45:00Z'
    },
    {
      id: 4,
      description: 'Labor costs - Farm workers',
      category: 'Labor Costs',
      amount: 2400.00,
      paymentMethod: 'Bank Transfer',
      date: '2025-06-23',
      location: 'Main Ranch',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      vendor: 'Weekly Payroll',
      receipt: 'payroll_june_week4.pdf',
      notes: 'Weekly wages for 4 farm workers',
      status: 'completed',
      createdAt: '2025-06-23T16:00:00Z'
    },
    {
      id: 5,
      description: 'Electricity bill - Main facility',
      category: 'Utilities & Infrastructure',
      amount: 420.75,
      paymentMethod: 'Auto Pay',
      date: '2025-06-22',
      location: 'Main Ranch Buildings',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      vendor: 'CFE Electric Company',
      receipt: 'electric_bill_june.pdf',
      notes: 'Monthly electricity consumption',
      status: 'completed',
      createdAt: '2025-06-22T08:30:00Z'
    },
    {
      id: 6,
      description: 'Medical supplies and antibiotics',
      category: 'Veterinary Care',
      amount: 320.50,
      paymentMethod: 'Credit Card',
      date: '2025-06-21',
      location: 'Medical Storage',
      coordinates: { lat: 17.9890, lng: -92.9480 },
      vendor: 'VetSupply Mexico',
      receipt: 'medical_supplies_001.pdf',
      notes: 'Antibiotics and first aid supplies',
      status: 'completed',
      createdAt: '2025-06-21T11:20:00Z'
    },
    {
      id: 7,
      description: 'Fuel for farm vehicles',
      category: 'Equipment & Maintenance',
      amount: 180.00,
      paymentMethod: 'Cash',
      date: '2025-06-20',
      location: 'Gas Station - Highway 180',
      coordinates: { lat: 17.9845, lng: -92.9420 },
      vendor: 'Pemex Station',
      receipt: 'fuel_receipt_001.jpg',
      notes: 'Diesel for tractors and pickup truck',
      status: 'completed',
      createdAt: '2025-06-20T15:45:00Z'
    },
    {
      id: 8,
      description: 'Insurance premium payment',
      category: 'Insurance & Legal',
      amount: 1200.00,
      paymentMethod: 'Bank Transfer',
      date: '2025-06-19',
      location: 'Administrative Office',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      vendor: 'AgriSecure Insurance',
      receipt: 'insurance_premium_q2.pdf',
      notes: 'Quarterly livestock insurance premium',
      status: 'completed',
      createdAt: '2025-06-19T10:00:00Z'
    }
  ];

  // Usar datos mock si no hay gastos reales
  const expensesData = expenses.length > 0 ? expenses : mockExpenses;

  // Aplicar filtros y búsqueda
  const applyFilters = () => {
    let filtered = [...expensesData];

    // Aplicar búsqueda por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(term) ||
        expense.category.toLowerCase().includes(term) ||
        expense.vendor.toLowerCase().includes(term) ||
        expense.location.toLowerCase().includes(term)
      );
    }

    // Aplicar filtros específicos
    if (filters.category) {
      filtered = filtered.filter(expense => expense.category === filters.category);
    }

    if (filters.paymentMethod) {
      filtered = filtered.filter(expense => expense.paymentMethod === filters.paymentMethod);
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const today = new Date();
      const expenseDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          expenseDate.setDate(today.getDate());
          break;
        case 'week':
          expenseDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          expenseDate.setMonth(today.getMonth() - 1);
          break;
        case 'quarter':
          expenseDate.setMonth(today.getMonth() - 3);
          break;
        default:
          break;
      }
      
      if (filters.dateRange !== 'all') {
        filtered = filtered.filter(expense => {
          const date = new Date(expense.date);
          return date >= expenseDate && date <= today;
        });
      }
    }

    if (filters.amountRange && filters.amountRange !== 'all') {
      filtered = filtered.filter(expense => {
        const amount = expense.amount;
        switch (filters.amountRange) {
          case 'low': return amount < 500;
          case 'medium': return amount >= 500 && amount < 2000;
          case 'high': return amount >= 2000;
          default: return true;
        }
      });
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
      if (sortBy === 'amount') {
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

    setFilteredExpenses(filtered);
    setCurrentPage(1);
  };

  // Obtener icono de categoría
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Feed & Nutrition': return ShoppingCart;
      case 'Veterinary Care': return Heart;
      case 'Equipment & Maintenance': return Truck;
      case 'Labor Costs': return Users;
      case 'Utilities & Infrastructure': return Zap;
      case 'Insurance & Legal': return Building;
      default: return Receipt;
    }
  };

  // Obtener color de categoría
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Feed & Nutrition': return 'bg-orange-500 text-white';
      case 'Veterinary Care': return 'bg-red-500 text-white';
      case 'Equipment & Maintenance': return 'bg-gray-500 text-white';
      case 'Labor Costs': return 'bg-purple-500 text-white';
      case 'Utilities & Infrastructure': return 'bg-blue-500 text-white';
      case 'Insurance & Legal': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Obtener color del método de pago
  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'Credit Card': return 'text-blue-600 bg-blue-100';
      case 'Bank Transfer': return 'text-green-600 bg-green-100';
      case 'Cash': return 'text-yellow-600 bg-yellow-100';
      case 'Auto Pay': return 'text-purple-600 bg-purple-100';
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

  // Manejar eliminación de gasto
  const handleDelete = async (expenseId) => {
    setDeletingExpenseId(expenseId);
    
    try {
      const response = await fetch(`/api/finances/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
        setShowDeleteModal(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete expense');
      }
    } catch (error) {
      console.error('Delete expense error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setDeletingExpenseId(null);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      paymentMethod: '',
      dateRange: 'all',
      amountRange: 'all'
    });
    setShowFilters(false);
  };

  // Calcular estadísticas
  const stats = {
    total: expensesData.length,
    totalAmount: expensesData.reduce((sum, expense) => sum + expense.amount, 0),
    averageAmount: expensesData.length > 0 ? expensesData.reduce((sum, expense) => sum + expense.amount, 0) / expensesData.length : 0,
    thisMonth: expensesData.filter(e => {
      const expenseDate = new Date(e.date);
      const today = new Date();
      return expenseDate.getMonth() === today.getMonth() && expenseDate.getFullYear() === today.getFullYear();
    }).length
  };

  // Datos para paginación
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

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
            <p className="text-gray-600">Loading expenses...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Expense Tracking</h1>
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <span>{stats.total} total</span>
                <span className="text-red-600">{formatCurrency(stats.totalAmount)} spent</span>
                <span className="text-purple-600">{formatCurrency(stats.averageAmount)} average</span>
                <span className="text-blue-600">{stats.thisMonth} this month</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchExpenses}
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
                to="/finances/expense-tracking/add"
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
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
                  placeholder="Search expenses by description, category, vendor..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              >
                <option value="date-desc">Date: Latest First</option>
                <option value="date-asc">Date: Earliest First</option>
                <option value="amount-desc">Amount: Highest First</option>
                <option value="amount-asc">Amount: Lowest First</option>
                <option value="description-asc">Description A-Z</option>
                <option value="category-asc">Category A-Z</option>
              </select>

              {/* Botón de filtros */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-3 py-2 border rounded-lg transition-colors ${
                  showFilters || Object.values(filters).some(f => f && f !== 'all')
                    ? 'border-red-500 bg-red-50 text-red-700'
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
                      ? 'bg-red-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 transition-colors ${
                    viewMode === 'table'
                      ? 'bg-red-600 text-white'
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    >
                      <option value="">All categories</option>
                      <option value="Feed & Nutrition">Feed & Nutrition</option>
                      <option value="Veterinary Care">Veterinary Care</option>
                      <option value="Equipment & Maintenance">Equipment & Maintenance</option>
                      <option value="Labor Costs">Labor Costs</option>
                      <option value="Utilities & Infrastructure">Utilities & Infrastructure</option>
                      <option value="Insurance & Legal">Insurance & Legal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                      value={filters.paymentMethod}
                      onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    >
                      <option value="">All methods</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash">Cash</option>
                      <option value="Auto Pay">Auto Pay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    >
                      <option value="all">All dates</option>
                      <option value="today">Today</option>
                      <option value="week">Last week</option>
                      <option value="month">Last month</option>
                      <option value="quarter">Last quarter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
                    <select
                      value={filters.amountRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, amountRange: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    >
                      <option value="all">All amounts</option>
                      <option value="low">Under $500</option>
                      <option value="medium">$500 - $2,000</option>
                      <option value="high">Over $2,000</option>
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
        {filteredExpenses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || Object.values(filters).some(f => f && f !== 'all')
                ? 'No expenses found'
                : 'No expenses yet'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(filters).some(f => f && f !== 'all')
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first expense'
              }
            </p>
            {!searchTerm && !Object.values(filters).some(f => f && f !== 'all') && (
              <Link
                to="/finances/expense-tracking/add"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Expense
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
                {paginatedExpenses.map((expense) => {
                  const IconComponent = getCategoryIcon(expense.category);
                  return (
                    <motion.div
                      key={expense.id}
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white rounded-xl shadow-sm border border-l-4 border-l-red-500 overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/finances/expenses/${expense.id}`)}
                    >
                      {/* Header del gasto */}
                      <div className="p-4 pb-2">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`p-2 rounded-lg ${getCategoryColor(expense.category)}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                              {expense.category}
                            </span>
                          </div>
                          
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionMenu(showActionMenu === expense.id ? null : expense.id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {showActionMenu === expense.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-0 top-6 bg-white rounded-lg shadow-lg border z-10 min-w-32"
                              >
                                <Link
                                  to={`/finances/expenses/${expense.id}`}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Link>
                                <Link
                                  to={`/finances/expenses/edit/${expense.id}`}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteModal(expense.id);
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
                          {expense.description}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {expense.vendor}
                        </p>
                      </div>

                      {/* Información del gasto */}
                      <div className="px-4 pb-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-red-600">
                              {formatCurrency(expense.amount)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(expense.paymentMethod)}`}>
                              {expense.paymentMethod}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(expense.date).toLocaleDateString()}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="truncate">{expense.location}</span>
                          </div>
                          
                          {expense.receipt && (
                            <div className="flex items-center text-sm text-blue-600">
                              <FileText className="w-4 h-4 mr-2" />
                              Receipt available
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(expense.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-1">
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                          <span className="text-xs font-medium text-red-600">Expense</span>
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
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedExpenses.map((expense, index) => {
                        const IconComponent = getCategoryIcon(expense.category);
                        return (
                          <motion.tr
                            key={expense.id}
                            variants={tableRowVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {expense.description}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {expense.vendor}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <IconComponent className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm text-gray-900">
                                  {expense.category}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-semibold text-red-600">
                                {formatCurrency(expense.amount)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(expense.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(expense.paymentMethod)}`}>
                                {expense.paymentMethod}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="truncate max-w-xs">{expense.location}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Link
                                  to={`/finances/expenses/${expense.id}`}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <Link
                                  to={`/finances/expenses/edit/${expense.id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => setShowDeleteModal(expense.id)}
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
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredExpenses.length)} of{' '}
                  {filteredExpenses.length} results
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
                              ? 'border-red-500 bg-red-600 text-white'
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
                <h3 className="text-lg font-semibold text-gray-900">Delete Expense</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this expense? This will permanently remove all associated data.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingExpenseId}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deletingExpenseId}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
              >
                {deletingExpenseId ? (
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

export default ExpenseTracking;