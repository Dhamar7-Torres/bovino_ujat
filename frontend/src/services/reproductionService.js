import { get, post, put, patch, del, upload } from './api';

/**
 * Servicio para gestión reproductiva en el sistema de gestión de bovinos
 * Incluye inseminación, embarazos, partos, ciclos reproductivos y análisis de fertilidad
 */

/**
 * Obtener registros reproductivos con filtros
 * @param {Object} params - Parámetros de búsqueda y filtros
 */
export const getReproductionRecords = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      bovino_id = '',
      rancho_id = '',
      tipo_servicio = '', // inseminacion_artificial, monta_natural, transferencia_embrion
      resultado = '', // preñada, no_preñada, aborto, parto_exitoso, repetir_servicio
      fecha_inicio = '',
      fecha_fin = '',
      veterinario_id = '',
      toro_padre_id = '',
      estado_gestacion = '', // confirmada, sospechosa, no_confirmada
      sortBy = 'fecha_servicio',
      sortOrder = 'desc',
      include_bovine = true,
      include_sire = true,
      include_location = false,
      include_pregnancy_details = false
    } = params;

    const queryParams = {
      page,
      limit,
      bovino_id,
      rancho_id,
      tipo_servicio,
      resultado,
      fecha_inicio,
      fecha_fin,
      veterinario_id,
      toro_padre_id,
      estado_gestacion,
      sortBy,
      sortOrder,
      include_bovine,
      include_sire,
      include_location,
      include_pregnancy_details
    };

    // Remover parámetros vacíos
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    const response = await get('/reproduction/records', queryParams);
    
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
    console.error('Error al obtener registros reproductivos:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: 'Error al cargar registros reproductivos'
    };
  }
};

/**
 * Obtener detalles de un registro reproductivo específico
 * @param {string} recordId - ID del registro
 */
