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
  Package, 
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Pill,
  Syringe,
  Beaker,
  TrendingUp,
  TrendingDown,
  Download,
  User,
  MapPin,
  Grid,
  List,
  SortAsc,
  SortDesc,
  FileText,
  QrCode,
  Bell,
  DollarSign,
  BarChart3,
  Archive,
  RefreshCw
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
import { Progress } from '@/components/ui/progress';
import { inventoryService } from '../services/inventoryService';
import { useGeolocation } from '../hooks/useGeolocation';

const InventoryTable = () => {
  // Estados principales para datos de inventario
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para estadísticas de inventario
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    availableItems: 0,
    lowStockItems: 0,
    expiredItems: 0,
    expiringItems: 0,
    totalValue: 0,
    monthlyConsumption: 0
  });

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    supplier: '',
    location: '',
    dateRange: 'all',
    startDate: null,
    endDate: null,
    stockLevel: '',
    expirationAlert: '',
    ranch: ''
  });

  // Estados para paginación y ordenamiento
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Estados para vistas y modales
  const [viewMode, setViewMode] = useState('table'); // table, grid, cards
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all'); // all, available, low_stock, expired, expiring

  // Estados para gestión de stock
  const [stockUpdate, setStockUpdate] = useState({
    quantity: '',
    type: 'add', // add, remove, set
    reason: '',
    location: ''
  });

  // Hook personalizado para geolocalización
  const { location, getLocation, loading: locationLoading } = useGeolocation();

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
    loadInventory();
    loadInventoryStats();
  }, []);

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    applyFilters();
  }, [inventory, searchTerm, filters, sortBy, sortOrder, selectedTab]);

  // Función para cargar inventario desde el servicio
  const loadInventory = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await inventoryService.getAll();
      setInventory(data);
    } catch (err) {
      console.error('Error al cargar inventario:', err);
      setError('Error al cargar los datos del inventario');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar estadísticas de inventario
  const loadInventoryStats = async () => {
    try {
      const data = await inventoryService.getStats();
      setInventoryStats(data);
    } catch (err) {
      console.error('Error al cargar estadísticas de inventario:', err);
    }
  };

  // Función para aplicar filtros y búsqueda
  const applyFilters = useCallback(() => {
    let filtered = [...inventory];

    // Filtrar por tab seleccionado
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    switch (selectedTab) {
      case 'available':
        filtered = filtered.filter(item => item.status === 'available' && item.currentQuantity > 0);
        break;
      case 'low_stock':
        filtered = filtered.filter(item => item.currentQuantity <= item.minimumStock);
        break;
      case 'expired':
        filtered = filtered.filter(item => {
          const expirationDate = new Date(item.expirationDate);
          return expirationDate < today;
        });
        break;
      case 'expiring':
        filtered = filtered.filter(item => {
          const expirationDate = new Date(item.expirationDate);
          return expirationDate >= today && expirationDate <= thirtyDaysFromNow;
        });
        break;
      case 'all':
      default:
        // No filtrar por estado
        break;
    }

    // Aplicar búsqueda por texto
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.medicationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros específicos
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }
    if (filters.status) {
      filtered = filtered.filter(item => item.statusId === filters.status);
    }
    if (filters.supplier) {
      filtered = filtered.filter(item => item.supplier?.toLowerCase().includes(filters.supplier.toLowerCase()));
    }
    if (filters.location) {
      filtered = filtered.filter(item => item.location?.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.ranch) {
      filtered = filtered.filter(item => item.ranchId === filters.ranch);
    }

    // Filtrar por nivel de stock
    if (filters.stockLevel) {
      switch (filters.stockLevel) {
        case 'high':
          filtered = filtered.filter(item => item.currentQuantity > item.minimumStock * 2);
          break;
        case 'normal':
          filtered = filtered.filter(item => item.currentQuantity > item.minimumStock && item.currentQuantity <= item.minimumStock * 2);
          break;
        case 'low':
          filtered = filtered.filter(item => item.currentQuantity <= item.minimumStock);
          break;
        case 'empty':
          filtered = filtered.filter(item => item.currentQuantity === 0);
          break;
      }
    }

    // Filtrar por alertas de vencimiento
    if (filters.expirationAlert) {
      const today = new Date();
      switch (filters.expirationAlert) {
        case 'expired':
          filtered = filtered.filter(item => new Date(item.expirationDate) < today);
          break;
        case 'expiring_soon':
          const sevenDaysFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
          filtered = filtered.filter(item => {
            const expDate = new Date(item.expirationDate);
            return expDate >= today && expDate <= sevenDaysFromNow;
          });
          break;
        case 'expiring_month':
          filtered = filtered.filter(item => {
            const expDate = new Date(item.expirationDate);
            return expDate >= today && expDate <= thirtyDaysFromNow;
          });
          break;
      }
    }

    // Filtrar por rango de fechas de compra
    if (filters.startDate) {
      filtered = filtered.filter(item => 
        new Date(item.purchaseDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(item => 
        new Date(item.purchaseDate) <= new Date(filters.endDate)
      );
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'purchaseDate' || sortBy === 'expirationDate') {
        aValue = new Date(a[sortBy]);
        bValue = new Date(b[sortBy]);
      } else if (sortBy === 'currentQuantity' || sortBy === 'unitPrice') {
        aValue = parseFloat(a[sortBy]) || 0;
        bValue = parseFloat(b[sortBy]) || 0;
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

    setFilteredInventory(filtered);
    setCurrentPage(1); // Resetear a primera página cuando se aplican filtros
  }, [inventory, searchTerm, filters, sortBy, sortOrder, selectedTab]);

  // Función para manejar selección de items
  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Función para seleccionar todos los items
  const handleSelectAll = () => {
    if (selectedItems.length === paginatedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedItems.map(item => item.id));
    }
  };

  // Función para eliminar item
  const handleDeleteItem = async (itemId) => {
    try {
      await inventoryService.delete(itemId);
      setInventory(prev => prev.filter(item => item.id !== itemId));
      setShowDeleteModal(false);
      setItemToDelete(null);
      loadInventoryStats(); // Actualizar estadísticas
    } catch (err) {
      console.error('Error al eliminar item:', err);
      setError('Error al eliminar el item del inventario');
    }
  };

  // Función para actualizar stock
  const handleStockUpdate = async () => {
    if (!selectedItem || !stockUpdate.quantity) return;

    try {
      await inventoryService.updateStock(selectedItem.id, {
        quantity: parseFloat(stockUpdate.quantity),
        type: stockUpdate.type,
        reason: stockUpdate.reason,
        location: stockUpdate.location || selectedItem.location
      });
      
      // Actualizar el item en el estado local
      setInventory(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              currentQuantity: stockUpdate.type === 'set' 
                ? parseFloat(stockUpdate.quantity)
                : stockUpdate.type === 'add'
                  ? item.currentQuantity + parseFloat(stockUpdate.quantity)
                  : item.currentQuantity - parseFloat(stockUpdate.quantity),
              location: stockUpdate.location || item.location
            }
          : item
      ));
      
      setShowStockModal(false);
      setStockUpdate({ quantity: '', type: 'add', reason: '', location: '' });
      loadInventoryStats();
    } catch (err) {
      console.error('Error al actualizar stock:', err);
      setError('Error al actualizar el stock');
    }
  };

  // Función para obtener icono de la categoría
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'medication':
      case 'medicamento':
        return Pill;
      case 'vaccine':
      case 'vacuna':
        return Syringe;
      case 'supplement':
      case 'suplemento':
        return Beaker;
      case 'equipment':
      case 'equipo':
        return Package;
      case 'feed':
      case 'alimento':
        return ShoppingCart;
      default:
        return Package;
    }
  };

  // Función para obtener color del estado
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
      case 'stock_bajo':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
      case 'agotado':
        return 'bg-red-100 text-red-800';
      case 'expired':
      case 'vencido':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener color del nivel de stock
  const getStockLevelColor = (current, minimum) => {
    if (current === 0) return 'text-red-600';
    if (current <= minimum) return 'text-yellow-600';
    if (current <= minimum * 2) return 'text-blue-600';
    return 'text-green-600';
  };

  // Función para calcular días hasta vencimiento
  const getDaysUntilExpiration = (expirationDate) => {
    if (!expirationDate) return null;
    const today = new Date();
    const expiration = new Date(expirationDate);
    const diffTime = expiration - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  // Calcular items para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

  // Función para cambiar página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Función para exportar datos
  const handleExport = async (format) => {
    try {
      const dataToExport = selectedItems.length > 0 
        ? inventory.filter(item => selectedItems.includes(item.id))
        : filteredInventory;
      
      await inventoryService.exportData(dataToExport, format);
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
          <p className="text-gray-600 mt-1">
            Controla medicamentos, suministros y equipos del rancho
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={() => {}}>
            <QrCode className="w-4 h-4 mr-2" />
            Escanear
          </Button>
          <Button onClick={() => {}}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Item
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

      {/* Tarjetas de estadísticas de inventario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Package className="h-6 w-6 text-blue-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Total Items</p>
                  <p className="text-lg font-bold text-blue-600">
                    {inventoryStats.totalItems}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Disponibles</p>
                  <p className="text-lg font-bold text-green-600">
                    {inventoryStats.availableItems}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Stock Bajo</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {inventoryStats.lowStockItems}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Archive className="h-6 w-6 text-red-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Vencidos</p>
                  <p className="text-lg font-bold text-red-600">
                    {inventoryStats.expiredItems}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-orange-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Por Vencer</p>
                  <p className="text-lg font-bold text-orange-600">
                    {inventoryStats.expiringItems}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Valor Total</p>
                  <p className="text-lg font-bold text-purple-600">
                    {formatCurrency(inventoryStats.totalValue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <TrendingDown className="h-6 w-6 text-indigo-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Consumo Mensual</p>
                  <p className="text-lg font-bold text-indigo-600">
                    {inventoryStats.monthlyConsumption}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs para filtrar por estado */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="available">Disponibles</TabsTrigger>
              <TabsTrigger value="low_stock">Stock Bajo</TabsTrigger>
              <TabsTrigger value="expired">Vencidos</TabsTrigger>
              <TabsTrigger value="expiring">Por Vencer</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, descripción, proveedor o ubicación..."
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
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="rounded-l-none"
                >
                  <Package className="w-4 h-4" />
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
                        <SelectItem value="medication">Medicamentos</SelectItem>
                        <SelectItem value="vaccine">Vacunas</SelectItem>
                        <SelectItem value="supplement">Suplementos</SelectItem>
                        <SelectItem value="equipment">Equipos</SelectItem>
                        <SelectItem value="feed">Alimentos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status-filter">Estado</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="low_stock">Stock Bajo</SelectItem>
                        <SelectItem value="out_of_stock">Agotado</SelectItem>
                        <SelectItem value="expired">Vencido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="stock-level-filter">Nivel de Stock</Label>
                    <Select
                      value={filters.stockLevel}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, stockLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="high">Alto</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Bajo</SelectItem>
                        <SelectItem value="empty">Vacío</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="expiration-filter">Alerta de Vencimiento</Label>
                    <Select
                      value={filters.expirationAlert}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, expirationAlert: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar alerta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Sin filtro</SelectItem>
                        <SelectItem value="expired">Ya vencido</SelectItem>
                        <SelectItem value="expiring_soon">Vence en 7 días</SelectItem>
                        <SelectItem value="expiring_month">Vence en 30 días</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="supplier-filter">Proveedor</Label>
                    <Input
                      placeholder="Filtrar por proveedor"
                      value={filters.supplier}
                      onChange={(e) => setFilters(prev => ({ ...prev, supplier: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location-filter">Ubicación</Label>
                    <Input
                      placeholder="Filtrar por ubicación"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="start-date">Fecha Compra (Inicio)</Label>
                    <DatePicker
                      date={filters.startDate}
                      onDateChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="end-date">Fecha Compra (Fin)</Label>
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
                        category: '',
                        status: '',
                        supplier: '',
                        location: '',
                        dateRange: 'all',
                        startDate: null,
                        endDate: null,
                        stockLevel: '',
                        expirationAlert: '',
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
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedItems.length} item(s) seleccionado(s)
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualizar Stock
                </Button>
                <Button variant="outline" size="sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  Cambiar Ubicación
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Alertas
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
                        checked={selectedItems.length === paginatedItems.length && paginatedItems.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => {
                          setSortBy('medicationName');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Producto
                        {sortBy === 'medicationName' && (
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
                          setSortBy('currentQuantity');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Stock Actual
                        {sortBy === 'currentQuantity' && (
                          sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Mínimo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => {
                          setSortBy('expirationDate');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Vencimiento
                        {sortBy === 'expirationDate' && (
                          sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proveedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio Unit.
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedItems.map((item, index) => {
                    const CategoryIcon = getCategoryIcon(item.category);
                    const daysUntilExpiration = getDaysUntilExpiration(item.expirationDate);
                    const stockPercentage = item.minimumStock > 0 ? (item.currentQuantity / item.minimumStock) * 100 : 100;
                    
                    return (
                      <motion.tr
                        key={item.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        transition={{ delay: index * 0.05 }}
                        className="cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => handleSelectItem(item.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.medicationName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <CategoryIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-900 capitalize">
                              {item.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${getStockLevelColor(item.currentQuantity, item.minimumStock)}`}>
                              {item.currentQuantity}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">
                              {item.unit}
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(stockPercentage, 100)} 
                            className="w-16 h-1 mt-1"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.minimumStock} {item.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">
                              {formatDate(item.expirationDate)}
                            </div>
                            {daysUntilExpiration !== null && (
                              <div className={`text-xs ${
                                daysUntilExpiration < 0 ? 'text-red-600' :
                                daysUntilExpiration <= 7 ? 'text-orange-600' :
                                daysUntilExpiration <= 30 ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {daysUntilExpiration < 0 ? `Vencido hace ${Math.abs(daysUntilExpiration)} días` :
                                 daysUntilExpiration === 0 ? 'Vence hoy' :
                                 `Vence en ${daysUntilExpiration} días`}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {item.location || 'No especificada'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.supplier || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.unitPrice)}
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
                              <DropdownMenuItem onClick={() => {
                                setSelectedItem(item);
                                setShowDetailModal(true);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => {
                                setSelectedItem(item);
                                setShowStockModal(true);
                              }}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Actualizar stock
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}}>
                                <MapPin className="mr-2 h-4 w-4" />
                                Cambiar ubicación
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}}>
                                <QrCode className="mr-2 h-4 w-4" />
                                Generar QR
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setItemToDelete(item);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedItems.map((item, index) => {
            const CategoryIcon = getCategoryIcon(item.category);
            const daysUntilExpiration = getDaysUntilExpiration(item.expirationDate);
            const stockPercentage = item.minimumStock > 0 ? (item.currentQuantity / item.minimumStock) * 100 : 100;
            
            return (
              <motion.div
                key={item.id}
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
                        <CategoryIcon className="w-5 h-5 mr-2 text-gray-400" />
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                      />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.medicationName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {item.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Stock:</span>
                        <span className={`text-sm font-medium ${getStockLevelColor(item.currentQuantity, item.minimumStock)}`}>
                          {item.currentQuantity} {item.unit}
                        </span>
                      </div>
                      <Progress value={Math.min(stockPercentage, 100)} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Mínimo:</span>
                        <span className="text-sm text-gray-900">
                          {item.minimumStock} {item.unit}
                        </span>
                      </div>
                      
                      {item.expirationDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Vencimiento:</span>
                          <div className="text-right">
                            <div className="text-sm text-gray-900">
                              {formatDate(item.expirationDate)}
                            </div>
                            {daysUntilExpiration !== null && (
                              <div className={`text-xs ${
                                daysUntilExpiration < 0 ? 'text-red-600' :
                                daysUntilExpiration <= 7 ? 'text-orange-600' :
                                daysUntilExpiration <= 30 ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {daysUntilExpiration < 0 ? 'Vencido' :
                                 daysUntilExpiration === 0 ? 'Vence hoy' :
                                 `${daysUntilExpiration}d`}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {item.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-600 truncate">
                            {item.location}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Precio:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.unitPrice)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedItem(item);
                        setShowDetailModal(true);
                      }}>
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedItem(item);
                        setShowStockModal(true);
                      }}>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Stock
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {}}>
                        <QrCode className="w-4 h-4 mr-1" />
                        QR
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Vista de tarjetas simplificada */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {paginatedItems.map((item, index) => {
            const CategoryIcon = getCategoryIcon(item.category);
            const stockPercentage = item.minimumStock > 0 ? (item.currentQuantity / item.minimumStock) * 100 : 100;
            
            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <CategoryIcon className="w-4 h-4 text-gray-400" />
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                        className="h-3 w-3"
                      />
                    </div>
                    
                    <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">
                      {item.medicationName}
                    </h4>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Stock:</span>
                        <span className={`text-xs font-medium ${getStockLevelColor(item.currentQuantity, item.minimumStock)}`}>
                          {item.currentQuantity}
                        </span>
                      </div>
                      <Progress value={Math.min(stockPercentage, 100)} className="h-1" />
                    </div>
                    
                    <div className="flex justify-center mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-xs"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowStockModal(true);
                        }}
                      >
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredInventory.length)} de {filteredInventory.length} resultados
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

      {/* Modal de actualización de stock */}
      <Dialog open={showStockModal} onOpenChange={setShowStockModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Stock - {selectedItem?.medicationName}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label>Tipo de Movimiento</Label>
              <Select value={stockUpdate.type} onValueChange={(value) => setStockUpdate(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Agregar Inventario</SelectItem>
                  <SelectItem value="remove">Consumir/Retirar</SelectItem>
                  <SelectItem value="set">Establecer Cantidad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Cantidad</Label>
              <Input
                type="number"
                placeholder="0"
                value={stockUpdate.quantity}
                onChange={(e) => setStockUpdate(prev => ({ ...prev, quantity: e.target.value }))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Stock actual: {selectedItem?.currentQuantity} {selectedItem?.unit}
              </p>
            </div>
            
            <div>
              <Label>Motivo</Label>
              <Input
                placeholder="Describe el motivo del movimiento"
                value={stockUpdate.reason}
                onChange={(e) => setStockUpdate(prev => ({ ...prev, reason: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Ubicación (opcional)</Label>
              <Input
                placeholder="Actualizar ubicación"
                value={stockUpdate.location}
                onChange={(e) => setStockUpdate(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowStockModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleStockUpdate} disabled={!stockUpdate.quantity}>
              Actualizar Stock
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de detalles del item */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Inventario</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Producto</Label>
                  <p className="text-sm font-medium">{selectedItem.medicationName}</p>
                </div>
                <div>
                  <Label>Categoría</Label>
                  <p className="text-sm">{selectedItem.category}</p>
                </div>
                <div>
                  <Label>Stock Actual</Label>
                  <p className="text-sm">{selectedItem.currentQuantity} {selectedItem.unit}</p>
                </div>
                <div>
                  <Label>Stock Mínimo</Label>
                  <p className="text-sm">{selectedItem.minimumStock} {selectedItem.unit}</p>
                </div>
              </div>
              
              <div>
                <Label>Descripción</Label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{selectedItem.description || 'No especificada'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Proveedor</Label>
                  <p className="text-sm">{selectedItem.supplier || 'No especificado'}</p>
                </div>
                <div>
                  <Label>Precio Unitario</Label>
                  <p className="text-sm">{formatCurrency(selectedItem.unitPrice)}</p>
                </div>
                <div>
                  <Label>Fecha de Compra</Label>
                  <p className="text-sm">{formatDate(selectedItem.purchaseDate)}</p>
                </div>
                <div>
                  <Label>Fecha de Vencimiento</Label>
                  <p className="text-sm">{formatDate(selectedItem.expirationDate)}</p>
                </div>
                <div>
                  <Label>Ubicación</Label>
                  <p className="text-sm">{selectedItem.location || 'No especificada'}</p>
                </div>
                <div>
                  <Label>Estado</Label>
                  <Badge className={getStatusColor(selectedItem.status)}>
                    {selectedItem.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Cerrar
            </Button>
            <Button onClick={() => {}}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación para eliminar */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              ¿Estás seguro de que deseas eliminar este item del inventario? 
              Esta acción no se puede deshacer.
            </p>
            {itemToDelete && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm"><strong>Producto:</strong> {itemToDelete.medicationName}</p>
                <p className="text-sm"><strong>Stock:</strong> {itemToDelete.currentQuantity} {itemToDelete.unit}</p>
                <p className="text-sm"><strong>Ubicación:</strong> {itemToDelete.location || 'No especificada'}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setItemToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteItem(itemToDelete?.id)}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default InventoryTable;