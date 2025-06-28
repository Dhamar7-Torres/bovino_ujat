import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CalendarIcon, Plus, Search, Filter, Baby, Clock, Heart, Eye, Edit, Trash2, MapPin, Stethoscope } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import LocationPicker from '../maps/LocationPicker';

const PregnancyTracking = () => {
  // Estados principales
  const [pregnancies, setPregnancies] = useState([]);
  const [filteredPregnancies, setFilteredPregnancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPregnancy, setEditingPregnancy] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    bovine_id: '',
    insemination_id: '',
    confirmation_date: null,
    confirmation_method: '',
    estimated_due_date: null,
    gestation_length: 280, // días promedio
    pregnancy_status: 'confirmed',
    veterinarian_id: '',
    ultrasound_results: '',
    fetal_count: 1,
    complications: '',
    last_check_date: null,
    next_check_date: null,
    check_location: null,
    body_condition_score: '',
    weight_at_confirmation: '',
    observations: '',
    dietary_requirements: '',
    movement_restrictions: ''
  });

  const [errors, setErrors] = useState({});
  const [availableFemales, setAvailableFemales] = useState([]);
  const [inseminationRecords, setInseminationRecords] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    loadPregnancies();
    loadAvailableFemales();
    loadInseminationRecords();
    loadVeterinarians();
  }, []);

  // Filtrar embarazos cuando cambien los filtros
  useEffect(() => {
    filterPregnancies();
  }, [pregnancies, searchTerm, filterStatus]);

  const loadPregnancies = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reproduction/pregnancy-tracking');
      const data = await response.json();
      setPregnancies(data);
    } catch (error) {
      console.error('Error cargando seguimiento de embarazos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableFemales = async () => {
    try {
      const response = await fetch('/api/bovines/breeding-females');
      const data = await response.json();
      setAvailableFemales(data);
    } catch (error) {
      console.error('Error cargando hembras:', error);
    }
  };

  const loadInseminationRecords = async () => {
    try {
      const response = await fetch('/api/reproduction/insemination-records/successful');
      const data = await response.json();
      setInseminationRecords(data);
    } catch (error) {
      console.error('Error cargando registros de inseminación:', error);
    }
  };

  const loadVeterinarians = async () => {
    try {
      const response = await fetch('/api/users/veterinarians');
      const data = await response.json();
      setVeterinarians(data);
    } catch (error) {
      console.error('Error cargando veterinarios:', error);
    }
  };

  const filterPregnancies = () => {
    let filtered = pregnancies;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(pregnancy =>
        pregnancy.bovine_ear_tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pregnancy.bovine_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(pregnancy => pregnancy.pregnancy_status === filterStatus);
    }

    setFilteredPregnancies(filtered);
  };

  const calculatePregnancyProgress = (confirmationDate, estimatedDueDate) => {
    const totalDays = differenceInDays(new Date(estimatedDueDate), new Date(confirmationDate));
    const daysPassed = differenceInDays(new Date(), new Date(confirmationDate));
    const progress = Math.min((daysPassed / totalDays) * 100, 100);
    return Math.max(progress, 0);
  };

  const getDaysRemaining = (estimatedDueDate) => {
    const remaining = differenceInDays(new Date(estimatedDueDate), new Date());
    return Math.max(remaining, 0);
  };

  const getPregnancyStage = (confirmationDate, estimatedDueDate) => {
    const daysPassed = differenceInDays(new Date(), new Date(confirmationDate));
    const totalDays = differenceInDays(new Date(estimatedDueDate), new Date(confirmationDate));
    const progress = (daysPassed / totalDays) * 100;

    if (progress < 33) return { stage: 'Primer trimestre', color: 'text-green-600' };
    if (progress < 66) return { stage: 'Segundo trimestre', color: 'text-blue-600' };
    if (progress < 90) return { stage: 'Tercer trimestre', color: 'text-orange-600' };
    return { stage: 'Próximo al parto', color: 'text-red-600' };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Calcular fecha estimada de parto si se cambia la fecha de confirmación
      if (field === 'confirmation_date' && value) {
        newData.estimated_due_date = addDays(value, newData.gestation_length);
      }
      
      // Recalcular fecha estimada si se cambia la duración de gestación
      if (field === 'gestation_length' && newData.confirmation_date) {
        newData.estimated_due_date = addDays(newData.confirmation_date, parseInt(value));
      }
      
      return newData;
    });

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bovine_id) newErrors.bovine_id = 'La hembra es requerida';
    if (!formData.confirmation_date) newErrors.confirmation_date = 'La fecha de confirmación es requerida';
    if (!formData.confirmation_method) newErrors.confirmation_method = 'El método de confirmación es requerido';
    if (!formData.estimated_due_date) newErrors.estimated_due_date = 'La fecha estimada de parto es requerida';
    if (!formData.veterinarian_id) newErrors.veterinarian_id = 'El veterinario es requerido';
    if (!formData.fetal_count) newErrors.fetal_count = 'El número de fetos es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const url = editingPregnancy 
        ? `/api/reproduction/pregnancy-tracking/${editingPregnancy.id}`
        : '/api/reproduction/pregnancy-tracking';
      
      const method = editingPregnancy ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await loadPregnancies();
        resetForm();
        setShowForm(false);
        alert(editingPregnancy ? 'Embarazo actualizado exitosamente' : 'Embarazo registrado exitosamente');
      } else {
        alert('Error al guardar el registro');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      bovine_id: '',
      insemination_id: '',
      confirmation_date: null,
      confirmation_method: '',
      estimated_due_date: null,
      gestation_length: 280,
      pregnancy_status: 'confirmed',
      veterinarian_id: '',
      ultrasound_results: '',
      fetal_count: 1,
      complications: '',
      last_check_date: null,
      next_check_date: null,
      check_location: null,
      body_condition_score: '',
      weight_at_confirmation: '',
      observations: '',
      dietary_requirements: '',
      movement_restrictions: ''
    });
    setErrors({});
    setEditingPregnancy(null);
  };

  const handleEdit = (pregnancy) => {
    setFormData({
      bovine_id: pregnancy.bovine_id,
      insemination_id: pregnancy.insemination_id || '',
      confirmation_date: new Date(pregnancy.confirmation_date),
      confirmation_method: pregnancy.confirmation_method,
      estimated_due_date: new Date(pregnancy.estimated_due_date),
      gestation_length: pregnancy.gestation_length || 280,
      pregnancy_status: pregnancy.pregnancy_status,
      veterinarian_id: pregnancy.veterinarian_id,
      ultrasound_results: pregnancy.ultrasound_results || '',
      fetal_count: pregnancy.fetal_count || 1,
      complications: pregnancy.complications || '',
      last_check_date: pregnancy.last_check_date ? new Date(pregnancy.last_check_date) : null,
      next_check_date: pregnancy.next_check_date ? new Date(pregnancy.next_check_date) : null,
      check_location: pregnancy.check_location,
      body_condition_score: pregnancy.body_condition_score || '',
      weight_at_confirmation: pregnancy.weight_at_confirmation || '',
      observations: pregnancy.observations || '',
      dietary_requirements: pregnancy.dietary_requirements || '',
      movement_restrictions: pregnancy.movement_restrictions || ''
    });
    setEditingPregnancy(pregnancy);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este registro de embarazo?')) return;

    try {
      const response = await fetch(`/api/reproduction/pregnancy-tracking/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadPregnancies();
        alert('Registro eliminado exitosamente');
      } else {
        alert('Error al eliminar el registro');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: 'bg-green-100 text-green-800', text: 'Confirmado' },
      monitoring: { color: 'bg-blue-100 text-blue-800', text: 'En seguimiento' },
      complications: { color: 'bg-yellow-100 text-yellow-800', text: 'Con complicaciones' },
      aborted: { color: 'bg-red-100 text-red-800', text: 'Abortado' },
      delivered: { color: 'bg-purple-100 text-purple-800', text: 'Parido' }
    };

    const config = statusConfig[status] || statusConfig.confirmed;
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getRiskLevel = (daysRemaining, complications) => {
    if (complications) return { level: 'Alto', color: 'text-red-600', icon: AlertTriangle };
    if (daysRemaining <= 7) return { level: 'Medio', color: 'text-orange-600', icon: Clock };
    return { level: 'Bajo', color: 'text-green-600', icon: Heart };
  };

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

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Baby className="text-pink-600" />
          Seguimiento de Embarazos
        </h1>
        <p className="text-gray-600 mt-2">
          Monitorea el progreso de los embarazos en el ganado
        </p>
      </motion.div>

      {/* Controles */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Buscar por arete o nombre de la vaca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Label htmlFor="filter">Filtrar por estado</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="monitoring">En seguimiento</SelectItem>
                    <SelectItem value="complications">Con complicaciones</SelectItem>
                    <SelectItem value="delivered">Parido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nuevo Embarazo
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de embarazos */}
      <motion.div variants={itemVariants} className="space-y-4">
        <AnimatePresence>
          {filteredPregnancies.map((pregnancy) => {
            const progress = calculatePregnancyProgress(pregnancy.confirmation_date, pregnancy.estimated_due_date);
            const daysRemaining = getDaysRemaining(pregnancy.estimated_due_date);
            const pregnancyStage = getPregnancyStage(pregnancy.confirmation_date, pregnancy.estimated_due_date);
            const riskLevel = getRiskLevel(daysRemaining, pregnancy.complications);
            const RiskIcon = riskLevel.icon;

            return (
              <motion.div
                key={pregnancy.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-pink-100 p-2 rounded-lg">
                          <Baby className="h-5 w-5 text-pink-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {pregnancy.bovine_ear_tag} - {pregnancy.bovine_name || 'Sin nombre'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Confirmado: {format(new Date(pregnancy.confirmation_date), "PPP", { locale: es })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(pregnancy.pregnancy_status)}
                        <div className={`flex items-center gap-1 ${riskLevel.color}`}>
                          <RiskIcon className="h-4 w-4" />
                          <span className="text-xs font-medium">{riskLevel.level}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(pregnancy)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(pregnancy.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progreso del embarazo</span>
                        <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div className="flex justify-between items-center mt-1">
                        <span className={`text-xs ${pregnancyStage.color} font-medium`}>
                          {pregnancyStage.stage}
                        </span>
                        <span className="text-xs text-gray-600">
                          {daysRemaining} días restantes
                        </span>
                      </div>
                    </div>

                    {/* Información detallada */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Método confirmación:</span>
                        <p className="text-gray-600 capitalize">{pregnancy.confirmation_method}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Fecha estimada parto:</span>
                        <p className="text-gray-600">
                          {format(new Date(pregnancy.estimated_due_date), "PP", { locale: es })}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Número de fetos:</span>
                        <p className="text-gray-600">{pregnancy.fetal_count}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Veterinario:</span>
                        <p className="text-gray-600">{pregnancy.veterinarian_name}</p>
                      </div>
                    </div>

                    {/* Próxima revisión */}
                    {pregnancy.next_check_date && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-900">Próxima revisión:</span>
                          <span className="text-blue-700">
                            {format(new Date(pregnancy.next_check_date), "PPP", { locale: es })}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Complicaciones */}
                    {pregnancy.complications && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          <div>
                            <span className="font-medium text-red-900">Complicaciones:</span>
                            <p className="text-red-700 text-sm mt-1">{pregnancy.complications}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Observaciones */}
                    {pregnancy.observations && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Observaciones:</span>
                        <p className="text-gray-600 text-sm mt-1">{pregnancy.observations}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredPregnancies.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-gray-500">No se encontraron registros de embarazos</p>
          </motion.div>
        )}
      </motion.div>

      {/* Modal de formulario */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingPregnancy ? 'Editar' : 'Nuevo'} Embarazo
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información básica */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bovine_id">Hembra *</Label>
                      <Select
                        value={formData.bovine_id}
                        onValueChange={(value) => handleInputChange('bovine_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar hembra" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableFemales.map((female) => (
                            <SelectItem key={female.id} value={female.id}>
                              {female.ear_tag} - {female.name || 'Sin nombre'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.bovine_id && (
                        <p className="text-red-500 text-sm mt-1">{errors.bovine_id}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="insemination_id">Registro de Inseminación</Label>
                      <Select
                        value={formData.insemination_id}
                        onValueChange={(value) => handleInputChange('insemination_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar inseminación" />
                        </SelectTrigger>
                        <SelectContent>
                          {inseminationRecords.map((record) => (
                            <SelectItem key={record.id} value={record.id}>
                              {record.bovine_ear_tag} - {format(new Date(record.insemination_date), "PP", { locale: es })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="veterinarian_id">Veterinario *</Label>
                      <Select
                        value={formData.veterinarian_id}
                        onValueChange={(value) => handleInputChange('veterinarian_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar veterinario" />
                        </SelectTrigger>
                        <SelectContent>
                          {veterinarians.map((vet) => (
                            <SelectItem key={vet.id} value={vet.id}>
                              {vet.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.veterinarian_id && (
                        <p className="text-red-500 text-sm mt-1">{errors.veterinarian_id}</p>
                      )}
                    </div>
                  </div>

                  {/* Fechas de confirmación y parto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label>Fecha de Confirmación *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.confirmation_date ? (
                              format(formData.confirmation_date, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.confirmation_date}
                            onSelect={(date) => handleInputChange('confirmation_date', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.confirmation_date && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmation_date}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="gestation_length">Duración gestación (días)</Label>
                      <Input
                        id="gestation_length"
                        type="number"
                        min="250"
                        max="310"
                        value={formData.gestation_length}
                        onChange={(e) => handleInputChange('gestation_length', e.target.value)}
                        placeholder="280 días promedio"
                      />
                    </div>

                    <div>
                      <Label>Fecha Estimada de Parto</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.estimated_due_date ? (
                              format(formData.estimated_due_date, "PPP", { locale: es })
                            ) : (
                              <span>Fecha calculada automáticamente</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.estimated_due_date}
                            onSelect={(date) => handleInputChange('estimated_due_date', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Información del embarazo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="confirmation_method">Método de Confirmación *</Label>
                      <Select
                        value={formData.confirmation_method}
                        onValueChange={(value) => handleInputChange('confirmation_method', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Método" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ultrasound">Ultrasonido</SelectItem>
                          <SelectItem value="rectal_palpation">Palpación rectal</SelectItem>
                          <SelectItem value="blood_test">Análisis de sangre</SelectItem>
                          <SelectItem value="visual_observation">Observación visual</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.confirmation_method && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmation_method}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="fetal_count">Número de Fetos *</Label>
                      <Input
                        id="fetal_count"
                        type="number"
                        min="1"
                        max="5"
                        value={formData.fetal_count}
                        onChange={(e) => handleInputChange('fetal_count', e.target.value)}
                        placeholder="1"
                      />
                      {errors.fetal_count && (
                        <p className="text-red-500 text-sm mt-1">{errors.fetal_count}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="pregnancy_status">Estado del Embarazo</Label>
                      <Select
                        value={formData.pregnancy_status}
                        onValueChange={(value) => handleInputChange('pregnancy_status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmado</SelectItem>
                          <SelectItem value="monitoring">En seguimiento</SelectItem>
                          <SelectItem value="complications">Con complicaciones</SelectItem>
                          <SelectItem value="aborted">Abortado</SelectItem>
                          <SelectItem value="delivered">Parido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="body_condition_score">Condición Corporal (1-5)</Label>
                      <Input
                        id="body_condition_score"
                        type="number"
                        min="1"
                        max="5"
                        step="0.5"
                        value={formData.body_condition_score}
                        onChange={(e) => handleInputChange('body_condition_score', e.target.value)}
                        placeholder="3.5"
                      />
                    </div>
                  </div>

                  {/* Fechas de revisión */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Última Revisión</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.last_check_date ? (
                              format(formData.last_check_date, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.last_check_date}
                            onSelect={(date) => handleInputChange('last_check_date', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Próxima Revisión</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.next_check_date ? (
                              format(formData.next_check_date, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.next_check_date}
                            onSelect={(date) => handleInputChange('next_check_date', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Ubicación de revisión */}
                  <div>
                    <Label>Ubicación de Revisión</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowLocationPicker(true)}
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        {formData.check_location ? 'Ubicación seleccionada' : 'Seleccionar ubicación'}
                      </Button>
                      {formData.check_location && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleInputChange('check_location', null)}
                        >
                          Limpiar
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ultrasound_results">Resultados de Ultrasonido</Label>
                      <Textarea
                        id="ultrasound_results"
                        value={formData.ultrasound_results}
                        onChange={(e) => handleInputChange('ultrasound_results', e.target.value)}
                        placeholder="Descripción de los resultados del ultrasonido..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="complications">Complicaciones</Label>
                      <Textarea
                        id="complications"
                        value={formData.complications}
                        onChange={(e) => handleInputChange('complications', e.target.value)}
                        placeholder="Describir cualquier complicación observada..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dietary_requirements">Requerimientos Dietéticos</Label>
                      <Textarea
                        id="dietary_requirements"
                        value={formData.dietary_requirements}
                        onChange={(e) => handleInputChange('dietary_requirements', e.target.value)}
                        placeholder="Necesidades nutricionales especiales..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="movement_restrictions">Restricciones de Movimiento</Label>
                      <Textarea
                        id="movement_restrictions"
                        value={formData.movement_restrictions}
                        onChange={(e) => handleInputChange('movement_restrictions', e.target.value)}
                        placeholder="Limitaciones en el movimiento o actividad..."
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Observaciones generales */}
                  <div>
                    <Label htmlFor="observations">Observaciones</Label>
                    <Textarea
                      id="observations"
                      value={formData.observations}
                      onChange={(e) => handleInputChange('observations', e.target.value)}
                      placeholder="Observaciones generales sobre el embarazo..."
                      rows={3}
                    />
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Baby className="h-4 w-4" />
                      )}
                      {loading ? 'Guardando...' : editingPregnancy ? 'Actualizar' : 'Registrar'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de selección de ubicación */}
      {showLocationPicker && (
        <LocationPicker
          onLocationSelect={(location) => {
            handleInputChange('check_location', location);
            setShowLocationPicker(false);
          }}
          onClose={() => setShowLocationPicker(false)}
        />
      )}
    </motion.div>
  );
};

export default PregnancyTracking;