/**
 * Navigation.jsx - Componente de navegación lateral para el sistema de gestión de bovinos
 * Navegación colapsable con menús organizados, badges de notificación y acceso rápido
 */

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
  LogOut,
  Search,
  Plus,
  Activity,
  Target,
  Award,
  Clock,
  Star,
  Bookmark,
  Filter,
  Edit,
  Trash2,
  Archive,
  Download,
  Upload,
  Share2,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Globe,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
  UserCheck,
  Building,
  Truck,
  Scale,
  Thermometer,
  Droplets,
  Sun,
  Moon,
  CloudRain,
  Wind,
  Layers,
  Grid3X3,
  List,
  MoreHorizontal,
  Folder,
  FolderOpen,
  ChevronLeft,
  Maximize2,
  Minimize2
} from 'lucide-react';

const Navigation = ({ 
  collapsed = false, 
  onToggleCollapse,
  darkMode = false,
  user = null,
  layout = 'desktop'
}) => {
  
  // Estados para control de navegación
  const [expandedMenus, setExpandedMenus] = useState(['main']);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState(['dashboard', 'bovines', 'health']);
  const [badges, setBadges] = useState({
    health: 5,
    alerts: 3,
    reports: 2
  });

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
          description: 'Vista general del sistema',
          keywords: ['inicio', 'principal', 'resumen', 'overview']
        },
        {
          id: 'calendar',
          title: 'Calendario',
          path: '/calendar',
          icon: Calendar,
          description: 'Eventos y programación',
          badge: badges.calendar || 3,
          keywords: ['eventos', 'fechas', 'programación', 'agenda']
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
          description: 'Gestión del ganado',
          keywords: ['ganado', 'vacas', 'toros', 'animales'],
          subItems: [
            { id: 'bovines-list', title: 'Lista de Bovinos', path: '/bovines' },
            { id: 'bovines-add', title: 'Agregar Bovino', path: '/bovines/new' },
            { id: 'bovines-groups', title: 'Grupos', path: '/bovines/groups' }
          ]
        },
        {
          id: 'ranches',
          title: 'Ranchos',
          path: '/ranches',
          icon: Building,
          description: 'Gestión de instalaciones',
          keywords: ['instalaciones', 'terrenos', 'parcelas']
        }
      ]
    },
    {
      id: 'health',
      title: 'Salud y Bienestar',
      icon: Heart,
      items: [
        {
          id: 'health',
          title: 'Control Sanitario',
          path: '/health',
          icon: Stethoscope,
          description: 'Monitoreo de salud',
          badge: badges.health || 5,
          keywords: ['salud', 'veterinario', 'medicina', 'enfermedades'],
          subItems: [
            { id: 'health-records', title: 'Registros Médicos', path: '/health/records' },
            { id: 'health-vaccines', title: 'Vacunación', path: '/health/vaccines' },
            { id: 'health-treatments', title: 'Tratamientos', path: '/health/treatments' },
            { id: 'health-alerts', title: 'Alertas', path: '/health/alerts', badge: badges.health }
          ]
        },
        {
          id: 'nutrition',
          title: 'Nutrición',
          path: '/nutrition',
          icon: Droplets,
          description: 'Alimentación y suplementos',
          keywords: ['alimentación', 'comida', 'suplementos', 'dieta']
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
          description: 'Control de producción de leche',
          keywords: ['leche', 'ordeño', 'producción', 'litros']
        },
        {
          id: 'weight-control',
          title: 'Control de Peso',
          path: '/production/weight',
          icon: Scale,
          description: 'Seguimiento de peso del ganado',
          keywords: ['peso', 'engorde', 'crecimiento', 'desarrollo']
        },
        {
          id: 'quality',
          title: 'Control de Calidad',
          path: '/production/quality',
          icon: Award,
          description: 'Estándares de calidad',
          keywords: ['calidad', 'estándares', 'certificación']
        }
      ]
    },
    {
      id: 'breeding',
      title: 'Reproducción',
      icon: Baby,
      items: [
        {
          id: 'breeding',
          title: 'Gestión Reproductiva',
          path: '/breeding',
          icon: Baby,
          description: 'Control reproductivo',
          keywords: ['reproducción', 'cría', 'gestación', 'partos'],
          subItems: [
            { id: 'breeding-cycles', title: 'Ciclos Reproductivos', path: '/breeding/cycles' },
            { id: 'breeding-ai', title: 'Inseminación Artificial', path: '/breeding/ai' },
            { id: 'breeding-pregnancies', title: 'Gestaciones', path: '/breeding/pregnancies' },
            { id: 'breeding-births', title: 'Partos', path: '/breeding/births' }
          ]
        }
      ]
    },
    {
      id: 'inventory',
      title: 'Inventario',
      icon: Package,
      items: [
        {
          id: 'inventory',
          title: 'Gestión de Stock',
          path: '/inventory',
          icon: Package,
          description: 'Control de inventarios',
          keywords: ['inventario', 'stock', 'almacén', 'productos'],
          subItems: [
            { id: 'inventory-feed', title: 'Alimentos', path: '/inventory/feed' },
            { id: 'inventory-medicine', title: 'Medicamentos', path: '/inventory/medicine' },
            { id: 'inventory-equipment', title: 'Equipos', path: '/inventory/equipment' },
            { id: 'inventory-supplies', title: 'Suministros', path: '/inventory/supplies' }
          ]
        }
      ]
    },
    {
      id: 'finance',
      title: 'Finanzas',
      icon: DollarSign,
      items: [
        {
          id: 'finance',
          title: 'Gestión Financiera',
          path: '/finance',
          icon: DollarSign,
          description: 'Control financiero',
          keywords: ['finanzas', 'dinero', 'gastos', 'ingresos'],
          subItems: [
            { id: 'finance-income', title: 'Ingresos', path: '/finance/income' },
            { id: 'finance-expenses', title: 'Gastos', path: '/finance/expenses' },
            { id: 'finance-budget', title: 'Presupuesto', path: '/finance/budget' },
            { id: 'finance-reports', title: 'Reportes Financieros', path: '/finance/reports' }
          ]
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reportes y Análisis',
      icon: FileText,
      items: [
        {
          id: 'reports',
          title: 'Reportes',
          path: '/reports',
          icon: FileText,
          description: 'Análisis y reportes',
          badge: badges.reports || 2,
          keywords: ['reportes', 'análisis', 'estadísticas', 'datos'],
          subItems: [
            { id: 'reports-production', title: 'Producción', path: '/reports/production' },
            { id: 'reports-health', title: 'Salud', path: '/reports/health' },
            { id: 'reports-finance', title: 'Financieros', path: '/reports/finance' },
            { id: 'reports-custom', title: 'Personalizados', path: '/reports/custom' }
          ]
        },
        {
          id: 'analytics',
          title: 'Analytics',
          path: '/analytics',
          icon: TrendingUp,
          description: 'Análisis avanzado',
          keywords: ['análisis', 'métricas', 'kpi', 'dashboard']
        }
      ]
    },
    {
      id: 'location',
      title: 'Geolocalización',
      icon: MapPin,
      items: [
        {
          id: 'maps',
          title: 'Mapas',
          path: '/maps',
          icon: MapPin,
          description: 'Ubicación y mapas',
          keywords: ['mapas', 'ubicación', 'gps', 'localización']
        },
        {
          id: 'tracking',
          title: 'Seguimiento',
          path: '/tracking',
          icon: Target,
          description: 'Rastreo de ganado',
          keywords: ['seguimiento', 'rastreo', 'monitoreo', 'ubicación']
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
          description: 'Gestión de usuarios',
          keywords: ['usuarios', 'permisos', 'roles', 'acceso']
        },
        {
          id: 'settings',
          title: 'Configuración',
          path: '/settings',
          icon: Settings,
          description: 'Configuración del sistema',
          keywords: ['configuración', 'ajustes', 'preferencias']
        },
        {
          id: 'help',
          title: 'Ayuda',
          path: '/help',
          icon: HelpCircle,
          description: 'Centro de ayuda',
          keywords: ['ayuda', 'soporte', 'documentación', 'tutorial']
        }
      ]
    }
  ];

  // Efectos
  useEffect(() => {
    // Filtrar menús basado en búsqueda
    if (searchTerm.trim()) {
      const filtered = navigationMenus.map(menu => ({
        ...menu,
        items: menu.items.filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.keywords?.some(keyword => 
            keyword.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      })).filter(menu => menu.items.length > 0);
      
      setFilteredMenus(filtered);
    } else {
      setFilteredMenus(navigationMenus);
    }
  }, [searchTerm]);

  useEffect(() => {
    // Auto-expandir menú actual
    const currentMenu = navigationMenus.find(menu => 
      menu.items.some(item => 
        location.pathname === item.path || 
        (item.subItems && item.subItems.some(sub => location.pathname === sub.path))
      )
    );
    
    if (currentMenu && !expandedMenus.includes(currentMenu.id)) {
      setExpandedMenus(prev => [...prev, currentMenu.id]);
    }
  }, [location.pathname]);

  // Funciones de manejo
  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const toggleFavorite = (itemId) => {
    setFavoriteItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActiveItem = (item) => {
    if (location.pathname === item.path) return true;
    if (item.subItems) {
      return item.subItems.some(sub => location.pathname === sub.path);
    }
    return false;
  };

  const isActiveSubItem = (subItem) => {
    return location.pathname === subItem.path;
  };

  // Configuración de animaciones
  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '4rem' }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    }
  };

  const submenuVariants = {
    hidden: { 
      height: 0, 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    visible: { 
      height: 'auto', 
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };

  // Renderizar tooltip
  const renderTooltip = (item) => (
    <AnimatePresence>
      {collapsed && showTooltip === item.id && (
        <motion.div
          className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
        >
          {item.title}
          {item.description && (
            <div className="text-xs text-gray-300 mt-1">
              {item.description}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Renderizar badge
  const renderBadge = (count) => {
    if (!count || count === 0) return null;
    
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
        {count > 99 ? '99+' : count}
      </span>
    );
  };

  // Renderizar item de menú
  const renderMenuItem = (item, isSubItem = false) => {
    const active = isSubItem ? isActiveSubItem(item) : isActiveItem(item);
    const isFavorite = favoriteItems.includes(item.id);
    const hasSubItems = !isSubItem && item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus.includes(item.id);

    const baseClasses = `
      relative flex items-center w-full text-left transition-all duration-200 rounded-lg
      ${isSubItem ? 'pl-8 py-2' : 'p-3'}
      ${active 
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }
      ${collapsed && !isSubItem ? 'justify-center' : ''}
    `;

    const content = (
      <motion.div
        className={baseClasses}
        variants={menuItemVariants}
        whileHover={{ x: collapsed ? 0 : 2 }}
        onMouseEnter={() => !collapsed && setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {/* Icono */}
        <div className={`flex-shrink-0 ${collapsed ? '' : 'mr-3'}`}>
          <item.icon 
            size={20} 
            className={active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'} 
          />
        </div>

        {/* Contenido del item */}
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium truncate">
                  {item.title}
                </span>
                <div className="flex items-center gap-2">
                  {/* Badge */}
                  {item.badge && renderBadge(item.badge)}
                  
                  {/* Botón de favorito */}
                  {!isSubItem && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                        isFavorite ? 'opacity-100' : ''
                      }`}
                    >
                      <Star 
                        size={14} 
                        className={isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'} 
                      />
                    </button>
                  )}

                  {/* Indicador de submenú */}
                  {hasSubItems && (
                    <ChevronRight 
                      size={16} 
                      className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  )}
                </div>
              </div>
              
              {/* Descripción */}
              {item.description && !isSubItem && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {item.description}
                </div>
              )}
            </div>
          </>
        )}

        {/* Indicador de activo */}
        {active && (
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r"
            layoutId="activeIndicator"
          />
        )}

        {/* Tooltip para modo colapsado */}
        {renderTooltip(item)}
      </motion.div>
    );

    if (hasSubItems) {
      return (
        <div key={item.id} className="group">
          <button
            onClick={() => toggleMenu(item.id)}
            onMouseEnter={() => collapsed && setShowTooltip(item.id)}
            onMouseLeave={() => setShowTooltip(null)}
            className="w-full"
          >
            {content}
          </button>

          {/* Submenú */}
          <AnimatePresence>
            {isExpanded && !collapsed && (
              <motion.div
                className="overflow-hidden"
                variants={submenuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="py-1 space-y-1">
                  {item.subItems.map(subItem => (
                    <Link
                      key={subItem.id}
                      to={subItem.path}
                      className="block"
                    >
                      {renderMenuItem(subItem, true)}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.path}
        onMouseEnter={() => collapsed && setShowTooltip(item.id)}
        onMouseLeave={() => setShowTooltip(null)}
        className="block group"
      >
        {content}
      </Link>
    );
  };

  return (
    <motion.div
      className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
      variants={sidebarVariants}
      animate={collapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header del sidebar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Cow size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white text-sm">
                  Sistema Bovino
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Gestión Ganadera
                </p>
              </div>
            </motion.div>
          )}
          
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {collapsed ? (
              <ChevronRight size={16} className="text-gray-500" />
            ) : (
              <ChevronLeft size={16} className="text-gray-500" />
            )}
          </button>
        </div>

        {/* Barra de búsqueda */}
        {!collapsed && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Navegación principal */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Elementos favoritos */}
        {!collapsed && favoriteItems.length > 0 && !searchTerm && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Favoritos
            </h3>
            <div className="space-y-1">
              {favoriteItems.map(favoriteId => {
                const item = navigationMenus
                  .flatMap(menu => menu.items)
                  .find(item => item.id === favoriteId);
                
                if (!item) return null;
                
                return renderMenuItem(item);
              })}
            </div>
          </div>
        )}

        {/* Menús de navegación */}
        <div className="space-y-6">
          {(filteredMenus.length > 0 ? filteredMenus : navigationMenus).map(menu => {
            if (menu.items.length === 0) return null;
            
            return (
              <div key={menu.id}>
                {!collapsed && (
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <menu.icon size={14} />
                    {menu.title}
                  </h3>
                )}
                
                <div className="space-y-1">
                  {menu.items.map(item => renderMenuItem(item))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mensaje si no hay resultados de búsqueda */}
        {searchTerm && filteredMenus.length === 0 && (
          <div className="text-center py-8">
            <Search size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No se encontraron resultados para "{searchTerm}"
            </p>
          </div>
        )}
      </div>

      {/* Footer del sidebar */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!collapsed && user && (
          <motion.div
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <img
              src={user.avatar || '/api/placeholder/32/32'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.role}
              </p>
            </div>
          </motion.div>
        )}
        
        {collapsed && user && (
          <div className="flex justify-center">
            <img
              src={user.avatar || '/api/placeholder/32/32'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Navigation;