import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Edit3, 
  Eye, 
  Trash2, 
  Download,
  RefreshCw,
  Grid3X3,
  List,
  MoreHorizontal,
  Phone,
  Mail,
  User,
  Calendar,
  Hectare
} from 'lucide-react';

// Componentes de shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
 * Componente para listar ranchos
 * Incluye filtros, búsqueda, diferentes vistas y acciones CRUD
 */
const RanchList = () => {
  const navigate = useNavigate();
  
  // Estados principales
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    estado_id: '',
    activo: 'all', // 'all', 'true', 'false'
    propietario_id: ''
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'table'
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [selectedRanches, setSelectedRanches] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Hooks personalizados
  const { user, hasRole } = useAuth();
  const { showSuccess, showError, showWarning } = useNotifications();
  const { getItem, setItem } = useLocalStorage();

  // Cargar preferencias guardadas
  useEffect(() => {
    const savedViewMode = getItem('ranchListViewMode', 'grid');
    const savedItemsPerPage = getItem('ranchListItemsPerPage', 12);
    const savedFilters = getItem('ranchListFilters', {});
    
    setViewMode(savedViewMode);
    setItemsPerPage(savedItemsPerPage);
    setFilters(prev => ({ ...prev, ...savedFilters }));
  }, [getItem]);

  // Guardar preferencias cuando cambien
  useEffect(() => {
    setItem('ranchListViewMode', viewMode);
  }, [viewMode, setItem]);

  useEffect(() => {
    setItem('ranchListItemsPerPage', itemsPerPage);
  }, [itemsPerPage, setItem]);

  useEffect(() => {
    setItem('ranchListFilters', filters);
  }, [filters, setItem]);

  // Construir parámetros de consulta
  const queryParams = useMemo(() => {
    const params = {
      page,
      limit: itemsPerPage,
      sortBy,
      sortOrder,
      search: searchTerm.trim()
    };

    // Agregar filtros activos
    if (filters.estado_id) params.estado_id = filters.estado_id;
    if (filters.activo !== 'all') params.activo = filters.activo;
    if (filters.propietario_id) params.propietario_id = filters.propietario_id;

    // Si no es admin, filtrar solo ranchos del usuario
    if (!hasRole('admin')) {
      params.propietario_id = user?.id;
    }

    return params;
  }, [page, itemsPerPage, sortBy, sortOrder, searchTerm, filters, hasRole, user]);

  // Cargar ranchos
  const { 
    data: ranchesData, 
    loading: loadingRanches, 
    error: ranchesError,
    execute: loadRanches 
  } = useFetch('/api/ranchos', {
    immediate: true,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: queryParams
  });

  // Cargar estados para filtros
  const { data: estados } = useFetch('/api/estados', {
    immediate: true,
    cacheKey: 'estados-list'
  });

  // Cargar usuarios para filtros (solo admin)
  const { data: usuarios } = useFetch('/api/usuarios', {
    immediate: hasRole('admin'),
    cacheKey: 'usuarios-propietarios'
  });

  // Re-cargar cuando cambien los parámetros
  useEffect(() => {
    loadRanches();
  }, [queryParams, loadRanches]);

  /**
   * Manejar búsqueda
   * @param {string} value - Término de búsqueda
   */
  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(1); // Resetear a primera página
  };

  /**
   * Manejar cambio de filtros
   * @param {string} filterKey - Clave del filtro
   * @param {string} value - Valor del filtro
   */
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setPage(1); // Resetear a primera página
  };

  /**
   * Limpiar todos los filtros
   */
  const clearFilters = () => {
    setFilters({
      estado_id: '',
      activo: 'all',
      propietario_id: ''
    });
    setSearchTerm('');
    setPage(1);
  };

  /**
   * Manejar ordenamiento
   * @param {string} field - Campo por el cual ordenar
   */
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  /**
   * Eliminar rancho
   * @param {string} ranchId - ID del rancho a eliminar
   */
  const handleDeleteRanch = async (ranchId) => {
    try {
      setLoading(true);
      
      const response = await ranchService.deleteRanch(ranchId);
      
      if (response.success) {
        showSuccess(
          'Rancho eliminado',
          'El rancho se ha eliminado correctamente'
        );
        
        // Recargar lista
        await loadRanches();
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
      setLoading(false);
    }
  };

  /**
   * Cambiar estado activo de un rancho
   * @param {string} ranchId - ID del rancho
   * @param {boolean} activo - Nuevo estado activo
   */
  const handleToggleActive = async (ranchId, activo) => {
    try {
      const response = await ranchService.updateRanch(ranchId, { activo });
      
      if (response.success) {
        showSuccess(
          'Estado actualizado',
          `Rancho ${activo ? 'activado' : 'desactivado'} correctamente`
        );
        
        // Recargar lista
        await loadRanches();
      } else {
        throw new Error(response.message || 'Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      showError(
        'Error al actualizar',
        error.response?.data?.message || error.message
      );
    }
  };

  /**
   * Exportar datos de ranchos
   */
  const handleExport = async () => {
    try {
      setLoading(true);
      
      const response = await ranchService.exportRanches(queryParams);
      
      if (response.success) {
        // Crear enlace de descarga
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ranchos_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        showSuccess(
          'Exportación exitosa',
          'Los datos se han exportado correctamente'
        );
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
      setLoading(false);
    }
  };

  /**
   * Verificar si el usuario puede editar un rancho
   * @param {Object} ranch - Objeto del rancho
   */
  const canEditRanch = (ranch) => {
    if (hasRole('admin')) return true;
    return user?.id === ranch.propietario_id;
  };

  /**
   * Verificar si el usuario puede eliminar un rancho
   * @param {Object} ranch - Objeto del rancho
   */
  const canDeleteRanch = (ranch) => {
    if (hasRole('admin')) return true;
    return user?.id === ranch.propietario_id;
  };

  // Datos de los ranchos
  const ranches = ranchesData?.data || [];
  const totalItems = ranchesData?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Configuración de animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  /**
   * Renderizar tarjeta de rancho (vista grid)
   */
  const RanchCard = ({ ranch }) => (
    <motion.div
      variants={itemVariants}
      layout
      className="group"
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-1">
                {ranch.nombre}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {ranch.estado_nombre}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={ranch.activo ? "default" : "secondary"}>
                {ranch.activo ? 'Activo' : 'Inactivo'}
              </Badge>
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
                  {canDeleteRanch(ranch) && (
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
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Imagen del rancho */}
          <div className="aspect-video mb-4 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
            {ranch.imagen_principal ? (
              <img
                src={ranch.imagen_principal}
                alt={ranch.nombre}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <MapPin className="h-8 w-8" />
              </div>
            )}
          </div>

          {/* Información del rancho */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Superficie:</span>
              <span className="font-medium">
                {formatNumber(ranch.superficie_hectareas)} ha
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Propietario:</span>
              <span className="font-medium line-clamp-1">
                {ranch.propietario_nombre}
              </span>
            </div>

            {ranch.telefono && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="h-3 w-3" />
                <span>{ranch.telefono}</span>
              </div>
            )}

            {ranch.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="h-3 w-3" />
                <span className="line-clamp-1">{ranch.email}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>Creado: {formatDate(ranch.fecha_creacion)}</span>
            </div>

            {/* Toggle activo/inactivo para propietarios */}
            {canEditRanch(ranch) && (
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm">Estado:</span>
                <Switch
                  checked={ranch.activo}
                  onCheckedChange={(checked) => handleToggleActive(ranch.id, checked)}
                  disabled={loading}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Ranchos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {totalItems} rancho{totalItems !== 1 ? 's' : ''} registrado{totalItems !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={loading}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            
            <Button
              variant="outline"
              onClick={loadRanches}
              disabled={loadingRanches}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingRanches ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            
            <Button onClick={() => navigate('/ranchos/nuevo')}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Rancho
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtros de búsqueda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Búsqueda */}
                  <div>
                    <Label htmlFor="search">Buscar</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Nombre del rancho..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Estado */}
                  <div>
                    <Label>Estado</Label>
                    <Select 
                      value={filters.estado_id} 
                      onValueChange={(value) => handleFilterChange('estado_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los estados" />
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
                    <Label>Estado</Label>
                    <Select 
                      value={filters.activo} 
                      onValueChange={(value) => handleFilterChange('activo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="true">Activos</SelectItem>
                        <SelectItem value="false">Inactivos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Propietario (solo admin) */}
                  {hasRole('admin') && (
                    <div>
                      <Label>Propietario</Label>
                      <Select 
                        value={filters.propietario_id} 
                        onValueChange={(value) => handleFilterChange('propietario_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos los propietarios" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos los propietarios</SelectItem>
                          {usuarios?.map((usuario) => (
                            <SelectItem key={usuario.id} value={usuario.id}>
                              {usuario.nombre} {usuario.apellido}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controles de vista */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label>Vista:</Label>
            <div className="flex rounded-md border">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label>Mostrar:</Label>
            <Select 
              value={itemsPerPage.toString()} 
              onValueChange={(value) => setItemsPerPage(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label>Ordenar:</Label>
          <Select 
            value={`${sortBy}-${sortOrder}`} 
            onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nombre-asc">Nombre A-Z</SelectItem>
              <SelectItem value="nombre-desc">Nombre Z-A</SelectItem>
              <SelectItem value="superficie_hectareas-desc">Superficie (mayor)</SelectItem>
              <SelectItem value="superficie_hectareas-asc">Superficie (menor)</SelectItem>
              <SelectItem value="fecha_creacion-desc">Más recientes</SelectItem>
              <SelectItem value="fecha_creacion-asc">Más antiguos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista/Grid de ranchos */}
      {loadingRanches ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="aspect-video w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : ranchesError ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-red-600 dark:text-red-400">
              Error al cargar ranchos: {ranchesError}
            </p>
            <Button onClick={loadRanches} className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : ranches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No hay ranchos registrados
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || Object.values(filters).some(f => f && f !== 'all') 
                ? 'No se encontraron ranchos con los criterios de búsqueda.'
                : 'Comienza agregando tu primer rancho al sistema.'
              }
            </p>
            {!searchTerm && !Object.values(filters).some(f => f && f !== 'all') && (
              <Button onClick={() => navigate('/ranchos/nuevo')}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Rancho
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Vista Grid */}
          {viewMode === 'grid' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {ranches.map((ranch) => (
                <RanchCard key={ranch.id} ranch={ranch} />
              ))}
            </motion.div>
          )}

          {/* Vista Tabla */}
          {viewMode === 'table' && (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleSort('nombre')}
                    >
                      Nombre
                      {sortBy === 'nombre' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleSort('superficie_hectareas')}
                    >
                      Superficie
                      {sortBy === 'superficie_hectareas' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {ranches.map((ranch) => (
                      <motion.tr
                        key={ranch.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        layout
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={ranch.imagen_principal} />
                              <AvatarFallback>
                                {ranch.nombre.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{ranch.nombre}</div>
                              <div className="text-sm text-gray-500">
                                ID: {ranch.id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{ranch.estado_nombre}</TableCell>
                        <TableCell>
                          {formatNumber(ranch.superficie_hectareas)} ha
                        </TableCell>
                        <TableCell>{ranch.propietario_nombre}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {ranch.telefono && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3" />
                                {ranch.telefono}
                              </div>
                            )}
                            {ranch.email && (
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3" />
                                {ranch.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={ranch.activo ? "default" : "secondary"}>
                            {ranch.activo ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem 
                                onClick={() => navigate(`/ranchos/${ranch.id}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              {canEditRanch(ranch) && (
                                <DropdownMenuItem 
                                  onClick={() => navigate(`/ranchos/${ranch.id}/editar`)}
                                >
                                  <Edit3 className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {canDeleteRanch(ranch) && (
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
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando {((page - 1) * itemsPerPage) + 1} a {Math.min(page * itemsPerPage, totalItems)} de {totalItems} ranchos
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <Button
                        key={pageNumber}
                        variant={page === pageNumber ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <>
                      <span className="px-2 py-1 text-sm">...</span>
                      <Button
                        variant={page === totalPages ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RanchList;