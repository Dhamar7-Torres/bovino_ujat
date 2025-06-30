// src/components/charts/HealthChart.jsx
// Componente para visualizar análisis de salud de bovinos

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar, ComposedChart, ReferenceLine
} from 'recharts';
import {
  Heart, Activity, AlertTriangle, TrendingUp, TrendingDown,
  Filter, Calendar, Download, RefreshCw, Info, Stethoscope,
  Thermometer, Weight, Shield, Pill, Clock, Save
} from 'lucide-react';

const HealthChart = () => {
  // Estados para datos de salud
  const [healthData, setHealthData] = useState([]);
  const [vaccinationData, setVaccinationData] = useState([]);
  const [treatmentData, setTreatmentData] = useState([]);
  const [diseaseData, setDiseaseData] = useState([]);
  const [weightData, setWeightData] = useState([]);
  
  // Estados para filtros y configuración
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedRanch, setSelectedRanch] = useState('all');
  const [selectedBovine, setSelectedBovine] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date()
  });
  
  // Estados para control de la interfaz
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [chartType, setChartType] = useState('line');
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Estados para metadatos
  const [ranches, setRanches] = useState([]);
  const [bovines, setBovines] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState({
    healthyCount: 0,
    treatmentCount: 0,
    pendingVaccinations: 0,
    averageWeight: 0,
    healthyPercentage: 0,
    treatmentPercentage: 0,
    weightTrend: 'up',
    weightChange: 0
  });

  // Colores para los gráficos
  const chartColors = {
    healthy: '#10B981',
    sick: '#EF4444',
    treatment: '#F59E0B',
    vaccination: '#3B82F6',
    weight: '#8B5CF6',
    temperature: '#F97316'
  };

  // Tabs de salud
  const healthTabs = [
    { id: 'overview', name: 'Resumen', icon: Activity },
    { id: 'vaccinations', name: 'Vacunaciones', icon: Shield },
    { id: 'treatments', name: 'Tratamientos', icon: Pill },
    { id: 'weight', name: 'Peso', icon: Weight }
  ];

  // Períodos disponibles
  const periods = [
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
    { value: 'quarter', label: 'Trimestre' },
    { value: 'year', label: 'Año' }
  ];

  // Animaciones para los componentes
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Recargar datos cuando cambian los filtros
  useEffect(() => {
    if (!loading) {
      loadHealthData();
    }
  }, [selectedPeriod, selectedRanch, selectedBovine, dateRange]);

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
      
      setRanches(mockRanches);
      setBovines(mockBovines);
      
      await loadHealthData();
      
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      setErrors({ general: 'Error al cargar datos iniciales' });
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar datos de salud
  const loadHealthData = async () => {
    try {
      // Simular datos de salud
      const mockHealthData = [
        { date: '2024-01-01', healthy: 45, sick: 3, treatment: 2 },
        { date: '2024-01-02', healthy: 46, sick: 2, treatment: 2 },
        { date: '2024-01-03', healthy: 47, sick: 1, treatment: 2 },
        { date: '2024-01-04', healthy: 48, sick: 1, treatment: 1 },
        { date: '2024-01-05', healthy: 49, sick: 0, treatment: 1 }
      ];

      const mockVaccinationData = [
        { date: '2024-01-01', applied: 10, scheduled: 15 },
        { date: '2024-01-02', applied: 12, scheduled: 13 },
        { date: '2024-01-03', applied: 8, scheduled: 17 },
        { date: '2024-01-04', applied: 15, scheduled: 10 },
        { date: '2024-01-05', applied: 11, scheduled: 12 }
      ];

      const mockTreatmentData = [
        { treatment: 'Antibióticos', successful: 25, ongoing: 5, failed: 2 },
        { treatment: 'Antiparasitarios', successful: 30, ongoing: 3, failed: 1 },
        { treatment: 'Vitaminas', successful: 40, ongoing: 2, failed: 0 },
        { treatment: 'Vacunas', successful: 35, ongoing: 1, failed: 1 }
      ];

      const mockDiseaseData = [
        { name: 'Mastitis', value: 15 },
        { name: 'Parasitosis', value: 12 },
        { name: 'Neumonía', value: 8 },
        { name: 'Cojera', value: 6 },
        { name: 'Otros', value: 4 }
      ];

      const mockWeightData = [
        { date: '2024-01-01', averageWeight: 450, targetWeight: 480, idealWeight: 500 },
        { date: '2024-01-02', averageWeight: 452, targetWeight: 480, idealWeight: 500 },
        { date: '2024-01-03', averageWeight: 455, targetWeight: 480, idealWeight: 500 },
        { date: '2024-01-04', averageWeight: 458, targetWeight: 480, idealWeight: 500 },
        { date: '2024-01-05', averageWeight: 460, targetWeight: 480, idealWeight: 500 }
      ];

      const mockMetrics = {
        healthyCount: 49,
        treatmentCount: 1,
        pendingVaccinations: 12,
        averageWeight: 460,
        healthyPercentage: 98,
        treatmentPercentage: 2,
        weightTrend: 'up',
        weightChange: 2.2
      };

      setHealthData(mockHealthData);
      setVaccinationData(mockVaccinationData);
      setTreatmentData(mockTreatmentData);
      setDiseaseData(mockDiseaseData);
      setWeightData(mockWeightData);
      setHealthMetrics(mockMetrics);

    } catch (error) {
      console.error('Error al cargar datos de salud:', error);
      setErrors({ health: 'Error al cargar datos de salud' });
    }
  };

  // Función para exportar datos
  const exportData = async () => {
    try {
      const exportData = {
        healthData,
        vaccinationData,
        treatmentData,
        diseaseData,
        weightData,
        filters: {
          period: selectedPeriod,
          ranch: selectedRanch,
          bovine: selectedBovine,
          dateRange
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `health-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error al exportar datos:', error);
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
      case 'bovine':
        setSelectedBovine(value);
        break;
      default:
        break;
    }
  };

  // Componente de tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-4 rounded-lg shadow-lg border"
        >
          <p className="font-semibold text-gray-800">{new Date(label).toLocaleDateString()}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  // Renderizar resumen de métricas de salud
  const renderHealthMetricsSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Bovinos saludables */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Bovinos Saludables</p>
            <p className="text-2xl font-bold text-green-600">{healthMetrics.healthyCount}</p>
            <div className="flex items-center mt-1">
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {healthMetrics.healthyPercentage}% del total
              </div>
            </div>
          </div>
          <Heart className="h-8 w-8 text-green-500" />
        </div>
      </motion.div>

      {/* Bovinos en tratamiento */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">En Tratamiento</p>
            <p className="text-2xl font-bold text-yellow-600">{healthMetrics.treatmentCount}</p>
            <div className="flex items-center mt-1">
              <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {healthMetrics.treatmentPercentage}% del total
              </div>
            </div>
          </div>
          <Pill className="h-8 w-8 text-yellow-500" />
        </div>
      </motion.div>

      {/* Vacunaciones pendientes */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Vacunaciones Pendientes</p>
            <p className="text-2xl font-bold text-blue-600">{healthMetrics.pendingVaccinations}</p>
            <div className="flex items-center mt-1">
              <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                Requieren atención
              </div>
            </div>
          </div>
          <Shield className="h-8 w-8 text-blue-500" />
        </div>
      </motion.div>

      {/* Peso promedio */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Peso Promedio</p>
            <p className="text-2xl font-bold text-purple-600">{healthMetrics.averageWeight} kg</p>
            <div className="flex items-center mt-1">
              {healthMetrics.weightTrend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <div className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                {healthMetrics.weightChange}% último mes
              </div>
            </div>
          </div>
          <Weight className="h-8 w-8 text-purple-500" />
        </div>
      </motion.div>
    </div>
  );

  // Renderizar controles de filtros
  const renderFilters = () => (
    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Análisis de Salud</h2>
        <p className="text-gray-600">Monitoreo y seguimiento de la salud del ganado</p>
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

        {/* Botón de actualizar */}
        <button
          onClick={loadHealthData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>

        {/* Botón de exportar */}
        <button
          onClick={exportData}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Exportar</span>
        </button>
      </div>
    </motion.div>
  );

  // Renderizar tabs de salud
  const renderHealthTabs = () => (
    <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
      {healthTabs.map((tab) => {
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
            {/* Estado general de salud */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Estado General de Salud</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Distribución del estado de salud del ganado en el tiempo
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="healthy"
                    stackId="1"
                    stroke={chartColors.healthy}
                    fill={chartColors.healthy}
                    name="Saludables"
                  />
                  <Area
                    type="monotone"
                    dataKey="sick"
                    stackId="1"
                    stroke={chartColors.sick}
                    fill={chartColors.sick}
                    name="Enfermos"
                  />
                  <Area
                    type="monotone"
                    dataKey="treatment"
                    stackId="1"
                    stroke={chartColors.treatment}
                    fill={chartColors.treatment}
                    name="En Tratamiento"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Enfermedades más comunes */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enfermedades Más Comunes</h3>
              <p className="text-gray-600 text-sm mb-4">Distribución de enfermedades reportadas</p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={diseaseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {diseaseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(chartColors)[index % Object.values(chartColors).length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'vaccinations':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Programa de Vacunación</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Seguimiento de vacunaciones aplicadas y programadas
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={vaccinationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="applied"
                  fill={chartColors.vaccination}
                  name="Aplicadas"
                />
                <Line
                  type="monotone"
                  dataKey="scheduled"
                  stroke={chartColors.treatment}
                  strokeWidth={2}
                  name="Programadas"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        );

      case 'treatments':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <Pill className="h-5 w-5 mr-2 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Tratamientos Médicos</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Registro de tratamientos aplicados y su efectividad
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={treatmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="treatment" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="successful"
                  fill={chartColors.healthy}
                  name="Exitosos"
                />
                <Bar
                  dataKey="ongoing"
                  fill={chartColors.treatment}
                  name="En Progreso"
                />
                <Bar
                  dataKey="failed"
                  fill={chartColors.sick}
                  name="Fallidos"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'weight':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <Weight className="h-5 w-5 mr-2 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Evolución del Peso</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Monitoreo del peso promedio del ganado
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="averageWeight"
                  stroke={chartColors.weight}
                  strokeWidth={3}
                  name="Peso Promedio (kg)"
                />
                <Line
                  type="monotone"
                  dataKey="targetWeight"
                  stroke={chartColors.healthy}
                  strokeDasharray="5 5"
                  name="Peso Objetivo (kg)"
                />
                <ReferenceLine
                  y={500}
                  stroke={chartColors.healthy}
                  strokeDasharray="3 3"
                  label="Peso Ideal"
                />
              </LineChart>
            </ResponsiveContainer>
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

      {/* Header con controles */}
      {renderFilters()}

      {/* Resumen de métricas */}
      {renderHealthMetricsSummary()}

      {/* Tabs de navegación */}
      {renderHealthTabs()}

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

export default HealthChart;