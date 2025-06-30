import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook personalizado para manejo de modales en el sistema de gestión de bovinos
 * Proporciona funcionalidad completa para abrir, cerrar y gestionar múltiples modales
 * Incluye soporte para datos, confirmaciones y callbacks
 * @param {Object} options - Opciones de configuración inicial
 * @returns {Object} Objeto con estados y funciones del modal
 */
const useModal = (options = {}) => {
  const {
    initialOpen = false,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    persistent = false,
    onOpen = null,
    onClose = null,
    onConfirm = null,
    maxStack = 5
  } = options;

  // Estados principales del modal
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  const [modalStack, setModalStack] = useState([]);
  
  // Estados para confirmación
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  
  // Referencias
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const callbacksRef = useRef({
    onOpen,
    onClose,
    onConfirm
  });

  // Actualizar callbacks cuando cambien
  useEffect(() => {
    callbacksRef.current = { onOpen, onClose, onConfirm };
  }, [onOpen, onClose, onConfirm]);

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && closeOnEscape && isOpen && !persistent) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape, persistent]);

  // Manejar foco para accesibilidad
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      // Enfocar el modal cuando se abra
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else if (previousFocusRef.current) {
      // Restaurar foco cuando se cierre
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  /**
   * Función para abrir el modal
   * @param {string} type - Tipo de modal ('default', 'confirm', 'alert', 'custom')
   * @param {*} data - Datos a pasar al modal
   * @param {Object} callbacks - Callbacks específicos para este modal
   */
  const openModal = useCallback((type = 'default', data = null, callbacks = {}) => {
    // Guardar estado actual en el stack si hay un modal abierto
    if (isOpen && modalStack.length < maxStack) {
      setModalStack(prev => [...prev, {
        type: modalType,
        data: modalData,
        isConfirming,
        confirmationData
      }]);
    }

    setModalType(type);
    setModalData(data);
    setIsOpen(true);
    setIsConfirming(false);
    setConfirmationData(null);
    
    // Ejecutar callback de apertura
    const openCallback = callbacks.onOpen || callbacksRef.current.onOpen;
    if (openCallback && typeof openCallback === 'function') {
      openCallback(type, data);
    }
  }, [isOpen, modalType, modalData, isConfirming, confirmationData, modalStack.length, maxStack]);

  /**
   * Función para cerrar el modal
   * @param {*} result - Resultado a pasar al callback de cierre
   */
  const closeModal = useCallback((result = null) => {
    // Si hay modales en el stack, restaurar el anterior
    if (modalStack.length > 0) {
      const previousModal = modalStack[modalStack.length - 1];
      setModalStack(prev => prev.slice(0, -1));
      
      setModalType(previousModal.type);
      setModalData(previousModal.data);
      setIsConfirming(previousModal.isConfirming);
      setConfirmationData(previousModal.confirmationData);
      return;
    }

    setIsOpen(false);
    setIsLoading(false);
    setIsConfirming(false);
    
    // Ejecutar callback de cierre
    const closeCallback = callbacksRef.current.onClose;
    if (closeCallback && typeof closeCallback === 'function') {
      closeCallback(result);
    }

    // Limpiar datos después de un pequeño delay para animaciones
    setTimeout(() => {
      setModalData(null);
      setModalType('default');
      setConfirmationData(null);
    }, 300);
  }, [modalStack]);

  /**
   * Función para mostrar modal de confirmación
   * @param {Object} config - Configuración del modal de confirmación
   */
  const showConfirmation = useCallback((config = {}) => {
    const {
      title = '¿Está seguro?',
      message = 'Esta acción no se puede deshacer.',
      confirmText = 'Confirmar',
      cancelText = 'Cancelar',
      type = 'warning', // 'warning', 'danger', 'info', 'success'
      onConfirm: confirmCallback = null,
      onCancel: cancelCallback = null
    } = config;

    setConfirmationData({
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm: confirmCallback,
      onCancel: cancelCallback
    });
    setIsConfirming(true);
    
    if (!isOpen) {
      openModal('confirm', config);
    }
  }, [isOpen, openModal]);

  /**
   * Función para confirmar una acción
   * @param {*} result - Resultado de la confirmación
   */
  const confirmAction = useCallback(async (result = true) => {
    setIsLoading(true);
    
    try {
      const confirmCallback = confirmationData?.onConfirm || callbacksRef.current.onConfirm;
      
      if (confirmCallback && typeof confirmCallback === 'function') {
        await confirmCallback(result, confirmationData);
      }
      
      closeModal(result);
    } catch (error) {
      console.error('Error en confirmación:', error);
      setIsLoading(false);
    }
  }, [confirmationData, closeModal]);

  /**
   * Función para cancelar una acción
   */
  const cancelAction = useCallback(() => {
    const cancelCallback = confirmationData?.onCancel;
    
    if (cancelCallback && typeof cancelCallback === 'function') {
      cancelCallback();
    }
    
    setIsConfirming(false);
    setConfirmationData(null);
    closeModal(false);
  }, [confirmationData, closeModal]);

  /**
   * Función para actualizar datos del modal
   * @param {*} newData - Nuevos datos
   */
  const updateModalData = useCallback((newData) => {
    setModalData(prev => {
      if (typeof newData === 'function') {
        return newData(prev);
      }
      return { ...prev, ...newData };
    });
  }, []);

  /**
   * Función para manejar click en overlay
   */
  const handleOverlayClick = useCallback((event) => {
    if (closeOnOverlayClick && !persistent && event.target === event.currentTarget) {
      closeModal();
    }
  }, [closeOnOverlayClick, persistent, closeModal]);

  /**
   * Función para abrir modal de alerta
   * @param {string} message - Mensaje de la alerta
   * @param {string} type - Tipo de alerta
   */
  const showAlert = useCallback((message, type = 'info') => {
    openModal('alert', { message, type });
  }, [openModal]);

  /**
   * Función para abrir modal de formulario
   * @param {string} formType - Tipo de formulario
   * @param {*} initialData - Datos iniciales del formulario
   */
  const openForm = useCallback((formType, initialData = null) => {
    openModal('form', { formType, initialData });
  }, [openModal]);

  /**
   * Función para abrir modal de detalles
   * @param {*} itemData - Datos del item a mostrar
   * @param {string} itemType - Tipo de item
   */
  const showDetails = useCallback((itemData, itemType = 'default') => {
    openModal('details', { itemData, itemType });
  }, [openModal]);

  /**
   * Función para cerrar todos los modales
   */
  const closeAllModals = useCallback(() => {
    setModalStack([]);
    closeModal();
  }, [closeModal]);

  // Configuración de animación para framer-motion
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: -50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

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

  return {
    // Estados
    isOpen,
    modalData,
    modalType,
    isLoading,
    isConfirming,
    confirmationData,
    modalStack,
    
    // Referencias
    modalRef,
    
    // Funciones principales
    openModal,
    closeModal,
    updateModalData,
    
    // Funciones específicas
    showConfirmation,
    confirmAction,
    cancelAction,
    showAlert,
    openForm,
    showDetails,
    closeAllModals,
    
    // Handlers
    handleOverlayClick,
    
    // Configuraciones para animaciones
    modalVariants,
    overlayVariants,
    
    // Utilidades
    hasModalInStack: modalStack.length > 0,
    stackLength: modalStack.length,
    canClose: !persistent && !isLoading
  };
};

// Constantes útiles para tipos de modal
export const MODAL_TYPES = {
  DEFAULT: 'default',
  CONFIRM: 'confirm',
  ALERT: 'alert',
  FORM: 'form',
  DETAILS: 'details',
  CUSTOM: 'custom'
};

// Constantes para tipos de confirmación
export const CONFIRMATION_TYPES = {
  WARNING: 'warning',
  DANGER: 'danger',
  INFO: 'info',
  SUCCESS: 'success'
};

// Hook especializado para modales de confirmación
export const useConfirmModal = (defaultConfig = {}) => {
  const modal = useModal();
  
  const confirm = useCallback((config = {}) => {
    const finalConfig = { ...defaultConfig, ...config };
    return new Promise((resolve) => {
      modal.showConfirmation({
        ...finalConfig,
        onConfirm: (result) => resolve(true),
        onCancel: () => resolve(false)
      });
    });
  }, [modal, defaultConfig]);

  return {
    ...modal,
    confirm
  };
};

export default useModal;