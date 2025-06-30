import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Filter, Layers, ZoomIn, ZoomOut, RotateCcw, Download, Eye, Navigation, Satellite } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGeolocation } from '../hooks/useGeolocation';
import { bovineLocationService } from '../services/bovineLocationService';

const BovineLocationMap = () => {
  // Estados principales del mapa
  const [mapData, setMapData] = useState({
    bovines: [],
    healthEvents: [],
    productionEvents: [],
    reproductionEvents: []
  });
  
  // Estados de control del mapa
  const [mapConfig, setMapConfig] = useState({
    center: [17.9869, -92.9303], // Coordenadas de Tabasco
    zoom: 10,
    mapType: 'roadmap', // roadmap, satellite, hybrid, terrain
    showClusters: true,
    showHeatmap: false
  });

  // Estados de filtros
  const [filters, setFilters] = useState({
    dateRange: 'all', // today, week, month, all
    eventType: 'all', // health, production, reproduction, all
    bovineStatus: 'all', // active, sick, productive, all
    ranchId: 'all',
    showBovines: true,
    showHealthEvents: true,
    showProductionEvents: true,
    showReproductionEvents: true
  });

  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Estados de estadísticas del mapa
  const [mapStats, setMapStats] = useState({
    totalBovines: 0,
    activeBovines: 0,
    healthEvents: 0,
    productionEvents: 0,
    reproductionEvents: 0,
    ranches: 0
  });

  // Referencias para el mapa
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Hook personalizado para geolocalización
  const { location, getCurrentLocation } = useGeolocation();

  // Efectos para cargar y actualizar datos
  useEffect(() => {
    initializeMap();
    fetchMapData();
  }, []);

  useEffect(() => {
    filterMapData();
  }, [mapData, filters, searchTerm]);

  useEffect(() => {
    updateMapMarkers();
  }, [filteredData]);

  useEffect(() => {
    calculateMapStats();
  }, [mapData]);

  // Función para inicializar el mapa
  const initializeMap = async () => {
    try {
      // Importar Leaflet dinámicamente
      const L = await import('leaflet');
      
      // Configurar iconos de Leaflet
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Crear instancia del mapa
      if (mapRef.current && !mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView(mapConfig.center, mapConfig.zoom);

        // Agregar capa base
        updateMapLayer(L);

        // Configurar eventos del mapa
        mapInstanceRef.current.on('click', handleMapClick);
        mapInstanceRef.current.on('zoomend', handleZoomChange);
      }
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
    }
  };

  // Función para actualizar la capa del mapa
  const updateMapLayer = async (L) => {
    if (!mapInstanceRef.current) return;

    // Remover capas existentes
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer._url) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // URLs de diferentes tipos de mapa
    const mapUrls = {
      roadmap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      hybrid: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
    };

    // Agregar nueva capa
    L.tileLayer(mapUrls[mapConfig.mapType], {
      attribution: mapConfig.mapType === 'satellite' 
        ? '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(mapInstanceRef.current);
  };

  // Función para obtener datos del mapa
  const fetchMapData = async () => {
    try {
      setIsLoading(true);
      const [bovinesRes, healthRes, productionRes, reproductionRes] = await Promise.all([
        bovineLocationService.getBovineLocations(),
        bovineLocationService.getHealthEvents(),
        bovineLocationService.getProductionEvents(),
        bovineLocationService.getReproductionEvents()
      ]);

      setMapData({
        bovines: bovinesRes.data,
        healthEvents: healthRes.data,
        productionEvents: productionRes.data,
        reproductionEvents: reproductionRes.data
      });
    } catch (error) {
      console.error('Error al cargar datos del mapa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para filtrar datos del mapa
  const filterMapData = () => {
    let filtered = [];

    // Filtrar bovinos
    if (filters.showBovines) {
      let bovines = mapData.bovines.filter(bovine => {
        if (filters.bovineStatus !== 'all' && bovine.status !== filters.bovineStatus) return false;
        if (filters.ranchId !== 'all' && bovine.ranchId !== filters.ranchId) return false;
        if (searchTerm && !bovine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !bovine.identification.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
      });
      filtered = [...filtered, ...bovines.map(b => ({ ...b, type: 'bovine' }))];
    }

    // Filtrar eventos de salud
    if (filters.showHealthEvents && (filters.eventType === 'all' || filters.eventType === 'health')) {
      let healthEvents = mapData.healthEvents.filter(event => filterByDateRange(event.date));
      filtered = [...filtered, ...healthEvents.map(e => ({ ...e, type: 'health' }))];
    }

    // Filtrar eventos de producción
    if (filters.showProductionEvents && (filters.eventType === 'all' || filters.eventType === 'production')) {
      let productionEvents = mapData.productionEvents.filter(event => filterByDateRange(event.date));
      filtered = [...filtered, ...productionEvents.map(e => ({ ...e, type: 'production' }))];
    }

    // Filtrar eventos de reproducción
    if (filters.showReproductionEvents && (filters.eventType === 'all' || filters.eventType === 'reproduction')) {
      let reproductionEvents = mapData.reproductionEvents.filter(event => filterByDateRange(event.date));
      filtered = [...filtered, ...reproductionEvents.map(e => ({ ...e, type: 'reproduction' }))];
    }

    setFilteredData(filtered);
  };

  // Función para filtrar por rango de fechas
  const filterByDateRange = (eventDate) => {
    if (filters.dateRange === 'all') return true;
    
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    
    switch (filters.dateRange) {
      case 'today':
        return eventDateObj.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return eventDateObj >= weekAgo;
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return eventDateObj >= monthAgo;
      default:
        return true;
    }
  };

  // Función para actualizar marcadores en el mapa
  const updateMapMarkers = async () => {
    if (!mapInstanceRef.current) return;

    try {
      const L = await import('leaflet');

      // Limpiar marcadores existentes
      markersRef.current.forEach(marker => mapInstanceRef.current.removeLayer(marker));
      markersRef.current = [];

      // Crear iconos personalizados
      const icons = {
        bovine: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background: #10B981; border-radius: 50%; width: 20px; height: 20px; border: 2px solid white;"><span style="color: white; font-size: 12px; display: flex; align-items: center; justify-content: center; height: 100%;">🐄</span></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        }),
        health: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background: #EF4444; border-radius: 50%; width: 18px; height: 18px; border: 2px solid white;"><span style="color: white; font-size: 10px; display: flex; align-items: center; justify-content: center; height: 100%;">🏥</span></div>',
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        }),
        production: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background: #3B82F6; border-radius: 50%; width: 18px; height: 18px; border: 2px solid white;"><span style="color: white; font-size: 10px; display: flex; align-items: center; justify-content: center; height: 100%;">🥛</span></div>',
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        }),
        reproduction: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background: #EC4899; border-radius: 50%; width: 18px; height: 18px; border: 2px solid white;"><span style="color: white; font-size: 10px; display: flex; align-items: center; justify-content: center; height: 100%;">💕</span></div>',
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        })
      };

      // Agregar marcadores agrupados si está habilitado
      if (mapConfig.showClusters) {
        // Aquí usarías una librería como Leaflet.markercluster
        // Por simplicidad, agregamos marcadores individuales
        filteredData.forEach(item => {
          if (item.coordinates) {
            const marker = L.marker([item.coordinates.latitude, item.coordinates.longitude], {
              icon: icons[item.type]
            }).addTo(mapInstanceRef.current);

            marker.bindPopup(createPopupContent(item));
            marker.on('click', () => setSelectedMarker(item));
            markersRef.current.push(marker);
          }
        });
      } else {
        // Agregar marcadores individuales
        filteredData.forEach(item => {
          if (item.coordinates) {
            const marker = L.marker([item.coordinates.latitude, item.coordinates.longitude], {
              icon: icons[item.type]
            }).addTo(mapInstanceRef.current);

            marker.bindPopup(createPopupContent(item));
            marker.on('click', () => setSelectedMarker(item));
            markersRef.current.push(marker);
          }
        });
      }

      // Ajustar vista del mapa si hay marcadores
      if (markersRef.current.length > 0) {
        const group = new L.featureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }

    } catch (error) {
      console.error('Error al actualizar marcadores:', error);
    }
  };

  // Función para crear contenido del popup
  const createPopupContent = (item) => {
    switch (item.type) {
      case 'bovine':
        return `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #10B981; font-weight: bold;">🐄 ${item.name}</h3>
            <p style="margin: 4px 0;"><strong>ID:</strong> ${item.identification}</p>
            <p style="margin: 4px 0;"><strong>Estado:</strong> ${item.status}</p>
            <p style="margin: 4px 0;"><strong>Rancho:</strong> ${item.ranchName}</p>
            <p style="margin: 4px 0;"><strong>Ubicación:</strong> ${item.coordinates.latitude.toFixed(6)}, ${item.coordinates.longitude.toFixed(6)}</p>
          </div>
        `;
      case 'health':
        return `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #EF4444; font-weight: bold;">🏥 Evento de Salud</h3>
            <p style="margin: 4px 0;"><strong>Bovino:</strong> ${item.bovineName}</p>
            <p style="margin: 4px 0;"><strong>Tipo:</strong> ${item.eventType}</p>
            <p style="margin: 4px 0;"><strong>Fecha:</strong> ${new Date(item.date).toLocaleDateString()}</p>
            <p style="margin: 4px 0;"><strong>Veterinario:</strong> ${item.veterinarianName}</p>
          </div>
        `;
      case 'production':
        return `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #3B82F6; font-weight: bold;">🥛 Evento de Producción</h3>
            <p style="margin: 4px 0;"><strong>Bovino:</strong> ${item.bovineName}</p>
            <p style="margin: 4px 0;"><strong>Cantidad:</strong> ${item.quantity} ${item.unit}</p>
            <p style="margin: 4px 0;"><strong>Fecha:</strong> ${new Date(item.date).toLocaleDateString()}</p>
            <p style="margin: 4px 0;"><strong>Calidad:</strong> ${item.quality}%</p>
          </div>
        `;
      case 'reproduction':
        return `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #EC4899; font-weight: bold;">💕 Evento Reproductivo</h3>
            <p style="margin: 4px 0;"><strong>Hembra:</strong> ${item.femaleName}</p>
            <p style="margin: 4px 0;"><strong>Tipo:</strong> ${item.eventType}</p>
            <p style="margin: 4px 0;"><strong>Fecha:</strong> ${new Date(item.date).toLocaleDateString()}</p>
            <p style="margin: 4px 0;"><strong>Estado:</strong> ${item.status}</p>
          </div>
        `;
      default:
        return '<div>Información no disponible</div>';
    }
  };

  // Función para calcular estadísticas del mapa
  const calculateMapStats = () => {
    setMapStats({
      totalBovines: mapData.bovines.length,
      activeBovines: mapData.bovines.filter(b => b.status === 'active').length,
      healthEvents: mapData.healthEvents.length,
      productionEvents: mapData.productionEvents.length,
      reproductionEvents: mapData.reproductionEvents.length,
      ranches: [...new Set(mapData.bovines.map(b => b.ranchId))].length
    });
  };

  // Función para manejar clics en el mapa
  const handleMapClick = (e) => {
    console.log('Coordenadas clicadas:', e.latlng);
  };

  // Función para manejar cambios de zoom
  const handleZoomChange = () => {
    if (mapInstanceRef.current) {
      setMapConfig(prev => ({
        ...prev,
        zoom: mapInstanceRef.current.getZoom()
      }));
    }
  };

  // Función para centrar el mapa en la ubicación del usuario
  const centerOnUserLocation = async () => {
    await getCurrentLocation();
    if (location && mapInstanceRef.current) {
      mapInstanceRef.current.setView([location.latitude, location.longitude], 15);
    }
  };

  // Función para exportar datos del mapa
  const exportMapData = () => {
    const dataToExport = {
      timestamp: new Date().toISOString(),
      filters: filters,
      stats: mapStats,
      data: filteredData
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bovine-locations-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Función para actualizar filtros
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Función para actualizar configuración del mapa
  const updateMapConfig = async (key, value) => {
    setMapConfig(prev => ({
      ...prev,
      [key]: value
    }));

    if (key === 'mapType' && mapInstanceRef.current) {
      const L = await import('leaflet');
      updateMapLayer(L);
    }
  };

  // Animaciones para framer motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
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
      className="h-screen flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header con controles */}
      <motion.div variants={itemVariants} className="bg-white border-b p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-green-600" />
              Mapa de Ubicaciones de Bovinos
            </h1>
            <p className="text-gray-600">Visualiza ubicaciones de ganado y eventos en tiempo real</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Estadísticas rápidas */}
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-green-600">{mapStats.totalBovines}</div>
                <div className="text-gray-600">Bovinos</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-red-600">{mapStats.healthEvents}</div>
                <div className="text-gray-600">Salud</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600">{mapStats.productionEvents}</div>
                <div className="text-gray-600">Producción</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-pink-600">{mapStats.reproductionEvents}</div>
                <div className="text-gray-600">Reproducción</div>
              </div>
            </div>
            
            <Separator orientation="vertical" className="h-8" />
            
            {/* Controles del mapa */}
            <Button variant="outline" size="sm" onClick={centerOnUserLocation}>
              <Navigation className="w-4 h-4 mr-2" />
              Mi Ubicación
            </Button>
            
            <Popover open={showLayers} onOpenChange={setShowLayers}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Layers className="w-4 h-4 mr-2" />
                  Capas
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-medium">Configuración de Capas</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="mapType">Tipo de Mapa</Label>
                      <Select value={mapConfig.mapType} onValueChange={(value) => updateMapConfig('mapType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="roadmap">Mapa de Carreteras</SelectItem>
                          <SelectItem value="satellite">Satélite</SelectItem>
                          <SelectItem value="hybrid">Híbrido</SelectItem>
                          <SelectItem value="terrain">Terreno</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="clusters">Agrupar Marcadores</Label>
                      <Switch
                        id="clusters"
                        checked={mapConfig.showClusters}
                        onCheckedChange={(checked) => updateMapConfig('showClusters', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="heatmap">Mapa de Calor</Label>
                      <Switch
                        id="heatmap"
                        checked={mapConfig.showHeatmap}
                        onCheckedChange={(checked) => updateMapConfig('showHeatmap', checked)}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-medium">Filtros de Visualización</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="search">Buscar</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="search"
                          placeholder="Buscar bovino..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="dateRange">Período</Label>
                      <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="today">Hoy</SelectItem>
                          <SelectItem value="week">Esta Semana</SelectItem>
                          <SelectItem value="month">Este Mes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="eventType">Tipo de Evento</Label>
                      <Select value={filters.eventType} onValueChange={(value) => updateFilter('eventType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="health">Salud</SelectItem>
                          <SelectItem value="production">Producción</SelectItem>
                          <SelectItem value="reproduction">Reproducción</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Mostrar en Mapa</Label>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">🐄 Bovinos</span>
                        <Switch
                          checked={filters.showBovines}
                          onCheckedChange={(checked) => updateFilter('showBovines', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">🏥 Eventos de Salud</span>
                        <Switch
                          checked={filters.showHealthEvents}
                          onCheckedChange={(checked) => updateFilter('showHealthEvents', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">🥛 Eventos de Producción</span>
                        <Switch
                          checked={filters.showProductionEvents}
                          onCheckedChange={(checked) => updateFilter('showProductionEvents', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">💕 Eventos Reproductivos</span>
                        <Switch
                          checked={filters.showReproductionEvents}
                          onCheckedChange={(checked) => updateFilter('showReproductionEvents', checked)}
                        />
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" onClick={() => {
                      setFilters({
                        dateRange: 'all',
                        eventType: 'all',
                        bovineStatus: 'all',
                        ranchId: 'all',
                        showBovines: true,
                        showHealthEvents: true,
                        showProductionEvents: true,
                        showReproductionEvents: true
                      });
                      setSearchTerm('');
                    }} className="w-full">
                      Limpiar Filtros
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="sm" onClick={exportMapData}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Contenedor del mapa */}
      <motion.div variants={itemVariants} className="flex-1 relative">
        {/* Mapa principal */}
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Indicador de carga */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span>Cargando datos del mapa...</span>
              </div>
            </Card>
          </div>
        )}
        
        {/* Controles de zoom flotantes */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white"
            onClick={() => mapInstanceRef.current?.zoomIn()}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white"
            onClick={() => mapInstanceRef.current?.zoomOut()}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white"
            onClick={() => mapInstanceRef.current?.setView(mapConfig.center, 10)}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Leyenda del mapa */}
        <Card className="absolute bottom-4 left-4 p-4 z-10 bg-white/90 backdrop-blur">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-sm">Leyenda</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">🐄</div>
                <span>Bovinos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">🏥</div>
                <span>Eventos de Salud</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">🥛</div>
                <span>Producción</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs">💕</div>
                <span>Reproducción</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Información del marcador seleccionado */}
        <AnimatePresence>
          {selectedMarker && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-4 left-4 z-10 w-80"
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {selectedMarker.type === 'bovine' && <span>🐄</span>}
                      {selectedMarker.type === 'health' && <span>🏥</span>}
                      {selectedMarker.type === 'production' && <span>🥛</span>}
                      {selectedMarker.type === 'reproduction' && <span>💕</span>}
                      {selectedMarker.name || selectedMarker.bovineName || selectedMarker.femaleName}
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedMarker(null)}
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {selectedMarker.type === 'bovine' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ID:</span>
                          <span>{selectedMarker.identification}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estado:</span>
                          <Badge variant={selectedMarker.status === 'active' ? 'success' : 'warning'}>
                            {selectedMarker.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rancho:</span>
                          <span>{selectedMarker.ranchName}</span>
                        </div>
                      </>
                    )}
                    
                    {selectedMarker.type === 'health' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tipo:</span>
                          <span>{selectedMarker.eventType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fecha:</span>
                          <span>{new Date(selectedMarker.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Veterinario:</span>
                          <span>{selectedMarker.veterinarianName}</span>
                        </div>
                      </>
                    )}
                    
                    {selectedMarker.coordinates && (
                      <div className="border-t pt-2 mt-2">
                        <div className="text-xs text-gray-500">
                          <div>Lat: {selectedMarker.coordinates.latitude.toFixed(6)}</div>
                          <div>Lng: {selectedMarker.coordinates.longitude.toFixed(6)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default BovineLocationMap;