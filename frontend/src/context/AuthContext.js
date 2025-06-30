import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * Contexto de autenticación para el sistema de gestión de bovinos
 * Maneja el estado global de autenticación, usuario y permisos
 */

// Estados iniciales del contexto de autenticación
const initialState = {
  // Estado de autenticación
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  
  // Datos del usuario
  user: null,
  token: null,
  refreshToken: null,
  
  // Permisos y roles
  permissions: [],
  roles: [],
  
  // Estados de la UI
  loginLoading: false,
  registerLoading: false,
  
  // Errores
  error: null,
  
  // Configuración
  rememberMe: false,
  sessionExpiration: null
};

// Tipos de acciones para el reducer
const AUTH_ACTIONS = {
  // Inicialización
  INITIALIZE_START: 'INITIALIZE_START',
  INITIALIZE_SUCCESS: 'INITIALIZE_SUCCESS',
  INITIALIZE_FAILURE: 'INITIALIZE_FAILURE',
  
  // Login
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  
  // Registro
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  
  // Logout
  LOGOUT: 'LOGOUT',
  
  // Token
  TOKEN_REFRESH_SUCCESS: 'TOKEN_REFRESH_SUCCESS',
  TOKEN_REFRESH_FAILURE: 'TOKEN_REFRESH_FAILURE',
  
  // Usuario
  UPDATE_USER: 'UPDATE_USER',
  UPDATE_PERMISSIONS: 'UPDATE_PERMISSIONS',
  
  // Errores
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ERROR: 'SET_ERROR',
  
  // Configuración
  SET_REMEMBER_ME: 'SET_REMEMBER_ME'
};

/**
 * Reducer para manejar las acciones del estado de autenticación
 * @param {Object} state - Estado actual
 * @param {Object} action - Acción a ejecutar
 */
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.INITIALIZE_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.INITIALIZE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isInitialized: true,
        isAuthenticated: !!action.payload.user,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        permissions: action.payload.permissions || [],
        roles: action.payload.roles || [],
        error: null
      };

    case AUTH_ACTIONS.INITIALIZE_FAILURE:
      return {
        ...state,
        isLoading: false,
        isInitialized: true,
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        permissions: [],
        roles: [],
        error: action.payload
      };

    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loginLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        loginLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        permissions: action.payload.permissions || [],
        roles: action.payload.roles || [],
        rememberMe: action.payload.rememberMe || false,
        sessionExpiration: action.payload.sessionExpiration,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        loginLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        permissions: [],
        roles: [],
        error: action.payload
      };

    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        registerLoading: true,
        error: null
      };

    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        registerLoading: false,
        error: null
      };

    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        registerLoading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
        isInitialized: true
      };

    case AUTH_ACTIONS.TOKEN_REFRESH_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        sessionExpiration: action.payload.sessionExpiration
      };

    case AUTH_ACTIONS.TOKEN_REFRESH_FAILURE:
      return {
        ...initialState,
        isLoading: false,
        isInitialized: true,
        error: 'Sesión expirada'
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    case AUTH_ACTIONS.UPDATE_PERMISSIONS:
      return {
        ...state,
        permissions: action.payload.permissions || [],
        roles: action.payload.roles || []
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };

    case AUTH_ACTIONS.SET_REMEMBER_ME:
      return {
        ...state,
        rememberMe: action.payload
      };

    default:
      return state;
  }
};

// Crear el contexto de autenticación
const AuthContext = createContext(undefined);

