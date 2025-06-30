/**
 * AuthContext.js - Contexto para manejo de autenticación y autorización
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial de autenticación
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  user: null,
  token: null,
  refreshToken: null,
  permissions: [],
  roles: [],
  error: null,
  sessionExpiration: null,
  rememberMe: false
};

// Acciones del reducer
const AUTH_ACTIONS = {
  INITIALIZE_START: 'INITIALIZE_START',
  INITIALIZE_SUCCESS: 'INITIALIZE_SUCCESS', 
  INITIALIZE_FAILURE: 'INITIALIZE_FAILURE',
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  TOKEN_REFRESH_SUCCESS: 'TOKEN_REFRESH_SUCCESS',
  TOKEN_REFRESH_FAILURE: 'TOKEN_REFRESH_FAILURE',
  UPDATE_USER: 'UPDATE_USER',
  UPDATE_PERMISSIONS: 'UPDATE_PERMISSIONS',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ERROR: 'SET_ERROR',
  SET_REMEMBER_ME: 'SET_REMEMBER_ME'
};

// Reducer de autenticación
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
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        permissions: action.payload.permissions || [],
        roles: action.payload.roles || [],
        sessionExpiration: action.payload.sessionExpiration
      };

    case AUTH_ACTIONS.INITIALIZE_FAILURE:
      return {
        ...initialState,
        isLoading: false,
        isInitialized: true,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        permissions: action.payload.permissions || [],
        roles: action.payload.roles || [],
        sessionExpiration: action.payload.sessionExpiration,
        rememberMe: action.payload.rememberMe || false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        permissions: [],
        roles: [],
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

// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Simular usuario autenticado para desarrollo
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.INITIALIZE_START });

        // Verificar si hay datos de autenticación en localStorage
        const savedToken = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('authUser');

        if (savedToken && savedUser) {
          // Simular autenticación exitosa
          const user = JSON.parse(savedUser);
          dispatch({
            type: AUTH_ACTIONS.INITIALIZE_SUCCESS,
            payload: {
              user,
              token: savedToken,
              refreshToken: localStorage.getItem('refreshToken'),
              permissions: ['read', 'write', 'admin'],
              roles: ['admin'],
              sessionExpiration: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
            }
          });
        } else {
          // Usuario no autenticado, pero para desarrollo vamos a auto-autenticar
          const mockUser = {
            id: 1,
            name: 'Usuario Demo',
            email: 'demo@sistemaganadero.com',
            role: 'Administrador',
            avatar: '/api/placeholder/40/40',
            ranch: 'Rancho Demo'
          };

          const mockToken = 'demo-token-' + Date.now();

          // Guardar en localStorage
          localStorage.setItem('authToken', mockToken);
          localStorage.setItem('authUser', JSON.stringify(mockUser));

          dispatch({
            type: AUTH_ACTIONS.INITIALIZE_SUCCESS,
            payload: {
              user: mockUser,
              token: mockToken,
              refreshToken: 'demo-refresh-token',
              permissions: ['read', 'write', 'admin'],
              roles: ['admin'],
              sessionExpiration: Date.now() + 24 * 60 * 60 * 1000
            }
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        dispatch({
          type: AUTH_ACTIONS.INITIALIZE_FAILURE,
          payload: error.message
        });
      }
    };

    initializeAuth();
  }, []);

  // Función de login
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser = {
        id: 1,
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: 'Administrador',
        avatar: '/api/placeholder/40/40',
        ranch: 'Rancho Principal'
      };

      const mockToken = 'token-' + Date.now();

      // Guardar en localStorage
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('authUser', JSON.stringify(mockUser));
      if (credentials.rememberMe) {
        localStorage.setItem('refreshToken', 'refresh-' + Date.now());
      }

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: mockUser,
          token: mockToken,
          refreshToken: credentials.rememberMe ? 'refresh-' + Date.now() : null,
          permissions: ['read', 'write', 'admin'],
          roles: ['admin'],
          sessionExpiration: Date.now() + 24 * 60 * 60 * 1000,
          rememberMe: credentials.rememberMe
        }
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      // Limpiar localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('refreshToken');

      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      return { success: false, error: error.message };
    }
  };

  // Función para actualizar usuario
  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData
    });

    // Actualizar localStorage
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
  };

  // Función para verificar permisos
  const hasPermission = (permission) => {
    return state.permissions.includes(permission) || state.roles.includes('admin');
  };

  // Función para verificar roles
  const hasRole = (role) => {
    return state.roles.includes(role);
  };

  // Función para verificar múltiples permisos
  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission));
  };

  // Función para verificar si tiene al menos uno de los permisos
  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };

  // Función para verificar múltiples roles
  const hasAnyRole = (roles) => {
    return roles.some(role => hasRole(role));
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Función para refrescar token
  const refreshToken = async () => {
    try {
      if (!state.refreshToken) {
        throw new Error('No refresh token available');
      }

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));

      const newToken = 'refreshed-token-' + Date.now();
      const newRefreshToken = 'refreshed-refresh-' + Date.now();

      localStorage.setItem('authToken', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      dispatch({
        type: AUTH_ACTIONS.TOKEN_REFRESH_SUCCESS,
        payload: {
          token: newToken,
          refreshToken: newRefreshToken,
          sessionExpiration: Date.now() + 24 * 60 * 60 * 1000
        }
      });

      return { success: true, token: newToken };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.TOKEN_REFRESH_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  // Verificar si la sesión ha expirado
  const isSessionExpired = () => {
    if (!state.sessionExpiration) return false;
    return Date.now() > state.sessionExpiration;
  };

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    hasPermission,
    hasRole,
    hasAllPermissions,
    hasAnyPermission,
    hasAnyRole,
    clearError,
    refreshToken,
    isSessionExpired
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;