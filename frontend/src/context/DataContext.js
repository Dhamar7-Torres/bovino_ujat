import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

// Importar servicios
import { bovineService } from '../services/bovineService';
import { ranchService } from '../services/ranchService';
import { healthService } from '../services/healthService';
import { productionService } from '../services/productionService';
import { inventoryService } from '../services/inventoryService';
import { eventService } from '../services/eventService';

/**
 * Contexto de datos globales para el sistema de gestión de bovinos
 * Maneja el estado y caché de datos compartidos entre componentes
 */

// Estado inicial del contexto de datos
const initialState = {
  // Datos de catálogos
  catalogs: {
    razas: [],
    sexos: [],
    estados_bovino: [],
    clasificaciones: [],
    tipos_evento: [],
    tipos_produccion: [],
    calidades_produccion: [],
    medicamentos: [],
    vacunas: [],
    categorias_inventario: [],
    estados: [],
    loading: false,
    lastUpdate: null
  },

  // Datos del rancho actual
  currentRanch: {
    data: null,
    loading: false,
    error: null,
    stats: null,
    facilities: [],
    zones: []
  },

  // Resumen de bovinos
  bovines: {
    summary: {
      total: 0,
      por_sexo: {},
      por_raza: {},
      por_estado: {},
      por_clasificacion: {}
    },
    recent: [],
    alerts: [],
    loading: false,
    lastUpdate: null
  },

  // Datos de producción
  production: {
    summary: {
      hoy: 0,
      semana: 0,
      mes: 0,
      promedio_diario: 0
    },
    recent_records: [],
    top_producers: [],
    alerts: [],
    loading: false,
    lastUpdate: null
  },

  // Datos de salud
  health: {
    summary: {
      bovinos_sanos: 0,
      bovinos_enfermos: 0,
      vacunaciones_pendientes: 0,
      tratamientos_activos: 0
    },
    upcoming_vaccinations: [],
    active_treatments: [],
    alerts: [],
    loading: false,
    lastUpdate: null
  },

  // Datos de inventario
  inventory: {
    summary: {
      productos_total: 0,
      stock_bajo: 0,
      productos_vencidos: 0,
      valor_total: 0
    },
    low_stock: [],
    expiring: [],
    alerts: [],
    loading: false,
    lastUpdate: null
  },

  // Eventos próximos
  events: {
    upcoming: [],
    today: [],
    overdue: [],
    loading: false,
    lastUpdate: null
  },

  // Estado de sincronización
  sync: {
    isOnline: navigator.onLine,
    lastSync: null,
    pendingChanges: 0,
    syncing: false
  },

  // Configuración
  settings: {
    autoRefresh: true,
    refreshInterval: 300000, // 5 minutos
    enableNotifications: true,
    defaultRanch: null
  }
};

