import { get, post, put, patch, del, upload } from './api';

/**
 * Servicio para gestión de inventario en el sistema de gestión de bovinos
 * Incluye medicamentos, alimentos, equipos, control de stock y vencimientos
 */

/**
 * Obtener lista de productos de inventario con filtros
 * @param {Object} params - Parámetros de búsqueda y filtros
 */
export const getInventoryItems = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      categoria_id = '',
      subcategoria_id = '',
      rancho_id = '',
      almacen_id = '',
      proveedor_id = '',
      estado_stock = '', // disponible, agotado, bajo_stock, vencido
      tipo_producto = '', // medicamento, alimento, equipo, insumo
      stock_min = '',
      stock_max = '',
      fecha_vencimiento_inicio = '',
      fecha_vencimiento_fin = '',
      sortBy = 'nombre',
      sortOrder = 'asc',
      include_movements = false,
      include_supplier = true,
      include_alerts = false,
      show_expired = false
    } = params;

    const queryParams = {
      page,
      limit,
      search,
      categoria_id,
      subcategoria_id,
      rancho_id,
      almacen_id,
      proveedor_id,
      estado_stock,
      tipo_producto,
      stock_min,
      stock_max,
      fecha_vencimiento_inicio,
      fecha_vencimiento_fin,
      sortBy,
      sortOrder,
      include_movements,
      include_supplier,
      include_alerts,
      show_expired
    };

    // Remover parámetros vacíos
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    const response = await get('/inventory/items', queryParams);
    
    return {
      success: response.success,
      data: response.data?.items || [],
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      totalPages: response.data?.totalPages || 1,
      summary: response.data?.summary || {},
      alerts: response.data?.alerts || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: 'Error al cargar inventario'
    };
  }
};

/**
 * Obtener detalles de un producto de inventario específico
 * @param {string} itemId - ID del producto
 * @param {Object} options - Opciones adicionales
 */
export const getInventoryItemById = async (itemId, options = {}) => {
  try {
    const {
      include_movements = true,
      include_supplier = true,
      include_usage_history = true,
      include_alerts = true,
      include_images = true,
      movements_limit = 50
    } = options;

    const response = await get(`/inventory/items/${itemId}`, {
      include_movements,
      include_supplier,
      include_usage_history,
      include_alerts,
      include_images,
      movements_limit
    });
    
    return {
      success: response.success,
      data: response.data || null,
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener producto de inventario:', error);
    return {
      success: false,
      data: null,
      message: 'Error al cargar datos del producto'
    };
  }
};

/**
 * Crear nuevo producto en inventario
 * @param {Object} itemData - Datos del producto
 */
export const createInventoryItem = async (itemData) => {
  try {
    const {
      codigo_producto,
      nombre,
      descripcion,
      categoria_id,
      subcategoria_id,
      tipo_producto,
      unidad_medida,
      stock_actual = 0,
      stock_minimo,
      stock_maximo,
      precio_compra,
      precio_venta,
      proveedor_id,
      almacen_id,
      rancho_id,
      fecha_vencimiento,
      lote,
      numero_serie,
      ubicacion_almacen,
      requiere_receta = false,
      es_controlado = false,
      temperatura_almacenamiento,
      condiciones_almacenamiento,
      observaciones = '',
      imagenes = [],
      documentos = [],
      etiquetas = []
    } = itemData;

    // Preparar datos para envío
    const formData = new FormData();
    
    // Agregar datos básicos
    formData.append('codigo_producto', codigo_producto);
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion || '');
    formData.append('categoria_id', categoria_id);
    formData.append('tipo_producto', tipo_producto);
    formData.append('unidad_medida', unidad_medida);
    formData.append('stock_actual', stock_actual);
    formData.append('stock_minimo', stock_minimo);
    formData.append('precio_compra', precio_compra || 0);
    formData.append('proveedor_id', proveedor_id);
    formData.append('almacen_id', almacen_id);
    formData.append('rancho_id', rancho_id);
    
    // Agregar datos opcionales
    if (subcategoria_id) formData.append('subcategoria_id', subcategoria_id);
    if (stock_maximo) formData.append('stock_maximo', stock_maximo);
    if (precio_venta) formData.append('precio_venta', precio_venta);
    if (fecha_vencimiento) formData.append('fecha_vencimiento', fecha_vencimiento);
    if (lote) formData.append('lote', lote);
    if (numero_serie) formData.append('numero_serie', numero_serie);
    if (ubicacion_almacen) formData.append('ubicacion_almacen', ubicacion_almacen);
    if (temperatura_almacenamiento) formData.append('temperatura_almacenamiento', temperatura_almacenamiento);
    if (condiciones_almacenamiento) formData.append('condiciones_almacenamiento', condiciones_almacenamiento);
    if (observaciones) formData.append('observaciones', observaciones);
    
    // Agregar flags booleanos
    formData.append('requiere_receta', requiere_receta);
    formData.append('es_controlado', es_controlado);
    
    // Agregar arrays como JSON
    if (etiquetas.length > 0) formData.append('etiquetas', JSON.stringify(etiquetas));
    
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

    const response = await upload('/inventory/items', formData);
    
    return {
      success: response.success,
      data: response.data?.item || null,
      message: response.success 
        ? 'Producto agregado al inventario correctamente'
        : response.message || 'Error al agregar producto al inventario'
    };
  } catch (error) {
    console.error('Error al crear producto en inventario:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear producto en inventario'
    };
  }
};

