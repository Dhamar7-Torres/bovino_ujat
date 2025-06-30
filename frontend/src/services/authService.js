import { get, post, put, patch, del, setAuthToken, clearAuthTokens } from './api';

/**
 * Servicio de autenticación para el sistema de gestión de bovinos
 * Maneja login, registro, recuperación de contraseña y gestión de usuarios
 */

/**
 * Iniciar sesión con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @param {boolean} rememberMe - Recordar sesión
 */
export const login = async (email, password, rememberMe = false) => {
  try {
    const response = await post('/auth/login', {
      email,
      password,
      rememberMe
    });

    if (response.success) {
      const { token, refreshToken, user } = response.data;
      
      // Guardar tokens en localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Configurar token en axios
      setAuthToken(token);
      
      // Guardar datos del usuario
      localStorage.setItem('user', JSON.stringify(user));
      
      // Configurar expiración si no es "recordar sesión"
      if (!rememberMe) {
        const expirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 horas
        localStorage.setItem('tokenExpiration', expirationTime.toString());
      }
      
      return {
        success: true,
        user,
        token,
        message: 'Sesión iniciada correctamente'
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error en login:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al iniciar sesión'
    };
  }
};

/**
 * Registrar nuevo usuario
 * @param {Object} userData - Datos del usuario a registrar
 */
export const register = async (userData) => {
  try {
    const {
      nombre,
      apellidos,
      email,
      password,
      confirmPassword,
      telefono,
      rol_id,
      rancho_id
    } = userData;

    const response = await post('/auth/register', {
      nombre,
      apellidos,
      email,
      password,
      confirmPassword,
      telefono,
      rol_id,
      rancho_id
    });

    if (response.success) {
      return {
        success: true,
        user: response.data.user,
        message: 'Usuario registrado correctamente'
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error en registro:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al registrar usuario'
    };
  }
};

/**
 * Cerrar sesión del usuario actual
 */
export const logout = async () => {
  try {
    // Intentar notificar al servidor del logout
    await post('/auth/logout');
  } catch (error) {
    console.error('Error al notificar logout al servidor:', error);
  } finally {
    // Limpiar datos locales independientemente del resultado
    clearAuthTokens();
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');
    
    return {
      success: true,
      message: 'Sesión cerrada correctamente'
    };
  }
};

/**
 * Verificar validez del token actual
 * @param {string} token - Token a verificar (opcional)
 */
export const verifyToken = async (token = null) => {
  try {
    const tokenToVerify = token || localStorage.getItem('authToken');
    
    if (!tokenToVerify) {
      return {
        success: false,
        message: 'No hay token disponible'
      };
    }

    const response = await get('/auth/verify');

    if (response.success) {
      const { user } = response.data;
      
      // Actualizar datos del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        success: true,
        user,
        isValid: true
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error al verificar token:', error);
    
    // Si el token es inválido, limpiar datos
    if (error.response?.status === 401) {
      clearAuthTokens();
      localStorage.removeItem('user');
    }
    
    return {
      success: false,
      isValid: false,
      message: 'Token inválido'
    };
  }
};

/**
 * Renovar token de acceso usando refresh token
 */
export const refreshToken = async () => {
  try {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    
    if (!refreshTokenValue) {
      return {
        success: false,
        message: 'No hay refresh token disponible'
      };
    }

    const response = await post('/auth/refresh', {
      refreshToken: refreshTokenValue
    });

    if (response.success) {
      const { token, refreshToken: newRefreshToken } = response.data;
      
      // Actualizar tokens
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', newRefreshToken);
      setAuthToken(token);
      
      return {
        success: true,
        token,
        message: 'Token renovado correctamente'
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error al renovar token:', error);
    
    // Si falla la renovación, limpiar todo
    clearAuthTokens();
    localStorage.removeItem('user');
    
    return {
      success: false,
      message: 'Error al renovar token'
    };
  }
};

/**
 * Solicitar recuperación de contraseña
 * @param {string} email - Email del usuario
 */
export const forgotPassword = async (email) => {
  try {
    const response = await post('/auth/forgot-password', { email });
    
    return {
      success: response.success,
      message: response.success 
        ? 'Se ha enviado un enlace de recuperación a tu email'
        : response.message || 'Error al enviar email de recuperación'
    };
  } catch (error) {
    console.error('Error al solicitar recuperación:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al enviar email de recuperación'
    };
  }
};

/**
 * Restablecer contraseña con token
 * @param {string} token - Token de recuperación
 * @param {string} newPassword - Nueva contraseña
 * @param {string} confirmPassword - Confirmación de contraseña
 */
export const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    const response = await post('/auth/reset-password', {
      token,
      newPassword,
      confirmPassword
    });
    
    return {
      success: response.success,
      message: response.success 
        ? 'Contraseña restablecida correctamente'
        : response.message || 'Error al restablecer contraseña'
    };
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al restablecer contraseña'
    };
  }
};

/**
 * Cambiar contraseña del usuario actual
 * @param {string} currentPassword - Contraseña actual
 * @param {string} newPassword - Nueva contraseña
 * @param {string} confirmPassword - Confirmación de contraseña
 */
export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  try {
    const response = await put('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword
    });
    
    return {
      success: response.success,
      message: response.success 
        ? 'Contraseña cambiada correctamente'
        : response.message || 'Error al cambiar contraseña'
    };
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al cambiar contraseña'
    };
  }
};