// Tipos de acciones para el reducer
const DATA_ACTIONS = {
  // Catálogos
  LOAD_CATALOGS_START: 'LOAD_CATALOGS_START',
  LOAD_CATALOGS_SUCCESS: 'LOAD_CATALOGS_SUCCESS',
  LOAD_CATALOGS_FAILURE: 'LOAD_CATALOGS_FAILURE',

  // Rancho actual
  SET_CURRENT_RANCH: 'SET_CURRENT_RANCH',
  LOAD_RANCH_START: 'LOAD_RANCH_START',
  LOAD_RANCH_SUCCESS: 'LOAD_RANCH_SUCCESS',
  LOAD_RANCH_FAILURE: 'LOAD_RANCH_FAILURE',

  // Bovinos
  LOAD_BOVINES_SUMMARY_START: 'LOAD_BOVINES_SUMMARY_START',
  LOAD_BOVINES_SUMMARY_SUCCESS: 'LOAD_BOVINES_SUMMARY_SUCCESS',
  LOAD_BOVINES_SUMMARY_FAILURE: 'LOAD_BOVINES_SUMMARY_FAILURE',

  // Producción
  LOAD_PRODUCTION_SUMMARY_START: 'LOAD_PRODUCTION_SUMMARY_START',
  LOAD_PRODUCTION_SUMMARY_SUCCESS: 'LOAD_PRODUCTION_SUMMARY_SUCCESS',
  LOAD_PRODUCTION_SUMMARY_FAILURE: 'LOAD_PRODUCTION_SUMMARY_FAILURE',

  // Salud
  LOAD_HEALTH_SUMMARY_START: 'LOAD_HEALTH_SUMMARY_START',
  LOAD_HEALTH_SUMMARY_SUCCESS: 'LOAD_HEALTH_SUMMARY_SUCCESS',
  LOAD_HEALTH_SUMMARY_FAILURE: 'LOAD_HEALTH_SUMMARY_FAILURE',

  // Inventario
  LOAD_INVENTORY_SUMMARY_START: 'LOAD_INVENTORY_SUMMARY_START',
  LOAD_INVENTORY_SUMMARY_SUCCESS: 'LOAD_INVENTORY_SUMMARY_SUCCESS',
  LOAD_INVENTORY_SUMMARY_FAILURE: 'LOAD_INVENTORY_SUMMARY_FAILURE',

  // Eventos
  LOAD_EVENTS_START: 'LOAD_EVENTS_START',
  LOAD_EVENTS_SUCCESS: 'LOAD_EVENTS_SUCCESS',
  LOAD_EVENTS_FAILURE: 'LOAD_EVENTS_FAILURE',

  // Sincronización
  SET_ONLINE_STATUS: 'SET_ONLINE_STATUS',
  START_SYNC: 'START_SYNC',
  SYNC_SUCCESS: 'SYNC_SUCCESS',
  SYNC_FAILURE: 'SYNC_FAILURE',

  // Configuración
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',

  // Limpiar datos
  CLEAR_DATA: 'CLEAR_DATA',
  RESET_STATE: 'RESET_STATE'
};

/**
 * Reducer para manejar las acciones del estado de datos
 * @param {Object} state - Estado actual
 * @param {Object} action - Acción a ejecutar
 */
