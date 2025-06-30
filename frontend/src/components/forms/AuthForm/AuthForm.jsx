import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Building, 
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Shield,
  Zap,
  Sparkles
} from 'lucide-react';

// Componentes de shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

// Hooks personalizados
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { useFetch } from '../../hooks/useFetch';

// Utilidades
import { validateEmail, validatePassword, validatePhone } from '../../utils/validators';

/**
 * Componente de formulario de autenticación
 * Maneja login, registro y recuperación de contraseña con animaciones fluidas
 */
const AuthForm = ({ 
  mode = 'login', // 'login', 'register', 'forgot-password'
  onModeChange = null,
  redirectTo = '/dashboard',
  allowModeSwitch = true,
  compactMode = false
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Estados del formulario
  const [currentMode, setCurrentMode] = useState(mode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    telefono: '',
    rol_id: '3', // Usuario regular por defecto
    terminos: false,
    recordarme: false
  });

  // Estados de UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // Para registro multi-step

  // Hooks personalizados
  const { 
    login, 
    register, 
    forgotPassword,
    loading: authLoading,
    error: authError,
    clearError,
    isAuthenticated 
  } = useAuth();
  
  const { showSuccess, showError } = useNotifications();

  // Cargar roles disponibles para registro
  const { data: roles } = useFetch('/api/roles', {
    immediate: currentMode === 'register',
    cacheKey: 'roles-list'
  });

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect') || redirectTo;
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, searchParams, redirectTo]);

  // Limpiar errores cuando cambie el modo
  useEffect(() => {
    clearError();
    setErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      nombre: '',
      apellido: '',
      telefono: '',
      rol_id: '3',
      terminos: false,
      recordarme: false
    });
    setStep(1);
  }, [currentMode, clearError]);

  /**
   * Manejar cambios en el formulario
   * @param {Event|string} e - Evento o nombre del campo
   * @param {string} value - Valor del campo (para selects)
   */
  const handleInputChange = (e, value = null) => {
    const { name, value: inputValue, type, checked } = e.target || { name: e, value };
    const newValue = type === 'checkbox' ? checked : (value !== null ? value : inputValue);
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Validar formulario según el modo actual
   */
  const validateForm = () => {
    const newErrors = {};

    // Validaciones comunes
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (currentMode !== 'forgot-password') {
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (currentMode === 'register' && !validatePassword(formData.password)) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número';
      }
    }

    // Validaciones específicas para registro
    if (currentMode === 'register') {
      if (!formData.nombre.trim()) {
        newErrors.nombre = 'El nombre es requerido';
      }

      if (!formData.apellido.trim()) {
        newErrors.apellido = 'El apellido es requerido';
      }

      if (formData.telefono && !validatePhone(formData.telefono)) {
        newErrors.telefono = 'El teléfono no es válido';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }

      if (!formData.terminos) {
        newErrors.terminos = 'Debes aceptar los términos y condiciones';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Manejar envío del formulario
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      switch (currentMode) {
        case 'login':
          result = await login(formData.email, formData.password);
          if (result.success) {
            showSuccess(
              '¡Bienvenido!', 
              `Hola ${result.user.nombre}, has iniciado sesión correctamente`
            );
          }
          break;

        case 'register':
          const registerData = {
            email: formData.email,
            password: formData.password,
            nombre: formData.nombre,
            apellido: formData.apellido,
            telefono: formData.telefono,
            rol_id: parseInt(formData.rol_id)
          };
          result = await register(registerData);
          if (result.success) {
            showSuccess(
              '¡Registro exitoso!', 
              'Tu cuenta ha sido creada correctamente'
            );
          }
          break;

        case 'forgot-password':
          result = await forgotPassword(formData.email);
          if (result.success) {
            showSuccess(
              'Email enviado', 
              'Te hemos enviado las instrucciones para restablecer tu contraseña'
            );
            setCurrentMode('login');
          }
          break;

        default:
          break;
      }

      if (!result.success) {
        showError('Error', result.error || 'Ha ocurrido un error');
      }
    } catch (error) {
      console.error('Error en autenticación:', error);
      showError('Error', 'Ha ocurrido un error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Cambiar modo del formulario
   * @param {string} newMode - Nuevo modo
   */
  const handleModeChange = (newMode) => {
    setCurrentMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  /**
   * Avanzar al siguiente paso en el registro
   */
  const handleNextStep = () => {
    if (step === 1) {
      // Validar email y contraseñas en el primer paso
      const stepErrors = {};
      
      if (!formData.email || !validateEmail(formData.email)) {
        stepErrors.email = 'Email requerido y válido';
      }
      
      if (!formData.password || !validatePassword(formData.password)) {
        stepErrors.password = 'Contraseña requerida y segura';
      }
      
      if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = 'Las contraseñas no coinciden';
      }

      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
    }

    setStep(step + 1);
    setErrors({});
  };

  /**
   * Retroceder al paso anterior en el registro
   */
  const handlePrevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  // Configuración de animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  /**
   * Renderizar título animado con react-bits style
   */
  const renderAnimatedTitle = () => {
    const titles = {
      login: '¡Bienvenido de vuelta!',
      register: 'Únete a nuestra comunidad',
      'forgot-password': 'Recupera tu contraseña'
    };

    return (
      <motion.div
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        className="text-center mb-6"
      >
        <motion.h1 
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent"
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {titles[currentMode]}
        </motion.h1>
        <motion.p 
          className="text-gray-600 dark:text-gray-400 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {currentMode === 'login' && 'Accede a tu cuenta para continuar'}
          {currentMode === 'register' && 'Crea tu cuenta y comienza a gestionar tu rancho'}
          {currentMode === 'forgot-password' && 'Te ayudamos a recuperar el acceso a tu cuenta'}
        </motion.p>
      </motion.div>
    );
  };

  /**
   * Renderizar campos del formulario de login
   */
  const renderLoginFields = () => (
    <div className="space-y-4">
      <motion.div variants={fieldVariants}>
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={handleInputChange}
            className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          />
        </div>
        {errors.email && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 mt-1"
          >
            {errors.email}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={fieldVariants}>
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Tu contraseña"
            value={formData.password}
            onChange={handleInputChange}
            className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.password && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 mt-1"
          >
            {errors.password}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={fieldVariants} className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="recordarme"
            name="recordarme"
            checked={formData.recordarme}
            onCheckedChange={(checked) => handleInputChange({ target: { name: 'recordarme', type: 'checkbox', checked } })}
          />
          <Label htmlFor="recordarme" className="text-sm">
            Recordarme
          </Label>
        </div>
        
        {allowModeSwitch && (
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={() => handleModeChange('forgot-password')}
            className="px-0"
          >
            ¿Olvidaste tu contraseña?
          </Button>
        )}
      </motion.div>
    </div>
  );

  /**
   * Renderizar campos del formulario de registro - Paso 1
   */
  const renderRegisterStep1 = () => (
    <div className="space-y-4">
      <motion.div variants={fieldVariants}>
        <Label htmlFor="email">Email *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={handleInputChange}
            className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          />
        </div>
        {errors.email && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 mt-1"
          >
            {errors.email}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={fieldVariants}>
        <Label htmlFor="password">Contraseña *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={handleInputChange}
            className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.password && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 mt-1"
          >
            {errors.password}
          </motion.p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número
        </p>
      </motion.div>

      <motion.div variants={fieldVariants}>
        <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Repite tu contraseña"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.confirmPassword && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 mt-1"
          >
            {errors.confirmPassword}
          </motion.p>
        )}
      </motion.div>
    </div>
  );

  /**
   * Renderizar campos del formulario de registro - Paso 2
   */
  const renderRegisterStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <motion.div variants={fieldVariants}>
          <Label htmlFor="nombre">Nombre *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={`pl-10 ${errors.nombre ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
          </div>
          {errors.nombre && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500 mt-1"
            >
              {errors.nombre}
            </motion.p>
          )}
        </motion.div>

        <motion.div variants={fieldVariants}>
          <Label htmlFor="apellido">Apellido *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="apellido"
              name="apellido"
              type="text"
              placeholder="Tu apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              className={`pl-10 ${errors.apellido ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
          </div>
          {errors.apellido && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500 mt-1"
            >
              {errors.apellido}
            </motion.p>
          )}
        </motion.div>
      </div>

      <motion.div variants={fieldVariants}>
        <Label htmlFor="telefono">Teléfono</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="telefono"
            name="telefono"
            type="tel"
            placeholder="+52 999 123 4567"
            value={formData.telefono}
            onChange={handleInputChange}
            className={`pl-10 ${errors.telefono ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          />
        </div>
        {errors.telefono && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 mt-1"
          >
            {errors.telefono}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={fieldVariants}>
        <Label htmlFor="rol_id">Tipo de Cuenta</Label>
        <div className="relative">
          <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
          <Select 
            value={formData.rol_id} 
            onValueChange={(value) => handleInputChange('rol_id', value)}
          >
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Selecciona tu rol" />
            </SelectTrigger>
            <SelectContent>
              {roles?.map((rol) => (
                <SelectItem key={rol.id} value={rol.id.toString()}>
                  {rol.nombre === 'admin' ? 'Administrador' : 
                   rol.nombre === 'veterinario' ? 'Veterinario' : 
                   'Propietario de Rancho'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div variants={fieldVariants} className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terminos"
            name="terminos"
            checked={formData.terminos}
            onCheckedChange={(checked) => handleInputChange({ target: { name: 'terminos', type: 'checkbox', checked } })}
            className={errors.terminos ? 'border-red-500' : ''}
          />
          <Label htmlFor="terminos" className="text-sm leading-relaxed">
            Acepto los{' '}
            <Link to="/terminos" className="text-blue-600 hover:underline">
              términos y condiciones
            </Link>{' '}
            y la{' '}
            <Link to="/privacidad" className="text-blue-600 hover:underline">
              política de privacidad
            </Link>
          </Label>
        </div>
        {errors.terminos && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500"
          >
            {errors.terminos}
          </motion.p>
        )}
      </motion.div>
    </div>
  );

  /**
   * Renderizar campos del formulario de recuperación de contraseña
   */
  const renderForgotPasswordFields = () => (
    <div className="space-y-4">
      <motion.div variants={fieldVariants}>
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Ingresa tu email registrado"
            value={formData.email}
            onChange={handleInputChange}
            className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          />
        </div>
        {errors.email && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 mt-1"
          >
            {errors.email}
          </motion.p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          Te enviaremos un enlace para restablecer tu contraseña
        </p>
      </motion.div>
    </div>
  );

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${compactMode ? 'min-h-fit' : ''}`}>
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{
            rotate: [360, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md relative z-10"
      >
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl">
          <CardHeader className="space-y-1">
            {renderAnimatedTitle()}
            
            {/* Indicador de pasos para registro */}
            {currentMode === 'register' && (
              <div className="flex items-center justify-center space-x-2">
                {[1, 2].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step >= stepNumber 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}
                      animate={step >= stepNumber ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {step > stepNumber ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        stepNumber
                      )}
                    </motion.div>
                    {stepNumber < 2 && (
                      <div 
                        className={`w-8 h-1 mx-2 rounded ${
                          step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                        }`} 
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent>
            {/* Mostrar errores de autenticación */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
              >
                {/* Renderizar campos según el modo */}
                <AnimatePresence mode="wait">
                  {currentMode === 'login' && (
                    <motion.div
                      key="login"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {renderLoginFields()}
                    </motion.div>
                  )}

                  {currentMode === 'register' && step === 1 && (
                    <motion.div
                      key="register-step1"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {renderRegisterStep1()}
                    </motion.div>
                  )}

                  {currentMode === 'register' && step === 2 && (
                    <motion.div
                      key="register-step2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {renderRegisterStep2()}
                    </motion.div>
                  )}

                  {currentMode === 'forgot-password' && (
                    <motion.div
                      key="forgot-password"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {renderForgotPasswordFields()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Botones de acción */}
              <div className="space-y-3">
                {currentMode === 'register' && step === 1 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    Continuar
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                ) : currentMode === 'register' && step === 2 ? (
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Atrás
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creando cuenta...
                        </>
                      ) : (
                        <>
                          Crear cuenta
                          <Shield className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {currentMode === 'login' && 'Iniciando sesión...'}
                        {currentMode === 'forgot-password' && 'Enviando email...'}
                      </>
                    ) : (
                      <>
                        {currentMode === 'login' && (
                          <>
                            Iniciar Sesión
                            <Zap className="ml-2 h-4 w-4" />
                          </>
                        )}
                        {currentMode === 'forgot-password' && 'Enviar Instrucciones'}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>

            {/* Enlaces de cambio de modo */}
            {allowModeSwitch && (
              <div className="mt-6">
                <Separator className="my-4" />
                <div className="text-center space-y-2">
                  {currentMode === 'login' && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ¿No tienes una cuenta?{' '}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => handleModeChange('register')}
                        className="px-0 font-medium"
                      >
                        Regístrate aquí
                      </Button>
                    </p>
                  )}

                  {currentMode === 'register' && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ¿Ya tienes una cuenta?{' '}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => handleModeChange('login')}
                        className="px-0 font-medium"
                      >
                        Inicia sesión
                      </Button>
                    </p>
                  )}

                  {currentMode === 'forgot-password' && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ¿Recordaste tu contraseña?{' '}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => handleModeChange('login')}
                        className="px-0 font-medium"
                      >
                        Volver al login
                      </Button>
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer con información adicional */}
        {!compactMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 text-sm text-gray-500"
          >
            <p>
              Al usar este sistema, aceptas nuestros{' '}
              <Link to="/terminos" className="hover:underline">
                términos de servicio
              </Link>
            </p>
            <p className="mt-2">
              © 2024 Sistema de Gestión Ganadera - UJAT
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthForm;