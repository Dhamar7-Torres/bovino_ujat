/**
 * Utilidades para manejo de gráficos y visualizaciones
 * Sistema de gestión de bovinos - Funciones auxiliares para charts
 */

import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

// Paleta de colores para gráficos
export const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  warning: '#F97316',
  info: '#06B6D4',
  success: '#22C55E',
  purple: '#8B5CF6',
  pink: '#EC4899',
  gray: '#6B7280'
};

// Paleta extendida para múltiples series
export const EXTENDED_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6B7280',
  '#14B8A6', '#F472B6', '#A78BFA', '#FB7185', '#34D399'
];

// Configuraciones predeterminadas para diferentes tipos de gráficos
export const DEFAULT_CHART_OPTIONS = {
  line: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    }
  },
  bar: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'top'
      }
    }
  },
  pie: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right'
      }
    }
  },
  doughnut: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'right'
      }
    }
  }
};

/**
 * Genera una paleta de colores para múltiples datasets
 * @param {number} count - Número de colores necesarios
 * @param {number} alpha - Transparencia (0-1)
 */
export const generateColorPalette = (count, alpha = 1) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const color = EXTENDED_COLORS[i % EXTENDED_COLORS.length];
    if (alpha < 1) {
      // Convertir hex a rgba
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      colors.push(`rgba(${r}, ${g}, ${b}, ${alpha})`);
    } else {
      colors.push(color);
    }
  }
  return colors;
};

/**
 * Formatea datos para gráfico de líneas
 * @param {Array} data - Datos originales
 * @param {string} xField - Campo para eje X
 * @param {string} yField - Campo para eje Y
 * @param {string} label - Etiqueta del dataset
 */
