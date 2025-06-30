// Archivo de barril para exportar el componente Button y sus utilidades

import Button from './Button';

// Exportación por defecto del componente principal
export default Button;

// Exportaciones nombradas para mayor flexibilidad
export { Button };

// Constantes útiles para las variantes de botón
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  LIGHT: 'light',
  DARK: 'dark',
  OUTLINE: 'outline',
  GHOST: 'ghost',
  LINK: 'link'
};

// Constantes para los tamaños de botón
export const BUTTON_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  XL: 'xl'
};

// Constantes para los tipos de botón
export const BUTTON_TYPES = {
  BUTTON: 'button',
  SUBMIT: 'submit',
  RESET: 'reset'
};

// Función helper para crear props de botón comunes
export const createButtonProps = ({
  variant = BUTTON_VARIANTS.PRIMARY,
  size = BUTTON_SIZES.MEDIUM,
  disabled = false,
  loading = false,
  fullWidth = false,
  ...otherProps
} = {}) => ({
  variant,
  size,
  disabled,
  loading,
  fullWidth,
  ...otherProps
});

// Función helper para validar variantes de botón
export const isValidVariant = (variant) => {
  return Object.values(BUTTON_VARIANTS).includes(variant);
};

// Función helper para validar tamaños de botón
export const isValidSize = (size) => {
  return Object.values(BUTTON_SIZES).includes(size);
};

// Hook personalizado para manejar estados de botón (para uso futuro)
export const useButtonState = (initialState = {}) => {
  const [state, setState] = React.useState({
    loading: false,
    disabled: false,
    ...initialState
  });

  const setLoading = (loading) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setDisabled = (disabled) => {
    setState(prev => ({ ...prev, disabled }));
  };

  const reset = () => {
    setState(initialState);
  };

  return {
    ...state,
    setLoading,
    setDisabled,
    reset
  };
};