/**
 * Actualizar producto en inventario
 * @param {string} itemId - ID del producto
 * @param {Object} itemData - Datos actualizados
 */
export const updateInventoryItem = async (itemId, itemData) => {
  try {
    const {
      imagenes_nuevas = [],
      imagenes_eliminar = [],
      documentos_nuevos = [],
      documentos_eliminar = [],
      ...updateData
    } = itemData;

    // Si hay archivos nuevos o a eliminar, usar FormData
    if (imagenes_nuevas.length > 0 || imagenes_eliminar.length > 0 || 
        documentos_nuevos.length > 0 || documentos_eliminar.length > 0) {
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
      
      // Agregar archivos nuevos
      imagenes_nuevas.forEach((imagen) => {
        if (imagen instanceof File) {
          formData.append('imagenes_nuevas', imagen);
        }
      });
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

      const response = await upload(`/inventory/items/${itemId}`, formData, {
        method: 'PUT'
      });
      
      return {
        success: response.success,
        data: response.data?.item || null,
        message: response.success 
          ? 'Producto actualizado correctamente'
          : response.message || 'Error al actualizar producto'
      };
    } else {
      // Actualización simple sin archivos
      const response = await put(`/inventory/items/${itemId}`, updateData);
      
      return {
        success: response.success,
        data: response.data?.item || null,
        message: response.success 
          ? 'Producto actualizado correctamente'
          : response.message || 'Error al actualizar producto'
      };
    }
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar producto'
    };
  }
};

/**
 * Eliminar producto del inventario
 * @param {string} itemId - ID del producto
 * @param {string} motivo - Motivo de eliminación
 */
export const deleteInventoryItem = async (itemId, motivo = '') => {
  try {
    const response = await del(`/inventory/items/${itemId}`, {
      data: { motivo }
    });
    
    return {
      success: response.success,
      message: response.success 
        ? 'Producto eliminado del inventario correctamente'
        : response.message || 'Error al eliminar producto'
    };
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al eliminar producto'
    };
  }
};

/**
 * Registrar movimiento de inventario (entrada/salida)
 * @param {Object} movementData - Datos del movimiento
 */
