// src/components/charts/ProductionChart.jsx
// Componente para visualizar análisis de producción de bovinos

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar, ComposedChart, ReferenceLine
} from 'recharts';
import {
  Milk, TrendingUp, TrendingDown, BarChart3, Calendar,
  Download, RefreshCw, Filter, Target, Award, AlertCircle,
  Droplets, Beef, Scale, Clock, MapPin, Zap, Save
} from 'lucide-react';

const ProductionChart = () => {
  // Estados para datos de producción
  const [milkProductionData, setMilkProductionData] = useState([]);
  const [meatProductionData, setMeatProductionData] = useState([]);
  const [productionSummary, setProductionSummary] = useState({});
  const [productionTrends, setProductionTrends] = useState([]);
  const [qualityMetrics, setQualityMetrics] = useState([]);
  
  // Estados para filtros y configuración
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedRanch, setSelectedRanch] = useState('all');
  const [selectedProductionType, setSelectedProductionType] = useState('all');
  const [selectedBovine, setSelectedBovine] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date()
  });
  
  // Estados para controles de visualización
  const [showProjections, setShowProjections] = useState(false);
  const [showQualityData, setShowQualityData] = useState(true);
  const [chartType, setChartType] = useState('line');
  const [compareMode, setCompareMode] = useState(false);
  
  // Estados para control de la interfaz
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Estados para metadatos
  const [ranches, setRanches] = useState([]);
  const [bovines, setBovines] = useState([]);
  const [productionTypes, setProductionTypes] = useState([]);
  const [productionGoals, setProductionGoals] = useState({
    milk: 1000,
    meat: 500,
    revenue: 50000,
    efficiency: 85
  });

  // Colores para los gráficos de producción
  const chartColors = {
    milk: '#3B82F6',
    meat: '#EF4444',
    quality: '#10B981',
    projection: '#8B5CF6',
    goal: '#F59E0B',
    trend: '#6B7280',
    revenue: '#059669',
    cost: '#DC2626'
  };

  // Tabs de producción
  const productionTabs = [
    { id: 'overview', name: 'Resumen', icon: BarChart3 },
    { id: 'milk', name: 'Leche', icon: Milk },
    { id: 'meat', name: 'Carne', icon: Beef },
    { id: 'quality', name: 'Calidad', icon: Award },
    { id: 'trends', name: 'Tendencias', icon: TrendingUp }
  ];

  // Períodos disponibles
  const periods = [
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
    { value: 'quarter', label: 'Trimestre' },
    { value: 'year', label: 'Año' },
    { value: 'custom', label: 'Personalizado' }
  ];

  // Tipos de producción
  const productionTypesOptions = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'milk', label: 'Leche' },
    { value: 'meat', label: 'Carne' },
    { value: 'dairy', label: 'Lácteos' }
  ];

  // Animaciones para los componentes
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Recargar datos cuando cambian los filtros
  useEffect(() => {
    if (!loading) {
      loadProductionData();
    }
  }, [selectedPeriod, selectedRanch, selectedProductionType, selectedBovine, dateRange]);

  // Función para cargar datos iniciales
  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Simular carga de metadatos
      const mockRanches = [
        { id: '1', nombre: 'Rancho El Paraíso' },
        { id: '2', nombre: 'Rancho San Miguel' },
        { id: '3', nombre: 'Rancho La Esperanza' }
      ];
      
      const mockBovines = [
        { id: '1', numero_identificacion: 'BOV001', nombre: 'Vaca Linda' },
        { id: '2', numero_identificacion: 'BOV002', nombre: 'Toro Bravo' },
        { id: '3', numero_identificacion: 'BOV003', nombre: 'Vaca Negra' }
      ];

      const mockProductionTypes = [
        { id: '1', nombre: 'Leche' },
        { id: '2', nombre: 'Carne' },
        { id: '3', nombre: 'Lácteos' }
      ];
      
      setRanches(mockRanches);
      setBovines(mockBovines);
      setProductionTypes(mockProductionTypes);
      
      await loadProductionData();
      
    } catch (error) {
      console.error('Error al cargar datos iniciales de producción:', error);
      setErrors({ general: 'Error al cargar datos iniciales' });
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar datos de producción
  const loadProductionData = async () => {
    try {
      // Simular datos de producción de leche
      const mockMilkData = [
        { date: '2024-01-01', production: 250, quality: 85, revenue: 1500 },
        { date: '2024-01-02', production: 280, quality: 87, revenue: 1680 },
        { date: '2024-01-03', production: 275, quality: 86, revenue: 1650 },
        { date: '2024-01-04', production: 290, quality: 88, revenue: 1740 },
        { date: '2024-01-05', production: 265, quality: 85, revenue: 1590 }
      ];

      // Simular datos de producción de carne
      const mockMeatData = [
        { date: '2024-01-01', production: 120, quality: 90, revenue: 3600 },
        { date: '2024-01-02', production: 135, quality: 92, revenue: 4050 },
        { date: '2024-01-03', production: 128, quality: 91, revenue: 3840 },
        { date: '2024-01-04', production: 142, quality: 93, revenue: 4260 },
        { date: '2024-01-05', production: 130, quality: 90, revenue: 3900 }
      ];

      // Simular resumen de producción
      const mockSummary = {
        totalMilk: 1360,
        totalMeat: 655,
        totalRevenue: 41420,
        averageEfficiency: 87.5,
        averageQuality: 4.2,
        milkTrend: 'up',
        meatTrend: 'up',
        revenueTrend: 'up',
        milkChange: 5.2,
        meatChange: 3.8,
        revenueChange: 7.1,
        profitMargin: 32
      };

      // Simular tendencias de producción
      const mockTrends = [
        { period: 'Ene', milk: 8500, meat: 4200, revenue: 125000 },
        { period: 'Feb', milk: 9200, meat: 4500, revenue: 138000 },
        { period: 'Mar', milk: 8800, meat: 4300, revenue: 132000 },
        { period: 'Abr', milk: 9500, meat: 4700, revenue: 145000 },
        { period: 'May', milk: 9100, meat: 4400, revenue: 140000 }
      ];

      // Simular métricas de calidad
      const mockQuality = [
        { category: 'Excelente', value: 45, color: '#10B981' },
        { category: 'Buena', value: 35, color: '#3B82F6' },
        { category: 'Regular', value: 15, color: '#F59E0B' },
        { category: 'Deficiente', value: 5, color: '#EF4444' }
      ];

      setMilkProductionData(mockMilkData);
      setMeatProductionData(mockMeatData);
      setProductionSummary(mockSummary);
      setProductionTrends(mockTrends);
      setQualityMetrics(mockQuality);

    } catch (error) {
      console.error('Error al cargar datos de producción:', error);
      setErrors({ production: 'Error al cargar datos de producción' });
    }
  };

  // Función para exportar datos de producción
  const exportProductionData = async () => {
    try {
      const exportData = {
        milkProduction: milkProductionData,
        meatProduction: meatProductionData,
        summary: productionSummary,
        trends: productionTrends,
        quality: qualityMetrics,
        filters: {
          period: selectedPeriod,
          ranch: selectedRanch,
          productionType: selectedProductionType,
          bovine: selectedBovine,
          dateRange,
          showProjections,
          showQualityData
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `production-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error al exportar datos de producción:', error);
      setErrors({ export: 'Error al exportar datos' });
    }
  };

  // Manejar cambios en filtros
  const handleInputChange = (field, value) => {
    switch (field) {
      case 'period':
        setSelectedPeriod(value);
        break;
      case 'ranch':
        setSelectedRanch(value);
        break;
      case 'productionType':
        setSelectedProductionType(value);
        break;
      case 'bovine':
        setSelectedBovine(value);
        break;
      case 'showProjections':
        setShowProjections(value);
        break;
      case 'showQualityData':
        setShowQualityData(value);
        break;
      default:
        break;
    }
  };

  // Función para formatear números
  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-MX').format(num);
  };

  // Función para formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  // Componente de tooltip personalizado para gráficos
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
        >
          <p className="font-semibold text-gray-800 mb-2">{new Date(label).toLocaleDateString()}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}:</span>
              </div>
              <span className="text-sm font-medium" style={{ color: entry.color }}>
                {formatNumber(entry.value)}
                {entry.unit && <span className="text-xs text-gray-500 ml-1">{entry.unit}</span>}
              </span>
            </div>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  // Renderizar resumen de métricas de producción
  const renderProductionMetricsSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Producción total de leche */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Producción de Leche</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatNumber(productionSummary.totalMilk || 0)} L
            </p>
            <div className="flex items-center mt-1">
              {productionSummary.milkTrend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className="text-xs text-gray-500">
                {Math.abs(productionSummary.milkChange || 0)}% vs período anterior
              </span>
            </div>
          </div>
          <Milk className="h-8 w-8 text-blue-500" />
        </div>
        <div className="mt-3">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(((productionSummary.totalMilk || 0) / productionGoals.milk) * 100, 100)}%` 
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round(((productionSummary.totalMilk || 0) / productionGoals.milk) * 100)}% del objetivo
          </p>
        </div>
      </motion.div>

      {/* Producción de carne */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Producción de Carne</p>
            <p className="text-2xl font-bold text-red-600">
              {formatNumber(productionSummary.totalMeat || 0)} kg
            </p>
            <div className="flex items-center mt-1">
              {productionSummary.meatTrend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className="text-xs text-gray-500">
                {Math.abs(productionSummary.meatChange || 0)}% vs período anterior
              </span>
            </div>
          </div>
          <Beef className="h-8 w-8 text-red-500" />
        </div>
        <div className="mt-3">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(((productionSummary.totalMeat || 0) / productionGoals.meat) * 100, 100)}%` 
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round(((productionSummary.totalMeat || 0) / productionGoals.meat) * 100)}% del objetivo
          </p>
        </div>
      </motion.div>

      {/* Ingresos por producción */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(productionSummary.totalRevenue || 0)}
            </p>
            <div className="flex items-center mt-1">
              {productionSummary.revenueTrend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className="text-xs text-gray-500">
                {Math.abs(productionSummary.revenueChange || 0)}% vs período anterior
              </span>
            </div>
          </div>
          <Target className="h-8 w-8 text-green-500" />
        </div>
        <div className="mt-3">
          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full inline-block">
            Margen: {productionSummary.profitMargin || 0}%
          </div>
        </div>
      </motion.div>

      {/* Eficiencia promedio */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Eficiencia Promedio</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatNumber(productionSummary.averageEfficiency || 0)}%
            </p>
            <div className="flex items-center mt-1">
              <Award className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-xs text-gray-500">
                Calidad: {productionSummary.averageQuality || 0}/5
              </span>
            </div>
          </div>
          <Zap className="h-8 w-8 text-purple-500" />
        </div>
        <div className="mt-3">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`w-3 h-3 rounded-full ${
                  star <= (productionSummary.averageQuality || 0)
                    ? 'bg-yellow-400'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Renderizar controles de filtros
  const renderFilters = () => (
    <motion.div variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Análisis de Producción</h2>
        <p className="text-gray-600">Monitoreo y análisis de la producción ganadera</p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {/* Selector de período */}
        <select
          value={selectedPeriod}
          onChange={(e) => handleInputChange('period', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {periods.map(period => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>

        {/* Selector de tipo de producción */}
        <select
          value={selectedProductionType}
          onChange={(e) => handleInputChange('productionType', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {productionTypesOptions.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        {/* Selector de rancho */}
        <select
          value={selectedRanch}
          onChange={(e) => handleInputChange('ranch', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Todos los ranchos</option>
          {ranches.map(ranch => (
            <option key={ranch.id} value={ranch.id}>
              {ranch.nombre}
            </option>
          ))}
        </select>

        {/* Controles adicionales */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="projections"
              checked={showProjections}
              onChange={(e) => handleInputChange('showProjections', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="projections" className="text-sm text-gray-600">
              Proyecciones
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="quality"
              checked={showQualityData}
              onChange={(e) => handleInputChange('showQualityData', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="quality" className="text-sm text-gray-600">
              Calidad
            </label>
          </div>
        </div>

        {/* Botón de actualizar */}
        <button
          onClick={loadProductionData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>

        {/* Botón de exportar */}
        <button
          onClick={exportProductionData}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Exportar</span>
        </button>
      </div>
    </motion.div>
  );

  // Renderizar tabs de producción
  const renderProductionTabs = () => (
    <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
      {productionTabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.name}</span>
          </button>
        );
      })}
    </div>
  );

  // Renderizar contenido de tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Gráfico de tendencias combinado */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Tendencias de Producción</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Comparación de producción por período
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={productionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="milk" fill={chartColors.milk} name="Leche (L)" />
                  <Bar dataKey="meat" fill={chartColors.meat} name="Carne (kg)" />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={chartColors.revenue}
                    strokeWidth={3}
                    name="Ingresos (MXN)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Distribución de calidad */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Distribución de Calidad</h3>
              <p className="text-gray-600 text-sm mb-4">Categorías de calidad de la producción</p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={qualityMetrics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, value }) => `${category}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {qualityMetrics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'milk':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <Milk className="h-5 w-5 mr-2 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Producción de Leche</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Análisis detallado de la producción lechera
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={milkProductionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="production"
                  fill={chartColors.milk}
                  name="Producción (L)"
                />
                <Line
                  type="monotone"
                  dataKey="quality"
                  stroke={chartColors.quality}
                  strokeWidth={2}
                  name="Calidad (%)"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={chartColors.revenue}
                  strokeWidth={2}
                  name="Ingresos (MXN)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        );

      case 'meat':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <Beef className="h-5 w-5 mr-2 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Producción de Carne</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Análisis detallado de la producción cárnica
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={meatProductionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="production"
                  fill={chartColors.meat}
                  name="Producción (kg)"
                />
                <Line
                  type="monotone"
                  dataKey="quality"
                  stroke={chartColors.quality}
                  strokeWidth={2}
                  name="Calidad (%)"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={chartColors.revenue}
                  strokeWidth={2}
                  name="Ingresos (MXN)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        );

      case 'quality':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <Award className="h-5 w-5 mr-2 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Métricas de Calidad</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Análisis de calidad de toda la producción
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de calidad por tiempo */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Evolución de Calidad</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={milkProductionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[70, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="quality"
                      stroke={chartColors.quality}
                      strokeWidth={3}
                      name="Calidad (%)"
                    />
                    <ReferenceLine y={85} stroke={chartColors.goal} strokeDasharray="3 3" label="Meta" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Distribución de calidad */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Distribución por Categoría</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={qualityMetrics}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {qualityMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Indicadores de calidad */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-800">Excelente</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-1">45%</p>
                <p className="text-xs text-green-600">Calidad superior</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-blue-800">Buena</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-1">35%</p>
                <p className="text-xs text-blue-600">Calidad estándar</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-yellow-800">Regular</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600 mt-1">15%</p>
                <p className="text-xs text-yellow-600">Requiere mejora</p>
              </div>
            </div>
          </div>
        );

      case 'trends':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Análisis de Tendencias</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Proyecciones y tendencias de producción a largo plazo
            </p>
            
            {/* Gráfico de tendencias principales */}
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={productionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="milk"
                    stackId="1"
                    stroke={chartColors.milk}
                    fill={chartColors.milk}
                    fillOpacity={0.3}
                    name="Leche (L)"
                  />
                  <Area
                    type="monotone"
                    dataKey="meat"
                    stackId="2"
                    stroke={chartColors.meat}
                    fill={chartColors.meat}
                    fillOpacity={0.3}
                    name="Carne (kg)"
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={chartColors.revenue}
                    strokeWidth={3}
                    name="Ingresos (MXN)"
                  />
                  {showProjections && (
                    <Line
                      type="monotone"
                      dataKey="projection"
                      stroke={chartColors.projection}
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      name="Proyección"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Indicadores de tendencia */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-blue-800">Tendencia Leche</h4>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-xl font-bold text-blue-700">+5.2%</p>
                <p className="text-xs text-blue-600">Crecimiento mensual</p>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-red-800">Tendencia Carne</h4>
                  <TrendingUp className="h-4 w-4 text-red-600" />
                </div>
                <p className="text-xl font-bold text-red-700">+3.8%</p>
                <p className="text-xs text-red-600">Crecimiento mensual</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-green-800">Tendencia Ingresos</h4>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-xl font-bold text-green-700">+7.1%</p>
                <p className="text-xs text-green-600">Crecimiento mensual</p>
              </div>
            </div>

            {/* Proyecciones futuras */}
            {showProjections && (
              <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Clock className="h-5 w-5 text-purple-600 mr-2" />
                  <h4 className="text-md font-medium text-purple-800">Proyecciones Próximos 3 Meses</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-purple-600">Leche Estimada</p>
                    <p className="text-lg font-bold text-purple-700">28,500 L</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-purple-600">Carne Estimada</p>
                    <p className="text-lg font-bold text-purple-700">14,200 kg</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-purple-600">Ingresos Estimados</p>
                    <p className="text-lg font-bold text-purple-700">{formatCurrency(425000)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Renderizado principal
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Mostrar errores si existen */}
      {Object.keys(errors).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-md p-4"
        >
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-sm font-medium text-red-800">Errores encontrados:</h3>
          </div>
          <div className="mt-2">
            {Object.entries(errors).map(([key, message]) => (
              <p key={key} className="text-sm text-red-700">• {message}</p>
            ))}
          </div>
        </motion.div>
      )}

      {/* Header con controles de filtros */}
      {renderFilters()}

      {/* Resumen de métricas de producción */}
      {renderProductionMetricsSummary()}

      {/* Tabs de navegación */}
      {renderProductionTabs()}

      {/* Contenido de tabs */}
      {renderTabContent()}

      {/* Indicador de carga */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
          />
        </div>
      )}
    </motion.div>
  );
};

export default ProductionChart;