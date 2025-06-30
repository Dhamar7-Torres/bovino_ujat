import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, MapPin, Calendar, TrendingUp, Droplets, Scale, Target } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { useGeolocation } from '../hooks/useGeolocation';
import { productionService } from '../services/productionService';
import { bovineService } from '../services/bovineService';

const ProductionForm = () => {
  // Estados principales del formulario
  const [formData, setFormData] = useState({
    bovineId: '',
    productionTypeId: '',
    quantity: '',
    qualityId: '',
    unitMeasure: 'liters',
    productionDate: new Date(),
    productionTime: '',
    temperature: '',
    fatContent: '',
    proteinContent: '',
    somaticCells: '',
    observations: '',
    milkingSession: 'morning' // mañana, tarde, noche
  });

  // Estados para la gestión del formulario
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [bovines, setBovines] = useState([]);
  const [productionTypes, setProductionTypes] = useState([]);
  const [qualityLevels, setQualityLevels] = useState([]);
  const [productionRecords, setProductionRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('today');

  // Estados para modales y vistas
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Estados para estadísticas
  const [dailyStats, setDailyStats] = useState({
    totalProduction: 0,
    averageQuality: 0,
    recordsCount: 0,
    topProducer: null
  });

  // Hook personalizado para geolocalización
  const { location, error: locationError, getCurrentLocation } = useGeolocation();

  // Efectos para cargar datos iniciales
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Efecto para filtrar registros de producción
  useEffect(() => {
    filterProductionRecords();
  }, [productionRecords, searchTerm, filterType, filterDate]);

  // Efecto para calcular estadísticas diarias
  useEffect(() => {
    calculateDailyStats();
  }, [filteredRecords]);

  // Función para obtener datos iniciales
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [bovinesRes, typesRes, qualityRes, recordsRes] = await Promise.all([
        bovineService.getActiveBovines(),
        productionService.getProductionTypes(),
        productionService.getQualityLevels(),
        productionService.getProductionRecords()
      ]);

      setBovines(bovinesRes.data);
      setProductionTypes(typesRes.data);
      setQualityLevels(qualityRes.data);
      setProductionRecords(recordsRes.data);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para filtrar registros de producción
  const filterProductionRecords = () => {
    let filtered = productionRecords;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.bovineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.bovineIdentification.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.productionTypeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por tipo de producción
    if (filterType !== 'all') {
      filtered = filtered.filter(record => record.productionTypeId === filterType);
    }

    // Filtrar por fecha
    const today = new Date();
    if (filterDate === 'today') {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.productionDate);
        return recordDate.toDateString() === today.toDateString();
      });
    } else if (filterDate === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.productionDate);
        return recordDate >= weekAgo;
      });
    } else if (filterDate === 'month') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.productionDate);
        return recordDate >= monthAgo;
      });
    }

    setFilteredRecords(filtered);
  };

  // Función para calcular estadísticas diarias
  const calculateDailyStats = () => {
    if (filteredRecords.length === 0) {
      setDailyStats({ totalProduction: 0, averageQuality: 0, recordsCount: 0, topProducer: null });
      return;
    }

    const totalProduction = filteredRecords.reduce((sum, record) => sum + parseFloat(record.quantity), 0);
    const averageQuality = filteredRecords.reduce((sum, record) => sum + parseFloat(record.qualityScore), 0) / filteredRecords.length;

    // Encontrar el mayor productor
    const productionByBovine = filteredRecords.reduce((acc, record) => {
      const key = record.bovineId;
      if (!acc[key]) {
        acc[key] = { 
          name: record.bovineName, 
          identification: record.bovineIdentification,
          total: 0 
        };
      }
      acc[key].total += parseFloat(record.quantity);
      return acc;
    }, {});

    const topProducer = Object.values(productionByBovine).reduce((max, current) => 
      current.total > (max?.total || 0) ? current : max, null
    );

    setDailyStats({
      totalProduction: totalProduction.toFixed(2),
      averageQuality: averageQuality.toFixed(1),
      recordsCount: filteredRecords.length,
      topProducer
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

    // Auto-calcular unidad de medida según tipo de producción
    if (field === 'productionTypeId') {
      const selectedType = productionTypes.find(type => type.id === value);
      if (selectedType) {
        handleInputChange('unitMeasure', selectedType.defaultUnit || 'liters');
      }
    }
  };

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.bovineId) newErrors.bovineId = 'Selecciona un bovino';
    if (!formData.productionTypeId) newErrors.productionTypeId = 'Selecciona el tipo de producción';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Ingresa una cantidad válida';
    if (!formData.qualityId) newErrors.qualityId = 'Selecciona la calidad';
    if (!formData.productionDate) newErrors.productionDate = 'Selecciona la fecha de producción';
    if (!formData.productionTime) newErrors.productionTime = 'Ingresa la hora de producción';

    // Validaciones específicas para producción de leche
    if (formData.productionTypeId === '1') { // Asumiendo que '1' es leche
      if (formData.temperature && (formData.temperature < 0 || formData.temperature > 50)) {
        newErrors.temperature = 'La temperatura debe estar entre 0 y 50°C';
      }
      if (formData.fatContent && (formData.fatContent < 0 || formData.fatContent > 20)) {
        newErrors.fatContent = 'El contenido graso debe estar entre 0 y 20%';
      }
      if (formData.proteinContent && (formData.proteinContent < 0 || formData.proteinContent > 10)) {
        newErrors.proteinContent = 'El contenido proteico debe estar entre 0 y 10%';
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
        qualityScore: calculateQualityScore()
      };

      if (editingRecord) {
        await productionService.updateProductionRecord(editingRecord.id, dataToSubmit);
      } else {
        await productionService.createProductionRecord(dataToSubmit);
      }

      setSuccess(true);
      resetForm();
      await fetchInitialData();

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error('Error al guardar registro de producción:', error);
      setErrors({ submit: 'Error al guardar. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para calcular puntuación de calidad
  const calculateQualityScore = () => {
    let score = 50; // Base score

    // Factores de calidad para leche
    if (formData.productionTypeId === '1') {
      if (formData.fatContent) {
        const fatContent = parseFloat(formData.fatContent);
        if (fatContent >= 3.0 && fatContent <= 4.5) score += 20;
        else if (fatContent >= 2.5 && fatContent < 3.0) score += 10;
      }

      if (formData.proteinContent) {
        const proteinContent = parseFloat(formData.proteinContent);
        if (proteinContent >= 3.0 && proteinContent <= 4.0) score += 20;
        else if (proteinContent >= 2.5 && proteinContent < 3.0) score += 10;
      }

      if (formData.somaticCells) {
        const somaticCells = parseInt(formData.somaticCells);
        if (somaticCells <= 200000) score += 10;
        else if (somaticCells <= 400000) score += 5;
        else score -= 10;
      }
    }

    return Math.min(Math.max(score, 0), 100);
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      bovineId: '',
      productionTypeId: '',
      quantity: '',
      qualityId: '',
      unitMeasure: 'liters',
      productionDate: new Date(),
      productionTime: '',
      temperature: '',
      fatContent: '',
      proteinContent: '',
      somaticCells: '',
      observations: '',
      milkingSession: 'morning'
    });
    setEditingRecord(null);
    setShowForm(false);
    setErrors({});
  };

  // Función para editar un registro
  const handleEdit = (record) => {
    setFormData({
      bovineId: record.bovineId,
      productionTypeId: record.productionTypeId,
      quantity: record.quantity.toString(),
      qualityId: record.qualityId,
      unitMeasure: record.unitMeasure,
      productionDate: new Date(record.productionDate),
      productionTime: record.productionTime,
      temperature: record.temperature?.toString() || '',
      fatContent: record.fatContent?.toString() || '',
      proteinContent: record.proteinContent?.toString() || '',
      somaticCells: record.somaticCells?.toString() || '',
      observations: record.observations || '',
      milkingSession: record.milkingSession || 'morning'
    });
    setEditingRecord(record);
    setShowForm(true);
  };

  // Función para eliminar un registro
  const handleDelete = async (recordId) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro de producción?')) return;

    try {
      setIsLoading(true);
      await productionService.deleteProductionRecord(recordId);
      await fetchInitialData();
    } catch (error) {
      console.error('Error al eliminar registro:', error);
    } finally {
      setIsLoading(false);
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

  // Función para formatear hora
  const formatTime = (time) => {
    if (!time) return '';
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(`2000-01-01T${time}`));
  };

  // Función para obtener icono según tipo de producción
  const getProductionIcon = (typeId) => {
    switch(typeId) {
      case '1': return <Droplets className="w-4 h-4" />;
      case '2': return <Scale className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  // Función para obtener color de calidad
  const getQualityColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'destructive';
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
          <h1 className="text-3xl font-bold text-gray-900">Registro de Producción</h1>
          <p className="text-gray-600">Monitorea y registra la producción de leche, peso y otros datos del ganado</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Registro
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
              <TrendingUp className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Registro de producción guardado exitosamente
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estadísticas del día */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Estadísticas de Producción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{dailyStats.totalProduction}</div>
                <p className="text-sm text-gray-600">Total Producido (L)</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{dailyStats.averageQuality}%</div>
                <p className="text-sm text-gray-600">Calidad Promedio</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{dailyStats.recordsCount}</div>
                <p className="text-sm text-gray-600">Registros Hoy</p>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-orange-600">
                  {dailyStats.topProducer?.name || 'N/A'}
                </div>
                <p className="text-xs text-gray-600">Mayor Productor</p>
                {dailyStats.topProducer && (
                  <p className="text-xs text-gray-500">{dailyStats.topProducer.total.toFixed(1)}L</p>
                )}
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
                    placeholder="Buscar por bovino o tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="type-filter">Tipo de Producción</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {productionTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date-filter">Período</Label>
                <Select value={filterDate} onValueChange={setFilterDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por fecha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mes</SelectItem>
                    <SelectItem value="all">Todo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => { 
                    setSearchTerm(''); 
                    setFilterType('all'); 
                    setFilterDate('today'); 
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

      {/* Lista de registros de producción */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Registros de Producción ({filteredRecords.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando registros...</p>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No se encontraron registros de producción</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecords.map((record, index) => (
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
                            {getProductionIcon(record.productionTypeId)}
                            {record.bovineName}
                          </CardTitle>
                          <Badge variant={getQualityColor(record.qualityScore)}>
                            {record.qualityScore}%
                          </Badge>
                        </div>
                        <CardDescription>
                          ID: {record.bovineIdentification} • {record.productionTypeName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-gray-600">Cantidad:</span>
                          <span className="font-medium">
                            {record.quantity} {record.unitMeasure}
                          </span>
                          
                          <span className="text-gray-600">Fecha:</span>
                          <span className="font-medium">
                            {formatDate(new Date(record.productionDate))}
                          </span>
                          
                          <span className="text-gray-600">Hora:</span>
                          <span className="font-medium">
                            {formatTime(record.productionTime)}
                          </span>
                          
                          <span className="text-gray-600">Sesión:</span>
                          <span className="font-medium capitalize">
                            {record.milkingSession}
                          </span>
                        </div>

                        {/* Detalles específicos de leche */}
                        {record.productionTypeId === '1' && record.fatContent && (
                          <div className="border-t pt-2">
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              <span className="text-gray-500">Grasa:</span>
                              <span>{record.fatContent}%</span>
                              
                              <span className="text-gray-500">Proteína:</span>
                              <span>{record.proteinContent}%</span>
                            </div>
                          </div>
                        )}

                        {/* Barra de calidad */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Calidad</span>
                            <span className="font-medium">{record.qualityScore}%</span>
                          </div>
                          <Progress 
                            value={record.qualityScore} 
                            className="h-2"
                          />
                        </div>

                        {record.coordinates && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            Ubicación registrada
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-3 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(record)}
                          className="flex-1"
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(record.id)}
                          className="flex-1"
                        >
                          Eliminar
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
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
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>
                    {editingRecord ? 'Editar Registro de Producción' : 'Nuevo Registro de Producción'}
                  </CardTitle>
                  <CardDescription>
                    Registra los datos de producción del bovino seleccionado
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Error general */}
                  {errors.submit && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">
                        {errors.submit}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Selección de bovino */}
                    <div className="space-y-2">
                      <Label htmlFor="bovine">Bovino *</Label>
                      <Select
                        value={formData.bovineId}
                        onValueChange={(value) => handleInputChange('bovineId', value)}
                      >
                        <SelectTrigger className={errors.bovineId ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Seleccionar bovino" />
                        </SelectTrigger>
                        <SelectContent>
                          {bovines.map(bovine => (
                            <SelectItem key={bovine.id} value={bovine.id}>
                              {bovine.name} - {bovine.identification}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.bovineId && <p className="text-red-500 text-xs">{errors.bovineId}</p>}
                    </div>

                    {/* Tipo de producción */}
                    <div className="space-y-2">
                      <Label htmlFor="productionType">Tipo de Producción *</Label>
                      <Select
                        value={formData.productionTypeId}
                        onValueChange={(value) => handleInputChange('productionTypeId', value)}
                      >
                        <SelectTrigger className={errors.productionTypeId ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {productionTypes.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.productionTypeId && <p className="text-red-500 text-xs">{errors.productionTypeId}</p>}
                    </div>

                    {/* Cantidad */}
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Cantidad *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="quantity"
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="0.0"
                          value={formData.quantity}
                          onChange={(e) => handleInputChange('quantity', e.target.value)}
                          className={errors.quantity ? 'border-red-500' : ''}
                        />
                        <Select
                          value={formData.unitMeasure}
                          onValueChange={(value) => handleInputChange('unitMeasure', value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="liters">L</SelectItem>
                            <SelectItem value="kg">Kg</SelectItem>
                            <SelectItem value="units">Und</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.quantity && <p className="text-red-500 text-xs">{errors.quantity}</p>}
                    </div>

                    {/* Calidad */}
                    <div className="space-y-2">
                      <Label htmlFor="quality">Nivel de Calidad *</Label>
                      <Select
                        value={formData.qualityId}
                        onValueChange={(value) => handleInputChange('qualityId', value)}
                      >
                        <SelectTrigger className={errors.qualityId ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Seleccionar calidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {qualityLevels.map(level => (
                            <SelectItem key={level.id} value={level.id}>
                              {level.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.qualityId && <p className="text-red-500 text-xs">{errors.qualityId}</p>}
                    </div>

                    {/* Fecha de producción */}
                    <div className="space-y-2">
                      <Label>Fecha de Producción *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              errors.productionDate ? 'border-red-500' : ''
                            }`}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {formatDate(formData.productionDate)}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={formData.productionDate}
                            onSelect={(date) => handleInputChange('productionDate', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.productionDate && <p className="text-red-500 text-xs">{errors.productionDate}</p>}
                    </div>

                    {/* Hora de producción */}
                    <div className="space-y-2">
                      <Label htmlFor="productionTime">Hora de Producción *</Label>
                      <Input
                        id="productionTime"
                        type="time"
                        value={formData.productionTime}
                        onChange={(e) => handleInputChange('productionTime', e.target.value)}
                        className={errors.productionTime ? 'border-red-500' : ''}
                      />
                      {errors.productionTime && <p className="text-red-500 text-xs">{errors.productionTime}</p>}
                    </div>

                    {/* Sesión de ordeño */}
                    <div className="space-y-2">
                      <Label htmlFor="milkingSession">Sesión de Ordeño</Label>
                      <Select
                        value={formData.milkingSession}
                        onValueChange={(value) => handleInputChange('milkingSession', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Mañana</SelectItem>
                          <SelectItem value="afternoon">Tarde</SelectItem>
                          <SelectItem value="night">Noche</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Parámetros específicos para leche */}
                  {formData.productionTypeId === '1' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t pt-4"
                    >
                      <h3 className="text-lg font-semibold mb-3">Parámetros de Calidad de Leche</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="temperature">Temperatura (°C)</Label>
                          <Input
                            id="temperature"
                            type="number"
                            min="0"
                            max="50"
                            step="0.1"
                            placeholder="4.0"
                            value={formData.temperature}
                            onChange={(e) => handleInputChange('temperature', e.target.value)}
                            className={errors.temperature ? 'border-red-500' : ''}
                          />
                          {errors.temperature && <p className="text-red-500 text-xs">{errors.temperature}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="fatContent">Contenido Graso (%)</Label>
                          <Input
                            id="fatContent"
                            type="number"
                            min="0"
                            max="20"
                            step="0.1"
                            placeholder="3.5"
                            value={formData.fatContent}
                            onChange={(e) => handleInputChange('fatContent', e.target.value)}
                            className={errors.fatContent ? 'border-red-500' : ''}
                          />
                          {errors.fatContent && <p className="text-red-500 text-xs">{errors.fatContent}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="proteinContent">Contenido Proteico (%)</Label>
                          <Input
                            id="proteinContent"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="3.2"
                            value={formData.proteinContent}
                            onChange={(e) => handleInputChange('proteinContent', e.target.value)}
                            className={errors.proteinContent ? 'border-red-500' : ''}
                          />
                          {errors.proteinContent && <p className="text-red-500 text-xs">{errors.proteinContent}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="somaticCells">Células Somáticas</Label>
                          <Input
                            id="somaticCells"
                            type="number"
                            min="0"
                            placeholder="200000"
                            value={formData.somaticCells}
                            onChange={(e) => handleInputChange('somaticCells', e.target.value)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Ubicación */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Ubicación de Producción
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

                  {/* Observaciones */}
                  <div className="space-y-2">
                    <Label htmlFor="observations">Observaciones</Label>
                    <Textarea
                      id="observations"
                      placeholder="Notas adicionales sobre la producción..."
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
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
    </motion.div>
  );
};

export default ProductionForm;