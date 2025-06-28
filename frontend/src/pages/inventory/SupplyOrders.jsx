// Frontend/src/pages/inventory/SupplyOrders.jsx

import React, { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  User,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ShoppingCart,
  Truck,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  X,
  FileText,
  Building,
  Phone,
  Mail,
  Star,
  ExternalLink,
  Tags,
  BarChart3,
  Target,
  Activity,
  Award,
  Send,
  PrinterIcon,
  MessageSquare,
  Timer,
  PieChart,
  Zap,
  Shield,
  AlertCircle
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SupplyOrders = () => {
  // Estados para manejar los datos y la UI
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    supplier: '',
    category: '',
    priority: '',
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Estados para acciones
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Animaciones para los componentes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    },
    hover: {
      y: -4,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.2 }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  // Cargar órdenes al montar el componente
  useEffect(() => {
    fetchOrders();
    
    // Mostrar mensaje de éxito si viene de otra página
    if (location.state?.message) {
      console.log(location.state.message);
    }
  }, []);

  // Aplicar filtros cuando cambien los datos o filtros
  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, filters, sortBy, sortOrder]);

  // Obtener lista de órdenes de suministros
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/inventory/supply-orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load supply orders');
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos de ejemplo mientras se carga la API real
  const mockOrders = [
    {
      id: 1,
      orderNumber: 'ORD-2025-001',
      supplier: {
        name: 'AgriVet Supplies Inc.',
        contact: 'Sarah Johnson',
        phone: '+1-555-0123',
        email: 'orders@agrivet.com',
        rating: 4.8,
        address: '123 Farm Supply Rd, Agriculture City, AC 12345'
      },
      category: 'Veterinary Supplies',
      items: [
        { 
          name: 'Penicillin G Injectable', 
          quantity: 50, 
          unit: 'vials', 
          unitPrice: 25.50, 
          total: 1275.00 
        },
        { 
          name: 'Disposable Syringes 10ml', 
          quantity: 100, 
          unit: 'pieces', 
          unitPrice: 0.85, 
          total: 85.00 
        },
        { 
          name: 'Vaccine Storage Box', 
          quantity: 2, 
          unit: 'units', 
          unitPrice: 150.00, 
          total: 300.00 
        }
      ],
      subtotal: 1660.00,
      tax: 166.00,
      shipping: 45.00,
      total: 1871.00,
      status: 'Pending',
      priority: 'High',
      orderDate: '2025-06-25',
      expectedDelivery: '2025-06-30',
      actualDelivery: null,
      deliveryLocation: 'Main Warehouse',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      notes: 'Urgent order for emergency veterinary supplies. Please expedite delivery.',
      paymentMethod: 'Credit Account',
      paymentStatus: 'Pending',
      trackingNumber: null,
      createdBy: 'Dr. Martinez',
      approvedBy: null,
      createdAt: '2025-06-25T09:30:00Z'
    },
    {
      id: 2,
      orderNumber: 'ORD-2025-002',
      supplier: {
        name: 'Premium Feed Solutions',
        contact: 'Miguel Rodriguez',
        phone: '+1-555-0456',
        email: 'sales@premiumfeed.com',
        rating: 4.5,
        address: '456 Feed Mill Ave, Nutrition Valley, NV 67890'
      },
      category: 'Feed & Nutrition',
      items: [
        { 
          name: 'Premium Cattle Feed 20%', 
          quantity: 100, 
          unit: 'bags (50kg)', 
          unitPrice: 35.00, 
          total: 3500.00 
        },
        { 
          name: 'Mineral Supplement Block', 
          quantity: 25, 
          unit: 'blocks', 
          unitPrice: 12.50, 
          total: 312.50 
        },
        { 
          name: 'Vitamin B Complex Injectable', 
          quantity: 10, 
          unit: 'vials', 
          unitPrice: 18.75, 
          total: 187.50 
        }
      ],
      subtotal: 4000.00,
      tax: 400.00,
      shipping: 125.00,
      total: 4525.00,
      status: 'Approved',
      priority: 'Medium',
      orderDate: '2025-06-22',
      expectedDelivery: '2025-06-28',
      actualDelivery: null,
      deliveryLocation: 'Feed Storage Facility',
      coordinates: { lat: 17.9885, lng: -92.9462 },
      notes: 'Monthly feed order. Standard delivery schedule.',
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Paid',
      trackingNumber: 'TRK-PFS-789456',
      createdBy: 'Farm Manager',
      approvedBy: 'Dr. Rodriguez',
      createdAt: '2025-06-22T14:15:00Z'
    },
    {
      id: 3,
      orderNumber: 'ORD-2025-003',
      supplier: {
        name: 'Farm Equipment Pro',
        contact: 'Jennifer Lee',
        phone: '+1-555-0789',
        email: 'service@farmequippro.com',
        rating: 4.9,
        address: '789 Equipment Blvd, Machinery Town, MT 13579'
      },
      category: 'Equipment',
      items: [
        { 
          name: 'Digital Livestock Scale', 
          quantity: 1, 
          unit: 'unit', 
          unitPrice: 2500.00, 
          total: 2500.00 
        },
        { 
          name: 'Ear Tag Applicator Set', 
          quantity: 3, 
          unit: 'sets', 
          unitPrice: 45.00, 
          total: 135.00 
        },
        { 
          name: 'Hoof Trimming Tools', 
          quantity: 1, 
          unit: 'kit', 
          unitPrice: 350.00, 
          total: 350.00 
        }
      ],
      subtotal: 2985.00,
      tax: 298.50,
      shipping: 85.00,
      total: 3368.50,
      status: 'Shipped',
      priority: 'Low',
      orderDate: '2025-06-18',
      expectedDelivery: '2025-06-25',
      actualDelivery: null,
      deliveryLocation: 'Equipment Storage',
      coordinates: { lat: 17.9878, lng: -92.9502 },
      notes: 'Equipment upgrade for better livestock management.',
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      trackingNumber: 'TRK-FEP-123789',
      createdBy: 'Equipment Manager',
      approvedBy: 'Dr. Martinez',
      createdAt: '2025-06-18T11:45:00Z'
    },
    {
      id: 4,
      orderNumber: 'ORD-2025-004',
      supplier: {
        name: 'BioTech Animal Health',
        contact: 'David Chen',
        phone: '+1-555-0321',
        email: 'orders@biotechhealth.com',
        rating: 4.7,
        address: '321 Biotech Drive, Research Park, RP 24680'
      },
      category: 'Vaccines',
      items: [
        { 
          name: 'FMD Vaccine (500 doses)', 
          quantity: 2, 
          unit: 'vials', 
          unitPrice: 750.00, 
          total: 1500.00 
        },
        { 
          name: 'Brucellosis Vaccine', 
          quantity: 1, 
          unit: 'vial', 
          unitPrice: 450.00, 
          total: 450.00 
        },
        { 
          name: 'Cold Storage Container', 
          quantity: 1, 
          unit: 'unit', 
          unitPrice: 200.00, 
          total: 200.00 
        }
      ],
      subtotal: 2150.00,
      tax: 215.00,
      shipping: 75.00,
      total: 2440.00,
      status: 'Delivered',
      priority: 'High',
      orderDate: '2025-06-15',
      expectedDelivery: '2025-06-20',
      actualDelivery: '2025-06-19',
      deliveryLocation: 'Vaccine Storage Room',
      coordinates: { lat: 17.9890, lng: -92.9458 },
      notes: 'Temperature-controlled delivery required. Delivered on time.',
      paymentMethod: 'Credit Account',
      paymentStatus: 'Paid',
      trackingNumber: 'TRK-BTH-456123',
      createdBy: 'Veterinarian',
      approvedBy: 'Dr. Rodriguez',
      createdAt: '2025-06-15T16:20:00Z'
    },
    {
      id: 5,
      orderNumber: 'ORD-2025-005',
      supplier: {
        name: 'Rural Infrastructure Co.',
        contact: 'Amanda Foster',
        phone: '+1-555-0654',
        email: 'projects@ruralinfra.com',
        rating: 4.3,
        address: '654 Infrastructure Way, Building City, BC 97531'
      },
      category: 'Infrastructure',
      items: [
        { 
          name: 'Water Tank 5000L', 
          quantity: 2, 
          unit: 'tanks', 
          unitPrice: 850.00, 
          total: 1700.00 
        },
        { 
          name: 'Automatic Water Feeder', 
          quantity: 10, 
          unit: 'units', 
          unitPrice: 125.00, 
          total: 1250.00 
        },
        { 
          name: 'Fence Wire Heavy Duty', 
          quantity: 500, 
          unit: 'meters', 
          unitPrice: 2.50, 
          total: 1250.00 
        }
      ],
      subtotal: 4200.00,
      tax: 420.00,
      shipping: 150.00,
      total: 4770.00,
      status: 'Cancelled',
      priority: 'Medium',
      orderDate: '2025-06-12',
      expectedDelivery: '2025-06-20',
      actualDelivery: null,
      deliveryLocation: 'Construction Site A',
      coordinates: { lat: 17.9892, lng: -92.9468 },
      notes: 'Order cancelled due to budget constraints. Will re-order next quarter.',
      paymentMethod: 'Purchase Order',
      paymentStatus: 'Cancelled',
      trackingNumber: null,
      createdBy: 'Project Manager',
      approvedBy: null,
      createdAt: '2025-06-12T10:00:00Z'
    },
    {
      id: 6,
      orderNumber: 'ORD-2025-006',
      supplier: {
        name: 'CleanCare Sanitation',
        contact: 'Robert Kim',
        phone: '+1-555-0987',
        email: 'supply@cleancare.com',
        rating: 4.6,
        address: '987 Hygiene Street, Sanitation Square, SS 86420'
      },
      category: 'Cleaning Supplies',
      items: [
        { 
          name: 'Disinfectant Solution (Industrial)', 
          quantity: 20, 
          unit: 'gallons', 
          unitPrice: 25.00, 
          total: 500.00 
        },
        { 
          name: 'Protective Coveralls', 
          quantity: 50, 
          unit: 'suits', 
          unitPrice: 8.50, 
          total: 425.00 
        },
        { 
          name: 'Heavy Duty Gloves', 
          quantity: 100, 
          unit: 'pairs', 
          unitPrice: 3.25, 
          total: 325.00 
        }
      ],
      subtotal: 1250.00,
      tax: 125.00,
      shipping: 35.00,
      total: 1410.00,
      status: 'In Transit',
      priority: 'Medium',
      orderDate: '2025-06-24',
      expectedDelivery: '2025-06-27',
      actualDelivery: null,
      deliveryLocation: 'Sanitation Storage',
      coordinates: { lat: 17.9888, lng: -92.9485 },
      notes: 'Weekly sanitation supplies order. Standard priority.',
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      trackingNumber: 'TRK-CC-654987',
      createdBy: 'Sanitation Manager',
      approvedBy: 'Operations Manager',
      createdAt: '2025-06-24T13:30:00Z'
    }
  ];

  // Usar datos mock si no hay órdenes reales
  const ordersData = orders.length > 0 ? orders : mockOrders;

  // Aplicar filtros y búsqueda
  const applyFilters = () => {
    let filtered = [...ordersData];

    // Aplicar búsqueda por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(term) ||
        order.supplier.name.toLowerCase().includes(term) ||
        order.category.toLowerCase().includes(term) ||
        order.items.some(item => item.name.toLowerCase().includes(term)) ||
        order.deliveryLocation.toLowerCase().includes(term)
      );
    }

    // Aplicar filtros específicos
    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    if (filters.supplier) {
      filtered = filtered.filter(order => order.supplier.name === filters.supplier);
    }

    if (filters.category) {
      filtered = filtered.filter(order => order.category === filters.category);
    }

    if (filters.priority) {
      filtered = filtered.filter(order => order.priority === filters.priority);
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const today = new Date();
      const orderDate = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          orderDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          orderDate.setMonth(today.getMonth() - 1);
          break;
        case 'quarter':
          orderDate.setMonth(today.getMonth() - 3);
          break;
        case 'year':
          orderDate.setFullYear(today.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      if (filters.dateRange !== 'all') {
        filtered = filtered.filter(order => {
          const date = new Date(order.orderDate);
          return date >= orderDate && date <= today;
        });
      }
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Manejo especial para fechas
      if (sortBy === 'orderDate' || sortBy === 'expectedDelivery' || sortBy === 'actualDelivery') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Manejo especial para números
      if (sortBy === 'total') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      // Manejo especial para objetos anidados
      if (sortBy === 'supplier') {
        aValue = a.supplier.name.toLowerCase();
        bValue = b.supplier.name.toLowerCase();
      }

      // Conversión a string para comparación
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  // Obtener icono del estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return Clock;
      case 'Approved': return CheckCircle;
      case 'Shipped': return Truck;
      case 'In Transit': return Activity;
      case 'Delivered': return Target;
      case 'Cancelled': return X;
      default: return Package;
    }
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Approved': return 'text-blue-600 bg-blue-100';
      case 'Shipped': return 'text-purple-600 bg-purple-100';
      case 'In Transit': return 'text-indigo-600 bg-indigo-100';
      case 'Delivered': return 'text-green-600 bg-green-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Obtener color de prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Obtener color de categoría
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Veterinary Supplies': return 'bg-red-500 text-white';
      case 'Feed & Nutrition': return 'bg-green-500 text-white';
      case 'Equipment': return 'bg-blue-500 text-white';
      case 'Vaccines': return 'bg-purple-500 text-white';
      case 'Infrastructure': return 'bg-orange-500 text-white';
      case 'Cleaning Supplies': return 'bg-teal-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calcular días hasta la entrega
  const getDaysUntilDelivery = (deliveryDate) => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  // Manejar eliminación de orden
  const handleDelete = async (orderId) => {
    setDeletingOrderId(orderId);
    
    try {
      const response = await fetch(`/api/inventory/supply-orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setOrders(prev => prev.filter(order => order.id !== orderId));
        setShowDeleteModal(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Delete order error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      status: '',
      supplier: '',
      category: '',
      priority: '',
      dateRange: 'all'
    });
    setShowFilters(false);
  };

  // Calcular estadísticas
  const stats = {
    total: ordersData.length,
    pending: ordersData.filter(o => o.status === 'Pending').length,
    approved: ordersData.filter(o => o.status === 'Approved').length,
    delivered: ordersData.filter(o => o.status === 'Delivered').length,
    totalValue: ordersData.reduce((sum, order) => sum + order.total, 0),
    averageOrderValue: ordersData.length > 0 ? ordersData.reduce((sum, order) => sum + order.total, 0) / ordersData.length : 0
  };

  // Datos para paginación
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading supply orders...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Supply Orders</h1>
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <span>{stats.total} total</span>
                <span className="text-yellow-600">{stats.pending} pending</span>
                <span className="text-blue-600">{stats.approved} approved</span>
                <span className="text-green-600">{stats.delivered} delivered</span>
                <span className="text-purple-600">{formatCurrency(stats.totalValue)} total value</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchOrders}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              
              <Link
                to="/inventory/supply-orders/add"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controles de filtro y búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Búsqueda */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search orders by number, supplier, category..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Controles de vista y filtros */}
            <div className="flex items-center space-x-3">
              {/* Ordenamiento */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="orderDate-desc">Date: Latest First</option>
                <option value="orderDate-asc">Date: Earliest First</option>
                <option value="total-desc">Value: Highest First</option>
                <option value="total-asc">Value: Lowest First</option>
                <option value="supplier-asc">Supplier A-Z</option>
                <option value="status-asc">Status</option>
                <option value="priority-desc">Priority: High First</option>
              </select>

              {/* Botón de filtros */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-3 py-2 border rounded-lg transition-colors ${
                  showFilters || Object.values(filters).some(f => f && f !== 'all')
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>

              {/* Toggle de vista */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 transition-colors ${
                    viewMode === 'table'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Panel de filtros expandible */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Shipped">Shipped</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All categories</option>
                      <option value="Veterinary Supplies">Veterinary Supplies</option>
                      <option value="Feed & Nutrition">Feed & Nutrition</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Vaccines">Vaccines</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Cleaning Supplies">Cleaning Supplies</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={filters.priority}
                      onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All priorities</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <select
                      value={filters.supplier}
                      onChange={(e) => setFilters(prev => ({ ...prev, supplier: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All suppliers</option>
                      <option value="AgriVet Supplies Inc.">AgriVet Supplies Inc.</option>
                      <option value="Premium Feed Solutions">Premium Feed Solutions</option>
                      <option value="Farm Equipment Pro">Farm Equipment Pro</option>
                      <option value="BioTech Animal Health">BioTech Animal Health</option>
                      <option value="Rural Infrastructure Co.">Rural Infrastructure Co.</option>
                      <option value="CleanCare Sanitation">CleanCare Sanitation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="all">All dates</option>
                      <option value="week">Last week</option>
                      <option value="month">Last month</option>
                      <option value="quarter">Last quarter</option>
                      <option value="year">Last year</option>
                    </select>
                  </div>
                </div>

                {Object.values(filters).some(f => f && f !== 'all') && (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Contenido principal */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || Object.values(filters).some(f => f && f !== 'all')
                ? 'No orders found'
                : 'No supply orders yet'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(filters).some(f => f && f !== 'all')
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first supply order'
              }
            </p>
            {!searchTerm && !Object.values(filters).some(f => f && f !== 'all') && (
              <Link
                to="/inventory/supply-orders/add"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Order
              </Link>
            )}
          </motion.div>
        ) : (
          <>
            {/* Vista Grid */}
            {viewMode === 'grid' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {paginatedOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <motion.div
                      key={order.id}
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white rounded-xl shadow-sm border overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/inventory/supply-orders/${order.id}`)}
                    >
                      {/* Header de la orden */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{order.orderNumber}</h3>
                            <p className="text-sm text-gray-600">{order.supplier.name}</p>
                          </div>
                          
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionMenu(showActionMenu === order.id ? null : order.id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {showActionMenu === order.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-0 top-6 bg-white rounded-lg shadow-lg border z-10 min-w-40"
                              >
                                <Link
                                  to={`/inventory/supply-orders/${order.id}`}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Link>
                                <Link
                                  to={`/inventory/supply-orders/edit/${order.id}`}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                                <button className="flex items-center w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50">
                                  <PrinterIcon className="w-4 h-4 mr-2" />
                                  Print Order
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteModal(order.id);
                                    setShowActionMenu(null);
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </div>

                        {/* Información de la orden */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(order.category)}`}>
                              {order.category}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                              {order.priority}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              <StatusIcon className="w-4 h-4 mr-1" />
                              {order.status}
                            </span>
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(order.total)}
                            </span>
                          </div>

                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>Ordered: {new Date(order.orderDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Truck className="w-4 h-4 mr-2" />
                              <span>Expected: {getDaysUntilDelivery(order.expectedDelivery)}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span className="truncate">{order.deliveryLocation}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer con items */}
                      <div className="px-6 py-3 bg-gray-50 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Package className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          {order.supplier.rating && (
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 mr-1" />
                              <span className="text-sm text-gray-600">{order.supplier.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Vista Tabla */}
            {viewMode === 'table' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Supplier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Delivery
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedOrders.map((order, index) => {
                        const StatusIcon = getStatusIcon(order.status);
                        return (
                          <motion.tr
                            key={order.id}
                            variants={tableRowVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {order.orderNumber}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(order.orderDate).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {order.items.length} items
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{order.supplier.name}</div>
                              <div className="text-sm text-gray-500">{order.supplier.contact}</div>
                              {order.supplier.rating && (
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                  <span className="text-xs text-gray-500">{order.supplier.rating}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(order.category)}`}>
                                {order.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {order.status}
                              </span>
                              <div className={`text-xs mt-1 ${getPriorityColor(order.priority).replace('bg-', 'text-').replace('-100', '-600')}`}>
                                {order.priority} Priority
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div>{getDaysUntilDelivery(order.expectedDelivery)}</div>
                              <div className="text-xs text-gray-400 truncate max-w-32">
                                {order.deliveryLocation}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(order.total)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Link
                                  to={`/inventory/supply-orders/${order.id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <Link
                                  to={`/inventory/supply-orders/edit/${order.id}`}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => setShowDeleteModal(order.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mt-8"
              >
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of{' '}
                  {filteredOrders.length} results
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border transition-colors ${
                      currentPage === 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    )
                    .map((page, index, array) => (
                      <Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'border-blue-500 bg-blue-600 text-white'
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </Fragment>
                    ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border transition-colors ${
                      currentPage === totalPages
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Supply Order</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this supply order? This will permanently remove all associated data.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingOrderId}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deletingOrderId}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
              >
                {deletingOrderId ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Click outside para cerrar menús */}
      {showActionMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowActionMenu(null)}
        ></div>
      )}
    </div>
  );
};

export default SupplyOrders;