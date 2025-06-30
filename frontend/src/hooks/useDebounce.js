import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook personalizado para debounce (retraso de ejecución)
 * Útil para optimizar búsquedas, validaciones y llamadas a APIs
 */
const useDebounce = (value, delay = 500, options = {}) => {
  // Estados principales
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Configuración por defecto
  const {
    immediate = false,    // Ejecutar inmediatamente en el primer valor
    maxWait = null,       // Tiempo máximo de espera antes de forzar ejecución
    leading = false,      // Ejecutar al inicio del período de debounce
    trailing = true       // Ejecutar al final del período de debounce
  } = options;

  // Referencias para control
  const timeoutRef = useRef(null);
  const maxWaitTimeoutRef = useRef(null);
  const lastCallTimeRef = useRef(null);
  const lastArgsRef = useRef(null);
  const isFirstCallRef = useRef(true);

  /**
   * Función para limpiar timeouts
   */
  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current);
      maxWaitTimeoutRef.current = null;
    }
  }, []);

  /**
   * Función para actualizar el valor con debounce
   */
  const updateDebouncedValue = useCallback((newValue) => {
    setDebouncedValue(newValue);
    setIsDebouncing(false);
  }, []);

  /**
   * Efecto principal de debounce
   */
  useEffect(() => {
    const now = Date.now();
    lastArgsRef.current = value;
    lastCallTimeRef.current = now;

    // Manejar el primer valor si immediate está habilitado
    if (isFirstCallRef.current && immediate) {
      setDebouncedValue(value);
      isFirstCallRef.current = false;
      return;
    }

    isFirstCallRef.current = false;
    setIsDebouncing(true);

    // Ejecutar inmediatamente si leading está habilitado
    if (leading && !timeoutRef.current) {
      updateDebouncedValue(value);
      setIsDebouncing(false);
    }

    // Limpiar timeout anterior
    clearTimeouts();

    // Configurar nuevo timeout para trailing execution
    if (trailing) {
      timeoutRef.current = setTimeout(() => {
        updateDebouncedValue(lastArgsRef.current);
        timeoutRef.current = null;
      }, delay);
    }

    // Configurar maxWait timeout si está especificado
    if (maxWait && !maxWaitTimeoutRef.current) {
      maxWaitTimeoutRef.current = setTimeout(() => {
        updateDebouncedValue(lastArgsRef.current);
        clearTimeouts();
      }, maxWait);
    }

    // Cleanup cuando el valor cambie o el componente se desmonte
    return () => {
      if (!trailing) {
        setIsDebouncing(false);
      }
    };
  }, [value, delay, immediate, maxWait, leading, trailing, updateDebouncedValue, clearTimeouts]);

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  return [debouncedValue, isDebouncing];
};

/**
 * Hook para debounce de callbacks/funciones
 * Útil para debounce de funciones en lugar de valores
 */
export const useDebouncedCallback = (callback, delay = 500, deps = [], options = {}) => {
  const {
    maxWait = null,
    leading = false,
    trailing = true
  } = options;

  // Referencias para control
  const timeoutRef = useRef(null);
  const maxWaitTimeoutRef = useRef(null);
  const lastCallTimeRef = useRef(null);
  const callbackRef = useRef(callback);

  // Actualizar callback ref cuando cambien las dependencias
  useEffect(() => {
    callbackRef.current = callback;
  }, deps);

  /**
   * Función para limpiar timeouts
   */
  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current);
      maxWaitTimeoutRef.current = null;
    }
  }, []);

  /**
   * Función debounceda
   */
  const debouncedCallback = useCallback((...args) => {
    const now = Date.now();
    lastCallTimeRef.current = now;

    // Ejecutar inmediatamente si leading está habilitado
    if (leading && !timeoutRef.current) {
      callbackRef.current(...args);
    }

    // Limpiar timeout anterior
    clearTimeouts();

    // Configurar nuevo timeout para trailing execution
    if (trailing) {
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        timeoutRef.current = null;
      }, delay);
    }

    // Configurar maxWait timeout si está especificado
    if (maxWait && !maxWaitTimeoutRef.current) {
      maxWaitTimeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        clearTimeouts();
      }, maxWait);
    }
  }, [delay, leading, trailing, maxWait, clearTimeouts]);

  /**
   * Función para cancelar la ejecución pendiente
   */
  const cancel = useCallback(() => {
    clearTimeouts();
  }, [clearTimeouts]);

  /**
   * Función para ejecutar inmediatamente (flush)
   */
  const flush = useCallback((...args) => {
    clearTimeouts();
    callbackRef.current(...args);
  }, [clearTimeouts]);

  /**
   * Función para verificar si hay una ejecución pendiente
   */
  const pending = useCallback(() => {
    return timeoutRef.current !== null || maxWaitTimeoutRef.current !== null;
  }, []);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  return {
    callback: debouncedCallback,
    cancel,
    flush,
    pending
  };
};

