import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Baby, 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  Activity,
  Users,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  BarChart3,
  PieChart
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { format, subMonths, isWithinInterval, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

const ReproductionDashboard = () => {
  // Estados principales
  const [dashboardData, setDashboardData] = useState({
    totalInseminations: 0,
    successfulInseminations: 0,
    currentPregnancies: 0,
    expectedBirths: 0,
    reproductiveRates: [],
    monthlyInseminations: [],
    pregnancyDistribution: [],
    upcomingEvents: [],
    riskAlerts: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('6months');

  // Cargar datos del dashboard
  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reproduction/dashboard?range=${dateRange}`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error cargando datos del dashboard de reproducción:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular métricas adicionales
  const getSuccessRate = () => {
    if (dashboardData.totalInseminations === 0) return 0;
    return ((dashboardData.successfulInseminations / dashboardData.totalInseminations) * 100).toFixed(1);
  };

  const getUpcomingBirthsThisMonth = () => {
    return dashboardData.upcomingEvents.filter(event => 
      event.type === 'birth' && 
      isWithinInterval(new Date(event.date), {
        start: new Date(),
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      })
    ).length;
  };

  const getOverduePregnancies = () => {
    return dashboardData.upcomingEvents.filter(event => 
      event.type === 'birth' && 
      new Date(event.date) < new Date()
    ).length;
  };

  // Configuración de colores para gráficos
  const CHART_COLORS = {
    primary: '#3B82F6',
    secondary: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#8B5CF6'
  };

  const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Datos para gráfico de tasas reproductivas
  const reproductiveRatesData = dashboardData.reproductiveRates.map(item => ({
    month: format(new Date(item.month), 'MMM', { locale: es }),
    success_rate: parseFloat(item.success_rate),
    inseminations: item.inseminations,
    pregnancies: item.pregnancies
  }));

  // Datos para distribución de embarazos
  const pregnancyStageData = dashboardData.pregnancyDistribution.map(item => ({
    name: item.stage,
    value: item.count,
    percentage: item.percentage
  }));

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  // Componente de tarjeta de estadística
  const StatCard = ({ title, value, change, icon: Icon, color, subtitle }) => (
    <motion.div variants={cardVariants}>
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
              {change && (
                <p className={`text-sm flex items-center mt-1 ${
                  change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {change > 0 ? '+' : ''}{change}% vs mes anterior
                </p>
              )}
            </div>
            <div className={`p-3 rounded-full ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Componente de alerta de riesgo
  const RiskAlert = ({ alert }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
    >
      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-medium text-red-900">{alert.title}</h4>
        <p className="text-sm text-red-700 mt-1">{alert.description}</p>
        {alert.bovine_info && (
          <p className="text-xs text-red-600 mt-1">
            Vaca: {alert.bovine_info.ear_tag} - {alert.bovine_info.name}
          </p>
        )}
      </div>
      <Badge variant="destructive" className="text-xs">
        {alert.priority}
      </Badge>
    </motion.div>
  );

  // Componente de evento próximo
  const UpcomingEvent = ({ event }) => {
    const daysFromNow = differenceInDays(new Date(event.date), new Date());
    const isOverdue = daysFromNow < 0;
    const iconConfig = {
      birth: { icon: Baby, color: 'text-pink-600' },
      checkup: { icon: Activity, color: 'text-blue-600' },
      insemination: { icon: Heart, color: 'text-red-600' }
    };
    
    const config = iconConfig[event.type] || iconConfig.checkup;
    const Icon = config.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-3 p-3 rounded-lg border ${
          isOverdue ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className={`p-2 rounded-full ${isOverdue ? 'bg-red-100' : 'bg-gray-100'}`}>
          <Icon className={`h-4 w-4 ${isOverdue ? 'text-red-600' : config.color}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{event.title}</h4>
          <p className="text-sm text-gray-600">{event.description}</p>
          <p className={`text-xs mt-1 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
            {isOverdue 
              ? `Atrasado ${Math.abs(daysFromNow)} días`
              : daysFromNow === 0 
                ? 'Hoy' 
                : `En ${daysFromNow} días`
            }
          </p>
        </div>
        <Badge variant={isOverdue ? "destructive" : "secondary"} className="text-xs">
          {format(new Date(event.date), 'dd/MM', { locale: es })}
        </Badge>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="text-red-600" />
              Dashboard de Reproducción
            </h1>
            <p className="text-gray-600 mt-2">
              Monitoreo completo del programa reproductivo del ganado
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setDateRange('3months')}>
              3 meses
            </Button>
            <Button 
              variant={dateRange === '6months' ? 'default' : 'outline'} 
              onClick={() => setDateRange('6months')}
            >
              6 meses
            </Button>
            <Button variant="outline" onClick={() => setDateRange('1year')}>
              1 año
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Tarjetas de estadísticas principales */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Inseminaciones Totales"
          value={dashboardData.totalInseminations}
          change={12}
          icon={Heart}
          color="bg-red-500"
          subtitle="Este período"
        />
        
        <StatCard
          title="Tasa de Éxito"
          value={`${getSuccessRate()}%`}
          change={5.2}
          icon={Target}
          color="bg-green-500"
          subtitle="Embarazos confirmados"
        />
        
        <StatCard
          title="Embarazos Actuales"
          value={dashboardData.currentPregnancies}
          icon={Baby}
          color="bg-pink-500"
          subtitle="En seguimiento"
        />
        
        <StatCard
          title="Partos Esperados"
          value={getUpcomingBirthsThisMonth()}
          icon={Calendar}
          color="bg-blue-500"
          subtitle="Este mes"
        />
      </motion.div>

      {/* Alertas de riesgo */}
      {dashboardData.riskAlerts.length > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Alertas de Riesgo ({dashboardData.riskAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.riskAlerts.slice(0, 3).map((alert, index) => (
                  <RiskAlert key={index} alert={alert} />
                ))}
                {dashboardData.riskAlerts.length > 3 && (
                  <Button variant="outline" size="sm" className="w-full">
                    Ver todas las alertas ({dashboardData.riskAlerts.length})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de tasas reproductivas */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Tasas Reproductivas Mensuales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reproductiveRatesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'success_rate' ? `${value}%` : value,
                        name === 'success_rate' ? 'Tasa de éxito' : name
                      ]}
                      labelFormatter={(label) => `Mes: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="success_rate" 
                      stroke={CHART_COLORS.primary} 
                      strokeWidth={3}
                      dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gráfico de distribución de embarazos */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-green-600" />
                Distribución de Embarazos por Etapa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pregnancyStageData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {pregnancyStageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Inseminaciones mensuales */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Actividad de Inseminación Mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.monthlyInseminations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => format(new Date(value), 'MMM yy', { locale: es })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => format(new Date(value), 'MMMM yyyy', { locale: es })}
                    formatter={(value, name) => [
                      value,
                      name === 'artificial' ? 'Artificial' : 'Natural'
                    ]}
                  />
                  <Bar dataKey="artificial" stackId="a" fill={CHART_COLORS.primary} />
                  <Bar dataKey="natural" stackId="a" fill={CHART_COLORS.success} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Eventos próximos y métricas adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Eventos próximos */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Eventos Próximos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {dashboardData.upcomingEvents.slice(0, 5).map((event, index) => (
                  <UpcomingEvent key={index} event={event} />
                ))}
                {dashboardData.upcomingEvents.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No hay eventos programados próximamente
                  </p>
                )}
              </div>
              {dashboardData.upcomingEvents.length > 5 && (
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Ver todos los eventos
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Métricas adicionales */}
        <motion.div variants={itemVariants}>
          <div className="space-y-4">
            {/* Resumen rápido */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen Rápido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hembras en reproducción</span>
                  <span className="font-semibold">{dashboardData.totalFemales || 0}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Toros activos</span>
                  <span className="font-semibold">{dashboardData.activeBulls || 0}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Partos atrasados</span>
                  <span className={`font-semibold ${getOverduePregnancies() > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {getOverduePregnancies()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Efectividad programa</span>
                  <Badge variant={getSuccessRate() > 70 ? "default" : "secondary"}>
                    {getSuccessRate() > 70 ? "Excelente" : getSuccessRate() > 50 ? "Buena" : "Necesita mejora"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Acciones rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Inseminación
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Baby className="h-4 w-4 mr-2" />
                  Registrar Nacimiento
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  Programar Revisión
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Reportes
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReproductionDashboard;