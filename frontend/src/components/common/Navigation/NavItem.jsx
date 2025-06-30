// Componente individual para items de navegación con soporte para submenús

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight,
  ExternalLink,
  Circle,
  Dot
} from 'lucide-react';

const NavItem = ({
  item,
  collapsed = false,
  level = 0,
  onItemClick,
  showTooltip = false,
  tooltipPosition = 'right',
  className = '',
  activeClassName = '',
  hoverClassName = '',
  ...rest
}) => {

  // Estados locales
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  
  const itemRef = useRef(null);
  const tooltipRef = useRef(null);
  const location = useLocation();

  // Configuración del item
  const {
    id,
    title,
    path,
    icon: IconComponent,
    description,
    badge,
    submenu = [],
    external = false,
    disabled = false,
    hidden = false,
    onClick,
    target = '_self'
  } = item;

  // Verificar si la ruta está activa
  const isActive = () => {
    if (!path) return false;
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    
    // Verificar submenu
    if (submenu.length > 0) {
      return submenu.some(subItem => 
        subItem.path && location.pathname.startsWith(subItem.path)
      );
    }
    
    return false;
  };

  const active = isActive();
  const hasSubmenu = submenu.length > 0;
  const isSubItem = level > 0;

  // Animaciones
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -10,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    },
    exit: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.2 }
    }
  };

  const submenuVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      transition: { 
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const tooltipVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      x: tooltipPosition === 'right' ? -10 : 10,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      x: 0,
      transition: { duration: 0.2 }
    }
  };

  // Expandir automáticamente si tiene ruta activa
  useEffect(() => {
    if (active && hasSubmenu) {
      setIsExpanded(true);
    }
  }, [active, hasSubmenu]);

  // Manejar tooltip en modo colapsado
  useEffect(() => {
    if (collapsed && isHovered && showTooltip) {
      const timer = setTimeout(() => setTooltipVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      setTooltipVisible(false);
    }
  }, [collapsed, isHovered, showTooltip]);

  // Manejar click del item
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (hasSubmenu && !collapsed) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }

    if (onClick) {
      onClick(e, item);
    }

    if (onItemClick) {
      onItemClick(item);
    }
  };

  // Obtener clases CSS del item
  const getItemClasses = () => {
    const baseClasses = [
      'group',
      'flex',
      'items-center',
      'w-full',
      'rounded-lg',
      'transition-all',
      'duration-200',
      'relative'
    ];

    // Padding basado en nivel y estado colapsado
    if (collapsed && level === 0) {
      baseClasses.push('p-3', 'justify-center');
    } else {
      const paddingLeft = level * 1 + 3; // Incrementar padding por nivel
      baseClasses.push(`p-3`, `pl-${paddingLeft}`);
    }

    // Estados del item
    if (active) {
      baseClasses.push(
        activeClassName || 
        'bg-blue-600 text-white shadow-md'
      );
    } else if (disabled) {
      baseClasses.push('opacity-50 cursor-not-allowed');
    } else {
      baseClasses.push(
        hoverClassName || 
        'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      );
    }

    // Tamaño de texto basado en nivel
    if (isSubItem) {
      baseClasses.push('text-sm');
    }

    if (className) {
      baseClasses.push(className);
    }

    return baseClasses.join(' ');
  };

  // Renderizar badge
  const renderBadge = () => {
    if (!badge || collapsed) return null;
    
    const isNumber = !isNaN(badge);
    const badgeClasses = `
      inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full
      ${isNumber 
        ? 'bg-red-500 text-white' 
        : badge === 'new' 
          ? 'bg-green-500 text-white'
          : badge === 'updated'
            ? 'bg-blue-500 text-white'
            : 'bg-yellow-500 text-yellow-900'
      }
    `;
    
    return (
      <span className={badgeClasses}>
        {badge}
      </span>
    );
  };

  // Renderizar icono
  const renderIcon = () => {
    if (!IconComponent) {
      return isSubItem ? (
        <Dot className={`
          w-4 h-4 flex-shrink-0
          ${active ? 'text-white' : 'text-gray-400'}
        `} />
      ) : null;
    }

    const iconSize = isSubItem ? 'w-4 h-4' : 'w-5 h-5';
    const iconColor = active 
      ? 'text-white' 
      : 'text-gray-500 group-hover:text-gray-700';

    return (
      <IconComponent className={`${iconSize} flex-shrink-0 ${iconColor}`} />
    );
  };

  // Renderizar contenido del item
  const renderContent = () => (
    <div className="flex items-center justify-between w-full min-w-0">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {renderIcon()}
        
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 min-w-0"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium truncate">{title}</span>
                {external && (
                  <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-60" />
                )}
              </div>
              
              {description && !isSubItem && (
                <p className={`
                  text-xs mt-0.5 truncate
                  ${active ? 'text-blue-100' : 'text-gray-500'}
                `}>
                  {description}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center space-x-2 flex-shrink-0"
          >
            {renderBadge()}
            
            {hasSubmenu && (
              <ChevronDown className={`
                w-4 h-4 transition-transform duration-200
                ${isExpanded ? 'rotate-180' : ''}
                ${active ? 'text-white' : 'text-gray-400'}
              `} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Renderizar tooltip
  const renderTooltip = () => {
    if (!collapsed || !tooltipVisible || !showTooltip) return null;

    const tooltipClasses = `
      fixed bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg z-50 pointer-events-none
      ${tooltipPosition === 'right' ? 'left-16' : 'right-16'}
    `;

    return (
      <motion.div
        ref={tooltipRef}
        variants={tooltipVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={tooltipClasses}
        style={{
          top: itemRef.current?.offsetTop || 0,
          transform: 'translateY(-50%)'
        }}
      >
        <div className="font-medium">{title}</div>
        {description && (
          <div className="text-gray-300 text-xs mt-1">{description}</div>
        )}
        {badge && (
          <div className="text-yellow-300 text-xs mt-1">
            {typeof badge === 'string' ? badge.toUpperCase() : `${badge} pendientes`}
          </div>
        )}
      </motion.div>
    );
  };

  // Renderizar submenu
  const renderSubmenu = () => {
    if (!hasSubmenu || collapsed) return null;

    return (
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={submenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="overflow-hidden"
          >
            <div className="space-y-1 mt-2">
              {submenu.map((subItem, index) => (
                <NavItem
                  key={subItem.id || index}
                  item={subItem}
                  collapsed={false}
                  level={level + 1}
                  onItemClick={onItemClick}
                  showTooltip={false}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // No renderizar si está oculto
  if (hidden) return null;

  // Elemento contenedor
  const WrapperComponent = path && !hasSubmenu ? Link : 'button';
  const wrapperProps = {
    ref: itemRef,
    className: getItemClasses(),
    onClick: handleClick,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    disabled: disabled,
    ...rest
  };

  // Props específicos para Link
  if (path && !hasSubmenu) {
    wrapperProps.to = path;
    if (external) {
      wrapperProps.target = target;
      wrapperProps.rel = target === '_blank' ? 'noopener noreferrer' : undefined;
    }
  }

  return (
    <div className="relative">
      <WrapperComponent {...wrapperProps}>
        {renderContent()}
      </WrapperComponent>
      
      {renderSubmenu()}
      {renderTooltip()}
    </div>
  );
};

export default NavItem;