/**
 * Hook para debounce de búsquedas
 * Especializado para casos de uso de búsqueda con estado de loading
 */
export const useSearchDebounce = (searchTerm, delay = 300, options = {}) => {
  const {
    minLength = 0,        // Longitud mínima para activar búsqueda
    trimValue = true      // Trim automático del valor
  } = options;

  const [debouncedSearchTerm, isDebouncing] = useDebounce(
    trimValue ? searchTerm.trim() : searchTerm, 
    delay,
    { immediate: false, trailing: true }
  );

  // Estado de si la búsqueda está activa
  const isSearchActive = debouncedSearchTerm.length >= minLength;
  const shouldSearch = isSearchActive && !isDebouncing;

  return {
    searchTerm: debouncedSearchTerm,
    isDebouncing,
    isSearchActive,
    shouldSearch,
    hasMinLength: searchTerm.length >= minLength
  };
};

/**
 * Hook para debounce de validaciones de formularios
 * Especializado para validación de campos con estado de error
 */
export const useValidationDebounce = (value, validator, delay = 500) => {
  const [debouncedValue, isDebouncing] = useDebounce(value, delay);
  const [validationState, setValidationState] = useState({
    isValid: true,
    error: null,
    isValidating: false
  });

  // Efecto para ejecutar validación cuando el valor cambie
  useEffect(() => {
    if (debouncedValue !== value) {
      setValidationState(prev => ({
        ...prev,
        isValidating: true
      }));
    }
  }, [value, debouncedValue]);

  // Efecto para ejecutar validación cuando termine el debounce
  useEffect(() => {
    if (!isDebouncing && debouncedValue) {
      const runValidation = async () => {
        try {
          setValidationState(prev => ({
            ...prev,
            isValidating: true
          }));

          let result;
          if (typeof validator === 'function') {
            result = await validator(debouncedValue);
          } else {
            result = { isValid: true, error: null };
          }

          setValidationState({
            isValid: result.isValid,
            error: result.error || null,
            isValidating: false
          });
        } catch (error) {
          setValidationState({
            isValid: false,
            error: error.message || 'Error de validación',
            isValidating: false
          });
        }
      };

      runValidation();
    } else if (!debouncedValue) {
      setValidationState({
        isValid: true,
        error: null,
        isValidating: false
      });
    }
  }, [debouncedValue, isDebouncing, validator]);

  return {
    value: debouncedValue,
    isDebouncing,
    isValid: validationState.isValid,
    error: validationState.error,
    isValidating: validationState.isValidating
  };
};

/**
 * Hook para debounce de auto-save
 * Útil para guardar automáticamente formularios o configuraciones
 */
export const useAutoSave = (data, saveFunction, delay = 2000, options = {}) => {
  const {
    enabled = true,       // Si el auto-save está habilitado
    skipEmpty = true,     // Saltar guardado si los datos están vacíos
    onSaveStart = null,   // Callback cuando inicia el guardado
    onSaveSuccess = null, // Callback cuando el guardado es exitoso
    onSaveError = null    // Callback cuando hay error en el guardado
  } = options;

  const [saveState, setSaveState] = useState({
    isSaving: false,
    lastSaved: null,
    error: null
  });

  const [debouncedData, isDebouncing] = useDebounce(data, delay);

  // Efecto para ejecutar auto-save
  useEffect(() => {
    if (!enabled || isDebouncing) return;

    // Verificar si hay datos para guardar
    if (skipEmpty && (!debouncedData || Object.keys(debouncedData).length === 0)) {
      return;
    }

    const performSave = async () => {
      try {
        setSaveState(prev => ({
          ...prev,
          isSaving: true,
          error: null
        }));

        if (onSaveStart) {
          onSaveStart(debouncedData);
        }

        await saveFunction(debouncedData);

        setSaveState({
          isSaving: false,
          lastSaved: new Date(),
          error: null
        });

        if (onSaveSuccess) {
          onSaveSuccess(debouncedData);
        }
      } catch (error) {
        setSaveState({
          isSaving: false,
          lastSaved: null,
          error: error.message || 'Error al guardar'
        });

        if (onSaveError) {
          onSaveError(error, debouncedData);
        }
      }
    };

    performSave();
  }, [
    debouncedData, 
    isDebouncing, 
    enabled, 
    skipEmpty, 
    saveFunction, 
    onSaveStart, 
    onSaveSuccess, 
    onSaveError
  ]);

  return {
    ...saveState,
    isDebouncing,
    hasUnsavedChanges: isDebouncing || JSON.stringify(data) !== JSON.stringify(debouncedData)
  };
};

export default useDebounce;