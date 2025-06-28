import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Milk, 
  Beef, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  MapPin, 
  Download, 
  Filter, 
  Calendar, 
  Scale, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Thermometer,
  Droplets,
  Package,
  Users,
  Star,
  Award,
  Eye,
  Settings,
  Plus,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart as RechartsBarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';

const ProductionReports = () => {
  // Estados para gestión de datos de producción
  const [productionData, setProductionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedProductType, setSelectedProductType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('quantity');
  const [searchTerm, setSearchTerm] = useState('');

  // Animaciones de Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const numberCountVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 200, delay: 0.3 }
    }
  };

  const milkDropVariants = {
    drop: {
      y: [0, 10, 0],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    }
  };

  // Cargar datos de producción al montar el componente
  useEffect(() => {
    fetchProductionData();
  }, [dateRange, selectedPeriod, selectedProductType, selectedLocation, selectedMetric]);

  // Obtener datos de producción desde la API
  const fetchProductionData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        from: dateRange.from?.toISOString(),
        to: dateRange.to?.toISOString(),
        period: selectedPeriod,
        productType: selectedProductType,
        location: selectedLocation,
        metric: selectedMetric
      });

      const response = await fetch(`/api/reports/production?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProductionData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al cargar datos de producción');
      }
    } catch (error) {
      console.error('Error fetching production data:', error);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos mock para desarrollo con geolocalización detallada
  const mockProductionData = {
    summary: {
      totalMilkProduction: 15680.5, // litros
      totalMeatProduction: 2856.8, // kg
      averageMilkPerCow: 28.4, // litros/día
      averageWeightGain: 1.2, // kg/día
      productionEfficiency: 89.3, // %
      qualityScore: 92.1, // %
      monthlyGrowth: 8.7, // %
      yearlyGrowth: 15.2 // %
    },
    productionByLocation: [
      {
        location: 'Sector Norte - Sala de Ordeño A',
        coordinates: { lat: 17.9899, lng: -92.9470 },
        milkProduction: 6240.2,
        cowsInProduction: 45,
        averagePerCow: 30.8,
        qualityGrade: 'A+',
        fatContent: 3.8,
        proteinContent: 3.2,
        somaticCellCount: 185000,
        temperature: 4.2,
        lastCollection: '2025-06-27T06:00:00Z'
      },
      {
        location: 'Sector Sur - Sala de Ordeño B',
        coordinates: { lat: 17.9885, lng: -92.9485 },
        milkProduction: 4890.8,
        cowsInProduction: 38,
        averagePerCow: 28.6,
        qualityGrade: 'A',
        fatContent: 3.6,
        proteinContent: 3.1,
        somaticCellCount: 195000,
        temperature: 4.1,
        lastCollection: '2025-06-27T06:15:00Z'
      },
      {
        location: 'Área Central - Sala de Ordeño C',
        coordinates: { lat: 17.9892, lng: -92.9478 },
        milkProduction: 4549.5,
        cowsInProduction: 32,
        averagePerCow: 31.6,
        qualityGrade: 'A+',
        fatContent: 4.0,
        proteinContent: 3.4,
        somaticCellCount: 175000,
        temperature: 4.0,
        lastCollection: '2025-06-27T05:45:00Z'
      }
    ],
    meatProductionByArea: [
      {
        area: 'Corral de Engorde Norte',
        coordinates: { lat: 17.9896, lng: -92.9468 },
        cattleCount: 28,
        averageWeight: 485.6,
        averageDailyGain: 1.4,
        totalWeightGain: 234.8,
        feedConversionRatio: 6.2,
        projectedHarvestDate: '2025-08-15',
        qualityGrade: 'Prime'
      },
      {
        area: 'Corral de Engorde Sur',
        coordinates: { lat: 17.9888, lng: -92.9482 },
        cattleCount: 35,
        averageWeight: 462.3,
        averageDailyGain: 1.2,
        totalWeightGain: 198.5,
        feedConversionRatio: 6.8,
        projectedHarvestDate: '2025-09-01',
        qualityGrade: 'Choice'
      },
      {
        area: 'Corral de Finalización',
        coordinates: { lat: 17.9903, lng: -92.9475 },
        cattleCount: 22,
        averageWeight: 512.8,
        averageDailyGain: 1.0,
        totalWeightGain: 145.2,
        feedConversionRatio: 7.1,
        projectedHarvestDate: '2025-07-20',
        qualityGrade: 'Prime'
      }
    ],
    dailyProduction: [
      { 
        date: '2025-06-21', 
        milk: 520.5, 
        weightGain: 98.4, 
        temperature: 24.5, 
        humidity: 68,
        location: 'General'
      },
      { 
        date: '2025-06-22', 
        milk: 535.2, 
        weightGain: 102.1, 
        temperature: 25.1, 
        humidity: 72,
        location: 'General'
      },
      { 
        date: '2025-06-23', 
        milk: 518.8, 
        weightGain: 95.7, 
        temperature: 26.8, 
        humidity: 75,
        location: 'General'
      },
      { 
        date: '2025-06-24', 
        milk: 542.1, 
        weightGain: 105.3, 
        temperature: 25.3, 
        humidity: 70,
        location: 'General'
      },
      { 
        date: '2025-06-25', 
        milk: 528.9, 
        weightGain: 99.8, 
        temperature: 24.9, 
        humidity: 69,
        location: 'General'
      },
      { 
        date: '2025-06-26', 
        milk: 548.3, 
        weightGain: 108.2, 
        temperature: 23.8, 
        humidity: 65,
        location: 'General'
      },
      { 
        date: '2025-06-27', 
        milk: 556.7, 
        weightGain: 112.5, 
        temperature: 24.2, 
        humidity: 67,
        location: 'General'
      }
    ],
    monthlyTrends: [
      { month: 'Ene', milk: 14200, meat: 2650, efficiency: 85.2, quality: 89.1 },
      { month: 'Feb', milk: 14580, meat: 2720, efficiency: 86.8, quality: 90.3 },
      { month: 'Mar', milk: 14920, meat: 2785, efficiency: 87.5, quality: 91.2 },
      { month: 'Abr', milk: 15150, meat: 2830, efficiency: 88.1, quality: 91.8 },
      { month: 'May', milk: 15420, meat: 2840, efficiency: 88.9, quality: 92.0 },
      { month: 'Jun', milk: 15680, meat: 2857, efficiency: 89.3, quality: 92.1 }
    ],
    topProducers: [
      {
        id: 'BOV-001',
        name: 'Luna',
        type: 'milk',
        dailyProduction: 42.8,
        monthlyProduction: 1284,
        location: 'Sector Norte',
        coordinates: { lat: 17.9899, lng: -92.9470 },
        breed: 'Holstein',
        age: 4.2,
        lactationNumber: 3,
        qualityScore: 96.5,
        healthScore: 98.2
      },
      {
        id: 'BOV-045',
        name: 'Estrella',
        type: 'milk',
        dailyProduction: 41.2,
        monthlyProduction: 1236,
        location: 'Área Central',
        coordinates: { lat: 17.9892, lng: -92.9478 },
        breed: 'Holstein',
        age: 3.8,
        lactationNumber: 2,
        qualityScore: 95.8,
        healthScore: 97.5
      },
      {
        id: 'BOV-078',
        name: 'Bella',
        type: 'milk',
        dailyProduction: 39.6,
        monthlyProduction: 1188,
        location: 'Sector Sur',
        coordinates: { lat: 17.9885, lng: -92.9485 },
        breed: 'Jersey',
        age: 5.1,
        lactationNumber: 4,
        qualityScore: 94.2,
        healthScore: 96.8
      },
      {
        id: 'BOV-156',
        name: 'Thor',
        type: 'meat',
        dailyWeightGain: 2.1,
        currentWeight: 542.8,
        location: 'Corral de Engorde Norte',
        coordinates: { lat: 17.9896, lng: -92.9468 },
        breed: 'Angus',
        age: 2.3,
        feedConversionRatio: 5.8,
        qualityGrade: 'Prime',
        projectedHarvestWeight: 620
      },
      {
        id: 'BOV-203',
        name: 'Titán',
        type: 'meat',
        dailyWeightGain: 1.9,
        currentWeight: 518.5,
        location: 'Corral de Engorde Sur',
        coordinates: { lat: 17.9888, lng: -92.9482 },
        breed: 'Charolais',
        age: 2.5,
        feedConversionRatio: 6.1,
        qualityGrade: 'Prime',
        projectedHarvestWeight: 605
      }
    ],
    qualityMetrics: [
      {
        metric: 'Grasa en Leche',
        value: 3.8,
        target: 3.5,
        unit: '%',
        status: 'excellent',
        trend: 0.2,
        lastUpdated: '2025-06-27T06:30:00Z'
      },
      {
        metric: 'Proteína en Leche',
        value: 3.2,
        target: 3.0,
        unit: '%',
        status: 'excellent',
        trend: 0.1,
        lastUpdated: '2025-06-27T06:30:00Z'
      },
      {
        metric: 'Recuento de Células Somáticas',
        value: 185000,
        target: 200000,
        unit: 'células/ml',
        status: 'good',
        trend: -5000,
        lastUpdated: '2025-06-27T06:30:00Z'
      },
      {
        metric: 'Temperatura de Almacenamiento',
        value: 4.1,
        target: 4.0,
        unit: '°C',
        status: 'good',
        trend: 0.1,
        lastUpdated: '2025-06-27T06:35:00Z'
      },
      {
        metric: 'Conversión Alimenticia (Carne)',
        value: 6.4,
        target: 6.5,
        unit: 'kg alimento/kg peso',
        status: 'excellent',
        trend: -0.2,
        lastUpdated: '2025-06-27T18:00:00Z'
      }
    ],
    productionAlerts: [
      {
        id: 1,
        type: 'quality',
        severity: 'medium',
        title: 'Ligero incremento en células somáticas',
        description: 'Sector Sur muestra un incremento del 8% en el recuento de células somáticas',
        location: 'Sector Sur - Sala de Ordeño B',
        coordinates: { lat: 17.9885, lng: -92.9485 },
        timestamp: '2025-06-27T07:15:00Z',
        action: 'Revisar protocolo de higiene en ordeño'
      },
      {
        id: 2,
        type: 'production',
        severity: 'low',
        title: 'Producción por debajo del promedio',
        description: 'Vaca BOV-089 ha reducido su producción en 15% esta semana',
        location: 'Área Central',
        coordinates: { lat: 17.9892, lng: -92.9478 },
        timestamp: '2025-06-26T14:30:00Z',
        action: 'Evaluación veterinaria programada'
      }
    ],
    productionSchedule: [
      {
        id: 1,
        type: 'milking',
        title: 'Ordeño Matutino - Sector Norte',
        time: '05:30',
        location: 'Sala de Ordeño A',
        coordinates: { lat: 17.9899, lng: -92.9470 },
        expectedCows: 45,
        estimatedProduction: 285,
        supervisor: 'Carlos Martinez'
      },
      {
        id: 2,
        type: 'milking',
        title: 'Ordeño Vespertino - Todos los Sectores',
        time: '16:00',
        location: 'Salas de Ordeño A, B, C',
        coordinates: { lat: 17.9892, lng: -92.9478 },
        expectedCows: 115,
        estimatedProduction: 720,
        supervisor: 'María González'
      },
      {
        id: 3,
        type: 'weighing',
        title: 'Pesaje Semanal - Ganado de Engorde',
        time: '08:00',
        location: 'Corrales de Engorde',
        coordinates: { lat: 17.9892, lng: -92.9475 },
        expectedCattle: 85,
        estimatedDuration: 120,
        supervisor: 'Juan López'
      }
    ]
  };

  // Usar datos mock si no hay datos reales
  const data = productionData || mockProductionData;

  // Colores para gráficos
  const PRODUCTION_COLORS = {
    milk: '#3B82F6',
    meat: '#EF4444', 
    quality: '#10B981',
    efficiency: '#F59E0B',
    excellent: '#10B981',
    good: '#3B82F6',
    warning: '#F59E0B',
    critical: '#EF4444'
  };

  // Manejar descarga de reporte
  const handleDownloadReport = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/reports/production/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          dateRange,
          selectedPeriod,
          selectedProductType,
          selectedLocation,
          selectedMetric
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-produccion-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        setError('Error al descargar el reporte');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar rango de fechas según periodo seleccionado
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    const now = new Date();
    
    switch (period) {
      case 'week':
        setDateRange({
          from: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
          to: now
        });
        break;
      case 'month':
        setDateRange({
          from: startOfMonth(now),
          to: endOfMonth(now)
        });
        break;
      case 'quarter':
        setDateRange({
          from: subMonths(now, 3),
          to: now
        });
        break;
      case 'year':
        setDateRange({
          from: new Date(now.getFullYear(), 0, 1),
          to: now
        });
        break;
    }
  };

  // Obtener color del estado de calidad
  const getQualityStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Obtener color de severidad de alerta
  const getAlertSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Obtener icono del tipo de alerta
  const getAlertIcon = (type) => {
    switch (type) {
      case 'quality': return <Star className="w-4 h-4" />;
      case 'production': return <Activity className="w-4 h-4" />;
      case 'temperature': return <Thermometer className="w-4 h-4" />;
      case 'equipment': return <Settings className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Formatear números
  const formatNumber = (value, decimals = 1) => {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Reportes de Producción</h2>
          <p className="text-gray-600 mt-1">Análisis de producción lechera y cárnica con geolocalización</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleDownloadReport} disabled={isLoading}>
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Registro Manual
          </Button>
        </div>
      </motion.div>

      {/* Filtros y Controles */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mes</SelectItem>
                    <SelectItem value="quarter">Último Trimestre</SelectItem>
                    <SelectItem value="year">Este Año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={selectedProductType} onValueChange={setSelectedProductType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Producto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los Productos</SelectItem>
                    <SelectItem value="milk">Producción Lechera</SelectItem>
                    <SelectItem value="meat">Producción Cárnica</SelectItem>
                    <SelectItem value="breeding">Reproducción</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Ubicaciones</SelectItem>
                    <SelectItem value="north">Sector Norte</SelectItem>
                    <SelectItem value="south">Sector Sur</SelectItem>
                    <SelectItem value="central">Área Central</SelectItem>
                    <SelectItem value="feedlot">Corrales de Engorde</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger>
                    <SelectValue placeholder="Métrica" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quantity">Cantidad</SelectItem>
                    <SelectItem value="quality">Calidad</SelectItem>
                    <SelectItem value="efficiency">Eficiencia</SelectItem>
                    <SelectItem value="trends">Tendencias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="outline" onClick={() => {
                setSelectedProductType('all');
                setSelectedLocation('all');
                setSelectedMetric('quantity');
                setSearchTerm('');
                handlePeriodChange('month');
              }}>
                <Filter className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Resumen de Producción Principal */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={numberCountVariants}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Producción de Leche</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatNumber(data.summary.totalMilkProduction)} L
                  </p>
                  <div className="flex items-center mt-1">
                    <motion.div variants={milkDropVariants} animate="drop">
                      <Droplets className="w-4 h-4 text-blue-600 mr-1" />
                    </motion.div>
                    <span className="text-sm text-blue-600">
                      {formatNumber(data.summary.averageMilkPerCow)} L/vaca/día
                    </span>
                  </div>
                </div>
                <div className="bg-blue-500 rounded-full p-3">
                  <Milk className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={numberCountVariants}>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Producción de Carne</p>
                  <p className="text-2xl font-bold text-red-900">
                    {formatNumber(data.summary.totalMeatProduction)} kg
                  </p>
                  <div className="flex items-center mt-1">
                    <Scale className="w-4 h-4 text-red-600 mr-1" />
                    <span className="text-sm text-red-600">
                      {formatNumber(data.summary.averageWeightGain)} kg/día
                    </span>
                  </div>
                </div>
                <div className="bg-red-500 rounded-full p-3">
                  <Beef className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={numberCountVariants}>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Eficiencia de Producción</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatNumber(data.summary.productionEfficiency)}%
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">
                      +{formatNumber(data.summary.monthlyGrowth)}% este mes
                    </span>
                  </div>
                </div>
                <div className="bg-green-500 rounded-full p-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={numberCountVariants}>
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Score de Calidad</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {formatNumber(data.summary.qualityScore)}%
                  </p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-600 mr-1" />
                    <span className="text-sm text-yellow-600">
                      Estándar premium
                    </span>
                  </div>
                </div>
                <div className="bg-yellow-500 rounded-full p-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Producción por Ubicaciones */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Producción Lechera por Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.productionByLocation.map((location, index) => (
                <motion.div
                  key={location.location}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-blue-900">{location.location}</h4>
                    <Badge className={getQualityStatusColor('excellent')}>
                      {location.qualityGrade}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-900">
                        {formatNumber(location.milkProduction)} L
                      </p>
                      <p className="text-sm text-blue-600">Producción Total</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Vacas en Producción:</span>
                        <p className="font-medium">{location.cowsInProduction}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Promedio/Vaca:</span>
                        <p className="font-medium">{formatNumber(location.averagePerCow)} L</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Grasa:</span>
                        <p className="font-medium">{location.fatContent}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Proteína:</span>
                        <p className="font-medium">{location.proteinContent}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Cel. Somáticas:</span>
                        <p className="font-medium">{location.somaticCellCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Temperatura:</span>
                        <p className="font-medium">{location.temperature}°C</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-xs text-gray-500">
                      📍 Lat: {location.coordinates.lat.toFixed(4)}, Lng: {location.coordinates.lng.toFixed(4)}
                    </div>
                    <div className="text-xs text-gray-600">
                      Última recolección: {format(new Date(location.lastCollection), 'dd/MM/yyyy HH:mm')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Producción Cárnica por Área */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-red-600" />
              Producción Cárnica por Área
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.meatProductionByArea.map((area, index) => (
                <motion.div
                  key={area.area}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-red-900">{area.area}</h4>
                    <Badge className={getQualityStatusColor('excellent')}>
                      {area.qualityGrade}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-red-900">
                        {formatNumber(area.averageWeight)} kg
                      </p>
                      <p className="text-sm text-red-600">Peso Promedio</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Ganado:</span>
                        <p className="font-medium">{area.cattleCount}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Ganancia Diaria:</span>
                        <p className="font-medium">{formatNumber(area.averageDailyGain)} kg</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Ganancia Total:</span>
                        <p className="font-medium">{formatNumber(area.totalWeightGain)} kg</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Conversión:</span>
                        <p className="font-medium">{formatNumber(area.feedConversionRatio)}:1</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-xs text-gray-500">
                      📍 Lat: {area.coordinates.lat.toFixed(4)}, Lng: {area.coordinates.lng.toFixed(4)}
                    </div>
                    <div className="text-xs text-gray-600">
                      Cosecha proyectada: {format(new Date(area.projectedHarvestDate), 'dd/MM/yyyy')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gráficos y Análisis */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
            <TabsTrigger value="daily">Producción Diaria</TabsTrigger>
            <TabsTrigger value="producers">Top Productores</TabsTrigger>
            <TabsTrigger value="quality">Métricas de Calidad</TabsTrigger>
            <TabsTrigger value="schedule">Programación</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tendencias Mensuales de Producción</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={data.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="milk" 
                      fill="#3B82F6" 
                      name="Producción de Leche (L)"
                    />
                    <Bar 
                      yAxisId="left"
                      dataKey="meat" 
                      fill="#EF4444" 
                      name="Producción de Carne (kg)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      name="Eficiencia (%)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="quality" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      name="Calidad (%)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Producción Diaria (Últimos 7 días)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={data.dailyProduction}>
                    <defs>
                      <linearGradient id="colorMilk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="milk" 
                      stroke="#3B82F6" 
                      fillOpacity={1}
                      fill="url(#colorMilk)"
                      name="Leche (L)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="weightGain" 
                      stroke="#EF4444" 
                      fillOpacity={1}
                      fill="url(#colorWeight)"
                      name="Ganancia de Peso (kg)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="producers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Productores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topProducers.map((producer, index) => (
                    <motion.div
                      key={producer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          producer.type === 'milk' ? 'bg-blue-500' : 'bg-red-500'
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold">{producer.name} ({producer.id})</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>🐄 {producer.breed}</span>
                            <span>📅 {formatNumber(producer.age)} años</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {producer.location}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            📍 Lat: {producer.coordinates.lat.toFixed(4)}, Lng: {producer.coordinates.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {producer.type === 'milk' ? (
                          <>
                            <p className="text-2xl font-bold text-blue-600">
                              {formatNumber(producer.dailyProduction)} L/día
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatNumber(producer.monthlyProduction)} L/mes
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Calidad: {formatNumber(producer.qualityScore)}%
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                Salud: {formatNumber(producer.healthScore)}%
                              </Badge>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-2xl font-bold text-red-600">
                              +{formatNumber(producer.dailyWeightGain)} kg/día
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatNumber(producer.currentWeight)} kg actual
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                {producer.qualityGrade}
                              </Badge>
                              <Badge className="bg-purple-100 text-purple-800 text-xs">
                                Conv: {formatNumber(producer.feedConversionRatio)}:1
                              </Badge>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.qualityMetrics.map((metric, index) => (
                <motion.div
                  key={metric.metric}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm">{metric.metric}</h4>
                        <Badge className={getQualityStatusColor(metric.status)}>
                          {metric.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="text-center mb-3">
                        <p className="text-3xl font-bold">
                          {formatNumber(metric.value)} {metric.unit}
                        </p>
                        <p className="text-sm text-gray-600">
                          Objetivo: {formatNumber(metric.target)} {metric.unit}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-sm">
                        {metric.trend > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : metric.trend < 0 ? (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        ) : null}
                        <span className={metric.trend > 0 ? 'text-green-600' : metric.trend < 0 ? 'text-red-600' : 'text-gray-600'}>
                          {metric.trend > 0 ? '+' : ''}{formatNumber(Math.abs(metric.trend))} {metric.unit}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Actualizado: {format(new Date(metric.lastUpdated), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Programación de Actividades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.productionSchedule.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-500 rounded-full p-2">
                            {activity.type === 'milking' ? (
                              <Milk className="w-4 h-4 text-white" />
                            ) : activity.type === 'weighing' ? (
                              <Scale className="w-4 h-4 text-white" />
                            ) : (
                              <Activity className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold">{activity.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {activity.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {activity.supervisor}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              📍 Lat: {activity.coordinates.lat.toFixed(4)}, Lng: {activity.coordinates.lng.toFixed(4)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {activity.expectedCows && (
                            <p className="text-lg font-bold">{activity.expectedCows} vacas</p>
                          )}
                          {activity.expectedCattle && (
                            <p className="text-lg font-bold">{activity.expectedCattle} ganado</p>
                          )}
                          {activity.estimatedProduction && (
                            <p className="text-sm text-gray-600">~{activity.estimatedProduction} L</p>
                          )}
                          {activity.estimatedDuration && (
                            <p className="text-sm text-gray-600">~{activity.estimatedDuration} min</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Alertas de Producción */}
      {data.productionAlerts.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Alertas de Producción
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.productionAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-l-4 p-4 rounded-lg ${getAlertSeverityColor(alert.severity)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="bg-white rounded-full p-2">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{alert.title}</h4>
                          <p className="text-sm text-gray-700 mt-1">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {alert.location}
                            </span>
                            <span>{format(new Date(alert.timestamp), 'dd/MM/yyyy HH:mm')}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            📍 Lat: {alert.coordinates.lat.toFixed(4)}, Lng: {alert.coordinates.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={alert.severity === 'high' ? 'bg-red-100 text-red-800' : 
                                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-blue-100 text-blue-800'}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-2">
                          Acción: {alert.action}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Mensaje de error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5" />
          {error}
        </motion.div>
      )}

      {/* Estado de carga */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Generando reporte de producción...</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductionReports;