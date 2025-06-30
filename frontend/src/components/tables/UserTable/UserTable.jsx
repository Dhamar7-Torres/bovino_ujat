import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  User, 
  Users,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Key,
  Settings,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Download,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Bell,
  Lock,
  Unlock,
  Crown,
  Badge as BadgeIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePicker } from '@/components/ui/date-picker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { userService } from '../services/userService';

const UserTable = () => {
  // Estados principales para datos de usuarios
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para estadísticas de usuarios
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    onlineUsers: 0,
    newUsersThisMonth: 0,
    byRole: {
      admin: 0,
      manager: 0,
      operator: 0,
      viewer: 0
    },
    lastLogin: 0,
    avgSessionTime: 0
  });

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    lastLogin: '',
    dateRange: 'all',
    startDate: null,
    endDate: null,
    ranch: '',
    department: ''
  });

  // Estados para paginación y ordenamiento
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Estados para vistas y modales
  const [viewMode, setViewMode] = useState('table'); // table, grid, cards
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all'); // all, active, inactive, admins, online

  // Estados para gestión de usuarios
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userPermissions, setUserPermissions] = useState({});

  // Animaciones de Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      backgroundColor: '#f9fafb',
      transition: { duration: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadUsers();
    loadUserStats();
  }, []);

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, filters, sortBy, sortOrder, selectedTab]);

  // Función para cargar usuarios desde el servicio
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar los datos de usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar estadísticas de usuarios
  const loadUserStats = async () => {
    try {
      const data = await userService.getStats();
      setUserStats(data);
    } catch (err) {
      console.error('Error al cargar estadísticas de usuarios:', err);
    }
  };

  // Función para aplicar filtros y búsqueda
  const applyFilters = useCallback(() => {
    let filtered = [...users];

    // Filtrar por tab seleccionado
    switch (selectedTab) {
      case 'active':
        filtered = filtered.filter(user => user.status === 'active');
        break;
      case 'inactive':
        filtered = filtered.filter(user => user.status === 'inactive');
        break;
      case 'admins':
        filtered = filtered.filter(user => user.role === 'admin' || user.role === 'manager');
        break;
      case 'online':
        filtered = filtered.filter(user => user.isOnline);
        break;
      case 'all':
      default:
        // No filtrar por estado
        break;
    }

    // Aplicar búsqueda por texto
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    // Aplicar filtros específicos
    if (filters.role) {
      filtered = filtered.filter(user => user.roleId === filters.role);
    }
    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status);
    }
    if (filters.ranch) {
      filtered = filtered.filter(user => user.ranchId === filters.ranch);
    }
    if (filters.department) {
      filtered = filtered.filter(user => user.department === filters.department);
    }

    // Filtrar por último acceso
    if (filters.lastLogin) {
      const today = new Date();
      let filterDate;
      
      switch (filters.lastLogin) {
        case 'today':
          filterDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          filtered = filtered.filter(user => 
            user.lastLogin && new Date(user.lastLogin) >= filterDate
          );
          break;
        case 'week':
          filterDate = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
          filtered = filtered.filter(user => 
            user.lastLogin && new Date(user.lastLogin) >= filterDate
          );
          break;
        case 'month':
          filterDate = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
          filtered = filtered.filter(user => 
            user.lastLogin && new Date(user.lastLogin) >= filterDate
          );
          break;
        case 'never':
          filtered = filtered.filter(user => !user.lastLogin);
          break;
      }
    }

    // Filtrar por rango de fechas de registro
    if (filters.startDate) {
      filtered = filtered.filter(user => 
        new Date(user.registrationDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(user => 
        new Date(user.registrationDate) <= new Date(filters.endDate)
      );
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'registrationDate' || sortBy === 'lastLogin') {
        aValue = new Date(a[sortBy]);
        bValue = new Date(b[sortBy]);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue?.toLowerCase() || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
    setCurrentPage(1); // Resetear a primera página cuando se aplican filtros
  }, [users, searchTerm, filters, sortBy, sortOrder, selectedTab]);

  // Función para manejar selección de usuarios
  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Función para seleccionar todos los usuarios
  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(user => user.id));
    }
  };

  // Función para eliminar usuario
  const handleDeleteUser = async (userId) => {
    try {
      await userService.delete(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      setShowDeleteModal(false);
      setUserToDelete(null);
      loadUserStats(); // Actualizar estadísticas
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setError('Error al eliminar el usuario');
    }
  };

  // Función para cambiar estado del usuario
  const handleToggleUserStatus = async (userId, newStatus) => {
    try {
      await userService.updateStatus(userId, newStatus);
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      loadUserStats();
    } catch (err) {
      console.error('Error al cambiar estado del usuario:', err);
      setError('Error al cambiar el estado del usuario');
    }
  };

  // Función para resetear contraseña
  const handleResetPassword = async (userId) => {
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await userService.resetPassword(userId, newPassword);
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
      setSelectedUser(null);
    } catch (err) {
      console.error('Error al resetear contraseña:', err);
      setError('Error al resetear la contraseña');
    }
  };

  // Función para obtener icono del rol
  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'administrator':
        return Crown;
      case 'manager':
      case 'gerente':
        return ShieldCheck;
      case 'operator':
      case 'operador':
        return User;
      case 'viewer':
      case 'visualizador':
        return Eye;
      default:
        return User;
    }
  };

  // Función para obtener color del rol
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'administrator':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
      case 'gerente':
        return 'bg-blue-100 text-blue-800';
      case 'operator':
      case 'operador':
        return 'bg-green-100 text-green-800';
      case 'viewer':
      case 'visualizador':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener color del estado
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      case 'suspended':
      case 'suspendido':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
      case 'pendiente':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener icono del estado
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'activo':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
      case 'inactivo':
        return <UserX className="w-4 h-4 text-red-500" />;
      case 'suspended':
      case 'suspendido':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'pending':
      case 'pendiente':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Función para formatear fecha
  const formatDate = (date) => {
    if (!date) return 'Nunca';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Función para calcular tiempo desde último acceso
  const getLastLoginText = (lastLogin) => {
    if (!lastLogin) return 'Nunca';
    
    const now = new Date();
    const loginDate = new Date(lastLogin);
    const diffTime = now - loginDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) {
      return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else if (diffMinutes > 0) {
      return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
    } else {
      return 'Ahora';
    }
  };

  // Función para obtener iniciales del usuario
  const getUserInitials = (name, lastName) => {
    const firstInitial = name ? name.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  };

  // Calcular usuarios para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Función para cambiar página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Función para exportar datos
  const handleExport = async (format) => {
    try {
      const dataToExport = selectedUsers.length > 0 
        ? users.filter(user => selectedUsers.includes(user.id))
        : filteredUsers;
      
      await userService.exportData(dataToExport, format);
    } catch (err) {
      console.error('Error al exportar datos:', err);
      setError('Error al exportar los datos');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header con título y acciones principales */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">
            Administra usuarios, roles y permisos del sistema
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => {}}>
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Tarjetas de estadísticas de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Total Usuarios</p>
                  <p className="text-lg font-bold text-blue-600">
                    {userStats.totalUsers}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <UserCheck className="h-6 w-6 text-green-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Activos</p>
                  <p className="text-lg font-bold text-green-600">
                    {userStats.activeUsers}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <UserX className="h-6 w-6 text-red-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Inactivos</p>
                  <p className="text-lg font-bold text-red-600">
                    {userStats.inactiveUsers}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Activity className="h-6 w-6 text-green-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">En Línea</p>
                  <p className="text-lg font-bold text-green-600">
                    {userStats.onlineUsers}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Nuevos (Mes)</p>
                  <p className="text-lg font-bold text-purple-600">
                    {userStats.newUsersThisMonth}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Crown className="h-6 w-6 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Admins</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {userStats.byRole.admin}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-orange-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Último Acceso</p>
                  <p className="text-lg font-bold text-orange-600">
                    {userStats.lastLogin}h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <BadgeIcon className="h-6 w-6 text-indigo-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Sesión Promedio</p>
                  <p className="text-lg font-bold text-indigo-600">
                    {userStats.avgSessionTime}m
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Distribución por roles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribución por Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Crown className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">{userStats.byRole.admin}</p>
              <p className="text-sm text-gray-600">Administradores</p>
            </div>
            <div className="text-center">
              <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">{userStats.byRole.manager}</p>
              <p className="text-sm text-gray-600">Gerentes</p>
            </div>
            <div className="text-center">
              <User className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{userStats.byRole.operator}</p>
              <p className="text-sm text-gray-600">Operadores</p>
            </div>
            <div className="text-center">
              <Eye className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <p className="text-2xl font-bold text-gray-600">{userStats.byRole.viewer}</p>
              <p className="text-sm text-gray-600">Visualizadores</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs para filtrar por tipo de usuario */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="active">Activos</TabsTrigger>
              <TabsTrigger value="inactive">Inactivos</TabsTrigger>
              <TabsTrigger value="admins">Administradores</TabsTrigger>
              <TabsTrigger value="online">En Línea</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Controles de vista y filtros */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>

              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-r-none"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="rounded-l-none"
                >
                  <User className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Panel de filtros expandible */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="role-filter">Rol</Label>
                    <Select
                      value={filters.role}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="manager">Gerente</SelectItem>
                        <SelectItem value="operator">Operador</SelectItem>
                        <SelectItem value="viewer">Visualizador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status-filter">Estado</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                        <SelectItem value="suspended">Suspendido</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="last-login-filter">Último Acceso</Label>
                    <Select
                      value={filters.lastLogin}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, lastLogin: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Cualquier momento</SelectItem>
                        <SelectItem value="today">Hoy</SelectItem>
                        <SelectItem value="week">Esta semana</SelectItem>
                        <SelectItem value="month">Este mes</SelectItem>
                        <SelectItem value="never">Nunca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="department-filter">Departamento</Label>
                    <Select
                      value={filters.department}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="management">Gerencia</SelectItem>
                        <SelectItem value="operations">Operaciones</SelectItem>
                        <SelectItem value="veterinary">Veterinaria</SelectItem>
                        <SelectItem value="administration">Administración</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="ranch-filter">Rancho</Label>
                    <Select
                      value={filters.ranch}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, ranch: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rancho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="ranch1">Rancho Principal</SelectItem>
                        <SelectItem value="ranch2">Rancho Norte</SelectItem>
                        <SelectItem value="ranch3">Rancho Sur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="start-date">Fecha Registro (Inicio)</Label>
                    <DatePicker
                      date={filters.startDate}
                      onDateChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="end-date">Fecha Registro (Fin)</Label>
                    <DatePicker
                      date={filters.endDate}
                      onDateChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({
                        role: '',
                        status: '',
                        lastLogin: '',
                        dateRange: 'all',
                        startDate: null,
                        endDate: null,
                        ranch: '',
                        department: ''
                      });
                      setSearchTerm('');
                    }}
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Acciones en lote */}
      <AnimatePresence>
        {selectedUsers.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedUsers.length} usuario(s) seleccionado(s)
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Activar
                </Button>
                <Button variant="outline" size="sm">
                  <UserX className="w-4 h-4 mr-2" />
                  Desactivar
                </Button>
                <Button variant="outline" size="sm">
                  <Key className="w-4 h-4 mr-2" />
                  Resetear Contraseña
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido principal - Vista de tabla */}
      {viewMode === 'table' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <Checkbox
                        checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => {
                          setSortBy('name');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Usuario
                        {sortBy === 'name' && (
                          sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => {
                          setSortBy('lastLogin');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Último Acceso
                        {sortBy === 'lastLogin' && (
                          sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Registro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departamento
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.map((user, index) => {
                    const RoleIcon = getRoleIcon(user.role);
                    
                    return (
                      <motion.tr
                        key={user.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        transition={{ delay: index * 0.05 }}
                        className="cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => handleSelectUser(user.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {getUserInitials(user.name, user.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                            {user.isOnline && (
                              <div className="ml-2 h-2 w-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center mt-1">
                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <RoleIcon className="w-4 h-4 mr-2" />
                            <Badge className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(user.status)}
                            <Badge className={`ml-2 ${getStatusColor(user.status)}`}>
                              {user.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {getLastLoginText(user.lastLogin)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(user.registrationDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.department || 'No asignado'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(user);
                                setShowDetailModal(true);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver perfil
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(user);
                                setShowPermissionsModal(true);
                              }}>
                                <Shield className="mr-2 h-4 w-4" />
                                Permisos
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(user);
                                setShowPasswordModal(true);
                              }}>
                                <Key className="mr-2 h-4 w-4" />
                                Resetear contraseña
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleToggleUserStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
                              >
                                {user.status === 'active' ? (
                                  <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Desactivar
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="mr-2 h-4 w-4" />
                                    Activar
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setUserToDelete(user);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vista de grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedUsers.map((user, index) => {
            const RoleIcon = getRoleIcon(user.role);
            
            return (
              <motion.div
                key={user.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {getUserInitials(user.name, user.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                          <div className="ml-2 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                      />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {user.name} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{user.email}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rol:</span>
                        <div className="flex items-center">
                          <RoleIcon className="w-4 h-4 mr-1" />
                          <span className="text-sm capitalize">{user.role}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Estado:</span>
                        <div className="flex items-center">
                          {getStatusIcon(user.status)}
                          <span className="ml-1 text-sm capitalize">{user.status}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Último acceso:</span>
                        <span className="text-sm text-gray-900">
                          {getLastLoginText(user.lastLogin)}
                        </span>
                      </div>
                      
                      {user.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {user.phone}
                          </span>
                        </div>
                      )}
                      
                      {user.department && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Departamento:</span>
                          <span className="text-sm text-gray-900">
                            {user.department}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedUser(user);
                        setShowDetailModal(true);
                      }}>
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {}}>
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedUser(user);
                        setShowPermissionsModal(true);
                      }}>
                        <Shield className="w-4 h-4 mr-1" />
                        Permisos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Vista de tarjetas compactas */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {paginatedUsers.map((user, index) => (
            <motion.div
              key={user.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {getUserInitials(user.name, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                      className="h-3 w-3"
                    />
                  </div>
                  
                  <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">
                    {user.name} {user.lastName}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={`${getRoleColor(user.role)} text-xs`}>
                      {user.role}
                    </Badge>
                    {user.isOnline && (
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredUsers.length)} de {filteredUsers.length} resultados
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de detalles del usuario */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Perfil de Usuario</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4 space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback>
                    {getUserInitials(selectedUser.name, selectedUser.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedUser.name} {selectedUser.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center mt-1">
                    {getStatusIcon(selectedUser.status)}
                    <span className="ml-2 text-sm">{selectedUser.status}</span>
                    {selectedUser.isOnline && (
                      <span className="ml-2 text-sm text-green-600">• En línea</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Rol</Label>
                  <p className="text-sm">{selectedUser.role}</p>
                </div>
                <div>
                  <Label>Departamento</Label>
                  <p className="text-sm">{selectedUser.department || 'No asignado'}</p>
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <p className="text-sm">{selectedUser.phone || 'No proporcionado'}</p>
                </div>
                <div>
                  <Label>Fecha de Registro</Label>
                  <p className="text-sm">{formatDate(selectedUser.registrationDate)}</p>
                </div>
                <div>
                  <Label>Último Acceso</Label>
                  <p className="text-sm">{getLastLoginText(selectedUser.lastLogin)}</p>
                </div>
                <div>
                  <Label>Rancho Asignado</Label>
                  <p className="text-sm">{selectedUser.ranchName || 'No asignado'}</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Cerrar
            </Button>
            <Button onClick={() => {}}>
              <Edit className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para resetear contraseña */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resetear Contraseña</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-gray-600">
              Resetear contraseña para: <strong>{selectedUser?.name} {selectedUser?.lastName}</strong>
            </p>
            
            <div>
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa la nueva contraseña"
              />
            </div>
            
            <div>
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma la nueva contraseña"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleResetPassword(selectedUser?.id)}>
              <Key className="w-4 h-4 mr-2" />
              Resetear Contraseña
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de permisos */}
      <Dialog open={showPermissionsModal} onOpenChange={setShowPermissionsModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Gestión de Permisos</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 mb-4">
              Configurar permisos para: <strong>{selectedUser?.name} {selectedUser?.lastName}</strong>
            </p>
            
            <div className="space-y-4">
              {/* Aquí iría la gestión de permisos detallada */}
              <div className="text-center text-gray-500 py-8">
                <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Gestión de Permisos</h3>
                <p>La configuración detallada de permisos estará disponible próximamente.</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPermissionsModal(false)}>
              Cerrar
            </Button>
            <Button onClick={() => {}}>
              <Shield className="w-4 h-4 mr-2" />
              Guardar Permisos
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación para eliminar */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              ¿Estás seguro de que deseas eliminar a este usuario? 
              Esta acción no se puede deshacer y se perderán todos los datos asociados.
            </p>
            {userToDelete && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm"><strong>Usuario:</strong> {userToDelete.name} {userToDelete.lastName}</p>
                <p className="text-sm"><strong>Email:</strong> {userToDelete.email}</p>
                <p className="text-sm"><strong>Rol:</strong> {userToDelete.role}</p>
                <p className="text-sm"><strong>Estado:</strong> {userToDelete.status}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setUserToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteUser(userToDelete?.id)}
            >
              Eliminar Usuario
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default UserTable;