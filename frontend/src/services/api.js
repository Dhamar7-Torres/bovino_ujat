import axios from 'axios';

/**
 * Configuración base de la API para el sistema de gestión de bovinos
 * Incluye interceptors para manejo de tokens, errores y configuración global
 */

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_TIMEOUT = 30000; // 30 segundos

// Crear instancia de axios con configuración por defecto
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Interceptor de peticiones - Agregar token de autenticación
 */
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Agregar timestamp para cache-busting si es necesario
    if (config.method === 'get' && config.params?.bustCache) {
      config.params._t = Date.now();
      delete config.params.bustCache;
    }
    
    // Log de peticiones en desarrollo
    if (import.meta.env.MODE === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
        params: config.params
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de respuestas - Manejo global de errores y tokens
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log de respuestas exitosas en desarrollo
    if (import.meta.env.MODE === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log de errores
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    // Manejo de error 401 - Token expirado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Intentar renovar token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          const { token: newToken } = response.data;
          
          // Guardar nuevo token
          localStorage.setItem('authToken', newToken);
          
          // Reintentar petición original con nuevo token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Error al renovar token - redirigir a login
        console.error('Error al renovar token:', refreshError);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        
        // Emitir evento personalizado para que la app maneje el logout
        window.dispatchEvent(new CustomEvent('auth:tokenExpired'));
        
        return Promise.reject(refreshError);
      }
    }
    
    // Manejo de error 403 - Sin permisos
    if (error.response?.status === 403) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized', {
        detail: { message: error.response.data.message }
      }));
    }
    
    // Manejo de errores de red
    if (!error.response) {
      const networkError = new Error('Error de conexión. Verifica tu conexión a internet.');
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Funciones auxiliares para diferentes tipos de peticiones HTTP
 */

/**
 * Realizar petición GET
 * @param {string} url - URL del endpoint
 * @param {Object} params - Parámetros de query
 * @param {Object} config - Configuración adicional
 */
export const get = async (url, params = {}, config = {}) => {
  try {
    const response = await apiClient.get(url, {
      params,
      ...config
    });
    return {
      success: true,
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Realizar petición POST
 * @param {string} url - URL del endpoint
 * @param {Object} data - Datos a enviar
 * @param {Object} config - Configuración adicional
 */
export const post = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.post(url, data, config);
    return {
      success: true,
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Realizar petición PUT
 * @param {string} url - URL del endpoint
 * @param {Object} data - Datos a enviar
 * @param {Object} config - Configuración adicional
 */
export const put = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.put(url, data, config);
    return {
      success: true,
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Realizar petición PATCH
 * @param {string} url - URL del endpoint
 * @param {Object} data - Datos a enviar
 * @param {Object} config - Configuración adicional
 */
export const patch = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.patch(url, data, config);
    return {
      success: true,
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Realizar petición DELETE
 * @param {string} url - URL del endpoint
 * @param {Object} config - Configuración adicional
 */
export const del = async (url, config = {}) => {
  try {
    const response = await apiClient.delete(url, config);
    return {
      success: true,
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Subir archivos con FormData
 * @param {string} url - URL del endpoint
 * @param {FormData} formData - Datos del formulario
 * @param {Object} config - Configuración adicional
 */
export const upload = async (url, formData, config = {}) => {
  try {
    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: config.onUploadProgress,
      ...config
    });
    
    return {
      success: true,
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Descargar archivos
 * @param {string} url - URL del endpoint
 * @param {string} filename - Nombre del archivo
 * @param {Object} config - Configuración adicional
 */
export const download = async (url, filename, config = {}) => {
  try {
    const response = await apiClient.get(url, {
      responseType: 'blob',
      onDownloadProgress: config.onDownloadProgress,
      ...config
    });
    
    // Crear enlace de descarga
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(downloadUrl);
    
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Función para manejar errores de API de forma consistente
 * @param {Error} error - Error de axios
 */
const handleApiError = (error) => {
  const errorResponse = {
    success: false,
    message: 'Error desconocido',
    status: null,
    data: null
  };
  
  if (error.isNetworkError) {
    errorResponse.message = error.message;
    errorResponse.isNetworkError = true;
  } else if (error.response) {
    // Error de respuesta del servidor
    errorResponse.status = error.response.status;
    errorResponse.data = error.response.data;
    errorResponse.message = error.response.data?.message || `Error ${error.response.status}`;
  } else if (error.request) {
    // Error de petición sin respuesta
    errorResponse.message = 'No se recibió respuesta del servidor';
    errorResponse.isTimeoutError = error.code === 'ECONNABORTED';
  } else {
    // Error en la configuración de la petición
    errorResponse.message = error.message;
  }
  
  return errorResponse;
};

/**
 * Configurar nuevo token de autenticación
 * @param {string} token - Nuevo token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

/**
 * Limpiar tokens de autenticación
 */
export const clearAuthTokens = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  delete apiClient.defaults.headers.common['Authorization'];
};

/**
 * Obtener configuración actual de la API
 */
export const getApiConfig = () => ({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  hasToken: !!localStorage.getItem('authToken')
});

/**
 * Función para configurar interceptors personalizados
 * @param {Function} requestInterceptor - Interceptor de peticiones
 * @param {Function} responseInterceptor - Interceptor de respuestas
 */
export const setCustomInterceptors = (requestInterceptor, responseInterceptor) => {
  if (requestInterceptor) {
    apiClient.interceptors.request.use(requestInterceptor);
  }
  
  if (responseInterceptor) {
    apiClient.interceptors.response.use(responseInterceptor);
  }
};

/**
 * Función para realizar peticiones en lote
 * @param {Array} requests - Array de configuraciones de peticiones
 */
export const batchRequests = async (requests) => {
  try {
    const promises = requests.map(request => {
      const { method, url, data, params, config } = request;
      
      switch (method.toLowerCase()) {
        case 'get':
          return get(url, params, config);
        case 'post':
          return post(url, data, config);
        case 'put':
          return put(url, data, config);
        case 'patch':
          return patch(url, data, config);
        case 'delete':
          return del(url, config);
        default:
          throw new Error(`Método HTTP no soportado: ${method}`);
      }
    });
    
    const results = await Promise.allSettled(promises);
    
    return {
      success: true,
      results: results.map((result, index) => ({
        index,
        status: result.status,
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null
      }))
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Exportar instancia de axios para casos especiales
export { apiClient };

// Exportar configuración por defecto
export default {
  get,
  post,
  put,
  patch,
  delete: del,
  upload,
  download,
  setAuthToken,
  clearAuthTokens,
  getApiConfig,
  setCustomInterceptors,
  batchRequests,
  apiClient
};