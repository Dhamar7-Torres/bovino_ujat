// Componente de navegación lateral con menús colapsables y animaciones

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Cow,
  Heart,
  BarChart3,
  Baby,
  Package,
  DollarSign,
  FileText,
  Settings,
  Users,
  Calendar,
  MapPin,
  Bell,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Stethoscope,
  Milk,
  TrendingUp,
  Shield,
  Database,
  LogOut
} from 'lucide-react';

const Navigation = ({ 
  collapsed = false, 
  onToggleCollapse,
  darkMode = false,
  user = null 
}) => {
  
  // Estados para control de navegación
  const [expandedMenus, setExpandedMenus] = useState(['main']);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);
  
  const location = useLocation();

  // Configuración de menús de navegación
  const navigationMenus = [
    {
      id: 'main',
      title: 'Principal',
      icon: Home,
      items: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          path: '/',
          icon: Home,
          description: 'Vista general del sistema'
        },
        {
          id: 'calendar',
          title: 'Calendario',
          path: '/calendar',
          icon: Calendar,
          description: 'Eventos y programación',
          badge: '3'
        }
      ]
    },
    {
      id: 'livestock',
      title: 'Gestión Ganadera',
      icon: Cow,
      items: [
        {
          id: 'bovines',
          title: 'Bovinos',
          path: '/bovines',
          icon: Cow,
          description: 'Gestión de ganado',
          submenu: [
            { title: 'Ver Todos', path: '/bovines' },
            { title: 'Agregar Bovino', path: '/bovines/add' },
            { title: 'Importar', path: '/bovines/import' }
          ]
        },
        {
          id: 'health',
          title: 'Salud',
          path: '/health',
          icon: Heart,
          description: 'Salud veterinaria',
          submenu: [
            { title: 'Estado General', path: '/health' },
            { title: 'Vacunaciones', path: '/health/vaccinations' },
            { title: 'Tratamientos', path: '/health/treatments' },
            { title: 'Consultas', path: '/health/consultations' }
          ]
        },
        {
          id: 'reproduction',
          title: 'Reproducción',
          path: '/reproduction',
          icon: Baby,
          description: 'Gestión reproductiva',
          submenu: [
            { title: 'Servicios', path: '/reproduction/services' },
            { title: 'Gestaciones', path: '/reproduction/pregnancies' },
            { title: 'Partos', path: '/reproduction/births' },
            { title: 'Crías', path: '/reproduction/calves' }
          ]
        }
      ]
    },
    {
      id: 'production',
      title: 'Producción',
      icon: BarChart3,
      items: [
        {
          id: 'milk-production',
          title: 'Producción Lechera',
          path: '/production/milk',
          icon: Milk,
          description: 'Registro de leche'
        },
        {
          id: 'meat-production',
          title: 'Producción Cárnica',
          path: '/production/meat',
          icon: TrendingUp,
          description: 'Registro de carne'
        },
        {
          id: 'quality-control',
          title: 'Control de Calidad',
          path: '/production/quality',
          icon: Shield,
          description: 'Análisis de calidad'
        }
      ]
    },
    {
      id: 'management',
      title: 'Administración',
      icon: Database,
      items: [
        {
          id: 'inventory',
          title: 'Inventario',
          path: '/inventory',
          icon: Package,
          description: 'Medicamentos y suministros',
          badge: 'Bajo'
        },
        {
          id: 'finances',
          title: 'Finanzas',
          path: '/finances',
          icon: DollarSign,
          description: 'Gestión financiera',
          submenu: [
            { title: 'Ingresos', path: '/finances/income' },
            { title: 'Gastos', path: '/finances/expenses' },
            { title: 'Presupuestos', path: '/finances/budgets' },
            { title: 'Reportes', path: '/finances/reports' }
          ]
        },
        {
          id: 'reports',
          title: 'Reportes',
          path: '/reports',
          icon: FileText,
          description: 'Informes y estadísticas'
        }
      ]
    },
    {
      id: 'system',
      title: 'Sistema',
      icon: Settings,
      items: [
        {
          id: 'users',
          title: 'Usuarios',
          path: '/users',
          icon: Users,
          description: 'Gestión de usuarios'
        },
        {
          id: 'locations',
          title: 'Ubicaciones',
          path: '/locations',
          icon: MapPin,
          description: 'Gestión de ranchos'
        },
        {
          id: 'notifications',
          title: 'Notificaciones',
          path: '/notifications',
          icon: Bell,
          description: 'Configurar alertas'
        },
        {
          id: 'settings',
          title: 'Configuración',
          path: '/settings',
          icon: Settings,
          description: 'Configuración del sistema'
        },
        {
          id: 'help',
          title: 'Ayuda',
          path: '/help',
          icon: HelpCircle,
          description: 'Documentación y soporte'
        }
      ]
    }
  ];

  // Animaciones
  const sidebarVariants = {
    expanded: {
      width: '16rem',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    collapsed: {
      width: '4rem',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    }
  };

  const submenuVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };

  const tooltipVariants = {
    hidden: { opacity: 0, scale: 0.8, x: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      x: 0,
      transition: { duration: 0.2 }
    }
  };

  // Función para alternar menús expandidos
  const toggleMenu = (menuId) => {
    if (collapsed) return;
    
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  // Función para verificar si una ruta está activa
  const isActiveRoute = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Función para verificar si un menú tiene rutas activas
  const hasActiveRoute = (items) => {
    return items.some(item => {
      if (item.submenu) {
        return item.submenu.some(subItem => isActiveRoute(subItem.path));
      }
      return isActiveRoute(item.path);
    });
  };

  // Manejar hover para tooltips
  const handleItemHover = (itemId, show) => {
    if (collapsed) {
      setShowTooltip(show ? itemId : null);
    }
  };

  // Renderizar badge
  const renderBadge = (badge) => {
    if (!badge) return null;
    
    const isNumber = !isNaN(badge);
    const badgeClasses = isNumber 
      ? 'bg-red-500 text-white' 
      : 'bg-yellow-500 text-yellow-900';
    
    return (
      <span className={`
        px-2 py-0.5 text-xs font-medium rounded-full
        ${badgeClasses}
      `}>
        {badge}
      </span>
    );
  };

  // Renderizar item de navegación
  const renderNavigationItem = (item, isSubmenu = false) => {
    const IconComponent = item.icon;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isActive = isActiveRoute(item.path);
    const [submenuExpanded, setSubmenuExpanded] = useState(isActive);

    const itemClasses = `
      group flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200
      ${isSubmenu ? 'ml-4 text-sm' : ''}
      ${isActive 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }
      ${collapsed && !isSubmenu ? 'justify-center' : ''}
    `;

    const content = (
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {IconComponent && (
          <IconComponent className={`
            flex-shrink-0
            ${isSubmenu ? 'w-4 h-4' : 'w-5 h-5'}
            ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}
          `} />
        )}
        
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex items-center justify-between w-full"
            >
              <div className="flex-1 min-w-0">
                <span className="font-medium truncate">{item.title}</span>
                {item.description && !isSubmenu && (
                  <p className={`
                    text-xs mt-0.5 truncate
                    ${isActive ? 'text-blue-100' : 'text-gray-500'}
                  `}>
                    {item.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {item.badge && renderBadge(item.badge)}
                {hasSubmenu && (
                  <ChevronDown className={`
                    w-4 h-4 transition-transform duration-200
                    ${submenuExpanded ? 'rotate-180' : ''}
                    ${isActive ? 'text-white' : 'text-gray-400'}
                  `} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );

    // Tooltip para modo colapsado
    const tooltip = collapsed && showTooltip === item.id && (
      <motion.div
        variants={tooltipVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed left-16 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg z-50 pointer-events-none"
        style={{ 
          top: hoveredItem?.offsetTop || 0,
          transform: 'translateY(-50%)'
        }}
      >
        {item.title}
        {item.description && (
          <p className="text-gray-300 text-xs mt-1">{item.description}</p>
        )}
      </motion.div>
    );

    if (hasSubmenu && !collapsed) {
      return (
        <div key={item.id}>
          <button
            onClick={() => setSubmenuExpanded(!submenuExpanded)}
            className={itemClasses}
            onMouseEnter={(e) => {
              setHoveredItem(e.target);
              handleItemHover(item.id, true);
            }}
            onMouseLeave={() => handleItemHover(item.id, false)}
          >
            {content}
          </button>
          
          <AnimatePresence>
            {submenuExpanded && (
              <motion.div
                variants={submenuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="overflow-hidden"
              >
                <div className="space-y-1 mt-2">
                  {item.submenu.map(subItem => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`
                        block p-2 ml-8 text-sm rounded-lg transition-colors
                        ${isActiveRoute(subItem.path)
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {tooltip}
        </div>
      );
    }

    return (
      <div key={item.id} className="relative">
        <Link
          to={item.path}
          className={itemClasses}
          onMouseEnter={(e) => {
            setHoveredItem(e.target);
            handleItemHover(item.id, true);
          }}
          onMouseLeave={() => handleItemHover(item.id, false)}
        >
          {content}
        </Link>
        {tooltip}
      </div>
    );
  };

  // Renderizar sección de menú
  const renderMenuSection = (menu) => {
    const isExpanded = expandedMenus.includes(menu.id);
    const hasActive = hasActiveRoute(menu.items);
    const SectionIcon = menu.icon;

    return (
      <div key={menu.id} className="space-y-2">
        {!collapsed && (
          <button
            onClick={() => toggleMenu(menu.id)}
            className={`
              group flex items-center justify-between w-full p-2 rounded-lg transition-all duration-200
              ${hasActive 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <div className="flex items-center space-x-2">
              <SectionIcon className={`
                w-4 h-4 
                ${hasActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
              `} />
              <span className="text-sm font-semibold uppercase tracking-wide">
                {menu.title}
              </span>
            </div>
            <ChevronRight className={`
              w-4 h-4 transition-transform duration-200
              ${isExpanded ? 'rotate-90' : ''}
              ${hasActive ? 'text-blue-600' : 'text-gray-400'}
            `} />
          </button>
        )}
        
        <AnimatePresence>
          {(isExpanded || collapsed) && (
            <motion.div
              variants={submenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-1"
            >
              {menu.items.map(item => renderNavigationItem(item))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.nav
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      className={`
        h-full bg-white border-r border-gray-200 flex flex-col
        ${darkMode ? 'bg-gray-900 border-gray-700' : ''}
      `}
    >
      {/* Header del sidebar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Cow className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">GanaderoPro</h2>
                  <p className="text-xs text-gray-500">v2.0.0</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menús de navegación */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {navigationMenus.map(menu => renderMenuSection(menu))}
      </div>

      {/* Footer del sidebar */}
      <div className="p-4 border-t border-gray-200">
        <AnimatePresence>
          {!collapsed ? (
            <motion.div
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-2"
            >
              <div className="flex items-center space-x-3 p-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JP</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Juan Pérez</p>
                  <p className="text-xs text-gray-500 truncate">Administrador</p>
                </div>
              </div>
              
              <button className="flex items-center space-x-2 w-full p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </motion.div>
          ) : (
            <motion.button
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-full p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex justify-center"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;