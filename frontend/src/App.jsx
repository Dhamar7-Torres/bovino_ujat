// src/App.jsx
import React, { Suspense, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

// Importaciones de componentes principales existentes
import MainLayout from './components/common/Layout/MainLayout'
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary'

// Componente de Loading simple (mientras creamos el componente completo)
const SimpleLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
    </div>
  </div>
)

// Componente temporal para páginas que no existen
const TemporaryPage = ({ pageName }) => (
  <div className="min-h-96 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
        <span className="text-2xl">🚧</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {pageName}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Esta página se está desarrollando.
      </p>
    </div>
  </div>
)

// Páginas temporales simples
const Dashboard = () => <TemporaryPage pageName="Dashboard" />
const Login = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🐄</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sistema Ganadero
        </h1>
      </div>
      
      <button 
        onClick={() => {
          localStorage.setItem('auth_token', 'demo-token')
          window.location.href = '/dashboard'
        }}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        Acceso Demo
      </button>
      
      <p className="text-center text-xs text-gray-500 mt-4">
        Haz clic para acceder al sistema
      </p>
    </div>
  </div>
)

const BovineList = () => <TemporaryPage pageName="Lista de Bovinos" />
const HealthRecords = () => <TemporaryPage pageName="Registros de Salud" />
const ProductionDashboard = () => <TemporaryPage pageName="Dashboard de Producción" />
const ReproductionManagement = () => <TemporaryPage pageName="Gestión Reproductiva" />
const Reports = () => <TemporaryPage pageName="Reportes" />
const Settings = () => <TemporaryPage pageName="Configuración" />
const ComingSoon = ({ pageName }) => <TemporaryPage pageName={pageName || "Próximamente"} />
const Error404 = () => <TemporaryPage pageName="Página no encontrada" />

// Componente de protección de rutas
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('auth_token')
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <SimpleLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Componente principal de la aplicación
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Configuración de tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Función para alternar tema
  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
          {/* Notificaciones globales */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#f9fafb' : '#111827',
                border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
            }}
          />

          <AnimatePresence mode="wait">
            <Suspense fallback={<SimpleLoader />}>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<Login />} />
                
                {/* Redirección por defecto */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Rutas protegidas */}
                <Route path="/*" element={
                  <ProtectedRoute>
                    <MainLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <Routes>
                        {/* Dashboard */}
                        <Route path="dashboard" element={<Dashboard />} />
                        
                        {/* Gestión de Bovinos */}
                        <Route path="bovines">
                          <Route index element={<BovineList />} />
                          <Route path="new" element={<TemporaryPage pageName="Nuevo Bovino" />} />
                          <Route path=":id" element={<TemporaryPage pageName="Detalle de Bovino" />} />
                          <Route path=":id/edit" element={<TemporaryPage pageName="Editar Bovino" />} />
                        </Route>
                        
                        {/* Control de Salud */}
                        <Route path="health">
                          <Route index element={<HealthRecords />} />
                          <Route path="vaccinations" element={<ComingSoon pageName="Vacunaciones" />} />
                          <Route path="treatments" element={<ComingSoon pageName="Tratamientos" />} />
                        </Route>
                        
                        {/* Producción */}
                        <Route path="production">
                          <Route index element={<ProductionDashboard />} />
                          <Route path="milk" element={<ComingSoon pageName="Producción de Leche" />} />
                        </Route>
                        
                        {/* Reproducción */}
                        <Route path="reproduction">
                          <Route index element={<ReproductionManagement />} />
                          <Route path="breeding" element={<ComingSoon pageName="Calendario de Cría" />} />
                        </Route>
                        
                        {/* Reportes */}
                        <Route path="reports">
                          <Route index element={<Reports />} />
                          <Route path="analytics" element={<ComingSoon pageName="Análisis" />} />
                        </Route>
                        
                        {/* Configuración */}
                        <Route path="settings">
                          <Route index element={<Settings />} />
                          <Route path="profile" element={<ComingSoon pageName="Perfil" />} />
                        </Route>
                        
                        {/* Páginas temporales */}
                        <Route path="maps" element={<ComingSoon pageName="Mapas y Geolocalización" />} />
                        <Route path="calendar" element={<ComingSoon pageName="Calendario de Eventos" />} />
                        <Route path="finances" element={<ComingSoon pageName="Gestión Financiera" />} />
                        <Route path="inventory" element={<ComingSoon pageName="Inventario" />} />
                        
                        {/* Ruta 404 */}
                        <Route path="*" element={<Error404 />} />
                      </Routes>
                    </MainLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App