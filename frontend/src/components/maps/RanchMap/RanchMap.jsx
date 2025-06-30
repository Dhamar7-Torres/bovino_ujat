import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Home, Layers, Filter, Eye, Navigation, Satellite, Download, Upload, Settings, Users, Ruler, Zap } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGeolocation } from '../hooks/useGeolocation';
import { ranchMapService } from '../services/ranchMapService';

const RanchMap = () => {
  // Estados principales del mapa
  const [ranchesData, setRanchesData] = useState([]);
  const [selectedRanch, setSelectedRanch] = useState(null);
  const [mapConfig, setMapConfig] = useState({
    center: [17.9869, -92.9303], // Coordenadas de Tabasco
    zoom: 10,
    mapType: 'satellite',
    showBoundaries: true,
    showLabels: true,
    showFacilities: true,
    showSections: false,
    showBovines: false,
    opacity: 0.7
  });

  // Estados de filtros
  const [filters, setFilters] = useState({
    ranchType: 'all', // dairy, beef, mixed, all
    ranchSize: 'all', // small, medium, large, all
    hasElectricity: false,
    hasWater: false,
    hasVeterinaryFacilities: false,
    hasMilkingParlor: false,
    searchTerm: ''
  });

  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showRanchInfo, setShowRanchInfo] = useState(false);
  const [currentView, setCurrentView] = useState('overview'); // overview, detailed, analysis

  // Estados de análisis
  const [mapAnalysis, setMapAnalysis] = useState({
    totalArea: 0,
    averageSize: 0,
    ranchDensity: 0,
    coveragePercentage: 0,
    facilitiesDistribution: {}
  });

  // Estados de medición
  const [measurementMode, setMeasurementMode] = useState(false);
  const [measurements, setMeasurements] = useState([]);

  // Referencias para el mapa
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const ranchLayersRef = useRef({});
  const facilitiesLayersRef = useRef([]);
  const measurementLayersRef = useRef([]);

  // Hook personalizado para geolocalización
  const { location, getCurrentLocation } = useGeolocation();

  // Efectos principales
  useEffect(() => {
    initializeMap();
    fetchRanchesData();
  }, []);

  useEffect(() => {
    updateMapLayers();
  }, [ranchesData, mapConfig, filters]);

  useEffect(() => {
    calculateMapAnalysis();
  }, [ranchesData]);

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

    // Remover capas base existentes
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

    // Agregar nueva capa base
    const baseLayer = L.tileLayer(mapUrls[mapConfig.mapType], {
      attribution: mapConfig.mapType === 'satellite' 
        ? '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    });

    baseLayer.addTo(mapInstanceRef.current);

    // Agregar capa de etiquetas si está en modo satélite y se requieren etiquetas
    if (mapConfig.mapType === 'satellite' && mapConfig.showLabels) {
      const labelsLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        opacity: 0.4,
        maxZoom: 18,
      });
      labelsLayer.addTo(mapInstanceRef.current);
    }
  };

  // Función para obtener datos de ranchos
  const fetchRanchesData = async () => {
    try {
      setIsLoading(true);
      const response = await ranchMapService.getRanchesWithBoundaries();
      setRanchesData(response.data);
    } catch (error) {
      console.error('Error al cargar datos de ranchos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar capas del mapa
  const updateMapLayers = async () => {
    if (!mapInstanceRef.current) return;

    try {
      const L = await import('leaflet');

      // Limpiar capas existentes de ranchos
      Object.values(ranchLayersRef.current).forEach(layer => {
        mapInstanceRef.current.removeLayer(layer);
      });
      ranchLayersRef.current = {};

      // Limpiar capas de facilities
      facilitiesLayersRef.current.forEach(layer => {
        mapInstanceRef.current.removeLayer(layer);
      });
      facilitiesLayersRef.current = [];

      // Filtrar ranchos según criterios
      const filteredRanches = filterRanches();

      // Agregar capas de ranchos
      filteredRanches.forEach(ranch => {
        addRanchLayer(L, ranch);
        
        if (mapConfig.showFacilities) {
          addFacilitiesLayer(L, ranch);
        }
      });

    } catch (error) {
      console.error('Error al actualizar capas del mapa:', error);
    }
  };

  // Función para filtrar ranchos
  const filterRanches = () => {
    return ranchesData.filter(ranch => {
      // Filtro por tipo
      if (filters.ranchType !== 'all' && ranch.ranchType !== filters.ranchType) return false;
      
      // Filtro por tamaño
      if (filters.ranchSize !== 'all') {
        const size = getRanchSizeCategory(ranch.surfaceHectares);
        if (size !== filters.ranchSize) return false;
      }
      
      // Filtros por servicios
      if (filters.hasElectricity && !ranch.hasElectricity) return false;
      if (filters.hasWater && !ranch.hasWater) return false;
      if (filters.hasVeterinaryFacilities && !ranch.hasVeterinaryFacilities) return false;
      if (filters.hasMilkingParlor && !ranch.hasMilkingParlor) return false;
      
      // Filtro por búsqueda
      if (filters.searchTerm && !ranch.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
      
      return true;
    });
  };

  // Función para agregar capa de rancho
  const addRanchLayer = async (L, ranch) => {
    if (!ranch.boundaries || ranch.boundaries.length === 0) {
      // Si no hay boundaries, mostrar solo un marcador
      addRanchMarker(L, ranch);
      return;
    }

    // Convertir boundaries a formato Leaflet
    const latlngs = ranch.boundaries.map(point => [point.latitude, point.longitude]);

    // Crear polígono del rancho
    const ranchColor = getRanchColor(ranch.ranchType);
    const polygon = L.polygon(latlngs, {
      color: ranchColor,
      fillColor: ranchColor,
      fillOpacity: mapConfig.opacity,
      weight: 2,
      opacity: 0.8
    });

    // Agregar al mapa si showBoundaries está habilitado
    if (mapConfig.showBoundaries) {
      polygon.addTo(mapInstanceRef.current);
    }

    // Configurar eventos del polígono
    polygon.on('click', () => selectRanch(ranch));
    polygon.on('mouseover', () => {
      polygon.setStyle({ weight: 3, opacity: 1 });
    });
    polygon.on('mouseout', () => {
      polygon.setStyle({ weight: 2, opacity: 0.8 });
    });

    // Crear popup con información
    const popupContent = createRanchPopup(ranch);
    polygon.bindPopup(popupContent);

    // Agregar etiqueta del rancho si está habilitado
    if (mapConfig.showLabels) {
      const center = polygon.getBounds().getCenter();
      const marker = L.marker(center, {
        icon: L.divIcon({
          className: 'ranch-label',
          html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; border: 1px solid ${ranchColor}; color: ${ranchColor};">${ranch.name}</div>`,
          iconSize: [100, 20],
          iconAnchor: [50, 10]
        })
      }).addTo(mapInstanceRef.current);
      
      facilitiesLayersRef.current.push(marker);
    }

    ranchLayersRef.current[ranch.id] = polygon;
  };

  // Función para agregar marcador de rancho (cuando no hay boundaries)
  const addRanchMarker = async (L, ranch) => {
    if (!ranch.coordinates) return;

    const ranchColor = getRanchColor(ranch.ranchType);
    const ranchIcon = getRanchIcon(ranch.ranchType);
    
    const marker = L.marker([ranch.coordinates.latitude, ranch.coordinates.longitude], {
      icon: L.divIcon({
        className: 'custom-ranch-marker',
        html: `<div style="background: ${ranchColor}; border-radius: 50%; width: 30px; height: 30px; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${ranchIcon}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })
    }).addTo(mapInstanceRef.current);

    marker.on('click', () => selectRanch(ranch));
    marker.bindPopup(createRanchPopup(ranch));

    ranchLayersRef.current[ranch.id] = marker;
  };

  // Función para agregar capa de instalaciones
  const addFacilitiesLayer = async (L, ranch) => {
    if (!ranch.facilities || ranch.facilities.length === 0) return;

    ranch.facilities.forEach(facility => {
      if (facility.coordinates) {
        const facilityIcon = getFacilityIcon(facility.type);
        const facilityColor = getFacilityColor(facility.type);
        
        const marker = L.marker([facility.coordinates.latitude, facility.coordinates.longitude], {
          icon: L.divIcon({
            className: 'facility-marker',
            html: `<div style="background: ${facilityColor}; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 2px rgba(0,0,0,0.3);">${facilityIcon}</div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })
        }).addTo(mapInstanceRef.current);

        marker.bindPopup(`
          <div style="min-width: 150px;">
            <h3 style="margin: 0 0 8px 0; color: ${facilityColor}; font-weight: bold;">${facilityIcon} ${facility.name}</h3>
            <p style="margin: 4px 0;"><strong>Tipo:</strong> ${facility.type}</p>
            <p style="margin: 4px 0;"><strong>Rancho:</strong> ${ranch.name}</p>
            ${facility.description ? `<p style="margin: 4px 0;"><strong>Descripción:</strong> ${facility.description}</p>` : ''}
          </div>
        `);

        facilitiesLayersRef.current.push(marker);
      }
    });
  };

  // Función para crear popup de rancho
  const createRanchPopup = (ranch) => {
    const ranchIcon = getRanchIcon(ranch.ranchType);
    const area = ranch.surfaceHectares || (ranch.boundaries ? calculatePolygonArea(ranch.boundaries) : 0);
    
    return `
      <div style="min-width: 250px;">
        <h3 style="margin: 0 0 8px 0; color: ${getRanchColor(ranch.ranchType)}; font-weight: bold;">${ranchIcon} ${ranch.name}</h3>
        <div style="margin-bottom: 8px;">
          <span style="background: ${getRanchColor(ranch.ranchType)}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">${getRanchTypeLabel(ranch.ranchType)}</span>
        </div>
        <p style="margin: 4px 0;"><strong>Área:</strong> ${area.toFixed(1)} hectáreas</p>
        <p style="margin: 4px 0;"><strong>Propietario:</strong> ${ranch.ownerName}</p>
        <p style="margin: 4px 0;"><strong>Encargado:</strong> ${ranch.managerName}</p>
        <p style="margin: 4px 0;"><strong>Ubicación:</strong> ${ranch.municipality}, ${ranch.stateName}</p>
        
        <div style="margin-top: 8px; display: flex; flex-wrap: gap: 4px;">
          ${ranch.hasElectricity ? '<span style="background: #FEF3C7; color: #92400E; padding: 1px 4px; border-radius: 2px; font-size: 10px;">⚡ Electricidad</span>' : ''}
          ${ranch.hasWater ? '<span style="background: #DBEAFE; color: #1D4ED8; padding: 1px 4px; border-radius: 2px; font-size: 10px;">💧 Agua</span>' : ''}
          ${ranch.hasVeterinaryFacilities ? '<span style="background: #FEE2E2; color: #DC2626; padding: 1px 4px; border-radius: 2px; font-size: 10px;">🏥 Veterinaria</span>' : ''}
          ${ranch.hasMilkingParlor ? '<span style="background: #F3E8FF; color: #7C3AED; padding: 1px 4px; border-radius: 2px; font-size: 10px;">🥛 Ordeño</span>' : ''}
        </div>
        
        <div style="margin-top: 8px; text-align: center;">
          <button onclick="window.selectRanchFromMap('${ranch.id}')" style="background: ${getRanchColor(ranch.ranchType)}; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">Ver Detalles</button>
        </div>
      </div>
    `;
  };

  // Función para seleccionar rancho
  const selectRanch = (ranch) => {
    setSelectedRanch(ranch);
    setShowRanchInfo(true);

    // Resaltar rancho seleccionado
    Object.entries(ranchLayersRef.current).forEach(([ranchId, layer]) => {
      if (ranchId === ranch.id) {
        if (layer.setStyle) {
          layer.setStyle({ weight: 4, color: '#FF0000', opacity: 1 });
        }
      } else {
        if (layer.setStyle) {
          const color = getRanchColor(ranchesData.find(r => r.id === ranchId)?.ranchType || 'mixed');
          layer.setStyle({ weight: 2, color: color, opacity: 0.8 });
        }
      }
    });

    // Centrar mapa en el rancho
    if (ranch.boundaries && ranch.boundaries.length > 0) {
      const L = window.L || require('leaflet');
      const bounds = L.latLngBounds(ranch.boundaries.map(p => [p.latitude, p.longitude]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
    } else if (ranch.coordinates) {
      mapInstanceRef.current.setView([ranch.coordinates.latitude, ranch.coordinates.longitude], 15);
    }
  };

  // Exponer función para seleccionar desde popup
  useEffect(() => {
    window.selectRanchFromMap = (ranchId) => {
      const ranch = ranchesData.find(r => r.id === ranchId);
      if (ranch) {
        selectRanch(ranch);
      }
    };

    return () => {
      delete window.selectRanchFromMap;
    };
  }, [ranchesData]);

  // Función para calcular análisis del mapa
  const calculateMapAnalysis = () => {
    if (ranchesData.length === 0) return;

    const totalArea = ranchesData.reduce((sum, ranch) => {
      return sum + (ranch.surfaceHectares || calculatePolygonArea(ranch.boundaries || []));
    }, 0);

    const averageSize = totalArea / ranchesData.length;

    const facilitiesDistribution = ranchesData.reduce((acc, ranch) => {
      if (ranch.hasElectricity) acc.electricity = (acc.electricity || 0) + 1;
      if (ranch.hasWater) acc.water = (acc.water || 0) + 1;
      if (ranch.hasVeterinaryFacilities) acc.veterinary = (acc.veterinary || 0) + 1;
      if (ranch.hasMilkingParlor) acc.milking = (acc.milking || 0) + 1;
      return acc;
    }, {});

    setMapAnalysis({
      totalArea: totalArea.toFixed(1),
      averageSize: averageSize.toFixed(1),
      ranchDensity: (ranchesData.length / totalArea * 1000).toFixed(2), // ranchos por 1000 hectáreas
      coveragePercentage: ((totalArea / 10000) * 100).toFixed(2), // porcentaje de cobertura estimada
      facilitiesDistribution
    });
  };

  // Funciones auxiliares para colores e iconos
  const getRanchColor = (type) => {
    switch (type) {
      case 'dairy': return '#3B82F6';
      case 'beef': return '#EF4444';
      case 'mixed': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getRanchIcon = (type) => {
    switch (type) {
      case 'dairy': return '🥛';
      case 'beef': return '🥩';
      case 'mixed': return '🐄';
      default: return '🏡';
    }
  };

  const getRanchTypeLabel = (type) => {
    switch (type) {
      case 'dairy': return 'Lechero';
      case 'beef': return 'Cárnico';
      case 'mixed': return 'Mixto';
      default: return 'Otro';
    }
  };

  const getFacilityIcon = (type) => {
    switch (type) {
      case 'veterinary': return '🏥';
      case 'milking': return '🥛';
      case 'storage': return '📦';
      case 'office': return '🏢';
      default: return '🏗️';
    }
  };

  const getFacilityColor = (type) => {
    switch (type) {
      case 'veterinary': return '#EF4444';
      case 'milking': return '#8B5CF6';
      case 'storage': return '#F59E0B';
      case 'office': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getRanchSizeCategory = (hectares) => {
    if (hectares < 50) return 'small';
    if (hectares < 200) return 'medium';
    return 'large';
  };

  // Función para calcular área del polígono
  const calculatePolygonArea = (boundary) => {
    if (!boundary || boundary.length < 3) return 0;
    
    let area = 0;
    const n = boundary.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += boundary[i].longitude * boundary[j].latitude;
      area -= boundary[j].longitude * boundary[i].latitude;
    }
    
    area = Math.abs(area) / 2;
    const metersSquared = area * 111000 * 111000;
    return metersSquared / 10000; // hectáreas
  };

  // Función para manejar clics en el mapa
  const handleMapClick = (e) => {
    if (measurementMode) {
      addMeasurementPoint(e.latlng);
    }
  };

  // Función para agregar punto de medición
  const addMeasurementPoint = async (latlng) => {
    const L = await import('leaflet');
    
    const marker = L.marker(latlng, {
      icon: L.divIcon({
        className: 'measurement-marker',
        html: '<div style="background: #FF0000; border-radius: 50%; width: 8px; height: 8px; border: 2px solid white;"></div>',
        iconSize: [8, 8],
        iconAnchor: [4, 4]
      })
    }).addTo(mapInstanceRef.current);

    setMeasurements(prev => {
      const newMeasurements = [...prev, { lat: latlng.lat, lng: latlng.lng }];
      
      // Si hay más de un punto, dibujar línea
      if (newMeasurements.length > 1) {
        const lastTwo = newMeasurements.slice(-2);
        const line = L.polyline(lastTwo.map(p => [p.lat, p.lng]), {
          color: '#FF0000',
          weight: 2
        }).addTo(mapInstanceRef.current);
        
        // Calcular distancia
        const distance = mapInstanceRef.current.distance(
          [lastTwo[0].lat, lastTwo[0].lng],
          [lastTwo[1].lat, lastTwo[1].lng]
        );
        
        // Agregar etiqueta de distancia
        const midpoint = [(lastTwo[0].lat + lastTwo[1].lat) / 2, (lastTwo[0].lng + lastTwo[1].lng) / 2];
        const distanceLabel = L.marker(midpoint, {
          icon: L.divIcon({
            className: 'distance-label',
            html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 4px; border-radius: 3px; font-size: 10px; border: 1px solid #FF0000;">${(distance / 1000).toFixed(2)} km</div>`,
            iconSize: [60, 16],
            iconAnchor: [30, 8]
          })
        }).addTo(mapInstanceRef.current);
        
        measurementLayersRef.current.push(line, distanceLabel);
      }
      
      measurementLayersRef.current.push(marker);
      return newMeasurements;
    });
  };

  // Función para limpiar mediciones
  const clearMeasurements = () => {
    measurementLayersRef.current.forEach(layer => {
      mapInstanceRef.current.removeLayer(layer);
    });
    measurementLayersRef.current = [];
    setMeasurements([]);
  };

  // Función para manejar cambios de zoom
  const handleZoomChange = () => {
    if (mapInstanceRef.current) {
      const zoom = mapInstanceRef.current.getZoom();
      setMapConfig(prev => ({ ...prev, zoom }));
    }
  };

  // Función para centrar en ubicación del usuario
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
      mapConfig,
      filters,
      analysis: mapAnalysis,
      ranches: ranchesData.map(ranch => ({
        id: ranch.id,
        name: ranch.name,
        type: ranch.ranchType,
        area: ranch.surfaceHectares,
        boundaries: ranch.boundaries,
        coordinates: ranch.coordinates,
        facilities: ranch.facilities
      }))
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ranch-map-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  // Función para actualizar filtros
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
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
              <Home className="w-6 h-6 text-green-600" />
              Mapa de Ranchos
            </h1>
            <p className="text-gray-600">Visualiza y gestiona la distribución de ranchos y sus instalaciones</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Estadísticas rápidas */}
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-green-600">{ranchesData.length}</div>
                <div className="text-gray-600">Ranchos</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600">{mapAnalysis.totalArea}</div>
                <div className="text-gray-600">Hectáreas</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">{mapAnalysis.averageSize}</div>
                <div className="text-gray-600">Promedio</div>
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
                          <SelectItem value="satellite">Satélite</SelectItem>
                          <SelectItem value="roadmap">Mapa de Carreteras</SelectItem>
                          <SelectItem value="hybrid">Híbrido</SelectItem>
                          <SelectItem value="terrain">Terreno</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Mostrar en Mapa</Label>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Límites de Ranchos</span>
                        <Switch
                          checked={mapConfig.showBoundaries}
                          onCheckedChange={(checked) => updateMapConfig('showBoundaries', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Etiquetas</span>
                        <Switch
                          checked={mapConfig.showLabels}
                          onCheckedChange={(checked) => updateMapConfig('showLabels', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Instalaciones</span>
                        <Switch
                          checked={mapConfig.showFacilities}
                          onCheckedChange={(checked) => updateMapConfig('showFacilities', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Secciones</span>
                        <Switch
                          checked={mapConfig.showSections}
                          onCheckedChange={(checked) => updateMapConfig('showSections', checked)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Opacidad de Ranchos</Label>
                      <Slider
                        value={[mapConfig.opacity * 100]}
                        onValueChange={(value) => updateMapConfig('opacity', value[0] / 100)}
                        max={100}
                        step={10}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500 text-center">{Math.round(mapConfig.opacity * 100)}%</div>
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
                  <h3 className="font-medium">Filtros de Ranchos</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="search">Buscar Rancho</Label>
                      <Input
                        id="search"
                        placeholder="Nombre del rancho..."
                        value={filters.searchTerm}
                        onChange={(e) => updateFilter('searchTerm', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ranchType">Tipo de Rancho</Label>
                      <Select value={filters.ranchType} onValueChange={(value) => updateFilter('ranchType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="dairy">🥛 Lechero</SelectItem>
                          <SelectItem value="beef">🥩 Cárnico</SelectItem>
                          <SelectItem value="mixed">🐄 Mixto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="ranchSize">Tamaño</Label>
                      <Select value={filters.ranchSize} onValueChange={(value) => updateFilter('ranchSize', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="small">Pequeño (&lt;50 ha)</SelectItem>
                          <SelectItem value="medium">Mediano (50-200 ha)</SelectItem>
                          <SelectItem value="large">Grande (&gt;200 ha)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Servicios Requeridos</Label>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">⚡ Electricidad</span>
                        <Switch
                          checked={filters.hasElectricity}
                          onCheckedChange={(checked) => updateFilter('hasElectricity', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">💧 Agua Potable</span>
                        <Switch
                          checked={filters.hasWater}
                          onCheckedChange={(checked) => updateFilter('hasWater', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">🏥 Instalaciones Veterinarias</span>
                        <Switch
                          checked={filters.hasVeterinaryFacilities}
                          onCheckedChange={(checked) => updateFilter('hasVeterinaryFacilities', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">🥛 Sala de Ordeño</span>
                        <Switch
                          checked={filters.hasMilkingParlor}
                          onCheckedChange={(checked) => updateFilter('hasMilkingParlor', checked)}
                        />
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" onClick={() => {
                      setFilters({
                        ranchType: 'all',
                        ranchSize: 'all',
                        hasElectricity: false,
                        hasWater: false,
                        hasVeterinaryFacilities: false,
                        hasMilkingParlor: false,
                        searchTerm: ''
                      });
                    }} className="w-full">
                      Limpiar Filtros
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button
              variant={measurementMode ? "destructive" : "outline"}
              size="sm"
              onClick={() => setMeasurementMode(!measurementMode)}
            >
              <Ruler className="w-4 h-4 mr-2" />
              {measurementMode ? 'Terminar Medición' : 'Medir'}
            </Button>
            
            {measurements.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearMeasurements}>
                Limpiar
              </Button>
            )}
            
            <Button variant="outline" size="sm" onClick={exportMapData}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Contenedor principal con mapa e información */}
      <motion.div variants={itemVariants} className="flex-1 flex">
        {/* Mapa principal */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />
          
          {/* Indicador de carga */}
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                  <span>Cargando ranchos...</span>
                </div>
              </Card>
            </div>
          )}
          
          {/* Indicador de modo medición */}
          {measurementMode && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
              <Alert className="border-blue-200 bg-blue-50">
                <Ruler className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Modo medición activo. Haz clic en el mapa para medir distancias.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          {/* Leyenda del mapa */}
          <Card className="absolute bottom-4 left-4 p-4 z-10 bg-white/90 backdrop-blur">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-sm">Leyenda</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded"></div>
                  <span>🥛 Lechero</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 border-2 border-white rounded"></div>
                  <span>🥩 Cárnico</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 border-2 border-white rounded"></div>
                  <span>🐄 Mixto</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>🏥 Veterinaria</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>🥛 Sala Ordeño</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Panel lateral de información */}
        <AnimatePresence>
          {showRanchInfo && selectedRanch && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white border-l shadow-lg overflow-hidden"
            >
              <div className="h-full overflow-y-auto">
                <Card className="h-full border-0">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getRanchIcon(selectedRanch.ranchType)}
                        {selectedRanch.name}
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowRanchInfo(false)}
                      >
                        ✕
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={selectedRanch.ranchType === 'dairy' ? 'blue' : 
                                    selectedRanch.ranchType === 'beef' ? 'destructive' : 'purple'}>
                        {getRanchTypeLabel(selectedRanch.ranchType)}
                      </Badge>
                      <Badge variant="outline">
                        {(selectedRanch.surfaceHectares || calculatePolygonArea(selectedRanch.boundaries || [])).toFixed(1)} ha
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 space-y-6">
                    {/* Información básica */}
                    <div>
                      <h3 className="font-medium mb-3">Información General</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Propietario:</span>
                          <span>{selectedRanch.ownerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Encargado:</span>
                          <span>{selectedRanch.managerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Teléfono:</span>
                          <span>{selectedRanch.contactPhone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ubicación:</span>
                          <span>{selectedRanch.municipality}, {selectedRanch.stateName}</span>
                        </div>
                        {selectedRanch.capacity && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Capacidad:</span>
                            <span>{selectedRanch.capacity} bovinos</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Servicios */}
                    <div>
                      <h3 className="font-medium mb-3">Servicios Disponibles</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`p-2 rounded text-center text-xs ${
                          selectedRanch.hasElectricity ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <div>⚡</div>
                          <div>Electricidad</div>
                        </div>
                        <div className={`p-2 rounded text-center text-xs ${
                          selectedRanch.hasWater ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <div>💧</div>
                          <div>Agua</div>
                        </div>
                        <div className={`p-2 rounded text-center text-xs ${
                          selectedRanch.hasVeterinaryFacilities ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <div>🏥</div>
                          <div>Veterinaria</div>
                        </div>
                        <div className={`p-2 rounded text-center text-xs ${
                          selectedRanch.hasMilkingParlor ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <div>🥛</div>
                          <div>Ordeño</div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Estadísticas del rancho */}
                    <div>
                      <h3 className="font-medium mb-3">Estadísticas</h3>
                      <div className="space-y-3">
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedRanch.bovineCount || 0}
                          </div>
                          <div className="text-xs text-green-700">Bovinos Registrados</div>
                        </div>
                        
                        {selectedRanch.lastProductionDate && (
                          <div className="text-center p-3 bg-blue-50 rounded">
                            <div className="text-sm font-medium text-blue-600">
                              Última Producción
                            </div>
                            <div className="text-xs text-blue-700">
                              {new Date(selectedRanch.lastProductionDate).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedRanch.coordinates && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-medium mb-3">Coordenadas GPS</h3>
                          <div className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded">
                            <div>Lat: {selectedRanch.coordinates.latitude.toFixed(6)}</div>
                            <div>Lng: {selectedRanch.coordinates.longitude.toFixed(6)}</div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default RanchMap;