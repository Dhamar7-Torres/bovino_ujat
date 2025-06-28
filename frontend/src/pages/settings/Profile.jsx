import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Camera,
  Save,
  Lock,
  Bell,
  Globe,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  Monitor,
  Moon,
  Sun
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Profile = () => {
  // Estados del perfil personal
  const [profileData, setProfileData] = useState({
    id: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    estado: '',
    pais: '',
    fecha_nacimiento: '',
    biografia: '',
    avatar_url: '',
    cargo: '',
    experiencia_anos: '',
    especializacion: '',
    licencia_veterinaria: '',
    fecha_creacion: '',
    ultimo_acceso: ''
  });

  // Estados de configuración
  const [preferences, setPreferences] = useState({
    idioma: 'es',
    zona_horaria: 'America/Mexico_City',
    tema: 'light',
    notificaciones_email: true,
    notificaciones_sms: false,
    notificaciones_push: true,
    alertas_emergencia: true,
    reportes_automaticos: true,
    privacidad_perfil: 'private',
    mostrar_telefono: false,
    mostrar_email: false
  });

  // Estados de seguridad
  const [securityData, setSecurityData] = useState({
    password_actual: '',
    password_nueva: '',
    confirmar_password: '',
    autenticacion_dos_factores: false,
    sesiones_activas: [],
    dispositivos_confianza: []
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    actual: false,
    nueva: false,
    confirmar: false
  });
  const [activeTab, setActiveTab] = useState('profile');

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    loadUserProfile();
    loadUserPreferences();
    loadSecurityData();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await fetch('/api/users/profile');
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Error cargando perfil de usuario:', error);
    }
  };

  const loadUserPreferences = async () => {
    try {
      const response = await fetch('/api/users/preferences');
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      console.error('Error cargando preferencias:', error);
    }
  };

  const loadSecurityData = async () => {
    try {
      const response = await fetch('/api/users/security');
      const data = await response.json();
      setSecurityData(prev => ({
        ...prev,
        autenticacion_dos_factores: data.two_factor_enabled,
        sesiones_activas: data.active_sessions,
        dispositivos_confianza: data.trusted_devices
      }));
    } catch (error) {
      console.error('Error cargando datos de seguridad:', error);
    }
  };

  // Manejo de cambios en inputs
  const handleInputChange = (section, field, value) => {
    switch (section) {
      case 'profile':
        setProfileData(prev => ({ ...prev, [field]: value }));
        break;
      case 'preferences':
        setPreferences(prev => ({ ...prev, [field]: value }));
        break;
      case 'security':
        setSecurityData(prev => ({ ...prev, [field]: value }));
        break;
    }

    // Limpiar errores
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validación de formularios
  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!profileData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!profileData.email.trim()) newErrors.email = 'El email es requerido';
    if (profileData.email && !/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (profileData.telefono && !/^\+?[\d\s\-\(\)]+$/.test(profileData.telefono)) {
      newErrors.telefono = 'El teléfono no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!securityData.password_actual) {
      newErrors.password_actual = 'La contraseña actual es requerida';
    }
    if (!securityData.password_nueva) {
      newErrors.password_nueva = 'La nueva contraseña es requerida';
    } else if (securityData.password_nueva.length < 8) {
      newErrors.password_nueva = 'La contraseña debe tener al menos 8 caracteres';
    }
    if (securityData.password_nueva !== securityData.confirmar_password) {
      newErrors.confirmar_password = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar perfil
  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        alert('Perfil actualizado exitosamente');
      } else {
        alert('Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Guardar preferencias
  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences)
      });

      if (response.ok) {
        alert('Preferencias guardadas exitosamente');
      } else {
        alert('Error al guardar las preferencias');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: securityData.password_actual,
          new_password: securityData.password_nueva
        })
      });

      if (response.ok) {
        setSecurityData(prev => ({
          ...prev,
          password_actual: '',
          password_nueva: '',
          confirmar_password: ''
        }));
        alert('Contraseña cambiada exitosamente');
      } else {
        const data = await response.json();
        alert(data.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Subir avatar
  const handleAvatarUpload = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/users/avatar', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(prev => ({ ...prev, avatar_url: data.avatar_url }));
        alert('Avatar actualizado exitosamente');
      } else {
        alert('Error al subir el avatar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  // Alternar autenticación de dos factores
  const handleToggle2FA = async (enabled) => {
    try {
      const response = await fetch('/api/users/two-factor', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled })
      });

      if (response.ok) {
        setSecurityData(prev => ({ ...prev, autenticacion_dos_factores: enabled }));
        alert(`Autenticación de dos factores ${enabled ? 'habilitada' : 'deshabilitada'}`);
      } else {
        alert('Error al cambiar la configuración de 2FA');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  // Cerrar sesión en dispositivo
  const handleLogoutDevice = async (sessionId) => {
    try {
      const response = await fetch(`/api/users/sessions/${sessionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadSecurityData();
        alert('Sesión cerrada exitosamente');
      } else {
        alert('Error al cerrar la sesión');
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
      className="p-6 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <User className="text-blue-600" />
          Mi Perfil
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona tu información personal, preferencias y configuración de seguridad
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Perfil Personal</TabsTrigger>
            <TabsTrigger value="preferences">Preferencias</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
          </TabsList>

          {/* Tab: Perfil Personal */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileData.avatar_url} />
                    <AvatarFallback className="text-lg">
                      {profileData.nombre.charAt(0)}{profileData.apellido.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => document.getElementById('avatar-input').click()}
                    >
                      <Camera className="h-4 w-4" />
                      Cambiar Avatar
                    </Button>
                    <input
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleAvatarUpload(file);
                      }}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      JPG, PNG máximo 2MB
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={profileData.nombre}
                      onChange={(e) => handleInputChange('profile', 'nombre', e.target.value)}
                      placeholder="Tu nombre"
                    />
                    {errors.nombre && (
                      <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="apellido">Apellido *</Label>
                    <Input
                      id="apellido"
                      value={profileData.apellido}
                      onChange={(e) => handleInputChange('profile', 'apellido', e.target.value)}
                      placeholder="Tu apellido"
                    />
                    {errors.apellido && (
                      <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={profileData.telefono}
                      onChange={(e) => handleInputChange('profile', 'telefono', e.target.value)}
                      placeholder="+52 999 123 4567"
                    />
                    {errors.telefono && (
                      <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cargo">Cargo/Posición</Label>
                    <Input
                      id="cargo"
                      value={profileData.cargo}
                      onChange={(e) => handleInputChange('profile', 'cargo', e.target.value)}
                      placeholder="Veterinario, Administrador, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="experiencia_anos">Años de Experiencia</Label>
                    <Input
                      id="experiencia_anos"
                      type="number"
                      value={profileData.experiencia_anos}
                      onChange={(e) => handleInputChange('profile', 'experiencia_anos', e.target.value)}
                      placeholder="5"
                    />
                  </div>
                </div>

                {/* Especialización */}
                <div>
                  <Label htmlFor="especializacion">Especialización</Label>
                  <Select
                    value={profileData.especializacion}
                    onValueChange={(value) => handleInputChange('profile', 'especializacion', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar especialización" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medicina_general">Medicina General</SelectItem>
                      <SelectItem value="reproduccion">Reproducción</SelectItem>
                      <SelectItem value="nutricion">Nutrición</SelectItem>
                      <SelectItem value="cirugia">Cirugía</SelectItem>
                      <SelectItem value="genetica">Genética</SelectItem>
                      <SelectItem value="administracion">Administración</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Licencia veterinaria */}
                <div>
                  <Label htmlFor="licencia_veterinaria">Licencia Veterinaria</Label>
                  <Input
                    id="licencia_veterinaria"
                    value={profileData.licencia_veterinaria}
                    onChange={(e) => handleInputChange('profile', 'licencia_veterinaria', e.target.value)}
                    placeholder="Número de licencia profesional"
                  />
                </div>

                {/* Dirección */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input
                      id="ciudad"
                      value={profileData.ciudad}
                      onChange={(e) => handleInputChange('profile', 'ciudad', e.target.value)}
                      placeholder="Tu ciudad"
                    />
                  </div>

                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={profileData.estado}
                      onChange={(e) => handleInputChange('profile', 'estado', e.target.value)}
                      placeholder="Tu estado"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pais">País</Label>
                    <Select
                      value={profileData.pais}
                      onValueChange={(value) => handleInputChange('profile', 'pais', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar país" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MX">México</SelectItem>
                        <SelectItem value="US">Estados Unidos</SelectItem>
                        <SelectItem value="CA">Canadá</SelectItem>
                        <SelectItem value="GT">Guatemala</SelectItem>
                        <SelectItem value="BZ">Belice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Dirección completa */}
                <div>
                  <Label htmlFor="direccion">Dirección Completa</Label>
                  <Textarea
                    id="direccion"
                    value={profileData.direccion}
                    onChange={(e) => handleInputChange('profile', 'direccion', e.target.value)}
                    placeholder="Calle, número, colonia, código postal..."
                    rows={2}
                  />
                </div>

                {/* Biografía */}
                <div>
                  <Label htmlFor="biografia">Biografía</Label>
                  <Textarea
                    id="biografia"
                    value={profileData.biografia}
                    onChange={(e) => handleInputChange('profile', 'biografia', e.target.value)}
                    placeholder="Cuéntanos sobre tu experiencia y especialización..."
                    rows={3}
                  />
                </div>

                {/* Información de cuenta */}
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Miembro desde:</span>
                    <p>{profileData.fecha_creacion ? format(new Date(profileData.fecha_creacion), 'PPP', { locale: es }) : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Último acceso:</span>
                    <p>{profileData.ultimo_acceso ? format(new Date(profileData.ultimo_acceso), 'PPp', { locale: es }) : 'N/A'}</p>
                  </div>
                </div>

                {/* Botón guardar */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Guardar Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Preferencias */}
          <TabsContent value="preferences">
            <div className="space-y-6">
              {/* Configuración general */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Configuración General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="idioma">Idioma</Label>
                      <Select
                        value={preferences.idioma}
                        onValueChange={(value) => handleInputChange('preferences', 'idioma', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="zona_horaria">Zona Horaria</Label>
                      <Select
                        value={preferences.zona_horaria}
                        onValueChange={(value) => handleInputChange('preferences', 'zona_horaria', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Mexico_City">México (GMT-6)</SelectItem>
                          <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Los Ángeles (GMT-8)</SelectItem>
                          <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Tema de la Aplicación</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Button
                        variant={preferences.tema === 'light' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleInputChange('preferences', 'tema', 'light')}
                        className="flex items-center gap-2"
                      >
                        <Sun className="h-4 w-4" />
                        Claro
                      </Button>
                      <Button
                        variant={preferences.tema === 'dark' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleInputChange('preferences', 'tema', 'dark')}
                        className="flex items-center gap-2"
                      >
                        <Moon className="h-4 w-4" />
                        Oscuro
                      </Button>
                      <Button
                        variant={preferences.tema === 'system' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleInputChange('preferences', 'tema', 'system')}
                        className="flex items-center gap-2"
                      >
                        <Monitor className="h-4 w-4" />
                        Sistema
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notificaciones */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notificaciones_email">Notificaciones por Email</Label>
                      <p className="text-sm text-gray-500">
                        Recibe actualizaciones importantes por correo electrónico
                      </p>
                    </div>
                    <Switch
                      id="notificaciones_email"
                      checked={preferences.notificaciones_email}
                      onCheckedChange={(checked) => handleInputChange('preferences', 'notificaciones_email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notificaciones_sms">Notificaciones por SMS</Label>
                      <p className="text-sm text-gray-500">
                        Recibe alertas críticas por mensaje de texto
                      </p>
                    </div>
                    <Switch
                      id="notificaciones_sms"
                      checked={preferences.notificaciones_sms}
                      onCheckedChange={(checked) => handleInputChange('preferences', 'notificaciones_sms', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notificaciones_push">Notificaciones Push</Label>
                      <p className="text-sm text-gray-500">
                        Recibe notificaciones en el navegador
                      </p>
                    </div>
                    <Switch
                      id="notificaciones_push"
                      checked={preferences.notificaciones_push}
                      onCheckedChange={(checked) => handleInputChange('preferences', 'notificaciones_push', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="alertas_emergencia">Alertas de Emergencia</Label>
                      <p className="text-sm text-gray-500">
                        Notificaciones inmediatas para situaciones críticas
                      </p>
                    </div>
                    <Switch
                      id="alertas_emergencia"
                      checked={preferences.alertas_emergencia}
                      onCheckedChange={(checked) => handleInputChange('preferences', 'alertas_emergencia', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reportes_automaticos">Reportes Automáticos</Label>
                      <p className="text-sm text-gray-500">
                        Recibe reportes semanales y mensuales automáticamente
                      </p>
                    </div>
                    <Switch
                      id="reportes_automaticos"
                      checked={preferences.reportes_automaticos}
                      onCheckedChange={(checked) => handleInputChange('preferences', 'reportes_automaticos', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacidad */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacidad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="privacidad_perfil">Visibilidad del Perfil</Label>
                    <Select
                      value={preferences.privacidad_perfil}
                      onValueChange={(value) => handleInputChange('preferences', 'privacidad_perfil', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Público</SelectItem>
                        <SelectItem value="team">Solo equipo</SelectItem>
                        <SelectItem value="private">Privado</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">
                      Controla quién puede ver tu información de perfil
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mostrar_telefono">Mostrar Teléfono</Label>
                      <p className="text-sm text-gray-500">
                        Permitir que otros usuarios vean tu número de teléfono
                      </p>
                    </div>
                    <Switch
                      id="mostrar_telefono"
                      checked={preferences.mostrar_telefono}
                      onCheckedChange={(checked) => handleInputChange('preferences', 'mostrar_telefono', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mostrar_email">Mostrar Email</Label>
                      <p className="text-sm text-gray-500">
                        Permitir que otros usuarios vean tu dirección de email
                      </p>
                    </div>
                    <Switch
                      id="mostrar_email"
                      checked={preferences.mostrar_email}
                      onCheckedChange={(checked) => handleInputChange('preferences', 'mostrar_email', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Botón guardar preferencias */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSavePreferences}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Guardar Preferencias
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Seguridad */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Cambiar contraseña */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Cambiar Contraseña
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="password_actual">Contraseña Actual *</Label>
                    <div className="relative">
                      <Input
                        id="password_actual"
                        type={showPassword.actual ? 'text' : 'password'}
                        value={securityData.password_actual}
                        onChange={(e) => handleInputChange('security', 'password_actual', e.target.value)}
                        placeholder="Tu contraseña actual"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(prev => ({ ...prev, actual: !prev.actual }))}
                      >
                        {showPassword.actual ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password_actual && (
                      <p className="text-red-500 text-sm mt-1">{errors.password_actual}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password_nueva">Nueva Contraseña *</Label>
                    <div className="relative">
                      <Input
                        id="password_nueva"
                        type={showPassword.nueva ? 'text' : 'password'}
                        value={securityData.password_nueva}
                        onChange={(e) => handleInputChange('security', 'password_nueva', e.target.value)}
                        placeholder="Tu nueva contraseña"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(prev => ({ ...prev, nueva: !prev.nueva }))}
                      >
                        {showPassword.nueva ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password_nueva && (
                      <p className="text-red-500 text-sm mt-1">{errors.password_nueva}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmar_password">Confirmar Nueva Contraseña *</Label>
                    <div className="relative">
                      <Input
                        id="confirmar_password"
                        type={showPassword.confirmar ? 'text' : 'password'}
                        value={securityData.confirmar_password}
                        onChange={(e) => handleInputChange('security', 'confirmar_password', e.target.value)}
                        placeholder="Confirma tu nueva contraseña"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(prev => ({ ...prev, confirmar: !prev.confirmar }))}
                      >
                        {showPassword.confirmar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.confirmar_password && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmar_password}</p>
                    )}
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                    Cambiar Contraseña
                  </Button>
                </CardContent>
              </Card>

              {/* Autenticación de dos factores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Autenticación de Dos Factores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autenticación de Dos Factores (2FA)</Label>
                      <p className="text-sm text-gray-500">
                        Añade una capa extra de seguridad a tu cuenta
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={securityData.autenticacion_dos_factores ? "default" : "secondary"}>
                        {securityData.autenticacion_dos_factores ? "Habilitado" : "Deshabilitado"}
                      </Badge>
                      <Switch
                        checked={securityData.autenticacion_dos_factores}
                        onCheckedChange={handleToggle2FA}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sesiones activas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Sesiones Activas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securityData.sesiones_activas.map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {session.device_type === 'mobile' ? 
                              <Smartphone className="h-4 w-4" /> : 
                              <Monitor className="h-4 w-4" />
                            }
                          </div>
                          <div>
                            <p className="font-medium">{session.device_name}</p>
                            <p className="text-sm text-gray-500">
                              {session.location} • {format(new Date(session.last_activity), 'PPp', { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.is_current && (
                            <Badge variant="default">Actual</Badge>
                          )}
                          {!session.is_current && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLogoutDevice(session.id)}
                            >
                              Cerrar Sesión
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default Profile;