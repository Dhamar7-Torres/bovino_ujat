import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Plus, 
  Filter, 
  Search, 
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Eye,
  Edit3,
  Trash2,
  Download,
  Bell,
  Users,
  Stethoscope,
  Activity,
  TrendingUp,
  MapPin,
  FileText,
  ChevronRight,
  CalendarDays,
  Timer,
  AlertCircle,
  Star,
  MoreHorizontal
} from 'lucide-react';

// Componentes de shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

// Hooks personalizados
import { useCalendar } from '../../hooks/useCalendar';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { useFetch } from '../../hooks/useFetch';

// Servicios
import { eventService } from '../../services/eventService';

// Utilidades
import { formatDate, formatTime, formatDateRelative } from '../../utils/formatters';

/**
 * Dashboard principal de eventos veterinarios y de manejo
 * Incluye calendario, estadísticas, alertas y gestión completa de eventos
 */
const EventDashboard = () => {
  const navigate = useNavigate();
  
  // Estados principales
  const [activeView, setActiveView] = useState('overview'); // 'overview', 'calendar', 'alerts'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados de filtros
  const [filters, setFilters] = useState({
    tipo: '', // 'vacunacion', 'chequeo', 'medicacion', 'reproduccion'
    estado: '', // 'pendiente', 'completado', 'vencido'
    prioridad: '', // 'alta', 'media', 'baja'
    rancho_id: '',
    bovino_id: '',
    veterinario_id: '',
    fecha_inicio: '',
    fecha_fin: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Hooks personalizados
  const { user, hasRole } = useAuth();
  const { showSuccess, showError, showWarning } = useNotifications();
  const {
    events,
    loading: loadingCalendar,
    getPendingEvents,
    getOverdueEvents,
    getUpcomingEvents,
    completeEvent,
    deleteEvent,
    refreshEvents
  } = useCalendar();

  // Cargar estadísticas de eventos
  const { 
    data: eventStats, 
    loading: loadingStats,
    execute: loadStats 
  } = useFetch('/api/eventos/estadisticas', {
    immediate: true
  });

  // Cargar ranchos para filtros
  const { data: ranchos } = useFetch('/api/ranchos', {
    immediate: true,
    cacheKey: 'ranchos-list'
  });

  // Cargar bovinos para filtros
  const { data: bovinos } = useFetch('/api/bovinos', {
    immediate: true,
    cacheKey: 'bovinos-list'
  });

  // Cargar veterinarios para filtros
  const { data: veterinarios } = useFetch('/api/usuarios?rol=veterinario', {
    immediate: true,
    cacheKey: 'veterinarios-list'
  });

  // Eventos filtrados
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(term) ||
        event.description?.toLowerCase().includes(term) ||
        event.bovineName?.toLowerCase().includes(term)
      );
    }

    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        switch (key) {
          case 'tipo':
            filtered = filtered.filter(event => event.type === value);
            break;
          case 'estado':
            filtered = filtered.filter(event => event.status === value);
            break;
          case 'prioridad':
            filtered = filtered.filter(event => event.priority === value);
            break;
          case 'rancho_id':
            filtered = filtered.filter(event => event.ranchId === value);
            break;
          case 'bovino_id':
            filtered = filtered.filter(event => event.bovineId === value);
            break;
          case 'veterinario_id':
            filtered = filtered.filter(event => event.veterinarian?.id === value);
            break;
          case 'fecha_inicio':
            filtered = filtered.filter(event => 
              new Date(event.start) >= new Date(value)
            );
            break;
          case 'fecha_fin':
            filtered = filtered.filter(event => 
              new Date(event.start) <= new Date(value)
            );
            break;
        }
      }
    });

    return filtered;
  }, [events, searchTerm, filters]);

  // Estadísticas calculadas
  const pendingEvents = getPendingEvents();
  const overdueEvents = getOverdueEvents();
  const upcomingEvents = getUpcomingEvents(7); // Próximos 7 días
  const completedToday = events.filter(event => 
    event.status === 'completed' && 
    new Date(event.completedAt).toDateString() === new Date().toDateString()
  );

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
      tipo: '',
      estado: '',
      prioridad: '',
      rancho_id: '',
      bovino_id: '',
      veterinario_id: '',
      fecha_inicio: '',
      fecha_fin: ''
    });
    setSearchTerm('');
  };

  /**
   * Completar evento
   * @param {string} eventId - ID del evento
   */
  const handleCompleteEvent = async (eventId) => {
    try {
      setLoading(true);
      
      const result = await completeEvent(eventId, {
        observaciones: 'Evento completado desde dashboard'
      });
      
      if (result.success) {
        showSuccess('Evento completado', 'El evento se ha marcado como completado');
        loadStats(); // Actualizar estadísticas
      }
    } catch (error) {
      showError('Error', 'No se pudo completar el evento');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar evento
   * @param {string} eventId - ID del evento
   */
  const handleDeleteEvent = async (eventId) => {
    try {
      setLoading(true);
      
      const result = await deleteEvent(eventId);
      
      if (result.success) {
        showSuccess('Evento eliminado', 'El evento se ha eliminado correctamente');
        loadStats(); // Actualizar estadísticas
      }
    } catch (error) {
      showError('Error', 'No se pudo eliminar el evento');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Exportar eventos
   */
  const handleExportEvents = async () => {
    try {
      setLoading(true);
      
      const response = await eventService.exportEvents({
        ...filters,
        search: searchTerm
      });
      
      if (response.success) {
        // Crear enlace de descarga
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `eventos_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        showSuccess('Exportación exitosa', 'Los eventos se han exportado correctamente');
      }
    } catch (error) {
      showError('Error al exportar', 'No se pudo exportar los eventos');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener icono del tipo de evento
   * @param {string} type - Tipo de evento
   */
  const getEventIcon = (type) => {
    switch (type) {
      case 'vaccination':
        return <Stethoscope className="h-4 w-4" />;
      case 'checkup':
        return <Activity className="h-4 w-4" />;
      case 'medication':
        return <FileText className="h-4 w-4" />;
      case 'reproduction':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  /**
   * Obtener color del estado del evento
   * @param {string} status - Estado del evento
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'overdue':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  /**
   * Obtener texto del estado del evento
   * @param {string} status - Estado del evento
   */
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'overdue':
        return 'Vencido';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

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

  return (
    <motion.div
      className="container mx-auto px-4 py-6 max-w-7xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard de Eventos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gestión y seguimiento de eventos veterinarios y de manejo
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {Object.values(filters).some(v => v) && (
                <Badge variant="secondary" className="ml-1">
                  {Object.values(filters).filter(v => v).length}
                </Badge>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleExportEvents}
              disabled={loading}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            
            <Button
              variant="outline"
              onClick={refreshEvents}
              disabled={loadingCalendar}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingCalendar ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            
            <Button onClick={() => navigate('/eventos/nuevo')}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Evento
            </Button>
          </div>
        </div>
      </motion.div>

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
                <CardTitle className="flex items-center justify-between">
                  <span>Filtros de búsqueda</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Búsqueda */}
                  <div>
                    <Label htmlFor="search">Buscar</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Buscar eventos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Tipo de evento */}
                  <div>
                    <Label>Tipo de evento</Label>
                    <Select 
                      value={filters.tipo} 
                      onValueChange={(value) => handleFilterChange('tipo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos los tipos</SelectItem>
                        <SelectItem value="vaccination">Vacunación</SelectItem>
                        <SelectItem value="checkup">Chequeo</SelectItem>
                        <SelectItem value="medication">Medicación</SelectItem>
                        <SelectItem value="reproduction">Reproducción</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Estado */}
                  <div>
                    <Label>Estado</Label>
                    <Select 
                      value={filters.estado} 
                      onValueChange={(value) => handleFilterChange('estado', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos los estados</SelectItem>
                        <SelectItem value="pending">Pendientes</SelectItem>
                        <SelectItem value="completed">Completados</SelectItem>
                        <SelectItem value="overdue">Vencidos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Prioridad */}
                  <div>
                    <Label>Prioridad</Label>
                    <Select 
                      value={filters.prioridad} 
                      onValueChange={(value) => handleFilterChange('prioridad', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas las prioridades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas las prioridades</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="low">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rancho */}
                  <div>
                    <Label>Rancho</Label>
                    <Select 
                      value={filters.rancho_id} 
                      onValueChange={(value) => handleFilterChange('rancho_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los ranchos" />
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

                  {/* Veterinario */}
                  <div>
                    <Label>Veterinario</Label>
                    <Select 
                      value={filters.veterinario_id} 
                      onValueChange={(value) => handleFilterChange('veterinario_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los veterinarios" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos los veterinarios</SelectItem>
                        {veterinarios?.data?.map((vet) => (
                          <SelectItem key={vet.id} value={vet.id}>
                            {vet.nombre} {vet.apellido}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fecha inicio */}
                  <div>
                    <Label htmlFor="fecha_inicio">Fecha inicio</Label>
                    <Input
                      id="fecha_inicio"
                      type="date"
                      value={filters.fecha_inicio}
                      onChange={(e) => handleFilterChange('fecha_inicio', e.target.value)}
                    />
                  </div>

                  {/* Fecha fin */}
                  <div>
                    <Label htmlFor="fecha_fin">Fecha fin</Label>
                    <Input
                      id="fecha_fin"
                      type="date"
                      value={filters.fecha_fin}
                      onChange={(e) => handleFilterChange('fecha_fin', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estadísticas principales */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Eventos Pendientes
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {loadingStats ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    pendingEvents.length
                  )}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Eventos Vencidos
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {loadingStats ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    overdueEvents.length
                  )}
                </p>
              </div>
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Próximos 7 días
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {loadingStats ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    upcomingEvents.length
                  )}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Bell className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completados Hoy
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {loadingStats ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    completedToday.length
                  )}
                </p>
              </div>
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alertas críticas */}
      {overdueEvents.length > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertTriangle className="h-5 w-5" />
                Eventos Vencidos - Requieren Atención Inmediata ({overdueEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {overdueEvents.slice(0, 3).map((event) => (
                  <div 
                    key={event.id}
                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-red-600">
                        {getEventIcon(event.type)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {event.bovineName} • Vencido {formatDateRelative(event.start)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCompleteEvent(event.id)}
                        disabled={loading}
                      >
                        Completar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/eventos/${event.id}/editar`)}
                      >
                        Reprogramar
                      </Button>
                    </div>
                  </div>
                ))}
                {overdueEvents.length > 3 && (
                  <div className="text-center pt-2">
                    <Button 
                      variant="link" 
                      size="sm"
                      onClick={() => {
                        handleFilterChange('estado', 'overdue');
                        setActiveView('list');
                      }}
                    >
                      Ver todos los eventos vencidos ({overdueEvents.length - 3} más)
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Contenido principal con tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendario
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Lista Detallada
            </TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Eventos próximos */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Próximos Eventos</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveView('calendar')}
                      >
                        <CalendarDays className="h-4 w-4 mr-2" />
                        Ver calendario
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingCalendar ? (
                      <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-3/4 mb-1" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : upcomingEvents.length > 0 ? (
                      <ScrollArea className="h-80">
                        <div className="space-y-3">
                          {upcomingEvents.map((event) => (
                            <div 
                              key={event.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  event.priority === 'high' ? 'bg-red-100 text-red-600' :
                                  event.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                  'bg-blue-100 text-blue-600'
                                }`}>
                                  {getEventIcon(event.type)}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{event.title}</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {event.bovineName} • {formatDate(event.start)} {formatTime(event.start)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={getStatusColor(event.status)}
                                >
                                  {getStatusText(event.status)}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => navigate(`/eventos/${event.id}`)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Ver detalles
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate(`/eventos/${event.id}/editar`)}>
                                      <Edit3 className="mr-2 h-4 w-4" />
                                      Editar
                                    </DropdownMenuItem>
                                    {event.status === 'pending' && (
                                      <DropdownMenuItem onClick={() => handleCompleteEvent(event.id)}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Marcar completado
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
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
                                          <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Esta acción no se puede deshacer. Se eliminará permanentemente
                                            el evento "{event.title}".
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction 
                                            className="bg-red-600 hover:bg-red-700"
                                            onClick={() => handleDeleteEvent(event.id)}
                                          >
                                            Eliminar
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                          No hay eventos próximos
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          No tienes eventos programados para los próximos 7 días.
                        </p>
                        <Button onClick={() => navigate('/eventos/nuevo')}>
                          <Plus className="h-4 w-4 mr-2" />
                          Programar evento
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Panel lateral */}
              <div className="space-y-6">
                {/* Resumen rápido */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen Rápido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total eventos</span>
                      <span className="font-medium">{events.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pendientes</span>
                      <Badge variant="outline" className="text-orange-600">
                        {pendingEvents.length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Vencidos</span>
                      <Badge variant="outline" className="text-red-600">
                        {overdueEvents.length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completados hoy</span>
                      <Badge variant="outline" className="text-green-600">
                        {completedToday.length}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Progreso mensual */}
                {eventStats && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Progreso del Mes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Eventos completados</span>
                          <span className="text-sm font-medium">
                            {eventStats.completados_mes}/{eventStats.total_mes}
                          </span>
                        </div>
                        <Progress 
                          value={(eventStats.completados_mes / eventStats.total_mes) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Vacunaciones</span>
                          <span className="text-sm font-medium">
                            {eventStats.vacunaciones_mes}
                          </span>
                        </div>
                        <Progress 
                          value={(eventStats.vacunaciones_mes / eventStats.total_mes) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Chequeos</span>
                          <span className="text-sm font-medium">
                            {eventStats.chequeos_mes}
                          </span>
                        </div>
                        <Progress 
                          value={(eventStats.chequeos_mes / eventStats.total_mes) * 100} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Tab: Calendario */}
          <TabsContent value="calendar">
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Vista de Calendario
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Aquí se mostraría el componente de calendario interactivo.
                </p>
                <Button variant="outline">Próximamente</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Lista detallada */}
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>
                  Todos los Eventos ({filteredEvents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredEvents.length > 0 ? (
                  <div className="space-y-2">
                    {filteredEvents.map((event) => (
                      <div 
                        key={event.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            event.priority === 'high' ? 'bg-red-100 text-red-600' :
                            event.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {getEventIcon(event.type)}
                          </div>
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {event.bovineName} • {formatDate(event.start)} {formatTime(event.start)}
                            </p>
                            {event.description && (
                              <p className="text-xs text-gray-500 mt-1">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(event.status)}
                          >
                            {getStatusText(event.status)}
                          </Badge>
                          {event.priority === 'high' && (
                            <Star className="h-4 w-4 text-red-500" />
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => navigate(`/eventos/${event.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/eventos/${event.id}/editar`)}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              {event.status === 'pending' && (
                                <DropdownMenuItem onClick={() => handleCompleteEvent(event.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Marcar completado
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
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
                                    <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. Se eliminará permanentemente
                                      el evento "{event.title}".
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={() => handleDeleteEvent(event.id)}
                                    >
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No hay eventos
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {Object.values(filters).some(v => v) || searchTerm
                        ? 'No se encontraron eventos con los criterios de búsqueda.'
                        : 'No hay eventos registrados en el sistema.'
                      }
                    </p>
                    {!Object.values(filters).some(v => v) && !searchTerm && (
                      <Button onClick={() => navigate('/eventos/nuevo')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Crear primer evento
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default EventDashboard;