const dataReducer = (state, action) => {
  switch (action.type) {
    // Catálogos
    case DATA_ACTIONS.LOAD_CATALOGS_START:
      return {
        ...state,
        catalogs: {
          ...state.catalogs,
          loading: true
        }
      };

    case DATA_ACTIONS.LOAD_CATALOGS_SUCCESS:
      return {
        ...state,
        catalogs: {
          ...state.catalogs,
          ...action.payload,
          loading: false,
          lastUpdate: Date.now()
        }
      };

    case DATA_ACTIONS.LOAD_CATALOGS_FAILURE:
      return {
        ...state,
        catalogs: {
          ...state.catalogs,
          loading: false
        }
      };

    // Rancho actual
    case DATA_ACTIONS.SET_CURRENT_RANCH:
      return {
        ...state,
        currentRanch: {
          ...state.currentRanch,
          data: action.payload
        },
        settings: {
          ...state.settings,
          defaultRanch: action.payload?.id || null
        }
      };

    case DATA_ACTIONS.LOAD_RANCH_START:
      return {
        ...state,
        currentRanch: {
          ...state.currentRanch,
          loading: true,
          error: null
        }
      };

    case DATA_ACTIONS.LOAD_RANCH_SUCCESS:
      return {
        ...state,
        currentRanch: {
          ...state.currentRanch,
          data: action.payload.ranch,
          stats: action.payload.stats,
          facilities: action.payload.facilities || [],
          zones: action.payload.zones || [],
          loading: false,
          error: null
        }
      };

    case DATA_ACTIONS.LOAD_RANCH_FAILURE:
      return {
        ...state,
        currentRanch: {
          ...state.currentRanch,
          loading: false,
          error: action.payload
        }
      };

    // Bovinos
    case DATA_ACTIONS.LOAD_BOVINES_SUMMARY_START:
      return {
        ...state,
        bovines: {
          ...state.bovines,
          loading: true
        }
      };

    case DATA_ACTIONS.LOAD_BOVINES_SUMMARY_SUCCESS:
      return {
        ...state,
        bovines: {
          ...state.bovines,
          summary: action.payload.summary,
          recent: action.payload.recent || [],
          alerts: action.payload.alerts || [],
          loading: false,
          lastUpdate: Date.now()
        }
      };

    case DATA_ACTIONS.LOAD_BOVINES_SUMMARY_FAILURE:
      return {
        ...state,
        bovines: {
          ...state.bovines,
          loading: false
        }
      };

    // Producción
    case DATA_ACTIONS.LOAD_PRODUCTION_SUMMARY_START:
      return {
        ...state,
        production: {
          ...state.production,
          loading: true
        }
      };

    case DATA_ACTIONS.LOAD_PRODUCTION_SUMMARY_SUCCESS:
      return {
        ...state,
        production: {
          ...state.production,
          summary: action.payload.summary,
          recent_records: action.payload.recent_records || [],
          top_producers: action.payload.top_producers || [],
          alerts: action.payload.alerts || [],
          loading: false,
          lastUpdate: Date.now()
        }
      };

    case DATA_ACTIONS.LOAD_PRODUCTION_SUMMARY_FAILURE:
      return {
        ...state,
        production: {
          ...state.production,
          loading: false
        }
      };

    // Salud
    case DATA_ACTIONS.LOAD_HEALTH_SUMMARY_START:
      return {
        ...state,
        health: {
          ...state.health,
          loading: true
        }
      };

    case DATA_ACTIONS.LOAD_HEALTH_SUMMARY_SUCCESS:
      return {
        ...state,
        health: {
          ...state.health,
          summary: action.payload.summary,
          upcoming_vaccinations: action.payload.upcoming_vaccinations || [],
          active_treatments: action.payload.active_treatments || [],
          alerts: action.payload.alerts || [],
          loading: false,
          lastUpdate: Date.now()
        }
      };

    case DATA_ACTIONS.LOAD_HEALTH_SUMMARY_FAILURE:
      return {
        ...state,
        health: {
          ...state.health,
          loading: false
        }
      };

    // Inventario
    case DATA_ACTIONS.LOAD_INVENTORY_SUMMARY_START:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          loading: true
        }
      };

    case DATA_ACTIONS.LOAD_INVENTORY_SUMMARY_SUCCESS:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          summary: action.payload.summary,
          low_stock: action.payload.low_stock || [],
          expiring: action.payload.expiring || [],
          alerts: action.payload.alerts || [],
          loading: false,
          lastUpdate: Date.now()
        }
      };

    case DATA_ACTIONS.LOAD_INVENTORY_SUMMARY_FAILURE:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          loading: false
        }
      };

    // Eventos
    case DATA_ACTIONS.LOAD_EVENTS_START:
      return {
        ...state,
        events: {
          ...state.events,
          loading: true
        }
      };

    case DATA_ACTIONS.LOAD_EVENTS_SUCCESS:
      return {
        ...state,
        events: {
          ...state.events,
          upcoming: action.payload.upcoming || [],
          today: action.payload.today || [],
          overdue: action.payload.overdue || [],
          loading: false,
          lastUpdate: Date.now()
        }
      };

    case DATA_ACTIONS.LOAD_EVENTS_FAILURE:
      return {
        ...state,
        events: {
          ...state.events,
          loading: false
        }
      };

    // Sincronización
    case DATA_ACTIONS.SET_ONLINE_STATUS:
      return {
        ...state,
        sync: {
          ...state.sync,
          isOnline: action.payload
        }
      };

    case DATA_ACTIONS.START_SYNC:
      return {
        ...state,
        sync: {
          ...state.sync,
          syncing: true
        }
      };

    case DATA_ACTIONS.SYNC_SUCCESS:
      return {
        ...state,
        sync: {
          ...state.sync,
          syncing: false,
          lastSync: Date.now(),
          pendingChanges: 0
        }
      };

    case DATA_ACTIONS.SYNC_FAILURE:
      return {
        ...state,
        sync: {
          ...state.sync,
          syncing: false
        }
      };

    // Configuración
    case DATA_ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };

    // Limpiar datos
    case DATA_ACTIONS.CLEAR_DATA:
      return {
        ...initialState,
        settings: state.settings,
        sync: {
          ...state.sync,
          syncing: false
        }
      };

    case DATA_ACTIONS.RESET_STATE:
      return initialState;

    default:
      return state;
  }
};

