// Componente para capturar y manejar errores en React de forma elegante

import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug, 
  Mail,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle
} from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      reportSent: false,
      copying: false
    };
    
    // Bindings para métodos
    this.handleRetry = this.handleRetry.bind(this);
    this.handleGoHome = this.handleGoHome.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
    this.handleReportError = this.handleReportError.bind(this);
    this.copyErrorToClipboard = this.copyErrorToClipboard.bind(this);
  }

  // Método estático para capturar errores
  static getDerivedStateFromError(error) {
    // Actualizar el estado para mostrar la UI de error
    return { hasError: true };
  }

  // Método para capturar información detallada del error
  componentDidCatch(error, errorInfo) {
    // Registrar error en el estado
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Registrar error en consola para desarrollo
    console.error('ErrorBoundary capturó un error:', error, errorInfo);

    // Enviar error a servicio de monitoreo en producción
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  // Método para reintentar (recargar componente)
  handleRetry() {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      reportSent: false
    });
    
    // Recargar la página como último recurso
    window.location.reload();
  }

  // Método para ir al inicio
  handleGoHome() {
    window.location.href = '/';
  }

  // Método para mostrar/ocultar detalles del error
  toggleDetails() {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  }

  // Método para reportar error al equipo de desarrollo
  async handleReportError() {
    try {
      const errorReport = {
        error: this.state.error?.toString(),
        stack: this.state.error?.stack,
        componentStack: this.state.errorInfo?.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userId: this.props.userId || 'anonymous'
      };

      // Simular envío de reporte (reemplazar con API real)
      await this.sendErrorReport(errorReport);
      
      this.setState({ reportSent: true });
    } catch (err) {
      console.error('Error al enviar reporte:', err);
    }
  }

  // Método para copiar error al portapapeles
  async copyErrorToClipboard() {
    try {
      this.setState({ copying: true });
      
      const errorText = `
Error: ${this.state.error?.toString()}
Stack: ${this.state.error?.stack}
Component Stack: ${this.state.errorInfo?.componentStack}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}
      `;

      await navigator.clipboard.writeText(errorText);
      
      setTimeout(() => {
        this.setState({ copying: false });
      }, 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
      this.setState({ copying: false });
    }
  }

  // Método para enviar error a servicio de logging
  async logErrorToService(error, errorInfo) {
    try {
      // Aquí integrarías con servicios como Sentry, LogRocket, etc.
      const errorData = {
        message: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      // Ejemplo de envío a API de logging
      /*
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData)
      });
      */
    } catch (err) {
      console.error('Error al enviar log:', err);
    }
  }

  // Método para simular envío de reporte
  async sendErrorReport(errorReport) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Aquí integrarías con tu API de reportes
    console.log('Reporte de error enviado:', errorReport);
  }

  // Formatear stack trace para mostrar
  formatStackTrace(stack) {
    if (!stack) return '';
    
    return stack
      .split('\n')
      .slice(0, 10) // Mostrar solo las primeras 10 líneas
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  }

  // Obtener mensaje de error amigable
  getFriendlyErrorMessage() {
    const errorMessage = this.state.error?.message || '';
    
    if (errorMessage.includes('ChunkLoadError')) {
      return 'Error al cargar recursos. La aplicación puede haber sido actualizada.';
    }
    
    if (errorMessage.includes('Network')) {
      return 'Error de conexión. Verifique su conexión a internet.';
    }
    
    if (errorMessage.includes('Permission')) {
      return 'Error de permisos. No tiene autorización para esta acción.';
    }
    
    return 'Ha ocurrido un error inesperado en la aplicación.';
  }

  render() {
    // Si no hay error, renderizar children normalmente
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Configuración de animaciones
    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.6,
          staggerChildren: 0.1
        }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 }
    };

    const detailsVariants = {
      hidden: { 
        opacity: 0, 
        height: 0,
        transition: { duration: 0.3 }
      },
      visible: { 
        opacity: 1, 
        height: 'auto',
        transition: { duration: 0.3 }
      }
    };

    // Renderizar UI de error
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-2xl w-full">
          {/* Tarjeta principal de error */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-lg shadow-xl border border-red-100 overflow-hidden"
          >
            {/* Header con icono de error */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
              </motion.div>
              <h1 className="text-2xl font-bold mb-2">¡Oops! Algo salió mal</h1>
              <p className="text-red-100">
                {this.getFriendlyErrorMessage()}
              </p>
            </div>

            {/* Contenido principal */}
            <div className="p-6 space-y-6">
              {/* Descripción del error */}
              <motion.div variants={itemVariants} className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  No te preocupes, nuestro equipo ha sido notificado automáticamente. 
                  Puedes intentar recargar la página o regresar al inicio.
                </p>
              </motion.div>

              {/* Botones de acción principales */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <button
                  onClick={this.handleRetry}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reintentar
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Ir al Inicio
                </button>
              </motion.div>

              {/* Botón para mostrar detalles técnicos */}
              <motion.div variants={itemVariants} className="text-center">
                <button
                  onClick={this.toggleDetails}
                  className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors text-sm"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Detalles técnicos
                  {this.state.showDetails ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>
              </motion.div>

              {/* Panel de detalles técnicos */}
              <motion.div
                variants={detailsVariants}
                initial="hidden"
                animate={this.state.showDetails ? "visible" : "hidden"}
                className="overflow-hidden"
              >
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="space-y-4">
                    {/* Error message */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Mensaje de Error:</h4>
                      <p className="text-sm text-red-600 font-mono bg-red-50 p-2 rounded border">
                        {this.state.error?.toString()}
                      </p>
                    </div>

                    {/* Stack trace */}
                    {this.state.error?.stack && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Stack Trace:</h4>
                        <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto max-h-32">
                          {this.formatStackTrace(this.state.error.stack)}
                        </pre>
                      </div>
                    )}

                    {/* Component stack */}
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Component Stack:</h4>
                        <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto max-h-32">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}

                    {/* Botones de acción para detalles */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <button
                        onClick={this.copyErrorToClipboard}
                        disabled={this.state.copying}
                        className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
                      >
                        {this.state.copying ? (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        {this.state.copying ? 'Copiado!' : 'Copiar Error'}
                      </button>

                      <button
                        onClick={this.handleReportError}
                        disabled={this.state.reportSent}
                        className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors disabled:opacity-50"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        {this.state.reportSent ? 'Reporte Enviado' : 'Reportar Error'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Información adicional */}
              <motion.div 
                variants={itemVariants}
                className="text-center text-xs text-gray-500 pt-4 border-t"
              >
                <p>Error ID: {Date.now().toString(36)}</p>
                <p>Timestamp: {new Date().toLocaleString()}</p>
                {this.props.version && (
                  <p>Versión: {this.props.version}</p>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Información de contacto */}
          <motion.div 
            variants={itemVariants}
            className="text-center mt-6 text-sm text-gray-600"
          >
            <p>
              Si el problema persiste, contacta a{' '}
              <a 
                href="mailto:soporte@sistemaganadero.com" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                soporte@sistemaganadero.com
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    );
  }
}

// Props por defecto
ErrorBoundary.defaultProps = {
  version: '1.0.0'
};

export default ErrorBoundary;