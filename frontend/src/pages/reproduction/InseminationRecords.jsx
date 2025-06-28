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
import { CalendarIcon, Plus, Search, Filter, Heart, Zap, Eye, Edit, Trash2, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import LocationPicker from '../maps/LocationPicker';

const InseminationRecords = () => {
  // Estados principales
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    bovine_id: '',
    insemination_date: null,
    insemination_type: 'artificial',
    bull_id: '',
    semen_batch: '',
    semen_origin: '',
    technician_id: '',
    location: null,
    method: '',
    success_probability: '',
    cost: '',
    next_check_date: null,
    observations: '',
    weather_conditions: '',
    estrus_detection_method: '',
    hormone_treatment: false
  });

  const [errors, setErrors] = useState({});
  const [availableFemales, setAvailableFemales] = useState([]);
  const [availableBulls, setAvailableBulls] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    loadRecords();
    loadAvailableAnimals();
    loadTechnicians();
  }, []);

  // Filtrar registros cuando cambien los filtros
  useEffect(() => {
    filterRecords();
  }, [records, searchTerm, filterStatus]);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reproduction/insemination-records');
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error cargando registros de inseminación:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableAnimals = async () => {
    try {
      // Cargar hembras disponibles para inseminación
      const femalesResponse = await fetch('/api/bovines/breeding-females');
      const femalesData = await femalesResponse.json();
      setAvailableFemales(femalesData);

      // Cargar toros disponibles
      const bullsResponse = await fetch('/api/bovines/bulls');
      const bullsData = await bullsResponse.json();
      setAvailableBulls(bullsData);
    } catch (error) {
      console.error('Error cargando animales:', error);
    }
  };

  const loadTechnicians = async () => {
    try {
      const response = await fetch('/api/users/technicians');
      const data = await response.json();
      setTechnicians(data);
    } catch (error) {
      console.error('Error cargando técnicos:', error);
    }
  };

  const filterRecords = () => {
    let filtered = records;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.bovine_ear_tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.bull_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.semen_batch?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(record => record.status === filterStatus);
    }

    setFilteredRecords(filtered);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

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
    if (!formData.insemination_date) newErrors.insemination_date = 'La fecha de inseminación es requerida';
    if (!formData.insemination_type) newErrors.insemination_type = 'El tipo de inseminación es requerido';
    if (formData.insemination_type === 'artificial' && !formData.semen_batch) {
      newErrors.semen_batch = 'El lote de semen es requerido para inseminación artificial';
    }
    if (!formData.technician_id) newErrors.technician_id = 'El técnico es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const url = editingRecord 
        ? `/api/reproduction/insemination-records/${editingRecord.id}`
        : '/api/reproduction/insemination-records';
      
      const method = editingRecord ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await loadRecords();
        resetForm();
        setShowForm(false);
        alert(editingRecord ? 'Registro actualizado exitosamente' : 'Registro creado exitosamente');
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
      insemination_date: null,
      insemination_type: 'artificial',
      bull_id: '',
      semen_batch: '',
      semen_origin: '',
      technician_id: '',
      location: null,
      method: '',
      success_probability: '',
      cost: '',
      next_check_date: null,
      observations: '',
      weather_conditions: '',
      estrus_detection_method: '',
      hormone_treatment: false
    });
    setErrors({});
    setEditingRecord(null);
  };

  const handleEdit = (record) => {
    setFormData({
      bovine_id: record.bovine_id,
      insemination_date: new Date(record.insemination_date),
      insemination_type: record.insemination_type,
      bull_id: record.bull_id || '',
      semen_batch: record.semen_batch || '',
      semen_origin: record.semen_origin || '',
      technician_id: record.technician_id,
      location: record.location,
      method: record.method || '',
      success_probability: record.success_probability || '',
      cost: record.cost || '',
      next_check_date: record.next_check_date ? new Date(record.next_check_date) : null,
      observations: record.observations || '',
      weather_conditions: record.weather_conditions || '',
      estrus_detection_method: record.estrus_detection_method || '',
      hormone_treatment: record.hormone_treatment || false
    });
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este registro?')) return;

    try {
      const response = await fetch(`/api/reproduction/insemination-records/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadRecords();
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
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      confirmed: { color: 'bg-green-100 text-green-800', text: 'Confirmada' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Fallida' },
      checking: { color: 'bg-blue-100 text-blue-800', text: 'En revisión' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
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
          <Heart className="text-pink-600" />
          Registros de Inseminación
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona los registros de inseminación artificial y natural
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
                    placeholder="Buscar por arete, toro o lote de semen..."
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
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="confirmed">Confirmada</SelectItem>
                    <SelectItem value="failed">Fallida</SelectItem>
                    <SelectItem value="checking">En revisión</SelectItem>
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
                Nueva Inseminación
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de registros */}
      <motion.div variants={itemVariants} className="space-y-4">
        <AnimatePresence>
          {filteredRecords.map((record) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Zap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Hembra: {record.bovine_ear_tag}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {format(new Date(record.insemination_date), "PPP", { locale: es })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(record.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(record)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Tipo:</span>
                      <p className="text-gray-600 capitalize">{record.insemination_type}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Toro/Lote:</span>
                      <p className="text-gray-600">
                        {record.bull_name || record.semen_batch || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Técnico:</span>
                      <p className="text-gray-600">{record.technician_name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Próxima revisión:</span>
                      <p className="text-gray-600">
                        {record.next_check_date 
                          ? format(new Date(record.next_check_date), "PP", { locale: es })
                          : 'No programada'
                        }
                      </p>
                    </div>
                  </div>

                  {record.observations && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Observaciones:</span>
                      <p className="text-gray-600 text-sm mt-1">{record.observations}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredRecords.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-gray-500">No se encontraron registros de inseminación</p>
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
                  {editingRecord ? 'Editar' : 'Nueva'} Inseminación
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
                      <Label>Fecha de Inseminación *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.insemination_date ? (
                              format(formData.insemination_date, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.insemination_date}
                            onSelect={(date) => handleInputChange('insemination_date', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.insemination_date && (
                        <p className="text-red-500 text-sm mt-1">{errors.insemination_date}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="insemination_type">Tipo de Inseminación *</Label>
                      <Select
                        value={formData.insemination_type}
                        onValueChange={(value) => handleInputChange('insemination_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="artificial">Artificial</SelectItem>
                          <SelectItem value="natural">Natural</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.insemination_type && (
                        <p className="text-red-500 text-sm mt-1">{errors.insemination_type}</p>
                      )}
                    </div>
                  </div>

                  {/* Información específica según el tipo */}
                  {formData.insemination_type === 'artificial' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="semen_batch">Lote de Semen *</Label>
                        <Input
                          id="semen_batch"
                          value={formData.semen_batch}
                          onChange={(e) => handleInputChange('semen_batch', e.target.value)}
                          placeholder="Número de lote"
                        />
                        {errors.semen_batch && (
                          <p className="text-red-500 text-sm mt-1">{errors.semen_batch}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="semen_origin">Origen del Semen</Label>
                        <Input
                          id="semen_origin"
                          value={formData.semen_origin}
                          onChange={(e) => handleInputChange('semen_origin', e.target.value)}
                          placeholder="Origen o proveedor"
                        />
                      </div>
                      <div>
                        <Label htmlFor="method">Método</Label>
                        <Select
                          value={formData.method}
                          onValueChange={(value) => handleInputChange('method', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Método utilizado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cervical">Cervical</SelectItem>
                            <SelectItem value="intrauterine">Intrauterino</SelectItem>
                            <SelectItem value="deep_intrauterine">Intrauterino profundo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bull_id">Toro</Label>
                        <Select
                          value={formData.bull_id}
                          onValueChange={(value) => handleInputChange('bull_id', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar toro" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableBulls.map((bull) => (
                              <SelectItem key={bull.id} value={bull.id}>
                                {bull.ear_tag} - {bull.name || 'Sin nombre'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="technician_id">Técnico *</Label>
                      <Select
                        value={formData.technician_id}
                        onValueChange={(value) => handleInputChange('technician_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar técnico" />
                        </SelectTrigger>
                        <SelectContent>
                          {technicians.map((technician) => (
                            <SelectItem key={technician.id} value={technician.id}>
                              {technician.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.technician_id && (
                        <p className="text-red-500 text-sm mt-1">{errors.technician_id}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="success_probability">Probabilidad de Éxito (%)</Label>
                      <Input
                        id="success_probability"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.success_probability}
                        onChange={(e) => handleInputChange('success_probability', e.target.value)}
                        placeholder="0-100"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cost">Costo</Label>
                      <Input
                        id="cost"
                        type="number"
                        step="0.01"
                        value={formData.cost}
                        onChange={(e) => handleInputChange('cost', e.target.value)}
                        placeholder="Costo del procedimiento"
                      />
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div>
                    <Label>Ubicación del Procedimiento</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowLocationPicker(true)}
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        {formData.location ? 'Ubicación seleccionada' : 'Seleccionar ubicación'}
                      </Button>
                      {formData.location && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleInputChange('location', null)}
                        >
                          Limpiar
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Fecha de próxima revisión */}
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

                  {/* Observaciones */}
                  <div>
                    <Label htmlFor="observations">Observaciones</Label>
                    <Textarea
                      id="observations"
                      value={formData.observations}
                      onChange={(e) => handleInputChange('observations', e.target.value)}
                      placeholder="Observaciones sobre el procedimiento..."
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
                        <Heart className="h-4 w-4" />
                      )}
                      {loading ? 'Guardando...' : editingRecord ? 'Actualizar' : 'Registrar'}
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
            handleInputChange('location', location);
            setShowLocationPicker(false);
          }}
          onClose={() => setShowLocationPicker(false)}
        />
      )}
    </motion.div>
  );
};

export default InseminationRecords;