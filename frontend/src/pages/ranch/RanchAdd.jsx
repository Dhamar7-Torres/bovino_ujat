import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Save, X, Camera, Upload, AlertCircle } from 'lucide-react';

// Componentes de shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

// Hooks personalizados
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useNotifications } from '../../hooks/useNotifications';

// Servicios
import { ranchService } from '../../services/ranchService';

// Utilidades
import { validateRanchForm } from '../../utils/validators';

/**
 * Componente para agregar un nuevo rancho
 * Incluye formulario completo con validación, geolocalización y carga de imágenes
 */
const RanchAdd = () => {
  const navigate = useNavigate();
  
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
    propietario_id: ''
  });

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // Multi-step form
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);

  // Hooks personalizados
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useNotifications();
  const { 
    position, 
    getCurrentPosition, 
    loading: gettingLocation, 
    error: locationError 
  } = useGeolocation();

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
    immediate: user?.rol?.nombre === 'admin',
    cacheKey: 'usuarios-propietarios'
  });

  // Efectos
  useEffect(() => {
    // Establecer usuario actual como propietario por defecto
    if (user) {
      setFormData(prev => ({
        ...prev,
        propietario_id: user.id
      }));
    }
  }, [user]);

  useEffect(() => {
    // Actualizar coordenadas cuando se obtiene la ubicación
    if (position) {
      setFormData(prev => ({
        ...prev,
        ubicacion_latitud: position.latitude.toString(),
        ubicacion_longitud: position.longitude.toString()
      }));
    }
  }, [position]);

  /**
   * Manejar cambios en el formulario
   * @param {Event} e - Evento del input
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
          'Ubicación obtenida',
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
   * Manejar selección de imágenes
   * @param {Event} e - Evento del input file
   */
  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB por archivo

    if (files.length > maxFiles) {
      showWarning(
        'Demasiadas imágenes',
        `Máximo ${maxFiles} imágenes permitidas`
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

    setSelectedImages(validFiles);
  };

  /**
   * Validar formulario
   * @param {number} currentStep - Paso actual a validar
   */
  const validateStep = (currentStep) => {
    const stepValidations = {
      1: ['nombre', 'superficie_hectareas', 'estado_id'],
      2: ['ubicacion_latitud', 'ubicacion_longitud'],
      3: ['telefono', 'email']
    };

    const fieldsToValidate = stepValidations[currentStep] || Object.keys(formData);
    const stepErrors = validateRanchForm(formData, fieldsToValidate);
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  /**
   * Avanzar al siguiente paso
   */
  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  /**
   * Retroceder al paso anterior
   */
  const handlePreviousStep = () => {
    setStep(prev => prev - 1);
  };

  /**
   * Subir imágenes del rancho
   * @param {string} ranchId - ID del rancho creado
   */
  const uploadImages = async (ranchId) => {
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
   * Enviar formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) {
      showError('Formulario incompleto', 'Por favor corrige los errores señalados');
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
        estado_id: parseInt(formData.estado_id),
        activo: true
      };

      // Crear rancho
      const response = await ranchService.createRanch(submitData);

      if (response.success) {
        const ranchId = response.data.id;

        // Subir imágenes si las hay
        if (selectedImages.length > 0) {
          await uploadImages(ranchId);
        }

        showSuccess(
          'Rancho creado',
          `El rancho "${formData.nombre}" se ha registrado exitosamente`
        );

        // Redirigir a la vista del rancho creado
        navigate(`/ranchos/${ranchId}`);
      } else {
        throw new Error(response.message || 'Error al crear rancho');
      }
    } catch (error) {
      console.error('Error al crear rancho:', error);
      showError(
        'Error al crear rancho',
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Cancelar y volver
   */
  const handleCancel = () => {
    navigate('/ranchos');
  };

  // Configuración de animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Agregar Nuevo Rancho
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Complete la información del rancho para registrarlo en el sistema
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Paso {step} de 3
          </span>
          <span className="text-sm text-gray-500">
            {step === 1 && 'Información básica'}
            {step === 2 && 'Ubicación'}
            {step === 3 && 'Contacto e imágenes'}
          </span>
        </div>
        <Progress value={(step / 3) * 100} className="w-full" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Paso 1: Información Básica */}
        {step === 1 && (
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>
                  Datos generales del rancho
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                {user?.rol?.nombre === 'admin' && (
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
          </motion.div>
        )}

        {/* Paso 2: Ubicación */}
        {step === 2 && (
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
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
                    {gettingLocation ? 'Obteniendo...' : 'Usar Ubicación Actual'}
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
          </motion.div>
        )}

        {/* Paso 3: Contacto e Imágenes */}
        {step === 3 && (
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
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

                {/* Carga de imágenes */}
                <div>
                  <Label htmlFor="images">Imágenes del Rancho</Label>
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
                          PNG, JPG, WEBP hasta 5MB cada una. Máximo 5 imágenes.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Previsualización de imágenes seleccionadas */}
                  {selectedImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">
                        Imágenes seleccionadas ({selectedImages.length})
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {selectedImages.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Previsualización ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
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
          </motion.div>
        )}

        {/* Botones de navegación */}
        <div className="flex justify-between pt-6">
          <div>
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
                disabled={loading}
              >
                Anterior
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>

            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                disabled={loading}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Guardando...' : 'Crear Rancho'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default RanchAdd;