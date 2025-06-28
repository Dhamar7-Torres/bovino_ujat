// Frontend/src/pages/health/VeterinaryConsults.jsx

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
  Stethoscope,
  Heart,
  AlertTriangle,
  CheckCircle,
  Thermometer,
  Activity,
  Pill,
  FileText,
  Phone,
  Mail,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  X,
  Star,
  Award,
  Users,
  CalendarDays,
  ClipboardCheck,
  Zap,
  Baby,
  Cow,
  Microscope,
  Timer,
  Settings,
  Send,
  BookOpen,
  Target,
  TrendingUp,
  TrendingDown,
  Clipboard,
  Camera,
  Upload
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const VeterinaryConsults = () => {
  // Estados para manejar los datos y la UI
  const [consults, setConsults] = useState([]);
  const [filteredConsults, setFilteredConsults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    consultType: '',
    status: '',
    veterinarian: '',
    dateRange: 'all',
    priority: '',
    outcome: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('consultDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Estados para acciones
  const [selectedConsults, setSelectedConsults] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingConsultId, setDeletingConsultId] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showBookConsultModal, setShowBookConsultModal] = useState(false);

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

  // Cargar consultas al montar el componente
  useEffect(() => {
    fetchConsults();
    
    // Mostrar mensaje de éxito si viene de otra página
    if (location.state?.message) {
      console.log(location.state.message);
    }
  }, []);

  // Aplicar filtros cuando cambien los datos o filtros
  useEffect(() => {
    applyFilters();
  }, [consults, searchTerm, filters, sortBy, sortOrder]);

  // Obtener lista de consultas veterinarias
  const fetchConsults = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/health/veterinary-consults', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setConsults(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load veterinary consults');
      }
    } catch (error) {
      console.error('Fetch consults error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos de ejemplo mientras se carga la API real
  const mockConsults = [
    {
      id: 1,
      animal: 'Luna',
      tagNumber: 'L089',
      consultType: 'Routine Checkup',
      chiefComplaint: 'Annual health examination',
      symptoms: 'None - preventive care',
      veterinarian: 'Dr. Sarah Martinez',
      veterinarianPhone: '+52 993 123 4567',
      veterinarianEmail: 'sarah.martinez@vetclinic.com',
      consultDate: '2025-06-25',
      consultTime: '09:00',
      duration: 45,
      location: 'Main Barn',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      status: 'Completed',
      priority: 'Medium',
      diagnosis: 'Healthy animal - no issues detected',
      treatment: 'No treatment required',
      medications: [],
      recommendations: 'Continue current feeding regimen. Next checkup in 6 months.',
      followUpRequired: true,
      followUpDate: '2025-12-25',
      vitalSigns: {
        temperature: 38.5,
        heartRate: 72,
        respiratoryRate: 28,
        weight: 485.2
      },
      physicalExam: {
        generalAppearance: 'Alert and responsive',
        bodyCondition: 'Good (Score: 7/9)',
        musculoskeletalSystem: 'Normal gait, no lameness',
        respiratorySystem: 'Clear lung sounds bilaterally',
        cardiovascularSystem: 'Regular heart rhythm',
        digestiveSystem: 'Normal rumen activity',
        reproductiveSystem: 'Normal external genitalia',
        integumentarySystem: 'Healthy skin and coat'
      },
      labResults: null,
      images: ['luna_checkup_1.jpg'],
      cost: 85.00,
      notes: 'Excellent overall health. Owner reports good appetite and normal behavior.',
      outcome: 'Successful routine examination',
      rating: 5,
      createdAt: '2025-06-25T09:00:00Z'
    },
    {
      id: 2,
      animal: 'Thunder',
      tagNumber: 'T156',
      consultType: 'Emergency Consultation',
      chiefComplaint: 'Acute lameness and swelling in right hind leg',
      symptoms: 'Severe limping, localized swelling, pain on palpation',
      veterinarian: 'Dr. Emergency Vet',
      veterinarianPhone: '+52 993 987 6543',
      veterinarianEmail: 'emergency@vetclinic.com',
      consultDate: '2025-06-23',
      consultTime: '15:30',
      duration: 90,
      location: 'Emergency Area',
      coordinates: { lat: 17.9888, lng: -92.9465 },
      status: 'Completed',
      priority: 'High',
      diagnosis: 'Soft tissue injury with mild inflammation',
      treatment: 'Anti-inflammatory therapy and rest',
      medications: [
        'Flunixin Meglumine 10ml IM',
        'Dexamethasone 5ml IM'
      ],
      recommendations: 'Restrict movement for 1 week. Cold compress twice daily.',
      followUpRequired: true,
      followUpDate: '2025-06-30',
      vitalSigns: {
        temperature: 39.2,
        heartRate: 88,
        respiratoryRate: 35,
        weight: 520.8
      },
      physicalExam: {
        generalAppearance: 'Mild distress due to pain',
        bodyCondition: 'Good (Score: 6/9)',
        musculoskeletalSystem: 'Right hind limb lameness, localized swelling',
        respiratorySystem: 'Slightly elevated due to stress',
        cardiovascularSystem: 'Elevated heart rate',
        digestiveSystem: 'Normal',
        reproductiveSystem: 'Not examined',
        integumentarySystem: 'Normal except affected area'
      },
      labResults: null,
      images: ['thunder_injury_1.jpg', 'thunder_injury_2.jpg'],
      cost: 165.50,
      notes: 'Responded well to treatment. Swelling reduced significantly.',
      outcome: 'Good response to treatment',
      rating: 4,
      createdAt: '2025-06-23T15:30:00Z'
    },
    {
      id: 3,
      animal: 'Bella',
      tagNumber: 'B247',
      consultType: 'Illness Consultation',
      chiefComplaint: 'Loss of appetite and lethargy for 3 days',
      symptoms: 'Decreased feed intake, lethargy, mild fever',
      veterinarian: 'Dr. Juan Rodriguez',
      veterinarianPhone: '+52 993 456 7890',
      veterinarianEmail: 'juan.rodriguez@vetclinic.com',
      consultDate: '2025-06-20',
      consultTime: '11:15',
      duration: 60,
      location: 'Medical Bay',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      status: 'Completed',
      priority: 'Medium',
      diagnosis: 'Mild gastrointestinal upset',
      treatment: 'Supportive therapy and dietary modification',
      medications: [
        'Probiotics 50g PO daily',
        'Vitamin B complex 5ml IM'
      ],
      recommendations: 'Provide high-quality hay. Monitor appetite and water intake.',
      followUpRequired: true,
      followUpDate: '2025-06-27',
      vitalSigns: {
        temperature: 39.8,
        heartRate: 78,
        respiratoryRate: 30,
        weight: 465.3
      },
      physicalExam: {
        generalAppearance: 'Slightly depressed',
        bodyCondition: 'Fair (Score: 5/9)',
        musculoskeletalSystem: 'Normal',
        respiratorySystem: 'Normal',
        cardiovascularSystem: 'Normal',
        digestiveSystem: 'Reduced rumen activity',
        reproductiveSystem: 'Normal',
        integumentarySystem: 'Normal'
      },
      labResults: 'Complete Blood Count: Within normal limits',
      images: [],
      cost: 125.75,
      notes: 'Gradual improvement in appetite over 48 hours post-treatment.',
      outcome: 'Complete recovery',
      rating: 5,
      createdAt: '2025-06-20T11:15:00Z'
    },
    {
      id: 4,
      animal: 'Daisy',
      tagNumber: 'D234',
      consultType: 'Pregnancy Consultation',
      chiefComplaint: 'Pregnancy confirmation and prenatal care',
      symptoms: 'None - routine prenatal examination',
      veterinarian: 'Dr. Sarah Martinez',
      veterinarianPhone: '+52 993 123 4567',
      veterinarianEmail: 'sarah.martinez@vetclinic.com',
      consultDate: '2025-06-28',
      consultTime: '14:00',
      duration: 40,
      location: 'Maternity Pen',
      coordinates: { lat: 17.9890, lng: -92.9458 },
      status: 'Scheduled',
      priority: 'Medium',
      diagnosis: 'Pending examination',
      treatment: 'Prenatal assessment',
      medications: [],
      recommendations: 'Nutritional supplementation during pregnancy',
      followUpRequired: true,
      followUpDate: '2025-07-28',
      vitalSigns: null,
      physicalExam: null,
      labResults: null,
      images: [],
      cost: 95.00,
      notes: 'First prenatal examination. Owner reports normal behavior.',
      outcome: 'Pending',
      rating: null,
      createdAt: '2025-06-15T10:00:00Z'
    },
    {
      id: 5,
      animal: 'Max',
      tagNumber: 'M456',
      consultType: 'Skin Condition',
      chiefComplaint: 'Skin lesions and excessive scratching',
      symptoms: 'Multiple skin lesions, pruritus, hair loss in affected areas',
      veterinarian: 'Dr. Juan Rodriguez',
      veterinarianPhone: '+52 993 456 7890',
      veterinarianEmail: 'juan.rodriguez@vetclinic.com',
      consultDate: '2025-06-18',
      consultTime: '10:30',
      duration: 55,
      location: 'Treatment Chute',
      coordinates: { lat: 17.9882, lng: -92.9470 },
      status: 'Completed',
      priority: 'Medium',
      diagnosis: 'Parasitic dermatitis',
      treatment: 'Topical and systemic antiparasitic treatment',
      medications: [
        'Ivermectin 1ml per 50kg SC',
        'Topical antiseptic solution'
      ],
      recommendations: 'Improve pasture management. Regular grooming.',
      followUpRequired: true,
      followUpDate: '2025-07-02',
      vitalSigns: {
        temperature: 38.7,
        heartRate: 75,
        respiratoryRate: 28,
        weight: 445.8
      },
      physicalExam: {
        generalAppearance: 'Alert but uncomfortable',
        bodyCondition: 'Fair (Score: 5/9)',
        musculoskeletalSystem: 'Normal',
        respiratorySystem: 'Normal',
        cardiovascularSystem: 'Normal',
        digestiveSystem: 'Normal',
        reproductiveSystem: 'Normal',
        integumentarySystem: 'Multiple skin lesions, alopecia patches'
      },
      labResults: 'Skin scraping: Parasitic mites identified',
      images: ['max_skin_1.jpg', 'max_skin_2.jpg'],
      cost: 110.25,
      notes: 'Significant improvement after treatment. Lesions healing well.',
      outcome: 'Good response to treatment',
      rating: 4,
      createdAt: '2025-06-18T10:30:00Z'
    },
    {
      id: 6,
      animal: 'Sophie',
      tagNumber: 'S789',
      consultType: 'Vaccination Consultation',
      chiefComplaint: 'Annual vaccination and health assessment',
      symptoms: 'None - preventive care',
      veterinarian: 'Dr. Sarah Martinez',
      veterinarianPhone: '+52 993 123 4567',
      veterinarianEmail: 'sarah.martinez@vetclinic.com',
      consultDate: '2025-06-30',
      consultTime: '16:00',
      duration: 30,
      location: 'Main Barn',
      coordinates: { lat: 17.9896, lng: -92.9475 },
      status: 'Scheduled',
      priority: 'Low',
      diagnosis: 'Pending examination',
      treatment: 'Vaccination protocol',
      medications: [
        'FMD Vaccine 2ml SC',
        'Clostridial Vaccine 2ml SC'
      ],
      recommendations: 'Monitor for post-vaccination reactions',
      followUpRequired: false,
      followUpDate: null,
      vitalSigns: null,
      physicalExam: null,
      labResults: null,
      images: [],
      cost: 65.00,
      notes: 'Annual vaccination schedule. Animal in good health.',
      outcome: 'Pending',
      rating: null,
      createdAt: '2025-06-22T14:00:00Z'
    },
    {
      id: 7,
      animal: 'Rocky',
      tagNumber: 'R321',
      consultType: 'Nutritional Consultation',
      chiefComplaint: 'Poor weight gain and body condition',
      symptoms: 'Slow weight gain, poor body condition score',
      veterinarian: 'Dr. Nutrition Specialist',
      veterinarianPhone: '+52 993 234 5678',
      veterinarianEmail: 'nutrition@vetclinic.com',
      consultDate: '2025-06-16',
      consultTime: '13:45',
      duration: 75,
      location: 'Feeding Area',
      coordinates: { lat: 17.9875, lng: -92.9480 },
      status: 'Completed',
      priority: 'Medium',
      diagnosis: 'Nutritional deficiency',
      treatment: 'Dietary modification and supplementation',
      medications: [
        'Vitamin A injection 10ml IM',
        'Mineral supplement 100g daily'
      ],
      recommendations: 'High-energy feed ration. Regular weight monitoring.',
      followUpRequired: true,
      followUpDate: '2025-07-16',
      vitalSigns: {
        temperature: 38.3,
        heartRate: 68,
        respiratoryRate: 26,
        weight: 385.5
      },
      physicalExam: {
        generalAppearance: 'Alert but thin',
        bodyCondition: 'Poor (Score: 3/9)',
        musculoskeletalSystem: 'Muscle wasting evident',
        respiratorySystem: 'Normal',
        cardiovascularSystem: 'Normal',
        digestiveSystem: 'Normal rumen activity',
        reproductiveSystem: 'Normal',
        integumentarySystem: 'Dull coat'
      },
      labResults: 'Serum protein: Below normal range',
      images: ['rocky_nutrition_1.jpg'],
      cost: 145.00,
      notes: 'Owner educated on proper nutrition. Weight gain program initiated.',
      outcome: 'Treatment plan established',
      rating: 5,
      createdAt: '2025-06-16T13:45:00Z'
    }
  ];

  // Usar datos mock si no hay consultas reales
  const consultsData = consults.length > 0 ? consults : mockConsults;

  // Aplicar filtros y búsqueda
  const applyFilters = () => {
    let filtered = [...consultsData];

    // Aplicar búsqueda por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(consult =>
        consult.animal.toLowerCase().includes(term) ||
        consult.tagNumber.toLowerCase().includes(term) ||
        consult.consultType.toLowerCase().includes(term) ||
        consult.chiefComplaint.toLowerCase().includes(term) ||
        consult.diagnosis.toLowerCase().includes(term) ||
        consult.veterinarian.toLowerCase().includes(term) ||
        consult.symptoms.toLowerCase().includes(term)
      );
    }

    // Aplicar filtros específicos
    if (filters.consultType) {
      filtered = filtered.filter(consult => consult.consultType === filters.consultType);
    }

    if (filters.status) {
      filtered = filtered.filter(consult => consult.status === filters.status);
    }

    if (filters.veterinarian) {
      filtered = filtered.filter(consult => consult.veterinarian === filters.veterinarian);
    }

    if (filters.priority) {
      filtered = filtered.filter(consult => consult.priority === filters.priority);
    }

    if (filters.outcome) {
      filtered = filtered.filter(consult => consult.outcome === filters.outcome);
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const today = new Date();
      const consultDate = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          consultDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          consultDate.setMonth(today.getMonth() - 1);
          break;
        case 'quarter':
          consultDate.setMonth(today.getMonth() - 3);
          break;
        case 'year':
          consultDate.setFullYear(today.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      if (filters.dateRange !== 'all') {
        filtered = filtered.filter(consult => {
          const date = new Date(consult.consultDate);
          return date >= consultDate && date <= today;
        });
      }
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Manejo especial para fechas
      if (sortBy === 'consultDate' || sortBy === 'followUpDate' || sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Manejo especial para números
      if (sortBy === 'cost' || sortBy === 'duration' || sortBy === 'rating') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
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

    setFilteredConsults(filtered);
    setCurrentPage(1);
  };

  // Obtener icono del tipo de consulta
  const getConsultTypeIcon = (type) => {
    switch (type) {
      case 'Routine Checkup': return Stethoscope;
      case 'Emergency Consultation': return AlertTriangle;
      case 'Illness Consultation': return Heart;
      case 'Pregnancy Consultation': return Baby;
      case 'Skin Condition': return Activity;
      case 'Vaccination Consultation': return Zap;
      case 'Nutritional Consultation': return Target;
      case 'Dental Consultation': return Clipboard;
      case 'Surgical Consultation': return FileText;
      default: return Stethoscope;
    }
  };

  // Obtener color del tipo de consulta
  const getConsultTypeColor = (type) => {
    switch (type) {
      case 'Routine Checkup': return 'bg-blue-500 text-white';
      case 'Emergency Consultation': return 'bg-red-500 text-white';
      case 'Illness Consultation': return 'bg-orange-500 text-white';
      case 'Pregnancy Consultation': return 'bg-pink-500 text-white';
      case 'Skin Condition': return 'bg-green-500 text-white';
      case 'Vaccination Consultation': return 'bg-purple-500 text-white';
      case 'Nutritional Consultation': return 'bg-yellow-500 text-white';
      case 'Dental Consultation': return 'bg-indigo-500 text-white';
      case 'Surgical Consultation': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'text-blue-600 bg-blue-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      case 'Rescheduled': return 'text-purple-600 bg-purple-100';
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

  // Obtener color del outcome
  const getOutcomeColor = (outcome) => {
    if (outcome === 'Pending') return 'text-gray-600';
    if (outcome.includes('Complete recovery') || outcome.includes('Successful')) {
      return 'text-green-600';
    } else if (outcome.includes('Good response') || outcome.includes('improvement')) {
      return 'text-blue-600';
    } else if (outcome.includes('Partial') || outcome.includes('plan')) {
      return 'text-yellow-600';
    }
    return 'text-gray-600';
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calcular duración formateada
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Renderizar estrellas de rating
  const renderRating = (rating) => {
    if (!rating) return <span className="text-gray-400 text-sm">No rating</span>;
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  // Manejar eliminación de consulta
  const handleDelete = async (consultId) => {
    setDeletingConsultId(consultId);
    
    try {
      const response = await fetch(`/api/health/veterinary-consults/${consultId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setConsults(prev => prev.filter(consult => consult.id !== consultId));
        setShowDeleteModal(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete consult');
      }
    } catch (error) {
      console.error('Delete consult error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setDeletingConsultId(null);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      consultType: '',
      status: '',
      veterinarian: '',
      dateRange: 'all',
      priority: '',
      outcome: ''
    });
    setShowFilters(false);
  };

  // Calcular estadísticas
  const stats = {
    total: consultsData.length,
    scheduled: consultsData.filter(c => c.status === 'Scheduled').length,
    completed: consultsData.filter(c => c.status === 'Completed').length,
    emergency: consultsData.filter(c => c.consultType === 'Emergency Consultation').length,
    totalCost: consultsData.reduce((sum, consult) => sum + consult.cost, 0),
    averageRating: consultsData.filter(c => c.rating).reduce((sum, c) => sum + c.rating, 0) / consultsData.filter(c => c.rating).length || 0
  };

  // Datos para paginación
  const totalPages = Math.ceil(filteredConsults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedConsults = filteredConsults.slice(startIndex, startIndex + itemsPerPage);

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
            <p className="text-gray-600">Loading veterinary consults...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Veterinary Consults</h1>
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <span>{stats.total} total</span>
                <span className="text-blue-600">{stats.scheduled} scheduled</span>
                <span className="text-green-600">{stats.completed} completed</span>
                <span className="text-red-600">{stats.emergency} emergency</span>
                <span className="text-purple-600">{formatCurrency(stats.totalCost)} total cost</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchConsults}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              
              <button
                onClick={() => setShowBookConsultModal(true)}
                className="flex items-center px-3 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                Book Consult
              </button>
              
              <Link
                to="/health/veterinary-consults/add"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Consult
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
                  placeholder="Search consults by animal, type, veterinarian, diagnosis..."
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
                <option value="consultDate-desc">Date: Latest First</option>
                <option value="consultDate-asc">Date: Earliest First</option>
                <option value="animal-asc">Animal A-Z</option>
                <option value="consultType-asc">Type A-Z</option>
                <option value="priority-desc">Priority: High First</option>
                <option value="cost-desc">Cost: Highest First</option>
                <option value="rating-desc">Rating: Highest First</option>
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
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list'
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
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consult Type</label>
                    <select
                      value={filters.consultType}
                      onChange={(e) => setFilters(prev => ({ ...prev, consultType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All types</option>
                      <option value="Routine Checkup">Routine Checkup</option>
                      <option value="Emergency Consultation">Emergency</option>
                      <option value="Illness Consultation">Illness</option>
                      <option value="Pregnancy Consultation">Pregnancy</option>
                      <option value="Skin Condition">Skin Condition</option>
                      <option value="Vaccination Consultation">Vaccination</option>
                      <option value="Nutritional Consultation">Nutritional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All statuses</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Rescheduled">Rescheduled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Veterinarian</label>
                    <select
                      value={filters.veterinarian}
                      onChange={(e) => setFilters(prev => ({ ...prev, veterinarian: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All veterinarians</option>
                      <option value="Dr. Sarah Martinez">Dr. Sarah Martinez</option>
                      <option value="Dr. Juan Rodriguez">Dr. Juan Rodriguez</option>
                      <option value="Dr. Emergency Vet">Dr. Emergency Vet</option>
                      <option value="Dr. Nutrition Specialist">Dr. Nutrition Specialist</option>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                    <select
                      value={filters.outcome}
                      onChange={(e) => setFilters(prev => ({ ...prev, outcome: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All outcomes</option>
                      <option value="Complete recovery">Complete recovery</option>
                      <option value="Good response">Good response</option>
                      <option value="Treatment plan">Treatment plan</option>
                      <option value="Successful">Successful</option>
                      <option value="Pending">Pending</option>
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
        {filteredConsults.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || Object.values(filters).some(f => f && f !== 'all')
                ? 'No consults found'
                : 'No veterinary consults yet'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(filters).some(f => f && f !== 'all')
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first veterinary consult'
              }
            </p>
            {!searchTerm && !Object.values(filters).some(f => f && f !== 'all') && (
              <Link
                to="/health/veterinary-consults/add"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Consult
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedConsults.map((consult) => {
                  const IconComponent = getConsultTypeIcon(consult.consultType);
                  return (
                    <motion.div
                      key={consult.id}
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white rounded-xl shadow-sm border overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/health/veterinary-consults/${consult.id}`)}
                    >
                      {/* Header de la consulta */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg ${getConsultTypeColor(consult.consultType)}`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {consult.animal} (#{consult.tagNumber})
                              </h3>
                              <p className="text-sm text-gray-600">{consult.consultType}</p>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionMenu(showActionMenu === consult.id ? null : consult.id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {showActionMenu === consult.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-0 top-6 bg-white rounded-lg shadow-lg border z-10 min-w-40"
                              >
                                <Link
                                  to={`/health/veterinary-consults/${consult.id}`}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Link>
                                <Link
                                  to={`/health/veterinary-consults/edit/${consult.id}`}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                                <button className="flex items-center w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50">
                                  <FileText className="w-4 h-4 mr-2" />
                                  Generate Report
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteModal(consult.id);
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

                        {/* Información principal */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consult.status)}`}>
                              {consult.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(consult.priority)}`}>
                              {consult.priority}
                            </span>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">Chief Complaint</p>
                            <p className="text-sm text-gray-600 line-clamp-2">{consult.chiefComplaint}</p>
                          </div>

                          {consult.diagnosis && consult.diagnosis !== 'Pending examination' && (
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">Diagnosis</p>
                              <p className="text-sm text-gray-600 line-clamp-2">{consult.diagnosis}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Información de la consulta */}
                      <div className="px-6 pb-4">
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{new Date(consult.consultDate).toLocaleDateString()} at {consult.consultTime}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            <span className="truncate">{consult.veterinarian}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="truncate">{consult.location}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{formatDuration(consult.duration)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(consult.cost)}
                          </span>
                          {consult.images && consult.images.length > 0 && (
                            <span className="text-xs text-blue-600 flex items-center">
                              <Camera className="w-3 h-3 mr-1" />
                              {consult.images.length} image{consult.images.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {renderRating(consult.rating)}
                          {consult.followUpRequired && (
                            <span className="text-xs text-orange-600 flex items-center">
                              <Bell className="w-3 h-3 mr-1" />
                              Follow-up
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Outcome */}
                      <div className="px-6 pb-4">
                        <p className={`text-sm font-medium ${getOutcomeColor(consult.outcome)}`}>
                          Outcome: {consult.outcome}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Vista Lista */}
            {viewMode === 'list' && (
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
                          Animal & Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chief Complaint
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Veterinarian
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Outcome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cost
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedConsults.map((consult, index) => {
                        const IconComponent = getConsultTypeIcon(consult.consultType);
                        return (
                          <motion.tr
                            key={consult.id}
                            variants={tableRowVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`p-2 rounded-lg ${getConsultTypeColor(consult.consultType)} mr-3`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {consult.animal} (#{consult.tagNumber})
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {consult.consultType}
                                  </div>
                                </div>
                              </div>
                            </td>
                            
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs truncate">
                                {consult.chiefComplaint}
                              </div>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div>
                                {new Date(consult.consultDate).toLocaleDateString()}
                              </div>
                              <div className="text-xs">
                                {consult.consultTime} ({formatDuration(consult.duration)})
                              </div>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {consult.veterinarian}
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(consult.status)}`}>
                                {consult.status}
                              </span>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 max-w-xs truncate">
                                {consult.outcome}
                              </div>
                              {consult.rating && (
                                <div className="flex items-center mt-1">
                                  {renderRating(consult.rating)}
                                </div>
                              )}
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(consult.cost)}
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Link
                                  to={`/health/veterinary-consults/${consult.id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <Link
                                  to={`/health/veterinary-consults/edit/${consult.id}`}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => setShowDeleteModal(consult.id)}
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
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredConsults.length)} of{' '}
                  {filteredConsults.length} results
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
                <h3 className="text-lg font-semibold text-gray-900">Delete Veterinary Consult</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this veterinary consult? This will permanently remove all associated medical data and records.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingConsultId}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deletingConsultId}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
              >
                {deletingConsultId ? (
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

      {/* Modal para reservar consulta */}
      {showBookConsultModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Book Emergency Consult</h3>
                <p className="text-sm text-gray-600">Schedule an urgent veterinary consultation</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Lista de veterinarios disponibles */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Available Veterinarians</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Dr. Sarah Martinez</p>
                        <p className="text-sm text-gray-600">Large Animal Specialist</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Available</p>
                      <p className="text-xs text-gray-500">+52 993 123 4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Dr. Juan Rodriguez</p>
                        <p className="text-sm text-gray-600">Emergency Veterinarian</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-yellow-600">Busy until 3 PM</p>
                      <p className="text-xs text-gray-500">+52 993 456 7890</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Dr. Emergency Vet</p>
                        <p className="text-sm text-gray-600">24/7 Emergency Service</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Available Now</p>
                      <p className="text-xs text-gray-500">+52 993 987 6543</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Información de emergencia */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  <h4 className="font-medium text-red-800">Emergency Contact</h4>
                </div>
                <p className="text-sm text-red-700 mb-2">
                  For immediate assistance, call our 24/7 emergency hotline:
                </p>
                <p className="text-lg font-bold text-red-800">+52 993 EMERGENCY</p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBookConsultModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
              <Link
                to="/health/veterinary-consults/add"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                onClick={() => setShowBookConsultModal(false)}
              >
                Schedule Consult
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Click outside para cerrar menús */}
      {(showActionMenu || showBookConsultModal) && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => {
            setShowActionMenu(null);
            setShowBookConsultModal(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default VeterinaryConsults;