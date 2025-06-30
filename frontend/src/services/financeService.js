import { get, post, put, patch, del, upload } from './api';

/**
 * Servicio para gestión financiera del sistema de gestión de bovinos
 * Incluye ingresos, gastos, presupuestos, análisis de rentabilidad y reportes
 */

/**
 * Obtener lista de transacciones financieras con filtros
 * @param {Object} params - Parámetros de búsqueda y filtros
 */
export const getTransactions = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      tipo = '', // ingreso, gasto
      categoria_id = '',
      subcategoria_id = '',
      rancho_id = '',
      bovino_id = '',
      fecha_inicio = '',
      fecha_fin = '',
      monto_min = '',
      monto_max = '',
      metodo_pago = '',
      estado = '', // pendiente, pagado, cancelado
      sortBy = 'fecha',
      sortOrder = 'desc',
      include_bovine = false,
      include_documents = false
    } = params;

    const queryParams = {
      page,
      limit,
      search,
      tipo,
      categoria_id,
      subcategoria_id,
      rancho_id,
      bovino_id,
      fecha_inicio,
      fecha_fin,
      monto_min,
      monto_max,
      metodo_pago,
      estado,
      sortBy,
      sortOrder,
      include_bovine,
      include_documents
    };

    // Remover parámetros vacíos
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    const response = await get('/finances/transactions', queryParams);
    
    return {
      success: response.success,
      data: response.data?.transactions || [],
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      totalPages: response.data?.totalPages || 1,
      summary: response.data?.summary || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: 'Error al cargar transacciones financieras'
    };
  }
};

/**
 * Obtener detalles de una transacción específica
 * @param {string} transactionId - ID de la transacción
 */
export const getTransactionById = async (transactionId) => {
  try {
    const response = await get(`/finances/transactions/${transactionId}`);
    
    return {
      success: response.success,
      data: response.data || null,
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener transacción:', error);
    return {
      success: false,
      data: null,
      message: 'Error al cargar datos de la transacción'
    };
  }
};

/**
 * Crear nueva transacción financiera
 * @param {Object} transactionData - Datos de la transacción
 */
export const createTransaction = async (transactionData) => {
  try {
    const {
      tipo, // ingreso, gasto
      concepto,
      descripcion,
      monto,
      fecha,
      categoria_id,
      subcategoria_id,
      rancho_id,
      bovino_id,
      metodo_pago, // efectivo, transferencia, cheque, tarjeta
      numero_factura,
      numero_recibo,
      proveedor_cliente,
      estado = 'pagado',
      notas = '',
      documentos = [],
      etiquetas = [],
      es_recurrente = false,
      frecuencia_recurrencia = null,
      fecha_fin_recurrencia = null
    } = transactionData;

    // Preparar datos para envío
    const formData = new FormData();
    
    // Agregar datos básicos
    formData.append('tipo', tipo);
    formData.append('concepto', concepto);
    formData.append('descripcion', descripcion || '');
    formData.append('monto', monto);
    formData.append('fecha', fecha);
    formData.append('categoria_id', categoria_id);
    formData.append('rancho_id', rancho_id);
    formData.append('metodo_pago', metodo_pago);
    formData.append('estado', estado);
    
    // Agregar datos opcionales
    if (subcategoria_id) formData.append('subcategoria_id', subcategoria_id);
    if (bovino_id) formData.append('bovino_id', bovino_id);
    if (numero_factura) formData.append('numero_factura', numero_factura);
    if (numero_recibo) formData.append('numero_recibo', numero_recibo);
    if (proveedor_cliente) formData.append('proveedor_cliente', proveedor_cliente);
    if (notas) formData.append('notas', notas);
    
    // Agregar arrays como JSON
    if (etiquetas.length > 0) formData.append('etiquetas', JSON.stringify(etiquetas));
    
    // Datos de recurrencia
    if (es_recurrente) {
      formData.append('es_recurrente', es_recurrente);
      if (frecuencia_recurrencia) formData.append('frecuencia_recurrencia', frecuencia_recurrencia);
      if (fecha_fin_recurrencia) formData.append('fecha_fin_recurrencia', fecha_fin_recurrencia);
    }
    
    // Agregar documentos
    documentos.forEach((documento) => {
      if (documento instanceof File) {
        formData.append('documentos', documento);
      }
    });

    const response = await upload('/finances/transactions', formData);
    
    return {
      success: response.success,
      data: response.data?.transaction || null,
      message: response.success 
        ? 'Transacción registrada correctamente'
        : response.message || 'Error al registrar transacción'
    };
  } catch (error) {
    console.error('Error al crear transacción:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al registrar transacción'
    };
  }
};

/**
 * Actualizar transacción existente
 * @param {string} transactionId - ID de la transacción
 * @param {Object} transactionData - Datos actualizados
 */
export const updateTransaction = async (transactionId, transactionData) => {
  try {
    const {
      documentos_nuevos = [],
      documentos_eliminar = [],
      ...updateData
    } = transactionData;

    // Si hay documentos nuevos o a eliminar, usar FormData
    if (documentos_nuevos.length > 0 || documentos_eliminar.length > 0) {
      const formData = new FormData();
      
      // Agregar todos los campos de actualización
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== null && updateData[key] !== undefined) {
          if (Array.isArray(updateData[key])) {
            formData.append(key, JSON.stringify(updateData[key]));
          } else {
            formData.append(key, updateData[key]);
          }
        }
      });
      
      // Agregar documentos nuevos
      documentos_nuevos.forEach((documento) => {
        if (documento instanceof File) {
          formData.append('documentos_nuevos', documento);
        }
      });
      
      // Agregar IDs de documentos a eliminar
      if (documentos_eliminar.length > 0) {
        formData.append('documentos_eliminar', JSON.stringify(documentos_eliminar));
      }

      const response = await upload(`/finances/transactions/${transactionId}`, formData, {
        method: 'PUT'
      });
      
      return {
        success: response.success,
        data: response.data?.transaction || null,
        message: response.success 
          ? 'Transacción actualizada correctamente'
          : response.message || 'Error al actualizar transacción'
      };
    } else {
      // Actualización simple sin documentos
      const response = await put(`/finances/transactions/${transactionId}`, updateData);
      
      return {
        success: response.success,
        data: response.data?.transaction || null,
        message: response.success 
          ? 'Transacción actualizada correctamente'
          : response.message || 'Error al actualizar transacción'
      };
    }
  } catch (error) {
    console.error('Error al actualizar transacción:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar transacción'
    };
  }
};

