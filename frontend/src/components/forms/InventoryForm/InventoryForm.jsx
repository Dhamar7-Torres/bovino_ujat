import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, MapPin, Calendar, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGeolocation } from '../hooks/useGeolocation';
import { inventoryService } from '../services/inventoryService';

const InventoryForm = () => {
  // Estados principales del formulario
  const [formData, setFormData] = useState({
    medicineId: '',
    quantity: '',
    unitPrice: '',
    supplier: '',
    batchNumber: '',
    expirationDate: null,
    purchaseDate: null,
    storageLocation: '',
    minimumStock: '',
    notes: '',
    status: 'available'
  });

  // Estados para la gestión del formulario
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Estados para modales y vistas
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarField, setCalendarField] = useState('');

  // Hook personalizado para geolocalización
  const { location, error: locationError, getCurrentLocation } = useGeolocation();

  // Efectos para cargar datos iniciales
  useEffect(() => {
    fetchMedicines();
    fetchInventoryItems();
  }, []);

  // Efecto para filtrar items del inventario
  useEffect(() => {
    filterInventoryItems();
  }, [inventoryItems, searchTerm, filterStatus]);

  // Función para obtener la lista de medicamentos disponibles
  const fetchMedicines = async () => {
    try {
      const response = await inventoryService.getMedicines();
      setMedicines(response.data);
    } catch (error) {
      console.error('Error al cargar medicamentos:', error);
    }
  };

  // Función para obtener items del inventario
  const fetchInventoryItems = async () => {
    try {
      setIsLoading(true);
      const response = await inventoryService.getInventoryItems();
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error al cargar inventario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para filtrar items del inventario
  const filterInventoryItems = () => {
    let filtered = inventoryItems;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    setFilteredItems(filtered);
  };

  // Función para manejar cambios en los inputs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo específico
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.medicineId) newErrors.medicineId = 'Selecciona un medicamento';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Ingresa una cantidad válida';
    if (!formData.unitPrice || formData.unitPrice <= 0) newErrors.unitPrice = 'Ingresa un precio válido';
    if (!formData.supplier.trim()) newErrors.supplier = 'Ingresa el proveedor';
    if (!formData.batchNumber.trim()) newErrors.batchNumber = 'Ingresa el número de lote';
    if (!formData.expirationDate) newErrors.expirationDate = 'Selecciona la fecha de vencimiento';
    if (!formData.purchaseDate) newErrors.purchaseDate = 'Selecciona la fecha de compra';
    if (!formData.storageLocation.trim()) newErrors.storageLocation = 'Ingresa la ubicación de almacenamiento';
    if (!formData.minimumStock || formData.minimumStock < 0) newErrors.minimumStock = 'Ingresa el stock mínimo';

    // Validar que la fecha de vencimiento sea posterior a la de compra
    if (formData.expirationDate && formData.purchaseDate) {
      if (formData.expirationDate <= formData.purchaseDate) {
        newErrors.expirationDate = 'La fecha de vencimiento debe ser posterior a la de compra';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      // Obtener ubicación actual si está disponible
      await getCurrentLocation();
      
      const dataToSubmit = {
        ...formData,
        coordinates: location ? {
          latitude: location.latitude,
          longitude: location.longitude
        } : null,
        totalValue: parseFloat(formData.quantity) * parseFloat(formData.unitPrice)
      };

      if (editingItem) {
        await inventoryService.updateInventoryItem(editingItem.id, dataToSubmit);
      } else {
        await inventoryService.createInventoryItem(dataToSubmit);
      }

      setSuccess(true);
      resetForm();
      await fetchInventoryItems();

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error('Error al guardar en inventario:', error);
      setErrors({ submit: 'Error al guardar. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      medicineId: '',
      quantity: '',
      unitPrice: '',
      supplier: '',
      batchNumber: '',
      expirationDate: null,
      purchaseDate: null,
      storageLocation: '',
      minimumStock: '',
      notes: '',
      status: 'available'
    });
    setEditingItem(null);
    setShowForm(false);
    setErrors({});
  };

  // Función para editar un item
  const handleEdit = (item) => {
    setFormData({
      medicineId: item.medicineId,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      supplier: item.supplier,
      batchNumber: item.batchNumber,
      expirationDate: new Date(item.expirationDate),
      purchaseDate: new Date(item.purchaseDate),
      storageLocation: item.storageLocation,
      minimumStock: item.minimumStock.toString(),
      notes: item.notes || '',
      status: item.status
    });
    setEditingItem(item);
    setShowForm(true);
  };

  // Función para eliminar un item
  const handleDelete = async (itemId) => {
    if (!window.confirm('¿Estás seguro de eliminar este item del inventario?')) return;

    try {
      setIsLoading(true);
      await inventoryService.deleteInventoryItem(itemId);
      await fetchInventoryItems();
    } catch (error) {
      console.error('Error al eliminar item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar selección de fecha
  const handleDateSelect = (date, field) => {
    handleInputChange(field, date);
    setShowCalendar(false);
  };

  // Función para formatear fecha
  const formatDate = (date) => {
    if (!date) return 'Seleccionar fecha';
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Función para determinar el estado de stock
  const getStockStatus = (quantity, minimumStock) => {
    if (quantity <= 0) return { status: 'out', color: 'destructive', label: 'Agotado' };
    if (quantity <= minimumStock) return { status: 'low', color: 'warning', label: 'Stock Bajo' };
    return { status: 'good', color: 'success', label: 'Stock Bueno' };
  };

  // Animaciones para framer motion
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

  return (
    <motion.div
      className="container mx-auto p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header con título y botón para agregar */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
          <p className="text-gray-600">Administra medicamentos, suministros y stock del rancho</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Item
        </Button>
      </motion.div>

      {/* Mensaje de éxito */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Item guardado exitosamente en el inventario
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtros y búsqueda */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Buscar por medicamento, proveedor o lote..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status-filter">Estado</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="expired">Vencido</SelectItem>
                    <SelectItem value="low_stock">Stock Bajo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
                  className="w-full"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de items del inventario */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Items en Inventario ({filteredItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando inventario...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No se encontraron items en el inventario</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item, index) => {
                  const stockStatus = getStockStatus(item.quantity, item.minimumStock);
                  const isExpiringSoon = item.expirationDate && new Date(item.expirationDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                  
                  return (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{item.medicineName}</CardTitle>
                            <Badge variant={stockStatus.color}>{stockStatus.label}</Badge>
                          </div>
                          <CardDescription>Lote: {item.batchNumber}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-gray-600">Cantidad:</span>
                            <span className="font-medium">{item.quantity} {item.unit}</span>
                            
                            <span className="text-gray-600">Precio unitario:</span>
                            <span className="font-medium">${item.unitPrice}</span>
                            
                            <span className="text-gray-600">Proveedor:</span>
                            <span className="font-medium">{item.supplier}</span>
                            
                            <span className="text-gray-600">Vencimiento:</span>
                            <span className={`font-medium ${isExpiringSoon ? 'text-red-600' : ''}`}>
                              {formatDate(new Date(item.expirationDate))}
                            </span>
                          </div>
                          
                          {isExpiringSoon && (
                            <Alert className="border-orange-200 bg-orange-50">
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              <AlertDescription className="text-orange-800 text-xs">
                                Próximo a vencer
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            {item.storageLocation}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-3 gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(item)}
                            className="flex-1"
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDelete(item.id)}
                            className="flex-1"
                          >
                            Eliminar
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal del formulario */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>
                    {editingItem ? 'Editar Item de Inventario' : 'Agregar Nuevo Item'}
                  </CardTitle>
                  <CardDescription>
                    Completa la información del medicamento o suministro
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Error general */}
                  {errors.submit && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {errors.submit}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Selección de medicamento */}
                    <div className="space-y-2">
                      <Label htmlFor="medicine">Medicamento *</Label>
                      <Select
                        value={formData.medicineId}
                        onValueChange={(value) => handleInputChange('medicineId', value)}
                      >
                        <SelectTrigger className={errors.medicineId ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Seleccionar medicamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {medicines.map(medicine => (
                            <SelectItem key={medicine.id} value={medicine.id}>
                              {medicine.comercialName} - {medicine.activeIngredient}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.medicineId && <p className="text-red-500 text-xs">{errors.medicineId}</p>}
                    </div>

                    {/* Cantidad */}
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Cantidad *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Ingresa la cantidad"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        className={errors.quantity ? 'border-red-500' : ''}
                      />
                      {errors.quantity && <p className="text-red-500 text-xs">{errors.quantity}</p>}
                    </div>

                    {/* Precio unitario */}
                    <div className="space-y-2">
                      <Label htmlFor="unitPrice">Precio Unitario * ($)</Label>
                      <Input
                        id="unitPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.unitPrice}
                        onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                        className={errors.unitPrice ? 'border-red-500' : ''}
                      />
                      {errors.unitPrice && <p className="text-red-500 text-xs">{errors.unitPrice}</p>}
                    </div>

                    {/* Proveedor */}
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Proveedor *</Label>
                      <Input
                        id="supplier"
                        placeholder="Nombre del proveedor"
                        value={formData.supplier}
                        onChange={(e) => handleInputChange('supplier', e.target.value)}
                        className={errors.supplier ? 'border-red-500' : ''}
                      />
                      {errors.supplier && <p className="text-red-500 text-xs">{errors.supplier}</p>}
                    </div>

                    {/* Número de lote */}
                    <div className="space-y-2">
                      <Label htmlFor="batchNumber">Número de Lote *</Label>
                      <Input
                        id="batchNumber"
                        placeholder="Número de lote"
                        value={formData.batchNumber}
                        onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                        className={errors.batchNumber ? 'border-red-500' : ''}
                      />
                      {errors.batchNumber && <p className="text-red-500 text-xs">{errors.batchNumber}</p>}
                    </div>

                    {/* Fecha de compra */}
                    <div className="space-y-2">
                      <Label>Fecha de Compra *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              errors.purchaseDate ? 'border-red-500' : ''
                            }`}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {formatDate(formData.purchaseDate)}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={formData.purchaseDate}
                            onSelect={(date) => handleDateSelect(date, 'purchaseDate')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.purchaseDate && <p className="text-red-500 text-xs">{errors.purchaseDate}</p>}
                    </div>

                    {/* Fecha de vencimiento */}
                    <div className="space-y-2">
                      <Label>Fecha de Vencimiento *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              errors.expirationDate ? 'border-red-500' : ''
                            }`}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {formatDate(formData.expirationDate)}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={formData.expirationDate}
                            onSelect={(date) => handleDateSelect(date, 'expirationDate')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.expirationDate && <p className="text-red-500 text-xs">{errors.expirationDate}</p>}
                    </div>

                    {/* Ubicación de almacenamiento */}
                    <div className="space-y-2">
                      <Label htmlFor="storageLocation">Ubicación de Almacenamiento *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="storageLocation"
                          placeholder="Ej: Bodega A - Estante 1"
                          value={formData.storageLocation}
                          onChange={(e) => handleInputChange('storageLocation', e.target.value)}
                          className={errors.storageLocation ? 'border-red-500' : ''}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={getCurrentLocation}
                          disabled={!navigator.geolocation}
                        >
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                      {errors.storageLocation && <p className="text-red-500 text-xs">{errors.storageLocation}</p>}
                      {location && (
                        <p className="text-xs text-green-600">
                          📍 Ubicación registrada: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                        </p>
                      )}
                    </div>

                    {/* Stock mínimo */}
                    <div className="space-y-2">
                      <Label htmlFor="minimumStock">Stock Mínimo *</Label>
                      <Input
                        id="minimumStock"
                        type="number"
                        min="0"
                        placeholder="Cantidad mínima en stock"
                        value={formData.minimumStock}
                        onChange={(e) => handleInputChange('minimumStock', e.target.value)}
                        className={errors.minimumStock ? 'border-red-500' : ''}
                      />
                      {errors.minimumStock && <p className="text-red-500 text-xs">{errors.minimumStock}</p>}
                    </div>

                    {/* Estado */}
                    <div className="space-y-2">
                      <Label htmlFor="status">Estado</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleInputChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Disponible</SelectItem>
                          <SelectItem value="expired">Vencido</SelectItem>
                          <SelectItem value="low_stock">Stock Bajo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Notas adicionales */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea
                      id="notes"
                      placeholder="Información adicional sobre el item..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>

                <CardFooter className="gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Package className="w-4 h-4 mr-2" />
                        {editingItem ? 'Actualizar' : 'Guardar'}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InventoryForm;