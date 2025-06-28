import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, CalendarDays } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Save, Baby, Heart, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import LocationPicker from '../maps/LocationPicker';

const CalfRegistration = () => {
  // Estados para el formulario de registro de crías
  const [formData, setFormData] = useState({
    bovine_id: '',
    mother_id: '',
    father_id: '',
    birth_date: null,
    birth_weight: '',
    birth_location: null,
    sex: '',
    health_status: '',
    birth_complications: '',
    observations: '',
    ear_tag: '',
    breed: '',
    birth_type: 'natural', // natural, assisted, cesarean
    colostrum_intake: '',
    vitality_score: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mothers, setMothers] = useState([]);
  const [fathers, setFathers] = useState([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Hook para cargar madres y padres disponibles
  useEffect(() => {
    loadParentAnimals();
  }, []);

  const loadParentAnimals = async () => {
    try {
      // Cargar vacas hembras preñadas para madres
      const mothersResponse = await fetch('/api/bovines/pregnant-females');
      const mothersData = await mothersResponse.json();
      setMothers(mothersData);

      // Cargar toros para padres
      const fathersResponse = await fetch('/api/bovines/bulls');
      const fathersData = await fathersResponse.json();
      setFathers(fathersData);
    } catch (error) {
      console.error('Error cargando animales padre:', error);
    }
  };

  // Manejo de cambios en inputs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo al cambiarlo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.mother_id) newErrors.mother_id = 'La madre es requerida';
    if (!formData.birth_date) newErrors.birth_date = 'La fecha de nacimiento es requerida';
    if (!formData.birth_weight) newErrors.birth_weight = 'El peso al nacer es requerido';
    if (!formData.sex) newErrors.sex = 'El sexo es requerido';
    if (!formData.ear_tag) newErrors.ear_tag = 'El arete es requerido';
    if (!formData.vitality_score) newErrors.vitality_score = 'La puntuación de vitalidad es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/reproduction/calf-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Resetear formulario y mostrar mensaje de éxito
        setFormData({
          bovine_id: '',
          mother_id: '',
          father_id: '',
          birth_date: null,
          birth_weight: '',
          birth_location: null,
          sex: '',
          health_status: '',
          birth_complications: '',
          observations: '',
          ear_tag: '',
          breed: '',
          birth_type: 'natural',
          colostrum_intake: '',
          vitality_score: ''
        });
        alert('Cría registrada exitosamente');
      } else {
        alert('Error al registrar la cría');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Animaciones
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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Baby className="text-pink-600" />
          Registro de Crías
        </h1>
        <p className="text-gray-600 mt-2">
          Registra el nacimiento de nuevas crías en el rancho
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="text-red-500" />
              Información del Nacimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <motion.div variants={itemVariants}>
                  <Label htmlFor="mother_id">Madre *</Label>
                  <Select
                    value={formData.mother_id}
                    onValueChange={(value) => handleInputChange('mother_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar madre" />
                    </SelectTrigger>
                    <SelectContent>
                      {mothers.map((mother) => (
                        <SelectItem key={mother.id} value={mother.id}>
                          {mother.ear_tag} - {mother.name || 'Sin nombre'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.mother_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.mother_id}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label htmlFor="father_id">Padre</Label>
                  <Select
                    value={formData.father_id}
                    onValueChange={(value) => handleInputChange('father_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar padre" />
                    </SelectTrigger>
                    <SelectContent>
                      {fathers.map((father) => (
                        <SelectItem key={father.id} value={father.id}>
                          {father.ear_tag} - {father.name || 'Sin nombre'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label htmlFor="ear_tag">Arete *</Label>
                  <Input
                    id="ear_tag"
                    value={formData.ear_tag}
                    onChange={(e) => handleInputChange('ear_tag', e.target.value)}
                    placeholder="Número de arete"
                  />
                  {errors.ear_tag && (
                    <p className="text-red-500 text-sm mt-1">{errors.ear_tag}</p>
                  )}
                </motion.div>
              </div>

              {/* Fecha de nacimiento y peso */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div variants={itemVariants}>
                  <Label>Fecha de Nacimiento *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.birth_date ? (
                          format(formData.birth_date, "PPP", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.birth_date}
                        onSelect={(date) => handleInputChange('birth_date', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.birth_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label htmlFor="birth_weight">Peso al Nacer (kg) *</Label>
                  <Input
                    id="birth_weight"
                    type="number"
                    step="0.1"
                    value={formData.birth_weight}
                    onChange={(e) => handleInputChange('birth_weight', e.target.value)}
                    placeholder="Peso en kilogramos"
                  />
                  {errors.birth_weight && (
                    <p className="text-red-500 text-sm mt-1">{errors.birth_weight}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label htmlFor="sex">Sexo *</Label>
                  <Select
                    value={formData.sex}
                    onValueChange={(value) => handleInputChange('sex', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="macho">Macho</SelectItem>
                      <SelectItem value="hembra">Hembra</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.sex && (
                    <p className="text-red-500 text-sm mt-1">{errors.sex}</p>
                  )}
                </motion.div>
              </div>

              {/* Información del parto */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <motion.div variants={itemVariants}>
                  <Label htmlFor="birth_type">Tipo de Parto</Label>
                  <Select
                    value={formData.birth_type}
                    onValueChange={(value) => handleInputChange('birth_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de parto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural">Natural</SelectItem>
                      <SelectItem value="assisted">Asistido</SelectItem>
                      <SelectItem value="cesarean">Cesárea</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label htmlFor="vitality_score">Puntuación de Vitalidad (1-10) *</Label>
                  <Input
                    id="vitality_score"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.vitality_score}
                    onChange={(e) => handleInputChange('vitality_score', e.target.value)}
                    placeholder="Puntuación del 1 al 10"
                  />
                  {errors.vitality_score && (
                    <p className="text-red-500 text-sm mt-1">{errors.vitality_score}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label htmlFor="colostrum_intake">Ingesta de Calostro</Label>
                  <Select
                    value={formData.colostrum_intake}
                    onValueChange={(value) => handleInputChange('colostrum_intake', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Estado del calostro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="assisted">Asistida</SelectItem>
                      <SelectItem value="bottle_fed">Alimentación con biberón</SelectItem>
                      <SelectItem value="insufficient">Insuficiente</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>

              {/* Ubicación del nacimiento */}
              <motion.div variants={itemVariants}>
                <Label>Ubicación del Nacimiento</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLocationPicker(true)}
                    className="flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    {formData.birth_location ? 'Ubicación seleccionada' : 'Seleccionar ubicación'}
                  </Button>
                  {formData.birth_location && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleInputChange('birth_location', null)}
                    >
                      Limpiar
                    </Button>
                  )}
                </div>
              </motion.div>

              {/* Observaciones y complicaciones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <Label htmlFor="birth_complications">Complicaciones del Parto</Label>
                  <Textarea
                    id="birth_complications"
                    value={formData.birth_complications}
                    onChange={(e) => handleInputChange('birth_complications', e.target.value)}
                    placeholder="Describir cualquier complicación durante el parto..."
                    rows={3}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label htmlFor="observations">Observaciones</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => handleInputChange('observations', e.target.value)}
                    placeholder="Observaciones adicionales sobre la cría..."
                    rows={3}
                  />
                </motion.div>
              </div>

              {/* Botones de acción */}
              <motion.div 
                variants={itemVariants}
                className="flex justify-end gap-4 pt-4"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      bovine_id: '',
                      mother_id: '',
                      father_id: '',
                      birth_date: null,
                      birth_weight: '',
                      birth_location: null,
                      sex: '',
                      health_status: '',
                      birth_complications: '',
                      observations: '',
                      ear_tag: '',
                      breed: '',
                      birth_type: 'natural',
                      colostrum_intake: '',
                      vitality_score: ''
                    });
                    setErrors({});
                  }}
                >
                  Limpiar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {loading ? 'Guardando...' : 'Registrar Cría'}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal de selección de ubicación */}
      {showLocationPicker && (
        <LocationPicker
          onLocationSelect={(location) => {
            handleInputChange('birth_location', location);
            setShowLocationPicker(false);
          }}
          onClose={() => setShowLocationPicker(false)}
        />
      )}
    </motion.div>
  );
};

export default CalfRegistration;