/**
 * Eliminar transacción
 * @param {string} transactionId - ID de la transacción
 * @param {string} motivo - Motivo de eliminación
 */
export const deleteTransaction = async (transactionId, motivo = '') => {
  try {
    const response = await del(`/finances/transactions/${transactionId}`, {
      data: { motivo }
    });
    
    return {
      success: response.success,
      message: response.success 
        ? 'Transacción eliminada correctamente'
        : response.message || 'Error al eliminar transacción'
    };
  } catch (error) {
    console.error('Error al eliminar transacción:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al eliminar transacción'
    };
  }
};

/**
 * Obtener categorías financieras
 * @param {string} tipo - Tipo de categoría (ingreso, gasto, ambos)
 */
export const getCategories = async (tipo = 'ambos') => {
  try {
    const response = await get('/finances/categories', { tipo });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar categorías'
    };
  }
};

/**
 * Obtener subcategorías por categoría
 * @param {string} categoriaId - ID de la categoría
 */
export const getSubcategories = async (categoriaId) => {
  try {
    const response = await get(`/finances/categories/${categoriaId}/subcategories`);
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener subcategorías:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar subcategorías'
    };
  }
};

/**
 * Obtener resumen financiero
 * @param {Object} filters - Filtros para el resumen
 */
export const getFinancialSummary = async (filters = {}) => {
  try {
    const {
      fecha_inicio = '',
      fecha_fin = '',
      rancho_id = '',
      periodo = 'mes' // dia, semana, mes, año
    } = filters;

    const response = await get('/finances/summary', {
      fecha_inicio,
      fecha_fin,
      rancho_id,
      periodo
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener resumen financiero:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar resumen financiero'
    };
  }
};

/**
 * Obtener flujo de caja
 * @param {Object} params - Parámetros para el flujo de caja
 */
export const getCashFlow = async (params = {}) => {
  try {
    const {
      fecha_inicio,
      fecha_fin,
      rancho_id = '',
      agrupacion = 'mes' // dia, semana, mes
    } = params;

    const response = await get('/finances/cash-flow', {
      fecha_inicio,
      fecha_fin,
      rancho_id,
      agrupacion
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener flujo de caja:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar flujo de caja'
    };
  }
};

/**
 * Obtener análisis de rentabilidad
 * @param {Object} params - Parámetros para análisis
 */
export const getProfitabilityAnalysis = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      bovino_id = '',
      fecha_inicio,
      fecha_fin,
      include_projections = false
    } = params;

    const response = await get('/finances/profitability', {
      rancho_id,
      bovino_id,
      fecha_inicio,
      fecha_fin,
      include_projections
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener análisis de rentabilidad:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar análisis de rentabilidad'
    };
  }
};

/**
 * Obtener costos por bovino
 * @param {Object} params - Parámetros de filtrado
 */
