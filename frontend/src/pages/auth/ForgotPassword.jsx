import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, Cow, Send, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  // Estados para manejar el formulario y la UI
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(0);

  // Animaciones para los componentes
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, delay: 0.2 }
    }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  const iconVariants = {
    spin: {
      rotate: 360,
      transition: { duration: 2, repeat: Infinity, ease: "linear" }
    },
    bounce: {
      y: [0, -10, 0],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
    }
  };

  // Manejar cambios en el input del email
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    
    // Limpiar errores cuando el usuario empieza a escribir
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  };

  // Validar email
  const validateEmail = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email format is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Iniciar contador de reenvío
  const startResendTimer = () => {
    setResendTimer(60); // 60 segundos
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    setIsLoading(true);
    
    try {
      // Aquí se implementará la llamada a la API
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setIsEmailSent(true);
        startResendTimer();
      } else {
        const errorData = await response.json();
        setErrors({ 
          general: errorData.message || 'Failed to send reset email' 
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setErrors({ 
        general: 'Connection error. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar reenvío de email
  const handleResendEmail = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        startResendTimer();
      } else {
        const errorData = await response.json();
        setErrors({ 
          general: errorData.message || 'Failed to resend email' 
        });
      }
    } catch (error) {
      console.error('Resend email error:', error);
      setErrors({ 
        general: 'Connection error. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo y título animado */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.div
            className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Cow className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            {isEmailSent 
              ? "Check your email for reset instructions"
              : "Enter your email to receive reset instructions"
            }
          </p>
        </motion.div>

        {/* Formulario o mensaje de éxito */}
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-95"
        >
          {!isEmailSent ? (
            // Formulario de email
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error general */}
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                >
                  {errors.general}
                </motion.div>
              )}

              {/* Campo Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Botón Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                variants={buttonVariants}
                whileHover={!isLoading ? "hover" : ""}
                whileTap={!isLoading ? "tap" : ""}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 shadow-lg'
                }`}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      variants={iconVariants}
                      animate="spin"
                      className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                    />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Reset Instructions
                  </>
                )}
              </motion.button>

              {/* Link de regreso */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <Link
                  to="/auth/login"
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Link>
              </motion.div>
            </form>
          ) : (
            // Mensaje de éxito
            <motion.div
              variants={successVariants}
              initial="hidden"
              animate="visible"
              className="text-center space-y-6"
            >
              {/* Icono de éxito animado */}
              <motion.div
                variants={iconVariants}
                animate="bounce"
                className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>

              {/* Mensaje */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  Email Sent Successfully!
                </h3>
                <p className="text-gray-600">
                  We've sent password reset instructions to:
                </p>
                <p className="font-medium text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">
                  {email}
                </p>
              </div>

              {/* Instrucciones */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <div className="flex items-start space-x-2">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="font-medium">Check your email</p>
                    <p>Click the reset link in the email to create a new password.</p>
                    <p className="text-xs">If you don't see the email, check your spam folder.</p>
                  </div>
                </div>
              </div>

              {/* Botón de reenvío */}
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Didn't receive the email?
                </p>
                
                <motion.button
                  onClick={handleResendEmail}
                  disabled={isLoading || resendTimer > 0}
                  variants={buttonVariants}
                  whileHover={(!isLoading && resendTimer === 0) ? "hover" : ""}
                  whileTap={(!isLoading && resendTimer === 0) ? "tap" : ""}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                    isLoading || resendTimer > 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        variants={iconVariants}
                        animate="spin"
                        className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400 mr-2"
                      />
                      Sending...
                    </>
                  ) : resendTimer > 0 ? (
                    <>
                      <Clock className="w-5 h-5 mr-2" />
                      Resend in {resendTimer}s
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Resend Email
                    </>
                  )}
                </motion.button>
              </div>

              {/* Link de regreso */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-4 border-t border-gray-200"
              >
                <Link
                  to="/auth/login"
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Link>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer con información adicional */}
        {!isEmailSent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-6"
          >
            <p className="text-sm text-gray-500">
              Remember your password?{' '}
              <Link
                to="/auth/login"
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Sign in instead
              </Link>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;