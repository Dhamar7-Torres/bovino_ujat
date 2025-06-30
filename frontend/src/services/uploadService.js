import { get, post, put, patch, del, upload } from './api';

/**
 * Servicio para gestión de archivos y subidas en el sistema de gestión de bovinos
 * Incluye subida de imágenes, documentos, validación, progreso y gestión de almacenamiento
 */

/**
 * Subir archivo único
 * @param {File} file - Archivo a subir
 * @param {Object} options - Opciones de subida
 */
export const uploadSingleFile = async (file, options = {}) => {
  try {
    const {
      categoria = 'general', // bovinos, documentos, reportes, perfiles, eventos
      subcategoria = '',
      entidad_tipo = '', // bovino, rancho, usuario, evento, etc.
      entidad_id = '',
      descripcion = '',
      es_publico = false,
      comprimir_imagen = true,
      calidad_compresion = 80,
      redimensionar = false,
      ancho_maximo = 1920,
      alto_maximo = 1080,
      onUploadProgress = null
    } = options;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('categoria', categoria);
    formData.append('es_publico', es_publico);
    formData.append('comprimir_imagen', comprimir_imagen);
    formData.append('calidad_compresion', calidad_compresion);
    formData.append('redimensionar', redimensionar);
    formData.append('ancho_maximo', ancho_maximo);
    formData.append('alto_maximo', alto_maximo);

    if (subcategoria) formData.append('subcategoria', subcategoria);
    if (entidad_tipo) formData.append('entidad_tipo', entidad_tipo);
    if (entidad_id) formData.append('entidad_id', entidad_id);
    if (descripcion) formData.append('descripcion', descripcion);

    const response = await upload('/uploads/single', formData, {
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted, progressEvent);
        }
      }
    });
    
    return {
      success: response.success,
      data: response.data?.file || null,
      message: response.success 
        ? 'Archivo subido correctamente'
        : response.message || 'Error al subir archivo'
    };
  } catch (error) {
    console.error('Error al subir archivo:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al subir archivo'
    };
  }
};

/**
 * Subir múltiples archivos
 * @param {FileList|Array} files - Archivos a subir
 * @param {Object} options - Opciones de subida
 */
export const uploadMultipleFiles = async (files, options = {}) => {
  try {
    const {
      categoria = 'general',
      subcategoria = '',
      entidad_tipo = '',
      entidad_id = '',
      descripcion = '',
      es_publico = false,
      comprimir_imagenes = true,
      calidad_compresion = 80,
      redimensionar = false,
      ancho_maximo = 1920,
      alto_maximo = 1080,
      onUploadProgress = null,
      onFileProgress = null
    } = options;

    const formData = new FormData();
    
    // Agregar archivos
    Array.from(files).forEach((file, index) => {
      formData.append('files', file);
    });

    // Agregar metadatos
    formData.append('categoria', categoria);
    formData.append('es_publico', es_publico);
    formData.append('comprimir_imagenes', comprimir_imagenes);
    formData.append('calidad_compresion', calidad_compresion);
    formData.append('redimensionar', redimensionar);
    formData.append('ancho_maximo', ancho_maximo);
    formData.append('alto_maximo', alto_maximo);

    if (subcategoria) formData.append('subcategoria', subcategoria);
    if (entidad_tipo) formData.append('entidad_tipo', entidad_tipo);
    if (entidad_id) formData.append('entidad_id', entidad_id);
    if (descripcion) formData.append('descripcion', descripcion);

    const response = await upload('/uploads/multiple', formData, {
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted, progressEvent);
        }
      }
    });
    
    return {
      success: response.success,
      data: response.data?.files || [],
      failed: response.data?.failed || [],
      message: response.success 
        ? 'Archivos subidos correctamente'
        : response.message || 'Error al subir archivos'
    };
  } catch (error) {
    console.error('Error al subir archivos:', error);
    return {
      success: false,
      data: [],
      failed: [],
      message: error.response?.data?.message || 'Error al subir archivos'
    };
  }
};

/**
 * Subir imagen de perfil
 * @param {File} imageFile - Archivo de imagen
 * @param {Object} options - Opciones específicas para perfil
 */
