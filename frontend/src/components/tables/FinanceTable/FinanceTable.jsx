import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Banknote,
  Receipt,
  PiggyBank,
  ShoppingCart,
  Truck,
  AlertTriangle,
  CheckCircle,
  Download,
  Grid,
  List,
  SortAsc,
  SortDesc,
  BarChart3,
  PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePicker } from '@/components/ui/date-picker';
import { financeService } from '../services/financeService';

const FinanceTable = () => {
  // Estados principales para datos financieros
  const [finances, setFinances] = useState([]);
  const [filteredFinances, setFilteredFinances] = useState([]);
  const [selectedFinances, setSelectedFinances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para estadísticas
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    monthlyGrowth: 0,
    pendingTransactions: 0
  });

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '', // ingreso, gasto
    category: '',
    paymentMethod: '',
    dateRange: 'all',
    startDate: null,
    endDate: null,
    amountMin: '',
    amountMax: '',
    ranch: ''
  });

  // Estados para paginación y ordenamiento
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('transactionDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Estados para vistas y modales
  const [viewMode, setViewMode] = useState('table'); // table, grid, chart
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [financeToDelete, setFinanceToDelete] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all'); // all, income, expenses, pending

  // Animaciones de Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      backgroundColor: '#f9fafb',
      transition: { duration: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.02,
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

  // Cargar datos iniciales
  useEffect(() => {
    loadFinances();
    loadStats();
  }, []);

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    applyFilters();
  }, [finances, searchTerm, filters, sortBy, sortOrder, selectedTab]);

  // Función para cargar finanzas desde el servicio
  const loadFinances = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await financeService.getAll();
      setFinances(data);
    } catch (err) {
      console.error('Error al cargar finanzas:', err);
      setError('Error al cargar los datos financieros');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar estadísticas
  const loadStats = async () => {
    try {
      const data = await financeService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  // Función para aplicar filtros y búsqueda
  const applyFilters = useCallback(() => {
    let filtered = [...finances];

    // Filtrar por tab seleccionado
    switch (selectedTab) {
      case 'income':
        filtered = filtered.filter(finance => finance.type === 'income');
        break;
      case 'expenses':
        filtered = filtered.filter(finance => finance.type === 'expense');
        break;
      case 'pending':
        filtered = filtered.filter(finance => finance.status === 'pending');
        break;
      case 'all':
      default:
        // No filtrar por tipo
        break;
    }

    // Aplicar búsqueda por texto
    if (searchTerm) {
      filtered = filtered.filter(finance =>
        finance.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        finance.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        finance.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros específicos
    if (filters.type) {
      filtered = filtered.filter(finance => finance.typeId === filters.type);
    }
    if (filters.category) {
      filtered = filtered.filter(finance => finance.categoryId === filters.category);
    }
    if (filters.paymentMethod) {
      filtered = filtered.filter(finance => finance.paymentMethodId === filters.paymentMethod);
    }
    if (filters.ranch) {
      filtered = filtered.filter(finance => finance.ranchId === filters.ranch);
    }

    // Filtrar por rango de fechas
    if (filters.startDate) {
      filtered = filtered.filter(finance => 
        new Date(finance.transactionDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(finance => 
        new Date(finance.transactionDate) <= new Date(filters.endDate)
      );
    }

    // Filtrar por rango de montos
    if (filters.amountMin) {
      filtered = filtered.filter(finance => finance.amount >= parseFloat(filters.amountMin));
    }
    if (filters.amountMax) {
      filtered = filtered.filter(finance => finance.amount <= parseFloat(filters.amountMax));
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'transactionDate') {
        aValue = new Date(a.transactionDate);
        bValue = new Date(b.transactionDate);
      } else if (sortBy === 'amount') {
        aValue = parseFloat(a.amount);
        bValue = parseFloat(b.amount);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue?.toLowerCase() || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredFinances(filtered);
    setCurrentPage(1); // Resetear a primera página cuando se aplican filtros
  }, [finances, searchTerm, filters, sortBy, sortOrder, selectedTab]);

  // Función para manejar selección de finanzas
  const handleSelectFinance = (financeId) => {
    setSelectedFinances(prev => {
      if (prev.includes(financeId)) {
        return prev.filter(id => id !== financeId);
      } else {
        return [...prev, financeId];
      }
    });
  };

  // Función para seleccionar todas las finanzas
  const handleSelectAll = () => {
    if (selectedFinances.length === paginatedFinances.length) {
      setSelectedFinances([]);
    } else {
      setSelectedFinances(paginatedFinances.map(finance => finance.id));
    }
  };

  // Función para eliminar finanza
  const handleDeleteFinance = async (financeId) => {
    try {
      await financeService.delete(financeId);
      setFinances(prev => prev.filter(finance => finance.id !== financeId));
      setShowDeleteModal(false);
      setFinanceToDelete(null);
      loadStats(); // Actualizar estadísticas
    } catch (err) {
      console.error('Error al eliminar transacción:', err);
      setError('Error al eliminar la transacción');
    }
  };

  // Función para obtener icono del tipo de transacción
  const getTransactionTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'income':
      case 'ingreso':
        return TrendingUp;
      case 'expense':
      case 'gasto':
        return TrendingDown;
      default:
        return DollarSign;
    }
  };

  // Función para obtener icono de la categoría
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'sale':
      case 'venta':
        return DollarSign;
      case 'feed':
      case 'alimento':
        return ShoppingCart;
      case 'veterinary':
      case 'veterinario':
        return CheckCircle;
      case 'equipment':
      case 'equipo':
        return Truck;
      case 'medication':
      case 'medicamento':
        return Receipt;
      case 'maintenance':
      case 'mantenimiento':
        return AlertTriangle;
      default:
        return Receipt;
    }
  };

  // Función para obtener icono del método de pago
  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'cash':
      case 'efectivo':
        return Banknote;
      case 'card':
      case 'tarjeta':
        return CreditCard;
      case 'transfer':
      case 'transferencia':
        return PiggyBank;
      default:
        return Receipt;
    }
  };

  // Función para obtener color del tipo
  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'income':
      case 'ingreso':
        return 'bg-green-100 text-green-800';
      case 'expense':
      case 'gasto':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para formatear fecha
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Función para formatear moneda
  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  // Calcular finanzas para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedFinances = filteredFinances.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFinances.length / itemsPerPage);

  // Función para cambiar página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Función para exportar datos
  const handleExport = async (format) => {
    try {
      const dataToExport = selectedFinances.length > 0 
        ? finances.filter(finance => selectedFinances.includes(finance.id))
        : filteredFinances;
      
      await financeService.exportData(dataToExport, format);
    } catch (err) {
      console.error('Error al exportar datos:', err);
      setError('Error al exportar los datos');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header con título y acciones principales */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión Financiera</h1>
          <p className="text-gray-600 mt-1">
            Controla ingresos, gastos y analiza la rentabilidad del rancho
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => {}}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Transacción
          </Button>
        </div>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.totalIncome)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingDown className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Gastos Totales</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(stats.totalExpenses)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className={`h-8 w-8 ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ganancia Neta</p>
                  <p className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(stats.netProfit)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Crecimiento Mensual</p>
                  <p className={`text-2xl font-bold ${stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.monthlyGrowth >= 0 ? '+' : ''}{stats.monthlyGrowth}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pendingTransactions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs para filtrar por tipo */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="income">Ingresos</TabsTrigger>
              <TabsTrigger value="expenses">Gastos</TabsTrigger>
              <TabsTrigger value="pending">Pendientes</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por descripción, referencia o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Controles de vista y filtros */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>

              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-r-none"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'chart' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('chart')}
                  className="rounded-l-none"
                >
                  <PieChart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Panel de filtros expandible */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="type-filter">Tipo</Label>
                    <Select
                      value={filters.type}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="income">Ingreso</SelectItem>
                        <SelectItem value="expense">Gasto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category-filter">Categoría</Label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas</SelectItem>
                        <SelectItem value="sale">Venta de bovinos</SelectItem>
                        <SelectItem value="feed">Alimento</SelectItem>
                        <SelectItem value="veterinary">Veterinario</SelectItem>
                        <SelectItem value="equipment">Equipo</SelectItem>
                        <SelectItem value="medication">Medicamentos</SelectItem>
                        <SelectItem value="maintenance">Mantenimiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="payment-method-filter">Método de Pago</Label>
                    <Select
                      value={filters.paymentMethod}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, paymentMethod: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="cash">Efectivo</SelectItem>
                        <SelectItem value="card">Tarjeta</SelectItem>
                        <SelectItem value="transfer">Transferencia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="ranch-filter">Rancho</Label>
                    <Select
                      value={filters.ranch}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, ranch: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rancho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="ranch1">Rancho Principal</SelectItem>
                        <SelectItem value="ranch2">Rancho Norte</SelectItem>
                        <SelectItem value="ranch3">Rancho Sur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount-min">Monto Mínimo</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={filters.amountMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, amountMin: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount-max">Monto Máximo</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={filters.amountMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, amountMax: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="start-date">Fecha Inicio</Label>
                    <DatePicker
                      date={filters.startDate}
                      onDateChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="end-date">Fecha Fin</Label>
                    <DatePicker
                      date={filters.endDate}
                      onDateChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({
                        type: '',
                        category: '',
                        paymentMethod: '',
                        dateRange: 'all',
                        startDate: null,
                        endDate: null,
                        amountMin: '',
                        amountMax: '',
                        ranch: ''
                      });
                      setSearchTerm('');
                    }}
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Acciones en lote */}
      <AnimatePresence>
        {selectedFinances.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedFinances.length} transacción(es) seleccionada(s)
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analizar
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido principal - Vista de tabla */}
      {viewMode === 'table' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <Checkbox
                        checked={selectedFinances.length === paginatedFinances.length && paginatedFinances.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => {
                          setSortBy('description');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Descripción
                        {sortBy === 'description' && (
                          sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => {
                          setSortBy('amount');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Monto
                        {sortBy === 'amount' && (
                          sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => {
                          setSortBy('transactionDate');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Fecha
                        {sortBy === 'transactionDate' && (
                          sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método de Pago
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referencia
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedFinances.map((finance, index) => {
                    const TypeIcon = getTransactionTypeIcon(finance.type);
                    const CategoryIcon = getCategoryIcon(finance.category);
                    const PaymentIcon = getPaymentMethodIcon(finance.paymentMethod);
                    
                    return (
                      <motion.tr
                        key={finance.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        transition={{ delay: index * 0.05 }}
                        className="cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Checkbox
                            checked={selectedFinances.includes(finance.id)}
                            onCheckedChange={() => handleSelectFinance(finance.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <TypeIcon className="w-4 h-4 mr-2" />
                            <Badge className={getTypeColor(finance.type)}>
                              {finance.type}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {finance.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <CategoryIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-900 capitalize">
                              {finance.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${
                            finance.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {finance.type === 'income' ? '+' : '-'}{formatCurrency(finance.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(finance.transactionDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <PaymentIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-900 capitalize">
                              {finance.paymentMethod}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {finance.reference || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => {}}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}}>
                                <Receipt className="mr-2 h-4 w-4" />
                                Ver recibo
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setFinanceToDelete(finance);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vista de grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedFinances.map((finance, index) => {
            const TypeIcon = getTransactionTypeIcon(finance.type);
            const CategoryIcon = getCategoryIcon(finance.category);
            const PaymentIcon = getPaymentMethodIcon(finance.paymentMethod);
            
            return (
              <motion.div
                key={finance.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <TypeIcon className="w-5 h-5 mr-2" />
                        <Badge className={getTypeColor(finance.type)}>
                          {finance.type}
                        </Badge>
                      </div>
                      <Checkbox
                        checked={selectedFinances.includes(finance.id)}
                        onCheckedChange={() => handleSelectFinance(finance.id)}
                      />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {finance.description}
                    </h3>
                    
                    <div className={`text-2xl font-bold mb-3 ${
                      finance.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {finance.type === 'income' ? '+' : '-'}{formatCurrency(finance.amount)}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CategoryIcon className="w-4 h-4 mr-2" />
                        <span className="capitalize">{finance.category}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(finance.transactionDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <PaymentIcon className="w-4 h-4 mr-2" />
                        <span className="capitalize">{finance.paymentMethod}</span>
                      </div>
                      {finance.reference && (
                        <div className="flex items-center">
                          <Receipt className="w-4 h-4 mr-2" />
                          <span className="truncate">{finance.reference}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" onClick={() => {}}>
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {}}>
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {}}>
                        <Receipt className="w-4 h-4 mr-1" />
                        Recibo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Vista de gráficos */}
      {viewMode === 'chart' && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500 py-12">
              <PieChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Vista de Gráficos</h3>
              <p>Los gráficos financieros estarán disponibles próximamente.</p>
              <p className="text-sm mt-2">Por ahora usa las vistas de tabla o grid.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredFinances.length)} de {filteredFinances.length} resultados
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de confirmación para eliminar */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              ¿Estás seguro de que deseas eliminar esta transacción? 
              Esta acción no se puede deshacer y afectará los reportes financieros.
            </p>
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm"><strong>Descripción:</strong> {financeToDelete?.description}</p>
              <p className="text-sm"><strong>Monto:</strong> {formatCurrency(financeToDelete?.amount)}</p>
              <p className="text-sm"><strong>Fecha:</strong> {formatDate(financeToDelete?.transactionDate)}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setFinanceToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteFinance(financeToDelete?.id)}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default FinanceTable;