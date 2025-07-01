import React from 'react'
import { motion } from 'framer-motion'

// Clase de Error Boundary para capturar errores en React
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      isRetrying: false
    }
  }

  // Método estático para actualizar el estado cuando ocurre un error
  static getDerivedStateFromError(error) {
    // Actualiza el estado para mostrar la UI de error en el siguiente renderizado
    return { hasError: true }
  }

  // Método para capturar información del error
  componentDidCatch(error, errorInfo) {
    // Registrar el error para debugging
    console.error('ErrorBoundary capturó un error:', error, errorInfo)
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // Aquí puedes enviar el error a un servicio de monitoreo
    this.logErrorToService(error, errorInfo)
  }

  // Método para enviar errores a servicios de monitoreo
  logErrorToService = (error, errorInfo) => {
    // En producción, aquí enviarías el error a un servicio como Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      try {
        // Ejemplo de envío a un servicio de logging
        // window.analytics?.track('Error Captured', {
        //   error: error.toString(),
        //   errorInfo: errorInfo.componentStack,
        //   userAgent: navigator.userAgent,
        //   url: window.location.href,
        //   timestamp: new Date().toISOString()
        // })
      } catch (loggingError) {
        console.error('Error al enviar el error al servicio de logging:', loggingError)
      }
    }
  }

  // Método para reintentar la aplicación
  handleRetry = () => {
    this.setState({ isRetrying: true })
    
    // Simular un pequeño delay antes de reiniciar
    setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false
      })
    }, 500)
  }

  // Método para recargar la página
  handleReload = () => {
    window.location.reload()
  }

  // Método para reportar el error
  handleReportError = () => {
    const errorReport = {
      error: this.state.error?.toString(),
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    }

    // Crear un mailto con la información del error
    const subject = encodeURIComponent('Error en Sistema de Gestión Bovinos')
    const body = encodeURIComponent(
      `Se ha producido un error en la aplicación:

Detalles del Error:
${JSON.stringify(errorReport, null, 2)}

Por favor, incluye cualquier información adicional sobre lo que estabas haciendo cuando ocurrió el error.`
    )
    
    window.open(`mailto:soporte@gestionbovinos.com?subject=${subject}&body=${body}`)
  }

  render() {
    const { hasError, error, errorInfo, isRetrying } = this.state
    const { children, fallback } = this.props

    // Si hay un componente fallback personalizado, usarlo
    if (hasError && fallback) {
      return fallback(error, this.handleRetry)
    }

    // Si hay un error, mostrar la UI de error
    if (hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4"
        >
          <div className="max-w-md w-full">
            {/* Contenedor principal del error */}
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Header con icono */}
              <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-3">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center"
                  >
                    <svg
                      className="w-6 h-6 text-red-600 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
                      ¡Oops! Algo salió mal
                    </h2>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Se ha producido un error inesperado
                    </p>
                  </div>
                </div>
              </div>

              {/* Contenido del error */}
              <div className="px-6 py-4 space-y-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Lo sentimos, pero algo no funcionó como se esperaba. Puedes intentar las siguientes opciones:
                </p>

                {/* Botones de acción */}
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={this.handleRetry}
                    disabled={isRetrying}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    {isRetrying ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Reintentando...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Reintentar</span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={this.handleReload}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Recargar página</span>
                  </motion.button>
                </div>

                {/* Información adicional en desarrollo */}
                {process.env.NODE_ENV === 'development' && error && (
                  <motion.details
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.3 }}
                    className="mt-4"
                  >
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                      Detalles técnicos del error
                    </summary>
                    <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-auto max-h-32">
                        {error.toString()}
                        {errorInfo && errorInfo.componentStack}
                      </pre>
                    </div>
                  </motion.details>
                )}
              </div>

              {/* Footer con enlace de soporte */}
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={this.handleReportError}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Reportar este error</span>
                </button>
              </div>
            </motion.div>

            {/* Mensaje de ayuda */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4"
            >
              Si el problema persiste, contacta al equipo de soporte
            </motion.p>
          </div>
        </motion.div>
      )
    }

    // Si no hay error, renderizar los children normalmente
    return children
  }
}

// Hook para usar con componentes funcionales
export const useErrorHandler = () => {
  return (error, errorInfo) => {
    console.error('Error capturado:', error, errorInfo)
    
    // En una aplicación real, aquí enviarías el error a un servicio
    if (process.env.NODE_ENV === 'production') {
      // Enviar a servicio de logging
    }
  }
}

// Componente funcional simple para errores de componentes específicos
export const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
  >
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
          Error en el componente
        </h3>
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
          {error?.message || 'Ha ocurrido un error inesperado'}
        </p>
        {resetErrorBoundary && (
          <button
            onClick={resetErrorBoundary}
            className="mt-3 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  </motion.div>
)

export default ErrorBoundary