export const uploadProfileImage = async (imageFile, options = {}) => {
  try {
    const {
      entidad_tipo = 'usuario',
      entidad_id,
      crear_miniaturas = true,
      tamaños_miniaturas = [50, 100, 200],
      formato_salida = 'webp',
      onUploadProgress = null
    } = options;

    const formData = new FormData();
    formData.append('profile_image', imageFile);
    formData.append('entidad_tipo', entidad_tipo);
    formData.append('entidad_id', entidad_id);
    formData.append('crear_miniaturas', crear_miniaturas);
    formData.append('tamaños_miniaturas', JSON.stringify(tamaños_miniaturas));
    formData.append('formato_salida', formato_salida);

    const response = await upload('/uploads/profile-image', formData, {
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted, progressEvent);
        }
      }
    });
    
    return {
      success: response.success,
      data: response.data?.image || null,
      thumbnails: response.data?.thumbnails || [],
      message: response.success 
        ? 'Imagen de perfil subida correctamente'
        : response.message || 'Error al subir imagen de perfil'
    };
  } catch (error) {
    console.error('Error al subir imagen de perfil:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al subir imagen de perfil'
    };
  }
};

/**
 * Subir documento con OCR
 * @param {File} documentFile - Archivo de documento
 * @param {Object} options - Opciones de procesamiento
 */
export const uploadDocumentWithOCR = async (documentFile, options = {}) => {
  try {
    const {
      categoria = 'documentos',
      subcategoria = '',
      entidad_tipo = '',
      entidad_id = '',
      procesar_ocr = true,
      idioma_ocr = 'spa',
      extraer_metadatos = true,
      generar_vista_previa = true,
      onUploadProgress = null
    } = options;

    const formData = new FormData();
    formData.append('document', documentFile);
    formData.append('categoria', categoria);
    formData.append('procesar_ocr', procesar_ocr);
    formData.append('idioma_ocr', idioma_ocr);
    formData.append('extraer_metadatos', extraer_metadatos);
    formData.append('generar_vista_previa', generar_vista_previa);

    if (subcategoria) formData.append('subcategoria', subcategoria);
    if (entidad_tipo) formData.append('entidad_tipo', entidad_tipo);
    if (entidad_id) formData.append('entidad_id', entidad_id);

    const response = await upload('/uploads/document-ocr', formData, {
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted, progressEvent);
        }
      }
    });
    
    return {
      success: response.success,
      data: response.data?.document || null,
      ocr_text: response.data?.ocr_text || '',
      metadata: response.data?.metadata || {},
      preview_url: response.data?.preview_url || null,
      message: response.success 
        ? 'Documento procesado correctamente'
        : response.message || 'Error al procesar documento'
    };
  } catch (error) {
    console.error('Error al procesar documento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al procesar documento'
    };
  }
};

/**
 * Obtener lista de archivos subidos
 * @param {Object} params - Parámetros de búsqueda y filtros
 */
export const getUploadedFiles = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      categoria = '',
      subcategoria = '',
      entidad_tipo = '',
      entidad_id = '',
      tipo_archivo = '', // imagen, documento, video, audio
      fecha_inicio = '',
      fecha_fin = '',
      usuario_id = '',
      es_publico = null,
      sortBy = 'fecha_subida',
      sortOrder = 'desc'
    } = params;

    const queryParams = {
      page,
      limit,
      categoria,
      subcategoria,
      entidad_tipo,
      entidad_id,
      tipo_archivo,
      fecha_inicio,
      fecha_fin,
      usuario_id,
      es_publico,
      sortBy,
      sortOrder
    };

    // Remover parámetros vacíos
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    const response = await get('/uploads', queryParams);
    
    return {
      success: response.success,
      data: response.data?.files || [],
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      totalPages: response.data?.totalPages || 1,
      storage_usage: response.data?.storage_usage || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener archivos:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: 'Error al cargar archivos'
    };
  }
};

/**
 * Obtener detalles de un archivo específico
 * @param {string} fileId - ID del archivo
 */
export const getFileDetails = async (fileId) => {
  try {
    const response = await get(`/uploads/${fileId}`);
    
    return {
      success: response.success,
      data: response.data || null,
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener detalles del archivo:', error);
    return {
      success: false,
      data: null,
      message: 'Error al cargar detalles del archivo'
    };
  }
};

/**
 * Actualizar metadatos de archivo
 * @param {string} fileId - ID del archivo
 * @param {Object} metadata - Nuevos metadatos
 */
export const updateFileMetadata = async (fileId, metadata) => {
  try {
    const {
      descripcion = '',
      etiquetas = [],
      es_publico = false,
      categoria = '',
      subcategoria = ''
    } = metadata;

    const response = await put(`/uploads/${fileId}/metadata`, {
      descripcion,
      etiquetas,
      es_publico,
      categoria,
      subcategoria
    });
    
    return {
      success: response.success,
      data: response.data?.file || null,
      message: response.success 
        ? 'Metadatos actualizados correctamente'
        : response.message || 'Error al actualizar metadatos'
    };
  } catch (error) {
    console.error('Error al actualizar metadatos:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar metadatos'
    };
  }
};

/**
 * Eliminar archivo
 * @param {string} fileId - ID del archivo
 * @param {boolean} eliminar_fisico - Si eliminar el archivo físico también
 */
export const deleteFile = async (fileId, eliminar_fisico = false) => {
  try {
    const response = await del(`/uploads/${fileId}`, {
      data: { eliminar_fisico }
    });
    
    return {
      success: response.success,
      message: response.success 
        ? 'Archivo eliminado correctamente'
        : response.message || 'Error al eliminar archivo'
    };
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al eliminar archivo'
    };
  }
};

