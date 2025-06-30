// Componente Modal versátil con múltiples variantes y animaciones

import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  AlertCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
  Move
} from 'lucide-react';

const Modal = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = '',
  children,
  variant = 'default',
  size = 'medium',
  position = 'center',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showFooter = true,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  headerClassName = '',
  footerClassName = '',
  customFooter = null,
  fullScreen = false,
  draggable = false,
  resizable = false,
  maxWidth = 'none',
  maxHeight = 'none',
  zIndex = 1000,
  ...rest
}) => {

  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const dragRef = useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragPosition, setDragPosition] = React.useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = React.useState(false);

  // Configuraciones de variantes
  const variantConfig = {
    default: {
      icon: null,
      headerBg: 'bg-white',
      headerText: 'text-gray-900',
      borderColor: 'border-gray-200'
    },
    success: {
      icon: CheckCircle,
      headerBg: 'bg-green-50',
      headerText: 'text-green-900',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600'
    },
    warning: {
      icon: AlertTriangle,
      headerBg: 'bg-yellow-50',
      headerText: 'text-yellow-900',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600'
    },
    danger: {
      icon: AlertCircle,
      headerBg: 'bg-red-50',
      headerText: 'text-red-900',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600'
    },
    info: {
      icon: Info,
      headerBg: 'bg-blue-50',
      headerText: 'text-blue-900',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600'
    },
    question: {
      icon: HelpCircle,
      headerBg: 'bg-purple-50',
      headerText: 'text-purple-900',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600'
    }
  };

  // Configuraciones de tamaño
  const sizeConfig = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
    auto: 'max-w-max'
  };

  // Configuraciones de posición
  const positionConfig = {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-16',
    bottom: 'items-end justify-center pb-16',
    left: 'items-center justify-start pl-16',
    right: 'items-center justify-end pr-16'
  };

  const currentVariant = variantConfig[variant] || variantConfig.default;
  const currentSize = sizeConfig[size] || sizeConfig.medium;
  const currentPosition = positionConfig[position] || positionConfig.center;

  // Animaciones
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: position === 'top' ? -50 : position === 'bottom' ? 50 : 0
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: position === 'top' ? -50 : position === 'bottom' ? 50 : 0,
      transition: { duration: 0.2 }
    }
  };

  // Manejador de tecla Escape
  const handleEscape = useCallback((event) => {
    if (closeOnEscape && event.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [closeOnEscape, isOpen, onClose]);

  // Manejador de click en overlay
  const handleOverlayClick = useCallback((event) => {
    if (closeOnOverlayClick && event.target === overlayRef.current) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose]);

  // Manejador de drag
  const handleMouseDown = useCallback((event) => {
    if (!draggable || isMaximized) return;
    
    setIsDragging(true);
    const rect = modalRef.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const handleMouseMove = (e) => {
      setDragPosition({
        x: e.clientX - offsetX,
        y: e.clientY - offsetY
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [draggable, isMaximized]);

  // Función para maximizar/minimizar
  const toggleMaximize = () => {
    setIsMaximized(prev => !prev);
    if (!isMaximized) {
      setDragPosition({ x: 0, y: 0 });
    }
  };

  // Efectos
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  // Función para obtener clases del botón de confirmación
  const getConfirmButtonClasses = () => {
    const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors focus:ring-2 focus:ring-offset-2';
    
    switch (confirmVariant) {
      case 'primary':
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
      case 'success':
        return `${baseClasses} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`;
      case 'danger':
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
      case 'warning':
        return `${baseClasses} bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500`;
      default:
        return `${baseClasses} bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500`;
    }
  };

  // Renderizar header
  const renderHeader = () => {
    const IconComponent = currentVariant.icon;
    
    return (
      <div 
        className={`
          flex items-center justify-between p-6 border-b 
          ${currentVariant.headerBg} ${currentVariant.borderColor} ${headerClassName}
          ${draggable ? 'cursor-move' : ''}
        `}
        onMouseDown={draggable ? handleMouseDown : undefined}
        ref={dragRef}
      >
        <div className="flex items-center space-x-3">
          {IconComponent && (
            <IconComponent className={`w-6 h-6 ${currentVariant.iconColor}`} />
          )}
          <h3 className={`text-lg font-semibold ${currentVariant.headerText}`}>
            {title}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {draggable && (
            <button
              onClick={toggleMaximize}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {isMaximized ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          )}
          
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  // Renderizar footer
  const renderFooter = () => {
    if (customFooter) {
      return (
        <div className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${footerClassName}`}>
          {customFooter}
        </div>
      );
    }

    if (!showFooter) return null;

    return (
      <div className={`flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200 ${footerClassName}`}>
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          {cancelText}
        </button>
        
        {onConfirm && (
          <button
            onClick={onConfirm}
            disabled={disabled || loading}
            className={`${getConfirmButtonClasses()} disabled:opacity-50 flex items-center space-x-2`}
          >
            {loading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            )}
            <span>{confirmText}</span>
          </button>
        )}
      </div>
    );
  };

  // Calcular estilos dinámicos
  const getModalStyles = () => {
    let styles = {};
    
    if (draggable && !isMaximized) {
      styles.transform = `translate(${dragPosition.x}px, ${dragPosition.y}px)`;
    }
    
    if (isMaximized) {
      styles.width = '95vw';
      styles.height = '95vh';
      styles.maxWidth = 'none';
      styles.maxHeight = 'none';
    } else {
      if (maxWidth !== 'none') styles.maxWidth = maxWidth;
      if (maxHeight !== 'none') styles.maxHeight = maxHeight;
    }
    
    return styles;
  };

  // No renderizar si no está abierto
  if (!isOpen) return null;

  // Renderizar modal
  const modalContent = (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`
          fixed inset-0 flex ${currentPosition} p-4 
          ${overlayClassName}
        `}
        style={{ 
          zIndex,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)'
        }}
        onClick={handleOverlayClick}
      >
        <motion.div
          ref={modalRef}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`
            relative bg-white rounded-lg shadow-xl 
            ${fullScreen ? 'w-full h-full' : currentSize}
            ${currentVariant.borderColor} border
            ${className} ${contentClassName}
            ${isDragging ? 'select-none' : ''}
          `}
          style={getModalStyles()}
          onClick={(e) => e.stopPropagation()}
          {...rest}
        >
          {/* Header */}
          {title && renderHeader()}
          
          {/* Contenido */}
          <div className={`${title ? '' : 'pt-6'} px-6 pb-6 overflow-auto`}>
            {children}
          </div>
          
          {/* Footer */}
          {renderFooter()}
          
          {/* Indicador de arrastre */}
          {draggable && !isMaximized && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <Move className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  // Renderizar usando portal
  return createPortal(modalContent, document.body);
};

export default Modal;