/**
 * Proveedor del contexto de autenticación
 * @param {Object} props - Props del componente
 */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { getItem, setItem, removeItem } = useLocalStorage();

  /**
   * Inicializar autenticación al cargar la aplicación
   */
  const initialize = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.INITIALIZE_START });

      const token = getItem('authToken');
      const refreshToken = getItem('refreshToken');
      const userString = getItem('user');

      if (token && userString) {
        const user = JSON.parse(userString);
        
        // Verificar validez del token
        const response = await authService.verifyToken(token);
        
        if (response.success) {
          dispatch({
            type: AUTH_ACTIONS.INITIALIZE_SUCCESS,
            payload: {
              user: response.user || user,
              token,
              refreshToken,
              permissions: response.permissions || [],
              roles: response.roles || []
            }
          });
        } else {
          // Token inválido, limpiar datos
          removeItem('authToken');
          removeItem('refreshToken');
          removeItem('user');
          
          dispatch({
            type: AUTH_ACTIONS.INITIALIZE_FAILURE,
            payload: 'Token inválido'
          });
        }
      } else {
        dispatch({
          type: AUTH_ACTIONS.INITIALIZE_SUCCESS,
          payload: {
            user: null,
            token: null,
            refreshToken: null
          }
        });
      }
    } catch (error) {
      console.error('Error al inicializar autenticación:', error);
      dispatch({
        type: AUTH_ACTIONS.INITIALIZE_FAILURE,
        payload: 'Error al inicializar sesión'
      });
    }
  }, [getItem, removeItem]);

  /**
   * Iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @param {boolean} rememberMe - Recordar sesión
   */
  const login = useCallback(async (email, password, rememberMe = false) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      const response = await authService.login(email, password, rememberMe);

      if (response.success) {
        const sessionExpiration = rememberMe 
          ? null 
          : Date.now() + (24 * 60 * 60 * 1000); // 24 horas

        // Guardar datos en localStorage
        setItem('authToken', response.token);
        setItem('refreshToken', response.refreshToken);
        setItem('user', JSON.stringify(response.user));
        
        if (sessionExpiration) {
          setItem('sessionExpiration', sessionExpiration.toString());
        }

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            permissions: response.permissions || [],
            roles: response.roles || [],
            rememberMe,
            sessionExpiration
          }
        });

        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: response.message || 'Error al iniciar sesión'
        });

        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error en login:', error);
      const errorMessage = error.response?.data?.message || 'Error de conexión';
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });

      return { success: false, error: errorMessage };
    }
  }, [setItem]);

  /**
   * Registrar nuevo usuario
   * @param {Object} userData - Datos del usuario
   */
  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });

      const response = await authService.register(userData);

      if (response.success) {
        dispatch({ type: AUTH_ACTIONS.REGISTER_SUCCESS });
        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.REGISTER_FAILURE,
          payload: response.message || 'Error al registrar usuario'
        });

        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      const errorMessage = error.response?.data?.message || 'Error de conexión';
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage
      });

      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cerrar sesión
   */
  const logout = useCallback(async () => {
    try {
      // Notificar al servidor del logout (opcional)
      await authService.logout();
    } catch (error) {
      console.error('Error al notificar logout:', error);
    } finally {
      // Limpiar datos locales
      removeItem('authToken');
      removeItem('refreshToken');
      removeItem('user');
      removeItem('sessionExpiration');

      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, [removeItem]);

  /**
   * Renovar token de acceso
   */
  const refreshAuthToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken();

      if (response.success) {
        // Actualizar tokens en localStorage
        setItem('authToken', response.token);
        setItem('refreshToken', response.refreshToken);

        dispatch({
          type: AUTH_ACTIONS.TOKEN_REFRESH_SUCCESS,
          payload: {
            token: response.token,
            refreshToken: response.refreshToken,
            sessionExpiration: Date.now() + (24 * 60 * 60 * 1000)
          }
        });

        return { success: true };
      } else {
        // Fallo al renovar token, cerrar sesión
        logout();
        return { success: false };
      }
    } catch (error) {
      console.error('Error al renovar token:', error);
      logout();
      return { success: false };
    }
  }, [setItem, logout]);

  /**
   * Actualizar datos del usuario
   * @param {Object} userData - Nuevos datos del usuario
   */
  const updateUser = useCallback(async (userData) => {
    try {
      const response = await authService.updateProfile(userData);

      if (response.success) {
        // Actualizar usuario en localStorage
        setItem('user', JSON.stringify(response.user));

        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: response.user
        });

        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return { success: false, error: 'Error al actualizar perfil' };
    }
  }, [setItem]);

  /**
   * Cambiar contraseña
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @param {string} confirmPassword - Confirmación de contraseña
   */
  const changePassword = useCallback(async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await authService.changePassword(currentPassword, newPassword, confirmPassword);
      return response;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return { success: false, error: 'Error al cambiar contraseña' };
    }
  }, []);

  /**
   * Verificar si el usuario tiene un permiso específico
   * @param {string} permission - Permiso a verificar
   */
  const hasPermission = useCallback((permission) => {
    return state.permissions.includes(permission);
  }, [state.permissions]);

  /**
   * Verificar si el usuario tiene un rol específico
   * @param {string} role - Rol a verificar
   */
  const hasRole = useCallback((role) => {
    return state.roles.some(userRole => userRole.nombre === role);
  }, [state.roles]);

  /**
   * Verificar si el usuario tiene alguno de los roles especificados
   * @param {Array} roles - Array de roles a verificar
   */
  const hasAnyRole = useCallback((roles) => {
    return roles.some(role => hasRole(role));
  }, [hasRole]);

  /**
   * Limpiar errores
   */
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  /**
   * Verificar si la sesión está expirada
   */
  const isSessionExpired = useCallback(() => {
    if (!state.sessionExpiration) return false;
    return Date.now() > state.sessionExpiration;
  }, [state.sessionExpiration]);

  // Inicializar autenticación al montar el componente
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Verificar expiración de sesión periódicamente
  useEffect(() => {
    if (!state.isAuthenticated || state.rememberMe) return;

    const interval = setInterval(() => {
      if (isSessionExpired()) {
        logout();
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.rememberMe, isSessionExpired, logout]);

  // Configurar interceptor para renovación automática de tokens
  useEffect(() => {
    const handleTokenExpired = () => {
      logout();
    };

    // Escuchar eventos personalizados de token expirado
    window.addEventListener('auth:tokenExpired', handleTokenExpired);
    window.addEventListener('auth:unauthorized', handleTokenExpired);

    return () => {
      window.removeEventListener('auth:tokenExpired', handleTokenExpired);
      window.removeEventListener('auth:unauthorized', handleTokenExpired);
    };
  }, [logout]);

  // Valor del contexto
  const contextValue = {
    // Estado
    ...state,
    
    // Acciones
    login,
    register,
    logout,
    refreshAuthToken,
    updateUser,
    changePassword,
    
    // Utilidades
    hasPermission,
    hasRole,
    hasAnyRole,
    clearError,
    isSessionExpired,
    
    // Funciones de inicialización
    initialize
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

/**
 * HOC para proteger rutas que requieren autenticación
 * @param {React.Component} Component - Componente a proteger
 */
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return <div>Cargando...</div>; // O un componente de loading personalizado
    }
    
    if (!isAuthenticated) {
      return <div>No autorizado</div>; // O redireccionar al login
    }
    
    return <Component {...props} />;
  };
};

/**
 * HOC para proteger rutas que requieren permisos específicos
 * @param {Array} requiredPermissions - Permisos requeridos
 */
export const withPermissions = (requiredPermissions) => (Component) => {
  return function PermissionProtectedComponent(props) {
    const { hasPermission, hasAnyRole } = useAuth();
    
    const hasRequiredPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );
    
    // Los administradores siempre tienen acceso
    const isAdmin = hasAnyRole(['admin']);
    
    if (!hasRequiredPermissions && !isAdmin) {
      return <div>Sin permisos suficientes</div>;
    }
    
    return <Component {...props} />;
  };
};

/**
 * HOC para proteger rutas que requieren roles específicos
 * @param {Array} requiredRoles - Roles requeridos
 */
export const withRoles = (requiredRoles) => (Component) => {
  return function RoleProtectedComponent(props) {
    const { hasAnyRole } = useAuth();
    
    if (!hasAnyRole(requiredRoles)) {
      return <div>Sin permisos de rol</div>;
    }
    
    return <Component {...props} />;
  };
};

export default AuthContext;