export const getCostPerBovine = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      raza_id = '',
      clasificacion_id = '',
      fecha_inicio,
      fecha_fin,
      include_depreciation = true
    } = params;

    const response = await get('/finances/cost-per-bovine', {
      rancho_id,
      raza_id,
      clasificacion_id,
      fecha_inicio,
      fecha_fin,
      include_depreciation
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener costos por bovino:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar costos por bovino'
    };
  }
};

/**
 * Obtener presupuestos
 * @param {Object} params - Parámetros de filtrado
 */
export const getBudgets = async (params = {}) => {
  try {
    const {
      año = new Date().getFullYear(),
      rancho_id = '',
      categoria_id = '',
      activo = true
    } = params;

    const response = await get('/finances/budgets', {
      año,
      rancho_id,
      categoria_id,
      activo
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener presupuestos:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar presupuestos'
    };
  }
};

/**
 * Crear nuevo presupuesto
 * @param {Object} budgetData - Datos del presupuesto
 */
export const createBudget = async (budgetData) => {
  try {
    const response = await post('/finances/budgets', budgetData);
    
    return {
      success: response.success,
      data: response.data?.budget || null,
      message: response.success 
        ? 'Presupuesto creado correctamente'
        : response.message || 'Error al crear presupuesto'
    };
  } catch (error) {
    console.error('Error al crear presupuesto:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear presupuesto'
    };
  }
};

/**
 * Actualizar presupuesto
 * @param {string} budgetId - ID del presupuesto
 * @param {Object} budgetData - Datos actualizados
 */
export const updateBudget = async (budgetId, budgetData) => {
  try {
    const response = await put(`/finances/budgets/${budgetId}`, budgetData);
    
    return {
      success: response.success,
      data: response.data?.budget || null,
      message: response.success 
        ? 'Presupuesto actualizado correctamente'
        : response.message || 'Error al actualizar presupuesto'
    };
  } catch (error) {
    console.error('Error al actualizar presupuesto:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar presupuesto'
    };
  }
};

/**
 * Obtener comparación presupuesto vs real
 * @param {Object} params - Parámetros de comparación
 */
export const getBudgetComparison = async (params = {}) => {
  try {
    const {
      budget_id,
      rancho_id = '',
      fecha_inicio,
      fecha_fin
    } = params;

    const response = await get('/finances/budget-comparison', {
      budget_id,
      rancho_id,
      fecha_inicio,
      fecha_fin
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener comparación de presupuesto:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar comparación de presupuesto'
    };
  }
};

/**
 * Obtener reportes financieros predefinidos
 * @param {string} reportType - Tipo de reporte
 * @param {Object} params - Parámetros del reporte
 */
export const getFinancialReport = async (reportType, params = {}) => {
  try {
    const response = await get(`/finances/reports/${reportType}`, params);
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener reporte financiero:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar reporte financiero'
    };
  }
};

/**
 * Exportar datos financieros
 * @param {Object} filters - Filtros para exportación
 * @param {string} format - Formato de exportación (csv, excel, pdf)
 * @param {string} reportType - Tipo de reporte a exportar
 */
export const exportFinancialData = async (filters = {}, format = 'excel', reportType = 'transactions') => {
  try {
    const response = await get('/finances/export', {
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
    console.error('Error al exportar datos financieros:', error);
    return {
      success: false,
      message: 'Error al exportar datos'
    };
  }
};

/**
 * Obtener proyecciones financieras
 * @param {Object} params - Parámetros para proyecciones
 */
export const getFinancialProjections = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      meses_adelante = 12,
      incluir_estacionalidad = true,
      base_datos_historicos = 24 // meses
    } = params;

    const response = await get('/finances/projections', {
      rancho_id,
      meses_adelante,
      incluir_estacionalidad,
      base_datos_historicos
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener proyecciones financieras:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar proyecciones financieras'
    };
  }
};

/**
 * Buscar transacciones
 * @param {string} query - Término de búsqueda
 * @param {Object} filters - Filtros adicionales
 */
export const searchTransactions = async (query, filters = {}) => {
  try {
    const response = await get('/finances/search', {
      q: query,
      ...filters
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error en búsqueda de transacciones:', error);
    return {
      success: false,
      data: [],
      message: 'Error en la búsqueda'
    };
  }
};

// Exportaciones por defecto
export default {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
  getSubcategories,
  getFinancialSummary,
  getCashFlow,
  getProfitabilityAnalysis,
  getCostPerBovine,
  getBudgets,
  createBudget,
  updateBudget,
  getBudgetComparison,
  getFinancialReport,
  exportFinancialData,
  getFinancialProjections,
  searchTransactions
};