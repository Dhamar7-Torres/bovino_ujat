import React, { Suspense, lazy, useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

// Componentes básicos
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner'
import ErrorBoundary from '@/components/common/ErrorBoundary/ErrorBoundary'
import MainLayout from '@/components/common/Layout/MainLayout'

// Lazy loading de páginas para mejorar el rendimiento
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'))
const Login = lazy(() => import('@/pages/auth/Login'))
const Register = lazy(() => import('@/pages/auth/Register'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))

// Páginas de gestión de bovinos
const BovinesList = lazy(() => import('@/pages/bovines/BovinesList'))
const BovineDetail = lazy(() => import('@/pages/bovines/BovineDetail'))
const BovineForm = lazy(() => import('@/pages/bovines/BovineForm'))

// Páginas de salud
const HealthRecords = lazy(() => import('@/pages/health/HealthRecords'))
const VaccinationSchedule = lazy(() => import('@/pages/health/VaccinationSchedule'))
const TreatmentHistory = lazy(() => import('@/pages/health/TreatmentHistory'))

// Páginas de producción
const ProductionRecords = lazy(() => import('@/pages/production/ProductionRecords'))
const MilkProduction = lazy(() => import('@/pages/production/MilkProduction'))

// Páginas de reproducción
const ReproductionManagement = lazy(() => import('@/pages/reproduction/ReproductionManagement'))
const BreedingSchedule = lazy(() => import('@/pages/reproduction/BreedingSchedule'))

// Páginas de reportes
const Reports = lazy(() => import('@/pages/reports/Reports'))
const Analytics = lazy(() => import('@/pages/reports/Analytics'))

// Páginas de configuración
const Settings = lazy(() => import('@/pages/settings/Settings'))
const Profile = lazy(() => import('@/pages/settings/Profile'))

// Página temporal para funcionalidades en desarrollo
const ComingSoon = lazy(() => import('@/components/common/ComingSoon/ComingSoon'))

// Hook personalizado para autenticación
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Verificar token de autenticación al cargar la app
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          // Aquí validarías el token con el backend
          // Por ahora simulamos una verificación exitosa
          setIsAuthenticated(true)
          setUser({ name: 'Usuario', role: 'admin' })
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        localStorage.removeItem('auth_token')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { isAuthenticated, isLoading, user, setIsAuthenticated, setUser }
}

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Componente para rutas públicas (redirect si ya está autenticado)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Animaciones de transición entre páginas
const pageTransition = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
}

// Componente principal de la aplicación
function App() {
  const location = useLocation()
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Configurar tema oscuro/claro desde localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDarkMode(shouldUseDark)
    
    // Aplicar clase al html
    if (shouldUseDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Función para alternar tema
  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev
      localStorage.setItem('theme', newTheme ? 'dark' : 'light')
      if (newTheme) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return newTheme
    })
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'
      }`}>
        {/* Configuración del HEAD con Helmet */}
        <Helmet>
          <title>Sistema de Gestión de Bovinos</title>
          <meta name="description" content="Sistema integral para la gestión de ganado bovino con control de salud, producción y ubicación." />
          <meta name="theme-color" content={isDarkMode ? "#1F2937" : "#3B82F6"} />
        </Helmet>

        {/* Animaciones de transición entre rutas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="min-h-screen"
          >
            <Suspense fallback={<LoadingSpinner />}>
              <Routes location={location}>
                {/* Rutas públicas */}
                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />
                <Route path="/register" element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } />
                <Route path="/forgot-password" element={
                  <PublicRoute>
                    <ForgotPassword />
                  </PublicRoute>
                } />

                {/* Rutas protegidas con layout */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <MainLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <Routes>
                        {/* Redirect desde raíz al dashboard */}
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        
                        {/* Dashboard principal */}
                        <Route path="dashboard" element={<Dashboard />} />
                        
                        {/* Gestión de bovinos */}
                        <Route path="bovines">
                          <Route index element={<BovinesList />} />
                          <Route path="new" element={<BovineForm />} />
                          <Route path=":id" element={<BovineDetail />} />
                          <Route path=":id/edit" element={<BovineForm />} />
                        </Route>
                        
                        {/* Control de salud */}
                        <Route path="health">
                          <Route index element={<HealthRecords />} />
                          <Route path="vaccinations" element={<VaccinationSchedule />} />
                          <Route path="treatments" element={<TreatmentHistory />} />
                        </Route>
                        
                        {/* Producción */}
                        <Route path="production">
                          <Route index element={<ProductionRecords />} />
                          <Route path="milk" element={<MilkProduction />} />
                        </Route>
                        
                        {/* Reproducción */}
                        <Route path="reproduction">
                          <Route index element={<ReproductionManagement />} />
                          <Route path="breeding" element={<BreedingSchedule />} />
                        </Route>
                        
                        {/* Reportes y analytics */}
                        <Route path="reports">
                          <Route index element={<Reports />} />
                          <Route path="analytics" element={<Analytics />} />
                        </Route>
                        
                        {/* Configuración */}
                        <Route path="settings">
                          <Route index element={<Settings />} />
                          <Route path="profile" element={<Profile />} />
                        </Route>
                        
                        {/* Páginas temporales */}
                        <Route path="maps" element={<ComingSoon pageName="Mapas y Geolocalización" />} />
                        <Route path="calendar" element={<ComingSoon pageName="Calendario de Eventos" />} />
                        <Route path="finances" element={<ComingSoon pageName="Gestión Financiera" />} />
                        <Route path="inventory" element={<ComingSoon pageName="Inventario" />} />
                        
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
                              <button
                                onClick={() => window.history.back()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Volver atrás
                              </button>
                            </div>
                          </div>
                        } />
                      </Routes>
                    </MainLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  )
}

export default App