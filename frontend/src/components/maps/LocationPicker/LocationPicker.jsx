import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Target, Navigation, Copy, Check, Download, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGeolocation } from '../hooks/useGeolocation';

const LocationPicker = forwardRef(({ 
  onLocationSelect, 
  onBoundarySelect, 
  initialLocation = null, 
  initialBoundary = null,
  showBoundaryTools = false,
  height = '400px',
  allowMultiplePoints = false,
  mode = 'point' // 'point', 'boundary', 'both'
}, ref) => {
  
  // Estados principales del selector
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedBoundary, setSelectedBoundary] = useState(initialBoundary || []);
  const [searchValue, setSearchValue] = useState('');
  const [isDrawingBoundary, setIsDrawingBoundary] = useState(false);
  const [mapMode, setMapMode] = useState(mode);
  
  // Estados de control
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [mapType, setMapType] = useState('roadmap');
  const [coordinatesCopied, setCoordinatesCopied] = useState(false);
  
  // Estados para múltiples puntos
  const [multiplePoints, setMultiplePoints] = useState([]);
  const [currentPointName, setCurrentPointName] = useState('');
  
  // Referencias para el mapa
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const boundaryLayerRef = useRef(null);
  const drawingLayerRef = useRef(null);
  
  // Hook personalizado para geolocalización
  const { location: userLocation, getCurrentLocation } = useGeolocation();
  
  // Exponer métodos públicos del componente
  useImperativeHandle(ref, () => ({
    getSelectedLocation: () => selectedLocation,
    getSelectedBoundary: () => selectedBoundary,
    getMultiplePoints: () => multiplePoints,
    clearSelection: () => clearSelection(),
    setLocation: (location) => setLocationFromExternal(location),
    setBoundary: (boundary) => setBoundaryFromExternal(boundary),
    exportData: () => exportLocationData(),
    importData: (data) => importLocationData(data)
  }));
  
  // Efectos principales
  useEffect(() => {
    initializeMap();
    return () => {
      // Cleanup al desmontar
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);
  
  useEffect(() => {
    updateMapType();
  }, [mapType]);
  
  useEffect(() => {
    if (selectedLocation && onLocationSelect) {
      onLocationSelect(selectedLocation);
    }
  }, [selectedLocation]);
  
  useEffect(() => {
    if (selectedBoundary.length > 0 && onBoundarySelect) {
      onBoundarySelect(selectedBoundary);
    }
  }, [selectedBoundary]);
  
  // Función para inicializar el mapa
  const initializeMap = async () => {
    try {
      const L = await import('leaflet');
      
      // Configurar iconos de Leaflet
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      
      if (mapRef.current && !mapInstanceRef.current) {
        // Crear instancia del mapa
        const initialCenter = initialLocation 
          ? [initialLocation.latitude, initialLocation.longitude]
          : [17.9869, -92.9303]; // Coordenadas de Tabasco
          
        mapInstanceRef.current = L.map(mapRef.current).setView(initialCenter, 13);
        
        // Agregar capa base
        updateMapLayer(L);
        
        // Configurar eventos del mapa
        mapInstanceRef.current.on('click', handleMapClick);
        
        // Inicializar ubicación y boundary si existen
        if (initialLocation) {
          addLocationMarker(L, initialLocation);
        }
        
        if (initialBoundary && initialBoundary.length > 0) {
          drawBoundary(L, initialBoundary);
        }
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
      terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
    };
    
    // Agregar nueva capa
    L.tileLayer(mapUrls[mapType], {
      attribution: mapType === 'satellite' 
        ? '&copy; Esri'
        : '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(mapInstanceRef.current);
  };
  
  // Función para actualizar tipo de mapa
  const updateMapType = async () => {
    if (mapInstanceRef.current) {
      const L = await import('leaflet');
      updateMapLayer(L);
    }
  };
  
  // Función para manejar clics en el mapa
  const handleMapClick = async (e) => {
    const L = await import('leaflet');
    const clickedLocation = {
      latitude: e.latlng.lat,
      longitude: e.latlng.lng
    };
    
    if (isDrawingBoundary) {
      // Agregar punto al boundary
      addBoundaryPoint(clickedLocation);
    } else if (mapMode === 'point' || mapMode === 'both') {
      // Seleccionar ubicación única
      if (allowMultiplePoints) {
        addMultiplePoint(clickedLocation);
      } else {
        setSelectedLocation(clickedLocation);
        addLocationMarker(L, clickedLocation);
      }
    }
  };
  
  // Función para agregar marcador de ubicación
  const addLocationMarker = async (L, location) => {
    if (!mapInstanceRef.current) return;
    
    // Limpiar marcadores existentes si no permite múltiples
    if (!allowMultiplePoints) {
      clearMarkers();
    }
    
    // Crear icono personalizado
    const customIcon = L.divIcon({
      className: 'custom-location-marker',
      html: '<div style="background: #EF4444; border-radius: 50%; width: 20px; height: 20px; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    
    const marker = L.marker([location.latitude, location.longitude], { 
      icon: customIcon,
      draggable: true 
    }).addTo(mapInstanceRef.current);
    
    // Popup con coordenadas
    marker.bindPopup(`
      <div style="min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; color: #EF4444; font-weight: bold;">📍 Ubicación Seleccionada</h3>
        <p style="margin: 4px 0;"><strong>Latitud:</strong> ${location.latitude.toFixed(6)}</p>
        <p style="margin: 4px 0;"><strong>Longitud:</strong> ${location.longitude.toFixed(6)}</p>
      </div>
    `);
    
    // Manejar arrastre del marcador
    marker.on('dragend', (e) => {
      const newLocation = {
        latitude: e.target.getLatLng().lat,
        longitude: e.target.getLatLng().lng
      };
      setSelectedLocation(newLocation);
    });
    
    markersRef.current.push(marker);
  };
  
  // Función para agregar múltiples puntos
  const addMultiplePoint = async (location) => {
    if (!currentPointName.trim()) {
      alert('Por favor, ingresa un nombre para el punto');
      return;
    }
    
    const newPoint = {
      id: Date.now(),
      name: currentPointName,
      location: location
    };
    
    setMultiplePoints(prev => [...prev, newPoint]);
    setCurrentPointName('');
    
    const L = await import('leaflet');
    
    // Crear marcador numerado
    const pointNumber = multiplePoints.length + 1;
    const numberedIcon = L.divIcon({
      className: 'custom-numbered-marker',
      html: `<div style="background: #3B82F6; border-radius: 50%; width: 24px; height: 24px; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${pointNumber}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    
    const marker = L.marker([location.latitude, location.longitude], { 
      icon: numberedIcon 
    }).addTo(mapInstanceRef.current);
    
    marker.bindPopup(`
      <div style="min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; color: #3B82F6; font-weight: bold;">📍 ${newPoint.name}</h3>
        <p style="margin: 4px 0;"><strong>Punto #:</strong> ${pointNumber}</p>
        <p style="margin: 4px 0;"><strong>Latitud:</strong> ${location.latitude.toFixed(6)}</p>
        <p style="margin: 4px 0;"><strong>Longitud:</strong> ${location.longitude.toFixed(6)}</p>
      </div>
    `);
    
    markersRef.current.push({ marker, point: newPoint });
  };
  
  // Función para agregar punto al boundary
  const addBoundaryPoint = (location) => {
    setSelectedBoundary(prev => [...prev, location]);
  };
  
  // Función para dibujar boundary
  const drawBoundary = async (L, boundary) => {
    if (!mapInstanceRef.current || boundary.length === 0) return;
    
    // Limpiar boundary existente
    if (boundaryLayerRef.current) {
      mapInstanceRef.current.removeLayer(boundaryLayerRef.current);
    }
    
    // Convertir coordenadas al formato de Leaflet
    const latlngs = boundary.map(point => [point.latitude, point.longitude]);
    
    // Crear polígono
    boundaryLayerRef.current = L.polygon(latlngs, {
      color: '#10B981',
      fillColor: '#10B981',
      fillOpacity: 0.2,
      weight: 2
    }).addTo(mapInstanceRef.current);
    
    // Agregar popup con información del área
    const area = calculatePolygonArea(boundary);
    boundaryLayerRef.current.bindPopup(`
      <div style="min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; color: #10B981; font-weight: bold;">🏞️ Área Delimitada</h3>
        <p style="margin: 4px 0;"><strong>Puntos:</strong> ${boundary.length}</p>
        <p style="margin: 4px 0;"><strong>Área aprox:</strong> ${area.toFixed(2)} hectáreas</p>
      </div>
    `);
    
    // Ajustar vista para mostrar todo el polígono
    if (boundary.length > 0) {
      mapInstanceRef.current.fitBounds(boundaryLayerRef.current.getBounds());
    }
  };
  
  // Función para calcular área del polígono (aproximada)
  const calculatePolygonArea = (boundary) => {
    if (boundary.length < 3) return 0;
    
    // Fórmula de Shoelace para calcular área en coordenadas geográficas
    let area = 0;
    const n = boundary.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += boundary[i].longitude * boundary[j].latitude;
      area -= boundary[j].longitude * boundary[i].latitude;
    }
    
    area = Math.abs(area) / 2;
    
    // Convertir a metros cuadrados (aproximado) y luego a hectáreas
    const metersSquared = area * 111000 * 111000; // 1 grado ≈ 111km
    return metersSquared / 10000; // 1 hectárea = 10,000 m²
  };
  
  // Función para buscar ubicaciones
  const searchLocation = async () => {
    if (!searchValue.trim()) return;
    
    try {
      setIsLoading(true);
      
      // Usar API de geocodificación (Nominatim de OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue)}&limit=5&countrycodes=mx`
      );
      
      const results = await response.json();
      
      const formattedResults = results.map(result => ({
        name: result.display_name,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        boundingbox: result.boundingbox
      }));
      
      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Función para seleccionar resultado de búsqueda
  const selectSearchResult = async (result) => {
    const L = await import('leaflet');
    
    setSelectedLocation({
      latitude: result.latitude,
      longitude: result.longitude
    });
    
    // Centrar mapa en el resultado
    mapInstanceRef.current.setView([result.latitude, result.longitude], 15);
    
    // Agregar marcador
    addLocationMarker(L, {
      latitude: result.latitude,
      longitude: result.longitude
    });
    
    // Limpiar búsqueda
    setSearchResults([]);
    setSearchValue('');
  };
  
  // Función para obtener ubicación del usuario
  const getUserLocation = async () => {
    await getCurrentLocation();
    if (userLocation) {
      const L = await import('leaflet');
      
      setSelectedLocation(userLocation);
      mapInstanceRef.current.setView([userLocation.latitude, userLocation.longitude], 16);
      addLocationMarker(L, userLocation);
    }
  };
  
  // Función para limpiar marcadores
  const clearMarkers = () => {
    markersRef.current.forEach(item => {
      if (item.marker) {
        mapInstanceRef.current.removeLayer(item.marker);
      } else {
        mapInstanceRef.current.removeLayer(item);
      }
    });
    markersRef.current = [];
  };
  
  // Función para limpiar selección
  const clearSelection = () => {
    setSelectedLocation(null);
    setSelectedBoundary([]);
    setMultiplePoints([]);
    clearMarkers();
    
    if (boundaryLayerRef.current) {
      mapInstanceRef.current.removeLayer(boundaryLayerRef.current);
      boundaryLayerRef.current = null;
    }
  };
  
  // Función para empezar/terminar dibujo de boundary
  const toggleBoundaryDrawing = async () => {
    if (isDrawingBoundary) {
      // Terminar dibujo
      setIsDrawingBoundary(false);
      if (selectedBoundary.length > 2) {
        const L = await import('leaflet');
        drawBoundary(L, selectedBoundary);
      }
    } else {
      // Empezar dibujo
      setIsDrawingBoundary(true);
      setSelectedBoundary([]);
      if (boundaryLayerRef.current) {
        mapInstanceRef.current.removeLayer(boundaryLayerRef.current);
        boundaryLayerRef.current = null;
      }
    }
  };
  
  // Función para copiar coordenadas
  const copyCoordinates = () => {
    if (selectedLocation) {
      const coordinates = `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`;
      navigator.clipboard.writeText(coordinates);
      setCoordinatesCopied(true);
      setTimeout(() => setCoordinatesCopied(false), 2000);
    }
  };
  
  // Función para establecer ubicación desde el exterior
  const setLocationFromExternal = async (location) => {
    const L = await import('leaflet');
    setSelectedLocation(location);
    mapInstanceRef.current.setView([location.latitude, location.longitude], 15);
    addLocationMarker(L, location);
  };
  
  // Función para establecer boundary desde el exterior
  const setBoundaryFromExternal = async (boundary) => {
    const L = await import('leaflet');
    setSelectedBoundary(boundary);
    drawBoundary(L, boundary);
  };
  
  // Función para exportar datos de ubicación
  const exportLocationData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      selectedLocation,
      selectedBoundary,
      multiplePoints,
      mode: mapMode
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `location-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Función para importar datos de ubicación
  const importLocationData = async (data) => {
    try {
      const L = await import('leaflet');
      
      if (data.selectedLocation) {
        setSelectedLocation(data.selectedLocation);
        addLocationMarker(L, data.selectedLocation);
      }
      
      if (data.selectedBoundary && data.selectedBoundary.length > 0) {
        setSelectedBoundary(data.selectedBoundary);
        drawBoundary(L, data.selectedBoundary);
      }
      
      if (data.multiplePoints && data.multiplePoints.length > 0) {
        setMultiplePoints(data.multiplePoints);
        // Re-dibujar puntos múltiples
        data.multiplePoints.forEach((point, index) => {
          addLocationMarker(L, point.location);
        });
      }
      
      if (data.mode) {
        setMapMode(data.mode);
      }
    } catch (error) {
      console.error('Error al importar datos:', error);
    }
  };
  
  // Función para eliminar punto múltiple
  const removeMultiplePoint = (pointId) => {
    setMultiplePoints(prev => prev.filter(point => point.id !== pointId));
    
    // Remover marcador del mapa
    markersRef.current = markersRef.current.filter(item => {
      if (item.point && item.point.id === pointId) {
        mapInstanceRef.current.removeLayer(item.marker);
        return false;
      }
      return true;
    });
  };
  
  return (
    <motion.div
      className="w-full space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Controles superiores */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Selector de Ubicación
          </CardTitle>
          <CardDescription>
            Haz clic en el mapa para seleccionar una ubicación o dibuja un área
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Búsqueda */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Buscar dirección o lugar..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
              />
            </div>
            <Button onClick={searchLocation} disabled={isLoading}>
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={getUserLocation}>
              <Navigation className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Resultados de búsqueda */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => selectSearchResult(result)}
                  >
                    <div className="font-medium text-sm">{result.name}</div>
                    <div className="text-xs text-gray-500">
                      {result.latitude.toFixed(4)}, {result.longitude.toFixed(4)}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Pestañas de modo */}
          {(mode === 'both' || showBoundaryTools) && (
            <Tabs value={mapMode} onValueChange={setMapMode}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="point">Punto</TabsTrigger>
                <TabsTrigger value="boundary">Área</TabsTrigger>
              </TabsList>
              
              <TabsContent value="point" className="space-y-4">
                {allowMultiplePoints && (
                  <div className="space-y-2">
                    <Label htmlFor="pointName">Nombre del punto</Label>
                    <div className="flex gap-2">
                      <Input
                        id="pointName"
                        placeholder="Ej: Entrada principal"
                        value={currentPointName}
                        onChange={(e) => setCurrentPointName(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {selectedLocation && (
                  <Alert className="border-green-200 bg-green-50">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <strong>Ubicación seleccionada:</strong><br />
                          {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyCoordinates}
                          className="ml-2"
                        >
                          {coordinatesCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
              
              <TabsContent value="boundary" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant={isDrawingBoundary ? "destructive" : "default"}
                    onClick={toggleBoundaryDrawing}
                  >
                    {isDrawingBoundary ? 'Terminar Dibujo' : 'Iniciar Dibujo'}
                  </Button>
                  
                  {selectedBoundary.length > 0 && (
                    <Badge variant="outline">
                      {selectedBoundary.length} puntos
                    </Badge>
                  )}
                </div>
                
                {isDrawingBoundary && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Target className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Haz clic en el mapa para agregar puntos al área. Mínimo 3 puntos requeridos.
                    </AlertDescription>
                  </Alert>
                )}
                
                {selectedBoundary.length > 2 && !isDrawingBoundary && (
                  <Alert className="border-green-200 bg-green-50">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Área delimitada:</strong> {selectedBoundary.length} puntos, 
                      ~{calculatePolygonArea(selectedBoundary).toFixed(2)} hectáreas
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          )}
          
          {/* Puntos múltiples */}
          {allowMultiplePoints && multiplePoints.length > 0 && (
            <div className="space-y-2">
              <Label>Puntos Agregados ({multiplePoints.length})</Label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {multiplePoints.map((point, index) => (
                  <div key={point.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{index + 1}. {point.name}</span>
                      <div className="text-xs text-gray-500">
                        {point.location.latitude.toFixed(4)}, {point.location.longitude.toFixed(4)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMultiplePoint(point.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Controles adicionales */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="coordinates"
                  checked={showCoordinates}
                  onCheckedChange={setShowCoordinates}
                />
                <Label htmlFor="coordinates" className="text-sm">Mostrar coordenadas</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="mapType" className="text-sm">Tipo:</Label>
                <select
                  id="mapType"
                  value={mapType}
                  onChange={(e) => setMapType(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="roadmap">Mapa</option>
                  <option value="satellite">Satélite</option>
                  <option value="terrain">Terreno</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportLocationData}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Contenedor del mapa */}
      <Card>
        <CardContent className="p-0">
          <div 
            ref={mapRef} 
            style={{ height }} 
            className="w-full rounded-lg overflow-hidden"
          />
        </CardContent>
      </Card>
      
      {/* Información de coordenadas */}
      {showCoordinates && selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Latitud</Label>
                  <div className="font-mono font-medium">{selectedLocation.latitude.toFixed(6)}</div>
                </div>
                <div>
                  <Label>Longitud</Label>
                  <div className="font-mono font-medium">{selectedLocation.longitude.toFixed(6)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
});

LocationPicker.displayName = 'LocationPicker';

export default LocationPicker;