/**
 * Generar URL firmada para descarga
 * @param {string} fileId - ID del archivo
 * @param {Object} options - Opciones de descarga
 */
export const generateDownloadUrl = async (fileId, options = {}) => {
  try {
    const {
      expiracion_horas = 24,
      marca_agua = false,
      solo_visualizacion = false
    } = options;

    const response = await post(`/uploads/${fileId}/download-url`, {
      expiracion_horas,
      marca_agua,
      solo_visualizacion
    });
    
    return {
      success: response.success,
      data: response.data || {},
      download_url: response.data?.download_url || null,
      expires_at: response.data?.expires_at || null,
      message: response.message
    };
  } catch (error) {
    console.error('Error al generar URL de descarga:', error);
    return {
      success: false,
      data: {},
      message: 'Error al generar URL de descarga'
    };
  }
};

/**
 * Redimensionar imagen existente
 * @param {string} fileId - ID del archivo de imagen
 * @param {Object} options - Opciones de redimensionado
 */
export const resizeImage = async (fileId, options = {}) => {
  try {
    const {
      ancho = null,
      alto = null,
      mantener_aspecto = true,
      calidad = 80,
      formato = 'original', // original, jpeg, png, webp
      crear_nueva_version = true
    } = options;

    const response = await post(`/uploads/${fileId}/resize`, {
      ancho,
      alto,
      mantener_aspecto,
      calidad,
      formato,
      crear_nueva_version
    });
    
    return {
      success: response.success,
      data: response.data?.resized_image || null,
      message: response.success 
        ? 'Imagen redimensionada correctamente'
        : response.message || 'Error al redimensionar imagen'
    };
  } catch (error) {
    console.error('Error al redimensionar imagen:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al redimensionar imagen'
    };
  }
};

/**
 * Comprimir archivo
 * @param {string} fileId - ID del archivo
 * @param {Object} options - Opciones de compresión
 */
export const compressFile = async (fileId, options = {}) => {
  try {
    const {
      nivel_compresion = 6, // 1-9
      formato_salida = 'original',
      mantener_original = true
    } = options;

    const response = await post(`/uploads/${fileId}/compress`, {
      nivel_compresion,
      formato_salida,
      mantener_original
    });
    
    return {
      success: response.success,
      data: response.data?.compressed_file || null,
      ahorro_espacio: response.data?.ahorro_espacio || 0,
      message: response.success 
        ? 'Archivo comprimido correctamente'
        : response.message || 'Error al comprimir archivo'
    };
  } catch (error) {
    console.error('Error al comprimir archivo:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al comprimir archivo'
    };
  }
};

/**
 * Obtener estadísticas de almacenamiento
 * @param {Object} filters - Filtros para estadísticas
 */
export const getStorageStats = async (filters = {}) => {
  try {
    const {
      usuario_id = '',
      categoria = '',
      entidad_tipo = '',
      fecha_inicio = '',
      fecha_fin = ''
    } = filters;

    const response = await get('/uploads/storage-stats', {
      usuario_id,
      categoria,
      entidad_tipo,
      fecha_inicio,
      fecha_fin
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener estadísticas de almacenamiento:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar estadísticas de almacenamiento'
    };
  }
};

/**
 * Limpiar archivos temporales y huérfanos
 * @param {Object} options - Opciones de limpieza
 */
export const cleanupFiles = async (options = {}) => {
  try {
    const {
      eliminar_temporales = true,
      eliminar_huerfanos = false,
      dias_antiguedad = 7,
      categorias = []
    } = options;

    const response = await post('/uploads/cleanup', {
      eliminar_temporales,
      eliminar_huerfanos,
      dias_antiguedad,
      categorias
    });
    
    return {
      success: response.success,
      data: response.data || {},
      archivos_eliminados: response.data?.archivos_eliminados || 0,
      espacio_liberado: response.data?.espacio_liberado || 0,
      message: response.success 
        ? 'Limpieza completada correctamente'
        : response.message || 'Error en la limpieza'
    };
  } catch (error) {
    console.error('Error en limpieza de archivos:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error en la limpieza'
    };
  }
};

/**
 * Validar archivo antes de subir
 * @param {File} file - Archivo a validar
 * @param {Object} options - Opciones de validación
 */
export const validateFile = async (file, options = {}) => {
  try {
    const {
      tamaño_maximo = 10 * 1024 * 1024, // 10MB por defecto
      tipos_permitidos = [],
      verificar_virus = false,
      verificar_contenido = true
    } = options;

    // Validaciones del lado del cliente
    const errors = [];
    
    // Validar tamaño
    if (file.size > tamaño_maximo) {
      errors.push(`El archivo excede el tamaño máximo permitido (${formatFileSize(tamaño_maximo)})`);
    }
    
    // Validar tipo
    if (tipos_permitidos.length > 0 && !tipos_permitidos.includes(file.type)) {
      errors.push(`Tipo de archivo no permitido. Tipos aceptados: ${tipos_permitidos.join(', ')}`);
    }
    
    // Si hay errores del lado del cliente, retornar inmediatamente
    if (errors.length > 0) {
      return {
        success: false,
        errors,
        message: 'Archivo no válido'
      };
    }

    // Validación del lado del servidor si se requiere
    if (verificar_virus || verificar_contenido) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('verificar_virus', verificar_virus);
      formData.append('verificar_contenido', verificar_contenido);

      const response = await post('/uploads/validate', formData);
      
      return {
        success: response.success,
        data: response.data || {},
        errors: response.data?.errors || [],
        message: response.message
      };
    }
    
    return {
      success: true,
      message: 'Archivo válido'
    };
  } catch (error) {
    console.error('Error al validar archivo:', error);
    return {
      success: false,
      errors: ['Error en la validación del archivo'],
      message: 'Error al validar archivo'
    };
  }
};

