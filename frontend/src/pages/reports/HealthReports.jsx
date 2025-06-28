import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Stethoscope, 
  Syringe, 
  Thermometer, 
  Activity, 
  MapPin, 
  Download, 
  Filter, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Target, 
  AlertCircle, 
  FileText, 
  Search, 
  Eye, 
  Users, 
  Zap,
  Plus,
  Settings
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
  Scatter
} from 'recharts';

const HealthReports = () => {
  // Estados para gestión de datos de salud
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedHealthCategory, setSelectedHealthCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedVeterinarian, setSelectedVeterinarian] = useState('all');
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

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity }
    }
  };

  // Cargar datos de salud al montar el componente
  useEffect(() => {
    fetchHealthData();
  }, [dateRange, selectedPeriod, selectedHealthCategory, selectedLocation, selectedVeterinarian]);

  // Obtener datos de salud desde la API
  const fetchHealthData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        from: dateRange.from?.toISOString(),
        to: dateRange.to?.toISOString(),
        period: selectedPeriod,
        category: selectedHealthCategory,
        location: selectedLocation,
        veterinarian: selectedVeterinarian
      });

      const response = await fetch(`/api/reports/health?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHealthData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al cargar datos de salud veterinaria');
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos mock para desarrollo con geolocalización detallada
  const mockHealthData = {
    summary: {
      totalBovines: 248,
      healthyBovines: 215,
      sickBovines: 18,
      underTreatment: 15,
      vaccinationsThisMonth: 45,
      healthScore: 86.7,
      emergencyRate: 2.4,
      recoveryRate: 94.2
    },
    healthStatus: [
      { status: 'Saludable', count: 215, percentage: 86.7, color: '#10B981' },
      { status: 'Enfermo', count: 18, percentage: 7.3, color: '#EF4444' },
      { status: 'En Tratamiento', count: 15, percentage: 6.0, color: '#F59E0B' }
    ],
    diseaseDistribution: [
      { 
        disease: 'Mastitis', 
        cases: 8, 
        severity: 'medium', 
        recoveryRate: 95,
        averageLocation: { lat: 17.9895, lng: -92.9472 },
        affectedAreas: ['Sector Norte', 'Área de Ordeño']
      },
      { 
        disease: 'Fiebre Aftosa', 
        cases: 5, 
        severity: 'high', 
        recoveryRate: 88,
        averageLocation: { lat: 17.9888, lng: -92.9480 },
        affectedAreas: ['Sector Sur', 'Zona de Cuarentena']
      },
      { 
        disease: 'Parasitosis', 
        cases: 12, 
        severity: 'low', 
        recoveryRate: 98,
        averageLocation: { lat: 17.9902, lng: -92.9465 },
        affectedAreas: ['Pastizales', 'Zona de Pastoreo']
      },
      { 
        disease: 'Problemas Digestivos', 
        cases: 7, 
        severity: 'medium', 
        recoveryRate: 92,
        averageLocation: { lat: 17.9890, lng: -92.9475 },
        affectedAreas: ['Área de Alimentación', 'Corrales']
      }
    ],
    vaccinationProgress: [
      {
        vaccine: 'Fiebre Aftosa',
        scheduled: 120,
        completed: 98,
        pending: 22,
        percentage: 81.7,
        nextDue: '2025-07-15',
        locations: [
          { area: 'Sector Norte', completed: 45, total: 55, coordinates: { lat: 17.9899, lng: -92.9470 } },
          { area: 'Sector Sur', completed: 32, total: 40, coordinates: { lat: 17.9885, lng: -92.9485 } },
          { area: 'Área Central', completed: 21, total: 25, coordinates: { lat: 17.9892, lng: -92.9478 } }
        ]
      },
      {
        vaccine: 'Brucelosis',
        scheduled: 85,
        completed: 75,
        pending: 10,
        percentage: 88.2,
        nextDue: '2025-08-01',
        locations: [
          { area: 'Sector Norte', completed: 30, total: 35, coordinates: { lat: 17.9899, lng: -92.9470 } },
          { area: 'Sector Sur', completed: 25, total: 28, coordinates: { lat: 17.9885, lng: -92.9485 } },
          { area: 'Área Central', completed: 20, total: 22, coordinates: { lat: 17.9892, lng: -92.9478 } }
        ]
      },
      {
        vaccine: 'Carbón Bacteriano',
        scheduled: 65,
        completed: 62,
        pending: 3,
        percentage: 95.4,
        nextDue: '2025-09-10',
        locations: [
          { area: 'Zona de Riesgo', completed: 25, total: 26, coordinates: { lat: 17.9905, lng: -92.9462 } },
          { area: 'Pastizales', completed: 37, total: 39, coordinates: { lat: 17.9880, lng: -92.9490 } }
        ]
      }
    ],
    healthTrends: [
      { month: 'Ene', healthy: 89.2, sick: 6.8, vaccinated: 78, treatments: 12, location: 'General' },
      { month: 'Feb', healthy: 91.5, sick: 5.5, vaccinated: 82, treatments: 8, location: 'General' },
      { month: 'Mar', healthy: 88.1, sick: 7.9, vaccinated: 85, treatments: 15, location: 'General' },
      { month: 'Abr', healthy: 87.3, sick: 8.2, vaccinated: 79, treatments: 18, location: 'General' },
      { month: 'May', healthy: 85.8, sick: 9.1, vaccinated: 88, treatments: 22, location: 'General' },
      { month: 'Jun', healthy: 86.7, sick: 7.3, vaccinated: 92, treatments: 15, location: 'General' }
    ],
    veterinaryVisits: [
      {
        id: 1,
        veterinarian: 'Dr. Sarah Johnson',
        date: '2025-06-25',
        time: '09:00',
        location: 'Sector Norte',
        coordinates: { lat: 17.9899, lng: -92.9470 },
        bovinesChecked: 12,
        diagnosesGiven: 3,
        treatmentsApplied: 2,
        vaccinationsGiven: 8,
        duration: 180, // minutos
        cost: 2400.00,
        notes: 'Revisión rutinaria del rebaño reproductor. Identificados 2 casos de mastitis leve.'
      },
      {
        id: 2,
        veterinarian: 'Dr. Carlos Mendez',
        date: '2025-06-24',
        time: '14:30',
        location: 'Sector Sur',
        coordinates: { lat: 17.9885, lng: -92.9485 },
        bovinesChecked: 8,
        diagnosesGiven: 1,
        treatmentsApplied: 1,
        vaccinationsGiven: 5,
        duration: 120,
        cost: 1600.00,
        notes: 'Seguimiento de tratamiento para parasitosis. Aplicación de vacuna contra brucelosis.'
      },
      {
        id: 3,
        veterinarian: 'Dra. Ana López',
        date: '2025-06-22',
        time: '11:15',
        location: 'Área Central',
        coordinates: { lat: 17.9892, lng: -92.9478 },
        bovinesChecked: 15,
        diagnosesGiven: 2,
        treatmentsApplied: 3,
        vaccinationsGiven: 12,
        duration: 200,
        cost: 2800.00,
        notes: 'Evaluación reproductiva y programa de vacunación. Detección temprana de problemas digestivos.'
      }
    ],
    locationHealthMap: [
      {
        area: 'Sector Norte',
        coordinates: { lat: 17.9899, lng: -92.9470 },
        totalBovines: 85,
        healthyBovines: 76,
        sickBovines: 6,
        underTreatment: 3,
        healthScore: 89.4,
        lastInspection: '2025-06-25',
        commonIssues: ['Mastitis', 'Problemas Respiratorios'],
        riskLevel: 'low'
      },
      {
        area: 'Sector Sur',
        coordinates: { lat: 17.9885, lng: -92.9485 },
        totalBovines: 72,
        healthyBovines: 60,
        sickBovines: 8,
        underTreatment: 4,
        healthScore: 83.3,
        lastInspection: '2025-06-24',
        commonIssues: ['Parasitosis', 'Fiebre Aftosa'],
        riskLevel: 'medium'
      },
      {
        area: 'Área Central',
        coordinates: { lat: 17.9892, lng: -92.9478 },
        totalBovines: 56,
        healthyBovines: 48,
        sickBovines: 3,
        underTreatment: 5,
        healthScore: 85.7,
        lastInspection: '2025-06-22',
        commonIssues: ['Problemas Digestivos'],
        riskLevel: 'low'
      },
      {
        area: 'Zona de Cuarentena',
        coordinates: { lat: 17.9905, lng: -92.9462 },
        totalBovines: 35,
        healthyBovines: 31,
        sickBovines: 1,
        underTreatment: 3,
        healthScore: 88.6,
        lastInspection: '2025-06-23',
        commonIssues: ['Seguimiento Post-tratamiento'],
        riskLevel: 'low'
      }
    ],
    medicationUsage: [
      {
        medication: 'Penicilina G',
        totalUsed: 450, // ml
        costPerUnit: 12.50,
        totalCost: 5625.00,
        applicationsCount: 18,
        locations: ['Sector Norte', 'Área Central'],
        effectiveness: 94.4,
        lastUsed: '2025-06-25'
      },
      {
        medication: 'Ivermectina',
        totalUsed: 280,
        costPerUnit: 8.75,
        totalCost: 2450.00,
        applicationsCount: 14,
        locations: ['Sector Sur', 'Zona de Cuarentena'],
        effectiveness: 97.1,
        lastUsed: '2025-06-24'
      },
      {
        medication: 'Oxitetraciclina',
        totalUsed: 320,
        costPerUnit: 15.20,
        totalCost: 4864.00,
        applicationsCount: 12,
        locations: ['Área Central', 'Sector Norte'],
        effectiveness: 91.8,
        lastUsed: '2025-06-22'
      }
    ],
    upcomingSchedule: [
      {
        id: 1,
        type: 'vaccination',
        title: 'Vacunación Fiebre Aftosa - Grupo B',
        date: '2025-06-30',
        time: '08:00',
        location: 'Sector Sur',
        coordinates: { lat: 17.9885, lng: -92.9485 },
        bovinesCount: 22,
        veterinarian: 'Dr. Carlos Mendez',
        priority: 'high',
        estimatedDuration: 120
      },
      {
        id: 2,
        type: 'checkup',
        title: 'Revisión Rutinaria - Vacas Preñadas',
        date: '2025-07-02',
        time: '10:30',
        location: 'Área Central',
        coordinates: { lat: 17.9892, lng: -92.9478 },
        bovinesCount: 15,
        veterinarian: 'Dra. Ana López',
        priority: 'medium',
        estimatedDuration: 180
      },
      {
        id: 3,
        type: 'treatment',
        title: 'Seguimiento Tratamiento Mastitis',
        date: '2025-07-03',
        time: '09:15',
        location: 'Sector Norte',
        coordinates: { lat: 17.9899, lng: -92.9470 },
        bovinesCount: 6,
        veterinarian: 'Dr. Sarah Johnson',
        priority: 'high',
        estimatedDuration: 90
      }
    ]
  };

  // Usar datos mock si no hay datos reales
  const data = healthData || mockHealthData;

  // Colores para gráficos
  const HEALTH_COLORS = {
    healthy: '#10B981',
    sick: '#EF4444', 
    treatment: '#F59E0B',
    vaccination: '#3B82F6',
    high: '#DC2626',
    medium: '#F59E0B',
    low: '#10B981'
  };

  // Manejar descarga de reporte
  const handleDownloadReport = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/reports/health/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          dateRange,
          selectedPeriod,
          selectedHealthCategory,
          selectedLocation,
          selectedVeterinarian
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-salud-veterinaria-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
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

  // Obtener color del nivel de riesgo
  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Obtener color de severidad
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Obtener color de prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Obtener icono del tipo de consulta
  const getConsultationIcon = (type) => {
    switch (type) {
      case 'vaccination': return <Syringe className="w-4 h-4" />;
      case 'checkup': return <Stethoscope className="w-4 h-4" />;
      case 'treatment': return <Heart className="w-4 h-4" />;
      case 'emergency': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
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
          <h2 className="text-3xl font-bold text-gray-900">Reportes de Salud Veterinaria</h2>
          <p className="text-gray-600 mt-1">Monitoreo integral de salud bovina con geolocalización</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleDownloadReport} disabled={isLoading}>
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Consulta
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
                <Select value={selectedHealthCategory} onValueChange={setSelectedHealthCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Categorías</SelectItem>
                    <SelectItem value="vaccination">Vacunación</SelectItem>
                    <SelectItem value="disease">Enfermedades</SelectItem>
                    <SelectItem value="treatment">Tratamientos</SelectItem>
                    <SelectItem value="checkup">Revisiones</SelectItem>
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
                    <SelectItem value="quarantine">Zona de Cuarentena</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={selectedVeterinarian} onValueChange={setSelectedVeterinarian}>
                  <SelectTrigger>
                    <SelectValue placeholder="Veterinario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los Veterinarios</SelectItem>
                    <SelectItem value="sarah">Dr. Sarah Johnson</SelectItem>
                    <SelectItem value="carlos">Dr. Carlos Mendez</SelectItem>
                    <SelectItem value="ana">Dra. Ana López</SelectItem>
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
                setSelectedHealthCategory('all');
                setSelectedLocation('all');
                setSelectedVeterinarian('all');
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

      {/* Resumen de Salud Principal */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={pulseVariants} animate="pulse">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Bovinos Saludables</p>
                  <p className="text-2xl font-bold text-green-900">
                    {data.summary.healthyBovines}/{data.summary.totalBovines}
                  </p>
                  <div className="flex items-center mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">
                      {((data.summary.healthyBovines / data.summary.totalBovines) * 100).toFixed(1)}% del rebaño
                    </span>
                  </div>
                </div>
                <div className="bg-green-500 rounded-full p-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Bovinos Enfermos</p>
                  <p className="text-2xl font-bold text-red-900">{data.summary.sickBovines}</p>
                  <div className="flex items-center mt-1">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-1" />
                    <span className="text-sm text-red-600">
                      Requieren atención inmediata
                    </span>
                  </div>
                </div>
                <div className="bg-red-500 rounded-full p-3">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">En Tratamiento</p>
                  <p className="text-2xl font-bold text-yellow-900">{data.summary.underTreatment}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="w-4 h-4 text-yellow-600 mr-1" />
                    <span className="text-sm text-yellow-600">
                      Recuperación: {data.summary.recoveryRate}%
                    </span>
                  </div>
                </div>
                <div className="bg-yellow-500 rounded-full p-3">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Vacunaciones Este Mes</p>
                  <p className="text-2xl font-bold text-blue-900">{data.summary.vaccinationsThisMonth}</p>
                  <div className="flex items-center mt-1">
                    <Shield className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-sm text-blue-600">
                      Score de Salud: {data.summary.healthScore}%
                    </span>
                  </div>
                </div>
                <div className="bg-blue-500 rounded-full p-3">
                  <Syringe className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Mapa de Salud por Ubicaciones */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Mapa de Salud por Ubicaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.locationHealthMap.map((location, index) => (
                <motion.div
                  key={location.area}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-l-4 p-4 rounded-lg ${getRiskColor(location.riskLevel)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{location.area}</h4>
                    <Badge className={getRiskColor(location.riskLevel)}>
                      {location.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total de Bovinos:</span>
                      <span className="font-medium">{location.totalBovines}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Saludables:</span>
                      <span className="font-medium text-green-600">{location.healthyBovines}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Enfermos:</span>
                      <span className="font-medium text-red-600">{location.sickBovines}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>En Tratamiento:</span>
                      <span className="font-medium text-yellow-600">{location.underTreatment}</span>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Score de Salud:</span>
                      <span className="font-medium">{location.healthScore}%</span>
                    </div>
                    <Progress value={location.healthScore} className="h-2" />
                    
                    <div className="text-xs text-gray-500 mt-2">
                      📍 Lat: {location.coordinates.lat.toFixed(4)}, Lng: {location.coordinates.lng.toFixed(4)}
                    </div>
                    <div className="text-xs text-gray-600">
                      Última inspección: {format(new Date(location.lastInspection), 'dd/MM/yyyy')}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {location.commonIssues.map((issue, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {issue}
                        </Badge>
                      ))}
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
            <TabsTrigger value="diseases">Enfermedades</TabsTrigger>
            <TabsTrigger value="vaccinations">Vacunaciones</TabsTrigger>
            <TabsTrigger value="medications">Medicamentos</TabsTrigger>
            <TabsTrigger value="schedule">Agenda</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tendencias de Salud Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={data.healthTrends}>
                    <defs>
                      <linearGradient id="colorHealthy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorSick" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="healthy" 
                      stackId="1"
                      stroke="#10B981" 
                      fillOpacity={1}
                      fill="url(#colorHealthy)"
                      name="% Saludables"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sick" 
                      stackId="1"
                      stroke="#EF4444" 
                      fillOpacity={1}
                      fill="url(#colorSick)"
                      name="% Enfermos"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="vaccinated" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Vacunados"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diseases" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Enfermedades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.diseaseDistribution.map((disease, index) => (
                    <motion.div
                      key={disease.disease}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${getSeverityColor(disease.severity)}`} />
                        <div>
                          <h4 className="font-semibold">{disease.disease}</h4>
                          <p className="text-sm text-gray-600">
                            📍 Lat: {disease.averageLocation.lat.toFixed(4)}, 
                            Lng: {disease.averageLocation.lng.toFixed(4)}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {disease.affectedAreas.map((area, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{disease.cases}</p>
                        <p className="text-sm text-gray-600">casos</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600">{disease.recoveryRate}% recuperación</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vaccinations" className="space-y-4">
            {data.vaccinationProgress.map((vaccine, index) => (
              <motion.div
                key={vaccine.vaccine}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{vaccine.vaccine}</CardTitle>
                      <Badge className="bg-blue-100 text-blue-800">
                        {vaccine.percentage.toFixed(1)}% Completado
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Programadas: {vaccine.scheduled}</span>
                        <span>Completadas: {vaccine.completed}</span>
                        <span>Pendientes: {vaccine.pending}</span>
                        <span>Próxima fecha: {format(new Date(vaccine.nextDue), 'dd/MM/yyyy')}</span>
                      </div>
                      <Progress value={vaccine.percentage} className="h-3" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                        {vaccine.locations.map((location, idx) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                            <h5 className="font-medium text-sm">{location.area}</h5>
                            <div className="flex justify-between text-xs text-gray-600 mt-1">
                              <span>{location.completed}/{location.total}</span>
                              <span>{((location.completed / location.total) * 100).toFixed(1)}%</span>
                            </div>
                            <Progress 
                              value={(location.completed / location.total) * 100} 
                              className="h-1 mt-1" 
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              📍 {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Uso de Medicamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.medicationUsage.map((medication, index) => (
                    <motion.div
                      key={medication.medication}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">{medication.medication}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                          <div>
                            <span className="text-gray-600">Cantidad Usada:</span>
                            <p className="font-medium">{medication.totalUsed} ml</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Costo Total:</span>
                            <p className="font-medium">${medication.totalCost.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Aplicaciones:</span>
                            <p className="font-medium">{medication.applicationsCount}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Efectividad:</span>
                            <p className="font-medium text-green-600">{medication.effectiveness}%</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {medication.locations.map((location, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {location}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Último uso: {format(new Date(medication.lastUsed), 'dd/MM/yyyy')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Próximas Citas y Tratamientos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.upcomingSchedule.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border-l-4 p-4 rounded-lg ${getPriorityColor(appointment.priority)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-white rounded-full p-2">
                            {getConsultationIcon(appointment.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{appointment.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(appointment.date), 'dd/MM/yyyy')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {appointment.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {appointment.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {appointment.bovinesCount} bovinos
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              📍 Lat: {appointment.coordinates.lat.toFixed(4)}, 
                              Lng: {appointment.coordinates.lng.toFixed(4)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Veterinario: {appointment.veterinarian}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={appointment.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                          appointment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-green-100 text-green-800'}>
                            {appointment.priority.toUpperCase()}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">
                            ~{appointment.estimatedDuration} min
                          </p>
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

      {/* Visitas Veterinarias Recientes */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              Visitas Veterinarias Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.veterinaryVisits.map((visit, index) => (
                <motion.div
                  key={visit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{visit.veterinarian}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{format(new Date(visit.date), 'dd/MM/yyyy')} - {visit.time}</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {visit.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{visit.bovinesChecked}</p>
                          <p className="text-xs text-gray-600">Revisados</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">{visit.diagnosesGiven}</p>
                          <p className="text-xs text-gray-600">Diagnósticos</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-yellow-600">{visit.treatmentsApplied}</p>
                          <p className="text-xs text-gray-600">Tratamientos</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{visit.vaccinationsGiven}</p>
                          <p className="text-xs text-gray-600">Vacunaciones</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 bg-white p-2 rounded border-l-4 border-blue-200">
                        {visit.notes}
                      </p>
                      
                      <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
                        <span>📍 Lat: {visit.coordinates.lat.toFixed(4)}, Lng: {visit.coordinates.lng.toFixed(4)}</span>
                        <span>Duración: {visit.duration} min</span>
                        <span>Costo: ${visit.cost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
              <span>Generando reporte de salud...</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HealthReports;