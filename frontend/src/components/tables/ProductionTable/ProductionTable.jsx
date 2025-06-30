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
  Milk, 
  Beef,
  Egg,
  Scale,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Award,
  BarChart3,
  LineChart,
  PieChart,
  Download,
  User,
  MapPin,
  Grid,
  List,
  SortAsc,
  SortDesc,
  FileText,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
  Thermometer,
  Droplets
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
import { productionService } from '../services/productionService';
import { useGeolocation } from '../hooks/useGeolocation';

const ProductionTable = () => {
  // Estados principales para datos de producción
  const [productions, setProductions] = useState([]);
  const [filteredProductions, setFilteredProductions] = useState([]);
  const [selectedProductions, setSelectedProductions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para estadísticas de producción
  const [productionStats, setProductionStats] = useState({
    totalProduction: 0,
    dailyAverage: 0,
    weeklyTotal: 0,
    monthlyTotal: 0,
    bestQuality: 0,
    totalRevenue: 0,
    productionTrend: 0,
    activeProducers: 0
  });

  // Estados para análisis por tipo de producto
  const [productionByType, setProductionByType] = useState({
    milk: { total: 0, average: 0, trend: 0 },
    meat: { total: 0, average: 0, trend: 0 },
    eggs: { total: 0, average: 0, trend: 0 }
  });

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    productionType: '',
    quality: '',
    dateRange: 'all',
    startDate: null,
    endDate: null,
    bovineId: '',
    quantityMin: '',
    quantityMax: '',
    ranch: ''
  });

  // Estados para paginación y ordenamiento
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('productionDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Estados para vistas y modales
  const [viewMode, setViewMode] = useState('table'); // table, grid, charts
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productionToDelete, setProductionToDelete] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all'); // all, milk, meat, eggs, today

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
    loadProductions();
    loadProductionStats();
    loadProductionByType();
  }, []);

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    applyFilters();
  }, [productions, searchTerm, filters, sortBy, sortOrder, selectedTab]);

  // Función para cargar producciones desde el servicio
  const loadProductions = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await productionService.getAll();
      setProductions(data);
    } catch (err) {
      console.error('Error al cargar producciones:', err);
      setError('Error al cargar los datos de producción');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar estadísticas de producción
  const loadProductionStats = async () => {
    try {
      const data = await productionService.getStats();
      setProductionStats(data);
    } catch (err) {
      console.error('Error al cargar estadísticas de producción:', err);
    }
  };

  // Función para cargar producción por tipo
  const loadProductionByType = async () => {
    try {
      const data = await productionService.getByType();
      setProductionByType(data);
    } catch (err) {
      console.error('Error al cargar producción por tipo:', err);
    }
  };

  // Función para aplicar filtros y búsqueda
  const applyFilters = useCallback(() => {
    let filtered = [...productions];

    // Filtrar por tab seleccionado
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    switch (selectedTab) {
      case 'milk':
        filtered = filtered.filter(prod => prod.productionType === 'milk');
        break;
      case 'meat':
        filtered = filtered.filter(prod => prod.productionType === 'meat');
        break;
      case 'eggs':
        filtered = filtered.filter(prod => prod.productionType === 'eggs');
        break;
      case 'today':
        filtered = filtered.filter(prod => {
          const prodDate = new Date(prod.productionDate);
          return prodDate >= startOfDay && prodDate < new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
        });
        break;
      case 'all':
      default:
        // No filtrar por tipo
        break;
    }

    // Aplicar búsqueda por texto
    if (searchTerm) {
      filtered = filtered.filter(prod =>
        prod.bovineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.productionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.observations?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros específicos
    if (filters.productionType) {
      filtered = filtered.filter(prod => prod.productionTypeId === filters.productionType);
    }
    if (filters.quality) {
      filtered = filtered.filter(prod => prod.qualityId === filters.quality);
    }
    if (filters.bovineId) {
      filtered = filtered.filter(prod => 
        prod.bovineId?.toLowerCase().includes(filters.bovineId.toLowerCase()) ||
        prod.bovineName?.toLowerCase().includes(filters.bovineId.toLowerCase())
      );
    }
    if (filters.ranch) {
      filtered = filtered.filter(prod => prod.ranchId === filters.ranch);
    }

    // Filtrar por rango de cantidad
    if (filters.quantityMin) {
      filtered = filtered.filter(prod => prod.quantity >= parseFloat(filters.quantityMin));
    }
    if (filters.quantityMax) {
      filtered = filtered.filter(prod => prod.quantity <= parseFloat(filters.quantityMax));
    }

    // Filtrar por rango de fechas
    if (filters.startDate) {
      filtered = filtered.filter(prod => 
        new Date(prod.productionDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(prod => 
        new Date(prod.productionDate) <= new Date(filters.endDate)
      );
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'productionDate') {
        aValue = new Date(a.productionDate);
        bValue = new Date(b.productionDate);
      } else if (sortBy === 'quantity' || sortBy === 'salePrice') {
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

    setFilteredProductions(filtered);
    setCurrentPage(1); // Resetear a primera página cuando se aplican filtros
  }, [productions, searchTerm, filters, sortBy, sortOrder, selectedTab]);

  // Función para manejar selección de producciones
  const handleSelectProduction = (productionId) => {
    setSelectedProductions(prev => {
      if (prev.includes(productionId)) {
        return prev.filter(id => id !== productionId);
      } else {
        return [...prev, productionId];
      }
    });
  };

  // Función para seleccionar todas las producciones
  const handleSelectAll = () => {
    if (selectedProductions.length === paginatedProductions.length) {
      setSelectedProductions([]);
    } else {
      setSelectedProductions(paginatedProductions.map(prod => prod.id));
    }
  };

  // Función para eliminar producción
  const handleDeleteProduction = async (productionId) => {
    try {
      await productionService.delete(productionId);
      setProductions(prev => prev.filter(prod => prod.id !== productionId));
      setShowDeleteModal(false);
      setProductionToDelete(null);
      loadProductionStats(); // Actualizar estadísticas
      loadProductionByType();
    } catch (err) {
      console.error('Error al eliminar producción:', err);
      setError('Error al eliminar el registro de producción');
    }
  };

  // Función para obtener icono del tipo de producción
  const getProductionTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'milk':
      case 'leche':
        return Milk;
      case 'meat':
      case 'carne':
        return Beef;
      case 'eggs':
      case 'huevos':
        return Egg;
      case 'wool':
      case 'lana':
        return Scale;
      default:
        return Scale;
    }
  };

  // Función para obtener color del tipo de producción
  const getProductionTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'milk':
      case 'leche':
        return 'bg-blue-100 text-blue-800';
      case 'meat':
      case 'carne':
        return 'bg-red-100 text-red-800';
      case 'eggs':
      case 'huevos':
        return 'bg-yellow-100 text-yellow-800';
      case 'wool':
      case 'lana':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener color de la calidad
  const getQualityColor = (quality) => {
    switch (quality?.toLowerCase()) {
      case 'excellent':
      case 'excelente':
        return 'bg-green-100 text-green-800';
      case 'good':
      case 'buena':
        return 'bg-blue-100 text-blue-800';
      case 'regular':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
      case 'mala':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener icono de la calidad
  const getQualityIcon = (quality) => {
    switch (quality?.toLowerCase()) {
      case 'excellent':
      case 'excelente':
        return <Star className="w-4 h-4 text-green-500" />;
      case 'good':
      case 'buena':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'regular':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'poor':
      case 'mala':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
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

  // Función para obtener unidad de medida
  const getUnit = (type) => {
    switch (type?.toLowerCase()) {
      case 'milk':
      case 'leche':
        return 'L';
      case 'meat':
      case 'carne':
        return 'kg';
      case 'eggs':
      case 'huevos':
        return 'unidades';
      case 'wool':
      case 'lana':
        return 'kg';
      default:
        return 'kg';
    }
  };

  // Calcular producciones para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedProductions = filteredProductions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProductions.length / itemsPerPage);

  // Función para cambiar página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Función para exportar datos
  const handleExport = async (format) => {
    try {
      const dataToExport = selectedProductions.length > 0 
        ? productions.filter(prod => selectedProductions.includes(prod.id))
        : filteredProductions;
      
      await productionService.exportData(dataToExport, format);
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Producción</h1>
          <p className="text-gray-600 mt-1">
            Registra y analiza la producción de leche, carne y otros productos
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={() => {}}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Análisis
          </Button>
          <Button onClick={() => {}}>
            <Plus className="w-4 h-4 mr-2" />
            Registrar Producción
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

      {/* Tarjetas de estadísticas de producción */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Scale className="h-6 w-6 text-blue-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Producción Total</p>
                  <p className="text-lg font-bold text-blue-600">
                    {productionStats.totalProduction}
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
                <TrendingUp className="h-6 w-6 text-green-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Promedio Diario</p>
                  <p className="text-lg font-bold text-green-600">
                    {productionStats.dailyAverage}
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
                <Calendar className="h-6 w-6 text-purple-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Semanal</p>
                  <p className="text-lg font-bold text-purple-600">
                    {productionStats.weeklyTotal}
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
                <BarChart3 className="h-6 w-6 text-orange-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Mensual</p>
                  <p className="text-lg font-bold text-orange-600">
                    {productionStats.monthlyTotal}
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
                <Award className="h-6 w-6 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Calidad A+</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {productionStats.bestQuality}%
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
                <DollarSign className="h-6 w-6 text-green-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Ingresos</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(productionStats.totalRevenue)}
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
                <TrendingUp className={`h-6 w-6 ${productionStats.productionTrend >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Tendencia</p>
                  <p className={`text-lg font-bold ${productionStats.productionTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {productionStats.productionTrend >= 0 ? '+' : ''}{productionStats.productionTrend}%
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
                <User className="h-6 w-6 text-indigo-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Productores Activos</p>
                  <p className="text-lg font-bold text-indigo-600">
                    {productionStats.activeProducers}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Estadísticas por tipo de producto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={statsVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Milk className="w-5 h-5 mr-2 text-blue-600" />
                Leche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="font-medium">{productionByType.milk.total} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Promedio:</span>
                  <span className="font-medium">{productionByType.milk.average} L/día</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tendencia:</span>
                  <span className={`font-medium ${productionByType.milk.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {productionByType.milk.trend >= 0 ? '+' : ''}{productionByType.milk.trend}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Beef className="w-5 h-5 mr-2 text-red-600" />
                Carne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="font-medium">{productionByType.meat.total} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Promedio:</span>
                  <span className="font-medium">{productionByType.meat.average} kg/mes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tendencia:</span>
                  <span className={`font-medium ${productionByType.meat.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {productionByType.meat.trend >= 0 ? '+' : ''}{productionByType.meat.trend}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Egg className="w-5 h-5 mr-2 text-yellow-600" />
                Huevos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="font-medium">{productionByType.eggs.total} unidades</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Promedio:</span>
                  <span className="font-medium">{productionByType.eggs.average} /día</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tendencia:</span>
                  <span className={`font-medium ${productionByType.eggs.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {productionByType.eggs.trend >= 0 ? '+' : ''}{productionByType.eggs.trend}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs para filtrar por tipo de producción */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Todo</TabsTrigger>
              <TabsTrigger value="milk">Leche</TabsTrigger>
              <TabsTrigger value="meat">Carne</TabsTrigger>
              <TabsTrigger value="eggs">Huevos</TabsTrigger>
              <TabsTrigger value="today">Hoy</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por bovino, tipo de producción u observaciones..."
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
                  variant={viewMode === 'charts' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('charts')}
                  className="rounded-l-none"
                >
                  <LineChart className="w-4 h-4" />
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
                    <Label htmlFor="production-type-filter">Tipo de Producción</Label>
                    <Select
                      value={filters.productionType}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, productionType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="milk">Leche</SelectItem>
                        <SelectItem value="meat">Carne</SelectItem>
                        <SelectItem value="eggs">Huevos</SelectItem>
                        <SelectItem value="wool">Lana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quality-filter">Calidad</Label>
                    <Select
                      value={filters.quality}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, quality: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar calidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas</SelectItem>
                        <SelectItem value="excellent">Excelente</SelectItem>
                        <SelectItem value="good">Buena</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="poor">Mala</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bovine-filter">Bovino</Label>
                    <Input
                      placeholder="ID o nombre del bovino"
                      value={filters.bovineId}
                      onChange={(e) => setFilters(prev => ({ ...prev, bovineId: e.target.value }))}
                    />
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
                    <Label htmlFor="quantity-min">Cantidad Mínima</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.quantityMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, quantityMin: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="quantity-max">Cantidad Máxima</Label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={filters.quantityMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, quantityMax: e.target.value }))}
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
                        productionType: '',
                        quality: '',
                        dateRange: 'all',
                        startDate: null,
                        endDate: null,
                        bovineId: '',
                        quantityMin: '',
                        quantityMax: '',
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
        {selectedProductions.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedProductions.length} registro(s) seleccionado(s)
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analizar
                </Button>
                <Button variant="outline" size="sm">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Calcular Ingresos
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
                        checked={selectedProductions.length === paginatedProductions.length && paginatedProductions.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bovino
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo de Producción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => {
                          setSortBy('quantity');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Cantidad
                        {sortBy === 'quantity' && (
                          sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Calidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => {
                          setSortBy('productionDate');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Fecha
                        {sortBy === 'productionDate' && (
                          sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio de Venta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Observaciones
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProductions.map((production, index) => {
                    const TypeIcon = getProductionTypeIcon(production.productionType);
                    
                    return (
                      <motion.tr
                        key={production.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        transition={{ delay: index * 0.05 }}
                        className="cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Checkbox
                            checked={selectedProductions.includes(production.id)}
                            onCheckedChange={() => handleSelectProduction(production.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {production.bovineName}
                            </div>
                            <div className="text-sm text-gray-500">
                              #{production.bovineTagNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <TypeIcon className="w-4 h-4 mr-2" />
                            <Badge className={getProductionTypeColor(production.productionType)}>
                              {production.productionType}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {production.quantity} {getUnit(production.productionType)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getQualityIcon(production.quality)}
                            <Badge className={`ml-2 ${getQualityColor(production.quality)}`}>
                              {production.quality}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(production.productionDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {production.salePrice ? formatCurrency(production.salePrice) : 'No vendido'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {production.observations || 'Sin observaciones'}
                          </div>
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
                                setSelectedProduction(production);
                                setShowDetailModal(true);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}}>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Analizar tendencia
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => {}}>
                                <DollarSign className="mr-2 h-4 w-4" />
                                Registrar venta
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setProductionToDelete(production);
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
          {paginatedProductions.map((production, index) => {
            const TypeIcon = getProductionTypeIcon(production.productionType);
            
            return (
              <motion.div
                key={production.id}
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
                        <Badge className={getProductionTypeColor(production.productionType)}>
                          {production.productionType}
                        </Badge>
                      </div>
                      <Checkbox
                        checked={selectedProductions.includes(production.id)}
                        onCheckedChange={() => handleSelectProduction(production.id)}
                      />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {production.bovineName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">#{production.bovineTagNumber}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Cantidad:</span>
                        <span className="text-lg font-bold text-blue-600">
                          {production.quantity} {getUnit(production.productionType)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Calidad:</span>
                        <div className="flex items-center">
                          {getQualityIcon(production.quality)}
                          <span className="ml-1 text-sm capitalize">{production.quality}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Fecha:</span>
                        <span className="text-sm text-gray-900">
                          {formatDate(production.productionDate)}
                        </span>
                      </div>
                      
                      {production.salePrice && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Precio:</span>
                          <span className="text-sm font-medium text-green-600">
                            {formatCurrency(production.salePrice)}
                          </span>
                        </div>
                      )}
                      
                      {production.observations && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {production.observations}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedProduction(production);
                        setShowDetailModal(true);
                      }}>
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {}}>
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {}}>
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Análisis
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
      {viewMode === 'charts' && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500 py-12">
              <LineChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Gráficos de Producción</h3>
              <p>Los gráficos detallados de producción estarán disponibles próximamente.</p>
              <p className="text-sm mt-2">Incluirán tendencias, comparativas y análisis predictivos.</p>
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
                  Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredProductions.length)} de {filteredProductions.length} resultados
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

      {/* Modal de detalles de producción */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de Producción</DialogTitle>
          </DialogHeader>
          {selectedProduction && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bovino</Label>
                  <p className="text-sm font-medium">{selectedProduction.bovineName} (#{selectedProduction.bovineTagNumber})</p>
                </div>
                <div>
                  <Label>Tipo de Producción</Label>
                  <p className="text-sm">{selectedProduction.productionType}</p>
                </div>
                <div>
                  <Label>Cantidad</Label>
                  <p className="text-sm font-medium">
                    {selectedProduction.quantity} {getUnit(selectedProduction.productionType)}
                  </p>
                </div>
                <div>
                  <Label>Calidad</Label>
                  <div className="flex items-center">
                    {getQualityIcon(selectedProduction.quality)}
                    <span className="ml-2 text-sm capitalize">{selectedProduction.quality}</span>
                  </div>
                </div>
                <div>
                  <Label>Fecha de Producción</Label>
                  <p className="text-sm">{formatDate(selectedProduction.productionDate)}</p>
                </div>
                <div>
                  <Label>Precio de Venta</Label>
                  <p className="text-sm">{selectedProduction.salePrice ? formatCurrency(selectedProduction.salePrice) : 'No vendido'}</p>
                </div>
              </div>
              
              {selectedProduction.observations && (
                <div>
                  <Label>Observaciones</Label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{selectedProduction.observations}</p>
                </div>
              )}
              
              {selectedProduction.temperature && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Temperatura</Label>
                    <div className="flex items-center">
                      <Thermometer className="w-4 h-4 mr-2 text-red-500" />
                      <span className="text-sm">{selectedProduction.temperature}°C</span>
                    </div>
                  </div>
                  <div>
                    <Label>Humedad</Label>
                    <div className="flex items-center">
                      <Droplets className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">{selectedProduction.humidity}%</span>
                    </div>
                  </div>
                </div>
              )}
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
              ¿Estás seguro de que deseas eliminar este registro de producción? 
              Esta acción no se puede deshacer y afectará las estadísticas.
            </p>
            {productionToDelete && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm"><strong>Bovino:</strong> {productionToDelete.bovineName}</p>
                <p className="text-sm"><strong>Tipo:</strong> {productionToDelete.productionType}</p>
                <p className="text-sm"><strong>Cantidad:</strong> {productionToDelete.quantity} {getUnit(productionToDelete.productionType)}</p>
                <p className="text-sm"><strong>Fecha:</strong> {formatDate(productionToDelete.productionDate)}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setProductionToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteProduction(productionToDelete?.id)}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProductionTable;