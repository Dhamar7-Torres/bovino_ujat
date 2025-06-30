/**
 * ErrorBoundary.jsx - Componente para capturar y manejar errores en React de forma elegante
 * Incluye reporte de errores, recuperación automática y UI amigable para el sistema ganadero
 */

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
  CheckCircle,
  ExternalLink,
  Shield,
  Zap,
  Clock,
  Info,
  AlertCircle,
  FileText,
  Settings,
  PhoneCall,
  MessageSquare,
  ArrowLeft,
  RotateCcw
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
      copying: false,
      retryCount: 0,
      showFallback: false,
      errorId: null,
      userFeedback: '',
      isRecovering: false
    };
    
    // Bindings para métodos
    this.handleRetry = this.handleRetry.bind(this);
    this.handleGoHome = this.handleGoHome.bind(this);
    this.handleGoBack = this.handleGoBack.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
    this.handleReportError = this.handleReportError.bind(this);
    this.copyErrorToClipboard = this.copyErrorToClipboard.bind(this);
    this.handleFeedbackChange = this.handleFeedbackChange.bind(this);
    this.handleAutoRecovery = this.handleAutoRecovery.bind(this);
    this.generateErrorId = this.generateErrorId.bind(this);
  }

  // Método estático para capturar errores
  static getDerivedStateFromError(error) {
    // Actualizar el estado para mostrar la UI de error
    return { hasError: true };
  }

  // Método para capturar información detallada del error
  componentDidCatch(error, errorInfo) {
    const errorId = this.generateErrorId();
    
    // Registrar error en el estado
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorId: errorId,
      showFallback: true
    });

    // Registrar error en consola para desarrollo
    console.error('ErrorBoundary capturó un error:', {
      errorId,
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Enviar error a servicio de monitoreo en producción
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo, errorId);
    }

    // Intentar recuperación automática después de un delay
    setTimeout(() => {
      this.handleAutoRecovery();
    }, 5000);
  }

  // Generar ID único para el error
  generateErrorId() {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Método para recuperación automática
  handleAutoRecovery() {
    const { retryCount } = this.state;
    
    // Solo intentar recuperación automática hasta 3 veces
    if (retryCount < 3) {
      this.setState({ 
        isRecovering: true 
      });
      
      setTimeout(() => {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          showDetails: false,
          isRecovering: false,
          retryCount: retryCount + 1
        });
      }, 2000);
    }
  }

  // Método para reintentar manualmente
  handleRetry() {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      reportSent: false,
      isRecovering: false
    });
    
    // Si el retry manual falla, recargar la página
    setTimeout(() => {
      if (this.state.hasError) {
        window.location.reload();
      }
    }, 1000);
  }

  // Método para ir al inicio
  handleGoHome() {
    window.location.href = '/';
  }

  // Método para volver atrás
  handleGoBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.handleGoHome();
    }
  }

  // Método para mostrar/ocultar detalles del error
  toggleDetails() {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  }

  // Método para manejar cambios en el feedback del usuario
  handleFeedbackChange(event) {
    this.setState({
      userFeedback: event.target.value
    });
  }

  // Método para reportar error al equipo de desarrollo
  async handleReportError() {
    const { error, errorInfo, errorId, userFeedback } = this.state;
    
    try {
      const errorReport = {
        errorId,
        error: error?.toString(),
        stack: error?.stack,
        componentStack: errorInfo?.componentStack,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userFeedback,
        systemInfo: {
          platform: navigator.platform,
          language: navigator.language,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          screen: {
            width: window.screen.width,
            height: window.screen.height
          }
        }
      };

      // Enviar reporte de error
      const response = await fetch('/api/error-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'anonymous'}`
        },
        body: JSON.stringify(errorReport)
      });

      if (response.ok) {
        this.setState({ reportSent: true });
      } else {
        throw new Error('Failed to send error report');
      }
    } catch (reportError) {
      console.error('Error sending report:', reportError);
      // Fallback: intentar enviar por email
      this.sendEmailReport();
    }
  }

  // Método fallback para enviar reporte por email
  sendEmailReport() {
    const { error, errorId } = this.state;
    const subject = `[Sistema Bovinos] Error Report - ${errorId}`;
    const body = `
Estimado equipo de desarrollo,

Se ha producido un error en el sistema de gestión de bovinos:

ID del Error: ${errorId}
Fecha: ${new Date().toLocaleString()}
Error: ${error?.message || 'Error desconocido'}
URL: ${window.location.href}
Navegador: ${navigator.userAgent}

Comentarios adicionales:
${this.state.userFeedback || 'Ninguno'}

Saludos,
Usuario del Sistema
    `;
    
    const mailtoLink = `mailto:soporte@sistemaganadero.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    
    this.setState({ reportSent: true });
  }

  // Método para copiar error al portapapeles
  async copyErrorToClipboard() {
    const { error, errorInfo, errorId } = this.state;
    
    const errorText = `
Error ID: ${errorId}
Timestamp: ${new Date().toISOString()}
Error: ${error?.toString()}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
    `;

    try {
      await navigator.clipboard.writeText(errorText);
      this.setState({ copying: true });
      
      setTimeout(() => {
        this.setState({ copying: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy error to clipboard:', err);
    }
  }

  // Método para registrar error en servicio de monitoreo
  logErrorToService(error, errorInfo, errorId) {
    // Integración con servicios como Sentry, LogRocket, etc.
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
            errorId
          }
        }
      });
    }

    // Enviar a API de logging personalizada
    fetch('/api/error-logging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        errorId,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        errorInfo,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    }).catch(logError => {
      console.error('Failed to log error to service:', logError);
    });
  }

  // Método para determinar el tipo de error
  getErrorType() {
    const { error } = this.state;
    
    if (!error) return 'unknown';
    
    const errorMessage = error.message?.toLowerCase() || '';
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'network';
    } else if (errorMessage.includes('chunk') || errorMessage.includes('loading')) {
      return 'loading';
    } else if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
      return 'permission';
    } else if (errorMessage.includes('timeout')) {
      return 'timeout';
    } else {
      return 'application';
    }
  }

  // Método para obtener mensajes específicos según el tipo de error
  getErrorMessages() {
    const errorType = this.getErrorType();
    
    const messages = {
      network: {
        title: 'Error de Conexión',
        description: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        icon: Zap,
        color: 'text-orange-600'
      },
      loading: {
        title: 'Error de Carga',
        description: 'Hubo un problema al cargar la aplicación. Intenta recargar la página.',
        icon: RefreshCw,
        color: 'text-blue-600'
      },
      permission: {
        title: 'Error de Permisos',
        description: 'No tienes permisos para acceder a esta función.',
        icon: Shield,
        color: 'text-red-600'
      },
      timeout: {
        title: 'Tiempo de Espera Agotado',
        description: 'La operación tardó demasiado tiempo. Intenta nuevamente.',
        icon: Clock,
        color: 'text-yellow-600'
      },
      application: {
        title: 'Error de Aplicación',
        description: 'Se produjo un error inesperado en la aplicación.',
        icon: Bug,
        color: 'text-red-600'
      },
      unknown: {
        title: 'Error Desconocido',
        description: 'Se produjo un error que no pudimos identificar.',
        icon: AlertTriangle,
        color: 'text-gray-600'
      }
    };

    return messages[errorType] || messages.unknown;
  }

  render() {
    const { 
      hasError, 
      showDetails, 
      reportSent, 
      copying, 
      retryCount, 
      showFallback,
      errorId,
      userFeedback,
      isRecovering
    } = this.state;

    const { 
      fallback, 
      children, 
      showReportButton = true,
      showRetryButton = true,
      customActions = [],
      level = 'error' // 'error', 'warning', 'info'
    } = this.props;

    // Si no hay error, renderizar children normalmente
    if (!hasError) {
      return children;
    }

    // Si está en proceso de recuperación
    if (isRecovering) {
      return (
        <motion.div
          className="min-h-64 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RotateCcw size={32} className="mx-auto text-blue-600" />
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400">
              Intentando recuperar la aplicación...
            </p>
          </div>
        </motion.div>
      );
    }

    // Usar fallback personalizado si se proporciona
    if (fallback && typeof fallback === 'function') {
      return fallback(this.state.error, this.handleRetry, this.handleGoHome);
    }

    // Obtener mensajes específicos del error
    const errorMessages = this.getErrorMessages();
    const ErrorIcon = errorMessages.icon;

    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header del error */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <ErrorIcon size={32} />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">
                  {errorMessages.title}
                </h1>
                <p className="text-red-100 text-lg">
                  {errorMessages.description}
                </p>
                {errorId && (
                  <p className="text-red-200 text-sm mt-2">
                    ID del Error: <code className="font-mono">{errorId}</code>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-6 space-y-6">
            {/* Mensaje de disculpas */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                ¡Ups! Algo salió mal
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Estamos trabajando para solucionar este problema. 
                {retryCount > 0 && ` (Intento ${retryCount + 1})`}
              </p>
            </div>

            {/* Acciones principales */}
            <div className="flex flex-wrap gap-3 justify-center">
              {showRetryButton && (
                <motion.button
                  onClick={this.handleRetry}
                  className="btn-primary inline-flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw size={18} />
                  Reintentar
                </motion.button>
              )}
              
              <motion.button
                onClick={this.handleGoHome}
                className="btn-secondary inline-flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Home size={18} />
                Ir al Inicio
              </motion.button>

              <motion.button
                onClick={this.handleGoBack}
                className="btn-outline inline-flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft size={18} />
                Volver
              </motion.button>

              {/* Acciones personalizadas */}
              {customActions.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={action.onClick}
                  className={action.className || "btn-outline"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {action.icon && <action.icon size={18} />}
                  {action.label}
                </motion.button>
              ))}
            </div>

            {/* Sección de reporte de error */}
            {showReportButton && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Bug size={20} />
                    Reportar Error
                  </h3>
                  
                  {!reportSent ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ayúdanos a mejorar reportando este error. Tu reporte es anónimo y nos ayuda a prevenir futuros problemas.
                      </p>
                      
                      <textarea
                        value={userFeedback}
                        onChange={this.handleFeedbackChange}
                        placeholder="Describe qué estabas haciendo cuando ocurrió el error (opcional)..."
                        className="input-base h-24 resize-none"
                      />
                      
                      <div className="flex gap-2">
                        <motion.button
                          onClick={this.handleReportError}
                          className="btn-primary inline-flex items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Mail size={18} />
                          Enviar Reporte
                        </motion.button>
                        
                        <motion.button
                          onClick={this.copyErrorToClipboard}
                          className="btn-outline inline-flex items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {copying ? (
                            <>
                              <CheckCircle size={18} className="text-green-600" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy size={18} />
                              Copiar Error
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <CheckCircle size={20} />
                      <div>
                        <p className="font-medium">¡Reporte enviado exitosamente!</p>
                        <p className="text-sm">Gracias por ayudarnos a mejorar el sistema.</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Detalles técnicos del error */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                onClick={this.toggleDetails}
                className="w-full flex items-center justify-between text-left text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <span className="text-sm font-medium">Detalles técnicos</span>
                {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              <motion.div
                initial={false}
                animate={{ height: showDetails ? 'auto' : 0, opacity: showDetails ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
                    <div className="space-y-2">
                      <div>
                        <strong>Error:</strong> {this.state.error?.toString()}
                      </div>
                      <div>
                        <strong>Timestamp:</strong> {new Date().toISOString()}
                      </div>
                      <div>
                        <strong>URL:</strong> {window.location.href}
                      </div>
                      <div>
                        <strong>User Agent:</strong> {navigator.userAgent}
                      </div>
                    </div>
                  </div>
                  
                  {this.state.error?.stack && (
                    <details className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300">
                        Stack Trace
                      </summary>
                      <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Información de contacto */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="text-center space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  ¿Necesitas ayuda inmediata?
                </h4>
                <div className="flex justify-center gap-4 text-sm">
                  <a
                    href="mailto:soporte@sistemaganadero.com"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 inline-flex items-center gap-1"
                  >
                    <Mail size={14} />
                    Soporte
                  </a>
                  <a
                    href="tel:+1234567890"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 inline-flex items-center gap-1"
                  >
                    <PhoneCall size={14} />
                    Llamar
                  </a>
                  <a
                    href="/help"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 inline-flex items-center gap-1"
                  >
                    <FileText size={14} />
                    Ayuda
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
}

// HOC para envolver componentes con ErrorBoundary
export const withErrorBoundary = (Component, errorBoundaryConfig = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryConfig}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Componente de error simple para casos específicos
export const SimpleErrorFallback = ({ error, resetErrorBoundary, message }) => (
  <div className="p-6 text-center space-y-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
    <AlertTriangle size={32} className="mx-auto text-red-600 dark:text-red-400" />
    <div>
      <h3 className="text-lg font-medium text-red-900 dark:text-red-100">
        {message || 'Algo salió mal'}
      </h3>
      <p className="text-red-700 dark:text-red-300 text-sm mt-1">
        {error?.message || 'Error desconocido'}
      </p>
    </div>
    <button
      onClick={resetErrorBoundary}
      className="btn-outline text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/30"
    >
      Reintentar
    </button>
  </div>
);

export default ErrorBoundary;