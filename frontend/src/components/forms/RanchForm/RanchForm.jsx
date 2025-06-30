import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, MapPin, Calendar, Home, Users, Ruler, Phone, Mail, Edit, Trash2, Eye, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useGeolocation } from '../hooks/useGeolocation';
import { ranchService } from '../services/ranchService';

const RanchForm = () => {
  // Estados principales del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    surfaceHectares: '',
    stateId: '',
    municipality: '',
    address: '',
    zipCode: '',
    ownerId: '',
    managerName: '',
    contactPhone: '',
    contactEmail: '',
    establishedDate: null,
    ranchType: 'dairy', // dairy, beef, mixed
    capacity: '',
    numberOfSections: '',
    hasElectricity: true,
    hasWater: true,
    hasVeterinaryFacilities: false,
    hasMilkingParlor: false,
    notes: ''
  });

  // Estados para la gestión del formulario
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [states, setStates] = useState([]);
  const [owners, setOwners] = useState([]);
  const [ranches, setRanches] = useState([]);
  const [filteredRanches, setFilteredRanches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Estados para modales y vistas
  const [showForm, setShowForm] = useState(false);
  const [editingRanch, setEditingRanch] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRanch, setSelectedRanch] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // Estados para ubicación y mapa
  const [mapLocation, setMapLocation] = useState(null);
  const [boundaries, setBoundaries] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);

  // Hook personalizado para geolocalización
  const { location, error: locationError, getCurrentLocation } = useGeolocation();

  // Efectos para cargar datos iniciales
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Efecto para filtrar ranchos
  useEffect(() => {
    filterRanches();
  }, [ranches, searchTerm, filterState, filterType]);

  // Función para obtener datos iniciales
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [statesRes, ownersRes, ranchesRes] = await Promise.all([
        ranchService.getStates(),
        ranchService.getOwners(),
        ranchService.getRanches()
      ]);

      setStates(statesRes.data);
      setOwners(ownersRes.data);
      setRanches(ranchesRes.data);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para filtrar ranchos
  const filterRanches = () => {
    let filtered = ranches;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(ranch =>
        ranch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ranch.municipality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ranch.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (filterState !== 'all') {
      filtered = filtered.filter(ranch => ranch.stateId === filterState);
    }

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(ranch => ranch.ranchType === filterType);
    }

    setFilteredRanches(filtered);
  };

  // Función para manejar cambios en los inputs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo específico
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Ingresa el nombre del rancho';
    if (!formData.surfaceHectares || formData.surfaceHectares <= 0) {
      newErrors.surfaceHectares = 'Ingresa una superficie válida';
    }
    if (!formData.stateId) newErrors.stateId = 'Selecciona el estado';
    if (!formData.municipality.trim()) newErrors.municipality = 'Ingresa el municipio';
    if (!formData.address.trim()) newErrors.address = 'Ingresa la dirección';
    if (!formData.ownerId) newErrors.ownerId = 'Selecciona el propietario';
    if (!formData.managerName.trim()) newErrors.managerName = 'Ingresa el nombre del encargado';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Ingresa el teléfono de contacto';
    if (formData.contactEmail && !isValidEmail(formData.contactEmail)) {
      newErrors.contactEmail = 'Ingresa un email válido';
    }
    if (formData.capacity && formData.capacity <= 0) {
      newErrors.capacity = 'La capacidad debe ser mayor a 0';
    }
    if (formData.numberOfSections && formData.numberOfSections <= 0) {
      newErrors.numberOfSections = 'El número de secciones debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para validar email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      // Obtener ubicación actual si está disponible
      await getCurrentLocation();
      
      const dataToSubmit = {
        ...formData,
        coordinates: location ? {
          latitude: location.latitude,
          longitude: location.longitude
        } : mapLocation,
        boundaries: boundaries.length > 0 ? boundaries : null,
        totalArea: calculateTotalArea(),
        registrationDate: new Date().toISOString()
      };

      if (editingRanch) {
        await ranchService.updateRanch(editingRanch.id, dataToSubmit);
      } else {
        await ranchService.createRanch(dataToSubmit);
      }

      setSuccess(true);
      resetForm();
      await fetchInitialData();

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error('Error al guardar rancho:', error);
      setErrors({ submit: 'Error al guardar. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para calcular área total basada en boundaries
  const calculateTotalArea = () => {
    if (boundaries.length === 0) return parseFloat(formData.surfaceHectares) || 0;
    
    // Aquí implementarías el cálculo real del área usando las coordenadas
    // Por ahora retorna el valor ingresado manualmente
    return parseFloat(formData.surfaceHectares) || 0;
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      surfaceHectares: '',
      stateId: '',
      municipality: '',
      address: '',
      zipCode: '',
      ownerId: '',
      managerName: '',
      contactPhone: '',
      contactEmail: '',
      establishedDate: null,
      ranchType: 'dairy',
      capacity: '',
      numberOfSections: '',
      hasElectricity: true,
      hasWater: true,
      hasVeterinaryFacilities: false,
      hasMilkingParlor: false,
      notes: ''
    });
    setEditingRanch(null);
    setShowForm(false);
    setMapLocation(null);
    setBoundaries([]);
    setErrors({});
  };

  // Función para editar un rancho
  const handleEdit = (ranch) => {
    setFormData({
      name: ranch.name,
      description: ranch.description || '',
      surfaceHectares: ranch.surfaceHectares.toString(),
      stateId: ranch.stateId,
      municipality: ranch.municipality,
      address: ranch.address,
      zipCode: ranch.zipCode || '',
      ownerId: ranch.ownerId,
      managerName: ranch.managerName,
      contactPhone: ranch.contactPhone,
      contactEmail: ranch.contactEmail || '',
      establishedDate: ranch.establishedDate ? new Date(ranch.establishedDate) : null,
      ranchType: ranch.ranchType,
      capacity: ranch.capacity?.toString() || '',
      numberOfSections: ranch.numberOfSections?.toString() || '',
      hasElectricity: ranch.hasElectricity,
      hasWater: ranch.hasWater,
      hasVeterinaryFacilities: ranch.hasVeterinaryFacilities,
      hasMilkingParlor: ranch.hasMilkingParlor,
      notes: ranch.notes || ''
    });
    setMapLocation(ranch.coordinates);
    setBoundaries(ranch.boundaries || []);
    setEditingRanch(ranch);
    setShowForm(true);
  };

  // Función para eliminar un rancho
  const handleDelete = async (ranchId) => {
    if (!window.confirm('¿Estás seguro de eliminar este rancho? Esta acción no se puede deshacer.')) return;

    try {
      setIsLoading(true);
      await ranchService.deleteRanch(ranchId);
      await fetchInitialData();
    } catch (error) {
      console.error('Error al eliminar rancho:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para ver detalles de un rancho
  const handleViewDetails = (ranch) => {
    setSelectedRanch(ranch);
    setShowDetails(true);
  };

  // Función para abrir mapa para seleccionar ubicación
  const openLocationSelector = () => {
    setShowMap(true);
    // Aquí se abriría la integración con geojson.io o un mapa personalizado
    window.open('https://geojson.io/', '_blank');
  };

  // Función para manejar coordenadas del mapa
  const handleMapSelection = (coordinates, boundaryData) => {
    setMapLocation(coordinates);
    setBoundaries(boundaryData || []);
    setShowMap(false);
  };

  // Función para formatear fecha
  const formatDate = (date) => {
    if (!date) return 'Seleccionar fecha';
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Función para obtener icono según tipo de rancho
  const getRanchTypeIcon = (type) => {
    switch(type) {
      case 'dairy': return '🥛';
      case 'beef': return '🥩';
      case 'mixed': return '🐄';
      default: return '🏡';
    }
  };

  // Función para obtener color según tipo de rancho
  const getRanchTypeColor = (type) => {
    switch(type) {
      case 'dairy': return 'blue';
      case 'beef': return 'red';
      case 'mixed': return 'purple';
      default: return 'gray';
    }
  };

  // Animaciones para framer motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
      className="container mx-auto p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header con título y botón para agregar */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Ranchos</h1>
          <p className="text-gray-600">Administra propiedades, ubicaciones y características de los ranchos</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Registrar Rancho
        </Button>
      </motion.div>

      {/* Mensaje de éxito */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Alert className="border-green-200 bg-green-50">
              <Home className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Rancho guardado exitosamente
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estadísticas rápidas */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{ranches.length}</div>
                <p className="text-sm text-gray-600">Total Ranchos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {ranches.reduce((sum, ranch) => sum + (ranch.surfaceHectares || 0), 0).toFixed(1)}
                </div>
                <p className="text-sm text-gray-600">Hectáreas Totales</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {ranches.filter(r => r.ranchType === 'dairy').length}
                </div>
                <p className="text-sm text-gray-600">Lecheros</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {ranches.filter(r => r.hasVeterinaryFacilities).length}
                </div>
                <p className="text-sm text-gray-600">Con Veterinaria</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filtros y búsqueda */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Buscar por nombre, municipio o propietario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="state-filter">Estado</Label>
                <Select value={filterState} onValueChange={setFilterState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {states.map(state => (
                      <SelectItem key={state.id} value={state.id}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type-filter">Tipo de Rancho</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="dairy">Lechero</SelectItem>
                    <SelectItem value="beef">Cárnico</SelectItem>
                    <SelectItem value="mixed">Mixto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => { 
                    setSearchTerm(''); 
                    setFilterState('all'); 
                    setFilterType('all'); 
                  }}
                  className="w-full"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de ranchos */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Ranchos Registrados ({filteredRanches.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando ranchos...</p>
              </div>
            ) : filteredRanches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Home className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No se encontraron ranchos registrados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRanches.map((ranch, index) => (
                  <motion.div
                    key={ranch.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {getRanchTypeIcon(ranch.ranchType)}
                            {ranch.name}
                          </CardTitle>
                          <Badge variant={getRanchTypeColor(ranch.ranchType)}>
                            {ranch.ranchType === 'dairy' ? 'Lechero' : 
                             ranch.ranchType === 'beef' ? 'Cárnico' : 'Mixto'}
                          </Badge>
                        </div>
                        <CardDescription>
                          {ranch.municipality}, {ranch.stateName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-gray-600">Superficie:</span>
                          <span className="font-medium">{ranch.surfaceHectares} ha</span>
                          
                          <span className="text-gray-600">Propietario:</span>
                          <span className="font-medium">{ranch.ownerName}</span>
                          
                          <span className="text-gray-600">Encargado:</span>
                          <span className="font-medium">{ranch.managerName}</span>
                          
                          <span className="text-gray-600">Contacto:</span>
                          <span className="font-medium">{ranch.contactPhone}</span>
                        </div>

                        {ranch.capacity && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Capacidad:</span>
                            <span className="font-medium">{ranch.capacity} bovinos</span>
                          </div>
                        )}

                        {/* Servicios disponibles */}
                        <div className="flex flex-wrap gap-1">
                          {ranch.hasElectricity && (
                            <Badge variant="outline" className="text-xs">⚡ Electricidad</Badge>
                          )}
                          {ranch.hasWater && (
                            <Badge variant="outline" className="text-xs">💧 Agua</Badge>
                          )}
                          {ranch.hasVeterinaryFacilities && (
                            <Badge variant="outline" className="text-xs">🏥 Veterinaria</Badge>
                          )}
                          {ranch.hasMilkingParlor && (
                            <Badge variant="outline" className="text-xs">🥛 Ordeño</Badge>
                          )}
                        </div>

                        {ranch.coordinates && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            Ubicación GPS registrada
                          </div>
                        )}

                        {ranch.establishedDate && (
                          <div className="text-xs text-gray-500">
                            Establecido: {formatDate(new Date(ranch.establishedDate))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-3 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(ranch)}
                          className="flex-1"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(ranch)}
                          className="flex-1"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(ranch.id)}
                          className="flex-1"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Eliminar
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal del formulario */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>
                    {editingRanch ? 'Editar Rancho' : 'Registrar Nuevo Rancho'}
                  </CardTitle>
                  <CardDescription>
                    Completa la información del rancho y su ubicación
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Error general */}
                  {errors.submit && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">
                        {errors.submit}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Información básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Rancho *</Label>
                        <Input
                          id="name"
                          placeholder="Ej: Rancho El Paraíso"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ranchType">Tipo de Rancho</Label>
                        <Select
                          value={formData.ranchType}
                          onValueChange={(value) => handleInputChange('ranchType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dairy">🥛 Lechero</SelectItem>
                            <SelectItem value="beef">🥩 Cárnico</SelectItem>
                            <SelectItem value="mixed">🐄 Mixto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="surfaceHectares">Superficie (Hectáreas) *</Label>
                        <Input
                          id="surfaceHectares"
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="150.5"
                          value={formData.surfaceHectares}
                          onChange={(e) => handleInputChange('surfaceHectares', e.target.value)}
                          className={errors.surfaceHectares ? 'border-red-500' : ''}
                        />
                        {errors.surfaceHectares && <p className="text-red-500 text-xs">{errors.surfaceHectares}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="capacity">Capacidad (Bovinos)</Label>
                        <Input
                          id="capacity"
                          type="number"
                          min="0"
                          placeholder="200"
                          value={formData.capacity}
                          onChange={(e) => handleInputChange('capacity', e.target.value)}
                          className={errors.capacity ? 'border-red-500' : ''}
                        />
                        {errors.capacity && <p className="text-red-500 text-xs">{errors.capacity}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        placeholder="Descripción del rancho, características especiales..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Ubicación */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Ubicación</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado *</Label>
                        <Select
                          value={formData.stateId}
                          onValueChange={(value) => handleInputChange('stateId', value)}
                        >
                          <SelectTrigger className={errors.stateId ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map(state => (
                              <SelectItem key={state.id} value={state.id}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.stateId && <p className="text-red-500 text-xs">{errors.stateId}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="municipality">Municipio *</Label>
                        <Input
                          id="municipality"
                          placeholder="Nombre del municipio"
                          value={formData.municipality}
                          onChange={(e) => handleInputChange('municipality', e.target.value)}
                          className={errors.municipality ? 'border-red-500' : ''}
                        />
                        {errors.municipality && <p className="text-red-500 text-xs">{errors.municipality}</p>}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Dirección *</Label>
                        <Input
                          id="address"
                          placeholder="Dirección completa del rancho"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className={errors.address ? 'border-red-500' : ''}
                        />
                        {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Código Postal</Label>
                        <Input
                          id="zipCode"
                          placeholder="86000"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Ubicación GPS */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Ubicación GPS
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={getCurrentLocation}
                          disabled={!navigator.geolocation}
                          className="flex-1"
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          {location ? 'Actualizar Ubicación' : 'Obtener Ubicación Actual'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={openLocationSelector}
                          className="flex-1"
                        >
                          <Map className="w-4 h-4 mr-2" />
                          Seleccionar en Mapa
                        </Button>
                      </div>
                      {(location || mapLocation) && (
                        <div className="text-xs text-green-600 space-y-1">
                          <p>📍 Ubicación registrada:</p>
                          <p>Latitud: {(location?.latitude || mapLocation?.latitude)?.toFixed(6)}</p>
                          <p>Longitud: {(location?.longitude || mapLocation?.longitude)?.toFixed(6)}</p>
                        </div>
                      )}
                      {locationError && (
                        <p className="text-xs text-red-600">Error: {locationError}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Información del propietario y contacto */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Propietario y Contacto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="owner">Propietario *</Label>
                        <Select
                          value={formData.ownerId}
                          onValueChange={(value) => handleInputChange('ownerId', value)}
                        >
                          <SelectTrigger className={errors.ownerId ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Seleccionar propietario" />
                          </SelectTrigger>
                          <SelectContent>
                            {owners.map(owner => (
                              <SelectItem key={owner.id} value={owner.id}>
                                {owner.firstName} {owner.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.ownerId && <p className="text-red-500 text-xs">{errors.ownerId}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="managerName">Encargado del Rancho *</Label>
                        <Input
                          id="managerName"
                          placeholder="Nombre del encargado"
                          value={formData.managerName}
                          onChange={(e) => handleInputChange('managerName', e.target.value)}
                          className={errors.managerName ? 'border-red-500' : ''}
                        />
                        {errors.managerName && <p className="text-red-500 text-xs">{errors.managerName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Teléfono de Contacto *</Label>
                        <Input
                          id="contactPhone"
                          placeholder="+52 993 123 4567"
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                          className={errors.contactPhone ? 'border-red-500' : ''}
                        />
                        {errors.contactPhone && <p className="text-red-500 text-xs">{errors.contactPhone}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email de Contacto</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          placeholder="rancho@ejemplo.com"
                          value={formData.contactEmail}
                          onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                          className={errors.contactEmail ? 'border-red-500' : ''}
                        />
                        {errors.contactEmail && <p className="text-red-500 text-xs">{errors.contactEmail}</p>}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Características y servicios */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Características y Servicios</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="establishedDate">Fecha de Establecimiento</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {formatDate(formData.establishedDate)}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={formData.establishedDate}
                              onSelect={(date) => handleInputChange('establishedDate', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="numberOfSections">Número de Secciones</Label>
                        <Input
                          id="numberOfSections"
                          type="number"
                          min="1"
                          placeholder="5"
                          value={formData.numberOfSections}
                          onChange={(e) => handleInputChange('numberOfSections', e.target.value)}
                          className={errors.numberOfSections ? 'border-red-500' : ''}
                        />
                        {errors.numberOfSections && <p className="text-red-500 text-xs">{errors.numberOfSections}</p>}
                      </div>
                    </div>

                    {/* Servicios disponibles */}
                    <div className="space-y-3">
                      <Label>Servicios Disponibles</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.hasElectricity}
                            onChange={(e) => handleInputChange('hasElectricity', e.target.checked)}
                            className="w-4 h-4 text-green-600"
                          />
                          <span className="text-sm">⚡ Electricidad</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.hasWater}
                            onChange={(e) => handleInputChange('hasWater', e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm">💧 Agua Potable</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.hasVeterinaryFacilities}
                            onChange={(e) => handleInputChange('hasVeterinaryFacilities', e.target.checked)}
                            className="w-4 h-4 text-red-600"
                          />
                          <span className="text-sm">🏥 Instalaciones Veterinarias</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.hasMilkingParlor}
                            onChange={(e) => handleInputChange('hasMilkingParlor', e.target.checked)}
                            className="w-4 h-4 text-purple-600"
                          />
                          <span className="text-sm">🥛 Sala de Ordeño</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Notas adicionales */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea
                      id="notes"
                      placeholder="Información adicional, observaciones especiales..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>

                <CardFooter className="gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Home className="w-4 h-4 mr-2" />
                        {editingRanch ? 'Actualizar' : 'Guardar'}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de detalles */}
      <AnimatePresence>
        {showDetails && selectedRanch && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getRanchTypeIcon(selectedRanch.ranchType)}
                  {selectedRanch.name}
                </CardTitle>
                <CardDescription>Información detallada del rancho</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Información básica */}
                <div>
                  <h3 className="font-semibold mb-3">Información Básica</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <span className="text-gray-600">Tipo:</span>
                    <span>{selectedRanch.ranchType === 'dairy' ? 'Lechero' : 
                            selectedRanch.ranchType === 'beef' ? 'Cárnico' : 'Mixto'}</span>
                    
                    <span className="text-gray-600">Superficie:</span>
                    <span>{selectedRanch.surfaceHectares} hectáreas</span>
                    
                    <span className="text-gray-600">Capacidad:</span>
                    <span>{selectedRanch.capacity || 'No especificada'} bovinos</span>
                    
                    <span className="text-gray-600">Secciones:</span>
                    <span>{selectedRanch.numberOfSections || 'No especificado'}</span>
                  </div>
                </div>

                <Separator />

                {/* Ubicación */}
                <div>
                  <h3 className="font-semibold mb-3">Ubicación</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Dirección:</span> {selectedRanch.address}</p>
                    <p><span className="text-gray-600">Municipio:</span> {selectedRanch.municipality}</p>
                    <p><span className="text-gray-600">Estado:</span> {selectedRanch.stateName}</p>
                    {selectedRanch.zipCode && (
                      <p><span className="text-gray-600">C.P.:</span> {selectedRanch.zipCode}</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Contacto */}
                <div>
                  <h3 className="font-semibold mb-3">Contacto</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Propietario:</span> {selectedRanch.ownerName}</p>
                    <p><span className="text-gray-600">Encargado:</span> {selectedRanch.managerName}</p>
                    <p><span className="text-gray-600">Teléfono:</span> {selectedRanch.contactPhone}</p>
                    {selectedRanch.contactEmail && (
                      <p><span className="text-gray-600">Email:</span> {selectedRanch.contactEmail}</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Servicios */}
                <div>
                  <h3 className="font-semibold mb-3">Servicios y Características</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRanch.hasElectricity && (
                      <Badge variant="outline">⚡ Electricidad</Badge>
                    )}
                    {selectedRanch.hasWater && (
                      <Badge variant="outline">💧 Agua Potable</Badge>
                    )}
                    {selectedRanch.hasVeterinaryFacilities && (
                      <Badge variant="outline">🏥 Instalaciones Veterinarias</Badge>
                    )}
                    {selectedRanch.hasMilkingParlor && (
                      <Badge variant="outline">🥛 Sala de Ordeño</Badge>
                    )}
                  </div>
                </div>

                {selectedRanch.description && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Descripción</h3>
                      <p className="text-sm text-gray-700">{selectedRanch.description}</p>
                    </div>
                  </>
                )}

                {selectedRanch.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Notas</h3>
                      <p className="text-sm text-gray-700">{selectedRanch.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => setShowDetails(false)}
                  className="w-full"
                >
                  Cerrar
                </Button>
              </CardFooter>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RanchForm;