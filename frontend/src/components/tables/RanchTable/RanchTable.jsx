import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  MoreHorizontal,
  MapPin,
  Phone,
  Mail,
  User,
  Hectare,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  Settings,
  CheckCircle,
  X
} from 'lucide-react';

// Componentes de shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

// Hooks personalizados
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { useLocalStorage } from '../../hooks/useLocalStorage';

// Servicios
import { ranchService } from '../../services/ranchService';

// Utilidades
import { formatDate, formatNumber } from '../../utils/formatters';

/**
 * Componente de tabla especializada para ranchos
 * Incluye funcionalidades avanzadas de filtrado, ordenamiento y acciones en lote
 */
const RanchTable = ({ 
  data = null, 
  loading = false, 
  error = null,
  onRefresh = null,
  selectable = false,
  actions = true,
  compact = false,
  title = "Ranchos",
  showFilters = true,
  showPagination = true,
  itemsPerPage = 10
}) => {
  const navigate = useNavigate();
  
  // Estados principales
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Estados de filtros avanzados
  const [filters, setFilters] = useState({
    estado_id: '',
    activo: 'all',
    superficie_min: '',
    superficie_max: '',
    propietario_id: '',
    fecha_desde: '',
    fecha_hasta: ''
  });

  // Estados de configuración de columnas
  const [visibleColumns, setVisibleColumns] = useState({
    imagen: true,
    nombre: true,
    propietario: true,
    estado: true,
    superficie: true,
    contacto: compact ? false : true,
    ubicacion: compact ? false : true,
    fecha_creacion: compact ? false : true,
    estatus: true,
    acciones: actions
  });

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
  } = useFetch('/api/ranchos', {
    immediate: !data,
    cacheKey: 'ranch-table-data'
  });

  // Usar datos internos o externos
  const tableData = data || internalData?.data || [];
  const tableLoading = loading || internalLoading;
  const tableError = error || internalError;

  // Cargar estados para filtros
  const { data: estados } = useFetch('/api/estados', {
    immediate: showFilters,
    cacheKey: 'estados-list'
  });

  // Cargar usuarios para filtros (solo admin)
  const { data: usuarios } = useFetch('/api/usuarios', {
    immediate: showFilters && hasRole('admin'),
    cacheKey: 'usuarios-propietarios'
  });

  // Cargar preferencias guardadas
  useEffect(() => {
    const savedColumns = getItem('ranchTable-visibleColumns');
    const savedSort = getItem('ranchTable-sortConfig');
    const savedFilters = getItem('ranchTable-filters');
    
    if (savedColumns) setVisibleColumns(prev => ({ ...prev, ...savedColumns }));
    if (savedSort) setSortConfig(savedSort);
    if (savedFilters) setFilters(prev => ({ ...prev, ...savedFilters }));
  }, [getItem]);

  // Guardar preferencias cuando cambien
  useEffect(() => {
    setItem('ranchTable-visibleColumns', visibleColumns);
  }, [visibleColumns, setItem]);

  useEffect(() => {
    setItem('ranchTable-sortConfig', sortConfig);
  }, [sortConfig, setItem]);

  useEffect(() => {
    setItem('ranchTable-filters', filters);
  }, [filters, setItem]);

  // Filtrar y ordenar datos
  useEffect(() => {
    let processed = [...tableData];

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      processed = processed.filter(ranch =>
        ranch.nombre?.toLowerCase().includes(term) ||
        ranch.descripcion?.toLowerCase().includes(term) ||
        ranch.propietario_nombre?.toLowerCase().includes(term) ||
        ranch.estado_nombre?.toLowerCase().includes(term)
      );
    }

    // Filtros avanzados
    if (filters.estado_id) {
      processed = processed.filter(ranch => 
        ranch.estado_id?.toString() === filters.estado_id
      );
    }

    if (filters.activo !== 'all') {
      processed = processed.filter(ranch => 
        ranch.activo === (filters.activo === 'true')
      );
    }

    if (filters.superficie_min) {
      processed = processed.filter(ranch => 
        parseFloat(ranch.superficie_hectareas) >= parseFloat(filters.superficie_min)
      );
    }

    if (filters.superficie_max) {
      processed = processed.filter(ranch => 
        parseFloat(ranch.superficie_hectareas) <= parseFloat(filters.superficie_max)
      );
    }

    if (filters.propietario_id) {
      processed = processed.filter(ranch => 
        ranch.propietario_id === filters.propietario_id
      );
    }

    if (filters.fecha_desde) {
      processed = processed.filter(ranch => 
        new Date(ranch.fecha_creacion) >= new Date(filters.fecha_desde)
      );
    }

    if (filters.fecha_hasta) {
      processed = processed.filter(ranch => 
        new Date(ranch.fecha_creacion) <= new Date(filters.fecha_hasta)
      );
    }

    // Ordenamiento
    if (sortConfig.key) {
      processed.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Manejo especial para campos numéricos
        if (sortConfig.key === 'superficie_hectareas') {
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
    setCurrentPage(1); // Reset página al filtrar
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
   * Manejar selección de items
   * @param {string} itemId - ID del item
   * @param {boolean} checked - Estado de selección
   */
  const handleItemSelection = (itemId, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  /**
   * Seleccionar/deseleccionar todos los items
   * @param {boolean} checked - Estado de selección
   */
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(currentData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
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
      estado_id: '',
      activo: 'all',
      superficie_min: '',
      superficie_max: '',
      propietario_id: '',
      fecha_desde: '',
      fecha_hasta: ''
    });
    setSearchTerm('');
  };

  /**
   * Verificar permisos de edición
   * @param {Object} ranch - Objeto del rancho
   */
  const canEditRanch = (ranch) => {
    if (hasRole('admin')) return true;
    return user?.id === ranch.propietario_id;
  };

  /**
   * Eliminar rancho
   * @param {string} ranchId - ID del rancho
   */
  const handleDeleteRanch = async (ranchId) => {
    try {
      setActionLoading(true);
      
      const response = await ranchService.deleteRanch(ranchId);
      
      if (response.success) {
        showSuccess('Rancho eliminado', 'El rancho se ha eliminado correctamente');
        
        // Refrescar datos
        if (onRefresh) {
          onRefresh();
        } else {
          refetchData();
        }
      } else {
        throw new Error(response.message || 'Error al eliminar rancho');
      }
    } catch (error) {
      console.error('Error al eliminar rancho:', error);
      showError(
        'Error al eliminar',
        error.response?.data?.message || error.message
      );
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Cambiar estado activo de un rancho
   * @param {string} ranchId - ID del rancho
   * @param {boolean} activo - Nuevo estado activo
   */
  const handleToggleActive = async (ranchId, activo) => {
    try {
      setActionLoading(true);
      
      const response = await ranchService.updateRanch(ranchId, { activo });
      
      if (response.success) {
        showSuccess(
          'Estado actualizado',
          `Rancho ${activo ? 'activado' : 'desactivado'} correctamente`
        );
        
        // Refrescar datos
        if (onRefresh) {
          onRefresh();
        } else {
          refetchData();
        }
      } else {
        throw new Error(response.message || 'Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      showError(
        'Error al actualizar',
        error.response?.data?.message || error.message
      );
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Exportar datos de la tabla
   */
  const handleExport = async () => {
    try {
      setActionLoading(true);
      
      const response = await ranchService.exportRanches({
        search: searchTerm,
        ...filters
      });
      
      if (response.success) {
        // Crear enlace de descarga
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ranchos_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        showSuccess('Exportación exitosa', 'Los datos se han exportado correctamente');
      } else {
        throw new Error(response.message || 'Error al exportar datos');
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
   * Acciones en lote para items seleccionados
   */
  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) {
      showError('Sin selección', 'No hay items seleccionados');
      return;
    }

    try {
      setActionLoading(true);
      
      switch (action) {
        case 'activate':
          await Promise.all(
            selectedItems.map(id => ranchService.updateRanch(id, { activo: true }))
          );
          showSuccess('Ranchos activados', `${selectedItems.length} ranchos activados`);
          break;
          
        case 'deactivate':
          await Promise.all(
            selectedItems.map(id => ranchService.updateRanch(id, { activo: false }))
          );
          showSuccess('Ranchos desactivados', `${selectedItems.length} ranchos desactivados`);
          break;
          
        case 'delete':
          if (window.confirm(`¿Eliminar ${selectedItems.length} ranchos seleccionados?`)) {
            await Promise.all(
              selectedItems.map(id => ranchService.deleteRanch(id))
            );
            showSuccess('Ranchos eliminados', `${selectedItems.length} ranchos eliminados`);
          }
          break;
      }
      
      setSelectedItems([]);
      
      // Refrescar datos
      if (onRefresh) {
        onRefresh();
      } else {
        refetchData();
      }
    } catch (error) {
      console.error('Error en acción en lote:', error);
      showError('Error', 'No se pudo completar la acción en lote');
    } finally {
      setActionLoading(false);
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
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>
                {filteredData.length} de {tableData.length} ranchos
                {selectedItems.length > 0 && ` • ${selectedItems.length} seleccionados`}
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
                      placeholder="Buscar ranchos..."
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
                  {Object.values(filters).some(v => v && v !== 'all') && (
                    <Badge variant="secondary">
                      {Object.values(filters).filter(v => v && v !== 'all').length}
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
                    {/* Estado */}
                    <div>
                      <Label className="text-xs">Estado</Label>
                      <Select 
                        value={filters.estado_id} 
                        onValueChange={(value) => handleFilterChange('estado_id', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos los estados</SelectItem>
                          {estados?.map((estado) => (
                            <SelectItem key={estado.id_estado} value={estado.id_estado.toString()}>
                              {estado.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Estado activo */}
                    <div>
                      <Label className="text-xs">Estatus</Label>
                      <Select 
                        value={filters.activo} 
                        onValueChange={(value) => handleFilterChange('activo', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="true">Activos</SelectItem>
                          <SelectItem value="false">Inactivos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Superficie mínima */}
                    <div>
                      <Label className="text-xs">Superficie mín (ha)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.superficie_min}
                        onChange={(e) => handleFilterChange('superficie_min', e.target.value)}
                        className="h-8"
                      />
                    </div>

                    {/* Superficie máxima */}
                    <div>
                      <Label className="text-xs">Superficie máx (ha)</Label>
                      <Input
                        type="number"
                        placeholder="1000"
                        value={filters.superficie_max}
                        onChange={(e) => handleFilterChange('superficie_max', e.target.value)}
                        className="h-8"
                      />
                    </div>

                    {/* Propietario (solo admin) */}
                    {hasRole('admin') && (
                      <div>
                        <Label className="text-xs">Propietario</Label>
                        <Select 
                          value={filters.propietario_id} 
                          onValueChange={(value) => handleFilterChange('propietario_id', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Todos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Todos los propietarios</SelectItem>
                            {usuarios?.data?.map((usuario) => (
                              <SelectItem key={usuario.id} value={usuario.id}>
                                {usuario.nombre} {usuario.apellido}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Fecha desde */}
                    <div>
                      <Label className="text-xs">Fecha desde</Label>
                      <Input
                        type="date"
                        value={filters.fecha_desde}
                        onChange={(e) => handleFilterChange('fecha_desde', e.target.value)}
                        className="h-8"
                      />
                    </div>

                    {/* Fecha hasta */}
                    <div>
                      <Label className="text-xs">Fecha hasta</Label>
                      <Input
                        type="date"
                        value={filters.fecha_hasta}
                        onChange={(e) => handleFilterChange('fecha_hasta', e.target.value)}
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

          {/* Acciones en lote */}
          {selectable && selectedItems.length > 0 && (
            <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20">
              <span className="text-sm font-medium">
                {selectedItems.length} elementos seleccionados
              </span>
              <div className="flex gap-2 ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('activate')}
                  disabled={actionLoading}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('deactivate')}
                  disabled={actionLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Desactivar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction('delete')}
                  disabled={actionLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          )}

          {/* Tabla */}
          <div className="overflow-x-auto">
            {tableLoading ? (
              <div className="p-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {selectable && <TableHead className="w-12" />}
                      {Object.entries(visibleColumns).map(([key, visible]) => 
                        visible && <TableHead key={key}><Skeleton className="h-4 w-20" /></TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        {selectable && <TableCell><Skeleton className="h-4 w-4" /></TableCell>}
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
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm || Object.values(filters).some(v => v && v !== 'all') 
                    ? 'No se encontraron ranchos con los criterios de búsqueda.'
                    : 'No hay ranchos registrados.'
                  }
                </p>
                {!searchTerm && !Object.values(filters).some(v => v && v !== 'all') && (
                  <Button onClick={() => navigate('/ranchos/nuevo')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar primer rancho
                  </Button>
                )}
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
                      {selectable && (
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedItems.length === currentData.length && currentData.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                      )}
                      
                      {visibleColumns.imagen && (
                        <TableHead className="w-16"></TableHead>
                      )}
                      
                      {visibleColumns.nombre && (
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handleSort('nombre')}
                        >
                          <div className="flex items-center gap-2">
                            Nombre
                            {getSortIcon('nombre')}
                          </div>
                        </TableHead>
                      )}
                      
                      {visibleColumns.propietario && (
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handleSort('propietario_nombre')}
                        >
                          <div className="flex items-center gap-2">
                            Propietario
                            {getSortIcon('propietario_nombre')}
                          </div>
                        </TableHead>
                      )}
                      
                      {visibleColumns.estado && (
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handleSort('estado_nombre')}
                        >
                          <div className="flex items-center gap-2">
                            Estado
                            {getSortIcon('estado_nombre')}
                          </div>
                        </TableHead>
                      )}
                      
                      {visibleColumns.superficie && (
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handleSort('superficie_hectareas')}
                        >
                          <div className="flex items-center gap-2">
                            Superficie
                            {getSortIcon('superficie_hectareas')}
                          </div>
                        </TableHead>
                      )}
                      
                      {visibleColumns.contacto && (
                        <TableHead>Contacto</TableHead>
                      )}
                      
                      {visibleColumns.ubicacion && (
                        <TableHead>Ubicación</TableHead>
                      )}
                      
                      {visibleColumns.fecha_creacion && (
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handleSort('fecha_creacion')}
                        >
                          <div className="flex items-center gap-2">
                            Fecha Creación
                            {getSortIcon('fecha_creacion')}
                          </div>
                        </TableHead>
                      )}
                      
                      {visibleColumns.estatus && (
                        <TableHead>Estado</TableHead>
                      )}
                      
                      {visibleColumns.acciones && (
                        <TableHead className="w-20">Acciones</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody>
                    <AnimatePresence>
                      {currentData.map((ranch) => (
                        <motion.tr
                          key={ranch.id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          layout
                          className="group"
                        >
                          {selectable && (
                            <TableCell>
                              <Checkbox
                                checked={selectedItems.includes(ranch.id)}
                                onCheckedChange={(checked) => handleItemSelection(ranch.id, checked)}
                              />
                            </TableCell>
                          )}
                          
                          {visibleColumns.imagen && (
                            <TableCell>
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={ranch.imagen_principal} />
                                <AvatarFallback>
                                  {ranch.nombre?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </TableCell>
                          )}
                          
                          {visibleColumns.nombre && (
                            <TableCell>
                              <div>
                                <div className="font-medium">{ranch.nombre}</div>
                                {ranch.descripcion && !compact && (
                                  <div className="text-sm text-gray-500 line-clamp-1">
                                    {ranch.descripcion}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          )}
                          
                          {visibleColumns.propietario && (
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <span>{ranch.propietario_nombre}</span>
                              </div>
                            </TableCell>
                          )}
                          
                          {visibleColumns.estado && (
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span>{ranch.estado_nombre}</span>
                              </div>
                            </TableCell>
                          )}
                          
                          {visibleColumns.superficie && (
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Hectare className="h-4 w-4 text-gray-400" />
                                <span>{formatNumber(ranch.superficie_hectareas)} ha</span>
                              </div>
                            </TableCell>
                          )}
                          
                          {visibleColumns.contacto && (
                            <TableCell>
                              <div className="space-y-1">
                                {ranch.telefono && (
                                  <div className="flex items-center gap-1 text-sm">
                                    <Phone className="h-3 w-3 text-gray-400" />
                                    <span>{ranch.telefono}</span>
                                  </div>
                                )}
                                {ranch.email && (
                                  <div className="flex items-center gap-1 text-sm">
                                    <Mail className="h-3 w-3 text-gray-400" />
                                    <span className="line-clamp-1">{ranch.email}</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          )}
                          
                          {visibleColumns.ubicacion && (
                            <TableCell>
                              {ranch.ubicacion_latitud && ranch.ubicacion_longitud ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-auto p-1"
                                      onClick={() => {
                                        const url = `https://www.google.com/maps?q=${ranch.ubicacion_latitud},${ranch.ubicacion_longitud}`;
                                        window.open(url, '_blank');
                                      }}
                                    >
                                      <MapPin className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Ver en mapa</p>
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <span className="text-gray-400 text-sm">Sin ubicación</span>
                              )}
                            </TableCell>
                          )}
                          
                          {visibleColumns.fecha_creacion && (
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{formatDate(ranch.fecha_creacion)}</span>
                              </div>
                            </TableCell>
                          )}
                          
                          {visibleColumns.estatus && (
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant={ranch.activo ? "default" : "secondary"}>
                                  {ranch.activo ? 'Activo' : 'Inactivo'}
                                </Badge>
                                {canEditRanch(ranch) && (
                                  <Switch
                                    checked={ranch.activo}
                                    onCheckedChange={(checked) => handleToggleActive(ranch.id, checked)}
                                    disabled={actionLoading}
                                    size="sm"
                                  />
                                )}
                              </div>
                            </TableCell>
                          )}
                          
                          {visibleColumns.acciones && (
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => navigate(`/ranchos/${ranch.id}`)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalles
                                  </DropdownMenuItem>
                                  {canEditRanch(ranch) && (
                                    <DropdownMenuItem onClick={() => navigate(`/ranchos/${ranch.id}/editar`)}>
                                      <Edit3 className="mr-2 h-4 w-4" />
                                      Editar
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  {canEditRanch(ranch) && (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem 
                                          className="text-red-600 dark:text-red-400"
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Eliminar
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>¿Eliminar rancho?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Esta acción no se puede deshacer. Se eliminará permanentemente
                                            el rancho "{ranch.nombre}" y todos sus datos asociados.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction 
                                            className="bg-red-600 hover:bg-red-700"
                                            onClick={() => handleDeleteRanch(ranch.id)}
                                          >
                                            Eliminar
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          )}
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
    </TooltipProvider>
  );
};

export default RanchTable;