export const getReproductionRecordById = async (recordId) => {
  try {
    const response = await get(`/reproduction/records/${recordId}`);
    
    return {
      success: response.success,
      data: response.data || null,
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener registro reproductivo:', error);
    return {
      success: false,
      data: null,
      message: 'Error al cargar datos del registro reproductivo'
    };
  }
};

/**
 * Registrar nuevo servicio reproductivo
 * @param {Object} serviceData - Datos del servicio reproductivo
 */
export const recordReproductiveService = async (serviceData) => {
  try {
    const {
      bovino_hembra_id,
      toro_padre_id,
      tipo_servicio, // inseminacion_artificial, monta_natural, transferencia_embrion
      fecha_servicio,
      hora_servicio = null,
      numero_lactancia = 1,
      numero_servicio_lactancia = 1,
      dias_postparto = null,
      veterinario_id = null,
      tecnico_id = null,
      rancho_id,
      ubicacion_latitud = null,
      ubicacion_longitud = null,
      ubicacion_descripcion = '',
      condicion_hembra = '', // celo_natural, celo_inducido, celo_sincronizado
      calidad_celo = '', // excelente, buena, regular, deficiente
      metodo_deteccion_celo = '', // visual, detector_celo, hormonal
      semen_utilizado = '', // Para inseminación artificial
      lote_semen = '',
      pajuela_numero = '',
      dosis_semen = '',
      temperatura_semen = null,
      calidad_semen = '', // excelente, buena, regular
      tecnica_inseminacion = '', // cervical, intrauterina
      dificultad_servicio = 'normal', // facil, normal, dificil
      tiempo_servicio = null, // duración en minutos
      observaciones_servicio = '',
      costo_servicio = 0,
      fecha_revision_gestacion = null,
      imagenes = [],
      documentos = []
    } = serviceData;

    // Preparar datos para envío
    const formData = new FormData();
    
    // Agregar datos básicos
    formData.append('bovino_hembra_id', bovino_hembra_id);
    formData.append('toro_padre_id', toro_padre_id);
    formData.append('tipo_servicio', tipo_servicio);
    formData.append('fecha_servicio', fecha_servicio);
    formData.append('numero_lactancia', numero_lactancia);
    formData.append('numero_servicio_lactancia', numero_servicio_lactancia);
    formData.append('rancho_id', rancho_id);
    formData.append('dificultad_servicio', dificultad_servicio);
    formData.append('costo_servicio', costo_servicio);
    
    // Agregar datos opcionales
    if (hora_servicio) formData.append('hora_servicio', hora_servicio);
    if (dias_postparto) formData.append('dias_postparto', dias_postparto);
    if (veterinario_id) formData.append('veterinario_id', veterinario_id);
    if (tecnico_id) formData.append('tecnico_id', tecnico_id);
    if (ubicacion_latitud) formData.append('ubicacion_latitud', ubicacion_latitud);
    if (ubicacion_longitud) formData.append('ubicacion_longitud', ubicacion_longitud);
    if (ubicacion_descripcion) formData.append('ubicacion_descripcion', ubicacion_descripcion);
    if (condicion_hembra) formData.append('condicion_hembra', condicion_hembra);
    if (calidad_celo) formData.append('calidad_celo', calidad_celo);
    if (metodo_deteccion_celo) formData.append('metodo_deteccion_celo', metodo_deteccion_celo);
    if (semen_utilizado) formData.append('semen_utilizado', semen_utilizado);
    if (lote_semen) formData.append('lote_semen', lote_semen);
    if (pajuela_numero) formData.append('pajuela_numero', pajuela_numero);
    if (dosis_semen) formData.append('dosis_semen', dosis_semen);
    if (temperatura_semen) formData.append('temperatura_semen', temperatura_semen);
    if (calidad_semen) formData.append('calidad_semen', calidad_semen);
    if (tecnica_inseminacion) formData.append('tecnica_inseminacion', tecnica_inseminacion);
    if (tiempo_servicio) formData.append('tiempo_servicio', tiempo_servicio);
    if (observaciones_servicio) formData.append('observaciones_servicio', observaciones_servicio);
    if (fecha_revision_gestacion) formData.append('fecha_revision_gestacion', fecha_revision_gestacion);
    
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

    const response = await upload('/reproduction/services', formData);
    
    return {
      success: response.success,
      data: response.data?.service || null,
      message: response.success 
        ? 'Servicio reproductivo registrado correctamente'
        : response.message || 'Error al registrar servicio reproductivo'
    };
  } catch (error) {
    console.error('Error al registrar servicio reproductivo:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al registrar servicio reproductivo'
    };
  }
};

/**
 * Confirmar gestación
 * @param {string} serviceId - ID del servicio reproductivo
 * @param {Object} pregnancyData - Datos de la gestación
 */
export const confirmPregnancy = async (serviceId, pregnancyData) => {
  try {
    const {
      fecha_confirmacion,
      metodo_confirmacion = 'palpacion', // palpacion, ecografia, analisis_sangre, analisis_leche
      resultado_gestacion = 'preñada', // preñada, no_preñada, dudosa
      dias_gestacion = null,
      fecha_parto_estimada = null,
      numero_fetos = 1,
      condicion_gestacion = 'normal', // normal, riesgo, complicada
      observaciones_confirmacion = '',
      veterinario_confirmacion_id = null,
      costo_confirmacion = 0,
      imagenes_ecografia = []
    } = pregnancyData;

    const formData = new FormData();
    
    // Datos básicos
    formData.append('fecha_confirmacion', fecha_confirmacion);
    formData.append('metodo_confirmacion', metodo_confirmacion);
    formData.append('resultado_gestacion', resultado_gestacion);
    formData.append('numero_fetos', numero_fetos);
    formData.append('condicion_gestacion', condicion_gestacion);
    formData.append('costo_confirmacion', costo_confirmacion);
    
    // Datos opcionales
    if (dias_gestacion) formData.append('dias_gestacion', dias_gestacion);
    if (fecha_parto_estimada) formData.append('fecha_parto_estimada', fecha_parto_estimada);
    if (observaciones_confirmacion) formData.append('observaciones_confirmacion', observaciones_confirmacion);
    if (veterinario_confirmacion_id) formData.append('veterinario_confirmacion_id', veterinario_confirmacion_id);
    
    // Agregar imágenes de ecografía
    imagenes_ecografia.forEach((imagen) => {
      if (imagen instanceof File) {
        formData.append('imagenes_ecografia', imagen);
      }
    });

    const response = await upload(`/reproduction/services/${serviceId}/confirm-pregnancy`, formData);
    
    return {
      success: response.success,
      data: response.data?.pregnancy || null,
      message: response.success 
        ? 'Gestación confirmada correctamente'
        : response.message || 'Error al confirmar gestación'
    };
  } catch (error) {
    console.error('Error al confirmar gestación:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al confirmar gestación'
    };
  }
};

/**
 * Registrar parto
 * @param {string} pregnancyId - ID de la gestación
 * @param {Object} birthData - Datos del parto
 */
export const recordBirth = async (pregnancyId, birthData) => {
  try {
    const {
      fecha_parto,
      hora_parto = null,
      tipo_parto = 'natural', // natural, asistido, cesarea
      duracion_parto = null, // en horas
      dificultad_parto = 'normal', // facil, normal, dificil, distocico
      numero_crias = 1,
      crias_vivas = 1,
      crias_muertas = 0,
      peso_total_crias = null,
      condicion_madre_postparto = 'buena', // excelente, buena, regular, critica
      condicion_placenta = 'expulsada', // expulsada, retenida, parcial
      tiempo_expulsion_placenta = null, // en horas
      veterinario_parto_id = null,
      asistente_parto_id = null,
      ubicacion_latitud = null,
      ubicacion_longitud = null,
      ubicacion_descripcion = '',
      observaciones_parto = '',
      complicaciones = '',
      tratamientos_aplicados = '',
      costo_parto = 0,
      imagenes = [],
      documentos = [],
      crias_detalles = [] // Array con detalles de cada cría
    } = birthData;

    const formData = new FormData();
    
    // Datos básicos
    formData.append('fecha_parto', fecha_parto);
    formData.append('tipo_parto', tipo_parto);
    formData.append('dificultad_parto', dificultad_parto);
    formData.append('numero_crias', numero_crias);
    formData.append('crias_vivas', crias_vivas);
    formData.append('crias_muertas', crias_muertas);
    formData.append('condicion_madre_postparto', condicion_madre_postparto);
    formData.append('condicion_placenta', condicion_placenta);
    formData.append('costo_parto', costo_parto);
    
    // Datos opcionales
    if (hora_parto) formData.append('hora_parto', hora_parto);
    if (duracion_parto) formData.append('duracion_parto', duracion_parto);
    if (peso_total_crias) formData.append('peso_total_crias', peso_total_crias);
    if (tiempo_expulsion_placenta) formData.append('tiempo_expulsion_placenta', tiempo_expulsion_placenta);
    if (veterinario_parto_id) formData.append('veterinario_parto_id', veterinario_parto_id);
    if (asistente_parto_id) formData.append('asistente_parto_id', asistente_parto_id);
    if (ubicacion_latitud) formData.append('ubicacion_latitud', ubicacion_latitud);
    if (ubicacion_longitud) formData.append('ubicacion_longitud', ubicacion_longitud);
    if (ubicacion_descripcion) formData.append('ubicacion_descripcion', ubicacion_descripcion);
    if (observaciones_parto) formData.append('observaciones_parto', observaciones_parto);
    if (complicaciones) formData.append('complicaciones', complicaciones);
    if (tratamientos_aplicados) formData.append('tratamientos_aplicados', tratamientos_aplicados);
    
    // Detalles de crías como JSON
    if (crias_detalles.length > 0) {
      formData.append('crias_detalles', JSON.stringify(crias_detalles));
    }
    
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

    const response = await upload(`/reproduction/pregnancies/${pregnancyId}/birth`, formData);
    
    return {
      success: response.success,
      data: response.data?.birth || null,
      message: response.success 
        ? 'Parto registrado correctamente'
        : response.message || 'Error al registrar parto'
    };
  } catch (error) {
    console.error('Error al registrar parto:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al registrar parto'
    };
  }
};

/**
 * Obtener embarazos activos
 * @param {Object} filters - Filtros para embarazos
 */
export const getActivePregnancies = async (filters = {}) => {
  try {
    const {
      rancho_id = '',
      veterinario_id = '',
      fecha_parto_desde = '',
      fecha_parto_hasta = '',
      condicion_gestacion = '',
      numero_lactancia = '',
      include_details = true,
      sortBy = 'fecha_parto_estimada',
      sortOrder = 'asc'
    } = filters;

    const response = await get('/reproduction/pregnancies/active', {
      rancho_id,
      veterinario_id,
      fecha_parto_desde,
      fecha_parto_hasta,
      condicion_gestacion,
      numero_lactancia,
      include_details,
      sortBy,
      sortOrder
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener embarazos activos:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar embarazos activos'
    };
  }
};

/**
 * Obtener historial reproductivo de una vaca
 * @param {string} bovineId - ID del bovino
 * @param {Object} params - Parámetros adicionales
 */
export const getReproductiveHistory = async (bovineId, params = {}) => {
  try {
    const {
      include_services = true,
      include_pregnancies = true,
      include_births = true,
      include_statistics = true,
      lactancia_numero = null
    } = params;

    const response = await get(`/reproduction/bovines/${bovineId}/history`, {
      include_services,
      include_pregnancies,
      include_births,
      include_statistics,
      lactancia_numero
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener historial reproductivo:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar historial reproductivo'
    };
  }
};

/**
 * Obtener estadísticas reproductivas
 * @param {Object} filters - Filtros para estadísticas
 */
export const getReproductiveStats = async (filters = {}) => {
  try {
    const {
      rancho_id = '',
      fecha_inicio,
      fecha_fin,
      toro_id = '',
      veterinario_id = '',
      tipo_servicio = '',
      agrupacion = 'mes', // mes, trimestre, año
      include_fertility_analysis = true,
      include_seasonal_analysis = false
    } = filters;

    const response = await get('/reproduction/stats', {
      rancho_id,
      fecha_inicio,
      fecha_fin,
      toro_id,
      veterinario_id,
      tipo_servicio,
      agrupacion,
      include_fertility_analysis,
      include_seasonal_analysis
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener estadísticas reproductivas:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar estadísticas reproductivas'
    };
  }
};

/**
 * Obtener alertas reproductivas
 * @param {Object} params - Parámetros de filtrado
 */
export const getReproductiveAlerts = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      tipo_alerta = '', // celo_vencido, revision_gestacion, parto_proximo, postparto_vencido
      prioridad = '', // alta, media, baja
      activo = true,
      dias_anticipacion = 7
    } = params;

    const response = await get('/reproduction/alerts', {
      rancho_id,
      tipo_alerta,
      prioridad,
      activo,
      dias_anticipacion
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener alertas reproductivas:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar alertas reproductivas'
    };
  }
};

/**
 * Programar revisión de gestación
 * @param {string} pregnancyId - ID de la gestación
 * @param {Object} reviewData - Datos de la revisión
 */
export const schedulePregnancyReview = async (pregnancyId, reviewData) => {
  try {
    const {
      fecha_revision,
      tipo_revision = 'seguimiento', // confirmacion, seguimiento, final
      veterinario_id = null,
      observaciones = '',
      recordatorio_dias = 1
    } = reviewData;

    const response = await post(`/reproduction/pregnancies/${pregnancyId}/schedule-review`, {
      fecha_revision,
      tipo_revision,
      veterinario_id,
      observaciones,
      recordatorio_dias
    });
    
    return {
      success: response.success,
      data: response.data?.review || null,
      message: response.success 
        ? 'Revisión programada correctamente'
        : response.message || 'Error al programar revisión'
    };
  } catch (error) {
    console.error('Error al programar revisión:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al programar revisión'
    };
  }
};

/**
 * Obtener toros disponibles para servicio
 * @param {string} ranchoId - ID del rancho
 * @param {Object} filters - Filtros adicionales
 */
export const getAvailableBulls = async (ranchoId, filters = {}) => {
  try {
    const {
      activo = true,
      edad_min = '',
      edad_max = '',
      raza_id = '',
      include_stats = false
    } = filters;

    const response = await get('/reproduction/bulls/available', {
      rancho_id: ranchoId,
      activo,
      edad_min,
      edad_max,
      raza_id,
      include_stats
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener toros disponibles:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar toros disponibles'
    };
  }
};

/**
 * Obtener vacas en celo
 * @param {Object} params - Parámetros de filtrado
 */
export const getCowsInHeat = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      dias_celo = 3, // días para considerar celo activo
      include_history = false,
      raza_id = '',
      edad_min = '',
      edad_max = ''
    } = params;

    const response = await get('/reproduction/cows/in-heat', {
      rancho_id,
      dias_celo,
      include_history,
      raza_id,
      edad_min,
      edad_max
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener vacas en celo:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar vacas en celo'
    };
  }
};

/**
 * Calcular eficiencia reproductiva
 * @param {Object} params - Parámetros para el cálculo
 */
export const calculateReproductiveEfficiency = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      fecha_inicio,
      fecha_fin,
      bovino_id = '',
      toro_id = '',
      incluir_analisis_detallado = true
    } = params;

    const response = await get('/reproduction/efficiency', {
      rancho_id,
      fecha_inicio,
      fecha_fin,
      bovino_id,
      toro_id,
      incluir_analisis_detallado
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al calcular eficiencia reproductiva:', error);
    return {
      success: false,
      data: {},
      message: 'Error al calcular eficiencia reproductiva'
    };
  }
};

