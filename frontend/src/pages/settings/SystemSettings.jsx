import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Spline } from '@splinetool/react-spline';
import { Calendar } from '@/components/ui/calendar';
import { 
  Settings, 
  Database, 
  Bell, 
  Shield, 
  Cloud, 
  RefreshCw,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Save,
  Monitor,
  HardDrive,
  Network,
  Lock,
  Mail,
  Smartphone,
  Globe,
  Timer,
  BarChart3,
  FileText,
  Users,
  Activity
} from 'lucide-react';

const SystemSettings = () => {
  // Estados para configuración del sistema
  const [systemConfig, setSystemConfig] = useState({
    nombre_sistema: 'Sistema de Gestión Ganadera',
    version: '2.0.0',
    idioma: 'es',
    zona_horaria: 'America/Mexico_City',
    formato_fecha: 'DD/MM/YYYY',
    formato_hora: '24h',
    moneda: 'MXN',
    precision_decimales: 2,
    tema_interfaz: 'light',
    modo_desarrollador: false,
    logs_detallados: true
  });

  // Estados para configuración de base de datos
  const [databaseConfig, setDatabaseConfig] = useState({
    tipo_bd: 'PostgreSQL',
    host: 'localhost',
    puerto: 5432,
    nombre_bd: 'bovine_management',
    pool_conexiones: 20,
    timeout_consulta: 30000,
    backup_automatico: true,
    backup_frecuencia: 'diario',
    backup_hora: '02:00',
    retencion_backups: 30,
    optimizacion_automatica: true,
    indizacion_automatica: true,
    compresion_datos: false
  });

  // Estados para configuración de notificaciones
  const [notificationConfig, setNotificationConfig] = useState({
    notificaciones_push: true,
    notificaciones_email: true,
    notificaciones_sms: false,
    notificaciones_sonido: true,
    notificaciones_desktop: true,
    alertas_criticas: true,
    alertas_advertencias: true,
    alertas_informativas: false,
    frecuencia_resumen: 'diario',
    hora_resumen: '08:00',
    notif_salud_critica: true,
    notif_produccion_baja: true,
    notif_inventario_bajo: true,
    notif_eventos_proximos: true,
    notif_finanzas_importantes: true
  });

  // Estados para configuración de seguridad
  const [securityConfig, setSecurityConfig] = useState({
    autenticacion_2fa: false,
    duracion_sesion: 480, // minutos
    intentos_login_max: 5,
    bloqueo_temporal: 30, // minutos
    fuerza_cambio_password: false,
    frecuencia_cambio_password: 90, // días
    longitud_minima_password: 8,
    requerir_mayusculas: true,
    requerir_numeros: true,
    requerir_simbolos: true,
    historial_passwords: 5,
    encriptacion_datos: true,
    logs_auditoria: true,
    acceso_ip_restringido: false,
    ips_permitidas: []
  });

  // Estados para configuración de respaldo y cloud
  const [cloudConfig, setCloudConfig] = useState({
    proveedor_cloud: 'aws',
    backup_cloud: false,
    sincronizacion_tiempo_real: false,
    region: 'us-east-1',
    bucket_nombre: 'bovine-management-backups',
    encriptacion_transito: true,
    encriptacion_reposo: true,
    redundancia: 'multiple',
    cdn_activo: false,
    compresion_imagenes: true,
    cache_datos: true,
    tiempo_cache: 3600 // segundos
  });

  // Estados para monitoreo del sistema
  const [systemMonitoring, setSystemMonitoring] = useState({
    cpu_uso: 0,
    memoria_uso: 0,
    almacenamiento_uso: 0,
    conexiones_bd: 0,
    requests_por_minuto: 0,
    tiempo_respuesta_promedio: 0,
    errores_por_hora: 0,
    usuarios_activos: 0,
    ultima_actualizacion: new Date()
  });

  // Estados para logs del sistema
  const [systemLogs, setSystemLogs] = useState([]);
  const [selectedLogLevel, setSelectedLogLevel] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('general');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);

  // Tabs de configuración
  const configTabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'database', name: 'Base de Datos', icon: Database },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'security', name: 'Seguridad', icon: Shield },
    { id: 'cloud', name: 'Cloud y Respaldo', icon: Cloud },
    { id: 'monitoring', name: 'Monitoreo', icon: Monitor },
    { id: 'logs', name: 'Logs del Sistema', icon: FileText }
  ];

  // Cargar configuraciones al montar el componente
  useEffect(() => {
    loadSystemConfigurations();
    loadSystemMonitoring();
    loadSystemLogs();
    
    // Actualizar monitoreo cada 30 segundos
    const monitoringInterval = setInterval(loadSystemMonitoring, 30000);
    
    return () => clearInterval(monitoringInterval);
  }, []);

  // Cargar todas las configuraciones del sistema
  const loadSystemConfigurations = async () => {
    try {
      const [systemRes, dbRes, notifRes, secRes, cloudRes] = await Promise.all([
        fetch('/api/system/config/general'),
        fetch('/api/system/config/database'),
        fetch('/api/system/config/notifications'),
        fetch('/api/system/config/security'),
        fetch('/api/system/config/cloud')
      ]);

      if (systemRes.ok) setSystemConfig(await systemRes.json());
      if (dbRes.ok) setDatabaseConfig(await dbRes.json());
      if (notifRes.ok) setNotificationConfig(await notifRes.json());
      if (secRes.ok) setSecurityConfig(await secRes.json());
      if (cloudRes.ok) setCloudConfig(await cloudRes.json());
    } catch (error) {
      console.error('Error cargando configuraciones del sistema:', error);
    }
  };

  // Cargar datos de monitoreo del sistema
  const loadSystemMonitoring = async () => {
    try {
      const response = await fetch('/api/system/monitoring');
      if (response.ok) {
        const data = await response.json();
        setSystemMonitoring(data);
      }
    } catch (error) {
      console.error('Error cargando monitoreo del sistema:', error);
    }
  };

  // Cargar logs del sistema
  const loadSystemLogs = async () => {
    try {
      const response = await fetch(`/api/system/logs?level=${selectedLogLevel}&date=${selectedDate.toISOString()}`);
      if (response.ok) {
        const data = await response.json();
        setSystemLogs(data);
      }
    } catch (error) {
      console.error('Error cargando logs del sistema:', error);
    }
  };

  // Manejo de cambios en inputs
  const handleInputChange = (section, field, value) => {
    switch (section) {
      case 'system':
        setSystemConfig(prev => ({ ...prev, [field]: value }));
        break;
      case 'database':
        setDatabaseConfig(prev => ({ ...prev, [field]: value }));
        break;
      case 'notifications':
        setNotificationConfig(prev => ({ ...prev, [field]: value }));
        break;
      case 'security':
        setSecurityConfig(prev => ({ ...prev, [field]: value }));
        break;
      case 'cloud':
        setCloudConfig(prev => ({ ...prev, [field]: value }));
        break;
    }

    // Limpiar errores
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validar configuraciones
  const validateConfigurations = (section) => {
    const newErrors = {};

    switch (section) {
      case 'system':
        if (!systemConfig.nombre_sistema.trim()) {
          newErrors.nombre_sistema = 'El nombre del sistema es requerido';
        }
        if (systemConfig.precision_decimales < 0 || systemConfig.precision_decimales > 4) {
          newErrors.precision_decimales = 'La precisión debe estar entre 0 y 4';
        }
        break;
      case 'database':
        if (!databaseConfig.host.trim()) {
          newErrors.host = 'El host es requerido';
        }
        if (databaseConfig.puerto < 1 || databaseConfig.puerto > 65535) {
          newErrors.puerto = 'El puerto debe estar entre 1 y 65535';
        }
        if (databaseConfig.pool_conexiones < 5 || databaseConfig.pool_conexiones > 100) {
          newErrors.pool_conexiones = 'El pool debe estar entre 5 y 100 conexiones';
        }
        break;
      case 'security':
        if (securityConfig.longitud_minima_password < 6) {
          newErrors.longitud_minima_password = 'La longitud mínima debe ser al menos 6';
        }
        if (securityConfig.duracion_sesion < 30) {
          newErrors.duracion_sesion = 'La duración mínima de sesión es 30 minutos';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar configuraciones
  const handleSaveConfiguration = async (section) => {
    if (!validateConfigurations(section)) return;

    setLoading(true);
    try {
      let endpoint, data;
      
      switch (section) {
        case 'system':
          endpoint = '/api/system/config/general';
          data = systemConfig;
          break;
        case 'database':
          endpoint = '/api/system/config/database';
          data = databaseConfig;
          break;
        case 'notifications':
          endpoint = '/api/system/config/notifications';
          data = notificationConfig;
          break;
        case 'security':
          endpoint = '/api/system/config/security';
          data = securityConfig;
          break;
        case 'cloud':
          endpoint = '/api/system/config/cloud';
          data = cloudConfig;
          break;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Configuración guardada exitosamente');
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

  // Acciones del sistema
  const handleSystemAction = async (action) => {
    setActionToConfirm(action);
    setShowConfirmModal(true);
  };

  const confirmSystemAction = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/system/actions/${actionToConfirm}`, {
        method: 'POST'
      });

      if (response.ok) {
        alert(`Acción ${actionToConfirm} ejecutada exitosamente`);
        if (actionToConfirm === 'restart') {
          window.location.reload();
        }
      } else {
        alert(`Error ejecutando acción ${actionToConfirm}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setActionToConfirm(null);
    }
  };

  // Exportar configuraciones
  const handleExportConfig = async () => {
    try {
      const response = await fetch('/api/system/export-config');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-config-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } catch (error) {
      console.error('Error exportando configuración:', error);
      alert('Error al exportar configuración');
    }
  };

  // Importar configuraciones
  const handleImportConfig = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('config', file);

    try {
      const response = await fetch('/api/system/import-config', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Configuración importada exitosamente');
        loadSystemConfigurations();
      } else {
        alert('Error al importar configuración');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  // Renderizar configuración general
  const renderGeneralConfig = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Sistema
          </label>
          <input
            type="text"
            value={systemConfig.nombre_sistema}
            onChange={(e) => handleInputChange('system', 'nombre_sistema', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.nombre_sistema && (
            <p className="text-red-500 text-sm mt-1">{errors.nombre_sistema}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Versión
          </label>
          <input
            type="text"
            value={systemConfig.version}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Idioma
          </label>
          <select
            value={systemConfig.idioma}
            onChange={(e) => handleInputChange('system', 'idioma', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zona Horaria
          </label>
          <select
            value={systemConfig.zona_horaria}
            onChange={(e) => handleInputChange('system', 'zona_horaria', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
            <option value="America/New_York">Nueva York (GMT-5)</option>
            <option value="America/Los_Angeles">Los Ángeles (GMT-8)</option>
            <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Formato de Fecha
          </label>
          <select
            value={systemConfig.formato_fecha}
            onChange={(e) => handleInputChange('system', 'formato_fecha', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Moneda
          </label>
          <select
            value={systemConfig.moneda}
            onChange={(e) => handleInputChange('system', 'moneda', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="MXN">Peso Mexicano (MXN)</option>
            <option value="USD">Dólar Americano (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="BRL">Real Brasileño (BRL)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precisión Decimales
          </label>
          <input
            type="number"
            min="0"
            max="4"
            value={systemConfig.precision_decimales}
            onChange={(e) => handleInputChange('system', 'precision_decimales', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.precision_decimales && (
            <p className="text-red-500 text-sm mt-1">{errors.precision_decimales}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tema de Interfaz
          </label>
          <select
            value={systemConfig.tema_interfaz}
            onChange={(e) => handleInputChange('system', 'tema_interfaz', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
            <option value="auto">Automático</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="modo_desarrollador"
            checked={systemConfig.modo_desarrollador}
            onChange={(e) => handleInputChange('system', 'modo_desarrollador', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="modo_desarrollador" className="ml-2 block text-sm text-gray-900">
            Modo Desarrollador
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="logs_detallados"
            checked={systemConfig.logs_detallados}
            onChange={(e) => handleInputChange('system', 'logs_detallados', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="logs_detallados" className="ml-2 block text-sm text-gray-900">
            Logs Detallados
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSaveConfiguration('system')}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Guardando...' : 'Guardar Configuración'}</span>
        </button>
      </div>
    </motion.div>
  );

  // Renderizar monitoreo del sistema
  const renderSystemMonitoring = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Uso de CPU</p>
              <p className="text-3xl font-bold">{systemMonitoring.cpu_uso}%</p>
            </div>
            <Activity className="w-8 h-8 text-blue-100" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Memoria RAM</p>
              <p className="text-3xl font-bold">{systemMonitoring.memoria_uso}%</p>
            </div>
            <HardDrive className="w-8 h-8 text-green-100" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Almacenamiento</p>
              <p className="text-3xl font-bold">{systemMonitoring.almacenamiento_uso}%</p>
            </div>
            <Database className="w-8 h-8 text-purple-100" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Conexiones BD</p>
              <p className="text-3xl font-bold">{systemMonitoring.conexiones_bd}</p>
            </div>
            <Network className="w-8 h-8 text-orange-100" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rendimiento</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Requests por minuto:</span>
              <span className="font-medium">{systemMonitoring.requests_por_minuto}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tiempo respuesta promedio:</span>
              <span className="font-medium">{systemMonitoring.tiempo_respuesta_promedio}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Errores por hora:</span>
              <span className="font-medium text-red-600">{systemMonitoring.errores_por_hora}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Usuarios activos:</span>
              <span className="font-medium">{systemMonitoring.usuarios_activos}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones del Sistema</h3>
          <div className="space-y-3">
            <button
              onClick={() => handleSystemAction('backup')}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Crear Backup</span>
            </button>
            <button
              onClick={() => handleSystemAction('optimize')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Optimizar BD</span>
            </button>
            <button
              onClick={() => handleSystemAction('clear-cache')}
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Limpiar Cache</span>
            </button>
            <button
              onClick={() => handleSystemAction('restart')}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reiniciar Sistema</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con modelo 3D */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Settings className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
                <p className="text-sm text-gray-600">Gestión avanzada de configuraciones</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExportConfig}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
              <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Importar</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportConfig}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs de navegación */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          {configTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Contenido según tab activo */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {activeTab === 'general' && renderGeneralConfig()}
          {activeTab === 'monitoring' && renderSystemMonitoring()}
          {/* Aquí irían los demás renderizadores para database, notifications, security, cloud y logs */}
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              <h3 className="text-lg font-medium text-gray-900">
                Confirmar Acción
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas ejecutar la acción: <strong>{actionToConfirm}</strong>?
              Esta acción puede afectar el funcionamiento del sistema.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSystemAction}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Ejecutando...' : 'Confirmar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;