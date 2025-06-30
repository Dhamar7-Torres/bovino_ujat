// Layout principal de la aplicación con sidebar, header y contenido principal

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
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
  BarChart3
} from 'lucide-react';

// Importar componentes necesarios
import Navigation from '../Navigation/Navigation';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const MainLayout = () => {
  // Estados para el control del layout
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Estados para datos del usuario y notificaciones
  const [user, setUser] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@ranch.com',
    role: 'Administrador',
    avatar: '/api/placeholder/40/40',
    ranch: 'Rancho El Paraíso'
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Vacunación Pendiente',
      message: '5 bovinos requieren vacunación hoy',
      time: '2 min',
      unread: true
    },
    {
      id: 2,
      type: 'info',
      title: 'Reporte Semanal',
      message: 'Reporte de producción disponible',
      time: '1 hora',
      unread: true
    },
    {
      id: 3,
      type: 'success',
      title: 'Backup Completado',
      message: 'Copia de seguridad realizada exitosamente',
      time: '3 horas',
      unread: false
    }
  ]);

  const location = useLocation();

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
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  // Efectos para manejo de eventos
  useEffect(() => {
    // Detectar cambios en el estado de conexión
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detectar cambios en el modo oscuro del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setDarkMode(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    setDarkMode(mediaQuery.matches);

    // Cerrar menús al hacer click fuera
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu')) {
        setUserMenuOpen(false);
      }
      if (!event.target.closest('.notifications-menu')) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Manejo de teclas de acceso rápido
    const handleKeyDown = (event) => {
      // Toggle sidebar con Ctrl+B
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault();
        setSidebarOpen(prev => !prev);
      }
      
      // Búsqueda con Ctrl+K
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      mediaQuery.removeEventListener('change', handleChange);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Función para obtener el título de la página actual
  const getPageTitle = () => {
    const pathMap = {
      '/': 'Dashboard',
      '/bovines': 'Gestión de Bovinos',
      '/health': 'Salud',
      '/production': 'Producción',
      '/reproduction': 'Reproducción',
      '/inventory': 'Inventario',
      '/finances': 'Finanzas',
      '/reports': 'Reportes',
      '/settings': 'Configuración'
    };
    
    return pathMap[location.pathname] || 'Sistema Ganadero';
  };

  // Función para obtener breadcrumbs
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ name: 'Inicio', path: '/', icon: Home }];
    
    let currentPath = '';
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      const name = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ 
        name, 
        path: currentPath,
        icon: getIconForPath(currentPath)
      });
    });
    
    return breadcrumbs;
  };

  // Función para obtener icono según la ruta
  const getIconForPath = (path) => {
    const iconMap = {
      '/bovines': Calendar,
      '/health': BarChart3,
      '/production': BarChart3,
      '/reports': BarChart3
    };
    return iconMap[path] || Home;
  };

  // Función para manejar logout
  const handleLogout = () => {
    // Aquí integrarías con tu sistema de autenticación
    console.log('Cerrando sesión...');
    // localStorage.removeItem('authToken');
    // navigate('/login');
  };

  // Función para alternar modo oscuro
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  };

  // Función para alternar pantalla completa
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  // Función para marcar notificación como leída
  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  // Función para obtener el color del tipo de notificación
  const getNotificationColor = (type) => {
    const colors = {
      warning: 'text-yellow-600 bg-yellow-100',
      info: 'text-blue-600 bg-blue-100',
      success: 'text-green-600 bg-green-100',
      error: 'text-red-600 bg-red-100'
    };
    return colors[type] || colors.info;
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={sidebarOpen ? "open" : "closed"}
        className="fixed left-0 top-0 z-40 h-full bg-white shadow-lg border-r border-gray-200 overflow-hidden"
      >
        <ErrorBoundary>
          <Navigation 
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
            darkMode={darkMode}
          />
        </ErrorBoundary>
      </motion.aside>

      {/* Overlay para móviles */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Contenido principal */}
      <motion.div
        variants={contentVariants}
        animate="expanded"
        className="min-h-screen"
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Lado izquierdo - Toggle sidebar y breadcrumbs */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(prev => !prev)}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  {sidebarOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>

                {/* Breadcrumbs */}
                <nav className="hidden sm:flex items-center space-x-2 text-sm">
                  {getBreadcrumbs().map((crumb, index) => (
                    <React.Fragment key={crumb.path}>
                      {index > 0 && (
                        <span className="text-gray-400">/</span>
                      )}
                      <div className="flex items-center space-x-1 text-gray-600">
                        <crumb.icon className="h-4 w-4" />
                        <span>{crumb.name}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </nav>

                {/* Título de página en móviles */}
                <h1 className="sm:hidden text-lg font-semibold text-gray-900">
                  {getPageTitle()}
                </h1>
              </div>

              {/* Centro - Barra de búsqueda */}
              <div className="hidden md:flex flex-1 max-w-lg mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Buscar bovinos, reportes... (Ctrl+K)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  />
                </div>
              </div>

              {/* Lado derecho - Controles y menús */}
              <div className="flex items-center space-x-2">
                {/* Indicador de conexión */}
                <div className="hidden sm:flex items-center">
                  {isOnline ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-500" />
                  )}
                </div>

                {/* Toggle modo oscuro */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>

                {/* Toggle pantalla completa */}
                <button
                  onClick={toggleFullscreen}
                  className="hidden sm:block p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  {fullscreen ? (
                    <Minimize className="h-5 w-5" />
                  ) : (
                    <Maximize className="h-5 w-5" />
                  )}
                </button>

                {/* Notificaciones */}
                <div className="relative notifications-menu">
                  <button
                    onClick={() => setNotificationsOpen(prev => !prev)}
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors relative"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.some(n => n.unread) && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-900">Notificaciones</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 ${
                                notification.unread ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                              }`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${getNotificationColor(notification.type)}`}></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-2 border-t border-gray-200">
                          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            Ver todas las notificaciones
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Menú de usuario */}
                <div className="relative user-menu">
                  <button
                    onClick={() => setUserMenuOpen(prev => !prev)}
                    className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full border-2 border-gray-200"
                    />
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                      >
                        {/* Información del usuario */}
                        <div className="px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-10 w-10 rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                              <p className="text-xs text-gray-400">{user.role} - {user.ranch}</p>
                            </div>
                          </div>
                        </div>

                        {/* Opciones del menú */}
                        <div className="py-2">
                          <a
                            href="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <User className="h-4 w-4 mr-3" />
                            Mi Perfil
                          </a>
                          <a
                            href="/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Settings className="h-4 w-4 mr-3" />
                            Configuración
                          </a>
                        </div>

                        <div className="border-t border-gray-200 py-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Cerrar Sesión
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="flex-1">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>

        {/* Footer opcional */}
        <footer className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="text-center text-sm text-gray-500">
            © 2024 Sistema de Gestión Ganadera. Versión 2.0.0
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default MainLayout;