/**
 * Buscar archivos
 * @param {string} query - Término de búsqueda
 * @param {Object} filters - Filtros adicionales
 */
export const searchFiles = async (query, filters = {}) => {
  try {
    const response = await get('/uploads/search', {
      q: query,
      ...filters
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error en búsqueda de archivos:', error);
    return {
      success: false,
      data: [],
      message: 'Error en la búsqueda'
    };
  }
};

/**
 * Crear álbum/galería de archivos
 * @param {Object} albumData - Datos del álbum
 */
export const createAlbum = async (albumData) => {
  try {
    const {
      nombre,
      descripcion = '',
      categoria = 'galeria',
      archivos_ids = [],
      es_publico = false,
      ordenamiento = 'fecha_subida'
    } = albumData;

    const response = await post('/uploads/albums', {
      nombre,
      descripcion,
      categoria,
      archivos_ids,
      es_publico,
      ordenamiento
    });
    
    return {
      success: response.success,
      data: response.data?.album || null,
      message: response.success 
        ? 'Álbum creado correctamente'
        : response.message || 'Error al crear álbum'
    };
  } catch (error) {
    console.error('Error al crear álbum:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear álbum'
    };
  }
};

/**
 * Obtener álbumes del usuario
 * @param {Object} filters - Filtros para álbumes
 */
export const getUserAlbums = async (filters = {}) => {
  try {
    const {
      categoria = '',
      es_publico = null,
      incluir_archivos = false
    } = filters;

    const response = await get('/uploads/albums', {
      categoria,
      es_publico,
      incluir_archivos
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener álbumes:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar álbumes'
    };
  }
};

// Funciones auxiliares
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Constantes útiles para tipos de archivos
export const FILE_CATEGORIES = {
  BOVINOS: 'bovinos',
  DOCUMENTOS: 'documentos',
  REPORTES: 'reportes',
  PERFILES: 'perfiles',
  EVENTOS: 'eventos',
  INVENTARIO: 'inventario',
  GALERIA: 'galeria',
  GENERAL: 'general'
};

export const FILE_TYPES = {
  IMAGEN: 'imagen',
  DOCUMENTO: 'documento',
  VIDEO: 'video',
  AUDIO: 'audio',
  ARCHIVO: 'archivo'
};

export const IMAGE_FORMATS = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  WEBP: 'image/webp',
  GIF: 'image/gif',
  SVG: 'image/svg+xml'
};

export const DOCUMENT_FORMATS = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS: 'application/vnd.ms-excel',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  TXT: 'text/plain'
};

// Exportaciones por defecto
export default {
  uploadSingleFile,
  uploadMultipleFiles,
  uploadProfileImage,
  uploadDocumentWithOCR,
  getUploadedFiles,
  getFileDetails,
  updateFileMetadata,
  deleteFile,
  generateDownloadUrl,
  resizeImage,
  compressFile,
  getStorageStats,
  cleanupFiles,
  validateFile,
  searchFiles,
  createAlbum,
  getUserAlbums,
  formatFileSize,
  FILE_CATEGORIES,
  FILE_TYPES,
  IMAGE_FORMATS,
  DOCUMENT_FORMATS
};