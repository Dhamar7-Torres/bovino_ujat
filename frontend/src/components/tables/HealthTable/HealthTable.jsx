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
  Stethoscope, 
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Pill,
  Syringe,
  Activity,
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
  Camera,
  Bell
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
import { healthService } from '../services/healthService';
import { useGeolocation } from '../hooks/useGeolocation';

const HealthTable = () => {
  // Estados principales para datos de salud
  const [healthRecords, setHealthRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para estadísticas de salud
  const [healthStats, setHealthStats] = useState({
    totalConsultations: 0,
    healthyAnimals: 0,
    sickAnimals: 0,
    treatmentAnimals: 0,
    upcomingConsultations: 0,
    vaccinationsDue: 0,
    monthlyTrend: 0
  });

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    consultationType: '',
    status: '',
    veterinarian: '',
    dateRange: 'all',
    startDate: null,
    endDate: null,
    priority: '',
    bovineId: '',
    ranch: ''
  });

  // Estados para paginación y ordenamiento
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('consultationDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Estados para vistas y modales
  const [viewMode, setViewMode] = useState('table'); // table, grid, calendar
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all'); // all, healthy, sick, treatment, upcoming

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
    loadHealthRecords();
    loadHealthStats();
  }, []);

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    applyFilters();
  }, [healthRecords, searchTerm, filters, sortBy, sortOrder, selectedTab]);

  // Función para cargar registros de salud desde el servicio
  const loadHealthRecords = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await healthService.getAll();
      setHealthRecords(data);
    } catch (err) {
      console.error('Error al cargar registros de salud:', err);
      setError('Error al cargar los datos de salud');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar estadísticas de salud
  const loadHealthStats = async () => {
    try {
      const data = await healthService.getStats();
      setHealthStats(data);
    } catch (err) {
      console.error('Error al cargar estadísticas de salud:', err);
    }
  };

  // Función para aplicar filtros y búsqueda
  const applyFilters = useCallback(() => {
    let filtered = [...healthRecords];

    // Filtrar por tab seleccionado
    const today = new Date();
    
    switch (selectedTab) {
      case 'healthy':
        filtered = filtered.filter(record => record.healthStatus === 'healthy');
        break;
      case 'sick':
        filtered = filtered.filter(record => record.healthStatus === 'sick');
        break;
      case 'treatment':
        filtered = filtered.filter(record => record.healthStatus === 'treatment');
        break;
      case 'upcoming':
        filtered = filtered.filter(record => {
          const nextConsultation = new Date(record.nextConsultation);
          return nextConsultation > today;
        });
        break;
      case 'all':
      default:
        // No filtrar por estado
        break;
    }

    // Aplicar búsqueda por texto
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.bovineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.treatment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.veterinarianName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros específicos
    if (filters.consultationType) {
      filtered = filtered.filter(record => record.consultationTypeId === filters.consultationType);
    }
    if (filters.status) {
      filtered = filtered.filter(record => record.healthStatus === filters.status);
    }
    if (filters.veterinarian) {
      filtered = filtered.filter(record => record.veterinarianId === filters.veterinarian);
    }
    if (filters.bovineId) {
      filtered = filtered.filter(record => record.bovineId === filters.bovineId);
    }
    if (filters.ranch) {
      filtered = filtered.filter(record => record.ranchId === filters.ranch);
    }
    if (filters.priority) {
      filtered = filtered.filter(record => record.priority === filters.priority);
    }

    // Filtrar por rango de fechas
    if (filters.startDate) {
      filtered = filtered.filter(record => 
        new Date(record.consultationDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(record => 
        new Date(record.consultationDate) <= new Date(filters.endDate)
      );
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'consultationDate' || sortBy === 'nextConsultation') {
        aValue = new Date(a[sortBy]);
        bValue = new Date(b[sortBy]);
      } else if (sortBy === 'cost') {
        aValue = parseFloat(a.cost) || 0;
        bValue = parseFloat(b.cost) || 0;
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

    setFilteredRecords(filtered);
    setCurrentPage(1); // Resetear a primera página cuando se aplican filtros
  }, [healthRecords, searchTerm, filters, sortBy, sortOrder, selectedTab]);

  // Función para manejar selección de registros
  const handleSelectRecord = (recordId) => {
    setSelectedRecords(prev => {
      if (prev.includes(recordId)) {
        return prev.filter(id => id !== recordId);
      } else {
        return [...prev, recordId];
      }
    });
  };

  // Función para seleccionar todos los registros
  const handleSelectAll = () => {
    if (selectedRecords.length === paginatedRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(paginatedRecords.map(record => record.id));
    }
  };

  // Función para eliminar registro
  const handleDeleteRecord = async (recordId) => {
    try {
      await healthService.delete(recordId);
      setHealthRecords(prev => prev.filter(record => record.id !== recordId));
      setShowDeleteModal(false);
      setRecordToDelete(null);
      loadHealthStats(); // Actualizar estadísticas
    } catch (err) {
      console.error('Error al eliminar registro:', err);
      setError('Error al eliminar el registro de salud');
    }
  };

  // Función para obtener icono del tipo de consulta
  const getConsultationTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'vaccination':
      case 'vacunacion':
        return Syringe;
      case 'checkup':
      case 'chequeo':
        return Stethoscope;
      case 'deworming':
      case 'desparasitacion':
        return Pill;
      case 'illness':
      case 'enfermedad':
        return AlertTriangle;
      case 'surgery':
      case 'cirugia':
        return Activity;
      case 'pregnancy_check':
      case 'chequeo_gestacion':
        return Heart;
      default:
        return Stethoscope;
    }
  };

  // Función para obtener icono del estado de salud
  const getHealthStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'sano':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'sick':
      case 'enfermo':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'treatment':
      case 'tratamiento':
        return <Pill className="w-4 h-4 text-yellow-500" />;
      case 'recovery':
      case 'recuperacion':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'pregnant':
      case 'gestante':
        return <Heart className="w-4 h-4 text-pink-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Función para obtener color del estado
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'sano':
        return 'bg-green-100 text-green-800';
      case 'sick':
      case 'enfermo':
        return 'bg-red-100 text-red-800';
      case 'treatment':
      case 'tratamiento':
        return 'bg-yellow-100 text-yellow-800';
      case 'recovery':
      case 'recuperacion':
        return 'bg-blue-100 text-blue-800';
      case 'pregnant':
      case 'gestante':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener color de prioridad
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'medium':
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
      case 'baja':
        return 'bg-green-100 text-green-800';
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

  // Función para calcular días hasta próxima consulta
  const getDaysUntilNext = (nextDate) => {
    if (!nextDate) return null;
    const today = new Date();
    const next = new Date(nextDate);
    const diffTime = next - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calcular registros para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedRecords = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  // Función para cambiar página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Función para exportar datos
  const handleExport = async (format) => {
    try {
      const dataToExport = selectedRecords.length > 0 
        ? healthRecords.filter(record => selectedRecords.includes(record.id))
        : filteredRecords;
      
      await healthService.exportData(dataToExport, format);
    } catch (err) {
      console.error('Error al exportar datos:', err);
      setError('Error al exportar los datos');
    }
  };

  // Función para programar recordatorio
  const handleScheduleReminder = async (recordId, reminderDate) => {
    try {
      await healthService.scheduleReminder(recordId, reminderDate);
      // Actualizar el registro local o recargar datos
      loadHealthRecords();
    } catch (err) {
      console.error('Error al programar recordatorio:', err);
      setError('Error al programar el recordatorio');
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Salud Veterinaria</h1>
          <p className="text-gray-600 mt-1">
            Monitorea la salud del ganado y programa consultas veterinarias
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => {}}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Consulta
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

      {/* Tarjetas de estadísticas de salud */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Stethoscope className="h-6 w-6 text-blue-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Total Consultas</p>
                  <p className="text-lg font-bold text-blue-600">
                    {healthStats.totalConsultations}
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
                  <p className="text-xs font-medium text-gray-600">Sanos</p>
                  <p className="text-lg font-bold text-green-600">
                    {healthStats.healthyAnimals}
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
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Enfermos</p>
                  <p className="text-lg font-bold text-red-600">
                    {healthStats.sickAnimals}
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
                <Pill className="h-6 w-6 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">En Tratamiento</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {healthStats.treatmentAnimals}
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
                  <p className="text-xs font-medium text-gray-600">Próximas Citas</p>
                  <p className="text-lg font-bold text-purple-600">
                    {healthStats.upcomingConsultations}
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
                <Syringe className="h-6 w-6 text-orange-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Vacunas Pendientes</p>
                  <p className="text-lg font-bold text-orange-600">
                    {healthStats.vaccinationsDue}
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
                <TrendingUp className={`h-6 w-6 ${healthStats.monthlyTrend >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Tendencia Mensual</p>
                  <p className={`text-lg font-bold ${healthStats.monthlyTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {healthStats.monthlyTrend >= 0 ? '+' : ''}{healthStats.monthlyTrend}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs para filtrar por estado de salud */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="healthy">Sanos</TabsTrigger>
              <TabsTrigger value="sick">Enfermos</TabsTrigger>
              <TabsTrigger value="treatment">En Tratamiento</TabsTrigger>
              <TabsTrigger value="upcoming">Próximas Citas</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por bovino, diagnóstico, tratamiento o veterinario..."
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
                    <Label htmlFor="consultation-type-filter">Tipo de Consulta</Label>
                    <Select
                      value={filters.consultationType}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, consultationType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="vaccination">Vacunación</SelectItem>
                        <SelectItem value="checkup">Chequeo General</SelectItem>
                        <SelectItem value="deworming">Desparasitación</SelectItem>
                        <SelectItem value="illness">Enfermedad</SelectItem>
                        <SelectItem value="surgery">Cirugía</SelectItem>
                        <SelectItem value="pregnancy_check">Chequeo de Gestación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status-filter">Estado de Salud</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="healthy">Sano</SelectItem>
                        <SelectItem value="sick">Enfermo</SelectItem>
                        <SelectItem value="treatment">En Tratamiento</SelectItem>
                        <SelectItem value="recovery">En Recuperación</SelectItem>
                        <SelectItem value="pregnant">Gestante</SelectItem>
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
                    <Label htmlFor="priority-filter">Prioridad</Label>
                    <Select
                      value={filters.priority}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="low">Baja</SelectItem>
                      </SelectContent>
                    </Select>
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
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({
                        consultationType: '',
                        status: '',
                        veterinarian: '',
                        dateRange: 'all',
                        startDate: null,
                        endDate: null,
                        priority: '',
                        bovineId: '',
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
        {selectedRecords.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedRecords.length} registro(s) seleccionado(s)
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Programar Recordatorio
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Reporte
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
                        checked={selectedRecords.length === paginatedRecords.length && paginatedRecords.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bovino
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo de Consulta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => {
                          setSortBy('consultationDate');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Fecha Consulta
                        {sortBy === 'consultationDate' && (
                          sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado de Salud
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diagnóstico
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Veterinario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Próxima Consulta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Costo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRecords.map((record, index) => {
                    const TypeIcon = getConsultationTypeIcon(record.consultationType);
                    const daysUntilNext = getDaysUntilNext(record.nextConsultation);
                    
                    return (
                      <motion.tr
                        key={record.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        transition={{ delay: index * 0.05 }}
                        className="cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Checkbox
                            checked={selectedRecords.includes(record.id)}
                            onCheckedChange={() => handleSelectRecord(record.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {record.bovineName}
                            </div>
                            <div className="text-sm text-gray-500">
                              #{record.bovineTagNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <TypeIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-900 capitalize">
                              {record.consultationType}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(record.consultationDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getHealthStatusIcon(record.healthStatus)}
                            <Badge className={`ml-2 ${getStatusColor(record.healthStatus)}`}>
                              {record.healthStatus}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {record.diagnosis || 'No especificado'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {record.veterinarianName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.nextConsultation ? (
                            <div>
                              <div>{formatDate(record.nextConsultation)}</div>
                              {daysUntilNext !== null && (
                                <div className={`text-xs ${
                                  daysUntilNext <= 7 ? 'text-red-600' : 
                                  daysUntilNext <= 30 ? 'text-yellow-600' : 'text-green-600'
                                }`}>
                                  {daysUntilNext <= 0 ? 'Vencida' : `En ${daysUntilNext} días`}
                                </div>
                              )}
                            </div>
                          ) : (
                            'No programada'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.cost ? formatCurrency(record.cost) : 'N/A'}
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
                                setSelectedRecord(record);
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
                                <FileText className="mr-2 h-4 w-4" />
                                Historia clínica
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}}>
                                <Camera className="mr-2 h-4 w-4" />
                                Agregar fotos
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => {}}>
                                <Bell className="mr-2 h-4 w-4" />
                                Programar recordatorio
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Agendar cita
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setRecordToDelete(record);
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
          {paginatedRecords.map((record, index) => {
            const TypeIcon = getConsultationTypeIcon(record.consultationType);
            const daysUntilNext = getDaysUntilNext(record.nextConsultation);
            
            return (
              <motion.div
                key={record.id}
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
                        <TypeIcon className="w-5 h-5 mr-2 text-gray-400" />
                        <Badge className={getStatusColor(record.healthStatus)}>
                          {record.healthStatus}
                        </Badge>
                      </div>
                      <Checkbox
                        checked={selectedRecords.includes(record.id)}
                        onCheckedChange={() => handleSelectRecord(record.id)}
                      />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {record.bovineName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">#{record.bovineTagNumber}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(record.consultationDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span>{record.veterinarianName}</span>
                      </div>
                      {record.diagnosis && (
                        <div className="text-sm text-gray-900 font-medium">
                          {record.diagnosis}
                        </div>
                      )}
                      {record.nextConsultation && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Próxima: {formatDate(record.nextConsultation)}</span>
                          {daysUntilNext !== null && (
                            <Badge className={`ml-2 ${
                              daysUntilNext <= 7 ? 'bg-red-100 text-red-800' : 
                              daysUntilNext <= 30 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {daysUntilNext <= 0 ? 'Vencida' : `${daysUntilNext}d`}
                            </Badge>
                          )}
                        </div>
                      )}
                      {record.cost && (
                        <div className="text-sm font-medium text-gray-900">
                          Costo: {formatCurrency(record.cost)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedRecord(record);
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
              <h3 className="text-lg font-medium mb-2">Vista de Calendario Veterinario</h3>
              <p>El calendario de consultas veterinarias estará disponible próximamente.</p>
              <p className="text-sm mt-2">Incluirá programación de citas y recordatorios automáticos.</p>
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
                  Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredRecords.length)} de {filteredRecords.length} resultados
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

      {/* Modal de detalles del registro */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de Consulta Veterinaria</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bovino</Label>
                  <p className="text-sm font-medium">{selectedRecord.bovineName} (#{selectedRecord.bovineTagNumber})</p>
                </div>
                <div>
                  <Label>Tipo de Consulta</Label>
                  <p className="text-sm">{selectedRecord.consultationType}</p>
                </div>
                <div>
                  <Label>Fecha de Consulta</Label>
                  <p className="text-sm">{formatDate(selectedRecord.consultationDate)}</p>
                </div>
                <div>
                  <Label>Veterinario</Label>
                  <p className="text-sm">{selectedRecord.veterinarianName}</p>
                </div>
              </div>
              
              <div>
                <Label>Diagnóstico</Label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{selectedRecord.diagnosis || 'No especificado'}</p>
              </div>
              
              <div>
                <Label>Tratamiento</Label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{selectedRecord.treatment || 'No especificado'}</p>
              </div>
              
              {selectedRecord.observations && (
                <div>
                  <Label>Observaciones</Label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{selectedRecord.observations}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Próxima Consulta</Label>
                  <p className="text-sm">{selectedRecord.nextConsultation ? formatDate(selectedRecord.nextConsultation) : 'No programada'}</p>
                </div>
                <div>
                  <Label>Costo</Label>
                  <p className="text-sm">{selectedRecord.cost ? formatCurrency(selectedRecord.cost) : 'No especificado'}</p>
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
              ¿Estás seguro de que deseas eliminar este registro de salud? 
              Esta acción no se puede deshacer y se perderá el historial médico.
            </p>
            {recordToDelete && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm"><strong>Bovino:</strong> {recordToDelete.bovineName}</p>
                <p className="text-sm"><strong>Fecha:</strong> {formatDate(recordToDelete.consultationDate)}</p>
                <p className="text-sm"><strong>Tipo:</strong> {recordToDelete.consultationType}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setRecordToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteRecord(recordToDelete?.id)}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default HealthTable;