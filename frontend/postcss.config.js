export default {
  plugins: {
    // Plugin de Tailwind CSS para procesar las clases
    tailwindcss: {},
    
    // Plugin de autoprefixer para compatibilidad con navegadores
    autoprefixer: {
      // Configuración de navegadores soportados
      overrideBrowserslist: [
        "> 1%",
        "last 2 versions",
        "not dead",
        "not ie 11",
        "not op_mini all"
      ],
      
      // Configuración adicional
      grid: "autoplace",
      cascade: false,
    },
    
    // Plugin para optimización en producción
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: [
          'default',
          {
            // Configuración de optimización
            discardComments: {
              removeAll: true,
            },
            normalizeWhitespace: true,
            colormin: true,
            convertValues: true,
            discardDuplicates: true,
            discardEmpty: true,
            mergeRules: true,
            minifyFontValues: true,
            minifyGradients: true,
            minifySelectors: true,
            reduceTransforms: true,
            
            // Preservar algunas características importantes
            autoprefixer: false, // Ya lo manejamos arriba
            calc: false, // Preservar calc() para compatibilidad
            zindex: false, // No modificar z-index automáticamente
          }
        ]
      }
    }),
  },
}