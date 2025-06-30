import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Cow } from 'lucide-react';

const Error404 = () => {
  const navigate = useNavigate();

  // Variantes de animación para framer motion
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cowVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 1
      }
    }
  };

  // Función para volver a la página anterior
  const handleGoBack = () => {
    navigate(-1);
  };

  // Función para ir al inicio
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        className="text-center max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Icono de vaca animado */}
        <motion.div
          className="mb-8 flex justify-center"
          variants={cowVariants}
        >
          <div className="relative">
            <Cow className="w-32 h-32 text-green-600" />
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              !
            </motion.div>
          </div>
        </motion.div>

        {/* Título animado */}
        <motion.h1
          className="text-8xl font-bold text-green-700 mb-4"
          variants={itemVariants}
          animate={{
            textShadow: [
              "0px 0px 0px rgba(34, 197, 94, 0)",
              "0px 0px 20px rgba(34, 197, 94, 0.5)",
              "0px 0px 0px rgba(34, 197, 94, 0)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          404
        </motion.h1>

        {/* Subtítulo */}
        <motion.h2
          className="text-3xl font-semibold text-gray-700 mb-4"
          variants={itemVariants}
        >
          ¡Ups! Página no encontrada
        </motion.h2>

        {/* Descripción */}
        <motion.p
          className="text-gray-600 text-lg mb-8 leading-relaxed"
          variants={itemVariants}
        >
          Parece que la vaca se perdió en el pastizal digital. 
          La página que buscas no existe o ha sido movida a otro corral.
        </motion.p>

        {/* Botones de acción */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          <motion.button
            onClick={handleGoHome}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-5 h-5" />
            Volver al Inicio
          </motion.button>

          <motion.button
            onClick={handleGoBack}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Página Anterior
          </motion.button>
        </motion.div>

        {/* Texto animado adicional */}
        <motion.div
          className="mt-12 text-sm text-gray-500"
          variants={itemVariants}
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          Sistema de Gestión Ganadera v1.0
        </motion.div>
      </motion.div>

      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-300 rounded-full opacity-60"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-6 h-6 bg-blue-300 rounded-full opacity-40"
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-3 h-3 bg-green-400 rounded-full opacity-50"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
    </div>
  );
};

export default Error404;