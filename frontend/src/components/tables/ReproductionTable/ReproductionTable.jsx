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
  Heart, 
  Baby,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity,
  User,
  Syringe,
  TestTube,
  Target,
  Download,
  MapPin,
  Grid,
  List,
  SortAsc,
  SortDesc,
  FileText,
  Bell,
  Award,
  BarChart3,
  PieChart,
  Stethoscope
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
import { reproductionService } from '../services/reproductionService';
import { useGeolocation } from '../hooks/useGeolocation';

const ReproductionTable = () => {
  // Estados principales para datos de reproducción
  const [reproductions, setReproductions] = useState([]);
  const [filteredReproductions, setFilteredReproductions] = useState([]);
  const [selectedReproductions, setSelectedReproductions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para estadísticas de reproducción
  const [reproductionStats, setReproductionStats] = useState({
    totalInseminations: 0,
    pregnancyRate: 0,
    birthRate: 0,
    activePregnancies: 0,
    upcomingBirths: 0,
    fertilityRate: 0,
    averageGestation: 0,
    reproductiveEfficiency: 0
  });

  // Estados para análisis reproductivo
  const [reproductiveAnalysis, setReproductiveAnalysis] = useState({
    byType: { natural: 0, artificial: 0 },
    byResult: { pregnant: 0, not_pregnant: 0, abortion: 0, birth: 0 },
    monthlyTrend: 0,
    seasonalData: []
  });

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    inseminationType: '',
    result: '',
    status: '',
    dateRange: 'all',
    startDate: null,
    endDate: null,
    femaleId: '',
    maleId: '',
    veterinarian: '',
    ranch: ''
  });

  // Estados para paginación y ordenamiento
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('inseminationDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Estados para vistas y modales
  const [viewMode, setViewMode] = useState('table'); // table, grid, calendar
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reproductionToDelete, setReproductionToDelete] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReproduction, setSelectedReproduction] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all'); // all, pregnant, pending, completed, upcoming_births

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
    loadReproductions();
    loadReproductionStats();
    loadReproductiveAnalysis();
  }, []);

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    applyFilters();
  }, [reproductions, searchTerm, filters, sortBy, sortOrder, selectedTab]);

  // Función para cargar reproducciones desde el servicio
  const loadReproductions = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await reproductionService.getAll();
      setReproductions(data);
    } catch (err) {
      console.error('Error al cargar reproducciones:', err);
      setError('Error al cargar los datos de reproducción');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar estadísticas de reproducción
  const loadReproductionStats = async () => {
    try {
      const data = await reproductionService.getStats();
      setReproductionStats(data);
    } catch (err) {
      console.error('Error al cargar estadísticas de reproducción:', err);
    }
  };

  // Función para cargar análisis reproductivo
  const loadReproductiveAnalysis = async () => {
    try {
      const data = await reproductionService.getAnalysis();
      setReproductiveAnalysis(data);
    } catch (err) {
      console.error('Error al cargar análisis reproductivo:', err);
    }
  };

  // Función para aplicar filtros y búsqueda
  const applyFilters = useCallback(() => {
    let filtered = [...reproductions];

    // Filtrar por tab seleccionado
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    switch (selectedTab) {
      case 'pregnant':
        filtered = filtered.filter(rep => rep.result === 'pregnant' && rep.status === 'active');
        break;
      case 'pending':
        filtered = filtered.filter(rep => rep.result === 'pending' || rep.result === null);
        break;
      case 'completed':
        filtered = filtered.filter(rep => rep.result === 'birth' || rep.actualBirthDate);
        break;
      case 'upcoming_births':
        filtered = filtered.filter(rep => {
          if (rep.expectedBirthDate) {
            const birthDate = new Date(rep.expectedBirthDate);
            return birthDate >= today && birthDate <= thirtyDaysFromNow && rep.result === 'pregnant';
          }
          return false;
        });
        break;
      case 'all':
      default:
        // No filtrar por estado
        break;
    }

    // Aplicar búsqueda por texto
    if (searchTerm) {
      filtered = filtered.filter(rep =>
        rep.femaleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.maleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.veterinarianName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.semenOrigin?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros específicos
    if (filters.inseminationType) {
      filtered = filtered.filter(rep => rep.inseminationTypeId === filters.inseminationType);
    }
    if (filters.result) {
      filtered = filtered.filter(rep => rep.resultId === filters.result);
    }
    if (filters.status) {
      filtered = filtered.filter(rep => rep.status === filters.status);
    }
    if (filters.femaleId) {
      filtered = filtered.filter(rep => 
        rep.femaleId?.toLowerCase().includes(filters.femaleId.toLowerCase()) ||
        rep.femaleName?.toLowerCase().includes(filters.femaleId.toLowerCase())
      );
    }
    if (filters.maleId) {
      filtered = filtered.filter(rep => 
        rep.maleId?.toLowerCase().includes(filters.maleId.toLowerCase()) ||
        rep.maleName?.toLowerCase().includes(filters.maleId.toLowerCase()) ||
        rep.semenOrigin?.toLowerCase().includes(filters.maleId.toLowerCase())
      );
    }
    if (filters.veterinarian) {
      filtered = filtered.filter(rep => rep.veterinarianId === filters.veterinarian);
    }
    if (filters.ranch) {
      filtered = filtered.filter(rep => rep.ranchId === filters.ranch);
    }

    // Filtrar por rango de fechas
    if (filters.startDate) {
      filtered = filtered.filter(rep => 
        new Date(rep.inseminationDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(rep => 
        new Date(rep.inseminationDate) <= new Date(filters.endDate)
      );
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'inseminationDate' || sortBy === 'expectedBirthDate' || sortBy === 'actualBirthDate') {
        aValue = new Date(a[sortBy]);
        bValue = new Date(b[sortBy]);
      } else if (sortBy === 'numberOfCalves') {
        aValue = parseInt(a[sortBy]) || 0;
        bValue = parseInt(b[sortBy]) || 0;
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

    setFilteredReproductions(filtered);
    setCurrentPage(1); // Resetear a primera página cuando se aplican filtros
  }, [reproductions, searchTerm, filters, sortBy, sortOrder, selectedTab]);

  // Función para manejar selección de reproducciones
  const handleSelectReproduction = (reproductionId) => {
    setSelectedReproductions(prev => {
      if (prev.includes(reproductionId)) {
        return prev.filter(id => id !== reproductionId);
      } else {
        return [...prev, reproductionId];
      }
    });
  };

  // Función para seleccionar todas las reproducciones
  const handleSelectAll = () => {
    if (selectedReproductions.length === paginatedReproductions.length) {
      setSelectedReproductions([]);
    } else {
      setSelectedReproductions(paginatedReproductions.map(rep => rep.id));
    }
  };

  // Función para eliminar reproducción
  const handleDeleteReproduction = async (reproductionId) => {
    try {
      await reproductionService.delete(reproductionId);
      setReproductions(prev => prev.filter(rep => rep.id !== reproductionId));
      setShowDeleteModal(false);
      setReproductionToDelete(null);
      loadReproductionStats(); // Actualizar estadísticas
      loadReproductiveAnalysis();
    } catch (err) {
      console.error('Error al eliminar reproducción:', err);
      setError('Error al eliminar el registro de reproducción');
    }
  };

  // Función para obtener icono del tipo de inseminación
  const getInseminationTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'artificial':
      case 'artificial_insemination':
        return Syringe;
      case 'natural':
      case 'natural_breeding':
        return Heart;
      case 'embryo_transfer':
        return TestTube;
      default:
        return Activity;
    }
  };

  // Función para obtener color del tipo de inseminación
  const getInseminationTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'artificial':
      case 'artificial_insemination':
        return 'bg-blue-100 text-blue-800';
      case 'natural':
      case 'natural_breeding':
        return 'bg-green-100 text-green-800';
      case 'embryo_transfer':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener icono del resultado
  const getResultIcon = (result) => {
    switch (result?.toLowerCase()) {
      case 'pregnant':
      case 'gestante':
        return <Heart className="w-4 h-4 text-pink-500" />;
      case 'not_pregnant':
      case 'no_gestante':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'abortion':
      case 'aborto':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'birth':
      case 'parto':
        return <Baby className="w-4 h-4 text-green-500" />;
      case 'pending':
      case 'pendiente':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Función para obtener color del resultado
  const getResultColor = (result) => {
    switch (result?.toLowerCase()) {
      case 'pregnant':
      case 'gestante':
        return 'bg-pink-100 text-pink-800';
      case 'not_pregnant':
      case 'no_gestante':
        return 'bg-yellow-100 text-yellow-800';
      case 'abortion':
      case 'aborto':
        return 'bg-red-100 text-red-800';
      case 'birth':
      case 'parto':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'pendiente':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para calcular días de gestación
  const getGestationDays = (inseminationDate, actualBirthDate = null) => {
    if (!inseminationDate) return null;
    const startDate = new Date(inseminationDate);
    const endDate = actualBirthDate ? new Date(actualBirthDate) : new Date();
    const diffTime = endDate - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Función para calcular días hasta parto esperado
  const getDaysUntilBirth = (expectedBirthDate) => {
    if (!expectedBirthDate) return null;
    const today = new Date();
    const birthDate = new Date(expectedBirthDate);
    const diffTime = birthDate - today;
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

  // Función para obtener progreso de gestación
  const getGestationProgress = (inseminationDate, expectedBirthDate, actualBirthDate = null) => {
    if (!inseminationDate || !expectedBirthDate) return 0;
    
    const startDate = new Date(inseminationDate);
    const endDate = actualBirthDate ? new Date(actualBirthDate) : new Date();
    const expectedDate = new Date(expectedBirthDate);
    
    const totalGestation = expectedDate - startDate;
    const currentGestation = endDate - startDate;
    
    const progress = (currentGestation / totalGestation) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  // Calcular reproducciones para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedReproductions = filteredReproductions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReproductions.length / itemsPerPage);

  // Función para cambiar página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Función para exportar datos
  const handleExport = async (format) => {
    try {
      const dataToExport = selectedReproductions.length > 0 
        ? reproductions.filter(rep => selectedReproductions.includes(rep.id))
        : filteredReproductions;
      
      await reproductionService.exportData(dataToExport, format);
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Reproducción</h1>
          <p className="text-gray-600 mt-1">
            Controla la reproducción del ganado y monitorea la fertilidad
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
            Nueva Inseminación
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

      {/* Tarjetas de estadísticas de reproducción */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Syringe className="h-6 w-6 text-blue-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Inseminaciones</p>
                  <p className="text-lg font-bold text-blue-600">
                    {reproductionStats.totalInseminations}
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
                <Target className="h-6 w-6 text-green-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Tasa Gestación</p>
                  <p className="text-lg font-bold text-green-600">
                    {reproductionStats.pregnancyRate}%
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
                <Baby className="h-6 w-6 text-purple-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Tasa Nacimiento</p>
                  <p className="text-lg font-bold text-purple-600">
                    {reproductionStats.birthRate}%
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
                <Heart className="h-6 w-6 text-pink-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Gestaciones Activas</p>
                  <p className="text-lg font-bold text-pink-600">
                    {reproductionStats.activePregnancies}
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
                <Calendar className="h-6 w-6 text-orange-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Partos Próximos</p>
                  <p className="text-lg font-bold text-orange-600">
                    {reproductionStats.upcomingBirths}
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
                  <p className="text-xs font-medium text-gray-600">Fertilidad</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {reproductionStats.fertilityRate}%
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
                <Clock className="h-6 w-6 text-indigo-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Gestación Promedio</p>
                  <p className="text-lg font-bold text-indigo-600">
                    {reproductionStats.averageGestation}d
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
                  <p className="text-xs font-medium text-gray-600">Eficiencia</p>
                  <p className="text-lg font-bold text-green-600">
                    {reproductionStats.reproductiveEfficiency}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Análisis reproductivo por tipo y resultado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={statsVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Por Tipo de Inseminación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Syringe className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm text-gray-600">Artificial:</span>
                  </div>
                  <span className="font-medium">{reproductiveAnalysis.byType.artificial}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm text-gray-600">Natural:</span>
                  </div>
                  <span className="font-medium">{reproductiveAnalysis.byType.natural}</span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Artificial</span>
                    <span>Natural</span>
                  </div>
                  <Progress 
                    value={(reproductiveAnalysis.byType.artificial / (reproductiveAnalysis.byType.artificial + reproductiveAnalysis.byType.natural)) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Por Resultado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-pink-600" />
                    <span className="text-sm text-gray-600">Gestantes:</span>
                  </div>
                  <span className="font-medium">{reproductiveAnalysis.byResult.pregnant}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Baby className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm text-gray-600">Partos:</span>
                  </div>
                  <span className="font-medium">{reproductiveAnalysis.byResult.birth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                    <span className="text-sm text-gray-600">No gestantes:</span>
                  </div>
                  <span className="font-medium">{reproductiveAnalysis.byResult.not_pregnant}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                    <span className="text-sm text-gray-600">Abortos:</span>
                  </div>
                  <span className="font-medium">{reproductiveAnalysis.byResult.abortion}</span>
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
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="pregnant">Gestantes</TabsTrigger>
              <TabsTrigger value="pending">Pendientes</TabsTrigger>
              <TabsTrigger value="completed">Completadas</TabsTrigger>
              <TabsTrigger value="upcoming_births">Partos Próximos</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por hembra, macho, veterinario u origen del semen..."
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
                  variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                  className="rounded-l-none"
                >
                  <Calendar className="w-4 h-4" />
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
                    <Label htmlFor="insemination-type-filter">Tipo de Inseminación</Label>
                    <Select
                      value={filters.inseminationType}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, inseminationType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="artificial">Artificial</SelectItem>
                        <SelectItem value="natural">Natural</SelectItem>
                        <SelectItem value="embryo_transfer">Transferencia de Embriones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="result-filter">Resultado</Label>
                    <Select
                      value={filters.result}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, result: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar resultado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="pregnant">Gestante</SelectItem>
                        <SelectItem value="not_pregnant">No Gestante</SelectItem>
                        <SelectItem value="abortion">Aborto</SelectItem>
                        <SelectItem value="birth">Parto</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="veterinarian-filter">Veterinario</Label>
                    <Select
                      value={filters.veterinarian}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, veterinarian: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar veterinario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="vet1">Dr. Juan Pérez</SelectItem>
                        <SelectItem value="vet2">Dra. María González</SelectItem>
                        <SelectItem value="vet3">Dr. Carlos López</SelectItem>
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
                    <Label htmlFor="female-filter">Hembra</Label>
                    <Input
                      placeholder="ID o nombre de la hembra"
                      value={filters.femaleId}
                      onChange={(e) => setFilters(prev => ({ ...prev, femaleId: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="male-filter">Macho/Semen</Label>
                    <Input
                      placeholder="ID, nombre u origen"
                      value={filters.maleId}
                      onChange={(e) => setFilters(prev => ({ ...prev, maleId: e.target.value }))}
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
                        inseminationType: '',
                        result: '',
                        status: '',
                        dateRange: 'all',
                        startDate: null,
                        endDate: null,
                        femaleId: '',
                        maleId: '',
                        veterinarian: '',
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
        {selectedReproductions.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedReproductions.length} registro(s) seleccionado(s)
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Chequeo Gestación
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Programar Recordatorio
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
                        checked={selectedReproductions.length === paginatedReproductions.length && paginatedReproductions.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hembra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Macho/Semen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => {
                          setSortBy('inseminationDate');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Fecha Inseminación
                        {sortBy === 'inseminationDate' && (
                          sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resultado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gestación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parto Esperado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Veterinario
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedReproductions.map((reproduction, index) => {
                    const TypeIcon = getInseminationTypeIcon(reproduction.inseminationType);
                    const gestationDays = getGestationDays(reproduction.inseminationDate, reproduction.actualBirthDate);
                    const daysUntilBirth = getDaysUntilBirth(reproduction.expectedBirthDate);
                    const gestationProgress = getGestationProgress(reproduction.inseminationDate, reproduction.expectedBirthDate, reproduction.actualBirthDate);
                    
                    return (
                      <motion.tr
                        key={reproduction.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        transition={{ delay: index * 0.05 }}
                        className="cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Checkbox
                            checked={selectedReproductions.includes(reproduction.id)}
                            onCheckedChange={() => handleSelectReproduction(reproduction.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {reproduction.femaleName}
                            </div>
                            <div className="text-sm text-gray-500">
                              #{reproduction.femaleTagNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {reproduction.maleName || reproduction.semenOrigin}
                            </div>
                            {reproduction.semenBatch && (
                              <div className="text-sm text-gray-500">
                                Lote: {reproduction.semenBatch}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <TypeIcon className="w-4 h-4 mr-2" />
                            <Badge className={getInseminationTypeColor(reproduction.inseminationType)}>
                              {reproduction.inseminationType}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(reproduction.inseminationDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getResultIcon(reproduction.result)}
                            <Badge className={`ml-2 ${getResultColor(reproduction.result)}`}>
                              {reproduction.result || 'Pendiente'}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {reproduction.result === 'pregnant' && gestationDays !== null ? (
                            <div>
                              <div className="text-sm text-gray-900">
                                {gestationDays} días
                              </div>
                              <Progress value={gestationProgress} className="w-16 h-1 mt-1" />
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {reproduction.expectedBirthDate ? (
                            <div>
                              <div className="text-sm text-gray-900">
                                {formatDate(reproduction.expectedBirthDate)}
                              </div>
                              {daysUntilBirth !== null && reproduction.result === 'pregnant' && (
                                <div className={`text-xs ${
                                  daysUntilBirth <= 7 ? 'text-red-600' : 
                                  daysUntilBirth <= 30 ? 'text-yellow-600' : 'text-green-600'
                                }`}>
                                  {daysUntilBirth <= 0 ? 'Atrasado' : `En ${daysUntilBirth} días`}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">No calculado</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {reproduction.veterinarianName}
                            </span>
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
                                setSelectedReproduction(reproduction);
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
                              <DropdownMenuItem onClick={() => {}}>
                                <Stethoscope className="mr-2 h-4 w-4" />
                                Chequeo gestación
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}}>
                                <Baby className="mr-2 h-4 w-4" />
                                Registrar parto
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}}>
                                <Bell className="mr-2 h-4 w-4" />
                                Programar recordatorio
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setReproductionToDelete(reproduction);
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
          {paginatedReproductions.map((reproduction, index) => {
            const TypeIcon = getInseminationTypeIcon(reproduction.inseminationType);
            const gestationDays = getGestationDays(reproduction.inseminationDate, reproduction.actualBirthDate);
            const daysUntilBirth = getDaysUntilBirth(reproduction.expectedBirthDate);
            const gestationProgress = getGestationProgress(reproduction.inseminationDate, reproduction.expectedBirthDate, reproduction.actualBirthDate);
            
            return (
              <motion.div
                key={reproduction.id}
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
                        <Badge className={getInseminationTypeColor(reproduction.inseminationType)}>
                          {reproduction.inseminationType}
                        </Badge>
                      </div>
                      <Checkbox
                        checked={selectedReproductions.includes(reproduction.id)}
                        onCheckedChange={() => handleSelectReproduction(reproduction.id)}
                      />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {reproduction.femaleName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">#{reproduction.femaleTagNumber}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Macho/Semen:</span>
                        <span className="text-sm text-gray-900 truncate max-w-xs">
                          {reproduction.maleName || reproduction.semenOrigin}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Fecha:</span>
                        <span className="text-sm text-gray-900">
                          {formatDate(reproduction.inseminationDate)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Resultado:</span>
                        <div className="flex items-center">
                          {getResultIcon(reproduction.result)}
                          <span className="ml-1 text-sm capitalize">{reproduction.result || 'Pendiente'}</span>
                        </div>
                      </div>
                      
                      {reproduction.result === 'pregnant' && gestationDays !== null && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Gestación:</span>
                            <span className="text-sm text-gray-900">{gestationDays} días</span>
                          </div>
                          <Progress value={gestationProgress} className="h-2" />
                        </div>
                      )}
                      
                      {reproduction.expectedBirthDate && reproduction.result === 'pregnant' && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Parto esperado:</span>
                          <div className="text-right">
                            <div className="text-sm text-gray-900">
                              {formatDate(reproduction.expectedBirthDate)}
                            </div>
                            {daysUntilBirth !== null && (
                              <div className={`text-xs ${
                                daysUntilBirth <= 7 ? 'text-red-600' : 
                                daysUntilBirth <= 30 ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {daysUntilBirth <= 0 ? 'Atrasado' : `${daysUntilBirth}d`}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600 truncate">
                          {reproduction.veterinarianName}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedReproduction(reproduction);
                        setShowDetailModal(true);
                      }}>
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {}}>
                        <Stethoscope className="w-4 h-4 mr-1" />
                        Chequeo
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {}}>
                        <Bell className="w-4 h-4 mr-1" />
                        Recordar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Vista de calendario */}
      {viewMode === 'calendar' && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500 py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Calendario Reproductivo</h3>
              <p>El calendario de reproducción estará disponible próximamente.</p>
              <p className="text-sm mt-2">Incluirá fechas de inseminación, chequeos y partos esperados.</p>
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
                  Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredReproductions.length)} de {filteredReproductions.length} resultados
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

      {/* Modal de detalles de reproducción */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de Reproducción</DialogTitle>
          </DialogHeader>
          {selectedReproduction && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Hembra</Label>
                  <p className="text-sm font-medium">{selectedReproduction.femaleName} (#{selectedReproduction.femaleTagNumber})</p>
                </div>
                <div>
                  <Label>Macho/Semen</Label>
                  <p className="text-sm">{selectedReproduction.maleName || selectedReproduction.semenOrigin}</p>
                </div>
                <div>
                  <Label>Tipo de Inseminación</Label>
                  <p className="text-sm">{selectedReproduction.inseminationType}</p>
                </div>
                <div>
                  <Label>Fecha de Inseminación</Label>
                  <p className="text-sm">{formatDate(selectedReproduction.inseminationDate)}</p>
                </div>
                <div>
                  <Label>Resultado</Label>
                  <div className="flex items-center">
                    {getResultIcon(selectedReproduction.result)}
                    <span className="ml-2 text-sm capitalize">{selectedReproduction.result || 'Pendiente'}</span>
                  </div>
                </div>
                <div>
                  <Label>Veterinario</Label>
                  <p className="text-sm">{selectedReproduction.veterinarianName}</p>
                </div>
              </div>
              
              {selectedReproduction.expectedBirthDate && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fecha Esperada de Parto</Label>
                    <p className="text-sm">{formatDate(selectedReproduction.expectedBirthDate)}</p>
                  </div>
                  {selectedReproduction.actualBirthDate && (
                    <div>
                      <Label>Fecha Real de Parto</Label>
                      <p className="text-sm">{formatDate(selectedReproduction.actualBirthDate)}</p>
                    </div>
                  )}
                </div>
              )}
              
              {selectedReproduction.numberOfCalves && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Número de Crías</Label>
                    <p className="text-sm">{selectedReproduction.numberOfCalves}</p>
                  </div>
                  <div>
                    <Label>Dificultad del Parto</Label>
                    <p className="text-sm capitalize">{selectedReproduction.calvingDifficulty || 'Normal'}</p>
                  </div>
                </div>
              )}
              
              {selectedReproduction.semenBatch && (
                <div>
                  <Label>Lote de Semen</Label>
                  <p className="text-sm">{selectedReproduction.semenBatch}</p>
                </div>
              )}
              
              {selectedReproduction.observations && (
                <div>
                  <Label>Observaciones</Label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{selectedReproduction.observations}</p>
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
              ¿Estás seguro de que deseas eliminar este registro de reproducción? 
              Esta acción no se puede deshacer y afectará las estadísticas reproductivas.
            </p>
            {reproductionToDelete && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm"><strong>Hembra:</strong> {reproductionToDelete.femaleName}</p>
                <p className="text-sm"><strong>Tipo:</strong> {reproductionToDelete.inseminationType}</p>
                <p className="text-sm"><strong>Fecha:</strong> {formatDate(reproductionToDelete.inseminationDate)}</p>
                <p className="text-sm"><strong>Resultado:</strong> {reproductionToDelete.result || 'Pendiente'}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setReproductionToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteReproduction(reproductionToDelete?.id)}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ReproductionTable;