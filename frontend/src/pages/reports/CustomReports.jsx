import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Filter, 
  Download, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Settings,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const CustomReports = () => {
  // Estados para la gestión de reportes
  const [customReports, setCustomReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    dateRange: '',
    status: ''
  });

  // Estados para crear/editar reportes
  const [reportForm, setReportForm] = useState({
    name: '',
    description: '',
    category: '',
    dataSource: '',
    fields: [],
    filters: [],
    chartType: 'table',
    dateRange: {
      from: null,
      to: null
    },
    schedule: 'manual',
    isPublic: false
  });

  // Animaciones de Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  // Cargar reportes personalizados al montar el componente
  useEffect(() => {
    fetchCustomReports();
  }, []);

  // Obtener reportes personalizados desde la API
  const fetchCustomReports = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/reports/custom', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCustomReports(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al cargar reportes personalizados');
      }
    } catch (error) {
      console.error('Error fetching custom reports:', error);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos mock para desarrollo
  const mockReports = [
    {
      id: 1,
      name: 'Reporte de Vacunación Mensual',
      description: 'Seguimiento mensual de vacunaciones por bovino y ubicación',
      category: 'health',
      dataSource: 'salud_veterinaria',
      fields: ['bovino_id', 'fecha_consulta', 'tipo_consulta', 'veterinario'],
      chartType: 'bar',
      schedule: 'monthly',
      isPublic: true,
      status: 'active',
      lastRun: '2025-06-25T10:30:00Z',
      createdAt: '2025-06-01T08:00:00Z',
      createdBy: 'Dr. Juan Pérez'
    },
    {
      id: 2,
      name: 'Análisis de Producción por Ubicación',
      description: 'Reporte de producción de leche por ubicación geográfica',
      category: 'production',
      dataSource: 'produccion',
      fields: ['bovino_id', 'cantidad', 'fecha_produccion', 'ubicacion'],
      chartType: 'line',
      schedule: 'weekly',
      isPublic: false,
      status: 'active',
      lastRun: '2025-06-24T14:15:00Z',
      createdAt: '2025-05-15T12:30:00Z',
      createdBy: 'María García'
    },
    {
      id: 3,
      name: 'Control de Reproducción Geolocalizado',
      description: 'Seguimiento de eventos reproductivos con coordenadas GPS',
      category: 'reproduction',
      dataSource: 'reproduccion',
      fields: ['bovino_id', 'tipo_evento', 'fecha_evento', 'latitud', 'longitud'],
      chartType: 'map',
      schedule: 'manual',
      isPublic: true,
      status: 'draft',
      lastRun: null,
      createdAt: '2025-06-20T16:45:00Z',
      createdBy: 'Dr. Ana López'
    }
  ];

  // Usar datos mock si no hay reportes reales
  const reportsData = customReports.length > 0 ? customReports : mockReports;

  // Opciones para categorías de reportes
  const categoryOptions = [
    { value: 'health', label: 'Salud Veterinaria', icon: '🏥' },
    { value: 'production', label: 'Producción', icon: '🥛' },
    { value: 'reproduction', label: 'Reproducción', icon: '🐄' },
    { value: 'finance', label: 'Finanzas', icon: '💰' },
    { value: 'inventory', label: 'Inventario', icon: '📦' },
    { value: 'location', label: 'Geolocalización', icon: '📍' }
  ];

  // Opciones para tipos de gráfico
  const chartTypeOptions = [
    { value: 'table', label: 'Tabla', icon: '📊' },
    { value: 'bar', label: 'Gráfico de Barras', icon: '📊' },
    { value: 'line', label: 'Gráfico de Líneas', icon: '📈' },
    { value: 'pie', label: 'Gráfico Circular', icon: '🥧' },
    { value: 'map', label: 'Mapa', icon: '🗺️' }
  ];

  // Manejar envío del formulario de reporte
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const endpoint = selectedReport ? `/api/reports/custom/${selectedReport.id}` : '/api/reports/custom';
      const method = selectedReport ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reportForm)
      });

      if (response.ok) {
        await fetchCustomReports();
        setShowCreateModal(false);
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al guardar el reporte');
      }
    } catch (error) {
      console.error('Error saving report:', error);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setReportForm({
      name: '',
      description: '',
      category: '',
      dataSource: '',
      fields: [],
      filters: [],
      chartType: 'table',
      dateRange: { from: null, to: null },
      schedule: 'manual',
      isPublic: false
    });
    setSelectedReport(null);
  };

  // Eliminar reporte
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('¿Estás seguro de eliminar este reporte?')) return;

    try {
      const response = await fetch(`/api/reports/custom/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchCustomReports();
      } else {
        setError('Error al eliminar el reporte');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      setError('Error de conexión');
    }
  };

  // Ejecutar reporte
  const handleRunReport = async (reportId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/reports/custom/${reportId}/run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `custom-report-${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        setError('Error al generar el reporte');
      }
    } catch (error) {
      console.error('Error running report:', error);
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar reportes
  const filteredReports = reportsData.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filters.category || report.category === filters.category;
    const matchesStatus = !filters.status || report.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener icono de categoría
  const getCategoryIcon = (category) => {
    const option = categoryOptions.find(opt => opt.value === category);
    return option ? option.icon : '📊';
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Reportes Personalizados</h2>
          <p className="text-gray-600 mt-1">Crea y gestiona reportes personalizados con geolocalización</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear Reporte
        </Button>
      </motion.div>

      {/* Filtros */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Buscar reportes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las categorías</SelectItem>
                  {categoryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="paused">Pausado</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setFilters({ category: '', status: '' })}>
                <Filter className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de reportes */}
      <motion.div variants={itemVariants} className="grid gap-4">
        <AnimatePresence>
          {filteredReports.map((report) => (
            <motion.div
              key={report.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getCategoryIcon(report.category)}</span>
                        <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        {report.isPublic && (
                          <Badge variant="secondary">Público</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{report.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>📊 {chartTypeOptions.find(opt => opt.value === report.chartType)?.label}</span>
                        <span>🔄 {report.schedule === 'manual' ? 'Manual' : report.schedule}</span>
                        <span>👤 {report.createdBy}</span>
                        {report.lastRun && (
                          <span>📅 Último: {format(new Date(report.lastRun), 'dd/MM/yyyy HH:mm')}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRunReport(report.id)}
                        disabled={isLoading}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReport(report);
                          setReportForm(report);
                          setShowCreateModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal para crear/editar reporte */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">
                    {selectedReport ? 'Editar Reporte' : 'Crear Nuevo Reporte'}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <form onSubmit={handleSubmitReport} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Reporte
                      </label>
                      <Input
                        value={reportForm.name}
                        onChange={(e) => setReportForm({...reportForm, name: e.target.value})}
                        placeholder="Ej: Reporte de Vacunación Mensual"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría
                      </label>
                      <Select 
                        value={reportForm.category} 
                        onValueChange={(value) => setReportForm({...reportForm, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.icon} {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <Textarea
                      value={reportForm.description}
                      onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                      placeholder="Describe el propósito y contenido del reporte..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Gráfico
                      </label>
                      <Select 
                        value={reportForm.chartType} 
                        onValueChange={(value) => setReportForm({...reportForm, chartType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {chartTypeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.icon} {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frecuencia
                      </label>
                      <Select 
                        value={reportForm.schedule} 
                        onValueChange={(value) => setReportForm({...reportForm, schedule: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="daily">Diario</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPublic"
                      checked={reportForm.isPublic}
                      onCheckedChange={(checked) => setReportForm({...reportForm, isPublic: checked})}
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-700">
                      Hacer público este reporte
                    </label>
                  </div>

                  <Separator />

                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateModal(false);
                        resetForm();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      {selectedReport ? 'Actualizar' : 'Crear'} Reporte
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensaje de error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
        >
          {error}
        </motion.div>
      )}

      {/* Estado de carga */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Procesando...</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CustomReports;