// src/components/common/Button/Button.jsx
// Componente Button reutilizable con múltiples variantes y animaciones

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import './Button.module.css';

const Button = forwardRef(({ 
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  className = '',
  style = {},
  animationScale = true,
  animationHover = true,
  id,
  ariaLabel,
  dataTestId,
  ...rest
}, ref) => {

  // Variantes de animación para Framer Motion
  const buttonVariants = {
    idle: { 
      scale: 1,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    hover: {
      scale: animationScale ? 1.02 : 1,
      boxShadow: animationHover ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: animationScale ? 0.98 : 1,
      transition: { 
        duration: 0.1,
        ease: "easeInOut"
      }
    },
    disabled: {
      scale: 1,
      boxShadow: 'none'
    }
  };

  // Variantes de icono de carga
  const loadingVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // Clases CSS basadas en props
  const getButtonClasses = () => {
    const baseClasses = ['button'];
    
    // Agregar variante
    baseClasses.push(`button--${variant}`);
    
    // Agregar tamaño
    baseClasses.push(`button--${size}`);
    
    // Agregar estados
    if (disabled || loading) baseClasses.push('button--disabled');
    if (fullWidth) baseClasses.push('button--full-width');
    if (loading) baseClasses.push('button--loading');
    
    // Agregar clases personalizadas
    if (className) baseClasses.push(className);
    
    return baseClasses.join(' ');
  };

  // Manejar click del botón
  const handleClick = (event) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick(event);
    }
  };

  // Renderizar contenido del botón
  const renderButtonContent = () => {
    return (
      <>
        {/* Icono izquierdo */}
        {leftIcon && !loading && (
          <span className="button__icon button__icon--left">
            {leftIcon}
          </span>
        )}
        
        {/* Indicador de carga */}
        {loading && (
          <motion.span 
            className="button__icon button__icon--loading"
            variants={loadingVariants}
            animate="animate"
          >
            <Loader2 className="button__loader" />
          </motion.span>
        )}
        
        {/* Contenido del botón */}
        {children && (
          <span className="button__content">
            {children}
          </span>
        )}
        
        {/* Icono derecho */}
        {rightIcon && !loading && (
          <span className="button__icon button__icon--right">
            {rightIcon}
          </span>
        )}
      </>
    );
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      id={id}
      className={getButtonClasses()}
      style={style}
      disabled={disabled || loading}
      onClick={handleClick}
      variants={buttonVariants}
      initial="idle"
      whileHover={!disabled && !loading ? "hover" : "disabled"}
      whileTap={!disabled && !loading ? "tap" : "disabled"}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-disabled={disabled || loading}
      data-testid={dataTestId}
      {...rest}
    >
      {renderButtonContent()}
    </motion.button>
  );
});

// Nombre del componente para debugging
Button.displayName = 'Button';

// PropTypes de validación (comentados para usar TypeScript en el futuro)
/*
Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'outline', 'ghost', 'link'
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xl']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  style: PropTypes.object,
  animationScale: PropTypes.bool,
  animationHover: PropTypes.bool,
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
  dataTestId: PropTypes.string
};
*/

export default Button;