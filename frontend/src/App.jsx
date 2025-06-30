/**
 * App.jsx - Componente principal de la aplicación de gestión de bovinos
 * Configuración de providers globales, routing y layout principal del sistema
 */

import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DataProvider } from './context/DataContext';

// Layout Components
import Layout from './components/common/Layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import Loading from './components/common/Loading/Loading';

// Pages - Lazy loading para optimización
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Bovines = React.lazy(() => import('./pages/bovines/Bovines'));
const BovineDetail = React.lazy(() => import('./pages/bovines/BovineDetail'));
const BovineForm = React.lazy(() => import('./pages/bovines/BovineForm'));
const Health = React.lazy(() => import('./pages/health/Health'));
const HealthRecord = React.lazy(() => import('./pages/health/HealthRecord'));
const VaccineSchedule = React.lazy(() => import('./pages/health/VaccineSchedule'));
const Production = React.lazy(() => import('./pages/production/Production'));
const MilkProduction = React.lazy(() => import('./pages/production/MilkProduction'));
const Breeding = React.lazy(() => import('./pages/breeding/Breeding'));
const BreedingRecord = React.lazy(() => import('./pages/breeding/BreedingRecord'));
const Inventory = React.lazy(() => import('./pages/inventory/Inventory'));
const InventoryItem = React.lazy(() => import('./pages/inventory/InventoryItem'));
const Finance = React.lazy(() => import('./pages/finance/Finance'));
const FinanceRecord = React.lazy(() => import('./pages/finance/FinanceRecord'));
const Reports = React.lazy(() => import('./pages/reports/Reports'));
const CustomReports = React.lazy(() => import('./pages/reports/CustomReports'));
const Calendar = React.lazy(() => import('./pages/calendar/Calendar'));
const Location = React.lazy(() => import('./pages/location/Location'));
const Profile = React.lazy(() => import('./pages/settings/Profile'));
const RanchSettings = React.lazy(() => import('./pages/settings/RanchSettings'));
const UserManagement = React.lazy(() => import('./pages/settings/UserManagement'));
const SystemSettings = React.lazy(() => import('./pages/settings/SystemSettings'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword'));
const NotFound = React.lazy(() => import('./pages/404'));

// Hooks personalizados
import { useAuth } from './hooks/useAuth';

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configuración de caché y retry para la aplicación ganadera
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 30, // 30 minutos
      retry: (failureCount, error) => {
        // No reintentar en errores de autenticación
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        // Máximo 3 reintentos para otros errores
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      // Configuración para mutations críticas del sistema ganadero
      retry: 1,
      onError: (error) => {
        console.error('Error en mutation:', error);
      },
    },
  },
});

/**
 * Componente de rutas protegidas
 * Verifica autenticación antes de permitir acceso a rutas privadas
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <Loading fullScreen message="Verificando autenticación..." />;
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Componente de rutas públicas
 * Redirige a dashboard si ya está autenticado
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <Loading fullScreen message="Verificando autenticación..." />;
  }

  // Redirigir a dashboard si ya está autenticado
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * Componente principal de la aplicación
 * Configuración de providers, routing y manejo de errores globales
 */
