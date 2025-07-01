import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

// Configuración del cliente de React Query para manejo de estado del servidor
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount, error) => {
        // No reintentar en errores 404 o de autenticación
        if (error.status === 404 || error.status === 401) {
          return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
})

// Configuración del entorno de desarrollo
const isDevelopment = import.meta.env.DEV

// StrictMode habilitado solo en desarrollo para detectar problemas
const AppWithProviders = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        {/* Toast notifications con configuración personalizada */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Configuración global de toasts
            className: '',
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            // Configuración específica por tipo
            success: {
              duration: 3000,
              style: {
                background: '#10B981',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#EF4444',
              },
            },
            loading: {
              style: {
                background: '#3B82F6',
              },
            },
          }}
        />
        {/* DevTools solo en desarrollo */}
        {isDevelopment && (
          <ReactQueryDevtools
            initialIsOpen={false}
            position="bottom-right"
            toggleButtonProps={{
              style: {
                marginLeft: '5px',
                transform: 'scale(0.8)',
                transformOrigin: 'bottom right',
              },
            }}
          />
        )}
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
)

// Renderizado de la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'))

if (isDevelopment) {
  // En desarrollo con StrictMode para detectar problemas
  root.render(
    <React.StrictMode>
      <AppWithProviders />
    </React.StrictMode>
  )
} else {
  // En producción sin StrictMode para mejor rendimiento
  root.render(<AppWithProviders />)
}

// Registro de Service Worker para PWA (solo en producción)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

// Manejo de errores no capturados
window.addEventListener('error', (event) => {
  console.error('Error no capturado:', event.error)
  // Aquí puedes enviar errores a un servicio de monitoreo en producción
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promesa rechazada no manejada:', event.reason)
  // Aquí puedes enviar errores a un servicio de monitoreo en producción
  event.preventDefault()
})