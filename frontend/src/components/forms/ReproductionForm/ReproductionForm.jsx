import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, MapPin, Calendar, Heart, Baby, TrendingUp, Clock, AlertCircle, CheckCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGeolocation } from '../hooks/useGeolocation';
import { reproductionService } from '../services/reproductionService';
import { bovineService } from '../services/bovineService';

const ReproductionForm = () => {
  // Estados principales del formulario
  const [formData, setFormData] = useState({
    femaleId: '',
    maleId: '',
    inseminationType: 'artificial', // artificial, natural
    inseminationDate: new Date(),
    expectedBirthDate: null,
    actualBirthDate: null,
    resultId: '',
    pregnancyConfirmed: false,
    pregnancyConfirmationDate: null,
    pregnancyMethod: 'ultrasound', // ultrasound, palpation, blood_test
    veterinarianId: '',
    semenOrigin: '',
    semenBatch: '',
    numberOfCalves: 1,
    calvingDifficulty: 'normal', // normal, assisted, difficult, cesarean
    calfViability: 'alive', // alive, dead, stillborn
    observations: ''
  });

  // Estados para la gestión del formulario
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [femalesBovines, setFemalesBovines] = useState([]);
  const [malesBovines, setMalesBovines] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const [reproductionResults, setReproductionResults] = useState([]);
  const [reproductionRecords, setReproductionRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Estados para modales y vistas
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentTab, setCurrentTab] = useState('insemination');

  // Estados para crías
  const [calvesData, setCalvesData] = useState([]);
  const [showCalfForm, setShowCalfForm] = useState(false);
  const [selectedReproduction, setSelectedReproduction] = useState(null);

  // Estados para estadísticas
  const [reproductionStats, setReproductionStats] = useState({
    totalInseminations: 0,
    pregnantFemales: 0,
    expectedBirths: 0,
    successRate: 0,
    avgGestationDays: 0,
    pendingConfirmations: 0
  });

  // Hook personalizado para geolocalización
  const { location, error: locationError, getCurrentLocation } = useGeolocation();

  // Efectos para cargar datos iniciales
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Efecto para filtrar registros de reproducción
  useEffect(() => {
    filterReproductionRecords();
  }, [reproductionRecords, searchTerm, filterStatus, filterPeriod]);

  // Efecto para calcular estadísticas
  useEffect(() => {
    calculateStats();
  }, [reproductionRecords]);

  // Efecto para calcular fecha esperada de parto
  useEffect(() => {
    if (formData.inseminationDate) {
      const expectedDate = new Date(formData.inseminationDate);
      expectedDate.setDate(expectedDate.getDate() + 283); // Gestación promedio de 283 días
      setFormData(prev => ({
        ...prev,
        expectedBirthDate: expectedDate
      }));
    }
  }, [formData.inseminationDate]);

  // Función para obtener datos iniciales
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [femalesRes, malesRes, vetsRes, resultsRes, recordsRes, calvesRes] = await Promise.all([
        bovineService.getFemalesBovines(),
        bovineService.getMalesBovines(),
        reproductionService.getVeterinarians(),
        reproductionService.getReproductionResults(),
        reproductionService.getReproductionRecords(),
        reproductionService.getCalves()
      ]);

      setFemalesBovines(femalesRes.data);
      setMalesBovines(malesRes.data);
      setVeterinarians(vetsRes.data);
      setReproductionResults(resultsRes.data);
      setReproductionRecords(recordsRes.data);
      setCalvesData(calvesRes.data);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para filtrar registros de reproducción
  const filterReproductionRecords = () => {
    let filtered = reproductionRecords;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.femaleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.maleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.femaleIdentification.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (filterStatus !== 'all') {
      if (filterStatus === 'pregnant') {
        filtered = filtered.filter(record => record.pregnancyConfirmed && !record.actualBirthDate);
      } else if (filterStatus === 'pending') {
        filtered = filtered.filter(record => !record.pregnancyConfirmed && !record.actualBirthDate);
      } else if (filterStatus === 'born') {
        filtered = filtered.filter(record => record.actualBirthDate);
      }
    }

    // Filtrar por período
    const today = new Date();
    if (filterPeriod === 'current_month') {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.inseminationDate);
        return recordDate.getMonth() === today.getMonth() && recordDate.getFullYear() === today.getFullYear();
      });
    } else if (filterPeriod === 'next_births') {
      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(record => 
        record.expectedBirthDate && 
        new Date(record.expectedBirthDate) <= nextMonth && 
        !record.actualBirthDate
      );
    }

    setFilteredRecords(filtered);
  };

  // Función para calcular estadísticas
  const calculateStats = () => {
    const totalInseminations = reproductionRecords.length;
    const pregnantFemales = reproductionRecords.filter(r => r.pregnancyConfirmed && !r.actualBirthDate).length;
    const expectedBirths = reproductionRecords.filter(r => {
      if (!r.expectedBirthDate || r.actualBirthDate) return false;
      const expectedDate = new Date(r.expectedBirthDate);
      const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      return expectedDate <= nextMonth;
    }).length;
    
    const successfulBirths = reproductionRecords.filter(r => r.actualBirthDate).length;
    const successRate = totalInseminations > 0 ? (successfulBirths / totalInseminations) * 100 : 0;
    
    const gestationPeriods = reproductionRecords
      .filter(r => r.actualBirthDate)
      .map(r => {
        const insemination = new Date(r.inseminationDate);
        const birth = new Date(r.actualBirthDate);
        return Math.floor((birth - insemination) / (1000 * 60 * 60 * 24));
      });
    
    const avgGestationDays = gestationPeriods.length > 0 
      ? gestationPeriods.reduce((sum, days) => sum + days, 0) / gestationPeriods.length 
      : 0;

    const pendingConfirmations = reproductionRecords.filter(r => {
      if (r.pregnancyConfirmed || r.actualBirthDate) return false;
      const inseminationDate = new Date(r.inseminationDate);
      const confirmationDate = new Date(inseminationDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días después
      return new Date() >= confirmationDate;
    }).length;

    setReproductionStats({
      totalInseminations,
      pregnantFemales,
      expectedBirths,
      successRate: successRate.toFixed(1),
      avgGestationDays: avgGestationDays.toFixed(0),
      pendingConfirmations
    });
  };

  // Función para manejar cambios en los inputs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo específico
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.femaleId) newErrors.femaleId = 'Selecciona la hembra';
    if (!formData.maleId && formData.inseminationType === 'natural') {
      newErrors.maleId = 'Selecciona el macho para inseminación natural';
    }
    if (!formData.inseminationDate) newErrors.inseminationDate = 'Selecciona la fecha de inseminación';
    if (!formData.veterinarianId) newErrors.veterinarianId = 'Selecciona el veterinario responsable';

    // Validaciones específicas para inseminación artificial
    if (formData.inseminationType === 'artificial') {
      if (!formData.semenOrigin.trim()) newErrors.semenOrigin = 'Ingresa el origen del semen';
      if (!formData.semenBatch.trim()) newErrors.semenBatch = 'Ingresa el lote del semen';
    }

    // Validaciones para confirmación de embarazo
    if (formData.pregnancyConfirmed && !formData.pregnancyConfirmationDate) {
      newErrors.pregnancyConfirmationDate = 'Selecciona la fecha de confirmación';
    }

    // Validaciones para parto
    if (formData.actualBirthDate) {
      if (!formData.resultId) newErrors.resultId = 'Selecciona el resultado del parto';
      if (formData.numberOfCalves < 1) newErrors.numberOfCalves = 'El número de crías debe ser mayor a 0';
    }

    // Validar que la fecha de confirmación sea posterior a la inseminación
    if (formData.pregnancyConfirmationDate && formData.inseminationDate) {
      if (new Date(formData.pregnancyConfirmationDate) <= new Date(formData.inseminationDate)) {
        newErrors.pregnancyConfirmationDate = 'La fecha de confirmación debe ser posterior a la inseminación';
      }
    }

    // Validar que la fecha de parto sea posterior a la inseminación
    if (formData.actualBirthDate && formData.inseminationDate) {
      if (new Date(formData.actualBirthDate) <= new Date(formData.inseminationDate)) {
        newErrors.actualBirthDate = 'La fecha de parto debe ser posterior a la inseminación';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      // Obtener ubicación actual si está disponible
      await getCurrentLocation();
      
      const dataToSubmit = {
        ...formData,
        coordinates: location ? {
          latitude: location.latitude,
          longitude: location.longitude
        } : null,
        registrationDate: new Date().toISOString()
      };

      if (editingRecord) {
        await reproductionService.updateReproductionRecord(editingRecord.id, dataToSubmit);
      } else {
        await reproductionService.createReproductionRecord(dataToSubmit);
      }

      setSuccess(true);
      resetForm();
      await fetchInitialData();

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error('Error al guardar registro de reproducción:', error);
      setErrors({ submit: 'Error al guardar. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      femaleId: '',
      maleId: '',
      inseminationType: 'artificial',
      inseminationDate: new Date(),
      expectedBirthDate: null,
      actualBirthDate: null,
      resultId: '',
      pregnancyConfirmed: false,
      pregnancyConfirmationDate: null,
      pregnancyMethod: 'ultrasound',
      veterinarianId: '',
      semenOrigin: '',
      semenBatch: '',
      numberOfCalves: 1,
      calvingDifficulty: 'normal',
      calfViability: 'alive',
      observations: ''
    });
    setEditingRecord(null);
    setShowForm(false);
    setCurrentTab('insemination');
    setErrors({});
  };

  // Función para editar un registro
  const handleEdit = (record) => {
    setFormData({
      femaleId: record.femaleId,
      maleId: record.maleId || '',
      inseminationType: record.inseminationType,
      inseminationDate: new Date(record.inseminationDate),
      expectedBirthDate: record.expectedBirthDate ? new Date(record.expectedBirthDate) : null,
      actualBirthDate: record.actualBirthDate ? new Date(record.actualBirthDate) : null,
      resultId: record.resultId || '',
      pregnancyConfirmed: record.pregnancyConfirmed || false,
      pregnancyConfirmationDate: record.pregnancyConfirmationDate ? new Date(record.pregnancyConfirmationDate) : null,
      pregnancyMethod: record.pregnancyMethod || 'ultrasound',
      veterinarianId: record.veterinarianId,
      semenOrigin: record.semenOrigin || '',
      semenBatch: record.semenBatch || '',
      numberOfCalves: record.numberOfCalves || 1,
      calvingDifficulty: record.calvingDifficulty || 'normal',
      calfViability: record.calfViability || 'alive',
      observations: record.observations || ''
    });
    setEditingRecord(record);
    setShowForm(true);
  };

  // Función para eliminar un registro
  const handleDelete = async (recordId) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro de reproducción?')) return;

    try {
      setIsLoading(true);
      await reproductionService.deleteReproductionRecord(recordId);
      await fetchInitialData();
    } catch (error) {
      console.error('Error al eliminar registro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para ver detalles de un registro
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetails(true);
  };

  // Función para confirmar embarazo
  const handleConfirmPregnancy = async (recordId) => {
    try {
      await reproductionService.confirmPregnancy(recordId, {
        pregnancyConfirmed: true,
        pregnancyConfirmationDate: new Date().toISOString(),
        pregnancyMethod: 'ultrasound'
      });
      await fetchInitialData();
    } catch (error) {
      console.error('Error al confirmar embarazo:', error);
    }
  };

  // Función para formatear fecha
  const formatDate = (date) => {
    if (!date) return 'Seleccionar fecha';
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Función para calcular días de gestación
  const calculateGestationDays = (inseminationDate, currentDate = new Date()) => {
    const insemination = new Date(inseminationDate);
    const current = new Date(currentDate);
    return Math.floor((current - insemination) / (1000 * 60 * 60 * 24));
  };

  // Función para obtener progreso de gestación
  const getGestationProgress = (inseminationDate) => {
    const days = calculateGestationDays(inseminationDate);
    return Math.min((days / 283) * 100, 100);
  };

  // Función para obtener estado de reproducción
  const getReproductionStatus = (record) => {
    if (record.actualBirthDate) return { status: 'born', color: 'success', label: 'Parto Realizado' };
    if (record.pregnancyConfirmed) return { status: 'pregnant', color: 'blue', label: 'Embarazada' };
    
    const daysSinceInsemination = calculateGestationDays(record.inseminationDate);
    if (daysSinceInsemination >= 30) return { status: 'pending', color: 'warning', label: 'Pendiente Confirmación' };
    
    return { status: 'recent', color: 'gray', label: 'Inseminación Reciente' };
  };

  // Función para obtener icono según estado
  const getStatusIcon = (status) => {
    switch(status) {
      case 'born': return <Baby className="w-4 h-4" />;
      case 'pregnant': return <Heart className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Animaciones para framer motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="container mx-auto p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header con título y botón para agregar */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Reproducción</h1>
          <p className="text-gray-600">Controla inseminaciones, embarazos, partos y seguimiento de crías</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-pink-600 hover:bg-pink-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Inseminación
        </Button>
      </motion.div>

      {/* Mensaje de éxito */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Registro de reproducción guardado exitosamente
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estadísticas reproductivas */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Estadísticas Reproductivas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{reproductionStats.totalInseminations}</div>
                <p className="text-sm text-gray-600">Inseminaciones</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{reproductionStats.pregnantFemales}</div>
                <p className="text-sm text-gray-600">Embarazadas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{reproductionStats.expectedBirths}</div>
                <p className="text-sm text-gray-600">Partos Próximos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{reproductionStats.successRate}%</div>
                <p className="text-sm text-gray-600">Tasa de Éxito</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{reproductionStats.avgGestationDays}</div>
                <p className="text-sm text-gray-600">Días Gestación</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{reproductionStats.pendingConfirmations}</div>
                <p className="text-sm text-gray-600">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filtros y búsqueda */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Buscar por hembra, macho o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status-filter">Estado</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pregnant">Embarazadas</SelectItem>
                    <SelectItem value="pending">Pendiente Confirmación</SelectItem>
                    <SelectItem value="born">Partos Realizados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="period-filter">Período</Label>
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="current_month">Este Mes</SelectItem>
                    <SelectItem value="next_births">Próximos Partos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => { 
                    setSearchTerm(''); 
                    setFilterStatus('all'); 
                    setFilterPeriod('all'); 
                  }}
                  className="w-full"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de registros de reproducción */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Registros de Reproducción ({filteredRecords.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando registros...</p>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No se encontraron registros de reproducción</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecords.map((record, index) => {
                  const status = getReproductionStatus(record);
                  const gestationProgress = record.pregnancyConfirmed ? getGestationProgress(record.inseminationDate) : 0;
                  const gestationDays = calculateGestationDays(record.inseminationDate);
                  
                  return (
                    <motion.div
                      key={record.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg flex items-center gap-2">
                              {getStatusIcon(status.status)}
                              {record.femaleName}
                            </CardTitle>
                            <Badge variant={status.color}>
                              {status.label}
                            </Badge>
                          </div>
                          <CardDescription>
                            ID: {record.femaleIdentification} • {record.inseminationType === 'artificial' ? 'IA' : 'Natural'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-gray-600">Inseminación:</span>
                            <span className="font-medium">
                              {formatDate(new Date(record.inseminationDate))}
                            </span>
                            
                            {record.inseminationType === 'natural' && (
                              <>
                                <span className="text-gray-600">Macho:</span>
                                <span className="font-medium">{record.maleName}</span>
                              </>
                            )}
                            
                            <span className="text-gray-600">Días gestación:</span>
                            <span className="font-medium">{gestationDays} días</span>
                            
                            <span className="text-gray-600">Parto esperado:</span>
                            <span className="font-medium">
                              {formatDate(new Date(record.expectedBirthDate))}
                            </span>
                          </div>

                          {/* Progreso de gestación */}
                          {record.pregnancyConfirmed && !record.actualBirthDate && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Progreso de gestación</span>
                                <span className="font-medium">{gestationProgress.toFixed(0)}%</span>
                              </div>
                              <Progress value={gestationProgress} className="h-2" />
                            </div>
                          )}

                          {/* Información del parto */}
                          {record.actualBirthDate && (
                            <div className="border-t pt-2">
                              <div className="grid grid-cols-2 gap-1 text-xs">
                                <span className="text-gray-500">Parto:</span>
                                <span>{formatDate(new Date(record.actualBirthDate))}</span>
                                
                                <span className="text-gray-500">Crías:</span>
                                <span>{record.numberOfCalves || 1}</span>
                                
                                <span className="text-gray-500">Dificultad:</span>
                                <span className="capitalize">{record.calvingDifficulty || 'normal'}</span>
                              </div>
                            </div>
                          )}

                          {/* Alertas */}
                          {status.status === 'pending' && (
                            <Alert className="border-orange-200 bg-orange-50">
                              <AlertCircle className="h-4 w-4 text-orange-600" />
                              <AlertDescription className="text-orange-800 text-xs">
                                Confirmar embarazo
                              </AlertDescription>
                            </Alert>
                          )}

                          {record.coordinates && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              Ubicación GPS registrada
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-3 gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetails(record)}
                            className="flex-1"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                          {status.status === 'pending' && (
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={() => handleConfirmPregnancy(record.id)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Confirmar
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(record)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDelete(record.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal del formulario */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>
                    {editingRecord ? 'Editar Registro de Reproducción' : 'Nuevo Registro de Reproducción'}
                  </CardTitle>
                  <CardDescription>
                    Registra información de inseminación, embarazo y parto
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Error general */}
                  {errors.submit && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">
                        {errors.submit}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Tabs para organizar el formulario */}
                  <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="insemination">Inseminación</TabsTrigger>
                      <TabsTrigger value="pregnancy">Embarazo</TabsTrigger>
                      <TabsTrigger value="birth">Parto</TabsTrigger>
                    </TabsList>

                    {/* Tab de Inseminación */}
                    <TabsContent value="insemination" className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Datos de Inseminación</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="female">Hembra *</Label>
                          <Select
                            value={formData.femaleId}
                            onValueChange={(value) => handleInputChange('femaleId', value)}
                          >
                            <SelectTrigger className={errors.femaleId ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Seleccionar hembra" />
                            </SelectTrigger>
                            <SelectContent>
                              {femalesBovines.map(female => (
                                <SelectItem key={female.id} value={female.id}>
                                  {female.name} - {female.identification}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.femaleId && <p className="text-red-500 text-xs">{errors.femaleId}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="inseminationType">Tipo de Inseminación</Label>
                          <Select
                            value={formData.inseminationType}
                            onValueChange={(value) => handleInputChange('inseminationType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="artificial">Inseminación Artificial</SelectItem>
                              <SelectItem value="natural">Monta Natural</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {formData.inseminationType === 'natural' && (
                          <div className="space-y-2">
                            <Label htmlFor="male">Macho *</Label>
                            <Select
                              value={formData.maleId}
                              onValueChange={(value) => handleInputChange('maleId', value)}
                            >
                              <SelectTrigger className={errors.maleId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Seleccionar macho" />
                              </SelectTrigger>
                              <SelectContent>
                                {malesBovines.map(male => (
                                  <SelectItem key={male.id} value={male.id}>
                                    {male.name} - {male.identification}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.maleId && <p className="text-red-500 text-xs">{errors.maleId}</p>}
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="veterinarian">Veterinario Responsable *</Label>
                          <Select
                            value={formData.veterinarianId}
                            onValueChange={(value) => handleInputChange('veterinarianId', value)}
                          >
                            <SelectTrigger className={errors.veterinarianId ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Seleccionar veterinario" />
                            </SelectTrigger>
                            <SelectContent>
                              {veterinarians.map(vet => (
                                <SelectItem key={vet.id} value={vet.id}>
                                  Dr. {vet.firstName} {vet.lastName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.veterinarianId && <p className="text-red-500 text-xs">{errors.veterinarianId}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label>Fecha de Inseminación *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal ${
                                  errors.inseminationDate ? 'border-red-500' : ''
                                }`}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {formatDate(formData.inseminationDate)}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={formData.inseminationDate}
                                onSelect={(date) => handleInputChange('inseminationDate', date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {errors.inseminationDate && <p className="text-red-500 text-xs">{errors.inseminationDate}</p>}
                        </div>
                      </div>

                      {formData.inseminationType === 'artificial' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="semenOrigin">Origen del Semen *</Label>
                            <Input
                              id="semenOrigin"
                              placeholder="Ej: Toro Elite 123"
                              value={formData.semenOrigin}
                              onChange={(e) => handleInputChange('semenOrigin', e.target.value)}
                              className={errors.semenOrigin ? 'border-red-500' : ''}
                            />
                            {errors.semenOrigin && <p className="text-red-500 text-xs">{errors.semenOrigin}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="semenBatch">Lote del Semen *</Label>
                            <Input
                              id="semenBatch"
                              placeholder="Ej: LOT2024001"
                              value={formData.semenBatch}
                              onChange={(e) => handleInputChange('semenBatch', e.target.value)}
                              className={errors.semenBatch ? 'border-red-500' : ''}
                            />
                            {errors.semenBatch && <p className="text-red-500 text-xs">{errors.semenBatch}</p>}
                          </div>
                        </motion.div>
                      )}

                      {/* Ubicación */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Ubicación de Inseminación
                        </Label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={getCurrentLocation}
                            disabled={!navigator.geolocation}
                            className="flex-1"
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            {location ? 'Actualizar Ubicación' : 'Obtener Ubicación'}
                          </Button>
                        </div>
                        {location && (
                          <p className="text-xs text-green-600">
                            📍 Ubicación registrada: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                          </p>
                        )}
                        {locationError && (
                          <p className="text-xs text-red-600">Error: {locationError}</p>
                        )}
                      </div>
                    </TabsContent>

                    {/* Tab de Embarazo */}
                    <TabsContent value="pregnancy" className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Seguimiento de Embarazo</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Fecha Esperada de Parto</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                                disabled
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {formatDate(formData.expectedBirthDate)}
                              </Button>
                            </PopoverTrigger>
                          </Popover>
                          <p className="text-xs text-gray-500">Calculado automáticamente (283 días)</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="pregnancyConfirmed"
                              checked={formData.pregnancyConfirmed}
                              onChange={(e) => handleInputChange('pregnancyConfirmed', e.target.checked)}
                              className="w-4 h-4 text-pink-600"
                            />
                            <Label htmlFor="pregnancyConfirmed">Embarazo Confirmado</Label>
                          </div>

                          {formData.pregnancyConfirmed && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-4 border-l-4 border-blue-500 pl-4"
                            >
                              <div className="space-y-2">
                                <Label>Fecha de Confirmación</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={`w-full justify-start text-left font-normal ${
                                        errors.pregnancyConfirmationDate ? 'border-red-500' : ''
                                      }`}
                                    >
                                      <Calendar className="mr-2 h-4 w-4" />
                                      {formatDate(formData.pregnancyConfirmationDate)}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <CalendarComponent
                                      mode="single"
                                      selected={formData.pregnancyConfirmationDate}
                                      onSelect={(date) => handleInputChange('pregnancyConfirmationDate', date)}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                {errors.pregnancyConfirmationDate && <p className="text-red-500 text-xs">{errors.pregnancyConfirmationDate}</p>}
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="pregnancyMethod">Método de Confirmación</Label>
                                <Select
                                  value={formData.pregnancyMethod}
                                  onValueChange={(value) => handleInputChange('pregnancyMethod', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ultrasound">Ecografía</SelectItem>
                                    <SelectItem value="palpation">Palpación Rectal</SelectItem>
                                    <SelectItem value="blood_test">Análisis de Sangre</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Tab de Parto */}
                    <TabsContent value="birth" className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Información del Parto</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Fecha Real de Parto</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal ${
                                  errors.actualBirthDate ? 'border-red-500' : ''
                                }`}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {formatDate(formData.actualBirthDate)}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={formData.actualBirthDate}
                                onSelect={(date) => handleInputChange('actualBirthDate', date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {errors.actualBirthDate && <p className="text-red-500 text-xs">{errors.actualBirthDate}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="result">Resultado del Parto</Label>
                          <Select
                            value={formData.resultId}
                            onValueChange={(value) => handleInputChange('resultId', value)}
                          >
                            <SelectTrigger className={errors.resultId ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Seleccionar resultado" />
                            </SelectTrigger>
                            <SelectContent>
                              {reproductionResults.map(result => (
                                <SelectItem key={result.id} value={result.id}>
                                  {result.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.resultId && <p className="text-red-500 text-xs">{errors.resultId}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="numberOfCalves">Número de Crías</Label>
                          <Input
                            id="numberOfCalves"
                            type="number"
                            min="1"
                            max="4"
                            value={formData.numberOfCalves}
                            onChange={(e) => handleInputChange('numberOfCalves', parseInt(e.target.value) || 1)}
                            className={errors.numberOfCalves ? 'border-red-500' : ''}
                          />
                          {errors.numberOfCalves && <p className="text-red-500 text-xs">{errors.numberOfCalves}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="calvingDifficulty">Dificultad del Parto</Label>
                          <Select
                            value={formData.calvingDifficulty}
                            onValueChange={(value) => handleInputChange('calvingDifficulty', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="assisted">Asistido</SelectItem>
                              <SelectItem value="difficult">Difícil</SelectItem>
                              <SelectItem value="cesarean">Cesárea</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="calfViability">Viabilidad de la Cría</Label>
                          <Select
                            value={formData.calfViability}
                            onValueChange={(value) => handleInputChange('calfViability', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="alive">Viva</SelectItem>
                              <SelectItem value="dead">Muerta</SelectItem>
                              <SelectItem value="stillborn">Nacido Muerto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Observaciones generales */}
                  <div className="space-y-2">
                    <Label htmlFor="observations">Observaciones</Label>
                    <Textarea
                      id="observations"
                      placeholder="Notas adicionales sobre la reproducción, embarazo o parto..."
                      value={formData.observations}
                      onChange={(e) => handleInputChange('observations', e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>

                <CardFooter className="gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-pink-600 hover:bg-pink-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-2" />
                        {editingRecord ? 'Actualizar' : 'Guardar'}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de detalles */}
      <AnimatePresence>
        {showDetails && selectedRecord && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Detalles de Reproducción - {selectedRecord.femaleName}
                </CardTitle>
                <CardDescription>Información completa del registro reproductivo</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Información de inseminación */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Inseminación
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 p-3 rounded">
                    <span className="text-gray-600">Hembra:</span>
                    <span>{selectedRecord.femaleName} ({selectedRecord.femaleIdentification})</span>
                    
                    <span className="text-gray-600">Tipo:</span>
                    <span className="capitalize">{selectedRecord.inseminationType}</span>
                    
                    {selectedRecord.inseminationType === 'natural' && (
                      <>
                        <span className="text-gray-600">Macho:</span>
                        <span>{selectedRecord.maleName}</span>
                      </>
                    )}
                    
                    <span className="text-gray-600">Fecha:</span>
                    <span>{formatDate(new Date(selectedRecord.inseminationDate))}</span>
                    
                    <span className="text-gray-600">Veterinario:</span>
                    <span>Dr. {selectedRecord.veterinarianName}</span>
                  </div>
                </div>

                <Separator />

                {/* Información de embarazo */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Embarazo
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 p-3 rounded">
                    <span className="text-gray-600">Estado:</span>
                    <span>{selectedRecord.pregnancyConfirmed ? '✅ Confirmado' : '⏳ Pendiente'}</span>
                    
                    {selectedRecord.pregnancyConfirmed && (
                      <>
                        <span className="text-gray-600">Confirmado:</span>
                        <span>{formatDate(new Date(selectedRecord.pregnancyConfirmationDate))}</span>
                        
                        <span className="text-gray-600">Método:</span>
                        <span className="capitalize">{selectedRecord.pregnancyMethod}</span>
                      </>
                    )}
                    
                    <span className="text-gray-600">Parto esperado:</span>
                    <span>{formatDate(new Date(selectedRecord.expectedBirthDate))}</span>
                    
                    <span className="text-gray-600">Días gestación:</span>
                    <span>{calculateGestationDays(selectedRecord.inseminationDate)} días</span>
                  </div>
                </div>

                {/* Información de parto */}
                {selectedRecord.actualBirthDate && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Baby className="w-4 h-4" />
                        Parto
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 p-3 rounded">
                        <span className="text-gray-600">Fecha real:</span>
                        <span>{formatDate(new Date(selectedRecord.actualBirthDate))}</span>
                        
                        <span className="text-gray-600">Resultado:</span>
                        <span>{selectedRecord.resultDescription}</span>
                        
                        <span className="text-gray-600">Número de crías:</span>
                        <span>{selectedRecord.numberOfCalves || 1}</span>
                        
                        <span className="text-gray-600">Dificultad:</span>
                        <span className="capitalize">{selectedRecord.calvingDifficulty || 'normal'}</span>
                        
                        <span className="text-gray-600">Viabilidad:</span>
                        <span className="capitalize">{selectedRecord.calfViability || 'alive'}</span>
                      </div>
                    </div>
                  </>
                )}

                {selectedRecord.observations && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Observaciones</h3>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedRecord.observations}</p>
                    </div>
                  </>
                )}

                {selectedRecord.coordinates && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Ubicación
                      </h3>
                      <p className="text-sm text-gray-700">
                        Latitud: {selectedRecord.coordinates.latitude}<br />
                        Longitud: {selectedRecord.coordinates.longitude}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => setShowDetails(false)}
                  className="w-full"
                >
                  Cerrar
                </Button>
              </CardFooter>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReproductionForm;