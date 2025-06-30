import { get, post, put, patch, del, upload } from './api';

/**
 * Servicio para gestión de salud veterinaria en el sistema de bovinos
 * Incluye consultas, vacunaciones, tratamientos, historial médico y geolocalización
 */

/**
 * Obtener lista de consultas veterinarias con filtros
 * @param {Object} params - Parámetros de búsqueda y filtros
 */
export const getHealthRecords = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      bovino_id = '',
      rancho_id = '',
      veterinario_id = '',
      tipo_consulta_id = '',
      fecha_inicio = '',
      fecha_fin = '',
      estado = '', // pendiente, completada, cancelada
      prioridad = '', // baja, media, alta, urgente
      diagnostico = '',
      sortBy = 'fecha_consulta',
      sortOrder = 'desc',
      include_location = false,
      include_bovine = true,
      include_treatments = false,
      include_vaccinations = false
    } = params;

    const queryParams = {
      page,
      limit,
      search,
      bovino_id,
      rancho_id,
      veterinario_id,
      tipo_consulta_id,
      fecha_inicio,
      fecha_fin,
      estado,
      prioridad,
      diagnostico,
      sortBy,
      sortOrder,
      include_location,
      include_bovine,
      include_treatments,
      include_vaccinations
    };

    // Remover parámetros vacíos
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    const response = await get('/health/records', queryParams);
    
    return {
      success: response.success,
      data: response.data?.records || [],
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      totalPages: response.data?.totalPages || 1,
      summary: response.data?.summary || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener registros de salud:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: 'Error al cargar registros de salud'
    };
  }
};

/**
 * Obtener detalles de un registro de salud específico
 * @param {string} recordId - ID del registro
 * @param {Object} options - Opciones adicionales
 */
export const getHealthRecordById = async (recordId, options = {}) => {
  try {
    const {
      include_treatments = true,
      include_vaccinations = true,
      include_medications = true,
      include_images = true,
      include_location = true,
      include_follow_ups = true
    } = options;

    const response = await get(`/health/records/${recordId}`, {
      include_treatments,
      include_vaccinations,
      include_medications,
      include_images,
      include_location,
      include_follow_ups
    });
    
    return {
      success: response.success,
      data: response.data || null,
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener registro de salud:', error);
    return {
      success: false,
      data: null,
      message: 'Error al cargar datos del registro de salud'
    };
  }
};

/**
 * Crear nuevo registro de salud
 * @param {Object} healthData - Datos del registro de salud
 */
export const createHealthRecord = async (healthData) => {
  try {
    const {
      bovino_id,
      rancho_id,
      veterinario_id,
      tipo_consulta_id,
      fecha_consulta,
      motivo_consulta,
      sintomas,
      diagnostico,
      tratamiento_recomendado,
      medicamentos = [],
      vacunas = [],
      examenes_realizados = [],
      signos_vitales = {},
      peso_actual,
      temperatura,
      frecuencia_cardiaca,
      frecuencia_respiratoria,
      estado_corporal,
      observaciones = '',
      recomendaciones = '',
      proxima_cita = null,
      costo_consulta = 0,
      ubicacion_latitud,
      ubicacion_longitud,
      ubicacion_descripcion,
      imagenes = [],
      documentos = [],
      prioridad = 'media',
      estado = 'completada'
    } = healthData;

    // Preparar datos para envío
    const formData = new FormData();
    
    // Agregar datos básicos
    formData.append('bovino_id', bovino_id);
    formData.append('rancho_id', rancho_id);
    formData.append('veterinario_id', veterinario_id);
    formData.append('tipo_consulta_id', tipo_consulta_id);
    formData.append('fecha_consulta', fecha_consulta);
    formData.append('motivo_consulta', motivo_consulta);
    formData.append('sintomas', sintomas || '');
    formData.append('diagnostico', diagnostico);
    formData.append('tratamiento_recomendado', tratamiento_recomendado);
    formData.append('prioridad', prioridad);
    formData.append('estado', estado);
    
    // Agregar datos opcionales
    if (peso_actual) formData.append('peso_actual', peso_actual);
    if (temperatura) formData.append('temperatura', temperatura);
    if (frecuencia_cardiaca) formData.append('frecuencia_cardiaca', frecuencia_cardiaca);
    if (frecuencia_respiratoria) formData.append('frecuencia_respiratoria', frecuencia_respiratoria);
    if (estado_corporal) formData.append('estado_corporal', estado_corporal);
    if (observaciones) formData.append('observaciones', observaciones);
    if (recomendaciones) formData.append('recomendaciones', recomendaciones);
    if (proxima_cita) formData.append('proxima_cita', proxima_cita);
    if (costo_consulta) formData.append('costo_consulta', costo_consulta);
    if (ubicacion_latitud) formData.append('ubicacion_latitud', ubicacion_latitud);
    if (ubicacion_longitud) formData.append('ubicacion_longitud', ubicacion_longitud);
    if (ubicacion_descripcion) formData.append('ubicacion_descripcion', ubicacion_descripcion);
    
    // Agregar arrays como JSON
    if (medicamentos.length > 0) formData.append('medicamentos', JSON.stringify(medicamentos));
    if (vacunas.length > 0) formData.append('vacunas', JSON.stringify(vacunas));
    if (examenes_realizados.length > 0) formData.append('examenes_realizados', JSON.stringify(examenes_realizados));
    if (Object.keys(signos_vitales).length > 0) formData.append('signos_vitales', JSON.stringify(signos_vitales));
    
    // Agregar imágenes
    imagenes.forEach((imagen) => {
      if (imagen instanceof File) {
        formData.append('imagenes', imagen);
      }
    });
    
    // Agregar documentos
    documentos.forEach((documento) => {
      if (documento instanceof File) {
        formData.append('documentos', documento);
      }
    });

    const response = await upload('/health/records', formData);
    
    return {
      success: response.success,
      data: response.data?.record || null,
      message: response.success 
        ? 'Registro de salud creado correctamente'
        : response.message || 'Error al crear registro de salud'
    };
  } catch (error) {
    console.error('Error al crear registro de salud:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear registro de salud'
    };
  }
};

/**
 * Actualizar registro de salud existente
 * @param {string} recordId - ID del registro
 * @param {Object} healthData - Datos actualizados
 */
export const updateHealthRecord = async (recordId, healthData) => {
  try {
    const {
      imagenes_nuevas = [],
      imagenes_eliminar = [],
      documentos_nuevos = [],
      documentos_eliminar = [],
      ...updateData
    } = healthData;

    // Si hay archivos nuevos o a eliminar, usar FormData
    if (imagenes_nuevas.length > 0 || imagenes_eliminar.length > 0 || 
        documentos_nuevos.length > 0 || documentos_eliminar.length > 0) {
      const formData = new FormData();
      
      // Agregar todos los campos de actualización
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== null && updateData[key] !== undefined) {
          if (Array.isArray(updateData[key]) || typeof updateData[key] === 'object') {
            formData.append(key, JSON.stringify(updateData[key]));
          } else {
            formData.append(key, updateData[key]);
          }
        }
      });
      
      // Agregar imágenes nuevas
      imagenes_nuevas.forEach((imagen) => {
        if (imagen instanceof File) {
          formData.append('imagenes_nuevas', imagen);
        }
      });
      
      // Agregar documentos nuevos
      documentos_nuevos.forEach((documento) => {
        if (documento instanceof File) {
          formData.append('documentos_nuevos', documento);
        }
      });
      
      // Agregar IDs de archivos a eliminar
      if (imagenes_eliminar.length > 0) {
        formData.append('imagenes_eliminar', JSON.stringify(imagenes_eliminar));
      }
      if (documentos_eliminar.length > 0) {
        formData.append('documentos_eliminar', JSON.stringify(documentos_eliminar));
      }

      const response = await upload(`/health/records/${recordId}`, formData, {
        method: 'PUT'
      });
      
      return {
        success: response.success,
        data: response.data?.record || null,
        message: response.success 
          ? 'Registro de salud actualizado correctamente'
          : response.message || 'Error al actualizar registro de salud'
      };
    } else {
      // Actualización simple sin archivos
      const response = await put(`/health/records/${recordId}`, updateData);
      
      return {
        success: response.success,
        data: response.data?.record || null,
        message: response.success 
          ? 'Registro de salud actualizado correctamente'
          : response.message || 'Error al actualizar registro de salud'
      };
    }
  } catch (error) {
    console.error('Error al actualizar registro de salud:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar registro de salud'
    };
  }
};

/**
 * Eliminar registro de salud
 * @param {string} recordId - ID del registro
 * @param {string} motivo - Motivo de eliminación
 */
export const deleteHealthRecord = async (recordId, motivo = '') => {
  try {
    const response = await del(`/health/records/${recordId}`, {
      data: { motivo }
    });
    
    return {
      success: response.success,
      message: response.success 
        ? 'Registro de salud eliminado correctamente'
        : response.message || 'Error al eliminar registro de salud'
    };
  } catch (error) {
    console.error('Error al eliminar registro de salud:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al eliminar registro de salud'
    };
  }
};

/**
 * Obtener programa de vacunación
 * @param {Object} params - Parámetros de filtrado
 */
export const getVaccinationSchedule = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      bovino_id = '',
      vacuna_id = '',
      fecha_inicio = '',
      fecha_fin = '',
      estado = '', // pendiente, aplicada, vencida
      veterinario_id = '',
      include_location = false
    } = params;

    const response = await get('/health/vaccinations/schedule', {
      rancho_id,
      bovino_id,
      vacuna_id,
      fecha_inicio,
      fecha_fin,
      estado,
      veterinario_id,
      include_location
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener programa de vacunación:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar programa de vacunación'
    };
  }
};

/**
 * Registrar aplicación de vacuna
 * @param {Object} vaccinationData - Datos de la vacunación
 */
export const recordVaccination = async (vaccinationData) => {
  try {
    const {
      bovino_id,
      vacuna_id,
      fecha_aplicacion,
      dosis_aplicada,
      via_administracion,
      lote_vacuna,
      fecha_vencimiento_lote,
      veterinario_id,
      ubicacion_latitud,
      ubicacion_longitud,
      ubicacion_descripcion,
      observaciones = '',
      proxima_dosis = null,
      reacciones_adversas = '',
      costo = 0
    } = vaccinationData;

    const response = await post('/health/vaccinations', {
      bovino_id,
      vacuna_id,
      fecha_aplicacion,
      dosis_aplicada,
      via_administracion,
      lote_vacuna,
      fecha_vencimiento_lote,
      veterinario_id,
      ubicacion_latitud,
      ubicacion_longitud,
      ubicacion_descripcion,
      observaciones,
      proxima_dosis,
      reacciones_adversas,
      costo
    });
    
    return {
      success: response.success,
      data: response.data?.vaccination || null,
      message: response.success 
        ? 'Vacunación registrada correctamente'
        : response.message || 'Error al registrar vacunación'
    };
  } catch (error) {
    console.error('Error al registrar vacunación:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al registrar vacunación'
    };
  }
};

/**
 * Obtener historial de tratamientos
 * @param {Object} params - Parámetros de filtrado
 */
export const getTreatmentHistory = async (params = {}) => {
  try {
    const {
      bovino_id = '',
      rancho_id = '',
      medicamento_id = '',
      fecha_inicio = '',
      fecha_fin = '',
      veterinario_id = '',
      estado = '', // activo, completado, suspendido
      page = 1,
      limit = 20
    } = params;

    const response = await get('/health/treatments', {
      bovino_id,
      rancho_id,
      medicamento_id,
      fecha_inicio,
      fecha_fin,
      veterinario_id,
      estado,
      page,
      limit
    });
    
    return {
      success: response.success,
      data: response.data?.treatments || [],
      total: response.data?.total || 0,
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener historial de tratamientos:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: 'Error al cargar historial de tratamientos'
    };
  }
};

/**
 * Iniciar nuevo tratamiento
 * @param {Object} treatmentData - Datos del tratamiento
 */
export const startTreatment = async (treatmentData) => {
  try {
    const {
      bovino_id,
      medicamento_id,
      diagnostico,
      fecha_inicio,
      duracion_dias,
      dosis,
      frecuencia,
      via_administracion,
      instrucciones,
      veterinario_id,
      observaciones = '',
      costo_total = 0,
      fecha_fin_estimada
    } = treatmentData;

    const response = await post('/health/treatments', {
      bovino_id,
      medicamento_id,
      diagnostico,
      fecha_inicio,
      duracion_dias,
      dosis,
      frecuencia,
      via_administracion,
      instrucciones,
      veterinario_id,
      observaciones,
      costo_total,
      fecha_fin_estimada
    });
    
    return {
      success: response.success,
      data: response.data?.treatment || null,
      message: response.success 
        ? 'Tratamiento iniciado correctamente'
        : response.message || 'Error al iniciar tratamiento'
    };
  } catch (error) {
    console.error('Error al iniciar tratamiento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al iniciar tratamiento'
    };
  }
};

/**
 * Actualizar tratamiento
 * @param {string} treatmentId - ID del tratamiento
 * @param {Object} updateData - Datos de actualización
 */
export const updateTreatment = async (treatmentId, updateData) => {
  try {
    const response = await put(`/health/treatments/${treatmentId}`, updateData);
    
    return {
      success: response.success,
      data: response.data?.treatment || null,
      message: response.success 
        ? 'Tratamiento actualizado correctamente'
        : response.message || 'Error al actualizar tratamiento'
    };
  } catch (error) {
    console.error('Error al actualizar tratamiento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar tratamiento'
    };
  }
};

/**
 * Finalizar tratamiento
 * @param {string} treatmentId - ID del tratamiento
 * @param {Object} completionData - Datos de finalización
 */
export const completeTreatment = async (treatmentId, completionData = {}) => {
  try {
    const {
      fecha_fin = new Date().toISOString(),
      resultado = '',
      observaciones_finales = '',
      efectividad = null
    } = completionData;

    const response = await patch(`/health/treatments/${treatmentId}/complete`, {
      fecha_fin,
      resultado,
      observaciones_finales,
      efectividad
    });
    
    return {
      success: response.success,
      data: response.data?.treatment || null,
      message: response.success 
        ? 'Tratamiento finalizado correctamente'
        : response.message || 'Error al finalizar tratamiento'
    };
  } catch (error) {
    console.error('Error al finalizar tratamiento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al finalizar tratamiento'
    };
  }
};

/**
 * Obtener tipos de consulta disponibles
 */
export const getConsultationTypes = async () => {
  try {
    const response = await get('/health/consultation-types');
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener tipos de consulta:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar tipos de consulta'
    };
  }
};

/**
 * Obtener medicamentos disponibles
 * @param {Object} filters - Filtros de búsqueda
 */
export const getMedicines = async (filters = {}) => {
  try {
    const response = await get('/health/medicines', filters);
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener medicamentos:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar medicamentos'
    };
  }
};

/**
 * Obtener vacunas disponibles
 */
export const getVaccines = async () => {
  try {
    const response = await get('/health/vaccines');
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener vacunas:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar vacunas'
    };
  }
};

/**
 * Obtener estadísticas de salud
 * @param {Object} filters - Filtros para estadísticas
 */
export const getHealthStats = async (filters = {}) => {
  try {
    const {
      rancho_id = '',
      fecha_inicio = '',
      fecha_fin = '',
      agrupacion = 'mes'
    } = filters;

    const response = await get('/health/stats', {
      rancho_id,
      fecha_inicio,
      fecha_fin,
      agrupacion
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener estadísticas de salud:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar estadísticas de salud'
    };
  }
};

/**
 * Obtener alertas de salud
 * @param {Object} params - Parámetros de filtrado
 */
export const getHealthAlerts = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      prioridad = '', // alta, media, baja
      tipo = '', // vacunacion_vencida, tratamiento_pendiente, consulta_urgente
      activo = true
    } = params;

    const response = await get('/health/alerts', {
      rancho_id,
      prioridad,
      tipo,
      activo
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener alertas de salud:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar alertas de salud'
    };
  }
};

/**
 * Buscar en registros de salud
 * @param {string} query - Término de búsqueda
 * @param {Object} filters - Filtros adicionales
 */
export const searchHealthRecords = async (query, filters = {}) => {
  try {
    const response = await get('/health/search', {
      q: query,
      ...filters
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error en búsqueda de registros de salud:', error);
    return {
      success: false,
      data: [],
      message: 'Error en la búsqueda'
    };
  }
};

/**
 * Exportar datos de salud
 * @param {Object} filters - Filtros para exportación
 * @param {string} format - Formato de exportación (csv, excel, pdf)
 */
export const exportHealthData = async (filters = {}, format = 'excel') => {
  try {
    const response = await get('/health/export', {
      ...filters,
      format
    }, {
      responseType: 'blob'
    });
    
    return {
      success: response.success,
      data: response.data,
      message: 'Exportación completada'
    };
  } catch (error) {
    console.error('Error al exportar datos de salud:', error);
    return {
      success: false,
      message: 'Error al exportar datos'
    };
  }
};

// Exportaciones por defecto
export default {
  getHealthRecords,
  getHealthRecordById,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  getVaccinationSchedule,
  recordVaccination,
  getTreatmentHistory,
  startTreatment,
  updateTreatment,
  completeTreatment,
  getConsultationTypes,
  getMedicines,
  getVaccines,
  getHealthStats,
  getHealthAlerts,
  searchHealthRecords,
  exportHealthData
};