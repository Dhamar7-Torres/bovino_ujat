import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { useLocalStorage } from './useLocalStorage';

/**
 * Hook personalizado para manejo de autenticación
 * Maneja login, logout, registro y persistencia de sesión
 */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getItem, setItem, removeItem } = useLocalStorage();

  // Estados adicionales para control de formularios
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  /**
   * Función para inicializar la autenticación
   * Verifica si existe una sesión activa al cargar la app
   */
  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = getItem('authToken');
      
      if (token) {
        // Verificar si el token es válido
        const userData = await authService.verifyToken(token);
        if (userData) {
          setUser(userData);
        } else {
          // Token inválido, limpiarlo
          removeItem('authToken');
          removeItem('refreshToken');
        }
      }
    } catch (err) {
      console.error('Error al inicializar autenticación:', err);
      setError('Error al inicializar sesión');
      // Limpiar tokens inválidos
      removeItem('authToken');
      removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  }, [getItem, removeItem]);

  /**
   * Función para iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   */
  const login = useCallback(async (email, password) => {
    try {
      setIsLoggingIn(true);
      setError(null);

      const response = await authService.login(email, password);
      
      if (response.success) {
        const { user: userData, token, refreshToken } = response.data;
        
        // Guardar tokens en localStorage
        setItem('authToken', token);
        setItem('refreshToken', refreshToken);
        
        // Establecer usuario en el estado
        setUser(userData);
        
        return { success: true, user: userData };
      } else {
        setError(response.message || 'Error al iniciar sesión');
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error('Error en login:', err);
      const errorMessage = err.response?.data?.message || 'Error de conexión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoggingIn(false);
    }
  }, [setItem]);

  /**
   * Función para registrar nuevo usuario
   * @param {Object} userData - Datos del usuario (nombre, apellido, email, password, rol)
   */
  const register = useCallback(async (userData) => {
    try {
      setIsRegistering(true);
      setError(null);

      const response = await authService.register(userData);
      
      if (response.success) {
        const { user: newUser, token, refreshToken } = response.data;
        
        // Guardar tokens en localStorage
        setItem('authToken', token);
        setItem('refreshToken', refreshToken);
        
        // Establecer usuario en el estado
        setUser(newUser);
        
        return { success: true, user: newUser };
      } else {
        setError(response.message || 'Error al registrar usuario');
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error('Error en registro:', err);
      const errorMessage = err.response?.data?.message || 'Error de conexión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsRegistering(false);
    }
  }, [setItem]);

  /**
   * Función para cerrar sesión
   */
  const logout = useCallback(async () => {
    try {
      // Llamar al servicio de logout (opcional, para invalidar token en servidor)
      await authService.logout();
    } catch (err) {
      console.error('Error al cerrar sesión en servidor:', err);
    } finally {
      // Limpiar estado local independientemente del resultado del servidor
      setUser(null);
      removeItem('authToken');
      removeItem('refreshToken');
      setError(null);
    }
  }, [removeItem]);

  /**
   * Función para renovar el token de acceso
   */
  const refreshToken = useCallback(async () => {
    try {
      const refreshTokenValue = getItem('refreshToken');
      
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(refreshTokenValue);
      
      if (response.success) {
        const { token: newToken, refreshToken: newRefreshToken } = response.data;
        
        setItem('authToken', newToken);
        if (newRefreshToken) {
          setItem('refreshToken', newRefreshToken);
        }
        
        return newToken;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (err) {
      console.error('Error al renovar token:', err);
      // Si falla la renovación, cerrar sesión
      logout();
      return null;
    }
  }, [getItem, setItem, logout]);

  /**
   * Función para actualizar datos del usuario
   * @param {Object} updatedData - Datos actualizados del usuario
   */
  const updateUser = useCallback(async (updatedData) => {
    try {
      setError(null);
      
      const response = await authService.updateProfile(updatedData);
      
      if (response.success) {
        setUser(prevUser => ({ ...prevUser, ...response.data }));
        return { success: true, user: response.data };
      } else {
        setError(response.message || 'Error al actualizar perfil');
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      const errorMessage = err.response?.data?.message || 'Error de conexión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Función para cambiar contraseña
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   */
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      setError(null);
      
      const response = await authService.changePassword(currentPassword, newPassword);
      
      if (response.success) {
        return { success: true };
      } else {
        setError(response.message || 'Error al cambiar contraseña');
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      const errorMessage = err.response?.data?.message || 'Error de conexión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Función para recuperar contraseña
   * @param {string} email - Email del usuario
   */
  const forgotPassword = useCallback(async (email) => {
    try {
      setError(null);
      
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        setError(response.message || 'Error al enviar email de recuperación');
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error('Error en recuperación de contraseña:', err);
      const errorMessage = err.response?.data?.message || 'Error de conexión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Verificar si el usuario tiene un rol específico
   * @param {string} role - Rol a verificar
   */
  const hasRole = useCallback((role) => {
    return user?.rol?.nombre === role;
  }, [user]);

  /**
   * Verificar si el usuario tiene alguno de los roles especificados
   * @param {Array} roles - Array de roles a verificar
   */
  const hasAnyRole = useCallback((roles) => {
    return roles.includes(user?.rol?.nombre);
  }, [user]);

  /**
   * Verificar si el usuario está autenticado
   */
  const isAuthenticated = user !== null;

  /**
   * Verificar si el usuario es administrador
   */
  const isAdmin = hasRole('admin');

  /**
   * Verificar si el usuario es veterinario
   */
  const isVeterinarian = hasRole('veterinario');

  // Efecto para inicializar la autenticación al montar el componente
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Configurar interceptor para renovar token automáticamente (opcional)
  useEffect(() => {
    if (user) {
      // Configurar interceptor de axios para manejar respuestas 401
      const interceptor = authService.setupTokenInterceptor(refreshToken);
      
      return () => {
        // Limpiar interceptor al desmontar
        authService.removeTokenInterceptor(interceptor);
      };
    }
  }, [user, refreshToken]);

  return {
    // Estado
    user,
    loading,
    error,
    isLoggingIn,
    isRegistering,
    isAuthenticated,
    isAdmin,
    isVeterinarian,
    
    // Acciones
    login,
    register,
    logout,
    refreshToken,
    updateUser,
    changePassword,
    forgotPassword,
    
    // Utilidades
    hasRole,
    hasAnyRole,
    
    // Funciones auxiliares
    clearError: () => setError(null),
    initializeAuth
  };
};

export default useAuth;