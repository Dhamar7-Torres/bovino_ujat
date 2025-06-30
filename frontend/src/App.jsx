/**
 * App.jsx - Componente principal de la aplicación de gestión de bovinos
 * Versión corregida con rutas básicas funcionales
 */

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DataProvider } from './context/DataContext';

// Layout Components
import Layout from './components/common/Layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import Loading from './components/common/Loading/Loading';

// Pages - Solo las que existen
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// Componente simple para páginas que aún no existen
const ComingSoon = ({ pageName }) => (
  <div className="min-h-96 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
        <span className="text-2xl">🚧</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {pageName}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Esta página está en desarrollo y estará disponible pronto.
      </p>
      <button
        onClick={() => window.history.back()}
        className="btn-primary"
      >
        Volver
      </button>
    </div>
  </div>
);

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    },
    mutations: {
      retry: 1
    }
  }
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <DataProvider>
              <NotificationProvider>
                <Router>
                  <Layout>
                    <Suspense fallback={
                      <div className="min-h-96 flex items-center justify-center">
                        <Loading 
                          message="Cargando página..." 
                          type="bovines"
                          size="large"
                          variant="thematic"
                        />
                      </div>
                    }>
                      <Routes>
                        {/* Ruta principal - Dashboard */}
                        <Route index element={<Dashboard />} />
                        
                        {/* Rutas de bovinos */}
                        <Route path="bovines" element={<ComingSoon pageName="Gestión de Bovinos" />} />
                        <Route path="bovines/new" element={<ComingSoon pageName="Agregar Bovino" />} />
                        <Route path="bovines/:id" element={<ComingSoon pageName="Detalle de Bovino" />} />
                        <Route path="bovines/:id/edit" element={<ComingSoon pageName="Editar Bovino" />} />
                        
                        {/* Rutas de salud */}
                        <Route path="health" element={<ComingSoon pageName="Control Sanitario" />} />
                        <Route path="health/record" element={<ComingSoon pageName="Registro de Salud" />} />
                        <Route path="health/vaccines" element={<ComingSoon pageName="Vacunación" />} />
                        <Route path="health/alerts" element={<ComingSoon pageName="Alertas de Salud" />} />
                        
                        {/* Rutas de producción */}
                        <Route path="production" element={<ComingSoon pageName="Producción" />} />
                        <Route path="production/milk" element={<ComingSoon pageName="Producción Lechera" />} />
                        <Route path="production/record" element={<ComingSoon pageName="Registro de Producción" />} />
                        
                        {/* Rutas de reproducción */}
                        <Route path="breeding" element={<ComingSoon pageName="Reproducción" />} />
                        <Route path="breeding/record" element={<ComingSoon pageName="Registro Reproductivo" />} />
                        
                        {/* Rutas de inventario */}
                        <Route path="inventory" element={<ComingSoon pageName="Inventario" />} />
                        <Route path="inventory/:id" element={<ComingSoon pageName="Detalle de Inventario" />} />
                        
                        {/* Rutas financieras */}
                        <Route path="finance" element={<ComingSoon pageName="Finanzas" />} />
                        <Route path="finance/record" element={<ComingSoon pageName="Registro Financiero" />} />
                        
                        {/* Rutas de reportes */}
                        <Route path="reports" element={<ComingSoon pageName="Reportes" />} />
                        <Route path="reports/custom" element={<ComingSoon pageName="Reportes Personalizados" />} />
                        
                        {/* Rutas de eventos */}
                        <Route path="events" element={<ComingSoon pageName="Eventos" />} />
                        <Route path="calendar" element={<ComingSoon pageName="Calendario" />} />
                        
                        {/* Rutas de ubicación */}
                        <Route path="maps" element={<ComingSoon pageName="Mapas" />} />
                        <Route path="tracking" element={<ComingSoon pageName="Seguimiento" />} />
                        
                        {/* Rutas de configuración */}
                        <Route path="settings" element={<ComingSoon pageName="Configuración" />} />
                        <Route path="profile" element={<ComingSoon pageName="Mi Perfil" />} />
                        <Route path="users" element={<ComingSoon pageName="Gestión de Usuarios" />} />
                        
                        {/* Rutas de ayuda */}
                        <Route path="help" element={<ComingSoon pageName="Centro de Ayuda" />} />
                        
                        {/* Ruta 404 */}
                        <Route path="*" element={
                          <div className="min-h-96 flex items-center justify-center">
                            <div className="text-center space-y-4">
                              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-2xl">❌</span>
                              </div>
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Página no encontrada
                              </h2>
                              <p className="text-gray-600 dark:text-gray-400">
                                La página que buscas no existe o ha sido movida.
                              </p>
                              <div className="flex gap-3 justify-center">
                                <button
                                  onClick={() => window.history.back()}
                                  className="btn-outline"
                                >
                                  Volver
                                </button>
                                <button
                                  onClick={() => window.location.href = '/'}
                                  className="btn-primary"
                                >
                                  Ir al Inicio
                                </button>
                              </div>
                            </div>
                          </div>
                        } />
                      </Routes>
                    </Suspense>
                  </Layout>
                </Router>

                {/* Configuración de React Hot Toast */}
                <Toaster
                  position="top-right"
                  reverseOrder={false}
                  gutter={8}
                  containerClassName=""
                  containerStyle={{}}
                  toastOptions={{
                    // Configuración por defecto para todos los toast
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    
                    // Configuración específica por tipo
                    success: {
                      duration: 3000,
                      theme: {
                        primary: 'green',
                        secondary: 'black',
                      },
                    },
                    error: {
                      duration: 5000,
                      theme: {
                        primary: 'red',
                        secondary: 'black',
                      },
                    },
                  }}
                />

                {/* React Query DevTools solo en desarrollo */}
                {process.env.NODE_ENV === 'development' && (
                  <Suspense fallback={null}>
                    {/* Lazy load para evitar incluir en build de producción */}
                    {React.lazy(() => 
                      import('@tanstack/react-query-devtools').then(module => ({
                        default: module.ReactQueryDevtools
                      }))
                    )}
                  </Suspense>
                )}
              </NotificationProvider>
            </DataProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;