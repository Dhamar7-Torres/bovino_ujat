import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Share2,
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  CheckCircle,
  Zap,
  Heart,
  Scale,
  Syringe,
  Baby,
  Bell,
  User,
  FileText,
  Camera,
  Download,
  Plus,
  X,
  Check,
  MoreVertical,
  Activity,
  History,
  MessageSquare
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const EventDetail = () => {
  // Estados para manejar los datos y la UI
  const [eventData, setEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // Animaciones para los componentes
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, delay: 0.1 }
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

  // Cargar datos del evento al montar el componente
  useEffect(() => {
    fetchEventData();
  }, [id]);

  // Obtener datos del evento
  const fetchEventData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEventData(data);
      } else if (response.status === 404) {
        setError('Event not found');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load event data');
      }
    } catch (error) {
      console.error('Fetch event error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Datos de ejemplo mientras se carga la API real
  const mockEventData = {
    id: 1,
    title: 'Vaccination Round - Group A',
    type: 'vaccination',
    date: '2025-06-28',
    time: '09:00',
    endTime: '11:00',
    description: 'Annual vaccination for breeding stock including FMD, BVD, and IBR vaccines. All animals in Group A require updated vaccinations according to the veterinary schedule.',
    location: 'Main Farm - Barn A',
    veterinarian: 'Dr. Sarah Smith',
    status: 'scheduled',
    priority: 'high',
    reminder: 30,
    createdBy: 'Dr. Smith',
    createdAt: '2025-06-20T10:30:00Z',
    updatedAt: '2025-06-25T14:20:00Z',
    bovines: [
      { id: 1, tagNumber: 'Holstein-001', name: 'Bella', breed: 'Holstein', age: '3 years' },
      { id: 2, tagNumber: 'Holstein-002', name: 'Luna', breed: 'Holstein', age: '2 years' },
      { id: 3, tagNumber: 'Angus-001', name: 'Thunder', breed: 'Angus', age: '4 years' },
      { id: 4, tagNumber: 'Jersey-003', name: 'Daisy', breed: 'Jersey', age: '5 years' }
    ],
    vaccines: [
      { name: 'FMD (Foot and Mouth Disease)', batch: 'FMD-2025-A', expiry: '2025-12-31' },
      { name: 'BVD (Bovine Viral Diarrhea)', batch: 'BVD-2025-B', expiry: '2025-11-30' },
      { name: 'IBR (Infectious Bovine Rhinotracheitis)', batch: 'IBR-2025-C', expiry: '2026-01-15' }
    ],
    equipment: [
      'Syringes (10ml)',
      'Needles (18G)',
      'Vaccine storage cooler',
      'Restraint equipment',
      'Record sheets'
    ],
    notes: [
      {
        id: 1,
        text: 'Confirm vaccine temperatures before administration',
        author: 'Dr. Smith',
        timestamp: '2025-06-25T10:15:00Z',
        type: 'instruction'
      },
      {
        id: 2,
        text: 'Holstein-001 showed mild reaction to previous vaccination - monitor closely',
        author: 'Farm Manager',
        timestamp: '2025-06-24T16:30:00Z',
        type: 'warning'
      }
    ],
    completionRequirements: [
      'Verify all vaccines are within expiry date',
      'Check animal health before vaccination',
      'Record vaccination details for each animal',
      'Monitor for adverse reactions',
      'Update health records'
    ],
    estimatedDuration: '2 hours',
    cost: 245.50,
    recurring: {
      enabled: true,
      frequency: 'annual',
      nextOccurrence: '2026-06-28'
    }
  };

  // Usar datos mock si no hay datos reales disponibles
  const data = eventData || mockEventData;

  // Obtener icono del tipo de evento
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'vaccination': return Syringe;
      case 'health': return Heart;
      case 'monitoring': return Scale;
      case 'breeding': return Baby;
      case 'feeding': return Zap;
      case 'treatment': return AlertCircle;
      default: return Calendar;
    }
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  // Obtener color de prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Eliminar evento
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        navigate('/events', { 
          state: { 
            message: 'Event deleted successfully!' 
          }
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Delete event error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Agregar nota
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    setIsAddingNote(true);
    
    try {
      const response = await fetch(`/api/events/${id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          text: newNote,
          type: 'note'
        })
      });

      if (response.ok) {
        const newNoteData = await response.json();
        setEventData(prev => ({
          ...prev,
          notes: [...prev.notes, newNoteData]
        }));
        setNewNote('');
        setShowNotesModal(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add note');
      }
    } catch (error) {
      console.error('Add note error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsAddingNote(false);
    }
  };

  // Compartir evento
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: `Event: ${data.title} on ${new Date(data.date).toLocaleDateString()}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Aquí podrías mostrar un toast de confirmación
    }
  };

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </motion.div>
      </div>
    );
  }

  // Mostrar error
  if (error && !eventData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md mx-4"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Event</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={fetchEventData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/events"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Events
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const IconComponent = getEventTypeIcon(data.type);

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
              <Link
                to="/events"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Events
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <IconComponent className="w-6 h-6 text-green-600" />
                <h1 className="text-xl font-semibold text-gray-900">{data.title}</h1>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMoreMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50"
                >
                  <div className="py-1">
                    <Link
                      to={`/events/edit/${data.id}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowMoreMenu(false)}
                    >
                      <Edit className="w-4 h-4 mr-3" />
                      Edit Event
                    </Link>
                    <button
                      onClick={() => {
                        handleShare();
                        setShowMoreMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Share2 className="w-4 h-4 mr-3" />
                      Share
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setShowMoreMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-3" />
                      Delete Event
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información principal */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Header del evento */}
              <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-8 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <IconComponent className="w-8 h-8" />
                      <span className="text-sm opacity-90 uppercase tracking-wide">
                        {data.type.replace('-', ' ')}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
                    <p className="text-green-100 text-lg">{data.description}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(data.status)}`}>
                      {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detalles del evento */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants} className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">
                          {new Date(data.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">
                          {data.time}
                          {data.endTime && ` - ${data.endTime}`}
                          {data.estimatedDuration && (
                            <span className="text-gray-500 ml-2">({data.estimatedDuration})</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{data.location}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-4">
                    {data.veterinarian && (
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Veterinarian</p>
                          <p className="font-medium">{data.veterinarian}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Priority</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(data.priority)}`}>
                          {data.priority.charAt(0).toUpperCase() + data.priority.slice(1)}
                        </span>
                      </div>
                    </div>

                    {data.cost && (
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 text-gray-400 text-center">$</div>
                        <div>
                          <p className="text-sm text-gray-500">Estimated Cost</p>
                          <p className="font-medium">${data.cost}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Bovinos involucrados */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  Livestock Involved ({data.bovines.length})
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.bovines.map((bovine, index) => (
                  <motion.div
                    key={bovine.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{bovine.name}</h4>
                        <p className="text-sm text-gray-600">#{bovine.tagNumber}</p>
                        <p className="text-xs text-gray-500">{bovine.breed} • {bovine.age}</p>
                      </div>
                      <Link
                        to={`/bovines/${bovine.id}`}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Vacunas (si es evento de vacunación) */}
            {data.type === 'vaccination' && data.vaccines && (
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Syringe className="w-5 h-5 mr-2 text-purple-600" />
                  Vaccines & Medications
                </h3>
                
                <div className="space-y-4">
                  {data.vaccines.map((vaccine, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-purple-50 border border-purple-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{vaccine.name}</h4>
                          <p className="text-sm text-gray-600">Batch: {vaccine.batch}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Expiry</p>
                          <p className="text-sm font-medium">{new Date(vaccine.expiry).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Equipamiento requerido */}
            {data.equipment && (
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Required Equipment
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {data.equipment.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-2 p-2"
                    >
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Notas y comentarios */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-gray-600" />
                  Notes & Comments
                </h3>
                <button
                  onClick={() => setShowNotesModal(true)}
                  className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Note
                </button>
              </div>
              
              <div className="space-y-4">
                {data.notes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-l-4 ${
                      note.type === 'warning' 
                        ? 'bg-yellow-50 border-yellow-400' 
                        : 'bg-blue-50 border-blue-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-800">{note.text}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <User className="w-3 h-3 mr-1" />
                          <span>{note.author}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(note.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {data.notes.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No notes added yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  to={`/events/edit/${data.id}`}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Event
                </Link>
                
                {data.status === 'scheduled' && (
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </button>
                )}
                
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  <Download className="w-4 h-4 mr-2" />
                  Export Details
                </button>
                
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center justify-center px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Event
                </button>
              </div>
            </motion.div>

            {/* Completion Requirements */}
            {data.completionRequirements && (
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Completion Checklist
                </h3>
                
                <div className="space-y-3">
                  {data.completionRequirements.map((requirement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-5 h-5 border-2 border-gray-300 rounded mt-0.5"></div>
                      <span className="text-gray-700 text-sm">{requirement}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Event History */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <History className="w-5 h-5 mr-2 text-gray-600" />
                Event History
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Created by {data.createdBy}</span>
                </div>
                <div className="text-xs text-gray-500 ml-5">
                  {new Date(data.createdAt).toLocaleString()}
                </div>
                
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Last updated</span>
                </div>
                <div className="text-xs text-gray-500 ml-5">
                  {new Date(data.updatedAt).toLocaleString()}
                </div>
              </div>
            </motion.div>

            {/* Recurring Info */}
            {data.recurring?.enabled && (
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-600" />
                  Recurring Event
                </h3>
                
                <div className="text-sm text-gray-600">
                  <p className="mb-2">
                    <strong>Frequency:</strong> {data.recurring.frequency}
                  </p>
                  <p>
                    <strong>Next occurrence:</strong> {new Date(data.recurring.nextOccurrence).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal para agregar nota */}
      {showNotesModal && (
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Note</h3>
              <button
                onClick={() => setShowNotesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note here..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
            
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowNotesModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={isAddingNote || !newNote.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center"
              >
                {isAddingNote ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  'Add Note'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

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
                <h3 className="text-lg font-semibold text-gray-900">Delete Event</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{data.title}"? This will permanently remove the event and all associated data.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
              >
                {isDeleting ? (
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

      {/* Click outside para cerrar menú */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMoreMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default EventDetail;