// Crear el contexto de datos
const DataContext = createContext(undefined);

/**
 * Proveedor del contexto de datos
 * @param {Object} props - Props del componente
 */
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  /**
   * Cargar catálogos básicos del sistema
   */
  const loadCatalogs = useCallback(async () => {
    try {
      dispatch({ type: DATA_ACTIONS.LOAD_CATALOGS_START });

      const [
        razasRes,
        sexosRes,
        estadosBovinoRes,
        clasificacionesRes,
        tiposEventoRes,
        tiposProduccionRes,
        calidadesRes,
        medicamentosRes,
        vacunasRes,
        categoriasInvRes,
        estadosRes
      ] = await Promise.allSettled([
        bovineService.getRazas(),
        bovineService.getSexos(),
        bovineService.getEstados(),
        bovineService.getClasificaciones(),
        eventService.getEventTypes(),
        productionService.getProductionTypes(),
        productionService.getProductionQualities(),
        healthService.getMedicines(),
        healthService.getVaccines(),
        inventoryService.getInventoryCategories(),
        ranchService.getStates()
      ]);

      const catalogs = {
        razas: razasRes.status === 'fulfilled' ? razasRes.value.data : [],
        sexos: sexosRes.status === 'fulfilled' ? sexosRes.value.data : [],
        estados_bovino: estadosBovinoRes.status === 'fulfilled' ? estadosBovinoRes.value.data : [],
        clasificaciones: clasificacionesRes.status === 'fulfilled' ? clasificacionesRes.value.data : [],
        tipos_evento: tiposEventoRes.status === 'fulfilled' ? tiposEventoRes.value.data : [],
        tipos_produccion: tiposProduccionRes.status === 'fulfilled' ? tiposProduccionRes.value.data : [],
        calidades_produccion: calidadesRes.status === 'fulfilled' ? calidadesRes.value.data : [],
        medicamentos: medicamentosRes.status === 'fulfilled' ? medicamentosRes.value.data : [],
        vacunas: vacunasRes.status === 'fulfilled' ? vacunasRes.value.data : [],
        categorias_inventario: categoriasInvRes.status === 'fulfilled' ? categoriasInvRes.value.data : [],
        estados: estadosRes.status === 'fulfilled' ? estadosRes.value.data : []
      };

      dispatch({
        type: DATA_ACTIONS.LOAD_CATALOGS_SUCCESS,
        payload: catalogs
      });
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
      dispatch({ type: DATA_ACTIONS.LOAD_CATALOGS_FAILURE });
    }
  }, []);

  /**
   * Establecer rancho actual
   * @param {Object} ranch - Datos del rancho
   */
  const setCurrentRanch = useCallback((ranch) => {
    dispatch({
      type: DATA_ACTIONS.SET_CURRENT_RANCH,
      payload: ranch
    });
  }, []);

  /**
   * Cargar datos completos del rancho actual
   * @param {string} ranchId - ID del rancho
   */
  const loadRanchData = useCallback(async (ranchId) => {
    if (!ranchId) return;

    try {
      dispatch({ type: DATA_ACTIONS.LOAD_RANCH_START });

      const [ranchRes, statsRes, facilitiesRes, zonesRes] = await Promise.allSettled([
        ranchService.getRanchById(ranchId),
        ranchService.getRanchStats({ rancho_id: ranchId }),
        ranchService.getRanchFacilities(ranchId),
        // Función hipotética para obtener zonas del rancho
        // ranchService.getRanchZones(ranchId)
        Promise.resolve({ data: [] })
      ]);

      dispatch({
        type: DATA_ACTIONS.LOAD_RANCH_SUCCESS,
        payload: {
          ranch: ranchRes.status === 'fulfilled' ? ranchRes.value.data : null,
          stats: statsRes.status === 'fulfilled' ? statsRes.value.data : null,
          facilities: facilitiesRes.status === 'fulfilled' ? facilitiesRes.value.data : [],
          zones: zonesRes.status === 'fulfilled' ? zonesRes.value.data : []
        }
      });
    } catch (error) {
      console.error('Error al cargar datos del rancho:', error);
      dispatch({
        type: DATA_ACTIONS.LOAD_RANCH_FAILURE,
        payload: 'Error al cargar datos del rancho'
      });
    }
  }, []);

  /**
   * Cargar resumen de bovinos
   * @param {string} ranchId - ID del rancho
   */
  const loadBovinesSummary = useCallback(async (ranchId) => {
    if (!ranchId) return;

    try {
      dispatch({ type: DATA_ACTIONS.LOAD_BOVINES_SUMMARY_START });

      const [statsRes, recentRes] = await Promise.allSettled([
        bovineService.getBovineStats(ranchId),
        bovineService.getBovines({
          rancho_id: ranchId,
          limit: 5,
          sortBy: 'fecha_registro',
          sortOrder: 'desc'
        })
      ]);

      dispatch({
        type: DATA_ACTIONS.LOAD_BOVINES_SUMMARY_SUCCESS,
        payload: {
          summary: statsRes.status === 'fulfilled' ? statsRes.value.data : {},
          recent: recentRes.status === 'fulfilled' ? recentRes.value.data : [],
          alerts: [] // TODO: Implementar alertas de bovinos
        }
      });
    } catch (error) {
      console.error('Error al cargar resumen de bovinos:', error);
      dispatch({ type: DATA_ACTIONS.LOAD_BOVINES_SUMMARY_FAILURE });
    }
  }, []);

  /**
   * Cargar resumen de producción
   * @param {string} ranchId - ID del rancho
   */
  const loadProductionSummary = useCallback(async (ranchId) => {
    if (!ranchId) return;

    try {
      dispatch({ type: DATA_ACTIONS.LOAD_PRODUCTION_SUMMARY_START });

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const [statsRes, recentRes, rankingRes] = await Promise.allSettled([
        productionService.getProductionStats({
          rancho_id: ranchId,
          fecha_inicio: weekAgo,
          fecha_fin: today
        }),
        productionService.getProductionRecords({
          rancho_id: ranchId,
          limit: 10,
          sortBy: 'fecha_produccion',
          sortOrder: 'desc'
        }),
        productionService.getProductionRanking({
          rancho_id: ranchId,
          fecha_inicio: weekAgo,
          fecha_fin: today,
          limit: 5
        })
      ]);

      dispatch({
        type: DATA_ACTIONS.LOAD_PRODUCTION_SUMMARY_SUCCESS,
        payload: {
          summary: statsRes.status === 'fulfilled' ? statsRes.value.data : {},
          recent_records: recentRes.status === 'fulfilled' ? recentRes.value.data : [],
          top_producers: rankingRes.status === 'fulfilled' ? rankingRes.value.data : [],
          alerts: [] // TODO: Implementar alertas de producción
        }
      });
    } catch (error) {
      console.error('Error al cargar resumen de producción:', error);
      dispatch({ type: DATA_ACTIONS.LOAD_PRODUCTION_SUMMARY_FAILURE });
    }
  }, []);

  /**
   * Cargar resumen de salud
   * @param {string} ranchId - ID del rancho
   */
  const loadHealthSummary = useCallback(async (ranchId) => {
    if (!ranchId) return;

    try {
      dispatch({ type: DATA_ACTIONS.LOAD_HEALTH_SUMMARY_START });

      const [statsRes, vaccinationsRes, treatmentsRes, alertsRes] = await Promise.allSettled([
        healthService.getHealthStats({ rancho_id: ranchId }),
        healthService.getVaccinationSchedule({ rancho_id: ranchId, estado: 'pendiente' }),
        healthService.getTreatmentHistory({ rancho_id: ranchId, estado: 'activo' }),
        healthService.getHealthAlerts({ rancho_id: ranchId, activo: true })
      ]);

      dispatch({
        type: DATA_ACTIONS.LOAD_HEALTH_SUMMARY_SUCCESS,
        payload: {
          summary: statsRes.status === 'fulfilled' ? statsRes.value.data : {},
          upcoming_vaccinations: vaccinationsRes.status === 'fulfilled' ? vaccinationsRes.value.data : [],
          active_treatments: treatmentsRes.status === 'fulfilled' ? treatmentsRes.value.data : [],
          alerts: alertsRes.status === 'fulfilled' ? alertsRes.value.data : []
        }
      });
    } catch (error) {
      console.error('Error al cargar resumen de salud:', error);
      dispatch({ type: DATA_ACTIONS.LOAD_HEALTH_SUMMARY_FAILURE });
    }
  }, []);

  /**
   * Cargar resumen de inventario
   * @param {string} ranchId - ID del rancho
   */
  const loadInventorySummary = useCallback(async (ranchId) => {
    if (!ranchId) return;

    try {
      dispatch({ type: DATA_ACTIONS.LOAD_INVENTORY_SUMMARY_START });

      const [statsRes, lowStockRes, expiringRes, alertsRes] = await Promise.allSettled([
        inventoryService.getInventoryStats({ rancho_id: ranchId }),
        inventoryService.getLowStockItems({ rancho_id: ranchId }),
        inventoryService.getExpiringItems({ rancho_id: ranchId }),
        inventoryService.getInventoryAlerts({ rancho_id: ranchId, activo: true })
      ]);

      dispatch({
        type: DATA_ACTIONS.LOAD_INVENTORY_SUMMARY_SUCCESS,
        payload: {
          summary: statsRes.status === 'fulfilled' ? statsRes.value.data : {},
          low_stock: lowStockRes.status === 'fulfilled' ? lowStockRes.value.data : [],
          expiring: expiringRes.status === 'fulfilled' ? expiringRes.value.data : [],
          alerts: alertsRes.status === 'fulfilled' ? alertsRes.value.data : []
        }
      });
    } catch (error) {
      console.error('Error al cargar resumen de inventario:', error);
      dispatch({ type: DATA_ACTIONS.LOAD_INVENTORY_SUMMARY_FAILURE });
    }
  }, []);

  /**
   * Cargar eventos próximos
   * @param {string} ranchId - ID del rancho
   */
  const loadUpcomingEvents = useCallback(async (ranchId) => {
    if (!ranchId) return;

    try {
      dispatch({ type: DATA_ACTIONS.LOAD_EVENTS_START });

      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const [upcomingRes, todayRes, overdueRes] = await Promise.allSettled([
        eventService.getUpcomingEvents({ rancho_id: ranchId, hours_ahead: 168 }), // 7 días
        eventService.getEvents({
          rancho_id: ranchId,
          fecha_inicio: today,
          fecha_fin: today
        }),
        eventService.getOverdueEvents({ rancho_id: ranchId })
      ]);

      dispatch({
        type: DATA_ACTIONS.LOAD_EVENTS_SUCCESS,
        payload: {
          upcoming: upcomingRes.status === 'fulfilled' ? upcomingRes.value.data : [],
          today: todayRes.status === 'fulfilled' ? todayRes.value.data : [],
          overdue: overdueRes.status === 'fulfilled' ? overdueRes.value.data : []
        }
      });
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      dispatch({ type: DATA_ACTIONS.LOAD_EVENTS_FAILURE });
    }
  }, []);

  /**
   * Refrescar todos los datos del dashboard
   * @param {string} ranchId - ID del rancho
   */
  const refreshDashboardData = useCallback(async (ranchId) => {
    if (!ranchId) return;

    await Promise.all([
      loadBovinesSummary(ranchId),
      loadProductionSummary(ranchId),
      loadHealthSummary(ranchId),
      loadInventorySummary(ranchId),
      loadUpcomingEvents(ranchId)
    ]);
  }, [loadBovinesSummary, loadProductionSummary, loadHealthSummary, loadInventorySummary, loadUpcomingEvents]);

  /**
   * Actualizar configuración
   * @param {Object} newSettings - Nueva configuración
   */
  const updateSettings = useCallback((newSettings) => {
    dispatch({
      type: DATA_ACTIONS.UPDATE_SETTINGS,
      payload: newSettings
    });
  }, []);

  /**
   * Limpiar todos los datos
   */
  const clearData = useCallback(() => {
    dispatch({ type: DATA_ACTIONS.CLEAR_DATA });
  }, []);

  /**
   * Manejar cambio de estado de conexión
   */
  const handleOnlineStatusChange = useCallback(() => {
    dispatch({
      type: DATA_ACTIONS.SET_ONLINE_STATUS,
      payload: navigator.onLine
    });
  }, []);

  // Cargar catálogos al inicializar si está autenticado
  useEffect(() => {
    if (isAuthenticated && state.catalogs.lastUpdate === null) {
      loadCatalogs();
    }
  }, [isAuthenticated, loadCatalogs, state.catalogs.lastUpdate]);

  // Configurar auto-refresh cuando hay rancho seleccionado
  useEffect(() => {
    if (!state.settings.autoRefresh || !state.currentRanch.data?.id) {
      return;
    }

    const interval = setInterval(() => {
      refreshDashboardData(state.currentRanch.data.id);
    }, state.settings.refreshInterval);

    return () => clearInterval(interval);
  }, [
    state.settings.autoRefresh,
    state.settings.refreshInterval,
    state.currentRanch.data?.id,
    refreshDashboardData
  ]);

  // Configurar listeners de estado de conexión
  useEffect(() => {
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, [handleOnlineStatusChange]);

  // Limpiar datos cuando el usuario se desconecta
  useEffect(() => {
    if (!isAuthenticated) {
      clearData();
    }
  }, [isAuthenticated, clearData]);

  // Valor del contexto
  const contextValue = {
    // Estado
    ...state,

    // Acciones
    loadCatalogs,
    setCurrentRanch,
    loadRanchData,
    loadBovinesSummary,
    loadProductionSummary,
    loadHealthSummary,
    loadInventorySummary,
    loadUpcomingEvents,
    refreshDashboardData,
    updateSettings,
    clearData,

    // Utilidades
    isDataStale: (lastUpdate, maxAge = 300000) => {
      return !lastUpdate || (Date.now() - lastUpdate) > maxAge;
    },
    
    hasData: (section) => {
      return state[section] && state[section].lastUpdate !== null;
    }
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

/**
 * Hook para usar el contexto de datos
 */
export const useData = () => {
  const context = useContext(DataContext);
  
  if (context === undefined) {
    throw new Error('useData debe ser usado dentro de un DataProvider');
  }
  
  return context;
};

/**
 * Hook para obtener catálogos
 */
export const useCatalogs = () => {
  const { catalogs, loadCatalogs } = useData();
  
  return {
    ...catalogs,
    reload: loadCatalogs
  };
};

/**
 * Hook para obtener el rancho actual
 */
export const useCurrentRanch = () => {
  const { currentRanch, setCurrentRanch, loadRanchData } = useData();
  
  return {
    ...currentRanch,
    setRanch: setCurrentRanch,
    loadData: loadRanchData
  };
};

export default DataContext;