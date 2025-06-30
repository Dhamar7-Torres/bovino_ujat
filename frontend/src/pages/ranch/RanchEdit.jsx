import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Save, X, Camera, Upload, AlertCircle, Loader2, Trash2 } from 'lucide-react';

// Componentes de shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

// Hooks personalizados
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useNotifications } from '../../hooks/useNotifications';

// Servicios
import { ranchService } from '../../services/ranchService';

// Utilidades
import { validateRanchForm } from '../../utils/validators';
import { formatDate } from '../../utils/formatters';

/**
 * Componente para editar un rancho existente
 * Incluye carga de datos, edición de formulario y gestión de imágenes
 */
const RanchEdit = () => {
  const navigate = useNavigate();
  const { id: ranchId } = useParams();
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    superficie_hectareas: '',
    descripcion: '',
    telefono: '',
    email: '',
    estado_id: '',
    ubicacion_latitud: '',
    ubicacion_longitud: '',
    propietario_id: '',
    activo: true
  });

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [loadingRanch, setLoadingRanch] = useState(true);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Estados de datos originales para comparación
  const [originalData, setOriginalData] = useState({});

  // Hooks personalizados
  const { user, hasRole } = useAuth();
  const { showSuccess, showError, showWarning } = useNotifications();
  const { 
    position, 
    getCurrentPosition, 
    loading: gettingLocation, 
    error: locationError 
  } = useGeolocation();

  // Cargar datos del rancho
  const { 
    data: ranchData, 
    loading: loadingRanchData,
    error: ranchError,
    execute: loadRanch
  } = useFetch(`/api/ranchos/${ranchId}`, {
    immediate: true
  });

  // Cargar estados disponibles
  const { 
    data: estados, 
    loading: loadingEstados 
  } = useFetch('/api/estados', {
    immediate: true,
    cacheKey: 'estados-list'
  });

  // Cargar usuarios disponibles como propietarios (solo admin)
  const { 
    data: usuarios, 
    loading: loadingUsuarios 
  } = useFetch('/api/usuarios', {
    immediate: hasRole('admin'),
    cacheKey: 'usuarios-propietarios'
  });

  // Efectos
  useEffect(() => {
    if (ranchData) {
      const data = {
        nombre: ranchData.nombre || '',
        superficie_hectareas: ranchData.superficie_hectareas?.toString() || '',
        descripcion: ranchData.descripcion || '',
        telefono: ranchData.telefono || '',
        email: ranchData.email || '',
        estado_id: ranchData.estado_id?.toString() || '',
        ubicacion_latitud: ranchData.ubicacion_latitud?.toString() || '',
        ubicacion_longitud: ranchData.ubicacion_longitud?.toString() || '',
        propietario_id: ranchData.propietario_id || '',
        activo: ranchData.activo !== false
      };
      
      setFormData(data);
      setOriginalData(data);
      setExistingImages(ranchData.imagenes || []);
      setLoadingRanch(false);
    }
  }, [ranchData]);

  useEffect(() => {
    // Actualizar coordenadas cuando se obtiene la ubicación
    if (position) {
      handleInputChange({
        target: {
          name: 'ubicacion_latitud',
          value: position.latitude.toString()
        }
      });
      handleInputChange({
        target: {
          name: 'ubicacion_longitud',
          value: position.longitude.toString()
        }
      });
    }
  }, [position]);

  // Detectar cambios en el formulario
  useEffect(() => {
    const hasFormChanges = Object.keys(formData).some(
      key => formData[key] !== originalData[key]
    );
    const hasImageChanges = selectedImages.length > 0 || imagesToDelete.length > 0;
    
    setHasChanges(hasFormChanges || hasImageChanges);
  }, [formData, originalData, selectedImages, imagesToDelete]);

  /**
   * Verificar permisos de edición
   */
  const canEdit = () => {
    if (hasRole('admin')) return true;
    if (user?.id === ranchData?.propietario_id) return true;
    return false;
  };

  /**
   * Manejar cambios en el formulario
   * @param {Event} e - Evento del input
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Manejar cambios en selects
   * @param {string} name - Nombre del campo
   * @param {string} value - Valor seleccionado
   */
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Manejar cambio de switch
   * @param {string} name - Nombre del campo
   * @param {boolean} checked - Estado del switch
   */
  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  /**
   * Obtener ubicación actual usando GPS
   */
  const handleGetCurrentLocation = async () => {
    try {
      const location = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      if (location) {
        showSuccess(
          'Ubicación actualizada',
          'Se ha actualizado la ubicación del rancho'
        );
      }
    } catch (error) {
      showError(
        'Error de ubicación',
        'No se pudo obtener la ubicación actual'
      );
    }
  };

  /**
   * Manejar selección de nuevas imágenes
   * @param {Event} e - Evento del input file
   */
  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB por archivo
    const totalImages = existingImages.length + selectedImages.length + files.length - imagesToDelete.length;

    if (totalImages > maxFiles) {
      showWarning(
        'Demasiadas imágenes',
        `Máximo ${maxFiles} imágenes permitidas en total`
      );
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        showWarning(
          'Archivo muy grande',
          `${file.name} excede el tamaño máximo de 5MB`
        );
        return false;
      }
      return true;
    });

    setSelectedImages(prev => [...prev, ...validFiles]);
  };

  /**
   * Eliminar imagen existente
   * @param {string} imageId - ID de la imagen a eliminar
   */
  const handleDeleteExistingImage = (imageId) => {
    setImagesToDelete(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  /**
   * Eliminar nueva imagen seleccionada
   * @param {number} index - Índice de la imagen a eliminar
   */
  const handleDeleteNewImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * Restaurar imagen eliminada
   * @param {string} imageId - ID de la imagen a restaurar
   */
  const handleRestoreImage = (imageId) => {
    const imageToRestore = ranchData.imagenes.find(img => img.id === imageId);
    if (imageToRestore) {
      setExistingImages(prev => [...prev, imageToRestore]);
      setImagesToDelete(prev => prev.filter(id => id !== imageId));
    }
  };

  /**
   * Validar formulario
   */
  const validateForm = () => {
    const formErrors = validateRanchForm(formData);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  /**
   * Subir nuevas imágenes
   * @param {string} ranchId - ID del rancho
   */
  const uploadNewImages = async (ranchId) => {
    if (selectedImages.length === 0) return [];

    const uploadPromises = selectedImages.map(async (file, index) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('ranchId', ranchId);
      formData.append('description', `Imagen ${index + 1} del rancho`);

      try {
        const response = await ranchService.uploadImage(formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        });
        return response.data;
      } catch (error) {
        console.error('Error al subir imagen:', error);
        return null;
      }
    });

    return Promise.all(uploadPromises);
  };

  /**
   * Eliminar imágenes marcadas para eliminación
   */
  const deleteMarkedImages = async () => {
    if (imagesToDelete.length === 0) return;

    const deletePromises = imagesToDelete.map(imageId =>
      ranchService.deleteImage(imageId).catch(err => {
        console.error('Error al eliminar imagen:', err);
        return null;
      })
    );

    await Promise.all(deletePromises);
  };

  /**
   * Enviar formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canEdit()) {
      showError(
        'Sin permisos',
        'No tienes permisos para editar este rancho'
      );
      return;
    }

    if (!validateForm()) {
      showError('Formulario incompleto', 'Por favor corrige los errores señalados');
      return;
    }

    if (!hasChanges) {
      showWarning('Sin cambios', 'No se han detectado cambios para guardar');
      return;
    }

    try {
      setLoading(true);

      // Preparar datos para envío
      const submitData = {
        ...formData,
        superficie_hectareas: parseFloat(formData.superficie_hectareas),
        ubicacion_latitud: parseFloat(formData.ubicacion_latitud),
        ubicacion_longitud: parseFloat(formData.ubicacion_longitud),
        estado_id: parseInt(formData.estado_id)
      };

      // Actualizar rancho
      const response = await ranchService.updateRanch(ranchId, submitData);

      if (response.success) {
        // Eliminar imágenes marcadas
        await deleteMarkedImages();

        // Subir nuevas imágenes
        if (selectedImages.length > 0) {
          await uploadNewImages(ranchId);
        }

        showSuccess(
          'Rancho actualizado',
          `El rancho "${formData.nombre}" se ha actualizado exitosamente`
        );

        // Recargar datos del rancho
        await loadRanch();
        
        // Limpiar estados de cambios
        setSelectedImages([]);
        setImagesToDelete([]);
        setHasChanges(false);

      } else {
        throw new Error(response.message || 'Error al actualizar rancho');
      }
    } catch (error) {
      console.error('Error al actualizar rancho:', error);
      showError(
        'Error al actualizar rancho',
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Cancelar edición
   */
  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('¿Estás seguro? Se perderán los cambios no guardados.')) {
        navigate(`/ranchos/${ranchId}`);
      }
    } else {
      navigate(`/ranchos/${ranchId}`);
    }
  };

  // Configuración de animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // Mostrar error si no se puede cargar el rancho
  if (ranchError) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar el rancho: {ranchError}
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/ranchos')} className="mt-4">
          Volver a Ranchos
        </Button>
      </div>
    );
  }

  // Mostrar loading mientras carga
  if (loadingRanch || loadingRanchData) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Cargando datos del rancho...</span>
        </div>
      </div>
    );
  }

  // Verificar permisos
  if (!canEdit()) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para editar este rancho.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate(`/ranchos/${ranchId}`)} className="mt-4">
          Ver Rancho
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-6 max-w-4xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Editar Rancho
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Modifica la información del rancho "{ranchData?.nombre}"
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="secondary" className="animate-pulse">
                Cambios sin guardar
              </Badge>
            )}
            <Badge variant={formData.activo ? "default" : "secondary"}>
              {formData.activo ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>
              Datos generales del rancho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Estado activo/inactivo */}
            <div className="flex items-center space-x-2">
              <Switch
                id="activo"
                checked={formData.activo}
                onCheckedChange={(checked) => handleSwitchChange('activo', checked)}
              />
              <Label htmlFor="activo">
                Rancho {formData.activo ? 'activo' : 'inactivo'}
              </Label>
            </div>

            {/* Nombre del Rancho */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre del Rancho *</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Rancho El Paraíso"
                  className={errors.nombre ? 'border-red-500' : ''}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500 mt-1">{errors.nombre}</p>
                )}
              </div>

              <div>
                <Label htmlFor="superficie_hectareas">Superficie (Hectáreas) *</Label>
                <Input
                  id="superficie_hectareas"
                  name="superficie_hectareas"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.superficie_hectareas}
                  onChange={handleInputChange}
                  placeholder="150.5"
                  className={errors.superficie_hectareas ? 'border-red-500' : ''}
                />
                {errors.superficie_hectareas && (
                  <p className="text-sm text-red-500 mt-1">{errors.superficie_hectareas}</p>
                )}
              </div>
            </div>

            {/* Estado */}
            <div>
              <Label htmlFor="estado_id">Estado *</Label>
              <Select 
                value={formData.estado_id} 
                onValueChange={(value) => handleSelectChange('estado_id', value)}
              >
                <SelectTrigger className={errors.estado_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  {loadingEstados ? (
                    <SelectItem value="" disabled>Cargando estados...</SelectItem>
                  ) : (
                    estados?.map((estado) => (
                      <SelectItem key={estado.id_estado} value={estado.id_estado.toString()}>
                        {estado.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.estado_id && (
                <p className="text-sm text-red-500 mt-1">{errors.estado_id}</p>
              )}
            </div>

            {/* Propietario (solo para admin) */}
            {hasRole('admin') && (
              <div>
                <Label htmlFor="propietario_id">Propietario</Label>
                <Select 
                  value={formData.propietario_id} 
                  onValueChange={(value) => handleSelectChange('propietario_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona propietario" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingUsuarios ? (
                      <SelectItem value="" disabled>Cargando usuarios...</SelectItem>
                    ) : (
                      usuarios?.map((usuario) => (
                        <SelectItem key={usuario.id} value={usuario.id}>
                          {usuario.nombre} {usuario.apellido} ({usuario.email})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Descripción */}
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Descripción detallada del rancho..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Ubicación del Rancho
            </CardTitle>
            <CardDescription>
              Establece las coordenadas del rancho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Botón para obtener ubicación actual */}
            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Button
                type="button"
                variant="outline"
                onClick={handleGetCurrentLocation}
                disabled={gettingLocation}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                {gettingLocation ? 'Obteniendo...' : 'Actualizar Ubicación'}
              </Button>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Usa GPS para obtener las coordenadas exactas
              </span>
            </div>

            {/* Error de ubicación */}
            {locationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{locationError}</AlertDescription>
              </Alert>
            )}

            {/* Coordenadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ubicacion_latitud">Latitud *</Label>
                <Input
                  id="ubicacion_latitud"
                  name="ubicacion_latitud"
                  type="number"
                  step="any"
                  value={formData.ubicacion_latitud}
                  onChange={handleInputChange}
                  placeholder="19.432608"
                  className={errors.ubicacion_latitud ? 'border-red-500' : ''}
                />
                {errors.ubicacion_latitud && (
                  <p className="text-sm text-red-500 mt-1">{errors.ubicacion_latitud}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ubicacion_longitud">Longitud *</Label>
                <Input
                  id="ubicacion_longitud"
                  name="ubicacion_longitud"
                  type="number"
                  step="any"
                  value={formData.ubicacion_longitud}
                  onChange={handleInputChange}
                  placeholder="-99.133209"
                  className={errors.ubicacion_longitud ? 'border-red-500' : ''}
                />
                {errors.ubicacion_longitud && (
                  <p className="text-sm text-red-500 mt-1">{errors.ubicacion_longitud}</p>
                )}
              </div>
            </div>

            {/* Información de precisión */}
            {position && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✓ Ubicación obtenida con precisión de {Math.round(position.accuracy)} metros
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contacto e Imágenes */}
        <Card>
          <CardHeader>
            <CardTitle>Contacto e Imágenes</CardTitle>
            <CardDescription>
              Información de contacto y fotos del rancho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Información de contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="+52 993 123 4567"
                  className={errors.telefono ? 'border-red-500' : ''}
                />
                {errors.telefono && (
                  <p className="text-sm text-red-500 mt-1">{errors.telefono}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="rancho@ejemplo.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Imágenes existentes */}
            {existingImages.length > 0 && (
              <div>
                <Label>Imágenes actuales del rancho</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.descripcion}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteExistingImage(image.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Imágenes marcadas para eliminación */}
            {imagesToDelete.length > 0 && (
              <div>
                <Label>Imágenes a eliminar</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagesToDelete.map((imageId) => (
                    <Badge
                      key={imageId}
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => handleRestoreImage(imageId)}
                    >
                      Imagen {imageId.substring(0, 8)}... (click para restaurar)
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Nuevas imágenes */}
            <div>
              <Label htmlFor="images">Agregar nuevas imágenes</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="images" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                        Seleccionar imágenes
                      </span>
                    </Label>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelection}
                      className="hidden"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      PNG, JPG, WEBP hasta 5MB cada una. Máximo 5 imágenes total.
                    </p>
                  </div>
                </div>
              </div>

              {/* Previsualización de nuevas imágenes */}
              {selectedImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">
                    Nuevas imágenes ({selectedImages.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Nueva imagen ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteNewImage(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                          {file.name.substring(0, 8)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress de subida */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Subiendo imágenes...</span>
                    <span className="text-sm text-gray-500">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Información adicional */}
        {ranchData && (
          <Card>
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <strong>Creado:</strong> {formatDate(ranchData.fecha_creacion)}
              </div>
              <div>
                <strong>Última modificación:</strong> {formatDate(ranchData.fecha_modificacion)}
              </div>
              <div>
                <strong>Creado por:</strong> {ranchData.creado_por_nombre}
              </div>
              <div>
                <strong>Modificado por:</strong> {ranchData.modificado_por_nombre}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botones de acción */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={loading || !hasChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default RanchEdit;