/**
 * Actualizar perfil del usuario actual
 * @param {Object} profileData - Datos del perfil a actualizar
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await put('/auth/profile', profileData);
    
    if (response.success) {
      const { user } = response.data;
      
      // Actualizar datos del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        success: true,
        user,
        message: 'Perfil actualizado correctamente'
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar perfil'
    };
  }
};

/**
 * Obtener perfil del usuario actual
 */
export const getProfile = async () => {
  try {
    const response = await get('/auth/profile');
    
    if (response.success) {
      const { user } = response.data;
      
      // Actualizar datos del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        success: true,
        user
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return {
      success: false,
      message: 'Error al obtener datos del perfil'
    };
  }
};

/**
 * Obtener lista de usuarios (solo admin)
 * @param {Object} filters - Filtros de búsqueda
 */
export const getUsers = async (filters = {}) => {
  try {
    const response = await get('/auth/users', filters);
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar lista de usuarios'
    };
  }
};

/**
 * Crear nuevo usuario (solo admin)
 * @param {Object} userData - Datos del usuario
 */
export const createUser = async (userData) => {
  try {
    const response = await post('/auth/users', userData);
    
    return {
      success: response.success,
      user: response.data?.user,
      message: response.success 
        ? 'Usuario creado correctamente'
        : response.message || 'Error al crear usuario'
    };
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear usuario'
    };
  }
};

/**
 * Actualizar usuario existente (solo admin)
 * @param {string} userId - ID del usuario
 * @param {Object} userData - Datos a actualizar
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await put(`/auth/users/${userId}`, userData);
    
    return {
      success: response.success,
      user: response.data?.user,
      message: response.success 
        ? 'Usuario actualizado correctamente'
        : response.message || 'Error al actualizar usuario'
    };
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar usuario'
    };
  }
};

/**
 * Eliminar usuario (solo admin)
 * @param {string} userId - ID del usuario
 */
export const deleteUser = async (userId) => {
  try {
    const response = await del(`/auth/users/${userId}`);
    
    return {
      success: response.success,
      message: response.success 
        ? 'Usuario eliminado correctamente'
        : response.message || 'Error al eliminar usuario'
    };
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al eliminar usuario'
    };
  }
};

/**
 * Activar/desactivar usuario (solo admin)
 * @param {string} userId - ID del usuario
 * @param {boolean} active - Estado activo
 */
export const toggleUserStatus = async (userId, active) => {
  try {
    const response = await patch(`/auth/users/${userId}/status`, { active });
    
    return {
      success: response.success,
      message: response.success 
        ? `Usuario ${active ? 'activado' : 'desactivado'} correctamente`
        : response.message || 'Error al cambiar estado del usuario'
    };
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al cambiar estado del usuario'
    };
  }
};

/**
 * Obtener roles disponibles
 */
export const getRoles = async () => {
  try {
    const response = await get('/auth/roles');
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener roles:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar roles'
    };
  }
};

/**
 * Verificar permisos del usuario
 * @param {string} permission - Permiso a verificar
 * @param {string} resource - Recurso (opcional)
 */
export const checkPermission = async (permission, resource = null) => {
  try {
    const response = await get('/auth/permissions/check', {
      permission,
      resource
    });
    
    return {
      success: response.success,
      hasPermission: response.data?.hasPermission || false
    };
  } catch (error) {
    console.error('Error al verificar permisos:', error);
    return {
      success: false,
      hasPermission: false
    };
  }
};

/**
 * Configurar interceptor para renovación automática de tokens
 * @param {Function} refreshCallback - Callback para renovar token
 */
export const setupTokenInterceptor = (refreshCallback) => {
  // Esta función será implementada en api.js
  console.log('Token interceptor configurado');
  return refreshCallback;
};

/**
 * Remover interceptor de tokens
 * @param {*} interceptor - Interceptor a remover
 */
export const removeTokenInterceptor = (interceptor) => {
  // Esta función será implementada en api.js
  console.log('Token interceptor removido');
};

/**
 * Verificar si la sesión está expirada
 */
export const isSessionExpired = () => {
  const expiration = localStorage.getItem('tokenExpiration');
  
  if (!expiration) {
    return false; // Si no hay expiración configurada, no ha expirado
  }
  
  return Date.now() > parseInt(expiration);
};

/**
 * Obtener datos del usuario desde localStorage
 */
export const getCurrentUser = () => {
  try {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
};

/**
 * Verificar si el usuario está autenticado
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const user = getCurrentUser();
  
  return !!(token && user && !isSessionExpired());
};

// Exportaciones por defecto
export default {
  login,
  register,
  logout,
  verifyToken,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  getProfile,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getRoles,
  checkPermission,
  setupTokenInterceptor,
  removeTokenInterceptor,
  isSessionExpired,
  getCurrentUser,
  isAuthenticated
};