const App = () => {
  
  // Effect para configuración inicial de la aplicación
  useEffect(() => {
    // Configurar título dinámico de la aplicación
    document.title = 'Sistema de Gestión de Bovinos';
    
    // Configurar meta tags dinámicos
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Sistema integral para la gestión de bovinos, salud, producción y finanzas del rancho'
      );
    }

    // Configurar theme-color dinámico
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#3B82F6');
    }

    // Event listener para manejo de errores no capturados
    const handleUnhandledError = (event) => {
      console.error('Error no manejado:', event.error);
      // Aquí se podría enviar el error a un servicio de logging
    };

    // Event listener para promesas rechazadas no manejadas
    const handleUnhandledRejection = (event) => {
      console.error('Promise rechazada no manejada:', event.reason);
      // Aquí se podría enviar el error a un servicio de logging
    };

    // Agregar event listeners
    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup function
    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <NotificationProvider>
                <DataProvider>
                  <Router>
                    <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                      <AnimatePresence mode="wait">
                        <Routes>
                          {/* Rutas públicas - Autenticación */}
                          <Route 
                            path="/login" 
                            element={
                              <PublicRoute>
                                <Suspense fallback={<Loading fullScreen message="Cargando login..." />}>
                                  <Login />
                                </Suspense>
                              </PublicRoute>
                            } 
                          />
                          <Route 
                            path="/register" 
                            element={
                              <PublicRoute>
                                <Suspense fallback={<Loading fullScreen message="Cargando registro..." />}>
                                  <Register />
                                </Suspense>
                              </PublicRoute>
                            } 
                          />
                          <Route 
                            path="/forgot-password" 
                            element={
                              <PublicRoute>
                                <Suspense fallback={<Loading fullScreen message="Cargando recuperación..." />}>
                                  <ForgotPassword />
                                </Suspense>
                              </PublicRoute>
                            } 
                          />

                          {/* Rutas protegidas - Aplicación principal */}
                          <Route 
                            path="/*" 
                            element={
                              <ProtectedRoute>
                                <Layout>
                                  <Suspense fallback={<Loading message="Cargando página..." />}>
                                    <Routes>
                                      {/* Dashboard principal */}
                                      <Route index element={<Dashboard />} />
                                      
                                      {/* Gestión de bovinos */}
                                      <Route path="bovines" element={<Bovines />} />
                                      <Route path="bovines/new" element={<BovineForm />} />
                                      <Route path="bovines/:id" element={<BovineDetail />} />
                                      <Route path="bovines/:id/edit" element={<BovineForm />} />
                                      
                                      {/* Gestión de salud */}
                                      <Route path="health" element={<Health />} />
                                      <Route path="health/record" element={<HealthRecord />} />
                                      <Route path="health/vaccines" element={<VaccineSchedule />} />
                                      
                                      {/* Gestión de producción */}
                                      <Route path="production" element={<Production />} />
                                      <Route path="production/milk" element={<MilkProduction />} />
                                      
                                      {/* Gestión de reproducción */}
                                      <Route path="breeding" element={<Breeding />} />
                                      <Route path="breeding/record" element={<BreedingRecord />} />
                                      
                                      {/* Gestión de inventario */}
                                      <Route path="inventory" element={<Inventory />} />
                                      <Route path="inventory/:id" element={<InventoryItem />} />
                                      
                                      {/* Gestión financiera */}
                                      <Route path="finance" element={<Finance />} />
                                      <Route path="finance/record" element={<FinanceRecord />} />
                                      
                                      {/* Reportes */}
                                      <Route path="reports" element={<Reports />} />
                                      <Route path="reports/custom" element={<CustomReports />} />
                                      
                                      {/* Calendario y ubicación */}
                                      <Route path="calendar" element={<Calendar />} />
                                      <Route path="location" element={<Location />} />
                                      
                                      {/* Configuraciones */}
                                      <Route path="settings">
                                        <Route path="profile" element={<Profile />} />
                                        <Route path="ranch" element={<RanchSettings />} />
                                        <Route path="users" element={<UserManagement />} />
                                        <Route path="system" element={<SystemSettings />} />
                                      </Route>
                                      
                                      {/* Página 404 para rutas no encontradas */}
                                      <Route path="*" element={<NotFound />} />
                                    </Routes>
                                  </Suspense>
                                </Layout>
                              </ProtectedRoute>
                            } 
                          />
                        </Routes>
                      </AnimatePresence>

                      {/* Toaster para notificaciones globales */}
                      <Toaster
                        position="top-right"
                        reverseOrder={false}
                        gutter={8}
                        containerClassName=""
                        containerStyle={{}}
                        toastOptions={{
                          // Configuración de toast para el sistema ganadero
                          className: '',
                          duration: 4000,
                          style: {
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-primary)',
                            borderRadius: 'var(--radius-lg)',
                            fontSize: '14px',
                            fontFamily: 'var(--font-family-sans)',
                            boxShadow: 'var(--shadow-md)',
                          },
                          success: {
                            duration: 3000,
                            iconTheme: {
                              primary: 'var(--color-success-500)',
                              secondary: 'white',
                            },
                          },
                          error: {
                            duration: 5000,
                            iconTheme: {
                              primary: 'var(--color-error-500)',
                              secondary: 'white',
                            },
                          },
                          loading: {
                            duration: Infinity,
                          },
                        }}
                      />
                    </div>
                  </Router>
                </DataProvider>
              </NotificationProvider>
            </AuthProvider>
          </ThemeProvider>

          {/* React Query DevTools - Solo en desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools 
              initialIsOpen={false} 
              position="bottom-right"
              toggleButtonProps={{
                style: {
                  marginLeft: '5px',
                  transform: 'none',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-lg)',
                }
              }}
            />
          )}
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;