// src/pages/maps/MapView.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Layers,
  Navigation,
  Search,
  Filter,
  Plus,
  Eye,
  Info,
  Crosshair,
  Maximize,
  Settings,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'

// Nota: Este componente simula la integración con Leaflet
// En implementación real, importarías: import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

// Componente de mapa interactivo con geolocalización
const MapView = () => {
  const mapRef = useRef(null)
  const [mapData, setMapData] = useState({
    center: [20.5888, -100.3899], // Coordenadas de Querétaro, México
    zoom: 12,
    markers: []
  })
  
  const [selectedLayer, setSelectedLayer] = useState('bovines')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [userLocation, setUserLocation] = useState(null)

  // Datos de ejemplo de marcadores
  const sampleMarkers = [
    {
      id: 1,
      type: 'bovine',
      position: [20.5888, -100.3899],
      title: 'Esperanza (BOV-001)',
      description: 'Holstein - Potrero A-1',
      status: 'Saludable',
      lastUpdate: '2024-06-20',
      details: {
        weight: '420 kg',
        age: '2 años',
        lactating: true,
        health: 'Excelente'
      }
    },
    {
      id: 2,
      type: 'bovine',
      position: [20.5950, -100.3920],
      title: 'Toro Bravo (BOV-002)',
      description: 'Angus - Potrero B-2',
      status: 'Saludable',
      lastUpdate: '2024-06-18',
      details: {
        weight: '680 kg',
        age: '3 años',
        lactating: false,
        health: 'Buena'
      }
    },
    {
      id: 3,
      type: 'event',
      position: [20.5820, -100.3950],
      title: 'Vacunación Programada',
      description: 'Aplicación de vacuna triple bovina',
      status: 'Pendiente',
      lastUpdate: '2024-06-22',
      details: {
        veterinarian: 'Dr. Juan Pérez',
        time: '09:00 AM',
        bovines: 5,
        type: 'Vacunación'
      }
    },
    {
      id: 4,
      type: 'facility',
      position: [20.5900, -100.3850],
      title: 'Clínica Veterinaria',
      description: 'Instalación médica principal',
      status: 'Operativa',
      lastUpdate: '2024-06-20',
      details: {
        capacity: '10 bovinos',
        equipment: 'Completo',
        staff: '2 veterinarios',
        hours: '24/7'
      }
    },
    {
      id: 5,
      type: 'pasture',
      position: [20.5970, -100.3880],
      title: 'Potrero Norte',
      description: 'Área de pastoreo principal',
      status: 'Disponible',
      lastUpdate: '2024-06-19',
      details: {
        area: '15 hectáreas',
        capacity: '25 bovinos',
        waterSources: 3,
        grassType: 'Bermuda'
      }
    },
    {
      id: 6,
      type: 'emergency',
      position: [20.5850, -100.3980],
      title: 'Emergencia - Bovino Herido',
      description: 'Luna (BOV-003) - Cojera',
      status: 'Atención Inmediata',
      lastUpdate: '2024-06-22',
      details: {
        severity: 'Media',
        veterinarian: 'En camino',
        timeReported: '14:30',
        description: 'Cojera en pata trasera'
      }
    }
  ]

  // Cargar marcadores
  useEffect(() => {
    setMapData(prev => ({
      ...prev,
      markers: sampleMarkers
    }))
  }, [])

  // Obtener ubicación del usuario
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = [position.coords.latitude, position.coords.longitude]
          setUserLocation(newLocation)
          setMapData(prev => ({
            ...prev,
            center: newLocation,
            zoom: 15
          }))
          toast.success('Ubicación actualizada')
        },
        (error) => {
          toast.error('Error al obtener ubicación: ' + error.message)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000
        }
      )
    } else {
      toast.error('Geolocalización no soportada')
    }
  }

  // Filtrar marcadores por capa seleccionada
  const getFilteredMarkers = () => {
    let filtered = mapData.markers

    if (selectedLayer !== 'all') {
      filtered = filtered.filter(marker => marker.type === selectedLayer)
    }

    if (searchTerm) {
      filtered = filtered.filter(marker => 
        marker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        marker.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  // Obtener color del marcador según tipo
  const getMarkerColor = (type, status) => {
    switch (type) {
      case 'bovine':
        return status === 'Saludable' ? '#10B981' : '#EF4444'
      case 'event':
        return status === 'Pendiente' ? '#F59E0B' : '#3B82F6'
      case 'facility':
        return '#8B5CF6'
      case 'pasture':
        return '#059669'
      case 'emergency':
        return '#DC2626'
      default:
        return '#6B7280'
    }
  }

  // Obtener icono del marcador
  const getMarkerIcon = (type) => {
    switch (type) {
      case 'bovine':
        return '🐄'
      case 'event':
        return '📅'
      case 'facility':
        return '🏥'
      case 'pasture':
        return '🌱'
      case 'emergency':
        return '🚨'
      default:
        return '📍'
    }
  }

  // Capas disponibles
  const layers = [
    { id: 'all', name: 'Todos', icon: <Layers className="w-4 h-4" />, count: mapData.markers.length },
    { id: 'bovines', name: 'Bovinos', icon: '🐄', count: mapData.markers.filter(m => m.type === 'bovine').length },
    { id: 'event', name: 'Eventos', icon: '📅', count: mapData.markers.filter(m => m.type === 'event').length },
    { id: 'facility', name: 'Instalaciones', icon: '🏥', count: mapData.markers.filter(m => m.type === 'facility').length },
    { id: 'pasture', name: 'Potreros', icon: '🌱', count: mapData.markers.filter(m => m.type === 'pasture').length },
    { id: 'emergency', name: 'Emergencias', icon: '🚨', count: mapData.markers.filter(m => m.type === 'emergency').length }
  ]

  // Alternar pantalla completa
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    // En implementación real, usarías la API de Fullscreen
  }

  // Exportar datos del mapa
  const exportMapData = () => {
    const dataToExport = {
      center: mapData.center,
      zoom: mapData.zoom,
      markers: getFilteredMarkers(),
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'mapa-bovinos.json'
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Datos del mapa exportados')
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'} bg-gray-100 dark:bg-gray-900 relative`}>
      {/* Header */}
      {!isFullscreen && (
        <motion.div
          className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Mapa del Rancho
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Geolocalización y seguimiento en tiempo real
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={getCurrentLocation}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Mi Ubicación</span>
              </button>
              
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex h-full">
        {/* Panel lateral */}
        <motion.div
          className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
            showControls ? 'w-80' : 'w-0'
          } overflow-hidden`}
          initial={{ x: -320 }}
          animate={{ x: showControls ? 0 : -320 }}
        >
          <div className="p-4 h-full overflow-y-auto">
            {/* Controles de búsqueda */}
            <div className="mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar en el mapa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              {/* Selector de capas */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Capas del Mapa
                </h3>
                {layers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedLayer === layer.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">
                        {typeof layer.icon === 'string' ? layer.icon : layer.icon}
                      </span>
                      <span className="text-sm font-medium">{layer.name}</span>
                    </div>
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                      {layer.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de marcadores */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Elementos en el Mapa ({getFilteredMarkers().length})
              </h3>
              <div className="space-y-2">
                {getFilteredMarkers().map((marker) => (
                  <motion.div
                    key={marker.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedMarker?.id === marker.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedMarker(marker)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: getMarkerColor(marker.type, marker.status) }}
                      >
                        {getMarkerIcon(marker.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {marker.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {marker.description}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            marker.status === 'Saludable' || marker.status === 'Operativa' || marker.status === 'Disponible'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : marker.status === 'Pendiente'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {marker.status}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(marker.lastUpdate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Área del mapa */}
        <div className="flex-1 relative">
          {/* Botón para mostrar/ocultar controles */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="absolute top-4 left-4 z-10 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Controles del mapa */}
          <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
            <button
              onClick={getCurrentLocation}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all"
              title="Centrar en mi ubicación"
            >
              <Crosshair className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <button
              onClick={exportMapData}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all"
              title="Exportar datos"
            >
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all"
              title="Pantalla completa"
            >
              <Maximize className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Simulación del mapa (en implementación real sería MapContainer de react-leaflet) */}
          <div 
            ref={mapRef}
            className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(120, 220, 120, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(120, 180, 220, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(180, 220, 120, 0.2) 0%, transparent 50%)
              `
            }}
          >
            {/* Simulación de marcadores en el mapa */}
            {getFilteredMarkers().map((marker, index) => (
              <motion.div
                key={marker.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${20 + (index * 15) % 60}%`,
                  top: `${30 + (index * 12) % 40}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.2 }}
                onClick={() => setSelectedMarker(marker)}
              >
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: getMarkerColor(marker.type, marker.status) }}
                >
                  {getMarkerIcon(marker.type)}
                </div>
                
                {/* Popup del marcador */}
                {selectedMarker?.id === marker.id && (
                  <motion.div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-sm">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {marker.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {marker.description}
                      </p>
                      
                      <div className="space-y-1 text-xs">
                        {Object.entries(marker.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                            </span>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          marker.status === 'Saludable' || marker.status === 'Operativa' || marker.status === 'Disponible'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : marker.status === 'Pendiente'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {marker.status}
                        </span>
                        
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <Eye className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <Info className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Flecha del popup */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {/* Ubicación del usuario */}
            {userLocation && (
              <motion.div
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full opacity-30 animate-ping absolute -top-2 -left-2"></div>
                </div>
              </motion.div>
            )}

            {/* Escala del mapa */}
            <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-3 py-1 text-xs text-gray-600 dark:text-gray-400">
              Escala: 1 km
            </div>

            {/* Coordenadas */}
            <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-3 py-1 text-xs text-gray-600 dark:text-gray-400">
              {mapData.center[0].toFixed(4)}, {mapData.center[1].toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      {/* Panel de información flotante */}
      {selectedMarker && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-6 z-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: getMarkerColor(selectedMarker.type, selectedMarker.status) }}
              >
                {getMarkerIcon(selectedMarker.type)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedMarker.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedMarker.description}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedMarker(null)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(selectedMarker.details).map(([key, value]) => (
              <div key={key}>
                <span className="text-gray-500 dark:text-gray-400 capitalize block">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedMarker.status === 'Saludable' || selectedMarker.status === 'Operativa' || selectedMarker.status === 'Disponible'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : selectedMarker.status === 'Pendiente'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {selectedMarker.status}
            </span>
            
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                Ver Detalles
              </button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Navegar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default MapView