/**
 * Obtener calendario reproductivo
 * @param {Object} params - Parámetros del calendario
 */
export const getReproductiveCalendar = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      fecha_inicio,
      fecha_fin,
      incluir_servicios = true,
      incluir_revisiones = true,
      incluir_partos = true,
      incluir_secado = false
    } = params;

    const response = await get('/reproduction/calendar', {
      rancho_id,
      fecha_inicio,
      fecha_fin,
      incluir_servicios,
      incluir_revisiones,
      incluir_partos,
      incluir_secado
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener calendario reproductivo:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar calendario reproductivo'
    };
  }
};

/**
 * Buscar en registros reproductivos
 * @param {string} query - Término de búsqueda
 * @param {Object} filters - Filtros adicionales
 */
export const searchReproductiveRecords = async (query, filters = {}) => {
  try {
    const response = await get('/reproduction/search', {
      q: query,
      ...filters
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error en búsqueda reproductiva:', error);
    return {
      success: false,
      data: [],
      message: 'Error en la búsqueda'
    };
  }
};

/**
 * Exportar datos reproductivos
 * @param {Object} filters - Filtros para exportación
 * @param {string} format - Formato de exportación (csv, excel, pdf)
 * @param {string} reportType - Tipo de reporte (services, pregnancies, births, stats)
 */
export const exportReproductiveData = async (filters = {}, format = 'excel', reportType = 'services') => {
  try {
    const response = await get('/reproduction/export', {
      ...filters,
      format,
      reportType
    }, {
      responseType: 'blob'
    });
    
    return {
      success: response.success,
      data: response.data,
      message: 'Exportación completada'
    };
  } catch (error) {
    console.error('Error al exportar datos reproductivos:', error);
    return {
      success: false,
      message: 'Error al exportar datos'
    };
  }
};

/**
 * Actualizar registro reproductivo
 * @param {string} recordId - ID del registro
 * @param {Object} updateData - Datos actualizados
 */
export const updateReproductiveRecord = async (recordId, updateData) => {
  try {
    const response = await put(`/reproduction/records/${recordId}`, updateData);
    
    return {
      success: response.success,
      data: response.data?.record || null,
      message: response.success 
        ? 'Registro reproductivo actualizado correctamente'
        : response.message || 'Error al actualizar registro'
    };
  } catch (error) {
    console.error('Error al actualizar registro reproductivo:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar registro'
    };
  }
};

/**
 * Eliminar registro reproductivo
 * @param {string} recordId - ID del registro
 * @param {string} motivo - Motivo de eliminación
 */
export const deleteReproductiveRecord = async (recordId, motivo = '') => {
  try {
    const response = await del(`/reproduction/records/${recordId}`, {
      data: { motivo }
    });
    
    return {
      success: response.success,
      message: response.success 
        ? 'Registro reproductivo eliminado correctamente'
        : response.message || 'Error al eliminar registro'
    };
  } catch (error) {
    console.error('Error al eliminar registro reproductivo:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al eliminar registro'
    };
  }
};

// Constantes útiles para reproducción
export const SERVICE_TYPES = {
  INSEMINACION_ARTIFICIAL: 'inseminacion_artificial',
  MONTA_NATURAL: 'monta_natural',
  TRANSFERENCIA_EMBRION: 'transferencia_embrion'
};

export const PREGNANCY_RESULTS = {
  PREÑADA: 'preñada',
  NO_PREÑADA: 'no_preñada',
  DUDOSA: 'dudosa',
  ABORTO: 'aborto',
  REPETIR_SERVICIO: 'repetir_servicio'
};

export const BIRTH_TYPES = {
  NATURAL: 'natural',
  ASISTIDO: 'asistido',
  CESAREA: 'cesarea'
};

export const BIRTH_DIFFICULTIES = {
  FACIL: 'facil',
  NORMAL: 'normal',
  DIFICIL: 'dificil',
  DISTOCICO: 'distocico'
};

export const HEAT_CONDITIONS = {
  CELO_NATURAL: 'celo_natural',
  CELO_INDUCIDO: 'celo_inducido',
  CELO_SINCRONIZADO: 'celo_sincronizado'
};

export const CONFIRMATION_METHODS = {
  PALPACION: 'palpacion',
  ECOGRAFIA: 'ecografia',
  ANALISIS_SANGRE: 'analisis_sangre',
  ANALISIS_LECHE: 'analisis_leche'
};

// Exportaciones por defecto
export default {
  getReproductionRecords,
  getReproductionRecordById,
  recordReproductiveService,
  confirmPregnancy,
  recordBirth,
  getActivePregnancies,
  getReproductiveHistory,
  getReproductiveStats,
  getReproductiveAlerts,
  schedulePregnancyReview,
  getAvailableBulls,
  getCowsInHeat,
  calculateReproductiveEfficiency,
  getReproductiveCalendar,
  searchReproductiveRecords,
  exportReproductiveData,
  updateReproductiveRecord,
  deleteReproductiveRecord,
  SERVICE_TYPES,
  PREGNANCY_RESULTS,
  BIRTH_TYPES,
  BIRTH_DIFFICULTIES,
  HEAT_CONDITIONS,
  CONFIRMATION_METHODS
};