import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Download, 
  Filter, 
  Calendar, 
  MapPin,
  CreditCard,
  Banknote,
  Wallet,
  Receipt,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  ResponsiveContainer 
} from 'recharts';

const FinancialReports = () => {
  // Estados para gestión de datos financieros
  const [financialData, setFinancialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

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

  const numberVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 200, delay: 0.2 }
    }
  };

  // Cargar datos financieros al montar el componente
  useEffect(() => {
    fetchFinancialData();
  }, [dateRange, selectedPeriod, selectedCategory, selectedLocation]);

  // Obtener datos financieros desde la API
  const fetchFinancialData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        from: dateRange.from?.toISOString(),
        to: dateRange.to?.toISOString(),
        period: selectedPeriod,
        category: selectedCategory,
        location: selectedLocation
      });

      const response = await fetch(`/api/reports/financial?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFinancialData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al cargar datos financieros');
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos mock para desarrollo con geolocalización
  const mockFinancialData = {
    summary: {
      totalIncome: 485670.50,
      totalExpenses: 312450.75,
      netProfit: 173219.75,
      profitMargin: 35.7,
      monthlyGrowth: 12.5,
      yearlyGrowth: 18.3
    },
    incomeByCategory: [
      { name: 'Venta de Leche', value: 235000, percentage: 48.4, color: '#10B981', location: 'Sector Norte' },
      { name: 'Venta de Carne', value: 156000, percentage: 32.1, color: '#3B82F6', location: 'Matadero Central' },
      { name: 'Servicios Veterinarios', value: 45000, percentage: 9.3, color: '#8B5CF6', location: 'Clínica Móvil' },
      { name: 'Alquiler de Equipos', value: 28500, percentage: 5.9, color: '#F59E0B', location: 'Almacén' },
      { name: 'Fertilizante Orgánico', value: 21170.50, percentage: 4.4, color: '#EF4444', location: 'Área de Compostaje' }
    ],
    expensesByCategory: [
      { name: 'Alimentación', value: 125000, percentage: 40.0, color: '#DC2626', location: 'Silos de Alimento' },
      { name: 'Medicamentos', value: 78500, percentage: 25.1, color: '#7C3AED', location: 'Farmacia Veterinaria' },
      { name: 'Salarios', value: 65000, percentage: 20.8, color: '#059669', location: 'Oficina Administrativa' },
      { name: 'Mantenimiento', value: 28750, percentage: 9.2, color: '#D97706', location: 'Taller de Reparaciones' },
      { name: 'Servicios', value: 15200.75, percentage: 4.9, color: '#7C2D12', location: 'Oficinas Generales' }
    ],
    monthlyTrends: [
      { month: 'Ene', income: 42000, expenses: 28000, profit: 14000, location: 'Rancho Principal' },
      { month: 'Feb', income: 38500, expenses: 26500, profit: 12000, location: 'Rancho Principal' },
      { month: 'Mar', income: 45200, expenses: 29800, profit: 15400, location: 'Rancho Principal' },
      { month: 'Abr', income: 41800, expenses: 27200, profit: 14600, location: 'Rancho Principal' },
      { month: 'May', income: 47300, expenses: 31000, profit: 16300, location: 'Rancho Principal' },
      { month: 'Jun', income: 49870, expenses: 32450, profit: 17420, location: 'Rancho Principal' }
    ],
    locationAnalysis: [
      {
        location: 'Sector Norte',
        coordinates: { lat: 17.9899, lng: -92.9470 },
        totalIncome: 145000,
        totalExpenses: 89000,
        netProfit: 56000,
        profitMargin: 38.6,
        mainActivities: ['Producción de Leche', 'Pastoreo']
      },
      {
        location: 'Sector Sur',
        coordinates: { lat: 17.9885, lng: -92.9485 },
        totalIncome: 98500,
        totalExpenses: 65000,
        netProfit: 33500,
        profitMargin: 34.0,
        mainActivities: ['Engorde', 'Reproducción']
      },
      {
        location: 'Área Central',
        coordinates: { lat: 17.9892, lng: -92.9478 },
        totalIncome: 124000,
        totalExpenses: 78500,
        netProfit: 45500,
        profitMargin: 36.7,
        mainActivities: ['Servicios Veterinarios', 'Administración']
      },
      {
        location: 'Zona de Procesamiento',
        coordinates: { lat: 17.9905, lng: -92.9462 },
        totalIncome: 118170.50,
        totalExpenses: 79950.75,
        netProfit: 38219.75,
        profitMargin: 32.3,
        mainActivities: ['Procesamiento', 'Empaque']
      }
    ],
    recentTransactions: [
      {
        id: 1,
        type: 'income',
        description: 'Venta de leche - Lote #2456',
        amount: 12450.00,
        date: '2025-06-27',
        location: 'Sector Norte',
        coordinates: { lat: 17.9899, lng: -92.9470 },
        category: 'Venta de Leche',
        paymentMethod: 'Transferencia',
        reference: 'MILK-2025-0627'
      },
      {
        id: 2,
        type: 'expense',
        description: 'Compra de medicamentos veterinarios',
        amount: -2850.00,
        date: '2025-06-26',
        location: 'Farmacia Veterinaria',
        coordinates: { lat: 17.9892, lng: -92.9478 },
        category: 'Medicamentos',
        paymentMethod: 'Efectivo',
        reference: 'MED-2025-0626'
      },
      {
        id: 3,
        type: 'income',
        description: 'Servicio veterinario - Revisión reproductiva',
        amount: 1850.00,
        date: '2025-06-25',
        location: 'Sector Sur',
        coordinates: { lat: 17.9885, lng: -92.9485 },
        category: 'Servicios Veterinarios',
        paymentMethod: 'Tarjeta',
        reference: 'VET-2025-0625'
      }
    ],
    kpis: {
      averageTransactionValue: 2485.50,
      transactionsPerDay: 15.2,
      topPerformingLocation: 'Sector Norte',
      costPerBovine: 312.45,
      revenuePerBovine: 485.67,
      profitPerBovine: 173.22
    }
  };

  // Usar datos mock si no hay datos reales
  const data = financialData || mockFinancialData;

  // Colores para gráficos
  const CHART_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16'];

  // Manejar descarga de reporte
  const handleDownloadReport = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/reports/financial/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          dateRange,
          selectedPeriod,
          selectedCategory,
          selectedLocation
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-financiero-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
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

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  // Formatear porcentaje
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Obtener icono de tendencia
  const getTrendIcon = (value) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return null;
  };

  // Obtener color de tendencia
  const getTrendColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
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
          <h2 className="text-3xl font-bold text-gray-900">Reportes Financieros</h2>
          <p className="text-gray-600 mt-1">Análisis financiero detallado con geolocalización</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleDownloadReport} disabled={isLoading}>
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <TrendingUp className="w-4 h-4 mr-2" />
            Análisis Avanzado
          </Button>
        </div>
      </motion.div>

      {/* Filtros y Controles */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Categorías</SelectItem>
                    <SelectItem value="milk">Venta de Leche</SelectItem>
                    <SelectItem value="meat">Venta de Carne</SelectItem>
                    <SelectItem value="veterinary">Servicios Veterinarios</SelectItem>
                    <SelectItem value="feed">Alimentación</SelectItem>
                    <SelectItem value="medication">Medicamentos</SelectItem>
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
                    <SelectItem value="processing">Zona de Procesamiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy")
                        )
                      ) : (
                        "Seleccionar fechas"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button variant="outline" onClick={() => {
                setSelectedCategory('all');
                setSelectedLocation('all');
                handlePeriodChange('month');
              }}>
                <Filter className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Resumen Financiero Principal */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={numberVariants}>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(data.summary.totalIncome)}</p>
                  <div className="flex items-center mt-1">
                    {getTrendIcon(data.summary.monthlyGrowth)}
                    <span className={`text-sm ${getTrendColor(data.summary.monthlyGrowth)}`}>
                      {formatPercentage(data.summary.monthlyGrowth)} vs mes anterior
                    </span>
                  </div>
                </div>
                <div className="bg-green-500 rounded-full p-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={numberVariants}>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Gastos Totales</p>
                  <p className="text-2xl font-bold text-red-900">{formatCurrency(data.summary.totalExpenses)}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="w-4 h-4 text-red-600 mr-1" />
                    <span className="text-sm text-red-600">
                      {formatPercentage((data.summary.totalExpenses / data.summary.totalIncome) * 100)} del ingreso
                    </span>
                  </div>
                </div>
                <div className="bg-red-500 rounded-full p-3">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={numberVariants}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Ganancia Neta</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(data.summary.netProfit)}</p>
                  <div className="flex items-center mt-1">
                    <Target className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-sm text-blue-600">
                      Margen: {formatPercentage(data.summary.profitMargin)}
                    </span>
                  </div>
                </div>
                <div className="bg-blue-500 rounded-full p-3">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={numberVariants}>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Crecimiento Anual</p>
                  <p className="text-2xl font-bold text-purple-900">{formatPercentage(data.summary.yearlyGrowth)}</p>
                  <div className="flex items-center mt-1">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-1" />
                    <span className="text-sm text-purple-600">
                      Proyección positiva
                    </span>
                  </div>
                </div>
                <div className="bg-purple-500 rounded-full p-3">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Análisis por Ubicaciones */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Análisis Financiero por Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.locationAnalysis.map((location, index) => (
                <motion.div
                  key={location.location}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{location.location}</h4>
                    <Badge variant="outline" className="text-xs">
                      {formatPercentage(location.profitMargin)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ingresos:</span>
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(location.totalIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gastos:</span>
                      <span className="text-sm font-medium text-red-600">
                        {formatCurrency(location.totalExpenses)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ganancia:</span>
                      <span className="text-sm font-medium text-blue-600">
                        {formatCurrency(location.netProfit)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      📍 Lat: {location.coordinates.lat.toFixed(4)}, Lng: {location.coordinates.lng.toFixed(4)}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {location.mainActivities.map((activity, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {activity}
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
            <TabsTrigger value="income">Ingresos</TabsTrigger>
            <TabsTrigger value="expenses">Gastos</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tendencias Mensuales</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsLineChart data={data.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      name="Ingresos"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                      name="Gastos"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Ganancia"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Ingresos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={data.incomeByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="value"
                        label={({name, percentage}) => `${name}: ${percentage}%`}
                      >
                        {data.incomeByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ingresos por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.incomeByCategory.map((category, index) => (
                      <motion.div
                        key={category.name}
                        initial={{ opacity: 0, x: -20 }}
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
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-gray-600">📍 {category.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(category.value)}</p>
                          <p className="text-sm text-gray-600">{formatPercentage(category.percentage)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Gastos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={data.expensesByCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="value" fill="#EF4444" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gastos por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.expensesByCategory.map((category, index) => (
                      <motion.div
                        key={category.name}
                        initial={{ opacity: 0, x: -20 }}
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
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-gray-600">📍 {category.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(category.value)}</p>
                          <p className="text-sm text-gray-600">{formatPercentage(category.percentage)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="kpis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Valor Promedio por Transacción</p>
                      <p className="text-2xl font-bold">{formatCurrency(data.kpis.averageTransactionValue)}</p>
                    </div>
                    <Receipt className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Transacciones por Día</p>
                      <p className="text-2xl font-bold">{data.kpis.transactionsPerDay}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ubicación Más Rentable</p>
                      <p className="text-lg font-bold">{data.kpis.topPerformingLocation}</p>
                    </div>
                    <MapPin className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Costo por Bovino</p>
                      <p className="text-2xl font-bold">{formatCurrency(data.kpis.costPerBovine)}</p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ingresos por Bovino</p>
                      <p className="text-2xl font-bold">{formatCurrency(data.kpis.revenuePerBovine)}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ganancia por Bovino</p>
                      <p className="text-2xl font-bold">{formatCurrency(data.kpis.profitPerBovine)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Transacciones Recientes */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Transacciones Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{transaction.location}</span>
                        <span>•</span>
                        <span>{transaction.paymentMethod}</span>
                        <span>•</span>
                        <span>{transaction.reference}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        📍 Lat: {transaction.coordinates.lat}, Lng: {transaction.coordinates.lng}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : ''}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <p className="text-sm text-gray-600">{transaction.date}</p>
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
              <span>Generando reporte financiero...</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FinancialReports;