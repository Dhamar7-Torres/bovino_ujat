import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Building, 
  Camera,
  Save,
  Settings,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  AlertTriangle,
  Bell,
  Calendar,
  Users,
  BarChart3,
  Shield,
  Upload,
  Download,
  Trash2,
  Edit,
  Plus,
  Home
} from 'lucide-react';
import LocationPicker from '../maps/LocationPicker';

const RanchSettings = () => {
  // Estados para información del rancho
  const [ranchData, setRanchData] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    superficie_hectareas: '',
    direccion_completa: '',
    ciudad: '',
    estado: '',
    pais: 'MX',
    codigo_postal: '',
    coordenadas: null,
    tipo_ganado: '',
    capacidad_maxima: '',
    numero_corrales: '',
    sistema_produccion: '',
    certificaciones: [],
    fecha_establecimiento: '',
    propietario_principal: '',
    telefono_contacto: '',
    email_contacto: '',
    sitio_web: '',
    logo_url: '',
    fotos_rancho: []
  });

  // Estados para configuración ambiental
  const [environmentalConfig, setEnvironmentalConfig] = useState({
    monitoreo_climatico: true,
    alertas_temperatura: true,
    temp_min_alerta: 5,
    temp_max_alerta: 35,
    alertas_humedad: true,
    humedad_min: 40,
    humedad_max: 80,
    alertas_lluvia: true,
    alertas_viento: false,
    velocidad_viento_max: 50,
    estacion_meteorologica: false,
    sensores_iot: false,
    frecuencia_monitoreo: 30 // minutos
  });

  // Estados para configuración operacional
  const [operationalConfig, setOperationalConfig] = useState({
    horario_trabajo_inicio: '06:00',
    horario_trabajo_fin: '18:00',
    dias_trabajo: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
    turnos_trabajo: 1,
    descanso_semanal: 'domingo',
    alertas_actividades: true,
    notificaciones_veterinario: true,
    reportes_automaticos: true,
    frecuencia_reportes: 'semanal',
    backup_automatico: true,
    frecuencia_backup: 'diario',
    mantenimiento_programado: true
  });

  // Estados para zonas del rancho
  const [ranchZones, setRanchZones] = useState([]);
  const [newZone, setNewZone] = useState({
    nombre: '',
    tipo: '',
    superficie: '',
    capacidad: '',
    descripcion: '',
    coordenadas: null
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('general');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationPickerMode, setLocationPickerMode] = useState('ranch'); // 'ranch' o 'zone'

  // Cargar datos del rancho al montar el componente
  useEffect(() => {
    loadRanchData();
    loadEnvironmentalConfig();
    loadOperationalConfig();
    loadRanchZones();
  }, []);

  const loadRanchData = async () => {
    try {
      const response = await fetch('/api/ranch/settings');
      const data = await response.json();
      setRanchData(data);
    } catch (error) {
      console.error('Error cargando datos del rancho:', error);
    }
  };

  const loadEnvironmentalConfig = async () => {
    try {
      const response = await fetch('/api/ranch/environmental-config');
      const data = await response.json();
      setEnvironmentalConfig(data);
    } catch (error) {
      console.error('Error cargando configuración ambiental:', error);
    }
  };

  const loadOperationalConfig = async () => {
    try {
      const response = await fetch('/api/ranch/operational-config');
      const data = await response.json();
      setOperationalConfig(data);
    } catch (error) {
      console.error('Error cargando configuración operacional:', error);
    }
  };

  const loadRanchZones = async () => {
    try {
      const response = await fetch('/api/ranch/zones');
      const data = await response.json();
      setRanchZones(data);
    } catch (error) {
      console.error('Error cargando zonas del rancho:', error);
    }
  };

  // Manejo de cambios en inputs
  const handleInputChange = (section, field, value) => {
    switch (section) {
      case 'ranch':
        setRanchData(prev => ({ ...prev, [field]: value }));
        break;
      case 'environmental':
        setEnvironmentalConfig(prev => ({ ...prev, [field]: value }));
        break;
      case 'operational':
        setOperationalConfig(prev => ({ ...prev, [field]: value }));
        break;
      case 'newZone':
        setNewZone(prev => ({ ...prev, [field]: value }));
        break;
    }

    // Limpiar errores
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validaciones
  const validateRanchData = () => {
    const newErrors = {};

    if (!ranchData.nombre.trim()) newErrors.nombre = 'El nombre del rancho es requerido';
    if (!ranchData.superficie_hectareas) newErrors.superficie_hectareas = 'La superficie es requerida';
    if (!ranchData.ciudad.trim()) newErrors.ciudad = 'La ciudad es requerida';
    if (!ranchData.estado.trim()) newErrors.estado = 'El estado es requerido';
    if (!ranchData.tipo_ganado) newErrors.tipo_ganado = 'El tipo de ganado es requerido';
    if (!ranchData.capacidad_maxima) newErrors.capacidad_maxima = 'La capacidad máxima es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNewZone = () => {
    const newErrors = {};

    if (!newZone.nombre.trim()) newErrors.zona_nombre = 'El nombre de la zona es requerido';
    if (!newZone.tipo) newErrors.zona_tipo = 'El tipo de zona es requerido';
    if (!newZone.superficie) newErrors.zona_superficie = 'La superficie es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar configuración del rancho
  const handleSaveRanchData = async () => {
    if (!validateRanchData()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ranch/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ranchData)
      });

      if (response.ok) {
        alert('Configuración del rancho guardada exitosamente');
      } else {
        alert('Error al guardar la configuración');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Guardar configuración ambiental
  const handleSaveEnvironmentalConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ranch/environmental-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(environmentalConfig)
      });

      if (response.ok) {
        alert('Configuración ambiental guardada exitosamente');
      } else {
        alert('Error al guardar la configuración ambiental');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Guardar configuración operacional
  const handleSaveOperationalConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ranch/operational-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operationalConfig)
      });

      if (response.ok) {
        alert('Configuración operacional guardada exitosamente');
      } else {
        alert('Error al guardar la configuración operacional');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Agregar nueva zona
  const handleAddZone = async () => {
    if (!validateNewZone()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ranch/zones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newZone)
      });

      if (response.ok) {
        await loadRanchZones();
        setNewZone({
          nombre: '',
          tipo: '',
          superficie: '',
          capacidad: '',
          descripcion: '',
          coordenadas: null
        });
        alert('Zona agregada exitosamente');
      } else {
        alert('Error al agregar la zona');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar zona
  const handleDeleteZone = async (zoneId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta zona?')) return;

    try {
      const response = await fetch(`/api/ranch/zones/${zoneId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadRanchZones();
        alert('Zona eliminada exitosamente');
      } else {
        alert('Error al eliminar la zona');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  // Subir logo del rancho
  const handleLogoUpload = async (file) => {
    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await fetch('/api/ranch/logo', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setRanchData(prev => ({ ...prev, logo_url: data.logo_url }));
        alert('Logo actualizado exitosamente');
      } else {
        alert('Error al subir el logo');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  // Subir fotos del rancho
  const handlePhotosUpload = async (files) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('photos', file);
    });

    try {
      const response = await fetch('/api/ranch/photos', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setRanchData(prev => ({ 
          ...prev, 
          fotos_rancho: [...prev.fotos_rancho, ...data.photo_urls] 
        }));
        alert('Fotos subidas exitosamente');
      } else {
        alert('Error al subir las fotos');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  // Exportar configuración
  const handleExportConfig = async () => {
    try {
      const response = await fetch('/api/ranch/export-config');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `ranch-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando configuración:', error);
      alert('Error al exportar la configuración');
    }
  };

  // Importar configuración
  const handleImportConfig = async (file) => {
    const formData = new FormData();
    formData.append('config', file);

    try {
      const response = await fetch('/api/ranch/import-config', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        await loadRanchData();
        await loadEnvironmentalConfig();
        await loadOperationalConfig();
        alert('Configuración importada exitosamente');
      } else {
        alert('Error al importar la configuración');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
      className="p-6 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Building className="text-green-600" />
              Configuración del Rancho
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona la información y configuración de tu rancho
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportConfig}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById('import-config').click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Importar
            </Button>
            <input
              id="import-config"
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleImportConfig(file);
              }}
            />
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="environmental">Ambiental</TabsTrigger>
            <TabsTrigger value="operational">Operacional</TabsTrigger>
            <TabsTrigger value="zones">Zonas</TabsTrigger>
          </TabsList>

          {/* Tab: Información General */}
          <TabsContent value="general">
            <div className="space-y-6">
              {/* Información básica */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Información Básica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Logo y fotos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Logo del Rancho</Label>
                      <div className="flex items-center gap-4 mt-2">
                        {ranchData.logo_url && (
                          <img
                            src={ranchData.logo_url}
                            alt="Logo del rancho"
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                        )}
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('logo-input').click()}
                          className="flex items-center gap-2"
                        >
                          <Camera className="h-4 w-4" />
                          {ranchData.logo_url ? 'Cambiar Logo' : 'Subir Logo'}
                        </Button>
                        <input
                          id="logo-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleLogoUpload(file);
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Fotos del Rancho</Label>
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('photos-input').click()}
                          className="flex items-center gap-2"
                        >
                          <Camera className="h-4 w-4" />
                          Agregar Fotos
                        </Button>
                        <input
                          id="photos-input"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files.length > 0) handlePhotosUpload(files);
                          }}
                        />
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          {ranchData.fotos_rancho.slice(0, 6).map((foto, index) => (
                            <img
                              key={index}
                              src={foto}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-16 object-cover rounded border"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Información del rancho */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre del Rancho *</Label>
                      <Input
                        id="nombre"
                        value={ranchData.nombre}
                        onChange={(e) => handleInputChange('ranch', 'nombre', e.target.value)}
                        placeholder="Nombre del rancho"
                      />
                      {errors.nombre && (
                        <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="propietario_principal">Propietario Principal</Label>
                      <Input
                        id="propietario_principal"
                        value={ranchData.propietario_principal}
                        onChange={(e) => handleInputChange('ranch', 'propietario_principal', e.target.value)}
                        placeholder="Nombre del propietario"
                      />
                    </div>

                    <div>
                      <Label htmlFor="superficie_hectareas">Superficie (Hectáreas) *</Label>
                      <Input
                        id="superficie_hectareas"
                        type="number"
                        step="0.1"
                        value={ranchData.superficie_hectareas}
                        onChange={(e) => handleInputChange('ranch', 'superficie_hectareas', e.target.value)}
                        placeholder="150.5"
                      />
                      {errors.superficie_hectareas && (
                        <p className="text-red-500 text-sm mt-1">{errors.superficie_hectareas}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="capacidad_maxima">Capacidad Máxima (Cabezas) *</Label>
                      <Input
                        id="capacidad_maxima"
                        type="number"
                        value={ranchData.capacidad_maxima}
                        onChange={(e) => handleInputChange('ranch', 'capacidad_maxima', e.target.value)}
                        placeholder="500"
                      />
                      {errors.capacidad_maxima && (
                        <p className="text-red-500 text-sm mt-1">{errors.capacidad_maxima}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="tipo_ganado">Tipo de Ganado *</Label>
                      <Select
                        value={ranchData.tipo_ganado}
                        onValueChange={(value) => handleInputChange('ranch', 'tipo_ganado', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bovino_leche">Bovino - Leche</SelectItem>
                          <SelectItem value="bovino_carne">Bovino - Carne</SelectItem>
                          <SelectItem value="bovino_doble_proposito">Bovino - Doble Propósito</SelectItem>
                          <SelectItem value="mixto">Mixto</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.tipo_ganado && (
                        <p className="text-red-500 text-sm mt-1">{errors.tipo_ganado}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="numero_corrales">Número de Corrales</Label>
                      <Input
                        id="numero_corrales"
                        type="number"
                        value={ranchData.numero_corrales}
                        onChange={(e) => handleInputChange('ranch', 'numero_corrales', e.target.value)}
                        placeholder="20"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sistema_produccion">Sistema de Producción</Label>
                      <Select
                        value={ranchData.sistema_produccion}
                        onValueChange={(value) => handleInputChange('ranch', 'sistema_produccion', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar sistema" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="intensivo">Intensivo</SelectItem>
                          <SelectItem value="semi_intensivo">Semi-intensivo</SelectItem>
                          <SelectItem value="extensivo">Extensivo</SelectItem>
                          <SelectItem value="pastoreo_rotacional">Pastoreo Rotacional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="fecha_establecimiento">Fecha de Establecimiento</Label>
                      <Input
                        id="fecha_establecimiento"
                        type="date"
                        value={ranchData.fecha_establecimiento}
                        onChange={(e) => handleInputChange('ranch', 'fecha_establecimiento', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <Label htmlFor="descripcion">Descripción del Rancho</Label>
                    <Textarea
                      id="descripcion"
                      value={ranchData.descripcion}
                      onChange={(e) => handleInputChange('ranch', 'descripcion', e.target.value)}
                      placeholder="Descripción detallada del rancho, sus características y objetivos..."
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
                    Ubicación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="ciudad">Ciudad *</Label>
                      <Input
                        id="ciudad"
                        value={ranchData.ciudad}
                        onChange={(e) => handleInputChange('ranch', 'ciudad', e.target.value)}
                        placeholder="Nombre de la ciudad"
                      />
                      {errors.ciudad && (
                        <p className="text-red-500 text-sm mt-1">{errors.ciudad}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="estado">Estado *</Label>
                      <Input
                        id="estado"
                        value={ranchData.estado}
                        onChange={(e) => handleInputChange('ranch', 'estado', e.target.value)}
                        placeholder="Nombre del estado"
                      />
                      {errors.estado && (
                        <p className="text-red-500 text-sm mt-1">{errors.estado}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="codigo_postal">Código Postal</Label>
                      <Input
                        id="codigo_postal"
                        value={ranchData.codigo_postal}
                        onChange={(e) => handleInputChange('ranch', 'codigo_postal', e.target.value)}
                        placeholder="12345"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="direccion_completa">Dirección Completa</Label>
                    <Textarea
                      id="direccion_completa"
                      value={ranchData.direccion_completa}
                      onChange={(e) => handleInputChange('ranch', 'direccion_completa', e.target.value)}
                      placeholder="Dirección completa del rancho..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Coordenadas GPS</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setLocationPickerMode('ranch');
                          setShowLocationPicker(true);
                        }}
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        {ranchData.coordenadas ? 'Coordenadas seleccionadas' : 'Seleccionar ubicación'}
                      </Button>
                      {ranchData.coordenadas && (
                        <Badge variant="secondary">
                          {ranchData.coordenadas.lat.toFixed(6)}, {ranchData.coordenadas.lng.toFixed(6)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información de contacto */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telefono_contacto">Teléfono de Contacto</Label>
                      <Input
                        id="telefono_contacto"
                        value={ranchData.telefono_contacto}
                        onChange={(e) => handleInputChange('ranch', 'telefono_contacto', e.target.value)}
                        placeholder="+52 999 123 4567"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email_contacto">Email de Contacto</Label>
                      <Input
                        id="email_contacto"
                        type="email"
                        value={ranchData.email_contacto}
                        onChange={(e) => handleInputChange('ranch', 'email_contacto', e.target.value)}
                        placeholder="contacto@rancho.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="sitio_web">Sitio Web</Label>
                      <Input
                        id="sitio_web"
                        type="url"
                        value={ranchData.sitio_web}
                        onChange={(e) => handleInputChange('ranch', 'sitio_web', e.target.value)}
                        placeholder="https://www.rancho.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveRanchData}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Guardar Configuración
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Configuración Ambiental */}
          <TabsContent value="environmental">
            <div className="space-y-6">
              {/* Monitoreo climático */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    Monitoreo Climático
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Monitoreo Climático Activo</Label>
                      <p className="text-sm text-gray-500">
                        Habilitar el monitoreo automático de condiciones climáticas
                      </p>
                    </div>
                    <Switch
                      checked={environmentalConfig.monitoreo_climatico}
                      onCheckedChange={(checked) => handleInputChange('environmental', 'monitoreo_climatico', checked)}
                    />
                  </div>

                  {environmentalConfig.monitoreo_climatico && (
                    <>
                      <Separator />
                      
                      {/* Alertas de temperatura */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Alertas de Temperatura</Label>
                          <Switch
                            checked={environmentalConfig.alertas_temperatura}
                            onCheckedChange={(checked) => handleInputChange('environmental', 'alertas_temperatura', checked)}
                          />
                        </div>

                        {environmentalConfig.alertas_temperatura && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="temp_min_alerta">Temperatura Mínima (°C)</Label>
                              <Input
                                id="temp_min_alerta"
                                type="number"
                                value={environmentalConfig.temp_min_alerta}
                                onChange={(e) => handleInputChange('environmental', 'temp_min_alerta', parseInt(e.target.value))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="temp_max_alerta">Temperatura Máxima (°C)</Label>
                              <Input
                                id="temp_max_alerta"
                                type="number"
                                value={environmentalConfig.temp_max_alerta}
                                onChange={(e) => handleInputChange('environmental', 'temp_max_alerta', parseInt(e.target.value))}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Alertas de humedad */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Alertas de Humedad</Label>
                          <Switch
                            checked={environmentalConfig.alertas_humedad}
                            onCheckedChange={(checked) => handleInputChange('environmental', 'alertas_humedad', checked)}
                          />
                        </div>

                        {environmentalConfig.alertas_humedad && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="humedad_min">Humedad Mínima (%)</Label>
                              <Input
                                id="humedad_min"
                                type="number"
                                value={environmentalConfig.humedad_min}
                                onChange={(e) => handleInputChange('environmental', 'humedad_min', parseInt(e.target.value))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="humedad_max">Humedad Máxima (%)</Label>
                              <Input
                                id="humedad_max"
                                type="number"
                                value={environmentalConfig.humedad_max}
                                onChange={(e) => handleInputChange('environmental', 'humedad_max', parseInt(e.target.value))}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Otras alertas */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Alertas de Lluvia</Label>
                            <p className="text-sm text-gray-500">
                              Notificar sobre precipitaciones importantes
                            </p>
                          </div>
                          <Switch
                            checked={environmentalConfig.alertas_lluvia}
                            onCheckedChange={(checked) => handleInputChange('environmental', 'alertas_lluvia', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Alertas de Viento</Label>
                            <p className="text-sm text-gray-500">
                              Notificar sobre vientos fuertes
                            </p>
                          </div>
                          <Switch
                            checked={environmentalConfig.alertas_viento}
                            onCheckedChange={(checked) => handleInputChange('environmental', 'alertas_viento', checked)}
                          />
                        </div>

                        {environmentalConfig.alertas_viento && (
                          <div>
                            <Label htmlFor="velocidad_viento_max">Velocidad Máxima del Viento (km/h)</Label>
                            <Input
                              id="velocidad_viento_max"
                              type="number"
                              value={environmentalConfig.velocidad_viento_max}
                              onChange={(e) => handleInputChange('environmental', 'velocidad_viento_max', parseInt(e.target.value))}
                            />
                          </div>
                        )}
                      </div>

                      {/* Frecuencia de monitoreo */}
                      <div>
                        <Label htmlFor="frecuencia_monitoreo">Frecuencia de Monitoreo (minutos)</Label>
                        <Select
                          value={environmentalConfig.frecuencia_monitoreo.toString()}
                          onValueChange={(value) => handleInputChange('environmental', 'frecuencia_monitoreo', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutos</SelectItem>
                            <SelectItem value="30">30 minutos</SelectItem>
                            <SelectItem value="60">1 hora</SelectItem>
                            <SelectItem value="120">2 horas</SelectItem>
                            <SelectItem value="240">4 horas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Equipos de monitoreo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Equipos de Monitoreo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Estación Meteorológica</Label>
                      <p className="text-sm text-gray-500">
                        Estación meteorológica local instalada
                      </p>
                    </div>
                    <Switch
                      checked={environmentalConfig.estacion_meteorologica}
                      onCheckedChange={(checked) => handleInputChange('environmental', 'estacion_meteorologica', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sensores IoT</Label>
                      <p className="text-sm text-gray-500">
                        Sensores conectados distribuidos en el rancho
                      </p>
                    </div>
                    <Switch
                      checked={environmentalConfig.sensores_iot}
                      onCheckedChange={(checked) => handleInputChange('environmental', 'sensores_iot', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveEnvironmentalConfig}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Guardar Configuración Ambiental
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Configuración Operacional */}
          <TabsContent value="operational">
            <div className="space-y-6">
              {/* Horarios de trabajo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Horarios de Trabajo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="horario_trabajo_inicio">Hora de Inicio</Label>
                      <Input
                        id="horario_trabajo_inicio"
                        type="time"
                        value={operationalConfig.horario_trabajo_inicio}
                        onChange={(e) => handleInputChange('operational', 'horario_trabajo_inicio', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="horario_trabajo_fin">Hora de Fin</Label>
                      <Input
                        id="horario_trabajo_fin"
                        type="time"
                        value={operationalConfig.horario_trabajo_fin}
                        onChange={(e) => handleInputChange('operational', 'horario_trabajo_fin', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="turnos_trabajo">Número de Turnos</Label>
                      <Select
                        value={operationalConfig.turnos_trabajo.toString()}
                        onValueChange={(value) => handleInputChange('operational', 'turnos_trabajo', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 turno</SelectItem>
                          <SelectItem value="2">2 turnos</SelectItem>
                          <SelectItem value="3">3 turnos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="descanso_semanal">Día de Descanso</Label>
                      <Select
                        value={operationalConfig.descanso_semanal}
                        onValueChange={(value) => handleInputChange('operational', 'descanso_semanal', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="domingo">Domingo</SelectItem>
                          <SelectItem value="lunes">Lunes</SelectItem>
                          <SelectItem value="sabado">Sábado</SelectItem>
                          <SelectItem value="ninguno">Sin día fijo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notificaciones operacionales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notificaciones Operacionales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertas de Actividades</Label>
                      <p className="text-sm text-gray-500">
                        Notificar sobre actividades programadas
                      </p>
                    </div>
                    <Switch
                      checked={operationalConfig.alertas_actividades}
                      onCheckedChange={(checked) => handleInputChange('operational', 'alertas_actividades', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificaciones Veterinario</Label>
                      <p className="text-sm text-gray-500">
                        Notificar al veterinario sobre situaciones importantes
                      </p>
                    </div>
                    <Switch
                      checked={operationalConfig.notificaciones_veterinario}
                      onCheckedChange={(checked) => handleInputChange('operational', 'notificaciones_veterinario', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reportes Automáticos</Label>
                      <p className="text-sm text-gray-500">
                        Generar reportes periódicos automáticamente
                      </p>
                    </div>
                    <Switch
                      checked={operationalConfig.reportes_automaticos}
                      onCheckedChange={(checked) => handleInputChange('operational', 'reportes_automaticos', checked)}
                    />
                  </div>

                  {operationalConfig.reportes_automaticos && (
                    <div>
                      <Label htmlFor="frecuencia_reportes">Frecuencia de Reportes</Label>
                      <Select
                        value={operationalConfig.frecuencia_reportes}
                        onValueChange={(value) => handleInputChange('operational', 'frecuencia_reportes', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diario">Diario</SelectItem>
                          <SelectItem value="semanal">Semanal</SelectItem>
                          <SelectItem value="quincenal">Quincenal</SelectItem>
                          <SelectItem value="mensual">Mensual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mantenimiento y backup */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Mantenimiento y Backup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Backup Automático</Label>
                      <p className="text-sm text-gray-500">
                        Crear copias de seguridad automáticas de los datos
                      </p>
                    </div>
                    <Switch
                      checked={operationalConfig.backup_automatico}
                      onCheckedChange={(checked) => handleInputChange('operational', 'backup_automatico', checked)}
                    />
                  </div>

                  {operationalConfig.backup_automatico && (
                    <div>
                      <Label htmlFor="frecuencia_backup">Frecuencia de Backup</Label>
                      <Select
                        value={operationalConfig.frecuencia_backup}
                        onValueChange={(value) => handleInputChange('operational', 'frecuencia_backup', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cada_6_horas">Cada 6 horas</SelectItem>
                          <SelectItem value="diario">Diario</SelectItem>
                          <SelectItem value="semanal">Semanal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mantenimiento Programado</Label>
                      <p className="text-sm text-gray-500">
                        Programar mantenimientos preventivos del sistema
                      </p>
                    </div>
                    <Switch
                      checked={operationalConfig.mantenimiento_programado}
                      onCheckedChange={(checked) => handleInputChange('operational', 'mantenimiento_programado', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveOperationalConfig}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Guardar Configuración Operacional
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Zonas del Rancho */}
          <TabsContent value="zones">
            <div className="space-y-6">
              {/* Agregar nueva zona */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Agregar Nueva Zona
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="zona_nombre">Nombre de la Zona *</Label>
                      <Input
                        id="zona_nombre"
                        value={newZone.nombre}
                        onChange={(e) => handleInputChange('newZone', 'nombre', e.target.value)}
                        placeholder="Potrero Norte"
                      />
                      {errors.zona_nombre && (
                        <p className="text-red-500 text-sm mt-1">{errors.zona_nombre}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="zona_tipo">Tipo de Zona *</Label>
                      <Select
                        value={newZone.tipo}
                        onValueChange={(value) => handleInputChange('newZone', 'tipo', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="potrero">Potrero</SelectItem>
                          <SelectItem value="corral">Corral</SelectItem>
                          <SelectItem value="sala_ordeno">Sala de Ordeño</SelectItem>
                          <SelectItem value="bodega">Bodega</SelectItem>
                          <SelectItem value="clinica">Clínica Veterinaria</SelectItem>
                          <SelectItem value="oficina">Oficina</SelectItem>
                          <SelectItem value="vivienda">Vivienda</SelectItem>
                          <SelectItem value="agua">Fuente de Agua</SelectItem>
                          <SelectItem value="alimento">Área de Alimentación</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.zona_tipo && (
                        <p className="text-red-500 text-sm mt-1">{errors.zona_tipo}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="zona_superficie">Superficie (hectáreas) *</Label>
                      <Input
                        id="zona_superficie"
                        type="number"
                        step="0.1"
                        value={newZone.superficie}
                        onChange={(e) => handleInputChange('newZone', 'superficie', e.target.value)}
                        placeholder="5.5"
                      />
                      {errors.zona_superficie && (
                        <p className="text-red-500 text-sm mt-1">{errors.zona_superficie}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="zona_capacidad">Capacidad (cabezas)</Label>
                      <Input
                        id="zona_capacidad"
                        type="number"
                        value={newZone.capacidad}
                        onChange={(e) => handleInputChange('newZone', 'capacidad', e.target.value)}
                        placeholder="50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label>Ubicación de la Zona</Label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setLocationPickerMode('zone');
                            setShowLocationPicker(true);
                          }}
                          className="flex items-center gap-2"
                        >
                          <MapPin className="h-4 w-4" />
                          {newZone.coordenadas ? 'Ubicación seleccionada' : 'Seleccionar ubicación'}
                        </Button>
                        {newZone.coordenadas && (
                          <Badge variant="secondary">
                            {newZone.coordenadas.lat.toFixed(6)}, {newZone.coordenadas.lng.toFixed(6)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="zona_descripcion">Descripción</Label>
                    <Textarea
                      id="zona_descripcion"
                      value={newZone.descripcion}
                      onChange={(e) => handleInputChange('newZone', 'descripcion', e.target.value)}
                      placeholder="Descripción de la zona..."
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddZone}
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      Agregar Zona
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de zonas existentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Zonas del Rancho ({ranchZones.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ranchZones.map((zone) => (
                      <div key={zone.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <MapPin className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{zone.nombre}</h4>
                            <p className="text-sm text-gray-600">
                              {zone.tipo} • {zone.superficie} ha • Capacidad: {zone.capacidad || 'N/A'} cabezas
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="capitalize">
                            {zone.tipo.replace('_', ' ')}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteZone(zone.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {ranchZones.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No hay zonas registradas. Agrega la primera zona del rancho.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Modal de selección de ubicación */}
      {showLocationPicker && (
        <LocationPicker
          onLocationSelect={(location) => {
            if (locationPickerMode === 'ranch') {
              handleInputChange('ranch', 'coordenadas', location);
            } else {
              handleInputChange('newZone', 'coordenadas', location);
            }
            setShowLocationPicker(false);
          }}
          onClose={() => setShowLocationPicker(false)}
        />
      )}
    </motion.div>
  );
};

export default RanchSettings;