export const registerInventoryMovement = async (movementData) => {
  try {
    const {
      item_id,
      tipo_movimiento, // entrada, salida, ajuste, transferencia
      cantidad,
      motivo,
      descripcion = '',
      precio_unitario = 0,
      proveedor_id = null,
      destino_almacen_id = null,
      bovino_id = null,
      evento_id = null,
      numero_factura = '',
      numero_lote = '',
      fecha_vencimiento = null,
      responsable_id,
      observaciones = '',
      documentos = []
    } = movementData;

    // Preparar datos para envío
    const formData = new FormData();
    
    // Agregar datos básicos
    formData.append('item_id', item_id);
    formData.append('tipo_movimiento', tipo_movimiento);
    formData.append('cantidad', cantidad);
    formData.append('motivo', motivo);
    formData.append('descripcion', descripcion);
    formData.append('precio_unitario', precio_unitario);
    formData.append('responsable_id', responsable_id);
    
    // Agregar datos opcionales
    if (proveedor_id) formData.append('proveedor_id', proveedor_id);
    if (destino_almacen_id) formData.append('destino_almacen_id', destino_almacen_id);
    if (bovino_id) formData.append('bovino_id', bovino_id);
    if (evento_id) formData.append('evento_id', evento_id);
    if (numero_factura) formData.append('numero_factura', numero_factura);
    if (numero_lote) formData.append('numero_lote', numero_lote);
    if (fecha_vencimiento) formData.append('fecha_vencimiento', fecha_vencimiento);
    if (observaciones) formData.append('observaciones', observaciones);
    
    // Agregar documentos
    documentos.forEach((documento) => {
      if (documento instanceof File) {
        formData.append('documentos', documento);
      }
    });

    const response = await upload('/inventory/movements', formData);
    
    return {
      success: response.success,
      data: response.data?.movement || null,
      message: response.success 
        ? 'Movimiento de inventario registrado correctamente'
        : response.message || 'Error al registrar movimiento'
    };
  } catch (error) {
    console.error('Error al registrar movimiento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al registrar movimiento'
    };
  }
};

/**
 * Obtener historial de movimientos de inventario
 * @param {Object} params - Parámetros de filtrado
 */
export const getInventoryMovements = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      item_id = '',
      tipo_movimiento = '',
      fecha_inicio = '',
      fecha_fin = '',
      responsable_id = '',
      proveedor_id = '',
      bovino_id = '',
      sortBy = 'fecha',
      sortOrder = 'desc'
    } = params;

    const response = await get('/inventory/movements', {
      page,
      limit,
      item_id,
      tipo_movimiento,
      fecha_inicio,
      fecha_fin,
      responsable_id,
      proveedor_id,
      bovino_id,
      sortBy,
      sortOrder
    });
    
    return {
      success: response.success,
      data: response.data?.movements || [],
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      totalPages: response.data?.totalPages || 1,
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: 'Error al cargar movimientos de inventario'
    };
  }
};

/**
 * Obtener alertas de inventario
 * @param {Object} params - Parámetros de filtrado
 */
export const getInventoryAlerts = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      tipo_alerta = '', // bajo_stock, sin_stock, proximo_vencimiento, vencido
      prioridad = '', // alta, media, baja
      activo = true
    } = params;

    const response = await get('/inventory/alerts', {
      rancho_id,
      tipo_alerta,
      prioridad,
      activo
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar alertas de inventario'
    };
  }
};

/**
 * Obtener productos próximos a vencer
 * @param {Object} params - Parámetros de filtrado
 */
export const getExpiringItems = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      dias_anticipacion = 30,
      categoria_id = '',
      tipo_producto = ''
    } = params;

    const response = await get('/inventory/expiring', {
      rancho_id,
      dias_anticipacion,
      categoria_id,
      tipo_producto
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener productos próximos a vencer:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar productos próximos a vencer'
    };
  }
};

/**
 * Obtener productos con stock bajo
 * @param {Object} params - Parámetros de filtrado
 */