export const formatLineChartData = (data, xField, yField, label = 'Serie 1') => {
  return {
    labels: data.map(item => item[xField]),
    datasets: [{
      label,
      data: data.map(item => item[yField]),
      borderColor: CHART_COLORS.primary,
      backgroundColor: `${CHART_COLORS.primary}20`,
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };
};

/**
 * Formatea datos para gráfico de barras
 * @param {Array} data - Datos originales
 * @param {string} xField - Campo para eje X
 * @param {string} yField - Campo para eje Y
 * @param {string} label - Etiqueta del dataset
 */
export const formatBarChartData = (data, xField, yField, label = 'Serie 1') => {
  return {
    labels: data.map(item => item[xField]),
    datasets: [{
      label,
      data: data.map(item => item[yField]),
      backgroundColor: generateColorPalette(data.length, 0.8),
      borderColor: generateColorPalette(data.length),
      borderWidth: 1
    }]
  };
};

/**
 * Formatea datos para gráfico circular (pie/doughnut)
 * @param {Array} data - Datos originales
 * @param {string} labelField - Campo para etiquetas
 * @param {string} valueField - Campo para valores
 */
export const formatPieChartData = (data, labelField, valueField) => {
  return {
    labels: data.map(item => item[labelField]),
    datasets: [{
      data: data.map(item => item[valueField]),
      backgroundColor: generateColorPalette(data.length, 0.8),
      borderColor: generateColorPalette(data.length),
      borderWidth: 1
    }]
  };
};

/**
 * Formatea datos para gráfico de múltiples series
 * @param {Array} data - Datos originales
 * @param {string} xField - Campo para eje X
 * @param {Array} series - Array de objetos {field, label, color?}
 */
export const formatMultiSeriesData = (data, xField, series) => {
  return {
    labels: data.map(item => item[xField]),
    datasets: series.map((serie, index) => ({
      label: serie.label,
      data: data.map(item => item[serie.field]),
      borderColor: serie.color || EXTENDED_COLORS[index],
      backgroundColor: `${serie.color || EXTENDED_COLORS[index]}20`,
      borderWidth: 2,
      fill: false,
      tension: 0.4
    }))
  };
};

/**
 * Genera datos de tendencia temporal
 * @param {Array} data - Datos originales con fechas
 * @param {string} dateField - Campo de fecha
 * @param {string} valueField - Campo de valor
 * @param {string} period - Período de agrupación: 'day', 'week', 'month'
 */
export const generateTrendData = (data, dateField, valueField, period = 'day') => {
  if (!data || data.length === 0) return { labels: [], datasets: [] };

  // Agrupar datos por período
  const groupedData = {};
  
  data.forEach(item => {
    const date = parseISO(item[dateField]);
    let key;
    
    switch (period) {
      case 'day':
        key = format(date, 'yyyy-MM-dd');
        break;
      case 'week':
        key = format(date, 'yyyy-\'W\'w');
        break;
      case 'month':
        key = format(date, 'yyyy-MM');
        break;
      default:
        key = format(date, 'yyyy-MM-dd');
    }
    
    if (!groupedData[key]) {
      groupedData[key] = { total: 0, count: 0 };
    }
    
    groupedData[key].total += parseFloat(item[valueField]) || 0;
    groupedData[key].count += 1;
  });

  // Convertir a arrays ordenados
  const sortedKeys = Object.keys(groupedData).sort();
  const labels = sortedKeys.map(key => {
    const date = parseISO(key + (period === 'month' ? '-01' : ''));
    return format(date, period === 'month' ? 'MMM yyyy' : 'dd/MM', { locale: es });
  });
  
  const values = sortedKeys.map(key => 
    groupedData[key].total / groupedData[key].count
  );

  return formatLineChartData(
    labels.map((label, index) => ({ label, value: values[index] })),
    'label',
    'value',
    'Tendencia'
  );
};

/**
 * Calcula estadísticas básicas para mostrar en gráficos
 * @param {Array} data - Array de números
 */
export const calculateChartStats = (data) => {
  if (!data || data.length === 0) {
    return { min: 0, max: 0, avg: 0, total: 0 };
  }

  const numbers = data.filter(num => !isNaN(num));
  const total = numbers.reduce((sum, num) => sum + num, 0);
  const avg = total / numbers.length;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  return {
    min: parseFloat(min.toFixed(2)),
    max: parseFloat(max.toFixed(2)),
    avg: parseFloat(avg.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
};

/**
 * Genera opciones de gráfico con configuración personalizada
 * @param {string} type - Tipo de gráfico
 * @param {Object} customOptions - Opciones personalizadas
 */
export const generateChartOptions = (type, customOptions = {}) => {
  const baseOptions = DEFAULT_CHART_OPTIONS[type] || DEFAULT_CHART_OPTIONS.line;
  
  return {
    ...baseOptions,
    ...customOptions,
    plugins: {
      ...baseOptions.plugins,
      ...customOptions.plugins
    },
    scales: {
      ...baseOptions.scales,
      ...customOptions.scales
    }
  };
};

/**
 * Convierte datos para gráfico de área apilada
 * @param {Array} data - Datos originales
 * @param {string} xField - Campo para eje X
 * @param {Array} stackFields - Campos para apilar
 */
export const formatStackedAreaData = (data, xField, stackFields) => {
  return {
    labels: data.map(item => item[xField]),
    datasets: stackFields.map((field, index) => ({
      label: field.label || field.name,
      data: data.map(item => item[field.name] || 0),
      backgroundColor: generateColorPalette(stackFields.length, 0.6)[index],
      borderColor: generateColorPalette(stackFields.length)[index],
      borderWidth: 1,
      fill: true
    }))
  };
};

/**
 * Genera datos para gráfico de comparación
 * @param {Array} currentData - Datos del período actual
 * @param {Array} previousData - Datos del período anterior
 * @param {string} labelField - Campo de etiquetas
 * @param {string} valueField - Campo de valores
 */
export const generateComparisonData = (currentData, previousData, labelField, valueField) => {
  const labels = [...new Set([
    ...currentData.map(item => item[labelField]),
    ...previousData.map(item => item[labelField])
  ])];

  return {
    labels,
    datasets: [
      {
        label: 'Período Actual',
        data: labels.map(label => {
          const item = currentData.find(d => d[labelField] === label);
          return item ? item[valueField] : 0;
        }),
        backgroundColor: CHART_COLORS.primary + '80',
        borderColor: CHART_COLORS.primary,
        borderWidth: 2
      },
      {
        label: 'Período Anterior',
        data: labels.map(label => {
          const item = previousData.find(d => d[labelField] === label);
          return item ? item[valueField] : 0;
        }),
        backgroundColor: CHART_COLORS.secondary + '80',
        borderColor: CHART_COLORS.secondary,
        borderWidth: 2
      }
    ]
  };
};

/**
 * Exporta gráfico como imagen
 * @param {Object} chartRef - Referencia al gráfico
 * @param {string} filename - Nombre del archivo
 * @param {string} format - Formato: 'png', 'jpeg'
 */
export const exportChartAsImage = (chartRef, filename = 'chart', format = 'png') => {
  if (!chartRef || !chartRef.current) return;

  const canvas = chartRef.current.canvas;
  const url = canvas.toDataURL(`image/${format}`);
  
  const link = document.createElement('a');
  link.download = `${filename}.${format}`;
  link.href = url;
  link.click();
};

/**
 * Redimensiona gráfico según el contenedor
 * @param {Object} chartRef - Referencia al gráfico
 */
export const resizeChart = (chartRef) => {
  if (chartRef && chartRef.current) {
    chartRef.current.resize();
  }
};

/**
 * Configuración responsiva para diferentes tamaños de pantalla
 */
export const RESPONSIVE_OPTIONS = {
  mobile: {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45
        }
      }
    }
  },
  tablet: {
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  },
  desktop: {
    plugins: {
      legend: {
        position: 'top'
      }
    }
  }
};

/**
 * Obtiene configuración responsiva según el ancho de pantalla
 * @param {number} width - Ancho de pantalla en píxeles
 */
export const getResponsiveConfig = (width) => {
  if (width < 768) return RESPONSIVE_OPTIONS.mobile;
  if (width < 1024) return RESPONSIVE_OPTIONS.tablet;
  return RESPONSIVE_OPTIONS.desktop;
};

// Exportar todas las funciones como objeto por defecto
export default {
  CHART_COLORS,
  EXTENDED_COLORS,
  DEFAULT_CHART_OPTIONS,
  generateColorPalette,
  formatLineChartData,
  formatBarChartData,
  formatPieChartData,
  formatMultiSeriesData,
  generateTrendData,
  calculateChartStats,
  generateChartOptions,
  formatStackedAreaData,
  generateComparisonData,
  exportChartAsImage,
  resizeChart,
  RESPONSIVE_OPTIONS,
  getResponsiveConfig
};