import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Download, Calendar, BarChart3, PieChart, TrendingUp, FileText, Eye, Trash2, Settings, Clock, Users } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { reportService } from '../services/reportService';

const ReportsForm = () => {
  // Estados principales del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    reportType: 'table', // table, chart, map, dashboard
    dataSource: '',
    dateRangeType: 'custom', // today, week, month, quarter, year, custom
    startDate: null,
    endDate: null,
    fields: [],
    filters: [],
    groupBy: '',
    sortBy: '',
    sortOrder: 'asc',
    chartType: 'bar', // bar, line, pie, area
    includeImages: false,
    includeLocation: false,
    outputFormat: 'pdf', // pdf, excel, csv
    isScheduled: false,
    scheduleFrequency: 'daily', // daily, weekly, monthly
    scheduleTime: '08:00',
    isPublic: false,
    recipients: []
  });

  // Estados para la gestión del formulario
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [reports, setReports] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Estados para modales y vistas
  const [showForm, setShowForm] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Estados para configuración avanzada
  const [availableFields, setAvailableFields] = useState([]);
  const [availableFilters, setAvailableFilters] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Estados para estadísticas
  const [reportStats, setReportStats] = useState({
    totalReports: 0,
    scheduledReports: 0,
    publicReports: 0,
    recentGenerations: 0
  });

  // Efectos para cargar datos iniciales
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Efecto para filtrar reportes
  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, filterCategory, filterStatus]);

  // Efecto para calcular estadísticas
  useEffect(() => {
    calculateStats();
  }, [reports]);

  // Función para obtener datos iniciales
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [reportsRes, templatesRes, fieldsRes, filtersRes] = await Promise.all([
        reportService.getReports(),
        reportService.getTemplates(),
        reportService.getAvailableFields(),
        reportService.getAvailableFilters()
      ]);

      setReports(reportsRes.data);
      setTemplates(templatesRes.data);
      setAvailableFields(fieldsRes.data);
      setAvailableFilters(filtersRes.data);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para filtrar reportes
  const filterReports = () => {
    let filtered = reports;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (filterCategory !== 'all') {
      filtered = filtered.filter(report => report.category === filterCategory);
    }

    // Filtrar por estado
    if (filterStatus !== 'all') {
      if (filterStatus === 'scheduled') {
        filtered = filtered.filter(report => report.isScheduled);
      } else if (filterStatus === 'public') {
        filtered = filtered.filter(report => report.isPublic);
      }
    }

    setFilteredReports(filtered);
  };

  // Función para calcular estadísticas
  const calculateStats = () => {
    setReportStats({
      totalReports: reports.length,
      scheduledReports: reports.filter(r => r.isScheduled).length,
      publicReports: reports.filter(r => r.isPublic).length,
      recentGenerations: reports.filter(r => {
        const lastGenerated = new Date(r.lastGenerated);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return lastGenerated >= weekAgo;
      }).length
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

    // Lógica especial para campos dependientes
    if (field === 'category') {
      // Actualizar campos disponibles según la categoría
      updateAvailableFields(value);
    } else if (field === 'dataSource') {
      // Actualizar filtros disponibles según la fuente de datos
      updateAvailableFilters(value);
    } else if (field === 'dateRangeType') {
      // Configurar fechas automáticamente según el tipo
      setDateRangeByType(value);
    }
  };

  // Función para actualizar campos disponibles
  const updateAvailableFields = (category) => {
    const categoryFields = availableFields.filter(field => 
      field.categories.includes(category) || field.categories.includes('all')
    );
    // Resetear campos seleccionados si no están disponibles
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(fieldId => 
        categoryFields.some(field => field.id === fieldId)
      )
    }));
  };

  // Función para actualizar filtros disponibles
  const updateAvailableFilters = (dataSource) => {
    const sourceFilters = availableFilters.filter(filter => 
      filter.dataSources.includes(dataSource) || filter.dataSources.includes('all')
    );
    // Resetear filtros si no están disponibles
    setFormData(prev => ({
      ...prev,
      filters: prev.filters.filter(filterId => 
        sourceFilters.some(filter => filter.id === filterId)
      )
    }));
  };

  // Función para configurar rango de fechas por tipo
  const setDateRangeByType = (type) => {
    const today = new Date();
    let startDate, endDate;

    switch(type) {
      case 'today':
        startDate = endDate = today;
        break;
      case 'week':
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        endDate = today;
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = today;
        break;
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        startDate = new Date(today.getFullYear(), quarter * 3, 1);
        endDate = today;
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = today;
        break;
      default:
        startDate = endDate = null;
    }

    setFormData(prev => ({
      ...prev,
      startDate,
      endDate
    }));
  };

  // Función para manejar selección de campos
  const handleFieldToggle = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.includes(fieldId)
        ? prev.fields.filter(id => id !== fieldId)
        : [...prev.fields, fieldId]
    }));
  };

  // Función para manejar selección de filtros
  const handleFilterToggle = (filterId) => {
    setFormData(prev => ({
      ...prev,
      filters: prev.filters.includes(filterId)
        ? prev.filters.filter(id => id !== filterId)
        : [...prev.filters, filterId]
    }));
  };

  // Función para aplicar plantilla
  const applyTemplate = (template) => {
    setFormData(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      category: template.category,
      reportType: template.reportType,
      dataSource: template.dataSource,
      fields: [...template.fields],
      filters: [...template.filters],
      chartType: template.chartType || 'bar',
      groupBy: template.groupBy || '',
      sortBy: template.sortBy || ''
    }));
    setSelectedTemplate(template);
  };

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Ingresa el nombre del reporte';
    if (!formData.category) newErrors.category = 'Selecciona una categoría';
    if (!formData.dataSource) newErrors.dataSource = 'Selecciona la fuente de datos';
    if (formData.fields.length === 0) newErrors.fields = 'Selecciona al menos un campo';
    
    if (formData.dateRangeType === 'custom') {
      if (!formData.startDate) newErrors.startDate = 'Selecciona la fecha de inicio';
      if (!formData.endDate) newErrors.endDate = 'Selecciona la fecha de fin';
      if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
        newErrors.endDate = 'La fecha de fin debe ser posterior a la de inicio';
      }
    }

    if (formData.isScheduled) {
      if (!formData.scheduleTime) newErrors.scheduleTime = 'Selecciona la hora de programación';
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
      
      const dataToSubmit = {
        ...formData,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      if (editingReport) {
        await reportService.updateReport(editingReport.id, dataToSubmit);
      } else {
        await reportService.createReport(dataToSubmit);
      }

      setSuccess(true);
      resetForm();
      await fetchInitialData();

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error('Error al guardar reporte:', error);
      setErrors({ submit: 'Error al guardar. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      reportType: 'table',
      dataSource: '',
      dateRangeType: 'custom',
      startDate: null,
      endDate: null,
      fields: [],
      filters: [],
      groupBy: '',
      sortBy: '',
      sortOrder: 'asc',
      chartType: 'bar',
      includeImages: false,
      includeLocation: false,
      outputFormat: 'pdf',
      isScheduled: false,
      scheduleFrequency: 'daily',
      scheduleTime: '08:00',
      isPublic: false,
      recipients: []
    });
    setEditingReport(null);
    setSelectedTemplate(null);
    setShowForm(false);
    setErrors({});
  };

  // Función para editar un reporte
  const handleEdit = (report) => {
    setFormData({
      name: report.name,
      description: report.description || '',
      category: report.category,
      reportType: report.reportType,
      dataSource: report.dataSource,
      dateRangeType: report.dateRangeType || 'custom',
      startDate: report.startDate ? new Date(report.startDate) : null,
      endDate: report.endDate ? new Date(report.endDate) : null,
      fields: [...report.fields],
      filters: [...report.filters],
      groupBy: report.groupBy || '',
      sortBy: report.sortBy || '',
      sortOrder: report.sortOrder || 'asc',
      chartType: report.chartType || 'bar',
      includeImages: report.includeImages || false,
      includeLocation: report.includeLocation || false,
      outputFormat: report.outputFormat || 'pdf',
      isScheduled: report.isScheduled || false,
      scheduleFrequency: report.scheduleFrequency || 'daily',
      scheduleTime: report.scheduleTime || '08:00',
      isPublic: report.isPublic || false,
      recipients: [...(report.recipients || [])]
    });
    setEditingReport(report);
    setShowForm(true);
  };

  // Función para eliminar un reporte
  const handleDelete = async (reportId) => {
    if (!window.confirm('¿Estás seguro de eliminar este reporte?')) return;

    try {
      setIsLoading(true);
      await reportService.deleteReport(reportId);
      await fetchInitialData();
    } catch (error) {
      console.error('Error al eliminar reporte:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para generar reporte
  const handleGenerate = async (report) => {
    try {
      setGeneratingReport(true);
      const response = await reportService.generateReport(report.id);
      
      // Descargar el archivo generado
      const blob = new Blob([response.data], { 
        type: report.outputFormat === 'pdf' ? 'application/pdf' : 
              report.outputFormat === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
              'text/csv'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.name}.${report.outputFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error al generar reporte:', error);
    } finally {
      setGeneratingReport(false);
    }
  };

  // Función para preview del reporte
  const handlePreview = async (report) => {
    try {
      setIsLoading(true);
      const response = await reportService.previewReport(report.id);
      setPreviewData(response.data);
      setShowPreview(true);
    } catch (error) {
      console.error('Error al generar preview:', error);
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

  // Función para obtener icono según categoría
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'health': return '🏥';
      case 'production': return '🥛';
      case 'finance': return '💰';
      case 'inventory': return '📦';
      case 'reproduction': return '🐄';
      case 'location': return '📍';
      default: return '📊';
    }
  };

  // Función para obtener icono según tipo de reporte
  const getReportTypeIcon = (type) => {
    switch(type) {
      case 'table': return <FileText className="w-4 h-4" />;
      case 'chart': return <BarChart3 className="w-4 h-4" />;
      case 'map': return <Users className="w-4 h-4" />;
      case 'dashboard': return <TrendingUp className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
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
          <h1 className="text-3xl font-bold text-gray-900">Generador de Reportes</h1>
          <p className="text-gray-600">Crea reportes personalizados de producción, salud, finanzas y más</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear Reporte
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
              <FileText className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Reporte guardado exitosamente
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estadísticas */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{reportStats.totalReports}</div>
                <p className="text-sm text-gray-600">Total Reportes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{reportStats.scheduledReports}</div>
                <p className="text-sm text-gray-600">Programados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{reportStats.publicReports}</div>
                <p className="text-sm text-gray-600">Públicos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{reportStats.recentGenerations}</div>
                <p className="text-sm text-gray-600">Generados (7d)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Plantillas predefinidas */}
      {templates.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Plantillas Predefinidas
              </CardTitle>
              <CardDescription>
                Usa estas plantillas como punto de partida para tus reportes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map(template => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => applyTemplate(template)}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getCategoryIcon(template.category)}</span>
                        <h3 className="font-medium">{template.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                      <div className="flex items-center gap-2">
                        {getReportTypeIcon(template.reportType)}
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

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
                    placeholder="Buscar reportes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category-filter">Categoría</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="health">Salud</SelectItem>
                    <SelectItem value="production">Producción</SelectItem>
                    <SelectItem value="finance">Finanzas</SelectItem>
                    <SelectItem value="inventory">Inventario</SelectItem>
                    <SelectItem value="reproduction">Reproducción</SelectItem>
                    <SelectItem value="location">Ubicación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status-filter">Estado</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="scheduled">Programados</SelectItem>
                    <SelectItem value="public">Públicos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => { 
                    setSearchTerm(''); 
                    setFilterCategory('all'); 
                    setFilterStatus('all'); 
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

      {/* Lista de reportes */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Reportes Configurados ({filteredReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando reportes...</p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No se encontraron reportes configurados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span className="text-lg">{getCategoryIcon(report.category)}</span>
                            {report.name}
                          </CardTitle>
                          <div className="flex gap-1">
                            {report.isScheduled && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                Programado
                              </Badge>
                            )}
                            {report.isPublic && (
                              <Badge variant="outline" className="text-xs">
                                <Users className="w-3 h-3 mr-1" />
                                Público
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription>
                          {report.description || 'Sin descripción'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-gray-600">Categoría:</span>
                          <span className="font-medium capitalize">{report.category}</span>
                          
                          <span className="text-gray-600">Tipo:</span>
                          <div className="flex items-center gap-1">
                            {getReportTypeIcon(report.reportType)}
                            <span className="font-medium capitalize">{report.reportType}</span>
                          </div>
                          
                          <span className="text-gray-600">Campos:</span>
                          <span className="font-medium">{report.fields.length}</span>
                          
                          <span className="text-gray-600">Formato:</span>
                          <span className="font-medium uppercase">{report.outputFormat}</span>
                        </div>

                        {report.isScheduled && (
                          <div className="text-xs text-gray-500 border-t pt-2">
                            <p>Frecuencia: {report.scheduleFrequency}</p>
                            <p>Hora: {report.scheduleTime}</p>
                          </div>
                        )}

                        {report.lastGenerated && (
                          <div className="text-xs text-gray-500">
                            Último generado: {formatDate(new Date(report.lastGenerated))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-3 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handlePreview(report)}
                          className="flex-1"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Vista Previa
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => handleGenerate(report)}
                          disabled={generatingReport}
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                        >
                          {generatingReport ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                          ) : (
                            <Download className="w-3 h-3 mr-1" />
                          )}
                          Generar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(report)}
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(report.id)}
                        >
                          <Trash2 className="w-3 h-3" />
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
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>
                    {editingReport ? 'Editar Reporte' : 'Crear Nuevo Reporte'}
                  </CardTitle>
                  <CardDescription>
                    Configura los parámetros y campos para tu reporte personalizado
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

                  {/* Información básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Reporte *</Label>
                        <Input
                          id="name"
                          placeholder="Ej: Reporte de Producción Mensual"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Categoría *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange('category', value)}
                        >
                          <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="health">🏥 Salud Veterinaria</SelectItem>
                            <SelectItem value="production">🥛 Producción</SelectItem>
                            <SelectItem value="finance">💰 Finanzas</SelectItem>
                            <SelectItem value="inventory">📦 Inventario</SelectItem>
                            <SelectItem value="reproduction">🐄 Reproducción</SelectItem>
                            <SelectItem value="location">📍 Geolocalización</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe el propósito y contenido del reporte..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Configuración de datos */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Fuente de Datos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dataSource">Fuente de Datos *</Label>
                        <Select
                          value={formData.dataSource}
                          onValueChange={(value) => handleInputChange('dataSource', value)}
                        >
                          <SelectTrigger className={errors.dataSource ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Seleccionar fuente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bovines">Bovinos</SelectItem>
                            <SelectItem value="production">Producción</SelectItem>
                            <SelectItem value="health">Salud Veterinaria</SelectItem>
                            <SelectItem value="inventory">Inventario</SelectItem>
                            <SelectItem value="finances">Finanzas</SelectItem>
                            <SelectItem value="reproduction">Reproducción</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.dataSource && <p className="text-red-500 text-xs">{errors.dataSource}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reportType">Tipo de Reporte</Label>
                        <Select
                          value={formData.reportType}
                          onValueChange={(value) => handleInputChange('reportType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="table">📊 Tabla</SelectItem>
                            <SelectItem value="chart">📈 Gráfico</SelectItem>
                            <SelectItem value="map">🗺️ Mapa</SelectItem>
                            <SelectItem value="dashboard">📋 Dashboard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Rango de fechas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Período de Datos</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tipo de Período</Label>
                        <RadioGroup
                          value={formData.dateRangeType}
                          onValueChange={(value) => handleInputChange('dateRangeType', value)}
                        >
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="today" id="today" />
                              <Label htmlFor="today">Hoy</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="week" id="week" />
                              <Label htmlFor="week">Esta Semana</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="month" id="month" />
                              <Label htmlFor="month">Este Mes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="quarter" id="quarter" />
                              <Label htmlFor="quarter">Este Trimestre</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="year" id="year" />
                              <Label htmlFor="year">Este Año</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="custom" id="custom" />
                              <Label htmlFor="custom">Personalizado</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      {formData.dateRangeType === 'custom' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Fecha de Inicio *</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={`w-full justify-start text-left font-normal ${
                                    errors.startDate ? 'border-red-500' : ''
                                  }`}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {formatDate(formData.startDate)}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <CalendarComponent
                                  mode="single"
                                  selected={formData.startDate}
                                  onSelect={(date) => handleInputChange('startDate', date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label>Fecha de Fin *</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={`w-full justify-start text-left font-normal ${
                                    errors.endDate ? 'border-red-500' : ''
                                  }`}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {formatDate(formData.endDate)}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <CalendarComponent
                                  mode="single"
                                  selected={formData.endDate}
                                  onSelect={(date) => handleInputChange('endDate', date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            {errors.endDate && <p className="text-red-500 text-xs">{errors.endDate}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Campos y filtros */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Campos a Incluir</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {availableFields
                        .filter(field => 
                          field.categories.includes(formData.category) || 
                          field.categories.includes('all')
                        )
                        .map(field => (
                          <div key={field.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={field.id}
                              checked={formData.fields.includes(field.id)}
                              onCheckedChange={() => handleFieldToggle(field.id)}
                            />
                            <Label htmlFor={field.id} className="text-sm cursor-pointer">
                              {field.label}
                            </Label>
                          </div>
                        ))}
                    </div>
                    {errors.fields && <p className="text-red-500 text-xs">{errors.fields}</p>}
                  </div>

                  <Separator />

                  {/* Configuración de formato */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Formato de Salida</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="outputFormat">Formato de Archivo</Label>
                        <Select
                          value={formData.outputFormat}
                          onValueChange={(value) => handleInputChange('outputFormat', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.reportType === 'chart' && (
                        <div className="space-y-2">
                          <Label htmlFor="chartType">Tipo de Gráfico</Label>
                          <Select
                            value={formData.chartType}
                            onValueChange={(value) => handleInputChange('chartType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bar">Barras</SelectItem>
                              <SelectItem value="line">Líneas</SelectItem>
                              <SelectItem value="pie">Circular</SelectItem>
                              <SelectItem value="area">Área</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="space-y-3">
                        <Label>Opciones Adicionales</Label>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <Checkbox
                              checked={formData.includeImages}
                              onCheckedChange={(checked) => handleInputChange('includeImages', checked)}
                            />
                            <span className="text-sm">Incluir imágenes</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <Checkbox
                              checked={formData.includeLocation}
                              onCheckedChange={(checked) => handleInputChange('includeLocation', checked)}
                            />
                            <span className="text-sm">Incluir ubicación GPS</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <Checkbox
                              checked={formData.isPublic}
                              onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                            />
                            <span className="text-sm">Reporte público</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Programación */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.isScheduled}
                        onCheckedChange={(checked) => handleInputChange('isScheduled', checked)}
                      />
                      <Label className="text-lg font-semibold">Programar Generación Automática</Label>
                    </div>
                    
                    {formData.isScheduled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 border-l-4 border-blue-500 pl-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="scheduleFrequency">Frecuencia</Label>
                          <Select
                            value={formData.scheduleFrequency}
                            onValueChange={(value) => handleInputChange('scheduleFrequency', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Diario</SelectItem>
                              <SelectItem value="weekly">Semanal</SelectItem>
                              <SelectItem value="monthly">Mensual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="scheduleTime">Hora de Ejecución</Label>
                          <Input
                            id="scheduleTime"
                            type="time"
                            value={formData.scheduleTime}
                            onChange={(e) => handleInputChange('scheduleTime', e.target.value)}
                            className={errors.scheduleTime ? 'border-red-500' : ''}
                          />
                          {errors.scheduleTime && <p className="text-red-500 text-xs">{errors.scheduleTime}</p>}
                        </div>
                      </motion.div>
                    )}
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
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        {editingReport ? 'Actualizar' : 'Crear Reporte'}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de vista previa */}
      <AnimatePresence>
        {showPreview && previewData && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <CardHeader>
                <CardTitle>Vista Previa del Reporte</CardTitle>
                <CardDescription>
                  Muestra limitada de los primeros 10 registros
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {previewData.type === 'table' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          {previewData.headers.map((header, index) => (
                            <th key={index} className="border border-gray-300 px-4 py-2 text-left">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.rows.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Vista previa no disponible para este tipo de reporte</p>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => setShowPreview(false)}
                  className="w-full"
                >
                  Cerrar Vista Previa
                </Button>
              </CardFooter>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReportsForm;