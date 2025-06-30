/**
 * Layout.jsx - Layout principal de la aplicación de gestión de bovinos
 * Incluye navegación, header, sidebar y manejo de estado global del layout
 */

import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Maximize,
  Minimize,
  Wifi,
  WifiOff,
  ChevronDown,
  Home,
  Calendar,
  BarChart3,
  Cow,
  Heart,
  Activity,
  Package,
  DollarSign,
  FileText,
  MapPin,
  Shield,
  HelpCircle,
  MessageSquare,
  Bookmark,
  Filter,
  Plus,
  RefreshCw,
  Download,
  Upload,
  Share,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Globe,
  Smartphone,
  Monitor,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Folder,
  Edit,
  Trash2,
  Archive,
  MoreHorizontal
} from 'lucide-react';

// Importar componentes necesarios
import Navigation from '../Navigation/Navigation';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Loading from '../Loading/Loading';

// Context para el tema y preferencias globales
const LayoutContext = React.createContext();

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

const Layout = ({ children }) => {
  // Estados principales del layout
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [layout, setLayout] = useState('desktop'); // 'mobile', 'tablet', 'desktop'

  // Estados para datos del usuario y notificaciones
  const [user, setUser] = useState({
    id: 1,
    name: 'Juan Pérez',
    email: 'juan.perez@ranch.com',
    role: 'Administrador',
    avatar: '/api/placeholder/40/40',
    ranch: 'Rancho El Paraíso',
    permissions: ['read', 'write', 'admin'],
    lastLogin: new Date(),
    preferences: {
      language: 'es',
      timezone: 'America/Mexico_City',
      notifications: true,
      emailAlerts: true
    }
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Vacunación Pendiente',
      message: '5 bovinos requieren vacunación hoy',
      time: '2 min',
      unread: true,
      priority: 'high',
      category: 'health',
      actionUrl: '/health/vaccines'
    },
    {
      id: 2,
      type: 'info',
      title: 'Reporte Semanal',
      message: 'Reporte de producción disponible',
      time: '1 hora',
      unread: true,
      priority: 'medium',
      category: 'reports',
      actionUrl: '/reports'
    },
    {
      id: 3,
      type: 'success',
      title: 'Backup Completado',
      message: 'Copia de seguridad realizada exitosamente',
      time: '3 horas',
      unread: false,
      priority: 'low',
      category: 'system',
      actionUrl: null
    },
    {
      id: 4,
      type: 'alert',
      title: 'Bovino Enfermo',
      message: 'Vaca #247 requiere atención veterinaria urgente',
      time: '30 min',
      unread: true,
      priority: 'urgent',
      category: 'health',
      actionUrl: '/bovines/247'
    }
  ]);

  // Referencias para manejo de elementos DOM
  const searchInputRef = useRef(null);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Hooks para routing y navegación
  const location = useLocation();
  const navigate = useNavigate();

  // Configuración de animaciones
  const sidebarVariants = {
    open: {
      width: sidebarCollapsed ? '4rem' : '16rem',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    closed: {
      width: '0rem',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const contentVariants = {
    expanded: {
      marginLeft: sidebarOpen ? (sidebarCollapsed ? '4rem' : '16rem') : '0rem',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const overlayVariants = {
    visible: { opacity: 1, pointerEvents: 'auto' },
    hidden: { opacity: 0, pointerEvents: 'none' }
  };

  // Efectos para manejo de estado y eventos
  useEffect(() => {
    // Detectar cambios en la conexión de red
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Detectar cambios de tema del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('theme-preference')) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // Aplicar tema inicial
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      setDarkMode(mediaQuery.matches);
    }

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  useEffect(() => {
    // Aplicar clase de tema al documento
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    // Detectar tamaño de pantalla para layout responsivo
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setLayout('mobile');
        setSidebarOpen(false);
      } else if (width < 1024) {
        setLayout('tablet');
        setSidebarCollapsed(true);
      } else {
        setLayout('desktop');
        setSidebarOpen(true);
        setSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Cerrar menús al hacer clic fuera
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Manejo de teclas de acceso rápido
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + K para abrir búsqueda
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Ctrl/Cmd + B para toggle sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        toggleSidebar();
      }
      
      // Escape para cerrar menús
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
        setNotificationsOpen(false);
        setSearchTerm('');
        setSearchResults([]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Funciones de manejo de estado
  const toggleSidebar = () => {
    if (layout === 'mobile') {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme-preference', newDarkMode ? 'dark' : 'light');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      // Simulación de búsqueda - reemplazar con API real
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockResults = [
        {
          id: 1,
          type: 'bovine',
          title: 'Vaca #247 - Bessie',
          description: 'Holstein, 4 años, Producción lechera',
          url: '/bovines/247',
          icon: Cow
        },
        {
          id: 2,
          type: 'health',
          title: 'Registro de Vacunación',
          description: 'Última vacunación: 15 de marzo',
          url: '/health/vaccines',
          icon: Heart
        },
        {
          id: 3,
          type: 'report',
          title: 'Reporte de Producción Marzo',
          description: 'Análisis mensual de productividad',
          url: '/reports/production/march',
          icon: BarChart3
        }
      ].filter(item => 
        item.title.toLowerCase().includes(term.toLowerCase()) ||
        item.description.toLowerCase().includes(term.toLowerCase())
      );

      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLogout = () => {
    // Lógica de logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, unread: false }
          : notif
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, unread: false }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  // Función para obtener el título de la página actual
  const getPageTitle = () => {
    const pathMap = {
      '/': 'Dashboard',
      '/bovines': 'Gestión de Bovinos',
      '/health': 'Control Sanitario',
      '/production': 'Producción',
      '/breeding': 'Reproducción',
      '/inventory': 'Inventario',
      '/finance': 'Finanzas',
      '/reports': 'Reportes',
      '/settings': 'Configuración'
    };

    const currentPath = location.pathname;
    return pathMap[currentPath] || 'Sistema de Gestión de Bovinos';
  };

  // Contadores para badges
  const unreadNotificationsCount = notifications.filter(n => n.unread).length;
  const urgentNotificationsCount = notifications.filter(n => n.unread && n.priority === 'urgent').length;

  // Valor del contexto para proveer a componentes hijos
  const layoutContextValue = {
    sidebarOpen,
    sidebarCollapsed,
    darkMode,
    fullscreen,
    isOnline,
    layout,
    user,
    toggleSidebar,
    toggleDarkMode,
    toggleFullscreen,
    setSidebarOpen,
    setSidebarCollapsed
  };

  return (
    <LayoutContext.Provider value={layoutContextValue}>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${fullscreen ? 'overflow-hidden' : ''}`}>
        
        {/* Overlay para mobile cuando sidebar está abierto */}
        <AnimatePresence>
          {layout === 'mobile' && sidebarOpen && (
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          className={`fixed left-0 top-0 z-50 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
            layout === 'mobile' ? 'shadow-xl' : ''
          }`}
          variants={sidebarVariants}
          animate={sidebarOpen ? 'open' : 'closed'}
        >
          <ErrorBoundary>
            <Navigation 
              collapsed={sidebarCollapsed}
              onToggleCollapse={toggleSidebar}
              darkMode={darkMode}
              user={user}
              layout={layout}
            />
          </ErrorBoundary>
        </motion.aside>

        {/* Contenido principal */}
        <motion.main
          className="transition-all duration-300"
          variants={contentVariants}
          animate="expanded"
        >
          {/* Header superior */}
          <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-3">
              
              {/* Lado izquierdo - Controles de navegación */}
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle sidebar"
                >
                  <Menu size={20} className="text-gray-600 dark:text-gray-400" />
                </button>

                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getPageTitle()}
                  </h1>
                </div>
              </div>

              {/* Centro - Barra de búsqueda */}
              <div className="hidden md:flex flex-1 max-w-lg mx-8">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    placeholder="Buscar bovinos, reportes, registros... (Ctrl+K)"
                    className="input-base pl-10 pr-4 w-full"
                  />
                  
                  {/* Resultados de búsqueda */}
                  <AnimatePresence>
                    {(searchResults.length > 0 || searchLoading) && searchTerm && (
                      <motion.div
                        className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {searchLoading ? (
                          <div className="p-4">
                            <Loading message="Buscando..." size="small" />
                          </div>
                        ) : (
                          <div className="max-h-64 overflow-y-auto">
                            {searchResults.map((result) => (
                              <button
                                key={result.id}
                                onClick={() => {
                                  navigate(result.url);
                                  setSearchTerm('');
                                  setSearchResults([]);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                              >
                                <result.icon size={16} className="text-gray-400 flex-shrink-0" />
                                <div className="text-left">
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {result.title}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {result.description}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Lado derecho - Controles de usuario */}
              <div className="flex items-center gap-2">
                
                {/* Indicador de conexión */}
                <div className="hidden sm:flex items-center gap-2">
                  {isOnline ? (
                    <Wifi size={16} className="text-green-500" />
                  ) : (
                    <WifiOff size={16} className="text-red-500" />
                  )}
                </div>

                {/* Toggle de tema */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <Sun size={18} className="text-yellow-500" />
                  ) : (
                    <Moon size={18} className="text-gray-600" />
                  )}
                </button>

                {/* Pantalla completa */}
                <button
                  onClick={toggleFullscreen}
                  className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle fullscreen"
                >
                  {fullscreen ? (
                    <Minimize size={18} className="text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Maximize size={18} className="text-gray-600 dark:text-gray-400" />
                  )}
                </button>

                {/* Notificaciones */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell size={18} className="text-gray-600 dark:text-gray-400" />
                    {unreadNotificationsCount > 0 && (
                      <span className={`absolute -top-1 -right-1 w-5 h-5 text-xs font-medium rounded-full flex items-center justify-center ${
                        urgentNotificationsCount > 0 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {/* Panel de notificaciones */}
                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div
                        className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              Notificaciones
                            </h3>
                            {unreadNotificationsCount > 0 && (
                              <button
                                onClick={markAllNotificationsAsRead}
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                              >
                                Marcar todas como leídas
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-gray-100 dark:border-gray-600 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                  notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${
                                        notification.type === 'warning' ? 'bg-yellow-500' :
                                        notification.type === 'success' ? 'bg-green-500' :
                                        notification.type === 'alert' ? 'bg-red-500' :
                                        'bg-blue-500'
                                      }`} />
                                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                        {notification.title}
                                      </h4>
                                      {notification.unread && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                      {notification.message}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-xs text-gray-500 dark:text-gray-500">
                                        {notification.time}
                                      </span>
                                      {notification.actionUrl && (
                                        <button
                                          onClick={() => {
                                            navigate(notification.actionUrl);
                                            markNotificationAsRead(notification.id);
                                            setNotificationsOpen(false);
                                          }}
                                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                        >
                                          Ver detalles
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => deleteNotification(notification.id)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                              <Bell size={32} className="mx-auto mb-2 opacity-50" />
                              <p>No hay notificaciones</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Menú de usuario */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.role}
                      </div>
                    </div>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>

                  {/* Menú desplegable de usuario */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500">
                                {user.ranch}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-2">
                          <button
                            onClick={() => {
                              navigate('/profile');
                              setUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <User size={16} className="text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">Mi Perfil</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              navigate('/settings');
                              setUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Settings size={16} className="text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">Configuración</span>
                          </button>

                          <button
                            onClick={() => {
                              navigate('/help');
                              setUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <HelpCircle size={16} className="text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">Ayuda</span>
                          </button>

                          <hr className="my-2 border-gray-200 dark:border-gray-600" />

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                          >
                            <LogOut size={16} />
                            <span>Cerrar Sesión</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </header>

          {/* Contenido de la página */}
          <div className="p-4 lg:p-6">
            <ErrorBoundary>
              {children || <Outlet />}
            </ErrorBoundary>
          </div>
        </motion.main>
      </div>
    </LayoutContext.Provider>
  );
};

export default Layout;