export const getLowStockItems = async (params = {}) => {
  try {
    const {
      rancho_id = '',
      categoria_id = '',
      tipo_producto = ''
    } = params;

    const response = await get('/inventory/low-stock', {
      rancho_id,
      categoria_id,
      tipo_producto
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar productos con stock bajo'
    };
  }
};

/**
 * Obtener categorías de inventario
 * @param {string} tipoProducto - Tipo de producto (opcional)
 */
export const getInventoryCategories = async (tipoProducto = '') => {
  try {
    const params = tipoProducto ? { tipo_producto: tipoProducto } : {};
    const response = await get('/inventory/categories', params);
    
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
export const getInventorySubcategories = async (categoriaId) => {
  try {
    const response = await get(`/inventory/categories/${categoriaId}/subcategories`);
    
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
 * Obtener proveedores
 */
export const getSuppliers = async () => {
  try {
    const response = await get('/inventory/suppliers');
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar proveedores'
    };
  }
};

/**
 * Crear nuevo proveedor
 * @param {Object} supplierData - Datos del proveedor
 */
export const createSupplier = async (supplierData) => {
  try {
    const response = await post('/inventory/suppliers', supplierData);
    
    return {
      success: response.success,
      data: response.data?.supplier || null,
      message: response.success 
        ? 'Proveedor creado correctamente'
        : response.message || 'Error al crear proveedor'
    };
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear proveedor'
    };
  }
};

/**
 * Obtener almacenes
 * @param {string} ranchoId - ID del rancho (opcional)
 */
export const getWarehouses = async (ranchoId = '') => {
  try {
    const params = ranchoId ? { rancho_id: ranchoId } : {};
    const response = await get('/inventory/warehouses', params);
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener almacenes:', error);
    return {
      success: false,
      data: [],
      message: 'Error al cargar almacenes'
    };
  }
};

/**
 * Obtener estadísticas de inventario
 * @param {Object} filters - Filtros para estadísticas
 */
export const getInventoryStats = async (filters = {}) => {
  try {
    const {
      rancho_id = '',
      fecha_inicio = '',
      fecha_fin = '',
      categoria_id = ''
    } = filters;

    const response = await get('/inventory/stats', {
      rancho_id,
      fecha_inicio,
      fecha_fin,
      categoria_id
    });
    
    return {
      success: response.success,
      data: response.data || {},
      message: response.message
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      success: false,
      data: {},
      message: 'Error al cargar estadísticas de inventario'
    };
  }
};

/**
 * Buscar en inventario
 * @param {string} query - Término de búsqueda
 * @param {Object} filters - Filtros adicionales
 */
export const searchInventory = async (query, filters = {}) => {
  try {
    const response = await get('/inventory/search', {
      q: query,
      ...filters
    });
    
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  } catch (error) {
    console.error('Error en búsqueda de inventario:', error);
    return {
      success: false,
      data: [],
      message: 'Error en la búsqueda'
    };
  }
};

/**
 * Exportar datos de inventario
 * @param {Object} filters - Filtros para exportación
 * @param {string} format - Formato de exportación (csv, excel, pdf)
 * @param {string} reportType - Tipo de reporte (stock, movements, alerts)
 */
export const exportInventoryData = async (filters = {}, format = 'excel', reportType = 'stock') => {
  try {
    const response = await get('/inventory/export', {
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
    console.error('Error al exportar inventario:', error);
    return {
      success: false,
      message: 'Error al exportar datos'
    };
  }
};

/**
 * Realizar inventario físico
 * @param {Object} inventoryData - Datos del inventario físico
 */
export const performPhysicalInventory = async (inventoryData) => {
  try {
    const {
      almacen_id,
      items_contados,
      responsable_id,
      observaciones = '',
      fecha_inventario = new Date().toISOString()
    } = inventoryData;

    const response = await post('/inventory/physical-count', {
      almacen_id,
      items_contados,
      responsable_id,
      observaciones,
      fecha_inventario
    });
    
    return {
      success: response.success,
      data: response.data || null,
      message: response.success 
        ? 'Inventario físico realizado correctamente'
        : response.message || 'Error al realizar inventario físico'
    };
  } catch (error) {
    console.error('Error al realizar inventario físico:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al realizar inventario físico'
    };
  }
};

// Exportaciones por defecto
export default {
  getInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  registerInventoryMovement,
  getInventoryMovements,
  getInventoryAlerts,
  getExpiringItems,
  getLowStockItems,
  getInventoryCategories,
  getInventorySubcategories,
  getSuppliers,
  createSupplier,
  getWarehouses,
  getInventoryStats,
  searchInventory,
  exportInventoryData,
  performPhysicalInventory
};