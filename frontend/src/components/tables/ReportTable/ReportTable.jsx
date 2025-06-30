import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Eye,
  FileText,
  MoreHorizontal,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  DollarSign,
  Users,
  Activity,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  Settings,
  X,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

// Componentes de shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

// Hooks personalizados
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { useLocalStorage } from '../../hooks/useLocalStorage';

// Servicios
import { reportService } from '../../services/reportService';

// Utilidades
import { formatDate, formatNumber, formatCurrency, formatPercent } from '../../utils/formatters';

/**
 * Componente de tabla especializada para reportes
 * Incluye visualización de datos, métricas y análisis con filtros específicos
 */
const ReportTable = ({ 
  data = null, 
  loading = false, 
  error = null,
  onRefresh = null,
  reportType = 'general', // 'financial', 'production', 'health', 'events', 'inventory'
  title = "Reportes",
  showFilters = true,
  showPagination = true,
  showMetrics = true,
  itemsPerPage = 15
}) => {
  const navigate = useNavigate();
  
  // Estados principales
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'fecha', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Estados de filtros específicos por tipo de reporte
  const [filters, setFilters] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    rancho_id: '',
    categoria: '',
    estado: '',
    prioridad: '',
    tipo: '',
    rango_valor_min: '',
    rango_valor_max: ''
  });

  // Estados de configuración de columnas
  const [visibleColumns, setVisibleColumns] = useState(getDefaultColumns());

  // Estados de métricas
  const [metrics, setMetrics] = useState({});

  // Hooks personalizados
  const { user, hasRole } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const { getItem, setItem } = useLocalStorage();

  // Datos internos o externos
  const { 
    data: internalData, 
    loading: internalLoading,
    error: internalError,
    execute: refetchData 
  } = useFetch(`/api/reportes/${reportType}`, {
    immediate: !data,
    cacheKey: `report-table-${reportType}`
  });

  // Cargar métricas específicas del tipo de reporte
  const { 
    data: metricsData, 
    loading: loadingMetrics 
  } = useFetch(`/api/reportes/${reportType}/metricas`, {
    immediate: showMetrics,
    cacheKey: `report-metrics-${reportType}`
  });

  // Usar datos internos o externos
  const tableData = data || internalData?.data || [];
  const tableLoading = loading || internalLoading;
  const tableError = error || internalError;

  // Cargar ranchos para filtros
  const { data: ranchos } = useFetch('/api/ranchos', {
    immediate: showFilters,
    cacheKey: 'ranchos-list'
  });

  /**
   * Obtener columnas por defecto según el tipo de reporte
   */
  function getDefaultColumns() {
    const baseColumns = {
      fecha: true,
      descripcion: true,
      acciones: true
    };

    switch (reportType) {
      case 'financial':
        return {
          ...baseColumns,
          tipo: true,
          categoria: true,
          monto: true,
          metodo_pago: true,
          rancho: true,
          estado: true
        };
      case 'production':
        return {
          ...baseColumns,
          tipo_produccion: true,
          cantidad: true,
          unidad: true,
          calidad: true,
          bovino: true,
          rancho: true,
          rendimiento: true
        };
      case 'health':
        return {
          ...baseColumns,
          tipo_evento: true,
          bovino: true,
          veterinario: true,
          diagnostico: true,
          tratamiento: true,
          estado: true,
          prioridad: true
        };
      case 'events':
        return {
          ...baseColumns,
          tipo: true,
          bovino: true,
          estado: true,
          prioridad: true,
          fecha_programada: true,
          fecha_completada: true
        };
      case 'inventory':
        return {
          ...baseColumns,
          producto: true,
          categoria: true,
          cantidad_actual: true,
          cantidad_minima: true,
          valor_total: true,
          estado: true,
          ubicacion: true
        };
      default:
        return {
          ...baseColumns,
          tipo: true,
          categoria: true,
          valor: true,
          estado: true
        };
    }
  }

  // Cargar preferencias guardadas
  useEffect(() => {
    const savedColumns = getItem(`reportTable-${reportType}-columns`);
    const savedSort = getItem(`reportTable-${reportType}-sort`);
    const savedFilters = getItem(`reportTable-${reportType}-filters`);
    
    if (savedColumns) setVisibleColumns(prev => ({ ...prev, ...savedColumns }));
    if (savedSort) setSortConfig(savedSort);
    if (savedFilters) setFilters(prev => ({ ...prev, ...savedFilters }));
  }, [getItem, reportType]);

  // Actualizar métricas cuando cambien
  useEffect(() => {
    if (metricsData) {
      setMetrics(metricsData);
    }
  }, [metricsData]);

  // Filtrar y ordenar datos
  useEffect(() => {
    let processed = [...tableData];

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      processed = processed.filter(item => {
        return Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(term)
        );
      });
    }

    // Filtros específicos
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        switch (key) {
          case 'fecha_inicio':
            processed = processed.filter(item => 
              new Date(item.fecha) >= new Date(value)
            );
            break;
          case 'fecha_fin':
            processed = processed.filter(item => 
              new Date(item.fecha) <= new Date(value)
            );
            break;
          case 'rango_valor_min':
            processed = processed.filter(item => {
              const valor = parseFloat(item.monto || item.valor || item.cantidad || 0);
              return valor >= parseFloat(value);
            });
            break;
          case 'rango_valor_max':
            processed = processed.filter(item => {
              const valor = parseFloat(item.monto || item.valor || item.cantidad || 0);
              return valor <= parseFloat(value);
            });
            break;
          default:
            processed = processed.filter(item => {
              const itemValue = item[key];
              return itemValue && itemValue.toString() === value;
            });
            break;
        }
      }
    });

    // Ordenamiento
    if (sortConfig.key) {
      processed.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Manejo especial para números
        if (sortConfig.key.includes('monto') || sortConfig.key.includes('cantidad') || sortConfig.key.includes('valor')) {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        }

        // Manejo especial para fechas
        if (sortConfig.key.includes('fecha')) {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        // Manejo especial para strings
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(processed);
    setCurrentPage(1);
  }, [tableData, searchTerm, filters, sortConfig]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = showPagination ? filteredData.slice(startIndex, endIndex) : filteredData;

  /**
   * Manejar ordenamiento de columnas
   * @param {string} key - Clave de la columna
   */
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  /**
   * Obtener icono de ordenamiento
   * @param {string} key - Clave de la columna
   */
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  /**
   * Manejar cambio de filtros
   * @param {string} key - Clave del filtro
   * @param {string} value - Valor del filtro
   */
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /**
   * Limpiar todos los filtros
   */
  const clearFilters = () => {
    setFilters({
      fecha_inicio: '',
      fecha_fin: '',
      rancho_id: '',
      categoria: '',
      estado: '',
      prioridad: '',
      tipo: '',
      rango_valor_min: '',
      rango_valor_max: ''
    });
    setSearchTerm('');
  };

  /**
   * Exportar datos del reporte
   */
  const handleExport = async () => {
    try {
      setActionLoading(true);
      
      const response = await reportService.exportReport(reportType, {
        search: searchTerm,
        ...filters
      });
      
      if (response.success) {
        // Crear enlace de descarga
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        showSuccess('Exportación exitosa', 'El reporte se ha exportado correctamente');
      } else {
        throw new Error(response.message || 'Error al exportar reporte');
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      showError(
        'Error al exportar',
        error.response?.data?.message || error.message
      );
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Obtener icono según el tipo de reporte
   * @param {string} type - Tipo de reporte
   */
  const getReportTypeIcon = (type) => {
    switch (type) {
      case 'financial':
        return <DollarSign className="h-4 w-4" />;
      case 'production':
        return <BarChart3 className="h-4 w-4" />;
      case 'health':
        return <Activity className="h-4 w-4" />;
      case 'events':
        return <Calendar className="h-4 w-4" />;
      case 'inventory':
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  /**
   * Obtener color del estado
   * @param {string} estado - Estado del item
   */
  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'completado':
      case 'activo':
      case 'bueno':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pendiente':
      case 'programado':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'vencido':
      case 'critico':
      case 'urgente':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'cancelado':
      case 'inactivo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  /**
   * Formatear valor según el tipo de reporte
   * @param {any} value - Valor a formatear
   * @param {string} key - Clave del campo
   */
  const formatValue = (value, key) => {
    if (!value && value !== 0) return '-';

    if (key.includes('monto') || key.includes('precio') || key.includes('costo')) {
      return formatCurrency(value);
    }
    
    if (key.includes('cantidad') || key.includes('peso')) {
      return formatNumber(value);
    }
    
    if (key.includes('porcentaje') || key.includes('rendimiento')) {
      return formatPercent(value);
    }
    
    if (key.includes('fecha')) {
      return formatDate(value);
    }

    return value;
  };

  /**
   * Renderizar métricas según el tipo de reporte
   */
  const renderMetrics = () => {
    if (!showMetrics || !metrics || Object.keys(metrics).length === 0) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(metrics).map(([key, metric]) => (
          <Card key={key}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold">
                    {formatValue(metric.value, key)}
                  </p>
                  {metric.change !== undefined && (
                    <p className={`text-sm flex items-center gap-1 ${
                      metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {formatPercent(Math.abs(metric.change))} vs período anterior
                    </p>
                  )}
                </div>
                <div className="text-right">
                  {getReportTypeIcon(reportType)}
                </div>
              </div>
              {metric.progress !== undefined && (
                <div className="mt-3">
                  <Progress value={metric.progress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {formatPercent(metric.progress)} del objetivo
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  /**
   * Renderizar filtros específicos del tipo de reporte
   */
  const renderSpecificFilters = () => {
    switch (reportType) {
      case 'financial':
        return (
          <>
            <div>
              <Label className="text-xs">Tipo</Label>
              <Select 
                value={filters.tipo} 
                onValueChange={(value) => handleFilterChange('tipo', value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  <SelectItem value="ingreso">Ingresos</SelectItem>
                  <SelectItem value="egreso">Egresos</SelectItem>
                  <SelectItem value="inversion">Inversiones</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs">Categoría</Label>
              <Select 
                value={filters.categoria} 
                onValueChange={(value) => handleFilterChange('categoria', value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las categorías</SelectItem>
                  <SelectItem value="venta_ganado">Venta de Ganado</SelectItem>
                  <SelectItem value="venta_leche">Venta de Leche</SelectItem>
                  <SelectItem value="medicamentos">Medicamentos</SelectItem>
                  <SelectItem value="alimentacion">Alimentación</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      case 'production':
        return (
          <>
            <div>
              <Label className="text-xs">Tipo de Producción</Label>
              <Select 
                value={filters.tipo} 
                onValueChange={(value) => handleFilterChange('tipo', value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  <SelectItem value="leche">Leche</SelectItem>
                  <SelectItem value="carne">Carne</SelectItem>
                  <SelectItem value="crias">Crías</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs">Calidad</Label>
              <Select 
                value={filters.categoria} 
                onValueChange={(value) => handleFilterChange('categoria', value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las calidades</SelectItem>
                  <SelectItem value="excelente">Excelente</SelectItem>
                  <SelectItem value="buena">Buena</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      case 'health':
        return (
          <>
            <div>
              <Label className="text-xs">Tipo de Evento</Label>
              <Select 
                value={filters.tipo} 
                onValueChange={(value) => handleFilterChange('tipo', value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  <SelectItem value="vacunacion">Vacunación</SelectItem>
                  <SelectItem value="chequeo">Chequeo</SelectItem>
                  <SelectItem value="tratamiento">Tratamiento</SelectItem>
                  <SelectItem value="cirugia">Cirugía</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs">Prioridad</Label>
              <Select 
                value={filters.prioridad} 
                onValueChange={(value) => handleFilterChange('prioridad', value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las prioridades</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  // Configuración de animaciones
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <TooltipProvider>
      <div className="w-full space-y-6">
        {/* Métricas */}
        {renderMetrics()}

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getReportTypeIcon(reportType)}
                  {title}
                </CardTitle>
                <CardDescription>
                  {filteredData.length} de {tableData.length} registros
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Configuración de columnas */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.entries(visibleColumns).map(([key, visible]) => (
                      <DropdownMenuItem key={key} asChild>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={visible}
                            onCheckedChange={(checked) => 
                              setVisibleColumns(prev => ({ ...prev, [key]: checked }))
                            }
                          />
                          <span className="capitalize">{key.replace('_', ' ')}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Exportar */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={actionLoading}
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                {/* Refrescar */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh || refetchData}
                  disabled={tableLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${tableLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Filtros y búsqueda */}
            {showFilters && (
              <div className="p-6 border-b space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Búsqueda */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar en reportes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  {/* Botón filtros avanzados */}
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filtros avanzados
                    {Object.values(filters).some(v => v) && (
                      <Badge variant="secondary">
                        {Object.values(filters).filter(v => v).length}
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* Filtros avanzados */}
                <AnimatePresence>
                  {showAdvancedFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t"
                    >
                      {/* Fecha inicio */}
                      <div>
                        <Label className="text-xs">Fecha inicio</Label>
                        <Input
                          type="date"
                          value={filters.fecha_inicio}
                          onChange={(e) => handleFilterChange('fecha_inicio', e.target.value)}
                          className="h-8"
                        />
                      </div>

                      {/* Fecha fin */}
                      <div>
                        <Label className="text-xs">Fecha fin</Label>
                        <Input
                          type="date"
                          value={filters.fecha_fin}
                          onChange={(e) => handleFilterChange('fecha_fin', e.target.value)}
                          className="h-8"
                        />
                      </div>

                      {/* Rancho */}
                      <div>
                        <Label className="text-xs">Rancho</Label>
                        <Select 
                          value={filters.rancho_id} 
                          onValueChange={(value) => handleFilterChange('rancho_id', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Todos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Todos los ranchos</SelectItem>
                            {ranchos?.data?.map((rancho) => (
                              <SelectItem key={rancho.id} value={rancho.id}>
                                {rancho.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Estado */}
                      <div>
                        <Label className="text-xs">Estado</Label>
                        <Select 
                          value={filters.estado} 
                          onValueChange={(value) => handleFilterChange('estado', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Todos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Todos los estados</SelectItem>
                            <SelectItem value="activo">Activo</SelectItem>
                            <SelectItem value="completado">Completado</SelectItem>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Filtros específicos del tipo de reporte */}
                      {renderSpecificFilters()}

                      {/* Valor mínimo */}
                      <div>
                        <Label className="text-xs">Valor mínimo</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={filters.rango_valor_min}
                          onChange={(e) => handleFilterChange('rango_valor_min', e.target.value)}
                          className="h-8"
                        />
                      </div>

                      {/* Valor máximo */}
                      <div>
                        <Label className="text-xs">Valor máximo</Label>
                        <Input
                          type="number"
                          placeholder="999999"
                          value={filters.rango_valor_max}
                          onChange={(e) => handleFilterChange('rango_valor_max', e.target.value)}
                          className="h-8"
                        />
                      </div>

                      {/* Botón limpiar */}
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                          className="h-8"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Limpiar
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Tabla */}
            <div className="overflow-x-auto">
              {tableLoading ? (
                <div className="p-8">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.entries(visibleColumns).map(([key, visible]) => 
                          visible && <TableHead key={key}><Skeleton className="h-4 w-20" /></TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          {Object.entries(visibleColumns).map(([key, visible]) => 
                            visible && (
                              <TableCell key={key}>
                                <Skeleton className="h-4 w-full" />
                              </TableCell>
                            )
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : tableError ? (
                <div className="p-8 text-center">
                  <p className="text-red-600 dark:text-red-400">
                    Error al cargar datos: {tableError}
                  </p>
                  <Button 
                    onClick={onRefresh || refetchData} 
                    className="mt-4"
                    variant="outline"
                  >
                    Reintentar
                  </Button>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No hay datos de reporte
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchTerm || Object.values(filters).some(v => v) 
                      ? 'No se encontraron registros con los criterios de búsqueda.'
                      : 'No hay datos disponibles para este tipo de reporte.'
                    }
                  </p>
                </div>
              ) : (
                <motion.div
                  variants={tableVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.entries(visibleColumns).map(([key, visible]) => {
                          if (!visible) return null;
                          
                          return (
                            <TableHead 
                              key={key}
                              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                              onClick={() => handleSort(key)}
                            >
                              <div className="flex items-center gap-2">
                                {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                {getSortIcon(key)}
                              </div>
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                      <AnimatePresence>
                        {currentData.map((item, index) => (
                          <motion.tr
                            key={item.id || index}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            layout
                            className="group"
                          >
                            {Object.entries(visibleColumns).map(([key, visible]) => {
                              if (!visible) return null;
                              
                              if (key === 'acciones') {
                                return (
                                  <TableCell key={key}>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => navigate(`/reportes/${reportType}/${item.id}`)}>
                                          <Eye className="mr-2 h-4 w-4" />
                                          Ver detalles
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Download className="mr-2 h-4 w-4" />
                                          Exportar individual
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                );
                              }
                              
                              if (key === 'estado') {
                                return (
                                  <TableCell key={key}>
                                    <Badge className={getStatusColor(item[key])}>
                                      {item[key]}
                                    </Badge>
                                  </TableCell>
                                );
                              }
                              
                              if (key === 'prioridad') {
                                return (
                                  <TableCell key={key}>
                                    <div className="flex items-center gap-2">
                                      {item[key] === 'alta' && <Star className="h-4 w-4 text-red-500" />}
                                      {item[key] === 'media' && <Info className="h-4 w-4 text-yellow-500" />}
                                      {item[key] === 'baja' && <Clock className="h-4 w-4 text-gray-500" />}
                                      <span className="capitalize">{item[key]}</span>
                                    </div>
                                  </TableCell>
                                );
                              }
                              
                              return (
                                <TableCell key={key}>
                                  {formatValue(item[key], key)}
                                </TableCell>
                              );
                            })}
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </motion.div>
              )}
            </div>

            {/* Paginación */}
            {showPagination && totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, filteredData.length)} de {filteredData.length} resultados
                </p>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    {totalPages > 5 && (
                      <>
                        <span className="px-2 py-1 text-sm">...</span>
                        <Button
                          variant={currentPage === totalPages ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default ReportTable;