import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@styles': resolve(__dirname, './src/styles'),
      '@assets': resolve(__dirname, './src/assets'),
      '@lib': resolve(__dirname, './src/lib'),
      '@api': resolve(__dirname, './src/api'),
    }
  },

  server: {
    port: 5173,
    host: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-popover', 'lucide-react'],
          'animations': ['framer-motion'],
          'utils': ['axios', 'date-fns', 'lodash', 'uuid']
        }
      }
    }
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'axios',
      'date-fns',
      'lodash',
      'uuid',
      'clsx',
      'tailwind-merge'
    ]
  }
});