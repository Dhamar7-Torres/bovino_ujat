import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Layers, 
  Filter, 
  Search, 
  Navigation, 
  ZoomIn, 
  ZoomOut,
  RotateCcw,
  Download,
  Eye,
  Edit3,
  Phone,
  Mail,
  User,
  Hectare,
  Calendar,
  X,
  Info,
  Maximize,
  Minimize
} from 'lucide-react';

// Componentes de shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

// Hooks personalizados
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useNotifications } from '../../hooks/useNotifications';
import { useLocalStorage } from '../../hooks/useLocalStorage';

// Servicios
import { ranchService } from '../../services/ranchService';
import { mapService } from '../../services/mapService';

// Utilidades
import { formatNumber, formatDate } from '../../utils/formatters';
import { calculateDistance } from '../../utils/mapUtils';

/**
 * Componente para vista de mapa de ranchos
 * Incluye mapas interactivos con marcadores, filtros geográficos y visualización de datos
 */
const RanchMapView = () => {
  // Referencias del mapa
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map());

  // Estados del mapa
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapStyle, setMapStyle] = useState('streets'); // 'streets', 'satellite', 'terrain'
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState([-99.133209, 19.432608]); // Coordenadas por defecto de México
  const [fullscreen, setFullscreen] = useState(false);

  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    estado_id: '',
    activo: 'all',
    superficie_min: 0,
    superficie_max: 1000,
    radio_km: 50 // Radio de búsqueda en km
  });
  const [showFilters, setShowFilters] = useState(false);

  // Estados de UI
  const [selectedRanch, setSelectedRanch] = useState(null);
  const [hoveredRanch, setHoveredRanch] = useState(null);
  const [showRanchDetails, setShowRanchDetails] = useState(false);
  const [clusteredMarkers, setClusteredMarkers] = useState(true);
  const [showUserLocation, setShowUserLocation] = useState(true);
  const [loading, setLoading] = useState(false);

  // Estados de datos
  const [ranches, setRanches] = useState([]);
  const [filteredRanches, setFilteredRanches] = useState([]);

  // Hooks personalizados
  const { user, hasRole } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const { 
    position: userPosition, 
    getCurrentPosition, 
    loading: gettingLocation 
  } = useGeolocation();
  const { getItem, setItem } = useLocalStorage();

  // Cargar preferencias guardadas
  useEffect(() => {
    const savedMapStyle = getItem('mapStyle', 'streets');
    const savedZoom = getItem('mapZoom', 10);
    const savedCenter = getItem('mapCenter', [-99.133209, 19.432608]);
    const savedFilters = getItem('mapFilters', {});
    
    setMapStyle(savedMapStyle);
    setZoom(savedZoom);
    setCenter(savedCenter);
    setFilters(prev => ({ ...prev, ...savedFilters }));
  }, [getItem]);

  // Guardar preferencias cuando cambien
  useEffect(() => {
    setItem('mapStyle', mapStyle);
  }, [mapStyle, setItem]);

  useEffect(() => {
    setItem('mapZoom', zoom);
  }, [zoom, setItem]);

  useEffect(() => {
    setItem('mapCenter', center);
  }, [center, setItem]);

  useEffect(() => {
    setItem('mapFilters', filters);
  }, [filters, setItem]);

  // Cargar ranchos
  const { 
    data: ranchesData, 
    loading: loadingRanches,
    execute: loadRanches 
  } = useFetch('/api/ranchos/map', {
    immediate: true,
    transform: (data) => {
      return data.filter(ranch => 
        ranch.ubicacion_latitud && 
        ranch.ubicacion_longitud &&
        !isNaN(parseFloat(ranch.ubicacion_latitud)) &&
        !isNaN(parseFloat(ranch.ubicacion_longitud))
      );
    }
  });

  // Cargar estados para filtros
  const { data: estados } = useFetch('/api/estados', {
    immediate: true,
    cacheKey: 'estados-list'
  });

  // Actualizar ranchos cuando cambien los datos
  useEffect(() => {
    if (ranchesData) {
      setRanches(ranchesData);
    }
  }, [ranchesData]);

  // Filtrar ranchos
  useEffect(() => {
    let filtered = ranches;

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(ranch =>
        ranch.nombre.toLowerCase().includes(term) ||
        ranch.descripcion?.toLowerCase().includes(term) ||
        ranch.propietario_nombre?.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (filters.estado_id) {
      filtered = filtered.filter(ranch => 
        ranch.estado_id?.toString() === filters.estado_id
      );
    }

    // Filtro por activo
    if (filters.activo !== 'all') {
      filtered = filtered.filter(ranch => 
        ranch.activo === (filters.activo === 'true')
      );
    }

    // Filtro por superficie
    filtered = filtered.filter(ranch => {
      const superficie = parseFloat(ranch.superficie_hectareas) || 0;
      return superficie >= filters.superficie_min && superficie <= filters.superficie_max;
    });

    // Filtro por radio (si hay ubicación del usuario)
    if (userPosition && filters.radio_km > 0) {
      filtered = filtered.filter(ranch => {
        const distance = calculateDistance(
          userPosition.latitude,
          userPosition.longitude,
          parseFloat(ranch.ubicacion_latitud),
          parseFloat(ranch.ubicacion_longitud)
        );
        return distance <= filters.radio_km * 1000; // Convertir km a metros
      });
    }

    setFilteredRanches(filtered);
  }, [ranches, searchTerm, filters, userPosition]);

  /**
   * Inicializar el mapa
   */
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  /**
   * Actualizar marcadores cuando cambien los ranchos filtrados
   */
  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded) {
      updateMapMarkers();
    }
  }, [filteredRanches, mapLoaded, clusteredMarkers]);

  /**
   * Actualizar ubicación del usuario
   */
  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded && userPosition && showUserLocation) {
      updateUserLocationMarker();
    }
  }, [userPosition, mapLoaded, showUserLocation]);

  /**
   * Inicializar mapa usando Leaflet o Mapbox
   */
  const initializeMap = async () => {
    try {
      // Aquí iría la inicialización del mapa real
      // Por ahora simulamos la carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular instancia de mapa
      mapInstanceRef.current = {
        setView: (coords, zoom) => {
          setCenter(coords);
          setZoom(zoom);
        },
        addMarker: (coords, options) => {
          // Simular marcador
          return { coords, options };
        },
        removeMarker: (marker) => {
          // Simular eliminación
        },
        fitBounds: (bounds) => {
          // Simular ajuste de vista
        },
        remove: () => {
          // Simular limpieza
        }
      };

      setMapLoaded(true);
      showSuccess('Mapa cargado', 'El mapa se ha inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar mapa:', error);
      showError('Error de mapa', 'No se pudo cargar el mapa');
    }
  };

  /**
   * Actualizar marcadores en el mapa
   */
  const updateMapMarkers = useCallback(() => {
    if (!mapInstanceRef.current) return;

    // Limpiar marcadores existentes
    markersRef.current.forEach(marker => {
      if (marker.remove) marker.remove();
    });
    markersRef.current.clear();

    // Agregar nuevos marcadores
    filteredRanches.forEach(ranch => {
      const coords = [
        parseFloat(ranch.ubicacion_latitud),
        parseFloat(ranch.ubicacion_longitud)
      ];

      const marker = mapInstanceRef.current.addMarker(coords, {
        title: ranch.nombre,
        ranch: ranch,
        color: ranch.activo ? '#10b981' : '#6b7280',
        icon: getMarkerIcon(ranch)
      });

      markersRef.current.set(ranch.id, marker);
    });

    // Ajustar vista si hay ranchos
    if (filteredRanches.length > 0) {
      const bounds = filteredRanches.map(ranch => [
        parseFloat(ranch.ubicacion_latitud),
        parseFloat(ranch.ubicacion_longitud)
      ]);
      
      if (bounds.length === 1) {
        mapInstanceRef.current.setView(bounds[0], 15);
      } else {
        mapInstanceRef.current.fitBounds(bounds);
      }
    }
  }, [filteredRanches]);

  /**
   * Actualizar marcador de ubicación del usuario
   */
  const updateUserLocationMarker = useCallback(() => {
    if (!mapInstanceRef.current || !userPosition) return;

    const coords = [userPosition.latitude, userPosition.longitude];
    const userMarker = mapInstanceRef.current.addMarker(coords, {
      title: 'Tu ubicación',
      color: '#3b82f6',
      icon: '📍',
      isUserLocation: true
    });

    markersRef.current.set('user-location', userMarker);
  }, [userPosition]);

  /**
   * Obtener icono del marcador según el tipo de rancho
   * @param {Object} ranch - Datos del rancho
   */
  const getMarkerIcon = (ranch) => {
    if (!ranch.activo) return '⚫';
    
    const superficie = parseFloat(ranch.superficie_hectareas) || 0;
    if (superficie > 500) return '🟢'; // Grande
    if (superficie > 100) return '🟡'; // Mediano
    return '🔵'; // Pequeño
  };

  /**
   * Manejar clic en marcador
   * @param {Object} ranch - Datos del rancho
   */
  const handleMarkerClick = (ranch) => {
    setSelectedRanch(ranch);
    setShowRanchDetails(true);
  };

  /**
   * Manejar cambio de filtros
   * @param {string} key - Clave del filtro
   * @param {any} value - Valor del filtro
   */
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /**
   * Limpiar filtros
   */
  const clearFilters = () => {
    setFilters({
      estado_id: '',
      activo: 'all',
      superficie_min: 0,
      superficie_max: 1000,
      radio_km: 50
    });
    setSearchTerm('');
  };

  /**
   * Centrar mapa en ubicación del usuario
   */
  const centerOnUser = async () => {
    try {
      const position = await getCurrentPosition();
      if (position && mapInstanceRef.current) {
        mapInstanceRef.current.setView([position.latitude, position.longitude], 15);
        setCenter([position.longitude, position.latitude]);
      }
    } catch (error) {
      showError('Error de ubicación', 'No se pudo obtener tu ubicación');
    }
  };

  /**
   * Exportar datos del mapa
   */
  const exportMapData = async () => {
    try {
      setLoading(true);
      
      const geoJsonData = {
        type: 'FeatureCollection',
        features: filteredRanches.map(ranch => ({
          type: 'Feature',
          properties: {
            id: ranch.id,
            nombre: ranch.nombre,
            superficie_hectareas: ranch.superficie_hectareas,
            activo: ranch.activo,
            propietario: ranch.propietario_nombre,
            telefono: ranch.telefono,
            email: ranch.email
          },
          geometry: {
            type: 'Point',
            coordinates: [
              parseFloat(ranch.ubicacion_longitud),
              parseFloat(ranch.ubicacion_latitud)
            ]
          }
        }))
      };

      const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ranchos_mapa_${new Date().toISOString().split('T')[0]}.geojson`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      showSuccess('Exportación exitosa', 'Datos del mapa exportados en formato GeoJSON');
    } catch (error) {
      showError('Error al exportar', 'No se pudo exportar los datos del mapa');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Alternar pantalla completa
   */
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // Configuración de animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const panelVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  };

  return (
    <TooltipProvider>
      <motion.div
        className={`relative ${fullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : 'h-screen'}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Panel lateral de controles */}
        <AnimatePresence>
          {!fullscreen && (
            <motion.div
              variants={panelVariants}
              initial="visible"
              animate="visible"
              exit="hidden"
              className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-10 overflow-y-auto"
            >
              {/* Header del panel */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Mapa de Ranchos
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredRanches.length} de {ranches.length} ranchos mostrados
                </p>
              </div>

              {/* Búsqueda */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
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

              {/* Filtros */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">Filtros</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3"
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
                        <Label className="text-xs">Estado</Label>
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

                      {/* Superficie */}
                      <div>
                        <Label className="text-xs">
                          Superficie: {filters.superficie_min} - {filters.superficie_max} ha
                        </Label>
                        <div className="px-2 pt-2">
                          <Slider
                            value={[filters.superficie_min, filters.superficie_max]}
                            onValueChange={([min, max]) => {
                              handleFilterChange('superficie_min', min);
                              handleFilterChange('superficie_max', max);
                            }}
                            max={1000}
                            min={0}
                            step={10}
                            className="w-full"
                          />
                        </div>
                      </div>

                      {/* Radio de búsqueda */}
                      {userPosition && (
                        <div>
                          <Label className="text-xs">
                            Radio de búsqueda: {filters.radio_km} km
                          </Label>
                          <div className="px-2 pt-2">
                            <Slider
                              value={[filters.radio_km]}
                              onValueChange={([value]) => handleFilterChange('radio_km', value)}
                              max={200}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="w-full"
                      >
                        Limpiar filtros
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Opciones del mapa */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <Label className="text-sm font-medium mb-3 block">Opciones del mapa</Label>
                
                <div className="space-y-3">
                  {/* Estilo del mapa */}
                  <div>
                    <Label className="text-xs">Estilo</Label>
                    <Select value={mapStyle} onValueChange={setMapStyle}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="streets">Calles</SelectItem>
                        <SelectItem value="satellite">Satélite</SelectItem>
                        <SelectItem value="terrain">Terreno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Opciones de visualización */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Agrupar marcadores</Label>
                      <Switch
                        checked={clusteredMarkers}
                        onCheckedChange={setClusteredMarkers}
                        size="sm"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Mostrar mi ubicación</Label>
                      <Switch
                        checked={showUserLocation}
                        onCheckedChange={setShowUserLocation}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de ranchos */}
              <div className="flex-1 overflow-y-auto">
                {loadingRanches ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cargando ranchos...</p>
                  </div>
                ) : filteredRanches.length === 0 ? (
                  <div className="p-4 text-center">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No hay ranchos que mostrar
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 p-2">
                    {filteredRanches.map((ranch) => (
                      <Card
                        key={ranch.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedRanch?.id === ranch.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => handleMarkerClick(ranch)}
                        onMouseEnter={() => setHoveredRanch(ranch)}
                        onMouseLeave={() => setHoveredRanch(null)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-medium text-sm line-clamp-1">
                                {ranch.nombre}
                              </h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {ranch.propietario_nombre}
                              </p>
                            </div>
                            <Badge variant={ranch.activo ? "default" : "secondary"} className="text-xs">
                              {ranch.activo ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 dark:text-gray-400">Superficie:</span>
                              <span>{formatNumber(ranch.superficie_hectareas)} ha</span>
                            </div>
                            
                            {userPosition && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600 dark:text-gray-400">Distancia:</span>
                                <span>
                                  {formatNumber(
                                    calculateDistance(
                                      userPosition.latitude,
                                      userPosition.longitude,
                                      parseFloat(ranch.ubicacion_latitud),
                                      parseFloat(ranch.ubicacion_longitud)
                                    ) / 1000,
                                    1
                                  )} km
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenedor del mapa */}
        <div 
          className={`${fullscreen ? 'w-full' : 'ml-80'} h-full relative bg-gray-100 dark:bg-gray-800`}
          ref={mapContainerRef}
        >
          {/* Mapa simulado */}
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Cargando mapa...</p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900">
              {/* Simulación visual del mapa */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] bg-repeat"></div>
              </div>
              
              {/* Marcadores simulados */}
              {filteredRanches.map((ranch, index) => (
                <div
                  key={ranch.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{
                    left: `${20 + (index % 5) * 15}%`,
                    top: `${20 + Math.floor(index / 5) * 15}%`
                  }}
                  onClick={() => handleMarkerClick(ranch)}
                >
                  <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs ${
                    ranch.activo ? 'bg-green-500' : 'bg-gray-500'
                  } ${selectedRanch?.id === ranch.id ? 'scale-125 ring-2 ring-blue-500' : ''} ${
                    hoveredRanch?.id === ranch.id ? 'scale-110' : ''
                  } transition-transform`}>
                    {getMarkerIcon(ranch)}
                  </div>
                  
                  {/* Tooltip */}
                  {hoveredRanch?.id === ranch.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {ranch.nombre}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Marcador de usuario */}
              {userPosition && showUserLocation && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: '50%', top: '50%' }}
                >
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-30"></div>
                </div>
              )}
            </div>
          )}

          {/* Controles del mapa */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {/* Pantalla completa */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/90 backdrop-blur-sm"
                  onClick={toggleFullscreen}
                >
                  {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              </TooltipContent>
            </Tooltip>

            {/* Mi ubicación */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/90 backdrop-blur-sm"
                  onClick={centerOnUser}
                  disabled={gettingLocation}
                >
                  <Navigation className={`h-4 w-4 ${gettingLocation ? 'animate-spin' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Centrar en mi ubicación</TooltipContent>
            </Tooltip>

            {/* Zoom */}
            <div className="flex flex-col gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/90 backdrop-blur-sm"
                    onClick={() => setZoom(Math.min(zoom + 1, 18))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Acercar</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/90 backdrop-blur-sm"
                    onClick={() => setZoom(Math.max(zoom - 1, 1))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Alejar</TooltipContent>
              </Tooltip>
            </div>

            {/* Exportar */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/90 backdrop-blur-sm"
                  onClick={exportMapData}
                  disabled={loading}
                >
                  <Download className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Exportar datos GeoJSON</TooltipContent>
            </Tooltip>
          </div>

          {/* Info del zoom */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
            Zoom: {zoom}
          </div>
        </div>

        {/* Panel de detalles del rancho */}
        <AnimatePresence>
          {showRanchDetails && selectedRanch && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowRanchDetails(false)}
            >
              <Card 
                className="w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedRanch.imagen_principal} />
                        <AvatarFallback>
                          {selectedRanch.nombre.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{selectedRanch.nombre}</CardTitle>
                        <CardDescription>{selectedRanch.estado_nombre}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedRanch.activo ? "default" : "secondary"}>
                        {selectedRanch.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowRanchDetails(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Hectare className="h-4 w-4" />
                        <span>Superficie</span>
                      </div>
                      <p className="font-medium">{formatNumber(selectedRanch.superficie_hectareas)} ha</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <User className="h-4 w-4" />
                        <span>Propietario</span>
                      </div>
                      <p className="font-medium">{selectedRanch.propietario_nombre}</p>
                    </div>
                  </div>

                  {selectedRanch.descripcion && (
                    <div>
                      <Label className="text-sm font-medium">Descripción</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {selectedRanch.descripcion}
                      </p>
                    </div>
                  )}

                  {(selectedRanch.telefono || selectedRanch.email) && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Contacto</Label>
                      {selectedRanch.telefono && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{selectedRanch.telefono}</span>
                        </div>
                      )}
                      {selectedRanch.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{selectedRanch.email}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Ubicación</Label>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Lat: {parseFloat(selectedRanch.ubicacion_latitud).toFixed(6)}</p>
                      <p>Lng: {parseFloat(selectedRanch.ubicacion_longitud).toFixed(6)}</p>
                      {userPosition && (
                        <p>
                          Distancia: {formatNumber(
                            calculateDistance(
                              userPosition.latitude,
                              userPosition.longitude,
                              parseFloat(selectedRanch.ubicacion_latitud),
                              parseFloat(selectedRanch.ubicacion_longitud)
                            ) / 1000,
                            1
                          )} km
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/ranchos/${selectedRanch.id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver detalles
                    </Button>
                    {(hasRole('admin') || user?.id === selectedRanch.propietario_id) && (
                      <Button
                        size="sm"
                        onClick={() => window.open(`/ranchos/${selectedRanch.id}/editar`, '_blank')}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle del panel lateral en pantalla completa */}
        {fullscreen && (
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm z-20"
            onClick={() => setFullscreen(false)}
          >
            <X className="h-4 w-4 mr-2" />
            Salir
          </Button>
        )}
      </motion.div>
    </TooltipProvider>
  );
};

export default RanchMapView;