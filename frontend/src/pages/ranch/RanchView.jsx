import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  User, 
  Calendar,
  Hectare,
  Eye,
  Share2,
  Download,
  ArrowLeft,
  MoreHorizontal,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Camera,
  Navigation,
  Info,
  Settings,
  BarChart3,
  Map,
  ImageIcon,
  Users,
  Stethoscope,
  Milk,
  DollarSign
} from 'lucide-react';

// Componentes de shadcn/ui
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

// Hooks personalizados
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useNotifications } from '../../hooks/useNotifications';

// Servicios
import { ranchService } from '../../services/ranchService';

// Utilidades
import { formatDate, formatNumber, formatCurrency } from '../../utils/formatters';
import { calculateDistance } from '../../utils/mapUtils';

/**
 * Componente para ver detalles completos de un rancho
 * Incluye información general, estadísticas, galería, mapa y datos de bovinos
 */
const RanchView = () => {
  const { id: ranchId } = useParams();
  const navigate = useNavigate();
  
  // Estados principales
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hooks personalizados
  const { user, hasRole } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const { 
    position: userPosition, 
    calculateDistance: calcDistance 
  } = useGeolocation();

  // Cargar datos del rancho
  const { 
    data: ranch, 
    loading: loadingRanch,
    error: ranchError,
    execute: loadRanch 
  } = useFetch(`/api/ranchos/${ranchId}`, {
    immediate: true
  });

  // Cargar estadísticas del rancho
  const { 
    data: stats, 
    loading: loadingStats 
  } = useFetch(`/api/ranchos/${ranchId}/estadisticas`, {
    immediate: true
  });

  // Cargar bovinos del rancho
  const { 
    data: bovines, 
    loading: loadingBovines 
  } = useFetch(`/api/bovinos?rancho_id=${ranchId}&limit=20`, {
    immediate: true
  });

  // Cargar eventos recientes
  const { 
    data: recentEvents, 
    loading: loadingEvents 
  } = useFetch(`/api/eventos?rancho_id=${ranchId}&limit=10&recientes=true`, {
    immediate: true
  });

  // Cargar alertas activas
  const { 
    data: activeAlerts, 
    loading: loadingAlerts 
  } = useFetch(`/api/alertas?rancho_id=${ranchId}&activas=true`, {
    immediate: true
  });

  /**
   * Verificar permisos de edición
   */
  const canEdit = () => {
    if (hasRole('admin')) return true;
    if (user?.id === ranch?.propietario_id) return true;
    return false;
  };

  /**
   * Verificar permisos de eliminación
   */
  const canDelete = () => {
    if (hasRole('admin')) return true;
    if (user?.id === ranch?.propietario_id) return true;
    return false;
  };

  /**
   * Eliminar rancho
   */
  const handleDeleteRanch = async () => {
    try {
      setLoading(true);
      
      const response = await ranchService.deleteRanch(ranchId);
      
      if (response.success) {
        showSuccess(
          'Rancho eliminado',
          'El rancho se ha eliminado correctamente'
        );
        
        navigate('/ranchos');
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
   * Compartir rancho
   */
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Rancho ${ranch.nombre}`,
          text: `${ranch.descripcion || 'Conoce este rancho'}`,
          url: window.location.href
        });
      } else {
        // Fallback: copiar al portapapeles
        await navigator.clipboard.writeText(window.location.href);
        showSuccess('Enlace copiado', 'El enlace se ha copiado al portapapeles');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  /**
   * Exportar datos del rancho
   */
  const handleExport = async () => {
    try {
      setLoading(true);
      
      const response = await ranchService.exportRanchData(ranchId);
      
      if (response.success) {
        // Crear enlace de descarga
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { 
          type: 'application/json' 
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rancho_${ranch.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
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
      setLoading(false);
    }
  };

  /**
   * Navegar a ubicación en mapa
   */
  const handleViewInMap = () => {
    const lat = parseFloat(ranch.ubicacion_latitud);
    const lng = parseFloat(ranch.ubicacion_longitud);
    
    if (lat && lng) {
      // Abrir en Google Maps
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  // Configuración de animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.1 }
    },
    exit: { opacity: 0, y: -20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Mostrar error si no se puede cargar el rancho
  if (ranchError) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Error al cargar el rancho
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {ranchError}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate('/ranchos')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Ranchos
              </Button>
              <Button onClick={loadRanch}>
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mostrar loading mientras carga
  if (loadingRanch) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          
          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calcular distancia si hay ubicación del usuario
  const distanceToUser = userPosition && ranch ? 
    calcDistance(
      userPosition.latitude,
      userPosition.longitude,
      parseFloat(ranch.ubicacion_latitud),
      parseFloat(ranch.ubicacion_longitud)
    ) / 1000 : null;

  return (
    <TooltipProvider>
      <motion.div
        className="container mx-auto px-4 py-6 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header */}
        <motion.div 
          variants={itemVariants}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/ranchos')}
                className="flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={ranch?.imagen_principal} />
                  <AvatarFallback className="text-lg">
                    {ranch?.nombre?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {ranch?.nombre}
                    </h1>
                    <Badge variant={ranch?.activo ? "default" : "secondary"}>
                      {ranch?.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{ranch?.estado_nombre}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Hectare className="h-4 w-4" />
                        <span>{formatNumber(ranch?.superficie_hectareas)} hectáreas</span>
                      </div>
                      {distanceToUser && (
                        <div className="flex items-center gap-1">
                          <Navigation className="h-4 w-4" />
                          <span>{formatNumber(distanceToUser, 1)} km de distancia</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>Propietario: {ranch?.propietario_nombre}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              
              {canEdit() && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate(`/ranchos/${ranchId}/editar`)}>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Editar rancho
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExport} disabled={loading}>
                      <Download className="mr-2 h-4 w-4" />
                      Exportar datos
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {canDelete() && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem 
                            className="text-red-600 dark:text-red-400"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar rancho
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar rancho?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente
                              el rancho "{ranch?.nombre}" y todos sus datos asociados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 hover:bg-red-700"
                              onClick={handleDeleteRanch}
                              disabled={loading}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </motion.div>

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
                    Total Bovinos
                  </p>
                  <p className="text-2xl font-bold">
                    {loadingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      formatNumber(stats?.total_bovinos || 0)
                    )}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Producción (mes)
                  </p>
                  <p className="text-2xl font-bold">
                    {loadingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      formatNumber(stats?.produccion_mes || 0)
                    )}
                  </p>
                  <p className="text-xs text-gray-500">litros</p>
                </div>
                <div className="flex-shrink-0">
                  <Milk className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Ingresos (mes)
                  </p>
                  <p className="text-2xl font-bold">
                    {loadingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      formatCurrency(stats?.ingresos_mes || 0)
                    )}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Salud General
                  </p>
                  <p className="text-2xl font-bold">
                    {loadingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      `${stats?.salud_porcentaje || 0}%`
                    )}
                  </p>
                  {stats?.salud_porcentaje && (
                    <Progress 
                      value={stats.salud_porcentaje} 
                      className="h-1 mt-2"
                    />
                  )}
                </div>
                <div className="flex-shrink-0">
                  <Stethoscope className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alertas activas */}
        {activeAlerts && activeAlerts.length > 0 && (
          <motion.div variants={itemVariants} className="mb-6">
            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <AlertCircle className="h-5 w-5" />
                  Alertas Activas ({activeAlerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activeAlerts.slice(0, 3).map((alert, index) => (
                    <div 
                      key={alert.id || index}
                      className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.prioridad === 'alta' ? 'bg-red-500' : 
                          alert.prioridad === 'media' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <p className="font-medium text-sm">{alert.titulo}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{alert.mensaje}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {alert.tipo}
                      </Badge>
                    </div>
                  ))}
                  {activeAlerts.length > 3 && (
                    <div className="text-center pt-2">
                      <Button variant="link" size="sm">
                        Ver todas las alertas ({activeAlerts.length - 3} más)
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="bovines" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Bovinos</span>
              </TabsTrigger>
              <TabsTrigger value="health" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                <span className="hidden sm:inline">Salud</span>
              </TabsTrigger>
              <TabsTrigger value="production" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Producción</span>
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Galería</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                <span className="hidden sm:inline">Ubicación</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab: Información General */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Información básica */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Información del Rancho</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {ranch?.descripcion && (
                        <div>
                          <h4 className="font-medium mb-2">Descripción</h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {ranch.descripcion}
                          </p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Superficie</h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {formatNumber(ranch?.superficie_hectareas)} hectáreas
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Estado</h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {ranch?.estado_nombre}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Propietario</h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {ranch?.propietario_nombre}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Fecha de Registro</h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {formatDate(ranch?.fecha_creacion)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Eventos recientes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Eventos Recientes</span>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver todos
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingEvents ? (
                        <div className="space-y-3">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <div className="flex-1">
                                <Skeleton className="h-4 w-3/4 mb-1" />
                                <Skeleton className="h-3 w-1/2" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : recentEvents && recentEvents.length > 0 ? (
                        <div className="space-y-3">
                          {recentEvents.slice(0, 5).map((event, index) => (
                            <div key={event.id || index} className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                event.tipo === 'vacunacion' ? 'bg-green-100 text-green-600' :
                                event.tipo === 'chequeo' ? 'bg-blue-100 text-blue-600' :
                                event.tipo === 'produccion' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {event.tipo === 'vacunacion' ? <Stethoscope className="h-4 w-4" /> :
                                 event.tipo === 'chequeo' ? <Activity className="h-4 w-4" /> :
                                 event.tipo === 'produccion' ? <TrendingUp className="h-4 w-4" /> :
                                 <Clock className="h-4 w-4" />}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{event.titulo}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {event.bovino_nombre} • {formatDate(event.fecha)}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {event.estado}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 dark:text-gray-400">
                            No hay eventos recientes
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Panel lateral */}
                <div className="space-y-6">
                  {/* Información de contacto */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Contacto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {ranch?.telefono && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{ranch.telefono}</span>
                        </div>
                      )}
                      
                      {ranch?.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{ranch.email}</span>
                        </div>
                      )}
                      
                      {ranch?.ubicacion_latitud && ranch?.ubicacion_longitud && (
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto text-sm"
                            onClick={handleViewInMap}
                          >
                            Ver en mapa
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Resumen de salud */}
                  {stats && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Estado de Salud</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Bovinos sanos</span>
                          <span className="font-medium">{stats.bovinos_sanos || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">En tratamiento</span>
                          <span className="font-medium">{stats.bovinos_enfermos || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Vacunas pendientes</span>
                          <span className="font-medium text-orange-600">{stats.vacunas_pendientes || 0}</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Salud general</span>
                            <span className="font-bold text-green-600">{stats.salud_porcentaje || 0}%</span>
                          </div>
                          <Progress value={stats.salud_porcentaje || 0} className="h-2 mt-1" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Tab: Bovinos */}
            <TabsContent value="bovines" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Bovinos del Rancho</CardTitle>
                    <Button onClick={() => navigate(`/bovinos?rancho_id=${ranchId}`)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver todos
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingBovines ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="flex-1">
                                <Skeleton className="h-4 w-3/4 mb-1" />
                                <Skeleton className="h-3 w-1/2" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : bovines && bovines.data && bovines.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bovines.data.slice(0, 9).map((bovine) => (
                        <Card key={bovine.id} className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={bovine.imagen} />
                                <AvatarFallback>
                                  {bovine.numero_identificacion?.substring(0, 2) || 'B'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {bovine.nombre || `Bovino ${bovine.numero_identificacion}`}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  ID: {bovine.numero_identificacion}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {bovine.sexo}
                                  </Badge>
                                  <Badge 
                                    variant={bovine.estado === 'Activo' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {bovine.estado}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No hay bovinos registrados
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Comienza agregando bovinos a este rancho.
                      </p>
                      <Button onClick={() => navigate('/bovinos/nuevo')}>
                        Agregar primer bovino
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Salud */}
            <TabsContent value="health">
              <Card>
                <CardContent className="py-12 text-center">
                  <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Panel de Salud
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Aquí se mostrarán las estadísticas de salud detalladas.
                  </p>
                  <Button variant="outline">Próximamente</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Producción */}
            <TabsContent value="production">
              <Card>
                <CardContent className="py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Análisis de Producción
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Aquí se mostrarán los gráficos y métricas de producción.
                  </p>
                  <Button variant="outline">Próximamente</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Galería */}
            <TabsContent value="gallery">
              <Card>
                <CardHeader>
                  <CardTitle>Galería de Imágenes</CardTitle>
                  <CardDescription>
                    Fotos del rancho y sus instalaciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {ranch?.imagenes && ranch.imagenes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {ranch.imagenes.map((image, index) => (
                        <div
                          key={image.id || index}
                          className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
                          onClick={() => {
                            setSelectedImage(image);
                            setShowImageDialog(true);
                          }}
                        >
                          <img
                            src={image.url}
                            alt={image.descripcion || `Imagen ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No hay imágenes
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        No se han subido imágenes para este rancho.
                      </p>
                      {canEdit() && (
                        <Button 
                          variant="outline"
                          onClick={() => navigate(`/ranchos/${ranchId}/editar`)}
                        >
                          Agregar imágenes
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Ubicación/Mapa */}
            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle>Ubicación del Rancho</CardTitle>
                  <CardDescription>
                    Coordenadas: {ranch?.ubicacion_latitud}, {ranch?.ubicacion_longitud}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Mapa Interactivo
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Aquí se mostraría el mapa interactivo del rancho.
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" onClick={handleViewInMap}>
                          <Navigation className="h-4 w-4 mr-2" />
                          Abrir en Google Maps
                        </Button>
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver en mapa completo
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Dialog para imagen ampliada */}
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {selectedImage?.descripcion || 'Imagen del rancho'}
              </DialogTitle>
              <DialogDescription>
                {selectedImage?.fecha_subida && `Subida el ${formatDate(selectedImage.fecha_subida)}`}
              </DialogDescription>
            </DialogHeader>
            {selectedImage && (
              <div className="aspect-video">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.descripcion}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </TooltipProvider>
  );
};

export default RanchView;