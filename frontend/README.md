# 🐄 Sistema de Gestión de Bovinos - Frontend

> Sistema web completo para la gestión integral de ganado bovino desarrollado para la Universidad Juárez Autónoma de Tabasco (UJAT)

## 📋 Índice

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Desarrollo](#desarrollo)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Componentes Principales](#componentes-principales)
- [Guías de Desarrollo](#guías-de-desarrollo)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contribución](#contribución)
- [Licencia](#licencia)

## 🎯 Descripción

El Sistema de Gestión de Bovinos es una aplicación web moderna construida con React y Vite que permite administrar de manera integral un rancho ganadero. Incluye funcionalidades para el registro de animales, control sanitario, producción, reproducción, inventario y finanzas, con soporte para geolocalización y visualizaciones 3D.

### ✨ Características Principales

- 📊 **Dashboard Interactivo** con métricas en tiempo real
- 🐄 **Gestión de Bovinos** con registro completo e identificación única
- 🏥 **Control Sanitario** con programación de vacunas y tratamientos
- 🥛 **Control de Producción** (leche, carne, reproducción)
- 📍 **Geolocalización** con mapas interactivos para ubicación de actividades
- 🎨 **Modelos 3D** interactivos para mejor experiencia de usuario
- 📱 **Responsive Design** optimizado para desktop, tablet y móvil
- 🌙 **Modo Oscuro/Claro** para mejor experiencia visual
- 📈 **Reportes y Analytics** con gráficos avanzados
- 🔒 **Autenticación Segura** con JWT y roles de usuario
- 🌐 **PWA Ready** para instalación como app nativa

## 🛠️ Tecnologías

### Core
- **React 18** - Librería principal de UI con Hooks y Concurrent Features
- **Vite** - Build tool ultrarrápido con HMR optimizado
- **TypeScript** - Tipado estático para mayor robustez
- **React Router DOM** - Navegación SPA con lazy loading

### UI/UX
- **Tailwind CSS** - Framework de utilidades CSS
- **ShadCN UI** - Componentes UI modernos basados en Radix UI
- **Framer Motion** - Animaciones fluidas y transiciones
- **React Bits** - Componentes de texto animados
- **Magic UI** - Componentes adicionales con efectos visuales
- **Lucide React** - Iconografía moderna y consistente

### Mapas y Geolocalización
- **Leaflet** - Mapas interactivos ligeros
- **React Leaflet** - Integración de Leaflet con React
- **OpenStreetMap** - Datos cartográficos gratuitos

### 3D y Visualizaciones
- **Spline** - Modelos 3D interactivos en el navegador
- **Recharts** - Gráficos y charts responsivos
- **D3.js** - Visualizaciones de datos avanzadas

### Estado y Datos
- **React Query (TanStack Query)** - Gestión de estado servidor
- **Zustand** - Estado global ligero
- **React Hook Form** - Formularios performantes
- **Zod** - Validación de esquemas TypeScript-first

### Desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo automático
- **Husky** - Git hooks para calidad de código
- **Vitest** - Testing framework rápido
- **Storybook** - Documentación de componentes

## 🚀 Instalación

### Prerrequisitos

- Node.js >= 18.0.0
- npm >= 9.0.0 o yarn >= 1.22.0
- Backend API corriendo en puerto 5000

### Instalación Paso a Paso

1. **Clonar el repositorio**
```bash
git clone https://github.com/ujat/bovine-management-system.git
cd bovine-management-system/frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

4. **Editar variables de entorno**
```bash
# Editar .env.local con tus configuraciones
VITE_API_URL=http://localhost:5000
VITE_MAPBOX_ACCESS_TOKEN=tu_token_aqui
# ... otras variables
```

5. **Iniciar desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## ⚙️ Configuración

### Variables de Entorno Esenciales

```env
# API Backend
VITE_API_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000/api

# Mapas (Opcional - usa OpenStreetMap por defecto)
VITE_MAPBOX_ACCESS_TOKEN=tu_mapbox_token

# Spline 3D Models
VITE_SPLINE_COW_MODEL=https://prod.spline.design/tu_modelo/scene.splinecode

# Ubicación por defecto (Tabasco, México)
VITE_DEFAULT_LAT=17.9892
VITE_DEFAULT_LNG=-92.9475
```

### Configuración de Desarrollo

```env
# Configuración de desarrollo
VITE_DEBUG_MODE=true
VITE_MOCK_API=false
VITE_SHOW_PERFORMANCE_METRICS=true
```

## 🏗️ Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo
npm run dev:host         # Inicia con acceso desde red local

# Build
npm run build            # Construye para producción
npm run preview          # Previsualiza build de producción

# Calidad de Código
npm run lint             # Ejecuta ESLint
npm run lint:fix         # Arregla problemas de ESLint automáticamente
npm run format           # Formatea código con Prettier
npm run type-check       # Verifica tipos de TypeScript

# Testing
npm run test             # Ejecuta tests
npm run test:ui          # Tests con interfaz visual
npm run test:coverage    # Tests con reporte de cobertura

# Utilidades
npm run clean            # Limpia cache y build
npm run analyze          # Analiza bundle size
```

### Estructura del Proyecto

```
frontend/
├── public/                 # Archivos estáticos
│   ├── index.html         # HTML principal
│   ├── favicon.ico        # Icono de la app
│   └── manifest.json      # Manifest PWA
│
├── src/                   # Código fuente
│   ├── components/        # Componentes reutilizables
│   │   ├── common/       # Componentes comunes
│   │   ├── forms/        # Formularios
│   │   ├── charts/       # Gráficos
│   │   ├── maps/         # Componentes de mapas
│   │   └── animations/   # Componentes animados
│   │
│   ├── pages/            # Páginas de la aplicación
│   │   ├── auth/         # Autenticación
│   │   ├── dashboard/    # Dashboard principal
│   │   ├── bovines/      # Gestión de bovinos
│   │   ├── health/       # Control sanitario
│   │   ├── production/   # Producción
│   │   └── reports/      # Reportes
│   │
│   ├── hooks/            # Custom hooks
│   ├── context/          # Context providers
│   ├── utils/            # Funciones utilitarias
│   ├── types/            # Definiciones TypeScript
│   ├── api/              # Servicios API
│   ├── styles/           # Estilos globales
│   └── assets/           # Assets estáticos
│
├── .env.example          # Variables de entorno ejemplo
├── vite.config.js        # Configuración Vite
├── tailwind.config.js    # Configuración Tailwind
├── postcss.config.js     # Configuración PostCSS
└── package.json          # Dependencias y scripts
```

## 🧩 Componentes Principales

### Layout y Navegación
- `Layout/MainLayout` - Layout principal con sidebar
- `Navigation/Navigation` - Navegación principal
- `Navigation/Breadcrumbs` - Breadcrumbs dinámicos

### Formularios
- `BovineForm` - Registro y edición de bovinos
- `HealthForm` - Formularios de salud veterinaria
- `ProductionForm` - Registro de producción

### Mapas y Geolocalización
- `LocationPicker` - Selector de ubicación con Leaflet
- `BovineLocationMap` - Mapa de ubicaciones de bovinos
- `RanchMap` - Mapa general del rancho

### Visualizaciones
- `ProductionChart` - Gráficos de producción
- `HealthChart` - Métricas de salud
- `DashboardCharts` - Charts del dashboard principal

### 3D y Animaciones
- `SplineModels` - Componentes 3D con Spline
- `AnimatedText` - Textos animados con React Bits
- `LoadingSpinner` - Spinners de carga animados

## 📝 Guías de Desarrollo

### Creando un Nuevo Componente

```bash
# Crear estructura de componente
mkdir src/components/MiComponente
touch src/components/MiComponente/{MiComponente.jsx,index.js}
```

```jsx
// MiComponente.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const MiComponente = ({ className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('clase-base', className)}
      {...props}
    >
      {/* Contenido del componente */}
    </motion.div>
  );
};

export default MiComponente;
```

### Integrando con la API

```jsx
// Usando React Query para API calls
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';

const useBovines = () => {
  return useQuery({
    queryKey: ['bovines'],
    queryFn: () => api.get('/bovines'),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
```

### Agregando Animaciones

```jsx
// Usando Framer Motion
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
};

<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
  transition={{ duration: 0.5 }}
>
  Contenido animado
</motion.div>
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests básicos
npm run test

# Tests con interfaz visual
npm run test:ui

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Escribir Tests

```jsx
// Ejemplo de test de componente
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import MiComponente from './MiComponente';

describe('MiComponente', () => {
  it('renderiza correctamente', () => {
    render(<MiComponente />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

## 🚀 Deployment

### Build para Producción

```bash
npm run build
```

### Variables de Entorno para Producción

```env
NODE_ENV=production
VITE_API_URL=https://api.bovino-ujat.com
VITE_DEBUG_MODE=false
VITE_DROP_CONSOLE=true
```

### Configuración para Diferentes Plataformas

#### Vercel
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

#### Netlify
```toml
[build]
  command = "npm run build"
  publish = "dist"
```

## 🤝 Contribución

### Guía de Contribución

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. **Commit** tus cambios (`git commit -m 'Agregar nueva característica'`)
4. **Push** a la rama (`git push origin feature/nueva-caracteristica`)
5. **Abre** un Pull Request

### Estándares de Código

- Usar **Conventional Commits** para mensajes de commit
- Seguir las reglas de **ESLint** y **Prettier**
- Escribir **tests** para nuevas funcionalidades
- Documentar **componentes** nuevos

### Conventional Commits

```
feat: agregar componente de geolocalización
fix: corregir bug en formulario de bovinos
docs: actualizar README con nuevas instrucciones
style: mejorar estilos del dashboard
refactor: reestructurar componentes de mapas
test: agregar tests para ProductionChart
```

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo de Desarrollo

- **Universidad Juárez Autónoma de Tabasco (UJAT)**
- **División Académica de Ciencias Biológicas**
- **Carrera de Medicina Veterinaria y Zootecnia**

## 📞 Soporte

- **Email**: soporte@bovino-ujat.com
- **Teléfono**: +52 (993) 123-4567
- **Sitio Web**: https://bovino-ujat.com

## 🙏 Agradecimientos

- **UJAT** por el apoyo institucional
- **Comunidad Open Source** por las herramientas utilizadas
- **Productores Ganaderos de Tabasco** por sus valiosas sugerencias

---

**Desarrollado con ❤️ para la gestión moderna de la ganadería en Tabasco, México**