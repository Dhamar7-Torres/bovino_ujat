// src/pages/settings/Settings.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Map,
  Palette,
  Globe,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Mail,
  Phone,
  Camera,
  Lock
} from 'lucide-react'
import toast from 'react-hot-toast'

// Página de configuración del sistema
const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Estado de configuraciones
  const [profileSettings, setProfileSettings] = useState({
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@rancho.com',
    phone: '993-123-4567',
    role: 'Administrador',
    avatar: null,
    bio: 'Administrador principal del rancho ganadero',
    location: 'Villahermosa, Tabasco'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    healthAlerts: true,
    productionAlerts: true,
    emergencyAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
    maintenanceReminders: true,
    vaccinationReminders: true,
    breedingReminders: false
  })

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
    sessionTimeout: '60', // minutos
    autoLogout: true,
    loginAlerts: true,
    passwordExpiry: '90' // días
  })

  const [systemSettings, setSystemSettings] = useState({
    language: 'es',
    timezone: 'America/Mexico_City',
    dateFormat: 'DD/MM/YYYY',
    currency: 'MXN',
    units: 'metric',
    theme: 'system',
    compactMode: false,
    animations: true,
    soundNotifications: true
  })

  const [ranchSettings, setRanchSettings] = useState({
    ranchName: 'Rancho San José',
    ranchType: 'Lechero',
    totalArea: '150',
    location: {
      latitude: '17.9892',
      longitude: '-92.9475',
      address: 'Carretera Villahermosa-Frontera Km 15, Tabasco'
    },
    contactInfo: {
      phone: '993-456-7890',
      email: 'info@ranchosanjose.com',
      website: 'www.ranchosanjose.com'
    },
    businessInfo: {
      rfc: 'RSJ123456789',
      license: 'SENASICA-123456',
      veterinarian: 'Dr. María González - Cédula: 1234567'
    }
  })

  // Detectar tema del sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark))
  }, [])

  // Pestañas de configuración
  const tabs = [
    { id: 'profile', label: 'Perfil', icon: <User className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notificaciones', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Seguridad', icon: <Shield className="w-4 h-4" /> },
    { id: 'system', label: 'Sistema', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'ranch', label: 'Rancho', icon: <Map className="w-4 h-4" /> }
  ]

  // Manejar cambios en configuraciones
  const handleSettingChange = (section, field, value) => {
    switch (section) {
      case 'profile':
        setProfileSettings(prev => ({ ...prev, [field]: value }))
        break
      case 'notifications':
        setNotificationSettings(prev => ({ ...prev, [field]: value }))
        break
      case 'security':
        setSecuritySettings(prev => ({ ...prev, [field]: value }))
        break
      case 'system':
        setSystemSettings(prev => ({ ...prev, [field]: value }))
        break
      case 'ranch':
        setRanchSettings(prev => ({ ...prev, [field]: value }))
        break
    }
  }

  // Guardar configuraciones
  const saveSettings = async (section) => {
    setIsLoading(true)
    try {
      // Simular guardado en el servidor
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success(`Configuración de ${section} guardada exitosamente`)
    } catch (error) {
      toast.error('Error al guardar configuración')
    } finally {
      setIsLoading(false)
    }
  }

  // Exportar configuraciones
  const exportSettings = () => {
    const allSettings = {
      profile: profileSettings,
      notifications: notificationSettings,
      security: { ...securitySettings, currentPassword: '', newPassword: '', confirmPassword: '' },
      system: systemSettings,
      ranch: ranchSettings,
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(allSettings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'configuracion-rancho.json'
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Configuración exportada')
  }

  // Manejar subida de avatar
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileSettings(prev => ({ ...prev, avatar: e.target.result }))
        toast.success('Avatar actualizado')
      }
      reader.readAsDataURL(file)
    }
  }

  // Alternar tema
  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    
    setSystemSettings(prev => ({ ...prev, theme: newTheme ? 'dark' : 'light' }))
    toast.success(`Tema ${newTheme ? 'oscuro' : 'claro'} activado`)
  }

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Configuración
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Personaliza tu experiencia en el sistema
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={exportSettings}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex">
        {/* Sidebar de pestañas */}
        <motion.div
          className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen"
          variants={itemVariants}
        >
          <nav className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </motion.div>

        {/* Contenido principal */}
        <div className="flex-1 p-6">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={itemVariants}
          >
            {/* Perfil */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Información del Perfil
                </h2>

                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                        {profileSettings.avatar ? (
                          <img 
                            src={profileSettings.avatar} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-12 h-12 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <label 
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Foto de Perfil
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Formatos JPG, PNG. Máximo 5MB.
                      </p>
                    </div>
                  </div>

                  {/* Información personal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={profileSettings.firstName}
                        onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Apellido
                      </label>
                      <input
                        type="text"
                        value={profileSettings.lastName}
                        onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={profileSettings.email}
                          onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Teléfono
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={profileSettings.phone}
                          onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rol
                      </label>
                      <input
                        type="text"
                        value={profileSettings.role}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={profileSettings.location}
                        onChange={(e) => handleSettingChange('profile', 'location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Biografía */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Biografía
                    </label>
                    <textarea
                      value={profileSettings.bio}
                      onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Cuéntanos sobre ti..."
                    />
                  </div>

                  {/* Botón guardar */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => saveSettings('perfil')}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Guardar Cambios</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notificaciones */}
            {activeTab === 'notifications' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Configuración de Notificaciones
                </h2>

                <div className="space-y-6">
                  {/* Canales de notificación */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Canales de Notificación
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Notificaciones por Email
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Recibir notificaciones en tu correo electrónico
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailNotifications}
                            onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Notificaciones Push
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Notificaciones en tiempo real en tu dispositivo
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.pushNotifications}
                            onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Mensajes SMS
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Alertas críticas por mensaje de texto
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.smsNotifications}
                            onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Tipos de alertas */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Tipos de Alertas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'healthAlerts', label: 'Alertas de Salud', desc: 'Problemas de salud detectados' },
                        { key: 'productionAlerts', label: 'Alertas de Producción', desc: 'Cambios en producción de leche' },
                        { key: 'emergencyAlerts', label: 'Emergencias', desc: 'Situaciones críticas inmediatas' },
                        { key: 'vaccinationReminders', label: 'Recordatorios de Vacunación', desc: 'Vacunas próximas a vencer' },
                        { key: 'breedingReminders', label: 'Recordatorios de Reproducción', desc: 'Ciclos reproductivos' },
                        { key: 'maintenanceReminders', label: 'Mantenimiento', desc: 'Mantenimiento de equipos' }
                      ].map((alert) => (
                        <div key={alert.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {alert.label}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {alert.desc}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings[alert.key]}
                              onChange={(e) => handleSettingChange('notifications', alert.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reportes automáticos */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Reportes Automáticos
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Reporte Semanal
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Resumen de producción y salud cada lunes
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.weeklyReports}
                            onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Reporte Mensual
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Análisis completo del rancho cada mes
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.monthlyReports}
                            onChange={(e) => handleSettingChange('notifications', 'monthlyReports', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Botón guardar */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => saveSettings('notificaciones')}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Guardar Configuración</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Seguridad */}
            {activeTab === 'security' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Configuración de Seguridad
                </h2>

                <div className="space-y-6">
                  {/* Cambio de contraseña */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Cambiar Contraseña
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Contraseña Actual
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={securitySettings.currentPassword}
                            onChange={(e) => handleSettingChange('security', 'currentPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-10"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nueva Contraseña
                          </label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={securitySettings.newPassword}
                            onChange={(e) => handleSettingChange('security', 'newPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="••••••••"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirmar Contraseña
                          </label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={securitySettings.confirmPassword}
                            onChange={(e) => handleSettingChange('security', 'confirmPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Configuraciones de seguridad */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Configuraciones de Seguridad
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Autenticación de Dos Factores
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Añade una capa extra de seguridad a tu cuenta
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.twoFactorAuth}
                            onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Cierre Automático de Sesión
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Cerrar sesión automáticamente por inactividad
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.autoLogout}
                            onChange={(e) => handleSettingChange('security', 'autoLogout', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Alertas de Inicio de Sesión
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Notificar sobre nuevos inicios de sesión
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.loginAlerts}
                            onChange={(e) => handleSettingChange('security', 'loginAlerts', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Configuraciones de tiempo */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Configuraciones de Tiempo
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tiempo de Sesión (minutos)
                        </label>
                        <select
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="15">15 minutos</option>
                          <option value="30">30 minutos</option>
                          <option value="60">60 minutos</option>
                          <option value="120">120 minutos</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Expiración de Contraseña (días)
                        </label>
                        <select
                          value={securitySettings.passwordExpiry}
                          onChange={(e) => handleSettingChange('security', 'passwordExpiry', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="30">30 días</option>
                          <option value="60">60 días</option>
                          <option value="90">90 días</option>
                          <option value="180">180 días</option>
                          <option value="365">365 días</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Botón guardar */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => saveSettings('seguridad')}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      <span>Actualizar Seguridad</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sistema */}
            {activeTab === 'system' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Configuración del Sistema
                </h2>

                <div className="space-y-6">
                  {/* Preferencias generales */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Preferencias Generales
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Idioma
                        </label>
                        <select
                          value={systemSettings.language}
                          onChange={(e) => handleSettingChange('system', 'language', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="es">Español</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Zona Horaria
                        </label>
                        <select
                          value={systemSettings.timezone}
                          onChange={(e) => handleSettingChange('system', 'timezone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="America/Mexico_City">Ciudad de México</option>
                          <option value="America/Cancun">Cancún</option>
                          <option value="America/Hermosillo">Hermosillo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Formato de Fecha
                        </label>
                        <select
                          value={systemSettings.dateFormat}
                          onChange={(e) => handleSettingChange('system', 'dateFormat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Moneda
                        </label>
                        <select
                          value={systemSettings.currency}
                          onChange={(e) => handleSettingChange('system', 'currency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="MXN">Peso Mexicano (MXN)</option>
                          <option value="USD">Dólar Americano (USD)</option>
                          <option value="EUR">Euro (EUR)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Configuraciones de interfaz */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Interfaz de Usuario
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Modo Compacto
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Reduce el espaciado para mostrar más información
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={systemSettings.compactMode}
                            onChange={(e) => handleSettingChange('system', 'compactMode', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Animaciones
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Habilitar animaciones y transiciones
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={systemSettings.animations}
                            onChange={(e) => handleSettingChange('system', 'animations', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Sonidos de Notificación
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Reproducir sonidos para notificaciones
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={systemSettings.soundNotifications}
                            onChange={(e) => handleSettingChange('system', 'soundNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Tema */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Apariencia
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'light', label: 'Claro', icon: <Sun className="w-5 h-5" /> },
                        { value: 'dark', label: 'Oscuro', icon: <Moon className="w-5 h-5" /> },
                        { value: 'system', label: 'Sistema', icon: <Monitor className="w-5 h-5" /> }
                      ].map((theme) => (
                        <button
                          key={theme.value}
                          onClick={() => {
                            handleSettingChange('system', 'theme', theme.value)
                            if (theme.value !== 'system') {
                              setIsDarkMode(theme.value === 'dark')
                              if (theme.value === 'dark') {
                                document.documentElement.classList.add('dark')
                                localStorage.setItem('theme', 'dark')
                              } else {
                                document.documentElement.classList.remove('dark')
                                localStorage.setItem('theme', 'light')
                              }
                            }
                          }}
                          className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                            systemSettings.theme === theme.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          {theme.icon}
                          <span className="text-sm font-medium">{theme.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Botón guardar */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => saveSettings('sistema')}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Guardar Configuración</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Configuración del Rancho */}
            {activeTab === 'ranch' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Información del Rancho
                </h2>

                <div className="space-y-6">
                  {/* Información básica */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Información Básica
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nombre del Rancho
                        </label>
                        <input
                          type="text"
                          value={ranchSettings.ranchName}
                          onChange={(e) => handleSettingChange('ranch', 'ranchName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tipo de Rancho
                        </label>
                        <select
                          value={ranchSettings.ranchType}
                          onChange={(e) => handleSettingChange('ranch', 'ranchType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="Lechero">Lechero</option>
                          <option value="Cárnico">Cárnico</option>
                          <option value="Doble Propósito">Doble Propósito</option>
                          <option value="Reproductivo">Reproductivo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Área Total (hectáreas)
                        </label>
                        <input
                          type="number"
                          value={ranchSettings.totalArea}
                          onChange={(e) => handleSettingChange('ranch', 'totalArea', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Ubicación
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Dirección
                        </label>
                        <textarea
                          value={ranchSettings.location.address}
                          onChange={(e) => setRanchSettings(prev => ({
                            ...prev,
                            location: { ...prev.location, address: e.target.value }
                          }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Latitud
                          </label>
                          <input
                            type="text"
                            value={ranchSettings.location.latitude}
                            onChange={(e) => setRanchSettings(prev => ({
                              ...prev,
                              location: { ...prev.location, latitude: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Longitud
                          </label>
                          <input
                            type="text"
                            value={ranchSettings.location.longitude}
                            onChange={(e) => setRanchSettings(prev => ({
                              ...prev,
                              location: { ...prev.location, longitude: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información de contacto */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Información de Contacto
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          value={ranchSettings.contactInfo.phone}
                          onChange={(e) => setRanchSettings(prev => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, phone: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={ranchSettings.contactInfo.email}
                          onChange={(e) => setRanchSettings(prev => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, email: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Sitio Web
                        </label>
                        <input
                          type="url"
                          value={ranchSettings.contactInfo.website}
                          onChange={(e) => setRanchSettings(prev => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, website: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información legal */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Información Legal
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            RFC
                          </label>
                          <input
                            type="text"
                            value={ranchSettings.businessInfo.rfc}
                            onChange={(e) => setRanchSettings(prev => ({
                              ...prev,
                              businessInfo: { ...prev.businessInfo, rfc: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Licencia SENASICA
                          </label>
                          <input
                            type="text"
                            value={ranchSettings.businessInfo.license}
                            onChange={(e) => setRanchSettings(prev => ({
                              ...prev,
                              businessInfo: { ...prev.businessInfo, license: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Veterinario Responsable
                        </label>
                        <input
                          type="text"
                          value={ranchSettings.businessInfo.veterinarian}
                          onChange={(e) => setRanchSettings(prev => ({
                            ...prev,
                            businessInfo: { ...prev.businessInfo, veterinarian: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Dr. María González - Cédula: 1234567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botón guardar */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => saveSettings('rancho')}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Guardar Información</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Settings