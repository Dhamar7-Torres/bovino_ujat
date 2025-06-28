import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  MapPin, 
  Eye, 
  Settings, 
  Plus, 
  Share2, 
  Star, 
  Clock, 
  Users, 
  Activity, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  Zap, 
  Heart, 
  DollarSign, 
  Milk, 
  Beef, 
  Shield, 
  Search,
  RefreshCw,
  Grid,
  List,
  Bookmark,
  Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
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
  AreaChart
} from 'recharts';

const ReportsDashboard = () => {
  // Estados para gestión del dashboard
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteReports, setFavoriteReports] = useState([]);

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

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: { type: "spring", stiffness: 300 }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity }
    }
  };

  // Cargar datos del dashboard al montar el componente
  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeframe, selectedCategory]);

  // Obtener datos del dashboard desde la API
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        timeframe: selectedTimeframe,
        category: selectedCategory
      });

      const response = await fetch(`/api/reports/dashboard?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al cargar el dashboard de reportes');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos mock para desarrollo con geolocalización completa
  const mockDashboardData = {
    summary: {
      totalReports: 42,
      reportesGeneradosHoy: 8,
      reportesFavoritos: 12,
      reportesCompartidos: 15,
      tiempoPromedioGeneracion: 3.2, // minutos
      ultimaActualizacion: '2025-06-27T14:30:00Z'
    },
    keyMetrics: [
      {
        title: 'Salud del Rebaño',
        value: 86.7,
        unit: '%',
        trend: 2.3,
        status: 'excellent',
        icon: Heart,
        color: 'green',
        lastUpdated: '2025-06-27T12:00:00Z',
        location: 'Todo el Rancho',
        coordinates: { lat: 17.9892, lng: -92.9475 }
      },
      {
        title: 'Producción de Leche',
        value: 15680.5,
        unit: 'L',
        trend: 8.7,
        status: 'excellent',
        icon: Milk,
        color: 'blue',
        lastUpdated: '2025-06-27T06:30:00Z',
        location: 'Salas de Ordeño',
        coordinates: { lat: 17.9892, lng: -92.9475 }
      },
      {
        title: 'Ingresos Mensuales',
        value: 485670.50,
        unit: 'MXN',
        trend: 12.5,
        status: 'excellent',
        icon: DollarSign,
        color: 'emerald',
        lastUpdated: '2025-06-27T18:00:00Z',
        location: 'Administración',
        coordinates: { lat: 17.9892, lng: -92.9478 }
      },
      {
        title: 'Producción de Carne',
        value: 2856.8,
        unit: 'kg',
        trend: 5.2,
        status: 'good',
        icon: Beef,
        color: 'red',
        lastUpdated: '2025-06-27T16:45:00Z',
        location: 'Corrales de Engorde',
        coordinates: { lat: 17.9890, lng: -92.9470 }
      }
    ],
    reportCategories: [
      { 
        name: 'Salud Veterinaria', 
        count: 15, 
        percentage: 35.7,
        color: '#10B981',
        icon: Heart,
        avgGenerationTime: 2.8,
        lastGenerated: '2025-06-27T10:15:00Z'
      },
      { 
        name: 'Producción', 
        count: 12, 
        percentage: 28.6,
        color: '#3B82F6',
        icon: Activity,
        avgGenerationTime: 3.5,
        lastGenerated: '2025-06-27T08:30:00Z'
      },
      { 
        name: 'Finanzas', 
        count: 8, 
        percentage: 19.0,
        color: '#F59E0B',
        icon: DollarSign,
        avgGenerationTime: 4.2,
        lastGenerated: '2025-06-26T16:20:00Z'
      },
      { 
        name: 'Personalizados', 
        count: 7, 
        percentage: 16.7,
        color: '#8B5CF6',
        icon: Settings,
        avgGenerationTime: 2.1,
        lastGenerated: '2025-06-27T14:10:00Z'
      }
    ],
    recentReports: [
      {
        id: 1,
        title: 'Reporte de Vacunación Mensual - Sector Norte',
        type: 'health',
        category: 'Salud Veterinaria',
        generatedBy: 'Dr. Sarah Johnson',
        generatedAt: '2025-06-27T10:15:00Z',
        size: '2.4 MB',
        format: 'PDF',
        status: 'completed',
        downloads: 5,
        location: 'Sector Norte',
        coordinates: { lat: 17.9899, lng: -92.9470 },
        description: 'Análisis completo de vacunaciones realizadas en el sector norte durante junio',
        tags: ['vacunación', 'sector-norte', 'mensual'],
        isFavorite: true,
        isShared: false
      },
      {
        id: 2,
        title: 'Análisis de Producción Lechera Semanal',
        type: 'production',
        category: 'Producción',
        generatedBy: 'María González',
        generatedAt: '2025-06-27T08:30:00Z',
        size: '3.1 MB',
        format: 'PDF',
        status: 'completed',
        downloads: 12,
        location: 'Salas de Ordeño A, B, C',
        coordinates: { lat: 17.9892, lng: -92.9475 },
        description: 'Producción lechera detallada por sala de ordeño con métricas de calidad',
        tags: ['producción', 'leche', 'semanal', 'calidad'],
        isFavorite: false,
        isShared: true
      },
      {
        id: 3,
        title: 'Reporte Financiero Q2 2025',
        type: 'financial',
        category: 'Finanzas',
        generatedBy: 'Carlos Mendez',
        generatedAt: '2025-06-26T16:20:00Z',
        size: '4.7 MB',
        format: 'PDF',
        status: 'completed',
        downloads: 8,
        location: 'Oficina Administrativa',
        coordinates: { lat: 17.9892, lng: -92.9478 },
        description: 'Análisis financiero trimestral con proyecciones y análisis de rentabilidad',
        tags: ['finanzas', 'trimestral', 'rentabilidad'],
        isFavorite: true,
        isShared: true
      },
      {
        id: 4,
        title: 'Control de Medicamentos por Ubicación',
        type: 'custom',
        category: 'Personalizados',
        generatedBy: 'Dra. Ana López',
        generatedAt: '2025-06-26T14:10:00Z',
        size: '1.8 MB',
        format: 'Excel',
        status: 'completed',
        downloads: 3,
        location: 'Farmacia Veterinaria',
        coordinates: { lat: 17.9892, lng: -92.9478 },
        description: 'Inventario y uso de medicamentos clasificado por área geográfica',
        tags: ['medicamentos', 'inventario', 'geolocalización'],
        isFavorite: false,
        isShared: false
      },
      {
        id: 5,
        title: 'Reporte de Reproducción - Inseminación Artificial',
        type: 'health',
        category: 'Salud Veterinaria',
        generatedBy: 'Dr. Juan Pérez',
        generatedAt: '2025-06-25T11:45:00Z',
        size: '2.9 MB',
        format: 'PDF',
        status: 'completed',
        downloads: 6,
        location: 'Centro de Reproducción',
        coordinates: { lat: 17.9905, lng: -92.9462 },
        description: 'Resultados de inseminación artificial con tasas de éxito por área',
        tags: ['reproducción', 'inseminación', 'tasas-éxito'],
        isFavorite: true,
        isShared: false
      }
    ],
    weeklyTrends: [
      { day: 'Lun', reports: 6, health: 2, production: 2, financial: 1, custom: 1 },
      { day: 'Mar', reports: 8, health: 3, production: 2, financial: 2, custom: 1 },
      { day: 'Mié', reports: 5, health: 1, production: 3, financial: 0, custom: 1 },
      { day: 'Jue', reports: 9, health: 4, production: 2, financial: 2, custom: 1 },
      { day: 'Vie', reports: 7, health: 2, production: 3, financial: 1, custom: 1 },
      { day: 'Sáb', reports: 4, health: 1, production: 1, financial: 1, custom: 1 },
      { day: 'Dom', reports: 3, health: 2, production: 0, financial: 0, custom: 1 }
    ],
    topUsers: [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        role: 'Veterinaria Principal',
        avatar: '/avatars/sarah.jpg',
        reportsGenerated: 15,
        favoriteCategory: 'Salud Veterinaria',
        lastActive: '2025-06-27T10:15:00Z',
        efficiency: 95.2
      },
      {
        id: 2,
        name: 'María González',
        role: 'Supervisora de Producción',
        avatar: '/avatars/maria.jpg',
        reportsGenerated: 12,
        favoriteCategory: 'Producción',
        lastActive: '2025-06-27T08:30:00Z',
        efficiency: 92.8
      },
      {
        id: 3,
        name: 'Carlos Mendez',
        role: 'Administrador Financiero',
        avatar: '/avatars/carlos.jpg',
        reportsGenerated: 8,
        favoriteCategory: 'Finanzas',
        lastActive: '2025-06-26T16:20:00Z',
        efficiency: 89.5
      },
      {
        id: 4,
        name: 'Dra. Ana López',
        role: 'Veterinaria Especialista',
        avatar: '/avatars/ana.jpg',
        reportsGenerated: 7,
        favoriteCategory: 'Salud Veterinaria',
        lastActive: '2025-06-26T14:10:00Z',
        efficiency: 94.1
      }
    ],
    upcomingScheduled: [
      {
        id: 1,
        title: 'Reporte Semanal de Salud',
        type: 'health',
        scheduledFor: '2025-06-28T09:00:00Z',
        frequency: 'weekly',
        estimatedDuration: 5,
        recipients: ['sarah@rancho.com', 'admin@rancho.com'],
        location: 'Todo el Rancho',
        coordinates: { lat: 17.9892, lng: -92.9475 }
      },
      {
        id: 2,
        title: 'Análisis de Producción Mensual',
        type: 'production',
        scheduledFor: '2025-06-30T18:00:00Z',
        frequency: 'monthly',
        estimatedDuration: 8,
        recipients: ['maria@rancho.com', 'admin@rancho.com'],
        location: 'Salas de Producción',
        coordinates: { lat: 17.9892, lng: -92.9475 }
      },
      {
        id: 3,
        title: 'Reporte Financiero Trimestral',
        type: 'financial',
        scheduledFor: '2025-06-30T23:59:00Z',
        frequency: 'quarterly',
        estimatedDuration: 12,
        recipients: ['carlos@rancho.com', 'director@rancho.com'],
        location: 'Oficina Administrativa',
        coordinates: { lat: 17.9892, lng: -92.9478 }
      }
    ],
    systemAlerts: [
      {
        id: 1,
        type: 'warning',
        title: 'Capacidad de almacenamiento al 85%',
        message: 'El almacenamiento de reportes está llegando al límite. Considera archivar reportes antiguos.',
        timestamp: '2025-06-27T13:45:00Z',
        action: 'archive_old_reports'
      },
      {
        id: 2,
        type: 'info',
        title: 'Nuevas funciones disponibles',
        message: 'Se han agregado nuevas métricas de geolocalización a los reportes de salud.',
        timestamp: '2025-06-26T09:30:00Z',
        action: 'view_features'
      }
    ]
  };

  // Usar datos mock si no hay datos reales
  const data = dashboardData || mockDashboardData;

  // Colores para gráficos
  const CHART_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];

  // Manejar descarga de reporte
  const handleDownloadReport = async (reportId) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Error al descargar el reporte');
    }
  };

  // Manejar favoritos
  const handleToggleFavorite = (reportId) => {
    setFavoriteReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Obtener icono del tipo de reporte
  const getReportIcon = (type) => {
    switch (type) {
      case 'health': return <Heart className="w-4 h-4" />;
      case 'production': return <Activity className="w-4 h-4" />;
      case 'financial': return <DollarSign className="w-4 h-4" />;
      case 'custom': return <Settings className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // Obtener color del tipo de alerta
  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      case 'success': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Filtrar reportes
  const filteredReports = data.recentReports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <h2 className="text-3xl font-bold text-gray-900">Dashboard de Reportes</h2>
          <p className="text-gray-600 mt-1">
            Centro de control de reportes con análisis geolocalizado
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchDashboardData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Reporte
          </Button>
        </div>
      </motion.div>

      {/* Controles y Filtros */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-3">
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Hoy</SelectItem>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mes</SelectItem>
                    <SelectItem value="quarter">Trimestre</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="health">Salud</SelectItem>
                    <SelectItem value="production">Producción</SelectItem>
                    <SelectItem value="financial">Finanzas</SelectItem>
                    <SelectItem value="custom">Personalizados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 items-center">
                <Input
                  placeholder="Buscar reportes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <div className="flex gap-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Resumen Principal */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={pulseVariants} animate="pulse">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total de Reportes</p>
                  <p className="text-2xl font-bold text-blue-900">{data.summary.totalReports}</p>
                  <p className="text-sm text-blue-600 mt-1">
                    {data.summary.reportesGeneradosHoy} generados hoy
                  </p>
                </div>
                <div className="bg-blue-500 rounded-full p-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Reportes Favoritos</p>
                <p className="text-2xl font-bold text-green-900">{data.summary.reportesFavoritos}</p>
                <p className="text-sm text-green-600 mt-1">Marcados como importantes</p>
              </div>
              <div className="bg-green-500 rounded-full p-3">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Reportes Compartidos</p>
                <p className="text-2xl font-bold text-purple-900">{data.summary.reportesCompartidos}</p>
                <p className="text-sm text-purple-600 mt-1">Compartidos con el equipo</p>
              </div>
              <div className="bg-purple-500 rounded-full p-3">
                <Share2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Tiempo Promedio</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {data.summary.tiempoPromedioGeneracion} min
                </p>
                <p className="text-sm text-yellow-600 mt-1">Generación de reportes</p>
              </div>
              <div className="bg-yellow-500 rounded-full p-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Métricas Clave */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Métricas Clave del Rancho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.keyMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 bg-${metric.color}-100 rounded-full flex items-center justify-center`}>
                        <IconComponent className={`w-5 h-5 text-${metric.color}-600`} />
                      </div>
                      <Badge className={`bg-${metric.color}-100 text-${metric.color}-800`}>
                        {metric.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-1">{metric.title}</h4>
                    <p className="text-2xl font-bold mb-1">
                      {typeof metric.value === 'number' ? metric.value.toLocaleString('es-MX') : metric.value} {metric.unit}
                    </p>
                    
                    <div className="flex items-center gap-1 text-sm">
                      {metric.trend > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      )}
                      <span className={metric.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                        {metric.trend > 0 ? '+' : ''}{metric.trend}%
                      </span>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {metric.location}
                      </div>
                      <div className="mt-1">
                        📍 {metric.coordinates.lat.toFixed(4)}, {metric.coordinates.lng.toFixed(4)}
                      </div>
                      <div className="mt-1">
                        Actualizado: {format(new Date(metric.lastUpdated), 'HH:mm')}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reportes Recientes */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Reportes Recientes
                </span>
                <Badge variant="secondary">{filteredReports.length} reportes</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-4' : 'space-y-3'}>
                <AnimatePresence>
                  {filteredReports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="border rounded-lg p-4 bg-white hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              report.type === 'health' ? 'bg-green-100' :
                              report.type === 'production' ? 'bg-blue-100' :
                              report.type === 'financial' ? 'bg-yellow-100' : 'bg-purple-100'
                            }`}>
                              {getReportIcon(report.type)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 leading-tight">
                                {report.title}
                              </h4>
                              <p className="text-sm text-gray-600">{report.category}</p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                            {report.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {report.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                              <span>👤 {report.generatedBy}</span>
                              <span>📅 {format(new Date(report.generatedAt), 'dd/MM/yyyy HH:mm')}</span>
                              <span>📊 {report.size}</span>
                              <span>⬇️ {report.downloads}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{report.location}</span>
                            <span>•</span>
                            <span>📍 {report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(report.id)}
                            className={report.isFavorite ? 'text-yellow-600' : 'text-gray-400'}
                          >
                            <Star className="w-4 h-4" fill={report.isFavorite ? 'currentColor' : 'none'} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadReport(report.id)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {report.isShared && (
                            <Button variant="ghost" size="sm" className="text-blue-600">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Panel Lateral */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Distribución por Categorías */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                Distribución por Categorías
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.reportCategories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <p className="font-medium text-sm">{category.name}</p>
                          <p className="text-xs text-gray-600">
                            Promedio: {category.avgGenerationTime} min
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{category.count}</p>
                        <p className="text-xs text-gray-600">{category.percentage}%</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tendencias Semanales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tendencias Semanales</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.weeklyTrends}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="reports" 
                    stroke="#3B82F6" 
                    fillOpacity={1}
                    fill="url(#colorReports)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Usuarios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Top Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.topUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {user.reportsGenerated} reportes
                        </Badge>
                        <span className="text-xs text-green-600">
                          {user.efficiency}% eficiencia
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reportes Programados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Próximos Programados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.upcomingScheduled.map((scheduled, index) => (
                  <motion.div
                    key={scheduled.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded"
                  >
                    <h4 className="font-medium text-sm mb-1">{scheduled.title}</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(scheduled.scheduledFor), 'dd/MM/yyyy HH:mm')}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {scheduled.location}
                      </div>
                      <div>⏱️ ~{scheduled.estimatedDuration} min</div>
                      <div>📧 {scheduled.recipients.length} destinatarios</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alertas del Sistema */}
      {data.systemAlerts.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Alertas del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.systemAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-l-4 p-4 rounded-lg ${getAlertColor(alert.type)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{alert.title}</h4>
                        <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {format(new Date(alert.timestamp), 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
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
              <span>Actualizando dashboard...</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ReportsDashboard;